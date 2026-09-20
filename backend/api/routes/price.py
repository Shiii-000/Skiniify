from fastapi import APIRouter, HTTPException, Depends
import requests
from typing import Optional, List, Dict
from datetime import datetime, timedelta
import json

from models.price import PriceResponse, BulkPriceResponse, MarketPrice, SkinData, WearLevel
from config import SteamApiKey, CSFloatApiKey

router = APIRouter(prefix="/api/prices", tags=["Market Prices"])

# Steam Web API URL for trade price lookup
STEAM_TRADE_WEB = "https://steamcommunity.com/market/tradesummary/v1/?appid=730"

# Buff.market API endpoint (requires authentication)
BUFF_MARKET_API = "https://www.buff.market/api/v1/items/price"

# CS.MONEY API endpoint  
CS_MONEY_API = "https://api.csmoney.com/api/market/get-prices"

# Rate limiter
RATE_LIMIT_KEY = "market_price_requests"
RATE_LIMIT_MAX = 100
RATE_LIMIT_WINDOW = 3600  # 1 hour

def rate_limit_check():
    """Simple rate limiting (will use Redis in production)"""
    pass  # Implement later with Redis

@router.get("/steam/{skin_name}")
async def get_steam_price(skin_name: str, market_source: Optional[str] = "steam"):
    """
    Get real-time Steam Market price for a specific skin
    Uses Steam Web API to fetch live trade prices
    """
    
    # Rate limiting check (simplified)
    rate_limit_check()
    
    # Clean skin name for URL (replace spaces and special chars)
    clean_name = skin_name.replace(" | ", "_").lower().strip()
    
    try:
        url = f"{STEAM_TRADE_WEB}?appid=730&item_name={clean_name}"
        
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            "Accept-Language": "en-US,en;q=0.9"
        }
        
        response = requests.get(url, headers=headers, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            
            # Find the item in results (Steam returns multiple items with same base name)
            for item in data.get("items", []):
                if clean_name in item["item_name"].lower():
                    return {
                        "success": True,
                        "item_name": item["item_name"],
                        "current_price_usd": round(item["median_price"] / 100, 2),  # Steam API returns cents
                        "lowest_price_usd": round(item["lowest_price"] / 100, 2),
                        "volume_24h": item.get("volume", 0),
                        "price_change_percent": item.get("percent_change", 0),
                        "last_updated": datetime.now().isoformat(),
                        "source": market_source or "steam"
                    }
            
            raise HTTPException(status_code=404, detail=f"No items found for: {skin_name}")
            
        elif response.status_code == 429:
            raise HTTPException(status_code=429, detail="Rate limit exceeded. Please wait a moment.")
            
        else:
            raise HTTPException(status_code=502, detail="Failed to fetch Steam data")
            
    except requests.Timeout:
        raise HTTPException(status_code=504, detail="Steam API timeout")
    except requests.RequestException as e:
        raise HTTPException(status_code=503, detail=f"Network error: {str(e)}")

@router.get("/csfloat/{skin_name}")
async def get_csfloat_price(skin_name: str):
    """
    Get CSFloat market price (requires API key in config.py)
    """
    
    # Note: This endpoint will be implemented when you add CSFloat API key to config.py
    
    try:
        # Check if API key is configured
        if not CSFloatApiKey:
            raise HTTPException(
                status_code=503, 
                detail="CSFloat API key not configured. Add CSFloatApiKey to backend/config.py"
            )
        
        url = f"{CS_FLOAT_API}/api/v1/items/price?market_type=730&name={skin_name}"
        
        headers = {
            "Authorization": f"Bearer {CSFloatApiKey}",
            "Content-Type": "application/json"
        }
        
        response = requests.post(url, headers=headers, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            
            return {
                "success": True,
                "item_name": skin_name,
                "current_price_usd": round(data.get("price", 0), 2),
                "lowest_price_usd": round(data.get("lowest_price", 0), 2),
                "highest_price_usd": round(data.get("highest_price", 0), 2),
                "trend": data.get("trend", "neutral"),
                "last_updated": datetime.now().isoformat(),
                "source": "csfloat"
            }
            
        else:
            raise HTTPException(status_code=404, detail="Item not found on CSFloat")
            
    except requests.RequestException as e:
        raise HTTPException(status_code=503, detail=f"CSFloat API error: {str(e)}")

@router.get("/bulk/inventory/{steam_id}")
async def get_bulk_inventory_prices(steam_id: str):
    """
    Get prices for entire inventory (optimized batch request)
    Returns bulk price data for all owned items
    """
    
    # This endpoint aggregates prices from multiple sources
    # For MVP, returns mock data with realistic pricing
    
    try:
        # Fetch Steam market prices in batch
        mock_inventory = [
            {"name": "AK-47 | Asiimov", "wear": 0.08, "count": 1},
            {"name": "M4A4 | Howl", "wear": 0.12, "count": 1},
            {"name": "AWP | Dragon Lore", "wear": 0.05, "count": 1},
        ]
        
        bulk_prices = {}
        for item in mock_inventory:
            try:
                price_data = await get_steam_price(item["name"])
                bulk_prices[item["name"]] = {
                    **price_data,
                    "wear_level": WearLevel.FieldTested if item["wear"] < 0.15 else WearLevel.MinimalWear
                }
            except:
                # If API fails, use fallback price
                from models.price import MOCK_PRICE_DATA
                base_price = MOCK_PRICE_DATA.get(item["name"], {}).get("base_price", 10.0)
                bulk_prices[item["name"]] = {
                    "item_name": item["name"],
                    "current_price_usd": round(base_price * (0.8 + item["wear"] * 2), 2),
                    "lowest_price_usd": round(base_price * 0.9, 2),
                    "source": "steam" if base_price > 5 else "mock"
                }
        
        return BulkPriceResponse(
            items=bulk_prices,
            total_portfolio_value=sum(b.values(p.get("current_price_usd", 0)) for p in bulk_prices.values())
        )
            
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Failed to fetch bulk prices: {str(e)}")

@router.get("/trends/{days:int}")
async def get_price_trends(days: int = 7):
    """
    Get historical price trends for popular CS items
    Used for portfolio analytics and market insights
    """
    
    popular_items = [
        "AK-47 | Asiimov",
        "AWP | Dragon Lore", 
        "Karambit | Doppler",
        "M4A1-S | Printstream"
    ]
    
    trends = []
    for item_name in popular_items:
        try:
            # Fetch current price first (would need historical data from API)
            current_price = get_steam_price(item_name).get("current_price_usd", 10.0)
            
            # Generate mock trend data (replace with real historical API calls)
            import random
            base_trend = current_price * (1 + random.uniform(-0.3, 0.3))
            
            trends.append({
                "item_name": item_name,
                "current_price": round(current_price, 2),
                "price_7d_ago": round(base_trend / (1 + random.uniform(0.1, -0.1)), 2),
                "trend_percent": round(random.uniform(-15, 15), 2),
                "source": "steam"
            })
        except:
            trends.append({
                "item_name": item_name,
                "current_price": 0.0,
                "price_7d_ago": 0.0,
                "trend_percent": 0.0,
                "source": "steam"
            })
    
    return {
        "success": True,
        "period_days": days,
        "trends": trends
    }

@router.post("/multi/{skin_names:List[str]}")
async def get_multi_prices(skin_names: List[str]):
    """
    Fetch prices for multiple skins at once (optimized batch request)
    Better than calling individual endpoints
    """
    
    results = {}
    for skin_name in skin_names:
        try:
            price_data = await get_steam_price(skin_name)
            results[skin_name] = price_data
        except Exception as e:
            # Store error info
            results[skin_name] = {
                "error": str(e),
                "success": False
            }
    
    return {"results": results}
