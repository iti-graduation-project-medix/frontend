import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  initializeStores,
  clearAllStores,
  getStoreSizes,
  hasStoreData,
  exportStoreData
} from '../../utils/stateManager';

describe('stateManager utils', () => {
  const storeKeys = [
    'deals-storage',
    'favorites-storage',
    'pharmacies-storage',
    'chat-storage',
    'subscription-storage',
    'advertise-storage',
    'pharmacist-storage',
  ];

  beforeEach(() => {
    // Mock localStorage
    let store = {};
    vi.spyOn(window.localStorage.__proto__, 'getItem').mockImplementation((key) => store[key] || null);
    vi.spyOn(window.localStorage.__proto__, 'setItem').mockImplementation((key, value) => { store[key] = value; });
    vi.spyOn(window.localStorage.__proto__, 'removeItem').mockImplementation((key) => { delete store[key]; });
    vi.spyOn(window.localStorage.__proto__, 'clear').mockImplementation(() => { store = {}; });
    // Add some fake data
    storeKeys.forEach(key => {
      window.localStorage.setItem(key, JSON.stringify({ test: key }));
    });
    window.localStorage.setItem('token', 'abc');
    window.localStorage.setItem('user', 'user1');
  });
  afterEach(() => {
    vi.restoreAllMocks();
    window.localStorage.clear();
  });

  it('getStoreSizes returns sizes for all stores', () => {
    const sizes = getStoreSizes();
    storeKeys.forEach(key => {
      expect(sizes).toHaveProperty(key);
      expect(Number(sizes[key].size)).toBeGreaterThan(0);
    });
  });

  it('hasStoreData returns true if store has data', () => {
    expect(hasStoreData('deals-storage')).toBe(true);
    expect(hasStoreData('not-exist')).toBe(false);
  });

  it('exportStoreData returns parsed data for all stores', () => {
    const data = exportStoreData();
    storeKeys.forEach(key => {
      expect(data).toHaveProperty(key);
      expect(data[key]).toEqual({ test: key });
    });
  });

  it('clearAllStores removes all store keys', () => {
    clearAllStores();
    storeKeys.forEach(key => {
      expect(hasStoreData(key)).toBe(false);
    });
  });

  it('initializeStores clears stores if no token/user', () => {
    window.localStorage.removeItem('token');
    window.localStorage.removeItem('user');
    initializeStores();
    storeKeys.forEach(key => {
      expect(hasStoreData(key)).toBe(false);
    });
  });

  it('initializeStores does not clear stores if token/user exist', () => {
    initializeStores();
    storeKeys.forEach(key => {
      expect(hasStoreData(key)).toBe(true);
    });
  });
});
