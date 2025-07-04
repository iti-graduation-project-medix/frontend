import React from "react";
import { XCircle, RefreshCw, ArrowRight, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function FailedPayment() {
  const navigate = useNavigate();

  const handleRetry = () => {
    navigate("/subscription");
  };

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen  from-red-50 to-orange-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Failed Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-4">
            <XCircle className="w-12 h-12 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Payment Failed!
          </h1>
          <p className="text-gray-600">
            We couldn't process your payment. Please try again.
          </p>
        </div>

        {/* Error Details Card */}
        <Card className="mb-6 shadow-lg py-4">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl font-semibold text-gray-800">
              Payment Error Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Error Type */}
            <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <div>
                <p className="text-sm text-gray-500">Error Type</p>
                <p className="font-medium text-red-900">
                  Payment Processing Error
                </p>
              </div>
            </div>

            {/* Error Code */}
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-5 h-5 bg-gray-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">E</span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Error Code</p>
                <p className="font-medium text-gray-900 font-mono">
                  PAY-{Math.random().toString(36).substr(2, 6).toUpperCase()}
                </p>
              </div>
            </div>

            {/* Status */}
            <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
              <div className="w-5 h-5 bg-orange-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">S</span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className="font-medium text-orange-900">Payment Declined</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={handleGoHome}
            variant="outline"
            className="w-full bg-red-600 hover:bg-red-700 text-white hover:text-white"
          >
            <ArrowRight className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            No charges were made to your account
          </p>
          <p className="text-xs text-gray-400 mt-2">
            If you continue to experience issues, please contact our support
            team
          </p>
        </div>
      </div>
    </div>
  );
}
