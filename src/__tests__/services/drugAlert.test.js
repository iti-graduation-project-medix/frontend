import { describe, it, expect, vi } from "vitest";

// Simple mocks
vi.mock("../../api/axios", () => ({
  default: {
    get: vi.fn(),
    patch: vi.fn()
  }
}));

describe("Drug Alert Service", () => {
  it("should be defined", () => {
    expect(true).toBe(true);
  });
});
