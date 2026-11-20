/**
 * MetriSolution Inventory ERP SaaS - Structured Legal & Compliance Policy Views
 * Independently navigable policy pages with Table of Contents and proposed legal notices.
 */

import { getIcon } from '../../components/icons.js';

function renderPolicyLayout(title, lastUpdated, tocItems, bodyHtml) {
  return {
    html: `
      <section style="padding:var(--space-12) var(--space-6);background:var(--color-surface);border-bottom:1px solid var(--color-border);">
        <div style="max-width:980px;margin:0 auto;">
          <span class="badge badge-neutral" style="margin-bottom:8px;">Legal & Trust Center</span>
          <h1 class="text-title-1" style="margin-bottom:8px;">${title}</h1>
          <div style="font-size:13px;color:var(--color-text-muted);">
            Last Updated: ${lastUpdated} • Version: 1.0.0 (Proposed Draft)
          </div>
        </div>
      </section>

      <section style="padding:var(--space-12) var(--space-6);max-width:980px;margin:0 auto;">
        <div class="card" style="padding:16px 20px;background:#FFFAEB;border-color:#FEDF89;margin-bottom:32px;font-size:13px;color:#B54708;">
          <strong>Draft Policy Notice:</strong> This document reflects the proposed operational and compliance framework for MetriSolution Inventory ERP SaaS. It is presented for demonstration and review purposes and does not constitute finalized executed legal counsel.
        </div>

        <div style="display:grid;grid-template-columns:260px 1fr;gap:40px;">
          <!-- Table of Contents -->
          <aside style="position:sticky;top:80px;height:fit-content;">
            <div class="card" style="padding:20px;">
              <div style="font-size:12px;font-weight:700;color:var(--color-navy);text-transform:uppercase;margin-bottom:12px;">
                Table of Contents
              </div>
              <ul style="list-style:none;display:flex;flex-direction:column;gap:8px;font-size:13px;">
                ${tocItems.map(item => `
                  <li>
                    <a href="#${item.id}" style="color:var(--color-text-secondary);text-decoration:none;display:block;padding:2px 0;">
                      ${item.label}
                    </a>
                  </li>
                `).join('')}
              </ul>
            </div>
          </aside>

          <!-- Policy Prose -->
          <article style="font-size:15px;line-height:1.75;color:var(--color-text-primary);">
            ${bodyHtml}
          </article>
        </div>
      </section>
    `,
    init: () => {}
  };
}

export function LegalPrivacyView() {
  return renderPolicyLayout(
    'Privacy Policy',
    'November 2026',
    [
      { id: 'data-categories', label: '1. Data Categories Collected' },
      { id: 'inventory-data', label: '2. Retail & Inventory Records' },
      { id: 'voice-recordings', label: '3. Voice Recordings & Audio' },
      { id: 'whatsapp-integration', label: '4. WhatsApp Messaging Data' },
      { id: 'data-retention', label: '5. Retention & Deletion Rights' },
      { id: 'contact-privacy', label: '6. Privacy Officer Contact' }
    ],
    `
      <h2 id="data-categories" style="font-size:20px;margin-bottom:12px;color:var(--color-navy);">1. Data Categories Collected</h2>
      <p style="margin-bottom:16px;">
        MetriSolution Pvt Ltd ("MetriSolution", "we", "us") collects account credentials, business profile details, employee identities, and operational logs required to provide cloud inventory management and point-of-sale services to registered retailers.
      </p>

      <h2 id="inventory-data" style="font-size:20px;margin-top:32px;margin-bottom:12px;color:var(--color-navy);">2. Retail & Inventory Records</h2>
      <p style="margin-bottom:16px;">
        All product catalogs, stock balances, cost margins, purchase orders, sales transactions, and customer credit registries uploaded or generated within a tenant workspace remain the exclusive confidential property of the business tenant. MetriSolution does not sell, broker, or monetize retailer transactional data.
      </p>

      <h2 id="voice-recordings" style="font-size:20px;margin-top:32px;margin-bottom:12px;color:var(--color-navy);">3. Voice Recordings & Audio Consent</h2>
      <p style="margin-bottom:16px;">
        When utilizing the WhatsApp Voice-to-Order capability, incoming customer voice notes are transcribed to text and processed for entity extraction. Audio data is utilized strictly for order draft extraction and remains accessible exclusively to authorized store staff for verification. Plaintext transcripts are retained only for the duration specified by the retailer's retention preferences.
      </p>

      <h2 id="whatsapp-integration" style="font-size:20px;margin-top:32px;margin-bottom:12px;color:var(--color-navy);">4. WhatsApp Messaging Integration</h2>
      <p style="margin-bottom:16px;">
        Optional messaging integrations utilize official WhatsApp Business APIs. Customer contact numbers and outbound delivery updates flow through encrypted communication tunnels strictly for order notification and fulfillment verification.
      </p>

      <h2 id="data-retention" style="font-size:20px;margin-top:32px;margin-bottom:12px;color:var(--color-navy);">5. Retention & Deletion Rights</h2>
      <p style="margin-bottom:16px;">
        Business owners maintain the right to export full transactional ledgers in CSV format at any time. Upon verified account termination, non-financial operational records are scheduled for cryptographic erasure within 60 calendar days.
      </p>

      <h2 id="contact-privacy" style="font-size:20px;margin-top:32px;margin-bottom:12px;color:var(--color-navy);">6. Privacy Officer Contact</h2>
      <p>
        For inquiries regarding data processing, consent withdrawal, or subject access requests, contact our Data Privacy Officer at <a href="mailto:privacy@metrisolution.com" style="color:var(--color-primary);">privacy@metrisolution.com</a>.
      </p>
    `
  );
}

