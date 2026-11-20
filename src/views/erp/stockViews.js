/**
 * MetriSolution Inventory ERP SaaS - Stock Ledger, Receiving, Transfers & Counts Views
 */

import { store } from '../../services/store.js';
import { getIcon } from '../../components/icons.js';
import { toast } from '../../components/toast.js';
import { modal } from '../../components/modal.js';
import { exportToCsv } from '../../services/exportService.js';

export function StockLedgerView(params, router) {
  const activeBranchId = store.getActiveBranchId();
  let selectedType = 'all';

  function renderMovements() {
    const movements = store.getStockMovements({
      branchId: activeBranchId,
      type: selectedType === 'all' ? null : selectedType
    });

    if (movements.length === 0) {
      return `<tr><td colspan="8" style="text-align:center;padding:48px;color:#98A2B3;">No stock movements match the filter.</td></tr>`;
    }

    return movements.map(m => `
      <tr>
        <td style="font-size:12px;color:#666;white-space:nowrap;">
          ${new Date(m.timestamp).toLocaleDateString()} ${new Date(m.timestamp).toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' })}
        </td>
        <td>
          <span class="badge ${m.type === 'IN' ? 'badge-success' : (m.type === 'OUT' ? 'badge-danger' : (m.type === 'TRANSFER' ? 'badge-info' : 'badge-warning'))}">
            ${m.type}
          </span>
        </td>
        <td>
          <strong>${m.productName}</strong><br>
          <span style="font-size:11px;color:#98A2B3;font-family:monospace;">${m.sku}</span>
        </td>
        <td>${m.branchName}</td>
        <td class="table-num font-semibold ${m.quantity < 0 ? 'text-danger' : 'text-success'}">
          ${m.quantity > 0 ? '+' : ''}${m.quantity} ${m.unit}
        </td>
        <td class="table-num text-muted font-semibold">${m.previousBalance} pcs</td>
        <td class="table-num font-bold text-navy">${m.newBalance} pcs</td>
        <td style="font-size:12px;color:#475467;">
          <strong>${m.referenceId || 'Manual'}</strong> • ${m.reason}
        </td>
      </tr>
    `).join('');
  }

  return {
    html: `
      <div class="erp-page-header">
        <div>
          <div class="erp-breadcrumbs">
            <a href="/app/dashboard" data-nav>Inventory</a>
            <span>/</span>
            <span>Stock Ledger</span>
          </div>
          <h1 class="text-title-2">Stock Transaction Ledger</h1>
          <p class="text-body-sm">Immutable chronological audit trail of all physical and reserved stock alterations.</p>
        </div>

        <button id="export-ledger-csv-btn" class="btn btn-secondary btn-sm" style="gap:6px;">
          ${getIcon('download', '', 14)} Export Ledger CSV
        </button>
      </div>

      <div class="card" style="padding:16px;margin-bottom:20px;">
        <div style="display:flex;align-items:center;gap:12px;overflow-x:auto;">
          <span class="text-caption">Filter Type:</span>
          <button class="tab-pill ledger-type-btn ${selectedType === 'all' ? 'active' : ''}" data-type="all">All Movements</button>
          <button class="tab-pill ledger-type-btn" data-type="IN">IN (Receiving)</button>
          <button class="tab-pill ledger-type-btn" data-type="OUT">OUT (Sales / POS)</button>
          <button class="tab-pill ledger-type-btn" data-type="TRANSFER">Transfers</button>
          <button class="tab-pill ledger-type-btn" data-type="ADJUSTMENT">Adjustments</button>
        </div>
      </div>

      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Movement Type</th>
              <th>Product & SKU</th>
              <th>Branch</th>
              <th>Quantity Altered</th>
              <th>Prev Balance</th>
              <th>New Balance</th>
              <th>Reference & Reason</th>
            </tr>
          </thead>
          <tbody id="ledger-table-tbody">
            ${renderMovements()}
          </tbody>
        </table>
      </div>
    `,
    init: () => {
      const tbody = document.getElementById('ledger-table-tbody');
      const exportBtn = document.getElementById('export-ledger-csv-btn');

      document.querySelectorAll('.ledger-type-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          document.querySelectorAll('.ledger-type-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          selectedType = btn.dataset.type;
          tbody.innerHTML = renderMovements();
        });
      });

      if (exportBtn) {
        exportBtn.addEventListener('click', () => {
          const movements = store.getStockMovements();
          const headers = [
            { label: 'Timestamp', accessor: 'timestamp' },
            { label: 'Type', accessor: 'type' },
            { label: 'Product Name', accessor: 'productName' },
            { label: 'SKU', accessor: 'sku' },
            { label: 'Branch', accessor: 'branchName' },
            { label: 'Quantity', accessor: 'quantity' },
            { label: 'Unit', accessor: 'unit' },
            { label: 'Previous Balance', accessor: 'previousBalance' },
            { label: 'New Balance', accessor: 'newBalance' },
            { label: 'Reference ID', accessor: 'referenceId' },
            { label: 'Reason', accessor: 'reason' },
            { label: 'Actor', accessor: 'actorName' }
          ];
          exportToCsv('metrisolution_stock_ledger', headers, movements);
          toast.success('Stock ledger exported to CSV with formula injection protection.');
        });
      }
    }
  };
}

