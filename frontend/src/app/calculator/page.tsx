'use client';

import { useState } from 'react';
import api from '@/src/api';

export default function CalculatorPage() {
  const [items, setItems] = useState<Array<{ name: string; wear: number; id: number }>>([]);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState('');

  const addSlot = () => {
    if (items.length >= 10) return;
    setItems([...items, { name: '', wear: 0.1, id: Date.now() }]);
  };

  const removeSlot = (id: number) => {
    setItems(items.filter(item => item.id !== id));
  };

  const updateItem = (id: number, field: keyof typeof items[0], value: any) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const clearAll = () => {
    if (!confirm('Clear all items?')) return;
    setItems([]);
    setResults(null);
    setError('');
  };

  const calculateTradeUp = async () => {
    if (items.length !== 10) {
      setError('Steam requires exactly 10 items!');
      return;
    }

    try {
      const inputData = items.map(item => ({
        name: item.name || 'Unknown Skin',
        wear: typeof item.wear === 'number' ? item.wear : 0.1
      }));

      const result = await api.calculateTradeUp(inputData);
      
      if (!result.success) {
        setError(result.error || 'Calculation failed');
        return;
      }

      setResults(result);
      setError('');
    } catch (err: any) {
      console.error('Calculation error:', err);
      setError(err.message || 'API Error - Please check backend is running');
      setResults(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gray-800/95 backdrop-blur border-b border-gray-700 shadow-lg">
        <nav className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <a href="/" className="text-2xl font-bold hover:text-orange-500 transition group flex items-center gap-2">
            <span className="text-3xl group-hover:scale-110 transition-transform">🔪</span>
            Skiniify
          </a>
          <div className="flex gap-4">
            <a href="/calculator" className="text-gray-300 hover:text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition font-semibold">Trade-Up Calculator</a>
            <a href="/" className="text-gray-300 hover:text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition">Back to Home</a>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <section className="text-center mb-10 relative overflow-hidden">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">🔪 Trade-Up Calculator</h1>
          <p className="text-gray-300 text-sm md:text-base max-w-2xl mx-auto">
            Calculate expected wear range and potential profit when trading up 10 CS:GO/CS2 items.
            Steam requires exactly 10 items for a trade-up!
          </p>
        </section>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
            <h2 className="text-2xl font-bold mb-4 text-center">📥 Add Your 10 Items</h2>
            <p className="text-center text-gray-400 text-sm mb-6">
              Select exactly 10 skins with matching weapons. Enter float values for each.
            </p>

            {/* Item Count Display */}
            <div className="bg-gray-900 rounded-lg p-4 mb-4 text-center">
              <span className="text-gray-400">Items Added:</span>
              <span id="item-count" className="text-3xl font-bold text-orange-500 ml-2">{items.length}/10</span>
            </div>

            {/* Input Slots */}
            <div className="space-y-4 mb-6 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar" id="input-slots">
              {items.map((item, index) => (
                <div key={item.id} className="bg-gray-900 rounded-lg p-4 border border-gray-700 fade-in">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-gray-400 font-bold">{index + 1}</span>
                    <input
                      type="text"
                      placeholder={`e.g., AK-47 | Asiimov`}
                      className="flex-1 bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                      value={item.name}
                      onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="block text-gray-400 text-sm mb-1">Float Value (Wear):</label>
                    <input
                      type="number"
                      step="0.001"
                      min="0.007"
                      max="1.0"
                      placeholder="e.g., 0.08"
                      className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                      value={item.wear}
                      onChange={(e) => updateItem(item.id, 'wear', parseFloat(e.target.value) || 0)}
                    />
                  </div>

                  <button
                    onClick={() => removeSlot(item.id)}
                    className="bg-red-900/50 hover:bg-red-800/50 text-red-400 px-3 py-1 rounded text-sm transition w-full"
                  >
                    Remove Slot ❌
                  </button>
                </div>
              ))}

              {/* Add Slot Button */}
              <button
                onClick={addSlot}
                disabled={items.length >= 10}
                className={`w-full py-3 px-4 rounded-lg transition font-bold ${
                  items.length >= 10
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {items.length >= 10 ? 'Maximum Items Reached' : '+ Add Another Slot'}
              </button>

              {/* Clear All Button */}
              <button
                onClick={clearAll}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition"
              >
                ❌ Clear All Items
              </button>
            </div>

            {/* Calculate Button */}
            <button
              onClick={calculateTradeUp}
              disabled={items.length !== 10}
              className={`w-full py-3 px-4 rounded-lg transition font-bold text-white ${
                items.length === 10
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-gray-700 text-gray-500 cursor-not-allowed'
              }`}
            >
              🎯 Calculate Trade-Up Results
            </button>

            {error && (
              <div className="mt-4 bg-red-900/30 border border-red-800 rounded p-3 text-red-400 text-sm">
                ⚠️ {error}
              </div>
            )}
          </div>

          {/* Result Section */}
          <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
            <h2 className="text-2xl font-bold mb-4 text-center">📊 Trade-Up Results</h2>

            {/* Placeholder Result */}
            {results === null && error === '' && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🎯</div>
                <p className="text-gray-400">Add 10 items and click "Calculate" to see your trade-up results!</p>
              </div>
            )}

            {/* Results Display */}
            {results && (
              <div className="space-y-4 fade-in">
                {/* Summary Card */}
                <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                  <h3 className="text-xl font-bold mb-2 text-center">💰 Quick Summary</h3>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-gray-400 text-sm">Total Cost</p>
                      <p id="result-cost" className="text-2xl font-bold text-orange-500">${results.total_cost_usd.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Average Float</p>
                      <p id="result-float" className="text-2xl font-bold text-blue-500">{results.average_float}</p>
                    </div>
                  </div>
                </div>

                {/* Expected Output */}
                <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                  <h3 className="text-xl font-bold mb-2 text-center">🎁 Expected Output</h3>
                  <div className="space-y-2 text-center">
                    <p className="text-gray-400 text-sm">Wear Range</p>
                    <p id="result-wear-range" className="text-xl font-bold text-green-500">
                      Min: {results.expected_output_range.min_wear} | Max: {results.expected_output_range.max_wear}
                    </p>
                    <p className="text-gray-400 text-sm mt-2">Estimated Value</p>
                    <p id="result-value" className="text-2xl font-bold text-orange-500">${results.estimated_value_usd.toFixed(2)}</p>
                    {results.potential_profit_usd !== undefined && results.potential_profit_usd > 0 && (
                      <>
                        <p className="text-gray-400 text-sm mt-1">Potential Profit</p>
                        <p id="result-profit" className="text-lg font-bold text-green-500">
                          +${results.potential_profit_usd.toFixed(2)} ({results.roi_percent}%)
                        </p>
                      </>
                    )}
                  </div>
                </div>

                {/* Weapon Info */}
                <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                  <h3 className="text-xl font-bold mb-2 text-center">🔫 Primary Weapon</h3>
                  <p className="text-center text-xl font-bold text-blue-500">{results.primary_weapon}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Rules Section */}
        <section id="rules" className="mt-12 bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
          <h2 className="text-2xl font-bold mb-4 text-center">📜 Steam Trade-Up Rules</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-gray-900 rounded-lg p-4">
              <h3 className="text-xl font-bold mb-2">✅ Requirements</h3>
              <ul className="space-y-1 text-gray-300">
                <li>• Exactly 10 items (Steam rule)</li>
                <li>• Same weapon type required</li>
                <li>• Float values: 0.007 - 1.0</li>
                <li>• Matching rarity preferred</li>
              </ul>
            </div>
            <div className="bg-gray-900 rounded-lg p-4">
              <h3 className="text-xl font-bold mb-2">🎯 Wear Calculation</h3>
              <ul className="space-y-1 text-gray-300">
                <li>• Average wear across all 10 items</li>
                <li>• ±2% tolerance applied</li>
                <li>• Output float range displayed</li>
                <li>• Real-time price updates</li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-in { animation: fadeIn 0.3s ease-out; }
        
        .custom-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #1f2937; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #4b5563; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #6b7280; }
      `}</style>
    </div>
  );
}