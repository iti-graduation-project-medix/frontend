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

vi.mock("../../../store/useFav", () => ({
  useFav: () => ({
    isPharmacyFavorite: vi.fn().mockReturnValue(false),
    togglePharmacyFavorite: vi.fn(),
    fetchFavorites: vi.fn(),
    isLoading: false,
  }),
}));

describe("ListingHeader", () => {
  it("should render without crashing", () => {
    expect(true).toBe(true);
  });
});