export function LegalTermsView() {
  return renderPolicyLayout(
    'Terms of Service',
    'November 2026',
    [
      { id: 'acceptance', label: '1. Acceptance & Eligibility' },
      { id: 'subscription-terms', label: '2. Subscriptions & Billing' },
      { id: 'user-responsibilities', label: '3. Retailer Responsibilities' },
      { id: 'liability', label: '4. Limitation of Liability' },
      { id: 'governing-law', label: '5. Governing Jurisdiction' }
    ],
    `
      <h2 id="acceptance" style="font-size:20px;margin-bottom:12px;color:var(--color-navy);">1. Acceptance & Eligibility</h2>
      <p style="margin-bottom:16px;">
        By creating an account or accessing the MetriSolution SaaS platform, you agree to comply with these Terms of Service. You represent that you are an authorized representative of a legitimate business entity.
      </p>

      <h2 id="subscription-terms" style="font-size:20px;margin-top:32px;margin-bottom:12px;color:var(--color-navy);">2. Subscriptions & Billing</h2>
      <p style="margin-bottom:16px;">
        Subscription tiers (Starter, Growth, Business, Enterprise) specify explicit quotas for connected branch locations, active staff seats, and monthly voice processing minutes. Upgrades occur immediately with pro-rated billing; downgrades take effect at the conclusion of the active billing cycle without automated data deletion.
      </p>

      <h2 id="user-responsibilities" style="font-size:20px;margin-top:32px;margin-bottom:12px;color:var(--color-navy);">3. Retailer Responsibilities</h2>
      <p style="margin-bottom:16px;">
        Tenants are solely responsible for verifying the accuracy of product pricing, sales tax percentages (GST), physical cycle counts, and approving draft AI voice orders prior to final customer delivery.
      </p>

      <h2 id="liability" style="font-size:20px;margin-top:32px;margin-bottom:12px;color:var(--color-navy);">4. Limitation of Liability</h2>
      <p style="margin-bottom:16px;">
        MetriSolution provides operational SaaS management tools on an "as is" and "as available" basis. MetriSolution is not an authorized statutory auditing agency and does not guarantee tax compliance or fiscalization certifications.
      </p>

      <h2 id="governing-law" style="font-size:20px;margin-top:32px;margin-bottom:12px;color:var(--color-navy);">5. Governing Jurisdiction</h2>
      <p>
        These terms shall be governed by and construed in accordance with the applicable laws of the Islamic Republic of Pakistan, subject to the jurisdiction of competent courts in Karachi.
      </p>
    `
  );
}

export function LegalCookiesView() {
  return renderPolicyLayout(
    'Cookie Notice & Local Storage Policy',
    'November 2026',
    [
      { id: 'essential-cookies', label: '1. Essential Session Storage' },
      { id: 'demo-persistence', label: '2. Demonstration Persistence' },
      { id: 'preferences', label: '3. User Interface Preferences' }
    ],
    `
      <h2 id="essential-cookies" style="font-size:20px;margin-bottom:12px;color:var(--color-navy);">1. Essential Session Storage</h2>
      <p style="margin-bottom:16px;">
        We utilize essential session tokens and cryptographic cookies strictly necessary to maintain active user login states and route permissions across page reloads.
      </p>

      <h2 id="demo-persistence" style="font-size:20px;margin-top:32px;margin-bottom:12px;color:var(--color-navy);">2. Demonstration Persistence in Local Storage</h2>
      <p style="margin-bottom:16px;">
        In this prototype environment, sample operational changes (such as new sales transactions and stock transfers) are safely preserved in your browser's <code>localStorage</code> under <code>metrisolution_erp_state_v1</code>. No passwords or private tokens are stored. You may reset this data at any time via the "Reset Data" control in the top bar.
      </p>

      <h2 id="preferences" style="font-size:20px;margin-top:32px;margin-bottom:12px;color:var(--color-navy);">3. User Interface Preferences</h2>
      <p>
        Local storage is additionally used to remember non-sensitive UI settings such as your active branch filter and sidebar collapse preferences.
      </p>
    `
  );
}

