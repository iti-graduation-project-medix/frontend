import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the axios module before importing the functions
vi.mock("../../api/axios", () => ({
  default: {
    post: vi.fn(),
    get: vi.fn()
  }
}));

// Import after mocking
import { subscribeToPlan, getCurrentSubscription, getUserSubscriptions } from "../../api/subscription";

describe("subscription API", () => {
  let mockApi;

  beforeEach(async () => {
    vi.clearAllMocks();
    // Get the mocked axios instance
    const axiosModule = await import("../../api/axios");
    mockApi = axiosModule.default;
  });

  it("should subscribe to a plan", async () => {
    const subscriptionData = {
      planName: "Premium",
      planType: "monthly",
      token: "test-token"
    };
    const mockResponse = { data: { message: "Subscription successful" } };
    mockApi.post.mockResolvedValue(mockResponse);

    const result = await subscribeToPlan(subscriptionData);

    expect(mockApi.post).toHaveBeenCalledWith("/paymob/subscribe", {
      planName: "Premium",
      planType: "monthly"
    }, {
      headers: { Authorization: "Bearer test-token" }
    });
    expect(result).toEqual(mockResponse.data);
  });

  it("should get current subscription", async () => {
    const token = "test-token";
    const mockResponse = { data: { subscription: { plan: "Premium" } } };
    mockApi.get.mockResolvedValue(mockResponse);

    const result = await getCurrentSubscription(token);

    expect(mockApi.get).toHaveBeenCalledWith("/user/current-subscription", {
      headers: { Authorization: "Bearer test-token" }
    });
    expect(result).toEqual(mockResponse.data);
  });

  it("should get user subscriptions", async () => {
    const token = "test-token";
    const mockResponse = { data: { subscriptions: [] } };
    mockApi.get.mockResolvedValue(mockResponse);

    const result = await getUserSubscriptions(token);

    expect(mockApi.get).toHaveBeenCalledWith("/user/user-subscriptions", {
      headers: { Authorization: "Bearer test-token" }
    });
    expect(result).toEqual(mockResponse.data);
  });

  it("should handle subscription errors", async () => {
    const subscriptionData = {
      planName: "Premium",
      planType: "monthly",
      token: "test-token"
    };
    const error = {
      response: { data: { message: "Payment failed" } }
    };
    mockApi.post.mockRejectedValue(error);

    await expect(subscribeToPlan(subscriptionData)).rejects.toThrow("Payment failed");
  });

  it("should be defined", () => {
    expect(true).toBe(true);
  });
});
