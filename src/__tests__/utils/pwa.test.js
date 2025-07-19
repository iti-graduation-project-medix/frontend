import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as pwaUtils from '../../utils/pwa';

let hrefSetter;

describe('pwa utils', () => {
  beforeEach(() => {
    Object.defineProperty(window.navigator, 'onLine', {
      configurable: true,
      get: vi.fn(() => true),
    });
    // Mock window.location.href setter
    hrefSetter = vi.fn();
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: {
        get href() {
          return 'https://example.com/';
        },
        set href(val) {
          hrefSetter(val);
        },
      },
    });
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('isOnline returns true when online', () => {
    vi.spyOn(window.navigator, 'onLine', 'get').mockReturnValue(true);
    expect(pwaUtils.isOnline()).toBe(true);
  });

  it('isOffline returns true when offline', () => {
    vi.spyOn(window.navigator, 'onLine', 'get').mockReturnValue(false);
    expect(pwaUtils.isOffline()).toBe(true);
  });

  it('showOfflinePage redirects when offline', () => {
    vi.spyOn(window.navigator, 'onLine', 'get').mockReturnValue(false);
    pwaUtils.showOfflinePage();
    expect(hrefSetter).toHaveBeenCalledWith('/offline.html');
  });

  it('showOfflinePage does not redirect when online', () => {
    vi.spyOn(window.navigator, 'onLine', 'get').mockReturnValue(true);
    pwaUtils.showOfflinePage();
    expect(hrefSetter).not.toHaveBeenCalled();
  });

  it('handleOnlineStatus adds and removes event listeners', () => {
    const addSpy = vi.spyOn(window, 'addEventListener');
    const removeSpy = vi.spyOn(window, 'removeEventListener');
    const cleanup = pwaUtils.handleOnlineStatus();
    expect(addSpy).toHaveBeenCalledWith('online', expect.any(Function));
    expect(addSpy).toHaveBeenCalledWith('offline', expect.any(Function));
    cleanup();
    expect(removeSpy).toHaveBeenCalledWith('online', expect.any(Function));
    expect(removeSpy).toHaveBeenCalledWith('offline', expect.any(Function));
  });

  it('navigateToHome redirects to /', () => {
    pwaUtils.navigateToHome();
    expect(hrefSetter).toHaveBeenCalledWith('/');
  });

  it('checkNetworkStatus returns true for ok response', async () => {
    window.fetch = vi.fn().mockResolvedValue({ ok: true });
    const result = await pwaUtils.checkNetworkStatus();
    expect(result).toBe(true);
  });

  it('checkNetworkStatus returns false for error', async () => {
    window.fetch = vi.fn().mockRejectedValue(new Error('fail'));
    const result = await pwaUtils.checkNetworkStatus();
    expect(result).toBe(false);
  });

  it('retryConnection navigates to home if connected', async () => {
    window.fetch = vi.fn().mockResolvedValue({ ok: true });
    const result = await pwaUtils.retryConnection();
    expect(hrefSetter).toHaveBeenCalledWith('/');
    expect(result).toBe(true);
  });

  it('retryConnection returns false if not connected', async () => {
    window.fetch = vi.fn().mockResolvedValue({ ok: false });
    const navSpy = vi.spyOn(pwaUtils, 'navigateToHome');
    const result = await pwaUtils.retryConnection();
    expect(navSpy).not.toHaveBeenCalled();
    expect(result).toBe(false);
  });
});
