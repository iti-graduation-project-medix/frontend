import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { isOnline, isOffline, showOfflinePage, handleOnlineStatus, checkNetworkStatus, retryConnection } from '../../utils/pwa';

describe('PWA Utils', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should check online status', () => {
    Object.defineProperty(navigator, 'onLine', {
      value: true,
      writable: true,
    });

    expect(isOnline()).toBe(true);
    expect(isOffline()).toBe(false);
  });

  it('should check offline status', () => {
    Object.defineProperty(navigator, 'onLine', {
      value: false,
      writable: true,
    });

    expect(isOnline()).toBe(false);
    expect(isOffline()).toBe(true);
  });

  it('should show offline page when offline', () => {
    Object.defineProperty(navigator, 'onLine', {
      value: false,
      writable: true,
    });

    Object.defineProperty(window, 'location', {
      value: { href: '' },
      writable: true,
    });

    showOfflinePage();

    expect(window.location.href).toBe('/offline.html');
  });

  it('should not show offline page when online', () => {
    Object.defineProperty(navigator, 'onLine', {
      value: true,
      writable: true,
    });

    Object.defineProperty(window, 'location', {
      value: { href: '' },
      writable: true,
    });

    showOfflinePage();

    expect(window.location.href).toBe('');
  });

  it('should handle online status events', () => {
    const addEventListenerSpy = vi.spyOn(window, 'addEventListener');

    const cleanup = handleOnlineStatus();

    expect(addEventListenerSpy).toHaveBeenCalledWith('online', expect.any(Function));
    expect(addEventListenerSpy).toHaveBeenCalledWith('offline', expect.any(Function));

    // Test cleanup
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
    cleanup();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('online', expect.any(Function));
    expect(removeEventListenerSpy).toHaveBeenCalledWith('offline', expect.any(Function));
  });

  it('should check network status', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({ ok: true });

    const result = await checkNetworkStatus();

    expect(result).toBe(true);
    expect(fetch).toHaveBeenCalledWith('/api/health', {
      method: 'HEAD',
      cache: 'no-cache'
    });
  });

  it('should handle network status error', async () => {
    globalThis.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

    const result = await checkNetworkStatus();

    expect(result).toBe(false);
  });

  it('should retry connection successfully', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({ ok: true });
    Object.defineProperty(window, 'location', {
      value: { href: '' },
      writable: true,
    });

    const result = await retryConnection();

    expect(result).toBe(true);
    expect(window.location.href).toBe('/');
  });

  it('should retry connection unsuccessfully', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({ ok: false });

    const result = await retryConnection();

    expect(result).toBe(false);
  });
});
