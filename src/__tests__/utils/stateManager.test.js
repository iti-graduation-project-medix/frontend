import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { getStoreSizes, exportStoreData, clearAllStores } from '../../utils/stateManager';

describe('State Manager Utils', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should get store sizes', () => {
    localStorage.setItem('deals-storage', JSON.stringify({ data: 'test' }));

    const sizes = getStoreSizes();

    expect(sizes).toHaveProperty('deals-storage');
    expect(typeof sizes['deals-storage'].size).toBe('number');
    expect(typeof sizes['deals-storage'].sizeKB).toBe('string');
  });

  it('should export store data', () => {
    const testData = { user: { id: 1, name: 'Test' } };
    localStorage.setItem('favorites-storage', JSON.stringify(testData));

    const data = exportStoreData();

    expect(data).toHaveProperty('favorites-storage');
    expect(data['favorites-storage']).toEqual(testData);
  });

  it('should clear store data', () => {
    localStorage.setItem('deals-storage', JSON.stringify({ data: 'test' }));

    clearAllStores();

    expect(localStorage.getItem('deals-storage')).toBeNull();
    expect(localStorage.getItem('favorites-storage')).toBeNull();
  });

  it('should handle empty localStorage', () => {
    const sizes = getStoreSizes();
    const data = exportStoreData();

    expect(sizes).toEqual({});
    expect(data).toEqual({});
  });

  it('should handle non-JSON data in localStorage', () => {
    localStorage.setItem('deals-storage', 'invalid-json');

    const sizes = getStoreSizes();
    const data = exportStoreData();

    expect(sizes).toHaveProperty('deals-storage');
    expect(data).toHaveProperty('deals-storage');
    expect(data['deals-storage']).toBe('invalid-json');
  });
});
