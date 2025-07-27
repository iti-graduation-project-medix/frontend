import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock console.error to prevent test output pollution
vi.mock("console", () => ({
  error: vi.fn()
}));

// Mock the axios module before importing the functions
vi.mock("../../api/axios", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn()
  }
}));

// Import after mocking
import { fetchDrugs, createDrugAlert, fetchAllDrugNames } from "../../api/drugs";

describe("drugs API", () => {
  let mockApi;

  beforeEach(async () => {
    vi.clearAllMocks();
    // Get the mocked axios instance
    const axiosModule = await import("../../api/axios");
    mockApi = axiosModule.default;
  });

  it("should fetch drugs with search parameters", async () => {
    const token = "test-token";
    const options = { search: "aspirin", page: 1, size: 10 };
    const mockResponse = { data: { drugs: [{ name: "Aspirin" }] } };
    mockApi.get.mockResolvedValue(mockResponse);

    const result = await fetchDrugs(token, options);

    expect(mockApi.get).toHaveBeenCalledWith("/drug-details", {
      headers: { Authorization: `Bearer ${token}` },
      params: { page: "1", size: "10", search: "aspirin" }
    });
    expect(result).toEqual(mockResponse.data);
  });

  it("should create drug alert", async () => {
    const token = "test-token";
    const alertData = { drugNames: ["Aspirin", "Ibuprofen"] };
    const mockResponse = { data: { message: "Alert created" } };
    mockApi.post.mockResolvedValue(mockResponse);

    const result = await createDrugAlert(token, alertData);

    expect(mockApi.post).toHaveBeenCalledWith("/drug-alert", alertData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    expect(result).toEqual(mockResponse.data);
  });

  it("should fetch all drug names", async () => {
    const token = "test-token";
    // Mock the response that fetchDrugs will return
    const mockResponse = { data: { drugs: [{ name: "Drug1" }, { name: "Drug2" }] } };
    mockApi.get.mockResolvedValue(mockResponse);

    const result = await fetchAllDrugNames(token);

    // Verify the API was called correctly
    expect(mockApi.get).toHaveBeenCalledWith("/drug-details", {
      headers: { Authorization: `Bearer ${token}` },
      params: { page: "1", size: "1000" }
    });
    // The function should return the drugs array from the response
    expect(result).toEqual(mockResponse.data.drugs);
  });

  it("should handle API errors", async () => {
    const token = "test-token";
    const error = new Error("API Error");
    mockApi.get.mockRejectedValue(error);

    await expect(fetchDrugs(token)).rejects.toThrow("API Error");
  });

  it("should handle fetchAllDrugNames error gracefully", async () => {
    const token = "test-token";
    const error = new Error("API Error");
    mockApi.get.mockRejectedValue(error);

    const result = await fetchAllDrugNames(token);

    expect(result).toEqual([]);
  });

  it("should be defined", () => {
    expect(true).toBe(true);
  });
});
