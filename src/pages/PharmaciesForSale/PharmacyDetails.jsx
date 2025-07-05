import React, { useEffect, useState, Suspense, lazy } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../store/useAuth";
import { getPharmacyById } from "../../api/pharmacies";

// Lazy load components for better performance
const ImageGallery = lazy(() =>
  import("../../components/PharmacyDetails/ImageGallery")
);
const PharmacyInfo = lazy(() =>
  import("../../components/PharmacyDetails/PharmacyInfo")
);
const PharmacyDetailsTable = lazy(() =>
  import("../../components/PharmacyDetails/PharmacyDetailsTable")
);
const MapSection = lazy(() =>
  import("../../components/PharmacyDetails/MapSection")
);
const OwnerInfo = lazy(() =>
  import("../../components/PharmacyDetails/OwnerInfo")
);
const ContactOptions = lazy(() =>
  import("../../components/PharmacyDetails/ContactOptions")
);
const DownloadButton = lazy(() =>
  import("../../components/PharmacyDetails/DownloadButton")
);
const AreaRatings = lazy(() =>
  import("../../components/PharmacyDetails/AreaRatings")
);
const RelatedListings = lazy(() =>
  import("../../components/PharmacyDetails/RelatedListings")
);

// Loading Skeleton Component
const LoadingSkeleton = () => (
  <div className="min-h-screen bg-background py-6 px-2 sm:px-4 flex flex-col items-center">
    <div className="w-full max-w-6xl flex flex-col gap-8">
      {/* Image Gallery Skeleton */}
      <div className="w-full h-96 bg-gray-200 rounded-xl animate-pulse"></div>

      {/* Pharmacy Info and Owner Info Skeleton */}
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          <div className="h-32 bg-gray-200 rounded-xl animate-pulse"></div>
        </div>
        <div className="lg:w-80 flex justify-end">
          <div className="w-80 h-48 bg-gray-200 rounded-xl animate-pulse"></div>
        </div>
      </div>

      {/* Details Table Skeleton */}
      <div className="h-48 bg-gray-200 rounded-xl animate-pulse"></div>

      {/* Map Skeleton */}
      <div className="h-64 bg-gray-200 rounded-xl animate-pulse"></div>

      {/* Download Button Skeleton */}
      <div className="h-16 bg-gray-200 rounded-xl animate-pulse"></div>

      {/* Related Listings Skeleton */}
      <div className="h-64 bg-gray-200 rounded-xl animate-pulse"></div>
    </div>
  </div>
);

// Component Wrapper with Suspense
const SuspenseWrapper = ({ children }) => (
  <Suspense
    fallback={<div className="h-32 bg-gray-200 rounded-xl animate-pulse"></div>}
  >
    {children}
  </Suspense>
);

export default function PharmacyDetails() {
  const { id } = useParams();
  const isAuthenticated = useAuth((state) => state.isAuthenticated);
  const [pharmacy, setPharmacy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id || !isAuthenticated) return;
    setLoading(true);
    setError("");
    getPharmacyById(id)
      .then((data) => {
        setPharmacy(data.data?.pharmacy || null);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to load pharmacy details");
        setLoading(false);
      });
  }, [id, isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] text-blue-700 text-lg font-bold">
        Checking authentication...
      </div>
    );
  }

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] text-red-600 text-lg font-bold">
        {error}
      </div>
    );
  }

  if (!pharmacy) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] text-gray-500 text-lg font-bold">
        No pharmacy found with this ID.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-6 px-2 sm:px-4 flex flex-col items-center">
      <div className="w-full max-w-6xl flex flex-col gap-8">
        <SuspenseWrapper>
          <ImageGallery images={pharmacy.imagesUrls} />
        </SuspenseWrapper>

        {/* Pharmacy info and owner info side by side */}
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <SuspenseWrapper>
              <PharmacyInfo pharmacy={pharmacy} />
            </SuspenseWrapper>
          </div>
          <div className="lg:w-80 flex justify-end">
            <SuspenseWrapper>
              <OwnerInfo owner={pharmacy.owner} />
            </SuspenseWrapper>
          </div>
        </div>

        <SuspenseWrapper>
          <PharmacyDetailsTable pharmacy={pharmacy} />
        </SuspenseWrapper>

        <SuspenseWrapper>
          <MapSection
            location={pharmacy.location}
            address={pharmacy.addressLine1}
          />
        </SuspenseWrapper>

        <SuspenseWrapper>
          <ContactOptions owner={pharmacy.owner} />
        </SuspenseWrapper>

        <SuspenseWrapper>
          <DownloadButton saleFileUrl={pharmacy.saleFileUrl} />
        </SuspenseWrapper>

        {/* <SuspenseWrapper>
          <AreaRatings />
        </SuspenseWrapper> */}

        <SuspenseWrapper>
          <RelatedListings pharmacy={pharmacy} />
        </SuspenseWrapper>
      </div>
    </div>
  );
}
