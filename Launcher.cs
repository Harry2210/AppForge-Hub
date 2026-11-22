using System;
using System.Diagnostics;
using System.IO;
using System.Net;
using System.Reflection;
using System.Threading;

[assembly: AssemblyTitle("AppForge Hub")]
[assembly: AssemblyDescription("Fixed-Frame PC Application Manager & 1-Click Installer")]
[assembly: AssemblyProduct("AppForge Hub")]
[assembly: AssemblyCompany("AppForge")]
[assembly: AssemblyVersion("2.0.0.0")]
[assembly: AssemblyFileVersion("2.0.0.0")]

static class Program {
    [STAThread]
    static void Main() {
        string appDir = AppDomain.CurrentDomain.BaseDirectory;
        string serverJs = Path.Combine(appDir, "server.js");

        // If not directly in base directory, look in known project locations
        if (!File.Exists(serverJs)) {
            string fallback = @"C:\Users\hario\Desktop\AppForge-Hub\server.js";
            if (File.Exists(fallback)) {
                serverJs = fallback;
                appDir = Path.GetDirectoryName(fallback);
            }
        }

        // 1. Check if AppForge Hub server is already active on port 4100
        bool running = false;
        try {
            var req = (HttpWebRequest)WebRequest.Create("http://127.0.0.1:4100/api/apps");
            req.Timeout = 1200;
            using (var resp = (HttpWebResponse)req.GetResponse()) {
                if (resp.StatusCode == HttpStatusCode.OK) running = true;
            }
        } catch {}

        // 2. Start server in hidden background mode if not already running (Zero Console)
        if (!running) {
            string nodePath = FindNode();
            if (File.Exists(serverJs)) {
                var psi = new ProcessStartInfo {
                    FileName = nodePath,
                    Arguments = "\"" + serverJs + "\"",
                    WorkingDirectory = appDir,
                    CreateNoWindow = true,
                    UseShellExecute = false,
                    WindowStyle = ProcessWindowStyle.Hidden
                };
                try {
                    Process.Start(psi);
                } catch {}

                // Wait up to 6 seconds for server to be responsive
                for (int i = 0; i < 12; i++) {
                    Thread.Sleep(500);
                    try {
                        var req = (HttpWebRequest)WebRequest.Create("http://127.0.0.1:4100/api/apps");
                        req.Timeout = 800;
                        using (var resp = (HttpWebResponse)req.GetResponse()) {
                            if (resp.StatusCode == HttpStatusCode.OK) {
                                running = true;
                                break;
                            }
                        }
                    } catch {}
                }
            }
        }

        // 3. Launch modern fixed desktop window via Edge App mode (1260x840)
        string edgePath = @"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe";
        if (!File.Exists(edgePath)) {
            edgePath = @"C:\Program Files\Microsoft\Edge\Application\msedge.exe";
        }

        if (File.Exists(edgePath)) {
            Process.Start(new ProcessStartInfo {
                FileName = edgePath,
                Arguments = "--app=\"http://localhost:4100\" --window-size=1260,840",
                UseShellExecute = true
            });
        } else {
            Process.Start("http://localhost:4100");
        }
    }

    static string FindNode() {
        string localApp = Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData);
        string[] candidates = {
            @"C:\Program Files\nodejs\node.exe",
            @"C:\Program Files (x86)\nodejs\node.exe",
            Path.Combine(localApp, @"Programs\DeepSeek Harness\resources\runtime\primary-runtime\dependencies\node\bin\node.exe"),
            Path.Combine(localApp, @"Programs\nodejs\node.exe")
        };
        foreach (var c in candidates) {
            if (File.Exists(c)) return c;
        }
        return "node.exe";
    }
}
