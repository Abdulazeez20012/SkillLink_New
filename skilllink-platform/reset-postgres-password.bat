@echo off
echo ========================================
echo PostgreSQL Password Reset Helper
echo ========================================
echo.
echo This will help you reset your PostgreSQL password.
echo.
echo Step 1: We need to edit pg_hba.conf
echo Location: C:\Program Files\PostgreSQL\18\data\pg_hba.conf
echo.
echo Please:
echo 1. Open Notepad as Administrator
echo 2. Open: C:\Program Files\PostgreSQL\18\data\pg_hba.conf
echo 3. Find all lines with "scram-sha-256" or "md5"
echo 4. Change them to "trust"
echo 5. Save the file
echo.
pause
echo.
echo Step 2: Restarting PostgreSQL service...
net stop postgresql-x64-18
timeout /t 2 /nobreak >nul
net start postgresql-x64-18
echo.
echo Step 3: Resetting password...
timeout /t 3 /nobreak >nul
"C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -c "ALTER USER postgres WITH PASSWORD 'postgres123';"
echo.
echo Step 4: Please change "trust" back to "scram-sha-256" in pg_hba.conf
echo Then restart the service again.
echo.
pause
