// scanner.js - Windows native application & version scanner with multi-version latest resolution
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

// Clean and extract standard semver or numeric version
function cleanVersion(ver) {
  if (!ver) return null;
  const str = String(ver).trim().replace(/^v/i, '');
  const m = str.match(/\d+(\.\d+)+/);
  return m ? m[0] : str;
}

// Compare two version strings: returns 1 if v1 > v2, -1 if v1 < v2, 0 if equal
function compareVersions(v1, v2) {
  if (!v1 && !v2) return 0;
  if (!v1) return -1;
  if (!v2) return 1;

  const c1 = cleanVersion(v1) || '';
  const c2 = cleanVersion(v2) || '';

  const parts1 = c1.split('.').map(n => parseInt(n, 10) || 0);
  const parts2 = c2.split('.').map(n => parseInt(n, 10) || 0);
  const maxLen = Math.max(parts1.length, parts2.length);

  for (let i = 0; i < maxLen; i++) {
    const p1 = parts1[i] !== undefined ? parts1[i] : 0;
    const p2 = parts2[i] !== undefined ? parts2[i] : 0;
    if (p1 > p2) return 1;
    if (p1 < p2) return -1;
  }
  return 0;
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
      maxBuffer: 25 * 1024 * 1024,
      timeout: 12000,
      windowsHide: true,
      stdio: ['pipe', 'pipe', 'ignore']
    });
    if (!output || !output.trim()) return [];
    const parsed = JSON.parse(output.trim());
    return Array.isArray(parsed) ? parsed : [parsed];
  } catch (err) {
    return [];
  }
}

function checkCliCommand(cmdName) {
  try {
    const out = execSync(`where.exe ${cmdName}`, {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'ignore'],
      timeout: 3000,
      windowsHide: true
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
      timeout: 4000,
      windowsHide: true
    });
    const data = JSON.parse(out.trim());
    if (Array.isArray(data) && data.length > 0) {
      return {
        displayName: data[0].displayName || 'Visual Studio',
        version: cleanVersion(data[0].installationVersion || data[0].catalog?.productDisplayVersion) || 'Installed',
        path: data[0].productPath || data[0].installationPath
      };
    }
  } catch (e) {}
  return null;
}

function getCliVersion(cmd, resolvedPath) {
  try {
    if (cmd === 'git') {
      const v = execSync('git --version', { encoding: 'utf8', timeout: 3000, windowsHide: true, stdio: ['pipe', 'pipe', 'ignore'] });
      return cleanVersion(v.replace(/git version\s*/i, '').trim());
    }
    if (cmd === 'node') {
      const v = execSync('node -v', { encoding: 'utf8', timeout: 3000, windowsHide: true, stdio: ['pipe', 'pipe', 'ignore'] });
      return cleanVersion(v);
    }
    if (cmd === 'dotnet') {
      const v = execSync('dotnet --version', { encoding: 'utf8', timeout: 3000, windowsHide: true, stdio: ['pipe', 'pipe', 'ignore'] });
      return cleanVersion(v);
    }
    if (cmd === 'go') {
      const v = execSync('go version', { encoding: 'utf8', timeout: 3000, windowsHide: true, stdio: ['pipe', 'pipe', 'ignore'] });
      const m = v.match(/go(\d+\.[\d\.]+)/);
      return cleanVersion(m ? m[1] : v);
    }
    if (cmd === 'py' || cmd === 'python') {
      const v = execSync(`${cmd} --version`, { encoding: 'utf8', timeout: 3000, windowsHide: true, stdio: ['pipe', 'pipe', 'ignore'] });
      return cleanVersion(v.replace(/Python\s*/i, ''));
    }
  } catch (e) {}
  return null;
}

