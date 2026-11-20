/**
 * MetriSolution Inventory ERP SaaS - Company & Information Views
 * How It Works, Security Overview, About, Contact, and Knowledgebase FAQ
 */

import { getIcon } from '../../components/icons.js';
import { toast } from '../../components/toast.js';

export function HowItWorksView() {
  const steps = [
    {
      num: '01',
      title: 'Setup Your Business & Branches in 2 Minutes',
      desc: 'Define your company profile, currency (PKR), default tax rates, and branch locations (e.g. Karachi Main, Clifton, North Nazimabad).',
      icon: 'building'
    },
    {
      num: '02',
      title: 'Import Catalog via Drag-and-Drop CSV',
      desc: 'Upload your existing product inventory list using our safe CSV importer. The system automatically validates barcodes, checks for duplicate SKUs, and configures box-to-piece ratios.',
      icon: 'upload'
    },
    {
      num: '03',
      title: 'Sell at the Counter & Transfer Between Hubs',
      desc: 'Use the dedicated POS terminal for rapid barcode checkout, cash change calculation, and instant thermal receipt printing. Transfer goods between branches with verified manifests.',
      icon: 'shopping-cart'
    },
    {
      num: '04',
      title: 'Automate WhatsApp Voice Orders & Alerts',
      desc: 'Receive customer voice notes, review AI-extracted line items, approve orders with one click, and receive automated warnings whenever inventory breaches minimum thresholds.',
      icon: 'mic'
    }
  ];

  return {
    html: `
      <section style="padding:var(--space-16) var(--space-6);background:var(--color-surface);border-bottom:1px solid var(--color-border);text-align:center;">
        <div style="max-width:800px;margin:0 auto;">
          <span class="badge badge-primary" style="margin-bottom:12px;">Frictionless Onboarding</span>
          <h1 class="text-title-1" style="margin-bottom:16px;">How MetriSolution Transforms Your Retail Operations</h1>
          <p class="text-body-lg">
            From initial registration to your first barcode scan in under ten minutes. No complex enterprise implementation cycles.
          </p>
        </div>
      </section>

      <section style="padding:var(--space-16) var(--space-6);max-width:980px;margin:0 auto;">
        <div style="display:flex;flex-direction:column;gap:36px;">
          ${steps.map(s => `
            <div class="card" style="padding:32px;display:flex;align-items:flex-start;gap:24px;">
              <div style="font-size:32px;font-weight:800;color:var(--color-primary);line-height:1;min-width:48px;">
                ${s.num}
              </div>
              <div style="flex:1;">
                <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
                  <span style="color:var(--color-primary);">${getIcon(s.icon, '', 20)}</span>
                  <h3 class="text-heading" style="font-size:18px;">${s.title}</h3>
                </div>
                <p class="text-body" style="font-size:15px;line-height:1.6;">${s.desc}</p>
              </div>
            </div>
          `).join('')}
        </div>

        <div style="text-align:center;margin-top:48px;">
          <a href="/register" data-nav class="btn btn-primary btn-lg">
            Start Your Free Onboarding Wizard
            ${getIcon('arrow-right', '', 18)}
          </a>
        </div>
      </section>
    `,
    init: () => {}
  };
}

