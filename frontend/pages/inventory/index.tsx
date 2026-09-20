import Head from 'next/head'

export default function InventoryPage() {
  // Mock inventory data (replace with API call)
  const inventory = [
    { name: "AK-47 | Asiimov", wear: 0.08, value_usd: 9.5 },
    { name: "M4A1-S | Printstream", wear: 0.12, value_usd: 15.75 },
    { name: "AWP | Dragon Lore", wear: 0.05, value_usd: 8500.0 }
  ]
  
  const totalValue = inventory.reduce((sum, item) => sum + item.value_usd, 0)

  return (
    <>
      <Head>
        <title>Inventory Manager | Skiniify</title>
      </Head>
      
      <div className="min-h-screen bg-gray-900">
        {/* Header */}
        <header className="bg-gray-800 py-4 px-6 border-b border-gray-700">
          <div className="max-w-4xl mx-auto flex justify-between items-center">
            <h1 className="text-2xl text-white font-bold">🎒 Inventory Manager</h1>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition">
              Connect Steam Account
            </button>
          </div>
        </header>
        
        {/* Inventory Section */}
        <main className="max-w-4xl mx-auto px-6 py-8">
          {/* Total Value Card */}
          <div className="bg-gradient-to-r from-green-900/30 to-green-800/20 rounded-xl p-6 mb-8 border border-green-700">
            <h2 className="text-white text-lg font-semibold mb-2">Total Portfolio Value</h2>
            <p className="text-4xl text-green-400 font-bold">${totalValue.toLocaleString()}</p>
            <p className="text-gray-400 mt-2 text-sm">{inventory.length} items tracked</p>
          </div>
          
          {/* Items Table */}
          <div className="bg-gray-800 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-white font-semibold">Item Name</th>
                  <th className="px-4 py-3 text-left text-white font-semibold">Wear</th>
                  <th className="px-4 py-3 text-right text-white font-semibold">Value (USD)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {inventory.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-750">
                    <td className="px-4 py-3 text-white">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-gray-400">{item.wear.toFixed(2)} wear</div>
                    </td>
                    <td className="px-4 py-3 text-right text-green-400">
                      ${item.value_usd.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Actions */}
          <div className="mt-6 flex gap-3">
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition">
              + Add Item
            </button>
            
            <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition">
              Export to CSV
            </button>
          </div>
        </main>
        
        {/* Footer */}
        <footer className="bg-gray-800 py-4 px-6 mt-8 border-t border-gray-700">
          <div className="max-w-4xl mx-auto text-center text-gray-400">
            <p>© 2024 Skiniify — Built by Shii-000</p>
          </div>
        </footer>
      </div>
    </>
  )
}