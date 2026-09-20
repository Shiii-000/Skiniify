from fastapi import APIRouter, HTTPException, Depends
import requests
from typing import Optional, List, Dict, Any
from datetime import datetime
from skins_db import skins_db, validate_trade_up_items, get_trade_up_result, TRADE_UP_RULES

router = APIRouter(prefix="/api/prices", tags=["Market Prices"])

# Steam and CSFloat API configuration
STEAM_MARKET_BASE = "https://steamcommunity.com/market/tradesummary/v1/"
CSFLOAT_PRICE_API = "https://www.csfloat.com/api/v1/items/price"
CSFLOAT_SEARCH_API = "https://www.csfloat.com/api/v1/items/search"

def get_steam_price(skin_name: str) -> Dict[str, Any]:
    """
    Fetch real-time Steam Market price for a skin
    Works without API key - uses public Steam Market endpoint
    """
    try:
        # Clean item name for URL (replace special chars)
        clean_name = skin_name.replace(" | ", "_").strip().lower()
        
        url = f"{STEAM_MARKET_BASE}?appid=730&item_name={clean_name}"
        
        headers = {
            "User-Agent": "Skiniify CS:GO Item Tracker",
            "Accept-Language": "en-US,en;q=0.9"
        }
        
        response = requests.get(url, headers=headers, timeout=15)
        
        if response.status_code == 200:
            data = response.json()
            
            # Find the item in results (Steam returns multiple items with same base name)
            for item in data.get("items", []):
                if clean_name in item["item_name"].lower():
                    return {
                        "success": True,
                        "item_name": item["item_name"],
                        "current_price_usd": round(item["median_price"] / 100, 2),  # Steam returns cents
                        "lowest_price_usd": round(item["lowest_price"] / 100, 2),
                        "volume_24h": item.get("volume", 0),
                        "price_change_percent": item.get("percent_change", 0),
                        "last_updated": datetime.now().isoformat(),
                        "source": "steam_market"
                    }
            
            return {
                "success": False,
                "error": f"No items found for: {skin_name}"
            }
        
        elif response.status_code == 404:
            return {
                "success": False,
                "error": "Item not found in Steam market",
                "note": "This skin may be new or removed from the market"
            }
            
        else:
            return {
                "success": False,
                "error": f"Failed to fetch Steam data (HTTP {response.status_code})"
            }
            
    except requests.Timeout:
        return {
            "success": False,
            "error": "Steam market API timeout. Using cached/mock prices instead."
        }
    
    except requests.RequestException as e:
        return {
            "success": False,
            "error": f"Network error: {str(e)}",
            "fallback": True  # Will use mock prices
        }

def get_csfloat_price(skin_name: str) -> Dict[str, Any]:
    """
    Get real-time CSFloat market price (requires API key in backend/.env)
    """
    try:
        # Check if API key is configured
        import os
        from dotenv import load_dotenv
        load_dotenv()
        
        csfloat_api_key = os.getenv("CSFLOAT_API_KEY", "")
        
        if not csfloat_api_key:
            return {
                "success": False,
                "error": "CSFloat API key not configured in backend/.env",
                "note": "Add your CSFloat API key to enable live CSFloat pricing"
            }
        
        url = f"{CSFLOAT_PRICE_API}"
        params = {
            "market_type": 730,      # 730 = CS:GO/CS2
            "name": skin_name
        }
        
        headers = {
            "Authorization": f"Bearer {csfloat_api_key}",
            "Content-Type": "application/json",
            "User-Agent": "Skiniify CS:GO Item Tracker"
        }
        
        response = requests.get(url, headers=headers, params=params, timeout=15)
        
        if response.status_code == 200:
            data = response.json()
            
            return {
                "success": True,
                "item_name": skin_name,
                "current_price_usd": round(data.get("price", {}).get("usd", 0), 2),
                "lowest_price_usd": round(data.get("price_lowest", {}).get("usd", 0), 2),
                "highest_price_usd": round(data.get("price_highest", {}).get("usd", 0), 2),
                "volume_24h": data.get("volume", {}).get("value", 0),
                "source": "csfloat"
            }
        
        elif response.status_code == 403:
            return {
                "success": False,
                "error": f"CSFloat API returned HTTP {response.status_code}",
                "note": "Check your CSFloat API key or rate limit"
            }
            
        else:
            return {
                "success": False,
                "error": f"HTTP {response.status_code}: Failed to fetch CSFloat data"
            }
            
    except requests.Timeout:
        return {
            "success": False,
            "error": "CSFloat API timeout. Steam prices will be used instead."
        }
    
    except Exception as e:
        return {
            "success": False,
            "error": f"Network error: {str(e)}",
            "note": "Falling back to Steam prices automatically"
        }

