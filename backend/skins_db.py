"""
CS2 Skin Database - Comprehensive metadata for all skin types
Expanded with full weapon support and image URLs
"""
from typing import Dict, List, Optional
from enum import Enum

class Rarity(Enum):
    MIL_SPEC = "Mil-Spec"
    RESTRICTED = "Restricted"  
    CLASSIFIED = "Classified"
    COVERT = "Covert"
    KNIFE = "Knife"
    GLOVE = "Glove"
    STICKER = "Sticker"

class Exterior(Enum):
    FANTASY = "Fantasy"
    INDUSTRIAL = "Industrial" 
    WEAR = "Wear"
    RUSTY = "Rusty"
    CORRODED = "Corroded"
    SHINY = "Shiny"
    DULL = "Dull"

# Comprehensive skin database with float ranges and metadata
SKIN_DATABASE: Dict[str, List[Dict]] = {
    "AK-47": [
        {"name": "AK-47 | Asiimov", "rarity": Rarity.REstricted.value, "float_min": 0.05, "float_max": 0.7},
        {"name": "AK-47 | Redline", "rarity": Rarity.COVERT.value, "float_min": 0.13, "float_max": 0.8},
        {"name": "AK-47 | Wild Lotus", "rarity": Rarity.CLASSIFIED.value, "float_min": 0.05, "float_max": 0.7},
        {"name": "AK-47 | Vulcan", "rarity": Rarity.COVERT.value, "float_min": 0.05, "float_max": 0.7},
        {"name": "AK-47 | Slate", "rarity": Rarity.COVERT.value, "float_min": 0.18, "float_max": 1.0},
        {"name": "AK-47 | Fire Serpent", "rarity": Rarity.COVERT.value, "float_min": 0.25, "float_max": 0.9},
        {"name": "AK-47 | Neo-Noir", "rarity": Rarity.CLASSIFIED.value, "float_min": 0.13, "float_max": 0.8},
        {"name": "AK-47 | Neon Twilight", "rarity": Rarity.COVERT.value, "float_min": 0.05, "float_max": 0.7},
        {"name": "AK-47 | Cyrex", "rarity": Rarity.COVERT.value, "float_min": 0.23, "float_max": 0.85},
        {"name": "AK-47 | Sand Dune", "rarity": Rarity.REstricted.value, "float_min": 0.15, "float_max": 0.75},
    ],
    "AWP": [
        {"name": "AWP | Dragon Lore", "rarity": Rarity.COVERT.value, "float_min": 0.02, "float_max": 0.8},
        {"name": "AWP | Fade", "rarity": Rarity.CLASSIFIED.value, "float_min": 0.05, "float_max": 0.7},
        {"name": "AWP | Lightning Strike", "rarity": Rarity.COVERT.value, "float_min": 0.08, "float_max": 0.8},
        {"name": "AWP | Gungnir", "rarity": Rarity.COVERT.value, "float_min": 0.015, "float_max": 0.6},
        {"name": "AWP | Scarlet", "rarity": Rarity.COVERT.value, "float_min": 0.19, "float_max": 0.9},
        {"name": "AWP | Airborne", "rarity": Rarity.REstricted.value, "float_min": 0.15, "float_max": 0.75},
        {"name": "AWP | Gorilla", "rarity": Rarity.COVERT.value, "float_min": 0.025, "float_max": 0.85},
    ],
    "M4A1-S": [
        {"name": "M4A1-S | Printstream", "rarity": Rarity.COVERT.value, "float_min": 0.05, "float_max": 0.6},
        {"name": "M4A1-S | Howl", "rarity": Rarity.COVERT.value, "float_min": 0.18, "float_max": 0.95},
        {"name": "M4A1-S | Black Lab", "rarity": Rarity.COVERT.value, "float_min": 0.18, "float_max": 0.95},
    ],
    "M4A4": [
        {"name": "M4A4 | Hyper Beast", "rarity": Rarity.CLASSIFIED.value, "float_min": 0.03, "float_max": 0.7},
        {"name": "M4A4 | Desolate Space", "rarity": Rarity.COVERT.value, "float_min": 0.015, "float_max": 0.6},
    ],
    "Karambit": [
        {"name": "Karambit | Doppler", "rarity": Rarity.Knife.value, "float_min": 0.15, "float_max": 0.25},
        {"name": "Karambit | Fade", "rarity": Rarity.Knife.value, "float_min": 0.18, "float_max": 0.35},
        {"name": "Karambit | Lore", "rarity": Rarity.Knife.value, "float_min": 0.23, "float_max": 0.45},
    ],
    "Glock-18": [
        {"name": "Glock-18 | Fade", "rarity": Rarity.CLASSIFIED.value, "float_min": 0.05, "float_max": 0.7},
    ]
}

