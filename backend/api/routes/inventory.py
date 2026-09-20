from fastapi import APIRouter, HTTPException
import math

router = APIRouter()

def mock_inventory_data(steam_id: str) -> dict:
    """Mock inventory data for demonstration"""
    
    # Sample inventory items
    sample_items = [
        {"name": "AK-47 | Asiimov", "wear": 0.08, "value_usd": 9.5},
        {"name": "M4A1-S | Printstream", "wear": 0.12, "value_usd": 15.75},
        {"name": "AWP | Dragon Lore", "wear": 0.05, "value_usd": 8500.0},
        {"name": "Karambit | Doppler", "wear": 0.03, "value_usd": 1200.0},
        {"name": "Glock-18 | Fade", "wear": 0.07, "value_usd": 450.0}
    ]
    
    return {
        "steam_id": steam_id,
        "total_items": len(sample_items),
        "total_value_usd": round(sum(item['value_usd'] for item in sample_items), 2),
        "items": sample_items,
        "lowest_value_item": min(sample_items, key=lambda x: x['value_usd'])
    }

@router.post("/track", summary="Track Inventory Value")
async def track_inventory(steam_id: str):
    """
    Fetch and track user's inventory
    
    Args:
        steam_id: User's Steam ID (64-bit format)
    
    Returns:
        Inventory summary with total value and lowest items
    """
    if not steam_id or len(steam_id) < 17:
        raise HTTPException(status_code=400, detail="Invalid Steam ID format")
    
    inventory = mock_inventory_data(steam_id)
    
    return {
        "success": True,
        "data": inventory
    }

@router.get("/items/{weapon}", summary="Get Specific Item Details")
async def get_item_details(weapon: str):
    """Get details for a specific weapon"""
    sample_items = [
        {"name": "AK-47 | Asiimov", "wear": 0.08, "value_usd": 9.5},
        {"name": "M4A1-S | Printstream", "wear": 0.12, "value_usd": 15.75},
    ]
    
    # Find matching item
    for item in sample_items:
        if weapon.lower() in item['name'].lower():
            return {
                "success": True,
                "item": item
            }
    
    return {
        "success": False,
        "error": f"Item not found for weapon: {weapon}"
    }