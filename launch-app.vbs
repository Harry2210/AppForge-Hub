Set WshShell = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")

currentDir = fso.GetParentFolderName(WScript.ScriptFullName)

On Error Resume Next
Set http = CreateObject("MSXML2.XMLHTTP")
http.Open "GET", "http://localhost:4100/api/apps", False
http.Send

If Err.Number <> 0 Or http.Status <> 200 Then
    WshShell.CurrentDirectory = currentDir
    WshShell.Run "cmd /c node server.js", 0, False
    WScript.Sleep 1500
End If
On Error GoTo 0

edgePath = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
If fso.FileExists(edgePath) Then
    WshShell.Run """" & edgePath & """ --app=""http://localhost:4100""", 1, False
Else
    WshShell.Run "http://localhost:4100", 1, False
End If
