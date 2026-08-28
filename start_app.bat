@echo off
setlocal
cd /d "%~dp0"

echo ===================================================
echo   HEART'S CURSE CAMPAIGN MANAGER - TABLET SERVER
echo ===================================================
echo.
echo Local URL:   http://localhost:3000
echo.
echo Tablet Access (connect your iPad / Tablet to the same Wi-Fi):
powershell -NoProfile -Command "Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.InterfaceAlias -notmatch 'Loopback|vEthernet|Virtual' -and $_.IPAddress -notlike '169.254*' } | ForEach-Object { Write-Host ('  - http://' + $_.IPAddress + ':3000') -ForegroundColor Green }"
echo.
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
