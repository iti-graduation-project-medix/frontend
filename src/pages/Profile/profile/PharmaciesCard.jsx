import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Accordion from "@/components/ui/Accordion";
import { FaClinicMedical } from "react-icons/fa";
import { RiCapsuleLine } from "react-icons/ri";
import { useAuth } from "../../../store/useAuth";
import { usePharmacies } from "../../../store/usePharmcies";
import ConfirmDialog from "./ConfirmDialog";
import { Link } from "react-router-dom";

export default function PharmaciesCard({pharmacistDetails}) {
  // Add null check and default values
  const details = pharmacistDetails || {};
  const {token, user} = useAuth();
  const { 
    pharmacies, 
    isLoading, 
    error, 
    fetchPharmacies, 
    deletePharmacyById,
    clearError 
  } = usePharmacies();

  // Modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [pharmacyToDelete, setPharmacyToDelete] = useState(null);

  useEffect(() => {
    if (user && token) {
      fetchPharmacies(token, user);
    }
  }, [user, token, fetchPharmacies]);

  const handleDeleteClick = (pharmacyId) => {
    setPharmacyToDelete(pharmacyId);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (pharmacyToDelete) {
      setShowDeleteModal(false);
      setPharmacyToDelete(null);
      try {
        await deletePharmacyById(pharmacyToDelete, token);
      } catch (error) {
        console.error('Failed to delete pharmacy:', error);
      }
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setPharmacyToDelete(null);
  };

  // Loading state
  if (isLoading) {
    return (
      <Card className="p-8 shadow-2xl rounded-2xl border border-gray-200 max-w-2xl mx-auto bg-white">
        <div className="flex items-center justify-center h-32">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-gray-600 text-sm">Loading pharmacies...</p>
          </div>
        </div>
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <Card className="p-8 shadow-2xl rounded-2xl border border-gray-200 max-w-2xl mx-auto bg-white">
        <div className="flex items-center justify-center h-32">
          <div className="text-center">
            <div className="text-red-500 mb-2">
              <FaClinicMedical size={32} className="mx-auto" />
            </div>
            <p className="text-red-600 mb-2 text-sm">{error}</p>
            <Button 
              onClick={() => {
                clearError();
                if (user && token) {
                  fetchPharmacies(token, user);
                }
              }}
              size="sm"
            >
              Try Again
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  // Defensive: always use an array
  const safePharmacies = Array.isArray(pharmacies) ? pharmacies : [];
  // Convert pharmacies to accordion items
  const accordionItems = safePharmacies.map((pharmacy) => ({
    title: (
      <span className="flex items-center gap-2">
        <RiCapsuleLine className="text-primary" size={18} />
        {pharmacy.name || 'Unnamed Pharmacy'}
      </span>
    ),
    content: (
      <div className="bg-gray-50 rounded-xl shadow-md p-6 border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
          <div className="flex flex-col gap-1 pb-2 border-b last:border-b-0">
            <span className="text-xs text-muted-foreground font-medium uppercase">Pharmacy Name</span>
            <span className="font-semibold text-base text-gray-900">
              {pharmacy.name || 'Not available'}
            </span>
          </div>
          <div className="flex flex-col gap-1 pb-2 border-b last:border-b-0">
            <span className="text-xs text-muted-foreground font-medium uppercase">License Number</span>
            <span className="font-semibold text-base text-gray-900">
              {pharmacy.licenseNum || 'Not available'}
            </span>
          </div>
          <div className="flex flex-col gap-1 pb-2 border-b last:border-b-0">
            <span className="text-xs text-muted-foreground font-medium uppercase">Contact Number</span>
            <span className="font-semibold text-base text-gray-900">
              {pharmacy.phone || pharmacy.contactNumber || 'Not available'}
            </span>
          </div>
          <div className="flex flex-col gap-1 pb-2 border-b last:border-b-0">
            <span className="text-xs text-muted-foreground font-medium uppercase">Address Line 1</span>
            <span className="font-semibold text-base text-gray-900">
              {pharmacy.addressLine1 || 'Not available'}
            </span>
          </div>
          <div className="flex flex-col gap-1 pb-2 border-b last:border-b-0">
            <span className="text-xs text-muted-foreground font-medium uppercase">Address Line 2</span>
            <span className="font-semibold text-base text-gray-900">
              {pharmacy.addressLine2 || 'Not available'}
            </span>
          </div>
          <div className="flex flex-col gap-1 pb-2 border-b last:border-b-0">
            <span className="text-xs text-muted-foreground font-medium uppercase">City</span>
            <span className="font-semibold text-base text-gray-900">
              {pharmacy.city || 'Not available'}
            </span>
          </div>
          <div className="flex flex-col gap-1 pb-2 border-b last:border-b-0">
            <span className="text-xs text-muted-foreground font-medium uppercase">State</span>
            <span className="font-semibold text-base text-gray-900">
              {pharmacy.state || 'Not available'}
            </span>
          </div>
          <div className="flex flex-col gap-1 pb-2 border-b last:border-b-0">
            <span className="text-xs text-muted-foreground font-medium uppercase">Zip Code</span>
            <span className="font-semibold text-base text-gray-900">
              {pharmacy.zipCode || 'Not available'}
            </span>
          </div>
        </div>
        {pharmacy.operatingHours && (
          <div className="pt-4 flex items-center gap-2">
            <span className="font-semibold">Operating Hours:</span>
            <span className="text-base text-gray-900">{pharmacy.operatingHours}</span>
          </div>
        )}
        <div className="pt-6 flex justify-end gap-2">
          <Button 
            className="px-5 py-2 rounded-md text-sm h-9 font-semibold"
            variant="outline"
          >
            Edit Pharmacy
          </Button>
          <Button 
            className="px-5 py-2 rounded-md text-sm h-9 font-semibold"
            variant="destructive"
            onClick={() => handleDeleteClick(pharmacy.id)}
          >
            Delete
          </Button>
        </div>
      </div>
    ),
  }));

  return (
    <Card className="p-8 shadow-2xl rounded-2xl border border-gray-200 max-w-2xl mx-auto bg-white">
      <ConfirmDialog
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        title="Delete Pharmacy"
        description="Are you sure you want to delete this pharmacy?"
        onConfirm={handleConfirmDelete}
        confirmText="Delete"
        cancelText="Cancel"
      />
      <CardHeader className="pb-2 border-b mb-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <span className="inline-flex items-center gap-3 font-bold text-xl tracking-wide">
            <span className="inline-flex items-center justify-center rounded-full bg-primary/10 shadow-sm" style={{ width: 36, height: 36 }}>
              <FaClinicMedical size={20} className="text-primary" />
            </span>
            My Pharmacies
          </span>
          <Link to="/deal-form" className="bg-primary text-white px-5 py-2 rounded-md text-sm h-9 font-semibold">Add Pharmacy</Link>
        </div>
        <span className="text-xs text-muted-foreground mt-2 block">
          Note: At max 2 pharmacies can be added to each doctor. 
          {safePharmacies.length > 0 && ` (${safePharmacies.length} pharmacy${safePharmacies.length > 1 ? 'ies' : 'y'} added)`}
        </span>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-col gap-8">
          {safePharmacies.length === 0 ? (
            <div className="text-center py-8">
              <FaClinicMedical size={48} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">No pharmacies added yet</p>
              <p className="text-sm text-gray-400">Click "Add Pharmacy" to get started</p>
            </div>
          ) : (
            <Accordion items={accordionItems} />
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-center gap-2 pt-6">
        <span className="text-muted-foreground text-sm flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m-9 4v8" />
          </svg>
          For any assistance with your pharmacies, please contact support.
        </span>
      </CardFooter>
    </Card>
  );
} 