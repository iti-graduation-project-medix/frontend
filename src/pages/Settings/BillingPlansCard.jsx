import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  MdPayment,
  MdCardMembership,
  MdCreditCard,
  MdReceipt,
  MdUpgrade,
  MdCheckCircle,
  MdWarning,
  MdInfo,
  MdDownload,
  MdTrendingUp,
  MdHomeWork,
  MdNotificationsActive,
} from "react-icons/md";
import { FaCrown, FaGem, FaCheck, FaTimes } from "react-icons/fa";
import { Zap } from "lucide-react";
import { useSubscribe } from "@/store/useSubscribe";
import * as XLSX from "xlsx";
import useChat from "@/store/useChat";
import { LoadingPage } from "@/components/ui/loading";

export default function BillingPlansCard({ pharmacistDetails }) {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const {
    currentSubscription,
    subscriptionLoading,
    error,
    fetchCurrentSubscription,
    userSubscriptions,
    subscriptionsLoading,
    fetchUserSubscriptions,
  } = useSubscribe();

  const { chats } = useChat();
  const openedChatsCount = chats.filter((chat) => !chat.isClosed).length;

  // Fetch current subscription and user subscriptions on component mount
  useEffect(() => {
    fetchCurrentSubscription();
    fetchUserSubscriptions();
  }, [fetchCurrentSubscription, fetchUserSubscriptions]);

  // Helper function to get plan details
  const getPlanDetails = (planName) => {
    const plans = {
      regular: {
        name: "Regular Plan",
        price: "EGP50",
        period: "month",
        features: [
          "Add up to 10 deals",
          "Can't list pharmacies for sale",
          "Can't subscribe to drug alert",
        ],
        icon: Zap,
        color: "text-blue-600",
        bgColor: "bg-blue-100",
      },
      premium: {
        name: "Premium Plan",
        price: "EGP100",
        period: "month",
        features: [
          "Add unlimited deals",
          "List pharmacies for sale",
          "Subscribe to drug alert",
        ],
        icon: FaCrown,
        color: "text-amber-400",
        bgColor: "bg-amber-100",
      },
    };
    return plans[planName] || plans.regular;
  };

  // Get current plan details
  const currentPlan = currentSubscription
    ? getPlanDetails(currentSubscription.planName)
    : getPlanDetails("regular");

  // Helper function to format subscription data for billing history
  const formatSubscriptionForHistory = (subscription) => {
    const planDetails = getPlanDetails(subscription.planName);
    const amount =
      subscription.planName === "premium" ? "EGP100.00" : "EGP50.00";
    const startDate = new Date(subscription.startDate);
    const endDate = new Date(subscription.endDate);

    return {
      id: subscription.id,
      date: startDate.toISOString().split("T")[0],
      amount: amount,
      status: "Paid", // Always show Paid
      description: `${planDetails.name} - ${
        subscription.plan === "monthly" ? "Monthly" : "Yearly"
      }`,
      invoice: `SUB-${subscription.id.slice(-8).toUpperCase()}`,
      startDate: startDate,
      endDate: endDate,
      planName: subscription.planName,
      subType: subscription.subType,
      pan: subscription.pan,
    };
  };

  const getStatusBadge = (status) => {
    const variants = {
      paid: "success",
      pending: "warning",
      failed: "destructive",
      active: "success",
    };
    return (
      <Badge variant={variants[status.toLowerCase()] || "secondary"}>
        {status}
      </Badge>
    );
  };

  const handleUpgrade = (plan) => {
    setSelectedPlan(plan);
    setShowUpgradeModal(true);
    // Navigate to subscription page
    navigate("/subscription");
  };

  // Excel download handler
  const handleDownloadBillingHistory = () => {
    if (!userSubscriptions || userSubscriptions.length === 0) return;
    const data = userSubscriptions.map((subscription) => {
      const invoice = formatSubscriptionForHistory(subscription);
      return {
        Plan: invoice.description,
        "Start Date": invoice.startDate.toLocaleDateString(),
        "End Date": invoice.endDate.toLocaleDateString(),
        Amount: invoice.amount,
        Status: invoice.status,
        "Payment Type": invoice.subType === "wallet" ? "Wallet" : "Card",
        Number: invoice.pan ? `****${invoice.pan}` : "",
        Invoice: invoice.invoice,
      };
    });
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "BillingHistory");
    XLSX.writeFile(wb, "BillingHistory.xlsx");
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto text-gray-900 dark:text-foreground">
      {/* Current Plan Section */}
      <Card className="py-10 mb-8 rounded-2xl border-0 bg-gradient-to-br from-white to-gray-50/50 dark:from-background dark:to-background shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
        <CardHeader>
          <CardTitle className="flex items-center gap-4">
            <span className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 shadow-lg w-14 h-14">
              <MdCardMembership size={28} className="text-primary" />
            </span>
            <div>
              <span className="font-bold text-2xl text-gray-900 dark:text-foreground block">
                Current Plan
              </span>
              <span className="text-sm text-gray-500 font-medium dark:text-gray-400">
                Manage your subscription and billing
              </span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="px-8 ">
          {subscriptionLoading ? (
            <LoadingPage message="Loading subscription details..." />
          ) : error ? (
            <div className="p-6 bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-900/10 border border-red-200 dark:border-red-700 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 dark:bg-red-900/40 rounded-full">
                  <MdWarning
                    size={20}
                    className="text-red-600 dark:text-red-300"
                  />
                </div>
                <p className="text-red-700 font-medium dark:text-red-300">
                  Error loading subscription: {error}
                </p>
              </div>
            </div>
          ) : currentSubscription ? (
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-gray-50/30  border-gray-100 shadow-lg dark:from-background dark:to-background border  dark:border-border">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/5 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
              <div className="relative p-8">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                  <div className="flex items-center gap-6">
                    <div
                      className={`p-4 -mt-7 ${currentPlan.bgColor} rounded-2xl shadow-lg`}
                    >
                      <currentPlan.icon
                        size={32}
                        className={currentPlan.color}
                      />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-bold text-2xl text-gray-900 dark:text-foreground">
                        {currentPlan.name}
                      </h3>
                      <p className="text-gray-600 font-medium dark:text-gray-400">
                        {currentSubscription.plan === "monthly"
                          ? "Monthly Plan"
                          : "Yearly Plan"}
                      </p>
                      <div className="flex items-center gap-4">
                        <Badge
                          variant="outline"
                          className={`text-sm font-semibold px-3 py-1 rounded-full ${
                            currentSubscription.status
                              ? "bg-green-50 border-green-300 text-green-700 dark:bg-green-900/20 dark:border-green-700 dark:text-green-300"
                              : "bg-red-50 border-red-300 text-red-700 dark:bg-red-900/20 dark:border-red-700 dark:text-red-300"
                          }`}
                        >
                          {currentSubscription.status ? "Paid" : "Unpaid"}
                        </Badge>
                        <span className="text-sm text-gray-500 font-medium dark:text-gray-400">
                          Expires:{" "}
                          {new Date(
                            currentSubscription.endDate
                          ).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200 dark:border-yellow-700 rounded-2xl">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-yellow-100 dark:bg-yellow-900/40 rounded-full">
                  <MdWarning
                    size={24}
                    className="text-yellow-600 dark:text-yellow-300"
                  />
                </div>
                <div>
                  <p className="text-yellow-800 font-semibold text-lg dark:text-yellow-200">
                    No active subscription found
                  </p>
                  <p className="text-yellow-700 text-sm mt-1 dark:text-yellow-300">
                    Please subscribe to a plan to continue using our services
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Usage Statistics */}
      <Card className="pt-10 mb-8 rounded-2xl border-0 bg-gradient-to-br from-white to-gray-50/50 dark:from-background dark:to-background shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-primary/80 to-primary/60"></div>
        <CardHeader>
          <CardTitle className="flex items-center gap-4">
            <span className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 shadow-lg w-14 h-14">
              <MdInfo size={28} className="text-primary" />
            </span>
            <div>
              <span className="font-bold text-2xl text-gray-900 dark:text-foreground block">
                Usage Features
              </span>
              <span className="text-sm text-gray-500 font-medium dark:text-gray-400">
                Track your plan usage and activity
              </span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="px-8 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Available Features */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-900/20 dark:to-purple-900/10 border border-purple-200 dark:border-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-200/30 to-transparent rounded-full -translate-y-12 translate-x-12"></div>
              <div className="relative p-6 text-center">
                <div className="p-4 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/40 dark:to-purple-900/20 rounded-2xl w-16 h-16 mx-auto mb-4 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <FaGem
                    className="text-purple-600 dark:text-purple-300"
                    size={28}
                  />
                </div>
                <h4 className="font-bold text-lg text-purple-900 dark:text-purple-200 mb-2">
                  Deals
                </h4>
                <p className="text-3xl font-bold text-purple-600 dark:text-purple-300 mb-3">
                  {currentSubscription
                    ? currentSubscription.planName === "premium"
                      ? "∞ / ∞"
                      : `${10 - parseInt(currentSubscription.dealsNumber)} / 10`
                    : "0 / 0"}
                </p>
                <div className="w-full bg-purple-200 dark:bg-purple-900/40 rounded-full h-3 mb-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-purple-600 dark:from-purple-700 dark:to-purple-500 h-3 rounded-full transition-all duration-1000 ease-out"
                    style={{
                      width:
                        currentSubscription &&
                        currentSubscription.planName === "regular"
                          ? `${
                              ((10 -
                                parseInt(currentSubscription.dealsNumber)) /
                                10) *
                              100
                            }%`
                          : currentSubscription &&
                            currentSubscription.planName === "premium"
                          ? "100%"
                          : "0%",
                    }}
                  ></div>
                </div>
                <p className="text-sm text-purple-700 font-medium dark:text-purple-300">
                  {currentSubscription
                    ? currentSubscription.planName === "premium"
                      ? "Unlimited deals (Premium Plan)"
                      : `${Math.round(
                          ((10 - parseInt(currentSubscription.dealsNumber)) /
                            10) *
                            100
                        )}% used (Regular Plan: up to 10 deals)`
                    : "Loading..."}
                </p>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-900/20 dark:to-green-900/10 border border-green-200 dark:border-green-700 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-green-200/30 to-transparent rounded-full -translate-y-12 translate-x-12"></div>
              <div className="relative p-6 text-center">
                <div className="p-4 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/40 dark:to-green-900/20 rounded-2xl w-16 h-16 mx-auto mb-4 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <MdTrendingUp
                    className="text-green-600 dark:text-green-300"
                    size={24}
                  />
                </div>
                <h4 className="font-bold text-lg text-green-900 dark:text-green-200 mb-2">
                  P2P Chats
                </h4>
                <p className="text-3xl font-bold text-green-600 dark:text-green-300 mb-3">
                  {openedChatsCount}
                </p>
                <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-300 mb-3">
                  <div className="p-1 bg-green-100 dark:bg-green-900/40 rounded-full">
                    <MdTrendingUp size={16} />
                  </div>
                  <span className="text-sm font-semibold">+12% this month</span>
                </div>
              </div>
            </div>
          </div>

          {/* Premium Features Notice - Only show for Regular Plan */}
          {currentSubscription &&
            currentSubscription.planName === "regular" && (
              <div className="mt-8 p-6 bg-gradient-to-r from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/20 border border-primary/20 dark:border-primary/40 rounded-2xl shadow-lg">
                <div className="flex items-center gap-4">
                  <div className="p-3 -mt-5 bg-gradient-to-br from-primary/20 to-primary/10 dark:from-primary/30 dark:to-primary/10 rounded-2xl shadow-lg">
                    <FaCrown
                      className="text-primary dark:text-amber-400"
                      size={24}
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-lg text-gray-900 dark:text-foreground">
                      Unlock Premium Features
                    </h4>
                    <p className="text-sm text-gray-700 dark:text-gray-400 leading-relaxed">
                      Upgrade to Premium Plan to access:{" "}
                      <strong className="text-primary">Unlimited Deals</strong>,{" "}
                      <strong className="text-primary">
                        Pharmacy Listings
                      </strong>
                      , and{" "}
                      <strong className="text-primary">Drug Alerts</strong>
                    </p>
                  </div>
                  <Button
                    onClick={() => handleUpgrade({ name: "Premium Plan" })}
                    className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white dark:bg-primary dark:hover:bg-primary/90 dark:text-white font-semibold px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Upgrade Now
                  </Button>
                </div>
              </div>
            )}
          {currentSubscription &&
            currentSubscription.planName === "premium" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                <div className="relative overflow-hidden rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 shadow-lg hover:shadow-xl transition-all duration-300 group">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-red-100 rounded-full -translate-y-12 translate-x-12"></div>
                  <div className="relative p-6 text-center">
                    <div className="p-4 bg-red-100 dark:bg-red-900/40 rounded-2xl w-16 h-16 mx-auto mb-4 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <MdHomeWork
                        className="text-red-700 dark:text-red-300"
                        size={28}
                      />
                    </div>
                    <h4 className="font-bold text-lg text-red-900 dark:text-red-200 mb-2">
                      List pharmacies for sale
                    </h4>
                    <p className="text-xl font-bold text-red-700 dark:text-red-300 mb-3">
                      Available
                    </p>
                    <p className="text-sm text-red-700 font-medium dark:text-red-300">
                      You can list pharmacies for sale with your premium plan.
                    </p>
                  </div>
                </div>
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-yellow-50 to-yellow-100/50 dark:from-yellow-900/20 dark:to-yellow-900/10 border border-yellow-200 dark:border-yellow-700 shadow-lg hover:shadow-xl transition-all duration-300 group">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-yellow-200/30 to-transparent rounded-full -translate-y-12 translate-x-12"></div>
                  <div className="relative p-6 text-center">
                    <div className="p-4 bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-900/40 dark:to-yellow-900/20 rounded-2xl w-16 h-16 mx-auto mb-4 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <MdNotificationsActive
                        className="text-yellow-700 dark:text-yellow-300"
                        size={28}
                      />
                    </div>
                    <h4 className="font-bold text-lg text-yellow-900 dark:text-yellow-200 mb-2">
                      Subscribe to drug alert
                    </h4>
                    <p className="text-xl font-bold text-yellow-700 dark:text-yellow-300 mb-3">
                      Enabled
                    </p>
                    <p className="text-sm text-yellow-800 font-medium dark:text-yellow-300">
                      You are subscribed to drug alerts and get notified when
                      new drugs are available.
                    </p>
                  </div>
                </div>
              </div>
            )}
        </CardContent>
      </Card>

      {/* Billing History */}
      <Card className="pt-10 mb-8 rounded-2xl border-0 bg-gradient-to-br from-white to-gray-50/50 dark:from-background dark:to-background shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-primary/80 to-primary/60"></div>
        <CardHeader>
          <CardTitle className="flex items-center gap-4">
            <span className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 shadow-lg w-14 h-14">
              <MdReceipt size={28} className="text-primary" />
            </span>
            <div>
              <span className="font-bold text-2xl text-gray-900 dark:text-foreground block">
                Billing History
              </span>
              <span className="text-sm text-gray-500 font-medium dark:text-gray-400">
                View your subscription and payment history
              </span>
            </div>
            <Button
              onClick={handleDownloadBillingHistory}
              variant="outline"
              className="ml-auto bg-gradient-to-r from-primary/10 to-primary/20 dark:from-primary/20 dark:to-primary/30 text-primary dark:text-primary font-semibold px-4 py-2 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
            >
              <MdDownload className="mr-2" size={18} />
              Download All
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="px-8 pb-8">
          {subscriptionsLoading ? (
            <LoadingPage message="Loading billing history..." />
          ) : error ? (
            <div className="p-6 bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-900/10 border border-red-200 dark:border-red-700 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 dark:bg-red-900/40 rounded-full">
                  <MdWarning
                    size={20}
                    className="text-red-600 dark:text-red-300"
                  />
                </div>
                <p className="text-red-700 font-medium dark:text-red-300">
                  Error loading billing history: {error}
                </p>
              </div>
            </div>
          ) : userSubscriptions && userSubscriptions.length > 0 ? (
            <div className="space-y-4">
              {userSubscriptions.map((subscription, index) => {
                const invoice = formatSubscriptionForHistory(subscription);
                return (
                  <div
                    key={invoice.id}
                    className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-gray-50/30 dark:from-background dark:to-background border border-gray-100 dark:border-border shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                  >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex items-center gap-6">
                          <div
                            className={`p-3 -mt-7 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300 ${
                              invoice.planName === "premium"
                                ? "bg-amber-100"
                                : "bg-gradient-to-br from-blue-100 to-indigo-100"
                            }`}
                          >
                            {invoice.planName === "premium" ? (
                              <FaCrown size={24} className="text-amber-400" />
                            ) : (
                              <Zap size={24} className="text-blue-600" />
                            )}
                          </div>
                          <div className="space-y-2">
                            <p className="font-bold text-lg text-gray-900 dark:text-foreground">
                              {invoice.description}
                            </p>
                            <p className="text-sm text-gray-600 font-medium dark:text-gray-400">
                              {invoice.date} • {invoice.invoice}
                            </p>
                            <div className="flex items-center gap-1">
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-500 font-medium dark:text-gray-400">
                                  {invoice.subType === "wallet"
                                    ? "Wallet Payment"
                                    : "Card Payment"}
                                </span>
                              </div>
                              {invoice.pan && (
                                <span className="text-xs text-gray-400 font-medium dark:text-gray-500">
                                  {invoice.subType === "wallet"
                                    ? "Number"
                                    : "Card"}
                                  : ****{invoice.pan}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                          <div className="text-right">
                            <span className="font-bold text-2xl text-gray-900 dark:text-foreground">
                              {invoice.amount}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center">
                              {getStatusBadge(invoice.status)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-12 text-center">
              <div className="relative mx-auto w-24 h-24 mb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-zinc-800 dark:to-zinc-900 rounded-full"></div>
                <div className="absolute inset-2 bg-white dark:bg-background rounded-full flex items-center justify-center shadow-lg">
                  <MdReceipt
                    size={32}
                    className="text-gray-400 dark:text-gray-500"
                  />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-700 dark:text-foreground mb-2">
                No billing history found
              </h3>
              <p className="text-gray-500 text-sm dark:text-gray-400">
                Your subscription history will appear here once you have active
                subscriptions
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
