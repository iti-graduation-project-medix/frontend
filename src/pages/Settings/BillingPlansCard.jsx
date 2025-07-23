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

  // Calculate chat growth percentage (this month vs last month)
  const now = new Date();
  const thisMonth = now.getMonth();
  const thisYear = now.getFullYear();
  const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
  const lastMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear;

  const chatsThisMonth = chats.filter(chat => {
    const date = new Date(chat.createdAt || chat.updatedAt);
    return date.getMonth() === thisMonth && date.getFullYear() === thisYear;
  });
  const chatsLastMonth = chats.filter(chat => {
    const date = new Date(chat.createdAt || chat.updatedAt);
    return date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear;
  });
  const countThisMonth = chatsThisMonth.length;
  const countLastMonth = chatsLastMonth.length;
  let chatGrowth = 0;
  if (countLastMonth === 0 && countThisMonth > 0) {
    chatGrowth = 100;
  } else if (countLastMonth === 0 && countThisMonth === 0) {
    chatGrowth = 0;
  } else {
    chatGrowth = Math.round(((countThisMonth - countLastMonth) / countLastMonth) * 100);
  }

  // Fetch current subscription and user subscriptions on component mount
  useEffect(() => {
    fetchCurrentSubscription();
    fetchUserSubscriptions();
  }, [fetchCurrentSubscription, fetchUserSubscriptions]);

  // Helper function to get plan details
  const getPlanDetails = (planName, period = 'monthly') => {
    const plans = {
      regular: {
        name: "Regular Plan",
        price: period === 'yearly' ? 200 : 50,
        period: period === 'yearly' ? 'year' : 'month',
        features: [
          "Add up to 10 deals",
          "Can't list pharmacies for sale",
          "Can't subscribe to drug alert"
        ],
        icon: Zap,
        color: "text-blue-600",
        bgColor: "bg-blue-100"
      },
      premium: {
        name: "Premium Plan",
        price: period === 'yearly' ? 400 : 100,
        period: period === 'yearly' ? 'year' : 'month',
        features: [
          "Add unlimited deals",
          "List pharmacies for sale",
          "Subscribe to drug alert"
        ],
        icon: FaCrown,
        color: "text-amber-400",
        bgColor: "bg-amber-100"
      }
    };
    return plans[planName] || plans.regular;
  };

  // Get current plan details
  const currentPlan = currentSubscription ? getPlanDetails(currentSubscription.planName, currentSubscription.plan) : getPlanDetails('regular');

  // Helper function to format subscription data for billing history
  const formatSubscriptionForHistory = (subscription) => {
    const planDetails = getPlanDetails(subscription.planName, subscription.plan);
    const amount = `EGP${planDetails.price}.00`;
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

      <Card className="py-10 mb-8 rounded-2xl bg-gradient-to-br from-white to-gray-50/50 dark:from-background dark:to-background shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border dark:border-border">
        {/* Removed the colored border above the navbar */}

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
          ) : currentSubscription && currentSubscription.status === true ? (
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
            <div className="p-8 bg-primary/10 border border-primary dark:bg-primary/10 dark:border-primary rounded-2xl">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="p-3 bg-primary/20 rounded-full">
                  <MdWarning
                    size={28}
                    className="text-primary"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-primary font-semibold text-lg sm:text-xl truncate">
                    No active subscription found
                  </p>
                  <p className="text-primary/80 text-sm sm:text-base truncate">
                    Please subscribe to a plan to continue using our services
                  </p>
                </div>
                <Button
                  className="bg-primary text-white font-semibold px-6 py-2 rounded-xl shadow-lg hover:bg-primary/90 transition-all duration-300 w-full sm:w-auto"
                  onClick={() => navigate('/subscription')}
                >
                  Subscribe Now
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Usage Statistics */}
      <Card className="pt-10 mb-8 rounded-2xl bg-gradient-to-br from-white to-gray-50/50 dark:from-background dark:to-background shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border dark:border-border">
        {/* Removed the colored border above the navbar */}

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
          {currentSubscription && currentSubscription.status === true ? (
            <>
            {/* Premium Plan Extra Features */}
            {currentSubscription.planName === 'premium' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {/* Pharmacy Listings Card */}
                <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 group border border-blue-200 dark:border-blue-900 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/40 dark:to-blue-900/10">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-200/30 to-transparent dark:from-blue-900/30 dark:to-transparent rounded-full -translate-y-12 translate-x-12"></div>
                  <div className="relative p-6 text-center flex flex-col items-center">
                    <div className="p-4 rounded-2xl w-16 h-16 mb-4 flex items-center justify-center shadow-lg bg-blue-100 dark:bg-blue-900/60">
                      <MdHomeWork className="text-blue-600 dark:text-blue-300" size={28} />
                    </div>
                    <h4 className="font-bold text-lg text-blue-900 dark:text-blue-200 mb-2">Pharmacy Listings</h4>
                    <p className="text-blue-700 dark:text-blue-300 font-medium mb-4">List your pharmacy for sale and reach more buyers.</p>
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-200 font-semibold text-xs">
                      <MdCheckCircle className="text-blue-500 dark:text-blue-300" /> Active
                    </span>
                  </div>
                </div>
                {/* Drug Alerts Card */}
                <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 group border border-zinc-200 dark:border-zinc-800 bg-gradient-to-br from-zinc-50 to-zinc-100/50 dark:from-zinc-900/40 dark:to-zinc-900/10">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-zinc-200/30 to-transparent dark:from-zinc-900/30 dark:to-transparent rounded-full -translate-y-12 translate-x-12"></div>
                  <div className="relative p-6 text-center flex flex-col items-center">
                    <div className="p-4 rounded-2xl w-16 h-16 mb-4 flex items-center justify-center shadow-lg bg-zinc-100 dark:bg-zinc-900/60">
                      <MdNotificationsActive className="text-zinc-600 dark:text-zinc-200" size={28} />
                    </div>
                    <h4 className="font-bold text-lg text-zinc-900 dark:text-zinc-100 mb-2">Drug Alerts</h4>
                    <p className="text-zinc-700 dark:text-zinc-300 font-medium mb-4">Subscribe to drug alerts and stay updated on new medicines.</p>
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 font-semibold text-xs">
                      <MdCheckCircle className="text-zinc-500 dark:text-zinc-200" /> Active
                    </span>
                  </div>
                </div>
              </div>
            )}
            {/* Available Features */}
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
                <h4 className="font-bold text-lg text-purple-900 mb-2">Deals</h4>
                <p className="text-3xl font-bold text-purple-600 mb-3">
                  {(() => {
                    if (!currentSubscription) return '0 / 0';
                    if (currentSubscription.planName === 'premium') return '∞ / ∞';
                    // Regular plan
                    const isYearly = currentSubscription.plan === 'yearly';
                    const maxDeals = isYearly ? 150 : 10;
                    const usedDeals = maxDeals - parseInt(currentSubscription.dealsNumber);
                    return `${usedDeals} / ${maxDeals}`;
                  })()}
                </p>
                <div className="w-full bg-purple-200 rounded-full h-3 mb-3 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-purple-600 h-3 rounded-full transition-all duration-1000 ease-out" 
                    style={{ 
                      width: (() => {
                        if (!currentSubscription) return '0%';
                        if (currentSubscription.planName === 'premium') return '100%';
                        const isYearly = currentSubscription.plan === 'yearly';
                        const maxDeals = isYearly ? 150 : 10;
                        const usedDeals = maxDeals - parseInt(currentSubscription.dealsNumber);
                        return `${(usedDeals / maxDeals) * 100}%`;
                      })()
                    }}
                  ></div>
                </div>
                <p className="text-sm text-purple-700 font-medium">
                  {(() => {
                    if (!currentSubscription) return 'Loading...';
                    if (currentSubscription.planName === 'premium') return 'Unlimited deals (Premium Plan)';
                    const isYearly = currentSubscription.plan === 'yearly';
                    const maxDeals = isYearly ? 150 : 10;
                    const usedDeals = maxDeals - parseInt(currentSubscription.dealsNumber);
                    return `${Math.round((usedDeals / maxDeals) * 100)}% used (Regular Plan: up to ${maxDeals} deals${isYearly ? ' per year' : ' per month'})`;
                  })()}
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
                  <span className="text-sm font-semibold">
                    {chatGrowth >= 0 ? '+' : ''}{chatGrowth}% this month
                  </span>
            </div>
              </div>
              </div>
            </div>
          {/* Premium Features Notice - Only show for Regular Plan */}
          {currentSubscription && currentSubscription.planName === "regular" && (
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
                    Upgrade to Premium Plan to access: <strong className="text-primary">Unlimited Deals</strong>, <strong className="text-primary">Pharmacy Listings</strong>, and <strong className="text-primary">Drug Alerts</strong>
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
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 sm:py-16 max-w-xs sm:max-w-md mx-auto text-center">
              <div className="relative mx-auto w-20 h-20 sm:w-24 sm:h-24 mb-4 sm:mb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full"></div>
                <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <MdInfo size={28} className="sm:size-32 text-gray-400" />
                </div>
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">No usage features available</h3>
              <p className="text-gray-500 text-xs sm:text-sm">Usage features will appear here once you have an active subscription</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Billing History */}
      <Card className="pt-10 mb-8 rounded-2xl bg-gradient-to-br from-white to-gray-50/50 dark:from-background dark:to-background shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border dark:border-border">
        {/* Removed the colored border above the navbar */}
        <CardHeader>
          <CardTitle className="flex items-center gap-4">
            <span className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 shadow-lg w-14 h-14">
              <MdReceipt size={28} className="text-primary" />
            </span>
            <div className="flex-1 min-w-0">
              <span className="font-bold text-2xl text-gray-900 dark:text-foreground block">
                Billing History
              </span>
              <span className="text-sm text-gray-500 font-medium dark:text-gray-400">
                View your subscription and payment history
              </span>
            </div>
            {userSubscriptions && userSubscriptions.length > 0 && (
              <Button
                onClick={handleDownloadBillingHistory}
                variant="outline"
                className="ml-auto bg-gradient-to-r from-primary/10 to-primary/20 dark:from-primary/20 dark:to-primary/30 text-primary dark:text-primary font-semibold px-4 py-2 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
              >
                <MdDownload className="mr-2" size={18} />
                Download All
              </Button>
            )}
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
            <>
              <div className="space-y-4">
                {userSubscriptions.map((subscription, index) => {
                  const invoice = formatSubscriptionForHistory(subscription);
                  return (
                    <div
                      key={invoice.id}
                      className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-gray-50/50 dark:from-background dark:to-background border border-gray-100 dark:border-border shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                    >
                      <div className="p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center gap-6">
                          <div className={`p-3 -mt-7 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300 ${
                            invoice.planName === 'premium' 
                              ? 'bg-amber-100 dark:bg-yellow-900/40'
                              : 'bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/20'
                          }`}>
                            {invoice.planName === 'premium' ? (
                              <FaCrown size={24} className="text-amber-400 dark:text-yellow-300" />
                            ) : (
                              <Zap size={24} className="text-blue-600 dark:text-blue-300" />
                            )}
                          </div>
                          <div className="space-y-2">
                            <p className="font-bold text-lg text-gray-900 dark:text-foreground">{invoice.description}</p>
                            <p className="text-sm text-gray-600 font-medium dark:text-gray-300">
                              {invoice.date} • {invoice.invoice}
                            </p>
                            <div className="flex items-center gap-1">
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-500 font-medium dark:text-gray-400">
                                  {invoice.subType === 'wallet' ? 'Wallet Payment' : 'Card Payment'}
                                </span>
                              </div>
                              {invoice.pan && (
                                <span className="text-xs text-gray-400 font-medium dark:text-gray-500">
                                  {invoice.subType === 'wallet' ? 'Number' : 'Card'}: ****{invoice.pan}
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
                  );
                })}
              </div>
            </>
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