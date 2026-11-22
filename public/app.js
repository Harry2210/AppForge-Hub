// app.js - Client-side state and interactivity for AppForge Hub Fixed Frame Desktop Edition

// Enforce fixed desktop frame size if in popup / app mode
if (window.resizeTo) {
  try {
    window.resizeTo(1260, 840);
  } catch (e) {}
}

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
const statUpdates = document.getElementById('stat-updates');
const statPillUpdates = document.getElementById('stat-pill-updates');
const statPercent = document.getElementById('stat-percent');
const progressFill = document.getElementById('progress-fill');
const statusbarTime = document.getElementById('statusbar-time');

const pillCountAll = document.getElementById('pill-count-all');
const pillCountInstalled = document.getElementById('pill-count-installed');
const pillCountMissing = document.getElementById('pill-count-missing');

const selectionBanner = document.getElementById('selection-banner');
const selectedCountEl = document.getElementById('selected-count');
const selectAllVisibleCb = document.getElementById('select-all-visible');
const selectMissingBtn = document.getElementById('select-missing-btn');
const clearSelectionBtn = document.getElementById('clear-selection-btn');
const openAllDownloadsBtn = document.getElementById('open-all-downloads-btn');
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
    toast.style.transform = 'translateY(8px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

// Fetch Apps Data
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

    if (data.stats.lastScanTime) {
      statusbarTime.textContent = `Last scan: ${data.stats.lastScanTime}`;
    }

    if (forceRefresh) {
      showToast('System application scan refreshed successfully!', 'success');
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

// Update Stats
function updateStats(stats) {
  statTotal.textContent = stats.total;
  statInstalled.textContent = stats.installed;
  statMissing.textContent = stats.missing;
  missingCountBadge.textContent = stats.missing;

  if (stats.updates && stats.updates > 0) {
    statUpdates.textContent = stats.updates;
    statPillUpdates.style.display = 'flex';
  } else {
    statPillUpdates.style.display = 'none';
  }

  const percent = stats.total > 0 ? Math.round((stats.installed / stats.total) * 100) : 0;
  statPercent.textContent = `${percent}%`;
  progressFill.style.width = `${percent}%`;

  pillCountAll.textContent = stats.total;
  pillCountInstalled.textContent = stats.installed;
  pillCountMissing.textContent = stats.missing;
}

// Filter and Render Cards
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
        <p style="font-size: 2.2rem; margin-bottom: 0.5rem;">🔍</p>
        <h3 style="font-size: 1.1rem; color: #f8fafc; margin-bottom: 0.4rem;">No matching applications found</h3>
        <p style="font-size: 0.82rem;">Try adjusting your search terms or clearing active filters.</p>
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

// Render a single app card (Displays official website link on Download button)
function renderAppCard(app) {
  const isSelected = selectedAppIds.has(app.id);

  // Status & Version Badges
  let statusBadgeHtml = '';
  let cardClassExtra = '';

  if (app.installed) {
    if (app.versionStatus === 'latest' || app.versionStatus === 'installed') {
      statusBadgeHtml = `
        <span class="status-badge badge-installed" title="Installed on PC">
          <span class="status-dot"></span> Up to date (${app.installedVersion || 'Detected'})
        </span>
      `;
      cardClassExtra = 'is-installed';
    } else if (app.versionStatus === 'update-available') {
      statusBadgeHtml = `
        <span class="status-badge badge-update" title="Update available: v${app.latestVersion}">
          <span class="status-dot"></span> Update to v${app.latestVersion} (Have: ${app.installedVersion})
        </span>
      `;
      cardClassExtra = 'is-installed has-update';
    }
  } else {
    statusBadgeHtml = `
      <span class="status-badge badge-missing">
        <span class="status-dot"></span> Not Installed
      </span>
    `;
    cardClassExtra = 'is-missing';
  }

  // Latest Version Pill
  const latestPill = app.latestVersion
    ? `<span class="badge-latest-pill" title="Official latest release version">⚡ Latest: v${app.latestVersion}</span>`
    : '';

  // Install Path (if installed)
  const pathDisplay = app.installPath
    ? `<div class="detail-item" title="${app.installPath}">
         <span class="detail-label">Path:</span>
         <span class="detail-value">${app.installPath}</span>
       </div>`
    : '';

  // Launch button (if installed)
  const launchBtn = app.installed
    ? `<button class="btn btn-sm action-btn-success launch-btn" data-id="${app.id}" title="Launch ${app.name} on this PC">
         <span>🚀 Launch</span>
       </button>`
    : '';

  // Always point to official vendor website
  const officialSiteUrl = app.downloadUrl;

  return `
    <div class="app-card ${cardClassExtra}" data-id="${app.id}">
      <div class="card-top">
        <label class="custom-checkbox card-select">
          <input type="checkbox" class="app-select-cb" data-id="${app.id}" ${isSelected ? 'checked' : ''}>
          <span class="checkmark"></span>
        </label>
        <div class="app-icon">
          <img src="${app.icon}" class="app-icon-img" alt="${app.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='inline-block';" />
          <span class="app-icon-fallback" style="display:none; font-size: 1.2rem;">⚡</span>
        </div>
        <div class="card-title-group">
          <h3 class="app-name" title="${app.name}">${app.name}</h3>
          <div class="card-badges-row">
            ${latestPill}
            ${statusBadgeHtml}
          </div>
        </div>
      </div>

      <div class="card-body">
        <p class="app-desc">${app.description}</p>
        <div class="details-row">
          ${pathDisplay}
        </div>
      </div>

      <div class="card-actions">
        <a href="${officialSiteUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-sm action-btn-primary" title="Open official website for ${app.name}">
          <span>📥 Download</span>
        </a>
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

  // Launch App Button
  document.querySelectorAll('.launch-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const appId = btn.dataset.id;
      btn.disabled = true;
      btn.innerHTML = `<span>⏳ Launching...</span>`;

      try {
        const res = await fetch('/api/launch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ appId })
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.error);
        showToast(data.message, 'success');
      } catch (err) {
        showToast(`Launch failed: ${err.message}`, 'error');
      } finally {
        btn.disabled = false;
        btn.innerHTML = `<span>🚀 Launch</span>`;
      }
    });
  });
}

// Update Batch Selection Banner
function updateSelectionBanner() {
  const count = selectedAppIds.size;
  selectedCountEl.textContent = count;

  if (count > 0) {
    selectionBanner.style.display = 'flex';
  } else {
    selectionBanner.style.display = 'none';
  }

  // Check state of select all visible
  const visibleCbs = document.querySelectorAll('.app-select-cb');
  if (visibleCbs.length > 0) {
    const allChecked = Array.from(visibleCbs).every(cb => cb.checked);
    selectAllVisibleCb.checked = allChecked;
  }
}

// Status Filter Pills
document.querySelectorAll('.status-pills .pill').forEach(pill => {
  pill.addEventListener('click', () => {
    document.querySelectorAll('.status-pills .pill').forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
    currentFilter = pill.dataset.filter;
    renderApps();
  });
});

// Rescan Button
rescanBtn.addEventListener('click', () => {
  loadApps(true);
});

// Quick Open Missing
quickPs1Btn.addEventListener('click', async () => {
  const missingApps = allApps.filter(a => !a.installed);
  if (missingApps.length === 0) {
    showToast('All tracked applications are already installed!', 'success');
    return;
  }

  const appIds = missingApps.map(a => a.id);
  await openScriptModal(appIds);
});

// Select All Visible
selectAllVisibleCb.addEventListener('change', (e) => {
  const checked = e.target.checked;
  document.querySelectorAll('.app-select-cb').forEach(cb => {
    cb.checked = checked;
    const id = cb.dataset.id;
    if (checked) {
      selectedAppIds.add(id);
    } else {
      selectedAppIds.delete(id);
    }
  });
  updateSelectionBanner();
});

// Select All Missing
selectMissingBtn.addEventListener('click', () => {
  const missingApps = allApps.filter(a => !a.installed);
  missingApps.forEach(a => selectedAppIds.add(a.id));
  renderApps();
  showToast(`Selected ${missingApps.length} missing applications`, 'info');
});

// Clear Selection
clearSelectionBtn.addEventListener('click', () => {
  selectedAppIds.clear();
  renderApps();
});

// Open All Selected Downloads (Official Websites)
openAllDownloadsBtn.addEventListener('click', () => {
  const selected = allApps.filter(a => selectedAppIds.has(a.id));
  if (selected.length === 0) return;

  selected.forEach(app => {
    window.open(app.downloadUrl, '_blank');
  });

  showToast(`Opened official websites for ${selected.length} apps`, 'success');
});

// Download Batch .PS1 Script
downloadPs1BatchBtn.addEventListener('click', () => {
  if (selectedAppIds.size === 0) return;
  const ids = Array.from(selectedAppIds).join(',');
  window.location.href = `/api/download-script?ids=${encodeURIComponent(ids)}`;
  showToast('Downloaded install-apps.ps1 script', 'success');
});

// Script Modal
async function openScriptModal(appIds) {
  try {
    const res = await fetch('/api/generate-script', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ appIds })
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error);

    scriptPreviewCode.textContent = data.script;
    scriptModal.dataset.ids = appIds.join(',');
    scriptModal.style.display = 'flex';
  } catch (err) {
    showToast(`Error generating setup script: ${err.message}`, 'error');
  }
}

closeModalBtn.addEventListener('click', () => {
  scriptModal.style.display = 'none';
});

scriptModal.addEventListener('click', (e) => {
  if (e.target === scriptModal) scriptModal.style.display = 'none';
});

copyScriptBtn.addEventListener('click', () => {
  navigator.clipboard.writeText(scriptPreviewCode.textContent).then(() => {
    showToast('Setup script copied to clipboard!', 'success');
  });
});

modalDownloadPs1Btn.addEventListener('click', () => {
  const ids = scriptModal.dataset.ids || '';
  window.location.href = `/api/download-script?ids=${encodeURIComponent(ids)}`;
  showToast('Downloaded install-apps.ps1 script', 'success');
});

// Window Decorative Dots Interaction
document.querySelector('.dot-close')?.addEventListener('click', () => {
  if (window.confirm('Close AppForge Hub?')) {
    window.close();
  }
});

// Initial Load
document.addEventListener('DOMContentLoaded', () => {
  loadApps();
});
