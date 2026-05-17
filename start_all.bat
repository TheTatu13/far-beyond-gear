





@echo off
REM start_all.bat - Porneste Django backend + frontend static server
REM Ruleaza ambii serveri in paralel intr-o singura fereastra CMD

setlocal enabledelayedexpansion

set VENV_PYTHON=C:\dev_envs\Licenta\.venv\Scripts\python.exe
set PROJECT_ROOT=C:\dev_envs\Licenta
set SERVER_DIR=%PROJECT_ROOT%\server
set FRONTEND_DIR=%PROJECT_ROOT%\client

REM Verifica daca python.exe din venv exista
if not exist "%VENV_PYTHON%" (
    echo ERROR: Python executable not found at "%VENV_PYTHON%"
    echo Verifica ca virtualenv-ul exista la: C:\dev_envs\Licenta\.venv
    pause
    exit /b 1
)

echo.
echo =========================================
echo Far Beyond Gear - Start All Servers
echo =========================================
echo.
echo Applying database migrations...
cd /d "%SERVER_DIR%"
"%VENV_PYTHON%" manage.py migrate --noinput
if errorlevel 1 (
    echo.
    echo ERROR: Migrations failed. Backend was not started.
    echo Close any running backend processes and retry.
    pause
    exit /b 1
)

echo.
echo Starting Django backend on port 8000...
cd /d "%SERVER_DIR%"
start "Django Backend" cmd /k "%VENV_PYTHON% manage.py runserver"

timeout /t 2

echo.
echo Starting React frontend on port 5173...
cd /d "%FRONTEND_DIR%"
start "React Frontend" cmd /k "npm run dev"

timeout /t 5

echo.
echo =========================================
echo Both servers are now running:
echo   - Backend API: http://127.0.0.1:8000/
echo   - Frontend: http://localhost:5173/
echo =========================================
echo.
echo Opening app in browser...
echo.

timeout /t 1
start http://localhost:5173/

echo.
echo Servers are running. You can close this window.
echo Close the individual server windows to stop them.
echo.
pause
