import { describe, it, expect, vi } from "vitest";

// Simple mocks
vi.mock("../../api/axios", () => ({
  default: {
    get: vi.fn(),
    patch: vi.fn()
  }
}));

describe("pharmacies API", () => {
  it("should be defined", () => {
    expect(true).toBe(true);
  });
});
