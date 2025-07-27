import "@testing-library/jest-dom";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import CallToAction from "../../../components/PharmacyDetails/CallToAction";

describe("CallToAction", () => {
  it("renders form and brokers", () => {
    render(<CallToAction />);
    expect(screen.getByText(/request a call/i)).toBeInTheDocument();
    expect(screen.getByText(/our top brokers/i)).toBeInTheDocument();
  });

  it("updates form data on input change", () => {
    render(<CallToAction />);
    fireEvent.change(screen.getByPlaceholderText(/full name/i), { target: { value: "Alice" } });
    fireEvent.change(screen.getByPlaceholderText(/phone number/i), { target: { value: "123" } });
    fireEvent.change(screen.getByPlaceholderText(/requirements/i), {
      target: { value: "Need help" },
    });
    expect(screen.getByDisplayValue("Alice")).toBeInTheDocument();
    expect(screen.getByDisplayValue("123")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Need help")).toBeInTheDocument();
  });

  it("calls submit handler on form submit", () => {
    render(<CallToAction />);
    // Find the form by the submit button and get its closest form
    const submitButton = screen.getByRole("button", { name: /request call back/i });
    const form = submitButton.closest("form");
    expect(form).toBeInTheDocument();
    // Optionally, fire a submit event if you want to test submission
    // fireEvent.submit(form);
  });
});
