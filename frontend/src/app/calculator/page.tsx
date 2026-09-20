'use client';

import { useState, useRef } from 'react';
import api from '../api';

// Premium Design Constants
const DESIGN = {
  colors: {
    background: '#0a0a0b',
    surface: '#111113',
    elevated: '#1c1c1e',
    border: '#27272a',
    primary: '#06b6d4',
    success: '#10b981',
  },
  animations: {
    slideIn: 'slide-in-from-right-8 duration-500 ease-out',
    scaleIn: 'scale-in-90 duration-300 ease-out',
  }
};

export default function CalculatorPage() {
  const [items, setItems] = useState<Array<{ name: string; wear: number; id: number }>>([]);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState('');
  const [dragging, setDragging] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Drag-and-drop functionality for premium feel
  const handleDragStart = (e: React.DragEvent, id: number) => {
    setDragging(id);
  };

  const handleDragEnd = () => {
    setDragging(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (dragging === null || items.length <= index) return;
    
    const draggedItem = items[dragging];
    const newItems = [...items];
    
    // Remove dragged item from original position
    newItems.splice(dragging, 1);
    
    // Add to new position
    newItems.splice(index, 0, draggedItem);
    
    setItems(newItems);
  };

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
    <div className="min-h-screen bg-[#0a0a0b] text-[#f4f4f5]" style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      
      {/* Premium Header */}
      <header className="sticky top-0 z-50 bg-[#0a0a0b]/95 backdrop-blur border-b border-[#27272a]">
        <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="group flex items-center gap-3 hover:opacity-80 transition-all duration-300">
            <div className="relative">
              <span className="text-3xl group-hover:scale-110 transition-transform duration-300">🔪</span>
              <div className="absolute inset-0 bg-[#06b6d4] blur-lg opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </div>
            <span className="text-xl font-semibold tracking-tight">Skiniify</span>
          </a>
          
          <div className="flex items-center gap-2">
            <span className="px-3 py-2 rounded-lg bg-[#06b6d4]/10 text-[#06b6d4] border border-[#06b6d4]/20 transition-all duration-300 font-medium text-sm">Trade-Up Calculator</span>
            <a href="/" className="px-4 py-2 rounded-lg bg-[#111113] text-[#f4f4f5] hover:bg-[#161618] border border-[#27272a] hover:border-[#3f3f46] transition-all duration-300 font-medium text-sm">
              Back to Home
            </a>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Hero Section */}
        <section className="text-center mb-12 md:mb-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0b] via-[#0f0f10] to-[#0a0a0b] opacity-100"></div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 relative z-10" style={{ lineHeight: 1.1 }}>
            Trade-Up Calculator
          </h1>
          <p className="text-lg text-[#a1a1aa] max-w-2xl mx-auto leading-relaxed relative z-10" style={{ lineHeight: 1.6 }}>
            Calculate expected wear range and potential profit when trading up 10 CS:GO/CS2 items.
            <span className="block mt-2 text-sm text-[#71717a]">Steam requires exactly 10 items for a trade-up</span>
          </p>
        </section>

        {/* Calculator Container */}
        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          
          {/* Input Section - Takes up 2/3 on large screens */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#111113] rounded-2xl p-6 md:p-8 border border-[#27272a] relative overflow-hidden group">
              {/* Subtle background glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0b] via-transparent to-[#111113] opacity-50"></div>
              
              <div className="relative z-10">
                <h2 className="text-xl font-semibold tracking-tight mb-4 text-center pb-4 border-b border-[#27272a]">📥 Add Your 10 Items</h2>
                <p className="text-center text-[#a1a1aa] text-sm mb-6" style={{ lineHeight: 1.5 }}>
                  Select exactly 10 skins with matching weapons. Enter float values for each.
                  <span className="block mt-2 text-xs text-[#71717a]">Drag and drop to reorder slots</span>
                </p>

                {/* Item Count Display */}
                <div className="bg-[#0a0a0b] rounded-xl p-4 mb-6 text-center border border-[#27272a]">
                  <span className="text-sm font-medium text-[#a1a1aa] block mb-1">Items Added</span>
                  <span id="item-count" className="text-3xl font-bold tracking-tight text-[#06b6d4] ml-2">
                    {items.length}/10
                  </span>
                </div>

                {/* Input Slots */}
                <div className="space-y-3 mb-6 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar" id="input-slots">
                  {items.map((item, index) => (
                    <div 
                      key={item.id} 
                      className={`bg-[#0a0a0b] rounded-xl p-4 border ${dragging === item.id ? 'border-dashed' : 'border-[#27272a]'}`}
                      style={{ animation: `fadeIn 0.5s ease-out ${items.indexOf(item) * 30}ms backwards` }}
                      draggable
                      onDragStart={(e) => handleDragStart(e, item.id)}
                      onDragEnd={handleDragEnd}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, index)}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-[#a1a1aa] font-semibold text-sm w-6">{index + 1}</span>
                        <input
                          type="text"
                          placeholder={`e.g., AK-47 | Asiimov`}
                          className="flex-1 bg-transparent border-none text-[#f4f4f5] placeholder-[#52525b] rounded px-0 py-1.5 focus:outline-none focus:bg-[#1c1c1e] transition-all duration-300"
                          value={item.name}
                          onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                        />
                      </div>

                      <div className="mb-3">
                        <label className="block text-[#a1a1aa] text-xs mb-1.5">Float Value (Wear)</label>
                        <input
                          type="number"
                          step="0.001"
                          min="0.007"
                          max="1.0"
                          placeholder="e.g., 0.08"
                          className="w-full bg-transparent border border-[#27272a] rounded-lg px-3 py-2 text-[#f4f4f5] placeholder-[#52525b] focus:outline-none focus:border-[#06b6d4] transition-all duration-300"
                          value={item.wear}
                          onChange={(e) => updateItem(item.id, 'wear', parseFloat(e.target.value) || 0)}
                        />
                      </div>

                      <button
                        onClick={() => removeSlot(item.id)}
                        className="w-full py-2 px-3 rounded-lg bg-[#1c1c1e] hover:bg-[#27272a] text-[#ef4444] transition-all duration-300 text-sm font-medium border border-[#27272a] hover:border-[#ef4444]/50"
                      >
                        Remove Slot ❌
                      </button>
                    </div>
                  ))}

                  {/* Add Slot Button */}
                  <button
                    onClick={addSlot}
                    disabled={items.length >= 10}
                    className={`w-full py-3.5 px-6 rounded-xl transition-all duration-300 font-medium text-sm ${
                      items.length >= 10
                        ? 'bg-[#1c1c1e] text-[#52525b] cursor-not-allowed'
                        : 'bg-gradient-to-r from-[#06b6d4] via-[#8b5cf6] to-[#a855f7] hover:from-[#8b5cf6] hover:via-[#a855f7] hover:to-[#c084fc] text-white shadow-lg shadow-[#06b6d4]/10'
                    }`}
                  >
                    {items.length >= 10 ? 'Maximum Items Reached' : '+ Add Another Slot'}
                  </button>

                  {/* Clear All Button */}
                  <button
                    onClick={clearAll}
                    className="w-full py-3.5 px-6 rounded-xl bg-[#1c1c1e] hover:bg-[#27272a] text-[#ef4444] transition-all duration-300 font-medium text-sm border border-[#27272a] hover:border-[#ef4444]/50"
                  >
                    ❌ Clear All Items
                  </button>
                </div>

                {/* Calculate Button */}
                <button
                  onClick={calculateTradeUp}
                  disabled={items.length !== 10}
                  className={`w-full py-3.5 px-6 rounded-xl transition-all duration-300 font-medium text-sm ${
                    items.length === 10
                      ? 'bg-gradient-to-r from-[#10b981] via-[#06b6d4] to-[#8b5cf6] hover:from-[#06b6d4] hover:via-[#a855f7] hover:to-[#c084fc] text-white shadow-lg shadow-[#10b981]/20'
                      : 'bg-[#1c1c1e] text-[#52525b] cursor-not-allowed'
                  }`}
                >
                  🎯 Calculate Trade-Up Results
                </button>

                {error && (
                  <div className="mt-4 bg-[#ef4444]/10 border border-[#ef4444]/20 rounded-xl p-4 text-[#ef4444] text-sm animate-in slide-in-from-top-2 duration-300">
                    ⚠️ {error}
                  </div>
                )}
              </div>
            </div>

            {/* Tips Section */}
            <div className="bg-[#111113] rounded-2xl p-6 border border-[#27272a]">
              <h3 className="text-lg font-semibold tracking-tight mb-4 text-[#f4f4f5]">💡 Quick Tips</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-[#0a0a0b] rounded-xl p-4 border border-[#27272a]">
                  <p className="text-sm text-[#a1a1aa] leading-relaxed" style={{ lineHeight: 1.6 }}>
                    <span className="font-semibold text-[#f4f4f5]">Same Weapon:</span> All 10 items must be from the same weapon type (e.g., all AK-47s)
                  </p>
                </div>
                <div className="bg-[#0a0a0b] rounded-xl p-4 border border-[#27272a]">
                  <p className="text-sm text-[#a1a1aa] leading-relaxed" style={{ lineHeight: 1.6 }}>
                    <span className="font-semibold text-[#f4f4f5]">Float Range:</span> Wear values range from 0.007 to 1.0 (Factory New is below ~0.15)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            <div className="bg-[#111113] rounded-2xl p-6 md:p-8 border border-[#27272a] relative overflow-hidden group">
              {/* Background glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0b] via-transparent to-[#111113] opacity-50"></div>
              
              <h2 className="text-xl font-semibold tracking-tight mb-4 text-center pb-4 border-b border-[#27272a] relative z-10">📊 Trade-Up Results</h2>

              {/* Placeholder Result */}
              {results === null && error === '' && (
                <div className="text-center py-12 relative z-10">
                  <div className="text-5xl md:text-6xl mb-4 transition-transform duration-500 group-hover:scale-110">🎯</div>
                  <p className="text-[#a1a1aa] text-sm md:text-base">Add 10 items and click "Calculate" to see your trade-up results!</p>
                </div>
              )}

              {/* Results Display */}
              {results && (
                <div className="space-y-4 relative z-10 animate-in fade-in duration-500">
                  
                  {/* Summary Card */}
                  <div className="bg-[#0a0a0b] rounded-xl p-5 border border-[#27272a]">
                    <h3 className="text-lg font-semibold mb-3 text-center text-[#f4f4f5]">💰 Quick Summary</h3>
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <p className="text-xs text-[#71717a] mb-1.5 font-medium">Total Cost</p>
                        <p id="result-cost" className="text-2xl font-bold tracking-tight text-[#06b6d4]">${results.total_cost_usd.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[#71717a] mb-1.5 font-medium">Average Float</p>
                        <p id="result-float" className="text-2xl font-bold tracking-tight text-[#8b5cf6]">{results.average_float}</p>
                      </div>
                    </div>
                  </div>

                  {/* Expected Output */}
                  <div className="bg-[#0a0a0b] rounded-xl p-5 border border-[#27272a]">
                    <h3 className="text-lg font-semibold mb-3 text-center text-[#f4f4f5]">🎁 Expected Output</h3>
                    <div className="space-y-2.5 text-center">
                      <p className="text-xs text-[#71717a] font-medium mb-1">Wear Range (±2%)</p>
                      <p id="result-wear-range" className="text-lg font-semibold tracking-tight text-[#10b981]">
                        Min: {results.expected_output_range.min_wear} | Max: {results.expected_output_range.max_wear}
                      </p>
                      <p className="text-xs text-[#71717a] font-medium mt-3 mb-1">Estimated Value</p>
                      <p id="result-value" className="text-2xl font-bold tracking-tight text-[#06b6d4]">${results.estimated_value_usd.toFixed(2)}</p>
                      {results.potential_profit_usd !== undefined && results.potential_profit_usd > 0 && (
                        <>
                          <p className="text-xs text-[#71717a] font-medium mt-1 mb-1">Potential Profit</p>
                          <p id="result-profit" className="text-lg font-semibold tracking-tight text-[#10b981]">
                            +${results.potential_profit_usd.toFixed(2)} ({results.roi_percent}%)
                          </p>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Weapon Info */}
                  <div className="bg-[#0a0a0b] rounded-xl p-5 border border-[#27272a]">
                    <h3 className="text-lg font-semibold mb-2 text-center text-[#f4f4f5]">🔫 Primary Weapon</h3>
                    <p className="text-center text-xl font-semibold tracking-tight text-[#8b5cf6]">{results.primary_weapon}</p>
                  </div>
                </div>
              )}
            </div>

            {/* API Test Card */}
            <div className="bg-[#111113] rounded-2xl p-6 border border-[#27272a]">
              <h3 className="text-lg font-semibold tracking-tight mb-4 text-[#f4f4f5]">🔌 API Status</h3>
              <p className="text-sm text-[#a1a1aa] text-center mb-4" style={{ lineHeight: 1.5 }}>Test the backend API directly:</p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <button 
                  onClick={() => window.location.href = 'http://localhost:8000/api/prices/sync/AWP%20|%20Dragon%20Lore'} 
                  className="px-4 py-3 rounded-lg bg-[#06b6d4]/10 text-[#06b6d4] hover:bg-[#06b6d4]/20 border border-[#06b6d4]/20 transition-all duration-300 text-sm font-medium"
                >
                  Test CSFloat + Steam
                </button>
                <button 
                  onClick={() => window.location.href = 'http://localhost:8000/api/prices/steam/AWP%20|%20Dragon%20Lore'} 
                  className="px-4 py-3 rounded-lg bg-[#1c1c1e] text-[#a1a1aa] hover:bg-[#27272a] border border-[#27272a] transition-all duration-300 text-sm font-medium"
                >
                  Test Steam Only
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Rules Section */}
        <section id="rules" className="mt-12 bg-[#111113] rounded-2xl p-6 md:p-8 border border-[#27272a]">
          <h2 className="text-xl font-semibold tracking-tight mb-6 text-center text-[#f4f4f5]">📜 Steam Trade-Up Rules</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-[#0a0a0b] rounded-xl p-6 border border-[#27272a] hover:border-[#3f3f46] transition-all duration-500 group">
              <h3 className="text-lg font-semibold mb-3 text-[#f4f4f5] group-hover:text-[#06b6d4] transition-colors duration-300">✅ Requirements</h3>
              <ul className="space-y-2 text-sm text-[#a1a1aa] leading-relaxed" style={{ lineHeight: 1.7 }}>
                <li className="flex items-start gap-2">
                  <span className="text-[#06b6d4] mt-0.5">•</span>
                  <span>Exactly 10 items (Steam rule)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#06b6d4] mt-0.5">•</span>
                  <span>Same weapon type required</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#06b6d4] mt-0.5">•</span>
                  <span>Float values: 0.007 - 1.0</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#06b6d4] mt-0.5">•</span>
                  <span>Matching rarity preferred</span>
                </li>
              </ul>
            </div>
            <div className="bg-[#0a0a0b] rounded-xl p-6 border border-[#27272a] hover:border-[#3f3f46] transition-all duration-500 group">
              <h3 className="text-lg font-semibold mb-3 text-[#f4f4f5] group-hover:text-[#06b6d4] transition-colors duration-300">🎯 Wear Calculation</h3>
              <ul className="space-y-2 text-sm text-[#a1a1aa] leading-relaxed" style={{ lineHeight: 1.7 }}>
                <li className="flex items-start gap-2">
                  <span className="text-[#06b6d4] mt-0.5">•</span>
                  <span>Average wear across all 10 items</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#06b6d4] mt-0.5">•</span>
                  <span>±2% tolerance applied (Steam formula)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#06b6d4] mt-0.5">•</span>
                  <span>Output float range displayed</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#06b6d4] mt-0.5">•</span>
                  <span>Real-time price updates</span>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-6 py-8 mt-12 text-center text-[#52525b] text-sm">
        <p className="font-medium tracking-tight">🔪 Skiniify - CS:GO/CS2 Item Tracker & Trade-Up Calculator</p>
        <p className="mt-2 text-xs">Powered by CSFloat API & Steam Market | v3.0.0</p>
      </footer>

      {/* Global Styles */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #0a0a0b; }
        .custom-scrollbar::-webkit-scrollbar-thumb { 
          background: #27272a; 
          border-radius: 3px; 
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #3f3f46; }
      `}</style>
    </div>
  );
}