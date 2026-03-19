
$ErrorActionPreference = "Stop"
Write-Host "Preparing standalone build..."

$destStandalone = ".next/standalone"
$destNext = "$destStandalone/.next"

# Ensure destination directories exist
if (!(Test-Path $destNext)) {
    New-Item -ItemType Directory -Force -Path $destNext | Out-Null
}

# Copy public folder (if not exists in standalone)
if (Test-Path "public") {
    Write-Host "Copying public folder..."
    Copy-Item -Path "public" -Destination "$destStandalone" -Recurse -Force
}

# Copy static folder (needs to go into .next/static)
if (Test-Path ".next/static") {
    Write-Host "Copying static folder..."
    Copy-Item -Path ".next/static" -Destination "$destNext" -Recurse -Force
}

Write-Host "Standalone preparation complete."
