import "@testing-library/jest-dom";
import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import OwnerInfo from "../../../components/PharmacyDetails/OwnerInfo";

describe("OwnerInfo", () => {
  const owner = { fullName: "Jane Smith", phone: "123456", email: "jane@example.com" };

  it("renders owner info and initials", () => {
    render(<OwnerInfo owner={owner} />);
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    expect(screen.getByText("JS")).toBeInTheDocument();
    expect(screen.getByText("123456")).toBeInTheDocument();
    expect(screen.getByText("jane@example.com")).toBeInTheDocument();
  });

  it("renders nothing if no owner", () => {
    const { container } = render(<OwnerInfo />);
    expect(container.firstChild).toBeNull();
  });
});
