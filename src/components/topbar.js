/**
 * MetriSolution Inventory ERP SaaS - Tenant Top Navigation Bar (Modernized)
 */

import { store } from '../services/store.js';
import { getIcon } from './icons.js';
import { toast } from './toast.js';
import { pwaService } from '../services/pwaService.js';

export function renderTopbar() {
  const tenant = store.getState().tenant;
  const branches = store.getBranches();
  const activeBranchId = store.getActiveBranchId();
  const currentUser = store.getCurrentUser();
  const unreadAlerts = store.getAlerts().filter(a => !a.read).length;

  return `
    <header class="erp-topbar">
      <div class="topbar-left">
        <div style="display:flex;align-items:center;gap:8px;">
          <span style="font-weight:700;color:var(--color-navy);font-size:0.9375rem;letter-spacing:-0.01em;">
            ${tenant.name}
          </span>
          <span class="badge badge-success" style="font-size:10px;padding:1px 6px;">
            Active
          </span>
        </div>

        <div class="branch-select-wrap">
          <span class="text-caption" style="font-weight:500;">Branch:</span>
          <select id="erp-branch-selector" class="form-control" style="padding:4px 10px;font-size:0.8125rem;width:auto;height:32px;border-radius:8px;font-weight:500;">
            <option value="all" ${activeBranchId === 'all' ? 'selected' : ''}>All Branches (Consolidated)</option>
            ${branches.map(b => `
              <option value="${b.id}" ${activeBranchId === b.id ? 'selected' : ''}>${b.name}</option>
            `).join('')}
          </select>
        </div>
      </div>

      <div class="topbar-right">
        <!-- Global Search / Command Bar Trigger -->
        <button id="open-command-palette-btn" class="topbar-search-btn" title="Open Command Palette">
          ${getIcon('search', '', 14)}
          <span>Search or command...</span>
          <kbd>Ctrl K</kbd>
        </button>

        <!-- PWA Install Button -->
        <button id="pwa-install-btn" class="btn btn-secondary btn-sm" title="Install MetriSolution PWA App" style="gap:5px;font-size:12px;padding:5px 10px;">
          ${getIcon('download', '', 14)}
          <span>Install App</span>
        </button>

        <!-- Quick Create Button -->
        <a href="/app/orders/new" data-nav class="btn btn-primary btn-sm" style="padding:6px 12px;" title="Create Sales Order">
          ${getIcon('plus', '', 14)}
          <span>New Order</span>
        </a>

        <!-- Notifications Popover Trigger -->
        <a href="/app/alerts" data-nav class="btn btn-ghost btn-sm btn-icon-only" style="position:relative;" title="Notifications">
          ${getIcon('bell', '', 18)}
          ${unreadAlerts > 0 ? `
            <span style="position:absolute;top:6px;right:6px;width:7px;height:7px;background:var(--color-danger);border-radius:50%;box-shadow:0 0 6px var(--color-danger);"></span>
          ` : ''}
        </a>

        <!-- User Profile & Logout -->
        <div style="display:flex;align-items:center;gap:10px;padding-left:10px;border-left:1px solid rgba(228, 231, 236, 0.8);">
          <div style="display:flex;align-items:center;gap:8px;">
            <div style="width:34px;height:34px;border-radius:50%;background:linear-gradient(135deg, #7F56D9 0%, #6941C6 100%);color:#FFFFFF;font-weight:700;font-size:0.8125rem;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 4px rgba(105, 65, 198, 0.25);">
              ${currentUser.avatar || 'U'}
            </div>
            <div style="display:flex;flex-direction:column;line-height:1.2;">
              <span style="font-size:0.8125rem;font-weight:600;color:var(--color-navy);">${currentUser.name}</span>
              <span style="font-size:0.6875rem;color:var(--color-text-muted);">${currentUser.role}</span>
            </div>
          </div>
          <button id="btn-logout-demo" class="btn btn-ghost btn-sm btn-icon-only" title="Sign Out">
            ${getIcon('log-out', '', 16)}
          </button>
        </div>
      </div>
    </header>
  `;
}

export function bindTopbarEvents(router) {
  const branchSelect = document.getElementById('erp-branch-selector');
  if (branchSelect) {
    branchSelect.addEventListener('change', (e) => {
      store.setActiveBranchId(e.target.value);
      toast.info(`Active branch set to ${e.target.options[e.target.selectedIndex].text}`);
      router.handleRoute();
    });
  }

  const pwaBtn = document.getElementById('pwa-install-btn');
  if (pwaBtn) {
    pwaBtn.addEventListener('click', async () => {
      const installed = await pwaService.promptInstall();
      if (installed) {
        toast.success('PWA installation accepted!');
      }
    });
  }

  const logoutBtn = document.getElementById('btn-logout-demo');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      toast.info('Signed out of demo session');
      router.navigate('/login');
    });
  }
}
