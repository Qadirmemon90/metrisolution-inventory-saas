/**
 * MetriSolution Inventory ERP SaaS - Platform Admin Verification Suite
 * Tests CRUD operations, tenant impersonation, plan configuration, ticket replies, and feature flags.
 */

import { store } from '../src/services/store.js';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`✓ PASS: ${message}`);
    passed++;
  } else {
    console.error(`✗ FAIL: ${message}`);
    failed++;
  }
}

console.log('--- RUNNING PLATFORM ADMIN AUTOMATED TESTS ---');

try {
  // Test 1: Seed Tenants
  const initialTenants = store.getTenants();
  assert(initialTenants.length >= 4, `Initial tenants array populated (Count: ${initialTenants.length})`);

  // Test 2: Provision New Retailer Tenant
  const newTenant = store.createTenant({
    name: 'Rawalpindi Industrial Auto Spares',
    city: 'Rawalpindi',
    businessType: 'Auto Parts Wholesale',
    ownerName: 'Muhammad Usman',
    email: 'usman@rp-autospares.pk',
    phone: '+92 300 9876543',
    planId: 'business',
    status: 'ACTIVE'
  });
  assert(newTenant.id && newTenant.id.startsWith('tenant_rawalpindi'), `Created tenant with formatted ID (${newTenant.id})`);
  assert(newTenant.branchLimit === 10, 'Business plan assigns 10 branches default');
  assert(store.getTenants().some(t => t.id === newTenant.id), 'New tenant found in getTenants()');

  // Test 3: Update Tenant Quotas & Details
  const updated = store.updateTenant(newTenant.id, {
    branchLimit: 15,
    city: 'Islamabad'
  });
  assert(updated.branchLimit === 15, 'Successfully modified tenant branch limit to 15');
  assert(updated.city === 'Islamabad', 'Successfully updated tenant city');

  // Test 4: Toggle Status (Suspend / Reactivate)
  const suspended = store.toggleTenantStatus(newTenant.id);
  assert(suspended.status === 'SUSPENDED', 'Successfully suspended tenant access');
  const reactivated = store.toggleTenantStatus(newTenant.id);
  assert(reactivated.status === 'ACTIVE', 'Successfully reactivated tenant access');

  // Test 5: Tenant Impersonation
  store.setCurrentUserByRole('PLATFORM_ADMIN');
  const impTenant = store.impersonateTenant('tenant_clifton_02');
  const currentUser = store.getCurrentUser();
  assert(currentUser.role === 'OWNER', `Impersonating operator assumes OWNER role (observed: ${currentUser.role})`);
  assert(currentUser.isImpersonating === true, 'currentUser.isImpersonating is flagged true');
  assert(store.getState().tenant.id === 'tenant_clifton_02', 'Active tenant context switched to Clifton Electronics');

  // Test 6: Exit Impersonation
  store.exitImpersonation();
  const restoredUser = store.getCurrentUser();
  assert(restoredUser.role === 'PLATFORM_ADMIN', `Exit impersonation restores PLATFORM_ADMIN role (observed: ${restoredUser.role})`);

  // Test 7: Pricing Plan Modifications
  const growthPlan = store.getPlans().find(p => p.id === 'growth');
  store.updatePlan('growth', { priceMonthly: 7499, maxBranches: 4 });
  const modifiedGrowth = store.getPlans().find(p => p.id === 'growth');
  assert(modifiedGrowth.priceMonthly === 7499, 'Successfully updated Growth Plan monthly price to 7,499');
  assert(modifiedGrowth.maxBranches === 4, 'Successfully updated Growth Plan max branches to 4');

  // Test 8: Create Bespoke Plan
  const customPlan = store.createPlan({
    id: 'franchise_enterprise',
    name: 'Franchise Mega Tier',
    priceMonthly: 24999,
    maxBranches: 25,
    maxUsers: 100,
    maxSkus: 75000,
    badge: 'National Scale'
  });
  assert(store.getPlans().some(p => p.id === 'franchise_enterprise'), 'Created custom plan exists in catalog');

  // Test 9: Support Ticket Inspection & Reply
  const tickets = store.getSupportTickets();
  assert(tickets.length >= 3, `Initial support tickets seeded (Count: ${tickets.length})`);
  const replied = store.replySupportTicket('TKT-1085', 'Please follow the template with headers: SKU, Name, Barcode, RetailPrice', 'Resolved', 'Normal');
  assert(replied.status === 'Resolved', 'Ticket status updated to Resolved');
  assert(replied.messages.length === 2, 'Message appended to ticket thread');

  // Test 10: Platform Health Settings Toggle
  store.updatePlatformSetting('whatsappWebhookActive', false);
  assert(store.getPlatformSettings().whatsappWebhookActive === false, 'WhatsApp webhook successfully toggled to false');
  store.updatePlatformSetting('whatsappWebhookActive', true);
  assert(store.getPlatformSettings().whatsappWebhookActive === true, 'WhatsApp webhook successfully toggled back to true');

  // Test 11: Global Audit Trail
  const auditLogs = store.getPlatformAuditLogs();
  assert(auditLogs.length > 5, `Audit log recorded operator actions (Count: ${auditLogs.length})`);
  assert(auditLogs[0].operator.includes('Zainab Malik'), 'Audit log records operator identity');

} catch (err) {
  console.error('Unexpected exception during platform admin tests:', err);
  failed++;
}

console.log('\n--- PLATFORM ADMIN TEST SUMMARY ---');
console.log(`Total Passed: ${passed}`);
console.log(`Total Failed: ${failed}`);

if (failed === 0) {
  console.log('ALL PLATFORM ADMIN VERIFICATIONS PASSED SUCCESSFULLY!\n');
} else {
  console.error('SOME PLATFORM ADMIN VERIFICATIONS FAILED!\n');
  process.exit(1);
}
