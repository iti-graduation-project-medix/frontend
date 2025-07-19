/* global describe, it, expect */
import { render, screen } from "@testing-library/react";
import React from "react";
import "@testing-library/jest-dom";

describe("Hello test", () => {
  it("renders hello world", () => {
    render(<div>Hello World</div>);
    expect(screen.getByText("Hello World")).toBeInTheDocument();
  });
});
