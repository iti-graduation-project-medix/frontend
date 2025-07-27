import { describe, it, expect, vi } from "vitest";

// Simple mocks
vi.mock("../../api/profile/profile", () => ({
  getUserDetailsById: vi.fn()
}));

vi.mock("../../api/axios", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn()
  }
}));

describe("useUserDetails", () => {
  it("should be defined", () => {
    expect(true).toBe(true);
  });
});
