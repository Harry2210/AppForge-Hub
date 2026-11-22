# ⚡ AppForge Hub

> A sleek, modern Windows PC application manager — scan installed apps, check versions, and jump to official download pages in one click.

![AppForge Hub](public/icons/app-icon.svg)

---

## ✨ Features

- **Live System Scanner** — detects installed apps from Windows Registry (HKLM/HKCU, 32-bit & 64-bit) and known executable paths
- **Latest Version Display** — shows the latest known version for every tracked app
- **Status Detection** — instantly see what's Installed, Missing, or has an Update available
- **Official Download Links** — one click opens the app's official website (no shady direct links)
- **Install Missing Apps** — export a PowerShell script to open download pages for all missing apps
- **Zero Terminal Windows** — launches silently with no visible CMD/PowerShell popup
- **Full-Screen App Mode** — runs in Edge `--app` mode, edge-to-edge, no browser chrome
- **30 Tracked Apps** — across 5 categories: Dev Tools, AI & Productivity, Browsers, Media & Design, Utilities

---

## 🗂️ Tracked Categories

| Category | Apps |
|---|---|
| 🛠️ Development Tools | VS Code, Git, Node.js, Python, Windows Terminal, Docker, Postman, 7-Zip, OpenCode |
| 🤖 AI & Productivity | ChatGPT, Notion, Obsidian, Slack, Discord, Zoom, Microsoft Teams |
| 🌐 Browsers | Google Chrome, Mozilla Firefox, Microsoft Edge, Brave |
| 🎨 Media & Design | Figma, VLC Media Player, OBS Studio, GIMP, Spotify |
| 🔧 Utilities | Everything Search, PowerToys, TreeSize Free, Wireshark |

---

## 🚀 Getting Started

### Option A — Double-click the EXE (Recommended)
1. Download `AppForge-Hub.exe` from [Releases](../../releases)
2. Double-click it — it starts the local server and opens the app in Edge automatically

### Option B — Run from Source
**Requirements**: Node.js 18+

```bash
git clone https://github.com/Harry2210/AppForge-Hub.git
cd AppForge-Hub
node server.js
```
Then open `http://localhost:4100` in your browser.

---

## 🏗️ Project Structure

```
AppForge-Hub/
├── server.js          # Express server (port 4100)
├── scanner.js         # Windows app detection engine
├── apps-data.js       # App catalog (30 apps, latest versions, official URLs)
├── Launcher.cs        # C# source for native .exe launcher
├── build.ps1          # Build script → compiles Launcher.cs + packages release
├── app-icon.ico       # App icon (multi-res: 16–256px)
├── public/
│   ├── index.html     # App UI
│   ├── style.css      # Dark glass-morphism UI styles
│   └── app.js         # Frontend logic
```

`build.ps1` generates the root launcher and the `dist/` release package; these generated files are not included in the source repository.

---

## 🔨 Building from Source

Requires `.NET Framework 4` (pre-installed on Windows 10/11):

```powershell
powershell -ExecutionPolicy Bypass -File .\build.ps1
```

This compiles `Launcher.cs` → `AppForge-Hub.exe` with the embedded icon and packages a portable release zip.

---

## 📋 How the Scanner Works

1. Queries `HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall` (64-bit + 32-bit)
2. Queries `HKCU\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall`
3. Checks known executable paths (e.g. `%LOCALAPPDATA%\Programs\...`)
4. Compares found version against the tracked `latestVersion` for each app
5. Returns status: `latest` | `update-available` | `installed` | `missing`

---

## 📄 License

MIT — free to use, modify, and distribute.
