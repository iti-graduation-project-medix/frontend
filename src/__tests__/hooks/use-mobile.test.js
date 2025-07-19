import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useIsMobile } from '../../hooks/use-mobile';

describe('useIsMobile', () => {
  let originalInnerWidth;
  beforeEach(() => {
    originalInnerWidth = window.innerWidth;
    window.innerWidth = 500;
    window.matchMedia = vi.fn().mockImplementation(query => ({
      matches: window.innerWidth < 768,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));
  });
  afterEach(() => {
    window.innerWidth = originalInnerWidth;
  });
  it('should return true if width < 768', () => {
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(true);
  });
  it('should return false if width >= 768', () => {
    window.innerWidth = 1024;
    window.matchMedia = vi.fn().mockImplementation(query => ({
      matches: window.innerWidth < 768,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);
  });
});
