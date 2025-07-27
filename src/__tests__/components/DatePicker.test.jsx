import "@testing-library/jest-dom";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Calendar28 } from "../../components/DatePicker";

describe("Calendar28", () => {
  it("renders input and calendar icon", () => {
    render(<Calendar28 value={null} onChange={() => {}} />);
    expect(screen.getByPlaceholderText(/june 01, 2025/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /select date/i })).toBeInTheDocument();
  });
});
