/**
 * MetriSolution Inventory ERP SaaS - Reports & Administration Views
 */

import { store } from '../../services/store.js';
import { getIcon } from '../../components/icons.js';
import { toast } from '../../components/toast.js';
import { renderLineChart, renderBarChart } from '../../components/charts.js';

export function ReportsOverviewView(params, router) {
  const metrics = store.getDashboardMetrics();

  return {
    html: `
      <div class="erp-page-header">
        <div>
          <div class="erp-breadcrumbs">
            <a href="/app/dashboard" data-nav>Analytics</a>
            <span>/</span>
            <span>Reporting Hub</span>
          </div>
          <h1 class="text-title-2">Operational Analytics & Reports</h1>
          <p class="text-body-sm">Deep-dive into sales trends, inventory valuations, gross profit margins, and branch comparisons.</p>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(300px, 1fr));gap:24px;">
        <div class="card" style="padding:28px;">
          <div style="width:40px;height:40px;border-radius:10px;background:#ECFDF3;color:#027A48;display:flex;align-items:center;justify-content:center;margin-bottom:16px;">
            ${getIcon('dollar-sign', '', 20)}
          </div>
          <h3 class="text-heading" style="margin-bottom:6px;">Sales & Revenue Analysis</h3>
          <p class="text-body-sm" style="margin-bottom:16px;">Gross revenue, daily sales velocity, average order values, and cashier performance.</p>
          <a href="/app/reports/sales" data-nav class="btn btn-primary btn-sm">Open Sales Report</a>
        </div>

        <div class="card" style="padding:28px;">
          <div style="width:40px;height:40px;border-radius:10px;background:var(--color-primary-soft);color:var(--color-primary);display:flex;align-items:center;justify-content:center;margin-bottom:16px;">
            ${getIcon('package', '', 20)}
          </div>
          <h3 class="text-heading" style="margin-bottom:6px;">Inventory Valuation & Aging</h3>
          <p class="text-body-sm" style="margin-bottom:16px;">Total capital locked in inventory, valuation at cost vs retail, and turnover velocity.</p>
          <a href="/app/reports/inventory" data-nav class="btn btn-primary btn-sm">Open Valuation Report</a>
        </div>

        <div class="card" style="padding:28px;">
          <div style="width:40px;height:40px;border-radius:10px;background:#EFF4FF;color:#2878F0;display:flex;align-items:center;justify-content:center;margin-bottom:16px;">
            ${getIcon('building', '', 20)}
          </div>
          <h3 class="text-heading" style="margin-bottom:6px;">Cross-Branch Benchmarks</h3>
          <p class="text-body-sm" style="margin-bottom:16px;">Compare revenue, stock health, and customer footfall between retail branches.</p>
          <a href="/app/reports/branches" data-nav class="btn btn-primary btn-sm">Open Branch Comparison</a>
        </div>
      </div>
    `,
    init: () => {}
  };
}

