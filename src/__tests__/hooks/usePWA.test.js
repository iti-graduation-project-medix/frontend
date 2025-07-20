import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { usePWA, useOfflineDetection } from '../../hooks/usePWA';

describe('usePWA', () => {
  beforeEach(() => {
    vi.spyOn(window.navigator, 'onLine', 'get').mockReturnValue(true);
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });
  it('should return isOnline true and isOffline false when online', () => {
    const { result } = renderHook(() => usePWA());
    expect(result.current.isOnline).toBe(true);
    expect(result.current.isOffline).toBe(false);
  });
  it('should update status on offline/online events', () => {
    const { result } = renderHook(() => usePWA());
    act(() => {
      vi.spyOn(window.navigator, 'onLine', 'get').mockReturnValue(false);
      window.dispatchEvent(new Event('offline'));
    });
    expect(result.current.isOnline).toBe(false);
    expect(result.current.isOffline).toBe(true);
    act(() => {
      vi.spyOn(window.navigator, 'onLine', 'get').mockReturnValue(true);
      window.dispatchEvent(new Event('online'));
    });
    expect(result.current.isOnline).toBe(true);
    expect(result.current.isOffline).toBe(false);
  });
});

describe('useOfflineDetection', () => {
  beforeEach(() => {
    vi.spyOn(window.navigator, 'onLine', 'get').mockReturnValue(true);
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });
  it('should return false when online', () => {
    const { result } = renderHook(() => useOfflineDetection());
    expect(result.current).toBe(false);
  });
  it('should return true when offline', () => {
    vi.spyOn(window.navigator, 'onLine', 'get').mockReturnValue(false);
    const { result } = renderHook(() => useOfflineDetection());
    expect(result.current).toBe(true);
  });
  it('should update when going offline and online', () => {
    const { result } = renderHook(() => useOfflineDetection());
    act(() => {
      vi.spyOn(window.navigator, 'onLine', 'get').mockReturnValue(false);
      window.dispatchEvent(new Event('offline'));
    });
    expect(result.current).toBe(true);
    act(() => {
      vi.spyOn(window.navigator, 'onLine', 'get').mockReturnValue(true);
      window.dispatchEvent(new Event('online'));
    });
    expect(result.current).toBe(false);
  });
});
