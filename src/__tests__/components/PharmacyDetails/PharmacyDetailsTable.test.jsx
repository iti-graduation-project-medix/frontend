import "@testing-library/jest-dom";
import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import PharmacyDetailsTable from "../../../components/PharmacyDetails/PharmacyDetailsTable";

describe("PharmacyDetailsTable", () => {
  const pharmacy = {
    pharmacyPrice: 100000,
    area: 100,
    licenseNum: "LN123",
    monthlySales: 5000,
    createdAt: new Date().toISOString(),
    addressLine1: "123 Main St",
  };

  it("renders all details", () => {
    render(<PharmacyDetailsTable pharmacy={pharmacy} />);
    expect(screen.getByText("Pharmacy Details")).toBeInTheDocument();
    expect(screen.getByText("LN123")).toBeInTheDocument();
    expect(screen.getByText("123 Main St")).toBeInTheDocument();
    expect(screen.getAllByText(/1,000 EGP/).length).toBeGreaterThan(0);
  });

  it("handles missing data gracefully", () => {
    render(<PharmacyDetailsTable pharmacy={{}} />);
    // There are multiple N/A and Not specified fields, so check that at least one exists
    expect(screen.getAllByText("N/A").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Not specified").length).toBeGreaterThan(0);
  });
});
