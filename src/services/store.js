/**
 * MetriSolution Inventory ERP SaaS - Centralized Reactive State Store
 * Enforces business logic invariants, immutable stock ledger, and browser persistence.
 */

import { INITIAL_FIXTURES } from './fixtures.js';

const STORAGE_KEY = 'metrisolution_erp_state_v1';

class Store {
  constructor() {
    this.subscribers = new Map();
    this.state = this.loadState();
    this.activeBranchId = 'all'; // 'all' or specific branchId
  }

  loadState() {
    try {
      if (typeof localStorage !== 'undefined') {
        const serialized = localStorage.getItem(STORAGE_KEY);
        if (serialized) {
          const parsed = JSON.parse(serialized);
          // Ensure core collections exist
          if (parsed && parsed.products && parsed.users) {
            // Guarantee Platform Admin collections exist even from older saves
            if (!parsed.tenants || parsed.tenants.length === 0) parsed.tenants = JSON.parse(JSON.stringify(INITIAL_FIXTURES.tenants || []));
            if (!parsed.supportTickets) parsed.supportTickets = JSON.parse(JSON.stringify(INITIAL_FIXTURES.supportTickets || []));
            if (!parsed.platformSettings) parsed.platformSettings = JSON.parse(JSON.stringify(INITIAL_FIXTURES.platformSettings || {}));
            if (!parsed.platformAuditLogs) parsed.platformAuditLogs = JSON.parse(JSON.stringify(INITIAL_FIXTURES.platformAuditLogs || []));
            return parsed;
          }
        }
      }
    } catch (e) {
      console.warn('MetriSolution Store: Failed to parse localStorage state. Falling back to fixtures.', e);
    }
    return JSON.parse(JSON.stringify(INITIAL_FIXTURES));
  }

