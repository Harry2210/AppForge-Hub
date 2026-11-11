// scanner.js
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const appsData = require('./apps-data');

function resolveEnvPaths(filePath) {
  if (!filePath) return filePath;
  const localAppData = process.env.LOCALAPPDATA || 'C:\\Users\\hario\\AppData\\Local';
  const appData = process.env.APPDATA || 'C:\\Users\\hario\\AppData\\Roaming';
  const programFiles = process.env.ProgramFiles || 'C:\\Program Files';
  const programFilesX86 = process.env['ProgramFiles(x86)'] || 'C:\\Program Files (x86)';

  return filePath
    .replace(/%LOCALAPPDATA%/gi, localAppData)
    .replace(/%APPDATA%/gi, appData)
    .replace(/%PROGRAMFILES\(X86\)%/gi, programFilesX86)
    .replace(/%PROGRAMFILES%/gi, programFiles);
}

function getRegistrySoftware() {
  const psScript = `
$ProgressPreference = 'SilentlyContinue';
$ErrorActionPreference = 'SilentlyContinue';
$paths = @(
  'HKLM:\\Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\*',
  'HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\*',
  'HKLM:\\Software\\Wow6432Node\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\*',
  'HKCU:\\Software\\Wow6432Node\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\*'
);
$items = Get-ItemProperty $paths -ErrorAction SilentlyContinue | Where-Object { $_.DisplayName } | Select-Object DisplayName, DisplayVersion, Publisher, InstallLocation;
$items | ConvertTo-Json -Compress
`;

  try {
    const encoded = Buffer.from(psScript, 'utf16le').toString('base64');
    const output = execSync(`powershell -NoProfile -EncodedCommand ${encoded}`, {
      encoding: 'utf8',
      maxBuffer: 20 * 1024 * 1024,
      timeout: 12000
    });
    if (!output || !output.trim()) return [];
    const parsed = JSON.parse(output.trim());
    return Array.isArray(parsed) ? parsed : [parsed];
  } catch (err) {
    console.error('Registry scan error:', err.message);
    return [];
  }
}

function checkCliCommand(cmdName) {
  try {
    const out = execSync(`where.exe ${cmdName}`, {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'ignore'],
      timeout: 3000
    });
    const paths = out.trim().split(/\r?\n/).filter(Boolean);
    return paths.length > 0 ? paths[0] : null;
  } catch (e) {
    return null;
  }
}

function checkVsWhere() {
  const vswherePath = 'C:\\Program Files (x86)\\Microsoft Visual Studio\\Installer\\vswhere.exe';
  if (!fs.existsSync(vswherePath)) return null;
  try {
    const out = execSync(`"${vswherePath}" -latest -products * -format json`, {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'ignore'],
      timeout: 4000
    });
    const data = JSON.parse(out.trim());
    if (Array.isArray(data) && data.length > 0) {
      return {
        displayName: data[0].displayName || 'Visual Studio',
        version: data[0].installationVersion || data[0].catalog?.productDisplayVersion || 'Installed',
        path: data[0].productPath || data[0].installationPath
      };
    }
  } catch (e) {}
  return null;
}

function getCliVersion(cmd, resolvedPath) {
  try {
    if (cmd === 'git') {
      const v = execSync('git --version', { encoding: 'utf8', timeout: 3000 });
      return v.replace(/git version\s*/i, '').trim();
    }
    if (cmd === 'node') {
      const v = execSync('node -v', { encoding: 'utf8', timeout: 3000 });
      return v.trim();
    }
    if (cmd === 'dotnet') {
      const v = execSync('dotnet --version', { encoding: 'utf8', timeout: 3000 });
      return v.trim();
    }
    if (cmd === 'go') {
      const v = execSync('go version', { encoding: 'utf8', timeout: 3000 });
      const m = v.match(/go(\d+\.[\d\.]+)/);
      return m ? m[1] : v.trim();
    }
  } catch (e) {}
  return null;
}

function scanAllApps() {
  console.log('Initiating system application scan...');
  const registryEntries = getRegistrySoftware();
  const vsWhereInfo = checkVsWhere();

  const results = appsData.map(app => {
    let installed = false;
    let version = null;
    let installPath = null;
    let detectionSource = 'none';

    // 1. VSWhere check (for Visual Studio)
    if (app.vswhere && vsWhereInfo) {
      installed = true;
      version = vsWhereInfo.version;
      installPath = vsWhereInfo.path;
      detectionSource = 'vswhere';
    }

    // 2. Registry match
    if (!installed && app.registryPatterns && app.registryPatterns.length > 0) {
      for (const entry of registryEntries) {
        if (!entry.DisplayName) continue;
        for (const pattern of app.registryPatterns) {
          if (pattern.test(entry.DisplayName)) {
            installed = true;
            version = entry.DisplayVersion || null;
            installPath = entry.InstallLocation || null;
            detectionSource = 'registry';
            break;
          }
        }
        if (installed) break;
      }
    }

    // 3. CLI command match
    if (!installed && app.cliCommands && app.cliCommands.length > 0) {
      for (const cmd of app.cliCommands) {
        const foundPath = checkCliCommand(cmd);
        if (foundPath) {
          // If python disallows WindowsApps shim
          if (app.disallowStoreShim && foundPath.toLowerCase().includes('windowsapps')) {
            continue;
          }
          installed = true;
          installPath = foundPath;
          detectionSource = 'cli';
          const detectedVer = getCliVersion(cmd, foundPath);
          if (detectedVer) version = detectedVer;
          break;
        }
      }
    }

    // 4. Well-known filesystem path match
    if (!installed && app.wellKnownPaths && app.wellKnownPaths.length > 0) {
      for (const rawPath of app.wellKnownPaths) {
        const resolved = resolveEnvPaths(rawPath);
        if (fs.existsSync(resolved)) {
          installed = true;
          installPath = resolved;
          detectionSource = 'path';
          break;
        }
      }
    }

    return {
      id: app.id,
      name: app.name,
      category: app.category,
      icon: app.icon,
      description: app.description,
      installed,
      version: version || (installed ? 'Detected' : null),
      installPath,
      detectionSource,
      downloadUrl: app.downloadUrl,
      directInstallerUrl: app.directInstallerUrl,
      wingetId: app.wingetId
    };
  });

  return results;
}

module.exports = {
  scanAllApps
};

if (require.main === module) {
  const res = scanAllApps();
  console.log(`\nScan Summary:`);
  console.log(`Total apps: ${res.length}`);
  console.log(`Installed: ${res.filter(a => a.installed).length}`);
  console.log(`Missing: ${res.filter(a => !a.installed).length}\n`);
  for (const item of res) {
    console.log(`${item.installed ? '✅' : '❌'} [${item.category}] ${item.name}: ${item.installed ? `v${item.version} via ${item.detectionSource}` : 'Not Installed'}`);
  }
}
