import "@testing-library/jest-dom";
import React from "react";
import { render, screen } from "@testing-library/react";
import OfflinePage from "../../components/OfflinePage";

describe("OfflinePage", () => {
  it("renders offline status message", () => {
    render(<OfflinePage />);
    expect(screen.getByText(/you\'re offline/i)).toBeInTheDocument();
  });
});
