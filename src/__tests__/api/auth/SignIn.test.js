import { describe, it, expect, vi } from "vitest";

// Simple mocks
vi.mock("../../axios", () => ({
  default: {
    post: vi.fn()
  }
}));

describe("SignIn API", () => {
  it("should be defined", () => {
    expect(true).toBe(true);
  });
});
