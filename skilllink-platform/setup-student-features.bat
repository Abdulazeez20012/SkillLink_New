@echo off
echo ========================================
echo Student Features Setup Script
echo ========================================
echo.

echo [1/5] Installing backend dependencies...
cd backend
call npm install pdfkit @types/pdfkit
if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)
echo ✓ Dependencies installed
echo.

echo [2/5] Creating upload directories...
if not exist "uploads\certificates" mkdir uploads\certificates
if not exist "uploads\resources" mkdir uploads\resources
echo ✓ Directories created
echo.

echo [3/5] Running database migration...
call npx prisma migrate dev --name add_certificates_resources
if %errorlevel% neq 0 (
    echo ERROR: Migration failed
    pause
    exit /b 1
)
echo ✓ Migration completed
echo.

echo [4/5] Generating Prisma client...
call npx prisma generate
if %errorlevel% neq 0 (
    echo ERROR: Prisma generate failed
    pause
    exit /b 1
)
echo ✓ Prisma client generated
echo.

echo [5/5] Verifying setup...
if exist "node_modules\pdfkit" (
    echo ✓ PDFKit installed
) else (
    echo ✗ PDFKit not found
)

if exist "uploads\certificates" (
    echo ✓ Certificates directory exists
) else (
    echo ✗ Certificates directory missing
)

if exist "uploads\resources" (
    echo ✓ Resources directory exists
) else (
    echo ✗ Resources directory missing
)

cd ..
echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Student features are now ready to use:
echo   - Certificate generation
echo   - Course materials/resources
echo   - Assignment resubmissions
echo   - Graded assignment views
echo.
echo Next steps:
echo   1. Restart your backend server
echo   2. Test the new features
echo   3. Check STUDENT_FEATURES_IMPLEMENTATION.md for details
echo.
pause
