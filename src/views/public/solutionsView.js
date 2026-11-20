/**
 * MetriSolution Inventory ERP SaaS - Industry Solutions Views
 */

import { getIcon } from '../../components/icons.js';

const SOLUTIONS = {
  'retail': {
    title: 'Solutions for General Stores & Consumer Retail',
    tagline: 'High-speed barcode scanning, fast customer checkout, and automated low-stock replenishment.',
    icon: 'shopping-bag',
    focus: [
      'High-velocity counter POS handling dozens of items per minute.',
      'Instant barcode scanner support for standard EAN-13 and UPC formats.',
      'Flexible payment handling: Cash tender calculator, bank transfers, credit cards.',
      'Automated daily sales reports and cash register reconciliation.'
    ],
    exampleStore: 'City Supermarket & Electronics, DHA Karachi'
  },
  'hardware': {
    title: 'Solutions for Hardware, Tools & Electrical Merchants',
    tagline: 'Master cartons, dozens, and loose pieces managed seamlessly in one unified inventory engine.',
    icon: 'package',
    focus: [
      'Box-to-piece conversions (e.g. 1 master box = 12 door locks or 500 screws).',
      'Multi-zone warehouse bins: Branch → Warehouse → Zone → Rack → Shelf.',
      'Wholesale contractor accounts with trade credit limits and quotation workflows.',
      'WhatsApp Voice-to-Order AI: Receive voice notes from builders and convert directly to drafts.'
    ],
    exampleStore: 'Metro Hardware Traders, Badar Commercial, Karachi'
  },
  'wholesale': {
    title: 'Solutions for Wholesale Distributors & Multi-Branch Hubs',
    tagline: 'Connect central warehouses, fleet distribution manifests, and regional branch depots.',
    icon: 'truck',
    focus: [
      'Inter-branch stock transfers with physical receiving manifests and variance resolution.',
      'Wholesale price tiers and volume-based discount permissions.',
      'Formal quotation lifecycle with expiry dates and instant sales order conversion.',
      'Comprehensive inventory valuation reports on both cost and wholesale price bases.'
    ],
    exampleStore: 'Sindh Industrial Supplies & Distribution Co.'
  }
};

export function SolutionsOverviewView() {
  return {
    html: `
      <section style="padding:var(--space-16) var(--space-6);background:var(--color-surface);border-bottom:1px solid var(--color-border);text-align:center;">
        <div style="max-width:800px;margin:0 auto;">
          <span class="badge badge-primary" style="margin-bottom:12px;">Tailored by Industry</span>
          <h1 class="text-title-1" style="margin-bottom:16px;">Built for the exact way your business operates</h1>
          <p class="text-body-lg">
            Whether you run a fast-paced retail counter or coordinate multi-branch wholesale fleets, MetriSolution adapts to your operational workflow.
          </p>
        </div>
      </section>

      <section style="padding:var(--space-12) var(--space-6);max-width:var(--container-max-width);margin:0 auto;">
        <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(340px, 1fr));gap:24px;">
          ${Object.entries(SOLUTIONS).map(([key, s]) => `
            <div class="card" style="padding:32px;display:flex;flex-direction:column;justify-content:space-between;">
              <div>
                <div style="width:48px;height:48px;border-radius:12px;background:var(--color-primary-soft);color:var(--color-primary);display:flex;align-items:center;justify-content:center;margin-bottom:20px;">
                  ${getIcon(s.icon, '', 24)}
                </div>
                <h3 class="text-title-3" style="margin-bottom:12px;">${s.title}</h3>
                <p class="text-body" style="font-size:14px;line-height:1.6;margin-bottom:20px;">${s.tagline}</p>
                
                <ul style="list-style:none;display:flex;flex-direction:column;gap:10px;font-size:13px;color:var(--color-text-secondary);margin-bottom:24px;">
                  ${s.focus.map(f => `
                    <li style="display:flex;align-items:flex-start;gap:8px;">
                      <span style="color:var(--color-success);margin-top:2px;">${getIcon('check', '', 14)}</span>
                      <span>${f}</span>
                    </li>
                  `).join('')}
                </ul>
              </div>

              <div style="padding-top:20px;border-top:1px solid var(--color-border-subtle);display:flex;align-items:center;justify-content:space-between;">
                <a href="/solutions/${key}" data-nav class="text-primary font-semibold" style="font-size:13px;display:inline-flex;align-items:center;gap:4px;text-decoration:none;">
                  Read Industry Case Study ${getIcon('arrow-right', '', 14)}
                </a>
                <a href="/app/dashboard" data-nav class="btn btn-secondary btn-sm">Demo</a>
              </div>
            </div>
          `).join('')}
        </div>
      </section>
    `,
    init: () => {}
  };
}

export function SolutionDetailView(solutionKey) {
  const s = SOLUTIONS[solutionKey] || SOLUTIONS['hardware'];

  return {
    html: `
      <section style="padding:var(--space-16) var(--space-6);background:radial-gradient(circle at 50% 0%, #F4F0FF 0%, transparent 60%);border-bottom:1px solid var(--color-border);text-align:center;">
        <div style="max-width:860px;margin:0 auto;">
          <a href="/solutions" data-nav class="text-primary font-semibold" style="font-size:13px;display:inline-flex;align-items:center;gap:6px;margin-bottom:16px;text-decoration:none;">
            ${getIcon('arrow-right', 'rotate-180', 14)} Back to Industry Solutions
          </a>
          <h1 class="text-title-1" style="margin-bottom:16px;">${s.title}</h1>
          <p class="text-body-lg" style="max-width:720px;margin:0 auto 24px;">${s.tagline}</p>
          <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">
            <a href="/register" data-nav class="btn btn-primary btn-lg">Start Free Trial</a>
            <a href="/app/dashboard" data-nav class="btn btn-secondary btn-lg">Explore Live Workspace</a>
          </div>
        </div>
      </section>

      <section style="padding:var(--space-16) var(--space-6);max-width:900px;margin:0 auto;">
        <div class="card" style="padding:32px;margin-bottom:32px;">
          <h3 class="text-title-3" style="margin-bottom:16px;">Core Operational Capabilities</h3>
          <ul style="list-style:none;display:flex;flex-direction:column;gap:16px;">
            ${s.focus.map(f => `
              <li style="display:flex;align-items:flex-start;gap:12px;font-size:15px;color:var(--color-navy);">
                <div style="color:var(--color-success);margin-top:2px;">${getIcon('check-circle-2', '', 18)}</div>
                <span>${f}</span>
              </li>
            `).join('')}
          </ul>
        </div>

        <div class="card" style="padding:28px;background:#F9FAFB;border-color:#E4E7EC;">
          <div style="font-size:12px;font-weight:700;color:var(--color-primary);text-transform:uppercase;margin-bottom:6px;">Sample Deployment</div>
          <h4 style="font-size:17px;font-weight:700;color:var(--color-navy);margin-bottom:8px;">${s.exampleStore}</h4>
          <p style="font-size:15px;color:var(--color-text-secondary);line-height:1.6;">
            Deploying MetriSolution allowed this business to achieve 99.4% stock accuracy, cut counter checkout times to under 15 seconds, and eliminate unrecorded inter-branch transit losses.
          </p>
        </div>
      </section>
    `,
    init: () => {}
  };
}