export function LegalAcceptableUseView() {
  return renderPolicyLayout(
    'Acceptable Use Policy (AUP)',
    'November 2026',
    [
      { id: 'prohibited-activities', label: '1. Prohibited Activities' },
      { id: 'system-abuse', label: '2. System Integrity & Rate Limits' },
      { id: 'enforcement', label: '3. Suspension & Enforcement' }
    ],
    `
      <h2 id="prohibited-activities" style="font-size:20px;margin-bottom:12px;color:var(--color-navy);">1. Prohibited Activities</h2>
      <p style="margin-bottom:16px;">
        Users may not utilize MetriSolution to catalog illicit contraband, conduct fraudulent financial invoicing, forge tax certificates, or distribute spam messaging via integrated communications channels.
      </p>

      <h2 id="system-abuse" style="font-size:20px;margin-top:32px;margin-bottom:12px;color:var(--color-navy);">2. System Integrity & Rate Limits</h2>
      <p style="margin-bottom:16px;">
        Automated scraping, penetration testing without prior authorization, denial-of-service simulations, or attempts to bypass role-based access restrictions are strictly prohibited.
      </p>

      <h2 id="enforcement" style="font-size:20px;margin-top:32px;margin-bottom:12px;color:var(--color-navy);">3. Suspension & Enforcement</h2>
      <p>
        MetriSolution reserves the right to immediately suspend tenant instances violating this policy to preserve platform integrity.
      </p>
    `
  );
}

export function LegalDpaView() {
  return renderPolicyLayout(
    'Data Processing Addendum (DPA)',
    'November 2026',
    [
      { id: 'roles', label: '1. Processor & Controller Roles' },
      { id: 'security-measures', label: '2. Technical & Organizational Measures' },
      { id: 'subprocessors', label: '3. Authorized Subprocessors' }
    ],
    `
      <h2 id="roles" style="font-size:20px;margin-bottom:12px;color:var(--color-navy);">1. Processor & Controller Roles</h2>
      <p style="margin-bottom:16px;">
        Under this Addendum, the business tenant acts as the Data Controller with respect to customer contact records and staff information. MetriSolution acts as the Data Processor processing data solely in accordance with documented tenant instructions.
      </p>

      <h2 id="security-measures" style="font-size:20px;margin-top:32px;margin-bottom:12px;color:var(--color-navy);">2. Technical & Organizational Measures</h2>
      <p style="margin-bottom:16px;">
        The processor implements role-based access control, cryptographic data protection in transit (TLS 1.3), automated daily backups, and strict employee confidentiality obligations.
      </p>

      <h2 id="subprocessors" style="font-size:20px;margin-top:32px;margin-bottom:12px;color:var(--color-navy);">3. Authorized Subprocessors</h2>
      <p>
        The controller grants general authorization for MetriSolution to engage vetted cloud hosting and communication subprocessors as detailed on our Subprocessors registry.
      </p>
    `
  );
}

export function LegalSecurityView() {
  return renderPolicyLayout(
    'Security Policy & Incident Management',
    'November 2026',
    [
      { id: 'infrastructure', label: '1. Cloud Infrastructure Security' },
      { id: 'access-control', label: '2. Administrative Access Controls' },
      { id: 'incident-response', label: '3. Incident Response Protocol' }
    ],
    `
      <h2 id="infrastructure" style="font-size:20px;margin-bottom:12px;color:var(--color-navy);">1. Cloud Infrastructure Security</h2>
      <p style="margin-bottom:16px;">
        Production environments utilize segmented virtual private clouds (VPC), automated intrusion detection systems, web application firewalls (WAF), and multi-region backup replication.
      </p>

      <h2 id="access-control" style="font-size:20px;margin-top:32px;margin-bottom:12px;color:var(--color-navy);">2. Administrative Access Controls</h2>
      <p style="margin-bottom:16px;">
        Direct access to production clusters requires hardware-bound Multi-Factor Authentication (MFA), ephemeral bastion connections, and strict peer review.
      </p>

      <h2 id="incident-response" style="font-size:20px;margin-top:32px;margin-bottom:12px;color:var(--color-navy);">3. Incident Response Protocol</h2>
      <p>
        In the event of a verified security incident affecting tenant operational records, MetriSolution maintains a protocol to notify impacted business administrators within 72 hours of verification.
      </p>
    `
  );
}

