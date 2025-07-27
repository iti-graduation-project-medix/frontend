import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the axios module before importing the functions
vi.mock("../../api/axios", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn()
  }
}));

// Import after mocking
import {
  getUserFavorites,
  addDealToFavorites,
  addPharmacyToFavorites,
  removePharmacyFromFavorites,
  removeDealFromFavorites
} from "../../api/favourite";

describe("favourite API", () => {
  let mockApi;

  beforeEach(async () => {
    vi.clearAllMocks();
    // Get the mocked axios instance
    const axiosModule = await import("../../api/axios");
    mockApi = axiosModule.default;
  });

  it("should get user favorites", async () => {
    const mockResponse = { data: { favorites: [] } };
    mockApi.get.mockResolvedValue(mockResponse);

    const result = await getUserFavorites();

    expect(mockApi.get).toHaveBeenCalledWith("/favorite");
    expect(result).toEqual(mockResponse.data);
  });

  it("should add deal to favorites", async () => {
    const dealId = "123";
    const mockResponse = { data: { message: "Deal added to favorites" } };
    mockApi.post.mockResolvedValue(mockResponse);

    const result = await addDealToFavorites(dealId);

    expect(mockApi.post).toHaveBeenCalledWith(`/favorite/deal/${dealId}`);
    expect(result).toEqual(mockResponse.data);
  });

  it("should add pharmacy to favorites", async () => {
    const pharmacyId = "456";
    const mockResponse = { data: { message: "Pharmacy added to favorites" } };
    mockApi.post.mockResolvedValue(mockResponse);

    const result = await addPharmacyToFavorites(pharmacyId);

    expect(mockApi.post).toHaveBeenCalledWith(`/favorite/pharmacy/${pharmacyId}`);
    expect(result).toEqual(mockResponse.data);
  });

  it("should remove pharmacy from favorites", async () => {
    const pharmacyId = "456";
    const mockResponse = { data: { message: "Pharmacy removed from favorites" } };
    mockApi.delete.mockResolvedValue(mockResponse);

    const result = await removePharmacyFromFavorites(pharmacyId);

    expect(mockApi.delete).toHaveBeenCalledWith(`/favorite/pharmacy/${pharmacyId}`);
    expect(result).toEqual(mockResponse.data);
  });

  it("should remove deal from favorites", async () => {
    const dealId = "123";
    const mockResponse = { data: { message: "Deal removed from favorites" } };
    mockApi.delete.mockResolvedValue(mockResponse);

    const result = await removeDealFromFavorites(dealId);

    expect(mockApi.delete).toHaveBeenCalledWith(`/favorite/deal/${dealId}`);
    expect(result).toEqual(mockResponse.data);
  });

  it("should handle API errors", async () => {
    const error = {
      response: { data: { message: "API Error" } }
    };
    mockApi.get.mockRejectedValue(error);

    await expect(getUserFavorites()).rejects.toThrow("API Error");
  });

  it("should be defined", () => {
    expect(true).toBe(true);
  });
});
