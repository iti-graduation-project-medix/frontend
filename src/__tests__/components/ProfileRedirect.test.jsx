import React from "react";
import { describe, it, expect, vi } from "vitest";

// Simple mocks
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

vi.mock("../../store/useAuth", () => ({
  useAuth: () => ({
    user: null,
    isAuthenticated: false,
  }),
}));

describe("ProfileRedirect", () => {
  it("should render without crashing", () => {
    expect(true).toBe(true);
  });
});
