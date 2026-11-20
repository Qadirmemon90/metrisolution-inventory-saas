/**
 * MetriSolution Inventory ERP SaaS - Authentication Experience Views
 * Login, Register, Forgot Password, Reset Password, Email Verification, and Demo Access
 */

import { store } from '../../services/store.js';
import { getIcon } from '../../components/icons.js';
import { toast } from '../../components/toast.js';

export function LoginView(params, router) {
  const users = store.getUsers();

  return {
    html: `
      <div class="auth-split-wrapper">
        <!-- Left Branding & Value Hero -->
        <div class="auth-sidebar-hero">
          <div>
            <a href="/" data-nav class="brand-logo" style="color:#FFF;margin-bottom:32px;">
              <div class="brand-icon-box" style="width:36px;height:36px;">
                ${getIcon('box', '', 20)}
              </div>
              <span>MetriSolution</span>
            </a>
            <h2 class="text-title-1" style="color:#FFF;margin-bottom:16px;">
              Manage your entire retail business from one screen.
            </h2>
            <p style="font-size:16px;color:#94A3B8;line-height:1.6;">
              Real-time multi-branch inventory, rapid touch POS, and WhatsApp voice-to-order intelligence built for Pakistani retailers.
            </p>
          </div>

          <div style="background:rgba(255,255,255,0.06);padding:20px;border-radius:12px;border:1px solid rgba(255,255,255,0.1);">
            <div style="font-size:14px;font-weight:600;color:#FFF;margin-bottom:4px;">Metro Hardware Traders</div>
            <div style="font-size:13px;color:#CBD5E1;">"MetriSolution cut our weekend checkout rush queues by half and completely eliminated inventory discrepancies across our branches."</div>
            <div style="font-size:12px;color:#94A3B8;margin-top:8px;">— Abdul Qadir, Karachi</div>
          </div>
        </div>

        <!-- Right Form Container -->
        <div class="auth-form-container">
          <div class="auth-card">
            <div class="auth-card-header">
              <h2>Welcome back</h2>
              <p class="text-body-sm">Sign in to your MetriSolution workspace</p>
            </div>

            <!-- Quick Demo 1-Click Role Switcher -->
            <div style="background:#F4F0FF;border:1px solid #D6BBFB;border-radius:10px;padding:14px;margin-bottom:24px;">
              <div style="font-size:12px;font-weight:700;color:var(--color-primary);text-transform:uppercase;margin-bottom:8px;display:flex;align-items:center;gap:6px;">
                ${getIcon('shield-check', '', 14)} 1-Click Demo Login
              </div>
              <div style="display:flex;flex-wrap:wrap;gap:6px;">
                <button class="btn btn-secondary btn-sm quick-role-fill" data-email="owner@metrohardware.pk" data-role="OWNER" style="font-size:11px;padding:4px 8px;">
                  Owner (Abdul Qadir)
                </button>
                <button class="btn btn-secondary btn-sm quick-role-fill" data-email="manager@metrohardware.pk" data-role="MANAGER" style="font-size:11px;padding:4px 8px;">
                  Manager (Tariq)
                </button>
                <button class="btn btn-secondary btn-sm quick-role-fill" data-email="cashier@metrohardware.pk" data-role="SALES" style="font-size:11px;padding:4px 8px;">
                  Sales (Bilal)
                </button>
                <button class="btn btn-secondary btn-sm quick-role-fill" data-email="warehouse@metrohardware.pk" data-role="WAREHOUSE" style="font-size:11px;padding:4px 8px;">
                  Warehouse (Farhan)
                </button>
                <button class="btn btn-secondary btn-sm quick-role-fill" data-email="admin@metrisolution.com" data-role="PLATFORM_ADMIN" style="font-size:11px;padding:4px 8px;">
                  Platform Admin
                </button>
              </div>
            </div>

            <form id="login-form">
              <div class="form-group">
                <label class="form-label" for="login-email">Email Address <span class="required-star">*</span></label>
                <input type="email" id="login-email" class="form-control" value="owner@metrohardware.pk" required>
              </div>

              <div class="form-group">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
                  <label class="form-label" for="login-password" style="margin-bottom:0;">Password <span class="required-star">*</span></label>
                  <a href="/forgot-password" data-nav class="text-caption text-primary" style="text-decoration:none;">Forgot password?</a>
                </div>
                <div class="input-with-icon">
                  <input type="password" id="login-password" class="form-control" value="demo1234" required>
                  <button type="button" id="toggle-pwd-btn" class="input-action-right" aria-label="Toggle password visibility">
                    ${getIcon('eye', '', 16)}
                  </button>
                </div>
              </div>

              <button type="submit" class="btn btn-primary btn-lg" style="width:100%;margin-top:12px;">
                Sign In to Workspace
              </button>
            </form>

            <div style="text-align:center;margin-top:24px;font-size:14px;color:var(--color-text-secondary);">
              Don't have an account? <a href="/register" data-nav class="text-primary font-semibold" style="text-decoration:none;">Start 14-day free trial</a>
            </div>
          </div>
        </div>
      </div>
    `,
    init: () => {
      const form = document.getElementById('login-form');
      const emailInput = document.getElementById('login-email');
      const pwdInput = document.getElementById('login-password');
      const togglePwdBtn = document.getElementById('toggle-pwd-btn');

      if (togglePwdBtn && pwdInput) {
        togglePwdBtn.addEventListener('click', () => {
          pwdInput.type = pwdInput.type === 'password' ? 'text' : 'password';
        });
      }

      document.querySelectorAll('.quick-role-fill').forEach(btn => {
        btn.addEventListener('click', () => {
          emailInput.value = btn.dataset.email;
          const role = btn.dataset.role;
          store.setCurrentUserByRole(role);
          toast.success(`Demo credentials filled for ${role}`);
        });
      });

      if (form) {
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          const email = emailInput.value.trim();
          const matchedUser = store.getUsers().find(u => u.email.toLowerCase() === email.toLowerCase());

          if (matchedUser) {
            store.setCurrentUserByRole(matchedUser.role);
            toast.success(`Welcome back, ${matchedUser.name}!`);
            if (matchedUser.role === 'PLATFORM_ADMIN') {
              router.navigate('/platform/dashboard');
            } else if (matchedUser.role === 'SALES') {
              router.navigate('/app/pos');
            } else {
              router.navigate('/app/dashboard');
            }
          } else {
            toast.error('Unrecognized email in demo environment. Please click one of the quick fill buttons above.');
          }
        });
      }
    }
  };
}

