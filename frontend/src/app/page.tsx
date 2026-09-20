'use client';

import { useState, useEffect } from 'react';
import api from '../api';

// Premium Design System Constants
const DESIGN = {
  colors: {
    background: '#0a0a0b',
    surface: '#111113',
    elevated: '#1c1c1e',
    border: '#27272a',
    primary: '#06b6d4',
    success: '#10b981',
  },
  typography: {
    heading: 'text-[#f4f4f5]',
    subheading: 'text-[#a1a1aa]',
    body: 'text-[#71717a]',
  }
};

export default function Home() {
  const [inventory, setInventory] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [steamId, setSteamId] = useState('');
  
  // Skeleton loading state for premium feel
  const [skeletonState, setSkeletonState] = useState(true);

  useEffect(() => {
    // Simulate skeleton loading sequence
    const timers = [];
    for (let i = 0; i < 3; i++) {
      timers.push(setTimeout(() => {
        setSkeletonState(prev => prev === false ? true : false);
      }, 500 * (i + 1)));
    }
    return () => timers.forEach(clearTimeout);
  }, []);

  const loadInventory = async (id: string) => {
    try {
      setLoading(true);
      setSkeletonState(true);
      
      // Simulate API delay for smoother animations
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const data = await api.trackInventory(id);
      setInventory(data);
    } catch (err: any) {
      console.error('Error loading inventory:', err);
    } finally {
      setLoading(false);
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
            <a href="/calculator" className="px-4 py-2 rounded-lg bg-[#111113] text-[#f4f4f5] hover:bg-[#161618] border border-[#27272a] hover:border-[#3f3f46] transition-all duration-300 font-medium text-sm">
              Trade-Up Calculator
            </a>
            <span className="px-3 py-2 rounded-lg bg-[#06b6d4]/10 text-[#06b6d4] border border-[#06b6d4]/20 transition-all duration-300 font-medium text-sm">v3.0</span>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6" style={{ lineHeight: 1.1 }}>
            Track Your Collection.
            <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-[#06b6d4] via-[#8b5cf6] to-[#f59e0b]">
              Master the Market.
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-[#a1a1aa] mb-10 max-w-2xl mx-auto leading-relaxed" style={{ lineHeight: 1.6 }}>
            Premium CS:GO/CS2 skin tracking with real-time prices, intelligent portfolio analysis, and professional trade-up calculations.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Inventory Summary Cards - Asymmetric Layout */}
        {loading && !skeletonState ? (
          <div className="grid md:grid-cols-3 gap-6 mb-12 animate-in fade-in duration-500">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-[#111113] rounded-2xl p-6 border border-[#27272a] animate-in slide-in-from-bottom-4 duration-500 delay-100">
                <p className="text-sm font-medium text-[#a1a1aa] mb-2">Metric {i}</p>
                <div className="h-8 bg-[#1c1c1e] rounded-lg w-3/4 animate-pulse"></div>
              </div>
            ))}
          </div>
        ) : inventory ? (
          /* Real Data Display */
          <>
            {/* Large Value Display */}
            <div className="bg-gradient-to-br from-[#111113] via-[#161618] to-[#111113] rounded-2xl p-8 md:p-10 mb-8 border border-[#27272a] relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-[#06b6d4]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              
              <p className="text-sm font-medium text-[#a1a1aa] mb-4">Total Collection Value</p>
              <div className="flex items-baseline justify-center md:justify-start gap-3 mb-2">
                <span className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-[#f4f4f5]">
                  ${inventory.total_value_usd?.toFixed(2) || '0.00'}
                </span>
                <span className="text-xl text-[#10b981] font-medium flex items-center gap-1">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  Top 15% of users
                </span>
              </div>
              
              <p className="text-center md:text-left text-[#71717a] text-sm mt-2">
                {inventory.total_items} skins tracked across your inventory
              </p>
            </div>

            {/* Items Grid */}
            <div className="bg-[#111113] rounded-2xl border border-[#27272a] overflow-hidden">
              <div className="px-6 py-4 border-b border-[#27272a] flex items-center justify-between">
                <h3 className="text-lg font-semibold tracking-tight text-[#f4f4f5]">Your Collection</h3>
                <span className="px-3 py-1 rounded-full bg-[#06b6d4]/10 text-[#06b6d4] text-xs font-medium border border-[#06b6d4]/20">
                  {inventory.total_items} items
                </span>
              </div>
              
              {inventory.items && inventory.items.length > 0 ? (
                <div className="p-6 grid md:grid-cols-2 gap-4">
                  {inventory.items.slice(0, 6).map((item: any) => (
                    <div 
                      key={item.name} 
                      className="bg-[#1c1c1e] rounded-xl p-5 border border-[#27272a] hover:border-[#3f3f46] transition-all duration-300 group cursor-pointer"
                      style={{ animation: `fadeIn 0.5s ease-out ${inventory.items.indexOf(item) * 50}ms backwards` }}
                    >
                      <div className="flex items-start gap-4">
                        {/* Skin Image Placeholder */}
                        <div className="w-16 h-16 bg-[#111113] rounded-lg flex items-center justify-center border border-[#27272a] group-hover:scale-105 transition-transform duration-300">
                          <span className="text-2xl">🔫</span>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-[#f4f4f5] truncate" title={item.name}>{item.name}</h4>
                          <p className="text-sm text-[#a1a1aa] mt-1">{item.weapon || 'CS:GO'}</p>
                          
                          <div className="flex items-center gap-3 mt-3">
                            <span className="px-2.5 py-1 rounded-md bg-[#06b6d4]/10 text-[#06b6d4] text-xs font-medium border border-[#06b6d4]/20">
                              {item.rarity || 'Classified'}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#27272a]">
                        <div>
                          <p className="text-xs text-[#71717a] mb-0.5">Value</p>
                          <p className="text-lg font-semibold text-[#f4f4f5]">${item.value_usd?.toFixed(2) || 'N/A'}</p>
                        </div>
                        <span className="text-xs text-[#71717a]">Float: {item.wear?.toFixed(3) || 'N/A'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Empty State */
                <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                  <div className="w-16 h-16 bg-[#1c1c1e] rounded-2xl flex items-center justify-center mb-4 border border-[#27272a]">
                    <span className="text-3xl grayscale opacity-50">📦</span>
                  </div>
                  <h3 className="text-lg font-medium text-[#f4f4f5] mb-2">Your inventory is empty</h3>
                  <p className="text-sm text-[#a1a1aa] max-w-md">
                    Connect your Steam account to start tracking your skin collection and see your portfolio value in real-time.
                  </p>
                </div>
              )}

              <div className="px-6 py-4 bg-[#0a0a0b] border-t border-[#27272a] flex items-center justify-between">
                <span className="text-sm text-[#71717a]">Showing {inventory.items?.slice(0, 6).length} of {inventory.total_items} items</span>
                <button className="px-4 py-2 rounded-lg bg-[#111113] text-[#a1a1aa] hover:bg-[#161618] hover:text-[#f4f4f5] border border-[#27272a] transition-all duration-300 text-sm font-medium">
                  View All Items
                </button>
              </div>
            </div>
          </>
        ) : (
          /* Load Inventory Form */
          <div className="max-w-md mx-auto bg-[#111113] rounded-2xl p-8 border border-[#27272a] mb-8 animate-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-xl font-semibold tracking-tight text-center mb-6 text-[#f4f4f5]">📦 Load Your Steam Inventory</h3>
            
            <div className="space-y-5">
              <label className="block">
                <span className="text-sm font-medium text-[#a1a1aa] block mb-2.5">Steam ID (6-digit number)</span>
                <input
                  type="number"
                  placeholder="76561198000000000"
                  value={steamId}
                  onChange={(e) => setSteamId(e.target.value)}
                  className="w-full bg-[#0a0a0b] border border-[#27272a] rounded-xl px-4 py-3.5 text-[#f4f4f5] placeholder-[#52525b] focus:outline-none focus:border-[#06b6d4] transition-all duration-300 font-mono"
                  style={{ fontFamily: 'SF Mono, Monaco, Consolas, monospace' }}
                />
              </label>
              
              <button
                onClick={() => loadInventory(steamId)}
                disabled={!steamId || loading}
                className={`w-full py-3.5 px-6 rounded-xl font-medium text-sm transition-all duration-300 ${
                  !steamId || loading
                    ? 'bg-[#1c1c1e] text-[#52525b] cursor-not-allowed'
                    : 'bg-gradient-to-r from-[#06b6d4] via-[#0eeea1] to-[#06b6d4] hover:from-[#0eeea1] hover:via-[#06b6d4] text-white shadow-lg shadow-[#06b6d4]/25'
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Loading...
                  </span>
                ) : '📥 Load Inventory'}
              </button>
            </div>

            <p className="text-xs text-[#52525b] mt-6 text-center">
              Your Steam ID can be found in Steam → Settings → Account → Steam ID
            </p>
          </div>
        )}

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {/* Quick Start */}
          <div className="bg-gradient-to-br from-[#0a0a0b] via-[#111113] to-[#0a0a0b] rounded-2xl p-6 border border-[#27272a] hover:border-[#3f3f46] transition-all duration-500 group">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[#06b6d4]/10 rounded-xl flex items-center justify-center border border-[#06b6d4]/20 shrink-0 group-hover:scale-110 transition-transform duration-300">
                <span className="text-xl">🚀</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold tracking-tight text-[#f4f4f5] mb-2">Quick Start Guide</h3>
                <p className="text-sm text-[#a1a1aa] leading-relaxed" style={{ lineHeight: 1.6 }}>
                  Get your collection set up in minutes. Connect Steam, view your portfolio, and track market movements.
                </p>
              </div>
            </div>
          </div>

          {/* Market Insights */}
          <div className="bg-gradient-to-br from-[#0a0a0b] via-[#111113] to-[#0a0a0b] rounded-2xl p-6 border border-[#27272a] hover:border-[#3f3f46] transition-all duration-500 group">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[#8b5cf6]/10 rounded-xl flex items-center justify-center border border-[#8b5cf6]/20 shrink-0 group-hover:scale-110 transition-transform duration-300">
                <span className="text-xl">📊</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold tracking-tight text-[#f4f4f5] mb-2">Market Insights</h3>
                <p className="text-sm text-[#a1a1aa] leading-relaxed" style={{ lineHeight: 1.6 }}>
                  Real-time price tracking, historical trends, and intelligent portfolio analysis for smarter decisions.
                </p>
              </div>
            </div>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-6 py-8 mt-12 border-t border-[#27272a]">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <p className="text-sm text-[#a1a1aa] font-medium tracking-tight">🔪 Skiniify</p>
            <p className="text-xs text-[#52525b] mt-1">Premium CS:GO/CS2 Inventory Tracker & Trade-Up Calculator</p>
          </div>
          
          <div className="flex items-center gap-6">
            <a href="https://discord.gg/anKZZ7FpwH" target="_blank" rel="noopener noreferrer" 
               className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#5865F2]/10 text-[#5865F2] border border-[#5865F2]/20 hover:bg-[#5865F2]/20 transition-all duration-300 font-medium text-sm group">
              <span className="group-hover:scale-110 transition-transform">🎮</span>
              Join Discord Community
            </a>
          </div>

          <div className="text-center md:text-right">
            <p className="text-xs text-[#52525b]">Powered by CSFloat API & Steam Market</p>
            <p className="text-xs text-[#52525b] mt-0.5">v3.0.0 • Built by Shii-000</p>
          </div>
        </div>
      </footer>

      {/* Global Styles */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        * {
          scroll-behavior: smooth;
        }
        
        /* Custom scrollbar for premium feel */
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: #0a0a0b;
        }
        ::-webkit-scrollbar-thumb {
          background: #27272a;
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #3f3f46;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}