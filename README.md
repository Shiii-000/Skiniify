# Skiniify - CS:GO/CS2 Item Tracker 🎮🔪

**Built by Shii-000** for the CS:GO/CS2 community. Track market prices, manage inventory, and calculate trade-up profits with our lightweight tool with **REAL-TIME STEAM MARKET PRICES**!

---

## ✨ Features

- **🔪 Trade-Up Calculator**: Calculate expected item + wear when trading up 3 items
- **📊 Market Price Tracker**: Real-time Steam & CSFloat price data
- **🎒 Inventory Manager**: Track owned skins with live portfolio values
- **💰 Profit Calculator**: Instant ROI on trades with real market prices
- **🖼️ Weapon Images**: Actual CS:GO/CS2 weapon icons from Steam Community!
- **🆓 Free Forever**: Core tools are free, premium alerts available later

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | HTML5 + Vanilla JavaScript (ES6+) |
| **Styling** | Tailwind CSS + Custom CSS |
| **Backend** | Python FastAPI |
| **Database** | PostgreSQL + Redis (optional) |
| **Market Data** | Steam Community Market API |

---

## 🚀 Quick Start

### Option 1: Direct File Opening (No Setup!)
```bash
# Navigate to frontend folder
cd Skiniify/frontend
explorer .  # Windows file explorer

# Then double-click index.html
```

### Option 2: Run Backend API (Optional)
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Then visit: `http://localhost:8000`

---

## 🎨 New Features (v2.0)

### **Real-Time Price Integration!** ✨
- Live Steam Community Market prices
- CSFloat API support (when configured)
- Automatic price caching for speed
- Price trend indicators (▲ green / ▼ red)

### **Weapon Image System!** 🖼️
- Real weapon icons from Steam Community
- Circular display with hover glow effects
- Pre-loading for instant first-time use
- Automatic caching (50 images limit)

---

## 📡 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/trade-up-calculate` | POST | Calculate trade-up result |
| `/api/inventory/track` | POST | Track inventory |
| `/api/prices/steam/{skin}` | GET | Steam market price |
| `/api/prices/csfloat/{skin}` | GET | CSFloat price (optional) |
| `/api/prices/trends?days=7` | GET | Price trends |
| `/api/images/weapon/{weapon}` | GET | Weapon icon image |

---

## 📚 Documentation Files

- **PRICE_INTEGRATION_GUIDE.md** - API setup & pricing details
- **IMAGE_FEATURE_SUMMARY.md** - Image system documentation
- **CLEANUP_SUMMARY.md** - Code refactoring improvements
- **DESIGN_INSPIRATION.md** - Modern gaming UI patterns
- **COMPARISON.md** - Before/after code examples

---

## 🎮 Community

**Join our Discord:** https://discord.gg/anKZZ7FpwH  
Get support, report bugs, and share features with other CS:GO players!

---

## 📜 License

MIT License — Feel free to fork and contribute!

---

*Built with ❤️ for the CS:GO/CS2 community by Shii-000*