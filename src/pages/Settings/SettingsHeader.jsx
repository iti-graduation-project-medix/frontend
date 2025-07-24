import React, { useEffect, useState, useRef } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PiTagChevronBold } from "react-icons/pi";
import { BsPatchCheckFill } from "react-icons/bs";
import { FaUserEdit, FaCog, FaSpinner, FaUpload } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useAuth } from "../../store/useAuth";
import { useUserDetails } from "../../store/useUserDetails";
import { updateUserProfileImage } from '../../api/profile/profile';

export default function SettingsHeader() {
  const { user, token } = useAuth();
  const { userDetails, isLoading, error, fetchUserDetails } = useUserDetails();
  const [imgLoaded, setImgLoaded] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user && user.id && token && !userDetails) {
      fetchUserDetails(user.id, token);
    }
  }, [user, token, fetchUserDetails, userDetails]);

  const details = userDetails || {};
  const getInitials = (name = "") => {
    const words = name.trim().split(" ");
    const firstTwo = words.slice(0, 2);
    return firstTwo.map((word) => word[0]?.toUpperCase()).join("");
  };
  const initials = getInitials(details.fullName || "");

  // Capitalize first character of each word
  const capitalizeWords = (str = "") =>
    str.replace(/\b\w/g, (char) => char.toUpperCase());

  const handleUploadClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setUploadError(null);
    try {
      await updateUserProfileImage(file, token);
      // Optionally, refetch user details here if needed
      if (fetchUserDetails && user && user.id && token) {
        await fetchUserDetails(user.id, token);
      }
    } catch (err) {
      setUploadError(err.message);
    } finally {
      setUploading(false);
    }
  };

  if (isLoading) {
    return <FaSpinner className="animate-spin mx-auto my-10 text-primary" size={20} />;
  }
  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }
  if (!userDetails) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-background rounded-2xl p-6 mb-8 border border-gray-100 dark:border-border shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        {/* Profile Section */}
        <div className="flex items-center gap-6 w-full justify-between">
          {/* Avatar and Info */}
          <div className="flex items-center gap-6">
            {/* Avatar with Status */}
            <div className="relative">
              <div className="relative">
                <Avatar className="size-20 shadow-lg border-4 border-white dark:border-background">
                  {details.profilePhotoUrl ? (
                    <AvatarImage
                      src={details.profilePhotoUrl}
                      alt="Profile"
                      onLoad={() => setImgLoaded(true)}
                      style={{ display: imgLoaded ? 'block' : 'none' }}
                    />
                  ) : null}
                  {(!details.profilePhotoUrl || !imgLoaded) && (
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xl font-bold">
                      {initials}
                    </AvatarFallback>
                  )}
                </Avatar>
                {/* Status Indicator */}
                <div className="absolute -bottom-1 -right-1 bg-white dark:bg-background rounded-full p-1 shadow-md border-2 border-white dark:border-background">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <BsPatchCheckFill size={12} className="text-white" />
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-foreground tracking-tight">
                  {capitalizeWords(details.fullName)}
                </h1>
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-700"
                >
                  <BsPatchCheckFill size={12} className="mr-1" />
                  Verified
                </Badge>
              </div>
              <p className="text-gray-600 text-base mb-3 dark:text-gray-400">
                Professional Pharmacist • Account Settings
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Active Account
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Profile Complete
                </span>
              </div>
            </div>
          </div>
          {/* Upload Button aligned right */}
          <div className="flex flex-col items-end justify-center ml-4">
            <button
              type="button"
              className="flex items-center gap-2 px-3 py-1.5 bg-primary text-white rounded-md shadow hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary"
              onClick={handleUploadClick}
              disabled={uploading}
            >
              {uploading ? (
                <FaSpinner className="animate-spin" size={16} />
              ) : (
                <FaUpload size={16} />
              )}
              <span>Upload Image</span>
            </button>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileChange}
              disabled={uploading}
            />
            {uploadError && (
              <span className="text-xs text-red-500 mt-1">{uploadError}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
