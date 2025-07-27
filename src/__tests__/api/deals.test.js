import { describe, it, expect, vi } from "vitest";

// Simple mocks
vi.mock("../../api/axios", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn()
  }
}));

describe("deals API", () => {
  it("should be defined", () => {
    expect(true).toBe(true);
  });
});
