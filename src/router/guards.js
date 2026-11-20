/**
 * MetriSolution Inventory ERP SaaS - Role-Based Access Control (RBAC) Route Guard
 */

import { store } from '../services/store.js';

export function checkRouteAccess(path) {
  const user = store.getCurrentUser();
  const role = user ? user.role : 'GUEST';

  // Platform Admin portal: strictly for PLATFORM_ADMIN
  if (path.startsWith('/platform')) {
    if (role !== 'PLATFORM_ADMIN') {
      return {
        allowed: false,
        reason: 'The Platform Administration Console is restricted to SaaS Platform Operators. Please switch to the Platform Admin demo role to inspect this fleet console.',
        requiredRole: 'PLATFORM_ADMIN'
      };
    }
  }

  // Tenant ERP routes: restricted for PLATFORM_ADMIN (as Platform Admins do not manage a single shop's daily cash drawer)
  if (path.startsWith('/app')) {
    if (role === 'PLATFORM_ADMIN') {
      return {
        allowed: false,
        reason: 'Platform Administrators manage global SaaS operations and do not directly access individual retailer workspaces. Switch to Business Owner, Manager, or Sales to view this tenant screen.',
        requiredRole: 'OWNER'
      };
    }

    // Role-specific restrictions inside Tenant ERP
    if ((path === '/app/billing' || path === '/app/team' || path.startsWith('/app/settings')) && role !== 'OWNER') {
      return {
        allowed: false,
        reason: 'Company settings, subscription billing, and staff management require Business Owner authorization.',
        requiredRole: 'OWNER'
      };
    }

    if ((path === '/app/stock/adjustments' || path === '/app/reports' || path.startsWith('/app/reports/')) && (role === 'SALES')) {
      return {
        allowed: false,
        reason: 'Wholesale margins, inventory reconciliation adjustments, and profit reporting are masked from retail counter staff to protect business privacy.',
        requiredRole: 'MANAGER'
      };
    }

    if (path === '/app/pos' && role === 'WAREHOUSE') {
      return {
        allowed: false,
        reason: 'Warehouse & stock specialists do not operate retail checkout registers. Navigate to Goods Receiving or Transfers instead.',
        requiredRole: 'SALES'
      };
    }
  }

  return { allowed: true };
}
