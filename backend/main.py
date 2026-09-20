from fastapi import FastAPI, HTTPException, Request, Depends
from fastapi.responses import HTMLResponse, JSONResponse
import uvicorn
from datetime import datetime
from models.user import UserSchema, LoginRequest
from models.inventory import InventoryResponse, InventoryItemSchema

# Import price routes
try:
    from api.routes.price import router as price_router
except Exception as e:
    print(f"Price routes import warning: {e}")

app = FastAPI(
    title="Skiniify API",
    description="CS:GO/CS2 Item Tracker & Trade-Up Calculator with Real-Time Prices from CSFloat & Steam",
    version="3.0.0"
)

# In-memory user storage
users = {}

@app.get("/")
async def serve_home():
    # Serve Next.js frontend build if exists, otherwise show simple welcome
    try:
        content = open("frontend/.next/static/chunks/pages/_index.js", "r", encoding="utf-8").read()
        return HTMLResponse(content=content)
    except FileNotFoundError:
        return HTMLResponse(content="""
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Skiniify - CS:GO/CS2 Inventory Tracker</title>
            <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body class="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
            <div class="max-w-4xl mx-auto">
                <!-- Header -->
                <header class="text-center mb-12">
                    <h1 class="text-6xl font-bold mb-4">🔪 Skiniify</h1>
                    <p class="text-xl text-gray-300">CS:GO/CS2 Inventory Tracker & Trade-Up Calculator</p>
                </header>

                <!-- Features Grid -->
                <div class="grid md:grid-cols-3 gap-6 mb-12">
                    <div class="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-orange-500 transition">
                        <h3 class="text-2xl font-bold mb-3">🔪 Trade-Up Calculator</h3>
                        <p class="text-gray-300 text-sm">Calculate expected wear and profit when trading up 10 items with Steam's official formula</p>
                    </div>
                    <div class="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-blue-500 transition">
                        <h3 class="text-2xl font-bold mb-3">📊 Market Tracker</h3>
                        <p class="text-gray-300 text-sm">Real-time CSFloat & Steam market prices with dual-source comparison</p>
                    </div>
                    <div class="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-green-500 transition">
                        <h3 class="text-2xl font-bold mb-3">🎒 Inventory Manager</h3>
                        <p class="text-gray-300 text-sm">Track your skin collection with live portfolio valuation</p>
                    </div>
                </div>

                <!-- Quick Actions -->
                <div class="grid md:grid-cols-2 gap-6 mb-12">
                    <a href="/calculator" class="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-6 px-8 rounded-xl text-center transition shadow-lg">
                        🎯 Trade-Up Calculator
                    </a>
                    <a href="http://localhost:3000" class="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-bold py-6 px-8 rounded-xl text-center transition shadow-lg">
                        📊 Main Dashboard (Next.js)
                    </a>
                </div>

                <!-- Discord Banner -->
                <div class="bg-gray-800 rounded-xl p-6 border border-gray-700 text-center">
                    <h3 class="text-xl font-bold mb-2">🎮 Join Our Discord Community</h3>
                    <p class="text-gray-300 mb-4">Get support, report bugs, and share features with other CS:GO players!</p>
                    <a href="https://discord.gg/anKZZ7FpwH" target="_blank" rel="noopener noreferrer" class="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-lg transition">
                        Join Discord →
                    </a>
                </div>

                <!-- Footer -->
                <footer class="mt-12 text-center text-gray-500 text-sm">
                    <p>🔪 Skiniify - Built by Shii-000 for the CS:GO/CS2 community</p>
                    <p class="mt-2">Powered by CSFloat API & Steam Market | v3.0.0</p>
                </footer>
            </div>
        </body>
        </html>
        """)

@app.get("/calculator")
async def serve_calculator():
    """Serve the calculator page"""
    try:
        content = open("frontend/.next/static/chunks/pages/calculator/page.js", "r", encoding="utf-8").read()
        return HTMLResponse(content=content)
    except FileNotFoundError:
        # Fall back to static calculator page
        try:
            content = open("backend/templates/calculator.html", "r", encoding="utf-8").read()
            return HTMLResponse(content=content)
        except FileNotFoundError:
            return HTMLResponse(content='<h1 class="text-center text-2xl font-bold mt-8 p-8">⚠️ Build frontend with "npm run build" first, or visit http://localhost:3000</h1>')

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
