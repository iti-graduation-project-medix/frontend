import "@testing-library/jest-dom";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import ImageGallery from "../../../components/PharmacyDetails/ImageGallery";

describe("ImageGallery", () => {
  const images = ["img1.jpg", "img2.jpg", "img3.jpg"];

  it("renders no images available if images empty", () => {
    render(<ImageGallery images={[]} />);
    expect(screen.getByText(/no images available/i)).toBeInTheDocument();
  });

  it("renders main image and thumbnails", () => {
    render(<ImageGallery images={images} />);
    expect(screen.getByAltText("Pharmacy 1")).toBeInTheDocument();
    expect(screen.getAllByRole("button").length).toBeGreaterThan(1);
  });

  it("changes image on next/prev click", async () => {
    render(<ImageGallery images={images} />);
    // Next button is the second button in the main image container
    fireEvent.click(screen.getAllByRole("button")[1]); // next
    expect(await screen.findByAltText("Pharmacy 2")).toBeInTheDocument();
    fireEvent.click(screen.getAllByRole("button")[0]); // prev
    expect(await screen.findByAltText("Pharmacy 1")).toBeInTheDocument();
  });

  it("changes main image on thumbnail click", async () => {
    render(<ImageGallery images={images} />);
    // Thumbnail buttons start after the first two (prev/next)
    fireEvent.click(screen.getAllByRole("button")[2 + 1]); // thumbnail 2 (index 1)
    expect(await screen.findByAltText("Pharmacy 2")).toBeInTheDocument();
  });
});
