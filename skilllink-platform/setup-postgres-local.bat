@echo off
echo ========================================
echo Setting up PostgreSQL for SkillLink
echo ========================================
echo.

echo Creating database and user...
echo Please enter your PostgreSQL postgres password when prompted.
echo.

psql -U postgres -c "CREATE DATABASE skilllink;"
psql -U postgres -c "CREATE USER skilllink WITH PASSWORD 'skilllink123';"
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE skilllink TO skilllink;"
psql -U postgres -d skilllink -c "GRANT ALL ON SCHEMA public TO skilllink;"

echo.
echo ========================================
echo Setup complete!
echo ========================================
echo.
echo Database: skilllink
echo User: skilllink
echo Password: skilllink123
echo.
pause
