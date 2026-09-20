from pydantic import BaseModel
from typing import List, Optional

class InventoryItemSchema(BaseModel):
    """Single inventory item"""
    name: str
    wear: float
    value_usd: float
    
    class Config:
        json_schema_extra = {
            "example": {
                "name": "AK-47 | Asiimov",
                "wear": 0.08,
                "value_usd": 9.5
            }
        }

class InventoryResponse(BaseModel):
    """Inventory tracking response"""
    steam_id: str
    total_items: int
    total_value_usd: float
    items: List[InventoryItemSchema]
    lowest_value_item: InventoryItemSchema
    
    class Config:
        json_schema_extra = {
            "example": {
                "steam_id": "76561198000000000",
                "total_items": 3,
                "total_value_usd": 8525.25,
                "items": [
                    {"name": "AK-47 | Asiimov", "wear": 0.08, "value_usd": 9.5},
                    {"name": "M4A1-S | Printstream", "wear": 0.12, "value_usd": 15.75}
                ],
                "lowest_value_item": {"name": "AK-47 | Asiimov", "wear": 0.08, "value_usd": 9.5}
            }
        }