function scanAllApps() {
  const registryEntries = getRegistrySoftware();
  const vsWhereInfo = checkVsWhere();

  const results = appsData.map(app => {
    let installed = false;
    let installedVersion = null;
    let installPath = null;
    let detectionSource = 'none';

    // Store all detected matches to select strictly the latest version
    const candidateMatches = [];

    // 1. VSWhere check (for Visual Studio IDE only)
    if (app.vswhere && vsWhereInfo) {
      candidateMatches.push({
        version: vsWhereInfo.version,
        path: vsWhereInfo.path,
        source: 'vswhere'
      });
    }

    // 2. Registry match (Collect ALL matching entries to find latest version)
    if (app.registryPatterns && app.registryPatterns.length > 0) {
      for (const entry of registryEntries) {
        if (!entry.DisplayName) continue;

        // Disambiguate Visual Studio from Visual Studio Code
        if (app.id === 'visual-studio' && /Visual Studio Code/i.test(entry.DisplayName)) {
          continue;
        }

        for (const pattern of app.registryPatterns) {
          if (pattern.test(entry.DisplayName)) {
            const rawVer = entry.DisplayVersion || '';
            const cVer = cleanVersion(rawVer);
            candidateMatches.push({
              version: cVer || rawVer || 'Detected',
              path: entry.InstallLocation || null,
              source: 'registry'
            });
            break;
          }
        }
      }
    }

    // 3. CLI command match
    if (app.cliCommands && app.cliCommands.length > 0) {
      for (const cmd of app.cliCommands) {
        const foundPath = checkCliCommand(cmd);
        if (foundPath) {
          if (app.disallowStoreShim && foundPath.toLowerCase().includes('windowsapps')) {
            continue;
          }
          const detectedVer = getCliVersion(cmd, foundPath);
          candidateMatches.push({
            version: detectedVer || 'Detected',
            path: foundPath,
            source: 'cli'
          });
        }
      }
    }

    // 4. Well-known filesystem path match
    if (app.wellKnownPaths && app.wellKnownPaths.length > 0) {
      for (const rawPath of app.wellKnownPaths) {
        const resolved = resolveEnvPaths(rawPath);
        if (fs.existsSync(resolved)) {
          candidateMatches.push({
            version: null,
            path: resolved,
            source: 'path'
          });
        }
      }
    }

    // Pick ONLY the latest version among all candidates
    if (candidateMatches.length > 0) {
      installed = true;
      // Sort descending by version
      candidateMatches.sort((a, b) => compareVersions(b.version, a.version));
      const best = candidateMatches[0];
      installedVersion = best.version;
      installPath = best.path;
      detectionSource = best.source;
    }

    // Determine version status compared to latest known official release
    const latestVersion = app.latestVersion || null;
    let versionStatus = 'missing'; // 'latest' | 'update-available' | 'installed' | 'missing'

    if (installed) {
      if (!latestVersion || installedVersion === 'Detected') {
        versionStatus = 'installed';
      } else {
        const cmp = compareVersions(installedVersion, latestVersion);
        if (cmp >= 0) {
          versionStatus = 'latest'; // Up to date or newer
        } else {
          versionStatus = 'update-available'; // Newer version available
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
      latestVersion,
      installedVersion: installedVersion || (installed ? 'Detected' : null),
      version: installedVersion || (installed ? 'Detected' : null), // backward compat
      versionStatus, // 'latest' | 'update-available' | 'installed' | 'missing'
      installPath,
      detectionSource,
      downloadUrl: app.downloadUrl,
      directInstallerUrl: app.directInstallerUrl
    };
  });

  return results;
}

module.exports = {
  scanAllApps,
  compareVersions,
  cleanVersion
};

if (require.main === module) {
  const res = scanAllApps();
  console.log(`\nAppForge Hub - Application Status & Latest Versions:`);
  console.log(`Total apps: ${res.length}`);
  console.log(`Installed: ${res.filter(a => a.installed).length}`);
  console.log(`Missing: ${res.filter(a => !a.installed).length}\n`);
  for (const item of res) {
    console.log(`${item.installed ? '✅' : '❌'} [${item.category}] ${item.name}`);
    console.log(`   Latest: v${item.latestVersion} | Status: ${item.versionStatus} | Installed: ${item.installedVersion || 'None'}`);
  }
}
