# MetriSolution Inventory ERP SaaS — Verification Test Scenarios Checklist

**Document Version:** 1.0.0  
**Status:** Verification Record of 12 Core End-to-End Test Scenarios  

---

### Scenario 1: New Business Registration & Onboarding
* **Workflow:** Visitor → `/register` → `/setup/business` → `/setup/branch` → `/setup/team` → `/setup/import` → `/setup/plan` → `/app/dashboard`.
* **Verification Steps:**
  1. Open `/register` and enter business name "Al-Razaq Hardware".
  2. Proceed through Step 1 (Business defaults, PKR currency, 18% tax).
  3. Complete Step 2 (Branch & warehouse naming).
  4. Inspect Step 3 (Team roles table).
  5. In Step 4, download sample CSV, drag-and-drop file, inspect parsed row table and validation indicators.
  6. In Step 5, select Growth Plan and click "Complete Setup".
* **Result:** **PASSED.** Seamless progression through all 5 steps; arrives in executive dashboard with all records intact.

---

### Scenario 2: Inventory Entry & Ledger Synchronization
* **Workflow:** Owner → `/app/products/new` → Enter SKU, Barcode, Prices, Initial Stock → Submit → Inspect `/app/stock/ledger`.
* **Verification Steps:**
  1. Navigate to `/app/products/new`.
  2. Input product name "Master Brass Deadbolt", SKU "LCK-DBL-004", barcode "8964000100999", initial stock 60 pieces.
  3. Submit form.
  4. Verify redirect to `/app/products/prod_...`.
  5. Check `/app/stock/ledger` to confirm automatic `IN` transaction of +60 pieces with reference "INITIAL-STOCK".
* **Result:** **PASSED.** Immutable ledger entry created; on-hand balance accurately derived.

---

### Scenario 3: Retail POS Checkout & Receipt Generation
* **Workflow:** Sales Staff → `/app/pos` → Add Products → Calculate Totals & Cash Tender → Checkout → Printable Receipt.
* **Verification Steps:**
  1. Switch to `SALES` role via Demo Bar.
  2. Navigate to `/app/pos`. Verify wholesale cost prices are masked.
  3. Scan or click "750W Impact Electric Drill Machine" and "Cobalt Steel Drill Bit Set".
  4. Verify subtotal, 18% tax, and total update in real-time.
  5. Enter cash tendered Rs. 12,000; verify change due calculates to Rs. 200.
  6. Click "Complete Sale & Print Receipt".
  7. Confirm modal opens displaying tax invoice with thermal receipt switch and print trigger.
* **Result:** **PASSED.** Stock decremented by 1 unit each in ledger; invoice created atomically.

---

### Scenario 4: Low Stock Automated Alert Generation
* **Workflow:** Completed sale drops stock below threshold → In-app alert appears → Owner views notification.
* **Verification Steps:**
  1. Sale of item reduces on-hand quantity to or below configured `reorderLevel`.
  2. Verify alert badge appears in notification bell icon.
  3. Navigate to `/app/alerts` or `/app/low-stock`.
  4. Confirm warning card details specific SKU, current on-hand count, and safety threshold.
* **Result:** **PASSED.** Alert triggered automatically without page reload.

---

### Scenario 5: Inter-Branch Stock Transfer Lifecycle
* **Workflow:** Warehouse User → Request Transfer → Approval → Dispatch (In-Transit) → Destination Receipt → Stock Incremented.
* **Verification Steps:**
  1. Navigate to `/app/stock/transfers`.
  2. Inspect transfer manifest `TRF-2026-004` (Karachi Main to Clifton Store).
  3. Click "Confirm Receipt at Clifton Retail Store".
  4. Verify status updates to `received`.
  5. Check `/app/stock/ledger` to verify destination stock incremented.
* **Result:** **PASSED.** Manifest transitions atomically; destination inventory increases.

---

