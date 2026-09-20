# Skiniify - CS:GO/CS2 Item Tracker 🎮

**Built by Shii-000** for the CS:GO/CS2 community. Track market prices, manage inventory, and calculate trade-up profits with our lightweight tool.

---

## ✨ Features

- **🔪 Trade-Up Calculator**: Calculate expected item + wear when trading up 3 items
- **📊 Market Price Tracker**: Real-time price data with 7-day history charts
- **🎒 Inventory Manager**: Track owned skins + portfolio value
- **💰 Profit Calculator**: Instant ROI on trades
- **🆓 Free Forever**: Core tools are free, premium alerts available later

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | Python (FastAPI) |
| **Database** | PostgreSQL + Redis (caching) |
| **Frontend** | Next.js + Tailwind CSS |
| **Hosting** | Railway (backend) + Vercel (frontend) |

---

## 🚀 Getting Started

### Prerequisites
- Python 3.9+
- Node.js 16+
- PostgreSQL database (optional for MVP)

### Installation

1. Clone this repo:
   ```bash
   git clone https://github.com/Shii-000/skiniify.git
   cd skiniify
   ```

2. Set up Python backend:
   ```bash
   pip install -r backend/requirements.txt
   ```

3. Run the backend API:
   ```bash
   cd backend
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

4. Set up Next.js frontend:
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

5. Open your browser and go to `http://localhost:3000`

---

## 📡 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/login` | POST | Steam login authentication |
| `/api/trade-up-calculate` | POST | Calculate trade-up result |
| `/api/inventory/track` | POST | Track inventory for user |
| `/api/prices/{weapon_skin}` | GET | Get market price data |

### Example: Trade-Up Calculator

```bash
POST /api/trade-up-calculate
Content-Type: application/json

{
  "items": [
    {
      "weapon": "AK-47",
      "skin": "Redline", 
      "wear": 0.15,
      "count": 3
    }
  ],
  "target_rarity": "Covert"
}
```

**Response:**
```json
{
  "success": true,
  "expected_item": "AK-47 | Classified Item",
  "expected_wear_range": [0.140, 0.160],
  "estimated_value_usd": 2500.00,
  "trade_fee_estimate_usd": 15.00
}
```

---

## 🐛 Bug Reports / Feature Requests

Join our Discord community to report issues or suggest features:
**[Discord Server Link](#)**

---

## 📜 License

MIT License — Feel free to fork and contribute!

---

## 👥 Contributors

- **Shii-000** — Founder & Community Lead
- AI Assistant — Backend Development

---

*Built with ❤️ for the CS:GO/CS2 community.*