  saveState() {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      }
    } catch (e) {
      console.error('MetriSolution Store: Error persisting to localStorage', e);
    }
  }

  resetToDefault() {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
    this.state = JSON.parse(JSON.stringify(INITIAL_FIXTURES));
    this.saveState();
    this.emit('state_reset', this.state);
    this.emit('user_changed', this.state.currentUser);
    this.emit('stock_changed', null);
  }

  subscribe(event, callback) {
    if (!this.subscribers.has(event)) {
      this.subscribers.set(event, new Set());
    }
    this.subscribers.get(event).add(callback);
    return () => this.subscribers.get(event).delete(callback);
  }

  emit(event, payload) {
    if (this.subscribers.has(event)) {
      this.subscribers.get(event).forEach(cb => {
        try { cb(payload); } catch (err) { console.error(`Error in subscriber for ${event}:`, err); }
      });
    }
    if (this.subscribers.has('*')) {
      this.subscribers.get('*').forEach(cb => {
        try { cb({ event, payload }); } catch (err) { console.error('Error in wildcard subscriber:', err); }
      });
    }
  }

  // ==========================================
  // GETTERS
  // ==========================================
  getState() { return this.state; }
  getCurrentUser() { return this.state.currentUser; }
  getActiveBranchId() { return this.activeBranchId; }
  setActiveBranchId(branchId) {
    this.activeBranchId = branchId;
    this.emit('branch_changed', branchId);
  }

  getBranches() { return this.state.branches || []; }
  getBranch(id) { return this.state.branches.find(b => b.id === id) || null; }

  getUsers() { return this.state.users || []; }
  getCategories() { return this.state.categories || []; }
  getCustomers() { return this.state.customers || []; }
  getSuppliers() { return this.state.suppliers || []; }
  getSubscription() { return this.state.subscription; }
  getPlans() { return this.state.plans; }
  getAlerts() { return this.state.alerts || []; }
  getVoiceMessages() { return this.state.voiceMessages || []; }
  getAiDrafts() { return this.state.aiDrafts || []; }
  getStockTransfers() { return this.state.stockTransfers || []; }
  getStockCounts() { return this.state.stockCounts || []; }
  getSalesOrders() { return this.state.salesOrders || []; }
  getInvoices() { return this.state.invoices || []; }
  getQuotes() { return this.state.quotes || []; }
  getPurchaseOrders() { return this.state.purchaseOrders || []; }

  getProducts(filters = {}) {
    let list = this.state.products.filter(p => !p.isArchived);
    if (filters.categoryId) {
      list = list.filter(p => p.categoryId === filters.categoryId);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase().trim();
      list = list.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.sku.toLowerCase().includes(q) || 
        p.barcode.includes(q)
      );
    }
    return list;
  }

  getProduct(id) {
    return this.state.products.find(p => p.id === id) || null;
  }

  getProductStock(productId, branchId = null) {
    const product = this.getProduct(productId);
    if (!product) return { onHand: 0, reserved: 0, available: 0 };
    
    const targetBranch = branchId || (this.activeBranchId !== 'all' ? this.activeBranchId : null);
    if (targetBranch && product.stockByBranch[targetBranch]) {
      const b = product.stockByBranch[targetBranch];
      return {
        onHand: b.onHand,
        reserved: b.reserved || 0,
        available: Math.max(0, b.onHand - (b.reserved || 0))
      };
    }

    // Consolidated across all branches
    let totalOnHand = 0;
    let totalReserved = 0;
    Object.values(product.stockByBranch || {}).forEach(b => {
      totalOnHand += (b.onHand || 0);
      totalReserved += (b.reserved || 0);
    });

    return {
      onHand: totalOnHand,
      reserved: totalReserved,
      available: Math.max(0, totalOnHand - totalReserved)
    };
  }

  getDashboardMetrics(branchId = null) {
    const targetBranch = branchId || this.activeBranchId;
    let totalValuationCost = 0;
    let totalValuationRetail = 0;
    let lowStockCount = 0;
    let totalStockPieces = 0;

    this.state.products.forEach(p => {
      if (p.isArchived) return;
      const stock = this.getProductStock(p.id, targetBranch);
      totalValuationCost += (stock.onHand * p.costPrice);
      totalValuationRetail += (stock.onHand * p.salePrice);
      totalStockPieces += stock.onHand;
      if (stock.onHand <= p.reorderLevel) {
        lowStockCount++;
      }
    });

    // Invoices sum
    let filteredInvoices = this.state.invoices;
    if (targetBranch && targetBranch !== 'all') {
      filteredInvoices = filteredInvoices.filter(i => i.branchId === targetBranch);
    }
    const totalRevenue = filteredInvoices.reduce((sum, inv) => sum + (inv.total || 0), 0);
    const totalOrdersCount = filteredInvoices.length;

    return {
      totalRevenue,
      totalOrdersCount,
      totalValuationCost,
      totalValuationRetail,
      potentialProfit: totalValuationRetail - totalValuationCost,
      lowStockCount,
      totalStockPieces,
      activeSkusCount: this.state.products.filter(p => !p.isArchived).length
    };
  }

  getStockMovements(filter = {}) {
    let list = [...(this.state.stockMovements || [])].reverse();
    if (filter.branchId && filter.branchId !== 'all') {
      list = list.filter(m => m.branchId === filter.branchId);
    }
    if (filter.productId) {
      list = list.filter(m => m.productId === filter.productId);
    }
    if (filter.type) {
      list = list.filter(m => m.type === filter.type);
    }
    return list;
  }

  // ==========================================
  // MUTATIONS & BUSINESS LOGIC ENFORCEMENT
  // ==========================================

  setCurrentUserByRole(role) {
    const user = this.state.users.find(u => u.role === role);
    if (user) {
      this.state.currentUser = { ...user };
      this.saveState();
      this.emit('user_changed', this.state.currentUser);
      return this.state.currentUser;
    }
    return null;
  }

  createStockMovement({
    productId,
    branchId,
    type,
    quantity, // can be positive or negative
    unit = 'piece',
    referenceId = '',
    reason = '',
    boxRatio = 1
  }) {
    const product = this.getProduct(productId);
    if (!product) throw new Error(`Product not found: ${productId}`);

    const targetBranch = branchId || 'branch_main';
    if (!product.stockByBranch[targetBranch]) {
      product.stockByBranch[targetBranch] = { onHand: 0, reserved: 0, locationText: 'Unassigned Bin' };
    }

    const branchObj = product.stockByBranch[targetBranch];
    const normalizedPieces = (unit === 'box' || unit === 'pack') ? (quantity * (product.boxRatio || boxRatio || 1)) : quantity;
    const previousBalance = branchObj.onHand;
    const newBalance = previousBalance + normalizedPieces;

    // Strict invariant: Prevent negative onHand stock for physical deductions
    if (newBalance < 0 && (type === 'OUT' || type === 'TRANSFER')) {
      throw new Error(`Insufficient available stock for ${product.name}. On Hand: ${previousBalance}, Requested: ${Math.abs(normalizedPieces)}`);
    }

    branchObj.onHand = Math.max(0, newBalance);

    const branchRecord = this.getBranch(targetBranch);
    const movement = {
      id: `mov_${Date.now()}_${Math.floor(Math.random()*1000)}`,
      timestamp: new Date().toISOString(),
      type,
      productId: product.id,
      productName: product.name,
      sku: product.sku,
      branchId: targetBranch,
      branchName: branchRecord ? branchRecord.name : targetBranch,
      quantity,
      unit,
      normalizedPieces,
      previousBalance,
      newBalance: branchObj.onHand,
      referenceId,
      reason,
      actorName: this.state.currentUser.name,
      actorRole: this.state.currentUser.role
    };

    if (!this.state.stockMovements) this.state.stockMovements = [];
    this.state.stockMovements.push(movement);

    // Check low stock trigger
    if (branchObj.onHand <= product.reorderLevel) {
      this.triggerLowStockAlert(product, targetBranch, branchObj.onHand);
    }

    this.saveState();
    this.emit('stock_changed', { productId, branchId: targetBranch, movement });
    return movement;
  }

  triggerLowStockAlert(product, branchId, currentStock) {
    const branch = this.getBranch(branchId);
    const alertId = `alt_low_${product.id}_${branchId}`;
    // Check if duplicate alert already exists unread
    const existing = (this.state.alerts || []).find(a => a.id === alertId && !a.read);
    if (!existing) {
      const alert = {
        id: alertId,
        type: 'low_stock',
        title: `Low Stock: ${product.name}`,
        message: `${product.name} has reached ${currentStock} ${product.unitOfMeasure}s at ${branch ? branch.name : branchId} (Threshold: ${product.reorderLevel}).`,
        severity: currentStock === 0 ? 'danger' : 'warning',
        read: false,
        link: '/app/low-stock',
        timestamp: new Date().toISOString()
      };
      if (!this.state.alerts) this.state.alerts = [];
      this.state.alerts.unshift(alert);
      this.emit('alert_added', alert);
    }
  }

  executePosCheckout({
    branchId,
    customerId,
    items,
    paymentMethod = 'cash',
    amountPaid = 0,
    discountAmount = 0
  }) {
    if (!items || items.length === 0) {
      throw new Error('Cannot checkout with an empty cart.');
    }

    const targetBranch = branchId || this.state.currentUser.branchId || 'branch_main';

    // 1. Pre-validation: verify all items have sufficient available stock
    for (const item of items) {
      const stock = this.getProductStock(item.productId, targetBranch);
      if (item.quantity > stock.available) {
        throw new Error(`Insufficient stock for "${item.productName}". Available: ${stock.available}, Requested: ${item.quantity}`);
      }
    }

    // 2. Calculate financial totals
    let subtotal = 0;
    const lineItems = items.map(item => {
      const lineTotal = item.unitPrice * item.quantity;
      subtotal += lineTotal;
      return {
        productId: item.productId,
        productName: item.productName,
        sku: item.sku,
        quantity: item.quantity,
        unit: item.unit || 'piece',
        unitPrice: item.unitPrice,
        lineTotal
      };
    });

    const tax = Math.round(subtotal * (this.state.tenant.taxRatePercent / 100));
    const total = Math.max(0, subtotal - discountAmount + tax);
    const changeGiven = paymentMethod === 'cash' ? Math.max(0, amountPaid - total) : 0;

    const customer = this.state.customers.find(c => c.id === customerId) || {
      id: 'cust_walkin',
      name: 'Walk-in Retail Customer'
    };

    const invoiceNumber = `INV-${new Date().getFullYear()}-${String(this.state.invoices.length + 501).padStart(4, '0')}`;
    const invoiceId = `inv_${Date.now()}`;

    // 3. Atomically decrement stock for each item via stock ledger
    for (const item of items) {
      this.createStockMovement({
        productId: item.productId,
        branchId: targetBranch,
        type: 'OUT',
        quantity: -item.quantity,
        unit: item.unit || 'piece',
        referenceId: invoiceNumber,
        reason: 'Retail POS Sale'
      });
    }

    // 4. Create and persist Invoice record
    const invoice = {
      id: invoiceId,
      invoiceNumber,
      orderId: `so_pos_${Date.now()}`,
      customerId: customer.id,
      customerName: customer.name,
      branchId: targetBranch,
      items: lineItems,
      subtotal,
      discount: discountAmount,
      tax,
      total,
      amountPaid: Math.max(amountPaid, total),
      balanceDue: 0,
      changeGiven,
      paymentMethod,
      status: 'paid',
      createdAt: new Date().toISOString()
    };

    this.state.invoices.unshift(invoice);

    // 5. Update customer record
    if (customer.ordersCount !== undefined) {
      customer.ordersCount += 1;
    }

    this.saveState();
    this.emit('pos_sale_completed', { invoice });
    return invoice;
  }

  approveAiDraft(draftId, selectedProductId) {
    const draft = (this.state.aiDrafts || []).find(d => d.id === draftId);
    if (!draft) throw new Error('AI Draft not found');

    const currentUser = this.getCurrentUser();
    if (currentUser.role !== 'OWNER' && currentUser.role !== 'MANAGER') {
      throw new Error('Permission denied: Only Owners or Managers can approve AI order drafts.');
    }

    const product = this.getProduct(selectedProductId || draft.selectedProductId);
    if (!product) throw new Error('Matching product must be selected before approval.');

    // Calculate quantities: 25 boxes * 12 = 300 pieces
    const totalPieces = draft.extractedQuantity * (product.boxRatio || 1);
    const stock = this.getProductStock(product.id, 'branch_main');

    if (totalPieces > stock.available) {
      throw new Error(`Cannot approve: Requested ${totalPieces} pieces exceeds available stock (${stock.available} pieces).`);
    }

    // Create confirmed Sales Order
    const orderNumber = `SO-${new Date().getFullYear()}-${String(this.state.salesOrders.length + 150).padStart(4, '0')}`;
    const unitPrice = product.wholesalePrice || product.salePrice;
    const subtotal = unitPrice * totalPieces;
    const tax = Math.round(subtotal * 0.18);
    const total = subtotal + tax;

    const salesOrder = {
      id: `so_${Date.now()}`,
      orderNumber,
      customerId: draft.customerId,
      customerName: draft.customerName,
      branchId: 'branch_main',
      branchName: 'Karachi Main Hub',
      source: 'voice_ai',
      status: 'confirmed',
      items: [
        {
          productId: product.id,
          productName: product.name,
          sku: product.sku,
          quantity: totalPieces,
          unit: 'piece',
          unitPrice,
          lineTotal: subtotal
        }
      ],
      subtotal,
      discount: 0,
      tax,
      total,
      createdAt: new Date().toISOString()
    };

    // Reserve stock on product
    if (product.stockByBranch['branch_main']) {
      product.stockByBranch['branch_main'].reserved = (product.stockByBranch['branch_main'].reserved || 0) + totalPieces;
    }

    // Update draft status
    draft.status = 'approved';
    draft.selectedProductId = product.id;
    draft.generatedOrderId = salesOrder.id;
    draft.approvedBy = currentUser.name;

    // Update voice message status
    const vm = (this.state.voiceMessages || []).find(v => v.id === draft.voiceMessageId);
    if (vm) vm.status = 'order_approved';

    this.state.salesOrders.unshift(salesOrder);
    this.saveState();
    this.emit('ai_draft_approved', { draft, salesOrder });
    return salesOrder;
  }

  rejectAiDraft(draftId, reason = 'Customer cancelled or pricing mismatch') {
    const draft = (this.state.aiDrafts || []).find(d => d.id === draftId);
    if (!draft) throw new Error('AI Draft not found');
    draft.status = 'rejected';
    draft.notes = `Rejected: ${reason}`;
    const vm = (this.state.voiceMessages || []).find(v => v.id === draft.voiceMessageId);
    if (vm) vm.status = 'rejected';
    this.saveState();
    this.emit('ai_draft_rejected', { draft });
  }

  receiveTransfer(transferId) {
    const transfer = (this.state.stockTransfers || []).find(t => t.id === transferId);
    if (!transfer) throw new Error('Transfer not found');
    if (transfer.status === 'received') return transfer;

    // Increment destination stock
    for (const item of transfer.items) {
      this.createStockMovement({
        productId: item.productId,
        branchId: transfer.destinationBranchId,
        type: 'TRANSFER',
        quantity: item.dispatchedQty,
        unit: item.unit || 'piece',
        referenceId: transfer.transferNo,
        reason: `Transfer Receipt from ${transfer.sourceBranchName}`
      });
      item.receivedQty = item.dispatchedQty;
    }

    transfer.status = 'received';
    transfer.receivedAt = new Date().toISOString();
    this.saveState();
    this.emit('transfer_received', transfer);
    return transfer;
  }

  upgradeSubscription(newPlanId) {
    const plan = (this.state.plans || []).find(p => p.id === newPlanId);
    if (!plan) throw new Error('Invalid plan selected');
    this.state.subscription.planId = plan.id;
    this.state.subscription.planName = `${plan.name} Plan`;
    this.state.subscription.priceMonthlyPKR = plan.priceMonthly;
    this.state.subscription.branchLimit = plan.maxBranches;
    this.state.subscription.userLimit = plan.maxUsers;
    this.state.subscription.skuLimit = plan.maxSkus;
    this.state.subscription.status = 'active';
    this.saveState();
    this.emit('subscription_updated', this.state.subscription);
    return this.state.subscription;
  }

  markAlertRead(alertId) {
    const alert = (this.state.alerts || []).find(a => a.id === alertId);
    if (alert) {
      alert.read = true;
      this.saveState();
      this.emit('alert_read', alert);
    }
  }

  // ==========================================
  // PLATFORM ADMIN ENTERPRISE MUTATORS
  // ==========================================
  getTenants() {
    return this.state.tenants || [];
  }

  getTenant(id) {
    return (this.state.tenants || []).find(t => t.id === id) || null;
  }

  createTenant(data) {
    const safeName = (data.name || 'New Retail Store').toLowerCase().replace(/[^a-z0-9]/g, '_').slice(0, 15);
    const newId = `tenant_${safeName}_${Date.now().toString().slice(-4)}`;
    const newTenant = {
      id: newId,
      name: data.name || 'New Retail Store',
      businessType: data.businessType || 'General Retail',
      city: data.city || 'Karachi',
      ownerName: data.ownerName || 'Store Owner',
      email: data.email || `contact@${safeName || 'store'}.pk`,
      phone: data.phone || '+92 300 0000000',
      planId: data.planId || 'starter',
      planName: data.planName || (data.planId === 'business' ? 'Business Plan' : data.planId === 'growth' ? 'Growth Plan' : 'Starter Plan'),
      status: data.status || 'ACTIVE',
      branchesCount: Number(data.branchesCount) || 1,
      branchLimit: Number(data.branchLimit) || (data.planId === 'business' ? 10 : data.planId === 'growth' ? 3 : 1),
      usersCount: Number(data.usersCount) || 1,
      userLimit: Number(data.userLimit) || (data.planId === 'business' ? 30 : data.planId === 'growth' ? 10 : 3),
      mrrPKR: Number(data.mrrPKR) || (data.planId === 'business' ? 12999 : data.planId === 'growth' ? 6999 : 2999),
      renewalDate: data.renewalDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      voiceMinutesUsed: 0,
      voiceMinutesLimit: data.planId === 'business' ? 300 : data.planId === 'growth' ? 100 : 30,
      whatsappEventsUsed: 0,
      whatsappEventsLimit: data.planId === 'business' ? 2500 : data.planId === 'growth' ? 1000 : 200,
      ntn: data.ntn || '1029384-5',
      strn: data.strn || '32-77-1111-222-33',
      address: data.address || `${data.city || 'Karachi'}, Pakistan`
    };

    if (!this.state.tenants) this.state.tenants = [];
    this.state.tenants.unshift(newTenant);
    this.addPlatformAuditLog('TENANT_PROVISION', newTenant.name, `Provisioned new tenant with ${newTenant.planName} in ${newTenant.city}`);
    this.saveState();
    this.emit('tenants_updated', this.state.tenants);
    return newTenant;
  }

  updateTenant(id, patch) {
    const tenant = (this.state.tenants || []).find(t => t.id === id);
    if (!tenant) throw new Error('Tenant not found');
    Object.assign(tenant, patch);
    this.addPlatformAuditLog('TENANT_UPDATE', tenant.name, `Updated tenant details/quotas (${Object.keys(patch).join(', ')})`);
    this.saveState();
    this.emit('tenants_updated', this.state.tenants);
    return tenant;
  }

  toggleTenantStatus(id) {
    const tenant = (this.state.tenants || []).find(t => t.id === id);
    if (!tenant) throw new Error('Tenant not found');
    tenant.status = tenant.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    this.addPlatformAuditLog(tenant.status === 'SUSPENDED' ? 'TENANT_SUSPEND' : 'TENANT_REACTIVATE', tenant.name, `Status set to ${tenant.status}`);
    this.saveState();
    this.emit('tenants_updated', this.state.tenants);
    return tenant;
  }

  impersonateTenant(id) {
    const targetTenant = (this.state.tenants || []).find(t => t.id === id);
    if (!targetTenant) throw new Error('Tenant not found');

    // Stash original platform operator
    if (!this.state._platformOperator && this.state.currentUser.role === 'PLATFORM_ADMIN') {
      this.state._platformOperator = JSON.parse(JSON.stringify(this.state.currentUser));
    }

    // Set active tenant metadata
    this.state.tenant = {
      id: targetTenant.id,
      name: targetTenant.name,
      businessType: targetTenant.businessType,
      email: targetTenant.email,
      phone: targetTenant.phone,
      ntn: targetTenant.ntn,
      strn: targetTenant.strn,
      currency: "PKR",
      timezone: "Asia/Karachi",
      taxRatePercent: 18.0,
      address: targetTenant.address,
      createdAt: targetTenant.createdAt
    };

    // Set current user as Owner
    const initials = (targetTenant.ownerName || 'SO').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
    this.state.currentUser = {
      id: `usr_${targetTenant.id}_owner`,
      name: targetTenant.ownerName,
      email: targetTenant.email,
      role: 'OWNER',
      branchId: 'branch_main',
      avatar: initials,
      isImpersonating: true,
      originalOperator: this.state._platformOperator?.name || 'Zainab Malik'
    };

    // Update subscription to match
    this.state.subscription = {
      tenantId: targetTenant.id,
      planId: targetTenant.planId,
      planName: targetTenant.planName,
      status: targetTenant.status.toLowerCase(),
      priceMonthlyPKR: targetTenant.mrrPKR,
      branchLimit: targetTenant.branchLimit,
      userLimit: targetTenant.userLimit,
      skuLimit: targetTenant.planId === 'business' ? 25000 : targetTenant.planId === 'growth' ? 5000 : 1000,
      trialEndsAt: null,
      renewsAt: `${targetTenant.renewalDate}T00:00:00Z`,
      currentPeriodStart: new Date().toISOString(),
      usage: {
        branchesUsed: targetTenant.branchesCount,
        usersUsed: targetTenant.usersCount,
        skusUsed: 10,
        aiVoiceMinutesUsed: targetTenant.voiceMinutesUsed,
        whatsappEventsSent: targetTenant.whatsappEventsUsed
      }
    };

    this.addPlatformAuditLog('IMPERSONATION_START', targetTenant.name, `Operator assumed OWNER role on workspace`);
    this.saveState();
    this.emit('user_changed', this.state.currentUser);
    this.emit('tenant_changed', this.state.tenant);
    return targetTenant;
  }

  exitImpersonation() {
    if (this.state._platformOperator) {
      this.state.currentUser = JSON.parse(JSON.stringify(this.state._platformOperator));
      this.state._platformOperator = null;
      this.addPlatformAuditLog('IMPERSONATION_END', 'Platform Operator', `Exited impersonation session, returned to Platform Admin`);
      this.saveState();
      this.emit('user_changed', this.state.currentUser);
    }
  }

  updatePlan(planId, patch) {
    const plan = (this.state.plans || []).find(p => p.id === planId);
    if (!plan) throw new Error('Plan not found');
    Object.assign(plan, patch);
    this.addPlatformAuditLog('PLAN_SPEC_UPDATE', plan.name, `Modified plan configurations: ${Object.keys(patch).join(', ')}`);
    this.saveState();
    this.emit('plans_updated', this.state.plans);
    return plan;
  }

  createPlan(planData) {
    const newPlan = {
      id: planData.id || `plan_${Date.now().toString().slice(-4)}`,
      name: planData.name || 'Custom Plan',
      priceMonthly: Number(planData.priceMonthly) || 0,
      priceAnnual: Number(planData.priceAnnual) || 0,
      maxBranches: Number(planData.maxBranches) || 1,
      maxUsers: Number(planData.maxUsers) || 1,
      maxSkus: Number(planData.maxSkus) || 1000,
      badge: planData.badge || 'Tailored Tier',
      features: Array.isArray(planData.features) ? planData.features : (planData.features || '').split('\n').filter(Boolean)
    };
    if (!this.state.plans) this.state.plans = [];
    this.state.plans.push(newPlan);
    this.addPlatformAuditLog('PLAN_CREATE', newPlan.name, `Created custom plan tier priced at Rs. ${newPlan.priceMonthly}/mo`);
    this.saveState();
    this.emit('plans_updated', this.state.plans);
    return newPlan;
  }

  getSupportTickets() {
    return this.state.supportTickets || [];
  }

  createSupportTicket(data) {
    const ticketId = `TKT-${Math.floor(1000 + Math.random() * 9000)}`;
    const ticket = {
      id: ticketId,
      tenantId: data.tenantId || 'tenant_metro_01',
      tenantName: data.tenantName || 'Metro Hardware Traders',
      subject: data.subject || 'Support Request',
      severity: data.severity || 'Normal',
      status: 'Open',
      createdAt: new Date().toISOString(),
      messages: [
        {
          sender: data.sender || 'Store Owner',
          text: data.message || '',
          time: new Date().toISOString().replace('T', ' ').slice(0, 16)
        }
      ]
    };
    if (!this.state.supportTickets) this.state.supportTickets = [];
    this.state.supportTickets.unshift(ticket);
    this.addPlatformAuditLog('TICKET_CREATE', ticket.tenantName, `Ticket #${ticket.id} created: ${ticket.subject}`);
    this.saveState();
    this.emit('tickets_updated', this.state.supportTickets);
    return ticket;
  }

  replySupportTicket(ticketId, replyText, newStatus, newSeverity) {
    const ticket = (this.state.supportTickets || []).find(t => t.id === ticketId);
    if (!ticket) throw new Error('Ticket not found');
    if (replyText && replyText.trim()) {
      ticket.messages.push({
        sender: 'Platform Support (Zainab Malik)',
        text: replyText.trim(),
        time: new Date().toISOString().replace('T', ' ').slice(0, 16)
      });
    }
    if (newStatus) ticket.status = newStatus;
    if (newSeverity) ticket.severity = newSeverity;
    this.addPlatformAuditLog('TICKET_REPLY', ticket.tenantName, `Replied to #${ticket.id}, status set to ${ticket.status}`);
    this.saveState();
    this.emit('tickets_updated', this.state.supportTickets);
    return ticket;
  }

  getPlatformSettings() {
    return this.state.platformSettings || {};
  }

  updatePlatformSetting(key, value) {
    if (!this.state.platformSettings) this.state.platformSettings = {};
    this.state.platformSettings[key] = value;
    this.addPlatformAuditLog('PLATFORM_SETTING_TOGGLE', 'System Infrastructure', `Setting "${key}" changed to ${JSON.stringify(value)}`);
    this.saveState();
    this.emit('platform_settings_updated', this.state.platformSettings);
    return this.state.platformSettings;
  }

  getPlatformAuditLogs() {
    return this.state.platformAuditLogs || [];
  }

  addPlatformAuditLog(action, tenant, details) {
    if (!this.state.platformAuditLogs) this.state.platformAuditLogs = [];
    const log = {
      id: `aud_${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      operator: 'Zainab Malik (PLATFORM_ADMIN)',
      action,
      tenant,
      details
    };
    this.state.platformAuditLogs.unshift(log);
    if (this.state.platformAuditLogs.length > 50) this.state.platformAuditLogs.pop();
    this.emit('audit_log_added', log);
    return log;
  }
}

export const store = new Store();
