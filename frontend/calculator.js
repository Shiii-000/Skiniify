// Trade-Up Calculator Logic
function calculateTradeUp() {
    // Get values from input fields
    const item1 = {
        weapon: document.getElementById('item1_weapon').value,
        skin: document.getElementById('item1_skin').value,
        wear: parseFloat(document.getElementById('item1_wear').value) || 0.15,
        count: 3
    };

    const item2 = {
        weapon: document.getElementById('item2_weapon').value,
        skin: document.getElementById('item2_skin').value,
        wear: parseFloat(document.getElementById('item2_wear').value) || 0.16,
        count: 1
    };

    const item3 = {
        weapon: document.getElementById('item3_weapon').value,
        skin: document.getElementById('item3_skin').value,
        wear: parseFloat(document.getElementById('item3_wear').value) || 0.14,
        count: 1
    };

    // Validation
    if (!item1.weapon || !item2.weapon || !item3.weapon) {
        alert('Please fill in weapon names for all items!');
        return;
    }

    // Calculate average wear
    const totalWear = item1.wear * item1.count + item2.wear * item2.count + item3.wear * item3.count;
    const avgWear = totalWear / (item1.count + item2.count + item3.count);
    
    // Trade-up adds ~0.015 to each wear level (simplified formula)
    const expectedWear = avgWear + 0.015;
    
    // Calculate wear range (+/- 2%)
    const wearRangeMin = Math.max(0, expectedWear - 0.02).toFixed(3);
    const wearRangeMax = (expectedWear + 0.02).toFixed(3);
    
    // Get first weapon as primary
    const primaryWeapon = item1.weapon;
    
    // Calculate estimated value (mock calculation)
    const basePrice = avgWear * 1000 + 50;
    const tradeFee = basePrice * 0.08;

    // Display results
    document.getElementById('result_item').textContent = `${primaryWeapon} | Classified Item`;
    document.getElementById('result_wear').textContent = `[${wearRangeMin}, ${wearRangeMax}]`;
    document.getElementById('result_value').textContent = `$${basePrice.toFixed(2)} USD`;
    document.getElementById('result_fee').textContent = `$${tradeFee.toFixed(2)} USD`;

    // Show results
    document.getElementById('results').classList.remove('hidden');
}

// Store calculated value for inventory
window.tradingValue = 0;