@echo off
setlocal
cd /d "%~dp0"

echo Starting Heart's Curse App...
echo Directory: %CD%
echo.
echo ===================================================
echo  Access locally: http://localhost:3000
echo  Access from network: http://YOUR_PC_IP:3000
echo ===================================================
echo.

if exist "node_modules\next\dist\bin\next" (
    node "node_modules\next\dist\bin\next" dev -H 0.0.0.0
) else (
    echo ERROR: Next.js binary not found in node_modules!
    echo Please make sure 'npm install' ran successfully.
    pause
)
pause
