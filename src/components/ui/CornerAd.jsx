import React, { useState, useEffect } from "react";
import { X, ExternalLink, Star } from "lucide-react";
import { Button } from "./button";
import { Badge } from "./badge";
import { getAllAds } from "../../api/ads";

const CornerAd = ({ position = "dealDetails" }) => {
  const [ads, setAds] = useState([]);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(true);

  // Check sessionStorage on mount to see if ad was closed for this page/position
  useEffect(() => {
    const adKey = `cornerAdClosed_${position}`;
    if (sessionStorage.getItem(adKey) === "true") {
      setIsVisible(false);
      setShowModal(false);
    }
  }, [position]);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    getAllAds()
      .then((allAds) => {
        if (!isMounted) return;
        // Filter ads by position prop
        const filtered = allAds.filter((ad) =>
          Array.isArray(ad.targetPosition)
            ? ad.targetPosition.includes(position)
            : ad.targetPosition === position
        );
        setAds(filtered);
        setCurrentAdIndex(0);
        setLoading(false);
      })
      .catch(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, [position]);

  useEffect(() => {
    if (ads.length > 1) {
      const interval = setInterval(() => {
        setCurrentAdIndex((prev) => (prev + 1) % ads.length);
      }, 5000); // Change ad every 5 seconds
      return () => clearInterval(interval);
    }
  }, [ads.length]);

  if (loading || !isVisible || !ads.length || !showModal) return null;

  const currentAd = ads[currentAdIndex] || ads[0];

  const handleClose = () => {
    setIsVisible(false);
    setShowModal(false);
    // Set sessionStorage flag for this page/position
    const adKey = `cornerAdClosed_${position}`;
    sessionStorage.setItem(adKey, "true");
  };

  const handleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleClick = () => {
    if (currentAd.companyUrl) {
      window.open(currentAd.companyUrl, "_blank");
    }
  };

  // Modal overlay
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60">
      <div
        className={`bg-white dark:bg-card rounded-2xl shadow-2xl border border-gray-200 dark:border-border overflow-hidden transition-all duration-300 w-[98vw] max-w-2xl animate-fade-in-up`}
        style={{ boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)" }}
      >
        {/* Header */}
        <div className="relative">
          <img
            src={currentAd.imageUrl}
            alt={currentAd.title}
            className="w-full h-56 object-cover"
          />{" "}
          <div className="absolute top-2 left-2 flex items-center gap-2">
            <span className="bg-yellow-400 text-xs font-bold text-gray-900 px-2 py-0.5 rounded-full shadow-sm">
              Sponsored
            </span>
            {currentAd.companyName && (
              <span className="bg-white/80 dark:bg-card/80 text-xs font-semibold text-primary px-2 py-0.5 rounded shadow-sm border border-primary/20">
                {currentAd.companyName}
              </span>
            )}
          </div>
          <div className="absolute top-2 right-2 flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="h-6 w-6 p-0 bg-white/90 dark:bg-card/90 hover:bg-white dark:hover:bg-muted/20"
              aria-label="Close Ad"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col gap-2">
          <h3 className="font-bold text-lg text-gray-900 dark:text-foreground mb-1">
            {currentAd.title}
          </h3>
          <p className="text-xs text-gray-600 dark:text-gray-300 mb-2 line-clamp-3">
            {currentAd.description}
          </p>
          {currentAd.companyUrl && (
            <Button
              onClick={handleClick}
              className="w-full h-10 text-base font-semibold bg-primary hover:bg-primary-hover text-white rounded-lg shadow-md mt-1"
              size="md"
            >
              Learn More
            </Button>
          )}
        </div>

        {/* Dots indicator */}
        {ads.length > 1 && (
          <div className="flex justify-center gap-1 pb-3">
            {ads.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentAdIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentAdIndex
                    ? "bg-primary dark:bg-primary"
                    : "bg-gray-300 dark:bg-muted"
                }`}
                aria-label={`Go to ad ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
      <style>{`
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(40px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fade-in-up 0.5s cubic-bezier(.4,0,.2,1) both; }
      `}</style>
    </div>
  );
};

export default CornerAd;
