import React, { useEffect, useState } from "react";
import {
  ChevronRight,
  Phone,
  MessageCircle,
  Share2,
  Heart,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useFav } from "../../store/useFav";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export default function ListingHeader({ pharmacy }) {
  const {
    isPharmacyFavorite,
    togglePharmacyFavorite,
    fetchFavorites,
    isLoading,
  } = useFav();
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const isFavorite = isPharmacyFavorite(pharmacy.id);

  // Determine if current user is the owner
  let currentUserId = null;
  try {
    const user = localStorage.getItem("user");
    if (user) {
      const parsed = JSON.parse(user);
      currentUserId = typeof parsed === "object" ? parsed.id : parsed;
    }
  } catch {}
  const isOwner =
    currentUserId && pharmacy.owner && currentUserId === pharmacy.owner.id;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: pharmacy.name,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleFavorite = async (e) => {
    e.stopPropagation();
    setIsAnimating(true);
    try {
      await togglePharmacyFavorite(pharmacy.id);
      if (isFavorite) {
        toast.success(`${pharmacy.name} removed from favorites`);
      } else {
        toast.success(`${pharmacy.name} added to favorites`);
      }
    } catch (error) {
      toast.error("Failed to update favorites. Please try again.");
    } finally {
      setTimeout(() => setIsAnimating(false), 300);
    }
  };

  return (
    <div className="border-b border-gray-100 dark:border-border  dark:bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
          <Link
            to="/"
            className="hover:text-blue-600 dark:hover:text-primary transition-colors"
          >
            Home
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link
            to="/pharmacies"
            className="hover:text-blue-600 dark:hover:text-primary transition-colors"
          >
            Pharmacies for Sale
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 dark:text-foreground font-medium truncate">
            {pharmacy.name}
          </span>
        </nav>
        {/* Title and CTA Section */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div className="flex-1">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-foreground mb-2">
              {pharmacy.name}
            </h1>
            <div className="flex items-center gap-4 text-gray-600 dark:text-gray-300">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                {pharmacy.saleType === "pharmacy_with_medicines"
                  ? "With Medicines"
                  : "Pharmacy Only"}
              </span>
              <span>•</span>
              <span>License: {pharmacy.licenseNum || "N/A"}</span>
            </div>
          </div>
          {/* CTA Buttons */}
          <div className="flex items-center gap-3">
            <motion.button
              onClick={handleFavorite}
              className={`p-3 rounded-full bg-gray-100 dark:bg-card hover:bg-gray-200 dark:hover:bg-muted/10 transition-colors ${
                isLoading || isOwner ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isLoading || isOwner}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              animate={
                isAnimating
                  ? {
                      scale: [1, 1.3, 1],
                      rotate: [0, 10, -10, 0],
                    }
                  : {}
              }
              transition={{ duration: 0.3, ease: "easeInOut" }}
              title={
                isOwner
                  ? "You cannot favorite your own pharmacy"
                  : isFavorite
                  ? "Remove from favorites"
                  : "Add to favorites"
              }
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={isFavorite ? "filled" : "empty"}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 180 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                >
                  <Heart
                    className={`w-5 h-5 transition-colors duration-200 ${
                      isFavorite
                        ? "text-red-500 fill-red-500"
                        : "text-gray-600 dark:text-gray-300 hover:text-red-400 dark:hover:text-red-400"
                    }`}
                  />
                </motion.div>
              </AnimatePresence>
            </motion.button>
            <button
              onClick={handleShare}
              className="p-3 rounded-full bg-gray-100 dark:bg-card hover:bg-gray-200 dark:hover:bg-muted/10 transition-colors"
            >
              <Share2 className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
