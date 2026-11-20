/**
 * MetriSolution Inventory ERP SaaS - Main Application Bootstrap
 * Registers routes, initializes reactive store, command palette, and router.
 */

import { Router } from './router/router.js';
import { store } from './services/store.js';
import { commandPalette } from './components/commandPalette.js';
import { pwaService } from './services/pwaService.js';

// Public views
import { HomeView } from './views/public/homeView.js';
import { FeaturesOverviewView, FeatureDetailView } from './views/public/featuresView.js';
import { PricingView } from './views/public/pricingView.js';
import { SolutionsOverviewView, SolutionDetailView } from './views/public/solutionsView.js';
import { HowItWorksView, SecurityOverviewView, AboutView, ContactView, FaqView } from './views/public/companyPages.js';

// Legal views
import {
  LegalPrivacyView,
  LegalTermsView,
  LegalCookiesView,
  LegalAcceptableUseView,
  LegalDpaView,
  LegalSecurityView,
  LegalSubprocessorsView,
  LegalRefundView,
  LegalSubscriptionView
} from './views/legal/legalViews.js';

// Auth & Setup views
import {
  LoginView,
  RegisterView,
  ForgotPasswordView,
  DemoAccessView
} from './views/auth/authViews.js';

import {
  SetupBusinessView,
  SetupBranchView,
  SetupTeamView,
  SetupImportView,
  SetupPlanView
} from './views/setup/setupWizard.js';

// ERP views
import { DashboardView } from './views/erp/dashboardView.js';
import { PosView } from './views/erp/posView.js';
import {
  ProductsListView,
  ProductDetailView,
  ProductFormView,
  CategoriesView,
  LowStockView
} from './views/erp/productsView.js';
import {
  StockLedgerView,
  StockReceivingView,
  StockTransfersView,
  StockCountsView,
  StockAdjustmentsView,
  LocationsView
} from './views/erp/stockViews.js';
import {
  OrdersListView,
  OrderDetailView,
  OrderNewView,
  QuotesListView,
  QuoteNewView,
  InvoicesListView,
  InvoiceDetailView,
  ReturnsView
} from './views/erp/salesViews.js';
import {
  CustomersListView,
  CustomerDetailView,
  SuppliersListView,
  PurchasesListView,
  PurchaseNewView
} from './views/erp/crmPurchasingViews.js';
import {
  VoiceInboxView,
  AiDraftsView,
  AlertsView,
  AutomationView
} from './views/erp/voiceAiViews.js';
import {
  ReportsOverviewView,
  ReportSalesView,
  ReportInventoryView,
  ReportBranchesView,
  TeamManagementView,
  SettingsView,
  SettingsSecurityView,
  SettingsNotificationsView,
  SettingsIntegrationsView,
  BillingView,
  AuditLogView
} from './views/erp/reportsAdminViews.js';

// Platform Admin views
import {
  PlatformDashboardView,
  PlatformTenantsView,
  PlatformTenantDetailView,
  PlatformPlansView,
  PlatformSubscriptionsView,
  PlatformUsageView,
  PlatformSupportView,
  PlatformAuditView,
  PlatformHealthView
} from './views/admin/adminViews.js';

