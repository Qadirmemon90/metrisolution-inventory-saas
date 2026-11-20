/**
 * MetriSolution Inventory ERP SaaS - Automated Headless Smoke Test Suite
 * Tests core domain logic, ledger invariants, RBAC guarding, and CSV sanitization.
 */

import { INITIAL_FIXTURES } from '../src/services/fixtures.js';
import { store } from '../src/services/store.js';
import { checkRouteAccess } from '../src/router/guards.js';
import { parseCsvText, getSampleProductCsv } from '../src/services/csvParser.js';

let passedTests = 0;
let failedTests = 0;

function assert(condition, testName) {
  if (condition) {
    console.log(`✓ PASS: ${testName}`);
    passedTests++;
  } else {
    console.error(`✗ FAIL: ${testName}`);
    failedTests++;
  }
}

function assertThrows(fn, testName) {
  try {
    fn();
    console.error(`✗ FAIL: ${testName} (Expected exception not thrown)`);
    failedTests++;
  } catch (e) {
    console.log(`✓ PASS: ${testName} (Caught expected exception: ${e.message})`);
    passedTests++;
  }
}

console.log('--- RUNNING METRISOLUTION AUTOMATED SMOKE TESTS ---\n');

// 1. Fixtures & Initial State Integrity
assert(INITIAL_FIXTURES.tenant.name === 'Metro Hardware Traders', 'Tenant name matches Metro Hardware Traders');
assert(INITIAL_FIXTURES.branches.length === 3, 'Initial state contains 3 branches (Karachi Main, Clifton, North Nazimabad)');
assert(INITIAL_FIXTURES.products.length >= 10, 'Initial product catalog contains 10+ realistic items');
assert(INITIAL_FIXTURES.users.length === 5, 'Contains all 5 pre-configured roles');

// 2. Box-to-Piece Conversions
const doorLock = INITIAL_FIXTURES.products.find(p => p.sku === 'LCK-BRS-001');
assert(doorLock && doorLock.boxRatio === 12, 'Door Lock has boxRatio of 12 pieces per box');
assert(doorLock.costPrice === 1450 && doorLock.salePrice === 2250, 'Door lock has correct pricing (Cost 1450, Sale 2250)');

// 3. Stock Ledger Initial Balance
const initialStock = store.getProductStock('prod_lock_01', 'branch_main');
assert(initialStock.onHand === 420, `Karachi Main branch has 420 on-hand door locks (observed: ${initialStock.onHand})`);
assert(initialStock.available === 396, `Available stock accounts for 24 reserved pieces (observed: ${initialStock.available})`);

// 4. POS Checkout with Validation & Ledger Deduction
store.setCurrentUserByRole('SALES');
const prevStock = store.getProductStock('prod_drill_01', 'branch_main').onHand;

const saleInvoice = store.executePosCheckout({
  branchId: 'branch_main',
  customerId: 'cust_walkin',
  items: [
    {
      productId: 'prod_drill_01',
      productName: '750W Impact Electric Drill Machine',
      sku: 'TOL-DRL-750',
      quantity: 1,
      unitPrice: 8200,
      unit: 'piece'
    }
  ],
  paymentMethod: 'cash',
  amountPaid: 10000,
  discountAmount: 200
});

assert(saleInvoice && saleInvoice.invoiceNumber.startsWith('INV-'), 'POS sale generates valid invoice number');
assert(saleInvoice.total === Math.round(8200 - 200 + (8200 * 0.18)), 'Invoice total correctly calculates subtotal - discount + 18% GST');

const postStock = store.getProductStock('prod_drill_01', 'branch_main').onHand;
assert(postStock === prevStock - 1, `POS sale atomically decrements inventory in ledger (${prevStock} -> ${postStock})`);

// 5. Invariant Protection: Negative Stock Prevention
assertThrows(() => {
  store.executePosCheckout({
    branchId: 'branch_main',
    customerId: 'cust_walkin',
    items: [
      {
        productId: 'prod_drill_01',
        productName: '750W Impact Electric Drill Machine',
        sku: 'TOL-DRL-750',
        quantity: 99999, // Impossible quantity
        unitPrice: 8200
      }
    ]
  });
}, 'Prevent checkout when requested quantity exceeds available stock');

// 6. Role-Based Access Control (RBAC) Guarding
store.setCurrentUserByRole('SALES');
const salesAccessToAdmin = checkRouteAccess('/platform/dashboard');
assert(!salesAccessToAdmin.allowed, 'Sales role is blocked from Platform Admin console');

const salesAccessToBilling = checkRouteAccess('/app/billing');
assert(!salesAccessToBilling.allowed, 'Sales role is blocked from Subscription Billing');

store.setCurrentUserByRole('OWNER');
const ownerAccessToBilling = checkRouteAccess('/app/billing');
assert(ownerAccessToBilling.allowed, 'Owner role is permitted to access Subscription Billing');

store.setCurrentUserByRole('PLATFORM_ADMIN');
const adminAccessToFleet = checkRouteAccess('/platform/dashboard');
assert(adminAccessToFleet.allowed, 'Platform Admin role is permitted to access Fleet Console');

// 7. Signature WhatsApp Voice-to-Order AI Draft Approval
store.setCurrentUserByRole('SALES');
assertThrows(() => {
  store.approveAiDraft('draft_areeb_01', 'prod_lock_01');
}, 'Cashier / Sales role is blocked from approving AI voice order drafts');

store.setCurrentUserByRole('OWNER');
const approvedOrder = store.approveAiDraft('draft_areeb_01', 'prod_lock_01');
assert(approvedOrder && approvedOrder.orderNumber.startsWith('SO-'), 'Owner can approve voice draft and generate Sales Order');
assert(approvedOrder.items[0].quantity === 300, 'Accurately converts 25 boxes * 12 pcs = 300 pieces in approved order');

// 8. CSV Parsing & Validation
const sampleCsv = getSampleProductCsv();
const parsedResult = parseCsvText(sampleCsv);
assert(parsedResult.validCount === 5, `CSV parser successfully validates 5 sample rows (observed: ${parsedResult.validCount})`);

// Duplicate SKU detection in CSV
const duplicateSkuCsv = `name,sku,category,cost_price,sale_price,initial_stock\n"Item 1",SKU-001,cat,100,200,10\n"Item 2",SKU-001,cat,100,200,10`;
const duplicateParsed = parseCsvText(duplicateSkuCsv);
assert(duplicateParsed.errors.length > 0 && duplicateParsed.errors[0].includes('Duplicate SKU'), 'CSV parser detects and flags duplicate SKUs');

// 9. Reset Demo Data to Default Fixtures
store.resetToDefault();
const resetStock = store.getProductStock('prod_lock_01', 'branch_main').onHand;
assert(resetStock === 420, 'Resetting data restores initial 420 pieces on-hand stock for door locks');

console.log(`\n--- SMOKE TEST SUMMARY ---`);
console.log(`Total Passed: ${passedTests}`);
console.log(`Total Failed: ${failedTests}`);

if (failedTests > 0) {
  process.exit(1);
} else {
  console.log('ALL VERIFICATION CHECKS PASSED SUCCESSFULLY!\n');
}
