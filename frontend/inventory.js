// 🎒 Inventory Manager - Clean & Minimal
const WEAR_COLORS = { 'Factory New': '#22c55e', 'Minimal Wear': '#3b82f6', 'Field-Tested': '#f97316', 'Well-Worn': '#eab308', 'Battle-Scarred': '#ef4444' };

document.addEventListener('DOMContentLoaded', () => {
    // Mock inventory (will connect to API later)
    const inventory = [
        { name: "AK-47 | Asiimov", wear: 0.08, value_usd: 9.5, category: 'Minimal Wear' },
        { name: "M4A1-S | Printstream", wear: 0.12, value_usd: 15.75, category: 'Field-Tested' },
        { name: "AWP | Dragon Lore", wear: 0.05, value_usd: 8500.0, category: 'Factory New' }
    ];

    // Calculate total value with animation
    const totalValue = inventory.reduce((sum, item) => sum + item.value_usd, 0);
    animateValue(document.getElementById('totalValue'), 0, totalValue, 1000);

    // Populate table
    renderInventory(inventory);
});

function getWearCategory(wear) {
    for (const [cat, max] of Object.entries(WEAR_RANGES)) { if (wear <= max) return cat; }
    return 'Battle-Scarred';
}

function renderInventory(items) {
    const table = document.getElementById('inventoryList');
    table.innerHTML = '';
    
    items.forEach(item => {
        const wearCategory = item.category;
        const isLowValue = item.value_usd < 5;
        
        const row = document.createElement('tr');
        row.className = 'table-row fade-in';
        row.innerHTML = `
            <td class="item-cell">
                <div class="item-name">${isLowValue ? '🔥 ' : ''}${item.name}</div>
                <div class="wear-info">${item.wear.toFixed(2)} wear | ${wearCategory}</div>
            </td>
            <td class="text-right item-value">$${item.value_usd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
        `;
        table.appendChild(row);
    });
}

function addNewItem() {
    const newItem = prompt("Item name (e.g., AK-47 | Redline):");
    if (!newItem) return;
    
    inventory.unshift({ 
        name: newItem, 
        wear: 0.15, 
        value_usd: 10.0, 
        category: 'Field-Tested' 
    });
    renderInventory(inventory);
    alert(`Added ${newItem}!`);
}

function exportToCSV() {
    const headers = ["Item Name", "Wear", "Value USD", "Category"];
    const rows = [headers.join(",")];
    
    inventory.forEach(item => {
        const safeName = `"${item.name.replace(/"/g, '""')}"`;
        rows.push(`${safeName},${item.wear.toFixed(2)},${item.value_usd.toFixed(2)},${item.category}`);
    });

    const blob = new Blob([rows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `skiniify_inventory_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

function animateValue(el, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        el.textContent = (progress * (end - start) + start).toFixed(2);
        if (progress < 1) window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
}

// Button event listeners
document.querySelector('.bg-blue-600')?.addEventListener('click', addNewItem);
document.querySelector('button.bg-gray-700')?.addEventListener('click', exportToCSV);

console.log('🎒 Inventory Manager Ready!');