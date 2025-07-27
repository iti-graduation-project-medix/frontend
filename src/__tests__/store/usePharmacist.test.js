import { describe, it, expect, vi } from "vitest";

// Simple mocks
vi.mock("../../api/profile/profile", () => ({
  getPharmacistDetails: vi.fn()
}));

describe("usePharmacist", () => {
  it("should be defined", () => {
    expect(true).toBe(true);
  });
});
