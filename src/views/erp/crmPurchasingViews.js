/**
 * MetriSolution Inventory ERP SaaS - Customer & Supplier CRM + Purchasing Views
 */

import { store } from '../../services/store.js';
import { getIcon } from '../../components/icons.js';
import { toast } from '../../components/toast.js';

export function CustomersListView(params, router) {
  const customers = store.getCustomers();

  return {
    html: `
      <div class="erp-page-header">
        <div>
          <div class="erp-breadcrumbs">
            <a href="/app/dashboard" data-nav>Directory</a>
            <span>/</span>
            <span>Customers</span>
          </div>
          <h1 class="text-title-2">Customer Accounts</h1>
          <p class="text-body-sm">Retail counter shoppers, wholesale trade partners, and builder credit accounts.</p>
        </div>
      </div>

      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Customer Name</th>
              <th>Category</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Credit Limit</th>
              <th>Balance Due</th>
              <th style="text-align:right;">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${customers.map(c => `
              <tr>
                <td>
                  <a href="/app/customers/${c.id}" data-nav style="font-weight:700;color:var(--color-navy);text-decoration:none;">
                    ${c.name}
                  </a>
                </td>
                <td><span class="badge badge-neutral">${c.type}</span></td>
                <td style="font-size:12px;color:#666;">${c.phone}</td>
                <td style="font-size:12px;color:#475467;">${c.address}</td>
                <td class="table-num">Rs. ${c.creditLimit.toLocaleString()}</td>
                <td class="table-num font-semibold ${c.balanceDue > 0 ? 'text-warning' : 'text-success'}">
                  Rs. ${c.balanceDue.toLocaleString()}
                </td>
                <td style="text-align:right;">
                  <a href="/app/customers/${c.id}" data-nav class="btn btn-ghost btn-sm btn-icon-only">
                    ${getIcon('eye', '', 16)}
                  </a>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `,
    init: () => {}
  };
}

export function CustomerDetailView(params, router) {
  const customer = store.getCustomers().find(c => c.id === params.id) || store.getCustomers()[0];
  const customerOrders = store.getSalesOrders().filter(o => o.customerId === customer.id);

  return {
    html: `
      <div class="erp-page-header">
        <div>
          <div class="erp-breadcrumbs">
            <a href="/app/customers" data-nav>Customers</a>
            <span>/</span>
            <span>${customer.name}</span>
          </div>
          <h1 class="text-title-2">${customer.name}</h1>
          <p class="text-body-sm">${customer.type} • Phone: ${customer.phone}</p>
        </div>

        <a href="/app/customers" data-nav class="btn btn-secondary btn-sm">
          ${getIcon('arrow-right', 'rotate-180', 14)} Back to Customers
        </a>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:24px;">
        <div class="card" style="padding:24px;">
          <h3 class="text-heading" style="margin-bottom:12px;">Account Profile</h3>
          <div style="font-size:13px;line-height:1.8;color:var(--color-text-secondary);">
            <strong>Email:</strong> ${customer.email}<br>
            <strong>Address:</strong> ${customer.address}<br>
            <strong>Total Orders Completed:</strong> ${customer.ordersCount}
          </div>
        </div>

        <div class="card" style="padding:24px;">
          <h3 class="text-heading" style="margin-bottom:12px;">Credit Standing</h3>
          <div style="font-size:13px;line-height:1.8;">
            <strong>Approved Credit Limit:</strong> Rs. ${customer.creditLimit.toLocaleString()}<br>
            <strong>Current Outstanding Balance Due:</strong> <span class="text-warning font-bold">Rs. ${customer.balanceDue.toLocaleString()}</span><br>
            <strong>Available Credit:</strong> Rs. ${(customer.creditLimit - customer.balanceDue).toLocaleString()}
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h3 class="text-heading">Order History</h3>
        </div>
        <div class="table-container" style="border:none;">
          <table class="data-table">
            <thead>
              <tr>
                <th>Order Number</th>
                <th>Date</th>
                <th>Status</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${customerOrders.length > 0 ? customerOrders.map(o => `
                <tr>
                  <td><strong>${o.orderNumber}</strong></td>
                  <td>${new Date(o.createdAt).toLocaleDateString()}</td>
                  <td><span class="badge badge-info">${o.status.toUpperCase()}</span></td>
                  <td class="table-num font-semibold text-primary">Rs. ${o.total.toLocaleString()}</td>
                </tr>
              `).join('') : `
                <tr><td colspan="4" style="text-align:center;padding:24px;color:#98A2B3;">No prior wholesale orders on file.</td></tr>
              `}
            </tbody>
          </table>
        </div>
      </div>
    `,
    init: () => {}
  };
}

export function SuppliersListView(params, router) {
  const suppliers = store.getSuppliers();

  return {
    html: `
      <div class="erp-page-header">
        <div>
          <div class="erp-breadcrumbs">
            <a href="/app/dashboard" data-nav>Purchasing</a>
            <span>/</span>
            <span>Suppliers</span>
          </div>
          <h1 class="text-title-2">Supplier & Vendor Directory</h1>
          <p class="text-body-sm">Manufacturers, importers, and regional distribution mills.</p>
        </div>
      </div>

      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Supplier Name</th>
              <th>City</th>
              <th>Phone</th>
              <th>Categories Supplied</th>
              <th>Cumulative Purchases</th>
            </tr>
          </thead>
          <tbody>
            ${suppliers.map(s => `
              <tr>
                <td><strong>${s.name}</strong><br><span style="font-size:11px;color:#98A2B3;">${s.address}</span></td>
                <td>${s.city}</td>
                <td style="font-size:12px;color:#666;">${s.phone}</td>
                <td><span class="badge badge-neutral">${s.categoriesSupplied}</span></td>
                <td class="table-num font-semibold text-primary">Rs. ${s.totalPurchases.toLocaleString()}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `,
    init: () => {}
  };
}

export function PurchasesListView(params, router) {
  const pos = store.getPurchaseOrders();

  return {
    html: `
      <div class="erp-page-header">
        <div>
          <div class="erp-breadcrumbs">
            <a href="/app/dashboard" data-nav>Purchasing</a>
            <span>/</span>
            <span>Purchase Orders</span>
          </div>
          <h1 class="text-title-2">Purchase Orders</h1>
          <p class="text-body-sm">Vendor procurement orders, shipment ETAs, and goods receiving manifests.</p>
        </div>

        <a href="/app/purchases/new" data-nav class="btn btn-primary btn-sm" style="gap:6px;">
          ${getIcon('plus', '', 14)} Create Purchase Order
        </a>
      </div>

      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>PO Number</th>
              <th>Supplier</th>
              <th>Order Date</th>
              <th>Delivery ETA</th>
              <th>Status</th>
              <th>Total Value</th>
              <th style="text-align:right;">Action</th>
            </tr>
          </thead>
          <tbody>
            ${pos.map(po => `
              <tr>
                <td><strong>${po.poNumber}</strong></td>
                <td><strong>${po.supplierName}</strong></td>
                <td style="font-size:12px;color:#666;">${new Date(po.createdAt).toLocaleDateString()}</td>
                <td style="font-size:12px;">${po.expectedDelivery}</td>
                <td>
                  <span class="badge ${po.status === 'received' ? 'badge-success' : 'badge-warning'}">
                    ${po.status.toUpperCase()}
                  </span>
                </td>
                <td class="table-num font-semibold text-primary">Rs. ${po.total.toLocaleString()}</td>
                <td style="text-align:right;">
                  <a href="/app/stock/receiving" data-nav class="btn btn-secondary btn-sm">
                    ${getIcon('download', '', 12)} Receive
                  </a>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `,
    init: () => {}
  };
}

export function PurchaseNewView(params, router) {
  const suppliers = store.getSuppliers();
  const products = store.getProducts();

  return {
    html: `
      <div class="erp-page-header">
        <div>
          <div class="erp-breadcrumbs">
            <a href="/app/purchases" data-nav>Purchases</a>
            <span>/</span>
            <span>New PO</span>
          </div>
          <h1 class="text-title-2">Draft Purchase Order</h1>
          <p class="text-body-sm">Order inventory from verified suppliers with estimated shipment arrival.</p>
        </div>
      </div>

      <div class="card" style="max-width:760px;padding:32px;">
        <form id="new-po-form">
          <div class="form-group">
            <label class="form-label" for="po-supplier">Supplier <span class="required-star">*</span></label>
            <select id="po-supplier" class="form-control" required>
              ${suppliers.map(s => `<option value="${s.id}">${s.name} (${s.city})</option>`).join('')}
            </select>
          </div>

          <div style="display:grid;grid-template-columns:1.5fr 1fr;gap:16px;">
            <div class="form-group">
              <label class="form-label" for="po-prod">Product to Order <span class="required-star">*</span></label>
              <select id="po-prod" class="form-control" required>
                ${products.map(p => `<option value="${p.id}">${p.name} (${p.sku})</option>`).join('')}
              </select>
            </div>
            <div class="form-group">
              <label class="form-label" for="po-qty">Quantity (Boxes / Master Cartons) <span class="required-star">*</span></label>
              <input type="number" id="po-qty" class="form-control" value="10" min="1" required>
            </div>
          </div>

          <button type="submit" class="btn btn-primary btn-lg" style="margin-top:16px;">
            Transmit Purchase Order Simulation
          </button>
        </form>
      </div>
    `,
    init: () => {
      const form = document.getElementById('new-po-form');
      if (form) {
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          const suppId = document.getElementById('po-supplier').value;
          const prodId = document.getElementById('po-prod').value;
          const qty = parseInt(document.getElementById('po-qty').value, 10);

          const supplier = store.getSuppliers().find(s => s.id === suppId);
          const product = store.getProduct(prodId);
          const pieces = qty * (product.boxRatio || 1);
          const total = pieces * product.costPrice;

          const po = {
            id: `po_${Date.now()}`,
            poNumber: `PO-${new Date().getFullYear()}-${String(store.getPurchaseOrders().length + 92).padStart(4, '0')}`,
            supplierId: supplier.id,
            supplierName: supplier.name,
            branchId: 'branch_main',
            status: 'ordered',
            items: [
              {
                productId: product.id,
                productName: product.name,
                sku: product.sku,
                quantity: pieces,
                unit: product.unitOfMeasure,
                unitCost: product.costPrice,
                lineTotal: total
              }
            ],
            total,
            expectedDelivery: new Date(Date.now() + 5*24*60*60*1000).toISOString().slice(0,10),
            createdAt: new Date().toISOString()
          };

          store.getPurchaseOrders().unshift(po);
          store.saveState();
          toast.success(`Purchase Order ${po.poNumber} created! Ready in Goods Receiving.`);
          router.navigate('/app/stock/receiving');
        });
      }
    }
  };
}
