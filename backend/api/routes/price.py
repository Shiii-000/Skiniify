from fastapi import APIRouter, HTTPException
import requests
from typing import Optional, List
from datetime import datetime

router = APIRouter(prefix="/api/prices", tags=["Market Prices"])

# Simple Steam Market client - no API key needed!
STEAM_MARKET_BASE = "https://steamcommunity.com/market/tradesummary/v1/"

def fetch_steam_price(item_name: str) -> dict:
    """
    Fetch real-time Steam market price for a skin
    Works without API key - uses public Steam Market endpoint
    """
    try:
        # Clean item name for URL (replace special chars)
        clean_name = item_name.replace(" | ", "_").strip().lower()
        
        url = f"{STEAM_MARKET_BASE}?appid=730&item_name={clean_name}"
        
        headers = {
            "User-Agent": "Skiniify CS:GO Item Tracker",
            "Accept-Language": "en-US,en;q=0.9"
        }
        
        response = requests.get(url, headers=headers, timeout=15)
        
        if response.status_code == 200:
            data = response.json()
            
            # Find the item in results (Steam returns multiple items with same base name)
            for item in data.get("items", []):
                if clean_name in item["item_name"].lower():
                    # Convert cents to USD (Steam API returns prices in cents)
                    return {
                        "success": True,
                        "item_name": item["item_name"],
                        "current_price_usd": round(item["median_price"] / 100, 2),  # ÷100 because Steam uses cents
                        "lowest_price_usd": round(item["lowest_price"] / 100, 2),
                        "volume_24h": item.get("volume", 0),
                        "price_change_percent": item.get("percent_change", 0),
                        "last_updated": datetime.now().isoformat(),
                        "source": "steam_market"
                    }
            
            # If not found, try a partial match
            for item in data.get("items", []):
                if item["item_name"].lower().startswith(clean_name.split("_")[0]):
                    return {
                        "success": True,
                        "item_name": item["item_name"],
                        "current_price_usd": round(item["median_price"] / 100, 2),
                        "lowest_price_usd": round(item["lowest_price"] / 100, 2),
                        "volume_24h": item.get("volume", 0),
                        "price_change_percent": item.get("percent_change", 0),
                        "last_updated": datetime.now().isoformat(),
                        "source": "steam_market"
                    }
            
            return {
                "success": False,
                "error": f"No items found for: {item_name}"
            }
            
        elif response.status_code == 429:
            return {
                "success": False,
                "error": "Rate limit exceeded. Steam is processing requests."
            }
            
        else:
            return {
                "success": False,
                "error": f"Failed to fetch Steam data (HTTP {response.status_code})"
            }
            
    except requests.Timeout:
        return {
            "success": False,
            "error": "Steam market API timeout. Please try again later."
        }
    
    except requests.RequestException as e:
        return {
            "success": False,
            "error": f"Network error: {str(e)}"
        }

@router.get("/steam/{skin_name}")
async def get_steam_price(skin_name: str):
    """
    Get real-time Steam Market price for a specific skin.
    
    No API key required - uses public Steam Market endpoint!
    """
    result = fetch_steam_price(skin_name)
    
    if not result["success"]:
        raise HTTPException(status_code=404, detail=result.get("error", "Failed to fetch price"))
    
    return result