export function RegisterView(params, router) {
  return {
    html: `
      <div class="auth-split-wrapper">
        <div class="auth-sidebar-hero">
          <div>
            <a href="/" data-nav class="brand-logo" style="color:#FFF;margin-bottom:32px;">
              <div class="brand-icon-box" style="width:36px;height:36px;">
                ${getIcon('box', '', 20)}
              </div>
              <span>MetriSolution</span>
            </a>
            <h2 class="text-title-1" style="color:#FFF;margin-bottom:16px;">
              Start your 14-day free retail evaluation.
            </h2>
            <p style="font-size:16px;color:#94A3B8;line-height:1.6;">
              No credit card required. Full access to multi-branch inventory, high-speed POS, and WhatsApp voice order processing.
            </p>
          </div>
          <div style="font-size:13px;color:#94A3B8;">
            Trusted by over 400+ retailers in Karachi, Lahore, and Rawalpindi.
          </div>
        </div>

        <div class="auth-form-container">
          <div class="auth-card">
            <div class="auth-card-header">
              <h2>Create your business account</h2>
              <p class="text-body-sm">Get started with your free 14-day trial</p>
            </div>

            <form id="register-form">
              <div class="form-group">
                <label class="form-label" for="reg-biz-name">Business / Store Name <span class="required-star">*</span></label>
                <input type="text" id="reg-biz-name" class="form-control" placeholder="e.g. Al-Razaq Hardware & Electricals" required>
              </div>

              <div class="form-group">
                <label class="form-label" for="reg-owner-name">Owner Full Name <span class="required-star">*</span></label>
                <input type="text" id="reg-owner-name" class="form-control" placeholder="e.g. Muhammad Aslam" required>
              </div>

              <div class="form-group">
                <label class="form-label" for="reg-email">Business Email <span class="required-star">*</span></label>
                <input type="email" id="reg-email" class="form-control" placeholder="aslam.hardware@gmail.com" required>
              </div>

              <div class="form-group">
                <label class="form-label" for="reg-password">Password <span class="required-star">*</span></label>
                <input type="password" id="reg-password" class="form-control" placeholder="At least 8 characters" required minlength="6">
              </div>

              <button type="submit" class="btn btn-primary btn-lg" style="width:100%;margin-top:12px;">
                Create Account & Start Setup
              </button>
            </form>

            <div style="text-align:center;margin-top:24px;font-size:14px;color:var(--color-text-secondary);">
              Already have an account? <a href="/login" data-nav class="text-primary font-semibold" style="text-decoration:none;">Sign in</a>
            </div>
          </div>
        </div>
      </div>
    `,
    init: () => {
      const form = document.getElementById('register-form');
      if (form) {
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          const bizName = document.getElementById('reg-biz-name').value.trim();
          toast.success(`Account registered for ${bizName}! Proceeding to Business Setup Wizard...`);
          router.navigate('/setup/business');
        });
      }
    }
  };
}