export function SecurityOverviewView() {
  return {
    html: `
      <section style="padding:var(--space-16) var(--space-6);background:var(--color-surface);border-bottom:1px solid var(--color-border);text-align:center;">
        <div style="max-width:800px;margin:0 auto;">
          <span class="badge badge-success" style="margin-bottom:12px;">Defense-in-Depth</span>
          <h1 class="text-title-1" style="margin-bottom:16px;">Security & Trust Architecture</h1>
          <p class="text-body-lg">
            Built from the ground up to protect your sensitive business records, wholesale margins, customer identities, and financial ledgers.
          </p>
        </div>
      </section>

      <section style="padding:var(--space-16) var(--space-6);max-width:980px;margin:0 auto;">
        <div class="card" style="padding:24px;background:#F9FAFB;border-color:#E4E7EC;margin-bottom:32px;">
          <div style="display:flex;align-items:flex-start;gap:12px;">
            <div style="color:var(--color-info);margin-top:2px;">${getIcon('help-circle', '', 20)}</div>
            <div>
              <strong style="color:var(--color-navy);font-size:14px;">Prototype & Production Clarification:</strong>
              <p style="font-size:13px;color:var(--color-text-secondary);margin-top:4px;line-height:1.6;">
                This document accurately details the planned production security controls. In this client-side demonstration, session state and RBAC switching run in browser memory and local storage to enable interactive evaluation without requiring production credentials.
              </p>
            </div>
          </div>
        </div>

        <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(320px, 1fr));gap:24px;margin-bottom:48px;">
          <div class="card" style="padding:28px;">
            <div style="width:40px;height:40px;border-radius:10px;background:#ECFDF3;color:#027A48;display:flex;align-items:center;justify-content:center;margin-bottom:16px;">
              ${getIcon('lock', '', 20)}
            </div>
            <h3 class="text-heading" style="margin-bottom:8px;">Encryption in Transit</h3>
            <p class="text-body" style="font-size:14px;line-height:1.6;">
              All data transmitted between the client browser and MetriSolution servers is encrypted via TLS 1.3 with modern HSTS enforcement.
            </p>
          </div>

          <div class="card" style="padding:28px;">
            <div style="width:40px;height:40px;border-radius:10px;background:#EFF4FF;color:#2878F0;display:flex;align-items:center;justify-content:center;margin-bottom:16px;">
              ${getIcon('database', '', 20)}
            </div>
            <h3 class="text-heading" style="margin-bottom:8px;">Encryption at Rest</h3>
            <p class="text-body" style="font-size:14px;line-height:1.6;">
              Production tenant databases and automated point-in-time backups utilize industry-standard AES-256 encryption at rest.
            </p>
          </div>

          <div class="card" style="padding:28px;">
            <div style="width:40px;height:40px;border-radius:10px;background:#FEF3F2;color:#B42318;display:flex;align-items:center;justify-content:center;margin-bottom:16px;">
              ${getIcon('shield-check', '', 20)}
            </div>
            <h3 class="text-heading" style="margin-bottom:8px;">Role-Based Access Masking</h3>
            <p class="text-body" style="font-size:14px;line-height:1.6;">
              Floor staff accounts cannot view confidential wholesale procurement costs or business profit margins. Branch isolation prevents cross-store snooping.
            </p>
          </div>

          <div class="card" style="padding:28px;">
            <div style="width:40px;height:40px;border-radius:10px;background:#F4F0FF;color:var(--color-primary);display:flex;align-items:center;justify-content:center;margin-bottom:16px;">
              ${getIcon('mic', '', 20)}
            </div>
            <h3 class="text-heading" style="margin-bottom:8px;">Voice Consent & Human Approval</h3>
            <p class="text-body" style="font-size:14px;line-height:1.6;">
              AI speech extraction never commits financial transactions or inventory adjustments automatically. Authorized human approval is strictly required.
            </p>
          </div>
        </div>
      </section>
    `,
    init: () => {}
  };
}

export function AboutView() {
  return {
    html: `
      <section style="padding:var(--space-16) var(--space-6);background:var(--color-surface);border-bottom:1px solid var(--color-border);text-align:center;">
        <div style="max-width:800px;margin:0 auto;">
          <span class="badge badge-primary" style="margin-bottom:12px;">Our Mission</span>
          <h1 class="text-title-1" style="margin-bottom:16px;">Empowering Pakistani Retailers with Modern Software</h1>
          <p class="text-body-lg">
            MetriSolution was founded in Karachi with a clear goal: build software that solves the real, day-to-day challenges of local merchants and growing distribution businesses.
          </p>
        </div>
      </section>

      <section style="padding:var(--space-16) var(--space-6);max-width:860px;margin:0 auto;">
        <div class="card" style="padding:36px;margin-bottom:32px;">
          <h2 class="text-title-3" style="margin-bottom:16px;">The MetriSolution Philosophy</h2>
          <p class="text-body" style="font-size:15px;line-height:1.7;margin-bottom:16px;">
            Traditional enterprise ERPs are overly complex, exorbitantly expensive, and disconnected from the ground realities of Pakistani commerce — where goods are sold in dozens, builders order over WhatsApp, and power outages demand resilient offline-friendly interfaces.
          </p>
          <p class="text-body" style="font-size:15px;line-height:1.7;">
            We created MetriSolution to provide the sophistication of global platforms like Square and Odoo, with the welcoming simplicity required by a neighborhood hardware shop owner.
          </p>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;">
          <div class="card" style="padding:24px;">
            <div style="font-size:13px;font-weight:700;color:var(--color-primary);text-transform:uppercase;margin-bottom:6px;">Company Identity</div>
            <div style="font-size:16px;font-weight:700;color:var(--color-navy);margin-bottom:4px;">MetriSolution Pvt Ltd</div>
            <div style="font-size:13px;color:var(--color-text-secondary);">
              Registration: Pakistan SECP Compliant<br>
              HQ: Commercial Area, Phase V, DHA, Karachi<br>
              Official Website: <a href="https://metrisolution.com" target="_blank" style="color:var(--color-primary);">metrisolution.com</a>
            </div>
          </div>

          <div class="card" style="padding:24px;">
            <div style="font-size:13px;font-weight:700;color:var(--color-primary);text-transform:uppercase;margin-bottom:6px;">Design Standards</div>
            <div style="font-size:16px;font-weight:700;color:var(--color-navy);margin-bottom:4px;">WCAG 2.2 AA Accessible</div>
            <div style="font-size:13px;color:var(--color-text-secondary);">
              Tabular numerals for financial clarity<br>
              High-contrast accessibility<br>
              Fast perceived load performance
            </div>
          </div>
        </div>
      </section>
    `,
    init: () => {}
  };
}

