# MetriSolution Inventory ERP SaaS — Route Map & Screen Directory

**Document Version:** 1.0.0  
**Status:** Canonical Route Specification  

---

## 1. Public Marketing Website (21 Routes)

| Route Path | View / Renderer | Primary Purpose & Interactive Features | RBAC Access |
| :--- | :--- | :--- | :--- |
| `/` | `HomeView` | Hero value proposition, interactive product preview, key capabilities, social proof, pricing summary, interactive FAQ accordion, conversion CTA. | Public |
| `/features` | `FeaturesOverviewView` | Comprehensive product module directory with category pills and interactive feature cards. | Public |
| `/features/inventory` | `FeatureInventoryView` | In-depth product, variant, box-to-piece conversions, stock alerts, and multi-location tracking showcase. | Public |
| `/features/pos` | `FeaturePosView` | Touch POS showcase, barcode scanning, fast checkout flow, thermal receipt preview. | Public |
| `/features/warehouse` | `FeatureWarehouseView` | Multi-branch transfers, receiving workflows, cycle counts, rack/bin hierarchy showcase. | Public |
| `/features/orders` | `FeatureOrdersView` | Full order lifecycle: Quote → Order → Pick → Dispatch → Invoice. | Public |
| `/features/purchasing` | `FeaturePurchasingView` | Supplier management, automated reorder points, 3-way matching goods receiving. | Public |
| `/features/analytics` | `FeatureAnalyticsView` | Interactive SVG chart preview, inventory valuation, branch sales velocity. | Public |
| `/features/ai-voice` | `FeatureVoiceView` | Signature WhatsApp Voice-to-Order interactive demo showcase, transcription, entity extraction. | Public |
| `/features/automation` | `FeatureAutomationView` | Event triggers: stockouts, transfer notifications, approval escalations. | Public |
| `/features/team` | `FeatureTeamView` | Role-based access control, cashier view masking, branch isolation. | Public |
| `/pricing` | `PricingView` | Interactive monthly/annual billing switch, tier cards (Starter, Growth, Business, Enterprise), detailed feature comparison matrix. | Public |
| `/solutions` | `SolutionsOverviewView` | Solutions tailored for Pakistani retail, hardware, and wholesale sectors. | Public |
| `/solutions/retail` | `SolutionRetailView` | General stores, electronics, apparel retailers with fast POS and SKU search. | Public |
| `/solutions/hardware` | `SolutionHardwareView` | Paint, plumbing, sanitary, electrical, fastener retailers with box/piece conversions. | Public |
| `/solutions/wholesale` | `SolutionWholesaleView` | Bulk distribution, customer credit limits, multi-branch dispatch manifests. | Public |
| `/how-it-works` | `HowItWorksView` | 4-step onboarding explanation: Setup → Import → Sell → Automate. | Public |
| `/security` | `SecurityOverviewView` | Defense-in-depth architecture, transit/rest encryption, role isolation, consent boundaries. | Public |
| `/about` | `AboutView` | MetriSolution company mission, Karachi leadership, retail-first product values. | Public |
| `/contact` | `ContactView` | Interactive sales & demo request form with simulated submission toast. | Public |
| `/faq` | `FaqView` | Categorized searchable accordion with answers for Pakistani business owners. | Public |

---

## 2. Policy & Legal Documents (9 Routes)

| Route Path | View / Renderer | Primary Content & Structure | RBAC Access |
| :--- | :--- | :--- | :--- |
| `/privacy` | `LegalPrivacyView` | Data collection, inventory records, voice audio consent, subject rights, TOC. | Public |
| `/terms` | `LegalTermsView` | SaaS terms of service, acceptable use, liability limitations, Pakistani jurisdiction. | Public |
| `/cookies` | `LegalCookiesView` | Essential session cookies, analytics preferences, local storage usage disclosure. | Public |
| `/acceptable-use` | `LegalAcceptableUseView` | Prohibited activities (scam stores, illicit trade, API rate abuse). | Public |
| `/data-processing` | `LegalDpaView` | Data processing addendum, subprocessor obligations, audit commitments. | Public |
| `/security-policy` | `LegalSecurityView` | Technical & organizational security measures (TLS 1.3, AES-256 at rest, RBAC). | Public |
| `/subprocessors` | `LegalSubprocessorsView` | Approved hosting and infrastructure vendors (Cloudflare, AWS, Supabase). | Public |
| `/refund-policy` | `LegalRefundView` | 14-day money-back guarantee, trial period policy, subscription cancellations. | Public |
| `/subscription-policy` | `LegalSubscriptionView` | Billing cycles, grace periods, past-due handling, read-only data retention. | Public |

