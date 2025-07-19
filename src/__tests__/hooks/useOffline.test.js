import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useOffline } from '../../hooks/useOffline';

describe('useOffline', () => {
  beforeEach(() => {
    vi.spyOn(window.navigator, 'onLine', 'get').mockReturnValue(true);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return false when online', () => {
    const { result } = renderHook(() => useOffline());
    expect(result.current).toBe(false);
  });

  it('should return true when offline', () => {
    vi.spyOn(window.navigator, 'onLine', 'get').mockReturnValue(false);
    const { result } = renderHook(() => useOffline());
    expect(result.current).toBe(true);
  });

  it('should update when going offline and online', () => {
    const { result } = renderHook(() => useOffline());
    act(() => {
      window.dispatchEvent(new Event('offline'));
    });
    expect(result.current).toBe(true);
    act(() => {
      window.dispatchEvent(new Event('online'));
    });
    expect(result.current).toBe(false);
  });
});