export function StockReceivingView(params, router) {
  const purchaseOrders = store.getPurchaseOrders();

  return {
    html: `
      <div class="erp-page-header">
        <div>
          <div class="erp-breadcrumbs">
            <a href="/app/dashboard" data-nav>Inventory</a>
            <span>/</span>
            <span>Receiving Dock</span>
          </div>
          <h1 class="text-title-2">Goods Receiving from Suppliers</h1>
          <p class="text-body-sm">Verify vendor deliveries, match quantities against purchase orders, and increment physical stock balances.</p>
        </div>
      </div>

      <div style="display:flex;flex-direction:column;gap:20px;">
        ${purchaseOrders.map(po => `
          <div class="card" style="padding:24px;">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;flex-wrap:wrap;gap:10px;">
              <div>
                <span class="badge ${po.status === 'received' ? 'badge-success' : 'badge-warning'}">${po.status.toUpperCase()}</span>
                <h3 class="text-heading" style="margin-top:4px;">PO Number: ${po.poNumber}</h3>
                <div style="font-size:13px;color:var(--color-text-secondary);">Supplier: <strong>${po.supplierName}</strong></div>
              </div>
              <div style="text-align:right;">
                <div class="tabular-nums font-bold" style="font-size:16px;">Rs. ${po.total.toLocaleString()}</div>
                <div class="text-caption">Delivery Expected: ${po.expectedDelivery}</div>
              </div>
            </div>

            <div class="table-container" style="margin-bottom:16px;">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Item Ordered</th>
                    <th>Ordered Qty</th>
                    <th>Unit Cost</th>
                    <th>Line Total</th>
                    <th>Physical Receipt Status</th>
                  </tr>
                </thead>
                <tbody>
                  ${po.items.map(i => `
                    <tr>
                      <td><strong>${i.productName}</strong> (${i.sku})</td>
                      <td class="table-num font-semibold">${i.quantity} pieces</td>
                      <td class="table-num">Rs. ${i.unitCost.toLocaleString()}</td>
                      <td class="table-num">Rs. ${i.lineTotal.toLocaleString()}</td>
                      <td>
                        <span class="badge ${po.status === 'received' ? 'badge-success' : 'badge-neutral'}">
                          ${po.status === 'received' ? 'Verified & In Stock' : 'Awaiting Delivery'}
                        </span>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>

            ${po.status !== 'received' ? `
              <div style="display:flex;justify-content:flex-end;">
                <button class="btn btn-primary receive-po-btn" data-poid="${po.id}">
                  ${getIcon('download', '', 14)} Confirm Full Physical Receipt & Update Stock
                </button>
              </div>
            ` : `
              <div class="text-caption" style="color:#027A48;text-align:right;">
                ${getIcon('check-circle-2', '', 12)} Inventory incremented in Karachi Central Hub.
              </div>
            `}
          </div>
        `).join('')}
      </div>
    `,
    init: () => {
      document.querySelectorAll('.receive-po-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const poId = btn.dataset.poid;
          const po = store.getPurchaseOrders().find(p => p.id === poId);
          if (po) {
            po.items.forEach(i => {
              store.createStockMovement({
                productId: i.productId,
                branchId: po.branchId || 'branch_main',
                type: 'IN',
                quantity: i.quantity,
                unit: i.unit || 'piece',
                referenceId: po.poNumber,
                reason: `Goods Receiving from ${po.supplierName}`
              });
            });
            po.status = 'received';
            store.saveState();
            toast.success(`Received ${po.poNumber}! Stock successfully credited to ledger.`);
            router.handleRoute();
          }
        });
      });
    }
  };
}

export function StockTransfersView(params, router) {
  const transfers = store.getStockTransfers();

  return {
    html: `
      <div class="erp-page-header">
        <div>
          <div class="erp-breadcrumbs">
            <a href="/app/dashboard" data-nav>Inventory</a>
            <span>/</span>
            <span>Inter-Branch Transfers</span>
          </div>
          <h1 class="text-title-2">Branch Stock Transfers</h1>
          <p class="text-body-sm">Track shipments between Central Hub and retail outlets: Request → In-Transit → Physical Receipt.</p>
        </div>
      </div>

      <div style="display:flex;flex-direction:column;gap:20px;">
        ${transfers.map(t => `
          <div class="card" style="padding:24px;">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;flex-wrap:wrap;gap:10px;">
              <div>
                <span class="badge ${t.status === 'received' ? 'badge-success' : 'badge-warning'}">
                  ${t.status === 'in_transit' ? 'In Transit Between Branches' : t.status.toUpperCase()}
                </span>
                <h3 class="text-heading" style="margin-top:6px;">Transfer No: ${t.transferNo}</h3>
                <div style="font-size:13px;color:#475467;margin-top:2px;">
                  From: <strong>${t.sourceBranchName}</strong> → Destination: <strong>${t.destinationBranchName}</strong>
                </div>
              </div>

              ${t.status === 'in_transit' ? `
                <button class="btn btn-primary receive-transfer-btn" data-tid="${t.id}">
                  ${getIcon('check', '', 14)} Confirm Receipt at ${t.destinationBranchName}
                </button>
              ` : `
                <span class="badge badge-success">Completed & Reconciled</span>
              `}
            </div>

            <div class="table-container">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Product & SKU</th>
                    <th>Requested Qty</th>
                    <th>Dispatched Qty</th>
                    <th>Received Qty</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  ${t.items.map(item => `
                    <tr>
                      <td><strong>${item.productName}</strong> (${item.sku})</td>
                      <td class="table-num font-semibold">${item.requestedQty} ${item.unit}s</td>
                      <td class="table-num font-semibold text-primary">${item.dispatchedQty} ${item.unit}s</td>
                      <td class="table-num font-semibold ${item.receivedQty > 0 ? 'text-success' : 'text-muted'}">
                        ${item.receivedQty > 0 ? `${item.receivedQty} ${item.unit}s` : '0 (Pending)'}
                      </td>
                      <td>
                        <span class="badge ${t.status === 'received' ? 'badge-success' : 'badge-warning'}">
                          ${t.status === 'received' ? 'Verified on Shelf' : 'On Delivery Truck'}
                        </span>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>

            <div style="font-size:12px;color:#666;margin-top:12px;">
              Notes: ${t.notes || 'Routine branch restock'} • Dispatched: ${t.dispatchedAt ? new Date(t.dispatchedAt).toLocaleString() : 'Recent'}
            </div>
          </div>
        `).join('')}
      </div>
    `,
    init: () => {
      document.querySelectorAll('.receive-transfer-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const tid = btn.dataset.tid;
          try {
            store.receiveTransfer(tid);
            toast.success('Stock transfer marked received! Destination branch inventory incremented.');
            router.handleRoute();
          } catch (err) {
            toast.error(err.message);
          }
        });
      });
    }
  };
}

