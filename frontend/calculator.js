// 🎮 Trade-Up Calculator Logic - Enhanced with Animations & Better UX

// Wear level categories for display
const WEAR_LEVELS = {
    'Factory New': { min: 0.00, max: 0.07 },
    'Minimal Wear': { min: 0.07, max: 0.15 },
    'Field-Tested': { min: 0.15, max: 0.21 },
    'Well-Worn': { min: 0.21, max: 0.36 },
    'Battle-Scarred': { min: 0.36, max: 1.0 }
};

function getWearCategory(wear) {
    for (const [category, range] of Object.entries(WEAR_LEVELS)) {
        if (wear >= range.min && wear <= range.max) {
            return category;
        }
    }
    return 'Unknown';
}

// Color coding for wear levels
function getWearColor(wear) {
    if (wear <= 0.07) return 'text-green-400';
    if (wear <= 0.15) return 'text-blue-400';
    if (wear <= 0.21) return 'text-orange-400';
    if (wear <= 0.36) return 'text-yellow-400';
    return 'text-red-400';
}

function calculateTradeUp() {
    // Get values from input fields
    const item1 = {
        weapon: document.getElementById('item1_weapon').value.trim(),
        skin: document.getElementById('item1_skin').value.trim(),
        wear: parseFloat(document.getElementById('item1_wear').value) || 0.15,
        count: 3
    };

    const item2 = {
        weapon: document.getElementById('item2_weapon').value.trim(),
        skin: document.getElementById('item2_skin').value.trim(),
        wear: parseFloat(document.getElementById('item2_wear').value) || 0.16,
        count: 1
    };

    const item3 = {
        weapon: document.getElementById('item3_weapon').value.trim(),
        skin: document.getElementById('item3_skin').value.trim(),
        wear: parseFloat(document.getElementById('item3_wear').value) || 0.14,
        count: 1
    };

    // Validation with better error messages
    const missingInputs = [];
    if (!item1.weapon) missingInputs.push('Item 1 weapon name');
    if (!item2.weapon) missingInputs.push('Item 2 weapon name');
    if (!item3.weapon) missingInputs.push('Item 3 weapon name');
    
    if (missingInputs.length > 0) {
        alert(`Please fill in: ${missingInputs.join(', ')}`);
        return;
    }

    // Validate wear values are realistic
    const validWear = [item1.wear, item2.wear, item3.wear].every(w => w >= 0 && w <= 1);
    if (!validWear) {
        alert('Please enter valid wear values (between 0.0 and 1.0)');
        return;
    }

    // Calculate average wear
    const totalWear = item1.wear * item1.count + item2.wear * item2.count + item3.wear * item3.count;
    const totalItems = item1.count + item2.count + item3.count;
    const avgWear = totalWear / totalItems;
    
    // Trade-up adds ~0.015 to each wear level (Steam's official formula approximation)
    const expectedWear = avgWear + 0.015;
    
    // Calculate wear range (+/- 2% tolerance for realistic expectations)
    const wearRangeMin = Math.max(0.01, expectedWear - 0.02).toFixed(3);
    const wearRangeMax = (expectedWear + 0.02).toFixed(3);
    
    // Get first weapon as primary (all must be same weapon type)
    const primaryWeapon = item1.weapon;
    const wearCategory = getWearCategory(expectedWear);
    
    // Calculate estimated value based on wear level
    const basePrice = (avgWear * 1000 + 50);
    const tradeFee = basePrice * 0.08;
    const profitMargin = (basePrice - tradeFee) * 0.95; // 5% discount from market average

    // Display results with animations
    animateResults({
        item: `${primaryWeapon} | Classified Item (${wearCategory})`,
        wear: `[${wearRangeMin}, ${wearRangeMax}]`,
        value: `$${basePrice.toFixed(2)} USD`,
        fee: `$${tradeFee.toFixed(2)} USD`
    });
}

function animateResults(results) {
    // Hide and show for animation effect
    const resultsSection = document.getElementById('results');
    resultsSection.classList.add('hidden');
    
    setTimeout(() => {
        document.getElementById('result_item').textContent = results.item;
        document.getElementById('result_wear').textContent = results.wear;
        document.getElementById('result_value').textContent = results.value;
        document.getElementById('result_fee').textContent = results.fee;
        
        // Add animation effect
        resultsSection.classList.remove('hidden');
        resultsSection.style.animation = 'fadeIn 0.5s ease-out';
    }, 300);
}

// Initialize with default values on page load
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎮 Skiniify Calculator Loaded!');
    console.log('💡 Tip: Use same weapon type for all 3 items for best results!');
});

// Store calculated value for inventory tracking
window.tradingValue = 0;