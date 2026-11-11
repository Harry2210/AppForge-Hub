# create-desktop-shortcut.ps1
$wsh = New-Object -ComObject WScript.Shell
$desktop = [System.Environment]::GetFolderPath('Desktop')
$shortcutPath = Join-Path $desktop "AppForge Hub.lnk"

$projectDir = "C:\Users\hario\.gemini\antigravity\scratch\app-hub"
$vbsPath = Join-Path $projectDir "launch-app.vbs"

$shortcut = $wsh.CreateShortcut($shortcutPath)
$shortcut.TargetPath = "wscript.exe"
$shortcut.Arguments = "`"$vbsPath`""
$shortcut.WorkingDirectory = $projectDir
$shortcut.Description = "AppForge Hub - PC Application Manager & 1-Click Installer"

# Use Edge or Windows system icon for app appearance
$edgePath = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
if (Test-Path $edgePath) {
    $shortcut.IconLocation = "$edgePath,0"
}

$shortcut.Save()
Write-Host "Created desktop shortcut at: $shortcutPath"
