import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useStateDebug } from '../../hooks/useStateDebug';

vi.mock('../../utils/stateManager', () => ({
  getStoreSizes: vi.fn(() => ({ store1: '1KB', store2: '2KB' })),
  exportStoreData: vi.fn(() => ({ store1: { data: 'test' }, store2: { data: 'test2' } })),
}));

describe('useStateDebug', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => {});
    // Mock import.meta.env for development mode
    if (!import.meta.env) {
      import.meta.env = {};
    }
    import.meta.env.NODE_ENV = 'development';
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should initialize with store sizes and data', () => {
    const { result } = renderHook(() => useStateDebug());

    expect(result.current.storeSizes).toEqual({ store1: '1KB', store2: '2KB' });
    expect(result.current.storeData).toEqual({ store1: { data: 'test' }, store2: { data: 'test2' } });
  });

  it('should log store data when logStoreData is called', () => {
    const { result } = renderHook(() => useStateDebug());

    act(() => {
      result.current.logStoreData();
    });

    expect(console.log).toHaveBeenCalledWith('Store Sizes:', { store1: '1KB', store2: '2KB' });
    expect(console.log).toHaveBeenCalledWith('Store Data:', { store1: { data: 'test' }, store2: { data: 'test2' } });
  });

  it('should clear all data when clearAllData is called', () => {
    const { result } = renderHook(() => useStateDebug());

    act(() => {
      result.current.clearAllData();
    });

    expect(result.current.storeSizes).toEqual({});
    expect(result.current.storeData).toEqual({});
    expect(console.log).toHaveBeenCalledWith('All localStorage data cleared');
  });

  it('should not run in production mode', () => {
    import.meta.env.NODE_ENV = 'production';

    const { result } = renderHook(() => useStateDebug());

    expect(result.current.storeSizes).toEqual({});
    expect(result.current.storeData).toEqual({});
  });
});
