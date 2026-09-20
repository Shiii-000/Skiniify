import requests
from datetime import datetime

class SteamMarketFetcher:
    """Simple Steam Market API client for Skiniify"""
    
    def __init__(self):
        self.base_url = "https://steamcommunity.com/market"
        
    def get_weapon_icon(self, weapon_name: str) -> str:
        """Get weapon icon image from Steam Community"""
        # Clean name for URL
        clean_name = weapon_name.replace(" | ", "_").strip()
        
        # Use Steam's economy images endpoint
        return f"{self.base_url}/economy/images/game.ico"
    
    def get_trade_price(self, weapon_name: str, skin_name: str) -> dict:
        """
        Get trade summary for a specific skin from Steam Market
        
        Args:
            weapon_name: e.g., "AK-47"
            skin_name: e.g., "Asiimov", "Redline"
            
        Returns:
            dict with price data or error message
        """
        try:
            # Full item name (weapon | skin)
            full_item = f"{weapon_name} | {skin_name}"
            
            # Construct query URL for Steam market tradesummary
            clean_query = full_item.replace(" ", "_").replace("|", "_").lower()
            url = f"{self.base_url}/tradesummary/v1/?appid=730&item_name={clean_query}"
            
            headers = {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                "Accept-Language": "en-US,en;q=0.9"
            }
            
            response = requests.get(url, headers=headers, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                
                # Find matching item in results
                for item in data.get("items", []):
                    if full_item.lower() in item["item_name"].lower():
                        return {
                            "success": True,
                            "item_name": item["item_name"],
                            "median_price_cents": item["median_price"],  # Steam returns cents
                            "lowest_price_cents": item["lowest_price"],
                            "volume_24h": item.get("volume", 0),
                            "price_change_percent": item.get("percent_change", 0),
                            "last_updated": datetime.now().isoformat(),
                            "source": "steam_market"
                        }
                
                return {
                    "success": False,
                    "error": f"No items found for: {full_item}"
                }
            
            elif response.status_code == 404:
                return {
                    "success": False,
                    "error": "Item not found in Steam market"
                }
            
            else:
                return {
                    "success": False,
                    "error": f"HTTP {response.status_code}: Failed to fetch price"
                }
                
        except requests.Timeout:
            return {
                "success": False,
                "error": "Steam market API timeout"
            }
            
        except requests.RequestException as e:
            return {
                "success": False,
                "error": f"Network error: {str(e)}"
            }

# Create instance for easy import
fetcher = SteamMarketFetcher()

# Test it!
if __name__ == "__main__":
    # Example: Get price for AK-47 | Asiimov
    result = fetcher.get_trade_price("AK-47", "Asiimov")
    print(result)