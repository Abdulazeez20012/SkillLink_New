@echo off
echo ========================================
echo SkillLink - Database Setup
echo ========================================
echo.

echo Checking Docker...
docker --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Docker is not installed or not in PATH
    echo Please install Docker Desktop from:
    echo https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)

echo [OK] Docker is installed
echo.

echo Starting PostgreSQL database...
docker-compose up -d postgres

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Failed to start database
    echo.
    echo Please make sure:
    echo 1. Docker Desktop is running
    echo 2. You are in the skilllink-platform folder
    echo.
    pause
    exit /b 1
)

echo.
echo Waiting for database to be ready...
timeout /t 10 /nobreak >nul

echo.
echo Checking database status...
docker ps | findstr skilllink-db >nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Database container is not running
    echo Check Docker Desktop and try again
    pause
    exit /b 1
)

echo [OK] Database is running!
echo.

echo ========================================
echo Next Steps:
echo ========================================
echo.
echo 1. Run migrations:
echo    cd backend
echo    npx prisma migrate deploy
echo.
echo 2. Seed database:
echo    npm run seed
echo.
echo 3. Start backend:
echo    npm run dev
echo.
echo 4. Start frontend (in new terminal):
echo    cd frontend
echo    npm run dev
echo.
echo ========================================
pause
