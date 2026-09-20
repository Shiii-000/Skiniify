// 🎮 Trade-Up Calculator - Clean & Minimal
const WEAR_RANGES = { 'Factory New': 0.07, 'Minimal Wear': 0.15, 'Field-Tested': 0.21, 'Well-Worn': 0.36 };

function getWearCategory(wear) {
    for (const [cat, max] of Object.entries(WEAR_RANGES)) {
        if (wear <= max) return cat;
    }
    return 'Battle-Scarred';
}

function calculateTradeUp() {
    // Get input values
    const item1 = document.getElementById('item1_weapon').value.trim();
    const skin = document.getElementById('item1_skin').value.trim();
    const wear1 = parseFloat(document.getElementById('item1_wear').value) || 0.15;
    
    const wear2 = parseFloat(document.getElementById('item2_wear').value) || 0.16;
    const wear3 = parseFloat(document.getElementById('item3_wear').value) || 0.14;

    // Validation
    if (!item1 || !document.getElementById('item2_weapon').value.trim()) {
        alert('Please fill in weapon names for all items!');
        return;
    }

    const validWear = [wear1, wear2, wear3].every(w => w >= 0 && w <= 1);
    if (!validWear) { alert('Wear must be between 0.0 and 1.0'); return; }

    // Calculate (Steam trade-up formula approximation)
    const avgWear = (wear1 + wear2 + wear3) / 3 + 0.015;
    const wearRangeMin = Math.max(0.01, avgWear - 0.02).toFixed(3);
    const wearRangeMax = (avgWear + 0.02).toFixed(3);
    
    // Estimate value
    const basePrice = (avgWear * 1000 + 50) * 0.95; // 5% discount from market avg
    const tradeFee = basePrice * 0.08;

    // Display with animation
    document.getElementById('results').classList.add('hidden');
    
    setTimeout(() => {
        document.getElementById('result_item').textContent = `${item1} | Classified (${getWearCategory(avgWear)})`;
        document.getElementById('result_wear').textContent = `[${wearRangeMin}, ${wearRangeMax}]`;
        document.getElementById('result_value').textContent = `$${basePrice.toFixed(2)}`;
        document.getElementById('result_fee').textContent = `$${tradeFee.toFixed(2)} (8% fee)`;
        
        const results = document.getElementById('results');
        results.classList.remove('hidden');
        results.classList.add('fade-in');
    }, 100);
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    console.log('🔪 Skiniify Calculator Ready!');
});