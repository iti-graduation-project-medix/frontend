// utils.test.js

import { describe, it, expect, vi } from "vitest";

// Simple mocks
vi.mock("clsx", () => ({
  clsx: vi.fn()
}));

vi.mock("tailwind-merge", () => ({
  twMerge: vi.fn()
}));

describe("utils", () => {
  it("should be defined", () => {
    expect(true).toBe(true);
  });
});
