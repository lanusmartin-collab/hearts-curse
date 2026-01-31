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


echo Step 3: Creating ZIP file for Itch.io...
echo.
if exist hearts_curse_itch.zip del hearts_curse_itch.zip
powershell -command "Compress-Archive -Path '.\out\*' -DestinationPath '.\hearts_curse_itch.zip' -Force"

echo.
if exist hearts_curse_itch.zip (
    echo ===================================================
    echo   SUCCESS! Build complete.
    echo ===================================================
    echo.
    echo The file you need to upload to Itch.io is ready:
    echo "%CD%\hearts_curse_itch.zip"
    echo.
    echo IMPORTANT: Upload THIS .zip file. Do not upload .rar files.
) else (
    echo [ERROR] Failed to create zip file.
    pause
    exit /b 1
)

pause
