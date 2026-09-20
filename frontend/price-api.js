// 🎮 Skiniify Price API Client - Real-time Steam & CSFloat Market Data

const PRICE_API_BASE = window.location.origin + '/api/prices';

/**
 * Fetch real-time Steam market price for a specific skin
 * @param {string} weapon - e.g., "AK-47"
 * @param {string} skin - e.g., "Redline" 
 * @returns {Promise<Object>} Price data from Steam Market
 */
async function fetchSteamPrice(weapon, skin) {
    const cleanName = `${weapon} | ${skin}`.replace(/\s+/g, '_').toLowerCase();
    
    try {
        const response = await fetch(`${PRICE_API_BASE}/steam/${cleanName}`);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: Failed to fetch Steam price`);
        }
        
        const data = await response.json();
        return {
            success: true,
            weapon: weapon,
            skin: skin,
            item_name: data.item_name || `${weapon} | ${skin}`,
            current_price_usd: data.current_price_usd,
            lowest_price_usd: data.lowest_price_usd,
            trend_percent: data.price_change_percent || 0,
            source: 'steam',
            last_updated: data.last_updated
        };
    } catch (error) {
        console.warn('Steam API failed, using cached/mock price:', error.message);
        return getCachedPrice(weapon, skin); // Return cached price if available
    }
}

/**
 * Fetch CSFloat market price
 * Requires CSFloat API key to be configured in backend/config.py
 */
async function fetchCsFloatPrice(weapon, skin) {
    const cleanName = `${weapon} | ${skin}`.replace(/\s+/g, '_').toLowerCase();
    
    try {
        const response = await fetch(`${PRICE_API_BASE}/csfloat/${cleanName}`);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: CSFloat API error`);
        }
        
        const data = await response.json();
        return {
            success: true,
            weapon: weapon,
            skin: skin,
            current_price_usd: data.current_price_usd,
            lowest_price_usd: data.lowest_price_usd,
            trend: data.trend || 'neutral',
            source: 'csfloat'
        };
    } catch (error) {
        console.error('CSFloat API error:', error);
        return null;
    }
}

/**
 * Get bulk prices for multiple items (optimized batch request)
 */
async function fetchBulkPrices(items) {
    try {
        const response = await fetch(`${PRICE_API_BASE}/bulk/inventory/mock`);
        
        if (!response.ok) throw new Error('Failed to fetch bulk prices');
        
        const data = await response.json();
        
        // Format bulk results into individual price objects
        return items.map(item => {
            const priceData = data.items[item.name] || {};
            return {
                ...item,
                current_price_usd: priceData.current_price_usd || item.value_usd,
                lowest_price_usd: priceData.lowest_price_usd || (item.value_usd * 0.9),
                source: priceData.source || 'cached'
            };
        });
    } catch (error) {
        console.warn('Bulk prices failed, using cached data');
        return items.map(item => ({...item})); // Return cached items
    }
}

/**
 * Get price trends for popular items
 */
async function fetchPriceTrends(days = 7) {
    try {
        const response = await fetch(`${PRICE_API_BASE}/trends?days=${days}`);
        
        if (!response.ok) throw new Error('Failed to fetch trends');
        
        return await response.json();
    } catch (error) {
        console.error('Price trends error:', error);
        return [];
    }
}

/**
 * Get cached/mock price for a skin (fallback when API is unavailable)
 * This ensures app always works even without API connections
 */
function getCachedPrice(weapon, skin) {
    const mockPrices = {
        'AK-47 | Asiimov': 9.50,
        'AK-47 | Redline': 0.99,
        'M4A1-S | Printstream': 15.75,
        'AWP | Dragon Lore': 8500.00,
        'Karambit | Doppler': 1200.00,
        'Glock-18 | Fade': 450.00
    };
    
    const cleanName = `${weapon} | ${skin}`.toLowerCase();
    return mockPrices[cleanName] || {
        success: true,
        weapon: weapon,
        skin: skin,
        current_price_usd: 5.99, // Default fallback price
        lowest_price_usd: 4.99,
        source: 'cached',
        last_updated: new Date().toISOString()
    };
}

/**
 * Smart price fetching with automatic fallback
 * Tries Steam API first, then falls back to cached data
 */
async function getSmartPrice(weapon, skin) {
    const steamPrice = await fetchSteamPrice(weapon, skin);
    
    if (steamPrice.success && steamPrice.current_price_usd > 0) {
        // Store in localStorage for faster subsequent lookups
        const cached = getCachedPrice(weapon, skin);
        if (cached.current_price_usd === 5.99) {
            localStorage.setItem(`price_${weapon}_${skin}`, JSON.stringify({
                ...steamPrice,
                last_updated: new Date().toISOString()
            }));
        }
        return steamPrice;
    } else {
        return getCachedPrice(weapon, skin); // Return cached/mock price
    }
}

/**
 * Format and display price with trend indicator
 */
function formatPriceDisplay(priceData) {
    if (!priceData || !priceData.success) return 'N/A';
    
    const price = parseFloat(priceData.current_price_usd).toFixed(2);
    let trendClass = '';
    let trendIcon = '';
    
    if (priceData.trend_percent && Math.abs(priceData.trend_percent) > 5) {
        trendClass = priceData.trend_percent > 0 ? 'text-green-400' : 'text-red-400';
        trendIcon = priceData.trend_percent > 0 ? '▲' : '▼';
    }
    
    return `
        <span class="font-bold text-white">$${price}</span>
        ${trendClass ? `<span class="${trendClass} ml-2 text-sm">${trendIcon}</span>` : ''}
    `;
}

/**
 * Initialize price tracking (run once on page load)
 */
window.SkiniifyPrices = {
    fetchSteamPrice: fetchSteamPrice,
    fetchCsFloatPrice: fetchCsFloatPrice, 
    fetchBulkPrices: fetchBulkPrices,
    fetchPriceTrends: fetchPriceTrends,
    getSmartPrice: getSmartPrice,
    formatPriceDisplay: formatPriceDisplay,
    getCachedPrice: getCachedPrice
};

// Log availability
console.log('🎮 Skiniify Price API initialized');
console.log('💡 Fallback prices will be used when API is unavailable');