export function ReportSalesView(params, router) {
  const metrics = store.getDashboardMetrics();
  const invoices = store.getInvoices();

  return {
    html: `
      <div class="erp-page-header">
        <div>
          <div class="erp-breadcrumbs">
            <a href="/app/reports" data-nav>Reports</a>
            <span>/</span>
            <span>Sales</span>
          </div>
          <h1 class="text-title-2">Sales Analytics & Cash Receipts</h1>
        </div>
      </div>

      <div class="card" style="padding:24px;margin-bottom:24px;">
        <h3 class="text-heading" style="margin-bottom:16px;">Revenue Trend</h3>
        ${renderLineChart({
          data: [
            { label: 'Mon', value: 45000 },
            { label: 'Tue', value: 62000 },
            { label: 'Wed', value: 58000 },
            { label: 'Thu', value: 89000 },
            { label: 'Fri', value: 71000 },
            { label: 'Sat', value: 110000 },
            { label: 'Sun', value: metrics.totalRevenue }
          ],
          width: 700,
          height: 220
        })}
      </div>

      <div class="card">
        <div class="card-header">
          <h3 class="text-heading">Recent Verified Sales Invoices</h3>
        </div>
        <div class="table-container" style="border:none;">
          <table class="data-table">
            <thead>
              <tr>
                <th>Invoice</th>
                <th>Customer</th>
                <th>Method</th>
                <th>Subtotal</th>
                <th>Tax</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${invoices.map(inv => `
                <tr>
                  <td><strong>${inv.invoiceNumber}</strong></td>
                  <td>${inv.customerName}</td>
                  <td><span class="badge badge-neutral">${inv.paymentMethod.toUpperCase()}</span></td>
                  <td class="table-num">Rs. ${inv.subtotal.toLocaleString()}</td>
                  <td class="table-num">Rs. ${inv.tax.toLocaleString()}</td>
                  <td class="table-num font-semibold text-primary">Rs. ${inv.total.toLocaleString()}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `,
    init: () => {}
  };
}

export function ReportInventoryView(params, router) {
  const metrics = store.getDashboardMetrics();
  const products = store.getProducts();

  return {
    html: `
      <div class="erp-page-header">
        <div>
          <div class="erp-breadcrumbs">
            <a href="/app/reports" data-nav>Reports</a>
            <span>/</span>
            <span>Inventory</span>
          </div>
          <h1 class="text-title-2">Inventory Valuation & Margin Report</h1>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(220px, 1fr));gap:16px;margin-bottom:24px;">
        <div class="metric-card">
          <span class="metric-label">Valuation at Cost Basis</span>
          <div class="metric-val text-navy">Rs. ${metrics.totalValuationCost.toLocaleString()}</div>
          <div class="text-caption">Actual capital invested in inventory</div>
        </div>

        <div class="metric-card">
          <span class="metric-label">Valuation at Retail Price</span>
          <div class="metric-val text-primary">Rs. ${metrics.totalValuationRetail.toLocaleString()}</div>
          <div class="text-caption">Expected retail gross return</div>
        </div>

        <div class="metric-card">
          <span class="metric-label">Projected Retail Gross Margin</span>
          <div class="metric-val text-success">Rs. ${metrics.potentialProfit.toLocaleString()}</div>
          <div class="text-caption">
            ${metrics.totalValuationRetail > 0 ? Math.round((metrics.potentialProfit / metrics.totalValuationRetail)*100) : 0}% Projected Margin
          </div>
        </div>
      </div>

      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Product & SKU</th>
              <th>Category</th>
              <th>Total Stock</th>
              <th>Cost Price</th>
              <th>Total Cost Basis</th>
              <th>Retail Price</th>
              <th>Total Retail Value</th>
            </tr>
          </thead>
          <tbody>
            ${products.map(p => {
              const stock = store.getProductStock(p.id);
              const costTotal = stock.onHand * p.costPrice;
              const retailTotal = stock.onHand * p.salePrice;
              return `
                <tr>
                  <td><strong>${p.name}</strong><br><span style="font-size:11px;color:#98A2B3;">${p.sku}</span></td>
                  <td>${p.categoryName}</td>
                  <td class="table-num font-semibold">${stock.onHand} pcs</td>
                  <td class="table-num">Rs. ${p.costPrice.toLocaleString()}</td>
                  <td class="table-num font-semibold">Rs. ${costTotal.toLocaleString()}</td>
                  <td class="table-num">Rs. ${p.salePrice.toLocaleString()}</td>
                  <td class="table-num font-semibold text-primary">Rs. ${retailTotal.toLocaleString()}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    `,
    init: () => {}
  };
}

export function ReportBranchesView(params, router) {
  const branches = store.getBranches();

  return {
    html: `
      <div class="erp-page-header">
        <div>
          <div class="erp-breadcrumbs">
            <a href="/app/reports" data-nav>Reports</a>
            <span>/</span>
            <span>Branches</span>
          </div>
          <h1 class="text-title-2">Comparative Branch Analysis</h1>
        </div>
      </div>

      <div style="display:flex;flex-direction:column;gap:20px;">
        ${branches.map(b => {
          const m = store.getDashboardMetrics(b.id);
          return `
            <div class="card" style="padding:24px;">
              <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;">
                <div>
                  <h3 class="text-heading" style="margin:0;">${b.name}</h3>
                  <div class="text-caption">${b.address} • Phone: ${b.phone}</div>
                </div>
                <span class="badge ${b.isMain ? 'badge-primary' : 'badge-neutral'}">
                  ${b.isMain ? 'Central Hub' : 'Retail Outlet'}
                </span>
              </div>

              <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(180px, 1fr));gap:16px;">
                <div style="background:#F9FAFB;padding:12px;border-radius:8px;">
                  <span class="text-caption">Branch Revenue:</span>
                  <div class="tabular-nums font-bold" style="font-size:18px;color:var(--color-navy);margin-top:2px;">
                    Rs. ${m.totalRevenue.toLocaleString()}
                  </div>
                </div>

                <div style="background:#F9FAFB;padding:12px;border-radius:8px;">
                  <span class="text-caption">Inventory Valuation:</span>
                  <div class="tabular-nums font-bold" style="font-size:18px;color:var(--color-primary);margin-top:2px;">
                    Rs. ${m.totalValuationCost.toLocaleString()}
                  </div>
                </div>

                <div style="background:#F9FAFB;padding:12px;border-radius:8px;">
                  <span class="text-caption">Low Stock Items:</span>
                  <div class="tabular-nums font-bold" style="font-size:18px;color:${m.lowStockCount > 0 ? 'var(--color-warning)' : 'var(--color-success)'};margin-top:2px;">
                    ${m.lowStockCount} SKUs
                  </div>
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `,
    init: () => {}
  };
}

export function TeamManagementView(params, router) {
  const users = store.getUsers();

  return {
    html: `
      <div class="erp-page-header">
        <div>
          <div class="erp-breadcrumbs">
            <a href="/app/dashboard" data-nav>Administration</a>
            <span>/</span>
            <span>Team & Roles</span>
          </div>
          <h1 class="text-title-2">Staff Members & RBAC Permissions</h1>
          <p class="text-body-sm">Role-based access boundaries: Cashier masking, Manager approvals, Owner control.</p>
        </div>
      </div>

      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Assigned Role</th>
              <th>Permissions Scope</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${users.map(u => `
              <tr>
                <td><strong>${u.name}</strong></td>
                <td style="font-family:monospace;font-size:12px;color:#666;">${u.email}</td>
                <td>
                  <span class="badge ${u.role === 'OWNER' ? 'badge-primary' : (u.role === 'MANAGER' ? 'badge-info' : 'badge-neutral')}">
                    ${u.role}
                  </span>
                </td>
                <td style="font-size:13px;color:#475467;">
                  ${u.role === 'OWNER' ? 'Full administrative & financial access across all branches' : 
                   (u.role === 'MANAGER' ? 'Branch sales, transfers, discounts & AI draft approvals' : 
                   (u.role === 'SALES' ? 'POS registers & order entry (Cost margins strictly masked)' : 
                   (u.role === 'WAREHOUSE' ? 'Goods receiving, physical cycle counts & transfers' : 'SaaS Fleet Operator')))}
                </td>
                <td><span class="badge badge-success">Active</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `,
    init: () => {}
  };
}

export function SettingsView(params, router) {
  const tenant = store.getState().tenant;

  return {
    html: `
      <div class="erp-page-header">
        <div>
          <div class="erp-breadcrumbs">
            <a href="/app/dashboard" data-nav>Administration</a>
            <span>/</span>
            <span>Business Settings</span>
          </div>
          <h1 class="text-title-2">Business Settings</h1>
        </div>
      </div>

      <div class="card" style="max-width:680px;padding:32px;">
        <form id="settings-biz-form">
          <div class="form-group">
            <label class="form-label">Business Name</label>
            <input type="text" id="set-name" class="form-control" value="${tenant.name}">
          </div>

          <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
            <div class="form-group">
              <label class="form-label">National Tax Number (NTN)</label>
              <input type="text" class="form-control" value="${tenant.ntn || '7294812-4'}">
            </div>
            <div class="form-group">
              <label class="form-label">Sales Tax Registration (STRN)</label>
              <input type="text" class="form-control" value="${tenant.strn || '32-77-8761-901-28'}">
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Official Registered Address</label>
            <textarea class="form-control" rows="2">${tenant.address}</textarea>
          </div>

          <button type="submit" class="btn btn-primary" style="margin-top:16px;">Save Settings</button>
        </form>
      </div>
    `,
    init: () => {
      const form = document.getElementById('settings-biz-form');
      if (form) {
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          store.getState().tenant.name = document.getElementById('set-name').value;
          store.saveState();
          toast.success('Business settings updated successfully.');
        });
      }
    }
  };
}

export function SettingsSecurityView(params, router) {
  return {
    html: `
      <div class="erp-page-header">
        <div>
          <div class="erp-breadcrumbs">
            <a href="/app/settings" data-nav>Settings</a>
            <span>/</span>
            <span>Security</span>
          </div>
          <h1 class="text-title-2">Security & Session Policies</h1>
        </div>
      </div>

      <div class="card" style="max-width:680px;padding:32px;">
        <h3 class="text-heading" style="margin-bottom:16px;">Access Policy Rules</h3>
        <div style="display:flex;flex-direction:column;gap:16px;font-size:14px;color:var(--color-text-secondary);">
          <div>
            <strong>Session Inactivity Timeout:</strong> 8 Hours (Retail counter standard)
          </div>
          <div>
            <strong>Password Enforcement:</strong> Minimum 8 characters with symbol & alphanumeric check.
          </div>
          <div>
            <strong>Cashier Price Masking:</strong> Active (Wholesale costs hidden from SALES persona).
          </div>
        </div>
      </div>
    `,
    init: () => {}
  };
}

export function SettingsNotificationsView(params, router) {
  return {
    html: `
      <div class="erp-page-header">
        <div>
          <div class="erp-breadcrumbs">
            <a href="/app/settings" data-nav>Settings</a>
            <span>/</span>
            <span>Notifications</span>
          </div>
          <h1 class="text-title-2">Notification Preferences</h1>
        </div>
      </div>

      <div class="card" style="max-width:680px;padding:32px;">
        <h3 class="text-heading" style="margin-bottom:16px;">Active Dispatch Channels</h3>
        <div style="display:flex;flex-direction:column;gap:16px;">
          <label style="display:flex;align-items:center;gap:12px;font-size:14px;cursor:pointer;">
            <input type="checkbox" checked style="accent-color:var(--color-primary);width:18px;height:18px;">
            <span>In-App Real-Time Alerts (Low Stock, AI Drafts, Transfers)</span>
          </label>
          <label style="display:flex;align-items:center;gap:12px;font-size:14px;cursor:pointer;">
            <input type="checkbox" checked style="accent-color:var(--color-primary);width:18px;height:18px;">
            <span>Simulated WhatsApp Daily Sales Summary to Owner (+92 300 8291001)</span>
          </label>
        </div>
      </div>
    `,
    init: () => {}
  };
}

export function SettingsIntegrationsView(params, router) {
  return {
    html: `
      <div class="erp-page-header">
        <div>
          <div class="erp-breadcrumbs">
            <a href="/app/settings" data-nav>Settings</a>
            <span>/</span>
            <span>Integrations</span>
          </div>
          <h1 class="text-title-2">Hardware & API Adapters</h1>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(300px, 1fr));gap:20px;">
        <div class="card" style="padding:24px;">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
            <span class="badge badge-success">Simulated Active</span>
            <div style="color:#25D366;">${getIcon('mic', '', 20)}</div>
          </div>
          <h3 class="text-heading" style="margin-bottom:6px;">WhatsApp Cloud API Adapter</h3>
          <p class="text-body-sm">Captures inbound audio notes from registered trade customers for AI order extraction.</p>
        </div>

        <div class="card" style="padding:24px;">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
            <span class="badge badge-success">Browser Native</span>
            <div style="color:var(--color-primary);">${getIcon('printer', '', 20)}</div>
          </div>
          <h3 class="text-heading" style="margin-bottom:6px;">Thermal 80mm Receipt Driver</h3>
          <p class="text-body-sm">Prints directly to any connected USB/Network POS receipt printer without third-party drivers.</p>
        </div>

        <div class="card" style="padding:24px;">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
            <span class="badge badge-success">Plug & Play</span>
            <div style="color:var(--color-primary);">${getIcon('box', '', 20)}</div>
          </div>
          <h3 class="text-heading" style="margin-bottom:6px;">USB Barcode Scanner</h3>
          <p class="text-body-sm">Direct keyboard-wedge barcode reader compatibility with instant SKU lookups.</p>
        </div>
      </div>
    `,
    init: () => {}
  };
}

export function BillingView(params, router) {
  const sub = store.getSubscription();
  const plans = store.getPlans();

  return {
    html: `
      <div class="erp-page-header">
        <div>
          <div class="erp-breadcrumbs">
            <a href="/app/dashboard" data-nav>Administration</a>
            <span>/</span>
            <span>Billing</span>
          </div>
          <h1 class="text-title-2">Subscription & Plan Entitlements</h1>
          <p class="text-body-sm">Manage branch licenses, staff seats, and SaaS billing lifecycle.</p>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:32px;">
        <div class="card" style="padding:28px;border:2px solid var(--color-primary);">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
            <span class="badge badge-primary">${sub.status.toUpperCase()}</span>
            <span class="tabular-nums font-bold" style="font-size:20px;color:var(--color-navy);">Rs. ${sub.priceMonthlyPKR.toLocaleString()} /mo</span>
          </div>
          <h3 class="text-title-3" style="margin-bottom:8px;">${sub.planName}</h3>
          <div style="font-size:13px;color:#666;margin-bottom:20px;">Renews automatically on ${new Date(sub.renewsAt).toLocaleDateString()}</div>

          <div style="font-size:13px;font-weight:600;margin-bottom:10px;">Quota Consumption:</div>
          <div style="display:flex;flex-direction:column;gap:10px;font-size:13px;color:var(--color-text-secondary);">
            <div>
              <div style="display:flex;justify-content:space-between;margin-bottom:2px;">
                <span>Branches:</span>
                <strong>${sub.usage.branchesUsed} of ${sub.branchLimit} used</strong>
              </div>
              <div style="height:6px;background:#E4E7EC;border-radius:4px;overflow:hidden;">
                <div style="width:${(sub.usage.branchesUsed/sub.branchLimit)*100}%;height:100%;background:var(--color-primary);"></div>
              </div>
            </div>

            <div>
              <div style="display:flex;justify-content:space-between;margin-bottom:2px;">
                <span>Staff Seats:</span>
                <strong>${sub.usage.usersUsed} of ${sub.userLimit} used</strong>
              </div>
              <div style="height:6px;background:#E4E7EC;border-radius:4px;overflow:hidden;">
                <div style="width:${(sub.usage.usersUsed/sub.userLimit)*100}%;height:100%;background:var(--color-primary);"></div>
              </div>
            </div>

            <div>
              <div style="display:flex;justify-content:space-between;margin-bottom:2px;">
                <span>WhatsApp AI Minutes:</span>
                <strong>${sub.usage.aiVoiceMinutesUsed} mins used</strong>
              </div>
            </div>
          </div>
        </div>

        <div class="card" style="padding:28px;">
          <h3 class="text-heading" style="margin-bottom:16px;">Change Subscription Tier</h3>
          <div style="display:flex;flex-direction:column;gap:12px;">
            ${plans.filter(p => p.id !== sub.planId && p.priceMonthly).map(p => `
              <div style="display:flex;align-items:center;justify-content:space-between;padding:12px 16px;background:#F9FAFB;border:1px solid #E4E7EC;border-radius:8px;">
                <div>
                  <strong style="color:var(--color-navy);">${p.name}</strong>
                  <div style="font-size:12px;color:#666;">Up to ${p.maxBranches} branches, ${p.maxUsers} users</div>
                </div>
                <button class="btn btn-secondary btn-sm switch-plan-btn" data-planid="${p.id}">
                  Switch to Rs. ${p.priceMonthly.toLocaleString()}/mo
                </button>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `,
    init: () => {
      document.querySelectorAll('.switch-plan-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const planId = btn.dataset.planid;
          store.upgradeSubscription(planId);
          toast.success(`Plan updated to ${planId.toUpperCase()}! Limits upgraded.`);
          router.handleRoute();
        });
      });
    }
  };
}

export function AuditLogView(params, router) {
  return {
    html: `
      <div class="erp-page-header">
        <div>
          <div class="erp-breadcrumbs">
            <a href="/app/dashboard" data-nav>Administration</a>
            <span>/</span>
            <span>Audit Trail</span>
          </div>
          <h1 class="text-title-2">Security & Operational Audit Log</h1>
          <p class="text-body-sm">Immutable log of user logins, price alterations, and inventory ledger updates.</p>
        </div>
      </div>

      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Actor</th>
              <th>Event Category</th>
              <th>Action Description</th>
              <th>IP Address</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="font-size:12px;color:#666;">2026-11-19 14:30:12</td>
              <td>Bilal Ahmed (SALES)</td>
              <td><span class="badge badge-success">SALE_COMMIT</span></td>
              <td>Executed retail POS checkout for INV-2026-0498 (Rs. 11,800)</td>
              <td style="font-family:monospace;font-size:11px;">103.255.4.12</td>
            </tr>
            <tr>
              <td style="font-size:12px;color:#666;">2026-11-19 11:05:40</td>
              <td>Abdul Qadir (OWNER)</td>
              <td><span class="badge badge-info">TRANSFER_DISPATCH</span></td>
              <td>Approved & dispatched transfer TRF-2026-004 to Clifton Store</td>
              <td style="font-family:monospace;font-size:11px;">110.38.12.98</td>
            </tr>
            <tr>
              <td style="font-size:12px;color:#666;">2026-11-19 09:30:00</td>
              <td>Farhan Saeed (WAREHOUSE)</td>
              <td><span class="badge badge-neutral">PO_CREATE</span></td>
              <td>Drafted vendor purchase order PO-2026-0091 to Master Locks</td>
              <td style="font-family:monospace;font-size:11px;">103.255.4.14</td>
            </tr>
          </tbody>
        </table>
      </div>
    `,
    init: () => {}
  };
}
