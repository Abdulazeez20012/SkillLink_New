@echo off
echo ========================================
echo SkillLink Platform Setup Script
echo ========================================
echo.

where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed. Please install Node.js 18+ first.
    exit /b 1
)

echo [OK] Node.js is installed
node --version

echo.
echo Installing Backend Dependencies...
cd backend
call npm install

if not exist .env (
    echo Creating backend .env file...
    copy .env.example .env
    echo [WARNING] Please edit backend\.env with your database credentials
)

echo.
echo Setting up Database...
call npx prisma generate
call npx prisma migrate deploy

echo.
echo Seeding Database...
call npm run seed

echo.
echo Installing Frontend Dependencies...
cd ..\frontend
call npm install

if not exist .env (
    echo Creating frontend .env file...
    copy .env.example .env
)

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo To start the application:
echo.
echo Terminal 1 - Backend:
echo   cd backend
echo   npm run dev
echo.
echo Terminal 2 - Frontend:
echo   cd frontend
echo   npm run dev
echo.
echo Default credentials:
echo   Admin: admin@skilllink.com / Admin123!
echo   Facilitator: facilitator@skilllink.com / Facilitator123!
echo.
echo Happy coding!
pause
