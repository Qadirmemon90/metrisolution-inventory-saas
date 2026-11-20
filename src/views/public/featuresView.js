/**
 * MetriSolution Inventory ERP SaaS - Feature Directory & Deep-Dive Views
 */

import { getIcon } from '../../components/icons.js';

const FEATURE_MODULES = {
  'inventory': {
    title: 'Multi-Branch Inventory & Stock Ledger',
    subtitle: 'Eliminate stockouts, shrinkage, and counting discrepancies with double-checked transactional control.',
    icon: 'package',
    problem: 'Retailers lose up to 12% of annual revenue through untracked stock leakage, stockouts during rush hours, and miscalculated master carton conversions.',
    solution: 'MetriSolution maintains an immutable transaction ledger for every SKU. Every adjustment records the user, reason, and timestamp. Seamlessly handles box-to-piece conversions (e.g. 1 box = 12 pieces).',
    benefits: [
      'Multi-branch stock visibility across all retail counters and warehouse racks.',
      'Automated reorder point warnings before high-velocity items run out.',
      'Box-to-piece and pack-to-unit conversions preventing manual math errors.',
      'Immutable audit ledger for every stock increment, transfer, and deduction.'
    ],
    example: 'Metro Hardware receives 10 master boxes of cylinder door locks from Lahore. The receiving dock scans the shipment, which automatically increments stock by 120 pieces and logs the vendor purchase order reference.',
    demoRoute: '/app/products'
  },
  'pos': {
    title: 'High-Speed Point of Sale (POS) Terminal',
    subtitle: 'Rapid barcode checkout, touch-friendly product browsing, cash change calculation, and instant thermal receipts.',
    icon: 'shopping-cart',
    problem: 'Slow counter checkouts create long queues, irritated shoppers, and lost sales during peak retail rush hours.',
    solution: 'Dedicated 60/40 checkout layout optimized for rapid barcode scanning or touch selection. Automatic stock validation prevents selling out-of-stock items, while discount limits safeguard retail profit margins.',
    benefits: [
      'Barcode input autofocus with instant search-as-you-type SKU matching.',
      'Live cash change calculation and multi-payment simulation.',
      'Thermal 80mm and standard A4 invoice generation with one-click print.',
      'Automatic stock reduction and live revenue synchronization.'
    ],
    example: 'A walk-in customer purchases an impact drill and a drill bit set. Cashier Bilal scans both items in 3 seconds, inputs PKR 12,000 cash, prints the receipt with PKR 200 change displayed, and stock updates instantly.',
    demoRoute: '/app/pos'
  },
  'ai-voice': {
    title: 'WhatsApp Voice-to-Order Intelligence',
    subtitle: 'Convert unstructured customer voice notes into verified sales orders with human-in-the-loop approval.',
    icon: 'mic',
    problem: 'Pakistani shopkeepers and wholesale contractors frequently send verbal voice messages over WhatsApp rather than structured emails, leading to misheard quantities and forgotten orders.',
    solution: 'Inbound voice notes are captured, transcribed in natural Urdu/English, matched against catalog candidates, and converted into structured AI Drafts for manager verification.',
    benefits: [
      'In-browser audible audio playback with live waveform scrubbing.',
      'Automatic entity extraction: Customer, Item name, Quantity, and Packaging units.',
      'Candidate disambiguation picker when multiple item variants exist.',
      'Strict security guard: AI never commits stock or invoices without manager authorization.'
    ],
    example: 'Areeb sends: "Abdul Qadir, meri shop par door lock ke 25 boxes bhejwa do." The system extracts 25 boxes (300 pieces), flags candidate door locks, and queues the draft for Abdul Qadir\'s single-click approval.',
    demoRoute: '/app/voice-inbox'
  },
  'warehouse': {
    title: 'Multi-Location Transfers & Receiving',
    subtitle: 'Streamline warehouse transfers, vendor receiving, and physical cycle counts with structured manifests.',
    icon: 'truck',
    problem: 'Stock transferred between branches frequently goes missing in transit with no accountability between drivers and branch managers.',
    solution: 'Complete transfer lifecycle: Request → Dispatch → In-Transit → Physical Receipt with automated discrepancy reconciliation and variance reporting.',
    benefits: [
      'Branch-to-branch transfer manifests with item-level tracking.',
      'Three-way matching on vendor goods receiving against purchase orders.',
      'Physical cycle count sessions with variance calculation and one-click reconciliation.',
      'Hierarchical bin management: Branch → Warehouse → Zone → Rack → Shelf.'
    ],
    example: 'Clifton branch requests 24 door locks from Karachi Central Hub. The warehouse dispatches the manifest; Clifton confirms receipt upon physical arrival, updating both branch ledgers atomically.',
    demoRoute: '/app/stock/transfers'
  },
  'orders': {
    title: 'Quotations, Sales Orders & Invoicing',
    subtitle: 'A unified commercial pipeline from price estimates to fulfilled deliveries and paid invoices.',
    icon: 'clipboard-list',
    problem: 'Sales teams quote outdated prices, reserve nonexistent inventory, and fail to track unpaid customer balances.',
    solution: 'Track every transaction through its natural stages: Quotation → Approved Order → Stock Allocation → Dispatch → Tax Invoice → Payment Reconciliation.',
    benefits: [
      'Instant conversion of accepted quotations into active sales orders.',
      'Automatic stock reservation preventing double-selling of allocated stock.',
      'Customer credit limits and outstanding receivables balance tracking.',
      'Customizable tax invoice formats with GST and NTN details.'
    ],
    example: 'Tariq Construction requests a wholesale quote for 100 door locks. The quote is accepted, converted to an order, reserves 100 units from available stock, and generates an invoice upon dispatch.',
    demoRoute: '/app/orders'
  },
  'purchasing': {
    title: 'Procurement & Supplier Management',
    subtitle: 'Keep shelves stocked, monitor supplier lead times, and control wholesale purchase costs.',
    icon: 'shopping-bag',
    problem: 'Manual reordering leads to panic buying at inflated prices or stockouts of staple items.',
    solution: 'Set automated reorder thresholds per branch. Create supplier purchase orders with one click and verify vendor deliveries with line-item receiving manifests.',
    benefits: [
      'Centralized supplier directory with purchase history and performance records.',
      'Automated purchase order generation based on minimum reorder levels.',
      'Partial receiving and damaged goods quarantine logging.',
      'Vendor cost tracking and purchase history analysis.'
    ],
    example: 'When impact drill stock falls below 8 units, MetriSolution alerts the manager and pre-populates a draft purchase order to DongCheng Industrial Tools.',
    demoRoute: '/app/purchases'
  },
  'analytics': {
    title: 'Real-Time Retail Analytics & Reporting',
    subtitle: 'Understand sales velocity, inventory turnover, branch profitability, and stock aging at a glance.',
    icon: 'bar-chart',
    problem: 'Business owners make critical purchasing decisions based on guesswork rather than real sales and margin data.',
    solution: 'Interactive SVG analytics dashboards displaying daily sales trends, top-selling SKUs, branch comparisons, and real-time inventory valuation on both cost and retail bases.',
    benefits: [
      'Real-time revenue, gross profit, and valuation calculations derived directly from the stock ledger.',
      'Comparative branch performance charts highlighting top-performing locations.',
      'Slow-moving and aging stock identification to prevent capital lockup.',
      'One-click CSV exports protected against spreadsheet formula injection.'
    ],
    example: 'Abdul Qadir compares November revenue between Karachi Main and Clifton stores, observing that electrical switches turn over twice as fast in Clifton.',
    demoRoute: '/app/reports'
  },
  'automation': {
    title: 'Automated Event Rules & Alerts',
    subtitle: 'Proactive notifications that alert the right team members before operational issues impact sales.',
    icon: 'sliders',
    problem: 'Managers discover stockouts or overdue transfers hours after customers walk away disappointed.',
    solution: 'Event-driven triggers that monitor inventory thresholds, AI order drafts, transfer arrivals, and subscription limits, delivering in-app alerts and simulated WhatsApp messages.',
    benefits: [
      'Configurable stockout and low-stock threshold triggers.',
      'Simulated WhatsApp outbound notifications for order confirmations.',
      'Immediate notifications for pending AI voice drafts requiring approval.',
      'Detailed event audit logging for security and compliance.'
    ],
    example: 'When a retail sale reduces impact drill stock below 8 units in Clifton, an automated alert appears instantly in the owner\'s notification tray.',
    demoRoute: '/app/alerts'
  },
  'team': {
    title: 'Role-Based Access Control (RBAC)',
    subtitle: 'Empower staff with the tools they need while protecting sensitive wholesale costs and margins.',
    icon: 'users',
    problem: 'Giving store cashiers full system access risks accidental inventory deletion, unauthorized discount approvals, and leakage of confidential cost margins.',
    solution: 'Five purpose-built roles (Platform Admin, Owner, Manager, Sales, Warehouse) with granular view masking and permission boundaries across branches.',
    benefits: [
      'Wholesale cost prices and profit margins are automatically masked from floor cashiers.',
      'Manager authorization required for discounts exceeding configured thresholds.',
      'Branch-level data segregation preventing staff from viewing other branches.',
      'Comprehensive audit log recording all user logins, price updates, and stock edits.'
    ],
    example: 'Cashier Bilal logs into POS and sees retail prices only. When a customer asks for a 15% discount, the system requires Manager Tariq\'s authorization before proceeding.',
    demoRoute: '/app/team'
  }
};

