/**
 * MetriSolution Inventory ERP SaaS - 5-Step Business Onboarding Wizard
 */

import { store } from '../../services/store.js';
import { getIcon } from '../../components/icons.js';
import { toast } from '../../components/toast.js';
import { parseCsvText, getSampleProductCsv } from '../../services/csvParser.js';

function renderWizardHeader(currentStep) {
  const steps = [
    { num: 1, label: 'Business Profile', path: '/setup/business' },
    { num: 2, label: 'Branch & Store', path: '/setup/branch' },
    { num: 3, label: 'Invite Team', path: '/setup/team' },
    { num: 4, label: 'Import Catalog', path: '/setup/import' },
    { num: 5, label: 'Select Plan', path: '/setup/plan' }
  ];

  return `
    <div style="background:var(--color-surface);border-bottom:1px solid var(--color-border);padding:24px 20px;">
      <div style="max-width:840px;margin:0 auto;">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;">
          <div class="brand-logo" style="font-size:18px;">
            <div class="brand-icon-box" style="width:30px;height:30px;">
              ${getIcon('box', '', 18)}
            </div>
            <span>MetriSolution Setup Wizard</span>
          </div>
          <span class="badge badge-primary">Step ${currentStep} of 5</span>
        </div>

        <div style="display:flex;align-items:center;justify-content:space-between;position:relative;">
          <div style="position:absolute;top:16px;left:24px;right:24px;height:2px;background:#E4E7EC;z-index:1;"></div>
          ${steps.map(s => {
            const isCompleted = s.num < currentStep;
            const isCurrent = s.num === currentStep;
            return `
              <div style="display:flex;flex-direction:column;align-items:center;position:relative;z-index:2;">
                <div style="
                  width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:13px;
                  background:${isCurrent ? 'var(--color-primary)' : (isCompleted ? '#ECFDF3' : '#FFFFFF')};
                  color:${isCurrent ? '#FFFFFF' : (isCompleted ? '#027A48' : '#98A2B3')};
                  border:2px solid ${isCurrent ? 'var(--color-primary)' : (isCompleted ? '#027A48' : '#E4E7EC')};
                ">
                  ${isCompleted ? getIcon('check', '', 16) : s.num}
                </div>
                <span style="font-size:11px;font-weight:${isCurrent ? '700' : '500'};color:${isCurrent ? 'var(--color-navy)' : 'var(--color-text-muted)'};margin-top:6px;">
                  ${s.label}
                </span>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    </div>
  `;
}

export function SetupBusinessView(params, router) {
  const tenant = store.getState().tenant;

  return {
    html: `
      ${renderWizardHeader(1)}
      <div style="max-width:680px;margin:32px auto;padding:0 20px;">
        <div class="card" style="padding:32px;">
          <h2 class="text-title-3" style="margin-bottom:8px;">Step 1: Your Business Profile</h2>
          <p class="text-body-sm" style="margin-bottom:24px;">Configure your registered enterprise identity and regional Pakistani defaults.</p>

          <form id="step1-form">
            <div class="form-group">
              <label class="form-label" for="wz-biz-name">Business Legal Name <span class="required-star">*</span></label>
              <input type="text" id="wz-biz-name" class="form-control" value="${tenant.name}" required>
            </div>

            <div class="form-group">
              <label class="form-label" for="wz-biz-type">Business Category</label>
              <select id="wz-biz-type" class="form-control">
                <option value="hardware" selected>Hardware, Tools & Building Materials</option>
                <option value="retail">General Retail & Department Store</option>
                <option value="electrical">Electrical, Lighting & Cables</option>
                <option value="wholesale">Wholesale & Fleet Distribution</option>
              </select>
            </div>

            <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
              <div class="form-group">
                <label class="form-label" for="wz-phone">Primary Contact Phone</label>
                <input type="tel" id="wz-phone" class="form-control" value="${tenant.phone}">
              </div>
              <div class="form-group">
                <label class="form-label" for="wz-email">Notification Email</label>
                <input type="email" id="wz-email" class="form-control" value="${tenant.email}">
              </div>
            </div>

            <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
              <div class="form-group">
                <label class="form-label">Operating Currency</label>
                <input type="text" class="form-control" value="PKR (Pakistani Rupee)" disabled>
              </div>
              <div class="form-group">
                <label class="form-label">System Timezone</label>
                <input type="text" class="form-control" value="Asia/Karachi (UTC+5)" disabled>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label" for="wz-tax">Default Sales Tax / GST Rate (%)</label>
              <input type="number" id="wz-tax" class="form-control" value="${tenant.taxRatePercent}" min="0" max="35" step="0.5">
            </div>

            <div style="display:flex;justify-content:flex-end;margin-top:24px;">
              <button type="submit" class="btn btn-primary btn-lg">
                Continue to Branch Setup
                ${getIcon('arrow-right', '', 16)}
              </button>
            </div>
          </form>
        </div>
      </div>
    `,
    init: () => {
      const form = document.getElementById('step1-form');
      if (form) {
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          store.getState().tenant.name = document.getElementById('wz-biz-name').value;
          store.saveState();
          toast.success('Business profile updated');
          router.navigate('/setup/branch');
        });
      }
    }
  };
}

export function SetupBranchView(params, router) {
  return {
    html: `
      ${renderWizardHeader(2)}
      <div style="max-width:680px;margin:32px auto;padding:0 20px;">
        <div class="card" style="padding:32px;">
          <h2 class="text-title-3" style="margin-bottom:8px;">Step 2: Primary Branch & Storage</h2>
          <p class="text-body-sm" style="margin-bottom:24px;">Define your flagship retail counter and primary warehouse facility.</p>

          <form id="step2-form">
            <div class="form-group">
              <label class="form-label" for="wz-branch-name">Primary Branch Name <span class="required-star">*</span></label>
              <input type="text" id="wz-branch-name" class="form-control" value="Karachi Main Hub" required>
            </div>

            <div class="form-group">
              <label class="form-label" for="wz-branch-addr">Physical Address</label>
              <input type="text" id="wz-branch-addr" class="form-control" value="Badar Commercial Area, Phase V, DHA, Karachi">
            </div>

            <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
              <div class="form-group">
                <label class="form-label" for="wz-wh-name">Main Warehouse Name</label>
                <input type="text" id="wz-wh-name" class="form-control" value="Central Distribution Warehouse A">
              </div>
              <div class="form-group">
                <label class="form-label" for="wz-pos-counter">POS Counter Terminal ID</label>
                <input type="text" id="wz-pos-counter" class="form-control" value="Counter 01 (Front Checkout)">
              </div>
            </div>

            <div style="display:flex;justify-content:space-between;margin-top:24px;">
              <a href="/setup/business" data-nav class="btn btn-secondary">Back</a>
              <button type="submit" class="btn btn-primary btn-lg">
                Continue to Team Setup
                ${getIcon('arrow-right', '', 16)}
              </button>
            </div>
          </form>
        </div>
      </div>
    `,
    init: () => {
      const form = document.getElementById('step2-form');
      if (form) {
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          toast.success('Branch & storage defaults saved');
          router.navigate('/setup/team');
        });
      }
    }
  };
}

export function SetupTeamView(params, router) {
  const users = store.getUsers();

  return {
    html: `
      ${renderWizardHeader(3)}
      <div style="max-width:760px;margin:32px auto;padding:0 20px;">
        <div class="card" style="padding:32px;">
          <h2 class="text-title-3" style="margin-bottom:8px;">Step 3: Team Members & Role Assignments</h2>
          <p class="text-body-sm" style="margin-bottom:24px;">Pre-configured team members for this business. You can add additional mock staff.</p>

          <div class="table-container" style="margin-bottom:24px;">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Staff Member</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Assigned Branch</th>
                </tr>
              </thead>
              <tbody id="team-list-tbody">
                ${users.map(u => `
                  <tr>
                    <td><strong>${u.name}</strong></td>
                    <td style="color:#666;font-family:monospace;font-size:12px;">${u.email}</td>
                    <td><span class="badge ${u.role === 'OWNER' ? 'badge-primary' : (u.role === 'MANAGER' ? 'badge-info' : 'badge-neutral')}">${u.role}</span></td>
                    <td>Karachi Main / Clifton</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <div style="display:flex;justify-content:space-between;margin-top:24px;">
            <a href="/setup/branch" data-nav class="btn btn-secondary">Back</a>
            <a href="/setup/import" data-nav class="btn btn-primary btn-lg">
              Continue to Product Import
              ${getIcon('arrow-right', '', 16)}
            </a>
          </div>
        </div>
      </div>
    `,
    init: () => {}
  };
}

export function SetupImportView(params, router) {
  return {
    html: `
      ${renderWizardHeader(4)}
      <div style="max-width:840px;margin:32px auto;padding:0 20px;">
        <div class="card" style="padding:32px;">
          <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:20px;flex-wrap:wrap;gap:12px;">
            <div>
              <h2 class="text-title-3" style="margin-bottom:4px;">Step 4: Import Product Catalog</h2>
              <p class="text-body-sm">Upload your existing inventory via CSV or use our pre-seeded sample hardware items.</p>
            </div>
            <button id="download-sample-csv-btn" class="btn btn-secondary btn-sm" style="gap:6px;">
              ${getIcon('download', '', 14)}
              Download Sample CSV
            </button>
          </div>

          <!-- Drag and Drop Dropzone -->
          <div id="csv-dropzone" style="
            border:2px dashed var(--color-primary-light);border-radius:12px;padding:36px;text-align:center;
            background:var(--color-canvas);cursor:pointer;margin-bottom:24px;transition:all var(--transition-fast);
          ">
            <div style="width:48px;height:48px;border-radius:50%;background:var(--color-primary-soft);color:var(--color-primary);display:flex;align-items:center;justify-content:center;margin:0 auto 12px;">
              ${getIcon('upload', '', 24)}
            </div>
            <div style="font-weight:600;font-size:15px;color:var(--color-navy);margin-bottom:4px;">
              Click to select or drag & drop CSV file
            </div>
            <div class="text-caption">Required columns: name, sku, category, cost_price, sale_price, initial_stock</div>
            <input type="file" id="csv-file-input" accept=".csv,text/csv" style="display:none;">
          </div>

          <!-- Parsed Row Preview Section (Hidden until file selected) -->
          <div id="csv-preview-container" style="display:none;margin-bottom:24px;">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
              <span id="csv-summary-badge" class="badge badge-success">5 Rows Parsed</span>
              <span id="csv-errors-badge" class="badge badge-warning" style="display:none;">0 Errors</span>
            </div>
            <div class="table-container" style="max-height:240px;overflow-y:auto;">
              <table class="data-table" id="csv-preview-table">
                <thead>
                  <tr>
                    <th>Line</th>
                    <th>Product Name</th>
                    <th>SKU</th>
                    <th>Cost</th>
                    <th>Sale</th>
                    <th>Stock</th>
                    <th>Validation</th>
                  </tr>
                </thead>
                <tbody id="csv-preview-tbody"></tbody>
              </table>
            </div>
          </div>

          <div style="display:flex;justify-content:space-between;margin-top:24px;">
            <a href="/setup/team" data-nav class="btn btn-secondary">Back</a>
            <div style="display:flex;gap:12px;">
              <a href="/setup/plan" data-nav class="btn btn-ghost">Skip for Now</a>
              <a href="/setup/plan" data-nav class="btn btn-primary btn-lg">
                Confirm & Continue
                ${getIcon('arrow-right', '', 16)}
              </a>
            </div>
          </div>
        </div>
      </div>
    `,
    init: () => {
      const dropzone = document.getElementById('csv-dropzone');
      const fileInput = document.getElementById('csv-file-input');
      const previewContainer = document.getElementById('csv-preview-container');
      const previewTbody = document.getElementById('csv-preview-tbody');
      const summaryBadge = document.getElementById('csv-summary-badge');
      const downloadBtn = document.getElementById('download-sample-csv-btn');

      if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
          const sample = getSampleProductCsv();
          const blob = new Blob([sample], { type: 'text/csv' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'metrisolution_sample_products.csv';
          a.click();
          URL.revokeObjectURL(url);
          toast.success('Downloaded sample CSV template');
        });
      }

      if (dropzone && fileInput) {
        dropzone.addEventListener('click', () => fileInput.click());
        dropzone.addEventListener('dragover', (e) => {
          e.preventDefault();
          dropzone.style.borderColor = 'var(--color-primary)';
          dropzone.style.background = 'var(--color-primary-soft)';
        });
        dropzone.addEventListener('dragleave', () => {
          dropzone.style.borderColor = 'var(--color-primary-light)';
          dropzone.style.background = 'var(--color-canvas)';
        });
        dropzone.addEventListener('drop', (e) => {
          e.preventDefault();
          dropzone.style.borderColor = 'var(--color-primary-light)';
          dropzone.style.background = 'var(--color-canvas)';
          if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
          }
        });

        fileInput.addEventListener('change', (e) => {
          if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
          }
        });
      }

      function handleFile(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const text = e.target.result;
          const parsed = parseCsvText(text);

          previewContainer.style.display = 'block';
          summaryBadge.textContent = `${parsed.validCount} Valid Items Parsed`;

          previewTbody.innerHTML = parsed.rows.slice(0, 10).map(r => `
            <tr>
              <td>${r.line}</td>
              <td><strong>${r.data.name || '—'}</strong></td>
              <td><code>${r.data.sku || '—'}</code></td>
              <td>Rs. ${r.data.cost_price || '0'}</td>
              <td>Rs. ${r.data.sale_price || '0'}</td>
              <td>${r.data.initial_stock || '0'}</td>
              <td>
                ${r.isValid ? 
                  `<span class="badge badge-success">${getIcon('check', '', 12)} Valid</span>` : 
                  `<span class="badge badge-danger">${r.errors[0]}</span>`}
              </td>
            </tr>
          `).join('');

          toast.success(`Successfully validated ${parsed.validCount} rows from ${file.name}`);
        };
        reader.readAsText(file);
      }
    }
  };
}

