import { vi, describe, it, expect } from "vitest";
import "@testing-library/jest-dom";
import React from "react";
import { render, screen } from "@testing-library/react";
import OfflineIndicator from "../../components/OfflineIndicator";

vi.mock("../../hooks/usePWA.js", () => ({ useOfflineDetection: () => true }));

describe("OfflineIndicator", () => {
  it("renders offline message", () => {
    render(<OfflineIndicator />);
    expect(screen.getByText(/you're currently offline/i)).toBeInTheDocument();
  });
});
