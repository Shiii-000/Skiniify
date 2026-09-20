'use client';

import { useState } from 'react';
import api from '@/src/api';

export default function Home() {
  const [inventory, setInventory] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [steamId, setSteamId] = useState('');

  const loadInventory = async (id: string) => {
    try {
      const data = await api.trackInventory(id);
      setInventory(data);
    } catch (err: any) {
      console.error('Error loading inventory:', err);
      alert(err.message || 'Failed to load inventory');
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
            <a href="/calculator" className="text-gray-300 hover:text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition">Trade-Up Calculator</a>
            <a href="/" className="text-gray-300 hover:text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition font-semibold">Dashboard</a>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <section className="text-center mb-10 relative overflow-hidden">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">📊 Inventory Dashboard</h1>
          <p className="text-gray-300 text-sm md:text-base max-w-2xl mx-auto">
            Track your CS:GO/CS2 skin collection with real-time prices from CSFloat & Steam Market
          </p>
        </section>

        {/* Inventory Loader */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto"></div>
            <p className="text-gray-400 mt-4">Loading your inventory...</p>
          </div>
        ) : inventory ? (
          <>
            {/* Summary Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700 text-center">
                <h3 className="text-gray-400 text-sm mb-2">Total Items</h3>
                <p className="text-4xl font-bold text-orange-500">{inventory.total_items}</p>
              </div>
              <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700 text-center">
                <h3 className="text-gray-400 text-sm mb-2">CSFloat Value</h3>
                <p className="text-3xl font-bold text-blue-500">${inventory.total_value_usd?.toFixed(2) || '0.00'}</p>
              </div>
              <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700 text-center">
                <h3 className="text-gray-400 text-sm mb-2">Lowest Value</h3>
                <p className="text-2xl font-bold text-green-500">${inventory.lowest_value_item?.value_usd?.toFixed(2) || 'N/A'}</p>
              </div>
            </div>

            {/* Inventory Grid */}
            <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
              <h3 className="text-xl font-bold mb-4">Your Collection</h3>
              {inventory.items && inventory.items.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {inventory.items.map((item: any) => (
                    <div key={item.name} className="bg-gray-900 rounded-lg p-4 border border-gray-700 hover:border-blue-500 transition">
                      <h4 className="font-bold text-orange-500">{item.name}</h4>
                      <p className="text-sm text-gray-400">{item.weapon || 'CS:GO'}</p>
                      <div className="mt-2 space-y-1 text-sm">
                        <p className="flex justify-between">
                          <span className="text-gray-500">Float:</span>
                          <span>{item.wear?.toFixed(3)}</span>
                        </p>
                        <p className="flex justify-between">
                          <span className="text-gray-500">CSFloat:</span>
                          <span>${item.value_usd?.toFixed(2) || 'N/A'}</span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-center py-8">No items in inventory yet.</p>
              )}
            </div>
          </>
        ) : (
          <>
            {/* Load Inventory Form */}
            <div className="max-w-md mx-auto bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700 mb-8">
              <h3 className="text-xl font-bold mb-4 text-center">📦 Load Your Steam Inventory</h3>
              <div className="space-y-4">
                <label className="block">
                  <span className="text-gray-400 text-sm">Steam ID (6-digit number):</span>
                  <input
                    type="number"
                    placeholder="76561198000000000"
                    value={steamId}
                    onChange={(e) => setSteamId(e.target.value)}
                    className="mt-1 w-full bg-gray-900 border border-gray-600 rounded px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  />
                </label>
                <button
                  onClick={() => loadInventory(steamId)}
                  disabled={!steamId}
                  className={`w-full py-3 px-4 rounded-lg transition font-bold text-white ${
                    steamId ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  📥 Load Inventory
                </button>
              </div>
            </div>

            {/* Quick Links */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-blue-900/50 to-blue-800/30 rounded-xl p-6 shadow-lg border border-blue-700">
                <h3 className="text-xl font-bold mb-3">💡 Quick Start</h3>
                <ol className="space-y-2 text-gray-300 text-sm">
                  <li>Enter your Steam ID (6-digit number)</li>
                  <li>Click "Load Inventory"</li>
                  <li>View your collection value</li>
                  <li>Track price changes in real-time</li>
                </ol>
              </div>
              <div className="bg-gradient-to-br from-orange-900/50 to-orange-800/30 rounded-xl p-6 shadow-lg border border-orange-700">
                <h3 className="text-xl font-bold mb-3">📊 Features</h3>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li>✅ Real-time CSFloat & Steam pricing</li>
                  <li>✅ Portfolio value calculation</li>
                  <li>✅ Trade-up profit estimation</li>
                  <li>✅ Price history charts (coming soon)</li>
                </ul>
              </div>
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto px-4 py-8 mt-12 text-center text-gray-500 text-sm">
        <p>🔪 Skiniify - CS:GO/CS2 Item Tracker & Trade-Up Calculator</p>
        <p className="mt-2">Powered by CSFloat API & Steam Market | Discord: <a href="https://discord.gg/anKZZ7FpwH" target="_blank" rel="noopener noreferrer" className="text-orange-500 hover:text-orange-400">discord.gg/anKZZ7FpwH</a></p>
      </footer>
    </div>
  );
}