---

## 3. Authentication & Onboarding (11 Routes)

| Route Path | View / Renderer | Primary Purpose & Interactive Features | RBAC Access |
| :--- | :--- | :--- | :--- |
| `/login` | `LoginView` | Email/password login with 1-click Demo Role Switcher bar for instant access. | Public |
| `/register` | `RegisterView` | New business signup with immediate transition to setup wizard. | Public |
| `/forgot-password` | `ForgotPasswordView` | Password recovery demo with simulated email dispatch toast. | Public |
| `/reset-password` | `ResetPasswordView` | Password reset interface with strength meter. | Public |
| `/verify-email` | `VerifyEmailView` | Email verification simulation with resend timer. | Public |
| `/demo-access` | `DemoAccessView` | Dedicated role switchboard showcasing all 5 personas and their permissions. | Public |
| `/setup/business` | `SetupBusinessView` | Step 1: Business name, phone, currency (PKR), timezone (Asia/Karachi). | Authenticated |
| `/setup/branch` | `SetupBranchView` | Step 2: Primary branch name, warehouse name, POS counter identifier. | Authenticated |
| `/setup/team` | `SetupTeamView` | Step 3: Mock staff invitations with role assignments. | Authenticated |
| `/setup/import` | `SetupImportView` | Step 4: Product CSV drag-and-drop parser with sample download and validation. | Authenticated |
| `/setup/plan` | `SetupPlanView` | Step 5: Choose trial or paid plan (Starter, Growth, Business). | Authenticated |

---

## 4. Business ERP Workspace (27 Routes)

