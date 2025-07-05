import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../store/useAuth";
import { getPharmacyById } from "../../api/pharmacies";
import ImageGallery from "../../components/PharmacyDetails/ImageGallery";
import PharmacyInfo from "../../components/PharmacyDetails/PharmacyInfo";
import PharmacyDetailsTable from "../../components/PharmacyDetails/PharmacyDetailsTable";
import MapSection from "../../components/PharmacyDetails/MapSection";
import OwnerInfo from "../../components/PharmacyDetails/OwnerInfo";
import ContactOptions from "../../components/PharmacyDetails/ContactOptions";
import DownloadButton from "../../components/PharmacyDetails/DownloadButton";
import AreaRatings from "../../components/PharmacyDetails/AreaRatings";
import RelatedListings from "../../components/PharmacyDetails/RelatedListings";

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
    return (
      <div className="flex justify-center items-center min-h-[60vh] text-blue-700 text-lg font-bold">
        Loading...
      </div>
    );
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
        <ImageGallery images={pharmacy.imagesUrls} />

        {/* Pharmacy info and owner info side by side */}
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <PharmacyInfo pharmacy={pharmacy} />
          </div>
          <div className="lg:w-80">
            <OwnerInfo owner={pharmacy.owner} />
          </div>
        </div>

        <PharmacyDetailsTable pharmacy={pharmacy} />
        <MapSection
          location={pharmacy.location}
          address={pharmacy.addressLine1}
        />
        <ContactOptions owner={pharmacy.owner} />
        <DownloadButton saleFileUrl={pharmacy.saleFileUrl} />
        {/* <AreaRatings /> */}
        <RelatedListings pharmacy={pharmacy} />
      </div>
    </div>
  );
}
