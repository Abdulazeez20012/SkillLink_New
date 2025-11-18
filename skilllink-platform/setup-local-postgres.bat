@echo off
echo Setting up local PostgreSQL for SkillLink...
echo.

REM Check if psql is available
where psql >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: PostgreSQL is not installed or not in PATH
    echo Please install PostgreSQL or start Docker Desktop instead
    pause
    exit /b 1
)

echo Creating database user and database...
echo.

REM Connect to PostgreSQL and create user and database
psql -U postgres -c "CREATE USER skilllink WITH PASSWORD 'skilllink_dev';" 2>nul
psql -U postgres -c "CREATE DATABASE skilllink OWNER skilllink;" 2>nul
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE skilllink TO skilllink;" 2>nul

echo.
echo Database setup complete!
echo.
echo Now run: cd backend && npx prisma migrate deploy
echo.
pause
