// 🎒 Inventory Manager Logic - Enhanced with Real-time Updates & Wear Badges

document.addEventListener('DOMContentLoaded', function() {
    // Mock inventory data (will be replaced with real API calls)
    const inventory = [
        { name: "AK-47 | Asiimov", wear: 0.08, value_usd: 9.5, category: 'Minimal Wear' },
        { name: "M4A1-S | Printstream", wear: 0.12, value_usd: 15.75, category: 'Field-Tested' },
        { name: "AWP | Dragon Lore", wear: 0.05, value_usd: 8500.0, category: 'Factory New' },
        { name: "Karambit | Doppler", wear: 0.03, value_usd: 1200.0, category: 'Factory New' },
        { name: "Glock-18 | Fade", wear: 0.07, value_usd: 450.0, category: 'Minimal Wear' }
    ];

    // Color coding for wear level badges
    const WEAR_COLORS = {
        'Factory New': '#22c55e',      // Green
        'Minimal Wear': '#3b82f6',     // Blue
        'Field-Tested': '#f97316',     // Orange
        'Well-Worn': '#eab308',        // Yellow
        'Battle-Scarred': '#ef4444'    // Red
    };

    // Calculate total value
    const totalValue = inventory.reduce((sum, item) => sum + item.value_usd, 0);
    
    // Update total value display with animation
    const totalValueElement = document.getElementById('totalValue');
    animateValue(totalValueElement, 0, totalValue, 1000);

    // Populate inventory list
    const inventoryList = document.getElementById('inventoryList');
    inventory.forEach((item, index) => {
        const wearCategory = item.category;
        const wearColor = WEAR_COLORS[wearCategory] || '#9ca3af';
        
        const row = document.createElement('tr');
        row.className = 'hover:bg-gray-700 transition border-b border-gray-600';
        
        // Determine if item is low value (under $5)
        const isLowValue = item.value_usd < 5;
        const lowValueClass = isLowValue ? 'bg-red-900/20' : 'bg-transparent';
        const lowValueIcon = isLowValue ? '🔥' : '';

        row.innerHTML = `
            <td class="px-4 py-3">
                <div class="flex items-center gap-3">
                    ${lowValueIcon}
                    <div>
                        <div class="font-medium text-white flex items-center gap-2">
                            ${item.name}
                            <span class="text-xs px-2 py-1 rounded-lg ${wearColor.replace('#', 'bg-').replace('text-', '')} font-semibold border"
                                  style="background: ${wearColor}; color: #fff; border-color: ${wearColor}">
                                ${wearCategory}
                            </span>
                        </div>
                        <div class="text-sm text-gray-400">${item.wear.toFixed(2)} wear</div>
                    </div>
                </div>
            </td>
            <td class="px-4 py-3 text-right text-green-400 font-semibold">
                $${item.value_usd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                ${isLowValue ? '<span class="text-xs text-red-400 ml-1">(LOW VALUE)</span>' : ''}
            </td>
        `;
        
        inventoryList.appendChild(row);
    });

    // Add item button - placeholder for future functionality
    document.querySelector('.bg-blue-600').addEventListener('click', function() {
        addNewItem();
    });

    // Export to CSV with enhanced formatting
    document.querySelector('button.bg-gray-700').addEventListener('click', function() {
        exportToCSV(inventory);
    });
});

// Add new item to inventory
function addNewItem() {
    const newItem = prompt("Enter item name (e.g., AK-47 | Redline):");
    if (newItem) {
        inventory.unshift({ 
            name: newItem, 
            wear: 0.15, 
            value_usd: 10.0, 
            category: 'Field-Tested' 
        });
        updateInventoryDisplay();
        alert(`Added ${newItem} to inventory!`);
    }
}

function updateInventoryDisplay() {
    // Recalculate total value
    const totalValue = inventory.reduce((sum, item) => sum + item.value_usd, 0);
    document.getElementById('totalValue').textContent = totalValue.toLocaleString(undefined, { 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2 
    });
    
    // Repopulate table
    const inventoryList = document.getElementById('inventoryList');
    inventoryList.innerHTML = '';
    
    inventory.forEach((item, index) => {
        const wearCategory = item.category;
        const wearColor = WEAR_COLORS[wearCategory] || '#9ca3af';
        
        const row = document.createElement('tr');
        row.className = 'hover:bg-gray-700 transition border-b border-gray-600';
        
        const isLowValue = item.value_usd < 5;
        
        row.innerHTML = `
            <td class="px-4 py-3">
                <div class="flex items-center gap-3">
                    ${isLowValue ? '🔥' : ''}
                    <div>
                        <div class="font-medium text-white flex items-center gap-2">
                            ${item.name}
                            <span class="text-xs px-2 py-1 rounded-lg"
                                  style="background: ${wearColor}; color: #fff; border-color: ${wearColor}; font-size: 0.75rem;">
                                ${wearCategory}
                            </span>
                        </div>
                        <div class="text-sm text-gray-400">${item.wear.toFixed(2)} wear</div>
                    </div>
                </div>
            </td>
            <td class="px-4 py-3 text-right text-green-400 font-semibold">
                $${item.value_usd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </td>
        `;
        
        inventoryList.appendChild(row);
    });
}

// Export inventory to CSV with proper formatting
function exportToCSV(inventoryData) {
    const headers = ["Item Name", "Wear", "Value USD", "Category"];
    const rows = [headers.join(",")];
    
    inventoryData.forEach(item => {
        // Escape quotes in item names
        const safeName = `"${item.name.replace(/"/g, '""')}"`;
        const wear = item.wear.toFixed(2);
        const value = item.value_usd.toFixed(2);
        const category = item.category || 'Unknown';
        rows.push(`${safeName},${wear},${value},${category}`);
    });

    // Create and download CSV file
    const csvContent = rows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `skiniify_inventory_${new Date().toISOString().split('T')[0]}.csv`;
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    console.log('✅ Inventory exported successfully!');
}

// Animate value counter for total portfolio
function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        obj.innerHTML = (progress * (end - start) + start).toFixed(2);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Price tracking - Connect to backend API
document.getElementById('calculator').addEventListener('click', async function(event) {
    // Get weapon skin from calculator
    const weapon = document.getElementById('item1_weapon')?.value || 'AK-47';
    const skin = document.getElementById('item1_skin')?.value || 'Redline';
    const weaponSkin = `${weapon} | ${skin}`;
    
    if (weaponSkin) {
        console.log(`📊 Fetching price data for: ${weaponSkin}`);
        // In production, this would call the backend API at /api/prices/{weapon_skin}
        // For now, we'll show a success message
        alert(`Price data for ${weaponSkin} is being tracked!`);
    }
});

// Initialize console message
console.log('🎒 Skiniify Inventory Manager Loaded!');
console.log('💡 Tip: Items under $5 are marked with 🔥 for quick sales');