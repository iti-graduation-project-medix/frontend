import "@testing-library/jest-dom";
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import RelatedListings from "../../../components/PharmacyDetails/RelatedListings";
import * as pharmaciesApi from "../../../api/pharmacies";

vi.mock("../../../pages/PharmaciesForSale/PharmacyCard", () => ({
  default: ({ pharmacy }) => <div data-testid="pharmacy-card">{pharmacy.name}</div>,
}));

describe("RelatedListings", () => {
  const pharmacy = { id: "1", name: "Main Pharmacy" };
  const relatedPharmacies = [
    { id: "2", name: "Related 1", owner: { id: "owner1" } },
    { id: "3", name: "Related 2", owner: { id: "owner2" } },
  ];

  beforeEach(() => {
    vi.spyOn(pharmaciesApi, "getRelatedPharmacies").mockResolvedValue({
      data: { pharmacies: relatedPharmacies },
    });
    vi.spyOn(window.localStorage.__proto__, "getItem").mockImplementation((key) => {
      if (key === "user") return JSON.stringify({ id: "not-owner" });
      return null;
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders loading state", () => {
    render(
      <MemoryRouter>
        <RelatedListings pharmacy={pharmacy} />
      </MemoryRouter>
    );
    expect(screen.getByText(/similar listings/i)).toBeInTheDocument();
  });

  it("renders related pharmacies after loading", async () => {
    render(
      <MemoryRouter>
        <RelatedListings pharmacy={pharmacy} />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getAllByTestId("pharmacy-card").length).toBeGreaterThan(0);
    });
  });

  it("renders error state", async () => {
    vi.spyOn(pharmaciesApi, "getRelatedPharmacies").mockRejectedValueOnce(new Error("API Error"));
    render(
      <MemoryRouter>
        <RelatedListings pharmacy={pharmacy} />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByText("API Error")).toBeInTheDocument();
    });
  });

  it("renders fallback if no related pharmacies", async () => {
    vi.spyOn(pharmaciesApi, "getRelatedPharmacies").mockResolvedValueOnce({
      data: { pharmacies: [] },
    });
    render(
      <MemoryRouter>
        <RelatedListings pharmacy={pharmacy} />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByText(/no related pharmacies found/i)).toBeInTheDocument();
    });
  });
});
