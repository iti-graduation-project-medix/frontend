import React, { useState } from "react";
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

const TABS = [
  { key: "profile", label: "Profile", icon: <FaUser size={18} className="mr-2 text-primary" /> },
  { key: "security", label: "Security", icon: <FaLock size={18} className="mr-2 text-primary" /> },
  { key: "pharmacies", label: "My Pharmacies", icon: <FaClinicMedical size={18} className="mr-2 text-primary" /> },
];

export default function Profile() {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="max-w-4xl mx-auto py-10 px-2 md:px-0">
      {/* Top Bar with My Deals and Verified Badge */}
      <ProfileHeader />
      {/* Account Status */}
      <div className="flex items-center gap-2 mb-8">
        <span className="font-medium text-base">Account Status:</span>
        <Badge variant="secondary">Under Review</Badge>
      </div>
      {/* Tabs */}
      <div className="flex gap-3 mb-10 justify-center">
        {TABS.map((tab) => (
          <Button
            key={tab.key}
            variant={activeTab === tab.key ? "secondary" : "ghost"}
            className={`rounded-md px-6 capitalize flex items-center text-base font-semibold transition-all duration-150 ${activeTab === tab.key ? 'shadow' : ''}`}
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
            <PersonalInfoCard />
            <ContactInfoCard />
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
            <SecurityCard />
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
            <PharmaciesCard />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}