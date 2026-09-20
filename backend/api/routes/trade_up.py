from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from backend.models.price_history import TradeUpCalculateRequest

router = APIRouter()

class Item(BaseModel):
    weapon: str
    skin: str
    wear: float
    count: int = 1

@router.post("/calculate", summary="Calculate Trade-Up Result")
async def calculate_trade_up(request: TradeUpCalculateRequest):
    """
    Calculate expected item from trade-up
    
    Example Request:
    ```json
    {
        "items": [
            {"weapon": "AK-47", "skin": "Redline", "wear": 0.15, "count": 3}
        ],
        "target_rarity": "Covert"
    }
    ```
    
    Returns expected weapon, wear range, and estimated value.
    """
    
    if len(request.items) != 3:
        return {
            "success": False,
            "error": "Trade-up requires exactly 3 items"
        }
    
    # Simplified trade-up calculation
    weapons = [item['weapon'] for item in request.items]
    unique_weapons = list(set(weapons))
    
    if len(unique_weapons) == 1:
        primary_weapon = unique_weapons[0]
        primary_skin = request.items[0]['skin']
    else:
        # Pick first weapon if mixed
        primary_weapon = weapons[0]
        primary_skin = request.items[0]['skin']
    
    # Calculate average wear
    total_wear = sum(item['wear'] for item in request.items)
    avg_wear = total_wear / len(request.items)
    
    # Trade-up adds ~0.015 to each wear level (simplified formula)
    expected_wear = avg_wear + 0.015
    
    return {
        "success": True,
        "message": f"Expected: {primary_weapon} | {target_rarity}",
        "expected_item": f"{primary_weapon} | Classified Item",
        "expected_wear_range": [round(expected_wear - 0.02, 3), round(expected_wear + 0.02, 3)],
        "items_traded": len(request.items),
        "estimated_value_usd": round((avg_wear * 1000) + 50, 2),
        "trade_fee_estimate_usd": round(((avg_wear * 1000) + 50) * 0.08, 2)
    }