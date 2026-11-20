/**
 * MetriSolution Inventory ERP SaaS - WhatsApp Voice Intelligence Center & Automation
 * Features audible audio playback, waveform visualization, transcription & human-in-the-loop approval.
 */

import { store } from '../../services/store.js';
import { voiceEngine } from '../../services/voiceEngine.js';
import { getIcon } from '../../components/icons.js';
import { toast } from '../../components/toast.js';

export function VoiceInboxView(params, router) {
  const voiceMessages = store.getVoiceMessages();
  const activeMessage = voiceMessages[0];
  const draft = store.getAiDrafts().find(d => d.voiceMessageId === activeMessage.id) || store.getAiDrafts()[0];
  const currentUser = store.getCurrentUser();
  const isAuthorized = currentUser.role === 'OWNER' || currentUser.role === 'MANAGER';

  let selectedProductId = draft ? (draft.selectedProductId || draft.candidateProducts[0].id) : 'prod_lock_01';

  return {
    html: `
      <div class="erp-page-header">
        <div>
          <div class="erp-breadcrumbs">
            <a href="/app/dashboard" data-nav>Intelligence & AI</a>
            <span>/</span>
            <span>WhatsApp Voice Center</span>
          </div>
          <h1 class="text-title-2">WhatsApp Voice Intelligence Center</h1>
          <p class="text-body-sm">
            Audible in-browser playback, Urdu transcription, AI entity extraction, and human authorization.
          </p>
        </div>

        <div style="display:flex;align-items:center;gap:10px;">
          <span class="badge badge-primary" style="font-size:12px;padding:4px 10px;">
            ${getIcon('mic', '', 14)} Audio Synthesis Ready
          </span>
        </div>
      </div>

      <div class="voice-center-layout">
        <!-- Left: WhatsApp Threads -->
        <div class="voice-threads-pane">
          <div class="voice-threads-header">
            <div style="font-weight:700;font-size:14px;color:var(--color-navy);">Inbound Voice Messages</div>
            <span class="badge badge-success">Live Webhook</span>
          </div>

          <div class="voice-threads-list">
            ${voiceMessages.map(vm => `
              <div class="voice-thread-item active" data-vmid="${vm.id}">
                <div class="voice-avatar">
                  ${getIcon('mic', '', 18)}
                </div>
                <div class="voice-thread-content">
                  <div class="voice-thread-top">
                    <span class="voice-sender-name">${vm.senderName}</span>
                    <span class="voice-timestamp">${new Date(vm.receivedAt).toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' })}</span>
                  </div>
                  <div class="voice-snippet">
                    ${getIcon('volume-2', 'text-success', 12)}
                    <span>Voice Note (${vm.durationSeconds}s)</span>
                  </div>
                  <div style="margin-top:6px;">
                    <span class="badge ${draft && draft.status === 'approved' ? 'badge-success' : 'badge-warning'}" style="font-size:10px;">
                      ${draft && draft.status === 'approved' ? 'Approved & Converted' : 'Pending Manager Review'}
                    </span>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Right: Active Note Audio & AI Draft Pipeline -->
        <div class="voice-inspector-pane">
          <div class="voice-inspector-header">
            <div>
              <div style="font-weight:700;font-size:15px;color:var(--color-navy);">${activeMessage.senderName}</div>
              <div class="text-caption">${activeMessage.senderPhone} • ${activeMessage.senderRole}</div>
            </div>
            <span class="badge badge-neutral">Simulated WhatsApp Cloud API</span>
          </div>

          <div class="voice-inspector-scroll">
            <!-- 1. Audible WhatsApp Voice Note Player Card -->
            <div class="whatsapp-player-card">
              <div class="whatsapp-bubble">
                <div style="font-size:12px;font-weight:600;color:#128C7E;display:flex;align-items:center;gap:6px;">
                  ${getIcon('mic', '', 14)} Voice Note from Areeb (Audible Demo)
                </div>

                <div class="audio-controls-row">
                  <button id="voice-play-toggle-btn" class="audio-play-btn" aria-label="Play audio message">
                    <span id="play-icon-wrap">${getIcon('play', '', 18)}</span>
                  </button>

                  <div class="waveform-container" id="waveform-bar-wrap" title="Playback Progress">
                    <!-- 28 animated waveform bars -->
                    ${Array.from({ length: 28 }).map((_, i) => `
                      <div class="waveform-bar" style="height:${12 + (i % 7) * 4}px;" data-index="${i}"></div>
                    `).join('')}
                  </div>

                  <div class="audio-duration" id="voice-timer-display">
                    0:00 / 0:0${Math.round(activeMessage.durationSeconds)}
                  </div>
                </div>

                <div style="font-size:11px;color:#667781;display:flex;justify-content:space-between;margin-top:2px;">
                  <span>Transcribed via MetriSolution Speech Engine</span>
                  <span>Delivered via WhatsApp</span>
                </div>
              </div>
            </div>

            <!-- 2. Dual Urdu-English Transcription Panel -->
            <div class="transcript-card">
              <div style="font-size:11px;font-weight:700;color:var(--color-text-muted);text-transform:uppercase;margin-bottom:6px;">
                Raw Speech Transcript
              </div>
              <div class="transcript-urdu">
                "${activeMessage.transcriptRaw}"
              </div>
              <div class="transcript-english">
                Normalized: "${activeMessage.transcriptNormalized}"
              </div>
            </div>

            <!-- 3. AI Extraction & Box-to-Piece Conversion -->
            <div class="ai-draft-pipeline-card">
              <div class="ai-pipeline-title">
                <div style="display:flex;align-items:center;gap:8px;">
                  <span class="badge badge-primary">Structured AI Extraction</span>
                  <span class="text-caption">Confidence Score</span>
                </div>
                <span class="ai-confidence-pill">${draft.confidenceScore}% Accurate</span>
              </div>

              <div class="entity-chips-grid">
                <div class="entity-chip">
                  <div class="entity-chip-label">Customer Account</div>
                  <div class="entity-chip-value">${draft.customerName}</div>
                </div>

                <div class="entity-chip">
                  <div class="entity-chip-label">Requested SKU / Item</div>
                  <div class="entity-chip-value">${draft.extractedItemText}</div>
                </div>

                <div class="entity-chip">
                  <div class="entity-chip-label">Packaging Units</div>
                  <div class="entity-chip-value text-primary">${draft.extractedQuantity} Boxes</div>
                </div>

                <div class="entity-chip" style="background:#F4F0FF;border-color:#D6BBFB;">
                  <div class="entity-chip-label" style="color:var(--color-primary);">Unit Conversion (1 Box = 12 Pcs)</div>
                  <div class="entity-chip-value text-primary">${draft.convertedTotalPieces} Total Pieces</div>
                </div>
              </div>

              <!-- 4. Disambiguation Candidate Matcher -->
              <div class="candidate-picker-box">
                <div style="font-size:13px;font-weight:700;color:var(--color-navy);margin-bottom:4px;">
                  Catalog Disambiguation: Select Specific Product Variant
                </div>
                <div class="text-caption" style="margin-bottom:12px;">
                  Multiple door locks match "Door Lock". Please confirm the exact variant requested:
                </div>

                <div style="display:flex;flex-direction:column;gap:8px;">
                  ${draft.candidateProducts.map(cand => `
                    <label class="candidate-option ${selectedProductId === cand.id ? 'selected' : ''}" style="display:flex;align-items:center;justify-content:space-between;">
                      <div style="display:flex;align-items:center;gap:12px;">
                        <input type="radio" name="candidate-sku" value="${cand.id}" class="candidate-radio" ${selectedProductId === cand.id ? 'checked' : ''}>
                        <div>
                          <strong style="color:var(--color-navy);font-size:14px;">${cand.name}</strong>
                          <div style="font-size:11px;color:#98A2B3;font-family:monospace;">SKU: ${cand.sku} | Match Confidence: ${cand.matchConfidence}%</div>
                        </div>
                      </div>
                      <div style="text-align:right;">
                        <div class="tabular-nums font-bold" style="font-size:14px;color:var(--color-primary);">Rs. ${cand.wholesalePrice.toLocaleString()}</div>
                        <div class="text-caption" style="color:#027A48;">Available: ${cand.availableStock} pcs</div>
                      </div>
                    </label>
                  `).join('')}
                </div>
              </div>

              <!-- 5. Human Authorization Controls -->
              <div class="voice-approval-bar">
                ${draft.status === 'approved' ? `
                  <div style="display:flex;align-items:center;gap:10px;">
                    <span class="badge badge-success" style="font-size:13px;padding:6px 14px;">
                      ${getIcon('check-circle-2', '', 16)} Approved by ${draft.approvedBy || 'Owner'}
                    </span>
                    <a href="/app/orders" data-nav class="btn btn-secondary btn-sm">
                      View Generated Order
                    </a>
                  </div>
                ` : `
                  <button id="reject-ai-draft-btn" class="btn btn-ghost text-danger btn-sm">
                    Reject Draft
                  </button>
                  <button id="approve-ai-draft-btn" class="btn btn-primary" ${!isAuthorized ? 'title="Requires Owner or Manager role"' : ''}>
                    ${getIcon('check-circle-2', '', 16)}
                    Authorize Order & Convert to Sales Order
                  </button>
                `}
              </div>
            </div>
          </div>
        </div>
      </div>
    `,
    init: () => {
      const playBtn = document.getElementById('voice-play-toggle-btn');
      const playIconWrap = document.getElementById('play-icon-wrap');
      const timerDisplay = document.getElementById('voice-timer-display');
      const bars = document.querySelectorAll('.waveform-bar');
      const approveBtn = document.getElementById('approve-ai-draft-btn');
      const rejectBtn = document.getElementById('reject-ai-draft-btn');

      // Candidate radio selector
      document.querySelectorAll('input[name="candidate-sku"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
          selectedProductId = e.target.value;
          document.querySelectorAll('.candidate-option').forEach(l => l.classList.remove('selected'));
          e.target.closest('.candidate-option').classList.add('selected');
        });
      });

      // Audio Playback Listener
      if (playBtn) {
        playBtn.addEventListener('click', () => {
          voiceEngine.play(
            (current, total) => {
              const mins = Math.floor(current / 60);
              const secs = Math.floor(current % 60);
              timerDisplay.textContent = `${mins}:${secs < 10 ? '0' : ''}${secs} / 0:05`;

              const progressRatio = current / total;
              const activeCount = Math.floor(progressRatio * bars.length);
              bars.forEach((b, i) => {
                if (i <= activeCount) b.classList.add('played');
                else b.classList.remove('played');
              });
            },
            (isPlaying) => {
              playIconWrap.innerHTML = isPlaying ? getIcon('pause', '', 18) : getIcon('play', '', 18);
            }
          );
        });
      }

      // Approve Order Action
      if (approveBtn) {
        approveBtn.addEventListener('click', () => {
          if (!isAuthorized) {
            toast.error('Permission Denied: AI order approvals require Owner or Manager authorization.');
            return;
          }

          try {
            const order = store.approveAiDraft(draft.id, selectedProductId);
            toast.success(`AI Order Draft Approved! Created Sales Order ${order.orderNumber}. Stock reserved.`);
            router.handleRoute();
          } catch (err) {
            toast.error(err.message);
          }
        });
      }

      // Reject Order Action
      if (rejectBtn) {
        rejectBtn.addEventListener('click', () => {
          store.rejectAiDraft(draft.id, 'Discrepancy in customer request');
          toast.info('AI order draft marked as rejected.');
          router.handleRoute();
        });
      }
    }
  };
}

export function AiDraftsView(params, router) {
  const drafts = store.getAiDrafts();

  return {
    html: `
      <div class="erp-page-header">
        <div>
          <div class="erp-breadcrumbs">
            <a href="/app/dashboard" data-nav>Intelligence</a>
            <span>/</span>
            <span>AI Drafts</span>
          </div>
          <h1 class="text-title-2">AI Order Extraction Drafts</h1>
          <p class="text-body-sm">Unstructured voice notes transcribed and waiting for authorized confirmation.</p>
        </div>
      </div>

      <div style="display:flex;flex-direction:column;gap:16px;">
        ${drafts.map(d => `
          <div class="card" style="padding:24px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:16px;">
            <div>
              <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px;">
                <span class="badge ${d.status === 'approved' ? 'badge-success' : 'badge-warning'}">
                  ${d.status.toUpperCase()}
                </span>
                <h3 class="text-heading" style="margin:0;">${d.customerName}</h3>
              </div>
              <p style="font-size:14px;color:var(--color-text-secondary);margin:0;">
                Extracted: <strong>${d.extractedQuantity} ${d.extractedUnit}</strong> of <strong>${d.extractedItemText}</strong> (${d.convertedTotalPieces} pcs total)
              </p>
              <div class="text-caption" style="margin-top:4px;">${d.notes}</div>
            </div>

            <a href="/app/voice-inbox" data-nav class="btn btn-primary btn-sm">
              Open in Voice Inbox
            </a>
          </div>
        `).join('')}
      </div>
    `,
    init: () => {}
  };
}

export function AlertsView(params, router) {
  const alerts = store.getAlerts();

  return {
    html: `
      <div class="erp-page-header">
        <div>
          <div class="erp-breadcrumbs">
            <a href="/app/dashboard" data-nav>Intelligence</a>
            <span>/</span>
            <span>Notification Center</span>
          </div>
          <h1 class="text-title-2">Operational Alerts</h1>
          <p class="text-body-sm">Automated triggers for low stock, pending approvals, and transfer arrivals.</p>
        </div>
      </div>

      <div style="display:flex;flex-direction:column;gap:12px;">
        ${alerts.map(a => `
          <div class="card" style="padding:20px;display:flex;align-items:flex-start;justify-content:space-between;gap:16px;${!a.read ? 'border-left:4px solid var(--color-primary);' : ''}">
            <div style="display:flex;align-items:flex-start;gap:12px;">
              <div style="color:${a.severity === 'danger' ? 'var(--color-danger)' : (a.severity === 'warning' ? 'var(--color-warning)' : 'var(--color-info)')};margin-top:2px;">
                ${getIcon(a.severity === 'danger' ? 'alert-triangle' : 'bell', '', 20)}
              </div>
              <div>
                <div style="font-weight:700;font-size:15px;color:var(--color-navy);margin-bottom:4px;">${a.title}</div>
                <div style="font-size:13px;color:var(--color-text-secondary);line-height:1.5;">${a.message}</div>
                <div class="text-caption" style="margin-top:6px;">${new Date(a.timestamp).toLocaleString()}</div>
              </div>
            </div>

            <div style="display:flex;align-items:center;gap:8px;">
              ${a.link ? `
                <a href="${a.link}" data-nav class="btn btn-secondary btn-sm">Inspect</a>
              ` : ''}
              ${!a.read ? `
                <button class="btn btn-ghost btn-sm mark-read-btn" data-aid="${a.id}">Mark Read</button>
              ` : ''}
            </div>
          </div>
        `).join('')}
      </div>
    `,
    init: () => {
      document.querySelectorAll('.mark-read-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          store.markAlertRead(btn.dataset.aid);
          toast.info('Alert marked as read');
          router.handleRoute();
        });
      });
    }
  };
}

export function AutomationView(params, router) {
  return {
    html: `
      <div class="erp-page-header">
        <div>
          <div class="erp-breadcrumbs">
            <a href="/app/dashboard" data-nav>Intelligence</a>
            <span>/</span>
            <span>Automations</span>
          </div>
          <h1 class="text-title-2">Automation & Event Triggers</h1>
          <p class="text-body-sm">Configure event rules that notify owners, trigger drafts, and safeguard stock.</p>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(320px, 1fr));gap:20px;">
        <div class="card" style="padding:24px;">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
            <span class="badge badge-success">Active Rule</span>
            <span class="badge badge-neutral">Inventory</span>
          </div>
          <h3 class="text-heading" style="margin-bottom:6px;">Low Stock Reorder Trigger</h3>
          <p class="text-body-sm" style="margin-bottom:16px;">
            When available stock for any SKU falls below its configured threshold, trigger in-app alert and pre-populate supplier purchase order draft.
          </p>
          <div class="text-caption" style="color:#027A48;">Evaluates on every completed POS sale</div>
        </div>

        <div class="card" style="padding:24px;">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
            <span class="badge badge-success">Active Rule</span>
            <span class="badge badge-neutral">WhatsApp</span>
          </div>
          <h3 class="text-heading" style="margin-bottom:6px;">WhatsApp Voice Note Ingestion</h3>
          <p class="text-body-sm" style="margin-bottom:16px;">
            Transcribe incoming voice audio notes from registered trade customers, match items against catalog candidates, and queue for manager authorization.
          </p>
          <div class="text-caption" style="color:var(--color-primary);">Enforces human-in-the-loop approval</div>
        </div>

        <div class="card" style="padding:24px;">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
            <span class="badge badge-success">Active Rule</span>
            <span class="badge badge-neutral">Transfers</span>
          </div>
          <h3 class="text-heading" style="margin-bottom:6px;">Inter-Branch Transfer Receipt Escalation</h3>
          <p class="text-body-sm" style="margin-bottom:16px;">
            If an in-transit transfer is not confirmed received within 24 hours of dispatch, notify central warehouse and destination store manager.
          </p>
          <div class="text-caption" style="color:#B54708;">Prevents unaccounted loss in transit</div>
        </div>
      </div>
    `,
    init: () => {}
  };
}