export function ContactView() {
  return {
    html: `
      <section style="padding:var(--space-16) var(--space-6);background:var(--color-surface);border-bottom:1px solid var(--color-border);text-align:center;">
        <div style="max-width:800px;margin:0 auto;">
          <span class="badge badge-primary" style="margin-bottom:12px;">Get in Touch</span>
          <h1 class="text-title-1" style="margin-bottom:16px;">Speak with an ERP Specialist</h1>
          <p class="text-body-lg">
            Have questions regarding multi-branch setups, data migration from Excel, or hardware compatibility? Our Karachi team is here to assist.
          </p>
        </div>
      </section>

      <section style="padding:var(--space-12) var(--space-6);max-width:980px;margin:0 auto;">
        <div style="display:grid;grid-template-columns:1fr 1.3fr;gap:36px;">
          <div>
            <div class="card" style="padding:28px;margin-bottom:20px;">
              <h3 class="text-heading" style="margin-bottom:16px;">Karachi Sales & Support Office</h3>
              <div style="display:flex;flex-direction:column;gap:14px;font-size:14px;color:var(--color-text-secondary);">
                <div style="display:flex;align-items:flex-start;gap:10px;">
                  <span style="color:var(--color-primary);">${getIcon('map-pin', '', 18)}</span>
                  <span>Commercial Area, Phase V, DHA, Karachi, Pakistan</span>
                </div>
                <div style="display:flex;align-items:center;gap:10px;">
                  <span style="color:var(--color-primary);">${getIcon('phone', '', 18)}</span>
                  <span>+92 21 3582 1234 (Mon–Sat, 9am–6pm)</span>
                </div>
                <div style="display:flex;align-items:center;gap:10px;">
                  <span style="color:var(--color-primary);">${getIcon('mail', '', 18)}</span>
                  <span>sales@metrisolution.com</span>
                </div>
              </div>
            </div>

            <div class="card" style="padding:24px;background:#F4F0FF;border-color:#D6BBFB;">
              <h4 style="font-size:15px;font-weight:700;color:var(--color-navy);margin-bottom:8px;">Instant Interactive Demo</h4>
              <p style="font-size:13px;color:var(--color-text-secondary);line-height:1.6;margin-bottom:16px;">
                Want to test the software right now? You can enter any of the 5 pre-configured roles instantly without waiting for a sales call.
              </p>
              <a href="/demo-access" data-nav class="btn btn-primary btn-sm" style="width:100%;">
                Open Demo Access Switchboard
              </a>
            </div>
          </div>

          <div class="card" style="padding:32px;">
            <h3 class="text-heading" style="margin-bottom:20px;">Request a Customized Demo</h3>
            <form id="contact-sales-form">
              <div class="form-group">
                <label class="form-label" for="contact-name">Full Name <span class="required-star">*</span></label>
                <input type="text" id="contact-name" class="form-control" placeholder="e.g. Tariq Mahmood" required>
              </div>

              <div class="form-group">
                <label class="form-label" for="contact-business">Business Name <span class="required-star">*</span></label>
                <input type="text" id="contact-business" class="form-control" placeholder="e.g. Al-Madina Hardware Traders" required>
              </div>

              <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
                <div class="form-group">
                  <label class="form-label" for="contact-phone">Phone / WhatsApp <span class="required-star">*</span></label>
                  <input type="tel" id="contact-phone" class="form-control" placeholder="+92 300 1234567" required>
                </div>
                <div class="form-group">
                  <label class="form-label" for="contact-city">City</label>
                  <input type="text" id="contact-city" class="form-control" value="Karachi">
                </div>
              </div>

              <div class="form-group">
                <label class="form-label" for="contact-branches">Number of Branches</label>
                <select id="contact-branches" class="form-control">
                  <option value="1">1 Retail Store</option>
                  <option value="2-3" selected>2 to 3 Branches</option>
                  <option value="4-10">4 to 10 Branches</option>
                  <option value="10+">10+ Regional Hubs</option>
                </select>
              </div>

              <button type="submit" class="btn btn-primary btn-lg" style="width:100%;margin-top:12px;">
                Submit Demo Request
              </button>
            </form>
          </div>
        </div>
      </section>
    `,
    init: () => {
      const form = document.getElementById('contact-sales-form');
      if (form) {
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          toast.success('Thank you! A MetriSolution product specialist will reach out via WhatsApp within 2 business hours.', 'Request Received');
          form.reset();
        });
      }
    }
  };
}

