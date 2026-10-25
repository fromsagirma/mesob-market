/**
 * Mesob Market - Frontend Test Environment Setup
 * Provides lightweight browser globals and storage mocks for Node's native test runner.
 */

// In-memory Storage mock
export class MockStorage {
  constructor() {
    this.store = new Map();
  }

  getItem(key) {
    return this.store.has(key) ? this.store.get(key) : null;
  }

  setItem(key, value) {
    this.store.set(key, String(value));
  }

  removeItem(key) {
    this.store.delete(key);
  }

  clear() {
    this.store.clear();
  }

  get length() {
    return this.store.size;
  }

  key(index) {
    return Array.from(this.store.keys())[index] || null;
  }
}

// Global browser environment initialization
export function setupBrowserEnvironment() {
  if (typeof globalThis.localStorage === 'undefined') {
    globalThis.localStorage = new MockStorage();
  }
  if (typeof globalThis.sessionStorage === 'undefined') {
    globalThis.sessionStorage = new MockStorage();
  }
  if (typeof globalThis.window === 'undefined') {
    globalThis.window = {
      localStorage: globalThis.localStorage,
      sessionStorage: globalThis.sessionStorage,
      navigator: { onLine: true },
      addEventListener: () => {},
      removeEventListener: () => {},
      scrollTo: () => {}
    };
  }
  if (typeof globalThis.document === 'undefined') {
    globalThis.document = {
      title: 'Mesob Market',
      body: {
        classList: {
          contains: () => false,
          add: () => {},
          remove: () => {}
        }
      },
      getElementById: () => null,
      querySelector: () => null,
      querySelectorAll: () => []
    };
  }
}

// Execute setup automatically
setupBrowserEnvironment();
