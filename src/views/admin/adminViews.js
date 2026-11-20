/**
 * MetriSolution Inventory ERP SaaS - Platform Administration Console Views
 * Fully Interactive & Accessible SaaS Fleet Operations Suite for MetriSolution Pvt Ltd.
 * All controls, modals, tenant lifecycle states, and pricing plans are 100% interactive and editable.
 */

import { store } from '../../services/store.js';
import { getIcon } from '../../components/icons.js';
import { toast } from '../../components/toast.js';
import { modal } from '../../components/modal.js';

// ============================================================================
// 1. PLATFORM FLEET DASHBOARD VIEW
// ============================================================================
export function PlatformDashboardView(params, router) {
  const tenants = store.getTenants();
  const plans = store.getPlans();
  const auditLogs = store.getPlatformAuditLogs().slice(0, 5);

  const totalMrr = tenants.reduce((acc, t) => acc + (t.status !== 'SUSPENDED' ? (t.mrrPKR || 0) : 0), 0);
  const activeTenantsCount = tenants.filter(t => t.status === 'ACTIVE').length;
  const trialTenantsCount = tenants.filter(t => t.status === 'TRIAL').length;
  const totalVoiceMins = tenants.reduce((acc, t) => acc + (t.voiceMinutesUsed || 0), 0);

  return {
    html: `
      <div class="erp-page-header">
        <div>
          <div class="erp-breadcrumbs" style="color:#64748B;">
            <span>SaaS Fleet Operator</span>
            <span>/</span>
            <span>Fleet Dashboard</span>
          </div>
          <h1 class="text-title-2" style="color:#0F172A;">MetriSolution Platform Operations</h1>
          <p class="text-body-sm" style="margin-top:2px;">Global overview of active retailer tenants, MRR, usage quotas, and system health.</p>
        </div>

        <div style="display:flex;gap:10px;align-items:center;">
          <button class="btn btn-primary btn-sm" id="btn-quick-new-tenant">
            ${getIcon('plus', '', 14)} Provision New Retailer
          </button>
          <a href="/platform/health" data-nav class="btn btn-secondary btn-sm">
            ${getIcon('activity', '', 14)} System Health
          </a>
        </div>
      </div>

      <!-- High-level SaaS Performance Metrics -->
      <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(220px, 1fr));gap:16px;margin-bottom:24px;">
        <div class="card" style="padding:20px;border-top:3px solid var(--color-blue);">
          <span class="metric-label">Monthly Recurring Revenue (MRR)</span>
          <div class="metric-val text-primary" style="font-size:26px;margin-top:4px;">Rs. ${totalMrr.toLocaleString()}</div>
          <div class="text-caption" style="color:#027A48;margin-top:4px;">+14.2% month-over-month • Pakistan</div>
        </div>

        <div class="card" style="padding:20px;border-top:3px solid var(--color-success);">
          <span class="metric-label">Active Retailer Tenants</span>
          <div class="metric-val text-navy" style="font-size:26px;margin-top:4px;">${activeTenantsCount} Stores</div>
          <div class="text-caption" style="color:#027A48;margin-top:4px;">Karachi, Lahore & Islamabad</div>
        </div>

        <div class="card" style="padding:20px;border-top:3px solid var(--color-orange);">
          <span class="metric-label">Active Evaluation Trials</span>
          <div class="metric-val text-warning" style="font-size:26px;margin-top:4px;">${trialTenantsCount} Stores</div>
          <div class="text-caption" style="color:#B54708;margin-top:4px;">14-day fully featured trial</div>
        </div>

        <div class="card" style="padding:20px;border-top:3px solid var(--color-navy);">
          <span class="metric-label">AI Voice Ingested</span>
          <div class="metric-val text-navy" style="font-size:26px;margin-top:4px;">${totalVoiceMins.toLocaleString()} Mins</div>
          <div class="text-caption" style="color:#475467;margin-top:4px;">Meta WhatsApp Cloud API</div>
        </div>
      </div>

      <!-- Quick Action Navigation Hub -->
      <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(200px, 1fr));gap:12px;margin-bottom:24px;">
        <a href="/platform/tenants" data-nav class="card" style="padding:14px 18px;display:flex;align-items:center;gap:12px;text-decoration:none;transition:transform 0.15s ease;" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='none'">
          <div style="background:var(--color-primary-soft);color:var(--color-primary);width:36px;height:36px;border-radius:8px;display:flex;align-items:center;justify-content:center;">${getIcon('building', '', 18)}</div>
          <div>
            <div style="font-weight:700;font-size:13px;color:var(--color-navy);">Tenants Directory</div>
            <div style="font-size:11px;color:var(--color-text-muted);">Manage ${tenants.length} provisioned accounts</div>
          </div>
        </a>

        <a href="/platform/plans" data-nav class="card" style="padding:14px 18px;display:flex;align-items:center;gap:12px;text-decoration:none;transition:transform 0.15s ease;" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='none'">
          <div style="background:#EFF4FF;color:#2878F0;width:36px;height:36px;border-radius:8px;display:flex;align-items:center;justify-content:center;">${getIcon('tag', '', 18)}</div>
          <div>
            <div style="font-weight:700;font-size:13px;color:var(--color-navy);">Pricing & Quotas</div>
            <div style="font-size:11px;color:var(--color-text-muted);">${plans.length} subscription plans</div>
          </div>
        </a>

        <a href="/platform/support" data-nav class="card" style="padding:14px 18px;display:flex;align-items:center;gap:12px;text-decoration:none;transition:transform 0.15s ease;" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='none'">
          <div style="background:#FEF3F2;color:#B42318;width:36px;height:36px;border-radius:8px;display:flex;align-items:center;justify-content:center;">${getIcon('help-circle', '', 18)}</div>
          <div>
            <div style="font-weight:700;font-size:13px;color:var(--color-navy);">Support Desk</div>
            <div style="font-size:11px;color:var(--color-text-muted);">${store.getSupportTickets().length} active customer tickets</div>
          </div>
        </a>

        <a href="/platform/health" data-nav class="card" style="padding:14px 18px;display:flex;align-items:center;gap:12px;text-decoration:none;transition:transform 0.15s ease;" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='none'">
          <div style="background:#ECFDF5;color:#027A48;width:36px;height:36px;border-radius:8px;display:flex;align-items:center;justify-content:center;">${getIcon('activity', '', 18)}</div>
          <div>
            <div style="font-weight:700;font-size:13px;color:var(--color-navy);">System Health</div>
            <div style="font-size:11px;color:var(--color-text-muted);">Edge nodes & infrastructure</div>
          </div>
        </a>
      </div>

      <!-- Tenants Overview Table -->
      <div class="card" style="margin-bottom:24px;">
        <div class="card-header" style="display:flex;align-items:center;justify-content:space-between;">
          <div>
            <h3 class="text-heading">Retailer Tenants Fleet</h3>
            <p class="text-caption" style="margin-top:2px;">Live monitoring of customer instances across Pakistan.</p>
          </div>
          <a href="/platform/tenants" data-nav class="btn btn-secondary btn-sm">View Full Directory (${tenants.length})</a>
        </div>
        <div class="table-container" style="border:none;">
          <table class="data-table">
            <thead>
              <tr>
                <th>Tenant Name & ID</th>
                <th>City</th>
                <th>Plan Tier</th>
                <th>Branches & Seats</th>
                <th>MRR (PKR)</th>
                <th>Status</th>
                <th style="text-align:right;">Operator Actions</th>
              </tr>
            </thead>
            <tbody>
              ${tenants.map(t => `
                <tr>
                  <td>
                    <strong>${t.name}</strong><br>
                    <code style="font-size:11px;color:#98A2B3;">${t.id}</code>
                  </td>
                  <td>${t.city}</td>
                  <td><span class="badge ${t.planId === 'business' ? 'badge-info' : t.planId === 'growth' ? 'badge-primary' : 'badge-neutral'}">${t.planName}</span></td>
                  <td style="font-size:12px;">
                    ${t.branchesCount}/${t.branchLimit} branches • ${t.usersCount}/${t.userLimit} seats
                  </td>
                  <td class="table-num">Rs. ${(t.mrrPKR || 0).toLocaleString()}</td>
                  <td>
                    <span class="badge ${t.status === 'ACTIVE' ? 'badge-success' : t.status === 'TRIAL' ? 'badge-warning' : 'badge-danger'}">
                      ${t.status}
                    </span>
                  </td>
                  <td style="text-align:right;">
                    <div style="display:inline-flex;gap:6px;align-items:center;">
                      <a href="/platform/tenants/${t.id}" data-nav class="btn btn-secondary btn-sm" title="Inspect profile & quotas">
                        Inspect
                      </a>
                      <button class="btn btn-primary btn-sm btn-impersonate-tenant" data-tenant-id="${t.id}" title="Impersonate shopkeeper workspace">
                        ${getIcon('log-out', '', 12)} Access Workspace
                      </button>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Recent Platform Audit Activity -->
      <div class="card">
        <div class="card-header" style="display:flex;align-items:center;justify-content:space-between;">
          <h3 class="text-heading">Recent Platform Operator Audit Logs</h3>
          <a href="/platform/audit" data-nav class="btn btn-secondary btn-sm">Full Audit Trail</a>
        </div>
        <div class="table-container" style="border:none;">
          <table class="data-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Operator</th>
                <th>Action</th>
                <th>Target Instance</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              ${auditLogs.map(l => `
                <tr>
                  <td style="font-size:12px;color:#666;">${l.timestamp}</td>
                  <td><strong>${l.operator}</strong></td>
                  <td><span class="badge badge-info">${l.action}</span></td>
                  <td>${l.tenant}</td>
                  <td style="font-size:13px;color:var(--color-text-secondary);">${l.details}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `,
    init: () => {
      // Wire New Tenant button
      const newTenantBtn = document.getElementById('btn-quick-new-tenant');
      if (newTenantBtn) {
        newTenantBtn.addEventListener('click', () => openCreateTenantModal(router));
      }

      // Wire Impersonate buttons
      document.querySelectorAll('.btn-impersonate-tenant').forEach(btn => {
        btn.addEventListener('click', () => {
          const tenantId = btn.dataset.tenantId;
          const tenant = store.impersonateTenant(tenantId);
          toast.success(`Now impersonating workspace: "${tenant.name}" as Store Owner.`);
          router.navigate('/app/dashboard');
        });
      });
    }
  };
}

// ============================================================================
// 2. PLATFORM TENANTS DIRECTORY VIEW
// ============================================================================
export function PlatformTenantsView(params, router) {
  const tenants = store.getTenants();

  return {
    html: `
      <div class="erp-page-header">
        <div>
          <div class="erp-breadcrumbs">
            <a href="/platform/dashboard" data-nav>SaaS Fleet Operator</a>
            <span>/</span>
            <span>Tenants Directory</span>
          </div>
          <h1 class="text-title-2">Retailer Tenants Directory</h1>
          <p class="text-body-sm">Provision, inspect, modify subscription quotas, and access live retailer workspaces.</p>
        </div>

        <button class="btn btn-primary btn-sm" id="btn-provision-tenant">
          ${getIcon('plus', '', 14)} Provision New Retailer
        </button>
      </div>

      <!-- Filter and Search Toolbar -->
      <div class="card" style="padding:14px 18px;margin-bottom:20px;display:flex;gap:12px;align-items:center;flex-wrap:wrap;">
        <div style="flex:1;min-width:240px;position:relative;">
          <input type="text" id="tenant-search-input" class="form-input" placeholder="Search by business name, city, owner, or ID..." style="padding-left:34px;">
          <span style="position:absolute;left:10px;top:50%;transform:translateY(-50%);color:var(--color-text-muted);">
            ${getIcon('search', '', 16)}
          </span>
        </div>
        <select id="tenant-status-filter" class="form-select" style="width:auto;min-width:140px;">
          <option value="ALL">All Statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="TRIAL">Trial</option>
          <option value="SUSPENDED">Suspended</option>
        </select>
        <select id="tenant-city-filter" class="form-select" style="width:auto;min-width:140px;">
          <option value="ALL">All Cities</option>
          <option value="Karachi">Karachi</option>
          <option value="Lahore">Lahore</option>
          <option value="Islamabad">Islamabad</option>
        </select>
      </div>

      <!-- Tenants Table -->
      <div class="table-container card">
        <table class="data-table" id="tenants-main-table">
          <thead>
            <tr>
              <th>Tenant Identifier</th>
              <th>Business Name & City</th>
              <th>Owner Contact</th>
              <th>Plan Tier & MRR</th>
              <th>Quotas</th>
              <th>Status</th>
              <th style="text-align:right;">Actions</th>
            </tr>
          </thead>
          <tbody id="tenants-table-body">
            ${renderTenantsTableRows(tenants)}
          </tbody>
        </table>
      </div>
    `,
    init: () => {
      // Provision New Retailer Modal
      const provBtn = document.getElementById('btn-provision-tenant');
      if (provBtn) {
        provBtn.addEventListener('click', () => openCreateTenantModal(router));
      }

      // Filter handling
      const searchInput = document.getElementById('tenant-search-input');
      const statusFilter = document.getElementById('tenant-status-filter');
      const cityFilter = document.getElementById('tenant-city-filter');

      const applyFilters = () => {
        const query = (searchInput?.value || '').toLowerCase().trim();
        const status = statusFilter?.value || 'ALL';
        const city = cityFilter?.value || 'ALL';

        const filtered = store.getTenants().filter(t => {
          const matchQuery = !query || 
            t.name.toLowerCase().includes(query) || 
            t.id.toLowerCase().includes(query) || 
            t.city.toLowerCase().includes(query) || 
            t.ownerName.toLowerCase().includes(query) ||
            t.email.toLowerCase().includes(query);
          const matchStatus = status === 'ALL' || t.status === status;
          const matchCity = city === 'ALL' || t.city === city;
          return matchQuery && matchStatus && matchCity;
        });

        const tbody = document.getElementById('tenants-table-body');
        if (tbody) {
          tbody.innerHTML = renderTenantsTableRows(filtered);
          bindTenantRowEvents(router);
        }
      };

      if (searchInput) searchInput.addEventListener('input', applyFilters);
      if (statusFilter) statusFilter.addEventListener('change', applyFilters);
      if (cityFilter) cityFilter.addEventListener('change', applyFilters);

      bindTenantRowEvents(router);
    }
  };
}

function renderTenantsTableRows(tenants) {
  if (tenants.length === 0) {
    return `<tr><td colspan="7" style="text-align:center;padding:32px;color:var(--color-text-muted);">No matching tenant accounts found.</td></tr>`;
  }

  return tenants.map(t => `
    <tr data-tenant-row="${t.id}">
      <td>
        <code style="font-size:12px;font-weight:600;color:var(--color-primary);">${t.id}</code><br>
        <span style="font-size:11px;color:#98A2B3;">Created: ${t.createdAt ? t.createdAt.slice(0, 10) : '2026-01-15'}</span>
      </td>
      <td>
        <strong>${t.name}</strong><br>
        <span style="font-size:12px;color:var(--color-text-secondary);">${getIcon('map-pin', '', 12)} ${t.city} • ${t.businessType || 'Retail'}</span>
      </td>
      <td>
        <strong>${t.ownerName}</strong><br>
        <a href="mailto:${t.email}" style="font-size:12px;color:var(--color-text-secondary);">${t.email}</a><br>
        <span style="font-size:11px;color:#98A2B3;">${t.phone}</span>
      </td>
      <td>
        <span class="badge ${t.planId === 'business' ? 'badge-info' : t.planId === 'growth' ? 'badge-primary' : 'badge-neutral'}">${t.planName}</span><br>
        <strong style="font-size:12px;">Rs. ${(t.mrrPKR || 0).toLocaleString()}</strong><span style="font-size:11px;color:#98A2B3;">/mo</span>
      </td>
      <td style="font-size:12px;">
        <div>Branches: <strong>${t.branchesCount}/${t.branchLimit}</strong></div>
        <div>Staff Seats: <strong>${t.usersCount}/${t.userLimit}</strong></div>
        <div style="font-size:11px;color:#98A2B3;">AI Voice: ${t.voiceMinutesUsed}/${t.voiceMinutesLimit}m</div>
      </td>
      <td>
        <span class="badge ${t.status === 'ACTIVE' ? 'badge-success' : t.status === 'TRIAL' ? 'badge-warning' : 'badge-danger'}">
          ${t.status}
        </span>
      </td>
      <td style="text-align:right;">
        <div style="display:inline-flex;gap:4px;align-items:center;flex-wrap:nowrap;">
          <a href="/platform/tenants/${t.id}" data-nav class="btn btn-secondary btn-sm" title="Detailed inspection">
            Inspect
          </a>
          <button class="btn btn-secondary btn-sm btn-edit-tenant" data-tenant-id="${t.id}" title="Edit business, limits, quotas">
            ${getIcon('edit', '', 12)} Edit
          </button>
          <button class="btn ${t.status === 'ACTIVE' ? 'btn-danger' : 'btn-success'} btn-sm btn-toggle-suspend" data-tenant-id="${t.id}" title="Toggle active status">
            ${t.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
          </button>
          <button class="btn btn-primary btn-sm btn-impersonate-tenant" data-tenant-id="${t.id}" title="Impersonate shopkeeper workspace">
            ${getIcon('log-out', '', 12)} Access
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

function bindTenantRowEvents(router) {
  // Edit tenant modal
  document.querySelectorAll('.btn-edit-tenant').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const tenantId = btn.dataset.tenantId;
      openEditTenantModal(tenantId, router);
    });
  });

  // Toggle Suspend / Reactivate
  document.querySelectorAll('.btn-toggle-suspend').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const tenantId = btn.dataset.tenantId;
      const updated = store.toggleTenantStatus(tenantId);
      toast.info(`Tenant "${updated.name}" is now marked as ${updated.status}.`);
      router.handleRoute();
    });
  });

  // Impersonate Workspace
  document.querySelectorAll('.btn-impersonate-tenant').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const tenantId = btn.dataset.tenantId;
      const tenant = store.impersonateTenant(tenantId);
      toast.success(`Assuming Owner persona for "${tenant.name}". Redirecting to dashboard...`);
      router.navigate('/app/dashboard');
    });
  });
}

// ============================================================================
// 3. PLATFORM TENANT DETAIL VIEW (/platform/tenants/:id)
// ============================================================================
export function PlatformTenantDetailView(params, router) {
  const tenantId = params.id;
  const tenant = store.getTenant(tenantId) || store.getTenants()[0];

  if (!tenant) {
    return {
      html: `
        <div class="card" style="padding:40px;text-align:center;">
          <h2 class="text-title-2">Tenant Not Found</h2>
          <p class="text-body-sm" style="margin:8px 0 20px;">The specified tenant identifier does not exist in the SaaS fleet.</p>
          <a href="/platform/tenants" data-nav class="btn btn-primary btn-sm">Return to Tenants Directory</a>
        </div>
      `,
      init: () => {}
    };
  }

  const branchesPercent = Math.min(100, Math.round((tenant.branchesCount / tenant.branchLimit) * 100));
  const seatsPercent = Math.min(100, Math.round((tenant.usersCount / tenant.userLimit) * 100));
  const voicePercent = Math.min(100, Math.round((tenant.voiceMinutesUsed / tenant.voiceMinutesLimit) * 100));

  const tenantAuditLogs = store.getPlatformAuditLogs().filter(l => l.tenant.includes(tenant.name) || l.details.includes(tenant.name));

  return {
    html: `
      <div class="erp-page-header">
        <div>
          <div class="erp-breadcrumbs">
            <a href="/platform/dashboard" data-nav>SaaS Platform</a>
            <span>/</span>
            <a href="/platform/tenants" data-nav>Tenants</a>
            <span>/</span>
            <span>${tenant.id}</span>
          </div>
          <div style="display:flex;align-items:center;gap:12px;margin-top:4px;">
            <h1 class="text-title-2">${tenant.name}</h1>
            <span class="badge ${tenant.status === 'ACTIVE' ? 'badge-success' : tenant.status === 'TRIAL' ? 'badge-warning' : 'badge-danger'}">
              ${tenant.status}
            </span>
            <span class="badge badge-primary">${tenant.planName}</span>
          </div>
          <p class="text-body-sm">Tenant ID: <code>${tenant.id}</code> • Registered: ${tenant.createdAt ? tenant.createdAt.slice(0, 10) : '2026-01-15'}</p>
        </div>

        <div style="display:flex;gap:10px;align-items:center;">
          <button class="btn btn-secondary btn-sm" id="btn-detail-edit-tenant">
            ${getIcon('edit', '', 14)} Edit Organization & Quotas
          </button>
          <button class="btn btn-primary btn-sm" id="btn-detail-impersonate">
            ${getIcon('log-out', '', 14)} Access Workspace
          </button>
          <a href="/platform/tenants" data-nav class="btn btn-ghost btn-sm">Back to Directory</a>
        </div>
      </div>

      <!-- Overview Cards -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:24px;">
        <!-- Organization Profile Card -->
        <div class="card" style="padding:24px;">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;">
            <h3 class="text-heading">Organization Profile</h3>
            <button class="btn btn-ghost btn-sm" id="btn-quick-edit-profile">Edit</button>
          </div>
          <div style="font-size:13px;line-height:2;color:var(--color-text-secondary);">
            <strong>Business Type:</strong> ${tenant.businessType || 'Retail & Wholesale'}<br>
            <strong>Primary Location:</strong> ${tenant.city}, Pakistan<br>
            <strong>Full Address:</strong> ${tenant.address || 'Badar Commercial, Phase V, DHA, Karachi'}<br>
            <strong>Registered Owner:</strong> ${tenant.ownerName}<br>
            <strong>Official Email:</strong> <a href="mailto:${tenant.email}">${tenant.email}</a><br>
            <strong>Official Phone:</strong> ${tenant.phone}<br>
            <strong>NTN:</strong> <code>${tenant.ntn || '7294812-4'}</code> | <strong>STRN:</strong> <code>${tenant.strn || '32-77-8761-901-28'}</code><br>
            <strong>Currency & Timezone:</strong> PKR (Rs.) • Asia/Karachi
          </div>
        </div>

        <!-- SaaS License & Quotas Card -->
        <div class="card" style="padding:24px;">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;">
            <h3 class="text-heading">SaaS Subscription & Resource Quotas</h3>
            <button class="btn btn-ghost btn-sm" id="btn-quick-edit-quotas">Adjust Quotas</button>
          </div>

          <div style="margin-bottom:14px;">
            <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:4px;">
              <span><strong>Branch Licenses:</strong> ${tenant.branchesCount} of ${tenant.branchLimit} used</span>
              <span>${branchesPercent}%</span>
            </div>
            <div style="height:8px;background:var(--color-surface-alt);border-radius:999px;overflow:hidden;">
              <div style="height:100%;width:${branchesPercent}%;background:var(--color-primary);border-radius:999px;"></div>
            </div>
          </div>

          <div style="margin-bottom:14px;">
            <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:4px;">
              <span><strong>Staff Seat Allocations:</strong> ${tenant.usersCount} of ${tenant.userLimit} seats used</span>
              <span>${seatsPercent}%</span>
            </div>
            <div style="height:8px;background:var(--color-surface-alt);border-radius:999px;overflow:hidden;">
              <div style="height:100%;width:${seatsPercent}%;background:#2878F0;border-radius:999px;"></div>
            </div>
          </div>

          <div style="margin-bottom:14px;">
            <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:4px;">
              <span><strong>WhatsApp Voice AI Minutes:</strong> ${tenant.voiceMinutesUsed} of ${tenant.voiceMinutesLimit} mins</span>
              <span>${voicePercent}%</span>
            </div>
            <div style="height:8px;background:var(--color-surface-alt);border-radius:999px;overflow:hidden;">
              <div style="height:100%;width:${voicePercent}%;background:#027A48;border-radius:999px;"></div>
            </div>
          </div>

          <div style="font-size:12px;color:var(--color-text-secondary);border-top:1px solid var(--color-border);padding-top:12px;display:flex;justify-content:space-between;">
            <span><strong>MRR:</strong> Rs. ${(tenant.mrrPKR || 0).toLocaleString()}/mo</span>
            <span><strong>Renews on:</strong> ${tenant.renewalDate || '2026-12-15'}</span>
          </div>
        </div>
      </div>

      <!-- Action Bar -->
      <div class="card" style="padding:18px 24px;margin-bottom:24px;display:flex;align-items:center;justify-content:space-between;background:var(--color-surface-subtle);">
        <div>
          <strong style="color:var(--color-navy);">Lifecycle State Controls</strong>
          <p class="text-caption">Instantly switch between ACTIVE, TRIAL, or SUSPENDED access mode.</p>
        </div>
        <div style="display:flex;gap:10px;">
          <button class="btn ${tenant.status === 'ACTIVE' ? 'btn-danger' : 'btn-success'} btn-sm" id="btn-detail-toggle-status">
            ${tenant.status === 'ACTIVE' ? 'Suspend Tenant Access' : 'Reactivate Tenant Access'}
          </button>
          <button class="btn btn-secondary btn-sm" id="btn-detail-extend-trial">
            Extend Trial (+14 Days)
          </button>
        </div>
      </div>

      <!-- Tenant Audit Trail -->
      <div class="card">
        <div class="card-header">
          <h3 class="text-heading">Activity & Quota History for ${tenant.name}</h3>
        </div>
        <div class="table-container" style="border:none;">
          <table class="data-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Operator</th>
                <th>Action</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              ${tenantAuditLogs.length > 0 ? tenantAuditLogs.map(l => `
                <tr>
                  <td style="font-size:12px;color:#666;">${l.timestamp}</td>
                  <td><strong>${l.operator}</strong></td>
                  <td><span class="badge badge-info">${l.action}</span></td>
                  <td style="font-size:13px;">${l.details}</td>
                </tr>
              `).join('') : `
                <tr>
                  <td colspan="4" style="text-align:center;padding:24px;color:var(--color-text-muted);">
                    No recorded security audit events for this specific tenant yet.
                  </td>
                </tr>
              `}
            </tbody>
          </table>
        </div>
      </div>
    `,
    init: () => {
      // Wire Edit button
      const editBtn = document.getElementById('btn-detail-edit-tenant');
      const quickEditProfile = document.getElementById('btn-quick-edit-profile');
      const quickEditQuotas = document.getElementById('btn-quick-edit-quotas');

      const triggerEdit = () => openEditTenantModal(tenant.id, router);
      if (editBtn) editBtn.addEventListener('click', triggerEdit);
      if (quickEditProfile) quickEditProfile.addEventListener('click', triggerEdit);
      if (quickEditQuotas) quickEditQuotas.addEventListener('click', triggerEdit);

      // Wire Impersonate
      const impBtn = document.getElementById('btn-detail-impersonate');
      if (impBtn) {
        impBtn.addEventListener('click', () => {
          store.impersonateTenant(tenant.id);
          toast.success(`Assuming Owner persona for "${tenant.name}". Redirecting...`);
          router.navigate('/app/dashboard');
        });
      }

      // Wire Toggle Status
      const toggleBtn = document.getElementById('btn-detail-toggle-status');
      if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
          const updated = store.toggleTenantStatus(tenant.id);
          toast.info(`Tenant status updated to ${updated.status}.`);
          router.handleRoute();
        });
      }

      // Wire Extend Trial
      const extendBtn = document.getElementById('btn-detail-extend-trial');
      if (extendBtn) {
        extendBtn.addEventListener('click', () => {
          const newDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
          store.updateTenant(tenant.id, {
            status: 'TRIAL',
            renewalDate: newDate
          });
          toast.success(`Trial extended by 14 days (Expires: ${newDate}).`);
          router.handleRoute();
        });
      }
    }
  };
}

// ============================================================================
// 4. PLATFORM PRICING PLANS VIEW
// ============================================================================
export function PlatformPlansView(params, router) {
  const plans = store.getPlans();

  return {
    html: `
      <div class="erp-page-header">
        <div>
          <div class="erp-breadcrumbs">
            <a href="/platform/dashboard" data-nav>SaaS Platform</a>
            <span>/</span>
            <span>Plans Configuration</span>
          </div>
          <h1 class="text-title-2">SaaS Pricing Plans Configuration</h1>
          <p class="text-body-sm">Define and edit subscription tiers, monthly PKR rates, branch allowances, seat quotas, and feature flags.</p>
        </div>

        <button class="btn btn-primary btn-sm" id="btn-create-custom-plan">
          ${getIcon('plus', '', 14)} Create Custom Plan Tier
        </button>
      </div>

      <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(280px, 1fr));gap:20px;">
        ${plans.map(p => `
          <div class="card" style="padding:24px;display:flex;flex-direction:column;justify-content:space-between;border-top:4px solid var(--color-primary);">
            <div>
              <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
                <span class="badge badge-primary">${p.badge || 'Plan Tier'}</span>
                <span style="font-size:11px;color:#98A2B3;font-family:monospace;">${p.id}</span>
              </div>
              <h3 class="text-heading" style="font-size:1.25rem;">${p.name}</h3>
              <div style="font-size:24px;font-weight:800;color:var(--color-navy);margin:8px 0 16px;">
                ${p.priceMonthly ? `Rs. ${p.priceMonthly.toLocaleString()}<span style="font-size:13px;font-weight:500;color:var(--color-text-secondary);">/month</span>` : 'Custom Enterprise Quote'}
              </div>

              <div style="font-size:13px;color:var(--color-text-secondary);line-height:1.8;margin-bottom:16px;border-top:1px solid var(--color-border);padding-top:12px;">
                • <strong>Branches:</strong> ${p.maxBranches === 999 ? 'Unlimited' : p.maxBranches}<br>
                • <strong>Staff Seats:</strong> ${p.maxUsers === 999 ? 'Unlimited' : p.maxUsers}<br>
                • <strong>SKU Limit:</strong> ${p.maxSkus === 100000 ? '100,000+' : p.maxSkus.toLocaleString()}
              </div>

              <div style="font-size:12px;color:var(--color-text-secondary);line-height:1.6;margin-bottom:20px;">
                <strong>Included Features:</strong>
                <ul style="padding-left:18px;margin-top:6px;">
                  ${(p.features || []).map(f => `<li>${f}</li>`).join('')}
                </ul>
              </div>
            </div>

            <button class="btn btn-secondary btn-sm btn-edit-plan" data-plan-id="${p.id}" style="width:100%;">
              ${getIcon('edit', '', 14)} Edit Plan Configuration
            </button>
          </div>
        `).join('')}
      </div>
    `,
    init: () => {
      // Wire Create Plan
      const createBtn = document.getElementById('btn-create-custom-plan');
      if (createBtn) {
        createBtn.addEventListener('click', () => openCreatePlanModal(router));
      }

      // Wire Edit Plan buttons
      document.querySelectorAll('.btn-edit-plan').forEach(btn => {
        btn.addEventListener('click', () => {
          const planId = btn.dataset.planId;
          openEditPlanModal(planId, router);
        });
      });
    }
  };
}

// ============================================================================
// 5. PLATFORM SUBSCRIPTIONS LIFECYCLE VIEW
// ============================================================================
export function PlatformSubscriptionsView(params, router) {
  const tenants = store.getTenants();

  return {
    html: `
      <div class="erp-page-header">
        <div>
          <div class="erp-breadcrumbs">
            <a href="/platform/dashboard" data-nav>SaaS Platform</a>
            <span>/</span>
            <span>Subscriptions</span>
          </div>
          <h1 class="text-title-2">Subscription Lifecycles</h1>
          <p class="text-body-sm">Active billing cycles, MRR realization, renewal dates, and account grace periods across Pakistan.</p>
        </div>
      </div>

      <div class="table-container card">
        <table class="data-table">
          <thead>
            <tr>
              <th>Tenant Name</th>
              <th>Tier</th>
              <th>Monthly Fee (PKR)</th>
              <th>Renewal Date</th>
              <th>Lifecycle Stage</th>
              <th style="text-align:right;">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${tenants.map(t => `
              <tr>
                <td>
                  <strong>${t.name}</strong><br>
                  <span style="font-size:11px;color:#98A2B3;">ID: ${t.id} • ${t.city}</span>
                </td>
                <td><span class="badge badge-primary">${t.planName}</span></td>
                <td class="table-num">Rs. ${(t.mrrPKR || 0).toLocaleString()}</td>
                <td>${t.renewalDate || '2026-12-15'}</td>
                <td>
                  <span class="badge ${t.status === 'ACTIVE' ? 'badge-success' : t.status === 'TRIAL' ? 'badge-warning' : 'badge-danger'}">
                    ${t.status}
                  </span>
                </td>
                <td style="text-align:right;">
                  <button class="btn btn-secondary btn-sm btn-manage-sub" data-tenant-id="${t.id}">
                    ${getIcon('credit-card', '', 12)} Modify Cycle
                  </button>
                  <button class="btn btn-primary btn-sm btn-impersonate-tenant" data-tenant-id="${t.id}">
                    Access
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `,
    init: () => {
      document.querySelectorAll('.btn-manage-sub').forEach(btn => {
        btn.addEventListener('click', () => {
          const tenantId = btn.dataset.tenantId;
          openManageSubscriptionModal(tenantId, router);
        });
      });

      document.querySelectorAll('.btn-impersonate-tenant').forEach(btn => {
        btn.addEventListener('click', () => {
          const tenantId = btn.dataset.tenantId;
          store.impersonateTenant(tenantId);
          toast.success('Accessing tenant workspace as Owner...');
          router.navigate('/app/dashboard');
        });
      });
    }
  };
}

// ============================================================================
// 6. PLATFORM USAGE & QUOTAS VIEW
// ============================================================================
export function PlatformUsageView(params, router) {
  const tenants = store.getTenants();
  const totalVoiceUsed = tenants.reduce((acc, t) => acc + (t.voiceMinutesUsed || 0), 0);
  const totalVoiceLimit = tenants.reduce((acc, t) => acc + (t.voiceMinutesLimit || 100), 0);
  const totalEventsUsed = tenants.reduce((acc, t) => acc + (t.whatsappEventsUsed || 0), 0);
  const totalEventsLimit = tenants.reduce((acc, t) => acc + (t.whatsappEventsLimit || 1000), 0);

  return {
    html: `
      <div class="erp-page-header">
        <div>
          <div class="erp-breadcrumbs">
            <a href="/platform/dashboard" data-nav>SaaS Platform</a>
            <span>/</span>
            <span>Usage</span>
          </div>
          <h1 class="text-title-2">Aggregate Platform Consumption</h1>
          <p class="text-body-sm">Compute resources, AI speech minutes, and WhatsApp messaging consumption across all tenants.</p>
        </div>

        <button class="btn btn-secondary btn-sm" id="btn-reset-usage-all">
          ${getIcon('refresh-cw', '', 14)} Reset Monthly Counters
        </button>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:24px;">
        <div class="card" style="padding:24px;">
          <h3 class="text-heading" style="margin-bottom:8px;">Speech Synthesis & Transcription Minutes</h3>
          <div style="font-size:28px;font-weight:800;color:var(--color-primary);margin-bottom:4px;">
            ${totalVoiceUsed.toLocaleString()} / ${totalVoiceLimit.toLocaleString()} Mins
          </div>
          <div class="text-caption" style="margin-bottom:12px;">
            ${Math.round((totalVoiceUsed / totalVoiceLimit) * 100)}% of pooled platform monthly quota consumed
          </div>
          <div style="height:8px;background:var(--color-surface-alt);border-radius:999px;overflow:hidden;">
            <div style="height:100%;width:${Math.round((totalVoiceUsed / totalVoiceLimit) * 100)}%;background:var(--color-primary);border-radius:999px;"></div>
          </div>
        </div>

        <div class="card" style="padding:24px;">
          <h3 class="text-heading" style="margin-bottom:8px;">Outbound WhatsApp Notification Events</h3>
          <div style="font-size:28px;font-weight:800;color:#027A48;margin-bottom:4px;">
            ${totalEventsUsed.toLocaleString()} / ${totalEventsLimit.toLocaleString()} Messages
          </div>
          <div class="text-caption" style="margin-bottom:12px;">
            ${Math.round((totalEventsUsed / totalEventsLimit) * 100)}% of Meta API delivery tier consumed
          </div>
          <div style="height:8px;background:var(--color-surface-alt);border-radius:999px;overflow:hidden;">
            <div style="height:100%;width:${Math.round((totalEventsUsed / totalEventsLimit) * 100)}%;background:#027A48;border-radius:999px;"></div>
          </div>
        </div>
      </div>

      <!-- Per-Tenant Quota Breakdown Table -->
      <div class="card">
        <div class="card-header">
          <h3 class="text-heading">Tenant Consumption Breakdown & Overrides</h3>
        </div>
        <div class="table-container" style="border:none;">
          <table class="data-table">
            <thead>
              <tr>
                <th>Tenant</th>
                <th>Plan Tier</th>
                <th>Voice AI Minutes</th>
                <th>WhatsApp Events</th>
                <th style="text-align:right;">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${tenants.map(t => `
                <tr>
                  <td>
                    <strong>${t.name}</strong><br>
                    <code style="font-size:11px;color:#98A2B3;">${t.id}</code>
                  </td>
                  <td><span class="badge badge-primary">${t.planName}</span></td>
                  <td>
                    <strong>${t.voiceMinutesUsed}</strong> / ${t.voiceMinutesLimit} mins
                    <div style="height:4px;width:120px;background:#E4E7EC;border-radius:4px;margin-top:4px;overflow:hidden;">
                      <div style="height:100%;width:${Math.min(100, Math.round((t.voiceMinutesUsed / t.voiceMinutesLimit) * 100))}%;background:var(--color-primary);"></div>
                    </div>
                  </td>
                  <td>
                    <strong>${t.whatsappEventsUsed}</strong> / ${t.whatsappEventsLimit} msgs
                    <div style="height:4px;width:120px;background:#E4E7EC;border-radius:4px;margin-top:4px;overflow:hidden;">
                      <div style="height:100%;width:${Math.min(100, Math.round((t.whatsappEventsUsed / t.whatsappEventsLimit) * 100))}%;background:#027A48;"></div>
                    </div>
                  </td>
                  <td style="text-align:right;">
                    <button class="btn btn-secondary btn-sm btn-adjust-quota" data-tenant-id="${t.id}">
                      ${getIcon('sliders', '', 12)} Adjust Quotas
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `,
    init: () => {
      // Wire Adjust Quotas
      document.querySelectorAll('.btn-adjust-quota').forEach(btn => {
        btn.addEventListener('click', () => {
          const tenantId = btn.dataset.tenantId;
          openAdjustQuotaModal(tenantId, router);
        });
      });

      // Wire Reset All Usage
      const resetBtn = document.getElementById('btn-reset-usage-all');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          if (confirm('Reset usage metrics (voice minutes and message counters) for all tenants back to 0 for a new billing cycle?')) {
            store.getTenants().forEach(t => {
              store.updateTenant(t.id, { voiceMinutesUsed: 0, whatsappEventsUsed: 0 });
            });
            toast.success('All tenant monthly usage counters have been reset.');
            router.handleRoute();
          }
        });
      }
    }
  };
}

// ============================================================================
// 7. PLATFORM SUPPORT DESK QUEUE VIEW
// ============================================================================
export function PlatformSupportView(params, router) {
  const tickets = store.getSupportTickets();

  return {
    html: `
      <div class="erp-page-header">
        <div>
          <div class="erp-breadcrumbs">
            <a href="/platform/dashboard" data-nav>SaaS Platform</a>
            <span>/</span>
            <span>Support</span>
          </div>
          <h1 class="text-title-2">Tenant Support Queue</h1>
          <p class="text-body-sm">Customer tickets, hardware printer integration queries, and billing assistance requests.</p>
        </div>

        <button class="btn btn-primary btn-sm" id="btn-create-support-ticket">
          ${getIcon('plus', '', 14)} Lodge New Support Ticket
        </button>
      </div>

      <div class="table-container card">
        <table class="data-table">
          <thead>
            <tr>
              <th>Ticket ID</th>
              <th>Tenant</th>
              <th>Subject</th>
              <th>Severity</th>
              <th>Status</th>
              <th>Logged At</th>
              <th style="text-align:right;">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${tickets.map(t => `
              <tr>
                <td><code style="font-weight:700;color:var(--color-primary);">${t.id}</code></td>
                <td><strong>${t.tenantName}</strong></td>
                <td style="max-width:320px;">${t.subject}</td>
                <td>
                  <span class="badge ${t.severity === 'Urgent' ? 'badge-danger' : t.severity === 'High' ? 'badge-warning' : 'badge-info'}">
                    ${t.severity}
                  </span>
                </td>
                <td>
                  <span class="badge ${t.status === 'Resolved' ? 'badge-success' : t.status === 'In Progress' ? 'badge-info' : 'badge-warning'}">
                    ${t.status}
                  </span>
                </td>
                <td style="font-size:12px;color:#666;">${t.createdAt ? t.createdAt.slice(0, 10) : '2026-11-19'}</td>
                <td style="text-align:right;">
                  <button class="btn btn-primary btn-sm btn-reply-ticket" data-ticket-id="${t.id}">
                    ${getIcon('mail', '', 12)} Inspect & Reply
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `,
    init: () => {
      // Wire Create Ticket
      const createBtn = document.getElementById('btn-create-support-ticket');
      if (createBtn) {
        createBtn.addEventListener('click', () => openCreateTicketModal(router));
      }

      // Wire Reply Ticket
      document.querySelectorAll('.btn-reply-ticket').forEach(btn => {
        btn.addEventListener('click', () => {
          const ticketId = btn.dataset.ticketId;
          openTicketDialogueModal(ticketId, router);
        });
      });
    }
  };
}

// ============================================================================
// 8. PLATFORM GLOBAL AUDIT VIEW
// ============================================================================
export function PlatformAuditView(params, router) {
  const logs = store.getPlatformAuditLogs();

  return {
    html: `
      <div class="erp-page-header">
        <div>
          <div class="erp-breadcrumbs">
            <a href="/platform/dashboard" data-nav>SaaS Platform</a>
            <span>/</span>
            <span>Audit</span>
          </div>
          <h1 class="text-title-2">Platform Administrative Audit Trail</h1>
          <p class="text-body-sm">Chronological record of platform operator actions, plan updates, tenant activations, and impersonations.</p>
        </div>
      </div>

      <div class="table-container card">
        <table class="data-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Operator</th>
              <th>Action Category</th>
              <th>Target Tenant / Entity</th>
              <th>Details & Metadata</th>
            </tr>
          </thead>
          <tbody>
            ${logs.map(l => `
              <tr>
                <td style="font-size:12px;color:#666;white-space:nowrap;">${l.timestamp}</td>
                <td><strong>${l.operator}</strong></td>
                <td><span class="badge badge-info">${l.action}</span></td>
                <td><strong>${l.tenant}</strong></td>
                <td style="font-size:13px;color:var(--color-text-secondary);">${l.details}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `,
    init: () => {}
  };
}

// ============================================================================
// 9. PLATFORM SYSTEM HEALTH & FEATURE TOGGLES VIEW
// ============================================================================
export function PlatformHealthView(params, router) {
  const settings = store.getPlatformSettings();

  return {
    html: `
      <div class="erp-page-header">
        <div>
          <div class="erp-breadcrumbs">
            <a href="/platform/dashboard" data-nav>SaaS Platform</a>
            <span>/</span>
            <span>Health & Infrastructure</span>
          </div>
          <h1 class="text-title-2">System Infrastructure & Global Controls</h1>
          <p class="text-body-sm">Live hardware gateway status, automated FBR tax engine, WhatsApp cloud webhooks, and maintenance switches.</p>
        </div>

        <button class="btn btn-secondary btn-sm" id="btn-run-diagnostics">
          ${getIcon('activity', '', 14)} Run Diagnostic Self-Test
        </button>
      </div>

      <!-- Infrastructure Nodes Status -->
      <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(260px, 1fr));gap:20px;margin-bottom:24px;">
        <div class="card" style="padding:24px;">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
            <span class="badge badge-success">Operational</span>
            <div style="color:#027A48;">${getIcon('activity', '', 18)}</div>
          </div>
          <h3 class="text-heading">API Gateway (Karachi Edge)</h3>
          <div style="font-size:13px;color:#666;margin-top:4px;">Latency: 14ms • Uptime: 99.99%</div>
        </div>

        <div class="card" style="padding:24px;">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
            <span class="badge badge-success">Operational</span>
            <div style="color:#027A48;">${getIcon('database', '', 18)}</div>
          </div>
          <h3 class="text-heading">Transactional Database Cluster</h3>
          <div style="font-size:13px;color:#666;margin-top:4px;">High-Availability Replicas • CPU: 16%</div>
        </div>

        <div class="card" style="padding:24px;">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
            <span class="badge badge-success">Operational</span>
            <div style="color:#027A48;">${getIcon('mic', '', 18)}</div>
          </div>
          <h3 class="text-heading">Speech Recognition Queue</h3>
          <div style="font-size:13px;color:#666;margin-top:4px;">Worker Queue: 0 backlog • Processing latency: 1.1s</div>
        </div>
      </div>

      <!-- Global Live Feature Switches -->
      <div class="card" style="padding:24px;">
        <h3 class="text-heading" style="margin-bottom:6px;">Live SaaS Feature Flags & Hardware Gateways</h3>
        <p class="text-caption" style="margin-bottom:20px;">Toggles apply instantaneously across all retailer tenant nodes.</p>

        <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(320px, 1fr));gap:16px;">
          <!-- WhatsApp Cloud API Webhook -->
          <div style="display:flex;align-items:center;justify-content:space-between;padding:16px;background:var(--color-surface-alt);border-radius:10px;">
            <div>
              <strong style="color:var(--color-navy);font-size:14px;">WhatsApp Cloud API Ingestion</strong>
              <div style="font-size:12px;color:var(--color-text-secondary);margin-top:2px;">Receives audio notes and messages from customer WhatsApp</div>
            </div>
            <label class="switch" style="cursor:pointer;">
              <input type="checkbox" id="toggle-whatsapp" ${settings.whatsappWebhookActive !== false ? 'checked' : ''}>
              <span class="slider"></span>
            </label>
          </div>

          <!-- AI Speech Recognition Queue -->
          <div style="display:flex;align-items:center;justify-content:space-between;padding:16px;background:var(--color-surface-alt);border-radius:10px;">
            <div>
              <strong style="color:var(--color-navy);font-size:14px;">AI Voice Transcription Queue</strong>
              <div style="font-size:12px;color:var(--color-text-secondary);margin-top:2px;">Processes Urdu/English audio into order drafts</div>
            </div>
            <label class="switch" style="cursor:pointer;">
              <input type="checkbox" id="toggle-ai-speech" ${settings.aiSpeechQueueActive !== false ? 'checked' : ''}>
              <span class="slider"></span>
            </label>
          </div>

          <!-- PWA Offline Service Worker -->
          <div style="display:flex;align-items:center;justify-content:space-between;padding:16px;background:var(--color-surface-alt);border-radius:10px;">
            <div>
              <strong style="color:var(--color-navy);font-size:14px;">PWA Offline Service Worker</strong>
              <div style="font-size:12px;color:var(--color-text-secondary);margin-top:2px;">Caches retail POS assets for offline internet resilience</div>
            </div>
            <label class="switch" style="cursor:pointer;">
              <input type="checkbox" id="toggle-pwa-worker" ${settings.pwaOfflineWorkerActive !== false ? 'checked' : ''}>
              <span class="slider"></span>
            </label>
          </div>

          <!-- Automated 18% FBR Tax Calculation -->
          <div style="display:flex;align-items:center;justify-content:space-between;padding:16px;background:var(--color-surface-alt);border-radius:10px;">
            <div>
              <strong style="color:var(--color-navy);font-size:14px;">Automated 18% FBR Sales Tax</strong>
              <div style="font-size:12px;color:var(--color-text-secondary);margin-top:2px;">Default tax calculation for Pakistani tax invoices</div>
            </div>
            <label class="switch" style="cursor:pointer;">
              <input type="checkbox" id="toggle-fbr-tax" ${settings.autoFbrTaxSync !== false ? 'checked' : ''}>
              <span class="slider"></span>
            </label>
          </div>

          <!-- Direct Raw ESC/POS Thermal Driver -->
          <div style="display:flex;align-items:center;justify-content:space-between;padding:16px;background:var(--color-surface-alt);border-radius:10px;">
            <div>
              <strong style="color:var(--color-navy);font-size:14px;">Direct USB Thermal Driver</strong>
              <div style="font-size:12px;color:var(--color-text-secondary);margin-top:2px;">80mm & 58mm raw receipt hardware passthrough</div>
            </div>
            <label class="switch" style="cursor:pointer;">
              <input type="checkbox" id="toggle-thermal-driver" ${settings.thermalPrinterRawDriver !== false ? 'checked' : ''}>
              <span class="slider"></span>
            </label>
          </div>

          <!-- Global Maintenance Mode -->
          <div style="display:flex;align-items:center;justify-content:space-between;padding:16px;background:#FEF3F2;border-radius:10px;">
            <div>
              <strong style="color:#B42318;font-size:14px;">Platform Maintenance Mode</strong>
              <div style="font-size:12px;color:#B42318;margin-top:2px;">Presents maintenance overlay to non-admin visitors</div>
            </div>
            <label class="switch" style="cursor:pointer;">
              <input type="checkbox" id="toggle-maintenance" ${settings.maintenanceMode ? 'checked' : ''}>
              <span class="slider"></span>
            </label>
          </div>
        </div>
      </div>
    `,
    init: () => {
      // Feature toggles
      const bindToggle = (elementId, settingKey, label) => {
        const el = document.getElementById(elementId);
        if (el) {
          el.addEventListener('change', () => {
            store.updatePlatformSetting(settingKey, el.checked);
            toast.info(`${label}: ${el.checked ? 'ENABLED' : 'PAUSED'}`);
          });
        }
      };

      bindToggle('toggle-whatsapp', 'whatsappWebhookActive', 'WhatsApp Cloud API');
      bindToggle('toggle-ai-speech', 'aiSpeechQueueActive', 'AI Voice Transcription Queue');
      bindToggle('toggle-pwa-worker', 'pwaOfflineWorkerActive', 'PWA Offline Worker');
      bindToggle('toggle-fbr-tax', 'autoFbrTaxSync', 'Automated 18% FBR Tax');
      bindToggle('toggle-thermal-driver', 'thermalPrinterRawDriver', 'Direct Thermal Printer Driver');
      bindToggle('toggle-maintenance', 'maintenanceMode', 'Platform Maintenance Mode');

      // Diagnostics button
      const diagBtn = document.getElementById('btn-run-diagnostics');
      if (diagBtn) {
        diagBtn.addEventListener('click', () => {
          diagBtn.disabled = true;
          diagBtn.textContent = 'Running Diagnostics...';
          setTimeout(() => {
            store.addPlatformAuditLog('DIAGNOSTICS_RUN', 'Karachi Edge Gateway', 'All health endpoints returned 200 OK (Latency: 12ms)');
            toast.success('System diagnostics passed: 100% cluster nodes healthy.');
            diagBtn.disabled = false;
            diagBtn.innerHTML = `${getIcon('activity', '', 14)} Run Diagnostic Self-Test`;
          }, 600);
        });
      }
    }
  };
}

// ============================================================================
// MODAL DIALOG CONTROLLERS (PROVISIONING, EDITING, PLANS, QUOTAS, SUPPORT)
// ============================================================================

/**
 * Modal to Provision a New Retailer Tenant
 */
function openCreateTenantModal(router) {
  const plans = store.getPlans();

  const content = `
    <form id="form-create-tenant" style="display:flex;flex-direction:column;gap:16px;">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
        <div class="form-group">
          <label class="form-label">Business Name *</label>
          <input type="text" id="ct-name" class="form-input" placeholder="e.g. Rawalpindi Auto Spares" required>
        </div>
        <div class="form-group">
          <label class="form-label">City *</label>
          <select id="ct-city" class="form-select" required>
            <option value="Karachi">Karachi</option>
            <option value="Lahore">Lahore</option>
            <option value="Islamabad">Islamabad</option>
            <option value="Rawalpindi">Rawalpindi</option>
            <option value="Faisalabad">Faisalabad</option>
            <option value="Multan">Multan</option>
            <option value="Peshawar">Peshawar</option>
            <option value="Quetta">Quetta</option>
          </select>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
        <div class="form-group">
          <label class="form-label">Business Type</label>
          <input type="text" id="ct-type" class="form-input" placeholder="e.g. Retail Hardware & Tools" value="General Retail">
        </div>
        <div class="form-group">
          <label class="form-label">Owner Full Name *</label>
          <input type="text" id="ct-owner" class="form-input" placeholder="e.g. Muhammad Usman" required>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
        <div class="form-group">
          <label class="form-label">Official Email *</label>
          <input type="email" id="ct-email" class="form-input" placeholder="owner@store.pk" required>
        </div>
        <div class="form-group">
          <label class="form-label">Contact Phone *</label>
          <input type="tel" id="ct-phone" class="form-input" placeholder="+92 300 1234567" required>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
        <div class="form-group">
          <label class="form-label">Subscription Tier *</label>
          <select id="ct-plan" class="form-select">
            ${plans.map(p => `<option value="${p.id}">${p.name} (Rs. ${(p.priceMonthly || 0).toLocaleString()}/mo)</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Initial Status</label>
          <select id="ct-status" class="form-select">
            <option value="ACTIVE">ACTIVE (Paid)</option>
            <option value="TRIAL">TRIAL (14-Day Free)</option>
          </select>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">Commercial Address</label>
        <input type="text" id="ct-address" class="form-input" placeholder="Shop #, Commercial Area, City">
      </div>
    </form>
  `;

  const footer = `
    <button class="btn btn-secondary btn-sm" id="btn-cancel-create-tenant">Cancel</button>
    <button class="btn btn-primary btn-sm" id="btn-submit-create-tenant">Provision Instance</button>
  `;

  const dlg = modal.open({
    title: 'Provision New Retailer Tenant',
    content,
    footer,
    size: 'lg'
  });

  const cancelBtn = dlg.dialog.querySelector('#btn-cancel-create-tenant');
  if (cancelBtn) cancelBtn.addEventListener('click', () => modal.close());

  const submitBtn = dlg.dialog.querySelector('#btn-submit-create-tenant');
  if (submitBtn) {
    submitBtn.addEventListener('click', () => {
      const name = dlg.dialog.querySelector('#ct-name')?.value.trim();
      const city = dlg.dialog.querySelector('#ct-city')?.value;
      const businessType = dlg.dialog.querySelector('#ct-type')?.value.trim();
      const ownerName = dlg.dialog.querySelector('#ct-owner')?.value.trim();
      const email = dlg.dialog.querySelector('#ct-email')?.value.trim();
      const phone = dlg.dialog.querySelector('#ct-phone')?.value.trim();
      const planId = dlg.dialog.querySelector('#ct-plan')?.value;
      const status = dlg.dialog.querySelector('#ct-status')?.value;
      const address = dlg.dialog.querySelector('#ct-address')?.value.trim();

      if (!name || !ownerName || !email || !phone) {
        toast.warning('Please complete all required fields.');
        return;
      }

      const planObj = plans.find(p => p.id === planId);
      const newTenant = store.createTenant({
        name,
        city,
        businessType,
        ownerName,
        email,
        phone,
        planId,
        planName: planObj ? `${planObj.name} Plan` : 'Growth Plan',
        status,
        mrrPKR: planObj ? planObj.priceMonthly : 6999,
        branchLimit: planObj ? planObj.maxBranches : 3,
        userLimit: planObj ? planObj.maxUsers : 10,
        address
      });

      modal.close();
      toast.success(`Successfully provisioned tenant: "${newTenant.name}" (${newTenant.id}).`);
      router.handleRoute();
    });
  }
}

/**
 * Modal to Edit an Existing Retailer Tenant
 */
function openEditTenantModal(tenantId, router) {
  const tenant = store.getTenant(tenantId);
  if (!tenant) return;
  const plans = store.getPlans();

  const content = `
    <form id="form-edit-tenant" style="display:flex;flex-direction:column;gap:16px;">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
        <div class="form-group">
          <label class="form-label">Business Name *</label>
          <input type="text" id="et-name" class="form-input" value="${tenant.name}" required>
        </div>
        <div class="form-group">
          <label class="form-label">City *</label>
          <input type="text" id="et-city" class="form-input" value="${tenant.city}" required>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
        <div class="form-group">
          <label class="form-label">Registered Owner Name *</label>
          <input type="text" id="et-owner" class="form-input" value="${tenant.ownerName}" required>
        </div>
        <div class="form-group">
          <label class="form-label">Official Email *</label>
          <input type="email" id="et-email" class="form-input" value="${tenant.email}" required>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
        <div class="form-group">
          <label class="form-label">Contact Phone</label>
          <input type="tel" id="et-phone" class="form-input" value="${tenant.phone || ''}">
        </div>
        <div class="form-group">
          <label class="form-label">Plan Tier</label>
          <select id="et-plan" class="form-select">
            ${plans.map(p => `<option value="${p.id}" ${tenant.planId === p.id ? 'selected' : ''}>${p.name}</option>`).join('')}
          </select>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;">
        <div class="form-group">
          <label class="form-label">Allowed Branches</label>
          <input type="number" id="et-branches" class="form-input" value="${tenant.branchLimit || 3}" min="1" max="100">
        </div>
        <div class="form-group">
          <label class="form-label">Staff Seats</label>
          <input type="number" id="et-users" class="form-input" value="${tenant.userLimit || 10}" min="1" max="500">
        </div>
        <div class="form-group">
          <label class="form-label">Account Status</label>
          <select id="et-status" class="form-select">
            <option value="ACTIVE" ${tenant.status === 'ACTIVE' ? 'selected' : ''}>ACTIVE</option>
            <option value="TRIAL" ${tenant.status === 'TRIAL' ? 'selected' : ''}>TRIAL</option>
            <option value="SUSPENDED" ${tenant.status === 'SUSPENDED' ? 'selected' : ''}>SUSPENDED</option>
          </select>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
        <div class="form-group">
          <label class="form-label">FBR NTN Number</label>
          <input type="text" id="et-ntn" class="form-input" value="${tenant.ntn || '7294812-4'}">
        </div>
        <div class="form-group">
          <label class="form-label">FBR STRN Number</label>
          <input type="text" id="et-strn" class="form-input" value="${tenant.strn || '32-77-8761-901-28'}">
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">Official Address</label>
        <input type="text" id="et-address" class="form-input" value="${tenant.address || ''}">
      </div>
    </form>
  `;

  const footer = `
    <button class="btn btn-secondary btn-sm" id="btn-cancel-edit-tenant">Cancel</button>
    <button class="btn btn-primary btn-sm" id="btn-submit-edit-tenant">Save Changes</button>
  `;

  const dlg = modal.open({
    title: `Edit Tenant: ${tenant.name}`,
    content,
    footer,
    size: 'lg'
  });

  const cancelBtn = dlg.dialog.querySelector('#btn-cancel-edit-tenant');
  if (cancelBtn) cancelBtn.addEventListener('click', () => modal.close());

  const submitBtn = dlg.dialog.querySelector('#btn-submit-edit-tenant');
  if (submitBtn) {
    submitBtn.addEventListener('click', () => {
      const name = dlg.dialog.querySelector('#et-name')?.value.trim();
      const city = dlg.dialog.querySelector('#et-city')?.value.trim();
      const ownerName = dlg.dialog.querySelector('#et-owner')?.value.trim();
      const email = dlg.dialog.querySelector('#et-email')?.value.trim();
      const phone = dlg.dialog.querySelector('#et-phone')?.value.trim();
      const planId = dlg.dialog.querySelector('#et-plan')?.value;
      const branchLimit = Number(dlg.dialog.querySelector('#et-branches')?.value) || 3;
      const userLimit = Number(dlg.dialog.querySelector('#et-users')?.value) || 10;
      const status = dlg.dialog.querySelector('#et-status')?.value;
      const ntn = dlg.dialog.querySelector('#et-ntn')?.value.trim();
      const strn = dlg.dialog.querySelector('#et-strn')?.value.trim();
      const address = dlg.dialog.querySelector('#et-address')?.value.trim();

      const planObj = plans.find(p => p.id === planId);

      store.updateTenant(tenant.id, {
        name,
        city,
        ownerName,
        email,
        phone,
        planId,
        planName: planObj ? `${planObj.name} Plan` : tenant.planName,
        mrrPKR: planObj && planObj.priceMonthly ? planObj.priceMonthly : tenant.mrrPKR,
        branchLimit,
        userLimit,
        status,
        ntn,
        strn,
        address
      });

      modal.close();
      toast.success(`Updated organization records for "${name}".`);
      router.handleRoute();
    });
  }
}

/**
 * Modal to Edit Plan Specification
 */
function openEditPlanModal(planId, router) {
  const plan = store.getPlans().find(p => p.id === planId);
  if (!plan) return;

  const content = `
    <form id="form-edit-plan" style="display:flex;flex-direction:column;gap:16px;">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
        <div class="form-group">
          <label class="form-label">Plan Tier Name *</label>
          <input type="text" id="ep-name" class="form-input" value="${plan.name}" required>
        </div>
        <div class="form-group">
          <label class="form-label">Badge Label</label>
          <input type="text" id="ep-badge" class="form-input" value="${plan.badge || ''}">
        </div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
        <div class="form-group">
          <label class="form-label">Monthly Price (PKR)</label>
          <input type="number" id="ep-price" class="form-input" value="${plan.priceMonthly || 0}">
        </div>
        <div class="form-group">
          <label class="form-label">Annual Price (PKR)</label>
          <input type="number" id="ep-price-annual" class="form-input" value="${plan.priceAnnual || 0}">
        </div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;">
        <div class="form-group">
          <label class="form-label">Max Branches</label>
          <input type="number" id="ep-branches" class="form-input" value="${plan.maxBranches}">
        </div>
        <div class="form-group">
          <label class="form-label">Max Staff Seats</label>
          <input type="number" id="ep-users" class="form-input" value="${plan.maxUsers}">
        </div>
        <div class="form-group">
          <label class="form-label">Max Active SKUs</label>
          <input type="number" id="ep-skus" class="form-input" value="${plan.maxSkus}">
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">Features Included (one per line)</label>
        <textarea id="ep-features" class="form-textarea" rows="5">${(plan.features || []).join('\n')}</textarea>
      </div>
    </form>
  `;

  const footer = `
    <button class="btn btn-secondary btn-sm" id="btn-cancel-edit-plan">Cancel</button>
    <button class="btn btn-primary btn-sm" id="btn-submit-edit-plan">Update Plan</button>
  `;

  const dlg = modal.open({
    title: `Configure Pricing Tier: ${plan.name}`,
    content,
    footer,
    size: 'md'
  });

  const cancelBtn = dlg.dialog.querySelector('#btn-cancel-edit-plan');
  if (cancelBtn) cancelBtn.addEventListener('click', () => modal.close());

  const submitBtn = dlg.dialog.querySelector('#btn-submit-edit-plan');
  if (submitBtn) {
    submitBtn.addEventListener('click', () => {
      const name = dlg.dialog.querySelector('#ep-name')?.value.trim();
      const badge = dlg.dialog.querySelector('#ep-badge')?.value.trim();
      const priceMonthly = Number(dlg.dialog.querySelector('#ep-price')?.value) || 0;
      const priceAnnual = Number(dlg.dialog.querySelector('#ep-price-annual')?.value) || 0;
      const maxBranches = Number(dlg.dialog.querySelector('#ep-branches')?.value) || 1;
      const maxUsers = Number(dlg.dialog.querySelector('#ep-users')?.value) || 1;
      const maxSkus = Number(dlg.dialog.querySelector('#ep-skus')?.value) || 1000;
      const featuresRaw = dlg.dialog.querySelector('#ep-features')?.value || '';
      const features = featuresRaw.split('\n').map(f => f.trim()).filter(Boolean);

      store.updatePlan(plan.id, {
        name,
        badge,
        priceMonthly,
        priceAnnual,
        maxBranches,
        maxUsers,
        maxSkus,
        features
      });

      modal.close();
      toast.success(`Saved plan specifications for "${name}".`);
      router.handleRoute();
    });
  }
}

/**
 * Modal to Create a Custom Plan
 */
function openCreatePlanModal(router) {
  const content = `
    <form id="form-create-plan" style="display:flex;flex-direction:column;gap:16px;">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
        <div class="form-group">
          <label class="form-label">Plan Name *</label>
          <input type="text" id="cp-name" class="form-input" placeholder="e.g. Enterprise Franchise" required>
        </div>
        <div class="form-group">
          <label class="form-label">Badge Label</label>
          <input type="text" id="cp-badge" class="form-input" placeholder="e.g. Custom Tier">
        </div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
        <div class="form-group">
          <label class="form-label">Monthly Price (PKR)</label>
          <input type="number" id="cp-price" class="form-input" placeholder="19999" value="19999">
        </div>
        <div class="form-group">
          <label class="form-label">Annual Price (PKR)</label>
          <input type="number" id="cp-price-annual" class="form-input" placeholder="199990" value="199990">
        </div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;">
        <div class="form-group">
          <label class="form-label">Max Branches</label>
          <input type="number" id="cp-branches" class="form-input" value="15">
        </div>
        <div class="form-group">
          <label class="form-label">Staff Seats</label>
          <input type="number" id="cp-users" class="form-input" value="50">
        </div>
        <div class="form-group">
          <label class="form-label">Max SKUs</label>
          <input type="number" id="cp-skus" class="form-input" value="50000">
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">Features Included (one per line)</label>
        <textarea id="cp-features" class="form-textarea" rows="4">Up to 15 Connected Branches
Up to 50 Team Members
50,000 Active SKUs
Custom ERP Cloud Hosting
Dedicated Pakistan Support SLA</textarea>
      </div>
    </form>
  `;

  const footer = `
    <button class="btn btn-secondary btn-sm" id="btn-cancel-create-plan">Cancel</button>
    <button class="btn btn-primary btn-sm" id="btn-submit-create-plan">Create Plan</button>
  `;

  const dlg = modal.open({
    title: 'Create Bespoke Subscription Tier',
    content,
    footer,
    size: 'md'
  });

  const cancelBtn = dlg.dialog.querySelector('#btn-cancel-create-plan');
  if (cancelBtn) cancelBtn.addEventListener('click', () => modal.close());

  const submitBtn = dlg.dialog.querySelector('#btn-submit-create-plan');
  if (submitBtn) {
    submitBtn.addEventListener('click', () => {
      const name = dlg.dialog.querySelector('#cp-name')?.value.trim();
      const badge = dlg.dialog.querySelector('#cp-badge')?.value.trim();
      const priceMonthly = Number(dlg.dialog.querySelector('#cp-price')?.value) || 0;
      const priceAnnual = Number(dlg.dialog.querySelector('#cp-price-annual')?.value) || 0;
      const maxBranches = Number(dlg.dialog.querySelector('#cp-branches')?.value) || 1;
      const maxUsers = Number(dlg.dialog.querySelector('#cp-users')?.value) || 1;
      const maxSkus = Number(dlg.dialog.querySelector('#cp-skus')?.value) || 1000;
      const featuresRaw = dlg.dialog.querySelector('#cp-features')?.value || '';
      const features = featuresRaw.split('\n').map(f => f.trim()).filter(Boolean);

      if (!name) {
        toast.warning('Plan name is required.');
        return;
      }

      store.createPlan({
        name,
        badge,
        priceMonthly,
        priceAnnual,
        maxBranches,
        maxUsers,
        maxSkus,
        features
      });

      modal.close();
      toast.success(`Created plan tier "${name}".`);
      router.handleRoute();
    });
  }
}

/**
 * Modal to Adjust Tenant Quotas
 */
function openAdjustQuotaModal(tenantId, router) {
  const tenant = store.getTenant(tenantId);
  if (!tenant) return;

  const content = `
    <form id="form-adjust-quota" style="display:flex;flex-direction:column;gap:16px;">
      <div style="font-size:13px;color:var(--color-text-secondary);background:var(--color-surface-alt);padding:12px;border-radius:8px;">
        Adjusting resource allocations for <strong>${tenant.name}</strong> (${tenant.city}).
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
        <div class="form-group">
          <label class="form-label">Voice AI Monthly Minutes Limit</label>
          <input type="number" id="aq-voice-limit" class="form-input" value="${tenant.voiceMinutesLimit || 100}">
        </div>
        <div class="form-group">
          <label class="form-label">Voice AI Minutes Used</label>
          <input type="number" id="aq-voice-used" class="form-input" value="${tenant.voiceMinutesUsed || 0}">
        </div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
        <div class="form-group">
          <label class="form-label">WhatsApp Events Limit</label>
          <input type="number" id="aq-wa-limit" class="form-input" value="${tenant.whatsappEventsLimit || 1000}">
        </div>
        <div class="form-group">
          <label class="form-label">WhatsApp Events Used</label>
          <input type="number" id="aq-wa-used" class="form-input" value="${tenant.whatsappEventsUsed || 0}">
        </div>
      </div>
    </form>
  `;

  const footer = `
    <button class="btn btn-secondary btn-sm" id="btn-cancel-quota">Cancel</button>
    <button class="btn btn-primary btn-sm" id="btn-submit-quota">Apply Quota Overrides</button>
  `;

  const dlg = modal.open({
    title: `Adjust Quotas: ${tenant.name}`,
    content,
    footer,
    size: 'md'
  });

  const cancelBtn = dlg.dialog.querySelector('#btn-cancel-quota');
  if (cancelBtn) cancelBtn.addEventListener('click', () => modal.close());

  const submitBtn = dlg.dialog.querySelector('#btn-submit-quota');
  if (submitBtn) {
    submitBtn.addEventListener('click', () => {
      const voiceMinutesLimit = Number(dlg.dialog.querySelector('#aq-voice-limit')?.value) || 100;
      const voiceMinutesUsed = Number(dlg.dialog.querySelector('#aq-voice-used')?.value) || 0;
      const whatsappEventsLimit = Number(dlg.dialog.querySelector('#aq-wa-limit')?.value) || 1000;
      const whatsappEventsUsed = Number(dlg.dialog.querySelector('#aq-wa-used')?.value) || 0;

      store.updateTenant(tenant.id, {
        voiceMinutesLimit,
        voiceMinutesUsed,
        whatsappEventsLimit,
        whatsappEventsUsed
      });

      modal.close();
      toast.success(`Updated resource limits for "${tenant.name}".`);
      router.handleRoute();
    });
  }
}

/**
 * Modal to Manage Tenant Subscription Lifecycle
 */
function openManageSubscriptionModal(tenantId, router) {
  const tenant = store.getTenant(tenantId);
  if (!tenant) return;

  const content = `
    <form id="form-manage-sub" style="display:flex;flex-direction:column;gap:16px;">
      <div class="form-group">
        <label class="form-label">Renewal Date</label>
        <input type="date" id="ms-renewal" class="form-input" value="${tenant.renewalDate || '2026-12-15'}">
      </div>

      <div class="form-group">
        <label class="form-label">Monthly Realized MRR (PKR)</label>
        <input type="number" id="ms-mrr" class="form-input" value="${tenant.mrrPKR || 6999}">
      </div>

      <div class="form-group">
        <label class="form-label">Subscription Lifecycle Stage</label>
        <select id="ms-status" class="form-select">
          <option value="ACTIVE" ${tenant.status === 'ACTIVE' ? 'selected' : ''}>ACTIVE</option>
          <option value="TRIAL" ${tenant.status === 'TRIAL' ? 'selected' : ''}>TRIAL (Evaluation)</option>
          <option value="SUSPENDED" ${tenant.status === 'SUSPENDED' ? 'selected' : ''}>SUSPENDED (Past Due)</option>
        </select>
      </div>
    </form>
  `;

  const footer = `
    <button class="btn btn-secondary btn-sm" id="btn-cancel-ms">Cancel</button>
    <button class="btn btn-primary btn-sm" id="btn-submit-ms">Save Billing Terms</button>
  `;

  const dlg = modal.open({
    title: `Modify Subscription: ${tenant.name}`,
    content,
    footer,
    size: 'sm'
  });

  const cancelBtn = dlg.dialog.querySelector('#btn-cancel-ms');
  if (cancelBtn) cancelBtn.addEventListener('click', () => modal.close());

  const submitBtn = dlg.dialog.querySelector('#btn-submit-ms');
  if (submitBtn) {
    submitBtn.addEventListener('click', () => {
      const renewalDate = dlg.dialog.querySelector('#ms-renewal')?.value;
      const mrrPKR = Number(dlg.dialog.querySelector('#ms-mrr')?.value) || 0;
      const status = dlg.dialog.querySelector('#ms-status')?.value;

      store.updateTenant(tenant.id, {
        renewalDate,
        mrrPKR,
        status
      });

      modal.close();
      toast.success(`Updated billing lifecycle for "${tenant.name}".`);
      router.handleRoute();
    });
  }
}

/**
 * Modal to Inspect and Reply to Support Ticket
 */
function openTicketDialogueModal(ticketId, router) {
  const ticket = store.getSupportTickets().find(t => t.id === ticketId);
  if (!ticket) return;

  const messagesHtml = (ticket.messages || []).map(m => `
    <div style="margin-bottom:12px;padding:12px;border-radius:10px;background:${m.sender.includes('Platform Support') ? 'var(--color-primary-soft)' : 'var(--color-surface-alt)'};">
      <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--color-text-muted);margin-bottom:4px;">
        <strong>${m.sender}</strong>
        <span>${m.time}</span>
      </div>
      <div style="font-size:13px;color:var(--color-text-primary);line-height:1.5;">${m.text}</div>
    </div>
  `).join('');

  const content = `
    <div style="display:flex;flex-direction:column;gap:16px;">
      <div style="background:var(--color-surface-subtle);padding:12px 16px;border-radius:8px;font-size:13px;border-left:3px solid var(--color-primary);">
        <strong>Subject:</strong> ${ticket.subject}<br>
        <span style="font-size:11px;color:var(--color-text-muted);">Tenant: ${ticket.tenantName} (${ticket.tenantId})</span>
      </div>

      <div style="max-height:240px;overflow-y:auto;padding-right:4px;">
        ${messagesHtml}
      </div>

      <form id="form-reply-ticket" style="display:flex;flex-direction:column;gap:12px;border-top:1px solid var(--color-border);padding-top:14px;">
        <div class="form-group">
          <label class="form-label">Operator Reply Message</label>
          <textarea id="tr-reply" class="form-textarea" rows="3" placeholder="Type response to store owner..."></textarea>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
          <div class="form-group">
            <label class="form-label">Update Ticket Status</label>
            <select id="tr-status" class="form-select">
              <option value="Open" ${ticket.status === 'Open' ? 'selected' : ''}>Open</option>
              <option value="In Progress" ${ticket.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
              <option value="Resolved" ${ticket.status === 'Resolved' ? 'selected' : ''}>Resolved</option>
              <option value="Closed" ${ticket.status === 'Closed' ? 'selected' : ''}>Closed</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Severity Level</label>
            <select id="tr-severity" class="form-select">
              <option value="Low" ${ticket.severity === 'Low' ? 'selected' : ''}>Low</option>
              <option value="Normal" ${ticket.severity === 'Normal' ? 'selected' : ''}>Normal</option>
              <option value="High" ${ticket.severity === 'High' ? 'selected' : ''}>High</option>
              <option value="Urgent" ${ticket.severity === 'Urgent' ? 'selected' : ''}>Urgent</option>
            </select>
          </div>
        </div>
      </form>
    </div>
  `;

  const footer = `
    <button class="btn btn-secondary btn-sm" id="btn-cancel-ticket">Close</button>
    <button class="btn btn-primary btn-sm" id="btn-submit-reply">Send Reply & Update Ticket</button>
  `;

  const dlg = modal.open({
    title: `Ticket #${ticket.id}: ${ticket.tenantName}`,
    content,
    footer,
    size: 'lg'
  });

  const cancelBtn = dlg.dialog.querySelector('#btn-cancel-ticket');
  if (cancelBtn) cancelBtn.addEventListener('click', () => modal.close());

  const submitBtn = dlg.dialog.querySelector('#btn-submit-reply');
  if (submitBtn) {
    submitBtn.addEventListener('click', () => {
      const reply = dlg.dialog.querySelector('#tr-reply')?.value.trim();
      const status = dlg.dialog.querySelector('#tr-status')?.value;
      const severity = dlg.dialog.querySelector('#tr-severity')?.value;

      store.replySupportTicket(ticket.id, reply, status, severity);
      modal.close();
      toast.success(`Replied to ticket #${ticket.id}. Status updated to ${status}.`);
      router.handleRoute();
    });
  }
}

/**
 * Modal to Lodge a New Support Ticket
 */
function openCreateTicketModal(router) {
  const tenants = store.getTenants();

  const content = `
    <form id="form-create-ticket" style="display:flex;flex-direction:column;gap:14px;">
      <div class="form-group">
        <label class="form-label">Target Tenant Business *</label>
        <select id="ctk-tenant" class="form-select" required>
          ${tenants.map(t => `<option value="${t.id}">${t.name} (${t.city})</option>`).join('')}
        </select>
      </div>

      <div class="form-group">
        <label class="form-label">Issue Subject *</label>
        <input type="text" id="ctk-subject" class="form-input" placeholder="e.g. FBR STRN verification error on POS checkout" required>
      </div>

      <div class="form-group">
        <label class="form-label">Severity Level</label>
        <select id="ctk-severity" class="form-select">
          <option value="Normal">Normal</option>
          <option value="Low">Low</option>
          <option value="High">High</option>
          <option value="Urgent">Urgent</option>
        </select>
      </div>

      <div class="form-group">
        <label class="form-label">Description / Problem Statement *</label>
        <textarea id="ctk-message" class="form-textarea" rows="3" placeholder="Provide details regarding the customer incident..." required></textarea>
      </div>
    </form>
  `;

  const footer = `
    <button class="btn btn-secondary btn-sm" id="btn-cancel-ctk">Cancel</button>
    <button class="btn btn-primary btn-sm" id="btn-submit-ctk">Lodge Ticket</button>
  `;

  const dlg = modal.open({
    title: 'Lodge Platform Support Ticket',
    content,
    footer,
    size: 'md'
  });

  const cancelBtn = dlg.dialog.querySelector('#btn-cancel-ctk');
  if (cancelBtn) cancelBtn.addEventListener('click', () => modal.close());

  const submitBtn = dlg.dialog.querySelector('#btn-submit-ctk');
  if (submitBtn) {
    submitBtn.addEventListener('click', () => {
      const tenantId = dlg.dialog.querySelector('#ctk-tenant')?.value;
      const subject = dlg.dialog.querySelector('#ctk-subject')?.value.trim();
      const severity = dlg.dialog.querySelector('#ctk-severity')?.value;
      const message = dlg.dialog.querySelector('#ctk-message')?.value.trim();

      if (!subject || !message) {
        toast.warning('Please provide a subject and message.');
        return;
      }

      const tenantObj = tenants.find(t => t.id === tenantId);
      const ticket = store.createSupportTicket({
        tenantId,
        tenantName: tenantObj ? tenantObj.name : 'Retailer Store',
        subject,
        severity,
        sender: 'Platform Operator (Zainab Malik)',
        message
      });

      modal.close();
      toast.success(`Logged support ticket #${ticket.id}.`);
      router.handleRoute();
    });
  }
}
