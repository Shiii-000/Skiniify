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
|-------|------------|
| **Backend** | Python (FastAPI) |
| **Database** | PostgreSQL + Redis (caching) |
| **Frontend** | HTML + Tailwind CSS |
| **Hosting** | GitHub Pages + Railway (optional) |

---

## 🚀 Getting Started

### Prerequisites
- Python 3.9+
- Node.js 16+
- PostgreSQL database (optional for MVP)

### Installation

1. Clone this repo:
   ```bash
   git clone https://github.com/Shiii-000/Skiniify.git
   cd Skiniify
   ```

2. Set up Python backend:
   ```bash
   cd backend
   pip install -r requirements.txt
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

3. Set up HTML frontend (no build needed for MVP):
   ```bash
   # Just open frontend/index.html in a browser
   ```

4. Open your browser and go to:
   ```
   http://localhost:8000
   ```

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
curl -X POST http://localhost:8000/api/trade-up-calculate \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {
        "weapon": "AK-47",
        "skin": "Redline", 
        "wear": 0.15
      },
      {
        "weapon": "AK-47",
        "skin": "Redline", 
        "wear": 0.16
      },
      {
        "weapon": "AK-47",
        "skin": "Redline", 
        "wear": 0.14
      }
    ]
  }'
```

**Response:**
```json
{
  "success": true,
  "expected_item": "AK-47 | Classified Item",
  "expected_wear_range": [0.125, 0.175],
  "estimated_value_usd": 250.00,
  "trade_fee_estimate_usd": 16.00
}
```

---

## 🎨 UI Design

- **Dark Mode Gaming Aesthetic**: Inspired by Steam and Discord UI
- **Responsive Design**: Works on mobile, tablet, desktop
- **Gaming Color Palette**: Orange accents (#f97316), blue highlights (#3b82f6)
- **Tailwind CSS**: Modern utility-first styling with CDN support

---

## 🐛 Bug Reports / Feature Requests

Join our Discord community to report issues or suggest features:
**[Join Discord](https://discord.gg/anKZZ7FpwH)**

---

## 📜 License

MIT License — Feel free to fork and contribute!

---

## 👥 Contributors

- **Shii-000** — Founder & Community Lead

---

*Built with ❤️ for the CS:GO/CS2 community.*