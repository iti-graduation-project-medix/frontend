import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAuth } from '../../store/useAuth';

vi.mock('../../api/auth/SignIn', () => ({ signIn: vi.fn() }));
vi.mock('../../api/auth/ResetPassword', () => ({
  resetPassword: vi.fn(),
  confirmOtp: vi.fn(),
  confirmPassword: vi.fn(),
}));
vi.mock('../../api/auth/ChangePassword', () => ({ changePassword: vi.fn() }));
vi.mock('../../utils/stateManager', () => ({ clearAllStores: vi.fn() }));
vi.mock('../../utils/errorHandler', () => ({
  ErrorHandler: {
    handleSuccess: vi.fn(),
    handleApiError: vi.fn((err) => ({ message: err.message || 'fail' })),
  },
}));
vi.mock('../../store/useUserDetails', () => ({ useUserDetails: { getState: () => ({ resetUserDetails: vi.fn() }) } }));

globalThis.localStorage = { getItem: vi.fn(), setItem: vi.fn() };
globalThis.sessionStorage = { setItem: vi.fn() };

describe('useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should login successfully', async () => {
    const { signIn } = await import('../../api/auth/SignIn');
    vi.mocked(signIn).mockResolvedValue({ data: { token: 't', id: 1 } });
    const { result } = renderHook(() => useAuth());
    await act(async () => {
      const res = await result.current.login({ email: 'a', password: 'b' });
      expect(res).toEqual({ data: { token: 't', id: 1 } });
    });
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it('should handle login error', async () => {
    const { signIn } = await import('../../api/auth/SignIn');
    vi.mocked(signIn).mockRejectedValue(new Error('fail'));
    const { result } = renderHook(() => useAuth());
    await expect(result.current.login({ email: 'a', password: 'b' })).rejects.toThrow('fail');
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.error).toBe('fail');
  });

  it('should reset password', async () => {
    const { resetPassword } = await import('../../api/auth/ResetPassword');
    vi.mocked(resetPassword).mockResolvedValue({});
    const { result } = renderHook(() => useAuth());
    await act(async () => {
      const res = await result.current.resetPassword({ email: 'a' });
      expect(res).toEqual({});
    });
    expect(result.current.error).toBeNull();
  });

  it('should handle reset password error', async () => {
    const { resetPassword } = await import('../../api/auth/ResetPassword');
    vi.mocked(resetPassword).mockRejectedValue(new Error('fail'));
    const { result } = renderHook(() => useAuth());
    await expect(result.current.resetPassword({ email: 'a' })).rejects.toThrow('fail');
    expect(result.current.error).toBe('fail');
  });

  it('should confirm OTP', async () => {
    const { confirmOtp } = await import('../../api/auth/ResetPassword');
    vi.mocked(confirmOtp).mockResolvedValue({});
    const { result } = renderHook(() => useAuth());
    await act(async () => {
      const res = await result.current.confirmOtp({ email: 'a', otp: '1234' });
      expect(res).toEqual({});
    });
    expect(result.current.error).toBeNull();
  });

  it('should handle confirm OTP error', async () => {
    const { confirmOtp } = await import('../../api/auth/ResetPassword');
    vi.mocked(confirmOtp).mockRejectedValue(new Error('fail'));
    const { result } = renderHook(() => useAuth());
    await expect(result.current.confirmOtp({ email: 'a', otp: '1234' })).rejects.toThrow('fail');
    expect(result.current.error).toBe('fail');
  });
});
