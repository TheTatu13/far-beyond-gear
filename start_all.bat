@echo off
REM start_all.bat - Porneste Django backend + React frontend
REM Adaptat pentru: C:\Users\Mihai\Downloads\far-beyond-gear-main\far-beyond-gear-main

set PROJECT_ROOT=C:\Users\Mihai\Downloads\far-beyond-gear-main\far-beyond-gear-main
set VENV_PYTHON=%PROJECT_ROOT%\.venv\Scripts\python.exe
set SERVER_DIR=%PROJECT_ROOT%\server
set FRONTEND_DIR=%PROJECT_ROOT%\client

REM Adaugam calea catre Node.js in PATH in caz ca nu s-a actualizat inca sesiunea curenta
set "PATH=%PATH%;C:\Program Files\nodejs;C:\Users\%USERNAME%\AppData\Roaming\npm"

echo.
echo =========================================
echo Far Beyond Gear - Start All Servers
echo =========================================
echo.

REM Verifica daca virtualenv exista
if not exist "%VENV_PYTHON%" (
    echo ERROR: .venv nu a fost gasit la %VENV_PYTHON%
    echo Rulati setup.bat intai!
    pause
    exit /b 1
)

echo Aplic migratiile bazei de date...
cd /d "%SERVER_DIR%"
"%VENV_PYTHON%" manage.py migrate --noinput
if errorlevel 1 (
    echo ERROR: Migratiile au esuat.
    pause
    exit /b 1
)

echo.
echo Pornesc Django backend pe portul 8000...
start "Django Backend" cmd /k "cd /d "%SERVER_DIR%" && "%VENV_PYTHON%" manage.py runserver"

timeout /t 2 /nobreak >nul

echo.
echo Pornesc React frontend pe portul 5173...
start "React Frontend" cmd /k "cd /d "%FRONTEND_DIR%" && npm.cmd run dev"

timeout /t 5 /nobreak >nul

echo.
echo =========================================
echo Ambele servere ruleaza:
echo   - Frontend:     http://localhost:5173/
echo   - Backend API:  http://127.0.0.1:8000/api/
echo   - Django Admin: http://127.0.0.1:8000/admin/
echo =========================================
echo.

timeout /t 1 /nobreak >nul
start http://localhost:5173/

echo Servele ruleaza. Poti inchide aceasta fereastra.
echo Inchide ferestrele individuale ale serverelor pentru a le opri.
echo.
pause
