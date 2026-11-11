// server.js - Fast, lightweight HTTP server for AppForge Hub
const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const { exec, spawn } = require('child_process');
const { scanAllApps } = require('./scanner');

const PORT = process.env.PORT || 4100;

// When packaged by pkg, __dirname points inside the snapshot; public/ is embedded.
// We also check next to the exe for user-side overrides.
const PUBLIC_DIR = path.join(__dirname, 'public');

// In-memory cache of scan results with timestamp
let cachedScan = null;
let lastScanTime = 0;
const CACHE_TTL_MS = 15000; // 15 seconds cache

function getOrUpdateScan(forceRefresh = false) {
  const now = Date.now();
  if (forceRefresh || !cachedScan || (now - lastScanTime > CACHE_TTL_MS)) {
    cachedScan = scanAllApps();
    lastScanTime = now;
  }
  return cachedScan;
}

// Generate PowerShell installation script for selected app IDs
function generatePs1Script(appIds = []) {
  const apps = getOrUpdateScan();
  const selected = apps.filter(a => appIds.includes(a.id));
  
  const scriptLines = [
    '# ===============================================================',
    '# AppForge Hub - Automated Windows Setup Script',
    `# Generated: ${new Date().toISOString()}`,
    `# Total Applications: ${selected.length}`,
    '# ===============================================================',
    '',
    'Write-Host "======================================================" -ForegroundColor Cyan',
    'Write-Host "   Starting Automated App Installation via Winget   " -ForegroundColor Cyan',
    'Write-Host "======================================================" -ForegroundColor Cyan',
    '',
    '# Ensure Winget is available',
    'if (-not (Get-Command winget -ErrorAction SilentlyContinue)) {',
    '    Write-Warning "winget (Windows Package Manager) is not detected."',
    '    Write-Host "Opening direct browser download pages for selected apps instead..." -ForegroundColor Yellow',
    '}'
  ];

  selected.forEach(app => {
    scriptLines.push('');
    scriptLines.push(`Write-Host "------------------------------------------------------" -ForegroundColor DarkGray`);
    scriptLines.push(`Write-Host "Installing [${app.category}] ${app.name}..." -ForegroundColor White`);
    
    if (app.wingetId) {
      scriptLines.push(`if (Get-Command winget -ErrorAction SilentlyContinue) {`);
      scriptLines.push(`    Write-Host "Running: winget install --exact --id '${app.wingetId}' --accept-source-agreements --accept-package-agreements" -ForegroundColor Gray`);
      scriptLines.push(`    winget install --exact --id "${app.wingetId}" --accept-source-agreements --accept-package-agreements --silent`);
      scriptLines.push(`} else {`);
      scriptLines.push(`    Start-Process "${app.directInstallerUrl || app.downloadUrl}"`);
      scriptLines.push(`}`);
    } else {
      scriptLines.push(`Start-Process "${app.directInstallerUrl || app.downloadUrl}"`);
    }
  });

  scriptLines.push('');
  scriptLines.push('Write-Host "======================================================" -ForegroundColor Green');
  scriptLines.push('Write-Host "   All installations and downloads triggered!        " -ForegroundColor Green');
  scriptLines.push('Write-Host "======================================================" -ForegroundColor Green');
  scriptLines.push('pause');

  return scriptLines.join('\r\n');
}

const server = http.createServer((req, res) => {
  const reqUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = reqUrl.pathname;

  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // ----------------------------------------------------
  // API Endpoints
  // ----------------------------------------------------

  // 1. GET /api/apps - Return tracked applications & status
  if (pathname === '/api/apps' && req.method === 'GET') {
    const apps = getOrUpdateScan();
    const stats = {
      total: apps.length,
      installed: apps.filter(a => a.installed).length,
      missing: apps.filter(a => !a.installed).length,
      lastScanTime: new Date(lastScanTime).toLocaleTimeString()
    };
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, stats, apps }));
    return;
  }

  // 2. POST /api/scan - Force Rescan
  if (pathname === '/api/scan' && req.method === 'POST') {
    const apps = getOrUpdateScan(true);
    const stats = {
      total: apps.length,
      installed: apps.filter(a => a.installed).length,
      missing: apps.filter(a => !a.installed).length,
      lastScanTime: new Date(lastScanTime).toLocaleTimeString()
    };
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, stats, apps, message: 'System scan refreshed successfully.' }));
    return;
  }

  // 3. POST /api/launch - Launch installed app locally
  if (pathname === '/api/launch' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const { appId } = JSON.parse(body || '{}');
        const apps = getOrUpdateScan();
        const app = apps.find(a => a.id === appId);

        if (!app || !app.installed) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: 'App not found or not currently installed.' }));
          return;
        }

        if (app.installPath && fs.existsSync(app.installPath)) {
          // Launch the app
          const child = spawn(app.installPath, [], { detached: true, stdio: 'ignore' });
          child.unref();
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, message: `Launched ${app.name} successfully!` }));
        } else {
          // Try launching via default shell command
          const cmd = app.cliCommands && app.cliCommands[0] ? app.cliCommands[0] : null;
          if (cmd) {
            exec(`start "" "${cmd}"`);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, message: `Launched ${app.name} via command.` }));
          } else {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: 'Executable path not directly launchable.' }));
          }
        }
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
    });
    return;
  }

  // 4. POST /api/generate-script - Generate PS1 script for selection
  if (pathname === '/api/generate-script' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const { appIds } = JSON.parse(body || '{}');
        const script = generatePs1Script(appIds || []);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, script }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
    });
    return;
  }

  // 5. GET /api/download-script - Download PS1 script directly
  if (pathname === '/api/download-script' && req.method === 'GET') {
    const rawIds = reqUrl.searchParams.get('ids') || '';
    const appIds = rawIds.split(',').filter(Boolean);
    const scriptContent = generatePs1Script(appIds);
    res.writeHead(200, {
      'Content-Type': 'application/x-powershell',
      'Content-Disposition': 'attachment; filename="install-apps.ps1"'
    });
    res.end(scriptContent);
    return;
  }

  // ----------------------------------------------------
  // Static File Serving
  // ----------------------------------------------------
  let filePath = path.join(PUBLIC_DIR, pathname === '/' ? 'index.html' : pathname);

  // Security check: ensure path is within PUBLIC_DIR
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403);
    res.end('Access denied');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const mimeTypes = {
      '.html': 'text/html; charset=utf-8',
      '.css': 'text/css; charset=utf-8',
      '.js': 'application/javascript; charset=utf-8',
      '.json': 'application/json',
      '.png': 'image/png',
      '.svg': 'image/svg+xml',
      '.ico': 'image/x-icon'
    };

    const contentType = mimeTypes[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, () => {
  const url = `http://localhost:${PORT}`;
  console.log(`\n======================================================`);
  console.log(`   🚀 AppForge Hub Server is running!                 `);
  console.log(`   🌐 Dashboard: ${url}             `);
  console.log(`======================================================\n`);

  // Auto-open browser when launched as a standalone exe
  const { platform } = process;
  const edgePath = `C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe`;
  const openCmd = fs.existsSync(edgePath)
    ? `"${edgePath}" --app="${url}"`
    : `start ${url}`;

  exec(openCmd, (err) => {
    if (err) exec(`start ${url}`);
  });
});
