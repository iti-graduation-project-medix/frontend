import React, { useState } from "react";
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
  MdTrendingUp
} from "react-icons/md";
import { FaCrown, FaGem, FaCheck, FaTimes } from "react-icons/fa";
import { Zap } from "lucide-react";

const BILLING_HISTORY = [
  {
    id: 1,
    date: "2024-01-15",
    amount: "EGP100.00",
    status: "Paid",
    description: "Premium Plan - Monthly",
    invoice: "INV-2024-001"
  },
  {
    id: 2,
    date: "2023-12-15",
    amount: "EGP100.00",
    status: "Paid",
    description: "Premium Plan - Monthly",
    invoice: "INV-2023-012"
  },
  {
    id: 3,
    date: "2023-11-15",
    amount: "EGP50.00",
    status: "Paid",
    description: "Regular Plan - Monthly",
    invoice: "INV-2023-011"
  }
];

const PLANS = {
  regular: {
    name: "Regular Plan",
    price: "EGP50",
    period: "month",
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
    price: "EGP100",
    period: "month",
    features: [
      "Add unlimited deals",
      "List pharmacies for sale",
      "Subscribe to drug alert"
    ],
    icon: FaCrown,
    color: "text-yellow-600",
    bgColor: "bg-yellow-100"
  }
};

