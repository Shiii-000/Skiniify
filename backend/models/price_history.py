from pydantic import BaseModel
from typing import List, Optional

class TradeUpCalculateRequest(BaseModel):
    """Trade-up calculation request"""
    items: list
    target_rarity: str
    
    class Config:
        json_schema_extra = {
            "example": {
                "items": [
                    {"weapon": "AK-47", "skin": "Redline", "wear": 0.15, "count": 3},
                    {"weapon": "M4A1-S", "skin": "Printstream", "wear": 0.20}
                ],
                "target_rarity": "Covert"
            }
        }

class PriceDataResponse(BaseModel):
    """Price history response"""
    weapon_skin: str
    current_price_usd: float
    price_history_7d: List[float]
    trend_24h_percent: float
    last_updated: str
    
    class Config:
        json_schema_extra = {
            "example": {
                "weapon_skin": "AK-47 | Asiimov",
                "current_price_usd": 0.99,
                "price_history_7d": [0.85, 0.90, 0.92, 0.88, 0.95, 0.93, 0.99],
                "trend_24h_percent": 17.65,
                "last_updated": "2024-01-15T10:30:00Z"
            }
        }