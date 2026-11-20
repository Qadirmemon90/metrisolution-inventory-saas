# MetriSolution Inventory ERP SaaS — Demo Access & Role Directory

**Document Version:** 1.0.0  
**Status:** Interactive Demo Profiles & Security Scope  

---

## 1. Demo Roles Overview

MetriSolution includes five pre-configured personas designed to demonstrate real-world access control, operational division of labor, and view masking across retail and distribution organizations.

A persistent **Demo Bar** or top-nav dropdown allows instantaneous switching between any of these 5 roles without typing credentials. Alternatively, users may navigate to `/demo-access` or select a role directly on `/login`.

---

## 2. Pre-Configured Test Accounts

### 1. Platform Administrator
* **Name:** Zainab Malik
* **Email:** `admin@metrisolution.com`
* **Role Identifier:** `PLATFORM_ADMIN`
* **Demo Business:** MetriSolution SaaS Platform Operator
* **Primary Scope:**
  - Full SaaS fleet management (`/platform/*`).
  - Tenant provisioning, subscription plan configuration, usage limits.
  - Platform health monitoring and SaaS audit logs.
  - *Restriction:* Does not have unrestricted access to tenant private operational data (e.g. daily counter receipts).

### 2. Business Owner (Primary Demo Persona)
* **Name:** Abdul Qadir
* **Email:** `owner@metrohardware.pk`
* **Role Identifier:** `OWNER`
* **Demo Business:** Metro Hardware Traders (Tenant ID: `tenant_metro_01`)
* **Primary Scope:**
  - Complete control of the tenant ERP workspace (`/app/*`).
  - Financial overview, margins, profit/loss, inventory valuation.
  - Multi-branch configuration (Karachi Main, Clifton, North Nazimabad).
  - Staff management, billing, plan upgrades, security policies.
  - Can approve discounts, branch transfers, cycle count adjustments, and AI voice order drafts.

### 3. Branch Manager
* **Name:** Tariq Mahmood
* **Email:** `manager@metrohardware.pk`
* **Role Identifier:** `MANAGER`
* **Assigned Branch:** Clifton Branch (`branch_clifton`)
* **Primary Scope:**
  - Branch sales oversight, POS operations, quotations, and invoicing.
  - Branch inventory management, goods receiving, stock transfers.
  - Authority to approve retail discounts and verify AI voice order drafts.
  - *Restriction:* Cannot modify subscription billing, delete branches, or access platform admin routes.

### 4. Sales & Counter Cashier
* **Name:** Bilal Ahmed
* **Email:** `cashier@metrohardware.pk`
* **Role Identifier:** `SALES`
* **Assigned Branch:** Karachi Main Branch (`branch_main`)
* **Primary Scope:**
  - Dedicated retail POS terminal (`/app/pos`), barcode lookups, and customer checkout.
  - Sales order entry and quotation creation.
  - Retail customer directory lookup.
  - *Security & Privacy Masking:* Wholesale cost prices and profit margins are **strictly masked** from all product listings and search results. Cannot approve discounts beyond 5% without manager authorization. Cannot edit inventory ledger directly.

### 5. Warehouse & Stock Specialist
* **Name:** Farhan Saeed
* **Email:** `warehouse@metrohardware.pk`
* **Role Identifier:** `WAREHOUSE`
* **Assigned Branch:** Karachi Central Warehouse (`branch_main`)
* **Primary Scope:**
  - Physical goods receiving from supplier purchase orders (`/app/stock/receiving`).
  - Stock transfer dispatch and receipt manifests (`/app/stock/transfers`).
  - Physical inventory counting sessions (`/app/stock/counts`).
  - Location hierarchy, bin, and shelf management (`/app/locations`).
  - *Restriction:* Cannot process retail checkout payments, issue customer refunds, or view company billing.

---

## 3. Demo Role Switching Mechanism

Users can switch personas at any moment via:
1. The **Demo Role Switcher Bar** located in the application header.
2. The `/demo-access` route featuring descriptive persona cards and 1-click access buttons.
3. The quick-fill buttons directly on `/login`.

When switching roles:
- The simulated session state updates immediately.
- The router verifies whether the current route is permitted under the new role.
- If the current route is unauthorized (e.g. switching from Owner to Sales while on `/app/billing`), the application immediately renders a friendly **403 Access Denied** view with an option to navigate to `/app/dashboard` or `/app/pos`.

---

## 4. Security & Prototype Disclaimer
> [!NOTE]
> All credentials, emails, and phone numbers in this demo environment are fictional and fabricated for retail demonstration purposes.
> No actual passwords or cryptographic authentication tokens are stored in the browser. Role switching simulates authorization boundaries for user experience review and does not substitute for server-side cryptographic access control in production.
