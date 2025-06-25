import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Accordion from "@/components/ui/Accordion";
import { FaUser, FaLock, FaClinicMedical, FaUserMd, FaEnvelope, FaTags, FaCheckCircle } from "react-icons/fa";
import { RiCapsuleLine } from "react-icons/ri";
import { PiTagChevronBold } from "react-icons/pi";
import { motion, AnimatePresence } from "framer-motion";
import { BsPatchCheckFill } from "react-icons/bs";
import ProfileHeader from "./profile/ProfileHeader";
import PersonalInfoCard from "./profile/PersonalInfoCard";
import ContactInfoCard from "./profile/ContactInfoCard";
import SecurityCard from "./profile/SecurityCard";
import PharmaciesCard from "./profile/PharmaciesCard";
import { useAuth } from "../../store/useAuth";
import { usePharmacist } from "../../store/usePharmacist";

const TABS = [
  { key: "profile", label: "Profile", icon: <FaUser size={18} className="mr-2 text-primary" /> },
  { key: "security", label: "Security", icon: <FaLock size={18} className="mr-2 text-primary" /> },
  { key: "pharmacies", label: "My Pharmacies", icon: <FaClinicMedical size={18} className="mr-2 text-primary" /> },
];

export default function Profile() {
  const [activeTab, setActiveTab] = useState("profile");
  const { user, token } = useAuth();
  const { 
    pharmacistDetails, 
    isLoading, 
    error, 
    fetchPharmacistDetails,
    clearError 
  } = usePharmacist();

  useEffect(() => {
    if (user && token) {
      fetchPharmacistDetails(user, token);
    }
  }, [user, token, fetchPharmacistDetails]);

  // Loading state
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto py-10 px-2 md:px-0">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading pharmacist details...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-4xl mx-auto py-10 px-2 md:px-0">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-red-500 mb-4">
              <FaUserMd size={48} className="mx-auto" />
            </div>
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => {
              clearError();
              if (user && token) {
                fetchPharmacistDetails(user, token);
              }
            }}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-2 md:px-0">
      {/* Top Bar with My Deals and Verified Badge */}
      <ProfileHeader pharmacistDetails={pharmacistDetails} />
      
      {/* Account Status */}
      <div className="flex items-center gap-2 mb-8">
        <span className="font-medium text-base">Account Status:</span>
        <Badge variant={pharmacistDetails?.status === 'verified' ? 'default' : 'secondary'}>
          {pharmacistDetails?.status === 'verified' ? 'Verified' : 'Under Review'}
        </Badge>
      </div>
      
      {/* Tabs */}
      <div className="flex gap-3 mb-10 justify-center">
        {TABS.map((tab) => (
          <Button
            key={tab.key}
            variant={activeTab === tab.key ? "secondary" : "ghost"}
            className={`rounded-md bg-[#d0d2f8] px-6 capitalize flex items-center text-base font-semibold transition-all duration-150 ${activeTab === tab.key ? 'shadow' : ''}`}
            disabled={activeTab === tab.key}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.icon}
            {tab.label}
          </Button>
        ))}
      </div>
      
      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === "profile" && (
          <motion.div
            key="profile"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            <PersonalInfoCard pharmacistDetails={pharmacistDetails} />
            <ContactInfoCard pharmacistDetails={pharmacistDetails} />
          </motion.div>
        )}
        {activeTab === "security" && (
          <motion.div
            key="security"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            <SecurityCard pharmacistDetails={pharmacistDetails} />
          </motion.div>
        )}
        {activeTab === "pharmacies" && (
          <motion.div
            key="pharmacies"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            <PharmaciesCard pharmacistDetails={pharmacistDetails} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}