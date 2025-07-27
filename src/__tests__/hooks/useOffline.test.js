import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useOffline } from '../../hooks/useOffline';

describe('useOffline', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return false when online', () => {
    Object.defineProperty(navigator, 'onLine', {
      value: true,
      writable: true,
    });

    const { result } = renderHook(() => useOffline());
    expect(result.current).toBe(false);
  });

  it('should return true when offline', () => {
    Object.defineProperty(navigator, 'onLine', {
      value: false,
      writable: true,
    });

    const { result } = renderHook(() => useOffline());
    expect(result.current).toBe(true);
  });

  it('should update when online event fires', () => {
    Object.defineProperty(navigator, 'onLine', {
      value: false,
      writable: true,
    });

    const { result } = renderHook(() => useOffline());
    expect(result.current).toBe(true);

    act(() => {
      Object.defineProperty(navigator, 'onLine', {
        value: true,
        writable: true,
      });
      window.dispatchEvent(new Event('online'));
    });

    expect(result.current).toBe(false);
  });

  it('should update when offline event fires', () => {
    Object.defineProperty(navigator, 'onLine', {
      value: true,
      writable: true,
    });

    const { result } = renderHook(() => useOffline());
    expect(result.current).toBe(false);

    act(() => {
      Object.defineProperty(navigator, 'onLine', {
        value: false,
        writable: true,
      });
      window.dispatchEvent(new Event('offline'));
    });

    expect(result.current).toBe(true);
  });
});