export function StockCountsView(params, router) {
  const counts = store.getStockCounts();

  return {
    html: `
      <div class="erp-page-header">
        <div>
          <div class="erp-breadcrumbs">
            <a href="/app/dashboard" data-nav>Inventory</a>
            <span>/</span>
            <span>Cycle Counts</span>
          </div>
          <h1 class="text-title-2">Physical Stock Count Sessions</h1>
          <p class="text-body-sm">Compare expected ledger stock against physical shelf counts and reconcile inventory variances.</p>
        </div>
      </div>

      <div style="display:flex;flex-direction:column;gap:20px;">
        ${counts.map(cnt => `
          <div class="card" style="padding:24px;">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;">
              <div>
                <span class="badge badge-success">Completed & Reconciled</span>
                <h3 class="text-heading" style="margin-top:4px;">Session: ${cnt.sessionNo}</h3>
                <div class="text-caption">Karachi Main Distribution Hub</div>
              </div>
            </div>

            <div class="table-container">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Product & SKU</th>
                    <th>Expected System On-Hand</th>
                    <th>Physical Counted</th>
                    <th>Variance</th>
                    <th>Variance Value (PKR)</th>
                    <th>Reason / Action</th>
                  </tr>
                </thead>
                <tbody>
                  ${cnt.items.map(item => `
                    <tr>
                      <td><strong>${item.productName}</strong><br><span style="font-size:11px;color:#98A2B3;">${item.sku}</span></td>
                      <td class="table-num">${item.expectedOnHand} pcs</td>
                      <td class="table-num font-bold">${item.physicalCounted} pcs</td>
                      <td class="table-num font-bold ${item.variance < 0 ? 'text-danger' : (item.variance > 0 ? 'text-success' : '')}">
                        ${item.variance > 0 ? '+' : ''}${item.variance} pcs
                      </td>
                      <td class="table-num font-semibold ${item.varianceValuePKR < 0 ? 'text-danger' : ''}">
                        Rs. ${item.varianceValuePKR.toLocaleString()}
                      </td>
                      <td style="font-size:12px;color:#475467;">
                        ${item.reconciliationReason || 'Reconciled'}
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        `).join('')}
      </div>
    `,
    init: () => {}
  };
}

export function StockAdjustmentsView(params, router) {
  const products = store.getProducts();

  return {
    html: `
      <div class="erp-page-header">
        <div>
          <div class="erp-breadcrumbs">
            <a href="/app/dashboard" data-nav>Inventory</a>
            <span>/</span>
            <span>Adjustments</span>
          </div>
          <h1 class="text-title-2">Manual Stock Adjustments</h1>
          <p class="text-body-sm">Authorize write-offs for damaged goods, transit breakage, or unrecorded physical discovery.</p>
        </div>
      </div>

      <div class="card" style="max-width:680px;padding:32px;">
        <form id="stock-adjustment-form">
          <div class="form-group">
            <label class="form-label" for="adj-product">Select Product <span class="required-star">*</span></label>
            <select id="adj-product" class="form-control" required>
              ${products.map(p => `<option value="${p.id}">${p.name} (${p.sku})</option>`).join('')}
            </select>
          </div>

          <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
            <div class="form-group">
              <label class="form-label" for="adj-qty">Adjustment Delta (Quantity) <span class="required-star">*</span></label>
              <input type="number" id="adj-qty" class="form-control" placeholder="-2 or +5" required>
              <span class="text-caption">Negative for breakage/loss, positive for found items</span>
            </div>
            <div class="form-group">
              <label class="form-label" for="adj-reason">Reason Code <span class="required-star">*</span></label>
              <select id="adj-reason" class="form-control">
                <option value="Damaged in showroom display">Damaged in showroom display</option>
                <option value="Packaging torn during transit">Packaging torn during transit</option>
                <option value="Cycle count variance correction">Cycle count variance correction</option>
                <option value="Warranty return write-off">Warranty return write-off</option>
              </select>
            </div>
          </div>

          <button type="submit" class="btn btn-primary" style="margin-top:16px;">
            Commit Stock Ledger Adjustment
          </button>
        </form>
      </div>
    `,
    init: () => {
      const form = document.getElementById('stock-adjustment-form');
      if (form) {
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          const prodId = document.getElementById('adj-product').value;
          const qty = parseInt(document.getElementById('adj-qty').value, 10);
          const reason = document.getElementById('adj-reason').value;

          if (isNaN(qty) || qty === 0) {
            toast.error('Please enter a valid non-zero adjustment quantity.');
            return;
          }

          try {
            store.createStockMovement({
              productId: prodId,
              branchId: 'branch_main',
              type: 'ADJUSTMENT',
              quantity: qty,
              unit: 'piece',
              referenceId: `ADJ-${Date.now().toString().slice(-4)}`,
              reason
            });
            toast.success(`Stock adjustment of ${qty > 0 ? '+' : ''}${qty} pieces committed to ledger.`);
            router.navigate('/app/stock/ledger');
          } catch (err) {
            toast.error(err.message);
          }
        });
      }
    }
  };
}

export function LocationsView(params, router) {
  const warehouses = store.getState().warehouses || [];

  return {
    html: `
      <div class="erp-page-header">
        <div>
          <div class="erp-breadcrumbs">
            <a href="/app/dashboard" data-nav>Inventory</a>
            <span>/</span>
            <span>Locations</span>
          </div>
          <h1 class="text-title-2">Storage Hierarchy & Bins</h1>
          <p class="text-body-sm">Branch → Warehouse → Zone → Rack → Shelf structural organization.</p>
        </div>
      </div>

      <div style="display:flex;flex-direction:column;gap:24px;">
        ${warehouses.map(wh => `
          <div class="card" style="padding:24px;">
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:16px;">
              <div style="width:36px;height:36px;border-radius:8px;background:var(--color-primary-soft);color:var(--color-primary);display:flex;align-items:center;justify-content:center;">
                ${getIcon('map-pin', '', 18)}
              </div>
              <div>
                <h3 class="text-heading" style="margin:0;">${wh.name}</h3>
                <div class="text-caption">Karachi Main Facility</div>
              </div>
            </div>

            <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(280px, 1fr));gap:16px;">
              ${wh.zones.map(z => `
                <div style="background:#F9FAFB;border:1px solid #E4E7EC;border-radius:8px;padding:16px;">
                  <strong style="color:var(--color-navy);font-size:14px;">${z.name}</strong>
                  <ul style="list-style:none;margin-top:10px;display:flex;flex-direction:column;gap:6px;font-size:12px;color:#475467;">
                    ${z.racks.map(r => `
                      <li>
                        <strong>${r.name}:</strong> ${r.shelves.join(', ')}
                      </li>
                    `).join('')}
                  </ul>
                </div>
              `).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    `,
    init: () => {}
  };
}
