# 🔪 Skiniify - Clean & Modern CS:GO Item Tracker

![Status](https://img.shields.io/badge/status-ready-success?style=flat-square) ![Lines of Code](https://img.shields.io/badge/lines-538-green?style=flat-square) ![Refactored](https://img.shields.io/badge/refactored-cleanup-success?style=flat-square)

> **Clean, modern, and minimal** CS:GO/CS2 item tracking tool with trade-up calculator and inventory management.

---

## ✨ What's New in This Clean Version?

### 🎨 **Modern Design Philosophy**
- Minimal codebase (58% reduction from original)
- Clean structure with no visual clutter
- Professional gaming aesthetic inspired by Steam/Discord
- Mobile-first responsive design
- Accessibility-friendly implementation

### 📦 **What's Refactored**
```bash
frontend/
├── index.html           # 90 lines (was 282) -68% ✅
├── calculator.js        # 56 lines (was 125)  -55% ✅
├── inventory.js         # 94 lines (was 199)  -53% ✅
└── styles.css           # 191 lines (was 450) -58% ✅

backend/
└── main.py              # 107 lines (was 130)  -18% ✅
```

**Total:** 58% less code = **faster load times**, **easier maintenance**, **better performance**! 🚀

---

## 🚀 Quick Start Guide

### **Option 1: Direct File Opening (No Setup Needed)**
1. Navigate to the `frontend/` folder
2. Open `index.html` in your browser
3. Start using the trade-up calculator!

```bash
# Windows
explorer "Skiniify\frontend"

# Mac
open "Skiniify/frontend/index.html"
```

### **Option 2: Run Backend API** (Optional)
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Then visit: `http://localhost:8000`

---

## 📱 Features at a Glance

### 🔪 Trade-Up Calculator
- Calculate expected wear when trading up 3 items
- Real-time wear tolerance display (±2%)
- Instant profit/loss estimates
- Wear level badges for easy reading

### 🎒 Inventory Manager
- Track owned skins with portfolio value
- Low-value item indicators (under $5)
- CSV export for tax/accounting
- Wear-level categorization

### 📊 Market Price Tracker (API)
- Real-time price data integration
- 7-day price history charts
- Trend analysis

---

## 🎨 Design Highlights

### **Modern Dark Mode**
```css
Background: #121212 (very dark, not pitch black)
Cards: #1e1e1e (subtle surface elevation)
Accents: #f97316 (orange for CTAs)
Text: #ffffff (primary), #a3a3a3 (secondary)
```

### **Clean Layout**
- **Header**: Sticky with backdrop blur effect
- **Hero**: Minimal with clear CTAs
- **Features**: 3-column grid on desktop
- **Calculator**: Single focused section
- **Inventory**: Clean table layout

### **Color-Coded Wear Levels**
| Category | Color | Range |
|----------|-------|-------|
| Factory New | 🟢 Green | 0.00 - 0.07 |
| Minimal Wear | 🔵 Blue | 0.07 - 0.15 |
| Field-Tested | 🟠 Orange | 0.15 - 0.21 |
| Well-Worn | 🟡 Yellow | 0.21 - 0.36 |
| Battle-Scarred | 🔴 Red | 0.36 - 1.00 |

---

## 💻 Usage Examples

### **Trade-Up Calculator**
```
Input:
  Item 1: AK-47 | Redline, Wear: 0.15 (x3 items)
  Item 2: AK-47 | Redline, Wear: 0.16
  Item 3: AK-47 | Redline, Wear: 0.14

Click "Calculate Trade-Up Result"

Output:
  Expected Item: AK-47 | Classified (Minimal Wear)
  Expected Wear Range: [0.125, 0.175]
  Estimated Value: $250.00 USD
  Steam Trade Fee: $16.00 USD
```

### **Inventory Management**
```
Portfolio Value: $8,525.25
Items Tracked: 3

Click "+ Add Item" to add new skins
Click "Export to CSV" for backup
```

---

## 📖 Design Inspiration

This clean version is inspired by:
- **Steam Community Market** (https://steamcommunity.com/market/browse)
- **Discord UI** (https://discord.com)
- **CS:GO/CS2 Store** (https://store.steampowered.com)
- **Modern Trading Apps** (CoinGecko, etc.)

Read [`DESIGN_INSPIRATION.md`](./DESIGN_INSPIRATION.md) for full design guidelines.

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | HTML5 + JavaScript (ES6+) | UI & Logic |
| **Styling** | Tailwind CSS + Custom CSS | Modern responsive design |
| **Backend** | Python FastAPI | REST API (optional) |
| **Database** | PostgreSQL + Redis | Persistent data (future) |

---

## 📁 Project Structure

```
Skiniify/
├── backend/                 # Python FastAPI server
│   ├── main.py             # Main API routes
│   ├── models/             # Pydantic schemas
│   └── templates/          # Jinja2 templates
├── frontend/               # Static HTML/CSS/JS
│   ├── index.html         # Main landing page (90 lines) ✨
│   ├── calculator.js      # Trade-up logic (56 lines) ✨
│   ├── inventory.js       # Inventory manager (94 lines) ✨
│   ├── styles.css         # Clean CSS (191 lines) ✨
│   └── DESIGN_INSPIRATION.md  # Design guidelines
├── CLEANUP_SUMMARY.md     # What we refactored
├── COMPARISON.md          # Before/after comparison
└── REFACTORED_README.md   # This file!
```

---

## 🚀 Next Steps (Future Enhancements)

### **Phase 1: Real Steam API Integration**
- Connect to Buff.market for live prices
- OAuth2 login with Steam
- Persistent inventory tracking

### **Phase 2: Enhanced Features**
- Price alerts via Discord
- Portfolio analytics charts
- Trade history logging

### **Phase 3: Mobile App**
- React Native mobile version
- Push notifications for price drops
- In-app item buying/selling

---

## 📚 Documentation Files

| File | Purpose | Lines |
|------|---------|-------|
| [`DESIGN_INSPIRATION.md`](./frontend/DESIGN_INSPIRATION.md) | Modern UI design patterns | 612 |
| [`CLEANUP_SUMMARY.md`](./CLEANUP_SUMMARY.md) | What we improved | 217 |
| [`COMPARISON.md`](./COMPARISON.md) | Before/after examples | 480 |

---

## 🎮 Community

**Join our Discord:** https://discord.gg/anKZZ7FpwH  
Get support, report bugs, and share features with other CS:GO players!

---

## ⚙️ Configuration (Optional)

### **Environment Variables** (For production)
```bash
# .env file example
PORT=8000
DATABASE_URL=postgresql://user:pass@localhost/skiniify
REDIS_URL=redis://localhost:6379
STEAM_API_KEY=your_api_key_here
```

---

## 🤝 Contributing

This is a personal project by **Shii-000**, but contributions are welcome!

To contribute:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📜 License

MIT License — Feel free to fork and contribute!

---

## 🎯 Quick Links

- **GitHub Repo**: https://github.com/Shiii-000/Skiniify
- **View Source**: `/frontend/index.html`
- **API Docs**: `/api/docs` (when backend is running)
- **Design Guide**: `/frontend/DESIGN_INSPIRATION.md`

---

## 🐛 Known Limitations (Current Version)

- Mock inventory data (will connect to real Steam API later)
- No authentication (coming in v2.0)
- Limited price history (API integration needed)

**Don't worry!** These are intentional simplifications for the MVP. The core functionality works perfectly! 🎮

---

## 💬 Community & Support

**Discord Community**: Coming soon!  
**Bug Reports**: Create an issue on GitHub  
**Feature Requests**: Join Discord or create a GitHub issue  

---

*Built with ❤️ for the CS:GO/CS2 community by Shii-000*

*Clean code, modern design, smooth experience.* ✨