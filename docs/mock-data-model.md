# MetriSolution Inventory ERP SaaS — Mock Data Model & Schema Specification

**Document Version:** 1.0.0  
**Status:** Unified Reactive Store Schema  

---

## 1. Architectural Philosophy

All demonstration state in MetriSolution is driven by a single unified, reactive store (`src/services/store.js`). Unlike disconnected prototypes, changes made in one screen (e.g. completing a sale at the POS) directly and atomically update:
1. Product on-hand and available balances across branch locations.
2. The immutable stock ledger (`StockMovement` table).
3. The invoice registry and customer receivable balances.
4. Real-time dashboard KPI metrics, revenue charts, and low-stock alerts.

The store is pre-seeded with realistic Pakistani retail hardware & electronics business fixtures (Metro Hardware Traders, Karachi). Users can reset or restore sample records at any point with one click.

---

## 2. Entity Schemas

### 2.1 Tenant & Organization
```typescript
interface Tenant {
  id: string; // e.g. "tenant_metro_01"
  name: string; // e.g. "Metro Hardware Traders"
  businessType: string; // "Retail & Wholesale Hardware"
  email: string;
  phone: string; // "+92 21 3582 1234"
  currency: string; // "PKR"
  timezone: string; // "Asia/Karachi"
  taxRatePercent: number; // e.g. 18.0
  createdAt: string;
}
```

### 2.2 Branches & Locations
```typescript
interface Branch {
  id: string; // "branch_main", "branch_clifton", "branch_nazimabad"
  name: string; // "Karachi Main Branch", "Clifton Retail Branch", "North Nazimabad Store"
  city: string; // "Karachi"
  address: string;
  phone: string;
  isMain: boolean;
  warehouses: Warehouse[];
}

interface Warehouse {
  id: string; // "wh_main_01"
  branchId: string;
  name: string; // "Central Warehouse A"
  zones: {
    id: string; // "zone_lockers"
    name: string; // "Zone A - Security & Locks"
    racks: {
      id: string; // "rack_01"
      name: string; // "Rack 1"
      shelves: string[]; // ["Shelf A1", "Shelf A2", "Shelf A3"]
    }[];
  }[];
}
```

### 2.3 Products & Inventory
```typescript
interface Product {
  id: string; // "prod_lock_01"
  name: string; // "Premium Brass Cylinder Door Lock"
  sku: string; // "LCK-BRS-001"
  barcode: string; // "8964000100123"
  categoryId: string; // "cat_locks"
  categoryName: string; // "Door Locks & Hardware"
  brand: string; // "Tri-Circle / Master"
  unitOfMeasure: string; // "piece"
  boxRatio: number; // 12 (1 Box = 12 Pieces)
  costPrice: number; // PKR 1,450 (Hidden from SALES role)
  salePrice: number; // PKR 2,250
  wholesalePrice: number; // PKR 1,950
  reorderLevel: number; // 30 pieces
  stockByBranch: Record<string, {
    onHand: number;
    reserved: number;
    locationText: string; // "Zone A > Rack 1 > Shelf A2"
  }>;
  imageUrl: string;
  isArchived: boolean;
}
```

### 2.4 Stock Ledger Movements
```typescript
type MovementType = 'IN' | 'OUT' | 'TRANSFER' | 'ADJUSTMENT' | 'RETURN' | 'RESERVE';

interface StockMovement {
  id: string; // "mov_1001"
  timestamp: string; // ISO-8601
  type: MovementType;
  productId: string;
  productName: string;
  sku: string;
  branchId: string;
  branchName: string;
  quantity: number; // positive for additions, negative for deductions
  unit: 'piece' | 'box';
  normalizedPieces: number;
  previousBalance: number;
  newBalance: number;
  referenceId: string; // e.g. "INV-2026-089" or "PO-441"
  reason: string; // "Retail POS Sale", "Supplier Receiving", "Damaged goods cycle count"
  actorName: string;
  actorRole: string;
}
```

### 2.5 Inter-Branch Stock Transfers
```typescript
type TransferStatus = 'draft' | 'requested' | 'dispatched' | 'in_transit' | 'received' | 'discrepancy';

interface StockTransfer {
  id: string; // "trf_001"
  transferNo: string; // "TRF-2026-004"
  sourceBranchId: string;
  sourceBranchName: string;
  destinationBranchId: string;
  destinationBranchName: string;
  status: TransferStatus;
  items: {
    productId: string;
    productName: string;
    sku: string;
    requestedQty: number;
    dispatchedQty: number;
    receivedQty: number;
    unit: string;
  }[];
  requestedBy: string;
  approvedBy?: string;
  dispatchedAt?: string;
  receivedAt?: string;
  notes?: string;
}
```

