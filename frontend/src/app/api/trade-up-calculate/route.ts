import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { items }: { items: Array<{ name: string; wear: number }> } = await request.json();

    // Validate exactly 10 items (Steam requirement)
    if (!items || items.length !== 10) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Steam trade-up requires exactly 10 items',
          hint: 'Add more items to your selection' 
        },
        { status: 400 }
      );
    }

    // Validate each item has required fields and valid wear range
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (!item.name) {
        return NextResponse.json(
          { success: false, error: `Item ${i + 1} missing 'name'`, hint: 'Add skin name' },
          { status: 400 }
        );
      }
      if (typeof item.wear !== 'number' || item.wear < 0.007 || item.wear > 1.0) {
        return NextResponse.json(
          { 
            success: false, 
            error: `Item ${i + 1} has invalid wear: ${item.wear}`,
            hint: 'Wear must be between 0.007 and 1.0' 
          },
          { status: 400 }
        );
      }
    }

    // Calculate average float
    const totalWear = items.reduce((sum, item) => sum + item.wear, 0);
    const avgWear = totalWear / items.length;

    // Calculate wear range with ±2% tolerance (Steam formula)
    const wearTolerance = 0.02;
    const minWear = Math.max(0.007, avgWear - wearTolerance);
    const maxWear = Math.min(1.0, avgWear + wearTolerance);

    // Get unique weapon types
    const weaponTypes = new Set(items.map(item => item.name.split(' | ')[0].replace('.', '')));
    const primaryWeapon = Array.from(weaponTypes)[0] || 'AK-47';

    // Mock price fetching - In production this would call /api/prices endpoint for each item
    // For now, use mock data or fetch from backend API
    let totalCostUSD = 0;
    const mockPrices = new Map([
      ['AWP | Dragon Lore', 8500],
      ['AK-47 | Asiimov', 9.50],
      ['M4A1-S | Printstream', 15.75]
    ]);

    for (const item of items) {
      const cleanName = item.name.replace(' | ', ' ').trim();
      const price = mockPrices.get(cleanName) || 10.50; // Default price if not in mock
      totalCostUSD += price;
    }

    // Calculate estimated output value
    let rarityMultiplier = 1.0;
    if (avgWear < 0.15) {
      rarityMultiplier = 3.0; // Factory New/Minimal Wear premium
    } else if (avgWear < 0.25) {
      rarityMultiplier = 1.5; // Field-Tested premium
    }

    const estimatedValueUSD = totalCostUSD * 1.8 * rarityMultiplier; // ~80% profit is realistic for trade-ups
    const potentialProfitUSD = estimatedValueUSD - totalCostUSD;
    const roiPercent = ((estimatedValueUSD - totalCostUSD) / totalCostUSD) * 100;

    return NextResponse.json({
      success: true,
      items_processed: items.length,
      total_cost_usd: Math.round(totalCostUSD * 100) / 100,
      average_float: parseFloat(avgWear.toFixed(3)),
      expected_output_range: {
        min_wear: parseFloat(minWear.toFixed(3)),
        max_wear: parseFloat(maxWear.toFixed(3))
      },
      estimated_value_usd: Math.round(estimatedValueUSD * 100) / 100,
      potential_profit_usd: Math.round(potentialProfitUSD * 100) / 100,
      roi_percent: parseFloat(roiPercent.toFixed(2)),
      primary_weapon: primaryWeapon
    });

  } catch (error) {
    console.error('Trade-up calculation error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error',
        hint: 'Please try again or contact support' 
      },
      { status: 500 }
    );
  }
}