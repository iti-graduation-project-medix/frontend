import { vi } from 'vitest';
import '@testing-library/jest-dom';

if (typeof window !== 'undefined') {
  // IntersectionObserver mock with callback
  const observe = vi.fn();
  const unobserve = vi.fn();
  const disconnect = vi.fn();
  const mockIntersectionObserver = vi.fn(function (cb, options) {
    mockIntersectionObserver.callback = cb;
    mockIntersectionObserver.options = options;
    return { observe, unobserve, disconnect };
  });
  mockIntersectionObserver.callback = () => {}; // Always defined
  window.IntersectionObserver = mockIntersectionObserver;

  // matchMedia mock
  if (!window.matchMedia) {
    window.matchMedia = vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
  }
}
