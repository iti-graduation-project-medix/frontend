// src/setupTests.js
import { vi } from "vitest";

if (typeof window !== "undefined") {
  // eslint-disable-next-line global-strict-mode
  ("use strict");

  // Mock console.error to prevent errors during testing
  // eslint-disable-next-line no-console
  console.error = () => {};

  // Import necessary functions from Vitest

  // Define expect globally
  if (typeof globalThis.expect === "undefined") {
    globalThis.expect = vi.fn();
  }

  // Mock window.matchMedia
  window.matchMedia =
    window.matchMedia ||
    (window.innerWidth >= 768
      ? () => ({
          matches: true
        })
      : () => ({
          matches: false
        }));
}

export { expect };
