# 🔪 Skiniify - CS:GO/CS2 Inventory Tracker & Trade-Up Calculator

**Built by Shii-000** for the CS:GO/CS2 community with **REAL-TIME STEAM MARKET PRICES** and **CSFloat API integration**!

---

## 📱 **Platform Features**

### 🔪 **Trade-Up Calculator**
- Calculate expected wear range when trading up 10 items (Steam requirement)
- Real-time wear level calculations using Steam's official formulas
- Instant profit/loss estimates based on CSFloat & Steam Market prices
- Wear tolerance display (±2%) for realistic expectations

### 📊 **Market Price Tracker**
- **Dual-source pricing**: CSFloat + Steam Market comparison
- 7-day price history charts with trend analysis
- Current value tracking for owned items
- Price alerts for trending up/down items

### 🎒 **Inventory Manager**
- Track owned skins with real-time portfolio value calculation
- Identify low-value items (under $5) for quick sales
- Export inventory data to CSV for tax/accounting purposes
- Wear-level categorization (Factory New, Minimal Wear, etc.)

### 🔐 **Steam Account Integration**
- OAuth login via Steam OpenID (future feature)
- Automatic inventory pull from Steam API
- Portfolio tracking across multiple accounts
- Trade history analysis and profit/loss reports

---

## 🛠️ **Technical Stack**

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Frontend** | Next.js 14 + React 18 | Full-stack React application |
| **Language** | TypeScript 5.0+ | Type-safe development |
| **Styling** | Tailwind CSS 3.3 | Modern utility-first styling |
| **Backend** | Python FastAPI | REST API for all backend logic |
| **Database** | PostgreSQL + Redis | User data + price caching (optional) |
| **Market Data** | CSFloat API + Steam Market | Real-time pricing |

---

## 🚀 **Quick Start Guide**

### **Option 1: Run Backend API First**

```bash
# Navigate to backend folder
cd Skiniify/backend

# Install Python dependencies
pip install -r requirements.txt

# Set up environment variables (create .env file)
cp .env.example .env
nano .env  # Edit with your CSFloat API key

# Start FastAPI server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Visit**: `http://localhost:8000`

### **Option 2: Run Full Next.js App**

```bash
# Navigate to frontend folder
cd Skiniify/frontend

# Install Node.js dependencies
npm install

# Start development server
npm run dev
```

**Visit**: `http://localhost:3000`

---

## 📡 **API Endpoints**

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/trade-up-calculate` | POST | Calculate trade-up from 10 items |
| `/api/inventory/track` | POST | Track user's inventory |
| `/api/prices/{skin}` | GET | Dual-source price (CSFloat + Steam) |
| `/api/prices/{skin}/steam` | GET | Steam market price only |
| `/api/prices/{skin}/csfloat` | GET | CSFloat price only |
| `/api/prices/{skin}/comparison` | GET | Detailed price comparison |
| `/api/prices/sync/{skin}` | GET | Force refresh prices (bypass cache) |
| `/api/prices/stats/market-trends` | GET | Market trend statistics |

### **Trade-Up Calculator Example**

```bash
curl -X POST http://localhost:8000/api/trade-up-calculate \
  -H "Content-Type: application/json" \
  -d '[
    {"name": "AK-47 | Asiimov", "wear": 0.08},
    {"name": "AK-47 | Redline", "wear": 0.12},
    ... (10 items total)
  ]'
```

### **Price Lookup Example**

```bash
curl http://localhost:8000/api/prices/sync/AWP\_%20Dragon\ Lore
```

---

## 🎨 **Design & UX**

- **Dark Mode Gaming Aesthetic**: Inspired by Steam and Discord UI
- **Responsive Design**: Works on mobile, tablet, desktop
- **Gaming Color Palette**: Orange accents (#f97316), blue highlights (#3b82f6)
- **Tailwind CSS**: Modern utility-first styling with CDN support

---

## 💰 **Monetization Strategies**

| Tier | Price | Features | Goal |
|------|-------|----------|------|
| **Free** | $0/mo | Basic calculator, inventory view, mock data | Viral growth + user acquisition |
| **Premium** | $4.99/mo | Real Steam API access, price alerts, CSV export | Recurring revenue (5-10% conversion) |
| **Enterprise** | Custom | White-label for CS content creators, API access | B2B partnerships |

---

## 📈 **Development Status**

| Milestone | Status | Notes |
|-----------|--------|-------|
| **MVP (Minimum Viable Product)** | ✅ Complete | Trade-up calculator + inventory tracking functional |
| **Static HTML Deployment** | ✅ Ready | Can deploy to GitHub Pages immediately |
| **Steam API Integration** | 🟡 Planned | Need actual market data source |
| **User Authentication** | 🟡 Planned | Steam OAuth login system |
| **Discord Bot** | 🟢 Future | Community engagement + announcements |

---

## 🎯 **Current Priority**

Get the static HTML version live on GitHub Pages immediately so:
1. Friends can see it working
2. Collect initial user feedback
3. Build momentum before full backend integration

---

## 🌐 **Access Points**

| Type | URL | Notes |
|------|-----|-------|
| **GitHub Pages** | `https://shiii-000.github.io/skiniify` | Static HTML version |
| **Railway Backend** | TBD | Full Python backend |
| **Local Development** | `http://localhost:3000` | Next.js dev server |
| **API Server** | `http://localhost:8000` | FastAPI endpoints |

