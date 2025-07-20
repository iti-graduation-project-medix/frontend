import { renderHook, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import '@testing-library/jest-dom';

vi.mock('../../utils/stateManager', () => ({
  getStoreSizes: vi.fn(() => ({ a: 1 })),
  exportStoreData: vi.fn(() => ({ b: 2 })),
}));
import { useStateDebug } from '../../hooks/useStateDebug';

describe('useStateDebug', () => {
  const OLD_ENV = process.env;
  beforeEach(() => {
    vi.resetModules();
    process.env = { ...OLD_ENV, NODE_ENV: 'development' };
    localStorage.clear();
  });
  afterEach(() => {
    process.env = OLD_ENV;
  });
  it('should initialize storeSizes and storeData', () => {
    const { result } = renderHook(() => useStateDebug());
    expect(result.current.storeSizes).toEqual({ a: 1 });
    expect(result.current.storeData).toEqual({ b: 2 });
  });
  it('should log store data in development', () => {
    const { result } = renderHook(() => useStateDebug());
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    act(() => {
      result.current.logStoreData();
    });
    expect(logSpy).toHaveBeenCalledWith('Store Sizes:', { a: 1 });
    expect(logSpy).toHaveBeenCalledWith('Store Data:', { b: 2 });
    logSpy.mockRestore();
  });
  it('should clear all data', () => {
    const { result } = renderHook(() => useStateDebug());
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    act(() => {
      result.current.clearAllData();
    });
    expect(result.current.storeSizes).toEqual({});
    expect(result.current.storeData).toEqual({});
    logSpy.mockRestore();
  });
});
