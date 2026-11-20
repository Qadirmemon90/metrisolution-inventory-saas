/**
 * MetriSolution Inventory ERP SaaS - Products & Inventory Catalog Views
 */

import { store } from '../../services/store.js';
import { getIcon } from '../../components/icons.js';
import { toast } from '../../components/toast.js';
import { exportToCsv } from '../../services/exportService.js';

export function ProductsListView(params, router) {
  const activeBranchId = store.getActiveBranchId();
  const categories = store.getCategories();
  const currentUser = store.getCurrentUser();
  const isSales = currentUser.role === 'SALES';

  let selectedCat = 'all';
  let searchQ = '';

  function renderRows() {
    const products = store.getProducts({
      categoryId: selectedCat === 'all' ? null : selectedCat,
      search: searchQ
    });

    if (products.length === 0) {
      return `
        <tr>
          <td colspan="${isSales ? 6 : 8}" style="text-align:center;padding:48px;color:#98A2B3;">
            No products found matching the current search criteria.
          </td>
        </tr>
      `;
    }

    return products.map(p => {
      const stock = store.getProductStock(p.id, activeBranchId);
      const isLow = stock.onHand <= p.reorderLevel;
      const isOut = stock.onHand === 0;

      return `
        <tr>
          <td>
            <a href="/app/products/${p.id}" data-nav style="color:var(--color-navy);font-weight:600;text-decoration:none;">
              ${p.name}
            </a>
            <div style="font-size:11px;color:#98A2B3;font-family:monospace;margin-top:2px;">
              SKU: ${p.sku} | Barcode: ${p.barcode}
            </div>
          </td>
          <td><span class="badge badge-neutral">${p.categoryName}</span></td>
          <td>${p.brand || '—'}</td>
          <td class="table-num font-semibold">${stock.onHand} ${p.unitOfMeasure}s</td>
          <td>
            <span class="badge ${isOut ? 'badge-danger' : (isLow ? 'badge-warning' : 'badge-success')}">
              ${isOut ? 'Out of Stock' : (isLow ? 'Low Stock' : 'In Stock')}
            </span>
          </td>
          ${!isSales ? `
            <td class="table-num text-muted">Rs. ${p.costPrice.toLocaleString()}</td>
          ` : ''}
          <td class="table-num font-semibold text-primary">Rs. ${p.salePrice.toLocaleString()}</td>
          <td style="text-align:right;">
            <a href="/app/products/${p.id}" data-nav class="btn btn-ghost btn-sm btn-icon-only" title="View Product Details">
              ${getIcon('eye', '', 16)}
            </a>
          </td>
        </tr>
      `;
    }).join('');
  }

  return {
    html: `
      <div class="erp-page-header">
        <div>
          <div class="erp-breadcrumbs">
            <a href="/app/dashboard" data-nav>Inventory</a>
            <span>/</span>
            <span>Products & SKUs</span>
          </div>
          <h1 class="text-title-2">Product Catalog</h1>
          <p class="text-body-sm">Manage item specifications, barcodes, box conversions, and branch stock balances.</p>
        </div>

        <div style="display:flex;align-items:center;gap:10px;">
          <button id="export-products-csv-btn" class="btn btn-secondary btn-sm" style="gap:6px;">
            ${getIcon('download', '', 14)} Export CSV
          </button>
          ${!isSales ? `
            <a href="/app/products/new" data-nav class="btn btn-primary btn-sm" style="gap:6px;">
              ${getIcon('plus', '', 14)} Add New Product
            </a>
          ` : ''}
        </div>
      </div>

      <div class="card" style="margin-bottom:20px;padding:16px;">
        <div style="display:flex;align-items:center;gap:16px;flex-wrap:wrap;">
          <div class="input-with-icon" style="flex:1;min-width:240px;">
            <span class="input-icon-left">${getIcon('search', '', 16)}</span>
            <input type="text" id="product-search-input" class="form-control" placeholder="Search by product name, SKU, or barcode...">
          </div>

          <div style="display:flex;align-items:center;gap:8px;">
            <span class="text-caption">Category:</span>
            <select id="product-category-filter" class="form-control" style="width:auto;padding:6px 12px;font-size:13px;">
              <option value="all">All Categories</option>
              ${categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
            </select>
          </div>
        </div>
      </div>

      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Product & SKU</th>
              <th>Category</th>
              <th>Brand</th>
              <th>On-Hand Stock</th>
              <th>Status</th>
              ${!isSales ? `<th>Wholesale Cost</th>` : ''}
              <th>Retail Price</th>
              <th style="text-align:right;">Actions</th>
            </tr>
          </thead>
          <tbody id="products-table-tbody">
            ${renderRows()}
          </tbody>
        </table>
      </div>
    `,
    init: () => {
      const searchInput = document.getElementById('product-search-input');
      const catFilter = document.getElementById('product-category-filter');
      const tbody = document.getElementById('products-table-tbody');
      const exportBtn = document.getElementById('export-products-csv-btn');

      function update() {
        tbody.innerHTML = renderRows();
      }

      if (searchInput) {
        searchInput.addEventListener('input', (e) => {
          searchQ = e.target.value;
          update();
        });
      }

      if (catFilter) {
        catFilter.addEventListener('change', (e) => {
          selectedCat = e.target.value;
          update();
        });
      }

      if (exportBtn) {
        exportBtn.addEventListener('click', () => {
          const prods = store.getProducts();
          const headers = [
            { label: 'SKU', accessor: 'sku' },
            { label: 'Product Name', accessor: 'name' },
            { label: 'Barcode', accessor: 'barcode' },
            { label: 'Category', accessor: 'categoryName' },
            { label: 'Cost Price (PKR)', accessor: 'costPrice' },
            { label: 'Sale Price (PKR)', accessor: 'salePrice' },
            { label: 'Unit', accessor: 'unitOfMeasure' }
          ];
          exportToCsv('metrisolution_products', headers, prods);
          toast.success('Product catalog exported successfully.');
        });
      }
    }
  };
}

