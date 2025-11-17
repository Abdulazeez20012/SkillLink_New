@echo off
echo ========================================
echo SkillLink - Complete Setup Script
echo ========================================
echo.
echo This script will:
echo 1. Start PostgreSQL database
echo 2. Run database migrations
echo 3. Seed initial data
echo.
pause

REM Check Docker
echo.
echo [1/4] Checking Docker...
docker --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Docker is not installed
    echo Please install Docker Desktop first
    pause
    exit /b 1
)
echo [OK] Docker is installed

REM Start Database
echo.
echo [2/4] Starting PostgreSQL database...
docker-compose up -d postgres
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to start database
    echo Make sure Docker Desktop is running
    pause
    exit /b 1
)

echo Waiting for database to be ready...
timeout /t 15 /nobreak >nul
echo [OK] Database started

REM Run Migrations
echo.
echo [3/4] Running database migrations...
cd backend
call npx prisma migrate deploy
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Migration failed
    cd ..
    pause
    exit /b 1
)
echo [OK] Migrations completed

REM Seed Database
echo.
echo [4/4] Seeding database with initial data...
call npm run seed
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Seeding failed
    cd ..
    pause
    exit /b 1
)
echo [OK] Database seeded

cd ..

echo.
echo ========================================
echo Setup Complete! 🎉
echo ========================================
echo.
echo Default Login Credentials:
echo.
echo Admin:
echo   Email: admin@skilllink.com
echo   Password: Admin123!
echo.
echo Facilitator:
echo   Email: facilitator@skilllink.com
echo   Password: Facilitator123!
echo.
echo ========================================
echo To start the application:
echo ========================================
echo.
echo Terminal 1 - Backend:
echo   cd backend
echo   npm run dev
echo.
echo Terminal 2 - Frontend:
echo   cd frontend
echo   npm run dev
echo.
echo Then open: http://localhost:5173
echo.
echo ========================================
pause
