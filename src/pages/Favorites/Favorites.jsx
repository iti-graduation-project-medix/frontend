import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Heart, Package, Building2, RefreshCw } from "lucide-react";
import { useFav } from "@/store/useFav";
import { useAuth } from "@/store/useAuth";
import MedicineDealCard from "@/components/MedicineDealCard";
import PharmacyCard from "@/pages/PharmaciesForSale/PharmacyCard";
import { useNavigate } from "react-router-dom";

export default function Favorites() {
  const [activeTab, setActiveTab] = useState("deals");
  const { favorites, fetchFavorites, refreshFavorites, isLoading } = useFav();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Fetch favorites on component mount and when user changes
  useEffect(() => {
    if (user) {
      fetchFavorites();
    }
  }, [fetchFavorites, user]);

  // Handle pharmacy card click
  const handlePharmacyClick = (pharmacy) => {
    navigate(`/pharmacies-for-sale/${pharmacy.id}`);
  };

  // Check if user is authenticated
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-600 mb-2">
            Authentication Required
          </h2>
          <p className="text-gray-500">Please log in to view your favorites.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <section className="py-5 px-4 text-foreground">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold">My Favorites</h1>
            <button
              onClick={() => refreshFavorites()}
              disabled={isLoading}
              className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
            >
              <RefreshCw
                className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
              />
              Refresh
            </button>
          </div>
          <p className="text-gray-600">
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
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="deals" className="flex items-center gap-2">
                <Package className="w-4 h-4" />
                Deals ({favorites.deals.length})
              </TabsTrigger>
              <TabsTrigger
                value="pharmacies"
                className="flex items-center gap-2"
              >
                <Building2 className="w-4 h-4" />
                Pharmacies ({favorites.pharmacies.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="deals" className="space-y-6">
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="text-gray-500 mt-2">Loading favorites...</p>
                </div>
              ) : favorites.deals.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {favorites.deals.map((deal) => (
                    <MedicineDealCard key={deal.id} deal={deal} />
                  ))}
                </div>
              ) : (
                <Card className="p-8 text-center">
                  <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">
                    No Favorite Deals
                  </h3>
                  <p className="text-gray-500 mb-4">
                    You haven't added any deals to your favorites yet.
                  </p>
                  <button
                    onClick={() => navigate("/all-deals")}
                    className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Browse Deals
                  </button>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="pharmacies" className="space-y-6">
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="text-gray-500 mt-2">Loading favorites...</p>
                </div>
              ) : favorites.pharmacies.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {favorites.pharmacies.map((pharmacy) => (
                    <PharmacyCard
                      key={pharmacy.id}
                      pharmacy={pharmacy}
                      onViewDetails={handlePharmacyClick}
                    />
                  ))}
                </div>
              ) : (
                <Card className="p-8 text-center">
                  <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">
                    No Favorite Pharmacies
                  </h3>
                  <p className="text-gray-500 mb-4">
                    You haven't added any pharmacies to your favorites yet.
                  </p>
                  <button
                    onClick={() => navigate("/pharmacies-for-sale")}
                    className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Browse Pharmacies
                  </button>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
}