// Initialize Router
const router = new Router({
  // Public Marketing
  '/': HomeView,
  '/features': FeaturesOverviewView,
  '/features/inventory': () => FeatureDetailView('inventory'),
  '/features/pos': () => FeatureDetailView('pos'),
  '/features/warehouse': () => FeatureDetailView('warehouse'),
  '/features/orders': () => FeatureDetailView('orders'),
  '/features/purchasing': () => FeatureDetailView('purchasing'),
  '/features/analytics': () => FeatureDetailView('analytics'),
  '/features/ai-voice': () => FeatureDetailView('ai-voice'),
  '/features/automation': () => FeatureDetailView('automation'),
  '/features/team': () => FeatureDetailView('team'),
  '/pricing': PricingView,
  '/solutions': SolutionsOverviewView,
  '/solutions/retail': () => SolutionDetailView('retail'),
  '/solutions/hardware': () => SolutionDetailView('hardware'),
  '/solutions/wholesale': () => SolutionDetailView('wholesale'),
  '/how-it-works': HowItWorksView,
  '/security': SecurityOverviewView,
  '/about': AboutView,
  '/contact': ContactView,
  '/faq': FaqView,

  // Legal & Policies
  '/privacy': LegalPrivacyView,
  '/terms': LegalTermsView,
  '/cookies': LegalCookiesView,
  '/acceptable-use': LegalAcceptableUseView,
  '/data-processing': LegalDpaView,
  '/security-policy': LegalSecurityView,
  '/subprocessors': LegalSubprocessorsView,
  '/refund-policy': LegalRefundView,
  '/subscription-policy': LegalSubscriptionView,

  // Authentication & Onboarding
  '/login': LoginView,
  '/register': RegisterView,
  '/forgot-password': ForgotPasswordView,
  '/reset-password': ForgotPasswordView,
  '/verify-email': ForgotPasswordView,
  '/demo-access': DemoAccessView,
  '/setup/business': SetupBusinessView,
  '/setup/branch': SetupBranchView,
  '/setup/team': SetupTeamView,
  '/setup/import': SetupImportView,
  '/setup/plan': SetupPlanView,

  // Tenant ERP Workspace
  '/app/dashboard': DashboardView,
  '/app/pos': PosView,
  '/app/orders': OrdersListView,
  '/app/orders/new': OrderNewView,
  '/app/orders/:id': OrderDetailView,
  '/app/quotes': QuotesListView,
  '/app/quotes/new': QuoteNewView,
  '/app/invoices': InvoicesListView,
  '/app/invoices/:id': InvoiceDetailView,
  '/app/returns': ReturnsView,
  '/app/products': ProductsListView,
  '/app/products/new': ProductFormView,
  '/app/products/:id': ProductDetailView,
  '/app/categories': CategoriesView,
  '/app/stock/ledger': StockLedgerView,
  '/app/stock/receiving': StockReceivingView,
  '/app/stock/adjustments': StockAdjustmentsView,
  '/app/stock/transfers': StockTransfersView,
  '/app/stock/counts': StockCountsView,
  '/app/locations': LocationsView,
  '/app/low-stock': LowStockView,
  '/app/purchases': PurchasesListView,
  '/app/purchases/new': PurchaseNewView,
  '/app/suppliers': SuppliersListView,
  '/app/customers': CustomersListView,
  '/app/customers/:id': CustomerDetailView,
  '/app/alerts': AlertsView,
  '/app/ai-drafts': AiDraftsView,
  '/app/voice-inbox': VoiceInboxView,
  '/app/automation': AutomationView,
  '/app/reports': ReportsOverviewView,
  '/app/reports/sales': ReportSalesView,
  '/app/reports/inventory': ReportInventoryView,
  '/app/reports/branches': ReportBranchesView,
  '/app/team': TeamManagementView,
  '/app/settings': SettingsView,
  '/app/settings/security': SettingsSecurityView,
  '/app/settings/notifications': SettingsNotificationsView,
  '/app/settings/integrations': SettingsIntegrationsView,
  '/app/billing': BillingView,
  '/app/audit': AuditLogView,

  // Platform Administration Console
  '/platform/dashboard': PlatformDashboardView,
  '/platform/tenants': PlatformTenantsView,
  '/platform/tenants/:id': PlatformTenantDetailView,
  '/platform/plans': PlatformPlansView,
  '/platform/subscriptions': PlatformSubscriptionsView,
  '/platform/usage': PlatformUsageView,
  '/platform/support': PlatformSupportView,
  '/platform/audit': PlatformAuditView,
  '/platform/health': PlatformHealthView
});

// Bind Command Palette with Router
commandPalette.setRouter(router);

// Initialize PWA Lifecycle (Service Worker & Offline Resiliency)
pwaService.init();

// Initial route execution on document load
document.addEventListener('DOMContentLoaded', () => {
  router.handleRoute();
});

// Export globally for inline interactions
window.__metrisolution_router = router;
window.__metrisolution_store = store;
window.__metrisolution_pwa = pwaService;
