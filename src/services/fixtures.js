/**
 * MetriSolution Inventory ERP SaaS - Realistic Pakistani Retail & Wholesale Fixtures
 * Seed data for Metro Hardware Traders (Karachi, Pakistan)
 */

export const INITIAL_FIXTURES = {
  tenant: {
    id: "tenant_metro_01",
    name: "Metro Hardware Traders",
    businessType: "Retail & Wholesale Hardware",
    email: "info@metrohardware.pk",
    phone: "+92 21 3582 1234",
    ntn: "7294812-4",
    strn: "32-77-8761-901-28",
    currency: "PKR",
    timezone: "Asia/Karachi",
    taxRatePercent: 18.0,
    address: "Plot 42-C, Commercial Area, Badar Commercial, Phase V, DHA, Karachi",
    createdAt: "2026-01-15T09:00:00Z"
  },

  currentUser: {
    id: "usr_owner",
    name: "Abdul Qadir",
    email: "owner@metrohardware.pk",
    role: "OWNER",
    branchId: "branch_main",
    avatar: "AQ"
  },

  users: [
    {
      id: "usr_admin",
      name: "Zainab Malik",
      email: "admin@metrisolution.com",
      role: "PLATFORM_ADMIN",
      branchId: "branch_main",
      avatar: "ZM",
      phone: "+92 300 1122334"
    },
    {
      id: "usr_owner",
      name: "Abdul Qadir",
      email: "owner@metrohardware.pk",
      role: "OWNER",
      branchId: "branch_main",
      avatar: "AQ",
      phone: "+92 300 8291001"
    },
    {
      id: "usr_manager",
      name: "Tariq Mahmood",
      email: "manager@metrohardware.pk",
      role: "MANAGER",
      branchId: "branch_clifton",
      avatar: "TM",
      phone: "+92 333 4455667"
    },
    {
      id: "usr_cashier",
      name: "Bilal Ahmed",
      email: "cashier@metrohardware.pk",
      role: "SALES",
      branchId: "branch_main",
      avatar: "BA",
      phone: "+92 321 9988776"
    },
    {
      id: "usr_warehouse",
      name: "Farhan Saeed",
      email: "warehouse@metrohardware.pk",
      role: "WAREHOUSE",
      branchId: "branch_main",
      avatar: "FS",
      phone: "+92 345 5566778"
    }
  ],

  branches: [
    {
      id: "branch_main",
      name: "Karachi Main Hub",
      city: "Karachi",
      address: "Shop 14-16, Hardware Market, Timber Market, Old City, Karachi",
      phone: "+92 21 3274 1122",
      isMain: true
    },
    {
      id: "branch_clifton",
      name: "Clifton Retail Store",
      city: "Karachi",
      address: "Plot 12-E, Badar Commercial Street 1, DHA Phase V, Karachi",
      phone: "+92 21 3584 9900",
      isMain: false
    },
    {
      id: "branch_nazimabad",
      name: "North Nazimabad Depot",
      city: "Karachi",
      address: "Block H, Main Barkat-e-Hyderi, North Nazimabad, Karachi",
      phone: "+92 21 3663 4455",
      isMain: false
    }
  ],

  warehouses: [
    {
      id: "wh_main_01",
      branchId: "branch_main",
      name: "Central Distribution Warehouse",
      zones: [
        {
          id: "zone_a",
          name: "Zone A - Security & Locks",
          racks: [
            { id: "rack_a1", name: "Rack 1", shelves: ["Shelf A1-1", "Shelf A1-2", "Shelf A1-3"] },
            { id: "rack_a2", name: "Rack 2", shelves: ["Shelf A2-1", "Shelf A2-2"] }
          ]
        },
        {
          id: "zone_b",
          name: "Zone B - Tools & Machinery",
          racks: [
            { id: "rack_b1", name: "Rack 1", shelves: ["Shelf B1-1", "Shelf B1-2"] }
          ]
        }
      ]
    },
    {
      id: "wh_clifton_01",
      branchId: "branch_clifton",
      name: "Clifton Store Storage",
      zones: [
        {
          id: "zone_c_retail",
          name: "Retail Front Bins",
          racks: [
            { id: "rack_c1", name: "Display Rack 1", shelves: ["Bin 1", "Bin 2", "Bin 3"] }
          ]
        }
      ]
    }
  ],

  categories: [
    { id: "cat_locks", name: "Door Locks & Security", code: "LCK", itemCount: 3 },
    { id: "cat_power_tools", name: "Power Tools & Machinery", code: "TOL", itemCount: 2 },
    { id: "cat_fasteners", name: "Screws & Fasteners", code: "FST", itemCount: 1 },
    { id: "cat_electrical", name: "Electrical & Lighting", code: "ELE", itemCount: 2 },
    { id: "cat_plumbing", name: "Plumbing & Valves", code: "PLB", itemCount: 1 },
    { id: "cat_safety", name: "Safety & PPE Gear", code: "SAF", itemCount: 1 }
  ],

  products: [
    {
      id: "prod_lock_01",
      name: "Premium Brass Cylinder Door Lock",
      sku: "LCK-BRS-001",
      barcode: "8964000100123",
      categoryId: "cat_locks",
      categoryName: "Door Locks & Security",
      brand: "Master Guard",
      unitOfMeasure: "piece",
      boxRatio: 12, // 1 Box = 12 Pieces
      costPrice: 1450,
      salePrice: 2250,
      wholesalePrice: 1950,
      reorderLevel: 36, // 3 boxes
      stockByBranch: {
        "branch_main": { onHand: 420, reserved: 24, locationText: "Zone A > Rack 1 > Shelf A1-1" },
        "branch_clifton": { onHand: 48, reserved: 0, locationText: "Rack C1 > Bin 1" },
        "branch_nazimabad": { onHand: 72, reserved: 0, locationText: "Depot Rack 1" }
      },
      imageUrl: "",
      isArchived: false
    },
    {
      id: "prod_lock_02",
      name: "Standard Security Rim Door Lock",
      sku: "LCK-STD-002",
      barcode: "8964000100124",
      categoryId: "cat_locks",
      categoryName: "Door Locks & Security",
      brand: "Tri-Circle",
      unitOfMeasure: "piece",
      boxRatio: 12,
      costPrice: 980,
      salePrice: 1550,
      wholesalePrice: 1350,
      reorderLevel: 48,
      stockByBranch: {
        "branch_main": { onHand: 240, reserved: 0, locationText: "Zone A > Rack 1 > Shelf A1-2" },
        "branch_clifton": { onHand: 36, reserved: 0, locationText: "Rack C1 > Bin 2" },
        "branch_nazimabad": { onHand: 60, reserved: 0, locationText: "Depot Rack 1" }
      },
      imageUrl: "",
      isArchived: false
    },
    {
      id: "prod_lock_03",
      name: "Heavy Duty Mortise Lockset",
      sku: "LCK-HD-003",
      barcode: "8964000100125",
      categoryId: "cat_locks",
      categoryName: "Door Locks & Security",
      brand: "Yale Heritage",
      unitOfMeasure: "piece",
      boxRatio: 6,
      costPrice: 2200,
      salePrice: 3400,
      wholesalePrice: 2950,
      reorderLevel: 24,
      stockByBranch: {
        "branch_main": { onHand: 84, reserved: 0, locationText: "Zone A > Rack 2 > Shelf A2-1" },
        "branch_clifton": { onHand: 18, reserved: 0, locationText: "Rack C1 > Bin 3" },
        "branch_nazimabad": { onHand: 12, reserved: 0, locationText: "Depot Rack 2" }
      },
      imageUrl: "",
      isArchived: false
    },
    {
      id: "prod_drill_01",
      name: "750W Impact Electric Drill Machine",
      sku: "TOL-DRL-750",
      barcode: "8964000200051",
      categoryId: "cat_power_tools",
      categoryName: "Power Tools & Machinery",
      brand: "DongCheng",
      unitOfMeasure: "piece",
      boxRatio: 1,
      costPrice: 5500,
      salePrice: 8200,
      wholesalePrice: 7300,
      reorderLevel: 8,
      stockByBranch: {
        "branch_main": { onHand: 28, reserved: 2, locationText: "Zone B > Rack 1 > Shelf B1-1" },
        "branch_clifton": { onHand: 6, reserved: 0, locationText: "Counter Display" },
        "branch_nazimabad": { onHand: 10, reserved: 0, locationText: "Depot Shelf 4" }
      },
      imageUrl: "",
      isArchived: false
    },
    {
      id: "prod_drill_bits",
      name: "Cobalt Steel Drill Bit Set (13 Pcs)",
      sku: "TOL-BIT-13",
      barcode: "8964000200888",
      categoryId: "cat_power_tools",
      categoryName: "Power Tools & Machinery",
      brand: "Bosch Pro",
      unitOfMeasure: "set",
      boxRatio: 1,
      costPrice: 1400,
      salePrice: 2300,
      wholesalePrice: 1950,
      reorderLevel: 15,
      stockByBranch: {
        "branch_main": { onHand: 45, reserved: 0, locationText: "Zone B > Rack 1 > Shelf B1-2" },
        "branch_clifton": { onHand: 14, reserved: 0, locationText: "Display B2" },
        "branch_nazimabad": { onHand: 20, reserved: 0, locationText: "Depot Shelf 4" }
      },
      imageUrl: "",
      isArchived: false
    },
    {
      id: "prod_screw_01",
      name: "Drywall Screws 1.5-inch (Pack of 500)",
      sku: "FST-DRY-15",
      barcode: "8964000300188",
      categoryId: "cat_fasteners",
      categoryName: "Screws & Fasteners",
      brand: "Crown Pack",
      unitOfMeasure: "pack",
      boxRatio: 10, // 1 master carton = 10 packs
      costPrice: 750,
      salePrice: 1200,
      wholesalePrice: 1000,
      reorderLevel: 30,
      stockByBranch: {
        "branch_main": { onHand: 150, reserved: 10, locationText: "Warehouse Floor B" },
        "branch_clifton": { onHand: 25, reserved: 0, locationText: "Shelf D3" },
        "branch_nazimabad": { onHand: 80, reserved: 0, locationText: "Depot Floor" }
      },
      imageUrl: "",
      isArchived: false
    },
    {
      id: "prod_switch_01",
      name: "Modular 10A Piano Switch (White)",
      sku: "ELE-SW-10A",
      barcode: "8964000400821",
      categoryId: "cat_electrical",
      categoryName: "Electrical & Lighting",
      brand: "Clipsal / Schneider",
      unitOfMeasure: "piece",
      boxRatio: 20, // 1 Box = 20 Pieces
      costPrice: 120,
      salePrice: 220,
      wholesalePrice: 180,
      reorderLevel: 80,
      stockByBranch: {
        "branch_main": { onHand: 560, reserved: 0, locationText: "Zone A > Rack 3" },
        "branch_clifton": { onHand: 90, reserved: 0, locationText: "Bin E1" },
        "branch_nazimabad": { onHand: 140, reserved: 0, locationText: "Depot Rack 3" }
      },
      imageUrl: "",
      isArchived: false
    },
    {
      id: "prod_board_01",
      name: "Heavy Duty Extension Board 5-Socket (5M)",
      sku: "ELE-EXT-5S",
      barcode: "8964000400912",
      categoryId: "cat_electrical",
      categoryName: "Electrical & Lighting",
      brand: "Crown Electricals",
      unitOfMeasure: "piece",
      boxRatio: 1,
      costPrice: 1100,
      salePrice: 1750,
      wholesalePrice: 1500,
      reorderLevel: 12,
      stockByBranch: {
        "branch_main": { onHand: 22, reserved: 0, locationText: "Zone A > Rack 3" },
        "branch_clifton": { onHand: 8, reserved: 0, locationText: "Bin E2" },
        "branch_nazimabad": { onHand: 14, reserved: 0, locationText: "Depot Rack 3" }
      },
      imageUrl: "",
      isArchived: false
    },
    {
      id: "prod_plumb_01",
      name: "Brass Ball Valve 1-Inch PN25",
      sku: "PLB-VLV-001",
      barcode: "8964000600119",
      categoryId: "cat_plumbing",
      categoryName: "Plumbing & Valves",
      brand: "Master Flow",
      unitOfMeasure: "piece",
      boxRatio: 6,
      costPrice: 680,
      salePrice: 1100,
      wholesalePrice: 950,
      reorderLevel: 18,
      stockByBranch: {
        "branch_main": { onHand: 62, reserved: 0, locationText: "Plumbing Racks" },
        "branch_clifton": { onHand: 12, reserved: 0, locationText: "Bin P1" },
        "branch_nazimabad": { onHand: 24, reserved: 0, locationText: "Depot Plumbing" }
      },
      imageUrl: "",
      isArchived: false
    },
    {
      id: "prod_safety_01",
      name: "Industrial Safety Hard Hat (Yellow)",
      sku: "SAF-HLM-YEL",
      barcode: "8964000500331",
      categoryId: "cat_safety",
      categoryName: "Safety & PPE Gear",
      brand: "MSA Guard",
      unitOfMeasure: "piece",
      boxRatio: 1,
      costPrice: 480,
      salePrice: 850,
      wholesalePrice: 700,
      reorderLevel: 15,
      stockByBranch: {
        "branch_main": { onHand: 35, reserved: 0, locationText: "Safety Wall" },
        "branch_clifton": { onHand: 10, reserved: 0, locationText: "Shelf S1" },
        "branch_nazimabad": { onHand: 18, reserved: 0, locationText: "Depot Safety" }
      },
      imageUrl: "",
      isArchived: false
    }
  ],

  customers: [
    {
      id: "cust_areeb",
      name: "Areeb Traders (Clifton)",
      type: "Wholesale Retailer",
      phone: "+92 300 8291023",
      email: "areeb.hardware@gmail.com",
      address: "Shop 4, Zamzama Commercial, Clifton, Karachi",
      creditLimit: 300000,
      balanceDue: 45000,
      ordersCount: 18
    },
    {
      id: "cust_tariq_builders",
      name: "Tariq Construction & Builders",
      type: "Contractor",
      phone: "+92 333 2198000",
      email: "tariq.builders@hotmail.com",
      address: "Suite 302, Business Arcade, Main Shahrah-e-Faisal, Karachi",
      creditLimit: 500000,
      balanceDue: 125000,
      ordersCount: 32
    },
    {
      id: "cust_walkin",
      name: "Walk-in Retail Customer",
      type: "Counter Customer",
      phone: "+92 300 0000000",
      email: "walkin@metrohardware.pk",
      address: "Over the counter sale",
      creditLimit: 0,
      balanceDue: 0,
      ordersCount: 142
    }
  ],

  suppliers: [
    {
      id: "sup_master_locks",
      name: "Master Locks Pakistan Pvt Ltd",
      phone: "+92 42 3512 8899",
      email: "sales@masterlocks.pk",
      city: "Lahore",
      address: "Plot 89, Sundar Industrial Estate, Lahore",
      categoriesSupplied: "Door Locks & Security",
      totalPurchases: 1280000
    },
    {
      id: "sup_dongcheng_tools",
      name: "DongCheng Industrial Tools Importers",
      phone: "+92 21 3241 7766",
      email: "import@dongcheng.pk",
      city: "Karachi",
      address: "Marriot Road, Jodia Bazaar, Karachi",
      categoriesSupplied: "Power Tools & Machinery",
      totalPurchases: 2450000
    },
    {
      id: "sup_crown_fasteners",
      name: "Crown Fasteners & Hardware Mills",
      phone: "+92 21 3256 3311",
      email: "orders@crownfasteners.pk",
      city: "Karachi",
      address: "B-44, SITE Industrial Area, Karachi",
      categoriesSupplied: "Screws & Fasteners",
      totalPurchases: 640000
    }
  ],

  stockMovements: [
    {
      id: "mov_001",
      timestamp: "2026-11-18T10:15:00Z",
      type: "IN",
      productId: "prod_lock_01",
      productName: "Premium Brass Cylinder Door Lock",
      sku: "LCK-BRS-001",
      branchId: "branch_main",
      branchName: "Karachi Main Hub",
      quantity: 120, // 10 boxes * 12
      unit: "piece",
      normalizedPieces: 120,
      previousBalance: 300,
      newBalance: 420,
      referenceId: "PO-2026-088",
      reason: "Supplier Receiving from Master Locks",
      actorName: "Farhan Saeed",
      actorRole: "WAREHOUSE"
    },
    {
      id: "mov_002",
      timestamp: "2026-11-19T14:30:00Z",
      type: "OUT",
      productId: "prod_drill_01",
      productName: "750W Impact Electric Drill Machine",
      sku: "TOL-DRL-750",
      branchId: "branch_main",
      branchName: "Karachi Main Hub",
      quantity: -1,
      unit: "piece",
      normalizedPieces: -1,
      previousBalance: 29,
      newBalance: 28,
      referenceId: "INV-2026-0498",
      reason: "POS Counter Sale",
      actorName: "Bilal Ahmed",
      actorRole: "SALES"
    }
  ],

  stockTransfers: [
    {
      id: "trf_001",
      transferNo: "TRF-2026-004",
      sourceBranchId: "branch_main",
      sourceBranchName: "Karachi Main Hub",
      destinationBranchId: "branch_clifton",
      destinationBranchName: "Clifton Retail Store",
      status: "in_transit",
      requestedBy: "Tariq Mahmood",
      approvedBy: "Abdul Qadir",
      dispatchedAt: "2026-11-19T11:00:00Z",
      items: [
        {
          productId: "prod_lock_01",
          productName: "Premium Brass Cylinder Door Lock",
          sku: "LCK-BRS-001",
          requestedQty: 24, // 2 boxes
          dispatchedQty: 24,
          receivedQty: 0,
          unit: "piece"
        },
        {
          productId: "prod_drill_01",
          productName: "750W Impact Electric Drill Machine",
          sku: "TOL-DRL-750",
          requestedQty: 2,
          dispatchedQty: 2,
          receivedQty: 0,
          unit: "piece"
        }
      ],
      notes: "Urgent weekend replenishment for Clifton display"
    }
  ],

  stockCounts: [
    {
      id: "cnt_001",
      sessionNo: "CNT-2026-Q4-01",
      branchId: "branch_main",
      status: "completed",
      startedAt: "2026-11-15T09:00:00Z",
      completedAt: "2026-11-15T13:00:00Z",
      items: [
        {
          productId: "prod_lock_01",
          productName: "Premium Brass Cylinder Door Lock",
          sku: "LCK-BRS-001",
          expectedOnHand: 420,
          physicalCounted: 420,
          variance: 0,
          varianceValuePKR: 0,
          reconciliationReason: "Matched physical shelf count"
        },
        {
          productId: "prod_lock_02",
          productName: "Standard Security Rim Door Lock",
          sku: "LCK-STD-002",
          expectedOnHand: 242,
          physicalCounted: 240,
          variance: -2,
          varianceValuePKR: -1960,
          reconciliationReason: "Damaged packaging in transit; written off"
        }
      ]
    }
  ],

  salesOrders: [
    {
      id: "so_001",
      orderNumber: "SO-2026-0142",
      customerId: "cust_tariq_builders",
      customerName: "Tariq Construction & Builders",
      branchId: "branch_main",
      branchName: "Karachi Main Hub",
      source: "manual_b2b",
      status: "confirmed",
      items: [
        {
          productId: "prod_lock_01",
          productName: "Premium Brass Cylinder Door Lock",
          sku: "LCK-BRS-001",
          quantity: 24, // 2 boxes
          unit: "piece",
          unitPrice: 1950,
          lineTotal: 46800
        },
        {
          productId: "prod_drill_01",
          productName: "750W Impact Electric Drill Machine",
          sku: "TOL-DRL-750",
          quantity: 2,
          unit: "piece",
          unitPrice: 7300,
          lineTotal: 14600
        }
      ],
      subtotal: 61400,
      discount: 1400,
      tax: 10800,
      total: 70800,
      createdAt: "2026-11-19T10:45:00Z"
    }
  ],

  invoices: [
    {
      id: "inv_001",
      invoiceNumber: "INV-2026-0498",
      orderId: "so_pos_001",
      customerId: "cust_walkin",
      customerName: "Walk-in Retail Customer",
      branchId: "branch_main",
      items: [
        {
          productId: "prod_drill_01",
          productName: "750W Impact Electric Drill Machine",
          sku: "TOL-DRL-750",
          quantity: 1,
          unit: "piece",
          unitPrice: 8200,
          lineTotal: 8200
        },
        {
          productId: "prod_drill_bits",
          productName: "Cobalt Steel Drill Bit Set (13 Pcs)",
          sku: "TOL-BIT-13",
          quantity: 1,
          unit: "set",
          unitPrice: 2300,
          lineTotal: 2300
        }
      ],
      subtotal: 10500,
      discount: 500,
      tax: 1800,
      total: 11800,
      amountPaid: 12000,
      balanceDue: 0,
      changeGiven: 200,
      paymentMethod: "cash",
      status: "paid",
      createdAt: "2026-11-19T14:30:00Z"
    }
  ],

  quotes: [
    {
      id: "qte_001",
      quoteNumber: "QT-2026-0089",
      customerId: "cust_areeb",
      customerName: "Areeb Traders (Clifton)",
      branchId: "branch_clifton",
      expiresAt: "2026-11-30",
      items: [
        {
          productId: "prod_lock_01",
          productName: "Premium Brass Cylinder Door Lock",
          sku: "LCK-BRS-001",
          quantity: 120, // 10 boxes
          unit: "piece",
          unitPrice: 1950,
          lineTotal: 234000
        }
      ],
      subtotal: 234000,
      discount: 4000,
      tax: 41400,
      total: 271400,
      status: "sent",
      createdAt: "2026-11-18T16:00:00Z"
    }
  ],

  purchaseOrders: [
    {
      id: "po_001",
      poNumber: "PO-2026-0091",
      supplierId: "sup_master_locks",
      supplierName: "Master Locks Pakistan Pvt Ltd",
      branchId: "branch_main",
      status: "ordered",
      items: [
        {
          productId: "prod_lock_01",
          productName: "Premium Brass Cylinder Door Lock",
          sku: "LCK-BRS-001",
          quantity: 240, // 20 boxes
          unit: "piece",
          unitCost: 1450,
          lineTotal: 348000
        }
      ],
      total: 348000,
      expectedDelivery: "2026-11-25",
      createdAt: "2026-11-19T09:30:00Z"
    }
  ],

  voiceMessages: [
    {
      id: "vm_areeb_01",
      senderName: "Areeb (Shopkeeper)",
      senderPhone: "+92 300 8291023",
      senderRole: "Clifton Retail Customer",
      receivedAt: "2026-11-19T15:24:00Z",
      durationSeconds: 4.8,
      transcriptRaw: "Abdul Qadir, meri shop par door lock ke 25 boxes bhejwa do.",
      transcriptNormalized: "Abdul Qadir, please dispatch 25 boxes of door locks to my shop.",
      status: "draft_created"
    }
  ],

  aiDrafts: [
    {
      id: "draft_areeb_01",
      voiceMessageId: "vm_areeb_01",
      customerId: "cust_areeb",
      customerName: "Areeb Traders (Clifton)",
      extractedItemText: "Door Lock",
      extractedQuantity: 25,
      extractedUnit: "boxes",
      boxRatio: 12,
      convertedTotalPieces: 300,
      confidenceScore: 96.4,
      candidateProducts: [
        {
          id: "prod_lock_01",
          name: "Premium Brass Cylinder Door Lock",
          sku: "LCK-BRS-001",
          availableStock: 420,
          salePrice: 2250,
          wholesalePrice: 1950,
          matchConfidence: 96.4
        },
        {
          id: "prod_lock_02",
          name: "Standard Security Rim Door Lock",
          sku: "LCK-STD-002",
          availableStock: 240,
          salePrice: 1550,
          wholesalePrice: 1350,
          matchConfidence: 84.1
        },
        {
          id: "prod_lock_03",
          name: "Heavy Duty Mortise Lockset",
          sku: "LCK-HD-003",
          availableStock: 84,
          salePrice: 3400,
          wholesalePrice: 2950,
          matchConfidence: 78.5
        }
      ],
      selectedProductId: "prod_lock_01",
      requiresHumanApproval: true,
      status: "pending_review",
      notes: "Clifton shop delivery requested via phone note. Box-to-piece: 25 boxes × 12 = 300 pieces."
    }
  ],

  alerts: [
    {
      id: "alt_001",
      type: "ai_draft_pending",
      title: "New AI Voice Order Draft",
      message: "Areeb Traders requested 25 boxes of Door Locks via WhatsApp voice note. Requires human approval.",
      severity: "info",
      read: false,
      link: "/app/ai-drafts",
      timestamp: "2026-11-19T15:25:00Z"
    },
    {
      id: "alt_002",
      type: "transfer_pending",
      title: "Stock Transfer In Transit",
      message: "Transfer TRF-2026-004 dispatched from Karachi Main to Clifton Store. Pending physical receipt.",
      severity: "warning",
      read: false,
      link: "/app/stock/transfers",
      timestamp: "2026-11-19T11:05:00Z"
    },
    {
      id: "alt_003",
      type: "low_stock",
      title: "Low Stock Alert: Impact Drill",
      message: "750W Impact Electric Drill Machine is at 6 units in Clifton (Reorder threshold: 8 units).",
      severity: "warning",
      read: true,
      link: "/app/low-stock",
      timestamp: "2026-11-18T18:00:00Z"
    }
  ],

  subscription: {
    tenantId: "tenant_metro_01",
    planId: "growth",
    planName: "Growth Plan",
    status: "active",
    priceMonthlyPKR: 6999,
    branchLimit: 3,
    userLimit: 10,
    skuLimit: 5000,
    trialEndsAt: null,
    renewsAt: "2026-12-15T00:00:00Z",
    currentPeriodStart: "2026-11-15T00:00:00Z",
    usage: {
      branchesUsed: 3,
      usersUsed: 5,
      skusUsed: 10,
      aiVoiceMinutesUsed: 42,
      whatsappEventsSent: 280
    }
  },

  plans: [
    {
      id: "starter",
      name: "Starter",
      priceMonthly: 2999,
      priceAnnual: 29990,
      maxBranches: 1,
      maxUsers: 3,
      maxSkus: 1000,
      badge: "Essential Retail",
      features: [
        "1 Retail Branch & POS Terminal",
        "Up to 3 Team Members",
        "1,000 Active SKUs",
        "Barcode Scanning & Thermal Receipts",
        "Real-Time Stock Ledger",
        "Email Support"
      ]
    },
    {
      id: "growth",
      name: "Growth",
      priceMonthly: 6999,
      priceAnnual: 69990,
      maxBranches: 3,
      maxUsers: 10,
      maxSkus: 5000,
      badge: "Most Popular",
      recommended: true,
      features: [
        "Up to 3 Connected Branches",
        "Up to 10 Team Members (RBAC)",
        "5,000 Active SKUs & Variants",
        "Inter-Branch Transfers & Receiving",
        "WhatsApp Voice-to-Order AI Drafts (50 mins/mo)",
        "Physical Cycle Counting Sessions",
        "Priority WhatsApp Support"
      ]
    },
    {
      id: "business",
      name: "Business",
      priceMonthly: 12999,
      priceAnnual: 129990,
      maxBranches: 10,
      maxUsers: 30,
      maxSkus: 25000,
      badge: "Growing Enterprise",
      features: [
        "Up to 10 Branches & Warehouses",
        "Up to 30 Team Members",
        "25,000 Active SKUs",
        "Advanced Multi-Zone Bin Racking",
        "Full Wholesale & Customer Credit Control",
        "Unlimited WhatsApp Voice AI Extraction",
        "Dedicated Account Specialist"
      ]
    },
    {
      id: "enterprise",
      name: "Enterprise",
      priceMonthly: null, // Custom quotation
      priceAnnual: null,
      maxBranches: 999,
      maxUsers: 999,
      maxSkus: 100000,
      badge: "Custom Scale",
      features: [
        "Unlimited Branches & Franchises",
        "Unlimited User Seats & Custom RBAC",
        "Dedicated Cloud Isolation Option",
        "Custom ERP Migration Assistance",
        "24/7 Telephone SLA Guarantee"
      ]
    }
  ],

  tenants: [
    {
      id: "tenant_metro_01",
      name: "Metro Hardware Traders",
      businessType: "Retail & Wholesale Hardware",
      city: "Karachi",
      ownerName: "Abdul Qadir",
      email: "owner@metrohardware.pk",
      phone: "+92 300 8291001",
      planId: "growth",
      planName: "Growth Plan",
      status: "ACTIVE",
      branchesCount: 3,
      branchLimit: 3,
      usersCount: 5,
      userLimit: 10,
      mrrPKR: 6999,
      renewalDate: "2026-12-15",
      createdAt: "2026-01-15T09:00:00Z",
      voiceMinutesUsed: 42,
      voiceMinutesLimit: 100,
      whatsappEventsUsed: 280,
      whatsappEventsLimit: 1000,
      ntn: "7294812-4",
      strn: "32-77-8761-901-28",
      address: "Plot 42-C, Commercial Area, Badar Commercial, Phase V, DHA, Karachi"
    },
    {
      id: "tenant_clifton_02",
      name: "Clifton Electronics & Lighting",
      businessType: "Consumer Electronics & Fixtures",
      city: "Karachi",
      ownerName: "Tariq Jameel",
      email: "tariq@cliftonelec.pk",
      phone: "+92 301 5566778",
      planId: "business",
      planName: "Business Plan",
      status: "ACTIVE",
      branchesCount: 4,
      branchLimit: 10,
      usersCount: 12,
      userLimit: 30,
      mrrPKR: 12999,
      renewalDate: "2026-12-01",
      createdAt: "2026-02-10T11:30:00Z",
      voiceMinutesUsed: 120,
      voiceMinutesLimit: 300,
      whatsappEventsUsed: 940,
      whatsappEventsLimit: 2500,
      ntn: "8192301-2",
      strn: "32-77-9002-111-04",
      address: "Shop 14, Block 2, Clifton Marine Drive, Karachi"
    },
    {
      id: "tenant_punjab_03",
      name: "Punjab Fasteners & Tools Depot",
      businessType: "Industrial Hardware & Tools",
      city: "Lahore",
      ownerName: "Imran Khan",
      email: "imran@fasteners.pk",
      phone: "+92 322 7788990",
      planId: "starter",
      planName: "Starter Plan",
      status: "TRIAL",
      branchesCount: 1,
      branchLimit: 1,
      usersCount: 2,
      userLimit: 3,
      mrrPKR: 2999,
      renewalDate: "2026-11-28",
      createdAt: "2026-11-14T08:00:00Z",
      voiceMinutesUsed: 15,
      voiceMinutesLimit: 30,
      whatsappEventsUsed: 85,
      whatsappEventsLimit: 200,
      ntn: "6401928-8",
      strn: "28-04-1234-567-89",
      address: "Circular Road, Brandreth Road Hardware Market, Lahore"
    },
    {
      id: "tenant_islamabad_04",
      name: "Capital Paint & Decor Emporium",
      businessType: "Architectural Coatings & Paints",
      city: "Islamabad",
      ownerName: "Rashid Minhas",
      email: "rashid@capitalpaint.pk",
      phone: "+92 333 9900112",
      planId: "growth",
      planName: "Growth Plan",
      status: "ACTIVE",
      branchesCount: 2,
      branchLimit: 3,
      usersCount: 6,
      userLimit: 10,
      mrrPKR: 6999,
      renewalDate: "2026-12-20",
      createdAt: "2026-03-01T14:00:00Z",
      voiceMinutesUsed: 35,
      voiceMinutesLimit: 100,
      whatsappEventsUsed: 310,
      whatsappEventsLimit: 1000,
      ntn: "5509124-1",
      strn: "11-02-8876-543-21",
      address: "Blue Area, Jinnah Avenue, Islamabad"
    }
  ],

  supportTickets: [
    {
      id: "TKT-1082",
      tenantId: "tenant_metro_01",
      tenantName: "Metro Hardware Traders",
      subject: "Configuring second POS counter for Clifton branch",
      severity: "Normal",
      status: "Resolved",
      createdAt: "2026-11-18T10:30:00Z",
      messages: [
        { sender: "Abdul Qadir (Owner)", text: "We added a second Windows counter terminal at Clifton. How do we configure receipt auto-print?", time: "2026-11-18 10:30" },
        { sender: "Platform Support (Zainab)", text: "Enable raw ESC/POS USB passthrough in Settings -> Hardware Configuration. Counter is now active.", time: "2026-11-18 11:15" }
      ]
    },
    {
      id: "TKT-1085",
      tenantId: "tenant_clifton_02",
      tenantName: "Clifton Electronics",
      subject: "Inquiry regarding bulk CSV import format for lighting items",
      severity: "High",
      status: "Open",
      createdAt: "2026-11-19T14:10:00Z",
      messages: [
        { sender: "Tariq Jameel (Owner)", text: "Need guidance on mapping custom serial numbers in the bulk CSV stock import sheet.", time: "2026-11-19 14:10" }
      ]
    },
    {
      id: "TKT-1089",
      tenantId: "tenant_punjab_03",
      tenantName: "Punjab Fasteners Depot",
      subject: "Requesting trial extension for evaluation with warehouse team",
      severity: "Normal",
      status: "In Progress",
      createdAt: "2026-11-20T09:45:00Z",
      messages: [
        { sender: "Imran Khan (Owner)", text: "Our stock manager was away this week. Could we please extend our 14-day trial by 7 days?", time: "2026-11-20 09:45" },
        { sender: "Platform Support (Zainab)", text: "Granted! We have extended your Starter trial to 2026-12-05.", time: "2026-11-20 10:05" }
      ]
    }
  ],

  platformSettings: {
    maintenanceMode: false,
    whatsappWebhookActive: true,
    aiSpeechQueueActive: true,
    pwaOfflineWorkerActive: true,
    autoFbrTaxSync: true,
    thermalPrinterRawDriver: true,
    edgeRegion: "Karachi Edge (Khi-01)",
    apiRateLimitPerMin: 1200
  },

  platformAuditLogs: [
    {
      id: "aud_01",
      timestamp: "2026-11-20 11:45:10",
      operator: "Zainab Malik (PLATFORM_ADMIN)",
      action: "PLAN_QUOTA_ADJUST",
      tenant: "Metro Hardware Traders",
      details: "Adjusted WhatsApp AI Voice minutes quota to 100 mins"
    },
    {
      id: "aud_02",
      timestamp: "2026-11-19 16:40:00",
      operator: "Zainab Malik (PLATFORM_ADMIN)",
      action: "PLAN_UPDATE",
      tenant: "Metro Hardware Traders",
      details: "Upgraded subscription tier to Growth Plan (3 branches)"
    },
    {
      id: "aud_03",
      timestamp: "2026-11-18 10:15:00",
      operator: "Zainab Malik (PLATFORM_ADMIN)",
      action: "TENANT_PROVISION",
      tenant: "Punjab Fasteners Depot",
      details: "Provisioned new 14-day evaluation instance"
    }
  ]
};