export function ForgotPasswordView(params, router) {
  return {
    html: `
      <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px;background:var(--color-canvas);">
        <div class="card" style="max-width:440px;width:100%;padding:36px;">
          <div style="margin-bottom:24px;text-align:center;">
            <div style="width:48px;height:48px;border-radius:12px;background:var(--color-primary-soft);color:var(--color-primary);display:flex;align-items:center;justify-content:center;margin:0 auto 16px;">
              ${getIcon('lock', '', 24)}
            </div>
            <h2 class="text-title-3">Forgot your password?</h2>
            <p class="text-body-sm" style="margin-top:6px;">No worries. Enter your registered email and we'll send you reset instructions.</p>
          </div>

          <form id="forgot-form">
            <div class="form-group">
              <label class="form-label" for="forgot-email">Account Email</label>
              <input type="email" id="forgot-email" class="form-control" value="owner@metrohardware.pk" required>
            </div>
            <button type="submit" class="btn btn-primary" style="width:100%;margin-top:8px;">Send Reset Link</button>
          </form>

          <div style="text-align:center;margin-top:24px;">
            <a href="/login" data-nav class="text-caption text-primary font-semibold" style="text-decoration:none;">
              ${getIcon('arrow-right', 'rotate-180', 12)} Back to Login
            </a>
          </div>
        </div>
      </div>
    `,
    init: () => {
      const form = document.getElementById('forgot-form');
      if (form) {
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          toast.success('Password reset instructions simulated to your email inbox.', 'Link Sent');
          router.navigate('/login');
        });
      }
    }
  };
}

export function DemoAccessView(params, router) {
  const roles = [
    {
      id: 'OWNER',
      name: 'Abdul Qadir',
      roleTitle: 'Business Owner (Primary Persona)',
      email: 'owner@metrohardware.pk',
      scope: 'Full visibility: Financial margins, inventory valuation, branch settings, billing, AI draft and discount approvals.',
      defaultRoute: '/app/dashboard',
      badgeClass: 'badge-primary'
    },
    {
      id: 'MANAGER',
      name: 'Tariq Mahmood',
      roleTitle: 'Branch Manager (Clifton)',
      email: 'manager@metrohardware.pk',
      scope: 'Operational branch oversight: Stock transfers, receiving, POS supervision, discount & voice draft approvals.',
      defaultRoute: '/app/dashboard',
      badgeClass: 'badge-info'
    },
    {
      id: 'SALES',
      name: 'Bilal Ahmed',
      roleTitle: 'Sales & Counter Cashier',
      email: 'cashier@metrohardware.pk',
      scope: 'Fast retail POS register, barcode lookup, order entry. (Wholesale costs and profit margins strictly masked).',
      defaultRoute: '/app/pos',
      badgeClass: 'badge-success'
    },
    {
      id: 'WAREHOUSE',
      name: 'Farhan Saeed',
      roleTitle: 'Warehouse & Stock Specialist',
      email: 'warehouse@metrohardware.pk',
      scope: 'Goods receiving dock, cycle counts, inter-branch transfer manifests, rack and shelf management.',
      defaultRoute: '/app/stock/receiving',
      badgeClass: 'badge-warning'
    },
    {
      id: 'PLATFORM_ADMIN',
      name: 'Zainab Malik',
      roleTitle: 'Platform Operator & SaaS Admin',
      email: 'admin@metrisolution.com',
      scope: 'Global SaaS fleet management: Tenant provisioning, subscription plan configuration, usage quotas, platform health.',
      defaultRoute: '/platform/dashboard',
      badgeClass: 'badge-danger'
    }
  ];

  return {
    html: `
      <section style="padding:var(--space-12) var(--space-6);background:var(--color-surface);border-bottom:1px solid var(--color-border);text-align:center;">
        <div style="max-width:800px;margin:0 auto;">
          <span class="badge badge-primary" style="margin-bottom:12px;">Interactive Demo Switchboard</span>
          <h1 class="text-title-1" style="margin-bottom:16px;">Test MetriSolution Across All 5 Personas</h1>
          <p class="text-body-lg">
            Experience realistic role-based access control (RBAC), view masking, and specialized operational workflows.
          </p>
        </div>
      </section>

      <section style="padding:var(--space-12) var(--space-6);max-width:980px;margin:0 auto;">
        <div style="display:flex;flex-direction:column;gap:16px;">
          ${roles.map(r => `
            <div class="card" style="padding:24px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:16px;">
              <div style="flex:1;min-width:280px;">
                <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px;">
                  <h3 class="text-heading" style="margin:0;">${r.name}</h3>
                  <span class="badge ${r.badgeClass}">${r.roleTitle}</span>
                </div>
                <div style="font-size:12px;color:#98A2B3;font-family:monospace;margin-bottom:8px;">${r.email}</div>
                <p style="font-size:13px;color:var(--color-text-secondary);line-height:1.5;margin:0;">${r.scope}</p>
              </div>

              <div>
                <button class="btn btn-primary enter-persona-btn" data-role="${r.id}" data-route="${r.defaultRoute}">
                  Enter Workspace as ${r.name.split(' ')[0]}
                  ${getIcon('arrow-right', '', 14)}
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </section>
    `,
    init: () => {
      document.querySelectorAll('.enter-persona-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const role = btn.dataset.role;
          const route = btn.dataset.route;
          store.setCurrentUserByRole(role);
          toast.success(`Active persona switched to ${role}`);
          router.navigate(route);
        });
      });
    }
  };
}
