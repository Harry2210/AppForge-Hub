' launch-app.vbs - Silent desktop launcher for AppForge Hub (Zero Terminal / Console Window)
Set WshShell = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")

currentDir = fso.GetParentFolderName(WScript.ScriptFullName)

' 1. Locate Node.js executable
nodeExe = ""
candidates = Array( _
    "C:\Program Files\nodejs\node.exe", _
    "C:\Program Files (x86)\nodejs\node.exe", _
    WshShell.ExpandEnvironmentStrings("%LOCALAPPDATA%\Programs\DeepSeek Harness\resources\runtime\primary-runtime\dependencies\node\bin\node.exe"), _
    WshShell.ExpandEnvironmentStrings("%LOCALAPPDATA%\Programs\nodejs\node.exe"), _
    WshShell.ExpandEnvironmentStrings("%APPDATA%\npm\node.exe") _
)

For Each p In candidates
    If fso.FileExists(p) Then
        nodeExe = p
        Exit For
    End If
Next

If nodeExe = "" Then
    nodeExe = "node.exe"
End If

' 2. Check if AppForge Hub server is already running on port 4100
isRunning = False
On Error Resume Next
Set http = CreateObject("MSXML2.ServerXMLHTTP.6.0")
If Err.Number <> 0 Then
    Err.Clear
    Set http = CreateObject("MSXML2.XMLHTTP")
End If

http.Open "GET", "http://127.0.0.1:4100/api/apps", False
http.Send
If Err.Number = 0 And http.Status = 200 Then
    isRunning = True
End If
On Error GoTo 0

' 3. If server is not running, start it in hidden background mode (Style 0 = No terminal!)
If Not isRunning Then
    WshShell.CurrentDirectory = currentDir
    ' Style 0 hides the console window completely
    WshShell.Run """" & nodeExe & """ """ & currentDir & "\server.js""", 0, False

    ' Wait up to 6 seconds for server to initialize
    For i = 1 To 12
        WScript.Sleep 500
        On Error Resume Next
        Set checkHttp = CreateObject("MSXML2.ServerXMLHTTP.6.0")
        If Err.Number <> 0 Then
            Err.Clear
            Set checkHttp = CreateObject("MSXML2.XMLHTTP")
        End If
        checkHttp.Open "GET", "http://127.0.0.1:4100/api/apps", False
        checkHttp.Send
        If Err.Number = 0 And checkHttp.Status = 200 Then
            isRunning = True
            Exit For
        End If
    Next
    On Error GoTo 0
End If

' 4. Launch modern desktop application window with fixed size (1260x840)
edgePath = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
If Not fso.FileExists(edgePath) Then
    edgePath = "C:\Program Files\Microsoft\Edge\Application\msedge.exe"
End If

If fso.FileExists(edgePath) Then
    WshShell.Run """" & edgePath & """ --app=""http://localhost:4100"" --window-size=1260,840", 1, False
Else
    WshShell.Run "http://localhost:4100", 1, False
End If
