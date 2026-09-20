from pydantic import BaseModel, Field
from typing import List, Optional, Dict
from enum import Enum

class WearLevel(str, Enum):
    FactoryNew = "Factory New"
    MinimalWear = "Minimal Wear" 
    FieldTested = "Field Tested"
    WellWorn = "Well Worn"
    BattleScarred = "Battle Scarred"

# Mock price data for MVP (will replace with real API calls)
MOCK_PRICE_DATA = {
    "AK-47 | Asiimov": {"base_price": 9.50, "wear_premium": 0.12},
    "M4A1-S | Printstream": {"base_price": 15.75, "wear_premium": 0.15},
    "AWP | Dragon Lore": {"base_price": 8500.00, "wear_premium": -0.02},  # Lower wear = more expensive
    "AK-47 | Redline": {"base_price": 0.99, "wear_premium": 0.18},
    "M4A4 | Howl": {"base_price": 350.00, "wear_premium": -0.01},
    "Karambit | Doppler": {"base_price": 1200.00, "wear_premium": -0.03},
    "Glock-18 | Fade": {"base_price": 450.00, "wear_premium": -0.02},
}

class SkinData(BaseModel):
    name: str
    base_price_usd: float = Field(..., description="Base price from Steam/CSFloat")
    wear_range_min: float = Field(..., description="Min wear for this skin in inventory")
    wear_range_max: float = Field(..., description="Max wear for this skin")
    last_updated: Optional[str] = None

class PriceResponse(BaseModel):
    item_name: str
    current_price_usd: float
    wear_level: WearLevel
    price_change_24h_percent: float
    trend_direction: str  # "up" or "down"
    market_source: str  # "steam" or "csfloat"
    
class MarketPrice(BaseModel):
    steam_market: Optional[float] = None
    buff_market: Optional[float] = None
    cs_money: Optional[float] = None
    
class PriceHistoryPoint(BaseModel):
    timestamp: str
    price_usd: float

class BulkPriceResponse(BaseModel):
    items: Dict[str, SkinData]
    total_portfolio_value: float
    market_trends: List[Dict]  # Price trend data