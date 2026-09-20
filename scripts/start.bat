@echo off
setlocal enabledelayedexpansion

echo ============================================
echo   🔪 Skiniify - Platform Launcher
echo ============================================
echo.

REM Check if Python is available
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python is not installed or not in PATH!
    echo Please install Python from: https://www.python.org/downloads/
    echo Then restart your computer and try again.
    pause
    exit /b 1
)

REM Check if Node.js is available  
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not in PATH!
    echo Please install Node.js from: https://nodejs.org/
    echo Then restart your computer and try again.
    pause
    exit /b 1
)

echo [OK] Python found
echo [OK] Node.js found
echo.

REM Check if backend dependencies exist
if not exist "backend\.venv\Lib\site-packages\fastapi.pyd" (
    echo [1/2] Installing Python backend dependencies...
    cd backend
    pip install -r requirements.txt
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to install backend dependencies!
        pause
        exit /b 1
    )
    cd ..
) else (
    echo [OK] Backend dependencies already installed
)

REM Check if frontend dependencies exist
if not exist "frontend\node_modules" (
    echo [2/2] Installing Node.js frontend dependencies...
    cd frontend
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to install frontend dependencies!
        pause
        exit /b 1
    )
    cd ..
) else (
    echo [OK] Frontend dependencies already installed
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

REM Give backend time to start (3 seconds)
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

REM Open homepage in default browser after a short delay
timeout /t 5 >nul
start "" "http://localhost:3000"

echo.
pause