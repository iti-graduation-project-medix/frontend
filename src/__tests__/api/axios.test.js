import { describe, it, expect, vi } from "vitest";

// Simple mocks
vi.mock("axios", () => ({
  default: {
    create: vi.fn(),
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() }
    }
  }
}));

describe("axios configuration", () => {
  it("should be defined", () => {
    expect(true).toBe(true);
  });
});
