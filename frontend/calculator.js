// 🎮 Trade-Up Calculator - Clean & Minimal with REAL STEAM PRICES
const WEAR_RANGES = { 'Factory New': 0.07, 'Minimal Wear': 0.15, 'Field-Tested': 0.21, 'Well-Worn': 0.36 };

// Fetch real Steam price for a weapon/skin combination
async function getSteamPrice(weapon, skin) {
    try {
        const response = await fetch(`/api/prices/steam/${encodeURIComponent(`${weapon} | ${skin}`)}`);
        
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        return await response.json();
    } catch (error) {
        console.warn('Steam API failed, using fallback price:', error.message);
        return {
            success: false,
            item_name: `${weapon} | ${skin}`,
            current_price_usd: 5.99,
            lowest_price_usd: 4.99
        };
    }
}

function getWearCategory(wear) {
    for (const [cat, max] of Object.entries(WEAR_RANGES)) {
        if (wear <= max) return cat;
    }
    return 'Battle-Scarred';
}

function calculateTradeUp() {
    const item1Weapon = document.getElementById('item1_weapon').value.trim();
    const skin = document.getElementById('item1_skin').value.trim();
    const wear1 = parseFloat(document.getElementById('item1_wear').value) || 0.15;
    
    const wear2 = parseFloat(document.getElementById('item2_wear').value) || 0.16;
    const wear3 = parseFloat(document.getElementById('item3_wear').value) || 0.14;

    if (!item1Weapon || !document.getElementById('item2_weapon').value.trim()) {
        alert('Please fill in weapon names for all items!');
        return;
    }

    const validWear = [wear1, wear2, wear3].every(w => w >= 0 && w <= 1);
    if (!validWear) { alert('Wear must be between 0.0 and 1.0'); return; }

    const avgWear = (wear1 + wear2 + wear3) / 3 + 0.015;
    const wearRangeMin = Math.max(0.01, avgWear - 0.02).toFixed(3);
    const wearRangeMax = (avgWear + 0.02).toFixed(3);
    
    const basePrice = (avgWear * 1000 + 50) * 0.95;
    const tradeFee = basePrice * 0.08;

    // Get weapon image and Steam price in parallel
    Promise.all([
        window.SkiniifyImages.getWeaponImageUrl(item1Weapon),
        getSteamPrice(item1Weapon, skin)
    ]).then(([imageData, priceData]) => {
        const imageUrl = imageData?.url || null;
        
        // Display results with animations
        document.getElementById('results').classList.add('hidden');
        
        setTimeout(() => {
            let resultText = `${item1Weapon} | Classified (⚔️ ${getWearCategory(avgWear)})`;
            
            // Add real Steam price if available
            if (priceData.success) {
                const steamPrice = `$${priceData.current_price_usd}`;
                const change = priceData.price_change_percent 
                    ? `(${priceData.price_change_percent > 0 ? '▲' : '▼'} ${Math.abs(priceData.price_change_percent)}%)` 
                    : '';
                
                resultText += `\n<div class="steam-price" style="color: #22c55e; margin-top: 8px; font-size: 0.9rem;">${steamPrice}${change}</div>`;
            }
            
            if (imageUrl) {
                resultText = `🖼️ <img src="${imageUrl}" class="inline-weapon-icon" width="48" height="48" style="border-radius: 50%; border: 2px solid #4b5563; transition: all 0.3s ease;"> ${resultText}`;
            }
            
            document.getElementById('result_item').innerHTML = resultText;
            document.getElementById('result_wear').textContent = `[${wearRangeMin}, ${wearRangeMax}]`;
            document.getElementById('result_value').textContent = `$${basePrice.toFixed(2)}`;
            document.getElementById('result_fee').textContent = `$${tradeFee.toFixed(2)} (8% Steam fee)`;
            
            const results = document.getElementById('results');
            results.classList.remove('hidden');
            results.classList.add('fade-in');
        }, 100);
    });
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    console.log('🔪 Skiniify Calculator Ready with Live Steam Prices!');
});