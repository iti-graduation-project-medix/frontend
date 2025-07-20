import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useDebounce } from '../../hooks/useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('should debounce the callback', () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useDebounce(callback, 300));
    act(() => {
      result.current('test');
      result.current('test2');
    });
    expect(callback).not.toBeCalled();
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(callback).toBeCalledTimes(1);
    expect(callback).toBeCalledWith('test2');
  });

  it('should cancel debounce on unmount', () => {
    const callback = vi.fn();
    const { result, unmount } = renderHook(() => useDebounce(callback, 300));
    act(() => {
      result.current('test');
    });
    unmount();
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(callback).not.toBeCalled();
  });
});
