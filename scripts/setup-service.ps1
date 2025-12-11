param(
  [string]$ServiceName = 'portalweb-next',
  [string]$AppDir = 'D:\Sites\portalWeb',
  [string]$StartCmd = 'D:\Sites\portalWeb\scripts\start-next.cmd'
)

Write-Host "Configuring Windows service '$ServiceName' for Next.js at $AppDir" -ForegroundColor Cyan

try {
  $nodeCmd = Get-Command node -ErrorAction SilentlyContinue
  $nodePath = if ($null -ne $nodeCmd) { $nodeCmd.Source } else { 'C:\Program Files\nodejs\node.exe' }
  if (-Not (Test-Path $nodePath)) {
    Write-Host "Node.exe not found at '$nodePath'. Ensure Node.js is installed and in PATH." -ForegroundColor Red
    exit 1
  }
  # Write/refresh start-next.cmd with absolute node path
  $batch = "@echo off`r`ncd /d $AppDir`r`n`"$nodePath`" node_modules\next\dist\bin\next start -p 3000`r`n"
  Set-Content -Path $StartCmd -Value $batch -Encoding ASCII
} catch {
  Write-Host "Failed to prepare start script: $($_.Exception.Message)" -ForegroundColor Red
  exit 1
}

# Create service using sc.exe pointing to cmd.exe /c <start script>
$binPath = "C:\Windows\System32\cmd.exe /c `"$StartCmd`""

function Invoke-Sc($args) {
  Write-Host "sc.exe $args" -ForegroundColor Gray
  & sc.exe $args
}

# Stop/remove if exists
$svc = Get-Service -Name $ServiceName -ErrorAction SilentlyContinue
if ($svc) {
  if ($svc.Status -ne 'Stopped') {
    Write-Host "Stopping existing service..." -ForegroundColor Yellow
    Invoke-Sc "stop $ServiceName" | Out-Null
    Start-Sleep -Seconds 2
  }
  Write-Host "Deleting existing service..." -ForegroundColor Yellow
  Invoke-Sc "delete $ServiceName" | Out-Null
  Start-Sleep -Seconds 2
}

Write-Host "Creating service..." -ForegroundColor Green
Invoke-Sc "create $ServiceName binPath= `$binPath start= auto" | Out-Null
Invoke-Sc "description $ServiceName PortalWeb Next.js production server" | Out-Null

# Restart policy on failure
Invoke-Sc "failure $ServiceName reset= 15 actions= restart/5000" | Out-Null

Write-Host "Starting service..." -ForegroundColor Green
Invoke-Sc "start $ServiceName" | Out-Null

Write-Host "Service '$ServiceName' created and started. Verify in Services.msc." -ForegroundColor Cyan