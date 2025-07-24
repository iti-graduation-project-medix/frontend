import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FaUser, FaLock, FaClinicMedical, FaUserMd } from "react-icons/fa";
import { MdPayment } from "react-icons/md";
import SettingsHeader from "./SettingsHeader";
import PersonalInfoCard from "./PersonalInfoCard";
import ContactInfoCard from "./ContactInfoCard";
import SecurityCard from "./SecurityCard";
import PharmaciesCard from "./PharmaciesCard";
import BillingPlansCard from "./BillingPlansCard";
import { useAuth } from "../../store/useAuth";
import { usePharmacist } from "../../store/usePharmacist";
import { LoadingPage } from "../../components/ui/loading";

const TABS = [
  { key: "info", label: "Info", icon: <FaUser size={16} /> },
  { key: "security", label: "Security", icon: <FaLock size={16} /> },
  {
    key: "pharmacies",
    label: "My Pharmacies",
    icon: <FaClinicMedical size={16} />,
  },
  { key: "billing", label: "Billing & Plans", icon: <MdPayment size={16} /> },
];

export default function Settings() {
  // Simple state for active tab
  const [activeTab, setActiveTab] = useState("info");

  const { user, token, isLoading: authLoading } = useAuth();
  const {
    pharmacistDetails,
    isLoading,
    error,
    fetchPharmacistDetails,
    clearError,
  } = usePharmacist();

  // Fetch data when user and token are available
  useEffect(() => {
    if (user && token && !authLoading) {
      // Extract user ID from user object
      const userId = user?.id || user;

      if (userId) {
        // Small delay to ensure auth state is properly set
        const timer = setTimeout(() => {
          fetchPharmacistDetails(userId, token);
        }, 100);

        return () => clearTimeout(timer);
      }
    }
  }, [user, token, authLoading]);

  const handleRetry = () => {
    clearError();
    if (user && token) {
      // Extract user ID from user object
      const userId = user?.id || user;
      if (userId) {
        fetchPharmacistDetails(userId, token);
      }
    }
  };

  // Simple tab click handler
  const handleTabClick = (tabKey) => {
    setActiveTab(tabKey);
  };

  // Show loading while auth is initializing
  if (authLoading) {
    return <LoadingPage message="Loading settings..." fullscreen={false} />;
  }

  // Show error if no user or token
  if (!user || !token) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-2 md:px-0">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-red-500 mb-4">
              <FaUserMd size={32} className="mx-auto" />
            </div>
            <p className="text-red-600 mb-4 text-sm">
              Please log in to access settings
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-2 md:px-0 dark:bg-background text-gray-900 dark:text-foreground">
      {/* Top Bar with My Deals and Verified Badge */}
      <SettingsHeader pharmacistDetails={pharmacistDetails} />

      {/* Tabs */}
      <div className="flex gap-2 mb-8 justify-center flex-col sm:flex-row">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            className={`rounded-lg px-4 py-2 capitalize flex items-center gap-2 text-sm font-medium transition-colors duration-150 w-full sm:w-auto ${
              activeTab === tab.key
                ? "bg-primary text-white shadow-sm dark:bg-primary dark:text-white"
                : "bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 border border-gray-300 dark:bg-background dark:hover:bg-slate-700 dark:text-gray-200 dark:hover:text-white dark:border-border"
            }`}
            onClick={() => handleTabClick(tab.key)}
          >
            <span
              className={
                activeTab === tab.key
                  ? "text-white dark:text-white"
                  : "text-primary dark:text-primary"
              }
            >
              {tab.icon}
            </span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === "info" && (
          <div className="space-y-6">
            {isLoading ? (
              <LoadingPage
                message="Loading personal information..."
                fullscreen={false}
              />
            ) : error ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="text-red-500 mb-4 dark:text-red-400">
                    <FaUserMd size={32} className="mx-auto" />
                  </div>
                  <p className="text-red-600 mb-4 text-sm dark:text-red-400">
                    {error}
                  </p>
                  <Button
                    onClick={handleRetry}
                    size="sm"
                    className="bg-primary text-white dark:bg-primary dark:text-white"
                  >
                    Try Again
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <PersonalInfoCard pharmacistDetails={pharmacistDetails} />
                <ContactInfoCard pharmacistDetails={pharmacistDetails} />
              </>
            )}
          </div>
        )}

        {activeTab === "security" && (
          <div>
            {isLoading ? (
              <LoadingPage
                message="Loading security settings..."
                fullscreen={false}
              />
            ) : error ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="text-red-500 mb-4 dark:text-red-400">
                    <FaLock size={32} className="mx-auto" />
                  </div>
                  <p className="text-red-600 mb-4 text-sm dark:text-red-400">
                    {error}
                  </p>
                  <Button
                    onClick={handleRetry}
                    size="sm"
                    className="bg-primary text-white dark:bg-primary dark:text-white"
                  >
                    Try Again
                  </Button>
                </div>
              </div>
            ) : (
              <SecurityCard pharmacistDetails={pharmacistDetails} />
            )}
          </div>
        )}

        {activeTab === "pharmacies" && (
          <div>
            {isLoading ? (
              <LoadingPage message="Loading pharmacies..." fullscreen={false} />
            ) : error ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="text-red-500 mb-4 dark:text-red-400">
                    <FaClinicMedical size={32} className="mx-auto" />
                  </div>
                  <p className="text-red-600 mb-4 text-sm dark:text-red-400">
                    {error}
                  </p>
                  <Button
                    onClick={handleRetry}
                    size="sm"
                    className="bg-primary text-white dark:bg-primary dark:text-white"
                  >
                    Try Again
                  </Button>
                </div>
              </div>
            ) : (
              <PharmaciesCard pharmacistDetails={pharmacistDetails} />
            )}
          </div>
        )}

        {activeTab === "billing" && (
          <div>
            {isLoading ? (
              <LoadingPage
                message="Loading billing information..."
                fullscreen={false}
              />
            ) : error ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="text-red-500 mb-4 dark:text-red-400">
                    <MdPayment size={32} className="mx-auto" />
                  </div>
                  <p className="text-red-600 mb-4 text-sm dark:text-red-400">
                    {error}
                  </p>
                  <Button
                    onClick={handleRetry}
                    size="sm"
                    className="bg-primary text-white dark:bg-primary dark:text-white"
                  >
                    Try Again
                  </Button>
                </div>
              </div>
            ) : (
              <BillingPlansCard pharmacistDetails={pharmacistDetails} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
