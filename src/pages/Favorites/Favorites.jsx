import React, { useState, useEffect, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import {
  Heart,
  Package,
  Building2,
  RefreshCw,
  BriefcaseMedical,
} from "lucide-react";
import { useFav } from "@/store/useFav";
import { useAuth } from "@/store/useAuth";
import MedicineDealCard from "@/components/MedicineDealCard";
import PharmacyCard from "@/pages/PharmaciesForSale/PharmacyCard";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function Favorites() {
  const [activeTab, setActiveTab] = useState("deals");
  const [visibleDeals, setVisibleDeals] = useState([]);
  const [visiblePharmacies, setVisiblePharmacies] = useState([]);
  const [dealsPage, setDealsPage] = useState(1);
  const [pharmaciesPage, setPharmaciesPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const ITEMS_PER_PAGE = 6;

  const { favorites, fetchFavorites, refreshFavorites, isLoading } = useFav();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Fetch favorites on component mount and when user changes
  useEffect(() => {
    if (user) {
      fetchFavorites();
    }
  }, [fetchFavorites, user]);

  // Lazy loading functions
  const loadMoreDeals = useCallback(() => {
    if (isLoadingMore) return;

    setIsLoadingMore(true);
    setTimeout(() => {
      const startIndex = (dealsPage - 1) * ITEMS_PER_PAGE;
      const endIndex = startIndex + ITEMS_PER_PAGE;
      const newDeals = favorites.deals.slice(startIndex, endIndex);

      setVisibleDeals((prev) => [...prev, ...newDeals]);
      setDealsPage((prev) => prev + 1);
      setIsLoadingMore(false);
    }, 300); // Simulate loading delay
  }, [dealsPage, favorites.deals, isLoadingMore]);

  const loadMorePharmacies = useCallback(() => {
    if (isLoadingMore) return;

    setIsLoadingMore(true);
    setTimeout(() => {
      const startIndex = (pharmaciesPage - 1) * ITEMS_PER_PAGE;
      const endIndex = startIndex + ITEMS_PER_PAGE;
      const newPharmacies = favorites.pharmacies.slice(startIndex, endIndex);

      setVisiblePharmacies((prev) => [...prev, ...newPharmacies]);
      setPharmaciesPage((prev) => prev + 1);
      setIsLoadingMore(false);
    }, 300); // Simulate loading delay
  }, [pharmaciesPage, favorites.pharmacies, isLoadingMore]);

  // Initialize visible items when favorites change or tab changes
  useEffect(() => {
    if (activeTab === "deals") {
      const initialDeals = favorites.deals.slice(0, ITEMS_PER_PAGE);
      setVisibleDeals(initialDeals);
      setDealsPage(2); // Next page will be 2
    } else {
      const initialPharmacies = favorites.pharmacies.slice(0, ITEMS_PER_PAGE);
      setVisiblePharmacies(initialPharmacies);
      setPharmaciesPage(2); // Next page will be 2
    }
  }, [favorites.deals, favorites.pharmacies, activeTab]);

  // Handle pharmacy card click
  const handlePharmacyClick = (pharmacy) => {
    navigate(`/pharmacies/${pharmacy.id}`);
  };

  // Check if user is authenticated
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-background text-gray-900 dark:text-foreground">
        <div className="text-center bg-white dark:bg-card rounded-xl shadow-lg p-8 border border-gray-100 dark:border-border">
          <Heart className="w-16 h-16 text-gray-300 dark:text-gray-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-600 dark:text-gray-200 mb-2">
            Authentication Required
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Please log in to view your favorites.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  dark:bg-background text-gray-900 dark:text-foreground">
      <section className="py-5 px-4 text-foreground dark:text-foreground">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold dark:text-foreground">
              My Favorites
            </h1>
            <button
              onClick={() => refreshFavorites()}
              disabled={isLoading}
              className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 dark:bg-card hover:bg-gray-200 dark:hover:bg-muted/10 rounded-lg transition-colors disabled:opacity-50 border border-gray-200 dark:border-border"
            >
              <RefreshCw
                className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
              />
              Refresh
            </button>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your favorite deals and pharmacies
          </p>
        </div>
      </section>

      <section className="px-4">
        <div className="max-w-7xl mx-auto">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <TabsList className="grid w-full grid-cols-2 mb-8 bg-gray-100 dark:bg-card border border-gray-200 dark:border-border rounded-xl overflow-hidden">
                <TabsTrigger
                  value="deals"
                  className="flex items-center gap-2 dark:text-foreground"
                >
                  <Package className="w-4 h-4" />
                  Deals ({favorites.deals.length})
                </TabsTrigger>
                <TabsTrigger
                  value="pharmacies"
                  className="flex items-center gap-2 dark:text-foreground"
                >
                  <Building2 className="w-4 h-4" />
                  Pharmacies ({favorites.pharmacies.length})
                </TabsTrigger>
              </TabsList>
            </motion.div>

            <TabsContent value="deals" className="space-y-6">
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="flex flex-col items-center justify-center py-12 space-y-6 bg-white dark:bg-background rounded-xl shadow border border-gray-100 dark:border-border"
                  >
                    {/* Animated Medical Icon */}
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{
                        repeat: Infinity,
                        duration: 1.5,
                        ease: "easeInOut",
                      }}
                      className="text-primary"
                    >
                      <BriefcaseMedical
                        className="w-14 h-14"
                        strokeWidth={2.5}
                      />
                    </motion.div>

                    {/* Loading Text */}
                    <motion.p
                      className="text-center text-base md:text-lg font-medium dark:text-foreground"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      Loading your favorite medications ... <br />
                      Please hold on
                    </motion.p>
                  </motion.div>
                ) : visibleDeals.length > 0 ? (
                  <div className="space-y-6">
                    <motion.div
                      key="deals-grid"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6"
                    >
                      {visibleDeals.map((deal, index) => (
                        <motion.div
                          key={deal.id}
                          initial={{ opacity: 0, y: 20, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{
                            duration: 0.3,
                            delay: index * 0.1,
                            ease: "easeOut",
                          }}
                        >
                          <MedicineDealCard deal={deal} />
                        </motion.div>
                      ))}
                    </motion.div>

                    {/* Load More Button for Deals */}
                    {visibleDeals.length < favorites.deals.length && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                        className="flex justify-center py-4"
                      >
                        <button
                          onClick={loadMoreDeals}
                          disabled={isLoadingMore}
                          className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow"
                        >
                          {isLoadingMore ? (
                            <>
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{
                                  duration: 1,
                                  repeat: Infinity,
                                  ease: "linear",
                                }}
                                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                              />
                              Loading...
                            </>
                          ) : (
                            <>
                              <Package className="w-4 h-4" />
                              Load More Deals (
                              {favorites.deals.length -
                                visibleDeals.length}{" "}
                              remaining)
                            </>
                          )}
                        </button>
                      </motion.div>
                    )}
                  </div>
                ) : favorites.deals.length === 0 ? (
                  <motion.div
                    key="empty-deals"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <Card className="p-8 text-center bg-white dark:bg-card border border-gray-100 dark:border-border shadow-lg">
                      <Package className="w-16 h-16 text-gray-300 dark:text-gray-500 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-200 mb-2">
                        No Favorite Deals
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 mb-4">
                        You haven't added any deals to your favorites yet.
                      </p>
                      <div>
                        <button
                          onClick={() => navigate("/deals")}
                          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors shadow"
                        >
                          Browse Deals
                        </button>
                      </div>
                    </Card>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </TabsContent>

            <TabsContent value="pharmacies" className="space-y-6">
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div
                    key="loading-pharmacies"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="flex flex-col items-center justify-center py-12 space-y-6 bg-white dark:bg-background rounded-xl shadow border border-gray-100 dark:border-border"
                  >
                    {/* Animated Medical Icon */}
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{
                        repeat: Infinity,
                        duration: 1.5,
                        ease: "easeInOut",
                      }}
                      className="text-primary"
                    >
                      <BriefcaseMedical
                        className="w-14 h-14"
                        strokeWidth={2.5}
                      />
                    </motion.div>
                    <motion.p
                      className="text-center text-base md:text-lg font-medium dark:text-foreground"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      Loading your favorite pharmacies ... <br />
                      Please hold on
                    </motion.p>
                  </motion.div>
                ) : visiblePharmacies.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                    {visiblePharmacies.map((pharmacy, index) => (
                      <motion.div
                        key={pharmacy.id}
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{
                          duration: 0.3,
                          delay: index * 0.1,
                          ease: "easeOut",
                        }}
                      >
                        <PharmacyCard
                          pharmacy={pharmacy}
                          onViewDetails={handlePharmacyClick}
                        />
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <motion.div
                    key="empty-pharmacies"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <Card className="p-8 text-center bg-white dark:bg-card border border-gray-100 dark:border-border shadow-lg">
                      <Building2 className="w-16 h-16 text-gray-300 dark:text-gray-500 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-200 mb-2">
                        No Favorite Pharmacies
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 mb-4">
                        You haven't added any pharmacies to your favorites yet.
                      </p>
                      <div>
                        <button
                          onClick={() => navigate("/pharmacies")}
                          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors shadow"
                        >
                          Browse Pharmacies for Sale
                        </button>
                      </div>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
}
