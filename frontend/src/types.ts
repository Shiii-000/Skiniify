// Skiniify - CS2 Skin Data Types
export interface Skin {
  id: string;
  name: string;
  weapon: string;
  rarity: string;
  exterior: string;
  float_min?: number;
  float_max?: number;
  csfloat_price_usd?: number;
  steam_price_usd?: number;
  image_url?: string;
}

export interface PriceData {
  source: 'CSFloat' | 'Steam Market' | null;
  price_usd: number;
  lowest_price_usd: number;
  volume_24h?: number;
  last_updated: string;
}

export interface SkinPriceResponse {
  skin: string;
  csfloat?: {
    price_usd: number;
    lowest_price_usd: number;
    volume_24h?: number;
  };
  steam?: {
    price_usd: number;
    lowest_price_usd: number;
  };
  comparison: {
    difference_absolute: number;
    difference_percent: number;
  };
}

export interface TradeUpItem {
  name: string;
  wear: number;
  weapon?: string;
}

export interface TradeUpResult {
  success: boolean;
  total_cost_usd: number;
  average_float: number;
  expected_output_range: {
    min_wear: number;
    max_wear: number;
  };
  estimated_value_usd: number;
  potential_profit_usd?: number;
  roi_percent?: number;
}

export interface InventoryItem extends Skin {
  paint_seed?: string;
  pattern?: string;
  stattrak?: boolean;
  souvenir?: boolean;
  stickers?: Array<{ name: string; position: number }>;
}

export interface MarketTrend {
  name: string;
  change_percent: number;
  trend: 'up' | 'down';
}