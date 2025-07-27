import { vi } from 'vitest';

export const io = vi.fn(() => ({
  id: 'test-socket-id',
  on: vi.fn(),
  off: vi.fn(),
  emit: vi.fn(),
  disconnect: vi.fn(),
}));
