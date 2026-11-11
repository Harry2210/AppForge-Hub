// app.js - Client-side state and interactivity for AppForge Hub

let allApps = [];
let selectedAppIds = new Set();
let currentFilter = 'all'; // 'all' | 'installed' | 'missing'

// DOM Elements
const appsContainer = document.getElementById('apps-container');
const rescanBtn = document.getElementById('rescan-btn');
const quickPs1Btn = document.getElementById('quick-ps1-btn');
const missingCountBadge = document.getElementById('missing-count-badge');

const statTotal = document.getElementById('stat-total');
const statInstalled = document.getElementById('stat-installed');
const statMissing = document.getElementById('stat-missing');
const statPercent = document.getElementById('stat-percent');
const progressFill = document.getElementById('progress-fill');

const pillCountAll = document.getElementById('pill-count-all');
const pillCountInstalled = document.getElementById('pill-count-installed');
const pillCountMissing = document.getElementById('pill-count-missing');

const selectionBanner = document.getElementById('selection-banner');
const selectedCountEl = document.getElementById('selected-count');
const selectAllVisibleCb = document.getElementById('select-all-visible');
const selectMissingBtn = document.getElementById('select-missing-btn');
const clearSelectionBtn = document.getElementById('clear-selection-btn');
const copyWingetBatchBtn = document.getElementById('copy-winget-batch-btn');
const downloadPs1BatchBtn = document.getElementById('download-ps1-batch-btn');

const scriptModal = document.getElementById('script-modal');
const closeModalBtn = document.getElementById('close-modal-btn');
const scriptPreviewCode = document.getElementById('script-preview-code');
const copyScriptBtn = document.getElementById('copy-script-btn');
const modalDownloadPs1Btn = document.getElementById('modal-download-ps1-btn');
const toastContainer = document.getElementById('toast-container');

// Toast Notification
function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️';
  toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// Fetch Initial Apps Data
async function loadApps(forceRefresh = false) {
  try {
    if (forceRefresh) {
      rescanBtn.querySelector('.icon-refresh').classList.add('spinning');
      rescanBtn.disabled = true;
    }

    const endpoint = forceRefresh ? '/api/scan' : '/api/apps';
    const method = forceRefresh ? 'POST' : 'GET';
    const res = await fetch(endpoint, { method });
    const data = await res.json();

    if (!data.success) throw new Error(data.error || 'Failed to load apps');

    allApps = data.apps;
    updateStats(data.stats);
    renderApps();

    if (forceRefresh) {
      showToast('PC application scan completed successfully!', 'success');
    }
  } catch (err) {
    showToast(`Error: ${err.message}`, 'error');
  } finally {
    if (forceRefresh) {
      rescanBtn.querySelector('.icon-refresh').classList.remove('spinning');
      rescanBtn.disabled = false;
    }
  }
}

// Update Top Stat Counters
function updateStats(stats) {
  statTotal.textContent = stats.total;
  statInstalled.textContent = stats.installed;
  statMissing.textContent = stats.missing;
  missingCountBadge.textContent = stats.missing;

  const percent = stats.total > 0 ? Math.round((stats.installed / stats.total) * 100) : 0;
  statPercent.textContent = `${percent}%`;
  progressFill.style.width = `${percent}%`;

  pillCountAll.textContent = stats.total;
  pillCountInstalled.textContent = stats.installed;
  pillCountMissing.textContent = stats.missing;
}

// Render Filtered & Grouped Cards
function renderApps() {
  const filtered = allApps.filter(app => {
    // Status Filter
    if (currentFilter === 'installed' && !app.installed) return false;
    if (currentFilter === 'missing' && app.installed) return false;
    return true;
  });

  if (filtered.length === 0) {
    appsContainer.innerHTML = `
      <div class="empty-state">
        <p style="font-size: 2.5rem; margin-bottom: 0.5rem;">🔍</p>
        <h3>No matching applications found</h3>
        <p>Try adjusting your search query or switching active filters.</p>
      </div>
    `;
    updateSelectionBanner();
    return;
  }

  // Group by category
  const groups = {};
  filtered.forEach(app => {
    if (!groups[app.category]) groups[app.category] = [];
    groups[app.category].push(app);
  });

  let html = '';
  for (const [category, apps] of Object.entries(groups)) {
    const installedInCat = apps.filter(a => a.installed).length;
    html += `
      <section class="category-section">
        <h2 class="category-title">
          <span>${category}</span>
          <span class="category-count-badge">${installedInCat} / ${apps.length} Installed</span>
        </h2>
        <div class="cards-grid">
          ${apps.map(app => renderAppCard(app)).join('')}
        </div>
      </section>
    `;
  }

  appsContainer.innerHTML = html;
  attachCardEvents();
  updateSelectionBanner();
}

