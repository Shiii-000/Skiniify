import Head from 'next/head'
import { useState } from 'react'

export default function CalculatorPage() {
  const [item1, setItem1] = useState({ weapon: '', skin: '', wear: 0.15, count: 3 })
  const [item2, setItem2] = useState({ weapon: '', skin: '', wear: 0.16, count: 1 })
  const [item3, setItem3] = useState({ weapon: '', skin: '', wear: 0.14, count: 1 })
  
  // Simplified trade-up calculation (replace with API call later)
  const calculateTradeUp = () => {
    if (!item1.weapon || !item2.weapon || !item3.weapon) {
      alert('Please fill in weapon names')
      return
    }
    
    // Mock result
    return {
      expected_item: 'AK-47 | Classified Item',
      expected_wear_range: [0.14, 0.16],
      estimated_value_usd: 2500,
      trade_fee_estimate_usd: 15
    }
  }
  
  return (
    <>
      <Head>
        <title>Trade-Up Calculator | Skiniify</title>
      </Head>
      
      <div className="min-h-screen bg-gray-900">
        {/* Header */}
        <header className="bg-gray-800 py-4 px-6 border-b border-gray-700">
          <div className="max-w-4xl mx-auto flex justify-between items-center">
            <h1 className="text-2xl text-white font-bold">Trade-Up Calculator 🔪</h1>
          </div>
        </header>
        
        {/* Calculator Section */}
        <main className="max-w-4xl mx-auto px-6 py-8">
          <div className="bg-gray-800 rounded-xl p-8">
            <h2 className="text-xl text-white font-semibold mb-6">Enter Your Items</h2>
            
            {/* Item 1 */}
            <div className="mb-4">
              <label className="block text-sm text-gray-400 mb-2">Item 1 (x3 items)</label>
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder="Weapon (e.g., AK-47)"
                  value={item1.weapon}
                  onChange={(e) => setItem1({...item1, weapon: e.target.value})}
                  className="px-3 py-2 bg-gray-700 text-white rounded"
                />
                <input
                  type="text"
                  placeholder="Skin (e.g., Redline)"
                  value={item1.skin}
                  onChange={(e) => setItem1({...item1, skin: e.target.value})}
                  className="px-3 py-2 bg-gray-700 text-white rounded"
                />
                <input
                  type="number"
                  placeholder="Wear (0.0-1.0)"
                  step="0.01"
                  value={item1.wear}
                  onChange={(e) => setItem1({...item1, wear: parseFloat(e.target.value)})}
                  className="px-3 py-2 bg-gray-700 text-white rounded"
                />
              </div>
            </div>
            
            {/* Item 2 */}
            <div className="mb-4">
              <label className="block text-sm text-gray-400 mb-2">Item 2</label>
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder="Weapon"
                  value={item2.weapon}
                  onChange={(e) => setItem2({...item2, weapon: e.target.value})}
                  className="px-3 py-2 bg-gray-700 text-white rounded"
                />
                <input
                  type="text"
                  placeholder="Skin"
                  value={item2.skin}
                  onChange={(e) => setItem2({...item2, skin: e.target.value})}
                  className="px-3 py-2 bg-gray-700 text-white rounded"
                />
                <input
                  type="number"
                  placeholder="Wear"
                  step="0.01"
                  value={item2.wear}
                  onChange={(e) => setItem2({...item2, wear: parseFloat(e.target.value)})}
                  className="px-3 py-2 bg-gray-700 text-white rounded"
                />
              </div>
            </div>
            
            {/* Item 3 */}
            <div className="mb-6">
              <label className="block text-sm text-gray-400 mb-2">Item 3</label>
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder="Weapon"
                  value={item3.weapon}
                  onChange={(e) => setItem3({...item3, weapon: e.target.value})}
                  className="px-3 py-2 bg-gray-700 text-white rounded"
                />
                <input
                  type="text"
                  placeholder="Skin"
                  value={item3.skin}
                  onChange={(e) => setItem3({...item3, skin: e.target.value})}
                  className="px-3 py-2 bg-gray-700 text-white rounded"
                />
                <input
                  type="number"
                  placeholder="Wear"
                  step="0.01"
                  value={item3.wear}
                  onChange={(e) => setItem3({...item3, wear: parseFloat(e.target.value)})}
                  className="px-3 py-2 bg-gray-700 text-white rounded"
                />
              </div>
            </div>
            
            {/* Calculate Button */}
            <button
              onClick={calculateTradeUp}
              className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition"
            >
              Calculate Trade-Up Result
            </button>
          </div>
          
          {/* Results Section (shown when calculated) */}
          <div className="mt-8 bg-gray-800 rounded-xl p-8">
            <h2 className="text-xl text-white font-semibold mb-4">Results</h2>
            
            <div className="space-y-3">
              <div className="p-4 bg-green-900/30 rounded-lg border border-green-800">
                <p className="text-green-400 text-sm font-medium">✓ Expected Item</p>
                <p className="text-white text-lg">AK-47 | Classified Item</p>
              </div>
              
              <div className="p-4 bg-blue-900/30 rounded-lg border border-blue-800">
                <p className="text-blue-400 text-sm font-medium">✓ Expected Wear Range</p>
                <p className="text-white text-lg">[0.140, 0.160]</p>
              </div>
              
              <div className="p-4 bg-purple-900/30 rounded-lg border border-purple-800">
                <p className="text-purple-400 text-sm font-medium">✓ Estimated Value</p>
                <p className="text-white text-lg">$2,500.00 USD</p>
              </div>
              
              <div className="p-4 bg-orange-900/30 rounded-lg border border-orange-800">
                <p className="text-orange-400 text-sm font-medium">✓ Steam Trade Fee (8%)</p>
                <p className="text-white text-lg">$15.00 USD</p>
              </div>
            </div>
          </div>
          
          {/* Notes */}
          <div className="mt-6 p-4 bg-gray-700 rounded-xl">
            <h3 className="text-white font-semibold mb-2">💡 Tips:</h3>
            <ul className="text-sm text-gray-400 space-y-1">
              <li>• Always use the same weapon type for trade-ups</li>
              <li>• Wear levels are additive in trade-up calculations</li>
              <li>• Steam takes 8% trading fee on market transactions</li>
            </ul>
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