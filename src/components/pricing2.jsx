"use client";
import { CircleCheck } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/store/useAuth";
import { useSubscribe } from "@/store/useSubscribe";
import { LoadingPage } from "./ui/loading";

const Pricing2 = ({
  heading = "Pricing",
  description = "Check out our affordable pricing plans",

  plans = [
    {
      id: "Regular",
      name: "Regular",
      description: "Limited features",
      monthlyPrice: "EGP50",
      yearlyPrice: "EGP200",
      features: [
        {
          text: "Add up to 10 deals",
          available: true,
          yearlyText: "Add up to 150 deals",
        },
        { text: "P2P trading using real-time chat", available: true },
        { text: "List pharmacies for sale", available: false },
        { text: "Subscribe to drug alert", available: false },
      ],
      button: {
        text: "Purchase",
        url: "https://shadcnblocks.com",
      },
    },
    {
      id: "Premium",
      name: "Premium",
      description: "Full features",
      monthlyPrice: "EGP100",
      yearlyPrice: "EGP400",
      features: [
        { text: "Add unlimited deals", available: true },
        { text: "P2P trading using real-time chat", available: true },
        { text: "List pharmacies for sale", available: true },
        { text: "Subscribe to drug alert", available: true },
      ],
      button: {
        text: "Purchase",
        url: "https://shadcnblocks.com",
      },
    },
  ],
}) => {
  const [isYearly, setIsYearly] = useState(false);
  const { user, token } = useAuth();
  const { subscribe, loading, error, success } = useSubscribe();
  const navigate = useNavigate();
  const [loadingPlan, setLoadingPlan] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null); // 'processing', 'completed', 'failed'

  const planIdMap = {
    Regular: "regular",
    Premium: "premium",
  };

  // Function to handle payment completion redirect
  const handlePaymentRedirect = (isSuccess, queryParams = "") => {
    setPaymentStatus(null);

    // Redirect to appropriate page
    const baseUrl = window.location.origin;
    if (isSuccess) {
      const successUrl = `${baseUrl}/subscription/success${queryParams}`;
      window.location.href = successUrl;
    } else {
      const failedUrl = `${baseUrl}/subscription/failed${queryParams}`;
      window.location.href = failedUrl;
    }
  };

  // Listen for messages from payment provider (if supported)
  useEffect(() => {
    const handleMessage = (event) => {
      // Check if the message is from the payment provider
      if (event.data && event.data.type === "PAYMENT_COMPLETED") {
        // Handle success redirect
        if (event.data.successUrl) {
          window.location.href = event.data.successUrl;
        } else {
          handlePaymentRedirect(true, event.data.queryParams || "");
        }
      } else if (event.data && event.data.type === "PAYMENT_FAILED") {
        // Handle failed payment
        handlePaymentRedirect(false, event.data.queryParams || "");
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [navigate]);

  // Handle URL parameters for payment completion
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get("success");
    const failed = urlParams.get("failed");
    const status = urlParams.get("status");
    const result = urlParams.get("result");

    // Check various possible success/failure indicators
    const isSuccess = success === "true" || status === "success" || result === "success";
    const isFailed =
      failed === "true" || status === "failed" || result === "failed" || status === "error";

    if (isSuccess || isFailed) {
      // Use the redirect function to handle the completion
      handlePaymentRedirect(isSuccess, window.location.search);
    }
  }, []);

  const handleSubscribe = async (planId) => {
    if (!user || !token) {
      toast.error("Please login to subscribe");
      navigate("/auth/login");
      return;
    }
    try {
      setLoadingPlan(planId);
      const res = await subscribe({
        planName: planIdMap[planId],
        planType: isYearly ? "yearly" : "monthly",
        token,
      });
      if (res && res.iframeUrl) {
        // Redirect current window to payment URL
        setPaymentStatus("processing");
        toast.success("Redirecting to payment gateway...");
        window.location.href = res.iframeUrl;
      } else {
        toast.success("Failed to subscribe");
      }
    } catch (err) {
      console.error("Subscription error:", err);
      toast.error("Failed to subscribe", {
        description: err.response?.data?.message || "Please try again later",
      });
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <section className="py-8">
      <div className="container">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 text-center">
          <h2 className="text-4xl font-semibold dark:text-white text-primary lg:text-6xl">
            {heading}
          </h2>
          <p className="text-muted-foreground lg:text-xl -mt-2">{description}</p>
          <div className="flex items-center gap-3 text-lg">
            Monthly
            <Switch checked={isYearly} onCheckedChange={() => setIsYearly(!isYearly)} />
            Yearly
          </div>

          {/* Payment Status Indicator */}
          {paymentStatus === "processing" && (
            <div className="bg-gray-50 border border-primary/50 dark:border-primary/50 dark:bg-primary/20 rounded-lg p-4 max-w-md">
              <LoadingPage size={40} message="" fullscreen={false} />
              <div className="flex items-center gap-3">
                <div>
                  <p className="font-medium text-primary dark:text-white">Redirecting to Payment</p>
                  <p className="text-sm text-primary/80 dark:text-gray-400">
                    You will be redirected to complete your payment
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col items-stretch gap-6 md:flex-row">
            {plans.map((plan, index) => (
              <Card
                key={plan.id}
                className={`flex w-80 flex-col justify-between text-left px-4 py-8 relative overflow-hidden ${
                  plan.id === "Premium"
                    ? "ring-2 ring-primary shadow-xl scale-105"
                    : "hover:shadow-lg transition-all duration-300"
                }`}
              >
                {plan.id === "Premium" && (
                  <div className="absolute top-0 right-0 bg-primary text-white px-3 py-1 text-xs font-semibold rounded-bl-lg">
                    Most Popular
                  </div>
                )}
                <CardHeader>
                  <CardTitle>
                    <p>{plan.name}</p>
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                  <div className="flex items-end">
                    <span className="text-4xl font-semibold">
                      {isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                    </span>
                    <span className="text-2xl font-semibold text-muted-foreground">
                      {isYearly ? "/yr" : "/mo"}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <Separator className="mb-6" />
                  <ul className="space-y-4">
                    {plan.features.map((feature, index) => (
                      <li key={index} className={`flex items-center gap-2 text-sm`}>
                        {feature.available ? (
                          <CircleCheck className="size-4 text-green-600 dark:text-green-400" />
                        ) : (
                          <svg
                            className="size-4 text-red-500 dark:text-red-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <circle
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="2"
                              fill="none"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M15 9l-6 6m0-6l6 6"
                            />
                          </svg>
                        )}
                        <span
                          className={
                            feature.available
                              ? "text-gray-900 dark:text-white font-semibold"
                              : "line-through text-gray-500 dark:text-red-400"
                          }
                        >
                          {isYearly && feature.yearlyText ? feature.yearlyText : feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="mt-auto">
                  <Button
                    className="w-full text-white"
                    disabled={loadingPlan === plan.id}
                    onClick={() => handleSubscribe(plan.id)}
                  >
                    {loadingPlan === plan.id ? "Loading..." : "Purchase"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
        </div>
      </div>
    </section>
  );
};

export { Pricing2 };
