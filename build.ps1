# build.ps1 - Compiles native AppForge-Hub.exe with embedded app-icon.ico and packages portable release
$ErrorActionPreference = "Stop"

$projectDir = $PSScriptRoot
if (-not $projectDir) { $projectDir = Get-Location }

Write-Host "======================================================" -ForegroundColor Cyan
Write-Host "   Building AppForge Hub v2.0 Release Binary         " -ForegroundColor Cyan
Write-Host "======================================================" -ForegroundColor Cyan

$distDir = Join-Path $projectDir "dist"
if (-not (Test-Path $distDir)) { New-Item -ItemType Directory -Path $distDir -Force | Out-Null }

$iconPath = Join-Path $projectDir "app-icon.ico"
$cscPath = "C:\Windows\Microsoft.NET\Framework64\v4.0.30319\csc.exe"
$launcherCs = Join-Path $projectDir "Launcher.cs"
$outExe = Join-Path $distDir "AppForge-Hub.exe"

# 1. Compile native Windows GUI launcher with embedded Win32 app-icon.ico
Write-Host "Compiling native launcher with embedded Win32 app icon..." -ForegroundColor White
& $cscPath /target:winexe /optimize+ "/win32icon:$iconPath" /out:$outExe $launcherCs

# Copy binary to project root
Copy-Item $outExe -Destination (Join-Path $projectDir "AppForge-Hub.exe") -Force

# 2. Package Portable Distribution
$releaseDir = Join-Path $distDir "AppForge-Hub-v2.0-Portable"
if (Test-Path $releaseDir) { Remove-Item $releaseDir -Recurse -Force }
New-Item -ItemType Directory -Path $releaseDir -Force | Out-Null

$itemsToCopy = @(
    "AppForge-Hub.exe",
    "app-icon.ico",
    "server.js",
    "scanner.js",
    "apps-data.js",
    "package.json",
    "launch-app.vbs",
    "AppForge-Hub.vbs",
    "start.bat",
    "create-desktop-shortcut.ps1",
    "README.md"
)

foreach ($item in $itemsToCopy) {
    $src = Join-Path $projectDir $item
    if (Test-Path $src) {
        Copy-Item $src -Destination $releaseDir -Force
    }
}

Copy-Item (Join-Path $projectDir "public") -Destination $releaseDir -Recurse -Force

# 3. Create Zip Archive
$zipPath = Join-Path $distDir "AppForge-Hub-v2.0-Windows-x64.zip"
if (Test-Path $zipPath) { Remove-Item $zipPath -Force }
Compress-Archive -Path "$releaseDir\*" -DestinationPath $zipPath -CompressionLevel Optimal

Write-Host ""
Write-Host "Build Complete with Embedded App Icon!" -ForegroundColor Green
Write-Host "Standalone Binary:  $outExe" -ForegroundColor Yellow
Write-Host "Root Binary:        $projectDir\AppForge-Hub.exe" -ForegroundColor Yellow
Write-Host "Portable Directory: $releaseDir" -ForegroundColor Yellow
Write-Host "Zip Archive:        $zipPath" -ForegroundColor Yellow
