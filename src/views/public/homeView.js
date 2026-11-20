/**
 * MetriSolution Inventory ERP SaaS - Modernized Public Homepage View
 * Linear, Stripe & Vercel grade B2B SaaS layout with interactive hero preview and audio demo.
 */

import { getIcon } from '../../components/icons.js';
import { store } from '../../services/store.js';
import { voiceEngine } from '../../services/voiceEngine.js';

export function HomeView(params, router) {
  const metrics = store.getDashboardMetrics();

  return {
    html: `
      <!-- Hero Section -->
      <section class="hero-section">
        <div class="hero-container">
          <a href="/demo-access" data-nav class="hero-announcement">
            <span class="badge-dot badge-pulse" style="background:#12B76A;"></span>
            <span>Version 2.0 Live: Explore WhatsApp Voice-to-Order & Multi-Branch POS</span>
            ${getIcon('arrow-right', '', 14)}
          </a>

          <h1 class="hero-title text-hero">
            One workspace. Every product.<br>
            <span class="text-gradient-purple">Total retail control.</span>
          </h1>

          <p class="hero-subtitle">
            Manage inventory, rapid counter sales, purchase orders, multi-branch stock transfers, and automated WhatsApp voice notes from one unified workspace — purpose-built for Pakistani retailers and distributors.
          </p>

          <div class="hero-actions">
            <a href="/register" data-nav class="btn btn-primary btn-lg" style="box-shadow: 0 4px 14px rgba(105, 65, 198, 0.4);">
              Start 14-Day Free Trial
              ${getIcon('arrow-right', '', 18)}
            </a>
            <a href="/app/dashboard" data-nav class="btn btn-secondary btn-lg">
              ${getIcon('play', '', 16)}
              Explore Live Interactive Demo
            </a>
          </div>

          <!-- Interactive Product Experience Preview Frame -->
          <div class="hero-preview-frame">
            <div class="hero-preview-chrome">
              <div class="browser-dots">
                <div class="browser-dot red"></div>
                <div class="browser-dot yellow"></div>
                <div class="browser-dot green"></div>
              </div>

              <div class="browser-url-pill">
                ${getIcon('lock', '', 12)}
                <span id="hero-preview-url">app.metrisolution.com/app/dashboard</span>
              </div>

              <!-- Interactive Tab Switcher -->
              <div class="tab-pill-group" style="margin-left:auto;">
                <button class="tab-pill active hero-tab-btn" data-target="dashboard">
                  ${getIcon('pie-chart', '', 12)} Dashboard
                </button>
                <button class="tab-pill hero-tab-btn" data-target="pos">
                  ${getIcon('shopping-cart', '', 12)} Retail POS
                </button>
                <button class="tab-pill hero-tab-btn" data-target="voice">
                  ${getIcon('mic', '', 12)} Voice AI
                </button>
              </div>
            </div>

            <!-- Panel 1: Executive Dashboard (Default) -->
            <div id="hero-view-dashboard" class="hero-tab-view" style="padding:24px;background:#F8FAFC;text-align:left;">
              <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(210px, 1fr));gap:16px;margin-bottom:20px;">
                <div class="metric-card" style="padding:18px;">
                  <div class="metric-card-top">
                    <span class="metric-label">Total Inventory Valuation</span>
                    <span class="badge badge-primary">Cost Basis</span>
                  </div>
                  <div class="metric-val text-primary" style="font-size:24px;margin-top:6px;">
                    Rs. ${metrics.totalValuationCost.toLocaleString()}
                  </div>
                  <div class="text-caption" style="color:#027A48;margin-top:4px;font-weight:600;">
                    ${getIcon('check-circle-2', '', 12)} Across 3 Active Branches
                  </div>
                </div>

                <div class="metric-card" style="padding:18px;">
                  <div class="metric-card-top">
                    <span class="metric-label">Live POS Revenue</span>
                    <span class="badge badge-success">Completed</span>
                  </div>
                  <div class="metric-val text-navy" style="font-size:24px;margin-top:6px;">
                    Rs. ${metrics.totalRevenue.toLocaleString()}
                  </div>
                  <div class="text-caption" style="color:#475467;margin-top:4px;">
                    ${metrics.totalOrdersCount} verified retail orders
                  </div>
                </div>

                <div class="metric-card" style="padding:18px;">
                  <div class="metric-card-top">
                    <span class="metric-label">Reorder Warnings</span>
                    <span class="badge badge-warning">Low Stock</span>
                  </div>
                  <div class="metric-val text-warning" style="font-size:24px;margin-top:6px;">
                    ${metrics.lowStockCount} SKUs
                  </div>
                  <div class="text-caption" style="color:#B54708;margin-top:4px;">
                    Automated replenishment ready
                  </div>
                </div>

                <div class="metric-card" style="padding:18px;background:linear-gradient(135deg, #F4F0FF 0%, #FFFFFF 100%);border-color:#D6BBFB;">
                  <div class="metric-card-top">
                    <span class="metric-label" style="color:var(--color-primary);font-weight:600;">WhatsApp Voice AI</span>
                    <span class="badge badge-primary">Urdu / Eng</span>
                  </div>
                  <div style="font-size:13px;font-weight:700;color:var(--color-navy);margin-top:6px;">
                    "Door Lock 25 boxes bhejwa do"
                  </div>
                  <div class="text-caption" style="color:var(--color-primary);margin-top:4px;font-weight:600;">
                    Extracted: 300 Pcs • Pending Review
                  </div>
                </div>
              </div>

              <!-- Mini Data Table Preview -->
              <div class="table-container" style="box-shadow:none;border-radius:10px;">
                <table class="data-table" style="font-size:13px;">
                  <thead>
                    <tr>
                      <th>Product & SKU</th>
                      <th>Category</th>
                      <th>Stock (Karachi Main)</th>
                      <th>Stock (Clifton)</th>
                      <th>Retail Rate</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>Premium Brass Cylinder Door Lock</strong><br><span style="font-size:11px;color:#98A2B3;font-family:monospace;">LCK-BRS-001</span></td>
                      <td>Door Locks & Security</td>
                      <td><span class="tabular-nums font-semibold">420</span> pcs (35 boxes)</td>
                      <td><span class="tabular-nums font-semibold">48</span> pcs (4 boxes)</td>
                      <td class="price-pkr">2,250</td>
                      <td><span class="badge badge-success">Optimal</span></td>
                    </tr>
                    <tr>
                      <td><strong>750W Impact Electric Drill Machine</strong><br><span style="font-size:11px;color:#98A2B3;font-family:monospace;">TOL-DRL-750</span></td>
                      <td>Power Tools & Machinery</td>
                      <td><span class="tabular-nums font-semibold">28</span> pcs</td>
                      <td><span class="tabular-nums font-semibold">6</span> pcs</td>
                      <td class="price-pkr">8,200</td>
                      <td><span class="badge badge-warning">Reorder</span></td>
                    </tr>
                    <tr>
                      <td><strong>Modular 10A Piano Switch (White)</strong><br><span style="font-size:11px;color:#98A2B3;font-family:monospace;">ELE-SW-10A</span></td>
                      <td>Electrical & Lighting</td>
                      <td><span class="tabular-nums font-semibold">560</span> pcs (28 boxes)</td>
                      <td><span class="tabular-nums font-semibold">90</span> pcs</td>
                      <td class="price-pkr">220</td>
                      <td><span class="badge badge-success">Optimal</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Panel 2: POS Preview -->
            <div id="hero-view-pos" class="hero-tab-view" style="display:none;padding:24px;background:#F8FAFC;text-align:left;">
              <div style="display:grid;grid-template-columns:1.4fr 1fr;gap:16px;">
                <div style="background:#FFFFFF;border:1px solid #E4E7EC;border-radius:10px;padding:16px;">
                  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
                    <div style="font-weight:700;font-size:14px;color:var(--color-navy);">Barcode Scanner Terminal</div>
                    <span class="badge badge-success">0.2s Match</span>
                  </div>
                  <div style="background:#F2F4F7;border:1px solid #D0D5DD;border-radius:6px;padding:8px 12px;display:flex;align-items:center;gap:8px;font-family:monospace;font-size:12px;color:#344054;">
                    ${getIcon('box', '', 14)}
                    <span>Scanned: 896400010012 (Premium Brass Cylinder Door Lock)</span>
                  </div>
                  <div style="display:grid;grid-template-columns:repeat(2, 1fr);gap:10px;margin-top:12px;">
                    <div style="border:1px solid #E4E7EC;border-radius:8px;padding:10px;background:#FAFAFE;">
                      <div style="font-weight:600;font-size:13px;">Door Lock (Brass)</div>
                      <div style="color:var(--color-primary);font-weight:700;font-size:14px;margin-top:4px;">Rs. 2,250</div>
                    </div>
                    <div style="border:1px solid #E4E7EC;border-radius:8px;padding:10px;background:#FAFAFE;">
                      <div style="font-weight:600;font-size:13px;">Impact Drill 750W</div>
                      <div style="color:var(--color-primary);font-weight:700;font-size:14px;margin-top:4px;">Rs. 8,200</div>
                    </div>
                  </div>
                </div>

                <div style="background:#FFFFFF;border:1px solid #E4E7EC;border-radius:10px;padding:16px;display:flex;flex-direction:column;justify-content:space-between;">
                  <div>
                    <div style="font-weight:700;font-size:14px;color:var(--color-navy);margin-bottom:8px;">Active Retail Cart</div>
                    <div style="display:flex;justify-content:space-between;font-size:13px;padding:6px 0;border-bottom:1px solid #F2F4F7;">
                      <span>Brass Door Lock × 2</span>
                      <strong class="tabular-nums">Rs. 4,500</strong>
                    </div>
                    <div style="display:flex;justify-content:space-between;font-size:13px;padding:6px 0;border-bottom:1px solid #F2F4F7;">
                      <span>Sales Tax (18% GST)</span>
                      <strong class="tabular-nums">Rs. 810</strong>
                    </div>
                  </div>
                  <div style="margin-top:16px;padding-top:10px;border-top:1px dashed #D0D5DD;">
                    <div style="display:flex;justify-content:space-between;font-size:16px;font-weight:800;color:var(--color-navy);margin-bottom:8px;">
                      <span>Total Payable</span>
                      <span class="text-primary tabular-nums">Rs. 5,310</span>
                    </div>
                    <a href="/app/pos" data-nav class="btn btn-primary btn-sm" style="width:100%;text-align:center;">
                      Launch POS Terminal
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <!-- Panel 3: Voice AI Preview -->
            <div id="hero-view-voice" class="hero-tab-view" style="display:none;padding:24px;background:#F8FAFC;text-align:left;">
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;align-items:center;">
                <div class="whatsapp-player-card" style="margin:0 auto;width:100%;">
                  <div class="whatsapp-bubble">
                    <div style="font-size:12px;font-weight:700;color:#128C7E;display:flex;align-items:center;gap:6px;">
                      ${getIcon('mic', '', 14)} Customer Voice Note (Areeb Traders)
                    </div>
                    <div class="audio-controls-row">
                      <button id="hero-voice-play-btn" class="audio-play-btn" aria-label="Play audio">
                        ${getIcon('play', '', 18)}
                      </button>
                      <div class="waveform-container">
                        <div class="waveform-bar played" style="height:12px;"></div>
                        <div class="waveform-bar played" style="height:22px;"></div>
                        <div class="waveform-bar played" style="height:28px;"></div>
                        <div class="waveform-bar played" style="height:16px;"></div>
                        <div class="waveform-bar" style="height:20px;"></div>
                        <div class="waveform-bar" style="height:14px;"></div>
                        <div class="waveform-bar" style="height:26px;"></div>
                        <div class="waveform-bar" style="height:10px;"></div>
                      </div>
                      <span class="audio-duration">0:05</span>
                    </div>
                  </div>
                </div>

                <div class="card" style="padding:16px;border-color:var(--color-primary-light);">
                  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
                    <span class="badge badge-success">Extracted with 96.4% Match</span>
                  </div>
                  <div style="font-size:13px;line-height:1.6;color:var(--color-navy);">
                    <strong>Urdu Transcription:</strong><br>
                    <span style="font-size:15px;direction:rtl;display:block;margin:4px 0;font-weight:600;">"عبد القادر، میری شاپ پر ڈور لاک کے 25 باکسز بھجوا دو۔"</span>
                    <strong>Resolved SKU:</strong> Premium Brass Cylinder Door Lock<br>
                    <strong>Calculation:</strong> 25 Boxes × 12 = <strong>300 Pieces</strong>
                  </div>
                  <a href="/app/voice-inbox" data-nav class="btn btn-primary btn-sm" style="margin-top:12px;width:100%;">
                    Test Audible Voice Inbox
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Trust & Scale Metrics Strip -->
      <section style="background:var(--color-surface);border-y:1px solid var(--color-border);padding:24px var(--space-6);">
        <div style="max-width:var(--container-max-width);margin:0 auto;display:flex;align-items:center;justify-content:space-around;flex-wrap:wrap;gap:24px;">
          <div style="text-align:center;">
            <div style="font-size:28px;font-weight:800;color:var(--color-navy);letter-spacing:-0.03em;">99.8%</div>
            <div style="font-size:13px;color:var(--color-text-secondary);font-weight:500;">Inventory Accuracy</div>
          </div>
          <div style="width:1px;height:36px;background:var(--color-border);"></div>
          <div style="text-align:center;">
            <div style="font-size:28px;font-weight:800;color:var(--color-primary);letter-spacing:-0.03em;">0.2s</div>
            <div style="font-size:13px;color:var(--color-text-secondary);font-weight:500;">Barcode Match Latency</div>
          </div>
          <div style="width:1px;height:36px;background:var(--color-border);"></div>
          <div style="text-align:center;">
            <div style="font-size:28px;font-weight:800;color:var(--color-navy);letter-spacing:-0.03em;">148+</div>
            <div style="font-size:13px;color:var(--color-text-secondary);font-weight:500;">Retail Hubs in Karachi & Lahore</div>
          </div>
          <div style="width:1px;height:36px;background:var(--color-border);"></div>
          <div style="text-align:center;">
            <div style="font-size:28px;font-weight:800;color:#027A48;letter-spacing:-0.03em;">18% GST</div>
            <div style="font-size:13px;color:var(--color-text-secondary);font-weight:500;">Automatic Tax Invoicing</div>
          </div>
        </div>
      </section>

      <!-- 6 Core Capabilities Grid -->
      <section style="padding:var(--space-16) var(--space-6);background:#FFFFFF;border-top:1px solid var(--color-border);">
        <div style="max-width:var(--container-max-width);margin:0 auto;">
          <div style="text-align:center;max-width:700px;margin:0 auto var(--space-12);">
            <span class="badge badge-primary" style="margin-bottom:12px;">Engineered for High-Velocity Retail</span>
            <h2 class="text-title-2">Everything your business needs to scale</h2>
            <p class="text-body-lg" style="margin-top:8px;">
              Say goodbye to fragmented notebooks and manual Excel registers. MetriSolution integrates your inventory, POS checkout counters, and distribution pipeline.
            </p>
          </div>

          <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(320px, 1fr));gap:24px;">
            <div class="card" style="padding:28px;">
              <div style="width:44px;height:44px;border-radius:10px;background:var(--color-primary-soft);color:var(--color-primary);display:flex;align-items:center;justify-content:center;margin-bottom:16px;">
                ${getIcon('package', '', 22)}
              </div>
              <h3 class="text-heading" style="margin-bottom:8px;">Real-Time Stock Ledger</h3>
              <p class="text-body" style="font-size:14px;line-height:1.6;">
                Every item movement is immutably logged with actor, timestamp, reference PO/Invoice, and reason. Eliminates phantom inventory and unrecorded leakage.
              </p>
              <a href="/features/inventory" data-nav class="text-primary font-semibold" style="font-size:13px;display:inline-flex;align-items:center;gap:4px;margin-top:16px;text-decoration:none;">
                Explore Inventory Features ${getIcon('arrow-right', '', 14)}
              </a>
            </div>

            <div class="card" style="padding:28px;">
              <div style="width:44px;height:44px;border-radius:10px;background:#ECFDF3;color:#027A48;display:flex;align-items:center;justify-content:center;margin-bottom:16px;">
                ${getIcon('shopping-cart', '', 22)}
              </div>
              <h3 class="text-heading" style="margin-bottom:8px;">High-Speed Retail POS</h3>
              <p class="text-body" style="font-size:14px;line-height:1.6;">
                Engineered for rapid counter service. Instant barcode scanner input, touch-friendly categories, cash change calculation, and instant 80mm thermal receipts.
              </p>
              <a href="/features/pos" data-nav class="text-primary font-semibold" style="font-size:13px;display:inline-flex;align-items:center;gap:4px;margin-top:16px;text-decoration:none;">
                Explore POS Checkout ${getIcon('arrow-right', '', 14)}
              </a>
            </div>

            <div class="card" style="padding:28px;">
              <div style="width:44px;height:44px;border-radius:10px;background:#EFF4FF;color:#2878F0;display:flex;align-items:center;justify-content:center;margin-bottom:16px;">
                ${getIcon('mic', '', 22)}
              </div>
              <h3 class="text-heading" style="margin-bottom:8px;">WhatsApp Voice-to-Order AI</h3>
              <p class="text-body" style="font-size:14px;line-height:1.6;">
                Receive customer voice messages in Urdu/English, automatically transcribe, extract requested items & quantities (e.g. 25 boxes), and queue for authorized human approval.
              </p>
              <a href="/features/ai-voice" data-nav class="text-primary font-semibold" style="font-size:13px;display:inline-flex;align-items:center;gap:4px;margin-top:16px;text-decoration:none;">
                Listen to Voice Demo ${getIcon('arrow-right', '', 14)}
              </a>
            </div>

            <div class="card" style="padding:28px;">
              <div style="width:44px;height:44px;border-radius:10px;background:#FFFAEB;color:#B54708;display:flex;align-items:center;justify-content:center;margin-bottom:16px;">
                ${getIcon('truck', '', 22)}
              </div>
              <h3 class="text-heading" style="margin-bottom:8px;">Multi-Branch Stock Transfers</h3>
              <p class="text-body" style="font-size:14px;line-height:1.6;">
                Transfer products smoothly between central warehouses and retail branches with verified manifests: Request → Dispatch → In-Transit → Receiving with discrepancy tracking.
              </p>
              <a href="/features/warehouse" data-nav class="text-primary font-semibold" style="font-size:13px;display:inline-flex;align-items:center;gap:4px;margin-top:16px;text-decoration:none;">
                Explore Warehouse Workflows ${getIcon('arrow-right', '', 14)}
              </a>
            </div>

            <div class="card" style="padding:28px;">
              <div style="width:44px;height:44px;border-radius:10px;background:#F4F0FF;color:var(--color-primary);display:flex;align-items:center;justify-content:center;margin-bottom:16px;">
                ${getIcon('layers', '', 22)}
              </div>
              <h3 class="text-heading" style="margin-bottom:8px;">Box-to-Piece Conversions</h3>
              <p class="text-body" style="font-size:14px;line-height:1.6;">
                Hardware stores purchase by the master carton and sell by individual pieces or dozens. MetriSolution handles multi-level unit conversions automatically without rounding errors.
              </p>
              <a href="/solutions/hardware" data-nav class="text-primary font-semibold" style="font-size:13px;display:inline-flex;align-items:center;gap:4px;margin-top:16px;text-decoration:none;">
                View Hardware Solutions ${getIcon('arrow-right', '', 14)}
              </a>
            </div>

            <div class="card" style="padding:28px;">
              <div style="width:44px;height:44px;border-radius:10px;background:#FEF3F2;color:#B42318;display:flex;align-items:center;justify-content:center;margin-bottom:16px;">
                ${getIcon('shield-check', '', 22)}
              </div>
              <h3 class="text-heading" style="margin-bottom:8px;">Role-Based Security & Masking</h3>
              <p class="text-body" style="font-size:14px;line-height:1.6;">
                Five distinct operational roles (Platform Admin, Owner, Manager, Sales, Warehouse). Wholesale cost prices and profit margins are automatically masked from counter staff.
              </p>
              <a href="/features/team" data-nav class="text-primary font-semibold" style="font-size:13px;display:inline-flex;align-items:center;gap:4px;margin-top:16px;text-decoration:none;">
                Explore Team RBAC ${getIcon('arrow-right', '', 14)}
              </a>
            </div>
          </div>
        </div>
      </section>

      <!-- FAQ Accordion -->
      <section style="padding:var(--space-16) var(--space-6);background:#FFFFFF;border-top:1px solid var(--color-border);">
        <div style="max-width:800px;margin:0 auto;">
          <div style="text-align:center;margin-bottom:var(--space-10);">
            <span class="badge badge-neutral" style="margin-bottom:8px;">Questions & Answers</span>
            <h2 class="text-title-2">Frequently Asked Questions</h2>
          </div>

          <div class="faq-accordion-group" style="display:flex;flex-direction:column;gap:12px;">
            <details class="card" style="padding:18px 24px;cursor:pointer;" open>
              <summary style="font-weight:600;font-size:16px;color:var(--color-navy);user-select:none;">
                Is MetriSolution suitable for a hardware or general store in Pakistan?
              </summary>
              <p style="margin-top:12px;font-size:14px;color:var(--color-text-secondary);line-height:1.6;">
                Yes! MetriSolution was designed specifically around Pakistani retail and wholesale dynamics. It natively supports PKR currency, Pakistan standard time (Asia/Karachi), box-to-piece conversions, thermal receipt printing, and multiple branch hubs.
              </p>
            </details>

            <details class="card" style="padding:18px 24px;cursor:pointer;">
              <summary style="font-weight:600;font-size:16px;color:var(--color-navy);user-select:none;">
                How does the WhatsApp Voice-to-Order feature work?
              </summary>
              <p style="margin-top:12px;font-size:14px;color:var(--color-text-secondary);line-height:1.6;">
                When a customer sends a voice note to your registered business number, our system transcribes the speech, extracts requested items and quantities, and prepares an AI Draft. A manager or cashier listens to the audio, verifies the exact catalog match, and approves the order before stock is allocated.
              </p>
            </details>

            <details class="card" style="padding:18px 24px;cursor:pointer;">
              <summary style="font-weight:600;font-size:16px;color:var(--color-navy);user-select:none;">
                Can my sales cashiers see wholesale costs or profit margins?
              </summary>
              <p style="margin-top:12px;font-size:14px;color:var(--color-text-secondary);line-height:1.6;">
                No. The SALES role has strict view masking applied. Cashiers can only view retail selling prices, apply discounts up to configured thresholds, and scan barcodes. Only Owners and Managers can access cost prices and profit reports.
              </p>
            </details>

            <details class="card" style="padding:18px 24px;cursor:pointer;">
              <summary style="font-weight:600;font-size:16px;color:var(--color-navy);user-select:none;">
                Do I need to install any software or drivers?
              </summary>
              <p style="margin-top:12px;font-size:14px;color:var(--color-text-secondary);line-height:1.6;">
                None! MetriSolution is a cloud web application that runs directly in any modern browser on PC, Mac, tablets, or touch terminals. Standard USB/Bluetooth barcode scanners and thermal receipt printers work out of the box.
              </p>
            </details>
          </div>
        </div>
      </section>

      <!-- Final Conversion CTA -->
      <section style="padding:var(--space-16) var(--space-6);background:linear-gradient(135deg, var(--color-navy) 0%, #1E1B4B 100%);color:#FFF;text-align:center;">
        <div style="max-width:760px;margin:0 auto;">
          <h2 class="text-title-1" style="color:#FFF;margin-bottom:16px;">
            Ready to streamline your store operations?
          </h2>
          <p style="font-size:17px;color:#CBD5E1;line-height:1.6;margin-bottom:32px;">
            Join modern retailers who trust MetriSolution for multi-branch inventory control, rapid POS checkout, and automated customer order processing.
          </p>
          <div style="display:flex;gap:16px;justify-content:center;flex-wrap:wrap;">
            <a href="/register" data-nav class="btn btn-primary btn-lg" style="background:#6941C6;border-color:#6941C6;">
              Start 14-Day Free Trial
            </a>
            <a href="/demo-access" data-nav class="btn btn-secondary btn-lg" style="background:transparent;color:#FFF;border-color:rgba(255,255,255,0.3);">
              View Demo Access Roles
            </a>
          </div>
        </div>
      </section>
    `,
    init: () => {
      // Setup hero tab switcher
      const tabBtns = document.querySelectorAll('.hero-tab-btn');
      const urlDisplay = document.getElementById('hero-preview-url');

      tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          tabBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');

          const target = btn.dataset.target;
          document.querySelectorAll('.hero-tab-view').forEach(v => v.style.display = 'none');
          const activeView = document.getElementById(`hero-view-${target}`);
          if (activeView) activeView.style.display = 'block';

          if (urlDisplay) {
            urlDisplay.textContent = `app.metrisolution.com/app/${target === 'dashboard' ? 'dashboard' : (target === 'pos' ? 'pos' : 'voice-inbox')}`;
          }
        });
      });

      // Hero voice player button
      const voiceBtn = document.getElementById('hero-voice-play-btn');
      if (voiceBtn) {
        voiceBtn.addEventListener('click', () => {
          voiceEngine.playWhatsAppVoiceNote({
            urduText: 'Abdul Qadir, meri shop par door lock ke 25 boxes bhejwa do.',
            onEnd: () => {
              voiceBtn.innerHTML = getIcon('play', '', 18);
            }
          });
          voiceBtn.innerHTML = getIcon('pause', '', 18);
        });
      }
    }
  };
}
