import React, { useState, useEffect } from "react";
import {
  CheckCircle,
  Calendar,
  User,
  CreditCard,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function SuccessPayment() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [subscriptionData, setSubscriptionData] = useState({
    orderId: "ORD-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
    planName: "Regular", // or Premium
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(
      "en-US",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
      }
    ),
  });

  useEffect(() => {
    // Get user data from localStorage
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      setUserData(user);
    } catch (error) {
      console.error("Error parsing user data:", error);
    }
  }, []);

  const handleGoHome = () => {
    navigate("/");
  };

  const handleGoToProfile = () => {
    navigate("/profile");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Payment Successful!
          </h1>
          <p className="text-gray-600">Thank you for subscribing to Dawaback</p>
        </div>

        {/* Subscription Details Card */}
        <Card className="mb-6 shadow-lg py-4">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl font-semibold text-gray-800">
              Subscription Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* User Name */}
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <User className="w-5 h-5 text-gray-600" />
              <div>
                <p className="text-sm text-gray-500">User Name</p>
                <p className="font-medium text-gray-900">
                  {userData?.name || userData?.username || "Omar Abaza"}
                </p>
              </div>
            </div>

            {/* Order ID */}
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <CreditCard className="w-5 h-5 text-gray-600" />
              <div>
                <p className="text-sm text-gray-500">Order ID</p>
                <p className="font-medium text-gray-900 font-mono">
                  {subscriptionData.orderId}
                </p>
              </div>
            </div>

            {/* Plan Name */}
            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
              <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">
                  {subscriptionData.planName === "Premium" ? "P" : "R"}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Plan Type</p>
                <p className="font-medium text-blue-900">
                  {subscriptionData.planName === "Premium"
                    ? "Premium Plan"
                    : "Regular Plan"}
                </p>
              </div>
            </div>

            {/* Subscription End Date */}
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Calendar className="w-5 h-5 text-gray-600" />
              <div>
                <p className="text-sm text-gray-500">Subscription End Date</p>
                <p className="font-medium text-gray-900">
                  {subscriptionData.endDate}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={handleGoToProfile}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            <User className="w-4 h-4 mr-2" />
            Go to Profile
          </Button>

          <Button onClick={handleGoHome} variant="outline" className="w-full">
            <ArrowRight className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Subscription details have been sent to your email
          </p>
          <p className="text-xs text-gray-400 mt-2">
            If you have any questions, please don't hesitate to contact us
          </p>
        </div>
      </div>
    </div>
  );
}
