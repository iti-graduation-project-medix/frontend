import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ErrorHandler, getHttpErrorMessage } from '../../utils/errorHandler';
import { toast } from 'sonner';

describe('ErrorHandler', () => {
  beforeEach(() => {
    vi.spyOn(toast, 'success').mockImplementation(() => {});
    vi.spyOn(toast, 'warning').mockImplementation(() => {});
    vi.spyOn(toast, 'info').mockImplementation(() => {});
    vi.spyOn(toast, 'error').mockImplementation(() => {});
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('handleApiError returns correct message and type for known error', () => {
    const error = { message: 'Email or password is incorrect' };
    const result = ErrorHandler.handleApiError(error);
    expect(result.message).toMatch(/Invalid email or password/);
    expect(result.type).toBe('error');
    expect(toast.error).toHaveBeenCalledWith(result.message);
  });

  it('handleApiError returns warning for authentication required', () => {
    const error = { message: 'Authentication required' };
    const result = ErrorHandler.handleApiError(error);
    expect(result.type).toBe('warning');
    expect(toast.warning).toHaveBeenCalledWith(result.message);
  });

  it('handleApiError returns info for under review', () => {
    const error = { message: 'Your documents are under review' };
    const result = ErrorHandler.handleApiError(error);
    expect(result.type).toBe('info');
    expect(toast.info).toHaveBeenCalledWith(result.message);
  });

  it('handleApiError uses customMessage if provided and error.message is not present', () => {
    const error = {};
    const result = ErrorHandler.handleApiError(error, 'context', { customMessage: 'Custom!' });
    expect(result.message).toBe('Custom!');
  });

  it('handleApiError disables toast if showToast is false', () => {
    const error = { message: 'Some error' };
    ErrorHandler.handleApiError(error, 'context', { showToast: false });
    expect(toast.error).not.toHaveBeenCalled();
  });

  it('handleSuccess calls toast.success', () => {
    ErrorHandler.handleSuccess('Success!');
    expect(toast.success).toHaveBeenCalledWith('Success!', {});
  });

  it('handleWarning calls toast.warning', () => {
    ErrorHandler.handleWarning('Warn!');
    expect(toast.warning).toHaveBeenCalledWith('Warn!', {});
  });

  it('handleInfo calls toast.info', () => {
    ErrorHandler.handleInfo('Info!');
    expect(toast.info).toHaveBeenCalledWith('Info!', {});
  });

  it('getErrorType returns correct type', () => {
    expect(ErrorHandler.getErrorType('blocked')).toBe('warning');
    expect(ErrorHandler.getErrorType('under review')).toBe('info');
    expect(ErrorHandler.getErrorType('random error')).toBe('error');
  });

  it('formatErrorMessage returns correct structure', () => {
    const result = ErrorHandler.formatErrorMessage('blocked');
    expect(result).toEqual({ title: 'Account Status', message: 'blocked', type: 'warning' });
  });

  it('getHttpErrorMessage returns correct message for status', () => {
    expect(getHttpErrorMessage(400)).toMatch(/Bad request/);
    expect(getHttpErrorMessage(999)).toMatch(/unexpected/);
    expect(getHttpErrorMessage(401, 'Custom')).toBe('Custom');
  });
});
