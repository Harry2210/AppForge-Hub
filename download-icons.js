// download-icons.js - Downloads and synthesizes official brand vector SVGs
const fs = require('fs');
const path = require('path');

const ICONS_DIR = path.join(__dirname, 'public', 'icons');
if (!fs.existsSync(ICONS_DIR)) {
  fs.mkdirSync(ICONS_DIR, { recursive: true });
}

// Devicon multi-color official SVGs
const devicons = {
  'vscode': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vscode/vscode-original.svg',
  'visual-studio': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/visualstudio/visualstudio-plain.svg',
  'android-studio': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/androidstudio/androidstudio-original.svg',
  'git': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg',
  'docker': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg',
  'postman': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postman/postman-original.svg',
  'dbeaver': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/dbeaver/dbeaver-original.svg',
  'nodejs': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg',
  'python': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg',
  'golang': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/go/go-original.svg',
  'java-jdk': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg',
  'dotnet-sdk': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/dot-net/dot-net-original.svg',
  'vcredist': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cplusplus/cplusplus-original.svg'
};

const cdnIcons = {
  'xampp': 'https://cdn.simpleicons.org/xampp/FB7A24',
  '7zip': 'https://cdn.simpleicons.org/7zip/ffffff',
  'filezilla': 'https://cdn.simpleicons.org/filezilla/BF0000',
  'copilot': 'https://cdn.simpleicons.org/githubcopilot/ffffff',
  'claude': 'https://cdn.simpleicons.org/anthropic/D97706',
  'epic-games': 'https://cdn.simpleicons.org/epicgames/ffffff',
  'steam': 'https://cdn.simpleicons.org/steam/ffffff',
  'vlc': 'https://cdn.simpleicons.org/vlcmediaplayer/FF8800'
};

