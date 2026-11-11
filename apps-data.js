// apps-data.js - Comprehensive metadata for all applications & developer tools

module.exports = [
  // ==========================================
  // 🧑‍💻 Development Tools
  // ==========================================
  {
    id: 'vscode',
    name: 'Visual Studio Code',
    category: 'Development Tools',
    icon: '/icons/vscode.svg',
    description: 'Lightweight, versatile code editor with rich ecosystem of extensions and language support.',
    downloadUrl: 'https://code.visualstudio.com/Download',
    directInstallerUrl: 'https://code.visualstudio.com/sha/download?build=stable&os=win32-x64-user',
    wingetId: 'Microsoft.VisualStudioCode',
    registryPatterns: [/Microsoft Visual Studio Code/i],
    cliCommands: ['code'],
    wellKnownPaths: [
      '%LOCALAPPDATA%\\Programs\\Microsoft VS Code\\Code.exe',
      'C:\\Program Files\\Microsoft VS Code\\Code.exe'
    ]
  },
  {
    id: 'visual-studio',
    name: 'Visual Studio',
    category: 'Development Tools',
    icon: '/icons/visual-studio.svg',
    description: 'Microsoft full-featured integrated development environment for C++, .NET, and cloud apps.',
    downloadUrl: 'https://visualstudio.microsoft.com/downloads/',
    directInstallerUrl: 'https://aka.ms/vs/17/release/vs_community.exe',
    wingetId: 'Microsoft.VisualStudio.2022.Community',
    registryPatterns: [/Visual Studio.*(Community|Professional|Enterprise)/i, /Microsoft Visual Studio/i],
    cliCommands: ['devenv.exe'],
    vswhere: true,
    wellKnownPaths: [
      'C:\\Program Files\\Microsoft Visual Studio\\2022\\Community\\Common7\\IDE\\devenv.exe',
      'C:\\Program Files\\Microsoft Visual Studio\\18\\Community\\Common7\\IDE\\devenv.exe'
    ]
  },
  {
    id: 'android-studio',
    name: 'Android Studio',
    category: 'Development Tools',
    icon: '/icons/android-studio.svg',
    description: 'The official IDE for Google Android app development, built on IntelliJ IDEA.',
    downloadUrl: 'https://developer.android.com/studio',
    directInstallerUrl: 'https://redirector.gvt1.com/edgedl/android/studio/install/2024.2.1.11/android-studio-2024.2.1.11-windows.exe',
    wingetId: 'Google.AndroidStudio',
    registryPatterns: [/^Android Studio/i],
    cliCommands: ['studio64.exe'],
    wellKnownPaths: [
      'C:\\Program Files\\Android\\Android Studio\\bin\\studio64.exe',
      'C:\\Program Files (x86)\\Android\\Android Studio\\bin\\studio64.exe',
      '%LOCALAPPDATA%\\Programs\\Android Studio\\bin\\studio64.exe'
    ]
  },
  {
    id: 'antigravity-ide',
    name: 'Antigravity IDE',
    category: 'Development Tools',
    icon: '/icons/antigravity-ide.svg',
    description: 'Next-generation AI-assisted developer IDE with deep agentic workflow integration.',
    downloadUrl: 'https://antigravity.google/',
    directInstallerUrl: 'https://antigravity.google/download',
    wingetId: 'Google.Antigravity',
    registryPatterns: [/^Antigravity/i],
    cliCommands: ['antigravity', 'antigravity.exe'],
    wellKnownPaths: [
      '%LOCALAPPDATA%\\Programs\\antigravity\\Antigravity.exe',
      'C:\\Program Files\\Antigravity\\Antigravity.exe'
    ]
  },
  {
    id: 'git',
    name: 'Git',
    category: 'Development Tools',
    icon: '/icons/git.svg',
    description: 'Fast, distributed version control system designed to handle projects of all scales.',
    downloadUrl: 'https://git-scm.com/download/win',
    directInstallerUrl: 'https://github.com/git-for-windows/git/releases/latest/download/Git-64-bit.exe',
    wingetId: 'Git.Git',
    registryPatterns: [/^Git$/i, /^Git version/i],
    cliCommands: ['git'],
    wellKnownPaths: [
      'C:\\Program Files\\Git\\cmd\\git.exe',
      'C:\\Program Files\\Git\\bin\\git.exe'
    ]
  },
  {
    id: 'postman',
    name: 'Postman API Platform',
    category: 'Development Tools',
    icon: '/icons/postman.svg',
    description: 'The industry-standard API platform for building, designing, testing, and mocking REST & GraphQL APIs.',
    downloadUrl: 'https://www.postman.com/downloads/',
    directInstallerUrl: 'https://dl.pstmn.io/download/latest/win64',
    wingetId: 'Postman.Postman',
    registryPatterns: [/Postman/i],
    cliCommands: ['postman'],
    wellKnownPaths: [
      '%LOCALAPPDATA%\\Postman\\Postman.exe',
      '%LOCALAPPDATA%\\Programs\\Postman\\Postman.exe'
    ]
  },
  {
    id: 'inno-setup',
    name: 'Inno Setup',
    category: 'Development Tools',
    icon: '/icons/inno-setup.svg',
    description: 'Free, professional installer creator for Windows programs with script-driven packaging.',
    downloadUrl: 'https://jrsoftware.org/isdl.php',
    directInstallerUrl: 'https://jrsoftware.org/download.php/is.exe',
    wingetId: 'JRSoftware.InnoSetup',
    registryPatterns: [/Inno Setup/i],
    cliCommands: ['iscc'],
    wellKnownPaths: [
      'C:\\Program Files (x86)\\Inno Setup 6\\Compil32.exe',
      'C:\\Program Files\\Inno Setup 6\\Compil32.exe'
    ]
  },
  {
    id: 'xampp',
    name: 'XAMPP',
    category: 'Development Tools',
    icon: '/icons/xampp.svg',
    description: 'Apache distribution containing MariaDB, PHP, and Perl for local web server stacks.',
    downloadUrl: 'https://www.apachefriends.org/download.html',
    directInstallerUrl: 'https://www.apachefriends.org/index.html',
    wingetId: 'ApacheFriends.Xampp',
    registryPatterns: [/XAMPP/i],
    cliCommands: ['xampp-control.exe'],
    wellKnownPaths: [
      'C:\\xampp\\xampp-control.exe',
      'D:\\xampp\\xampp-control.exe'
    ]
  },

  // ==========================================
  // 🐳 Containers & DevOps
  // ==========================================
  {
    id: 'docker',
    name: 'Docker Desktop',
    category: 'Containers & DevOps',
    icon: '/icons/docker.svg',
    description: 'Build, share, and run containerized apps locally with Docker Engine and Kubernetes orchestration.',
    downloadUrl: 'https://www.docker.com/products/docker-desktop/',
    directInstallerUrl: 'https://desktop.docker.com/win/main/amd64/Docker%20Desktop%20Installer.exe',
    wingetId: 'Docker.DockerDesktop',
    registryPatterns: [/Docker Desktop/i],
    cliCommands: ['docker'],
    wellKnownPaths: [
      'C:\\Program Files\\Docker\\Docker\\Docker Desktop.exe'
    ]
  },

  // ==========================================
  // 🗄️ Database Management
  // ==========================================
  {
    id: 'dbeaver',
    name: 'DBeaver Community',
    category: 'Database Management',
    icon: '/icons/dbeaver.svg',
    description: 'Free universal SQL database management tool supporting PostgreSQL, MySQL, SQLite, Oracle, Redis, & Mongo.',
    downloadUrl: 'https://dbeaver.io/download/',
    directInstallerUrl: 'https://dbeaver.io/files/dbeaver-ce-latest-x86_64-setup.exe',
    wingetId: 'dbeaver.dbeaver',
    registryPatterns: [/DBeaver/i],
    cliCommands: ['dbeaver'],
    wellKnownPaths: [
      'C:\\Program Files\\DBeaver\\dbeaver.exe',
      '%LOCALAPPDATA%\\Programs\\DBeaver\\dbeaver.exe'
    ]
  },

  // ==========================================
  // 💻 Programming Languages & SDKs
  // ==========================================
  {
    id: 'dotnet-sdk',
    name: '.NET SDK',
    category: 'Programming Languages & SDKs',
    icon: '/icons/dotnet-sdk.svg',
    description: 'Cross-platform framework by Microsoft for building cloud, desktop, web, and mobile apps.',
    downloadUrl: 'https://dotnet.microsoft.com/download',
    directInstallerUrl: 'https://dotnet.microsoft.com/download/dotnet/thank-you/sdk-8.0.403-windows-x64-installer',
    wingetId: 'Microsoft.DotNet.SDK.8',
    registryPatterns: [/Microsoft \.NET SDK/i, /\.NET Core SDK/i],
    cliCommands: ['dotnet'],
    wellKnownPaths: [
      'C:\\Program Files\\dotnet\\dotnet.exe'
    ]
  },
  {
    id: 'golang',
    name: 'Go Programming Language',
    category: 'Programming Languages & SDKs',
    icon: '/icons/golang.svg',
    description: 'Fast, statically typed, compiled language created by Google for concurrency and backend services.',
    downloadUrl: 'https://go.dev/dl/',
    directInstallerUrl: 'https://go.dev/dl/go1.23.2.windows-amd64.msi',
    wingetId: 'GoLang.Go',
    registryPatterns: [/^Go Programming Language/i, /^Go$/i],
    cliCommands: ['go'],
    wellKnownPaths: [
      'C:\\Program Files\\Go\\bin\\go.exe',
      'C:\\Go\\bin\\go.exe'
    ]
  },
  {
    id: 'java-jdk',
    name: 'Java JDK',
    category: 'Programming Languages & SDKs',
    icon: '/icons/java-jdk.svg',
    description: 'Java Development Kit (Temurin / Oracle OpenJDK) for running and compiling Java applications.',
    downloadUrl: 'https://adoptium.net/temurin/releases/',
    directInstallerUrl: 'https://adoptium.net/temurin/releases/?version=21',
    wingetId: 'EclipseAdoptium.Temurin.21.JDK',
    registryPatterns: [/Java\(TM\) SE Development Kit/i, /Eclipse Temurin JDK/i, /OpenJDK/i, /Java Auto Updater/i],
    cliCommands: ['java', 'javac'],
    wellKnownPaths: [
      'C:\\Program Files\\Common Files\\Oracle\\Java\\javapath\\java.exe',
      'C:\\Program Files\\Eclipse Adoptium\\jdk-21.*\\bin\\java.exe',
      'C:\\Program Files\\Java\\jdk*\\bin\\java.exe'
    ]
  },
  {
    id: 'nodejs',
    name: 'Node.js',
    category: 'Programming Languages & SDKs',
    icon: '/icons/nodejs.svg',
    description: 'JavaScript runtime built on Chrome\'s V8 engine for building scalable network applications.',
    downloadUrl: 'https://nodejs.org/en/download/',
    directInstallerUrl: 'https://nodejs.org/dist/v20.18.0/node-v20.18.0-x64.msi',
    wingetId: 'OpenJS.NodeJS',
    registryPatterns: [/Node\.js/i],
    cliCommands: ['node'],
    wellKnownPaths: [
      'C:\\Program Files\\nodejs\\node.exe'
    ]
  },
  {
    id: 'python',
    name: 'Python',
    category: 'Programming Languages & SDKs',
    icon: '/icons/python.svg',
    description: 'Interpreted, high-level, general-purpose programming language for scripting, AI, and web apps.',
    downloadUrl: 'https://www.python.org/downloads/',
    directInstallerUrl: 'https://www.python.org/ftp/python/3.12.7/python-3.12.7-amd64.exe',
    wingetId: 'Python.Python.3.12',
    registryPatterns: [/^Python 3\./i, /^Python Core/i],
    cliCommands: ['py', 'python'],
    disallowStoreShim: true,
    wellKnownPaths: [
      '%LOCALAPPDATA%\\Programs\\Python\\Python312\\python.exe',
      '%LOCALAPPDATA%\\Programs\\Python\\Python311\\python.exe',
      'C:\\Python312\\python.exe',
      'C:\\Program Files\\Python312\\python.exe'
    ]
  },
  {
    id: 'msys2',
    name: 'MSYS2 (C/C++ Compiler)',
    category: 'Programming Languages & SDKs',
    icon: '/icons/msys2.svg',
    description: 'Software distribution and building platform providing native GCC and MinGW-w64 toolchains for Windows.',
    downloadUrl: 'https://www.msys2.org/',
    directInstallerUrl: 'https://github.com/msys2/msys2-installer/releases/latest/download/msys2-x86_64-latest.exe',
    wingetId: 'MSYS2.MSYS2',
    registryPatterns: [/MSYS2/i],
    cliCommands: ['msys2', 'gcc'],
    wellKnownPaths: [
      'C:\\msys64\\msys2.exe',
      'C:\\msys64\\ucrt64\\bin\\gcc.exe',
      'C:\\msys64\\mingw64\\bin\\gcc.exe'
    ]
  },

  // ==========================================
  // 🔧 Development Dependencies
  // ==========================================
  {
    id: 'vcredist',
    name: 'Microsoft Visual C++ Redistributable',
    category: 'Development Dependencies',
    icon: '/icons/vcredist.svg',
    description: 'Essential runtime libraries required to run C++ applications built using Visual Studio.',
    downloadUrl: 'https://learn.microsoft.com/en-us/cpp/windows/latest-supported-vc-redist',
    directInstallerUrl: 'https://aka.ms/vs/17/release/vc_redist.x64.exe',
    wingetId: 'Microsoft.VCRedist.2015+.x64',
    registryPatterns: [/Microsoft Visual C\+\+.*Redistributable/i],
    cliCommands: [],
    wellKnownPaths: [
      'C:\\Windows\\System32\\vcruntime140.dll'
    ]
  },

  // ==========================================
  // 📁 File Management & Transfer
  // ==========================================
  {
    id: '7zip',
    name: '7-Zip',
    category: 'File Management & Transfer',
    icon: '/icons/7zip.svg',
    description: 'High-compression file archiver supporting 7z, ZIP, RAR, TAR, GZ and encrypted archives.',
    downloadUrl: 'https://www.7-zip.org/download.html',
    directInstallerUrl: 'https://www.7-zip.org/a/7z2408-x64.exe',
    wingetId: '7zip.7zip',
    registryPatterns: [/^7-Zip/i],
    cliCommands: ['7z'],
    wellKnownPaths: [
      'C:\\Program Files\\7-Zip\\7zFM.exe',
      'C:\\Program Files (x86)\\7-Zip\\7zFM.exe'
    ]
  },
  {
    id: 'filezilla',
    name: 'FileZilla Client',
    category: 'File Management & Transfer',
    icon: '/icons/filezilla.svg',
    description: 'Fast and reliable cross-platform FTP, FTPS, and SFTP client with intuitive dual-pane navigation.',
    downloadUrl: 'https://filezilla-project.org/download.php?type=client',
    directInstallerUrl: 'https://download.filezilla-project.org/client/FileZilla_latest_win64-setup.exe',
    wingetId: 'TimKosse.FileZilla.Client',
    registryPatterns: [/FileZilla Client/i],
    cliCommands: ['filezilla'],
    wellKnownPaths: [
      'C:\\Program Files\\FileZilla FTP Client\\filezilla.exe',
      'C:\\Program Files (x86)\\FileZilla FTP Client\\filezilla.exe'
    ]
  },

  // ==========================================
  // 🛠️ Utilities & System Management
  // ==========================================
  {
    id: 'revo-uninstaller',
    name: 'Revo Uninstaller Pro',
    category: 'Utilities & Management',
    icon: '/icons/revo-uninstaller.svg',
    description: 'Thorough uninstaller tool that scrubs deep leftover files, registries, and broken software traces.',
    downloadUrl: 'https://www.revouninstaller.com/products/revo-uninstaller-pro/',
    directInstallerUrl: 'https://www.revouninstaller.com/download-professional-version.php',
    wingetId: 'VSRevoGroup.RevoUninstallerPro',
    registryPatterns: [/Revo Uninstaller/i],
    cliCommands: ['revouninpro.exe'],
    wellKnownPaths: [
      'C:\\Program Files\\VS Revo Group\\Revo Uninstaller Pro\\RevoUninPro.exe',
      'C:\\Program Files (x86)\\VS Revo Group\\Revo Uninstaller Pro\\RevoUninPro.exe'
    ]
  },
  {
    id: 'idm',
    name: 'IDM (Internet Download Manager)',
    category: 'Utilities & Management',
    icon: '/icons/idm.svg',
    description: 'High-speed download accelerator with multi-segment downloads, browser hooks, and auto-resume.',
    downloadUrl: 'https://www.internetdownloadmanager.com/download.html',
    directInstallerUrl: 'https://mirror2.internetdownloadmanager.com/idman642build22.exe',
    wingetId: 'Tonec.InternetDownloadManager',
    registryPatterns: [/Internet Download Manager/i],
    cliCommands: ['idman.exe'],
    wellKnownPaths: [
      'C:\\Program Files (x86)\\Internet Download Manager\\IDMan.exe',
      'C:\\Program Files\\Internet Download Manager\\IDMan.exe'
    ]
  },
  {
    id: 'wondershare-pdf',
    name: 'Wondershare PDFelement',
    category: 'Utilities & Management',
    icon: '/icons/wondershare-pdf.svg',
    description: 'All-in-one PDF editor with OCR, conversion, document signing, form creation, and editing tools.',
    downloadUrl: 'https://s1-filecr.xyz/9488dc2acdb8ab06?download_token=8e3681bfe1b4eca75db7de8cd2a8cd511ad6e2946b79ea2c9379eac195fe8ba7',
    directInstallerUrl: 'https://s1-filecr.xyz/9488dc2acdb8ab06?download_token=8e3681bfe1b4eca75db7de8cd2a8cd511ad6e2946b79ea2c9379eac195fe8ba7',
    wingetId: 'Wondershare.PDFelement',
    registryPatterns: [/PDFelement/i, /Wondershare PDF/i],
    cliCommands: [],
    wellKnownPaths: [
      'C:\\Program Files\\Wondershare\\PDFelement 10\\PDFelement.exe',
      'C:\\Program Files (x86)\\Wondershare\\PDFelement 10\\PDFelement.exe',
      'C:\\Program Files\\Wondershare\\PDFelement 9\\PDFelement.exe'
    ]
  },
  {
    id: 'wondershare-filmora',
    name: 'Wondershare Filmora',
    category: 'Utilities & Management',
    icon: '/icons/wondershare-filmora.svg',
    description: 'Feature-packed video editing application with AI tools, keyframing, motion tracking, and effects.',
    downloadUrl: 'https://download2367.mediafire.com/legyuy6zjhegDOMWAiIAlRVmwFuWjFjbOKnuH-MSXExxeAknjhA7vtTRaYTvQfY1d6LL-Ovcb_CR616yGZT8UGAqYPT1_ht2FjeFI7xhOKnRp08U0xRXTXgxQi7dFcMSCDeU3Cye3HXWsiLHaAdhba0mGh652YLfwSxL3SgiEsR5nQ/80fx3sili0c8ed8/WondershareFilmora155319727x64.zip',
    directInstallerUrl: 'https://download2367.mediafire.com/legyuy6zjhegDOMWAiIAlRVmwFuWjFjbOKnuH-MSXExxeAknjhA7vtTRaYTvQfY1d6LL-Ovcb_CR616yGZT8UGAqYPT1_ht2FjeFI7xhOKnRp08U0xRXTXgxQi7dFcMSCDeU3Cye3HXWsiLHaAdhba0mGh652YLfwSxL3SgiEsR5nQ/80fx3sili0c8ed8/WondershareFilmora155319727x64.zip',
    wingetId: 'Wondershare.Filmora',
    registryPatterns: [/Filmora/i, /Wondershare Filmora/i],
    cliCommands: [],
    wellKnownPaths: [
      'C:\\Program Files\\Wondershare\\Wondershare Filmora\\Filmora.exe',
      'C:\\Program Files (x86)\\Wondershare\\Wondershare Filmora\\Filmora.exe'
    ]
  },

  // ==========================================
  // 🤖 AI & Productivity
  // ==========================================
  {
    id: 'copilot',
    name: 'Microsoft Copilot / GitHub Copilot',
    category: 'AI & Productivity',
    icon: '/icons/copilot.svg',
    description: 'AI-powered productivity assistant and developer coding companion integrated into Windows.',
    downloadUrl: 'https://copilot.microsoft.com/',
    directInstallerUrl: 'https://apps.microsoft.com/detail/9nht9rb2f4hd',
    wingetId: 'Microsoft.Copilot',
    registryPatterns: [/Copilot/i, /Microsoft Copilot/i],
    cliCommands: ['copilot'],
    wellKnownPaths: [
      '%LOCALAPPDATA%\\Microsoft\\WindowsApps\\Microsoft.Copilot*\\Copilot.exe'
    ]
  },
  {
    id: 'antigravity-ai',
    name: 'Antigravity AI Agent',
    category: 'AI & Productivity',
    icon: '/icons/antigravity-ai.svg',
    description: 'Google DeepMind advanced agentic AI coding companion with terminal and workflow integration.',
    downloadUrl: 'https://antigravity.google/',
    directInstallerUrl: 'https://antigravity.google/download',
    wingetId: 'Google.AntigravityCLI',
    registryPatterns: [/Antigravity/i],
    cliCommands: ['antigravity', 'agy'],
    wellKnownPaths: [
      '%LOCALAPPDATA%\\Programs\\antigravity\\Antigravity.exe'
    ]
  },
  {
    id: 'codex',
    name: 'Codex',
    category: 'AI & Productivity',
    icon: '/icons/codex.svg',
    description: 'AI code generation, translation, and terminal companion for developers.',
    downloadUrl: 'https://get.microsoft.com/installer/download/9PLM9XGG6VKS?cid=website_cta_psi',
    directInstallerUrl: 'https://get.microsoft.com/installer/download/9PLM9XGG6VKS?cid=website_cta_psi',
    wingetId: '9PLM9XGG6VKS',
    registryPatterns: [/Codex/i],
    cliCommands: ['codex'],
    wellKnownPaths: [
      '%LOCALAPPDATA%\\Microsoft\\WindowsApps\\*Codex*\\*.exe',
      '%APPDATA%\\npm\\codex.cmd'
    ]
  },
  {
    id: 'claude',
    name: 'Claude Desktop',
    category: 'AI & Productivity',
    icon: '/icons/claude.svg',
    description: 'Anthropic\'s native desktop app for Claude with Model Context Protocol (MCP) and visual tools.',
    downloadUrl: 'https://claude.ai/download',
    directInstallerUrl: 'https://storage.googleapis.com/osprey-downloads-c02f6a0d-347c-492b-a023-52859e756948/nest-win-x64/Claude-Setup-x64.exe',
    wingetId: 'Anthropic.Claude',
    registryPatterns: [/Claude/i, /Anthropic Claude/i],
    cliCommands: ['claude'],
    wellKnownPaths: [
      '%LOCALAPPDATA%\\AnthropicClaude\\Claude.exe',
      '%LOCALAPPDATA%\\Programs\\Claude\\Claude.exe'
    ]
  },

  // ==========================================
  // 🎮 Gaming
  // ==========================================
  {
    id: 'epic-games',
    name: 'Epic Games Launcher',
    category: 'Gaming',
    icon: '/icons/epic-games.svg',
    description: 'Digital distribution storefront and launcher for Unreal Engine and Epic Games titles.',
    downloadUrl: 'https://store.epicgames.com/download',
    directInstallerUrl: 'https://launcher-public-service-prod06.ol.epicgames.com/launcher/api/installer/download/EpicGamesLauncherInstaller.msi',
    wingetId: 'EpicGames.EpicGamesLauncher',
    registryPatterns: [/Epic Games Launcher/i],
    cliCommands: ['EpicGamesLauncher.exe'],
    wellKnownPaths: [
      'C:\\Program Files (x86)\\Epic Games\\Launcher\\Portal\\Binaries\\Win64\\EpicGamesLauncher.exe',
      'C:\\Program Files\\Epic Games\\Launcher\\Portal\\Binaries\\Win64\\EpicGamesLauncher.exe'
    ]
  },
  {
    id: 'steam',
    name: 'Steam',
    category: 'Gaming',
    icon: '/icons/steam.svg',
    description: 'Premier gaming platform for purchasing, downloading, and playing thousands of PC video games.',
    downloadUrl: 'https://store.steampowered.com/about/',
    directInstallerUrl: 'https://cdn.akamai.steamstatic.com/client/installer/SteamSetup.exe',
    wingetId: 'Valve.Steam',
    registryPatterns: [/^Steam$/i],
    cliCommands: ['steam.exe'],
    wellKnownPaths: [
      'C:\\Program Files (x86)\\Steam\\steam.exe',
      'C:\\Program Files\\Steam\\steam.exe'
    ]
  },

  // ==========================================
  // 🎬 Media
  // ==========================================
  {
    id: 'vlc',
    name: 'VLC Media Player',
    category: 'Media',
    icon: '/icons/vlc.svg',
    description: 'Free and open-source portable cross-platform media player that plays almost every format.',
    downloadUrl: 'https://www.videolan.org/vlc/download-windows.html',
    directInstallerUrl: 'https://get.videolan.org/vlc/3.0.21/win64/vlc-3.0.21-win64.exe',
    wingetId: 'VideoLAN.VLC',
    registryPatterns: [/VLC media player/i],
    cliCommands: ['vlc'],
    wellKnownPaths: [
      'C:\\Program Files\\VideoLAN\\VLC\\vlc.exe',
      'C:\\Program Files (x86)\\VideoLAN\\VLC\\vlc.exe'
    ]
  }
];