export function ProductDetailView(params, router) {
  const product = store.getProduct(params.id);
  const currentUser = store.getCurrentUser();
  const isSales = currentUser.role === 'SALES';

  if (!product) {
    return {
      html: `
        <div class="card" style="padding:48px;text-align:center;">
          <h3>Product Not Found</h3>
          <p class="text-body-sm">The requested product SKU could not be located.</p>
          <a href="/app/products" data-nav class="btn btn-primary" style="margin-top:16px;">Back to Catalog</a>
        </div>
      `,
      init: () => {}
    };
  }

  const movements = store.getStockMovements({ productId: product.id });
  const branches = store.getBranches();

  return {
    html: `
      <div class="erp-page-header">
        <div>
          <div class="erp-breadcrumbs">
            <a href="/app/products" data-nav>Products</a>
            <span>/</span>
            <span>${product.sku}</span>
          </div>
          <h1 class="text-title-2">${product.name}</h1>
          <p class="text-body-sm" style="font-family:monospace;margin-top:2px;">
            SKU: ${product.sku} • Barcode: ${product.barcode}
          </p>
        </div>

        <div style="display:flex;gap:10px;">
          <a href="/app/products" data-nav class="btn btn-secondary btn-sm">
            ${getIcon('arrow-right', 'rotate-180', 14)} Back to List
          </a>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:1.5fr 1fr;gap:24px;margin-bottom:24px;">
        <!-- Left: Specs & Pricing -->
        <div class="card" style="padding:24px;">
          <h3 class="text-heading" style="margin-bottom:16px;">Item Specifications</h3>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;font-size:14px;">
            <div>
              <span class="text-caption">Category:</span>
              <div style="font-weight:600;color:var(--color-navy);">${product.categoryName}</div>
            </div>
            <div>
              <span class="text-caption">Brand / Manufacturer:</span>
              <div style="font-weight:600;color:var(--color-navy);">${product.brand || 'Unbranded'}</div>
            </div>
            <div>
              <span class="text-caption">Primary Unit of Measure:</span>
              <div style="font-weight:600;color:var(--color-navy);">${product.unitOfMeasure}</div>
            </div>
            <div>
              <span class="text-caption">Packaging Box Ratio:</span>
              <div style="font-weight:600;color:var(--color-primary);">1 Box = ${product.boxRatio || 1} Pieces</div>
            </div>
            <div>
              <span class="text-caption">Reorder Alert Threshold:</span>
              <div style="font-weight:600;color:var(--color-warning);">${product.reorderLevel} Pieces</div>
            </div>
            <div>
              <span class="text-caption">Retail Selling Price:</span>
              <div style="font-weight:700;color:var(--color-navy);font-size:16px;">Rs. ${product.salePrice.toLocaleString()}</div>
            </div>
            ${!isSales ? `
              <div>
                <span class="text-caption">Wholesale Cost (Confidential):</span>
                <div style="font-weight:700;color:#666;font-size:16px;">Rs. ${product.costPrice.toLocaleString()}</div>
              </div>
              <div>
                <span class="text-caption">Target Gross Profit Margin:</span>
                <div style="font-weight:700;color:#027A48;font-size:16px;">
                  Rs. ${(product.salePrice - product.costPrice).toLocaleString()} (${Math.round(((product.salePrice - product.costPrice)/product.salePrice)*100)}%)
                </div>
              </div>
            ` : ''}
          </div>
        </div>

        <!-- Right: Stock by Branch & Bin Locations -->
        <div class="card" style="padding:24px;">
          <h3 class="text-heading" style="margin-bottom:16px;">Branch Stock & Bin Racks</h3>
          <div style="display:flex;flex-direction:column;gap:12px;">
            ${branches.map(b => {
              const bStock = product.stockByBranch[b.id] || { onHand: 0, reserved: 0, locationText: 'Unassigned' };
              return `
                <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 12px;background:#F9FAFB;border-radius:8px;border:1px solid #E4E7EC;">
                  <div>
                    <strong style="color:var(--color-navy);font-size:13px;">${b.name}</strong>
                    <div style="font-size:11px;color:#98A2B3;">Location: ${bStock.locationText}</div>
                  </div>
                  <div style="text-align:right;">
                    <div class="tabular-nums font-semibold" style="font-size:15px;color:var(--color-navy);">${bStock.onHand} Pcs</div>
                    <div class="text-caption">${bStock.reserved || 0} reserved</div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>

      <!-- Specific Product Movement Ledger History -->
      <div class="card">
        <div class="card-header">
          <h3 class="text-heading">Stock Ledger Audit History for ${product.sku}</h3>
        </div>
        <div class="table-container" style="border:none;">
          <table class="data-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Type</th>
                <th>Branch</th>
                <th>Quantity</th>
                <th>Balance After</th>
                <th>Reference / Reason</th>
                <th>Recorded By</th>
              </tr>
            </thead>
            <tbody>
              ${movements.length > 0 ? movements.map(m => `
                <tr>
                  <td style="font-size:12px;color:#666;">${new Date(m.timestamp).toLocaleDateString()} ${new Date(m.timestamp).toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' })}</td>
                  <td><span class="badge ${m.type === 'IN' ? 'badge-success' : 'badge-danger'}">${m.type}</span></td>
                  <td>${m.branchName}</td>
                  <td class="table-num font-semibold ${m.quantity < 0 ? 'text-danger' : 'text-success'}">
                    ${m.quantity > 0 ? '+' : ''}${m.quantity} ${m.unit}
                  </td>
                  <td class="table-num font-semibold">${m.newBalance} pcs</td>
                  <td style="font-size:12px;">${m.referenceId || 'Manual'} • ${m.reason}</td>
                  <td style="font-size:12px;color:#666;">${m.actorName}</td>
                </tr>
              `).join('') : `
                <tr><td colspan="7" style="text-align:center;padding:24px;color:#98A2B3;">No movements recorded yet for this item.</td></tr>
              `}
            </tbody>
          </table>
        </div>
      </div>
    `,
    init: () => {}
  };
}

export function ProductFormView(params, router) {
  const categories = store.getCategories();
  const branches = store.getBranches();

  return {
    html: `
      <div class="erp-page-header">
        <div>
          <div class="erp-breadcrumbs">
            <a href="/app/products" data-nav>Products</a>
            <span>/</span>
            <span>New Product</span>
          </div>
          <h1 class="text-title-2">Add New Product</h1>
          <p class="text-body-sm">Register a new SKU with barcode, box ratio conversion, and initial stock balance.</p>
        </div>
      </div>

      <div style="max-width:760px;margin:0 auto;">
        <div class="card" style="padding:32px;">
          <form id="new-product-form">
            <div class="form-group">
              <label class="form-label" for="prod-name">Product Name <span class="required-star">*</span></label>
              <input type="text" id="prod-name" class="form-control" placeholder="e.g. Master Cylinder Deadbolt Lock" required>
            </div>

            <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
              <div class="form-group">
                <label class="form-label" for="prod-sku">SKU Code <span class="required-star">*</span></label>
                <input type="text" id="prod-sku" class="form-control" placeholder="e.g. LCK-DBL-004" required>
              </div>
              <div class="form-group">
                <label class="form-label" for="prod-barcode">Barcode (EAN-13 / UPC) <span class="required-star">*</span></label>
                <input type="text" id="prod-barcode" class="form-control" placeholder="e.g. 8964000100999" required>
              </div>
            </div>

            <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
              <div class="form-group">
                <label class="form-label" for="prod-category">Category</label>
                <select id="prod-category" class="form-control">
                  ${categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
                </select>
              </div>
              <div class="form-group">
                <label class="form-label" for="prod-brand">Brand</label>
                <input type="text" id="prod-brand" class="form-control" placeholder="e.g. Master Guard / Crown">
              </div>
            </div>

            <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
              <div class="form-group">
                <label class="form-label" for="prod-uom">Base Unit of Measure</label>
                <select id="prod-uom" class="form-control">
                  <option value="piece" selected>Piece</option>
                  <option value="pack">Pack</option>
                  <option value="set">Set</option>
                  <option value="kg">Kilogram</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label" for="prod-box-ratio">Box-to-Piece Ratio</label>
                <input type="number" id="prod-box-ratio" class="form-control" value="12" min="1" placeholder="12 pieces per box">
              </div>
            </div>

            <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
              <div class="form-group">
                <label class="form-label" for="prod-cost">Wholesale Cost Price (PKR) <span class="required-star">*</span></label>
                <input type="number" id="prod-cost" class="form-control" placeholder="1200" required min="0">
              </div>
              <div class="form-group">
                <label class="form-label" for="prod-sale">Retail Selling Price (PKR) <span class="required-star">*</span></label>
                <input type="number" id="prod-sale" class="form-control" placeholder="1850" required min="0">
              </div>
            </div>

            <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
              <div class="form-group">
                <label class="form-label" for="prod-reorder">Low Stock Alert Threshold</label>
                <input type="number" id="prod-reorder" class="form-control" value="24" min="0">
              </div>
              <div class="form-group">
                <label class="form-label" for="prod-initial-stock">Initial Stock Quantity</label>
                <input type="number" id="prod-initial-stock" class="form-control" value="60" min="0">
              </div>
            </div>

            <div style="display:flex;justify-content:flex-end;gap:12px;margin-top:24px;">
              <a href="/app/products" data-nav class="btn btn-secondary">Cancel</a>
              <button type="submit" class="btn btn-primary btn-lg">Save & Commit Product</button>
            </div>
          </form>
        </div>
      </div>
    `,
    init: () => {
      const form = document.getElementById('new-product-form');
      if (form) {
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          const name = document.getElementById('prod-name').value.trim();
          const sku = document.getElementById('prod-sku').value.trim().toUpperCase();
          const barcode = document.getElementById('prod-barcode').value.trim();
          const catId = document.getElementById('prod-category').value;
          const brand = document.getElementById('prod-brand').value.trim();
          const uom = document.getElementById('prod-uom').value;
          const boxRatio = parseInt(document.getElementById('prod-box-ratio').value, 10) || 1;
          const cost = parseFloat(document.getElementById('prod-cost').value) || 0;
          const sale = parseFloat(document.getElementById('prod-sale').value) || 0;
          const reorder = parseInt(document.getElementById('prod-reorder').value, 10) || 10;
          const initialStock = parseInt(document.getElementById('prod-initial-stock').value, 10) || 0;

          // Check SKU uniqueness
          const existing = store.getProducts().find(p => p.sku === sku);
          if (existing) {
            toast.error(`A product with SKU "${sku}" already exists.`);
            return;
          }

          const cat = store.getCategories().find(c => c.id === catId);
          const newProd = {
            id: `prod_${Date.now()}`,
            name,
            sku,
            barcode,
            categoryId: catId,
            categoryName: cat ? cat.name : 'Hardware',
            brand,
            unitOfMeasure: uom,
            boxRatio,
            costPrice: cost,
            salePrice: sale,
            wholesalePrice: Math.round(sale * 0.88),
            reorderLevel: reorder,
            stockByBranch: {
              "branch_main": { onHand: initialStock, reserved: 0, locationText: "Zone A > General Racks" },
              "branch_clifton": { onHand: 0, reserved: 0, locationText: "Unassigned" },
              "branch_nazimabad": { onHand: 0, reserved: 0, locationText: "Unassigned" }
            },
            imageUrl: "",
            isArchived: false
          };

          store.getState().products.push(newProd);

          // If initial stock provided, log it in ledger
          if (initialStock > 0) {
            store.createStockMovement({
              productId: newProd.id,
              branchId: 'branch_main',
              type: 'IN',
              quantity: initialStock,
              unit: uom,
              referenceId: 'INITIAL-STOCK',
              reason: 'Opening stock balance entry'
            });
          } else {
            store.saveState();
          }

          toast.success(`Product "${name}" added to inventory.`);
          router.navigate(`/app/products/${newProd.id}`);
        });
      }
    }
  };
}

export function CategoriesView(params, router) {
  const categories = store.getCategories();

  return {
    html: `
      <div class="erp-page-header">
        <div>
          <div class="erp-breadcrumbs">
            <a href="/app/products" data-nav>Inventory</a>
            <span>/</span>
            <span>Categories</span>
          </div>
          <h1 class="text-title-2">Product Categories</h1>
          <p class="text-body-sm">Organize hardware, electricals, fasteners, and tools into structured hierarchies.</p>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(280px, 1fr));gap:20px;">
        ${categories.map(c => `
          <div class="card" style="padding:24px;">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
              <span class="badge badge-primary">${c.code}</span>
              <span class="text-caption">${c.itemCount} SKUs</span>
            </div>
            <h3 class="text-heading" style="margin-bottom:8px;">${c.name}</h3>
            <p class="text-body-sm">Active taxonomy grouping in Metro Hardware catalog.</p>
          </div>
        `).join('')}
      </div>
    `,
    init: () => {}
  };
}

export function LowStockView(params, router) {
  const activeBranchId = store.getActiveBranchId();
  const lowStock = store.getProducts().filter(p => {
    const s = store.getProductStock(p.id, activeBranchId);
    return s.onHand <= p.reorderLevel;
  });

  return {
    html: `
      <div class="erp-page-header">
        <div>
          <div class="erp-breadcrumbs">
            <a href="/app/products" data-nav>Inventory</a>
            <span>/</span>
            <span>Replenishment</span>
          </div>
          <h1 class="text-title-2">Low Stock Reorder Alerts</h1>
          <p class="text-body-sm">Products currently at or below their configured reorder safety threshold.</p>
        </div>
      </div>

      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Product & SKU</th>
              <th>Current On-Hand</th>
              <th>Reorder Threshold</th>
              <th>Status</th>
              <th>Suggested Order Qty</th>
              <th style="text-align:right;">Action</th>
            </tr>
          </thead>
          <tbody>
            ${lowStock.map(p => {
              const s = store.getProductStock(p.id, activeBranchId);
              return `
                <tr>
                  <td>
                    <strong>${p.name}</strong><br>
                    <span style="font-size:11px;color:#98A2B3;font-family:monospace;">${p.sku}</span>
                  </td>
                  <td class="table-num font-semibold text-danger">${s.onHand} ${p.unitOfMeasure}s</td>
                  <td class="table-num">${p.reorderLevel} ${p.unitOfMeasure}s</td>
                  <td>
                    <span class="badge ${s.onHand === 0 ? 'badge-danger' : 'badge-warning'}">
                      ${s.onHand === 0 ? 'Critical (0)' : 'Reorder Needed'}
                    </span>
                  </td>
                  <td class="table-num font-semibold text-primary">
                    + ${p.reorderLevel * 2} pieces (${Math.ceil((p.reorderLevel * 2) / (p.boxRatio || 1))} boxes)
                  </td>
                  <td style="text-align:right;">
                    <a href="/app/purchases/new?sku=${p.sku}" data-nav class="btn btn-secondary btn-sm">
                      Create PO
                    </a>
                  </td>
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
