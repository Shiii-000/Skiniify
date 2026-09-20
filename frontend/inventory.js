// Inventory Manager Logic
document.addEventListener('DOMContentLoaded', function() {
    // Mock inventory data
    const inventory = [
        { name: "AK-47 | Asiimov", wear: 0.08, value_usd: 9.5 },
        { name: "M4A1-S | Printstream", wear: 0.12, value_usd: 15.75 },
        { name: "AWP | Dragon Lore", wear: 0.05, value_usd: 8500.0 },
        { name: "Karambit | Doppler", wear: 0.03, value_usd: 1200.0 },
        { name: "Glock-18 | Fade", wear: 0.07, value_usd: 450.0 }
    ];

    // Calculate total value
    const totalValue = inventory.reduce((sum, item) => sum + item.value_usd, 0);
    
    // Update total value display
    document.getElementById('totalValue').textContent = totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    // Populate inventory list
    const inventoryList = document.getElementById('inventoryList');
    inventory.forEach((item, index) => {
        const row = document.createElement('tr');
        row.className = 'hover:bg-gray-750 transition';
        
        row.innerHTML = `
            <td class="px-4 py-3">
                <div class="font-medium text-white">${item.name}</div>
                <div class="text-sm text-gray-400">${item.wear.toFixed(2)} wear</div>
            </td>
            <td class="px-4 py-3 text-right text-green-400">
                $${item.value_usd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </td>
        `;
        
        inventoryList.appendChild(row);
    });

    // Add item button (placeholder)
    document.querySelector('.bg-blue-600').addEventListener('click', function() {
        alert('Inventory management features coming soon!');
    });

    // Export to CSV (placeholder)
    document.querySelector('button.bg-gray-700').addEventListener('click', function() {
        exportToCSV();
    });
});

// Export inventory to CSV
function exportToCSV() {
    const headers = ["Item Name", "Wear", "Value USD"];
    const rows = [headers.join(",")];
    
    const inventory = document.querySelectorAll('#inventoryList tr');
    inventory.forEach(tr => {
        const cells = tr.querySelectorAll('td');
        if (cells.length >= 2) {
            const name = cells[0].innerText.split('\n')[0]; // Get first line
            const wear = cells[0].innerText.split('\n')[1]?.trim() || 'N/A';
            const value = cells[1].innerText.replace('$', '').trim();
            rows.push(`${name},${wear},${value}`);
        }
    });

    // Create and download CSV file
    const csvContent = rows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'inventory_export.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// Price tracking (placeholder API)
document.querySelector('#calculator button').addEventListener('click', async function() {
    // In production, this would call the backend API at /api/prices/{weapon_skin}
    console.log('Price tracking feature - will connect to backend API');
});