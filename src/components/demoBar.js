/**
 * MetriSolution Inventory ERP SaaS - Persistent Demo Control Bar
 * Allows instantaneous 1-click persona switching, data reset, and route context inspection.
 */

import { store } from '../services/store.js';
import { toast } from './toast.js';
import { getIcon } from './icons.js';

export function renderDemoBar(currentPath = '/') {
  const currentUser = store.getCurrentUser();
  const isImpersonating = currentUser.isImpersonating;
  const currentTenant = store.getState().tenant;

  const roles = [
    { id: 'PLATFORM_ADMIN', label: 'Platform Admin', icon: 'shield-check', defaultRoute: '/platform/dashboard' },
    { id: 'OWNER', label: 'Owner', icon: 'building', defaultRoute: '/app/dashboard' },
    { id: 'MANAGER', label: 'Manager', icon: 'users', defaultRoute: '/app/dashboard' },
    { id: 'SALES', label: 'Sales / Cashier', icon: 'shopping-cart', defaultRoute: '/app/pos' },
    { id: 'WAREHOUSE', label: 'Warehouse Staff', icon: 'package', defaultRoute: '/app/stock/receiving' }
  ];

  return `
    ${isImpersonating ? `
      <div style="background:linear-gradient(90deg, #F79009 0%, #FF5E36 100%);color:#101828;padding:6px 18px;font-size:0.8125rem;font-weight:700;display:flex;align-items:center;justify-content:space-between;box-shadow:0 2px 8px rgba(0,0,0,0.15);z-index:var(--z-demo-bar);">
        <div style="display:flex;align-items:center;gap:8px;">
          <span style="background:#101828;color:#FFFFFF;padding:2px 8px;border-radius:6px;font-size:10px;letter-spacing:0.04em;">OPERATOR IMPERSONATION</span>
          <span>Viewing live workspace of <u>${currentTenant?.name || 'Tenant'}</u> as ${currentUser.name}</span>
        </div>
        <button id="btn-exit-impersonation" class="btn btn-sm" style="background:#101828;color:#FFFFFF;border:none;padding:3px 12px;border-radius:6px;cursor:pointer;font-size:11px;font-weight:600;">
          Exit Impersonation & Return to Admin
        </button>
      </div>
    ` : ''}
    <aside class="demo-control-bar" role="region" aria-label="Interactive Demo Switchboard">
      <div class="demo-bar-left">
        <span class="demo-badge-pill">Interactive Demo</span>
        <span style="color:#98A2B3;font-size:0.75rem;">Switch Role:</span>
      </div>
      <div class="demo-bar-center">
        ${roles.map(r => `
          <button class="demo-role-btn ${currentUser.role === r.id ? 'active' : ''}" 
                  data-role="${r.id}" 
                  data-route="${r.defaultRoute}"
                  title="Switch to ${r.label}">
            ${getIcon(r.icon, '', 13)}
            ${r.label}
          </button>
        `).join('')}
      </div>
      <div class="demo-bar-right">
        <button id="btn-reset-demo" class="demo-action-link" style="background:none;border:none;" title="Restore initial fixtures">
          ${getIcon('refresh-cw', '', 12)}
          Reset Data
        </button>
        <a href="/demo-access" data-nav class="demo-action-link" title="View Demo Credentials">
          ${getIcon('help-circle', '', 12)}
          Help
        </a>
      </div>
    </aside>
  `;
}

export function bindDemoBarEvents(router) {
  const container = document.querySelector('.demo-control-bar');
  if (!container) return;

  container.querySelectorAll('.demo-role-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const targetRole = btn.dataset.role;
      const defaultRoute = btn.dataset.route;
      const user = store.setCurrentUserByRole(targetRole);
      if (user) {
        toast.info(`Switched role to ${user.name} (${user.role})`);
        
        // If switching to admin from ERP or vice versa, navigate to corresponding home
        const currentPath = window.location.pathname;
        if (targetRole === 'PLATFORM_ADMIN' && !currentPath.startsWith('/platform')) {
          router.navigate('/platform/dashboard');
        } else if (targetRole !== 'PLATFORM_ADMIN' && currentPath.startsWith('/platform')) {
          router.navigate(defaultRoute);
        } else {
          // Re-render current view with new permissions
          router.handleRoute();
        }
      }
    });
  });

  const resetBtn = container.querySelector('#btn-reset-demo');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (confirm('Reset all demo records back to initial fixtures? Any created sales or products will be restored to defaults.')) {
        store.resetToDefault();
        toast.success('Demo environment restored to default seed fixtures.');
        router.handleRoute();
      }
    });
  }

  const exitBtn = document.getElementById('btn-exit-impersonation');
  if (exitBtn) {
    exitBtn.addEventListener('click', () => {
      store.exitImpersonation();
      toast.success('Exited impersonation mode. Welcome back, Zainab Malik (Platform Admin).');
      router.navigate('/platform/dashboard');
    });
  }
}