export function FeaturesOverviewView(params, router) {
  return {
    html: `
      <section style="padding:var(--space-16) var(--space-6);background:var(--color-surface);border-bottom:1px solid var(--color-border);text-align:center;">
        <div style="max-width:800px;margin:0 auto;">
          <span class="badge badge-primary" style="margin-bottom:12px;">Product Capabilities</span>
          <h1 class="text-title-1" style="margin-bottom:16px;">The complete operating system for retail</h1>
          <p class="text-body-lg">
            Explore MetriSolution's specialized modules designed to replace disjointed tools with one connected, high-speed SaaS platform.
          </p>
        </div>
      </section>

      <section style="padding:var(--space-12) var(--space-6);max-width:var(--container-max-width);margin:0 auto;">
        <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(340px, 1fr));gap:24px;">
          ${Object.entries(FEATURE_MODULES).map(([key, f]) => `
            <div class="card" style="padding:28px;display:flex;flex-direction:column;justify-content:space-between;">
              <div>
                <div style="width:44px;height:44px;border-radius:10px;background:var(--color-primary-soft);color:var(--color-primary);display:flex;align-items:center;justify-content:center;margin-bottom:16px;">
                  ${getIcon(f.icon, '', 22)}
                </div>
                <h3 class="text-heading" style="margin-bottom:8px;">${f.title}</h3>
                <p class="text-body" style="font-size:14px;line-height:1.6;margin-bottom:16px;">${f.subtitle}</p>
              </div>
              <div style="display:flex;align-items:center;justify-content:space-between;padding-top:16px;border-top:1px solid var(--color-border-subtle);">
                <a href="/features/${key}" data-nav class="text-primary font-semibold" style="font-size:13px;display:inline-flex;align-items:center;gap:4px;text-decoration:none;">
                  Feature Details ${getIcon('arrow-right', '', 14)}
                </a>
                <a href="${f.demoRoute}" data-nav class="btn btn-secondary btn-sm">
                  Live Demo
                </a>
              </div>
            </div>
          `).join('')}
        </div>
      </section>
    `,
    init: () => {}
  };
}