export function SetupPlanView(params, router) {
  return {
    html: `
      ${renderWizardHeader(5)}
      <div style="max-width:760px;margin:32px auto;padding:0 20px;">
        <div class="card" style="padding:32px;text-align:center;">
          <span class="badge badge-success" style="margin-bottom:12px;">Final Step</span>
          <h2 class="text-title-2" style="margin-bottom:8px;">Activate Your 14-Day Free Evaluation</h2>
          <p class="text-body-lg" style="margin-bottom:32px;">
            Enjoy full access to all Growth Plan capabilities: 3 branches, 10 staff seats, WhatsApp Voice-to-Order AI, and multi-location transfers.
          </p>

          <div class="card" style="padding:24px;border:2px solid var(--color-primary);background:#F4F0FF;max-width:440px;margin:0 auto 32px;text-align:left;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
              <span class="badge badge-primary">Trial Activated</span>
              <span style="font-size:12px;font-weight:700;color:var(--color-primary);">Rs. 0 Due Today</span>
            </div>
            <h3 style="font-size:20px;font-weight:800;color:var(--color-navy);margin-bottom:6px;">Growth Plan (Evaluation)</h3>
            <div style="font-size:13px;color:#475467;line-height:1.6;">
              • Up to 3 Connected Branches<br>
              • 10 Team Members with RBAC View Masking<br>
              • 5,000 Active SKUs & Variants<br>
              • Real-Time Stock Ledger & POS Terminal<br>
              • WhatsApp Voice AI Order Extraction
            </div>
          </div>

          <div style="display:flex;justify-content:center;gap:16px;">
            <a href="/setup/import" data-nav class="btn btn-secondary btn-lg">Back</a>
            <button id="finish-setup-btn" class="btn btn-primary btn-lg" style="padding:14px 32px;font-size:16px;">
              Complete Setup & Enter Dashboard
              ${getIcon('arrow-right', '', 18)}
            </button>
          </div>
        </div>
      </div>
    `,
    init: () => {
      const btn = document.getElementById('finish-setup-btn');
      if (btn) {
        btn.addEventListener('click', () => {
          store.setCurrentUserByRole('OWNER');
          toast.success('Onboarding complete! Welcome to your Metro Hardware workspace.', 'Setup Finished');
          router.navigate('/app/dashboard');
        });
      }
    }
  };
}
