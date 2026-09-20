@echo off
echo ============================================
echo   🔪 Skiniify - Starting Platform...
echo ============================================
echo.

REM Check if backend dependencies are installed
if not exist "backend\.venv\Lib\site-packages\fastapi.pyd" (
    echo [1/2] Installing Python backend dependencies...
    cd backend
    pip install -r requirements.txt >nul 2>&1
    cd ..
)

REM Check if frontend dependencies are installed  
if not exist "frontend\node_modules" (
    echo [2/2] Installing Node.js frontend dependencies...
    cd frontend
    npm install >nul 2>&1
    cd ..
)

echo.
echo ============================================
echo   Starting Backend API Server...
echo ============================================
echo   - Port: 8000
echo   - URL: http://localhost:8000
echo   - Features: Price API, Trade-Up Calculator
echo.

cd backend
start "Skiniify Backend" cmd /k "uvicorn main:app --reload --host 0.0.0.0 --port 8000"

REM Give backend time to start (2 seconds)
timeout /t 3 >nul

echo.
echo ============================================
echo   Starting Frontend Web Server...
echo ============================================
echo   - Port: 3000
echo   - URL: http://localhost:3000
echo   - Features: Dashboard, Calculator, Inventory
echo.

cd ../frontend
start "Skiniify Frontend" cmd /k "npm run dev"

echo.
echo ============================================
echo   ✅ Platform Ready!
echo ============================================
echo.
echo  📱 Homepage: http://localhost:3000
echo  🔪 Calculator: http://localhost:3000/calculator
echo  🔌 API Status: http://localhost:8000
echo.
echo  Backend window is open - leave it running!
echo  Frontend will reload on file changes.
echo.
echo ============================================
pause