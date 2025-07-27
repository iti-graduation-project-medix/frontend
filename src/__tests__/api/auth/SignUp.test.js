import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the axios module before importing the functions
vi.mock("../../../api/axios", () => ({
  default: {
    post: vi.fn()
  }
}));

// Import after mocking
import { signUp } from "../../../api/auth/SignUp";

describe("SignUp API", () => {
  let mockApi;

  beforeEach(async () => {
    vi.clearAllMocks();
    // Get the mocked axios instance
    const axiosModule = await import("../../../api/axios");
    mockApi = axiosModule.default;
  });

  it("should sign up successfully", async () => {
    const formData = new FormData();
    formData.append("name", "John Doe");
    formData.append("email", "john@example.com");

    const mockResponse = { data: { message: "User created successfully" } };
    mockApi.post.mockResolvedValue(mockResponse);

    const result = await signUp(formData);

    expect(mockApi.post).toHaveBeenCalledWith("/auth/signup", formData, {
      headers: { "Content-Type": undefined }
    });
    expect(result).toEqual(mockResponse.data);
  });

  it("should handle 400 front ID card error", async () => {
    const formData = new FormData();
    const error = {
      response: {
        status: 400,
        data: { message: "Front ID card image is required" }
      }
    };
    mockApi.post.mockRejectedValue(error);

    await expect(signUp(formData)).rejects.toThrow(
      "Front ID card image is required. Please upload the front side of your national ID."
    );
  });

  it("should handle 400 back ID card error", async () => {
    const formData = new FormData();
    const error = {
      response: {
        status: 400,
        data: { message: "Back ID card image is required" }
      }
    };
    mockApi.post.mockRejectedValue(error);

    await expect(signUp(formData)).rejects.toThrow(
      "Back ID card image is required. Please upload the back side of your national ID."
    );
  });

  it("should handle 409 email already registered", async () => {
    const formData = new FormData();
    const error = {
      response: {
        status: 409,
        data: { message: "Email is already registered" }
      }
    };
    mockApi.post.mockRejectedValue(error);

    await expect(signUp(formData)).rejects.toThrow(
      "Email is already registered. Please use a different email address."
    );
  });

  it("should handle 409 phone already registered", async () => {
    const formData = new FormData();
    const error = {
      response: {
        status: 409,
        data: { message: "Phone number is already registered" }
      }
    };
    mockApi.post.mockRejectedValue(error);

    await expect(signUp(formData)).rejects.toThrow(
      "Phone number is already registered. Please use a different phone number."
    );
  });

  it("should handle 422 validation error", async () => {
    const formData = new FormData();
    const error = {
      response: { status: 422, data: { message: "Validation failed" } }
    };
    mockApi.post.mockRejectedValue(error);

    await expect(signUp(formData)).rejects.toThrow(
      "Invalid data format. Please check your information and try again."
    );
  });

  it("should be defined", () => {
    expect(true).toBe(true);
  });
});
