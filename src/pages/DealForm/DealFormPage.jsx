import React from "react";
import { DealForm } from "../../components/Deal-form";
import { useParams } from "react-router-dom";
import { LoadingPage } from "../../components/ui/loading";
import { useDeals } from "../../store/useDeals";
import { useAuth } from "../../store/useAuth";

export default function DealFormPage() {
  const { id } = useParams();
  const isEditMode = !!id;
  const { fetchDeal } = useDeals();
  const { token } = useAuth();
  const [isLoadingDeal, setIsLoadingDeal] = React.useState(false);
  const [dealData, setDealData] = React.useState(null);

  // Load deal data for edit mode
  React.useEffect(() => {
    const loadDealData = async () => {
      if (!isEditMode || !id || !token) return;

      try {
        setIsLoadingDeal(true);
        const response = await fetchDeal(id);
        const loadedDealData = response.data?.deal || response.data || response;
        setDealData(loadedDealData);
      } catch (error) {
        console.error("Error loading deal data:", error);
      } finally {
        setIsLoadingDeal(false);
      }
    };

    loadDealData();
  }, [id, token, isEditMode, fetchDeal]);

  // Show loading state while fetching deal data
  if (isEditMode && isLoadingDeal) {
    return (
      <div className="my-50 flex items-center justify-center">
        <LoadingPage message="Loading deal form..." />
      </div>
    );
  }

  return (
    <div className="min-h-svh">
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-7xl">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl text-primary md:text-4xl font-bold mb-3">
            {isEditMode ? "Edit Your Medicine Deal" : "Post Your Medicine Deal"}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {isEditMode 
              ? "Update your deal details to keep your listing current and accurate"
              : "Share your medicine deals with our community. Connect with buyers and sellers in the medical marketplace"
            }
          </p>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row items-start justify-center gap-8 lg:gap-12">
          {/* Right Side - Form Section */}
          <div className="w-full lg:w-7/12">
            <DealForm dealData={dealData} />
          </div>
        </div>
      </div>
    </div>
  );
}
