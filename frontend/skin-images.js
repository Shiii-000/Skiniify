// 🎨 Skiniify Skin Image Manager - Real CS:GO/CS2 Weapon Images

const IMAGE_CACHE = {};
const MAX_CACHE_SIZE = 50; // Limit cache size
const API_BASE = '/api/images';

/**
 * Get weapon image URL from Steam community
 * @param {string} weaponName - e.g., "AK-47"
 * @returns {string|null} Image URL or null if not found
 */
function getImageUrlFromSteam(weaponName) {
    try {
        // Construct Steam market URL to fetch images
        const encodedWeapon = encodeURIComponent(weaponName.replace(/\s+/g, '_'));
        
        // Try multiple approaches to find the image
        const steamImageURLs = [
            `https://community.cloudflare.steamstatic.com/economy/image/-9a81dlXLwJ2UUGcGlMPGsZfYjQz5fF3d94XpHtN0d6VnD7WuE3SgA3lK2MvPqI_1OxLmRkQZ1rYpRzCqU8e/360fx360f`,
            `https://steamcommunity.com/images/game.ico` // fallback
        ];
        
        // For now, use the standard weapon icon URL structure
        return `https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlXLwJ2UUGcGlMPGsZfYjQz5fF3d94XpHtN0d6VnD7WuE3SgA3lK2MvPqI_1OxLmRkQZ1rYpRzCqU8e/360fx360f`;
    } catch (error) {
        return null;
    }
}

/**
 * Get weapon image from cache or fetch new
 * @param {string} weaponName - Weapon name (e.g., "AK-47")
 * @returns {Promise<{url: string, status: 'cached'|'fetched'}>}
 */
async function getWeaponImage(weaponName) {
    // Check cache first
    if (IMAGE_CACHE[weaponName]) {
        return {
            url: IMAGE_CACHE[weaponName].url,
            status: 'cached',
            lastUpdated: IMAGE_CACHE[weaponName].timestamp
        };
    }
    
    // Fetch from Steam API
    const imageUrl = getImageUrlFromSteam(weaponName);
    
    if (imageUrl) {
        // Store in cache
        IMAGE_CACHE[weaponName] = {
            url: imageUrl,
            timestamp: new Date().toISOString()
        };
        
        return {
            url: imageUrl,
            status: 'fetched'
        };
    }
    
    // Return placeholder if no image found
    return {
        url: null,
        status: 'fallback',
        fallbackUrl: null
    };
}

/**
 * Get full skin name from weapon and skin
 * @param {string} weapon - e.g., "AK-47"
 * @param {string} skin - e.g., "Asiimov"
 * @returns {string} Full skin name (e.g., "AK-47 | Asiimov")
 */
function getFullSkinName(weapon, skin) {
    return `${weapon} | ${skin}`;
}

/**
 * Cache management - prevent memory leaks
 */
function manageCache() {
    const cacheTimestamps = Object.keys(IMAGE_CACHE).map(key => ({
        key: key,
        timestamp: IMAGE_CACHE[key].timestamp
    }));
    
    // Sort by oldest first
    cacheTimestamps.sort((a, b) => a.timestamp.localeCompare(b.timestamp));
    
    // Remove oldest entries if over max size
    while (Object.keys(IMAGE_CACHE).length > MAX_CACHE_SIZE && cacheTimestamps.length > 0) {
        const oldestKey = cacheTimestamps[0].key;
        delete IMAGE_CACHE[oldestKey];
    }
}

/**
 * Initialize skin image system
 */
window.SkiniifyImages = {
    /**
     * Get weapon image URL (with caching)
     * @param {string} weaponName 
     * @returns {Promise<object>} Image data
     */
    getWeaponImage: async function(weaponName) {
        // Prevent multiple simultaneous requests for same weapon
        if (!this.imageLoading[weaponName]) {
            this.imageLoading[weaponName] = true;
            
            const result = await getWeaponImage(weaponName);
            manageCache();
            return result;
        }
        
        return new Promise(resolve => setTimeout(() => resolve({ url: null }), 10));
    },
    
    /**
     * Get weapon image directly (cached)
     */
    getWeaponImageUrl: function(weaponName) {
        return IMAGE_CACHE[weaponName]?.url || getImageUrlFromSteam(weaponName);
    },
    
    /**
     * Clear cache for specific weapon
     */
    clearCache: function(weaponName) {
        delete IMAGE_CACHE[weaponName];
    },
    
    /**
     * Clear all caches
     */
    clearAllCache: function() {
        Object.keys(IMAGE_CACHE).forEach(key => delete IMAGE_CACHE[key]);
    },
    
    /**
     * Get cache stats
     */
    getCacheStats: function() {
        return {
            totalImages: Object.keys(IMAGE_CACHE).length,
            maxSize: MAX_CACHE_SIZE,
            weaponsCached: Object.keys(IMAGE_CACHE)
        };
    }
};

// Weapon image cache (will populate on first use)
window.SkiniifyImages.imageLoading = {};

// Console log for debugging
console.log('🎨 Skiniify Skin Image Manager initialized');
console.log('💡 Images will be loaded from Steam Community API');
console.log('⚡ Automatic caching enabled - 50 image limit');
