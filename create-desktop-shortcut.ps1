# create-desktop-shortcut.ps1 - Creates a desktop shortcut for AppForge Hub
$wsh = New-Object -ComObject WScript.Shell
$desktop = [System.Environment]::GetFolderPath('Desktop')
$shortcutPath = Join-Path $desktop "AppForge Hub.lnk"

$projectDir = $PSScriptRoot
if (-not $projectDir) {
    $projectDir = "C:\Users\hario\Desktop\AppForge-Hub"
}
$exePath = Join-Path $projectDir "AppForge-Hub.exe"
$vbsPath = Join-Path $projectDir "launch-app.vbs"
$iconPath = Join-Path $projectDir "app-icon.ico"

$shortcut = $wsh.CreateShortcut($shortcutPath)

if (Test-Path $exePath) {
    $shortcut.TargetPath = $exePath
    $shortcut.Arguments = ""
} else {
    $shortcut.TargetPath = "wscript.exe"
    $shortcut.Arguments = "`"$vbsPath`""
}

$shortcut.WorkingDirectory = $projectDir
$shortcut.Description = "AppForge Hub - Fixed Frame Desktop PC App Manager & 1-Click Installer"

# Use embedded application icon
if (Test-Path $iconPath) {
    $shortcut.IconLocation = "$iconPath,0"
} elseif (Test-Path $exePath) {
    $shortcut.IconLocation = "$exePath,0"
}

$shortcut.Save()
Write-Host "Created desktop shortcut with app icon at: $shortcutPath" -ForegroundColor Green
