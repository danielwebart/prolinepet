param(
  [string]$ApacheRoot = 'C:\Apache24',
  [string]$ProxyPrefix = '/portalweb',
  [string]$TargetUrl = 'http://127.0.0.1:3000/'
)

Write-Host "Configuring Apache proxy for $ProxyPrefix -> $TargetUrl" -ForegroundColor Cyan

try {
  $confDir = Join-Path $ApacheRoot 'conf'
  $extraDir = Join-Path $confDir 'extra'
  $httpdConf = Join-Path $confDir 'httpd.conf'
  $proxyConf = Join-Path $extraDir 'portalweb-proxy.conf'
  $binHttpd = Join-Path (Join-Path $ApacheRoot 'bin') 'httpd.exe'

  if (-Not (Test-Path $httpdConf)) { throw "httpd.conf not found at $httpdConf" }
  if (-Not (Test-Path $extraDir)) { New-Item -ItemType Directory -Path $extraDir -Force | Out-Null }

  # Backup httpd.conf
  $timestamp = Get-Date -Format 'yyyyMMdd-HHmmss'
  Copy-Item -Path $httpdConf -Destination ("$httpdConf.bak-$timestamp") -Force

  $httpd = Get-Content -Path $httpdConf -Raw

  # Ensure required modules are loaded
  $mods = @(
    'LoadModule proxy_module modules/mod_proxy.so',
    'LoadModule proxy_http_module modules/mod_proxy_http.so',
    'LoadModule rewrite_module modules/mod_rewrite.so',
    'LoadModule headers_module modules/mod_headers.so'
  )
  foreach ($m in $mods) {
    if ($httpd -notmatch [Regex]::Escape($m)) {
      Write-Host "Adding module: $m" -ForegroundColor Green
      $httpd += "`r`n$m"
    } else {
      Write-Host "Module already present: $m" -ForegroundColor Gray
    }
  }

  # Ensure Apache is listening on port 8484
  $listenLine = 'Listen 8484'
  if ($httpd -notmatch [Regex]::Escape($listenLine)) {
    Write-Host "Adding listen port: $listenLine" -ForegroundColor Green
    # Insert after first existing Listen directive if found, else append
    if ($httpd -match "(?m)^Listen ") {
      $httpd = $httpd -replace "(?m)^Listen ", "$listenLine`r`nListen "
    } else {
      $httpd += "`r`n$listenLine`r`n"
    }
  } else {
    Write-Host "Listen 8484 already present" -ForegroundColor Gray
  }

  # Deduplicate any repeated Listen 8484 lines
  $lines = $httpd -split "`r?`n"
  $seen = $false
  $lines = foreach ($ln in $lines) {
    if ($ln -match '^\s*Listen\s+8484\s*$') {
      if (-not $seen) { $seen = $true; $ln }
    } else { $ln }
  }
  $httpd = ($lines -join "`r`n")

  # Optional: ensure ServerName to avoid warnings
  $serverName = 'ServerName localhost:8484'
  if ($httpd -notmatch [Regex]::Escape($serverName)) {
    Write-Host "Setting $serverName" -ForegroundColor Green
    $httpd += "`r`n$serverName`r`n"
  }

  # Ensure include for our proxy file
  $includeLine = 'Include conf/extra/portalweb-proxy.conf'
  if ($httpd -notmatch [Regex]::Escape($includeLine)) {
    Write-Host "Adding include: $includeLine" -ForegroundColor Green
    $httpd += "`r`n$includeLine`r`n"
  } else {
    Write-Host "Include already present" -ForegroundColor Gray
  }

  # Ensure vhost include for port 8484
  $vhostFile = Join-Path $extraDir 'portalweb-vhost.conf'
  $vhostInclude = 'Include conf/extra/portalweb-vhost.conf'
  if ($httpd -notmatch [Regex]::Escape($vhostInclude)) {
    Write-Host "Adding vhost include: $vhostInclude" -ForegroundColor Green
    $httpd += "`r`n$vhostInclude`r`n"
  } else {
    Write-Host "Vhost include already present" -ForegroundColor Gray
  }

  Set-Content -Path $httpdConf -Value $httpd -Encoding ASCII

  # Write proxy rules file
  $prefix = $ProxyPrefix.TrimEnd('/')
  $target = $TargetUrl.TrimEnd('/') + '/'
  $proxyContent = @"
ProxyPreserveHost On
RewriteEngine On

# Redirect bare host to prefixed app root
RewriteRule ^$ $prefix/ [R=302,L]

# Proxy all app routes under the prefix to Next.js
RewriteRule ^/portalweb/(.*)$ $target$1 [P,L]
ProxyPassReverse /portalweb $target

# Also proxy common absolute-root paths used by Next.js and the app
RewriteRule ^/_next/(.*)$ $target$1 [P,L]
RewriteRule ^/api/(.*)$ $target$1 [P,L]
RewriteRule ^/icons/(.*)$ $target$1 [P,L]
RewriteRule ^/favicon.ico$ $target$1 [P,L]

# Optional: allow encoded slashes to pass through
AllowEncodedSlashes NoDecode

# Forwarded headers
RequestHeader set X-Forwarded-Proto expr=%{REQUEST_SCHEME}
RequestHeader set X-Forwarded-Host expr=%{HTTP_HOST}
RequestHeader set X-Forwarded-Prefix "$prefix"
"@

  Set-Content -Path $proxyConf -Value $proxyContent -Encoding ASCII

  # Write vhost file for port 8484
  $vhostContent = @"
<VirtualHost *:8484>
  ServerName localhost:8484
  # Keep DocumentRoot minimal; proxy rules will handle requests
  DocumentRoot "${ApacheRoot}/htdocs"
  # Include proxy rules
  Include conf/extra/portalweb-proxy.conf
</VirtualHost>
"@
  Set-Content -Path $vhostFile -Value $vhostContent -Encoding ASCII

  # Restart Apache service
  $svcName = 'Apache2.4'
  $svc = Get-Service -Name $svcName -ErrorAction SilentlyContinue
  if (-not $svc) {
    $svc = Get-WmiObject Win32_Service | Where-Object { $_.PathName -like "*$binHttpd*" } | Select-Object -First 1
    if ($svc) { $svcName = $svc.Name }
  }
  if ($svcName) {
    Write-Host "Restarting service $svcName..." -ForegroundColor Green
    sc.exe stop $svcName | Out-Null
    Start-Sleep -Seconds 2
    sc.exe start $svcName | Out-Null
  } else {
    Write-Host "Apache service not found. Try restarting manually or run: `"$binHttpd -k restart`"" -ForegroundColor Yellow
  }

  Write-Host "Apache proxy configured successfully." -ForegroundColor Cyan
} catch {
  Write-Host ("Failed: " + $_.Exception.Message) -ForegroundColor Red
  exit 1
}