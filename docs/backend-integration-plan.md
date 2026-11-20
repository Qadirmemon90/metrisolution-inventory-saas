# MetriSolution Inventory ERP SaaS — Backend Integration Architecture Plan

**Document Version:** 1.0.0  
**Author:** Principal SaaS Product Architect  
**Purpose:** Specification for future production backend engineering and API contracts.  

---

## 1. Overview & Service Contracts

This document outlines the RESTful API endpoints and webhook schemas required to transition MetriSolution from its client-side demonstration store into a distributed cloud backend architecture.

All requests require standard TLS 1.3 encryption, `Content-Type: application/json`, and an `Authorization: Bearer <jwt_token>` header containing tenant isolation claims.

---

## 2. API Endpoint Directory

### 2.1 Authentication & Tenant Context
* `POST /api/v1/auth/login`: Authenticates credentials, returns signed session JWT with `tenant_id`, `user_id`, and `role`.
* `POST /api/v1/auth/register`: Provisions new tenant organization and initiates onboarding state machine.
* `POST /api/v1/auth/refresh`: Refreshes short-lived access tokens via secure `HttpOnly` refresh cookies.

### 2.2 Products & Stock Ledger
* `GET /api/v1/products`: Filterable by `branch_id`, `category_id`, and search string. Returns sanitized inventory with role-based field masking (cost price masked for `SALES`).
* `POST /api/v1/products`: Creates new SKU with unique barcode validation and packaging box ratio.
* `GET /api/v1/stock/ledger`: Queries chronological immutable ledger entries (`IN`, `OUT`, `TRANSFER`, `ADJUSTMENT`, `RETURN`, `RESERVE`).
* `POST /api/v1/stock/movements`: Internal transactional endpoint executing atomic inventory increments or deductions with double-entry audit logging.

### 2.3 POS Checkout & Invoicing
* `POST /api/v1/pos/checkout`:
  ```json
  {
    "branch_id": "branch_main",
    "customer_id": "cust_walkin",
    "items": [
      { "product_id": "prod_drill_01", "quantity": 1, "unit_price": 8200 }
    ],
    "payment_method": "cash",
    "amount_paid": 10000,
    "discount_amount": 200
  }
  ```
  *Response:* Returns committed `invoice_id`, `invoice_number`, updated stock balances, and change returned.

### 2.4 Inter-Branch Transfers
* `POST /api/v1/transfers/request`: Creates transfer manifest in `requested` state.
* `POST /api/v1/transfers/:id/dispatch`: Deducts source branch stock and transitions manifest to `in_transit`.
* `POST /api/v1/transfers/:id/receive`: Increments destination branch stock and logs any discrepancy notes.

### 2.5 WhatsApp Cloud API & Voice AI Ingestion
* `POST /api/v1/webhooks/whatsapp`: Receives inbound WhatsApp webhook events from Meta Cloud API containing media audio payloads.
* `POST /api/v1/ai/voice/transcribe`: Asynchronously executes speech-to-text transcription and entity extraction, generating an `AiDraft` record in `pending_review` status.
* `POST /api/v1/ai/drafts/:id/approve`: Human authorization endpoint converting approved draft into confirmed `SalesOrder` with stock reservation.

### 2.6 Subscriptions & Platform Administration
* `GET /api/v1/platform/tenants`: Platform operator endpoint listing all active SaaS retailer organizations.
* `POST /api/v1/platform/tenants/:id/suspend`: Toggles administrative suspension of a misbehaving or delinquent tenant.
* `POST /api/v1/billing/upgrade`: Modifies subscription quota limits and schedules pro-rated commercial billing.
