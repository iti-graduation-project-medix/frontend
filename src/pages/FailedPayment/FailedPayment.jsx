import React, { useState, useEffect } from "react";
import {
  XCircle,
  ArrowRight,
  AlertTriangle,
  CreditCard,
  PoundSterling,
  Clock,
  Hash,
  Shield,
  Home,
  RefreshCw,
  Wallet,
  Crown,
  Zap,
  CalendarDays,
  X,
  CircleX,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate, useLocation } from "react-router-dom";
import { CardIcon } from "@/components/ui/card-icons";

export default function FailedPayment() {
  const navigate = useNavigate();
  const location = useLocation();
  const [paymentData, setPaymentData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper: Parse query params into object, including nested fields
  function parsePaymentParams(search) {
    const params = new URLSearchParams(search);
    const obj = {};
    for (const [key, value] of params.entries()) {
      // Handle nested fields like data.message and source_data.sub_type
      if (key.includes(".")) {
        const [parent, child] = key.split(".");
        if (!obj[parent]) obj[parent] = {};
        obj[parent][child] = value;
      } else {
        obj[key] = value;
      }
    }
    if (obj.amount_cents) obj.amount_cents = obj.amount_cents;
    if (obj.success) obj.success = obj.success === "true";
    return obj;
  }

  useEffect(() => {
    // Build paymentData from query params
    const data = parsePaymentParams(location.search);
    setPaymentData(data);
    setLoading(false);
  }, [location.search]);

  // Helper functions
  const formatAmount = (amountCents, currency = "EGP") => {
    const amount = parseInt(amountCents) / 100;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getPlanName = (merchantOrderId) => {
    if (merchantOrderId?.includes("premium")) return "Premium";
    if (merchantOrderId?.includes("regular")) return "Regular";
    return "Standard";
  };

  const getLastFourDigits = (pan) => {
    return pan?.slice(-4) || "****";
  };

  const getPaymentMethodIcon = (paymentType) => {
    const type = paymentType?.toLowerCase();

    if (type === "wallet") {
      return <Wallet className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />;
    } else if (type === "visa") {
      return <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />;
    } else if (type === "mastercard") {
      return <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />;
    } else {
      return <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />;
    }
  };

  const getPlanTypeIcon = (planName) => {
    const plan = planName?.toLowerCase();

    if (plan === "premium") {
      return <Crown className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />;
    } else if (plan === "regular") {
      return <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />;
    } else {
      return <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />;
    }
  };

  const getPlanPeriod = (amount) => {
    // This is a placeholder logic - you can adjust based on your actual data structure
    // You might want to pass this as a separate parameter or extract from payment data
    const numAmount = parseFloat(amount);

    // Example logic: if amount is higher, likely yearly; if lower, likely monthly
    // You should replace this with actual logic based on your payment data
    if (numAmount >= 100) {
      return "Yearly";
    } else {
      return "Monthly";
    }
  };

  const handleGoHome = () => {
    navigate("/");
  };

  const handleRetryPayment = () => {
    // Navigate back to payment page or retry logic
    navigate("/subscription");
  };

  if (loading || !paymentData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-background flex items-center justify-center p-4">
        <div className="text-center bg-white dark:bg-card rounded-xl shadow-lg p-8 border border-gray-100 dark:border-border">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-red-600 border-t-transparent mx-auto mb-6"></div>
          <p className="text-gray-600 dark:text-gray-200 text-lg font-medium">
            Loading payment details...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background py-4 sm:py-6 lg:py-8 text-gray-900 dark:text-foreground">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Failed Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="relative">
              <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
                <XCircle className="w-7 h-7 text-white" />
              </div>
              <div className="absolute -inset-1 bg-red-400 rounded-full opacity-20 animate-ping"></div>
            </div>
            <h1 className="text-3xl font-bold text-red-600 dark:text-red-400">
              Payment Failed!
            </h1>
          </div>
        </div>

        <div className="space-y-4 sm:space-y-6">
          {/* Payment Details */}
          <Card className="shadow-sm border border-gray-200 dark:border-red-900 bg-white dark:bg-card">
            <CardHeader className="bg-red-500 dark:bg-red-700 p-4 sm:p-6">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-white/20">
                    <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-white dark:text-white">
                      Payment Details
                    </h2>
                    <p className="text-xs sm:text-sm text-red-100 dark:text-red-200">
                      Transaction information
                    </p>
                  </div>
                </div>
                <div className="inline-flex items-center gap-2 text-white px-3 py-1 border border-white rounded-full">
                  <AlertTriangle className="w-3 h-3" />
                  <span className="font-semibold text-xs">
                    Payment Declined
                  </span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 -mt-5 sm:p-6 bg-gray-50 dark:bg-background">
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center justify-between p-2 sm:p-3 rounded-lg border border-gray-200 dark:border-border bg-gray-50 dark:bg-card">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Hash className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-300" />
                    <span className="font-medium text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                      Transaction ID
                    </span>
                  </div>
                  <span className="font-mono text-gray-900 dark:text-gray-200 text-xs sm:text-sm break-all">
                    {paymentData?.id}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2 sm:p-3 rounded-lg border border-gray-200 dark:border-border bg-gray-50 dark:bg-card">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <PoundSterling className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                    <span className="font-medium text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                      Amount
                    </span>
                  </div>
                  <span className="font-bold text-red-600 dark:text-red-300 text-sm sm:text-base">
                    {formatAmount(
                      paymentData?.amount_cents,
                      paymentData?.currency
                    )}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2 sm:p-3 rounded-lg border border-gray-200 dark:border-border bg-gray-50 dark:bg-card">
                  <div className="flex items-center gap-2 sm:gap-3">
                    {getPlanTypeIcon(
                      getPlanName(paymentData?.merchant_order_id)
                    )}
                    <span className="font-medium text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                      Plan Type
                    </span>
                  </div>
                  <Badge className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-200 border-purple-200 dark:border-purple-800 font-medium text-xs">
                    {getPlanName(paymentData?.merchant_order_id)} Plan
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-2 sm:p-3 rounded-lg border border-gray-200 dark:border-border bg-gray-50 dark:bg-card">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <CalendarDays className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
                    <span className="font-medium text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                      Plan Period
                    </span>
                  </div>
                  <Badge className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-200 border-indigo-200 dark:border-indigo-800 font-medium text-xs">
                    {getPlanPeriod(paymentData?.amount_cents / 100)}
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-2 sm:p-3 rounded-lg border border-gray-200 dark:border-border bg-gray-50 dark:bg-card">
                  <div className="flex items-center gap-2 sm:gap-3">
                    {getPaymentMethodIcon(paymentData?.source_data?.sub_type)}
                    <span className="font-medium text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                      Payment Method
                    </span>
                  </div>
                  <span className="font-medium text-gray-900 dark:text-gray-200 text-sm sm:text-base">
                    {paymentData?.source_data?.sub_type
                      .slice(0, 1)
                      .toUpperCase() +
                      paymentData?.source_data?.sub_type.slice(1)}{" "}
                    / ••••{getLastFourDigits(paymentData?.source_data?.pan)}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2 sm:p-3 rounded-lg border border-gray-200 dark:border-border bg-gray-50 dark:bg-card">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                    <span className="font-medium text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                      Payment Date
                    </span>
                  </div>
                  <span className="font-medium text-gray-900 dark:text-gray-200 text-sm sm:text-base">
                    {formatDate(paymentData?.created_at)}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2 sm:p-3 rounded-lg border border-gray-200 dark:border-border bg-gray-50 dark:bg-card">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <CircleX className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                    <span className="font-medium text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                      Status
                    </span>
                  </div>
                  <Badge className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-200 border-red-200 dark:border-red-800 font-medium text-xs">
                    Declined
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Button
              onClick={handleRetryPayment}
              className="bg-red-500 dark:bg-red-700 hover:bg-red-600 dark:hover:bg-red-800 text-white font-semibold px-6 py-3 rounded-lg shadow-sm transition-all text-sm flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
              Try Again
            </Button>

            <Button
              onClick={handleGoHome}
              variant="outline"
              className="border border-gray-300 dark:border-border text-gray-700 dark:text-foreground hover:bg-gray-50 dark:hover:bg-muted/10 font-semibold px-6 py-3 rounded-lg shadow-sm transition-all text-sm flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4 sm:w-5 sm:h-5" />
              Back to Home
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-gray-500 dark:text-gray-300">
            No charges were made to your account
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
            If you continue to experience issues, please contact our support
            team at{" "}
            <a
              href="mailto:support@dawaback.com"
              className="text-red-600 dark:text-red-400 hover:underline"
            >
              support@dawaback.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
