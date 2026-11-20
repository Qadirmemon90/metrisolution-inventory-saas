/**
 * MetriSolution Inventory ERP SaaS - Public Pricing View
 */

import { store } from '../../services/store.js';
import { getIcon } from '../../components/icons.js';

export function PricingView(params, router) {
  const plans = store.getPlans();

  return {
    html: `
      <section style="padding:var(--space-16) var(--space-6) var(--space-10);background:var(--color-surface);border-bottom:1px solid var(--color-border);text-align:center;">
        <div style="max-width:800px;margin:0 auto;">
          <span class="badge badge-primary" style="margin-bottom:12px;">Transparent SaaS Pricing</span>
          <h1 class="text-title-1" style="margin-bottom:16px;">Plans built for every stage of retail growth</h1>
          <p class="text-body-lg" style="margin-bottom:28px;">
            No hidden setup fees, surprise hardware lock-ins, or complicated tier penalties. Upgrade or downgrade at any time.
          </p>

          <!-- Billing Period Selector -->
          <div style="display:inline-flex;align-items:center;gap:12px;background:var(--color-surface-alt);padding:6px 12px;border-radius:var(--radius-pill);border:1px solid var(--color-border);">
            <button id="pricing-monthly-btn" class="tab-pill active" style="border-radius:var(--radius-pill);font-weight:600;">Monthly Billing</button>
            <button id="pricing-annual-btn" class="tab-pill" style="border-radius:var(--radius-pill);font-weight:600;">
              Annual Billing <span class="badge badge-success" style="font-size:10px;margin-left:4px;">Save 17%</span>
            </button>
          </div>
        </div>
      </section>

      <!-- Pricing Cards Grid -->
      <section style="padding:var(--space-12) var(--space-6);max-width:var(--container-wide-width);margin:0 auto;">
        <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(280px, 1fr));gap:24px;margin-bottom:48px;">
          ${plans.map(p => {
            const isRec = p.recommended;
            return `
              <div class="card" style="padding:32px 24px;display:flex;flex-direction:column;justify-content:space-between;position:relative;${isRec ? 'border:2px solid var(--color-primary);box-shadow:var(--shadow-lg);transform:scale(1.02);' : ''}">
                ${isRec ? `
                  <div style="position:absolute;top:-13px;left:50%;transform:translateX(-50%);background:var(--color-primary);color:#FFF;padding:3px 14px;border-radius:var(--radius-pill);font-size:11px;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;">
                    Most Popular
                  </div>
                ` : ''}

                <div>
                  <div style="font-size:12px;font-weight:700;color:var(--color-text-muted);text-transform:uppercase;margin-bottom:6px;">${p.badge}</div>
                  <h3 class="text-title-3" style="margin-bottom:12px;">${p.name}</h3>

                  <div style="margin-bottom:20px;">
                    ${p.priceMonthly ? `
                      <span class="price-val" style="font-size:32px;font-weight:800;color:var(--color-navy);font-variant-numeric:tabular-nums;" data-monthly="${p.priceMonthly}" data-annual="${Math.round(p.priceAnnual / 12)}">
                        Rs. ${p.priceMonthly.toLocaleString()}
                      </span>
                      <span style="font-size:14px;color:var(--color-text-muted);">/month</span>
                      <div class="billing-note text-caption" style="color:#027A48;margin-top:2px;">Billed monthly</div>
                    ` : `
                      <span style="font-size:28px;font-weight:800;color:var(--color-navy);">Custom SLA</span>
                      <div class="text-caption" style="color:var(--color-text-muted);margin-top:2px;">Tailored enterprise volume</div>
                    `}
                  </div>

                  <hr style="border:none;border-top:1px solid var(--color-border-subtle);margin-bottom:20px;">

                  <div style="font-size:13px;font-weight:600;color:var(--color-navy);margin-bottom:12px;">Plan Limits:</div>
                  <div style="display:flex;flex-direction:column;gap:8px;font-size:13px;color:var(--color-text-secondary);margin-bottom:20px;">
                    <div style="display:flex;justify-content:space-between;">
                      <span>Connected Branches:</span>
                      <strong>${p.maxBranches === 999 ? 'Unlimited' : p.maxBranches}</strong>
                    </div>
                    <div style="display:flex;justify-content:space-between;">
                      <span>Staff Seats:</span>
                      <strong>${p.maxUsers === 999 ? 'Unlimited' : p.maxUsers}</strong>
                    </div>
                    <div style="display:flex;justify-content:space-between;">
                      <span>Active SKUs:</span>
                      <strong>${p.maxSkus.toLocaleString()}</strong>
                    </div>
                  </div>

                  <hr style="border:none;border-top:1px solid var(--color-border-subtle);margin-bottom:20px;">

                  <div style="font-size:13px;font-weight:600;color:var(--color-navy);margin-bottom:12px;">Included Features:</div>
                  <ul style="list-style:none;display:flex;flex-direction:column;gap:10px;font-size:13px;color:var(--color-text-primary);margin-bottom:28px;">
                    ${p.features.map(f => `
                      <li style="display:flex;align-items:flex-start;gap:8px;">
                        <span style="color:var(--color-success);margin-top:1px;">${getIcon('check', '', 14)}</span>
                        <span>${f}</span>
                      </li>
                    `).join('')}
                  </ul>
                </div>

                <a href="/register?plan=${p.id}" data-nav class="btn ${isRec ? 'btn-primary' : 'btn-secondary'}" style="width:100%;padding:12px;">
                  ${p.priceMonthly ? 'Start 14-Day Free Trial' : 'Contact Enterprise Sales'}
                </a>
              </div>
            `;
          }).join('')}
        </div>

        <div class="card" style="padding:20px;background:#F9FAFB;text-align:center;border-color:#E4E7EC;">
          <p style="font-size:13px;color:var(--color-text-secondary);margin:0;">
            <strong>Demonstration Notice:</strong> All pricing plans displayed here reflect proposed commercial tiers from the MetriSolution PRD. No live credit card processing or billing occurs in this demonstration environment.
          </p>
        </div>
      </section>
    `,
    init: () => {
      const monthlyBtn = document.getElementById('pricing-monthly-btn');
      const annualBtn = document.getElementById('pricing-annual-btn');
      const priceVals = document.querySelectorAll('.price-val');
      const billingNotes = document.querySelectorAll('.billing-note');

      if (monthlyBtn && annualBtn) {
        monthlyBtn.addEventListener('click', () => {
          monthlyBtn.classList.add('active');
          annualBtn.classList.remove('active');
          priceVals.forEach(el => {
            const m = parseInt(el.dataset.monthly, 10);
            if (!isNaN(m)) el.textContent = `Rs. ${m.toLocaleString()}`;
          });
          billingNotes.forEach(el => el.textContent = 'Billed monthly');
        });

        annualBtn.addEventListener('click', () => {
          annualBtn.classList.add('active');
          monthlyBtn.classList.remove('active');
          priceVals.forEach(el => {
            const a = parseInt(el.dataset.annual, 10);
            if (!isNaN(a)) el.textContent = `Rs. ${a.toLocaleString()}`;
          });
          billingNotes.forEach(el => el.textContent = 'Billed annually (2 months free)');
        });
      }
    }
  };
}
