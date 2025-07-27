import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDeals } from '../../store/useDeals';

vi.mock('../../api/deals', () => ({
  createDeal: vi.fn(),
  getDeals: vi.fn(),
  getDeal: vi.fn(),
  updateDeal: vi.fn(),
  deleteDeal: vi.fn(),
  updateDealStatus: vi.fn(),
}));
vi.mock('../../api/profile/UserDeals', () => ({
  getUserDeals: vi.fn(),
}));

describe('useDeals', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should create a deal', async () => {
    const { createDeal } = await import('../../api/deals');
    vi.mocked(createDeal).mockResolvedValue({ data: { deal: { id: 1 } } });
    const { result } = renderHook(() => useDeals());
    await act(async () => {
      const res = await result.current.createDeal({ name: 'Deal' });
      expect(res).toEqual({ data: { deal: { id: 1 } } });
    });
    expect(result.current.deals).toContainEqual({ id: 1 });
  });

  it('should fetch deals', async () => {
    const { getDeals } = await import('../../api/deals');
    vi.mocked(getDeals).mockResolvedValue({ data: { deals: [{ id: 1 }], total: 1, page: 1, totalPages: 1 } });
    const { result } = renderHook(() => useDeals());
    await act(async () => {
      const res = await result.current.fetchDeals();
      expect(res).toEqual({ data: { deals: [{ id: 1 }], total: 1, page: 1, totalPages: 1 } });
    });
    expect(result.current.deals).toEqual([{ id: 1 }]);
  });

  it('should fetch a single deal', async () => {
    const { getDeal } = await import('../../api/deals');
    vi.mocked(getDeal).mockResolvedValue({ id: 1 });
    const { result } = renderHook(() => useDeals());
    await act(async () => {
      const res = await result.current.fetchDeal(1);
      expect(res).toEqual({ id: 1 });
    });
    expect(result.current.currentDeal).toEqual({ id: 1 });
  });

  it('should update a deal', async () => {
    const { updateDeal } = await import('../../api/deals');
    vi.mocked(updateDeal).mockResolvedValue({ data: { deal: { id: 1, name: 'Updated' } } });
    const { result } = renderHook(() => useDeals());
    act(() => {
      result.current.deals = [{ id: 1, name: 'Old' }];
    });
    await act(async () => {
      const res = await result.current.updateDeal(1, { name: 'Updated' });
      expect(res).toEqual({ data: { deal: { id: 1, name: 'Updated' } } });
    });
    expect(result.current.deals).toContainEqual({ id: 1, name: 'Updated' });
  });

  it('should delete a deal', async () => {
    const { deleteDeal } = await import('../../api/deals');
    vi.mocked(deleteDeal).mockResolvedValue({});
    const { result } = renderHook(() => useDeals());
    act(() => {
      result.current.deals = [{ id: 1 }];
    });
    await act(async () => {
      await result.current.deleteDeal(1);
    });
    expect(result.current.deals).toEqual([]);
  });

  it('should update deal status', async () => {
    const { updateDealStatus } = await import('../../api/deals');
    vi.mocked(updateDealStatus).mockResolvedValue({ data: { deal: { id: 1, closed: true } } });
    const { result } = renderHook(() => useDeals());
    act(() => {
      result.current.deals = [{ id: 1, closed: false }];
    });
    await act(async () => {
      const res = await result.current.updateDealStatus(1, true);
      expect(res).toEqual({ data: { deal: { id: 1, closed: true } } });
    });
    expect(result.current.deals).toContainEqual({ id: 1, closed: true });
  });

  it('should handle fetch error', async () => {
    const { getDeals } = await import('../../api/deals');
    vi.mocked(getDeals).mockRejectedValue(new Error('fail'));
    const { result } = renderHook(() => useDeals());
    await expect(result.current.fetchDeals()).rejects.toThrow('fail');
    expect(result.current.error).toBe('fail');
  });
});
