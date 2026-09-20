from fastapi import APIRouter, HTTPException
from typing import List
import random

router = APIRouter()

# Mock price data (replace with actual Steam/Buff/CS.MONEY API calls)
MOCK_PRICES = {
    "AK-47 | Asiimov": 9.5,
    "AWP | Dragon Lore": 8500.0,
    "M4A1-S | Printstream": 15.75,
    "Karambit | Doppler": 1200.0,
    "Glock-18 | Fade": 450.0
}

@router.get("/prices/{weapon_skin}", summary="Get Market Price")
async def get_price_history(weapon_skin: str):
    """
    Get current market price and 7-day history for a weapon/skin
    
    Args:
        weapon_skin: e.g., "AK-47 | Asiimov" or "AWP | Dragon Lore"
    
    Returns:
        Current price, 7-day trend, and 24h change percentage
    """
    # Normalize input (handle different formats)
    normalized_name = weapon_skin.replace("|", "").strip().lower()
    
    # Find matching item in mock data
    current_price = None
    for name, price in MOCK_PRICES.items():
        if name.lower() == normalized_name or name.lower() in normalized_name:
            current_price = price
            break
    
    if current_price is None:
        return {
            "success": False,
            "error": f"Price not found for: {weapon_skin}",
            "suggestion": "Try 'AK-47 | Asiimov' or check spelling"
        }
    
    # Generate mock price history (random walk pattern)
    base_price = current_price * 0.8
    price_history = []
    current = base_price
    for i in range(7):
        change = random.uniform(-0.5, 0.5)
        current += change
        price_history.append(round(current, 2))
    
    # Calculate 24h trend
    last_24h_change = ((current_price - base_price) / base_price) * 100
    
    return {
        "success": True,
        "weapon_skin": weapon_skin,
        "current_price_usd": round(current_price, 2),
        "price_history_7d": price_history,
        "trend_24h_percent": round(last_24h_change, 2),
        "last_updated": "2024-01-15T10:30:00Z"
    }

@router.get("/trending", summary="Get Trending Items")
async def get_trending_items():
    """Get currently trending (gaining value) items"""
    
    trending = [
        {"item": "AK-47 | Asiimov", "change_percent": 12.5, "trend": "up"},
        {"item": "AWP | Atheris", "change_percent": 8.3, "trend": "up"},
        {"item": "M4A4 | Howl", "change_percent": -5.2, "trend": "down"}
    ]
    
    return {
        "success": True,
        "trending_items": trending
    }