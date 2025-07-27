import "@testing-library/jest-dom";
import React from "react";
import { render, screen } from "@testing-library/react";
import InstallApp from "../../components/InstallApp";

describe("InstallApp", () => {
  it("renders install app button", () => {
    render(<InstallApp />);
    expect(screen.getByRole("button", { name: /install app/i })).toBeInTheDocument();
  });
});
