# MetriSolution Inventory ERP SaaS

> **Enterprise-Grade Retail & Wholesale Operations Platform for Pakistan**  
> *A high-performance, responsive Single-Page Application (SPA) built with pure Vanilla JavaScript ES Modules, Modern CSS3 with Design Tokens, and Vite.*

[![Status](https://img.shields.io/badge/Status-Fully_Interactive_Demo-success.svg)](#)
[![Stack](https://img.shields.io/badge/Stack-Vanilla_JS_ES2022_%7C_CSS3_%7C_Vite-6941C6.svg)](#)
[![Market](https://img.shields.io/badge/Market-Pakistan_%7C_PKR_%7C_Asia%2FKarachi-blue.svg)](#)
[![Accessibility](https://img.shields.io/badge/Accessibility-WCAG_2.2_AA-green.svg)](#)

---

## 1. Project Overview

**MetriSolution Inventory ERP SaaS** is a retail-first inventory and operations management SaaS purpose-built for Pakistani retailers, hardware merchants, electrical depots, and multi-branch wholesale distributors.

Designed to eliminate chaotic paper registers and fragile spreadsheets, MetriSolution connects retail POS registers, inter-branch transfer manifests, immutable stock ledgers, and customer WhatsApp voice ordering into a single intuitive, lightning-fast web workspace.

---

## 2. Technology Stack

* **Core Runtime:** Pure Semantic HTML5, Modern CSS3 (Custom Properties / Design Tokens), Vanilla JavaScript (ES2022+ Modules).
* **Architecture:** Zero framework bloat (No React, Next.js, Vue, or Tailwind overhead) for maximum execution speed, instantaneous DOM reactivity, and clean long-term maintainability.
* **Dev Server & Bundler:** Vite 6 (Rapid Hot-Module Reloading & static asset optimization).
* **Icons:** Zero-dependency Lucide-compatible vector SVG icon engine (`src/components/icons.js`).
* **Audio Engine:** Web Audio API & Web Speech API synthesizer for audible in-browser WhatsApp voice note playback (`src/services/voiceEngine.js`).
* **Persistence:** Reactive in-memory state engine synchronized to browser `localStorage` (`metrisolution_erp_state_v1`).

---

## 3. Quickstart & Running the Application

### Prerequisites
* Node.js v18+ (tested on Node v26)
* npm or pnpm

### Installation & Execution
```bash
# 1. Install dev dependencies (Vite)
npm install

# 2. Start the local development server
npm run dev

# 3. Open in browser:
# http://localhost:5173
```

To build for production distribution:
```bash
npm run build
npm run preview
```

---

## 4. Pre-Configured Demo Accounts & Roles

MetriSolution includes five pre-configured personas to evaluate role-based access control (RBAC), view masking, and specialized operational workflows. 

A persistent **Demo Control Bar** at the top of every screen allows instant 1-click persona switching without typing passwords. Alternatively, navigate to `/demo-access`.

| Role | Persona Name | Demo Email | Primary Scope & Access Boundary |
| :--- | :--- | :--- | :--- |
| **Owner** *(Default)* | Abdul Qadir | `owner@metrohardware.pk` | Full operational & financial control across all 3 branches, margins, staff, billing, approvals. |
| **Branch Manager** | Tariq Mahmood | `manager@metrohardware.pk` | Clifton store oversight, stock transfers, receiving, discount & AI voice draft approvals. |
| **Sales Staff** | Bilal Ahmed | `cashier@metrohardware.pk` | High-speed POS register (`/app/pos`). **Wholesale costs and profit margins are strictly masked.** |
| **Warehouse** | Farhan Saeed | `warehouse@metrohardware.pk` | Goods receiving, cycle counts, inter-branch dispatch manifests, rack/bin locations. |
| **Platform Admin** | Zainab Malik | `admin@metrisolution.com` | Global SaaS fleet operator portal (`/platform/*`), tenant provisioning, health, plan configuration. |

---

## 5. Key Implemented Modules & Capabilities

### 1. High-Speed Retail POS (`/app/pos`)
* Dedicated 60/40 screen layout with barcode input autofocus and search-as-you-type.
* Real-time cart calculations: Subtotal, 18% Sales Tax (GST), Discount, and Grand Total in tabular numerals.
* Automatic stock check: Strictly prevents checkout if requested quantity exceeds available stock.
* Cash tender calculator: Automatic change returned display.
* Printable browser invoices: Native formatted output for standard A4 tax invoices and 80mm thermal receipts.

### 2. Signature WhatsApp Voice-to-Order AI (`/app/voice-inbox`)
* **Audible Playback in Browser:** Listen to customer Areeb's voice note (*"Abdul Qadir, meri shop par door lock ke 25 boxes bhejwa do."*) with live waveform scrubbing.
* **Dual Transcription:** Raw Urdu speech and normalized English translation.
* **Packaging Unit Conversion:** Accurately converts 25 boxes × 12 pieces = 300 pieces.
* **Candidate Disambiguation:** Resolves catalog matches between Standard, Premium, and Heavy-Duty locksets.
* **Human-in-the-Loop Security:** Requires authorized Owner or Manager confirmation before creating active Sales Orders or reserving stock.

### 3. Double-Checked Stock Ledger & Transfers (`/app/stock/*`)
* **Immutable Stock Ledger:** Every single transaction (`IN`, `OUT`, `TRANSFER`, `ADJUSTMENT`, `RETURN`, `RESERVE`) is logged chronologically with timestamp, reference, and actor.
* **Goods Receiving:** Three-way matching of supplier purchase orders with instant stock ledger credit.
* **Branch Transfers:** Multi-stage manifest lifecycle: Request → Dispatch (In-Transit) → Destination Receiving with discrepancy tracking.
* **Cycle Counts:** Physical stock sessions with expected vs counted comparison and variance calculation in PKR.

### 4. 5-Step Business Onboarding Wizard (`/setup/*`)
* Step 1: Business Profile (PKR currency, Asia/Karachi timezone, GST rate).
* Step 2: Branch & Storage (Karachi Main, Clifton, North Nazimabad).
* Step 3: Team Invitations & Role Assignments.
* Step 4: Product CSV Importer with sample download, drag-and-drop parsing, duplicate SKU validation, and error summaries.
* Step 5: Subscription Activation.

### 5. Platform Administration Console (`/platform/*`)
* SaaS operator dashboard with fleet MRR, active stores count, and trial conversions.
* Tenant management directory with suspend and reactivate controls.
* Platform health gauges (API latency, worker queues, database cluster uptime).

### 6. Public Marketing Website (20+ Routes) & Legal Docs (9 Routes)
* Complete public SaaS presence: Homepage, 10 feature deep-dives, interactive pricing calculator, solutions by industry (Retail, Hardware, Wholesale), Security Center, and FAQ.
* Independently navigable legal policies (`/privacy`, `/terms`, `/cookies`, `/acceptable-use`, `/data-processing`, `/security-policy`, `/subprocessors`, `/refund-policy`, `/subscription-policy`) with Table of Contents and draft disclosures.

---

## 6. Project Documentation Index

Comprehensive engineering and design specifications are stored in `docs/`:
1. [architecture.md](file:///d:/All%20Code/INV%20Tool/docs/architecture.md) — System architecture, module separation, and state reactivity.
2. [competitor-ux-research.md](file:///d:/All%20Code/INV%20Tool/docs/competitor-ux-research.md) — Deep UX analysis of Zoho, Odoo, inFlow, Sortly, Square, Lightspeed, and Cin7.
3. [design-system.md](file:///d:/All%20Code/INV%20Tool/docs/design-system.md) — Color tokens, typography hierarchy, elevation, and accessibility standards.
4. [routes-and-pages.md](file:///d:/All%20Code/INV%20Tool/docs/routes-and-pages.md) — Full route directory of all 60+ application paths.
5. [demo-credentials.md](file:///d:/All%20Code/INV%20Tool/docs/demo-credentials.md) — Demo personas, permissions, and switcher instructions.
6. [mock-data-model.md](file:///d:/All%20Code/INV%20Tool/docs/mock-data-model.md) — Data schemas for Metro Hardware Traders fixtures and ledger invariants.
7. [feature-coverage.md](file:///d:/All%20Code/INV%20Tool/docs/feature-coverage.md) — Feature matrix and verification checklist.
8. [frontend-security-notes.md](file:///d:/All%20Code/INV%20Tool/docs/frontend-security-notes.md) — CSV formula injection mitigations and cryptographic boundaries.
9. [backend-integration-plan.md](file:///d:/All%20Code/INV%20Tool/docs/backend-integration-plan.md) — REST API specifications and webhook schemas for cloud backend.
10. [testing-checklist.md](file:///d:/All%20Code/INV%20Tool/docs/testing-checklist.md) — Verification records for all 12 core test scenarios.

---

## 7. Prototype Disclaimers

1. **Demonstration Environment:** All company names, phone numbers, customer profiles, and pricing tiers are fictional fixtures created for operational demonstration.
2. **Local Storage:** Demonstration state is safely persisted in the user's browser `localStorage`. Clicking **Reset Data** in the top bar instantly restores canonical factory fixtures.
3. **Mock Integrations:** Third-party integrations (WhatsApp Cloud API webhooks, thermal receipt printer spoolers, barcode scanner devices) are simulated within client-side adapters.