const customIcons = {
  'windows-terminal': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48">
    <rect width="48" height="48" rx="10" fill="#2d3748"/>
    <rect x="5" y="7" width="38" height="34" rx="6" fill="#0f172a" stroke="#475569" stroke-width="1.5"/>
    <path d="M13 18 L21 24 L13 30" stroke="#06b6d4" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    <line x1="24" y1="30" x2="33" y2="30" stroke="#f1f5f9" stroke-width="3" stroke-linecap="round"/>
  </svg>`,

  'codex': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48">
    <rect width="48" height="48" rx="10" fill="#10a37f"/>
    <path d="M24 10 C27.5 10 30.5 11.8 32.2 14.6 L31.5 15 C30 12.5 27.2 11 24 11 C20.8 11 18 12.5 16.5 15 L15.8 14.6 C17.5 11.8 20.5 10 24 10 Z" fill="#ffffff"/>
    <circle cx="24" cy="24" r="8" fill="none" stroke="#ffffff" stroke-width="2.5"/>
    <path d="M24 16 L24 24 L30 27" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" fill="none"/>
    <circle cx="24" cy="24" r="2" fill="#ffffff"/>
  </svg>`,

  'antigravity-ide': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48">
    <defs>
      <linearGradient id="agyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#4285F4"/>
        <stop offset="50%" stop-color="#9C27B0"/>
        <stop offset="100%" stop-color="#FF5722"/>
      </linearGradient>
    </defs>
    <rect width="48" height="48" rx="10" fill="#181824"/>
    <path d="M24 7 L37 20 L24 33 L11 20 Z" fill="url(#agyGrad)"/>
    <circle cx="24" cy="20" r="4.5" fill="#ffffff"/>
    <path d="M24 33 L31 41 L17 41 Z" fill="#9C27B0"/>
  </svg>`,

  'antigravity-ai': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48">
    <defs>
      <linearGradient id="aiSpark" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#00E5FF"/>
        <stop offset="50%" stop-color="#7C4DFF"/>
        <stop offset="100%" stop-color="#FF4081"/>
      </linearGradient>
    </defs>
    <rect width="48" height="48" rx="10" fill="#0f172a"/>
    <path d="M24 8 C24 16 32 24 40 24 C32 24 24 32 24 40 C24 32 16 24 8 24 C16 24 24 16 24 8 Z" fill="url(#aiSpark)"/>
  </svg>`,

  'inno-setup': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48">
    <rect width="48" height="48" rx="10" fill="#0c4a6e"/>
    <path d="M24 10 L38 18 L38 32 L24 40 L10 32 L10 18 Z" fill="#0284c7" stroke="#38bdf8" stroke-width="2"/>
    <path d="M24 10 L38 18 L24 26 L10 18 Z" fill="#38bdf8"/>
    <path d="M24 26 L24 40" stroke="#0284c7" stroke-width="2"/>
    <circle cx="24" cy="26" r="3" fill="#ffffff"/>
  </svg>`,

  'msys2': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48">
    <rect width="48" height="48" rx="10" fill="#7f1d1d"/>
    <circle cx="24" cy="24" r="14" fill="#ef4444"/>
    <path d="M18 20 L22 24 L18 28 M24 28 L28 28" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  </svg>`,

  'revo-uninstaller': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48">
    <rect width="48" height="48" rx="10" fill="#1e3a8a"/>
    <path d="M24 8 L38 14 L38 26 C38 34 24 40 24 40 C24 40 10 34 10 26 L10 14 Z" fill="#2563eb"/>
    <path d="M18 24 L22 28 L30 18" stroke="#ffffff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  </svg>`,

  'idm': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48">
    <rect width="48" height="48" rx="10" fill="#0f172a"/>
    <circle cx="24" cy="24" r="16" fill="none" stroke="#3b82f6" stroke-width="3"/>
    <path d="M24 14 L24 30 M17 24 L24 31 L31 24" stroke="#22c55e" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M14 34 L34 34" stroke="#eab308" stroke-width="3" stroke-linecap="round"/>
  </svg>`,

  'wondershare-pdf': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48">
    <rect width="48" height="48" rx="10" fill="#dc2626"/>
    <path d="M16 12 L28 12 C33 12 36 15 36 20 C36 25 33 28 28 28 L22 28 L22 36 L16 36 Z M22 18 L22 22 L27 22 C29 22 30 21 30 20 C30 19 29 18 27 18 Z" fill="#ffffff"/>
  </svg>`,

  'wondershare-filmora': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48">
    <rect width="48" height="48" rx="10" fill="#042f2e"/>
    <path d="M14 14 L34 14 C36 14 38 16 38 18 L38 30 C38 32 36 34 34 34 L14 34 C12 34 10 32 10 30 L10 18 C10 16 12 14 14 14 Z" fill="#0d9488"/>
    <polygon points="21,20 30,24 21,28" fill="#ffffff"/>
  </svg>`,

  'powertoys': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48">
    <rect width="48" height="48" rx="10" fill="#18181b"/>
    <rect x="12" y="12" width="10" height="10" rx="2" fill="#ef4444"/>
    <rect x="26" y="12" width="10" height="10" rx="2" fill="#3b82f6"/>
    <rect x="12" y="26" width="10" height="10" rx="2" fill="#22c55e"/>
    <rect x="26" y="26" width="10" height="10" rx="2" fill="#eab308"/>
  </svg>`,

  'cursor': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48">
    <rect width="48" height="48" rx="10" fill="#000000"/>
    <polygon points="24,10 38,18 24,26 10,18" fill="#818cf8"/>
    <polygon points="10,18 24,26 24,38 10,30" fill="#4f46e5"/>
    <polygon points="24,26 38,18 38,30 24,38" fill="#6366f1"/>
  </svg>`
};

async function run() {
  console.log('1. Fetching official multi-color Devicon SVGs...');
  for (const [id, url] of Object.entries(devicons)) {
    try {
      const res = await fetch(url);
      if (res.ok) {
        const svg = await res.text();
        fs.writeFileSync(path.join(ICONS_DIR, `${id}.svg`), svg);
        console.log(`✓ Saved ${id}.svg from Devicon`);
      } else {
        console.warn(`Devicon failed for ${id}: ${res.status}`);
      }
    } catch (e) {
      console.warn(`Error for ${id}: ${e.message}`);
    }
  }

  console.log('2. Fetching CDN vector icons...');
  for (const [id, url] of Object.entries(cdnIcons)) {
    try {
      const res = await fetch(url);
      if (res.ok) {
        const svg = await res.text();
        fs.writeFileSync(path.join(ICONS_DIR, `${id}.svg`), svg);
        console.log(`✓ Saved ${id}.svg from CDN`);
      }
    } catch (e) {
      console.warn(`Error for ${id}: ${e.message}`);
    }
  }

  console.log('3. Writing custom official vector icons...');
  for (const [id, svg] of Object.entries(customIcons)) {
    fs.writeFileSync(path.join(ICONS_DIR, `${id}.svg`), svg.trim());
    console.log(`✓ Saved ${id}.svg custom icon`);
  }

  console.log('\nAll 32 official application icons are ready in public/icons/!');
}

run();
