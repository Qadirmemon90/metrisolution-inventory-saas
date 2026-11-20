/**
 * MetriSolution Inventory ERP SaaS - Orders, Quotations, Invoices & Returns Views
 */

import { store } from '../../services/store.js';
import { getIcon } from '../../components/icons.js';
import { toast } from '../../components/toast.js';
import { modal } from '../../components/modal.js';
import { renderInvoiceHtml } from '../../components/invoiceTemplate.js';

export function OrdersListView(params, router) {
  const orders = store.getSalesOrders();

  return {
    html: `
      <div class="erp-page-header">
        <div>
          <div class="erp-breadcrumbs">
            <a href="/app/dashboard" data-nav>Sales</a>
            <span>/</span>
            <span>Orders Pipeline</span>
          </div>
          <h1 class="text-title-2">Sales Orders</h1>
          <p class="text-body-sm">Track wholesale orders, stock reservations, fulfillment dispatch, and invoices.</p>
        </div>

        <a href="/app/orders/new" data-nav class="btn btn-primary btn-sm" style="gap:6px;">
          ${getIcon('plus', '', 14)} Create Wholesale Order
        </a>
      </div>

      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Order Number</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Source</th>
              <th>Status</th>
              <th>Total Amount</th>
              <th style="text-align:right;">Action</th>
            </tr>
          </thead>
          <tbody>
            ${orders.map(o => `
              <tr>
                <td>
                  <a href="/app/orders/${o.id}" data-nav style="color:var(--color-navy);font-weight:700;text-decoration:none;">
                    ${o.orderNumber}
                  </a>
                </td>
                <td><strong>${o.customerName}</strong></td>
                <td style="font-size:12px;color:#666;">${new Date(o.createdAt).toLocaleDateString()}</td>
                <td>
                  <span class="badge ${o.source === 'voice_ai' ? 'badge-primary' : (o.source === 'pos' ? 'badge-success' : 'badge-neutral')}">
                    ${o.source === 'voice_ai' ? 'WhatsApp Voice AI' : (o.source === 'pos' ? 'Retail POS' : 'B2B Trade')}
                  </span>
                </td>
                <td>
                  <span class="badge ${o.status === 'confirmed' ? 'badge-info' : (o.status === 'completed' ? 'badge-success' : 'badge-warning')}">
                    ${o.status.toUpperCase()}
                  </span>
                </td>
                <td class="table-num font-semibold text-primary">Rs. ${o.total.toLocaleString()}</td>
                <td style="text-align:right;">
                  <a href="/app/orders/${o.id}" data-nav class="btn btn-ghost btn-sm btn-icon-only">
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

export function OrderDetailView(params, router) {
  const order = store.getSalesOrders().find(o => o.id === params.id) || store.getSalesOrders()[0];

  if (!order) {
    return {
      html: `<div class="card" style="padding:40px;text-align:center;"><h3>Order Not Found</h3></div>`,
      init: () => {}
    };
  }

  return {
    html: `
      <div class="erp-page-header">
        <div>
          <div class="erp-breadcrumbs">
            <a href="/app/orders" data-nav>Sales Orders</a>
            <span>/</span>
            <span>${order.orderNumber}</span>
          </div>
          <h1 class="text-title-2">${order.orderNumber}</h1>
          <p class="text-body-sm">Billed to: <strong>${order.customerName}</strong> • ${order.branchName}</p>
        </div>

        <div style="display:flex;gap:10px;">
          <a href="/app/orders" data-nav class="btn btn-secondary btn-sm">Back</a>
        </div>
      </div>

      <div class="card" style="padding:28px;margin-bottom:24px;">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;border-bottom:1px solid #E4E7EC;padding-bottom:16px;">
          <div>
            <span class="badge badge-info" style="font-size:12px;">${order.status.toUpperCase()}</span>
            <div style="font-size:13px;color:#666;margin-top:4px;">Channel: ${order.source === 'voice_ai' ? 'WhatsApp Voice Order' : 'Direct Wholesale'}</div>
          </div>
          <div style="text-align:right;">
            <div class="tabular-nums font-bold" style="font-size:20px;color:var(--color-navy);">Rs. ${order.total.toLocaleString()}</div>
            <div class="text-caption">Tax included: Rs. ${order.tax.toLocaleString()}</div>
          </div>
        </div>

        <div class="table-container" style="border:none;">
          <table class="data-table">
            <thead>
              <tr>
                <th>Item & Description</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Line Total</th>
              </tr>
            </thead>
            <tbody>
              ${order.items.map(item => `
                <tr>
                  <td><strong>${item.productName}</strong> (${item.sku})</td>
                  <td class="table-num font-semibold">${item.quantity} ${item.unit}s</td>
                  <td class="table-num">Rs. ${item.unitPrice.toLocaleString()}</td>
                  <td class="table-num font-semibold">Rs. ${item.lineTotal.toLocaleString()}</td>
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

export function OrderNewView(params, router) {
  const customers = store.getCustomers();
  const products = store.getProducts();

  return {
    html: `
      <div class="erp-page-header">
        <div>
          <div class="erp-breadcrumbs">
            <a href="/app/orders" data-nav>Sales Orders</a>
            <span>/</span>
            <span>New Order</span>
          </div>
          <h1 class="text-title-2">Create Wholesale Sales Order</h1>
          <p class="text-body-sm">Allocate stock and generate commercial invoice for B2B retail contractors.</p>
        </div>
      </div>

      <div class="card" style="max-width:760px;padding:32px;">
        <form id="new-order-form">
          <div class="form-group">
            <label class="form-label" for="so-customer">Customer Account <span class="required-star">*</span></label>
            <select id="so-customer" class="form-control" required>
              ${customers.map(c => `<option value="${c.id}">${c.name} (${c.type})</option>`).join('')}
            </select>
          </div>

          <div style="display:grid;grid-template-columns:1.5fr 1fr;gap:16px;">
            <div class="form-group">
              <label class="form-label" for="so-product">Select Product <span class="required-star">*</span></label>
              <select id="so-product" class="form-control" required>
                ${products.map(p => {
                  const s = store.getProductStock(p.id, 'branch_main');
                  return `<option value="${p.id}">${p.name} (Available: ${s.available} pcs)</option>`;
                }).join('')}
              </select>
            </div>
            <div class="form-group">
              <label class="form-label" for="so-qty">Quantity (Pieces) <span class="required-star">*</span></label>
              <input type="number" id="so-qty" class="form-control" value="24" min="1" required>
            </div>
          </div>

          <button type="submit" class="btn btn-primary btn-lg" style="margin-top:16px;">
            Confirm Order & Reserve Inventory
          </button>
        </form>
      </div>
    `,
    init: () => {
      const form = document.getElementById('new-order-form');
      if (form) {
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          const custId = document.getElementById('so-customer').value;
          const prodId = document.getElementById('so-product').value;
          const qty = parseInt(document.getElementById('so-qty').value, 10);

          const product = store.getProduct(prodId);
          const customer = store.getCustomers().find(c => c.id === custId);
          const stock = store.getProductStock(prodId, 'branch_main');

          if (qty > stock.available) {
            toast.error(`Cannot create order: Requested ${qty} pcs exceeds available stock (${stock.available} pcs).`);
            return;
          }

          const unitPrice = product.wholesalePrice || product.salePrice;
          const subtotal = unitPrice * qty;
          const tax = Math.round(subtotal * 0.18);
          const total = subtotal + tax;

          const order = {
            id: `so_${Date.now()}`,
            orderNumber: `SO-${new Date().getFullYear()}-${String(store.getSalesOrders().length + 143).padStart(4, '0')}`,
            customerId: customer.id,
            customerName: customer.name,
            branchId: 'branch_main',
            branchName: 'Karachi Main Hub',
            source: 'manual_b2b',
            status: 'confirmed',
            items: [
              {
                productId: product.id,
                productName: product.name,
                sku: product.sku,
                quantity: qty,
                unit: product.unitOfMeasure,
                unitPrice,
                lineTotal: subtotal
              }
            ],
            subtotal,
            discount: 0,
            tax,
            total,
            createdAt: new Date().toISOString()
          };

          // Reserve stock
          if (product.stockByBranch['branch_main']) {
            product.stockByBranch['branch_main'].reserved = (product.stockByBranch['branch_main'].reserved || 0) + qty;
          }

          store.getSalesOrders().unshift(order);
          store.saveState();
          toast.success(`Sales Order ${order.orderNumber} created! Reserved ${qty} pieces.`);
          router.navigate(`/app/orders/${order.id}`);
        });
      }
    }
  };
}

export function QuotesListView(params, router) {
  const quotes = store.getQuotes();

  return {
    html: `
      <div class="erp-page-header">
        <div>
          <div class="erp-breadcrumbs">
            <a href="/app/dashboard" data-nav>Sales</a>
            <span>/</span>
            <span>Quotations</span>
          </div>
          <h1 class="text-title-2">Price Quotations</h1>
          <p class="text-body-sm">Send commercial estimates with expiry dates and convert directly to confirmed sales orders.</p>
        </div>

        <a href="/app/quotes/new" data-nav class="btn btn-primary btn-sm" style="gap:6px;">
          ${getIcon('plus', '', 14)} Create New Quote
        </a>
      </div>

      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Quote Number</th>
              <th>Customer</th>
              <th>Expiry Date</th>
              <th>Status</th>
              <th>Estimated Total</th>
              <th style="text-align:right;">Action</th>
            </tr>
          </thead>
          <tbody>
            ${quotes.map(q => `
              <tr>
                <td><strong>${q.quoteNumber}</strong></td>
                <td><strong>${q.customerName}</strong></td>
                <td style="font-size:12px;color:#666;">${q.expiresAt}</td>
                <td><span class="badge badge-info">${q.status.toUpperCase()}</span></td>
                <td class="table-num font-semibold text-primary">Rs. ${q.total.toLocaleString()}</td>
                <td style="text-align:right;">
                  <button class="btn btn-secondary btn-sm convert-quote-btn" data-qid="${q.id}">
                    Convert to Order
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `,
    init: () => {
      document.querySelectorAll('.convert-quote-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const qid = btn.dataset.qid;
          const q = store.getQuotes().find(item => item.id === qid);
          if (q) {
            toast.success(`Converted ${q.quoteNumber} into active Sales Order.`);
            router.navigate('/app/orders');
          }
        });
      });
    }
  };
}

export function QuoteNewView(params, router) {
  return {
    html: `
      <div class="erp-page-header">
        <div>
          <div class="erp-breadcrumbs">
            <a href="/app/quotes" data-nav>Quotations</a>
            <span>/</span>
            <span>New Quote</span>
          </div>
          <h1 class="text-title-2">Create Quotation</h1>
          <p class="text-body-sm">Prepare commercial price estimate with wholesale discount.</p>
        </div>
      </div>

      <div class="card" style="max-width:680px;padding:32px;">
        <form id="new-quote-form">
          <div class="form-group">
            <label class="form-label" for="qt-cust">Customer Name</label>
            <input type="text" id="qt-cust" class="form-control" value="Areeb Traders (Clifton)" required>
          </div>
          <div class="form-group">
            <label class="form-label" for="qt-prod">Quoted Item</label>
            <input type="text" id="qt-prod" class="form-control" value="Premium Brass Cylinder Door Lock (120 pcs)" required>
          </div>
          <div class="form-group">
            <label class="form-label" for="qt-rate">Proposed Wholesale Rate (PKR)</label>
            <input type="number" id="qt-rate" class="form-control" value="1950" required>
          </div>
          <button type="submit" class="btn btn-primary" style="margin-top:12px;">Send Quotation Simulation</button>
        </form>
      </div>
    `,
    init: () => {
      const form = document.getElementById('new-quote-form');
      if (form) {
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          toast.success('Quotation draft saved and ready for customer dispatch.');
          router.navigate('/app/quotes');
        });
      }
    }
  };
}

export function InvoicesListView(params, router) {
  const invoices = store.getInvoices();

  return {
    html: `
      <div class="erp-page-header">
        <div>
          <div class="erp-breadcrumbs">
            <a href="/app/dashboard" data-nav>Sales</a>
            <span>/</span>
            <span>Invoices</span>
          </div>
          <h1 class="text-title-2">Tax Invoices Registry</h1>
          <p class="text-body-sm">Historical billing records, payments, and browser-printable receipts.</p>
        </div>
      </div>

      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Invoice Number</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Method</th>
              <th>Payment Status</th>
              <th>Total Amount</th>
              <th style="text-align:right;">Action</th>
            </tr>
          </thead>
          <tbody>
            ${invoices.map(inv => `
              <tr>
                <td>
                  <a href="/app/invoices/${inv.id}" data-nav style="color:var(--color-navy);font-weight:700;text-decoration:none;">
                    ${inv.invoiceNumber}
                  </a>
                </td>
                <td><strong>${inv.customerName}</strong></td>
                <td style="font-size:12px;color:#666;">${new Date(inv.createdAt).toLocaleDateString()}</td>
                <td style="text-transform:uppercase;font-size:12px;">${inv.paymentMethod}</td>
                <td><span class="badge badge-success">${inv.status.toUpperCase()}</span></td>
                <td class="table-num font-semibold text-primary">Rs. ${inv.total.toLocaleString()}</td>
                <td style="text-align:right;">
                  <button class="btn btn-secondary btn-sm preview-invoice-btn" data-invid="${inv.id}">
                    ${getIcon('printer', '', 14)} Print / View
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `,
    init: () => {
      document.querySelectorAll('.preview-invoice-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const invId = btn.dataset.invid;
          const inv = store.getInvoices().find(i => i.id === invId);
          if (inv) {
            const tenant = store.getState().tenant;
            const invoiceHtml = renderInvoiceHtml(inv, tenant, { mode: 'a4' });

            modal.open({
              title: `Tax Invoice ${inv.invoiceNumber}`,
              content: invoiceHtml,
              footer: `
                <button class="btn btn-secondary" onclick="window.print()">
                  ${getIcon('printer', '', 14)} Print A4 Tax Invoice
                </button>
                <button class="btn btn-primary" onclick="window.print()">
                  Print 80mm Receipt
                </button>
              `,
              size: 'lg'
            });
          }
        });
      });
    }
  };
}

export function InvoiceDetailView(params, router) {
  const inv = store.getInvoices().find(i => i.id === params.id) || store.getInvoices()[0];
  const tenant = store.getState().tenant;

  return {
    html: `
      <div class="erp-page-header">
        <div>
          <div class="erp-breadcrumbs">
            <a href="/app/invoices" data-nav>Invoices</a>
            <span>/</span>
            <span>${inv ? inv.invoiceNumber : 'Invoice'}</span>
          </div>
          <h1 class="text-title-2">Invoice ${inv.invoiceNumber}</h1>
        </div>

        <div style="display:flex;gap:10px;">
          <button class="btn btn-primary" onclick="window.print()">
            ${getIcon('printer', '', 14)} Print Invoice
          </button>
          <a href="/app/invoices" data-nav class="btn btn-secondary">Back to List</a>
        </div>
      </div>

      <div class="card" style="padding:32px;background:#FFF;">
        ${renderInvoiceHtml(inv, tenant, { mode: 'a4' })}
      </div>
    `,
    init: () => {}
  };
}

export function ReturnsView(params, router) {
  return {
    html: `
      <div class="erp-page-header">
        <div>
          <div class="erp-breadcrumbs">
            <a href="/app/dashboard" data-nav>Sales</a>
            <span>/</span>
            <span>Returns & Exchanges</span>
          </div>
          <h1 class="text-title-2">Customer Returns & Credit Notes</h1>
          <p class="text-body-sm">Process merchandise returns against original invoice with restock or quarantine inspection.</p>
        </div>
      </div>

      <div class="card" style="max-width:680px;padding:32px;">
        <form id="return-form">
          <div class="form-group">
            <label class="form-label" for="ret-invoice">Original Invoice Reference Number <span class="required-star">*</span></label>
            <input type="text" id="ret-invoice" class="form-control" value="INV-2026-0498" required>
          </div>

          <div class="form-group">
            <label class="form-label" for="ret-reason">Return Reason</label>
            <select id="ret-reason" class="form-control">
              <option value="Customer bought wrong size/specification">Customer bought wrong size/specification</option>
              <option value="Packaging defective">Packaging defective</option>
              <option value="Surplus project contractor return">Surplus project contractor return</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label" for="ret-action">Inspection Action</label>
            <select id="ret-action" class="form-control">
              <option value="restock" selected>Accept & Restock into Active Inventory (Ledger RETURN)</option>
              <option value="quarantine">Quarantine for Manufacturer Warranty Claim</option>
            </select>
          </div>

          <button type="submit" class="btn btn-primary" style="margin-top:16px;">
            Issue Credit Note & Restock
          </button>
        </form>
      </div>
    `,
    init: () => {
      const form = document.getElementById('return-form');
      if (form) {
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          toast.success('Return processed and credit note generated successfully.');
          router.navigate('/app/invoices');
        });
      }
    }
  };
}