### 2.6 Physical Stock Counts
```typescript
type CountStatus = 'planned' | 'in_progress' | 'completed' | 'reconciled';

interface StockCount {
  id: string; // "cnt_001"
  sessionNo: string; // "CNT-2026-Q4-01"
  branchId: string;
  status: CountStatus;
  startedAt: string;
  completedAt?: string;
  items: {
    productId: string;
    productName: string;
    sku: string;
    expectedOnHand: number;
    physicalCounted: number;
    variance: number; // physical - expected
    varianceValuePKR: number;
    reconciliationReason?: string;
  }[];
}
```

### 2.7 Sales Orders, Quotes & Invoices
```typescript
interface SalesOrder {
  id: string; // "so_001"
  orderNumber: string; // "SO-2026-0142"
  customerId: string;
  customerName: string;
  branchId: string;
  branchName: string;
  source: 'pos' | 'manual_b2b' | 'voice_ai';
  status: 'draft' | 'confirmed' | 'picking' | 'dispatched' | 'completed' | 'cancelled';
  items: {
    productId: string;
    productName: string;
    sku: string;
    quantity: number;
    unit: 'piece' | 'box';
    unitPrice: number;
    lineTotal: number;
  }[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  createdAt: string;
}

interface Invoice {
  id: string; // "inv_001"
  invoiceNumber: string; // "INV-2026-0498"
  orderId?: string;
  customerId: string;
  customerName: string;
  branchId: string;
  items: SalesOrder['items'];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  amountPaid: number;
  balanceDue: number;
  paymentMethod: 'cash' | 'card' | 'bank_transfer' | 'credit';
  status: 'paid' | 'partial' | 'unpaid';
  createdAt: string;
}
```

### 2.8 WhatsApp Voice Intelligence & AI Drafts
```typescript
interface VoiceMessage {
  id: string; // "vm_areeb_01"
  senderName: string; // "Areeb"
  senderPhone: string; // "+92 300 8291023"
  senderRole: string; // "Clifton Hardware Retailer (Customer)"
  receivedAt: string;
  durationSeconds: number; // 4.8
  audioToneFrequency: number[]; // Synthesis waveform harmonics
  transcriptRaw: string; // "Abdul Qadir, meri shop par door lock ke 25 boxes bhejwa do."
  transcriptNormalized: string; // "Abdul Qadir, please dispatch 25 boxes of door locks to my shop."
  status: 'received' | 'transcribed' | 'draft_created' | 'order_approved' | 'rejected';
}

interface AiDraft {
  id: string; // "draft_areeb_01"
  voiceMessageId: string;
  customerId: string; // "cust_areeb"
  customerName: string; // "Areeb Traders"
  extractedItemText: string; // "Door Lock"
  extractedQuantity: number; // 25
  extractedUnit: string; // "boxes"
  boxRatio: number; // 12
  convertedTotalPieces: number; // 300
  confidenceScore: number; // 96.4%
  candidateProducts: {
    id: string;
    name: string;
    sku: string;
    availableStock: number;
    salePrice: number;
  }[];
  selectedProductId: string; // Selected during human disambiguation
  requiresHumanApproval: boolean; // Always true
  approvedBy?: string;
  status: 'pending_review' | 'needs_clarification' | 'approved' | 'rejected';
  generatedOrderId?: string;
}
```

### 2.9 Subscriptions & Platform Administration
```typescript
interface SubscriptionPlan {
  id: string; // "starter" | "growth" | "business" | "enterprise"
  name: string; // "Growth Plan"
  priceMonthlyPKR: number; // 6,999
  priceAnnualPKR: number; // 69,990 (2 months free)
  maxBranches: number; // 3
  maxUsers: number; // 10
  maxSkuCount: number; // 5,000
  features: string[];
}

interface TenantSubscription {
  tenantId: string;
  planId: string;
  status: 'trial' | 'active' | 'past_due' | 'grace_period' | 'cancelled';
  trialEndsAt: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  billingEmail: string;
  simulatedUsage: {
    activeBranches: number;
    activeUsers: number;
    activeSkus: number;
    aiVoiceMinutesUsed: number;
    whatsappEventsCount: number;
  };
}
```

---

## 3. Storage & Integrity Invariants

1. **Storage Key:** `metrisolution_erp_state_v1` in `localStorage`.
2. **Rehydration Safety:** If local storage is absent, corrupt, or cleared, the application silently re-seeds with the canonical fixtures.
3. **Negative Stock Prevention:** The store enforces `availableStock = onHand - reserved`. POS checkout or dispatch fails if `quantityRequested > availableStock`.
4. **Box-to-Piece Conversions:** The store accurately converts packaging units:
   `25 boxes × 12 pieces/box = 300 pieces`.
5. **No Direct Mutations:** Product stock quantities are derived and committed via ledger transactions, maintaining full auditability.