// Render a single app card
function renderAppCard(app) {
  const isSelected = selectedAppIds.has(app.id);
  const statusBadge = app.installed
    ? `<span class="status-badge badge-installed" title="Detected via ${app.detectionSource}">
         <span class="status-dot"></span> Installed ${app.version ? `(${app.version})` : ''}
       </span>`
    : `<span class="status-badge badge-missing">
         <span class="status-dot"></span> Not Installed
       </span>`;

  const pathDisplay = app.installPath
    ? `<div class="detail-item" title="${app.installPath}">
         <span class="detail-label">Path:</span>
         <span class="detail-value">${app.installPath}</span>
       </div>`
    : '';

  const wingetDisplay = app.wingetId
    ? `<div class="detail-item" title="winget install ${app.wingetId}">
         <span class="detail-label">Winget:</span>
         <span class="detail-value">${app.wingetId}</span>
       </div>`
    : '';

  const launchBtn = app.installed
    ? `<button class="btn btn-sm action-btn-success launch-btn" data-id="${app.id}" title="Launch ${app.name} on this PC">
         <span>🚀 Launch</span>
       </button>`
    : '';

  return `
    <div class="app-card ${app.installed ? 'is-installed' : 'is-missing'}" data-id="${app.id}">
      <div class="card-top">
        <label class="custom-checkbox card-select">
          <input type="checkbox" class="app-select-cb" data-id="${app.id}" ${isSelected ? 'checked' : ''}>
          <span class="checkmark"></span>
        </label>
        <div class="app-icon">
          <img src="${app.icon}" class="app-icon-img" alt="${app.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='inline-block';" />
          <span class="app-icon-fallback" style="display:none;">⚡</span>
        </div>
        <div class="card-title-group">
          <h3 class="app-name" title="${app.name}">${app.name}</h3>
          ${statusBadge}
        </div>
      </div>

      <div class="card-body">
        <p class="app-desc">${app.description}</p>
        <div class="details-row">
          ${pathDisplay}
          ${wingetDisplay}
        </div>
      </div>

      <div class="card-actions">
        <a href="${app.directInstallerUrl || app.downloadUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-sm action-btn-primary" title="Download latest installer from official source">
          <span>📥 Download Latest</span>
        </a>
        ${app.wingetId ? `
          <button class="btn btn-sm btn-outline copy-cmd-btn" data-winget="${app.wingetId}" title="Copy silent install command">
            <span>📋 Winget</span>
          </button>
        ` : ''}
        ${launchBtn}
      </div>
    </div>
  `;
}

// Attach Event Listeners to cards
function attachCardEvents() {
  // Checkboxes
  document.querySelectorAll('.app-select-cb').forEach(cb => {
    cb.addEventListener('change', (e) => {
      const id = e.target.dataset.id;
      if (e.target.checked) {
        selectedAppIds.add(id);
      } else {
        selectedAppIds.delete(id);
      }
      updateSelectionBanner();
    });
  });

  // Copy Winget command
  document.querySelectorAll('.copy-cmd-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const wingetId = btn.dataset.winget;
      const cmd = `winget install --exact --id "${wingetId}" --accept-source-agreements --accept-package-agreements`;
      navigator.clipboard.writeText(cmd).then(() => {
        showToast(`Copied command for ${wingetId}`, 'success');
      });
    });
  });

  // Launch App
  document.querySelectorAll('.launch-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.dataset.id;
      const app = allApps.find(a => a.id === id);
      try {
        btn.disabled = true;
        btn.innerHTML = '<span>⏳ Opening...</span>';
        const res = await fetch('/api/launch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ appId: id })
        });
        const data = await res.json();
        if (data.success) {
          showToast(`Launched ${app ? app.name : 'App'}!`, 'success');
        } else {
          showToast(`Launch failed: ${data.error}`, 'error');
        }
      } catch (err) {
        showToast(`Error: ${err.message}`, 'error');
      } finally {
        btn.disabled = false;
        btn.innerHTML = '<span>🚀 Launch</span>';
      }
    });
  });
}

// Update Sticky Batch Selection Banner
function updateSelectionBanner() {
  const count = selectedAppIds.size;
  selectedCountEl.textContent = count;

  if (count > 0) {
    selectionBanner.style.display = 'flex';
  } else {
    selectionBanner.style.display = 'none';
  }

  // Sync "Select All Visible" checkbox state
  const visibleCbs = document.querySelectorAll('.app-select-cb');
  if (visibleCbs.length > 0) {
    const allChecked = Array.from(visibleCbs).every(cb => cb.checked);
    selectAllVisibleCb.checked = allChecked;
  }
}

