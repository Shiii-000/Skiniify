// Skiniify - API Client for all backend endpoints
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

export const api = {
  // Price endpoints
  getDualSourcePrices: async (skinName: string) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/prices/${encodeURIComponent(skinName)}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching dual source prices:', error);
      return null;
    }
  },

  getSteamPrice: async (skinName: string) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/prices/${encodeURIComponent(skinName)}/steam`);
      return response.data;
    } catch (error) {
      console.error('Error fetching Steam price:', error);
      return null;
    }
  },

  getCSFloatPrice: async (skinName: string) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/prices/${encodeURIComponent(skinName)}/csfloat`);
      return response.data;
    } catch (error) {
      console.error('Error fetching CSFloat price:', error);
      return null;
    }
  },

  getPriceComparison: async (skinName: string) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/prices/${encodeURIComponent(skinName)}/comparison`);
      return response.data;
    } catch (error) {
      console.error('Error fetching price comparison:', error);
      return null;
    }
  },

  // Trade-up calculator
  calculateTradeUp: async (items: Array<{ name: string; wear: number }>): Promise<any> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/trade-up-calculate`, items);
      return response.data;
    } catch (error) {
      console.error('Error calculating trade-up:', error);
      throw error;
    }
  },

  // Inventory
  trackInventory: async (steamId: string): Promise<any> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/inventory/track`, null, {
        params: { steam_id: steamId }
      });
      return response.data;
    } catch (error) {
      console.error('Error tracking inventory:', error);
      throw error;
    }
  },

  // Market trends
  getMarketTrends: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/prices/stats/market-trends`);
      return response.data;
    } catch (error) {
      console.error('Error fetching market trends:', error);
      return null;
    }
  },

  // Sync skin prices (bypass cache)
  syncSkinPrices: async (skinName: string) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/prices/sync/${encodeURIComponent(skinName)}`);
      return response.data;
    } catch (error) {
      console.error('Error syncing skin prices:', error);
      throw error;
    }
  },

  // Login
  login: async (steamId: string): Promise<any> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, { steam_id: steamId });
      return response.data;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  }
};

export default api;