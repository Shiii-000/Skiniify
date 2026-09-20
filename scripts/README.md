# 🚀 Skiniify Quick Start Guide

## **Option 1: Run Everything with One Click** ⚡

### **Windows:**

1. **Navigate to the scripts folder:**
   ```
   C:\Users\rakud\.lmstudio\apps\bionic\projects\d49037d8-47f4-5808-9028-c707de117f8f\workspace\Skiniify\scripts
   ```

2. **Double-click `start.bat`** - This will:
   - ✅ Check/install all dependencies automatically
   - ✅ Start backend API server on port 8000
   - ✅ Start frontend web server on port 3000
   - ✅ Open browser to your homepage automatically!

3. **Wait ~1-2 minutes** for both servers to start

4. **Open these URLs in your browser:**
   - 🏠 Homepage: `http://localhost:3000`
   - 🔪 Calculator: `http://localhost:3000/calculator`
   - 🔌 API Test: `http://localhost:8000`

---

## **Option 2: Manual Start (More Control)**

### **Backend Server:**

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Then open in browser:** `http://localhost:8000`

### **Frontend Server:**

```bash
cd ../frontend
npm install
npm run dev
```

**Then open in browser:** `http://localhost:3000`

---

## **Quick Access URLs** 🌐

Once running, visit these:

| URL | Description | Features |
|-----|-------------|----------|
| http://localhost:3000 | Homepage/Dashboard | Inventory tracking, portfolio value |
| http://localhost:3000/calculator | Trade-Up Calculator | Calculate trade-up profits |
| http://localhost:8000 | API Landing Page | Test backend endpoints |

---

## **What You'll See** 👀

### **Homepage:**
- 🔪 Skiniify logo with cyan glow
- "Track Your Collection. Master the Market."
- Inventory value cards with portfolio stats
- Feature cards for Quick Start & Market Insights

### **Calculator:**
- 8 input slots (add up to 10 items)
- Drag-and-drop to reorder slots
- Professional results display
- API test buttons at bottom

---

## **Troubleshooting** 🛠️

### **"pip: command not found"**
Make sure Python is installed. Download from: https://python.org

### **"npm: command not found"**
Make sure Node.js is installed. Download from: https://nodejs.org

### **Port already in use**
Close any other apps using ports 8000 or 3000, then restart.

---

## **Need Help?** 💬

Join our Discord: **https://discord.gg/anKZZ7FpwH**

---

**Built by Shii-000 for the CS:GO/CS2 community!** 🎮