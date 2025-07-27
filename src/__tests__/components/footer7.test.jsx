import "@testing-library/jest-dom";
import React from "react";
import { render, screen } from "@testing-library/react";
import { Footer7 } from "../../components/footer7";
import { MemoryRouter } from "react-router-dom";

describe("Footer7", () => {
  it("renders logo and copyright", () => {
    render(
      <MemoryRouter>
        <Footer7 />
      </MemoryRouter>
    );
    expect(screen.getByAltText(/logo/i)).toBeInTheDocument();
    expect(screen.getByText(/all rights reserved/i)).toBeInTheDocument();
  });
});
