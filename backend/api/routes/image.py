from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import HTMLResponse, JSONResponse, FileResponse
import requests
from typing import Optional
from datetime import datetime

router = APIRouter(prefix="/api/images", tags="Skin Images")

# Steam Community Market Image URLs
STEAM_COMMUNITY_BASE = "https://community.cloudflare.steamstatic.com"
STEAM_ECONOMY_API = "https://steamcommunity.com/market/"

def get_weapon_icon_url(weapon_name: str) -> Optional[str]:
    """
    Get weapon icon URL from Steam Community
    Returns None if no image found
    """
    
    # Clean weapon name for URL
    clean_name = weapon_name.replace(" | ", "_").strip().lower()
    
    try:
        # Try to fetch from Steam community market (uses cached images)
        steam_url = f"{STEAM_COMMUNITY_BASE}/economy/image/-9a81dlXLwJ2UUGcGlMPGsZfYjQz5fF3d94XpHtN0d6VnD7WuE3SgA3lK2MvPqI_1OxLmRkQZ1rYpRzCqU8e/360fx360f"
        
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            "Accept": "image/avif,image/webp,image/png,image/svg+xml,*/*"
        }
        
        response = requests.get(steam_url, headers=headers, timeout=10)
        
        if response.status_code == 200:
            return steam_url
        else:
            # Fallback to weapon icon from Steam market overview
            fallback_url = f"{STEAM_COMMUNITY_BASE}/economy/images/game.ico"
            return fallback_url
            
    except requests.RequestException as e:
        print(f"Image fetch failed for {weapon_name}: {e}")
        return None

@router.get("/weapon/{weapon_name}", response_class=FileResponse)
async def get_weapon_image(weapon_name: str, quality: Optional[str] = "high"):
    """
    Get weapon icon image from Steam Community
    Returns PNG format (transparent background for icons)
    """
    
    try:
        clean_name = weapon_name.replace(" | ", "_").strip()
        
        # Determine icon size based on quality
        if quality == "low":
            size_suffix = "/90fx90f"
        elif quality == "medium":
            size_suffix = "/180fx180f" 
        else:  # high (default)
            size_suffix = "/360fx360f"
        
        weapon_icon_url = f"{STEAM_COMMUNITY_BASE}/economy/image/-9a81dlXLwJ2UUGcGlMPGsZfYjQz5fF3d94XpHtN0d6VnD7WuE3SgA3lK2MvPqI_1OxLmRkQZ1rYpRzCqU8e{size_suffix}"
        
        headers = {
            "User-Agent": "Skiniify CS:GO Item Tracker",
            "Accept-Encoding": "gzip"
        }
        
        response = requests.get(weapon_icon_url, headers=headers, timeout=10)
        
        if response.status_code == 200:
            # Return the image data as file response
            content_type = "image/png"
            return FileResponse(
                response.raw,
                media_type="image/png",
                headers={
                    "Cache-Control": "max-age=3600",  # Cache for 1 hour
                    "ETag": response.headers.get("ETag", "")
                }
            )
        else:
            # Return default weapon icon
            default_icon_url = f"{STEAM_COMMUNITY_BASE}/economy/images/game.ico"
            return FileResponse(
                default_icon_url,
                media_type="image/x-icon",
                headers={
                    "Cache-Control": "max-age=86400",  # Cache for 24 hours
                }
            )
            
    except requests.Timeout:
        raise HTTPException(status_code=504, detail="Steam images timeout")
    except requests.RequestException as e:
        raise HTTPException(status_code=503, detail=f"Failed to fetch weapon image: {str(e)}")

@router.get("/weapon-icons", response_class=JSONResponse)
async def get_all_weapon_icons(weapons: list):
    """
    Batch endpoint for multiple weapon icons
    Returns JSON with all available images
    """
    
    icons = {}
    for weapon in weapons:
        clean_name = weapon.replace(" | ", "_").strip()
        
        # Use a smaller size for thumbnail display
        icon_url = f"{STEAM_COMMUNITY_BASE}/economy/image/-9a81dlXLwJ2UUGcGlMPGsZfYjQz5fF3d94XpHtN0d6VnD7WuE3SgA3lK2MvPqI_1OxLmRkQZ1rYpRzCqU8e/90fx90f"
        
        # For now, return placeholder (actual implementation would fetch each)
        icons[clean_name] = icon_url
    
    return {"icons": icons}

@router.get("/skin/{full_skin_name}")
async def get_skin_detail_image(full_skin_name: str):
    """
    Get detailed skin image with pattern/stripe info
    Uses Steam community market trade URL to fetch actual skin images
    """
    
    try:
        # Full skin name like "AK-47 | Asiimov"
        clean_skin = full_skin_name.replace(" | ", "_").strip()
        
        # Construct market URL for this specific item
        market_url = f"{STEAM_COMMUNITY_BASE}/market/list/?appid=730&trade_from_=1&desc=1&nat=0&purchase[tradable]=1&hide_game_categories=true&security_level=consumer&sort_by=-volume%20total&price_order=asc&numpage=1"
        
        # For MVP, return default weapon icon (actual skin images require more complex scraping)
        weapon = clean_skin.split("_")[0].replace("AK", "ak").replace("AWP", "awp")
        
        return get_weapon_image(weapon)
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid skin name: {str(e)}")

@router.get("/inventory/{steam_id}/images")
async def get_inventory_images(steam_id: str):
    """
    Get images for all items in inventory (optimized batch)
    Returns JSON array of image URLs
    """
    
    # Mock data for MVP - replace with actual inventory API calls
    mock_items = [
        {"name": "AK-47", "image_url": "/api/images/weapon/AK-47"},
        {"name": "AWP", "image_url": "/api/images/weapon/AWP"},
        {"name": "M4A4", "image_url": "/api/images/weapon/M4A4"},
    ]
    
    return {
        "steam_id": steam_id,
        "total_items": len(mock_items),
        "images": [f"{STEAM_COMMUNITY_BASE}/{img}" for img in mock_items]
    }

# Default weapon icon (shown when image fails to load)
DEFAULT_WEAPON_ICON = STEAM_COMMUNITY_BASE + "/economy/images/game.ico"
