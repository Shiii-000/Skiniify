"""
Complete Market Price API with CSFloat & Steam support
Handles all pricing, comparison, and market data needs
"""
from fastapi import APIRouter, HTTPException, Depends, Query
import requests
import json
import time
from datetime import datetime, timedelta
from typing import Optional, List, Dict, Any
from models.skins_db import get_skin_by_name, SKIN_DATABASE, get_skin_image_url
import os

router = APIRouter(prefix="/api", tags=["Market Prices"])

# Configuration - Load from .env or use defaults
CSFLOAT_API_KEY = os.getenv("CSFLOAT_API_KEY", "")
CSFLOAT_BASE_URL = "https://www.csfloat.com/api/v1"
STEAM_MARKET_BASE = "https://steamcommunity.com/market/tradesummary/v1/"

# Price caching (in-memory for simplicity - use Redis in production)
price_cache: Dict[str, tuple] = {}  # key -> (data, timestamp)
CACHE_TTL_SECONDS = 60  # 60 seconds cache for prices

def get_cached_price(key: str, default_fn):
    """Get from cache or fetch fresh"""
    now = time.time()
    cached_data, cached_time = price_cache.get(key, (None, 0))
    
    if cached_data and (now - cached_time) < CACHE_TTL_SECONDS:
        return cached_data
    
    # Fetch fresh data
    try:
        result = default_fn()
        if result and 'error' not in result:
            price_cache[key] = (result, now)
            return result
        else:
            return None
    except Exception as e:
        print(f"Error fetching price for {key}: {e}")
        return None

