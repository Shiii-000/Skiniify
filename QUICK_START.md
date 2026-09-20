# 🚀 Skiniify - Quick Start Guide

## ⚡ **Get Running in 5 Minutes!**

### **Step 1: Set Up Backend API**

```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
nano .env  # Edit with your CSFloat API key
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Backend will be available at**: `http://localhost:8000`

### **Step 2: Set Up Frontend**

```bash
cd ../frontend
npm install
npm run dev
```

**Frontend will be available at**: `http://localhost:3000`

---

## 🧪 **Test the API**

Visit these endpoints in your browser:

### **1. Trade-Up Calculator**
- Frontend: `http://localhost:3000/calculator`
- Backend: `http://localhost:8000/api/trade-up-calculate` (POST with JSON body)

### **2. Price Lookup**
- CSFloat + Steam: `http://localhost:8000/api/prices/sync/AWP%20|%20Dragon%20Lore`

### **3. Market Trends**
- Stats: `http://localhost:8000/api/prices/stats/market-trends`

---

## 📊 **Features to Test**

### ✅ Trade-Up Calculator (10 Items)
1. Visit `http://localhost:3000/calculator`
2. Add 10 items with names and float values
3. Click "Calculate Trade-Up Results"
4. View expected output, profit, and ROI!

### ✅ Inventory Dashboard
1. Visit `http://localhost:3000`
2. Enter your Steam ID (6-digit number)
3. Load your inventory
4. See portfolio value and item list

### ✅ Price API Endpoints
- Test `/api/prices/sync/{skin_name}` for real-time pricing
- Compare CSFloat vs Steam Market prices
- View price trends

---

## 🎯 **Key Features**

### 🔪 Trade-Up Calculator
- **10-item requirement** (Steam official rule)
- Real-time wear range calculation
- Profit/ROI estimation
- Dual-source pricing

### 📊 Market Tracker
- **CSFloat API integration** (Primary source)
- Steam Market API (Secondary source)
- Price comparison with difference %
- Historical trends (future feature)

### 🎒 Inventory Manager
- Real-time portfolio valuation
- Low-value item identification
- Wear-level categorization
- CSV export (coming soon)

---

## 🔧 **Troubleshooting**

### **"API Key not configured" Error**
Make sure `.env` file exists in `backend/` folder with:
```bash
CSFLOAT_API_KEY=yGq3TrqGFY5EAfxLLcd3ONZGK5DPDcnp
```

### **"Build Failed" Error**
```bash
cd frontend
rm -rf node_modules .next
npm install
npm run build
npm start
```

### **"Port Already in Use"**
```bash
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Or use different port
uvicorn main:app --reload --host 0.0.0.0 --port 8001
```

---

## 🌐 **Deployment Options**

### **GitHub Pages (Static HTML)**
```bash
cd frontend
npm run build
# Upload .next folder to GitHub Pages
```

### **Railway.app (Full Backend + Database)**
1. Connect GitHub repo to Railway
2. Railway will auto-detect Python backend
3. Deploy with PostgreSQL database

---

## 💬 **Community**

Join our Discord: https://discord.gg/anKZZ7FpwH  
Get support, report bugs, and share features!

---

## 📚 **More Docs**

- [README.md](README.md) - Full documentation
- [PRICE_INTEGRATION_GUIDE.md](PRICE_INTEGRATION_GUIDE.md) - API setup
- [IMAGE_FEATURE_SUMMARY.md](IMAGE_FEATURE_SUMMARY.md) - Image system
- [CLEANUP_SUMMARY.md](CLEANUP_SUMMARY.md) - Code improvements

---

**Built by Shii-000** for the CS:GO/CS2 community!  
Powered by CSFloat API & Steam Market | v3.0.0