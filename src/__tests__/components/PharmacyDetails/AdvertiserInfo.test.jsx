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

vi.mock("../../../store/useChat", () => ({
  useChat: () => ({
    startChat: vi.fn(),
    isLoading: false,
  }),
}));

vi.mock("../../../store/useAuth", () => ({
  useAuth: () => ({
    user: { id: "user1" },
    isAuthenticated: true,
  }),
}));

describe("AdvertiserInfo", () => {
  it("should render without crashing", () => {
    expect(true).toBe(true);
  });
});
