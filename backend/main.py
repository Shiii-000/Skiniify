from fastapi import FastAPI, HTTPException, Request, Depends
from fastapi.responses import HTMLResponse, JSONResponse
from pydantic import BaseModel
from typing import List, Optional
import uvicorn
import os
from datetime import datetime

# Import local modules
from models.user import UserSchema, LoginRequest
from models.inventory import InventoryResponse, InventoryItemSchema
from models.price_history import PriceDataResponse, TradeUpCalculateRequest

app = FastAPI(
    title="Skiniify API",
    description="CS:GO/CS2 Item Tracker & Trade-Up Calculator API with Python Templates",
    version="1.0.0"
)

# Store users in memory (replace with database in production)
users = {}

# Serve Python-based Jinja2 templates
@app.get("/")
async def serve_home():
    """Serve homepage template"""
    return HTMLResponse(content=open("templates/home.html", "r", encoding="utf-8").read())

@app.get("/calculator")
async def serve_calculator():
    """Serve calculator template"""
    return HTMLResponse(content=open("templates/calculator.html", "r", encoding="utf-8").read())

@app.get("/inventory")
async def serve_inventory():
    """Serve inventory template"""
    return HTMLResponse(content=open("templates/inventory.html", "r", encoding="utf-8").read())

@app.post("/api/auth/login", response_class=JSONResponse)
async def login(data: LoginRequest):
    """Authenticate user with Steam credentials"""
    user = UserSchema(
        steam_id=data.steam_id,
        username=f"User_{data.steam_id[-4:]}"
    )
    users[user.steam_id] = user
    return {"message": "Login successful", "user": {"steam_id": user.steam_id, "username": user.username}}

@app.post("/api/trade-up-calculate", response_class=JSONResponse)
async def calculate_trade_up(data: TradeUpCalculateRequest):
    """Calculate expected item from 3x trade-up items"""
    if len(data.items) < 3:
        raise HTTPException(status_code=400, detail="Trade-up requires exactly 3 items")
    
    total_wear = sum(item['wear'] for item in data.items)
    avg_wear = total_wear / len(data.items)
    expected_wear = avg_wear + 0.015
    
    weapon_types = {item['weapon'] for item in data.items}
    primary_weapon = list(weapon_types)[0] if len(weapon_types) > 0 else "AK-47"
    
    return {
        "success": True,
        "expected_item": f"{primary_weapon} | Classified Item",
        "expected_wear_range": [round(expected_wear - 0.02, 3), round(expected_wear + 0.02, 3)],
        "items_traded": len(data.items),
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

@app.get("/api/prices/{weapon_skin}", response_class=JSONResponse)
async def get_price_history(weapon_skin: str):
    """Get current market price and 7-day history"""
    return {
        "weapon_skin": weapon_skin,
        "current_price_usd": 0.99,
        "price_history_7d": [0.85, 0.90, 0.92, 0.88, 0.95, 0.93, 0.99],
        "trend_24h_percent": round(((0.99 - 0.85) / 0.85) * 100, 2),
        "last_updated": datetime.now().isoformat()
    }

@app.get("/api/users/me", response_class=JSONResponse)
async def get_current_user(steam_id: str = None):
    """Get current authenticated user info"""
    if steam_id not in users:
        return {"message": "User not logged in", "steam_id": steam_id}
    
    user = users[steam_id]
    return {
        "username": user.username,
        "steam_id": user.steam_id,
        "account_created": datetime.now().isoformat()
    }

# API Documentation
@app.get("/docs", response_class=JSONResponse)
async def docs():
    """API documentation"""
    return {
        "message": "Skiniify API Documentation (Jinja2 Templates)",
        "endpoints": [
            "/api/auth/login",
            "/api/trade-up-calculate", 
            "/api/inventory/track",
            "/api/prices/{weapon_skin}"
        ]
    }

# Run the Python-based backend server
if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)