import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePharmacies } from '../../store/usePharmcies';

vi.mock('../../api/profile/UserPharmacy', () => ({
  getPharmacies: vi.fn(),
  createPharmacy: vi.fn(),
  updatePharmacy: vi.fn(),
  deletePharmacy: vi.fn(),
}));

describe('usePharmacies', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should fetch pharmacies', async () => {
    const { getPharmacies } = await import('../../api/profile/UserPharmacy');
    vi.mocked(getPharmacies).mockResolvedValue({ data: { pharmacies: [{ id: 1 }] } });
    const { result } = renderHook(() => usePharmacies());
    await act(async () => {
      const res = await result.current.fetchPharmacies('token', 'user');
      expect(res).toEqual([{ id: 1 }]);
    });
    expect(result.current.pharmacies).toEqual([{ id: 1 }]);
    expect(result.current.error).toBeNull();
  });

  it('should add pharmacy', async () => {
    const { createPharmacy } = await import('../../api/profile/UserPharmacy');
    vi.mocked(createPharmacy).mockResolvedValue({ data: { id: 2 } });
    const { result } = renderHook(() => usePharmacies());
    await act(async () => {
      const res = await result.current.addPharmacy({ name: 'Pharmacy' }, 'token');
      expect(res).toEqual({ data: { id: 2 } });
    });
    expect(result.current.pharmacies).toContainEqual({ id: 2 });
  });

  it('should update pharmacy', async () => {
    const { updatePharmacy } = await import('../../api/profile/UserPharmacy');
    vi.mocked(updatePharmacy).mockResolvedValue({ data: { id: 1, name: 'Updated' } });
    const { result } = renderHook(() => usePharmacies());
    act(() => {
      result.current.pharmacies = [{ id: 1, name: 'Old' }];
    });
    await act(async () => {
      const res = await result.current.updatePharmacyById(1, { name: 'Updated' }, 'token');
      expect(res).toEqual({ data: { id: 1, name: 'Updated' } });
    });
    expect(result.current.pharmacies).toContainEqual({ id: 1, name: 'Updated' });
  });

  it('should delete pharmacy', async () => {
    const { deletePharmacy } = await import('../../api/profile/UserPharmacy');
    vi.mocked(deletePharmacy).mockResolvedValue({});
    const { result } = renderHook(() => usePharmacies());
    act(() => {
      result.current.pharmacies = [{ id: 1 }];
    });
    await act(async () => {
      await result.current.deletePharmacyById(1, 'token');
    });
    expect(result.current.pharmacies).toEqual([]);
  });

  it('should handle fetch error', async () => {
    const { getPharmacies } = await import('../../api/profile/UserPharmacy');
    vi.mocked(getPharmacies).mockRejectedValue(new Error('fail'));
    const { result } = renderHook(() => usePharmacies());
    await expect(result.current.fetchPharmacies('token', 'user')).rejects.toThrow('fail');
    expect(result.current.error).toBe('fail');
  });
});
