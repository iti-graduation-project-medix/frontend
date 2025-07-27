import "@testing-library/jest-dom";
import React from "react";
import { render } from "@testing-library/react";
import MedicineDealCardSkeleton from "../../components/MedicineDealCardSkeleton";

describe("MedicineDealCardSkeleton", () => {
  it("renders skeleton elements", () => {
    render(<MedicineDealCardSkeleton />);
    expect(document.querySelector(".animate-pulse")).toBeInTheDocument();
  });
});
