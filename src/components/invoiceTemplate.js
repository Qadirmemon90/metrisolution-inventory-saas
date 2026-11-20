/**
 * MetriSolution Inventory ERP SaaS - Printable Retail & Tax Invoice Generator
 * Produces clean A4 invoices and 80mm thermal receipt formats.
 */

import { getIcon } from './icons.js';

export function renderInvoiceHtml(invoice, tenant, options = { mode: 'a4' }) {
  const isThermal = options.mode === '80mm';

  return `
    <div class="print-invoice-sheet ${isThermal ? 'receipt-80mm' : ''}">
      <div class="print-invoice-header">
        <div>
          <h2 style="margin:0;color:#101828;font-size:${isThermal ? '16px' : '24px'};">${tenant.name}</h2>
          <div style="font-size:${isThermal ? '11px' : '13px'};color:#475467;margin-top:4px;">
            ${tenant.address}<br>
            Phone: ${tenant.phone} | NTN: ${tenant.ntn || '7294812-4'}
          </div>
        </div>
        <div style="text-align:right;">
          <div style="font-size:${isThermal ? '13px' : '18px'};font-weight:bold;color:#6941C6;">TAX INVOICE</div>
          <div style="font-size:${isThermal ? '11px' : '13px'};font-weight:600;margin-top:4px;"># ${invoice.invoiceNumber}</div>
          <div style="font-size:11px;color:#98A2B3;">Date: ${new Date(invoice.createdAt).toLocaleDateString('en-GB')}</div>
        </div>
      </div>

      <div style="margin:16px 0;padding:10px;background:#F9FAFB;border:1px solid #E4E7EC;border-radius:6px;font-size:${isThermal ? '11px' : '13px'};">
        <strong>Billed To:</strong> ${invoice.customerName}<br>
        <strong>Payment Method:</strong> ${invoice.paymentMethod.toUpperCase()} | <strong>Status:</strong> ${invoice.status.toUpperCase()}
      </div>

      <table class="print-table">
        <thead>
          <tr>
            <th>Item & Description</th>
            <th style="text-align:center;">Qty</th>
            <th style="text-align:right;">Rate (PKR)</th>
            <th style="text-align:right;">Amount (PKR)</th>
          </tr>
        </thead>
        <tbody>
          ${invoice.items.map(item => `
            <tr>
              <td>
                <strong>${item.productName}</strong>
                <div style="font-size:10px;color:#666;">SKU: ${item.sku}</div>
              </td>
              <td style="text-align:center;">${item.quantity} ${item.unit}</td>
              <td style="text-align:right;">${item.unitPrice.toLocaleString()}</td>
              <td style="text-align:right;">${item.lineTotal.toLocaleString()}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div class="print-totals">
        <div class="print-totals-row">
          <span>Subtotal:</span>
          <span>Rs. ${invoice.subtotal.toLocaleString()}</span>
        </div>
        ${invoice.discount > 0 ? `
          <div class="print-totals-row" style="color:#B42318;">
            <span>Discount:</span>
            <span>- Rs. ${invoice.discount.toLocaleString()}</span>
          </div>
        ` : ''}
        <div class="print-totals-row">
          <span>Sales Tax (18% GST):</span>
          <span>Rs. ${invoice.tax.toLocaleString()}</span>
        </div>
        <div class="print-totals-row grand-total">
          <span>Total Payable:</span>
          <span>Rs. ${invoice.total.toLocaleString()}</span>
        </div>
        <div class="print-totals-row" style="margin-top:6px;font-size:10pt;">
          <span>Amount Paid:</span>
          <span>Rs. ${(invoice.amountPaid || invoice.total).toLocaleString()}</span>
        </div>
        ${invoice.changeGiven > 0 ? `
          <div class="print-totals-row" style="font-size:10pt;color:#027A48;">
            <span>Change Returned:</span>
            <span>Rs. ${invoice.changeGiven.toLocaleString()}</span>
          </div>
        ` : ''}
      </div>

      <div style="clear:both;"></div>

      <div class="print-footer">
        Thank you for your business! Goods once sold can be exchanged within 7 days against original receipt.<br>
        Powered by <strong>MetriSolution Inventory ERP SaaS</strong> (https://metrisolution.com)
      </div>
    </div>
  `;
}
