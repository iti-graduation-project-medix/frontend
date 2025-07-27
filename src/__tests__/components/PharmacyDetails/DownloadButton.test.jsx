import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import DownloadButton from "../../../components/PharmacyDetails/DownloadButton";
import "@testing-library/jest-dom";

describe("DownloadButton", () => {
  it("renders nothing if no saleFileUrl", () => {
    const { container } = render(<DownloadButton />);
    expect(container.firstChild).toBeNull();
  });

  it("renders download button if saleFileUrl provided", () => {
    render(<DownloadButton saleFileUrl="http://example.com/file.pdf" />);
    expect(screen.getByText(/download pharmacy file/i)).toBeInTheDocument();
    expect(screen.getByRole("link")).toHaveAttribute("href", "http://example.com/file.pdf");
  });
});
