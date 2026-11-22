' AppForge-Hub.vbs - Direct double-click launcher with zero terminal/console
Set WshShell = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")
currentDir = fso.GetParentFolderName(WScript.ScriptFullName)
vbsPath = currentDir & "\launch-app.vbs"
WshShell.Run "wscript.exe """ & vbsPath & """", 0, False
