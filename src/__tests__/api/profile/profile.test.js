import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the axios module before importing the functions
vi.mock("../../../api/axios", () => ({
  default: {
    get: vi.fn(),
    patch: vi.fn()
  }
}));

// Import after mocking
import { getPharmacistDetails, getUserDetailsById, updateUserProfileImage } from "../../../api/profile/profile";

describe("profile API", () => {
  let mockApi;

  beforeEach(async () => {
    vi.clearAllMocks();
    // Get the mocked axios instance
    const axiosModule = await import("../../../api/axios");
    mockApi = axiosModule.default;
  });

  it("should get pharmacist details", async () => {
    const id = "123";
    const token = "test-token";
    const mockResponse = { data: { pharmacist: { id, name: "John" } } };
    mockApi.get.mockResolvedValue(mockResponse);

    const result = await getPharmacistDetails(id, token);

    expect(mockApi.get).toHaveBeenCalledWith(`/auth/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    expect(result).toEqual(mockResponse.data);
  });

  it("should get user details by ID", async () => {
    const id = "123";
    const token = "test-token";
    const mockResponse = { data: { user: { id, name: "John" } } };
    mockApi.get.mockResolvedValue(mockResponse);

    const result = await getUserDetailsById(id, token);

    expect(mockApi.get).toHaveBeenCalledWith(`/user/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    expect(result).toEqual(mockResponse.data);
  });

  it("should update user profile image", async () => {
    const file = new File(["test"], "test.jpg", { type: "image/jpeg" });
    const token = "test-token";
    const mockResponse = { data: { message: "Image updated successfully" } };
    mockApi.patch.mockResolvedValue(mockResponse);

    const result = await updateUserProfileImage(file, token);

    expect(mockApi.patch).toHaveBeenCalledWith("/user/update-image", expect.any(FormData), {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`
      }
    });
    expect(result).toEqual(mockResponse.data);
  });

  it("should handle pharmacist details error", async () => {
    const id = "123";
    const token = "test-token";
    const error = {
      response: { data: { message: "Pharmacist not found" } }
    };
    mockApi.get.mockRejectedValue(error);

    await expect(getPharmacistDetails(id, token)).rejects.toThrow("Pharmacist not found");
  });

  it("should handle user details error", async () => {
    const id = "123";
    const token = "test-token";
    const error = {
      response: { data: { message: "User not found" } }
    };
    mockApi.get.mockRejectedValue(error);

    await expect(getUserDetailsById(id, token)).rejects.toThrow("User not found");
  });

  it("should be defined", () => {
    expect(true).toBe(true);
  });
});