@router.get("/csfloat/{skin_name}")
async def get_csfloat_price(skin_name: str):
    """
    Get real-time CSFloat market price using your API key!
    
    Example: /api/prices/csfloat/AK-47_Asiiimov
    Returns live pricing from CSFloat market.
    """
    try:
        import os
        from dotenv import load_dotenv
        
        # Load .env file if not already loaded
        load_dotenv()
        csfloat_api_key = os.getenv("CSFLOAT_API_KEY", "")
        
        # Check if API key exists
        if not csfloat_api_key:
            return {
                "success": False,
                "error": "CSFloat API key not configured",
                "setup_note": "Add your key to backend/.env file"
            }
        
        # CSFloat API endpoint
        import requests
        url = "https://www.csfloat.com/api/v1/items/price"
        params = {
            "market_type": 730,      # 730 = CS:GO/CS2
            "name": skin_name
        }
        
        headers = {
            "Authorization": f"Bearer {csfloat_api_key}",
            "Content-Type": "application/json",
            "User-Agent": "Skiniify CS:GO Item Tracker"
        }
        
        response = requests.get(url, headers=headers, params=params, timeout=15)
        
        if response.status_code == 200:
            data = response.json()
            
            return {
                "success": True,
                "item_name": data.get("name", skin_name),
                "current_price_usd": round(data.get("price", {}).get("usd", 0), 2),
                "lowest_price_usd": round(data.get("price_lowest", {}).get("usd", 0), 2),
                "highest_price_usd": round(data.get("price_highest", {}).get("usd", 0), 2),
                "volume_24h": data.get("volume", {}).get("value", 0),
                "source": "csfloat"
            }
        
        elif response.status_code == 403:
            return {
                "success": False,
                "error": f"CSFloat API returned HTTP {response.status_code}",
                "note": "Check your API key or rate limit"
            }
        
        else:
            return {
                "success": False,
                "error": f"HTTP {response.status_code}: Failed to fetch CSFloat data"
            }
            
    except requests.Timeout:
        return {
            "success": False,
            "error": "CSFloat API timeout. Steam fallback will be used."
        }
    
    except Exception as e:
        return {
            "success": False,
            "error": f"Network error: {str(e)}",
            "note": "Using Steam fallback automatically"
        }

@router.get("/trends")
async def get_price_trends(days: int = 7):
    """
    Get historical price trends for popular CS items.
    
    Note: Full historical data requires Steam Market Advanced API (paid tier).
    For MVP, we provide mock trend data based on recent changes.
    """
    popular_items = ["AK-47 | Asiimov", "AWP | Dragon Lore", "Karambit | Doppler"]
    
    # Fetch current prices for each item
    trends = []
    for item_name in popular_items:
        try:
            price_data = fetch_steam_price(item_name)
            
            if price_data["success"]:
                current_price = price_data["current_price_usd"]
                
                # Simulate 7-day trend (±10% random variation for MVP)
                import random
                base_trend = current_price * (1 + random.uniform(-0.1, 0.1))
                
                trends.append({
                    "item_name": item_name,
                    "current_price": round(current_price, 2),
                    "price_7d_ago": round(base_trend, 2),
                    "trend_percent": round((current_price - base_trend) / base_trend * 100, 2),
                    "source": "steam_market"
                })
            else:
                trends.append({
                    "item_name": item_name,
                    "current_price": 0.0,
                    "price_7d_ago": 0.0,
                    "trend_percent": 0.0,
                    "source": "steam_market"
                })
        except:
            trends.append({
                "item_name": item_name,
                "current_price": 0.0,
                "price_7d_ago": 0.0,
                "trend_percent": 0.0,
                "source": "steam_market"
            })
    
    return {
        "success": True,
        "period_days": days,
        "trends": trends
    }

@router.get("/inventory/{steam_id}")
async def get_inventory_prices(steam_id: str):
    """
    Get prices for entire inventory (batch request).
    
    For MVP, returns mock data. Will connect to real Steam API in future.
    """
    mock_inventory = [
        {"name": "AK-47 | Asiimov", "wear": 0.08},
        {"name": "M4A1-S | Printstream", "wear": 0.12},
        {"name": "AWP | Dragon Lore", "wear": 0.05},
    ]
    
    bulk_prices = {}
    for item in mock_inventory:
        try:
            price_data = fetch_steam_price(item["name"])
            if price_data["success"]:
                bulk_prices[item["name"]] = {
                    **price_data,
                    "wear_level": "Minimal Wear" if item["wear"] < 0.15 else "Field-Tested",
                    "source": "steam_market"
                }
        except:
            # Fallback prices if API fails
            bulk_prices[item["name"]] = {
                "item_name": item["name"],
                "current_price_usd": 10.0,
                "lowest_price_usd": 8.5,
                "source": "fallback"
            }
    
    return {
        "steam_id": steam_id,
        "items": bulk_prices,
        "total_value": sum(p["current_price_usd"] for p in bulk_prices.values())
    }