export function FaqView() {
  return {
    html: `
      <section style="padding:var(--space-16) var(--space-6);background:var(--color-surface);border-bottom:1px solid var(--color-border);text-align:center;">
        <div style="max-width:800px;margin:0 auto;">
          <span class="badge badge-primary" style="margin-bottom:12px;">Knowledgebase</span>
          <h1 class="text-title-1" style="margin-bottom:16px;">Frequently Asked Questions</h1>
          <p class="text-body-lg">
            Answers to common questions regarding multi-branch inventory, POS hardware, WhatsApp voice notes, and subscription pricing.
          </p>
        </div>
      </section>

      <section style="padding:var(--space-12) var(--space-6);max-width:860px;margin:0 auto;">
        <div style="display:flex;flex-direction:column;gap:16px;">
          <details class="card" style="padding:20px 24px;cursor:pointer;" open>
            <summary style="font-weight:700;font-size:16px;color:var(--color-navy);">Can I import my existing product catalog from Excel?</summary>
            <p style="margin-top:12px;font-size:14px;color:var(--color-text-secondary);line-height:1.6;">
              Yes! You can download our sample CSV template, paste your product names, SKUs, cost prices, sale prices, and stock counts, and upload it in Step 4 of the onboarding wizard. The importer validates duplicate SKUs and checks for pricing inconsistencies automatically.
            </p>
          </details>

          <details class="card" style="padding:20px 24px;cursor:pointer;">
            <summary style="font-weight:700;font-size:16px;color:var(--color-navy);">What hardware is required for the Retail POS?</summary>
            <p style="margin-top:12px;font-size:14px;color:var(--color-text-secondary);line-height:1.6;">
              MetriSolution runs in any modern browser (Chrome, Edge, Safari, Firefox). Any standard plug-and-play USB or Bluetooth barcode scanner works instantly without drivers. For printing receipts, standard 80mm thermal receipt printers and standard A4 office printers are supported natively.
            </p>
          </details>

          <details class="card" style="padding:20px 24px;cursor:pointer;">
            <summary style="font-weight:700;font-size:16px;color:var(--color-navy);">How do inter-branch stock transfers work?</summary>
            <p style="margin-top:12px;font-size:14px;color:var(--color-text-secondary);line-height:1.6;">
              Transfers follow a verified manifest lifecycle. The destination branch requests stock; the central warehouse approves and dispatches it (deducting from central stock and marking as "in transit"); upon physical delivery, the receiving branch counts the items and confirms receipt, which increments destination stock and records any transit discrepancies.
            </p>
          </details>

          <details class="card" style="padding:20px 24px;cursor:pointer;">
            <summary style="font-weight:700;font-size:16px;color:var(--color-navy);">Can a store manager approve discounts exceeding cashier limits?</summary>
            <p style="margin-top:12px;font-size:14px;color:var(--color-text-secondary);line-height:1.6;">
              Yes. Cashiers have a configurable discount limit (e.g. maximum 5%). If a customer requests a higher discount, the POS triggers an approval request requiring Manager or Owner credentials before completing checkout.
            </p>
          </details>
        </div>
      </section>
    `,
    init: () => {}
  };
}
