/**
 * MetriSolution Inventory ERP SaaS - Client-Side SPA Router
 * Supports dynamic path parameters, RBAC guards, and layout orchestration.
 */

import { checkRouteAccess } from './guards.js';
import { renderDemoBar, bindDemoBarEvents } from '../components/demoBar.js';
import { renderPublicNavbar, bindPublicNavbarEvents } from '../components/navbar.js';
import { renderSidebar, bindSidebarEvents } from '../components/sidebar.js';
import { renderTopbar, bindTopbarEvents } from '../components/topbar.js';
import { store } from '../services/store.js';
import { getIcon } from '../components/icons.js';

export class Router {
  constructor(routes = {}) {
    this.routes = routes;
    this.currentRoute = null;
    this.params = {};
    this.appRoot = document.getElementById('app');

    // Intercept clicks on links
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[data-nav], a:not([target="_blank"]):not([download]):not([href^="http"]):not([href^="mailto:"]):not([href^="tel:"])');
      if (link && link.getAttribute('href') && !link.getAttribute('href').startsWith('#')) {
        const href = link.getAttribute('href');
        // Ignore external or print links
        if (!href.startsWith('http') && !href.startsWith('//') && !href.startsWith('javascript:')) {
          e.preventDefault();
          this.navigate(href);
        }
      }
    });

    // Listen to browser Back/Forward
    window.addEventListener('popstate', () => {
      this.handleRoute();
    });
  }

  register(path, handler) {
    this.routes[path] = handler;
  }

  navigate(path) {
    if (window.location.pathname === path && window.location.search === '') {
      return;
    }
    window.history.pushState({}, '', path);
    this.handleRoute();
  }

  matchRoute(pathname) {
    // 1. Direct match
    if (this.routes[pathname]) {
      return { handler: this.routes[pathname], params: {} };
    }

    // 2. Dynamic pattern matching (:id)
    for (const pattern in this.routes) {
      if (!pattern.includes(':')) continue;

      const patternParts = pattern.split('/');
      const pathParts = pathname.split('/');

      if (patternParts.length !== pathParts.length) continue;

      const params = {};
      let match = true;

      for (let i = 0; i < patternParts.length; i++) {
        if (patternParts[i].startsWith(':')) {
          const paramName = patternParts[i].slice(1);
          params[paramName] = decodeURIComponent(pathParts[i]);
        } else if (patternParts[i] !== pathParts[i]) {
          match = false;
          break;
        }
      }

      if (match) {
        return { handler: this.routes[pattern], params };
      }
    }

    return null;
  }

  handleRoute() {
    const pathname = window.location.pathname;
    const match = this.matchRoute(pathname);

    // 1. Check Role-Based Access Control
    const access = checkRouteAccess(pathname);
    if (!access.allowed) {
      this.renderAccessDenied(pathname, access);
      return;
    }

    // 2. Handle 404
    if (!match) {
      this.renderNotFound(pathname);
      return;
    }

    this.params = match.params;
    this.currentRoute = pathname;

    // 3. Render View inside Appropriate Shell
    const isPublic = !pathname.startsWith('/app') && !pathname.startsWith('/platform') && !pathname.startsWith('/setup') && !pathname.startsWith('/login') && !pathname.startsWith('/register') && !pathname.startsWith('/forgot-password') && !pathname.startsWith('/reset-password') && !pathname.startsWith('/verify-email') && !pathname.startsWith('/demo-access');
    const isAuth = pathname.startsWith('/login') || pathname.startsWith('/register') || pathname.startsWith('/forgot-password') || pathname.startsWith('/reset-password') || pathname.startsWith('/verify-email') || pathname.startsWith('/demo-access') || pathname.startsWith('/setup');
    const isErpOrAdmin = pathname.startsWith('/app') || pathname.startsWith('/platform');

    try {
      const viewResult = match.handler(this.params, this);
      const htmlContent = typeof viewResult === 'string' ? viewResult : (viewResult.html || '');

      if (isPublic) {
        this.appRoot.innerHTML = `
          ${renderDemoBar(pathname)}
          <div class="public-layout">
            ${renderPublicNavbar(pathname)}
            <main id="main-content" style="flex:1;">
              ${htmlContent}
            </main>
            ${this.renderPublicFooter()}
          </div>
        `;
        bindPublicNavbarEvents(this);
      } else if (isAuth) {
        this.appRoot.innerHTML = `
          ${renderDemoBar(pathname)}
          <main class="auth-layout" id="main-content">
            ${htmlContent}
          </main>
        `;
      } else if (isErpOrAdmin) {
        const existingErpLayout = document.querySelector('.erp-layout');
        const isCurrentlyPlatform = !!document.querySelector('.erp-sidebar[aria-label="Platform Admin Sidebar"]');
        const isTargetPlatform = pathname.startsWith('/platform');

        // Smooth in-place route swap if already inside the corresponding ERP/Platform shell
        if (existingErpLayout && ((isCurrentlyPlatform && isTargetPlatform) || (!isCurrentlyPlatform && !isTargetPlatform))) {
          const mainContent = document.getElementById('main-content');
          if (mainContent) {
            mainContent.innerHTML = htmlContent;
            mainContent.scrollTop = 0;
          }

          // Update active links without touching or resetting sidebar DOM or scrollbar
          document.querySelectorAll('.sidebar-nav-item').forEach(item => {
            const href = item.getAttribute('href');
            if (!href) return;
            const isActive = href === pathname || (href !== '/app/dashboard' && href !== '/platform/dashboard' && pathname.startsWith(href));
            item.classList.toggle('active', isActive);
          });

          bindTopbarEvents(this);
          bindDemoBarEvents(this);

          if (viewResult && typeof viewResult.init === 'function') {
            viewResult.init(this);
          }
          return;
        }

        // Full shell render with scroll preservation
        const prevSidebarScroll = document.querySelector('.sidebar-nav-scroll');
        const savedScrollTop = prevSidebarScroll ? prevSidebarScroll.scrollTop : (window.__sidebarScrollTop || 0);

        this.appRoot.innerHTML = `
          ${renderDemoBar(pathname)}
          <div class="erp-layout">
            ${renderSidebar(pathname)}
            <div class="erp-main-area">
              ${renderTopbar()}
              <main class="erp-content-viewport" id="main-content" tabindex="-1">
                ${htmlContent}
              </main>
            </div>
          </div>
        `;
        bindSidebarEvents();
        bindTopbarEvents(this);

        const newSidebarScroll = document.querySelector('.sidebar-nav-scroll');
        if (newSidebarScroll && savedScrollTop > 0) {
          newSidebarScroll.scrollTop = savedScrollTop;
          window.__sidebarScrollTop = savedScrollTop;
        }
      }

      bindDemoBarEvents(this);

      // Execute view after-render hooks if provided
      if (viewResult && typeof viewResult.init === 'function') {
        viewResult.init(this);
      }

      window.scrollTo(0, 0);
    } catch (err) {
      console.error(`Error rendering route ${pathname}:`, err);
      this.appRoot.innerHTML = `
        ${renderDemoBar(pathname)}
        <div style="padding:48px;max-width:600px;margin:40px auto;background:#FFF;border:1px solid var(--color-border);border-radius:12px;">
          <h2 style="color:var(--color-danger);margin-bottom:12px;">View Rendering Error</h2>
          <p style="color:var(--color-text-secondary);font-size:14px;margin-bottom:16px;">${err.message}</p>
          <pre style="background:#F2F4F7;padding:12px;border-radius:6px;font-size:12px;overflow:auto;">${err.stack}</pre>
          <button class="btn btn-primary" onclick="window.history.back()" style="margin-top:16px;">Go Back</button>
        </div>
      `;
      bindDemoBarEvents(this);
    }
  }

  renderAccessDenied(pathname, access) {
    const currentUser = store.getCurrentUser();
    this.appRoot.innerHTML = `
      ${renderDemoBar(pathname)}
      <div class="auth-layout" style="display:flex;align-items:center;justify-content:center;padding:24px;">
        <div class="card" style="max-width:540px;width:100%;padding:36px;text-align:center;">
          <div style="width:64px;height:64px;border-radius:50%;background:var(--color-danger-soft);color:var(--color-danger);display:flex;align-items:center;justify-content:center;margin:0 auto 16px;">
            ${getIcon('lock', '', 32)}
          </div>
          <span class="badge badge-danger" style="margin-bottom:12px;">403 Access Denied</span>
          <h2 style="font-size:24px;color:var(--color-navy);margin-bottom:12px;">Role Permission Restriction</h2>
          <p style="color:var(--color-text-secondary);font-size:15px;line-height:1.6;margin-bottom:20px;">
            ${access.reason}
          </p>
          <div style="background:#F9FAFB;border:1px solid #E4E7EC;border-radius:8px;padding:12px;margin-bottom:24px;font-size:13px;color:#475467;">
            Current Active Role: <strong>${currentUser.role}</strong> (${currentUser.name})<br>
            Required Authorization: <strong>${access.requiredRole}</strong>
          </div>
          <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">
            <button id="btn-switch-required-role" class="btn btn-primary">
              Switch to ${access.requiredRole} Role
            </button>
            <a href="/app/dashboard" data-nav class="btn btn-secondary">
              Back to Dashboard
            </a>
          </div>
        </div>
      </div>
    `;
    bindDemoBarEvents(this);

    const switchBtn = document.getElementById('btn-switch-required-role');
    if (switchBtn) {
      switchBtn.addEventListener('click', () => {
        store.setCurrentUserByRole(access.requiredRole);
        this.handleRoute();
      });
    }
  }

  renderNotFound(pathname) {
    this.appRoot.innerHTML = `
      ${renderDemoBar(pathname)}
      <div class="auth-layout" style="display:flex;align-items:center;justify-content:center;padding:24px;">
        <div class="card" style="max-width:500px;width:100%;padding:36px;text-align:center;">
          <div style="font-size:48px;font-weight:800;color:var(--color-primary);margin-bottom:8px;">404</div>
          <h2 style="font-size:22px;color:var(--color-navy);margin-bottom:8px;">Page Not Found</h2>
          <p style="color:var(--color-text-secondary);font-size:14px;margin-bottom:24px;">
            The requested route <code>${pathname}</code> is not available in this demonstration workspace.
          </p>
          <div style="display:flex;gap:10px;justify-content:center;">
            <a href="/" data-nav class="btn btn-secondary">Homepage</a>
            <a href="/app/dashboard" data-nav class="btn btn-primary">Tenant Dashboard</a>
          </div>
        </div>
      </div>
    `;
    bindDemoBarEvents(this);
  }

  renderPublicFooter() {
    return `
      <footer class="public-footer">
        <div class="footer-container">
          <div class="footer-grid">
            <div>
              <div class="brand-logo" style="margin-bottom:12px;">
                <div class="brand-icon-box" style="width:28px;height:28px;">
                  ${getIcon('box', '', 16)}
                </div>
                <span>MetriSolution</span>
              </div>
              <p style="color:var(--color-text-secondary);font-size:0.875rem;line-height:1.6;margin-bottom:16px;">
                Retail-first inventory and operations management SaaS built for Pakistani retailers, hardware merchants, and multi-branch distribution businesses.
              </p>
              <div style="font-size:0.8125rem;color:var(--color-text-muted);">
                Headquartered in Karachi, Pakistan.<br>
                Official Website: <a href="https://metrisolution.com" target="_blank" style="color:var(--color-primary);">metrisolution.com</a>
              </div>
            </div>

            <div>
              <div class="footer-col-title">Product</div>
              <ul class="footer-links-list">
                <li><a href="/features" data-nav class="footer-link">Features Overview</a></li>
                <li><a href="/features/inventory" data-nav class="footer-link">Inventory Management</a></li>
                <li><a href="/features/pos" data-nav class="footer-link">Retail POS & Checkout</a></li>
                <li><a href="/features/ai-voice" data-nav class="footer-link">WhatsApp Voice AI</a></li>
                <li><a href="/features/warehouse" data-nav class="footer-link">Multi-Branch Transfers</a></li>
                <li><a href="/pricing" data-nav class="footer-link">Pricing & Plans</a></li>
              </ul>
            </div>

            <div>
              <div class="footer-col-title">Solutions</div>
              <ul class="footer-links-list">
                <li><a href="/solutions/retail" data-nav class="footer-link">Retail & General Stores</a></li>
                <li><a href="/solutions/hardware" data-nav class="footer-link">Hardware & Tools</a></li>
                <li><a href="/solutions/wholesale" data-nav class="footer-link">Wholesale & Distribution</a></li>
                <li><a href="/how-it-works" data-nav class="footer-link">How It Works</a></li>
                <li><a href="/security" data-nav class="footer-link">Security Center</a></li>
                <li><a href="/faq" data-nav class="footer-link">Knowledgebase & FAQ</a></li>
              </ul>
            </div>

            <div>
              <div class="footer-col-title">Company</div>
              <ul class="footer-links-list">
                <li><a href="/about" data-nav class="footer-link">About Us</a></li>
                <li><a href="/contact" data-nav class="footer-link">Sales & Demo</a></li>
                <li><a href="/demo-access" data-nav class="footer-link">Demo Access Switchboard</a></li>
                <li><a href="/login" data-nav class="footer-link">Customer Login</a></li>
                <li><a href="/register" data-nav class="footer-link">Start Free Trial</a></li>
              </ul>
            </div>

            <div>
              <div class="footer-col-title">Legal & Trust</div>
              <ul class="footer-links-list">
                <li><a href="/privacy" data-nav class="footer-link">Privacy Policy</a></li>
                <li><a href="/terms" data-nav class="footer-link">Terms of Service</a></li>
                <li><a href="/cookies" data-nav class="footer-link">Cookie Notice</a></li>
                <li><a href="/acceptable-use" data-nav class="footer-link">Acceptable Use</a></li>
                <li><a href="/data-processing" data-nav class="footer-link">Data Processing (DPA)</a></li>
                <li><a href="/security-policy" data-nav class="footer-link">Security Policy</a></li>
                <li><a href="/subprocessors" data-nav class="footer-link">Subprocessors</a></li>
                <li><a href="/refund-policy" data-nav class="footer-link">Refund Policy</a></li>
                <li><a href="/subscription-policy" data-nav class="footer-link">Subscription Policy</a></li>
              </ul>
            </div>
          </div>

          <div class="footer-bottom">
            <div>
              © 2026 MetriSolution Pvt Ltd. All rights reserved. Built for modern Pakistani retailers.
            </div>
            <div style="display:flex;gap:16px;">
              <span class="badge badge-neutral" style="font-size:11px;">Default Currency: PKR</span>
              <span class="badge badge-neutral" style="font-size:11px;">Timezone: Asia/Karachi</span>
            </div>
          </div>
        </div>
      </footer>
    `;
  }
}
