/**
 * MetriSolution Inventory ERP SaaS - Accessible Toast Notification Manager
 */

import { getIcon } from './icons.js';

class ToastManager {
  constructor() {
    this.container = null;
  }

  ensureContainer() {
    if (!this.container || !document.body.contains(this.container)) {
      this.container = document.createElement('div');
      this.container.className = 'toast-container';
      this.container.setAttribute('aria-live', 'polite');
      document.body.appendChild(this.container);
    }
  }

  show({ title, message, type = 'info', duration = 3500 }) {
    this.ensureContainer();

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.setAttribute('role', 'alert');

    let iconName = 'info';
    let iconClass = 'text-info';
    if (type === 'success') { iconName = 'check-circle-2'; iconClass = 'text-success'; }
    else if (type === 'error') { iconName = 'alert-triangle'; iconClass = 'text-danger'; }
    else if (type === 'warning') { iconName = 'alert-triangle'; iconClass = 'text-warning'; }

    toast.innerHTML = `
      <div class="toast-icon ${iconClass}">
        ${getIcon(iconName, '', 20)}
      </div>
      <div class="toast-content">
        ${title ? `<div class="toast-title">${title}</div>` : ''}
        <div class="toast-message">${message}</div>
      </div>
      <button class="toast-close" aria-label="Dismiss notification">
        ${getIcon('x', '', 16)}
      </button>
    `;

    const closeBtn = toast.querySelector('.toast-close');
    const dismiss = () => {
      toast.classList.remove('show');
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 250);
    };

    closeBtn.addEventListener('click', dismiss);

    this.container.appendChild(toast);
    // Trigger animation
    requestAnimationFrame(() => toast.classList.add('show'));

    if (duration > 0) {
      setTimeout(dismiss, duration);
    }
  }

  success(message, title = 'Success') { this.show({ title, message, type: 'success' }); }
  error(message, title = 'Error') { this.show({ title, message, type: 'error', duration: 5000 }); }
  warning(message, title = 'Warning') { this.show({ title, message, type: 'warning', duration: 4500 }); }
  info(message, title = 'Information') { this.show({ title, message, type: 'info' }); }
}

export const toast = new ToastManager();
