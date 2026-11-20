/**
 * MetriSolution Inventory ERP SaaS - PWA Client Service
 * Handles Service Worker lifecycle, install prompts, and online/offline awareness.
 */

import { toast } from '../components/toast.js';

class PwaService {
  constructor() {
    this.deferredPrompt = null;
    this.isInstalled = false;
    this.installListeners = [];
  }

  init() {
    if (typeof window === 'undefined') return;

    // 1. Register Service Worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((reg) => {
            console.log('MetriSolution PWA: Service Worker registered with scope:', reg.scope);
            reg.addEventListener('updatefound', () => {
              const newWorker = reg.installing;
              newWorker?.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  toast.info('New MetriSolution update available! Refresh to load latest build.');
                }
              });
            });
          })
          .catch((err) => {
            console.warn('MetriSolution PWA: Service Worker registration failed:', err);
          });
      });
    }

    // 2. Capture beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      this.notifyInstallListeners(true);
      console.log('MetriSolution PWA: App installation prompt ready.');
    });

    // 3. App installed event
    window.addEventListener('appinstalled', () => {
      this.deferredPrompt = null;
      this.isInstalled = true;
      this.notifyInstallListeners(false);
      toast.success('MetriSolution Inventory ERP successfully installed as an app!');
    });

    // 4. Online/Offline Network Monitor
    window.addEventListener('online', () => {
      toast.success('Connection restored. Connected to live operational cloud.');
    });

    window.addEventListener('offline', () => {
      toast.warning('Network disconnected. Operating in offline PWA cache mode.');
    });
  }

  onInstallAvailabilityChange(callback) {
    this.installListeners.push(callback);
    callback(!!this.deferredPrompt);
  }

  notifyInstallListeners(available) {
    this.installListeners.forEach(cb => cb(available));
  }

  async promptInstall() {
    if (!this.deferredPrompt) {
      toast.info('MetriSolution is already running as an installed desktop / mobile app or install is supported via browser settings.');
      return false;
    }

    this.deferredPrompt.prompt();
    const { outcome } = await this.deferredPrompt.userChoice;
    console.log(`MetriSolution PWA: User response to install prompt: ${outcome}`);
    this.deferredPrompt = null;
    this.notifyInstallListeners(false);
    return outcome === 'accepted';
  }

  isOnline() {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  }
}

export const pwaService = new PwaService();