def fetch_csfloat_price(skin_name: str) -> Dict[str, Any]:
    """Fetch price from CSFloat API"""
    if not CSFLOAT_API_KEY:
        return {"error": "API key not configured", "source": "CSFloat"}
    
    clean_name = skin_name.replace(" | ", "_").lower()
    url = f"{CSFLOAT_BASE_URL}/items/price"
    params = {
        "market_type": 730,  # CS:GO/CS2 appid
        "name": clean_name
    }
    
    headers = {
        "Authorization": f"Bearer {CSFLOAT_API_KEY}",
        "Content-Type": "application/json",
        "User-Agent": "Skiniify CS2 Inventory Tracker"
    }
    
    try:
        response = requests.get(url, headers=headers, params=params, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            return {
                "source": "CSFloat",
                **data,
                "last_updated": datetime.now().isoformat()
            }
        elif response.status_code == 403:
            return {"error": "API key invalid or rate-limited", "source": "CSFloat"}
        else:
            return {"error": f"HTTP {response.status_code}", "source": "CSFloat"}
            
    except requests.Timeout:
        return {"error": "Timeout", "source": "CSFloat"}
    except Exception as e:
        return {"error": str(e), "source": "CSFloat"}

def fetch_steam_price(skin_name: str) -> Dict[str, Any]:
    """Fetch price from Steam Market"""
    clean_name = skin_name.replace(" | ", "_").lower()
    url = f"{STEAM_MARKET_BASE}?appid=730&item_name={clean_name}"
    
    headers = {
        "User-Agent": "Skiniify CS2 Inventory Tracker",
        "Accept-Language": "en-US,en;q=0.9"
    }
    
    try:
        response = requests.get(url, headers=headers, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            
            # Find matching item in results
            for item in data.get("items", []):
                if clean_name in item["item_name"].lower():
                    return {
                        "source": "Steam Market",
                        "item_name": item["item_name"],
                        "current_price_usd": item.get("price", {}).get("usd", 0),
                        "lowest_price_usd": item.get("price", {}).get("lowest", {}).get("usd", 0),
                        "last_updated": datetime.now().isoformat()
                    }
            
            return {"error": "Item not found in Steam Market", "source": "Steam"}
        
        elif response.status_code == 403:
            return {"error": "Rate limited or invalid credentials", "source": "Steam"}
        
        else:
            return {"error": f"HTTP {response.status_code}", "source": "Steam"}
            
    except requests.Timeout:
        return {"error": "Timeout", "source": "Steam"}
    except Exception as e:
        return {"error": str(e), "source": "Steam"}

@router.get("/prices/{skin_name}")
async def get_dual_source_prices(skin_name: str):
    """Get both CSFloat and Steam prices for a skin"""
    
    # Fetch from both sources
    csfloat_data = fetch_csfloat_price(skin_name)
    steam_data = fetch_steam_price(skin_name)
    
    result = {
        "skin": skin_name,
        "comparison": {
            "csfloat_price_usd": None,
            "steam_price_usd": None,
            "difference_absolute": 0,
            "difference_percent": 0
        }
    }
    
    csfloat_price = 0
    steam_price = 0
    
    # Parse CSFloat response
    if 'error' not in csfloat_data and 'source' in csfloat_data:
        price_obj = csfloat_data.get("price", {}) or {}
        csfloat_price = price_obj.get("usd", 0) if isinstance(price_obj, dict) else float(csfloat_data.get("usd", 0))
        
        result["csfloat"] = {
            "price_usd": round(csfloat_price, 2),
            "lowest_price_usd": price_obj.get("lowest", {}).get("usd", 0) if isinstance(price_obj, dict) else float(csfloat_data.get("lowest", {}).get("usd", 0)),
            "volume_24h": csfloat_data.get("volume", {}).get("value", 0) if isinstance(csfloat_data.get("volume"), dict) else 0,
            "last_updated": datetime.now().isoformat()
        }
    
    # Parse Steam response
    if 'error' not in steam_data and 'source' in steam_data:
        steam_price = steam_data.get("current_price_usd", 0)
        
        result["steam"] = {
            "price_usd": round(steam_price, 2),
            "lowest_price_usd": steam_data.get("lowest_price_usd", 0),
            "last_updated": datetime.now().isoformat()
        }
    
    # Calculate comparison metrics
    if csfloat_price > 0 and steam_price > 0:
        result["comparison"]["difference_absolute"] = round(abs(csfloat_price - steam_price), 2)
        result["comparison"]["difference_percent"] = round((csfloat_price - steam_price) / csfloat_price * 100, 2)
    
    return result

@router.get("/prices/{skin_name}/steam")
async def get_steam_price_only(skin_name: str):
    """Get only Steam price (fallback when CSFloat is down)"""
    steam_data = fetch_steam_price(skin_name)
    
    if 'error' not in steam_data and 'source' in steam_data:
        return {
            "success": True,
            "skin": skin_name,
            "price_usd": round(steam_data.get("current_price_usd", 0), 2)
        }
    
    return {
        "success": False,
        "error": steam_data.get("error", "Unknown error"),
        "source": steam_data.get("source")
    }

@router.get("/prices/{skin_name}/csfloat")
async def get_csfloat_price_only(skin_name: str):
    """Get only CSFloat price (primary source)"""
    csfloat_data = fetch_csfloat_price(skin_name)
    
    if 'error' not in csfloat_data and 'source' in csfloat_data:
        return {
            "success": True,
            "skin": skin_name,
            "price_usd": round(csfloat_data.get("usd", 0), 2)
        }
    
    return {
        "success": False,
        "error": csfloat_data.get("error", "Unknown error"),
        "source": csfloat_data.get("source")
    }

@router.get("/prices/{skin_name}/history")
async def get_price_history(skin_name: str, days: int = 7):
    """Get price history for a skin (placeholder - would require premium API)"""
    
    return {
        "skin_name": skin_name,
        "period_days": days,
        "note": "Full historical data requires premium API access. Use /api/prices endpoint for current prices.",
        "current_prices_endpoint": f"/api/prices/{skin_name}"
    }

@router.get("/prices/stats/market-trends")
async def get_market_trends():
    """Get market trend statistics (placeholder)"""
    
    return {
        "trending_up": [],
        "trending_down": [],
        "timestamp": datetime.now().isoformat(),
        "note": "Market trends data will be populated with real API calls"
    }

@router.get("/prices/{skin_name}/comparison")
async def get_price_comparison(skin_name: str):
    """Get detailed price comparison between sources"""
    
    csfloat_data = fetch_csfloat_price(skin_name)
    steam_data = fetch_steam_price(skin_name)
    
    result = {
        "skin": skin_name,
        "csfloat": None,
        "steam": None,
        "difference": {
            "absolute_usd": 0,
            "percent": 0
        }
    }
    
    # Parse CSFloat
    if 'error' not in csfloat_data and 'source' in csfloat_data:
        price_obj = csfloat_data.get("price", {}) or {}
        price_value = price_obj.get("usd", 0) if isinstance(price_obj, dict) else float(csfloat_data.get("usd", 0))
        
        result["csfloat"] = {
            "price_usd": round(price_value, 2),
            "lowest_price_usd": price_obj.get("lowest", {}).get("usd", 0) if isinstance(price_obj, dict) else float(csfloat_data.get("lowest", {}).get("usd", 0)),
            "volume_24h": csfloat_data.get("volume", {}).get("value", 0) if isinstance(csfloat_data.get("volume"), dict) else 0
        }
    
    # Parse Steam
    if 'error' not in steam_data and 'source' in steam_data:
        result["steam"] = {
            "price_usd": round(steam_data.get("current_price_usd", 0), 2),
            "lowest_price_usd": steam_data.get("lowest_price_usd", 0)
        }
    
    # Calculate difference if both sources available
    csfloat_value = result["csfloat"]["price_usd"] if result["csfloat"] else 0
    steam_value = result["steam"]["price_usd"] if result["steam"] else 0
    
    if csfloat_value > 0 and steam_value > 0:
        result["difference"]["absolute_usd"] = round(abs(csfloat_value - steam_value), 2)
        result["difference"]["percent"] = round((csfloat_value - steam_value) / csfloat_value * 100, 2)
    
    return result

@router.get("/prices/sync/{skin_name}")
async def sync_skin_prices(skin_name: str):
    """Force refresh prices for a skin (bypass cache)"""
    
    # Clear cache for this skin
    cache_key = f"/api/prices/{skin_name}"
    if cache_key in price_cache:
        del price_cache[cache_key]
    
    # Fetch fresh prices
    return await get_dual_source_prices(skin_name)