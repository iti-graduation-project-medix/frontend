// Jest setup file for global configuration

import { vi } from 'vitest';

// Mock localStorage
globalThis.localStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

// Mock sessionStorage
globalThis.sessionStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

// Mock fetch
globalThis.fetch = vi.fn();

// Mock console methods to reduce noise in tests
globalThis.console = {
  ...console,
  log: vi.fn(),
  debug: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
};

// Mock window.location
Object.defineProperty(window, 'location', {
  value: {
    href: 'http://localhost:3000',
    pathname: '/',
    search: '',
    hash: '',
    reload: vi.fn(),
    replace: vi.fn(),
  },
  writable: true,
});

// Mock window.navigator
Object.defineProperty(window, 'navigator', {
  value: {
    onLine: true,
    userAgent: 'test-user-agent',
  },
  writable: true,
});

// Mock window.dispatchEvent
window.dispatchEvent = vi.fn();

// Mock window.addEventListener
window.addEventListener = vi.fn();

// Mock window.removeEventListener
window.removeEventListener = vi.fn();

// Mock import.meta.env for Vitest
if (!import.meta.env) {
  import.meta.env = {};
}
import.meta.env.VITE_API_BASE_URL = 'http://localhost:3000';
