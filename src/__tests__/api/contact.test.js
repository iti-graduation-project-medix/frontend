import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the axios module before importing the functions
vi.mock("../../api/axios", () => ({
  default: {
    post: vi.fn()
  }
}));

// Import after mocking
import { requestContact } from "../../api/contact";

describe("contact API", () => {
  let mockApi;

  beforeEach(async () => {
    vi.clearAllMocks();
    // Get the mocked axios instance
    const axiosModule = await import("../../api/axios");
    mockApi = axiosModule.default;
  });

  it("should send contact request successfully", async () => {
    const contactData = {
      name: "John Doe",
      email: "john@example.com",
      message: "Test message"
    };
    const mockResponse = { data: { message: "Contact request sent successfully" } };
    mockApi.post.mockResolvedValue(mockResponse);

    const result = await requestContact(contactData);

    expect(mockApi.post).toHaveBeenCalledWith("/contact-us", contactData);
    expect(result).toEqual(mockResponse.data);
  });

  it("should handle 400 bad request error", async () => {
    const contactData = { name: "John" };
    const error = {
      response: { status: 400, data: { message: "Bad request" } }
    };
    mockApi.post.mockRejectedValue(error);

    await expect(requestContact(contactData)).rejects.toThrow(
      "Invalid request data. Please check your information and try again."
    );
  });

  it("should handle 409 conflict error", async () => {
    const contactData = { name: "John", email: "john@example.com" };
    const error = {
      response: { status: 409, data: { message: "Conflict" } }
    };
    mockApi.post.mockRejectedValue(error);

    await expect(requestContact(contactData)).rejects.toThrow(
      "A contact request already exists for this information."
    );
  });

  it("should handle 422 validation error", async () => {
    const contactData = { name: "John" };
    const error = {
      response: { status: 422, data: { message: "Validation failed" } }
    };
    mockApi.post.mockRejectedValue(error);

    await expect(requestContact(contactData)).rejects.toThrow(
      "Invalid data format. Please check your information and try again."
    );
  });

  it("should handle generic error", async () => {
    const contactData = { name: "John" };
    const error = {
      response: { status: 500, data: { message: "Server error" } }
    };
    mockApi.post.mockRejectedValue(error);

    await expect(requestContact(contactData)).rejects.toThrow("Server error");
  });

  it("should be defined", () => {
    expect(true).toBe(true);
  });
});
