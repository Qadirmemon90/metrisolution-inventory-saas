# MetriSolution Inventory ERP SaaS — Frontend Security & Architecture Notes

**Author:** Application Security Specialist  
**Product:** MetriSolution Inventory ERP SaaS  
**Version:** 1.0.0  

---

## 1. Security-First Engineering Principles

MetriSolution's frontend prototype implements production-grade defensive programming practices while maintaining an isolated, safe demonstration environment.

### Core Mitigations Implemented:
1. **Safe CSV Formula-Injection Mitigation (CWE-1236):**
   When exporting tabular reports or stock ledgers to CSV (`src/services/exportService.js`), any cell value beginning with dangerous formula characters (`=`, `+`, `-`, `@`, `\t`, `\r`) is automatically sanitized by prepending a single quote (`'`). This prevents arbitrary code or command execution inside Microsoft Excel or Google Sheets.
2. **Safe Input Sanitization & Escaping:**
   Values rendered into the DOM avoid unescaped user input interpolation. Text fields are safely encoded, and numeric inputs validate positive integers.
3. **No Hardcoded Secrets or Tokens:**
   No real API secrets, cloud credentials, database connection strings, or third-party private keys exist in this codebase.
4. **Strict Human-in-the-Loop AI Boundary:**
   The AI Voice-to-Order intelligence engine strictly creates **Draft** states. The system architecturally prevents automated finalization of financial transactions, stock deductions, or customer invoicing without authorized human confirmation.

---

## 2. Cryptographic Architecture: Plain Language Definitions

To maintain absolute transparency with investors, clients, and technical auditors, MetriSolution explicitly distinguishes three tiers of encryption:

### A. Encryption in Transit (HTTPS / TLS 1.3)
Protects network traffic flowing between the customer's web browser and MetriSolution's cloud edge servers. Prevents eavesdropping and man-in-the-middle attacks on public or cellular networks.

### B. Encryption at Rest (AES-256)
Protects physical database storage volumes, tenant file attachments, and automated backups on cloud servers. In the event physical storage hardware is compromised, the encrypted data remains unreadable without cloud master keys.

### C. End-to-End Encryption (E2EE) — Architectural Reality
> [!IMPORTANT]
> MetriSolution does **not** falsely claim the entire SaaS ERP operates with end-to-end encryption.
> Server-side speech-to-text transcription, AI candidate matching, and multi-user transactional ledger syncing require server-side comprehension of plaintext data. Claiming full E2EE while performing server-side AI extraction would be technically fraudulent. MetriSolution enforces strict zero-knowledge tenant isolation at the database layer rather than misleading E2EE marketing claims.

---

## 3. Role-Based Access Control (RBAC) UX Simulation

The frontend enforces access control across all 5 roles:
* `PLATFORM_ADMIN`: Access restricted to `/platform/*`.
* `OWNER`: Full tenant administrative, financial, and billing control.
* `MANAGER`: Operational branch control, discount and voice draft approvals.
* `SALES`: Dedicated retail checkout (`/app/pos`). Wholesale cost prices and profit margins are **strictly masked**.
* `WAREHOUSE`: Physical stock handling (`/app/stock/receiving`, `/app/stock/transfers`, `/app/stock/counts`). Checkout registers and billing ownership are forbidden.

*Security Notice:* In this frontend demonstration, route guarding and role switching simulate authorization for user experience evaluation. Production deployments must enforce identical cryptographic authorization checks on the server gateway.
