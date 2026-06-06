# smoke_check.ps1 — quick API + file existence checks for FarBeyondGear
Write-Host "Running smoke checks...`n"

function Check-Url($url) {
    try {
        $resp = Invoke-WebRequest -Uri $url -UseBasicParsing -ErrorAction Stop
        return @{ok=$true; status=$resp.StatusCode; content=$resp.Content}
    } catch {
        return @{ok=$false; error=$_.Exception.Message}
    }
}

$apiBase = 'http://127.0.0.1:8000/api'
$frontBase = 'http://127.0.0.1:8080'

$endpoints = @("$apiBase/brands/", "$apiBase/products/", "$apiBase/categories/")
foreach ($ep in $endpoints) {
    $r = Check-Url $ep
    if ($r.ok) {
        $json = $r.content | ConvertFrom-Json
        Write-Host "OK: $ep -> count: $($json.count)" -ForegroundColor Green
    } else {
        Write-Host "FAIL: $ep -> $($r.error)" -ForegroundColor Red
    }
}

$files = @('index.html','products.html','cart.html','checkout.html','product.html','brand.html','categories.html')
$root = Join-Path (Get-Location) 'frontend'
foreach ($f in $files) {
    $path = Join-Path $root $f
    if (Test-Path $path) {
        $size = (Get-Item $path).Length
        Write-Host "FOUND: $f ($([math]::Round($size/1KB,1)) KB)" -ForegroundColor Cyan
    } else {
        Write-Host "MISSING: $f" -ForegroundColor Yellow
    }
}

Write-Host "\nSmoke checks complete." -ForegroundColor Green
