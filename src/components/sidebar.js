/**
 * MetriSolution Inventory ERP SaaS - Role-Aware Navigation Sidebar
 * Sleek Linear/Stripe-style collapsible sidebar with persistent state and tooltip support.
 */

import { store } from '../services/store.js';
import { getIcon, getBrandLogo } from './icons.js';

export function renderSidebar(currentPath = '/') {
  const currentUser = store.getCurrentUser();
  const isPlatformAdmin = currentUser.role === 'PLATFORM_ADMIN';
  const isCollapsed = typeof localStorage !== 'undefined' && localStorage.getItem('metrisolution_sidebar_collapsed') === '1';

  if (isPlatformAdmin) {
    return renderPlatformAdminSidebar(currentPath, isCollapsed);
  }

  // Tenant ERP Navigation Groups with RBAC visibility rules
  const role = currentUser.role; // 'OWNER', 'MANAGER', 'SALES', 'WAREHOUSE'
  const isSales = role === 'SALES';
  const isWarehouse = role === 'WAREHOUSE';

  const unreadAlerts = store.getAlerts().filter(a => !a.read).length;
  const pendingAiDrafts = store.getAiDrafts().filter(d => d.status === 'pending_review').length;

  return `
    <aside class="erp-sidebar ${isCollapsed ? 'collapsed' : ''}" id="app-sidebar" aria-label="Tenant ERP Sidebar">
      <div class="sidebar-header">
        <a href="/app/dashboard" data-nav class="brand-logo" title="MetriSolution Dashboard" style="font-size:1.125rem;">
          ${getBrandLogo(30)}
          <span class="sidebar-text">MetriSolution</span>
        </a>
        <button id="toggle-sidebar-collapse" class="btn btn-ghost btn-sm btn-icon-only sidebar-toggle-btn" aria-label="Toggle Sidebar" title="Collapse / Expand Sidebar">
          <span class="icon-close-bar">${getIcon('sidebar-close', '', 18)}</span>
          <span class="icon-open-bar">${getIcon('sidebar-open', '', 18)}</span>
        </button>
      </div>

      <div class="sidebar-nav-scroll">
        <!-- Overview -->
        <div class="sidebar-group">
          <div class="sidebar-group-title">Overview</div>
          <ul class="sidebar-nav-list">
            <li>
              <a href="/app/dashboard" data-nav class="sidebar-nav-item ${currentPath === '/app/dashboard' ? 'active' : ''}" title="Dashboard">
                <span class="nav-item-icon">${getIcon('bar-chart', '', 18)}</span>
                <span class="sidebar-text">Dashboard</span>
              </a>
            </li>
          </ul>
        </div>

        <!-- Sales -->
        ${!isWarehouse ? `
          <div class="sidebar-group">
            <div class="sidebar-group-title">Sales & Counter</div>
            <ul class="sidebar-nav-list">
              <li>
                <a href="/app/pos" data-nav class="sidebar-nav-item ${currentPath === '/app/pos' ? 'active' : ''}" title="Retail POS Terminal">
                  <span class="nav-item-icon">${getIcon('shopping-cart', '', 18)}</span>
                  <span class="sidebar-text">Retail POS</span>
                  <span class="badge badge-success" style="margin-left:auto;font-size:10px;">Touch</span>
                </a>
              </li>
              <li>
                <a href="/app/orders" data-nav class="sidebar-nav-item ${currentPath.startsWith('/app/orders') ? 'active' : ''}" title="Sales Orders">
                  <span class="nav-item-icon">${getIcon('clipboard-list', '', 18)}</span>
                  <span class="sidebar-text">Sales Orders</span>
                </a>
              </li>
              <li>
                <a href="/app/quotes" data-nav class="sidebar-nav-item ${currentPath.startsWith('/app/quotes') ? 'active' : ''}" title="Quotations & Estimates">
                  <span class="nav-item-icon">${getIcon('file-text', '', 18)}</span>
                  <span class="sidebar-text">Quotations</span>
                </a>
              </li>
              <li>
                <a href="/app/invoices" data-nav class="sidebar-nav-item ${currentPath.startsWith('/app/invoices') ? 'active' : ''}" title="Tax Invoices">
                  <span class="nav-item-icon">${getIcon('dollar-sign', '', 18)}</span>
                  <span class="sidebar-text">Invoices</span>
                </a>
              </li>
              ${!isSales ? `
                <li>
                  <a href="/app/returns" data-nav class="sidebar-nav-item ${currentPath === '/app/returns' ? 'active' : ''}" title="Customer Returns & Credit Notes">
                    <span class="nav-item-icon">${getIcon('refresh-cw', '', 18)}</span>
                    <span class="sidebar-text">Customer Returns</span>
                  </a>
                </li>
              ` : ''}
            </ul>
          </div>
        ` : ''}

        <!-- Inventory -->
        <div class="sidebar-group">
          <div class="sidebar-group-title">Inventory & Stock</div>
          <ul class="sidebar-nav-list">
            <li>
              <a href="/app/products" data-nav class="sidebar-nav-item ${currentPath.startsWith('/app/products') ? 'active' : ''}" title="Products & SKUs">
                <span class="nav-item-icon">${getIcon('package', '', 18)}</span>
                <span class="sidebar-text">Products & SKUs</span>
              </a>
            </li>
            <li>
              <a href="/app/stock/ledger" data-nav class="sidebar-nav-item ${currentPath === '/app/stock/ledger' ? 'active' : ''}" title="Immutable Stock Ledger">
                <span class="nav-item-icon">${getIcon('layers', '', 18)}</span>
                <span class="sidebar-text">Stock Ledger</span>
              </a>
            </li>
            <li>
              <a href="/app/stock/receiving" data-nav class="sidebar-nav-item ${currentPath === '/app/stock/receiving' ? 'active' : ''}" title="Goods Receiving">
                <span class="nav-item-icon">${getIcon('download', '', 18)}</span>
                <span class="sidebar-text">Goods Receiving</span>
              </a>
            </li>
            <li>
              <a href="/app/stock/transfers" data-nav class="sidebar-nav-item ${currentPath === '/app/stock/transfers' ? 'active' : ''}" title="Branch Transfers">
                <span class="nav-item-icon">${getIcon('truck', '', 18)}</span>
                <span class="sidebar-text">Branch Transfers</span>
              </a>
            </li>
            <li>
              <a href="/app/stock/counts" data-nav class="sidebar-nav-item ${currentPath === '/app/stock/counts' ? 'active' : ''}" title="Stock Audits & Cycle Counts">
                <span class="nav-item-icon">${getIcon('check-circle-2', '', 18)}</span>
                <span class="sidebar-text">Cycle Counts</span>
              </a>
            </li>
            ${!isSales ? `
              <li>
                <a href="/app/stock/adjustments" data-nav class="sidebar-nav-item ${currentPath === '/app/stock/adjustments' ? 'active' : ''}" title="Stock Adjustments">
                  <span class="nav-item-icon">${getIcon('sliders', '', 18)}</span>
                  <span class="sidebar-text">Stock Adjustments</span>
                </a>
              </li>
              <li>
                <a href="/app/locations" data-nav class="sidebar-nav-item ${currentPath === '/app/locations' ? 'active' : ''}" title="Racks & Bins">
                  <span class="nav-item-icon">${getIcon('map-pin', '', 18)}</span>
                  <span class="sidebar-text">Racks & Bins</span>
                </a>
              </li>
              <li>
                <a href="/app/low-stock" data-nav class="sidebar-nav-item ${currentPath === '/app/low-stock' ? 'active' : ''}" title="Low Stock Warnings">
                  <span class="nav-item-icon">${getIcon('alert-triangle', '', 18)}</span>
                  <span class="sidebar-text">Low Stock Alert</span>
                </a>
              </li>
            ` : ''}
          </ul>
        </div>

        <!-- Purchasing -->
        ${!isSales ? `
          <div class="sidebar-group">
            <div class="sidebar-group-title">Purchasing</div>
            <ul class="sidebar-nav-list">
              <li>
                <a href="/app/purchases" data-nav class="sidebar-nav-item ${currentPath.startsWith('/app/purchases') ? 'active' : ''}" title="Purchase Orders">
                  <span class="nav-item-icon">${getIcon('shopping-bag', '', 18)}</span>
                  <span class="sidebar-text">Purchase Orders</span>
                </a>
              </li>
              <li>
                <a href="/app/suppliers" data-nav class="sidebar-nav-item ${currentPath === '/app/suppliers' ? 'active' : ''}" title="Suppliers Directory">
                  <span class="nav-item-icon">${getIcon('building', '', 18)}</span>
                  <span class="sidebar-text">Suppliers</span>
                </a>
              </li>
            </ul>
          </div>
        ` : ''}

        <!-- Customers -->
        ${!isWarehouse ? `
          <div class="sidebar-group">
            <div class="sidebar-group-title">Customers</div>
            <ul class="sidebar-nav-list">
              <li>
                <a href="/app/customers" data-nav class="sidebar-nav-item ${currentPath.startsWith('/app/customers') ? 'active' : ''}" title="Customer Profiles">
                  <span class="nav-item-icon">${getIcon('users', '', 18)}</span>
                  <span class="sidebar-text">Customers</span>
                </a>
              </li>
            </ul>
          </div>
        ` : ''}

        <!-- Intelligence & Voice AI -->
        ${!isWarehouse && !isSales ? `
          <div class="sidebar-group">
            <div class="sidebar-group-title">Intelligence & AI</div>
            <ul class="sidebar-nav-list">
              <li>
                <a href="/app/voice-inbox" data-nav class="sidebar-nav-item ${currentPath === '/app/voice-inbox' ? 'active' : ''}" title="WhatsApp Voice Intelligence Center">
                  <span class="nav-item-icon">${getIcon('mic', 'text-primary', 18)}</span>
                  <span class="sidebar-text">WhatsApp Voice Center</span>
                  <span class="badge badge-primary" style="margin-left:auto;font-size:10px;">Audio</span>
                </a>
              </li>
              <li>
                <a href="/app/ai-drafts" data-nav class="sidebar-nav-item ${currentPath === '/app/ai-drafts' ? 'active' : ''}" title="AI Order Drafts">
                  <span class="nav-item-icon">${getIcon('file-text', '', 18)}</span>
                  <span class="sidebar-text">AI Order Drafts</span>
                  ${pendingAiDrafts > 0 ? `<span class="badge badge-warning" style="margin-left:auto;">${pendingAiDrafts}</span>` : ''}
                </a>
              </li>
              <li>
                <a href="/app/alerts" data-nav class="sidebar-nav-item ${currentPath === '/app/alerts' ? 'active' : ''}" title="Notification Center">
                  <span class="nav-item-icon">${getIcon('bell', '', 18)}</span>
                  <span class="sidebar-text">Notification Center</span>
                  ${unreadAlerts > 0 ? `<span class="badge badge-danger" style="margin-left:auto;">${unreadAlerts}</span>` : ''}
                </a>
              </li>
              <li>
                <a href="/app/automation" data-nav class="sidebar-nav-item ${currentPath === '/app/automation' ? 'active' : ''}" title="Automation Rules">
                  <span class="nav-item-icon">${getIcon('sliders', '', 18)}</span>
                  <span class="sidebar-text">Automations</span>
                </a>
              </li>
            </ul>
          </div>
        ` : ''}

        <!-- Reports -->
        ${!isSales && !isWarehouse ? `
          <div class="sidebar-group">
            <div class="sidebar-group-title">Reports & Analytics</div>
            <ul class="sidebar-nav-list">
              <li>
                <a href="/app/reports" data-nav class="sidebar-nav-item ${currentPath === '/app/reports' ? 'active' : ''}" title="Executive Reporting Hub">
                  <span class="nav-item-icon">${getIcon('bar-chart', '', 18)}</span>
                  <span class="sidebar-text">Reporting Hub</span>
                </a>
              </li>
              <li>
                <a href="/app/reports/sales" data-nav class="sidebar-nav-item ${currentPath === '/app/reports/sales' ? 'active' : ''}" title="Sales Analytics">
                  <span class="nav-item-icon">${getIcon('dollar-sign', '', 18)}</span>
                  <span class="sidebar-text">Sales Analytics</span>
                </a>
              </li>
              <li>
                <a href="/app/reports/inventory" data-nav class="sidebar-nav-item ${currentPath === '/app/reports/inventory' ? 'active' : ''}" title="Inventory Valuation">
                  <span class="nav-item-icon">${getIcon('package', '', 18)}</span>
                  <span class="sidebar-text">Inventory Valuation</span>
                </a>
              </li>
              <li>
                <a href="/app/reports/branches" data-nav class="sidebar-nav-item ${currentPath === '/app/reports/branches' ? 'active' : ''}" title="Branch Comparison">
                  <span class="nav-item-icon">${getIcon('building', '', 18)}</span>
                  <span class="sidebar-text">Branch Comparison</span>
                </a>
              </li>
            </ul>
          </div>
        ` : ''}

        <!-- Administration -->
        ${role === 'OWNER' ? `
          <div class="sidebar-group">
            <div class="sidebar-group-title">Administration</div>
            <ul class="sidebar-nav-list">
              <li>
                <a href="/app/team" data-nav class="sidebar-nav-item ${currentPath === '/app/team' ? 'active' : ''}" title="Team & RBAC">
                  <span class="nav-item-icon">${getIcon('users', '', 18)}</span>
                  <span class="sidebar-text">Team & RBAC</span>
                </a>
              </li>
              <li>
                <a href="/app/billing" data-nav class="sidebar-nav-item ${currentPath === '/app/billing' ? 'active' : ''}" title="Subscription & Billing">
                  <span class="nav-item-icon">${getIcon('credit-card', '', 18)}</span>
                  <span class="sidebar-text">Subscription & Billing</span>
                </a>
              </li>
              <li>
                <a href="/app/settings" data-nav class="sidebar-nav-item ${currentPath.startsWith('/app/settings') ? 'active' : ''}" title="Business Settings">
                  <span class="nav-item-icon">${getIcon('settings', '', 18)}</span>
                  <span class="sidebar-text">Business Settings</span>
                </a>
              </li>
              <li>
                <a href="/app/audit" data-nav class="sidebar-nav-item ${currentPath === '/app/audit' ? 'active' : ''}" title="Security Audit Trail">
                  <span class="nav-item-icon">${getIcon('terminal', '', 18)}</span>
                  <span class="sidebar-text">Audit Trail</span>
                </a>
              </li>
            </ul>
          </div>
        ` : ''}
      </div>

      <div class="sidebar-footer">
        <div class="sidebar-user-wrap">
          <div class="sidebar-user-avatar" title="${currentUser.name} (${currentUser.role})">
            ${currentUser.avatar || 'U'}
            <div class="sidebar-status-dot"></div>
          </div>
          <div class="sidebar-user-info">
            <strong class="sidebar-user-name">${currentUser.name}</strong>
            <span class="sidebar-user-role">${currentUser.role.toLowerCase()}</span>
          </div>
        </div>
      </div>
    </aside>
  `;
}

