@echo off
echo ===================================================
echo   Building "Heart's Curse" for Itch.io Release
echo ===================================================
echo.
echo Step 1: Cleaning previous build...
if exist out rmdir /s /q out

echo Step 2: Running Next.js Build (this may take a minute)...
call npm run build

echo.
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] The build failed! Please check the errors above.
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo ===================================================
echo   SUCCESS! Build complete.
echo ===================================================
echo.
echo You can now find the "out" folder in:
echo %CD%\out
echo.
echo Next Step: Right-click the "out" folder -> Send to -> Compressed (zipped) folder.
echo.
pause
