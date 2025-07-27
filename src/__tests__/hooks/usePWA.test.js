import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePWA } from '../../hooks/usePWA';

describe('usePWA', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => usePWA());

    expect(result.current.isOnline).toBeDefined();
    expect(result.current.isOffline).toBeDefined();
    expect(typeof result.current.isOnline).toBe('boolean');
    expect(typeof result.current.isOffline).toBe('boolean');
  });

  it('should handle online event', () => {
    const { result } = renderHook(() => usePWA());

    act(() => {
      window.dispatchEvent(new Event('online'));
    });

    expect(result.current.isOnline).toBe(true);
    expect(result.current.isOffline).toBe(false);
  });

  it('should handle offline event', () => {
    Object.defineProperty(navigator, 'onLine', {
      value: false,
      writable: true,
    });
    const { result, rerender } = renderHook(() => usePWA());
    act(() => {
      window.dispatchEvent(new Event('offline'));
      rerender();
    });
    expect(result.current.isOnline).toBe(false);
    expect(result.current.isOffline).toBe(true);
  });

  it('should update online status when navigator.onLine changes', () => {
    const { result } = renderHook(() => usePWA());

    // Mock navigator.onLine
    Object.defineProperty(navigator, 'onLine', {
      value: false,
      writable: true,
    });

    act(() => {
      window.dispatchEvent(new Event('offline'));
    });

    expect(result.current.isOnline).toBe(false);
    expect(result.current.isOffline).toBe(true);
  });

  it('should cleanup event listeners on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
    const { unmount } = renderHook(() => usePWA());

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('online', expect.any(Function));
    expect(removeEventListenerSpy).toHaveBeenCalledWith('offline', expect.any(Function));
  });

  it('should return correct initial state based on navigator.onLine', () => {
    // Mock navigator.onLine to true
    Object.defineProperty(navigator, 'onLine', {
      value: true,
      writable: true,
    });

    const { result } = renderHook(() => usePWA());

    expect(result.current.isOnline).toBe(true);
    expect(result.current.isOffline).toBe(false);
  });
});
