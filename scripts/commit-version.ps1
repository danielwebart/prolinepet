param(
  [switch]$Push,
  [string]$Remote = 'origin'
)

# Resolve project root and name
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$Root = Split-Path -Parent $ScriptDir
$PkgPath = Join-Path $Root 'package.json'

if (-not (Test-Path $PkgPath)) {
  Write-Error "package.json não encontrado em $Root"
  exit 1
}

$pkg = Get-Content -Raw -Path $PkgPath | ConvertFrom-Json
$project = $pkg.name
if (-not $project) { $project = Split-Path -Leaf $Root }

# Build hourly stamp: DDMMAA-HH
$stamp = Get-Date -Format 'ddMMyy-HH'
$message = "$project-$stamp"

Write-Host "Criando commit de versão: $message" -ForegroundColor Cyan

# Ensure Git is available
$gitCmd = Get-Command git -ErrorAction SilentlyContinue
$git = $null
if ($gitCmd) {
  $git = $gitCmd.Path
} else {
  $candidates = @(
    'C:\Program Files\Git\cmd\git.exe',
    'C:\Program Files\Git\bin\git.exe'
  )
  $found = $candidates | Where-Object { Test-Path $_ } | Select-Object -First 1
  if ($found) { $git = $found } else {
    Write-Error "Git não encontrado (PATH ou caminhos padrão). Instale o Git e tente novamente."
    exit 1
  }
}

# If the last commit already matches the same hourly stamp, skip
$lastSubject = (& $git log -1 --pretty=%s) 2>$null
$skipCommit = $false
if ($lastSubject -eq $message) {
  Write-Host "Já existe commit para esta hora ($message)." -ForegroundColor Yellow
  $skipCommit = $true
}

# Stage all changes (including build artifacts like .next)
if (-not $skipCommit) {
  & $git add -A | Out-Null
  # Always allow empty commit so a version exists even sem alterações
  & $git commit -m $message --allow-empty | Out-Null
}

# Optionally push to remote
if ($Push) {
  Write-Host "Enviando para remoto '$Remote'" -ForegroundColor Yellow
  & $git push $Remote HEAD | Out-Null
  Write-Host "OK: Push realizado para '$Remote'" -ForegroundColor Green
}

Write-Host "OK: Commit criado" -ForegroundColor Green