export default function BillingPlansCard({ pharmacistDetails }) {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const getStatusBadge = (status) => {
    const variants = {
      paid: "success",
      pending: "warning",
      failed: "destructive"
    };
    return <Badge variant={variants[status.toLowerCase()] || "secondary"}>{status}</Badge>;
  };

  const handleUpgrade = (plan) => {
    setSelectedPlan(plan);
    setShowUpgradeModal(true);
    // Navigate to subscription page
    navigate('/subscription');
  };

  return (
    <div className="space-y-8">
      {/* Current Plan Section */}
      <Card className="mb-6 rounded-xl border border-gray-200 bg-white shadow-md hover:shadow-lg transition-shadow px-5 py-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <span className="inline-flex items-center justify-center rounded-full bg-primary/10 shadow-sm w-12 h-12">
              <MdCardMembership size={24} className="text-primary" />
            </span>
            <span className="font-bold text-xl text-gray-900">
              Current Plan
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <div className="p-3 bg-blue-100 rounded-full">
                <Zap size={28} className="text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-xl text-gray-900">Regular Plan</h3>
                <p className="text-gray-600 mb-2">Basic Features</p>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="text-xs bg-green-50 border-green-200 text-green-700">
                    Current Plan
                  </Badge>
                  <span className="text-xs text-gray-500">Active since Jan 2024</span>
                </div>
              </div>
            </div>
            <Button 
              onClick={() => handleUpgrade({ name: 'Premium Plan' })}
              className="bg-primary text-white hover:bg-primary-hover border-primary px-4 py-2 rounded-md shadow-sm w-full sm:w-auto"
            >
              <MdUpgrade  />
              Upgrade to Premium
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Plan Comparison */}
      <Card className="mb-6 rounded-xl border border-gray-200 bg-white shadow-md hover:shadow-lg transition-shadow px-5 py-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <span className="inline-flex items-center justify-center rounded-full bg-primary/10 shadow-sm w-12 h-12">
              <MdCardMembership size={24} className="text-primary" />
            </span>
            <span className="font-bold text-xl text-gray-900">
              Plan Comparison
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Regular Plan */}
            <div className="border border-gray-200 rounded-lg p-6 bg-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Zap size={24} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-gray-900">Regular Plan</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-blue-600">{PLANS.regular.price}</span>
                    <span className="text-gray-500">/{PLANS.regular.period}</span>
                  </div>
                </div>
              </div>
              <ul className="space-y-3 mb-6">
                {PLANS.regular.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <FaCheck className="text-green-500 flex-shrink-0" size={14} />
                    <span className="text-gray-700 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button 
                variant="outline" 
                className="w-full border-blue-200 text-blue-600 hover:bg-blue-50"
                disabled
              >
                Current Plan
              </Button>
            </div>

            {/* Premium Plan */}
            <div className="border-2 border-yellow-300 rounded-lg p-6 bg-gradient-to-br from-yellow-50 to-white relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-yellow-500 text-white px-3 py-1 text-xs">
                  Recommended
                </Badge>
              </div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-yellow-100 rounded-full">
                  <FaCrown size={24} className="text-yellow-600" />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-gray-900">Premium Plan</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-yellow-600">{PLANS.premium.price}</span>
                    <span className="text-gray-500">/{PLANS.premium.period}</span>
                  </div>
                </div>
              </div>
              <ul className="space-y-3 mb-6">
                {PLANS.premium.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <FaCheck className="text-green-500 flex-shrink-0" size={14} />
                    <span className="text-gray-700 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button 
                onClick={() => handleUpgrade({ name: 'Premium Plan' })}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-white"
              >
                <MdUpgrade className="mr-2" />
                Upgrade to Premium
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Usage Statistics */}
      <Card className="mb-6 rounded-xl border border-gray-200 bg-white shadow-md hover:shadow-lg transition-shadow px-5 py-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <span className="inline-flex items-center justify-center rounded-full bg-primary/10 shadow-sm w-12 h-12">
              <MdInfo size={24} className="text-primary" />
            </span>
            <span className="font-bold text-xl text-gray-900">
              Usage Statistics
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="p-3 bg-blue-100 rounded-full w-14 h-14 mx-auto mb-3 flex items-center justify-center">
                <Zap className="text-blue-600" size={22} />
              </div>
              <h4 className="font-semibold text-blue-900 mb-1">Pharmacies</h4>
              <p className="text-2xl font-bold text-blue-600 mb-1">0 / 0</p>
              <div className="w-full bg-blue-200 rounded-full h-2 mb-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '0%' }}></div>
              </div>
              <p className="text-xs text-blue-700">Not available (Regular Plan)</p>
            </div>

            <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="p-3 bg-green-100 rounded-full w-14 h-14 mx-auto mb-3 flex items-center justify-center">
                <MdTrendingUp className="text-green-600" size={22} />
              </div>
              <h4 className="font-semibold text-green-900 mb-1">P2P Chats</h4>
              <p className="text-2xl font-bold text-green-600 mb-1">60</p>
              <div className="flex items-center justify-center gap-1 text-green-600 mb-2">
                <MdTrendingUp size={14} />
                <span className="text-xs">+12% this month</span>
              </div>
              <p className="text-xs text-green-700">This month</p>
            </div>

            <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="p-3 bg-purple-100 rounded-full w-14 h-14 mx-auto mb-3 flex items-center justify-center">
                <FaGem className="text-purple-600" size={22} />
              </div>
              <h4 className="font-semibold text-purple-900 mb-1">Deals</h4>
              <p className="text-2xl font-bold text-purple-600 mb-1">3 / 10</p>
              <div className="w-full bg-purple-200 rounded-full h-2 mb-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: '30%' }}></div>
              </div>
              <p className="text-xs text-purple-700">30% used (Regular Plan: up to 10 deals)</p>
            </div>

            <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="p-3 bg-red-100 rounded-full w-14 h-14 mx-auto mb-3 flex items-center justify-center">
                <MdWarning className="text-red-600" size={22} />
              </div>
              <h4 className="font-semibold text-red-900 mb-1">Drug Alerts</h4>
              <p className="text-2xl font-bold text-red-600 mb-1">0 / 0</p>
              <div className="w-full bg-red-200 rounded-full h-2 mb-2">
                <div className="bg-red-600 h-2 rounded-full" style={{ width: '0%' }}></div>
              </div>
              <p className="text-xs text-red-700">Not available (Regular Plan)</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Billing History */}
      <Card className="mb-6 rounded-xl border border-gray-200 bg-white shadow-md hover:shadow-lg transition-shadow px-5 py-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <span className="inline-flex items-center justify-center rounded-full bg-primary/10 shadow-sm w-12 h-12">
              <MdReceipt size={24} className="text-primary" />
            </span>
            <span className="font-bold text-xl text-gray-900">
              Billing History
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {BILLING_HISTORY.map((invoice, index) => (
              <div
                key={invoice.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-3 border rounded-lg bg-white hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <MdReceipt size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{invoice.description}</p>
                    <p className="text-xs text-gray-500">{invoice.date} • {invoice.invoice}</p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
                  <span className="font-bold text-gray-900">{invoice.amount}</span>
                  <div className="flex flex-row items-center justify-between w-full gap-2">
                    <div className="flex items-center">
                      {getStatusBadge(invoice.status)}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:bg-primary/10 hover:text-primary"
                    >
                      <MdDownload className="mr-1" size={14} />
                      Download
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 