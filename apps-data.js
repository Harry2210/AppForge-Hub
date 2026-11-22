// apps-data.js - Comprehensive metadata for all applications & developer tools
// Includes verified latest versions, official download endpoints, and detection rules

module.exports = [
  // ==========================================
  // 🧑‍💻 Development Tools
  // ==========================================
  {
    id: 'vscode',
    name: 'Visual Studio Code',
    category: 'Development Tools',
    icon: '/icons/vscode.svg',
    latestVersion: '1.96.2',
    description: 'Lightweight, versatile code editor with rich ecosystem of extensions and language support.',
    downloadUrl: 'https://code.visualstudio.com/',
    directInstallerUrl: 'https://code.visualstudio.com/',
    wingetId: 'Microsoft.VisualStudioCode',
    registryPatterns: [/^Microsoft Visual Studio Code/i],
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
    latestVersion: '17.12.3',
    description: 'Microsoft full-featured integrated development environment for C++, .NET, and cloud apps.',
    downloadUrl: 'https://visualstudio.microsoft.com/downloads/',
    directInstallerUrl: 'https://visualstudio.microsoft.com/downloads/',
    wingetId: 'Microsoft.VisualStudio.2022.Community',
    registryPatterns: [
      /^Microsoft Visual Studio\s+(20\d\d|1\d)/i,
      /^Visual Studio\s+(Community|Professional|Enterprise|20\d\d)/i
    ],
    cliCommands: ['devenv.exe'],
    vswhere: true,
    wellKnownPaths: [
      'C:\\Program Files\\Microsoft Visual Studio\\2022\\Community\\Common7\\IDE\\devenv.exe',
      'C:\\Program Files\\Microsoft Visual Studio\\2022\\Enterprise\\Common7\\IDE\\devenv.exe',
      'C:\\Program Files\\Microsoft Visual Studio\\2022\\Professional\\Common7\\IDE\\devenv.exe'
    ]
  },
  {
    id: 'android-studio',
    name: 'Android Studio',
    category: 'Development Tools',
    icon: '/icons/android-studio.svg',
    latestVersion: '2024.2.1',
    description: 'The official IDE for Google Android app development, built on IntelliJ IDEA.',
    downloadUrl: 'https://developer.android.com/studio',
    directInstallerUrl: 'https://developer.android.com/studio',
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
    id: 'git',
    name: 'Git',
    category: 'Development Tools',
    icon: '/icons/git.svg',
    latestVersion: '2.47.1',
    description: 'Fast, distributed version control system designed to handle projects of all scales.',
    downloadUrl: 'https://git-scm.com/',
    directInstallerUrl: 'https://git-scm.com/',
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
    latestVersion: '11.26.0',
    description: 'The industry-standard API platform for building, designing, testing, and mocking REST & GraphQL APIs.',
    downloadUrl: 'https://www.postman.com/downloads/',
    directInstallerUrl: 'https://www.postman.com/downloads/',
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
    latestVersion: '6.3.3',
    description: 'Free, professional installer creator for Windows programs with script-driven packaging.',
    downloadUrl: 'https://jrsoftware.org/isdl.php',
    directInstallerUrl: 'https://jrsoftware.org/isdl.php',
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
    latestVersion: '8.2.12',
    description: 'Apache distribution containing MariaDB, PHP, and Perl for local web server stacks.',
    downloadUrl: 'https://www.apachefriends.org/',
    directInstallerUrl: 'https://www.apachefriends.org/',
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
    latestVersion: '4.36.0',
    description: 'Build, share, and run containerized apps locally with Docker Engine and Kubernetes orchestration.',
    downloadUrl: 'https://www.docker.com/products/docker-desktop/',
    directInstallerUrl: 'https://www.docker.com/products/docker-desktop/',
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
    latestVersion: '24.3.0',
    description: 'Free universal SQL database management tool supporting PostgreSQL, MySQL, SQLite, Oracle, Redis, & Mongo.',
    downloadUrl: 'https://dbeaver.io/',
    directInstallerUrl: 'https://dbeaver.io/',
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
    latestVersion: '9.0.101',
    description: 'Cross-platform framework by Microsoft for building cloud, desktop, web, and mobile apps.',
    downloadUrl: 'https://dotnet.microsoft.com/download',
    directInstallerUrl: 'https://dotnet.microsoft.com/download',
    wingetId: 'Microsoft.DotNet.SDK.9',
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
    latestVersion: '1.23.4',
    description: 'Fast, statically typed, compiled language created by Google for concurrency and backend services.',
    downloadUrl: 'https://go.dev/',
    directInstallerUrl: 'https://go.dev/',
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
    latestVersion: '21.0.5',
    description: 'Java Development Kit (Temurin / Oracle OpenJDK) for running and compiling Java applications.',
    downloadUrl: 'https://adoptium.net/',
    directInstallerUrl: 'https://adoptium.net/',
    wingetId: 'EclipseAdoptium.Temurin.21.JDK',
    registryPatterns: [/Eclipse Temurin.*JDK/i, /Java\(TM\) SE Development Kit/i, /OpenJDK/i, /Java Auto Updater/i],
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
    latestVersion: '22.12.0',
    description: 'JavaScript runtime built on Chrome\'s V8 engine for building scalable network applications.',
    downloadUrl: 'https://nodejs.org/',
    directInstallerUrl: 'https://nodejs.org/',
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
    latestVersion: '3.13.1',
    description: 'Interpreted, high-level, general-purpose programming language for scripting, AI, and web apps.',
    downloadUrl: 'https://www.python.org/',
    directInstallerUrl: 'https://www.python.org/',
    wingetId: 'Python.Python.3.13',
    registryPatterns: [/^Python 3\./i, /^Python Core/i],
    cliCommands: ['py', 'python'],
    disallowStoreShim: true,
    wellKnownPaths: [
      '%LOCALAPPDATA%\\Programs\\Python\\Python313\\python.exe',
      '%LOCALAPPDATA%\\Programs\\Python\\Python312\\python.exe',
      '%LOCALAPPDATA%\\Programs\\Python\\Python315\\python.exe',
      'C:\\Python313\\python.exe',
      'C:\\Program Files\\Python313\\python.exe'
    ]
  },
  {
    id: 'msys2',
    name: 'MSYS2 (C/C++ Compiler)',
    category: 'Programming Languages & SDKs',
    icon: '/icons/msys2.svg',
    latestVersion: '2024-05-07',
    description: 'Software distribution and building platform providing native GCC and MinGW-w64 toolchains for Windows.',
    downloadUrl: 'https://www.msys2.org/',
    directInstallerUrl: 'https://www.msys2.org/',
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
    latestVersion: '14.42.34433',
    description: 'Essential runtime libraries required to run C++ applications built using Visual Studio (2015-2022).',
    downloadUrl: 'https://learn.microsoft.com/en-us/cpp/windows/latest-supported-vc-redist',
    directInstallerUrl: 'https://learn.microsoft.com/en-us/cpp/windows/latest-supported-vc-redist',
    wingetId: 'Microsoft.VCRedist.2015+.x64',
    registryPatterns: [/Microsoft Visual C\+\+.*(2015-2022|2015|2017|2019|2022).*Redistributable/i, /Microsoft Visual C\+\+.*Redistributable/i],
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
    latestVersion: '24.09',
    description: 'High-compression file archiver supporting 7z, ZIP, RAR, TAR, GZ and encrypted archives.',
    downloadUrl: 'https://www.7-zip.org/',
    directInstallerUrl: 'https://www.7-zip.org/',
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
    latestVersion: '3.68.1',
    description: 'Fast and reliable cross-platform FTP, FTPS, and SFTP client with intuitive dual-pane navigation.',
    downloadUrl: 'https://filezilla-project.org/',
    directInstallerUrl: 'https://filezilla-project.org/',
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
    latestVersion: '5.3.3',
    description: 'Thorough uninstaller tool that scrubs deep leftover files, registries, and broken software traces.',
    downloadUrl: 'https://www.revouninstaller.com/',
    directInstallerUrl: 'https://www.revouninstaller.com/',
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
    latestVersion: '6.42.23',
    description: 'High-speed download accelerator with multi-segment downloads, browser hooks, and auto-resume.',
    downloadUrl: 'https://www.internetdownloadmanager.com/',
    directInstallerUrl: 'https://www.internetdownloadmanager.com/',
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
    latestVersion: '11.0.8',
    description: 'All-in-one PDF editor with OCR, conversion, document signing, form creation, and editing tools.',
    downloadUrl: 'https://pdf.wondershare.com/',
    directInstallerUrl: 'https://pdf.wondershare.com/',
    wingetId: 'Wondershare.PDFelement',
    registryPatterns: [/PDFelement/i, /Wondershare PDF/i],
    cliCommands: [],
    wellKnownPaths: [
      'C:\\Program Files\\Wondershare\\PDFelement 11\\PDFelement.exe',
      'C:\\Program Files\\Wondershare\\PDFelement 10\\PDFelement.exe',
      'C:\\Program Files (x86)\\Wondershare\\PDFelement 10\\PDFelement.exe'
    ]
  },
  {
    id: 'wondershare-filmora',
    name: 'Wondershare Filmora',
    category: 'Utilities & Management',
    icon: '/icons/wondershare-filmora.svg',
    latestVersion: '14.0.11',
    description: 'Feature-packed video editing application with AI tools, keyframing, motion tracking, and effects.',
    downloadUrl: 'https://filmora.wondershare.com/',
    directInstallerUrl: 'https://filmora.wondershare.com/',
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
    latestVersion: '1.0.114',
    description: 'AI-powered productivity assistant and developer coding companion integrated into Windows.',
    downloadUrl: 'https://copilot.microsoft.com/',
    directInstallerUrl: 'https://copilot.microsoft.com/',
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
    latestVersion: '2.34.0',
    description: 'Google DeepMind advanced agentic AI coding companion with terminal and workflow integration.',
    downloadUrl: 'https://antigravity.google/',
    directInstallerUrl: 'https://antigravity.google/',
    wingetId: 'Google.AntigravityCLI',
    registryPatterns: [/Antigravity/i],
    cliCommands: ['antigravity', 'agy'],
    wellKnownPaths: [
      '%LOCALAPPDATA%\\Programs\\antigravity\\Antigravity.exe'
    ]
  },
  {
    id: 'opencode',
    name: 'OpenCode',
    category: 'AI & Productivity',
    icon: '/icons/opencode.svg',
    latestVersion: '1.2.0',
    description: 'Open-source autonomous AI coding assistant and agent for terminal and desktop development workflows.',
    downloadUrl: 'https://opencode.ai/',
    directInstallerUrl: 'https://opencode.ai/',
    wingetId: 'OpenCode.OpenCode',
    registryPatterns: [/OpenCode/i],
    cliCommands: ['opencode'],
    wellKnownPaths: [
      '%LOCALAPPDATA%\\Programs\\OpenCode\\OpenCode.exe',
      '%APPDATA%\\npm\\opencode.cmd'
    ]
  },
  {
    id: 'codex',
    name: 'Codex',
    category: 'AI & Productivity',
    icon: '/icons/codex.svg',
    latestVersion: '1.0.5',
    description: 'AI code generation, translation, and terminal companion for developers.',
    downloadUrl: 'https://openai.com/',
    directInstallerUrl: 'https://openai.com/',
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
    latestVersion: '0.7.8',
    description: 'Anthropic\'s native desktop app for Claude with Model Context Protocol (MCP) and visual tools.',
    downloadUrl: 'https://claude.ai/download',
    directInstallerUrl: 'https://claude.ai/download',
    wingetId: 'Anthropic.Claude',
    registryPatterns: [/^Claude$/i, /Anthropic Claude/i],
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
    latestVersion: '16.2.0',
    description: 'Digital distribution storefront and launcher for Unreal Engine and Epic Games titles.',
    downloadUrl: 'https://store.epicgames.com/',
    directInstallerUrl: 'https://store.epicgames.com/',
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
    latestVersion: '1.0.0.79',
    description: 'Premier gaming platform for purchasing, downloading, and playing thousands of PC video games.',
    downloadUrl: 'https://store.steampowered.com/',
    directInstallerUrl: 'https://store.steampowered.com/',
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
    latestVersion: '3.0.21',
    description: 'Free and open-source portable cross-platform media player that plays almost every format.',
    downloadUrl: 'https://www.videolan.org/vlc/',
    directInstallerUrl: 'https://www.videolan.org/vlc/',
    wingetId: 'VideoLAN.VLC',
    registryPatterns: [/VLC media player/i],
    cliCommands: ['vlc'],
    wellKnownPaths: [
      'C:\\Program Files\\VideoLAN\\VLC\\vlc.exe',
      'C:\\Program Files (x86)\\VideoLAN\\VLC\\vlc.exe'
    ]
  }
];
