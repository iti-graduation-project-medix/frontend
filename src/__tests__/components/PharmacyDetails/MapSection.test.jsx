import "@testing-library/jest-dom";
import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import MapSection from "../../../components/PharmacyDetails/MapSection";

describe("MapSection", () => {
  it("renders no map available if no coordinates", () => {
    render(<MapSection location={{}} address="123 Main St" />);
    expect(screen.getByText(/no map available/i)).toBeInTheDocument();
    expect(screen.getByText("123 Main St")).toBeInTheDocument();
  });

  it("renders map and address if coordinates provided", () => {
    render(<MapSection location={{ coordinates: [30, 31] }} address="456 Elm St" />);
    expect(screen.getByText(/location and address/i)).toBeInTheDocument();
    expect(screen.getByText("456 Elm St")).toBeInTheDocument();
    expect(screen.getByTitle("Pharmacy Location")).toBeInTheDocument();
  });
});