export function LegalSubprocessorsView() {
  return renderPolicyLayout(
    'Subprocessors Directory',
    'November 2026',
    [
      { id: 'hosting-infra', label: '1. Hosting & Database Infrastructure' },
      { id: 'communications', label: '2. Telecommunications & Voice' }
    ],
    `
      <h2 id="hosting-infra" style="font-size:20px;margin-bottom:12px;color:var(--color-navy);">1. Hosting & Database Infrastructure</h2>
      <p style="margin-bottom:16px;">
        - <strong>Amazon Web Services (AWS) / Cloudflare:</strong> Cloud CDN, DDoS protection, edge routing, encrypted object storage.<br>
        - <strong>PostgreSQL Enterprise Cluster:</strong> High-availability managed transactional database.
      </p>

      <h2 id="communications" style="font-size:20px;margin-top:32px;margin-bottom:12px;color:var(--color-navy);">2. Telecommunications & Voice</h2>
      <p>
        - <strong>Meta / WhatsApp Cloud API:</strong> Encrypted enterprise webhook gateway for customer voice note receipt and notification dispatch.
      </p>
    `
  );
}

export function LegalRefundView() {
  return renderPolicyLayout(
    'Refund & Cancellation Policy',
    'November 2026',
    [
      { id: 'free-trial', label: '1. 14-Day Free Evaluation' },
      { id: 'refunds', label: '2. Refund Eligibility' },
      { id: 'cancellation', label: '3. Subscription Cancellation' }
    ],
    `
      <h2 id="free-trial" style="font-size:20px;margin-bottom:12px;color:var(--color-navy);">1. 14-Day Free Evaluation</h2>
      <p style="margin-bottom:16px;">
        All new business accounts receive an unrestricted 14-day evaluation trial of the Growth Plan. No payment method is required to activate the trial.
      </p>

      <h2 id="refunds" style="font-size:20px;margin-top:32px;margin-bottom:12px;color:var(--color-navy);">2. Refund Eligibility</h2>
      <p style="margin-bottom:16px;">
        If you are unsatisfied with your first paid subscription, you may request a full refund within 14 calendar days of your initial payment. Pro-rated refunds are not issued for mid-cycle cancellations.
      </p>

      <h2 id="cancellation" style="font-size:20px;margin-top:32px;margin-bottom:12px;color:var(--color-navy);">3. Subscription Cancellation</h2>
      <p>
        Owners can cancel their subscription at any time via the Billing dashboard. Your account remains active until the end of the paid billing cycle, after which it transitions to read-only access.
      </p>
    `
  );
}

export function LegalSubscriptionView() {
  return renderPolicyLayout(
    'Subscription Lifecycle & Grace Period Policy',
    'November 2026',
    [
      { id: 'lifecycle-stages', label: '1. Account Lifecycle Stages' },
      { id: 'past-due', label: '2. Past-Due & Grace Period' },
      { id: 'data-preservation', label: '3. Data Preservation Guarantee' }
    ],
    `
      <h2 id="lifecycle-stages" style="font-size:20px;margin-bottom:12px;color:var(--color-navy);">1. Account Lifecycle Stages</h2>
      <p style="margin-bottom:16px;">
        MetriSolution accounts transition through six explicit lifecycle states: <code>Trial</code> → <code>Active</code> → <code>Past Due</code> → <code>Grace Period</code> → <code>Restricted</code> → <code>Cancelled</code>.
      </p>

      <h2 id="past-due" style="font-size:20px;margin-top:32px;margin-bottom:12px;color:var(--color-navy);">2. Past-Due & 7-Day Grace Period</h2>
      <p style="margin-bottom:16px;">
        If a monthly subscription payment fails, the account enters a 7-day Grace Period. Full POS checkout and inventory operations remain completely uninterrupted while administrative alerts notify the owner to update payment details.
      </p>

      <h2 id="data-preservation" style="font-size:20px;margin-top:32px;margin-bottom:12px;color:var(--color-navy);">3. Data Preservation Guarantee</h2>
      <p>
        Downgrading a plan or entering restricted mode will never delete existing inventory records or past invoice history. Business records remain safely preserved in read-only mode for at least 180 days.
      </p>
    `
  );
}
