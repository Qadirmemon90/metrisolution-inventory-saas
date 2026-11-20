/**
 * MetriSolution Inventory ERP SaaS - Interactive Retail Point of Sale (POS)
 */

import { store } from '../../services/store.js';
import { getIcon } from '../../components/icons.js';
import { toast } from '../../components/toast.js';
import { modal } from '../../components/modal.js';
import { renderInvoiceHtml } from '../../components/invoiceTemplate.js';

export function PosView(params, router) {
  const activeBranchId = store.getActiveBranchId();
  const currentBranch = store.getBranch(activeBranchId) || store.getBranches()[0];
  const categories = store.getCategories();
  const customers = store.getCustomers();

  let selectedCategory = 'all';
  let searchQuery = '';
  let activeCart = [];
  let selectedCustomerId = 'cust_walkin';
  let discountAmount = 0;
  let tenderType = 'cash';
  let cashTendered = 0;

  function getFilteredProducts() {
    return store.getProducts({
      categoryId: selectedCategory === 'all' ? null : selectedCategory,
      search: searchQuery
    });
  }

  function renderProductGrid() {
    const products = getFilteredProducts();
    if (products.length === 0) {
      return `
        <div class="pos-cart-empty">
          ${getIcon('search', 'text-muted', 32)}
          <div>No products match "${searchQuery}"</div>
        </div>
      `;
    }

    return products.map(p => {
      const stock = store.getProductStock(p.id, currentBranch.id);
      const isOutOfStock = stock.available <= 0;

      return `
        <div class="pos-product-card ${isOutOfStock ? 'out-of-stock' : ''}" data-product-id="${p.id}" tabindex="0">
          <div>
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:4px;">
              <span class="badge ${isOutOfStock ? 'badge-danger' : (stock.available <= p.reorderLevel ? 'badge-warning' : 'badge-neutral')}" style="font-size:10px;">
                ${isOutOfStock ? 'Out of Stock' : `${stock.available} Available`}
              </span>
              <span style="font-size:11px;color:#98A2B3;font-family:monospace;">${p.sku}</span>
            </div>
            <div class="pos-product-title">${p.name}</div>
            <div class="text-caption">${p.categoryName}</div>
          </div>

          <div class="pos-product-footer">
            <div class="pos-product-price">
              Rs. ${p.salePrice.toLocaleString()}
            </div>
            <button class="btn btn-primary btn-sm btn-icon-only pos-add-btn" ${isOutOfStock ? 'disabled' : ''} aria-label="Add ${p.name} to cart">
              ${getIcon('plus', '', 14)}
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  function renderCartItems() {
    if (activeCart.length === 0) {
      return `
        <div class="pos-cart-empty">
          ${getIcon('shopping-cart', 'text-muted', 36)}
          <div style="font-weight:600;color:var(--color-navy);margin-top:8px;">Cart is empty</div>
          <div class="text-caption">Scan barcode or tap products to begin checkout</div>
        </div>
      `;
    }

    return activeCart.map(item => `
      <div class="pos-cart-item">
        <div class="pos-item-info">
          <div class="pos-item-name">${item.productName}</div>
          <div class="pos-item-unit-price">Rs. ${item.unitPrice.toLocaleString()} / ${item.unit}</div>
        </div>

        <div class="pos-qty-stepper">
          <button class="pos-stepper-btn qty-minus" data-id="${item.productId}" aria-label="Decrease quantity">
            ${getIcon('minus', '', 12)}
          </button>
          <span class="pos-qty-display">${item.quantity}</span>
          <button class="pos-stepper-btn qty-plus" data-id="${item.productId}" aria-label="Increase quantity">
            ${getIcon('plus', '', 12)}
          </button>
        </div>

        <div class="pos-item-subtotal">
          Rs. ${(item.unitPrice * item.quantity).toLocaleString()}
        </div>

        <button class="pos-remove-btn" data-id="${item.productId}" aria-label="Remove item">
          ${getIcon('trash-2', '', 16)}
        </button>
      </div>
    `).join('');
  }

  function calculateTotals() {
    let subtotal = 0;
    activeCart.forEach(i => subtotal += (i.unitPrice * i.quantity));
    const tax = Math.round(subtotal * 0.18);
    const grandTotal = Math.max(0, subtotal - discountAmount + tax);
    const changeDue = tenderType === 'cash' ? Math.max(0, cashTendered - grandTotal) : 0;
    return { subtotal, tax, grandTotal, changeDue };
  }

  return {
    html: `
      <div class="pos-container">
        <!-- Left 60%: Catalog & Barcode Scanner -->
        <div class="pos-catalog-pane">
          <div class="pos-catalog-header">
            <div class="pos-search-bar">
              <div class="input-with-icon" style="flex:1;">
                <span class="input-icon-left">${getIcon('search', '', 16)}</span>
                <input type="text" id="pos-barcode-input" class="form-control pos-barcode-input" placeholder="Scan barcode or type SKU / Name..." autofocus autocomplete="off">
              </div>
              <button id="pos-scan-sample-btn" class="btn btn-secondary btn-sm" title="Simulate Barcode Scanner">
                ${getIcon('box', '', 14)} Scan Sample
              </button>
            </div>

            <div class="pos-category-pills">
              <button class="tab-pill pos-cat-btn ${selectedCategory === 'all' ? 'active' : ''}" data-cat="all">All Items</button>
              ${categories.map(c => `
                <button class="tab-pill pos-cat-btn ${selectedCategory === c.id ? 'active' : ''}" data-cat="${c.id}">${c.name}</button>
              `).join('')}
            </div>
          </div>

          <div class="pos-product-grid" id="pos-product-grid">
            ${renderProductGrid()}
          </div>
        </div>

        <!-- Right 40%: Active Cart & Checkout -->
        <div class="pos-cart-pane">
          <div class="pos-cart-header">
            <div>
              <div style="font-weight:700;font-size:15px;color:var(--color-navy);">Retail Checkout</div>
              <div class="text-caption">${currentBranch.name} • Register 01</div>
            </div>
            <select id="pos-customer-select" class="form-control" style="width:auto;padding:4px 8px;font-size:12px;">
              ${customers.map(c => `
                <option value="${c.id}" ${c.id === selectedCustomerId ? 'selected' : ''}>${c.name}</option>
              `).join('')}
            </select>
          </div>

          <div class="pos-cart-items-list" id="pos-cart-items-list">
            ${renderCartItems()}
          </div>

          <!-- Cart Financial Summary -->
          <div class="pos-cart-summary">
            <div class="pos-summary-row">
              <span>Subtotal:</span>
              <span id="pos-subtotal" class="tabular-nums font-semibold">Rs. 0</span>
            </div>
            <div class="pos-summary-row">
              <span>Sales Tax (18% GST):</span>
              <span id="pos-tax" class="tabular-nums">Rs. 0</span>
            </div>
            <div class="pos-summary-row">
              <span>Discount (PKR):</span>
              <input type="number" id="pos-discount-input" value="0" min="0" max="5000" style="width:90px;padding:2px 6px;border:1px solid #D0D5DD;border-radius:4px;text-align:right;font-size:12px;">
            </div>

            <div class="pos-summary-total">
              <span>Total Payable:</span>
              <span id="pos-grand-total" class="text-primary tabular-nums">Rs. 0</span>
            </div>

            <!-- Payment Type Selector -->
            <div class="pos-tender-grid">
              <button class="btn btn-secondary btn-sm pos-tender-btn active" data-type="cash">
                ${getIcon('dollar-sign', '', 14)} Cash Tender
              </button>
              <button class="btn btn-secondary btn-sm pos-tender-btn" data-type="card">
                ${getIcon('credit-card', '', 14)} Card / Direct
              </button>
            </div>

            <!-- Cash Tender Row -->
            <div id="pos-cash-row" style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-top:4px;">
              <div style="font-size:12px;color:#475467;">Cash Received:</div>
              <input type="number" id="pos-cash-input" placeholder="0" style="width:110px;padding:6px;border:1px solid #D0D5DD;border-radius:6px;text-align:right;font-weight:700;font-size:13px;">
              <div style="font-size:12px;color:#027A48;">Change: <strong id="pos-change-val">Rs. 0</strong></div>
            </div>

            <button id="pos-checkout-btn" class="btn btn-primary pos-checkout-btn" disabled>
              Complete Sale & Print Receipt
            </button>
          </div>
        </div>
      </div>
    `,
    init: () => {
      const barcodeInput = document.getElementById('pos-barcode-input');
      const productGrid = document.getElementById('pos-product-grid');
      const cartList = document.getElementById('pos-cart-items-list');
      const subtotalEl = document.getElementById('pos-subtotal');
      const taxEl = document.getElementById('pos-tax');
      const grandTotalEl = document.getElementById('pos-grand-total');
      const discountInput = document.getElementById('pos-discount-input');
      const cashInput = document.getElementById('pos-cash-input');
      const changeVal = document.getElementById('pos-change-val');
      const checkoutBtn = document.getElementById('pos-checkout-btn');
      const customerSelect = document.getElementById('pos-customer-select');
      const sampleScanBtn = document.getElementById('pos-scan-sample-btn');

      function updateCartUI() {
        cartList.innerHTML = renderCartItems();
        const { subtotal, tax, grandTotal, changeDue } = calculateTotals();
        subtotalEl.textContent = `Rs. ${subtotal.toLocaleString()}`;
        taxEl.textContent = `Rs. ${tax.toLocaleString()}`;
        grandTotalEl.textContent = `Rs. ${grandTotal.toLocaleString()}`;
        changeVal.textContent = `Rs. ${changeDue.toLocaleString()}`;

        checkoutBtn.disabled = activeCart.length === 0;

        // Auto-fill exact cash if empty
        if (tenderType === 'cash' && (!cashInput.value || parseFloat(cashInput.value) === 0)) {
          cashInput.value = grandTotal > 0 ? grandTotal : '';
          cashTendered = grandTotal;
        }

        bindCartEvents();
      }

      function bindCartEvents() {
        cartList.querySelectorAll('.qty-plus').forEach(btn => {
          btn.addEventListener('click', () => {
            const id = btn.dataset.id;
            const item = activeCart.find(i => i.productId === id);
            const stock = store.getProductStock(id, currentBranch.id);
            if (item) {
              if (item.quantity + 1 > stock.available) {
                toast.warning(`Cannot exceed available stock of ${stock.available} pieces.`);
                return;
              }
              item.quantity += 1;
              updateCartUI();
            }
          });
        });

        cartList.querySelectorAll('.qty-minus').forEach(btn => {
          btn.addEventListener('click', () => {
            const id = btn.dataset.id;
            const item = activeCart.find(i => i.productId === id);
            if (item) {
              if (item.quantity > 1) {
                item.quantity -= 1;
              } else {
                activeCart = activeCart.filter(i => i.productId !== id);
              }
              updateCartUI();
            }
          });
        });

        cartList.querySelectorAll('.pos-remove-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            const id = btn.dataset.id;
            activeCart = activeCart.filter(i => i.productId !== id);
            updateCartUI();
          });
        });
      }

      function addToCart(productId) {
        const product = store.getProduct(productId);
        if (!product) return;

        const stock = store.getProductStock(productId, currentBranch.id);
        if (stock.available <= 0) {
          toast.error(`${product.name} is currently out of stock.`);
          return;
        }

        const existing = activeCart.find(i => i.productId === productId);
        if (existing) {
          if (existing.quantity + 1 > stock.available) {
            toast.warning(`Cannot add more: only ${stock.available} available.`);
            return;
          }
          existing.quantity += 1;
        } else {
          activeCart.push({
            productId: product.id,
            productName: product.name,
            sku: product.sku,
            unitPrice: product.salePrice,
            unit: product.unitOfMeasure || 'piece',
            quantity: 1
          });
        }

        toast.info(`Added ${product.name} to cart`);
        updateCartUI();
      }

      // Barcode / SKU search
      if (barcodeInput) {
        barcodeInput.addEventListener('input', (e) => {
          searchQuery = e.target.value;
          // Exact barcode match simulation
          const exact = store.getProducts().find(p => p.barcode === searchQuery.trim());
          if (exact) {
            addToCart(exact.id);
            barcodeInput.value = '';
            searchQuery = '';
          }
          productGrid.innerHTML = renderProductGrid();
          bindCatalogEvents();
        });
      }

      // Sample barcode scan simulator
      if (sampleScanBtn) {
        sampleScanBtn.addEventListener('click', () => {
          const sampleProd = store.getProduct('prod_drill_01');
          if (sampleProd) {
            addToCart(sampleProd.id);
            toast.success(`Scanned Barcode: ${sampleProd.barcode} (${sampleProd.name})`);
          }
        });
      }

      // Category filter pills
      document.querySelectorAll('.pos-cat-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          document.querySelectorAll('.pos-cat-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          selectedCategory = btn.dataset.cat;
          productGrid.innerHTML = renderProductGrid();
          bindCatalogEvents();
        });
      });

      function bindCatalogEvents() {
        productGrid.querySelectorAll('.pos-product-card').forEach(card => {
          card.addEventListener('click', () => {
            const id = card.dataset.productId;
            addToCart(id);
          });
        });
      }
      bindCatalogEvents();

      // Discount input
      if (discountInput) {
        discountInput.addEventListener('input', (e) => {
          discountAmount = Math.max(0, parseFloat(e.target.value) || 0);
          updateCartUI();
        });
      }

      // Cash input
      if (cashInput) {
        cashInput.addEventListener('input', (e) => {
          cashTendered = Math.max(0, parseFloat(e.target.value) || 0);
          updateCartUI();
        });
      }

      // Customer select
      if (customerSelect) {
        customerSelect.addEventListener('change', (e) => {
          selectedCustomerId = e.target.value;
        });
      }

      // Tender type
      document.querySelectorAll('.pos-tender-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          document.querySelectorAll('.pos-tender-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          tenderType = btn.dataset.type;
          const cashRow = document.getElementById('pos-cash-row');
          if (cashRow) cashRow.style.display = tenderType === 'cash' ? 'flex' : 'none';
          updateCartUI();
        });
      });

      // Checkout execution
      if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
          try {
            const { grandTotal, changeDue } = calculateTotals();
            if (tenderType === 'cash' && cashTendered < grandTotal) {
              toast.error(`Tender amount (Rs. ${cashTendered}) is less than Total (Rs. ${grandTotal}).`);
              return;
            }

            // Commit checkout via reactive store!
            const invoice = store.executePosCheckout({
              branchId: currentBranch.id,
              customerId: selectedCustomerId,
              items: activeCart,
              paymentMethod: tenderType,
              amountPaid: tenderType === 'cash' ? cashTendered : grandTotal,
              discountAmount
            });

            // Open Receipt Modal with instant browser print
            const tenant = store.getState().tenant;
            const invoiceHtml = renderInvoiceHtml(invoice, tenant, { mode: '80mm' });

            modal.open({
              title: 'Checkout Confirmed — Sale Receipt',
              content: `
                <div style="text-align:center;margin-bottom:16px;">
                  <span class="badge badge-success" style="font-size:12px;padding:4px 12px;">
                    ${getIcon('check-circle-2', '', 14)} Transaction ${invoice.invoiceNumber} Committed
                  </span>
                </div>
                ${invoiceHtml}
              `,
              footer: `
                <button class="btn btn-secondary" onclick="window.print()">
                  ${getIcon('printer', '', 14)} Print Receipt
                </button>
                <button class="btn btn-primary" id="modal-next-sale-btn">
                  Next Customer
                </button>
              `,
              size: 'md'
            });

            const nextBtn = document.getElementById('modal-next-sale-btn');
            if (nextBtn) {
              nextBtn.addEventListener('click', () => {
                modal.close();
                activeCart = [];
                discountAmount = 0;
                cashTendered = 0;
                discountInput.value = '0';
                cashInput.value = '';
                updateCartUI();
                productGrid.innerHTML = renderProductGrid();
                bindCatalogEvents();
              });
            }

            toast.success(`Sale completed! Deducted items from ${currentBranch.name} stock ledger.`);
          } catch (err) {
            toast.error(err.message, 'Checkout Failed');
          }
        });
      }
    }
  };
}
