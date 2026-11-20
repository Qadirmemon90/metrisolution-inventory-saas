/**
 * MetriSolution Inventory ERP SaaS - Public Marketing Navbar & Mobile Drawer
 */

import { getIcon, getBrandLogo } from './icons.js';

export function renderPublicNavbar(currentPath = '/') {
  return `
    <header class="public-navbar">
      <div class="nav-container">
        <a href="/" data-nav class="brand-logo" aria-label="MetriSolution Homepage">
          ${getBrandLogo(34)}
          <span>MetriSolution</span>
        </a>

        <nav class="public-nav-links" aria-label="Main Navigation">
          <a href="/features" data-nav class="nav-link ${currentPath.startsWith('/features') ? 'active' : ''}">
            Features
          </a>
          <a href="/solutions" data-nav class="nav-link ${currentPath.startsWith('/solutions') ? 'active' : ''}">
            Solutions
          </a>
          <a href="/pricing" data-nav class="nav-link ${currentPath === '/pricing' ? 'active' : ''}">
            Pricing
          </a>
          <a href="/how-it-works" data-nav class="nav-link ${currentPath === '/how-it-works' ? 'active' : ''}">
            How It Works
          </a>
          <a href="/security" data-nav class="nav-link ${currentPath === '/security' ? 'active' : ''}">
            Security
          </a>
          <a href="/contact" data-nav class="nav-link ${currentPath === '/contact' ? 'active' : ''}">
            Contact
          </a>
        </nav>

        <div class="public-nav-actions">
          <a href="/login" data-nav class="btn btn-ghost btn-sm btn-login">
            Log In
          </a>
          <a href="/register" data-nav class="btn btn-primary btn-sm">
            Start Free Trial
          </a>
          <button id="mobile-menu-btn" class="mobile-menu-toggle" aria-label="Open Navigation Menu">
            ${getIcon('menu', '', 22)}
          </button>
        </div>
      </div>
    </header>

    <!-- Mobile Drawer -->
    <div id="mobile-nav-drawer" class="mobile-nav-drawer" style="display:none;">
      <div class="mobile-drawer-header">
        <div class="brand-logo">
          ${getBrandLogo(30)}
          <span>MetriSolution</span>
        </div>
        <button id="close-mobile-drawer" class="btn btn-ghost btn-icon-only">
          ${getIcon('x', '', 20)}
        </button>
      </div>
      <div class="mobile-drawer-body">
        <a href="/features" data-nav class="mobile-nav-item">Features Overview</a>
        <a href="/features/inventory" data-nav class="mobile-nav-item">Inventory & Stock</a>
        <a href="/features/pos" data-nav class="mobile-nav-item">Retail POS</a>
        <a href="/features/ai-voice" data-nav class="mobile-nav-item">WhatsApp Voice AI</a>
        <a href="/solutions" data-nav class="mobile-nav-item">Industry Solutions</a>
        <a href="/pricing" data-nav class="mobile-nav-item">Pricing & Plans</a>
        <a href="/how-it-works" data-nav class="mobile-nav-item">How It Works</a>
        <a href="/security" data-nav class="mobile-nav-item">Security Center</a>
        <a href="/about" data-nav class="mobile-nav-item">About MetriSolution</a>
        <a href="/faq" data-nav class="mobile-nav-item">FAQ</a>
        <hr style="border:none;border-top:1px solid var(--color-border);margin:16px 0;">
        <a href="/login" data-nav class="btn btn-secondary" style="width:100%;margin-bottom:8px;">Sign In</a>
        <a href="/register" data-nav class="btn btn-primary" style="width:100%;">Start Free Trial</a>
      </div>
    </div>
  `;
}

export function bindPublicNavbarEvents(router) {
  const toggleBtn = document.getElementById('mobile-menu-btn');
  const drawer = document.getElementById('mobile-nav-drawer');
  const closeBtn = document.getElementById('close-mobile-drawer');

  if (toggleBtn && drawer) {
    toggleBtn.addEventListener('click', () => {
      drawer.style.display = drawer.style.display === 'none' ? 'flex' : 'none';
      drawer.style.flexDirection = 'column';
    });
  }

  if (closeBtn && drawer) {
    closeBtn.addEventListener('click', () => {
      drawer.style.display = 'none';
    });
  }
}
