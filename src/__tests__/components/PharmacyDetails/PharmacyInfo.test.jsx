import "@testing-library/jest-dom";
import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import PharmacyInfo from "../../../components/PharmacyDetails/PharmacyInfo";

describe("PharmacyInfo", () => {
  const pharmacy = {
    name: "Pharmacy 1",
    addressLine1: "123 Main St",
    createdAt: new Date().toISOString(),
    saleType: "pharmacy_with_medicines",
    pharmacyPrice: 100000,
    licenseNum: "LN123",
  };

  it("renders pharmacy info and sale type", () => {
    render(<PharmacyInfo pharmacy={pharmacy} />);
    expect(screen.getByText("Pharmacy 1")).toBeInTheDocument();
    expect(screen.getByText("With Medicines")).toBeInTheDocument();
    expect(screen.getByText("LN123")).toBeInTheDocument();
  });

  it("handles missing data gracefully", () => {
    render(<PharmacyInfo pharmacy={{}} />);
    expect(screen.getByText("Location not specified")).toBeInTheDocument();
    expect(screen.getByText("N/A")).toBeInTheDocument();
  });
});
