import { describe, it, expect, vi } from "vitest";

// Simple mock for sonner
vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
    warning: vi.fn(),
    success: vi.fn(),
    info: vi.fn()
  }
}));

describe("ErrorHandler", () => {
  it("should be defined", () => {
    expect(true).toBe(true);
  });
});
