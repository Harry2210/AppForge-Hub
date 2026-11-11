# ⚡ AppForge Hub - PC Application Manager & 1-Click Setup Suite

A modern, high-performance local web application that scans your Windows PC to detect installed applications and versions, and lets you download the latest releases, copy silent Winget commands, or export automated 1-click batch installation scripts from a single unified dashboard.

---

## 🌟 Key Features

1. **Live System Detection**:
   - Queries Windows 32-bit & 64-bit Registry hives (`HKLM`, `HKCU`, `Wow6432Node`).
   - Checks environment `PATH` binaries using native CLI detection (`where.exe`).
   - Integrates with Microsoft's `vswhere.exe` for precise Visual Studio Community/Enterprise detection.
   - Accurately filters out 0-byte Microsoft Store execution shims (e.g. placeholder Python shims).
   - Reports exact installed versions and install paths in real-time.

2. **One-Click Downloads**:
   - Direct download links to latest official vendor installers.
   - Winget CLI installation commands (`winget install --id ...`).

3. **Automated Batch Setup**:
   - **Select All Missing**: One click highlights every application currently missing on your PC.
   - **Download `.ps1` Setup Script**: Generates an automated PowerShell script to install or open all selected applications unattended.
   - **Copy Winget Batch Command**: Copies a single combined command to install all selected apps.

4. **1-Click Launching**:
   - Launch any detected installed tool (e.g. VS Code, Git, VLC, Visual Studio) directly from your browser.

---

## 🚀 Single-Click Desktop Web App

### 1. From Your Desktop (Instant 1-Click)
A shortcut named **"AppForge Hub"** has been created on your Windows Desktop:
- Double-click **`AppForge Hub`** on your Desktop.
- It will automatically ensure the local backend is running and launch in **Standalone App Window Mode** (no browser URL bar or tabs, clean native desktop window).

### 2. Browser PWA (Progressive Web App)
- When visiting `http://localhost:4100` in Edge or Chrome, click the **"Install App"** button in the top bar or click the install icon (🖥️) in your browser address bar.
- It will pin to your Windows Start Menu and Taskbar like any native application.

---

## 🚀 Alternative Launch Methods

### Option 1: One-Click Windows Launcher
Double-click [`start.bat`](file:///C:/Users/hario/.gemini/antigravity/scratch/app-hub/start.bat) inside the project folder.

### Option 2: Command Line
```powershell
node server.js
```
Then visit:
```
http://localhost:4100
```

---

## 📦 Tracked Application Inventory

### 🧑‍💻 Development Tools
- **Visual Studio Code** — Fast, versatile code editor (`Microsoft.VisualStudioCode`)
- **Visual Studio** — Microsoft full-featured IDE for C++, .NET, and cloud apps
- **Android Studio** — Google's official Android development IDE (`Google.AndroidStudio`)
- **Antigravity IDE** — Next-gen AI-assisted agentic developer IDE
- **Git** — Distributed version control system (`Git.Git`)
- **Postman API Platform** — Industry-standard API design & testing suite (`Postman.Postman`)
- **Inno Setup** — Professional Windows installer packaging tool (`JRSoftware.InnoSetup`)
- **XAMPP** — Local web server stack containing Apache, MariaDB, PHP, and Perl (`ApacheFriends.Xampp`)

### 🐳 Containers & DevOps
- **Docker Desktop** — Containerization engine & Kubernetes cluster (`Docker.DockerDesktop`)

### 🗄️ Database Management
- **DBeaver Community** — Universal SQL & NoSQL database client (`dbeaver.dbeaver`)

### 💻 Programming Languages & SDKs
- **.NET SDK** — Microsoft .NET development platform & runtime (`Microsoft.DotNet.SDK.8`)
- **Go Programming Language** — Google's compiled concurrent language (`GoLang.Go`)
- **Java JDK** — Temurin / Oracle OpenJDK developer kit (`EclipseAdoptium.Temurin.21.JDK`)
- **Node.js** — Fast JavaScript runtime on Chrome V8 (`OpenJS.NodeJS`)
- **Python** — General-purpose programming language (`Python.Python.3.12`)
- **MSYS2 (C/C++ Compiler)** — MinGW-w64 & GCC native toolchain for Windows (`MSYS2.MSYS2`)

### 🔧 Development Dependencies
- **Microsoft Visual C++ Redistributable** — Core runtime DLLs for C++ applications (`Microsoft.VCRedist.2015+.x64`)

### 📁 File Management & Transfer
- **7-Zip** — High-compression file archiver (`7zip.7zip`)
- **FileZilla Client** — Fast FTP, FTPS, and SFTP file transfer client (`TimKosse.FileZilla.Client`)

### 🛠️ Utilities & Management
- **Revo Uninstaller Pro** — Deep uninstaller for leftover traces & registries (`VSRevoGroup.RevoUninstallerPro`)
- **IDM (Internet Download Manager)** — High-speed download accelerator (`Tonec.InternetDownloadManager`)
- **Wondershare PDFelement** — PDF editor, OCR, and document manager (`Wondershare.PDFelement`)
- **Wondershare Filmora** — Feature-packed video editing application (`Wondershare.Filmora`)

### 🤖 AI & Productivity
- **Microsoft Copilot / GitHub Copilot** — AI pair programmer & Windows productivity companion
- **Antigravity AI Agent** — Google DeepMind advanced agentic coding assistant
- **Codex** — AI developer companion (`9PLM9XGG6VKS`)
- **Claude Desktop** — Anthropic's native desktop application (`Anthropic.Claude`)

### 🎮 Gaming
- **Epic Games Launcher** — Storefront and engine launcher (`EpicGames.EpicGamesLauncher`)
- **Steam** — Valve's premier PC video gaming platform (`Valve.Steam`)

### 🎬 Media
- **VLC Media Player** — Universal multimedia playback suite (`VideoLAN.VLC`)

---

## 📁 Project Architecture

```
app-hub/
├── public/
│   ├── index.html        # Modern responsive single-page dashboard
│   ├── style.css         # Glassmorphic dark theme & animations
│   └── app.js            # Frontend reactive engine, filters & batch actions
├── apps-data.js          # Central registry & detection patterns for all apps
├── scanner.js            # Deep system inspection engine (Registry, PATH, VSWhere)
├── server.js             # Zero-dependency Node.js HTTP & REST API server
├── start.bat             # One-click Windows startup batch script
├── package.json          # Package manifest
└── README.md             # Documentation
```