// Status Pills (All / Installed / Missing)
document.querySelectorAll('.status-pills .pill').forEach(pill => {
  pill.addEventListener('click', () => {
    document.querySelectorAll('.status-pills .pill').forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
    currentFilter = pill.dataset.filter;
    renderApps();
  });
});

// Rescan Button
rescanBtn.addEventListener('click', () => loadApps(true));

// Select All Visible
selectAllVisibleCb.addEventListener('change', (e) => {
  const checked = e.target.checked;
  document.querySelectorAll('.app-select-cb').forEach(cb => {
    cb.checked = checked;
    const id = cb.dataset.id;
    if (checked) selectedAppIds.add(id);
    else selectedAppIds.delete(id);
  });
  updateSelectionBanner();
});

// Select All Missing
selectMissingBtn.addEventListener('click', () => {
  selectedAppIds.clear();
  allApps.filter(a => !a.installed).forEach(a => selectedAppIds.add(a.id));
  renderApps();
  showToast(`Selected all ${selectedAppIds.size} missing applications`, 'info');
});

// Clear Selection
clearSelectionBtn.addEventListener('click', () => {
  selectedAppIds.clear();
  renderApps();
});

// Copy Winget Batch Command
copyWingetBatchBtn.addEventListener('click', () => {
  const selected = allApps.filter(a => selectedAppIds.has(a.id) && a.wingetId);
  if (selected.length === 0) {
    showToast('No selected apps have Winget IDs', 'error');
    return;
  }
  const ids = selected.map(a => a.wingetId).join(' ');
  const batchCmd = `winget install ${ids} --accept-source-agreements --accept-package-agreements`;
  navigator.clipboard.writeText(batchCmd).then(() => {
    showToast(`Copied batch command for ${selected.length} apps!`, 'success');
  });
});

// Download .PS1 Batch Script
downloadPs1BatchBtn.addEventListener('click', () => {
  if (selectedAppIds.size === 0) {
    showToast('Please select at least one application', 'error');
    return;
  }
  const ids = Array.from(selectedAppIds).join(',');
  window.location.href = `/api/download-script?ids=${encodeURIComponent(ids)}`;
  showToast('Downloading PowerShell install script...', 'success');
});

// Quick Header "Install Missing" Button
quickPs1Btn.addEventListener('click', async () => {
  const missingApps = allApps.filter(a => !a.installed);
  if (missingApps.length === 0) {
    showToast('All tracked applications are already installed on this PC! 🎉', 'success');
    return;
  }

  // Pre-select missing apps
  selectedAppIds.clear();
  missingApps.forEach(a => selectedAppIds.add(a.id));
  renderApps();

  // Fetch and display script in preview modal
  try {
    const res = await fetch('/api/generate-script', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ appIds: missingApps.map(a => a.id) })
    });
    const data = await res.json();
    if (data.success) {
      scriptPreviewCode.textContent = data.script;
      scriptModal.style.display = 'flex';
    }
  } catch (err) {
    showToast(`Failed to generate script: ${err.message}`, 'error');
  }
});

// Close Modal
closeModalBtn.addEventListener('click', () => {
  scriptModal.style.display = 'none';
});

// Copy Modal Script
copyScriptBtn.addEventListener('click', () => {
  navigator.clipboard.writeText(scriptPreviewCode.textContent).then(() => {
    showToast('PowerShell script copied to clipboard!', 'success');
  });
});

// Modal Download .PS1
modalDownloadPs1Btn.addEventListener('click', () => {
  const ids = Array.from(selectedAppIds).join(',');
  window.location.href = `/api/download-script?ids=${encodeURIComponent(ids)}`;
  scriptModal.style.display = 'none';
  showToast('Downloading install-apps.ps1...', 'success');
});

// Close Modal on backdrop click
window.addEventListener('click', (e) => {
  if (e.target === scriptModal) {
    scriptModal.style.display = 'none';
  }
});

// PWA Installation
let deferredPrompt = null;
const installAppBtn = document.getElementById('install-app-btn');

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  if (installAppBtn) installAppBtn.style.display = 'inline-flex';
});

if (installAppBtn) {
  installAppBtn.addEventListener('click', async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        showToast('App installed successfully to your Windows PC!', 'success');
      }
      deferredPrompt = null;
      installAppBtn.style.display = 'none';
    }
  });
}

// Initial Load
document.addEventListener('DOMContentLoaded', () => {
  loadApps();
});
