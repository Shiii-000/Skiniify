from fastapi import FastAPI, HTTPException, Request, Depends
from fastapi.responses import HTMLResponse, JSONResponse
import uvicorn
from datetime import datetime
from models.user import UserSchema, LoginRequest
from models.inventory import InventoryResponse, InventoryItemSchema
from models.price import SkinData, WearLevel

# Import price routes
try:
    from api.routes.price import router as price_router
except:
    pass  # Will be imported when backend is running

app = FastAPI(
    title="Skiniify API",
    description="CS:GO/CS2 Item Tracker & Trade-Up Calculator with Real-Time Prices",
    version="2.0.0"
)

# In-memory user storage
users = {}

@app.get("/")
async def serve_home():
    return HTMLResponse(content=open("templates/home.html", "r", encoding="utf-8").read())

@app.get("/calculator")
async def serve_calculator():
    return HTMLResponse(content=open("templates/calculator.html", "r", encoding="utf-8").read())

@app.get("/inventory")
async def serve_inventory():
    return HTMLResponse(content=open("templates/inventory.html", "r", encoding="utf-8").read())

@app.post("/api/auth/login", response_class=JSONResponse)
async def login(data: LoginRequest):
    user = UserSchema(steam_id=data.steam_id, username=f"User_{data.steam_id[-4:]}")
    users[user.steam_id] = user
    return {"message": "Login successful", "user": {"steam_id": user.steam_id, "username": user.username}}

@app.post("/api/trade-up-calculate", response_class=JSONResponse)
async def calculate_trade_up(data):
    """Calculate expected item from 3x trade-up items"""
    if len(data.get("items", [])) < 3:
        raise HTTPException(status_code=400, detail="Trade-up requires exactly 3 items")
    
    total_wear = sum(item['wear'] for item in data['items'])
    avg_wear = total_wear / len(data['items']) + 0.015
    
    weapon_types = {item['weapon'] for item in data['items']}
    primary_weapon = list(weapon_types)[0] if len(weapon_types) > 0 else "AK-47"
    
    return {
        "success": True,
        "expected_item": f"{primary_weapon} | Classified Item",
        "expected_wear_range": [round(max(0.01, avg_wear - 0.02), 3), round(avg_wear + 0.02, 3)],
        "estimated_value_usd": round((avg_wear * 1000) + 50, 2),
        "trade_fee_estimate_usd": round(((avg_wear * 1000) + 50) * 0.08, 2)
    }

@app.post("/api/inventory/track", response_class=JSONResponse)
async def track_inventory(steam_id: str):
    """Track user's inventory"""
    mock_items = [
        {"name": "AK-47 | Asiimov", "wear": 0.08, "value_usd": 9.5},
        {"name": "M4A1-S | Printstream", "wear": 0.12, "value_usd": 15.75},
        {"name": "AWP | Dragon Lore", "wear": 0.05, "value_usd": 8500.0}
    ]
    
    total_value = sum(item['value_usd'] for item in mock_items)
    
    return {
        "steam_id": steam_id,
        "total_items": len(mock_items),
        "total_value_usd": round(total_value, 2),
        "items": mock_items,
        "lowest_value_item": min(mock_items, key=lambda x: x['value_usd'])
    }

# ===== NEW PRICE API ROUTES =====
@app.get("/api/prices/steam/{skin_name}")
async def get_steam_price(skin_name: str, market_source: str = "steam"):
    """Get real-time Steam Market price"""
    # This will be handled by the price_router when imported
    return {"message": f"Fetching Steam price for: {skin_name}"}

@app.get("/api/prices/csfloat/{skin_name}")
async def get_csfloat_price(skin_name: str):
    """Get CSFloat market price (requires API key in config.py)"""
    return {"message": "CSFloat price endpoint - requires API key configuration"}

@app.get("/api/prices/trends")
async def get_price_trends(days: int = 7):
    """Get historical price trends for popular items"""
    popular_items = ["AK-47 | Asiimov", "AWP | Dragon Lore", "Karambit | Doppler"]
    
    # Mock trend data (replace with real API calls)
    return {
        "trends": [
            {"item": item, "trend_percent": round((random.uniform(-10, 15)), 2)}
            for item in popular_items
        ]
    }

# ===== OLD ENDPOINTS =====
@app.get("/api/users/me", response_class=JSONResponse)
async def get_current_user(steam_id: str = None):
    if steam_id not in users:
        return {"message": "User not logged in", "steam_id": steam_id}
    
    user = users[steam_id]
    return {
        "username": user.username,
        "steam_id": user.steam_id,
        "account_created": datetime.now().isoformat()
    }

@app.get("/docs")
async def docs():
    """API documentation"""
    return {
        "message": "Skiniify API v2.0 - Real-time Steam/CSFloat Market Data",
        "endpoints": [
            "/api/auth/login",
            "/api/trade-up-calculate", 
            "/api/inventory/track",
            "/api/prices/steam/{skin_name}",      # NEW - Real-time Steam prices
            "/api/prices/csfloat/{skin_name}",   # NEW - CSFloat market data
            "/api/prices/trends",                 # NEW - Price trends analytics
            "/docs"                               # API docs (Swagger UI)
        ]
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)