### Scenario 6: WhatsApp Voice-to-Order Audible Playback & Approval
* **Workflow:** `/app/voice-inbox` → Play Audio → View Urdu Transcript → AI Extraction → Disambiguate Candidate → Manager Approval → Sales Order.
* **Verification Steps:**
  1. Navigate to `/app/voice-inbox`.
  2. Click Play button on WhatsApp audio player.
  3. Verify audible voice tone plays in browser while animated waveform bars track playback progress (`0:00 / 0:05`).
  4. Verify Urdu transcript: *"Abdul Qadir, meri shop par door lock ke 25 boxes bhejwa do."*
  5. Verify box-to-piece conversion: 25 boxes × 12 = 300 pieces.
  6. Select candidate "Premium Brass Cylinder Door Lock".
  7. Click "Authorize Order & Convert to Sales Order".
  8. Verify Sales Order created and 300 pieces reserved in Karachi Main stock.
* **Result:** **PASSED.** Audible playback functional; draft converts into active Sales Order.

---

### Scenario 7: Role-Based Access Control (RBAC) Guarding
* **Workflow:** Sales user attempts unauthorized access to `/platform/*` or `/app/billing` → 403 Access Denied.
* **Verification Steps:**
  1. Switch to `SALES` role.
  2. Try navigating to `/platform/dashboard` or `/app/billing`.
  3. Verify application immediately intercepts route and displays accessible 403 Access Denied view.
  4. Verify view displays current role (`SALES`), required role (`OWNER` or `PLATFORM_ADMIN`), and 1-click role switcher button.
* **Result:** **PASSED.** Unauthorized actions blocked cleanly with friendly explanatory guidance.

---

### Scenario 8: Subscription Quota & Plan Limit Elevation
* **Workflow:** Owner views quota consumption → Upgrades plan tier → Limits update immediately.
* **Verification Steps:**
  1. Switch to `OWNER` role and open `/app/billing`.
  2. Inspect current Growth Plan usage progress bars.
  3. Click "Switch to Business Plan" (Rs. 12,999/mo).
  4. Verify plan updates to Business Plan and branch limit elevates to 10 branches and 30 users.
* **Result:** **PASSED.** Plan limits updated in persistent store state.

---

### Scenario 9: Insufficient Stock Protection
* **Workflow:** POS checkout attempted for quantity exceeding available on-hand stock → Blocked with friendly validation error.
* **Verification Steps:**
  1. Open `/app/pos`.
  2. Attempt to add an item that has 0 available inventory (e.g. out of stock item).
  3. Verify add button is disabled and toast prevents addition.
  4. Attempt checkout with quantity > available.
  5. Confirm `InsufficientStockException` is trapped and error toast informs cashier.
* **Result:** **PASSED.** Negative inventory strictly prevented.

---

### Scenario 10: Reload & Browser Persistence
* **Workflow:** Perform transactional changes (e.g. create sale, complete transfer) → Refresh browser → Changes remain.
* **Verification Steps:**
  1. Complete a POS sale in `/app/pos`.
  2. Refresh browser window (`Ctrl+R` / `F5`).
  3. Inspect `/app/dashboard` and `/app/invoices`.
  4. Verify new invoice and updated stock balances persist from `localStorage`.
* **Result:** **PASSED.** Full state hydration from `metrisolution_erp_state_v1`.

---

### Scenario 11: Error States & Validation
* **Workflow:** Test invalid inputs, duplicate SKUs, invalid CSV rows, and 404 route handling.
* **Verification Steps:**
  1. Navigate to `/setup/import` and upload malformed CSV; verify error table flags problematic rows.
  2. Navigate to an unmapped path (e.g. `/invalid-page`); verify custom 404 view renders with navigation links.
  3. Enter duplicate SKU in `/app/products/new`; verify duplicate rejection error toast.
* **Result:** **PASSED.** Graceful error trapping and user feedback.

---

### Scenario 12: Responsive Usability Across Breakpoints
* **Workflow:** Verify layouts at 375px (Mobile), 768px (Tablet), 1024px (Laptop), and 1440px+ (Desktop).
* **Verification Steps:**
  1. Mobile (375px): Public drawer toggles cleanly; POS collapses into accessible vertical stack; tables allow horizontal scroll.
  2. Tablet (768px): Sidebar collapses; grid cards wrap cleanly.
  3. Desktop (1440px): Full 60/40 POS layout; persistent sidebar; clear typography.
* **Result:** **PASSED.** WCAG 2.2 AA compliant responsiveness across all screen sizes.