function renderPlatformAdminSidebar(currentPath, isCollapsed = false) {
  return `
    <aside class="erp-sidebar ${isCollapsed ? 'collapsed' : ''}" id="app-sidebar" aria-label="Platform Admin Sidebar" style="background:#0D121F;border-right:1px solid #1E293B;">
      <div class="sidebar-header" style="border-bottom:1px solid #1E293B;color:#FFFFFF;">
        <a href="/platform/dashboard" data-nav class="brand-logo" title="MetriSolution Platform Admin" style="color:#FFFFFF;font-size:1.125rem;">
          ${getBrandLogo(30)}
          <span class="sidebar-text">Platform Admin</span>
        </a>
        <button id="toggle-sidebar-collapse" class="btn btn-ghost btn-sm btn-icon-only sidebar-toggle-btn" aria-label="Toggle Sidebar" title="Collapse / Expand Sidebar" style="color:#94A3B8;">
          <span class="icon-close-bar">${getIcon('sidebar-close', '', 18)}</span>
          <span class="icon-open-bar">${getIcon('sidebar-open', '', 18)}</span>
        </button>
      </div>

      <div class="sidebar-nav-scroll">
        <div class="sidebar-group">
          <div class="sidebar-group-title" style="color:#64748B;">SaaS Fleet Management</div>
          <ul class="sidebar-nav-list">
            <li>
              <a href="/platform/dashboard" data-nav class="sidebar-nav-item ${currentPath === '/platform/dashboard' ? 'active' : ''}" title="Fleet Operations Dashboard" style="color:#CBD5E1;">
                <span class="nav-item-icon">${getIcon('activity', '', 18)}</span>
                <span class="sidebar-text">Fleet Dashboard</span>
              </a>
            </li>
            <li>
              <a href="/platform/tenants" data-nav class="sidebar-nav-item ${currentPath.startsWith('/platform/tenants') ? 'active' : ''}" title="Tenants Directory" style="color:#CBD5E1;">
                <span class="nav-item-icon">${getIcon('building', '', 18)}</span>
                <span class="sidebar-text">Tenants Directory</span>
              </a>
            </li>
            <li>
              <a href="/platform/plans" data-nav class="sidebar-nav-item ${currentPath === '/platform/plans' ? 'active' : ''}" title="Subscription Plans" style="color:#CBD5E1;">
                <span class="nav-item-icon">${getIcon('tag', '', 18)}</span>
                <span class="sidebar-text">Subscription Plans</span>
              </a>
            </li>
            <li>
              <a href="/platform/subscriptions" data-nav class="sidebar-nav-item ${currentPath === '/platform/subscriptions' ? 'active' : ''}" title="Subscriptions Lifecycle" style="color:#CBD5E1;">
                <span class="nav-item-icon">${getIcon('credit-card', '', 18)}</span>
                <span class="sidebar-text">Subscriptions Lifecycle</span>
              </a>
            </li>
            <li>
              <a href="/platform/usage" data-nav class="sidebar-nav-item ${currentPath === '/platform/usage' ? 'active' : ''}" title="API & AI Quotas" style="color:#CBD5E1;">
                <span class="nav-item-icon">${getIcon('bar-chart', '', 18)}</span>
                <span class="sidebar-text">API & AI Usage Quotas</span>
              </a>
            </li>
            <li>
              <a href="/platform/support" data-nav class="sidebar-nav-item ${currentPath === '/platform/support' ? 'active' : ''}" title="Customer Support Tickets" style="color:#CBD5E1;">
                <span class="nav-item-icon">${getIcon('help-circle', '', 18)}</span>
                <span class="sidebar-text">Support Tickets</span>
              </a>
            </li>
            <li>
              <a href="/platform/audit" data-nav class="sidebar-nav-item ${currentPath === '/platform/audit' ? 'active' : ''}" title="SaaS Global Audit Trail" style="color:#CBD5E1;">
                <span class="nav-item-icon">${getIcon('terminal', '', 18)}</span>
                <span class="sidebar-text">SaaS Audit Logs</span>
              </a>
            </li>
            <li>
              <a href="/platform/health" data-nav class="sidebar-nav-item ${currentPath === '/platform/health' ? 'active' : ''}" title="System Health & Infrastructure" style="color:#CBD5E1;">
                <span class="nav-item-icon">${getIcon('database', '', 18)}</span>
                <span class="sidebar-text">System Health</span>
                <span class="badge badge-success" style="margin-left:auto;font-size:10px;">100%</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div class="sidebar-footer" style="background:#080C15;border-top:1px solid #1E293B;">
        <div class="sidebar-admin-footer-text" style="font-size:11px;color:#94A3B8;">
          MetriSolution SaaS Fleet v1.0<br>
          Connected to Karachi Gateway
        </div>
      </div>
    </aside>
  `;
}

export function bindSidebarEvents() {
  const toggleBtn = document.getElementById('toggle-sidebar-collapse');
  const sidebar = document.getElementById('app-sidebar');
  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('collapsed');
      const isCollapsed = sidebar.classList.contains('collapsed');
      try {
        localStorage.setItem('metrisolution_sidebar_collapsed', isCollapsed ? '1' : '0');
      } catch (e) {}
    });
  }

  // Preserve scroll position
  const scrollEl = document.querySelector('.sidebar-nav-scroll');
  if (scrollEl) {
    if (typeof window.__sidebarScrollTop === 'number') {
      scrollEl.scrollTop = window.__sidebarScrollTop;
    }
    scrollEl.addEventListener('scroll', () => {
      window.__sidebarScrollTop = scrollEl.scrollTop;
    }, { passive: true });
  }
}
