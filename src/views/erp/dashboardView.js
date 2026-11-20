/**
 * MetriSolution Inventory ERP SaaS - Modernized Executive Retail Dashboard View
 * High-density Linear/Stripe-grade analytics, micro-trends, time-filter pills & fast operational links.
 */

import { store } from '../../services/store.js';
import { getIcon } from '../../components/icons.js';
import { renderLineChart, renderBarChart } from '../../components/charts.js';

export function DashboardView(params, router) {
  const activeBranchId = store.getActiveBranchId();
  const metrics = store.getDashboardMetrics();
  const currentUser = store.getCurrentUser();
  const isSales = currentUser.role === 'SALES';

  const recentMovements = store.getStockMovements().slice(0, 6);
  const pendingAiDrafts = store.getAiDrafts().filter(d => d.status === 'pending_review');

  // Trend data fixtures for sales chart
  const salesTrend = [
    { label: 'Nov 13', value: 48500 },
    { label: 'Nov 14', value: 62000 },
    { label: 'Nov 15', value: 54000 },
    { label: 'Nov 16', value: 89000 },
    { label: 'Nov 17', value: 71500 },
    { label: 'Nov 18', value: 94000 },
    { label: 'Nov 19', value: metrics.totalRevenue > 0 ? metrics.totalRevenue : 82000 }
  ];

  const branchComp = [
    { label: 'Karachi Main', value: 185000 },
    { label: 'Clifton Store', value: 124000 },
    { label: 'Nazimabad Depot', value: 92000 }
  ];

  return {
    html: `
      <!-- Page Header with Context, Time-Range Selector & Quick Actions -->
      <div class="erp-page-header">
        <div>
          <div class="erp-breadcrumbs">
            <span>Metro Hardware Traders</span>
            <span>/</span>
            <span>Operations Dashboard</span>
          </div>
          <h1 class="text-title-2">Operations Dashboard</h1>
          <p class="text-body-sm" style="margin-top:2px;">
            Live operational status across ${activeBranchId === 'all' ? 'All 3 Branches (Consolidated)' : 'selected branch'}.
          </p>
        </div>

        <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;">
          <!-- Time-Range Pills -->
          <div class="tab-pill-group" style="background:#FFFFFF;border:1px solid var(--color-border);padding:2px;border-radius:8px;">
            <button class="tab-pill active" style="padding:4px 10px;font-size:12px;">7 Days</button>
            <button class="tab-pill" style="padding:4px 10px;font-size:12px;">30 Days</button>
            <button class="tab-pill" style="padding:4px 10px;font-size:12px;">This Month</button>
          </div>

          <a href="/app/pos" data-nav class="btn btn-primary" style="gap:6px;">
            ${getIcon('shopping-cart', '', 16)}
            <span>Open POS Terminal</span>
          </a>
          ${!isSales ? `
            <a href="/app/stock/receiving" data-nav class="btn btn-secondary btn-sm" style="gap:6px;">
              ${getIcon('download', '', 14)}
              <span>Receive Goods</span>
            </a>
            <a href="/app/stock/transfers" data-nav class="btn btn-secondary btn-sm" style="gap:6px;">
              ${getIcon('truck', '', 14)}
              <span>Transfer Stock</span>
            </a>
          ` : ''}
        </div>
      </div>

      <!-- Pending AI Drafts Attention Banner -->
      ${pendingAiDrafts.length > 0 && !isSales ? `
        <div class="card" style="padding:16px 20px;background:linear-gradient(135deg, #FAF8FF 0%, #FFFFFF 100%);border:1px solid #D6BBFB;margin-bottom:24px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;box-shadow:0 2px 8px rgba(105, 65, 198, 0.06);">
          <div style="display:flex;align-items:center;gap:12px;">
            <div style="width:38px;height:38px;border-radius:50%;background:linear-gradient(135deg, #25D366 0%, #128C7E 100%);color:#FFF;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 6px rgba(37, 211, 102, 0.3);">
              ${getIcon('mic', '', 18)}
            </div>
            <div>
              <div style="font-weight:700;font-size:14px;color:var(--color-navy);display:flex;align-items:center;gap:8px;">
                <span>WhatsApp Voice Order Draft Pending Authorization</span>
                <span class="badge badge-warning" style="font-size:11px;">Action Required</span>
              </div>
              <div style="font-size:13px;color:var(--color-text-secondary);margin-top:2px;">
                Areeb Traders (Clifton) sent a voice note: <em>"Abdul Qadir, meri shop par door lock ke 25 boxes bhejwa do."</em>
              </div>
            </div>
          </div>
          <a href="/app/voice-inbox" data-nav class="btn btn-primary btn-sm" style="box-shadow:0 2px 6px rgba(105, 65, 198, 0.3);">
            Listen & Review Draft
            ${getIcon('arrow-right', '', 14)}
          </a>
        </div>
      ` : ''}

      <!-- KPI Metrics Grid -->
      <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(220px, 1fr));gap:16px;margin-bottom:24px;">
        <div class="metric-card">
          <div class="metric-card-top">
            <span class="metric-label">Completed Sales Revenue</span>
            <div class="metric-icon-box" style="background:#ECFDF3;color:#027A48;">
              ${getIcon('dollar-sign', '', 18)}
            </div>
          </div>
          <div class="metric-val text-navy">
            Rs. ${metrics.totalRevenue.toLocaleString()}
          </div>
          <div class="metric-change" style="color:#027A48;margin-top:4px;">
            <span class="badge badge-success" style="font-size:11px;padding:2px 6px;">+14.8%</span>
            <span style="font-size:12px;color:var(--color-text-secondary);">${metrics.totalOrdersCount} verified transactions</span>
          </div>
        </div>

        ${!isSales ? `
          <div class="metric-card">
            <div class="metric-card-top">
              <span class="metric-label">Inventory Valuation (Cost)</span>
              <div class="metric-icon-box" style="background:var(--color-primary-soft);color:var(--color-primary);">
                ${getIcon('layers', '', 18)}
              </div>
            </div>
            <div class="metric-val text-primary">
              Rs. ${metrics.totalValuationCost.toLocaleString()}
            </div>
            <div class="text-caption" style="color:#475467;margin-top:4px;">
              Retail value: <strong>Rs. ${metrics.totalValuationRetail.toLocaleString()}</strong>
            </div>
          </div>
        ` : ''}

        <div class="metric-card">
          <div class="metric-card-top">
            <span class="metric-label">Low Stock Alerts</span>
            <div class="metric-icon-box" style="background:#FFFAEB;color:#B54708;">
              ${getIcon('alert-triangle', '', 18)}
            </div>
          </div>
          <div class="metric-val text-warning">
            ${metrics.lowStockCount} SKUs
          </div>
          <div class="text-caption" style="color:#B54708;margin-top:4px;font-weight:500;">
            ${metrics.lowStockCount > 0 ? 'Requires vendor purchase order' : 'All items optimal'}
          </div>
        </div>

        <div class="metric-card">
          <div class="metric-card-top">
            <span class="metric-label">On-Hand Total Stock</span>
            <div class="metric-icon-box" style="background:#EFF4FF;color:#2878F0;">
              ${getIcon('package', '', 18)}
            </div>
          </div>
          <div class="metric-val text-navy">
            ${metrics.totalStockPieces.toLocaleString()} Pcs
          </div>
          <div class="text-caption" style="color:#475467;margin-top:4px;">
            ${metrics.activeSkusCount} active catalog SKUs across branches
          </div>
        </div>
      </div>

      <!-- Charts Row -->
      <div style="display:grid;grid-template-columns:1.6fr 1fr;gap:20px;margin-bottom:24px;">
        <div class="card" style="padding:22px;">
          <div class="card-header" style="padding:0 0 16px 0;">
            <div>
              <h3 class="text-heading">Weekly Sales Velocity (PKR)</h3>
              <div class="text-caption">Daily sales volume across all active retail counters</div>
            </div>
            <span class="badge badge-success">
              <span class="badge-dot badge-pulse" style="background:#12B76A;"></span>
              Live Data
            </span>
          </div>
          <div style="padding-top:12px;">
            ${renderLineChart({ data: salesTrend, width: 620, height: 210 })}
          </div>
        </div>

        <div class="card" style="padding:22px;">
          <div class="card-header" style="padding:0 0 16px 0;">
            <div>
              <h3 class="text-heading">Branch Revenue Share</h3>
              <div class="text-caption">Comparative branch volume</div>
            </div>
            <span class="badge badge-neutral">3 Branches</span>
          </div>
          <div style="padding-top:12px;">
            ${renderBarChart({ data: branchComp, width: 380, height: 210 })}
          </div>
        </div>
      </div>

      <!-- Recent Stock Ledger Movements Table -->
      <div class="card">
        <div class="card-header">
          <div>
            <h3 class="text-heading">Recent Stock Ledger Movements</h3>
            <div class="text-caption">Immutable audit trail of sales deductions, transfers, and receiving increments</div>
          </div>
          <a href="/app/stock/ledger" data-nav class="btn btn-ghost btn-sm" style="font-size:12px;">
            View Full Ledger ${getIcon('arrow-right', '', 12)}
          </a>
        </div>

        <div class="table-container" style="border:none;border-radius:0;">
          <table class="data-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Type</th>
                <th>Product & SKU</th>
                <th>Branch</th>
                <th>Quantity</th>
                <th>Balance After</th>
                <th>Reference / Reason</th>
                <th>Actor</th>
              </tr>
            </thead>
            <tbody>
              ${recentMovements.map(m => `
                <tr>
                  <td style="color:#666;font-size:12px;white-space:nowrap;font-family:var(--font-family-mono);">
                    ${new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td>
                    <span class="badge ${m.type === 'IN' ? 'badge-success' : (m.type === 'OUT' ? 'badge-danger' : 'badge-info')}">
                      ${m.type}
                    </span>
                  </td>
                  <td>
                    <strong>${m.productName}</strong><br>
                    <span style="font-size:11px;color:#98A2B3;font-family:var(--font-family-mono);">${m.sku}</span>
                  </td>
                  <td style="font-size:13px;">${m.branchName}</td>
                  <td class="table-num font-semibold ${m.quantity < 0 ? 'text-danger' : 'text-success'}">
                    ${m.quantity > 0 ? '+' : ''}${m.quantity} ${m.unit}
                  </td>
                  <td class="table-num font-semibold">${m.newBalance} pcs</td>
                  <td style="font-size:12px;color:#475467;">
                    <strong>${m.referenceId || 'Manual'}</strong> • ${m.reason}
                  </td>
                  <td style="font-size:12px;color:#666;">
                    ${m.actorName} (${m.actorRole})
                  </td>
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
