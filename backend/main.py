            return HTMLResponse(content="<h1 class='text-center text-2xl font-bold mt-8 p-8'>⚠️ Build frontend with 'npm run build' first, or visit http://localhost:3000</h1>")

@app.post("/api/auth/login", response_class=JSONResponse)
async def login(data: LoginRequest):
    user = UserSchema(steam_id=data.steam_id, username=f"User_{data.steam_id[-4:]}")
    users[user.steam_id] = user
    return {"message": "Login successful", "user": {"steam_id": user.steam_id, "username": user.username}}

@app.post("/api/trade-up-calculate", response_class=JSONResponse)
async def calculate_trade_up(items: list):
    """
    Calculate expected item from 10x trade-up items (Steam requirement)
    
    Each input must have:
      - name: Skin name (e.g., "AK-47 | Asiimov")
      - wear: Float value (0.007 - 1.0)
      - weapon: Weapon name (e.g., "AK-47")
      
    Returns expected output with:
      - total_cost_usd: Sum of all input prices
      - average_float: Mean float across all inputs
      - output_float_range: Expected wear range (±2% tolerance)
      - estimated_value_usd: Projected output value
      - roi_percent: Return on investment
    """
    
    # Validate exactly 10 items required for trade-up
    if len(items) != 10:
        return {
            "success": False,
            "error": "Steam trade-up requires exactly 10 items",
            "hint": "Add more items to your selection"
        }
    
    # Validate each item has required fields
    for i, item in enumerate(items):
        if 'name' not in item:
            return {"success": False, "error": f"Item {i+1} missing 'name'", "hint": "Add skin name"}
        if 'wear' not in item:
            return {"success": False, "error": f"Item {i+1} missing 'wear'", "hint": "Add float value (0.007-1.0)"}
        
        # Validate wear range
        wear = float(item['wear'])
        if wear < 0.007 or wear > 1.0:
            return {
                "success": False, 
                "error": f"Item {i+1} has invalid wear: {wear}",
                "hint": "Wear must be between 0.007 and 1.0"
            }
    
    # Calculate average float
    total_wear = sum(float(item['wear']) for item in items)
    avg_wear = total_wear / len(items)
    
    # Calculate wear range with ±2% tolerance (Steam formula)
    wear_tolerance = 0.02
    min_wear = max(0.007, avg_wear - wear_tolerance)
    max_wear = min(1.0, avg_wear + wear_tolerance)
    
    # Get weapon types from inputs
    weapon_types = set(item.get('weapon', items[0]['weapon']) for item in items if 'weapon' in item)
    primary_weapon = list(weapon_types)[0] if len(weapon_types) == 1 else "AK-47"
    
    # Fetch prices (will use CSFloat or cached data)
    total_cost_usd = 0.0
    
    # Mock price fetching - in production this would call /api/prices endpoint
    for item in items:
        # Placeholder: In real app, fetch each item's price from API
        skin_name = item.get('name', 'AK-47 | Asiimov')
        mock_price = 10.50  # Placeholder - will be replaced with actual API call
        
        total_cost_usd += mock_price
    
    # Calculate estimated output value based on average wear and rarity
    # Simplified formula: base value + wear multiplier
    rarity_multiplier = 1.0
    if avg_wear < 0.15:
        rarity_multiplier = 3.0  # Factory New/Minimal Wear premium
    elif avg_wear < 0.25:
        rarity_multiplier = 1.5  # Field-Tested premium
    
    estimated_value_usd = total_cost_usd * 1.8 * rarity_multiplier  # 80% profit is realistic for trade-ups
    
    return {
        "success": True,
        "items_processed": len(items),
        "total_cost_usd": round(total_cost_usd, 2),
        "average_float": round(avg_wear, 3),
        "expected_output_range": {
            "min_wear": round(min_wear, 3),
            "max_wear": round(max_wear, 3)
        },
        "estimated_value_usd": round(estimated_value_usd, 2),
        "potential_profit_usd": round(estimated_value_usd - total_cost_usd, 2),
        "roi_percent": round(((estimated_value_usd - total_cost_usd) / total_cost_usd) * 100, 2),
        "primary_weapon": primary_weapon
    }

@app.post("/api/inventory/track", response_class=JSONResponse)
async def track_inventory(steam_id: str):
    """Track user's inventory (placeholder - would fetch from Steam API)"""
    
    mock_items = [
        {"name": "AK-47 | Asiimov", "wear": 0.08, "value_usd": 9.5, "weapon": "AK-47"},
        {"name": "M4A1-S | Printstream", "wear": 0.12, "value_usd": 15.75, "weapon": "M4A1-S"},
        {"name": "AWP | Dragon Lore", "wear": 0.05, "value_usd": 8500.0, "weapon": "AWP"}
    ]
    
    total_value = sum(item['value_usd'] for item in mock_items)
    
    return {
        "steam_id": steam_id,
        "total_items": len(mock_items),
        "total_value_usd": round(total_value, 2),
        "items": mock_items,
        "lowest_value_item": min(mock_items, key=lambda x: x['value_usd'])
    }

if __name__ == "__main__":
    import sys
    if len(sys.argv) > 1 and sys.argv[1] == "--reload":
        uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
    else:
        uvicorn.run(app, host="0.0.0.0", port=8000)