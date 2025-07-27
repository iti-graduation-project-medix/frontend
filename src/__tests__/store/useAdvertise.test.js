import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAdvertise } from '../../store/useAdvertise';

global.localStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

describe('useAdvertise', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.localStorage.getItem.mockReturnValue(null);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should initialize with null advertise value', () => {
    const { result } = renderHook(() => useAdvertise());
    expect(result.current.advertise).toBeNull();
  });

  it('should set advertise value', () => {
    const { result } = renderHook(() => useAdvertise());
    const testAdvertise = { id: 1, title: 'Test Ad' };
    act(() => {
      result.current.setAdvertise(testAdvertise);
    });
    expect(result.current.advertise).toEqual(testAdvertise);
  });

  it('should update advertise value', () => {
    const { result } = renderHook(() => useAdvertise());
    const initialAdvertise = { id: 1, title: 'Initial Ad' };
    const updatedAdvertise = { id: 1, title: 'Updated Ad' };
    act(() => {
      result.current.setAdvertise(initialAdvertise);
    });
    expect(result.current.advertise).toEqual(initialAdvertise);
    act(() => {
      result.current.setAdvertise(updatedAdvertise);
    });
    expect(result.current.advertise).toEqual(updatedAdvertise);
  });

  it('should handle null advertise value', () => {
    const { result } = renderHook(() => useAdvertise());
    act(() => {
      result.current.setAdvertise(null);
    });
    expect(result.current.advertise).toBeNull();
  });

  it('should handle complex advertise object', () => {
    const { result } = renderHook(() => useAdvertise());
    const complexAdvertise = {
      id: 1,
      title: 'Complex Ad',
      description: 'A complex advertisement',
      images: ['image1.jpg', 'image2.jpg'],
      metadata: {
        category: 'health',
        priority: 'high'
      }
    };
    act(() => {
      result.current.setAdvertise(complexAdvertise);
    });
    expect(result.current.advertise).toEqual(complexAdvertise);
  });
});