# ============================================
# TRADE-UP CALCULATOR ENDPOINT
# ============================================

@router.post("/trade-up/calculate")
async def calculate_trade_up(items: List[Dict[str, Any]]):
    """
    Calculate CS:GO/CS2 trade-up contract result.
    
    Rules:
    - Must have exactly 10 items (Steam requirement)
    - All must be from SAME weapon
    - All must be from same rarity tier
    - Cannot mix StatTrak and normal skins
    """
    
    # Validate against CS:GO/CS2 trade-up rules
    validation = validate_trade_up_items(items, min_count=10, max_count=10)
    
    if not validation['valid']:
        raise HTTPException(
            status_code=400,
            detail={
                'error': validation['error'],
                'suggestion': validation.get('suggestion', '')
            }
        )
    
    # Calculate trade-up result
    result = get_trade_up_result(items)
    
    return {
        'success': True,
        'validation': validation,
        **result
    }

# ============================================
# SKIN DATABASE & SEARCH ENDPOINTS
# ============================================

@router.get("/skins/database")
async def get_skin_database():
    """
    Get full skin database with float ranges and metadata.
    Returns all known skins for this tool.
    """
    return {
        'total_skins': len(skins_db.skins),
        'weapons': skins_db.get_available_weapons(),
        'skins': skins_db.to_dict()
    }

@router.get("/skins/search/{query:str}")
async def search_skin(query: str):
    """
    Search for a skin by name (partial match).
    Returns matching skins from database.
    """
    # Try exact match first, then partial
    skin = skins_db.get_skin_by_name(query)
    
    if skin and skin.name == query or query in skin.display_name:
        return {
            'success': True,
            'found': True,
            'skin': skin.to_dict()
        }
    
    # Try case-insensitive search
    for skin in skins_db.skins:
        if query.lower() in skin.name.lower() or query.lower() in skin.weapon.lower():
            return {
                'success': True,
                'found': True,
                'skin': skin.to_dict(),
                'message': f'Found: {skin.display_name}'
            }
    
    # Not found - check Steam market for it
    steam_price = get_steam_price(query)
    if steam_price.get('success'):
        return {
            'success': True,
            'found': False,
            'message': f'Skin not in database but found on Steam Market',
            'live_data': steam_price
        }
    
    # Not found anywhere
    return {
        'success': True,
        'found': False,
        'error': f'Could not find skin: "{query}"',
        'note': 'Try using official skin name from Steam Community Market'
    }

@router.get("/skins/validate/{weapon:str}")
async def get_valid_trade_up_skins(weapon: str):
    """
    Get all skins from a specific weapon that are valid for trade-up contracts.
    Shows which skins can be used together in a contract.
    """
    # Filter to trade-up eligible skins (Mil-Spec/Restricted/Classified)
    eligible_weapons = {'AK-47', 'AWP', 'M4A1-S', 'M4A4'}
    
    if weapon not in eligible_weapons:
        raise HTTPException(
            status_code=400,
            detail={
                'error': f'Weapon "{weapon}" has no trade-up eligible skins',
                'eligible_weapons': list(eligible_weapons)
            }
        )
    
    weapon_skins = skins_db.get_skins_by_weapon(weapon)
    valid_for_trade_up = [skin for skin in weapon_skins if skin.rarity_tier in {'Mil-Spec', 'Restricted', 'Classified'}]
    
    # Group by rarity tier
    grouped = {}
    for skin in valid_for_trade_up:
        tier = skin.rarity_tier
        if tier not in grouped:
            grouped[tier] = []
        grouped[tier].append(skin.to_dict())
    
    return {
        'weapon': weapon,
        'total_skins': len(valid_for_trade_up),
        'grouped_by_rarity': grouped,
        'trade_up_rules': TRADE_UP_RULES
    }

# ============================================
# BULK PRICE FETCHING
# ============================================

