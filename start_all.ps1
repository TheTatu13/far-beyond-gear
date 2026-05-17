# start_all.ps1
# Porneste backend-ul Django si frontend-ul React.
# Detecteaza automat directorul proiectului — functioneaza indiferent unde este clonat.

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Definition
$serverDir   = Join-Path $projectRoot "server"
$frontendDir = Join-Path $projectRoot "client"
$venvDir     = Join-Path $projectRoot ".venv"
$pythonExe   = Join-Path $venvDir "Scripts\python.exe"

# --- Setup automat daca .venv nu exista ---
if (-not (Test-Path $pythonExe)) {
    Write-Host "Virtual environment negasit. Se creeaza..." -ForegroundColor Yellow
    python -m venv "$venvDir"
    if ($LASTEXITCODE -ne 0) {
        Write-Host "EROARE: Python nu este instalat sau nu e in PATH. Instaleaza Python 3.11+." -ForegroundColor Red
        pause; exit 1
    }
    Write-Host "Se instaleaza dependentele Python..." -ForegroundColor Cyan
    & "$venvDir\Scripts\pip.exe" install -r "$serverDir\requirements.txt" --quiet
    Write-Host "Dependente instalate!" -ForegroundColor Green
}

# --- Setup automat daca node_modules nu exista ---
if (-not (Test-Path (Join-Path $frontendDir "node_modules"))) {
    Write-Host "node_modules negasit. Se ruleaza npm install..." -ForegroundColor Yellow
    Push-Location $frontendDir
    npm install --silent
    Pop-Location
    Write-Host "Pachete npm instalate!" -ForegroundColor Green
}

# --- Determinam executabilul PowerShell ---
$psCandidates = @(
    "C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe",
    "C:\Program Files\PowerShell\7\pwsh.exe",
    "C:\Program Files (x86)\PowerShell\7\pwsh.exe"
)
$psExec = $psCandidates | Where-Object { Test-Path $_ } | Select-Object -First 1
if (-not $psExec) { $psExec = "powershell" }

# --- Pornire Django ---
$djCommand = "cd '$serverDir'; & '$pythonExe' manage.py runserver"
Write-Host "Pornesc Django (http://localhost:8000)..." -ForegroundColor Cyan
Start-Process -FilePath $psExec -ArgumentList @('-NoExit', '-Command', $djCommand) -WindowStyle Normal

Start-Sleep -Seconds 2

# --- Pornire React ---
$feCommand = "cd '$frontendDir'; npm run dev"
Write-Host "Pornesc React frontend (http://localhost:5173)..." -ForegroundColor Cyan
Start-Process -FilePath $psExec -ArgumentList @('-NoExit', '-Command', $feCommand) -WindowStyle Normal

Write-Host "Gata! Django @ localhost:8000, React @ localhost:5173" -ForegroundColor Green
Write-Host "Daca PowerShell blocheaza scriptul, ruleaza: Set-ExecutionPolicy -Scope CurrentUser Bypass -Force" -ForegroundColor Yellow

# Deschide browserul dupa 5 secunde
Start-Sleep -Seconds 5
Start-Process "http://localhost:5173/"
