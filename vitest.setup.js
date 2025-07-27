import { vi } from "vitest";

vi.mock("fetch", () => ({
  default: vi.fn()
}));
