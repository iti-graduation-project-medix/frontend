/* global global */
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useInView } from '../../hooks/useInView';

describe('useInView', () => {
  let observeMock, disconnectMock;
  beforeEach(() => {
    observeMock = vi.fn();
    disconnectMock = vi.fn();
    vi.mock('react', async () => {
      const actual = await vi.importActual('react');
      return {
        ...actual,
        useRef: () => ({ current: {} }), // Set current to a dummy object
      };
    });
    global.IntersectionObserver = vi.fn(function (cb) {
      this.observe = observeMock;
      this.disconnect = disconnectMock;
      this.trigger = (entry) => cb([entry]);
    });
  });
  afterEach(() => {
    vi.restoreAllMocks();
    delete global.IntersectionObserver;
  });
  it('should return a ref and false initially', () => {
    const { result } = renderHook(() => useInView());
    const [ref, isInView] = result.current;
    expect(typeof ref).toBe('object');
    expect(isInView).toBe(false);
  });
  it('should set isInView to true when intersecting', () => {
    const { result } = renderHook(() => useInView());
    // Remove unused ref variable
    const observerInstance = global.IntersectionObserver.mock.instances[0];
    act(() => {
      observerInstance.trigger({ isIntersecting: true });
    });
    expect(result.current[1]).toBe(true);
  });
});
