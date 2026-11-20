/**
 * MetriSolution Inventory ERP SaaS - Accessible Command Palette (Ctrl+K)
 */

import { store } from '../services/store.js';
import { getIcon } from './icons.js';

class CommandPalette {
  constructor() {
    this.isOpen = false;
    this.router = null;
    this.selectedIndex = 0;
    this.results = [];
    this.initGlobalListener();
  }

  setRouter(router) {
    this.router = router;
  }

  initGlobalListener() {
    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        this.toggle();
      }
    });

    // Also delegate click for search button
    document.addEventListener('click', (e) => {
      if (e.target.closest('#open-command-palette-btn')) {
        this.open();
      }
    });
  }

  toggle() {
    if (this.isOpen) this.close();
    else this.open();
  }

  open() {
    if (this.isOpen) return;
    this.isOpen = true;
    this.render();
  }

  close() {
    const el = document.getElementById('command-palette-overlay');
    if (el) {
      el.remove();
    }
    this.isOpen = false;
  }

  search(query) {
    const q = query.toLowerCase().trim();
    const appActions = [
      { type: 'Page', title: 'Retail POS Terminal', route: '/app/pos', icon: 'shopping-cart' },
      { type: 'Page', title: 'Products & SKU Directory', route: '/app/products', icon: 'package' },
      { type: 'Page', title: 'Add New Product', route: '/app/products/new', icon: 'plus' },
      { type: 'Page', title: 'Stock Ledger History', route: '/app/stock/ledger', icon: 'layers' },
      { type: 'Page', title: 'Goods Receiving', route: '/app/stock/receiving', icon: 'download' },
      { type: 'Page', title: 'Branch Stock Transfers', route: '/app/stock/transfers', icon: 'truck' },
      { type: 'Page', title: 'Physical Cycle Counts', route: '/app/stock/counts', icon: 'check-circle-2' },
      { type: 'Page', title: 'WhatsApp Voice Center', route: '/app/voice-inbox', icon: 'mic' },
      { type: 'Page', title: 'AI Order Drafts', route: '/app/ai-drafts', icon: 'file-text' },
      { type: 'Page', title: 'Sales Analytics Reports', route: '/app/reports/sales', icon: 'bar-chart' },
      { type: 'Page', title: 'Subscription & Billing', route: '/app/billing', icon: 'credit-card' },
      { type: 'Action', title: 'Reset Demo Data to Fixtures', action: 'reset_data', icon: 'refresh-cw' }
    ];

    let items = appActions.filter(a => a.title.toLowerCase().includes(q));

    // Also search products
    if (q.length > 1) {
      const prods = store.getProducts({ search: q }).slice(0, 5);
      prods.forEach(p => {
        items.push({
          type: 'Product',
          title: `${p.name} (${p.sku})`,
          route: `/app/products/${p.id}`,
          icon: 'package',
          subtitle: `Rs. ${p.salePrice.toLocaleString()} | Barcode: ${p.barcode}`
        });
      });
    }

    this.results = items;
    this.selectedIndex = 0;
    this.updateResultsList();
  }

  updateResultsList() {
    const listEl = document.getElementById('command-results-list');
    if (!listEl) return;

    if (this.results.length === 0) {
      listEl.innerHTML = `
        <div style="padding:24px;text-align:center;color:var(--color-text-muted);font-size:0.875rem;">
          No matching pages or products found.
        </div>
      `;
      return;
    }

    listEl.innerHTML = this.results.map((item, idx) => `
      <div class="command-item ${idx === this.selectedIndex ? 'selected' : ''}" data-idx="${idx}" style="
        display:flex;align-items:center;justify-content:space-between;padding:10px 14px;border-radius:8px;cursor:pointer;
        background:${idx === this.selectedIndex ? 'var(--color-primary-soft)' : 'transparent'};
        color:${idx === this.selectedIndex ? 'var(--color-primary)' : 'var(--color-text-primary)'};
      ">
        <div style="display:flex;align-items:center;gap:10px;">
          ${getIcon(item.icon, '', 16)}
          <div>
            <div style="font-size:0.875rem;font-weight:600;">${item.title}</div>
            ${item.subtitle ? `<div style="font-size:0.75rem;color:var(--color-text-muted);">${item.subtitle}</div>` : ''}
          </div>
        </div>
        <span class="badge badge-neutral" style="font-size:10px;">${item.type}</span>
      </div>
    `).join('');

    listEl.querySelectorAll('.command-item').forEach(el => {
      el.addEventListener('click', () => {
        const idx = parseInt(el.dataset.idx, 10);
        this.executeItem(this.results[idx]);
      });
    });
  }

  executeItem(item) {
    if (!item) return;
    this.close();
    if (item.action === 'reset_data') {
      if (confirm('Reset demo records back to initial fixtures?')) {
        store.resetToDefault();
        if (this.router) this.router.handleRoute();
      }
    } else if (item.route && this.router) {
      this.router.navigate(item.route);
    }
  }

  render() {
    const overlay = document.createElement('div');
    overlay.id = 'command-palette-overlay';
    overlay.style.cssText = `
      position:fixed;inset:0;background:rgba(16,24,40,0.6);backdrop-filter:blur(4px);
      z-index:var(--z-command);display:flex;align-items:flex-start;justify-content:center;padding-top:12vh;
    `;

    overlay.innerHTML = `
      <div class="command-dialog" style="
        background:#FFFFFF;border-radius:14px;box-shadow:var(--shadow-xl);border:1px solid var(--color-border);
        width:100%;max-width:580px;overflow:hidden;display:flex;flex-direction:column;
      ">
        <div style="padding:12px 16px;border-bottom:1px solid var(--color-border);display:flex;align-items:center;gap:10px;">
          ${getIcon('search', 'text-muted', 18)}
          <input type="text" id="command-search-input" placeholder="Type a command, page name, or SKU..." style="
            border:none;outline:none;font-size:1rem;width:100%;font-family:inherit;color:var(--color-navy);
          " autofocus autocomplete="off">
          <kbd style="font-size:10px;background:#F2F4F7;border:1px solid #D0D5DD;border-radius:4px;padding:2px 6px;color:#666;">ESC</kbd>
        </div>
        <div id="command-results-list" style="max-height:360px;overflow-y:auto;padding:8px;"></div>
        <div style="padding:8px 14px;border-top:1px solid var(--color-border-subtle);background:#F9FAFB;font-size:11px;color:#98A2B3;display:flex;justify-content:space-between;">
          <span>Navigation: <kbd>↑</kbd> <kbd>↓</kbd></span>
          <span>Select: <kbd>Enter</kbd></span>
          <span>Close: <kbd>ESC</kbd></span>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    const input = overlay.querySelector('#command-search-input');
    input.focus();

    input.addEventListener('input', (e) => {
      this.search(e.target.value);
    });

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) this.close();
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.close();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (this.results.length > 0) {
          this.selectedIndex = (this.selectedIndex + 1) % this.results.length;
          this.updateResultsList();
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (this.results.length > 0) {
          this.selectedIndex = (this.selectedIndex - 1 + this.results.length) % this.results.length;
          this.updateResultsList();
        }
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (this.results[this.selectedIndex]) {
          this.executeItem(this.results[this.selectedIndex]);
        }
      }
    });

    this.search('');
  }
}

export const commandPalette = new CommandPalette();