---

## 🎮 **Target Audience**

- **CS:GO/CS2 Skin Traders**: Players who actively trade items and want price tracking
- **Inventory Managers**: People who own expensive skins and need portfolio management
- **Trade-Up Enthusiasts**: Users who frequently use the trade-up mechanic
- **Content Creators**: Streamers needing inventory tools for their audience

---

## 🔮 **Future Roadmap**

1. **Month 1**: Connect real Steam API (Buff.market or CS.Money data)
2. **Month 2**: Add user accounts with persistent inventory tracking
3. **Month 3**: Mobile app version (React Native)
4. **Month 4**: Discord bot integration for price alerts + community features
5. **Month 6**: Marketplace integration (sell items directly through Skiniify)

---

## 💬 **How to Use This App**

1. Navigate to `http://localhost:3000` (local) or GitHub Pages URL
2. Click "Trade-Up Calculator" to calculate profit from 10 items
3. View mock inventory with portfolio value
4. Test API endpoints at `/api/prices/sync/AWP%20Dragon%20Lore` for backend logic
5. Share with CS trading communities on Reddit/Discord

---

## 📚 **Documentation Files**

- **README.md** - This project documentation
- **PRICE_INTEGRATION_GUIDE.md** - API setup & pricing details
- **IMAGE_FEATURE_SUMMARY.md** - Image system documentation
- **CLEANUP_SUMMARY.md** - Code refactoring improvements
- **DESIGN_INSPIRATION.md** - Modern gaming UI patterns

---

## 🎮 **Community**

**Join our Discord:** https://discord.gg/anKZZ7FpwH  
Get support, report bugs, and share features with other CS:GO players!

---

## ✅ **What Makes Skiniify Unique**

- **Lean Focus**: Built specifically for trade-up calculator and inventory tracking
- **Gaming-First Design**: Dark mode UI that feels native to CS players
- **Free Tier First**: Core tools free forever, monetize through premium features
- **Community-Driven**: Discord integration for feedback and feature requests

---

## 🛡️ **API Security**

Never expose private API keys in frontend code. Keep sensitive API credentials server-side. Use backend/API routes for protected requests.

Handle:
- Rate limits
- API errors
- Timeouts
- Missing data
- Invalid responses

Gracefully.

---

## 🔧 **Configuration**

### Environment Variables (.env)

```bash
CSFLOAT_API_KEY=yGq3TrqGFY5EAfxLLcd3ONZGK5DPDcnp
STEAM_WEB_API_KEY=YOUR_STEAM_API_KEY_HERE
DATABASE_URL=postgresql://user:password@localhost:5432/skiniify
REDIS_HOST=localhost
REDIS_PORT=6379
SECRET_KEY=skiniify-secret-key-change-in-production-2024
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8000
```

### Next.js Configuration (.env.local)

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## 📊 **Pricing Data Sources**

- **CSFloat API** (Primary): Real-time market prices, float values, paint seeds
- **Steam Market API** (Secondary): Market listings, lowest prices, volume data
- **Dual-source comparison**: Shows both prices side-by-side with difference %

---

## 🎯 **Trade-Up Rules**

✅ **Requirements:**
- Exactly 10 items (Steam rule)
- Same weapon type required
- Float values: 0.007 - 1.0
- Matching rarity preferred

📊 **Wear Calculation:**
- Average wear across all 10 items
- ±2% tolerance applied
- Output float range displayed
- Real-time price updates

---

## 📜 **License**

MIT License — Feel free to fork and contribute!

---

## 🏆 **Built By**

**Shii-000**  
Built specifically for the CS:GO/CS2 trading community.

---

**Status**: ✅ **MVP Complete** | 🚀 **Ready for Deployment** | 📈 **Growth Phase**