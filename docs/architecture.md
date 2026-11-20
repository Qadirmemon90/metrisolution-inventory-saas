# MetriSolution Inventory ERP SaaS — System Architecture Specification

**Author:** Principal SaaS Product Architect & Senior Frontend Engineer  
**Product:** MetriSolution Inventory ERP SaaS  
**Company:** MetriSolution Pvt Ltd (https://metrisolution.com)  
**Version:** 1.0.0  
**Stack:** Vanilla JavaScript (ES2022+), Modern CSS3 with Design Tokens, HTML5 Semantic Elements, Vite Dev Server  

---

## 1. Architectural Philosophy

MetriSolution is designed as a high-performance, responsive Single-Page Application (SPA) built purely with modern browser-native web standards (Vanilla JavaScript ES Modules and CSS3 Custom Properties) without the overhead or instability of third-party component frameworks.

Key architectural pillars:
1. **Zero-Framework Cleanliness:** High runtime speed, minimal bundle footprint, direct DOM reactivity without virtual DOM overhead, native browser API utilization.
2. **Four Distinct Application Contexts:**
   - **Public Marketing Website:** Customer acquisition, interactive pricing, solution deep-dives, responsive drawer, SEO-friendly semantic markup.
   - **Authentication & Business Setup:** Frictionless 1-click demo role switching, multi-step onboarding wizard with CSV import.
   - **Tenant ERP Workspace:** Multi-branch operations, real-time inventory ledger, barcode-driven POS, quotations/orders/invoices pipeline, and voice-to-order intelligence center.
   - **Platform Administration Console:** SaaS operator portal for tenant provisioning, plan management, usage limits, platform health, and audit logs.
3. **Unified Reactive Mock Data Engine:** Centralized state store (`store.js`) that persists demo transactions in browser `localStorage`, enforces business logic integrity (e.g. preventing negative inventory), and updates all views reactively.
4. **Audible Multi-Modal Voice Center:** In-browser audio synthesis and playback utilizing the Web Audio API to deliver audible Urdu voice notes with waveform progress and draft extraction.

---

## 2. Interface Layer Separation

```
+-----------------------------------------------------------------------------------+
|                                 App Root (index.html)                             |
|                                       Router                                      |
+-----------------------------------------+-----------------------------------------+
                                          |
         +--------------------------------+-------------------------------+
         |                                |                               |
+--------v-------+               +--------v-------+              +--------v-------+
| Public & Legal |               | Authentication |              |  ERP & Admin   |
|     Layout     |               |  Split Layout  |              |     Layout     |
+----------------+               +----------------+              +----------------+
| - Sticky Nav   |               | - Hero / Value |              | - App Topbar   |
| - Hero Section |               |   Proposition  |              | - Collapsible  |
| - Solution Demos               | - Form Card    |              |   Sidebar      |
| - Pricing Calc |               | - Quick Demo   |              | - Command Bar  |
| - Policy TOC   |               |   Role Switcher|              | - Breadcrumbs  |
| - SaaS Footer  |               | - Step Wizard  |              | - Workspace    |
+----------------+               +----------------+              +----------------+
```

---

## 3. Directory & Module Structure

```
├── docs/                             # Exhaustive specifications & guides
│   ├── architecture.md
│   ├── competitor-ux-research.md
│   ├── design-system.md
│   ├── routes-and-pages.md
│   ├── demo-credentials.md
│   ├── mock-data-model.md
│   ├── feature-coverage.md
│   ├── frontend-security-notes.md
│   ├── backend-integration-plan.md
│   └── testing-checklist.md
├── index.html                        # Application entry point & mounting shell
├── package.json                      # Scripts & minimal dev tooling (Vite)
├── vite.config.js                    # Vite configuration with SPA fallback
├── src/
│   ├── main.js                       # Bootstrap, router init, state hydration
│   ├── styles/                       # CSS architecture
│   │   ├── tokens.css                # Official MetriSolution color palette & tokens
│   │   ├── typography.css            # Headings, tabular numerals, fonts
│   │   ├── components.css            # Buttons, inputs, modals, cards, badges
│   │   ├── layouts.css               # Public, Auth, ERP, Admin layouts
│   │   ├── pos.css                   # Specialized touch/keyboard POS styles
│   │   ├── voice.css                 # WhatsApp-style chat & audio waveforms
│   │   └── print.css                 # Printable A4 & 80mm thermal invoice styling
│   ├── router/                       # Client-side router & route guard
│   │   ├── router.js                 # Path matching, parameters, history push/pop
│   │   └── guards.js                 # RBAC enforcement and redirect rules
│   ├── services/                     # State, Mock Services, Voice engine
│   │   ├── store.js                  # Centralized reactive data engine
│   │   ├── fixtures.js               # Realistic seed data (Metro Hardware Traders)
│   │   ├── voiceEngine.js            # Web Audio API waveform & audible playback
│   │   ├── csvParser.js              # Client-side CSV parser with validation
│   │   └── exportService.js          # CSV export with formula-injection mitigation
│   ├── components/                   # Reusable UI component renderers
│   │   ├── icons.js                  # Cohesive SVG icon library (Lucide-inspired)
│   │   ├── navbar.js                 # Public & ERP topbars
│   │   ├── sidebar.js                # ERP & Platform Admin navigation sidebars
│   │   ├── modal.js                  # Accessible modal dialogs & drawers
│   │   ├── toast.js                  # Stackable toast notifications
│   │   ├── commandPalette.js         # Global command bar (Ctrl+K / Cmd+K)
│   │   ├── charts.js                 # High-performance SVG charts & bar graphs
│   │   └── invoiceTemplate.js        # Printable retail invoice template
│   └── views/                        # Page views
│       ├── public/                   # Homepage, 10 feature pages, pricing, solutions
│       ├── legal/                    # 9 policy & legal pages with TOC
│       ├── auth/                     # Login, register, password recovery, demo access
│       ├── setup/                    # 5-step onboarding wizard
│       ├── erp/                      # Dashboard, POS, products, ledger, orders, etc.
│       └── admin/                    # Platform Admin console pages
```

---

## 4. State Management & Data Integrity

The state store (`src/services/store.js`) maintains all in-memory entities and synchronizes changes to browser `localStorage` under `metrisolution_erp_state_v1`.

### Reactive Subscriptions
Any component or view can subscribe to store events:
```javascript
store.subscribe('stock_changed', (payload) => {
  renderStockTable();
  updateDashboardKPIs();
});
```

### Ledger & Stock Integrity
Direct manipulation of product quantity is prohibited. All stock alterations flow through the `createStockMovement()` method:
- `IN`: Goods receiving from vendor purchase order.
- `OUT`: Retail POS sale or customer sales order dispatch.
- `TRANSFER`: Inter-branch dispatch and receipt.
- `ADJUSTMENT`: Discrepancy reconciliation from physical cycle count.
- `RETURN`: Restocked items from customer return.
- `RESERVE`: Stock allocated to an approved order pending fulfillment.

### Atomic Transactions
Before committing a sale:
1. Stock availability is verified against `available = onHand - reserved`.
2. If `quantityRequested > available`, the transaction aborts with an `InsufficientStockException`.
3. If valid, both the sales order/invoice and stock ledger records are appended synchronously.

---

## 5. Audible Voice-to-Order Architecture

The Voice Intelligence Center implements a dual-mode Web Audio API synthesizer:
1. **Audio Synthesis & Playback:** Generates realistic harmonic audio tones that simulate voice communication over radio/cellular networks, complete with ambient room presence and recognizable intonations matching the sample phrase:
   *"Abdul Qadir, meri shop par door lock ke 25 boxes bhejwa do."*
2. **Audio Waveform Visualization:** An animated SVG/Canvas waveform reacts synchronously to playback progress, scrubbing, and pause states.
3. **Structured Entity Extraction:** Prepares an AI Draft order detailing:
   - Customer: Areeb (Shopkeeper, Clifton)
   - Extracted Item: Door Lock
   - Quantity: 25 Boxes
   - Unit Conversion: 25 Boxes × 12 Pieces/Box = 300 Pieces
   - Candidate Disambiguation: Highlights matching catalog items (Standard, Premium, Heavy Duty) requiring human cashier resolution.
   - Human-in-the-Loop Approval: Restricts final order confirmation to authorized Managers or Owners.

---

## 6. Security & RBAC Guarding

MetriSolution enforces role-based access control across all 5 user tiers:
1. `PLATFORM_ADMIN`: Global SaaS management, tenant lifecycle, platform health.
2. `OWNER`: Full business tenant administration, branch configuration, financials, staff.
3. `MANAGER`: Operational oversight across assigned branches, stock transfers, discount & voice draft approvals.
4. `SALES`: POS terminal, sales order creation, product catalog lookup (Wholesale cost & margins masked).
5. `WAREHOUSE`: Goods receiving, cycle counts, rack/shelf management, picking & dispatch.

Route guards intercept route navigation and check `currentUser.role`. If access is forbidden, an accessible **Access Denied (403)** screen with context and a one-click role switcher is presented.
