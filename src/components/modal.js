/**
 * MetriSolution Inventory ERP SaaS - Accessible Modal Dialog Controller
 */

import { getIcon } from './icons.js';

class ModalManager {
  constructor() {
    this.activeBackdrop = null;
    this.keydownHandler = null;
  }

  open({ title, content, footer = '', size = 'md', onClose = null }) {
    this.close(); // Close any existing modal

    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop';
    backdrop.setAttribute('role', 'dialog');
    backdrop.setAttribute('aria-modal', 'true');
    backdrop.setAttribute('aria-labelledby', 'modal-title');

    backdrop.innerHTML = `
      <div class="modal-dialog modal-${size}">
        <div class="modal-header">
          <h3 id="modal-title" class="text-heading text-navy">${title}</h3>
          <button class="btn btn-ghost btn-sm btn-icon-only modal-close-btn" aria-label="Close dialog">
            ${getIcon('x', '', 18)}
          </button>
        </div>
        <div class="modal-body">
          ${typeof content === 'string' ? content : ''}
        </div>
        ${footer ? `<div class="modal-footer">${footer}</div>` : ''}
      </div>
    `;

    if (content instanceof HTMLElement) {
      backdrop.querySelector('.modal-body').appendChild(content);
    }

    const closeBtn = backdrop.querySelector('.modal-close-btn');
    const dismiss = () => {
      this.close();
      if (typeof onClose === 'function') onClose();
    };

    closeBtn.addEventListener('click', dismiss);
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) dismiss();
    });

    this.keydownHandler = (e) => {
      if (e.key === 'Escape') dismiss();
    };
    window.addEventListener('keydown', this.keydownHandler);

    document.body.appendChild(backdrop);
    document.body.style.overflow = 'hidden';
    this.activeBackdrop = backdrop;

    requestAnimationFrame(() => backdrop.classList.add('is-open'));

    return {
      dialog: backdrop.querySelector('.modal-dialog'),
      body: backdrop.querySelector('.modal-body'),
      footer: backdrop.querySelector('.modal-footer'),
      close: dismiss
    };
  }

  close() {
    if (this.activeBackdrop) {
      const b = this.activeBackdrop;
      b.classList.remove('is-open');
      setTimeout(() => {
        if (b.parentNode) b.parentNode.removeChild(b);
      }, 200);
      this.activeBackdrop = null;
      document.body.style.overflow = '';
      if (this.keydownHandler) {
        window.removeEventListener('keydown', this.keydownHandler);
        this.keydownHandler = null;
      }
    }
  }
}

export const modal = new ModalManager();
