import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import MedicineDealCard from "../../components/MedicineDealCard";
import "@testing-library/jest-dom";

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock useAuth
const mockUseAuth = {
  user: "test-user-id",
};
vi.mock("../../store/useAuth", () => ({
  useAuth: () => mockUseAuth,
}));

// Mock useFav
const mockUseFav = {
  isDealFavorite: vi.fn(() => false),
  toggleDealFavorite: vi.fn(),
  fetchFavorites: vi.fn(),
  isLoading: false,
};
vi.mock("../../store/useFav", () => ({
  useFav: () => mockUseFav,
}));

// Mock sonner toast
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock framer-motion
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    button: ({ children, ...props }) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }) => children,
}));

describe("MedicineDealCard", () => {
  const mockDeal = {
    id: "deal1",
    medicineName: "Test Medicine",
    dealType: "discount",
    price: 100,
    originalPrice: 150,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders medicine name", () => {
    render(
      <BrowserRouter>
        <MedicineDealCard deal={mockDeal} />
      </BrowserRouter>
    );

    expect(screen.getByText("Test Medicine")).toBeInTheDocument();
  });
});