| Route Path | View / Renderer | Primary Purpose & Interactive Features | RBAC Access |
| :--- | :--- | :--- | :--- |
| `/app/dashboard` | `DashboardView` | Sales KPIs, inventory valuation, low stock alerts, SVG charts, recent activity. | Owner, Manager, Sales (masked) |
| `/app/pos` | `PosView` | Touch POS, barcode search, active cart, discount validation, thermal invoice. | Owner, Manager, Sales |
| `/app/orders` | `OrdersListView` | Filterable sales orders pipeline (Draft, Confirmed, Picked, Dispatched, Closed). | Owner, Manager, Sales, Warehouse |
| `/app/orders/new` | `OrderNewView` | Create wholesale sales order with live stock allocation check. | Owner, Manager, Sales |
| `/app/orders/:id` | `OrderDetailView` | Order detail, line items, status progression controls, invoice generation. | Owner, Manager, Sales, Warehouse |
| `/app/quotes` | `QuotesListView` | Quotation pipeline with conversion to Sales Order action. | Owner, Manager, Sales |
| `/app/quotes/new` | `QuoteNewView` | Quotation builder with customer selection, pricing discounts, expiration date. | Owner, Manager, Sales |
| `/app/invoices` | `InvoicesListView` | Historical invoice registry with payment status badges (Paid, Partial, Unpaid). | Owner, Manager, Sales |
| `/app/invoices/:id` | `InvoiceDetailView` | Interactive invoice view with browser print support (A4 and 80mm). | Owner, Manager, Sales |
| `/app/returns` | `ReturnsView` | Customer returns against original order, restock or quarantine inspection. | Owner, Manager |
| `/app/products` | `ProductsListView` | Searchable product table, category filters, stock level badges, CSV export. | Owner, Manager, Sales, Warehouse |
| `/app/products/new` | `ProductFormView` | Create product with SKU, barcode, category, cost/sale price, box/piece ratio. | Owner, Manager |
| `/app/products/:id` | `ProductDetailView` | Product specs, stock by branch, shelf location, stock ledger history. | Owner, Manager, Sales, Warehouse |
| `/app/categories` | `CategoriesView` | Category hierarchy tree with item counts and quick-add modal. | Owner, Manager |
| `/app/stock/ledger` | `StockLedgerView` | Immutable transaction ledger (IN, OUT, TRANSFER, ADJUSTMENT, RETURN). | Owner, Manager, Warehouse |
| `/app/stock/receiving` | `StockReceivingView` | Vendor PO goods receiving verification and automated stock ledger increment. | Owner, Manager, Warehouse |
| `/app/stock/adjustments` | `StockAdjustmentsView` | Discrepancy reconciliation with reason codes (Damaged, Lost, Found). | Owner, Manager |
| `/app/stock/transfers` | `StockTransfersView` | Branch-to-branch transfer: Request → Dispatch → In-Transit → Receive. | Owner, Manager, Warehouse |
| `/app/stock/counts` | `StockCountsView` | Physical cycle count sessions with variance calculation and adjustment commit. | Owner, Manager, Warehouse |
| `/app/locations` | `LocationsView` | Branch → Warehouse → Zone → Rack → Shelf structural hierarchy viewer. | Owner, Manager, Warehouse |
| `/app/low-stock` | `LowStockView` | Urgent replenishment list filtered by `stock <= reorder_level` with 1-click PO. | Owner, Manager |
| `/app/purchases` | `PurchasesListView` | Purchase orders to suppliers with status badges (Draft, Sent, Received). | Owner, Manager |
| `/app/purchases/new` | `PurchaseNewView` | Supplier purchase order builder with item selection and estimated delivery. | Owner, Manager |
| `/app/suppliers` | `SuppliersListView` | Supplier directory with contact info, total spend, pending orders. | Owner, Manager |
| `/app/customers` | `CustomersListView` | Retail and wholesale customer directory with outstanding receivables balance. | Owner, Manager, Sales |
| `/app/customers/:id` | `CustomerDetailView` | Customer profile, transaction history, invoices, credit limit status. | Owner, Manager, Sales |
| `/app/alerts` | `AlertsView` | Notification center: low stock warnings, transfer requests, renewal alerts. | All Roles |
| `/app/ai-drafts` | `AiDraftsView` | AI-extracted order drafts requiring human review, edit, and manager approval. | Owner, Manager |
| `/app/voice-inbox` | `VoiceInboxView` | Signature WhatsApp Voice Center: audio playback, transcript, candidate match. | Owner, Manager |
| `/app/automation` | `AutomationView` | Configurable event rules (e.g. low stock WhatsApp simulated alert). | Owner, Manager |
| `/app/reports` | `ReportsOverviewView` | Central reporting hub with links to sales, inventory, and branch analysis. | Owner, Manager |
| `/app/reports/sales` | `ReportSalesView` | Revenue trends, best-selling SKUs, payment method distribution. | Owner, Manager |
| `/app/reports/inventory` | `ReportInventoryView` | Stock valuation at cost and retail, aging stock, turnover velocity. | Owner, Manager |
| `/app/reports/branches` | `ReportBranchesView` | Cross-branch revenue and stock balance comparative analysis. | Owner, Manager |
| `/app/team` | `TeamManagementView` | Staff member management, role assignments, branch assignment drawer. | Owner |
| `/app/settings` | `SettingsView` | Business profile, currency, tax rates, operational defaults. | Owner |
| `/app/settings/security` | `SettingsSecurityView` | Session management, password policies, audit logging preferences. | Owner |
| `/app/settings/notifications`| `SettingsNotificationsView` | Notification channels (In-app, simulated Email, simulated WhatsApp). | Owner |
| `/app/settings/integrations` | `SettingsIntegrationsView` | Mock integration cards (WhatsApp Cloud API, thermal printers, barcode scanner). | Owner |
| `/app/billing` | `BillingView` | Subscription plan status, user limit gauges, upgrade modal, billing history. | Owner |
| `/app/audit` | `AuditLogView` | Security event audit trail (logins, price changes, stock adjustments). | Owner |

---

## 5. Platform Admin Console (9 Routes)

| Route Path | View / Renderer | Primary Purpose & Interactive Features | RBAC Access |
| :--- | :--- | :--- | :--- |
| `/platform/dashboard` | `PlatformDashboardView` | SaaS MRR, active tenants, trial conversions, platform health gauges. | Platform Admin |
| `/platform/tenants` | `PlatformTenantsView` | Global tenant directory with suspend, reactivate, and inspect actions. | Platform Admin |
| `/platform/tenants/:id` | `PlatformTenantDetailView` | Deep dive into specific business tenant (usage, branches, plan, limits). | Platform Admin |
| `/platform/plans` | `PlatformPlansView` | SaaS pricing plan configuration (Starter, Growth, Business, Enterprise). | Platform Admin |
| `/platform/subscriptions` | `PlatformSubscriptionsView` | Active, trial, past-due, and cancelled subscription manager. | Platform Admin |
| `/platform/usage` | `PlatformUsageView` | Platform aggregate consumption: AI voice minutes, WhatsApp notifications. | Platform Admin |
| `/platform/support` | `PlatformSupportView` | Tenant support ticket queue with simulated resolution workflow. | Platform Admin |
| `/platform/audit` | `PlatformAuditView` | SaaS platform security and administrative action audit trail. | Platform Admin |
| `/platform/health` | `PlatformHealthView` | API gateway, worker queues, and database cluster health simulation. | Platform Admin |