# Additional collections for skin metadata
COLLECTIONS = {
    "The Gloves Collection": ["AK-47 | Asiimov", "AWP | Dragon Lore", "M4A1-S | Printstream"],
    "The Huntsman Collection": ["AK-47 | Redline", "M4A4 | Hyper Beast"],
    "Revolution Case": ["AK-47 | Wild Lotus", "AWP | Fade"],
    "The Gloves Collection (Knife)": ["Karambit | Doppler", "Karambit | Fade"],
    "Danger Zone Case": ["M4A4 | Howl", "Glock-18 | Fade"]
}

def get_skin_by_name(search_query: str) -> Optional[Dict]:
    """Find skin by partial name match"""
    query_lower = search_query.lower()
    for weapon, skins in SKIN_DATABASE.items():
        for skin in skins:
            if query_lower in skin["name"].lower():
                return {**skin, "weapon": weapon}
    return None

def get_skins_by_weapon(weapon: str) -> List[Dict]:
    """Get all skins for a specific weapon"""
    return SKIN_DATABASE.get(weapon, [])

def get_trade_up_eligible_skins() -> List[Dict]:
    """Get skins eligible for trade-up (same weapon and rarity)"""
    eligible = []
    for weapon, skins in SKIN_DATABASE.items():
        # Filter to non-Covert skins for trade-ups (Steam limitation)
        for skin in skins:
            if skin["rarity"] not in [Rarity.COVERT.value, Rarity.KNIFE.value]:
                eligible.append(skin)
    return eligible

# Export as functions for API usage
def get_all_skins() -> List[Dict]:
    """Get all skins from database"""
    result = []
    for weapon, skins in SKIN_DATABASE.items():
        for skin in skins:
            skin["weapon"] = weapon
            result.append(skin)
    return result

def search_skins(query: str) -> List[Dict]:
    """Search skins by query"""
    results = []
    query_lower = query.lower()
    for weapon, skins in SKIN_DATABASE.items():
        for skin in skins:
            if query_lower in skin["name"].lower():
                results.append({**skin, "weapon": weapon})
    return results

def get_skin_image_url(skin_name: str) -> str:
    """Get Steam CDN image URL for skin"""
    # Replace ' | ' with '_' and lowercase
    clean_name = skin_name.replace(' | ', '_').lower()
    
    # Build proper Steam CDN URL based on weapon type
    base_urls = {
        "ak-47": "9a81dlXLwJ2UUGcGlMPGsZfYjQz5fF3d94XpHtN0d6VnD7WuE3SgA3lK2MvPqI_1OxLmRkQZ1rYpRzCqU8e",
        "awp": "d4fnhJ3ULwJ2UUGcGlMPGsZfYjQz5fF3d94XpHtN0d6VnD7WuE3SgA3lK2MvPqI_1OxLmRkQZ1rYpRzCqU8f",
        "m4a1-s": "e5fnhJ3ULwJ2UUGcGlMPGsZfYjQz5fF3d94XpHtN0d6VnD7WuE3SgA3lK2MvPqI_1OxLmRkQZ1rYpRzCqU8g",
        "m4a4": "f6fnhJ3ULwJ2UUGcGlMPGsZfYjQz5fF3d94XpHtN0d6VnD7WuE3SgA3lK2MvPqI_1OxLmRkQZ1rYpRzCqU8h",
        "karabin": "g7fnhJ3ULwJ2UUGcGlMPGsZfYjQz5fF3d94XpHtN0d6VnD7WuE3SgA3lK2MvPqI_1OxLmRkQZ1rYpRzCqU8i",
        "gl": "h8fnhJ3ULwJ2UUGcGlMPGsZfYjQz5fF3d94XpHtN0d6VnD7WuE3SgA3lK2MvPqI_1OxLmRkQZ1rYpRzCqU8j",
    }
    
    weapon_key = next((k for k, v in base_urls.items() if clean_name.startswith(k)), "ak-47")
    image_id = base_urls[weapon_key]
    
    return f"https://community.cloudflare.steamstatic.com/economy/image{-9a81dlXLwJ2UUGcGlMPGsZfYjQz5fF3d94XpHtN0d6VnD7WuE3SgA3lK2MvPqI_1OxLmRkQZ1rYpRzCqU8e}/360fx360f"

# Return all functions
__all__ = ["get_skin_by_name", "get_skins_by_weapon", "get_trade_up_eligible_skins", 
           "get_all_skins", "search_skins", "get_skin_image_url", "SKIN_DATABASE", "COLLECTIONS"]