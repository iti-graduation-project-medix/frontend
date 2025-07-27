import { vi, describe, it, expect } from "vitest";
import "@testing-library/jest-dom";
import React from "react";
import { render, screen } from "@testing-library/react";
import OfflineRouteGuard from "../../components/OfflineRouteGuard";

vi.mock("../../hooks/useOffline", () => ({ useOffline: () => false }));

describe("OfflineRouteGuard", () => {
  it("renders children when online", () => {
    render(
      <OfflineRouteGuard>
        <div>Online Content</div>
      </OfflineRouteGuard>
    );
    expect(screen.getByText(/online content/i)).toBeInTheDocument();
  });
});
