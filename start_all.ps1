# start_all.ps1
# Porneste backend-ul Django si frontend-ul React.
# Detecteaza automat directorul proiectului — functioneaza indiferent unde este clonat.

# --- Refresh PATH ca sa gaseasca Python si Node.js proaspat instalate ---
$env:PATH = [System.Environment]::GetEnvironmentVariable("Path", "Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path", "User")

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Definition
$serverDir = Join-Path $projectRoot "server"
$frontendDir = Join-Path $projectRoot "client"
$venvDir = Join-Path $projectRoot ".venv"
$pythonExe = Join-Path $venvDir "Scripts\python.exe"

# Gasim npm.cmd (evita problema cu executia .ps1 blocata)
$npmCmd = Get-Command npm.cmd -ErrorAction SilentlyContinue
if ($npmCmd) {
    $npmExe = $npmCmd.Source
}
else {
    $npmExe = "C:\Program Files\nodejs\npm.cmd"
}

Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "  Far Beyond Gear - Start All Servers" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

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
    & $npmExe install --silent
    Pop-Location
    Write-Host "Pachete npm instalate!" -ForegroundColor Green
}

# --- Migrare baza de date ---
Write-Host "Aplic migratiile Django..." -ForegroundColor Cyan
Push-Location $serverDir
& $pythonExe manage.py migrate --noinput | Out-Null
Pop-Location

# --- Determinam executabilul PowerShell ---
$psCandidates = @(
    "C:\Program Files\PowerShell\7\pwsh.exe",
    "C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe"
)
$psExec = $psCandidates | Where-Object { Test-Path $_ } | Select-Object -First 1
if (-not $psExec) { $psExec = "powershell" }

# --- Pornire Django ---
$djCommand = "`$env:PATH = [System.Environment]::GetEnvironmentVariable('Path','Machine') + ';' + [System.Environment]::GetEnvironmentVariable('Path','User'); cd '$serverDir'; & '$pythonExe' manage.py runserver"
Write-Host "Pornesc Django (http://localhost:8000)..." -ForegroundColor Cyan
Start-Process -FilePath $psExec -ArgumentList @('-NoExit', '-Command', $djCommand) -WindowStyle Normal

Start-Sleep -Seconds 2

# --- Pornire React ---
$feCommand = "`$env:PATH = [System.Environment]::GetEnvironmentVariable('Path','Machine') + ';' + [System.Environment]::GetEnvironmentVariable('Path','User'); cd '$frontendDir'; & 'C:\Program Files\nodejs\npm.cmd' run dev"
Write-Host "Pornesc React frontend (http://localhost:5173)..." -ForegroundColor Cyan
Start-Process -FilePath $psExec -ArgumentList @('-NoExit', '-Command', $feCommand) -WindowStyle Normal

Write-Host ""
Write-Host "Gata!" -ForegroundColor Green
Write-Host "  Frontend:     http://localhost:5173/" -ForegroundColor White
Write-Host "  Backend API:  http://localhost:8000/api/" -ForegroundColor White
Write-Host "  Django Admin: http://localhost:8000/admin/" -ForegroundColor White
Write-Host ""

# Deschide browserul dupa 5 secunde
Start-Sleep -Seconds 5
Start-Process "http://localhost:5173/"
