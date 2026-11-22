// server.js - Fast, lightweight HTTP server for AppForge Hub
const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const { exec, spawn } = require('child_process');
const { scanAllApps } = require('./scanner');

const PORT = process.env.PORT || 4100;
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

// Generate PowerShell script for selected app IDs opening official vendor sites
function generatePs1Script(appIds = []) {
  const apps = getOrUpdateScan();
  const selected = apps.filter(a => appIds.includes(a.id));

  const scriptLines = [
    '# ===============================================================',
    '# AppForge Hub - Official Application Setup Script',
    `# Generated: ${new Date().toISOString()}`,
    `# Total Applications: ${selected.length}`,
    '# ===============================================================',
    '',
    '$ErrorActionPreference = "Continue"',
    '',
    'Write-Host "======================================================" -ForegroundColor Cyan',
    'Write-Host "   AppForge Hub - Opening Official Application Sites  " -ForegroundColor Cyan',
    'Write-Host "======================================================" -ForegroundColor Cyan',
    `Write-Host "Applications selected: ${selected.length}" -ForegroundColor Yellow`,
    ''
  ];

  selected.forEach(app => {
    scriptLines.push(`Write-Host "------------------------------------------------------" -ForegroundColor DarkGray`);
    scriptLines.push(`Write-Host "Opening official site for [${app.category}] ${app.name}..." -ForegroundColor White`);
    scriptLines.push(`Start-Process "${app.downloadUrl}"`);
  });

  scriptLines.push('');
  scriptLines.push('Write-Host "======================================================" -ForegroundColor Green');
  scriptLines.push('Write-Host "   All official application pages opened!             " -ForegroundColor Green');
  scriptLines.push('Write-Host "======================================================" -ForegroundColor Green');
  scriptLines.push('Write-Host "Press any key to close this window..."');
  scriptLines.push('$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")');

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
      updates: apps.filter(a => a.versionStatus === 'update-available').length,
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
      updates: apps.filter(a => a.versionStatus === 'update-available').length,
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
          const child = spawn(app.installPath, [], { detached: true, stdio: 'ignore', windowsHide: true });
          child.unref();
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, message: `Launched ${app.name} successfully!` }));
        } else {
          const cmd = app.cliCommands && app.cliCommands[0] ? app.cliCommands[0] : null;
          if (cmd) {
            exec(`start "" "${cmd}"`, { windowsHide: true });
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

  if (process.argv.includes('--open')) {
    const edgePath = `C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe`;
    const openCmd = fs.existsSync(edgePath)
      ? `"${edgePath}" --app="${url}" --window-size=1260,840`
      : `start ${url}`;

    exec(openCmd, { windowsHide: true }, (err) => {
      if (err) exec(`start ${url}`, { windowsHide: true });
    });
  }
});
