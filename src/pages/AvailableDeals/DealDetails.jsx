import React, { useEffect } from "react";
import {
  CalendarX,
  Package,
  Banknote,
  ShieldCheck,
  MapPin,
  MessageCircle,
  CheckCircle2,
  Map,
  User2,
  Pill,
  Clock,
  AlertCircle,
  Phone,
  Mail,
  ArrowLeft,
  Box as BoxIcon,
  Hash,
  Tag,
  Info,
  Layers,
  List,
  Building2,
  Globe,
  ChevronRight,
  Heart,
  Share2,
  ExternalLink,
  Navigation,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useDeals } from "@/store/useDeals";
import { shallow } from "zustand/shallow";
import useChat from "../../store/useChat";
import { useAuth } from "../../store/useAuth";
import CornerAd from "@/components/ui/CornerAd";
import { LoadingPage } from "@/components/ui/loading";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useFav } from "../../store/useFav";

export default function DealDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const deal = useDeals((state) => state.currentDeal);
  const isLoading = useDeals((state) => state.isLoading);
  const error = useDeals((state) => state.error);
  const fetchDeal = useDeals((state) => state.fetchDeal);
  const { user } = useAuth();
  const currentUserId = (() => {
    try {
      const userData = localStorage.getItem("user");
      if (!userData) return null;

      const parsedUser = JSON.parse(userData);
      // Handle both cases: user could be the full object or just the ID
      return typeof parsedUser === "object" ? parsedUser.id : parsedUser;
    } catch (error) {
      return null;
    }
  })();
  const { startChat, setIsWidgetOpen, loadUserChats, selectChat, chats } =
    useChat();
  const {
    isDealFavorite,
    toggleDealFavorite,
    fetchFavorites,
    isLoading: favLoading,
  } = useFav();
  const [isAnimating, setIsAnimating] = React.useState(false);
  React.useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);
  const isFavorite = isDealFavorite(deal?.id);
  const isOwner =
    currentUserId &&
    deal &&
    deal.postedBy &&
    currentUserId === deal.postedBy.id;

  useEffect(() => {
    if (id) {
      fetchDeal(id);
    }
  }, [id]);

  // Avatar logic (same as ProfileHeader)
  const getInitials = (name) => {
    if (!name) return "?";
    const parts = name.split(" ");
    if (parts.length === 1) return parts[0][0]?.toUpperCase() || "?";
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };
  const initials = getInitials(deal?.postedBy?.fullName);

  if (isLoading) {
    return <LoadingPage message="Loading deal details..." />;
  }
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 text-lg font-bold">{error}</p>
        </div>
      </div>
    );
  }
  if (!deal) {
    return (
      <div className="flex items-center justify-center min-h-[300px] text-gray-500">
        Loading deal details...
      </div>
    );
  }

  const handleChat = async () => {
    if (!currentUserId || !deal.postedBy) {
      alert("Please login to start a chat");
      return;
    }

    try {
      // Start chat with the deal poster
      await startChat(currentUserId, deal.postedBy.id, deal.id, "deal", {
        fullName: deal.postedBy.fullName,
        profilePhotoUrl: deal.postedBy.profilePhotoUrl,
        role: deal.postedBy.role || "User",
      });

      // Refresh chat list
      await loadUserChats();

      // Find the new chat in the list (by id or userId)
      const chatToSelect = chats.find(
        (c) => c.deal?.id === deal.id || c.otherUser?.id === deal.postedBy.id
      );
      if (chatToSelect) {
        await selectChat(chatToSelect);
      }

      // Open the chat widget immediately
      setIsWidgetOpen(true);
    } catch (error) {
      console.error("Error starting chat:", error);
      alert("Failed to start chat. Please try again.");
    }
  };

  const handleProfile = () => {
    navigate(`/pharmacists/${deal.postedBy.id}`);
  };

  const handleFavorite = async (e) => {
    e.stopPropagation();
    setIsAnimating(true);
    try {
      await toggleDealFavorite(deal.id);
      if (isFavorite) {
        toast.success(`${deal.medicineName} removed from favorites`);
      } else {
        toast.success(`${deal.medicineName} added to favorites`);
      }
    } catch (error) {
      toast.error("Failed to update favorites. Please try again.");
    } finally {
      setTimeout(() => setIsAnimating(false), 300);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: deal.medicineName,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  // Google Maps direction link using coordinates if available
  let mapsUrl = "";
  let directionsUrl = "";
  const coords = deal.pharmacy?.location?.coordinates;
  if (Array.isArray(coords) && coords.length === 2) {
    // Note: Google Maps expects lat,lng (not lng,lat)
    const [lng, lat] = coords;
    mapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  } else {
    // fallback to address string
    const pharmacyAddress = `${deal.pharmacy.addressLine1} ${deal.pharmacy.addressLine2} ${deal.pharmacy.city} ${deal.pharmacy.governorate}`;
    mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      pharmacyAddress
    )}`;
    directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
      pharmacyAddress
    )}`;
  }

  // Calculate time since posting
  const getTimeSincePosted = () => {
    const postedDate = new Date(deal.createdAt);
    const now = new Date();
    const diffInHours = Math.floor((now - postedDate) / (1000 * 60 * 60));

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6 lg:py-8">
      <CornerAd position="dealDetails" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
          <a href="/" className="hover:text-blue-600 transition-colors">
            Home
          </a>
          <ChevronRight className="w-4 h-4" />
          <a href="/deals" className="hover:text-blue-600 transition-colors">
            Deals
          </a>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium truncate">
            {deal.medicineName}
          </span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Medicine Information */}
            <Card className="shadow-sm border border-gray-200">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 p-4 sm:p-6">
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-100">
                    <Pill className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                      {deal.medicineName}
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-600">
                      Medicine Information
                    </p>
                  </div>
                  {/* Favorite and Share icons */}
                  <div className="flex items-center gap-2 ml-4">
                    <motion.button
                      onClick={handleFavorite}
                      className={`p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors ${
                        favLoading || isOwner
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                      disabled={favLoading || isOwner}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      animate={
                        isAnimating
                          ? { scale: [1, 1.3, 1], rotate: [0, 10, -10, 0] }
                          : {}
                      }
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      title={
                        isOwner
                          ? "You cannot favorite your own deal"
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
                                : "text-gray-600 hover:text-red-400"
                            }`}
                          />
                        </motion.div>
                      </AnimatePresence>
                    </motion.button>
                    <button
                      onClick={handleShare}
                      className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                      title="Share this deal"
                    >
                      <Share2 className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  {/* Medicine Information */}
                  <div className="space-y-3 sm:space-y-4">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900  flex items-center gap-2">
                      <Info className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                      <span className="sm:inline">Medicine Information</span>
                    </h3>
                    <div className="space-y-2 sm:space-y-3">
                      <div className="flex items-center justify-between p-2 sm:p-3 rounded-lg border border-gray-200 bg-gray-50">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <List className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                          <span className="font-medium text-gray-700 text-sm sm:text-base">
                            Quantity
                          </span>
                        </div>
                        <span className="font-bold text-primary text-sm sm:text-base">
                          {deal.quantity}
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-2 sm:p-3 rounded-lg border border-gray-200 bg-gray-50">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <Banknote className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                          <span className="font-medium text-gray-700 text-sm sm:text-base">
                            Price
                          </span>
                        </div>
                        <span className="font-bold text-green-600 text-sm sm:text-base">
                          EGP{Number(deal.price).toFixed(2)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-2 sm:p-3 rounded-lg border border-gray-200 bg-gray-50">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <CalendarX className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
                          <span className="font-medium text-gray-700 text-sm sm:text-base">
                            Expiry
                          </span>
                        </div>
                        <span className="font-medium text-gray-900 text-sm sm:text-base">
                          {new Date(deal.expiryDate).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-2 sm:p-3 rounded-lg border border-gray-200 bg-gray-50">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <BoxIcon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                          <span className="font-medium text-gray-700 text-sm sm:text-base">
                            Box Status
                          </span>
                        </div>
                        <Badge
                          variant={
                            deal.boxStatus === "damaged"
                              ? "destructive"
                              : "default"
                          }
                          className={`font-medium text-xs ${
                            deal.boxStatus === "damaged"
                              ? "bg-red-100 text-red-700 border-red-200"
                              : "bg-green-100 text-green-700 border-green-200"
                          }`}
                        >
                          {deal.boxStatus}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Additional Details */}
                  <div className="space-y-3 sm:space-y-4">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900  flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                      <span className="sm:inline">Deal Details</span>
                    </h3>
                    <div className="space-y-2 sm:space-y-3">
                      <div className="flex items-center justify-between p-2 sm:p-3 rounded-lg border border-gray-200 bg-gray-50">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <Layers className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                          <span className="font-medium text-gray-700 text-sm sm:text-base">
                            Type
                          </span>
                        </div>
                        <span className="font-medium text-gray-900 text-sm sm:text-base">
                          {deal.dealType}
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-2 sm:p-3 rounded-lg border border-gray-200 bg-gray-50">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <Pill className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
                          <span className="font-medium text-gray-700 text-sm sm:text-base">
                            Form
                          </span>
                        </div>
                        <span className="font-medium text-gray-900 text-sm sm:text-base">
                          {deal.dosageForm}
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-2 sm:p-3 rounded-lg border border-gray-200 bg-gray-50">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                          <span className="font-medium text-gray-700 text-sm sm:text-base">
                            Posted
                          </span>
                        </div>
                        <span className="font-medium text-gray-900 text-sm sm:text-base">
                          {getTimeSincePosted()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pharmacy Information */}
            <Card className="shadow-sm border border-gray-200">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-100">
                    <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                      Pharmacy Information
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-600">
                      Location and contact details
                    </p>
                  </div>
                  <div className="flex items-center gap-2 ml-auto">
                    <a
                      href={mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 font-semibold px-3 py-2 rounded-lg shadow-sm transition-all text-xs border border-gray-200 hover:shadow-md"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span className="hidden sm:inline">View</span>
                    </a>
                    <a
                      href={directionsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white font-semibold px-3 py-2 rounded-lg shadow-sm transition-all text-xs"
                    >
                      <Navigation className="w-3 h-3" />
                      <span className="hidden sm:inline">Directions</span>
                    </a>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg border border-gray-200 bg-gray-50">
                      <User2 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mb-5" />
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide block">
                          Name
                        </span>
                        <p className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                          {deal.pharmacy.name}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg border border-gray-200 bg-gray-50">
                      <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 mb-5" />
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide block">
                          License #
                        </span>
                        <p className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                          {deal.pharmacy.licenseNum}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg border border-gray-200 bg-gray-50">
                      <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 mb-5" />
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide block">
                          Phone
                        </span>
                        <p className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                          {deal.pharmacy.pharmacyPhone}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg border border-gray-200 bg-gray-50">
                      <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 mb-5" />
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide block">
                          Hours
                        </span>
                        <p className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                          {deal.pharmacy.startHour} - {deal.pharmacy.endHour}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg border border-gray-200 bg-gray-50">
                      <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 mb-5" />
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide block">
                          Address
                        </span>
                        <p className="font-semibold text-gray-900 text-xs sm:text-sm leading-relaxed">
                          {deal.pharmacy.addressLine1}{" "}
                          {deal.pharmacy.addressLine2}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 sm:gap-3">
                      <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg border border-gray-200 bg-gray-50">
                        <Building2 className="w-3 h-3 sm:w-4 sm:h-4 text-indigo-600 mb-5" />
                        <div className="flex-1 min-w-0">
                          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide block">
                            City
                          </span>
                          <p className="font-semibold text-gray-900 text-xs sm:text-sm truncate">
                            {deal.pharmacy.city}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg border border-gray-200 bg-gray-50">
                        <Globe className="w-3 h-3 sm:w-4 sm:h-4 text-teal-600 mb-5" />
                        <div className="flex-1 min-w-0">
                          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide block">
                            Governorate
                          </span>
                          <p className="font-semibold text-gray-900 text-xs sm:text-sm truncate">
                            {deal.pharmacy.governorate}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg border border-gray-200 bg-gray-50">
                      <Map className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 mb-5" />
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide block">
                          Zip Code
                        </span>
                        <p className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                          {deal.pharmacy.zipCode}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Doctor Information */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 sm:top-8">
              <Card className="shadow-sm border border-gray-200">
                <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 p-4 sm:p-6">
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <User2 className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                        Pharmacist Information
                      </h2>
                      <p className="text-xs sm:text-sm text-gray-600">
                        Deal posted by
                      </p>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col items-center text-center space-y-3 sm:space-y-4">
                    {/* Avatar with Status */}
                    <div className="relative">
                      <Avatar className="size-16 sm:size-20 shadow-md border-2 border-white">
                        {deal.postedBy.profilePhotoUrl ? (
                          <AvatarImage
                            src={deal.postedBy.profilePhotoUrl}
                            alt={deal.postedBy.fullName}
                          />
                        ) : (
                          <AvatarFallback className="bg-gradient-to-br from-primary to-primary-hover text-white text-sm sm:text-lg font-bold">
                            {initials}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      {deal.postedBy.isIdVerified && (
                        <div className="absolute -bottom-1 -right-1 bg-transparent rounded-full  p-1  ">
                          <div className="w-5 h-5 sm:w-6 sm:h-6 bg-green-500 rounded-full flex items-center justify-center">
                            <CheckCircle2
                              size={10}
                              className="text-white sm:w-3 sm:h-3"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Doctor Name and Verification */}
                    <div className="space-y-1 sm:space-y-2">
                      <div className="flex items-center justify-center gap-1 sm:gap-2">
                        <h3 className="text-base sm:text-lg font-bold text-gray-900">
                          {deal.postedBy.fullName}
                        </h3>
                        {deal.postedBy.isIdVerified && (
                          <Badge className="bg-green-100 text-green-700 border-green-200 text-xs">
                            <CheckCircle2 className="w-2 h-2 sm:w-3 sm:h-3 mr-1" />
                            <span className="sm:inline">Verified</span>
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600">
                        Professional Pharmacist
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="w-full space-y-2 sm:space-y-3">
                      <Button
                        onClick={handleChat}
                        className={`w-full bg-primary hover:bg-primary/80 text-white font-semibold px-4 sm:px-6 py-2 sm:py-3 rounded-lg shadow-sm transition-all text-xs sm:text-base flex items-center justify-center gap-2 ${
                          isOwner ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        disabled={isOwner}
                        title={
                          isOwner
                            ? "You cannot chat with yourself"
                            : `Chat with ${
                                deal.postedBy.fullName.split(" ")[0]
                              }`
                        }
                      >
                        <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="xl:inline">
                          Chat with {deal.postedBy.fullName.split(" ")[0]}
                        </span>
                      </Button>

                      <Button
                        onClick={handleProfile}
                        variant="outline"
                        className="w-full border border-primary text-primary hover:bg-primary/5 font-semibold px-4 sm:px-6 py-2 sm:py-3 rounded-lg shadow-sm transition-all text-xs sm:text-base flex items-center justify-center gap-2"
                        title="View all deals by this doctor"
                      >
                        <User2 className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="hidden sm:inline">View Profile</span>
                        <span className="sm:hidden">Profile</span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