export function FeatureDetailView(featureKey) {
  const f = FEATURE_MODULES[featureKey] || FEATURE_MODULES['inventory'];

  return {
    html: `
      <section style="padding:var(--space-16) var(--space-6);background:radial-gradient(circle at 50% 0%, #F4F0FF 0%, transparent 60%);border-bottom:1px solid var(--color-border);">
        <div style="max-width:900px;margin:0 auto;text-align:center;">
          <a href="/features" data-nav class="text-primary font-semibold" style="font-size:13px;display:inline-flex;align-items:center;gap:6px;margin-bottom:16px;text-decoration:none;">
            ${getIcon('arrow-right', 'rotate-180', 14)} Back to All Features
          </a>
          <h1 class="text-title-1" style="margin-bottom:16px;">${f.title}</h1>
          <p class="text-body-lg" style="max-width:760px;margin:0 auto 24px;">${f.subtitle}</p>
          <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">
            <a href="${f.demoRoute}" data-nav class="btn btn-primary btn-lg">
              ${getIcon('play', '', 16)} Open Interactive Demo
            </a>
            <a href="/register" data-nav class="btn btn-secondary btn-lg">
              Start 14-Day Free Trial
            </a>
          </div>
        </div>
      </section>

      <section style="padding:var(--space-16) var(--space-6);max-width:980px;margin:0 auto;">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:32px;margin-bottom:48px;">
          <div class="card" style="padding:24px;border-left:4px solid var(--color-danger);">
            <div style="font-size:12px;font-weight:700;color:var(--color-danger);text-transform:uppercase;margin-bottom:8px;">The Problem</div>
            <p style="font-size:15px;color:var(--color-text-secondary);line-height:1.6;">${f.problem}</p>
          </div>
          <div class="card" style="padding:24px;border-left:4px solid var(--color-success);">
            <div style="font-size:12px;font-weight:700;color:var(--color-success);text-transform:uppercase;margin-bottom:8px;">The MetriSolution Solution</div>
            <p style="font-size:15px;color:var(--color-text-secondary);line-height:1.6;">${f.solution}</p>
          </div>
        </div>

        <div class="card" style="padding:32px;margin-bottom:48px;">
          <h3 class="text-title-3" style="margin-bottom:20px;">Core Capabilities & Key Benefits</h3>
          <ul style="list-style:none;display:grid;grid-template-columns:repeat(auto-fit, minmax(360px, 1fr));gap:16px;">
            ${f.benefits.map(b => `
              <li style="display:flex;align-items:flex-start;gap:10px;font-size:15px;color:var(--color-navy);">
                <div style="color:var(--color-success);margin-top:2px;">${getIcon('check-circle-2', '', 18)}</div>
                <span>${b}</span>
              </li>
            `).join('')}
          </ul>
        </div>

        <div class="card" style="padding:28px;background:#F9FAFB;border-color:#E4E7EC;">
          <div style="font-size:12px;font-weight:700;color:var(--color-primary);text-transform:uppercase;margin-bottom:6px;">Real-World Pakistani Retail Scenario</div>
          <h4 style="font-size:17px;font-weight:700;color:var(--color-navy);margin-bottom:8px;">How Metro Hardware Traders Uses This</h4>
          <p style="font-size:15px;color:var(--color-text-secondary);line-height:1.6;">${f.example}</p>
        </div>
      </section>
    `,
    init: () => {}
  };
}
