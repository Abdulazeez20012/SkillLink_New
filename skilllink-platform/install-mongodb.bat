@echo off
echo ========================================
echo MongoDB Installation Script
echo ========================================
echo.

REM Check if Chocolatey is installed
where choco >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo Chocolatey found! Installing MongoDB...
    echo.
    choco install mongodb -y
    echo.
    echo MongoDB installed! Starting service...
    net start MongoDB
    echo.
    echo MongoDB is ready!
    echo.
    echo Next steps:
    echo 1. cd backend
    echo 2. npx prisma db push
    echo 3. npx prisma db seed
    echo.
    pause
) else (
    echo Chocolatey is not installed.
    echo.
    echo Please choose one of these options:
    echo.
    echo Option 1: Install MongoDB manually
    echo   - Download from: https://www.mongodb.com/try/download/community
    echo   - Follow the installation wizard
    echo   - Make sure to install as a Windows Service
    echo.
    echo Option 2: Install Chocolatey first, then run this script again
    echo   - Open PowerShell as Administrator
    echo   - Run: Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
    echo   - Then run this script again
    echo.
    echo Option 3: Use MongoDB Atlas (Cloud - Free)
    echo   - See setup-mongodb.md for instructions
    echo.
    pause
)