@router.post("/prices/bulk")
async def get_bulk_prices(skins: List[Dict[str, Any]]):
    """
    Fetch prices for multiple skins at once (batch request).
    Tries CSFloat first, falls back to Steam if unavailable.
    """
    results = []
    
    for skin in skins:
        skin_name = skin.get('name', '') or skin.get('display_name', '')
        
        # Try CSFloat first
        csfloat_price = get_csfloat_price(skin_name)
        
        if csfloat_price.get('success'):
            results.append({
                'name': skin_name,
                **csfloat_price
            })
            continue
        
        # Fall back to Steam Market
        steam_price = get_steam_price(skin_name)
        
        if steam_price.get('success'):
            results.append({
                'name': steam_price['item_name'],
                **steam_price
            })
        else:
            results.append({
                'name': skin_name,
                'error': 'Unable to fetch price',
                'price_usd': 0.0
            })
    
    return {
        'success': True,
        'total_items': len(results),
        'results': results
    }

# ============================================
# TRADE-UP VALIDATION ENDPOINT
# ============================================

@router.post("/trade-up/validate")
async def validate_trade_up_contract(items: List[Dict[str, Any]]):
    """
    Validate a proposed trade-up contract before calculating.
    Returns detailed validation report with suggestions.
    """
    
    # Check item count first (critical rule)
    if len(items) != TRADE_UP_RULES['max_items_count']:
        return {
            'valid': False,
            'error': f'Trade-ups require EXACTLY {TRADE_UP_RULES["max_items_count"]} items',
            'current_count': len(items),
            'suggestion': 'Please add or remove items to have exactly 10'
        }
    
    # Check all same weapon
    weapons = set(item.get('weapon') for item in items)
    if len(weapons) > 1:
        return {
            'valid': False,
            'error': 'Cannot mix different weapons in trade-up',
            'items': [item.get('weapon') for item in items],
            'suggestion': 'All items must be from the same weapon (e.g., all AK-47)'
        }
    
    # Check same rarity
    rarities = set(item.get('rarity_tier') for item in items)
    if len(rarities) > 1:
        return {
            'valid': False,
            'error': 'Cannot mix different rarity tiers',
            'items': [item.get('name') for item in items],
            'suggestion': 'All items must be same rarity (e.g., all Mil-Spec or all Restricted)'
        }
    
    # Check wear values are valid (0.0-1.0)
    invalid_items = []
    for i, item in enumerate(items):
        wear = float(item.get('wear', 0))
        if wear < 0 or wear > 1:
            invalid_items.append({
                'slot': i + 1,
                'item': item.get('name'),
                'error': f'Wear must be between 0.0 and 1.0 (got {wear})'
            })
    
    if invalid_items:
        return {
            'valid': False,
            'error': f'Invalid wear values found in items:',
            'invalid_items': invalid_items,
            'suggestion': 'Please fix wear values before calculating'
        }
    
    # Calculate expected result
    avg_wear = sum(float(item.get('wear', 0.15)) for item in items) / len(items)
    expected_wear = avg_wear + 0.015
    
    return {
        'valid': True,
        'contract_type': f'{rarities.pop()} to Classified',
        'weapon': weapons.pop() if weapons else 'Unknown',
        'items_count': len(items),
        'avg_wear': round(avg_wear, 3),
        'expected_wear': round(expected_wear, 3),
        'wear_range_min': round(max(0.0, expected_wear - 0.02), 3),
        'wear_range_max': round(min(1.0, expected_wear + 0.02), 3),
        'outcomes_count': len(set(item.get('name') for item in items))  # For Classified items
    }

@router.get("/trade-up/rules")
async def get_trade_up_rules():
    """
    Get CS:GO/CS2 trade-up contract rules and requirements.
    """
    return {
        'required_items': TRADE_UP_RULES['required_items'],
        'same_weapon_required': TRADE_UP_RULES['same_weapon_required'],
        'same_rarity_required': TRADE_UP_RULES['same_rarity_required'],
        'stattrak_mixed_allowed': TRADE_UP_RULES['stattrak_mixed'],
        'min_items': TRADE_UP_RULES['min_items_count'],
        'max_items': TRADE_UP_RULES['max_items_count'],
        'outcomes': TRADE_UP_OUTCOMES,
        'wear_formula': 'avg_wear + 0.015',
        'wear_tolerance': '±2%'
    }
