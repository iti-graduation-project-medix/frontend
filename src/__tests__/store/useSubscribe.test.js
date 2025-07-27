import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useSubscribe } from "../../store/useSubscribe";
import * as subscriptionApi from "../../api/subscription";

vi.mock("../../api/subscription", () => ({
  subscribeToPlan: vi.fn(),
  getCurrentSubscription: vi.fn(),
  getUserSubscriptions: vi.fn()
}));

describe("useSubscribe", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.localStorage = {
      getItem: vi.fn().mockReturnValue(JSON.stringify("token123")),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn()
    };
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should handle fetch user subscriptions error (fail)", async () => {
    subscriptionApi.getUserSubscriptions.mockRejectedValue(new Error("fail"));

    const { result } = renderHook(() => useSubscribe());

    await act(async () => {
      try {
        await result.current.fetchUserSubscriptions();
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe("fail");
      }
    });

    expect(result.current.userSubscriptions).toEqual([]);
    expect(result.current.error).toBe("fail");
  });
});
