import { vi, describe, it, expect } from "vitest";
import "@testing-library/jest-dom";
import React from "react";
import { render, screen } from "@testing-library/react";
import ProtectedRoute from "../../components/ProtectedRoute";

vi.mock("@/store/useAuth", () => ({ useAuth: () => ({ isAuthenticated: true }) }));

describe("ProtectedRoute", () => {
  it("renders children when authenticated", () => {
    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );
    expect(screen.getByText(/protected content/i)).toBeInTheDocument();
  });
});
