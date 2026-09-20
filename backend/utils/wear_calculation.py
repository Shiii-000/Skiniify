"""Wear Level Calculation Utilities for CS:GO Items"""

def calculate_trade_up_wear(items: list) -> dict:
    """
    Calculate expected wear after trade-up
    
    Args:
        items: List of 3 weapon items with wear values
        
    Returns:
        Dictionary with expected wear range and details
    """
    
    if len(items) != 3:
        raise ValueError("Trade-up requires exactly 3 items")
    
    # Calculate average wear
    total_wear = sum(item['wear'] for item in items)
    avg_wear = total_wear / len(items)
    
    # Trade-up adds ~0.015 to each wear level (simplified formula)
    expected_wear = avg_wear + 0.015
    
    # Calculate wear range (+/- 2%)
    wear_tolerance = 0.02
    wear_range_min = round(expected_wear - wear_tolerance, 3)
    wear_range_max = round(expected_wear + wear_tolerance, 3)
    
    return {
        "average_wear": round(avg_wear, 3),
        "expected_wear": round(expected_wear, 3),
        "wear_range": [wear_range_min, wear_range_max],
        "items_processed": len(items)
    }

def calculate_item_value(wear: float, base_price_usd: float = 100.0) -> float:
    """
    Calculate item value based on wear
    
    Args:
        wear: Float between 0.0 (Factory New) and 1.0 (BattleScarred)
        base_price_usd: Base price before wear discount
        
    Returns:
        Price after wear adjustment
    """
    # Simplified wear pricing formula
    # Factory New (FN) = ~5% discount, BattleScarred (BS) = ~95% discount
    
    wear_percent = min(wear, 1.0) * 100  # Ensure within 0-100%
    
    # Non-factory items have value multiplier based on wear
    if wear >= 0.15:
        price_multiplier = 0.95  # Well-worn items ~95% base
    elif wear >= 0.08:
        price_multiplier = 0.92  # Mid range ~92% base
    else:
        price_multiplier = 0.85  # Near FN ~85% base
    
    calculated_value = base_price_usd * price_multiplier
    
    return round(calculated_value, 2)

def get_rarity_from_wear(wear: float) -> str:
    """
    Get approximate rarity based on wear level
    
    Args:
        wear: Float between 0.0 and 1.0
        
    Returns:
        Rarity name string (Mil-Spec, Restricted, Classified)
    """
    
    if wear < 0.07:
        return "Factory New"
    elif wear < 0.15:
        return "Minimal Wear"
    elif wear < 0.38:
        return "Field-Tested"
    elif wear < 0.45:
        return "Well-Worn"
    elif wear < 0.75:
        return "Battle-Scarred"
    else:
        return "Unknown"

def format_wear(wear: float) -> str:
    """Format wear as readable string"""
    
    if wear >= 0.15:
        prefix = ""
    elif wear < 0.07:
        prefix = "[FN] "
    else:
        prefix = ""
    
    return f"{prefix}{wear:.3f}"

# Test calculations (can be removed in production)
if __name__ == "__main__":
    # Test trade-up calculation
    test_items = [
        {"weapon": "AK-47", "skin": "Redline", "wear": 0.15},
        {"weapon": "AK-47", "skin": "Redline", "wear": 0.16},
        {"weapon": "AK-47", "skin": "Redline", "wear": 0.14}
    ]
    
    result = calculate_trade_up_wear(test_items)
    print("Trade-up calculation:")
    print(f"  Average wear: {result['average_wear']}")
    print(f"  Expected wear: {result['expected_wear']}")
    print(f"  Wear range: {result['wear_range']}")