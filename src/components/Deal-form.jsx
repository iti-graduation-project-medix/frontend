import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar28 } from "./DatePicker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UploadCloud, XCircle, Search, Loader2, Package, Hash, Calendar, PoundSterling, FileText, Building2, Box, Tag } from "lucide-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import { usePharmacies } from "@/store/usePharmcies";
import { useAuth } from "@/store/useAuth";
import { useDeals } from "@/store/useDeals";
import { fetchDrugs } from "@/api/drugs";
import { useDebounce } from "@/hooks/useDebounce";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { ErrorMessage } from "@/components/ui/error-display";

let dealSchema = Yup.object().shape({
  medicineName: Yup.string().required("Medicine name is required"),
  quantity: Yup.number()
    .required("Quantity is required")
    .positive("Quantity must be positive")
    .integer("Quantity must be a whole number"),
  expiryDate: Yup.date()
    .required("Expiry date is required")
    .min(new Date(), "Expiry date must be in the future"),
  description: Yup.string()
    .required("Description is required")
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must be at most 500 characters"),
  pharmacyId: Yup.string().required("Pharmacy is required"),
  boxStatus: Yup.string().required("Box status is required"),
  dealType: Yup.string().required("Deal type is required"),
  minPrice: Yup.number()
    .required("Minimum price is required")
    .positive("Minimum price must be positive")
    .min(1, "Minimum price must be at least 1"),
  medicineType: Yup.string().required("Medicine type is required"),
});

// Edit mode schema - only validates editable fields
let editDealSchema = Yup.object().shape({
  quantity: Yup.number()
    .required("Quantity is required")
    .positive("Quantity must be positive")
    .integer("Quantity must be a whole number"),
  description: Yup.string()
    .required("Description is required")
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must be at most 500 characters"),
  dealType: Yup.string().required("Deal type is required"),
  minPrice: Yup.number()
    .required("Minimum price is required")
    .positive("Minimum price must be positive")
    .min(1, "Minimum price must be at least 1"),
});

export function DealForm({ className, dealData: initialDealData, ...props }) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [drugs, setDrugs] = React.useState([]);
  const [filteredDrugs, setFilteredDrugs] = React.useState([]);
  const [isLoadingDrugs, setIsLoadingDrugs] = React.useState(false);
  const [isSelectOpen, setIsSelectOpen] = React.useState(false);
  const [dealData, setDealData] = React.useState(initialDealData);
  const { pharmacies, fetchPharmacies } = usePharmacies();
  const { user, token } = useAuth();
  const { createDeal, updateDeal, fetchDeal, isSubmitting, error, clearError } =
    useDeals();
  const { id } = useParams();
  const navigate = useNavigate();

  const isEditMode = !!id;

  const searchDrugs = React.useCallback(
    async (searchValue) => {
      if (!token) {
        console.log("No token available for search");
        return;
      }

      try {
        console.log("Searching for:", searchValue);
        setIsLoadingDrugs(true);
        const response = await fetchDrugs(token, {
          search: searchValue,
          size: 20,
        });
        console.log("Search response:", response);
        const fetchedDrugs = response.data?.drugs || [];
        console.log("Search results:", fetchedDrugs);
        setFilteredDrugs(fetchedDrugs);
      } catch (error) {
        console.error("Error searching drugs:", error);
        setFilteredDrugs([]);
      } finally {
        setIsLoadingDrugs(false);
      }
    },
    [token]
  );

  // Debounced search function
  const debouncedSearch = useDebounce(searchDrugs, 300);

  // Load initial drugs when component mounts
  React.useEffect(() => {
    const loadInitialDrugs = async () => {
      if (!token) {
        console.log("No token available, skipping initial drug load");
        return;
      }

      try {
        console.log("Loading initial drugs...");
        setIsLoadingDrugs(true);
        const response = await fetchDrugs(token, { size: 20 });
        console.log("Initial drugs response:", response);
        const fetchedDrugs = response.data?.drugs || [];
        console.log("Fetched drugs:", fetchedDrugs);
        setDrugs(fetchedDrugs);
        setFilteredDrugs(fetchedDrugs);
      } catch (error) {
        console.error("Error loading initial drugs:", error);
        setDrugs([]);
        setFilteredDrugs([]);
      } finally {
        setIsLoadingDrugs(false);
      }
    };

    loadInitialDrugs();
  }, [token]);

  // Handle search term changes
  React.useEffect(() => {
    if (searchTerm.trim()) {
      debouncedSearch(searchTerm);
    } else {
      // When search is cleared, show all drugs
      setFilteredDrugs(drugs);
    }
  }, [searchTerm, drugs, debouncedSearch]);

  React.useEffect(() => {
    if (token && user) {
      // Extract user ID from user object
      const userId = user?.id || user;
      if (userId) {
        fetchPharmacies(token, userId);
      }
    }
  }, [token, user, fetchPharmacies]);

  // Update dealData when prop changes
  useEffect(() => {
    setDealData(initialDealData);
  }, [initialDealData]);

  // Handle form submission
  const handleSubmit = async (values) => {
    try {
      // Clear any previous errors
      clearError();

      if (isEditMode) {
        // Update existing deal - only send editable fields
        const updateData = {
          quantity: parseInt(values.quantity),
          price: parseFloat(values.minPrice),
          description: values.description,
          dealType: values.dealType,
        };

        console.log("Updating deal data:", updateData);
        await updateDeal(id, updateData);

        toast.success("Deal has been successfully updated!");

        // Navigate back to deals page
        navigate("/deals");
      } else {
        // Create new deal
        const dealData = {
          medicineName: values.medicineName,
          quantity: parseInt(values.quantity),
          expiryDate: values.expiryDate,
          price: parseFloat(values.minPrice),
          description: values.description,
          pharmacyId: values.pharmacyId,
          boxStatus: values.boxStatus,
          dealType: values.dealType,
          dosageForm: values.medicineType,
        };

        console.log("Submitting deal data:", dealData);
        await createDeal(dealData);

        toast.success("Deal has been successfully posted!");

        // Navigate to my deals page
        navigate("/my-deals");
      }
    } catch (error) {
      console.error("Error handling deal:", error);

      toast.error(
        isEditMode ? "Failed to update deal" : "Failed to post deal"
      );

      throw error;
    }
  };

  const formik = useFormik({
    initialValues: {
      medicineName: dealData?.medicineName || "",
      quantity: dealData?.quantity || "",
      expiryDate: dealData?.expiryDate ? new Date(dealData.expiryDate) : null,
      marketPrice: dealData?.marketPrice || "",
      minPrice: dealData?.price || "",
      medicineType: dealData?.dosageForm || "",
      description: dealData?.description || "",
      pharmacyId: dealData?.pharmacyId || "",
      boxStatus: dealData?.boxStatus || "",
      dealType: dealData?.dealType || "",
    },
    validationSchema: isEditMode ? editDealSchema : dealSchema,
    onSubmit: handleSubmit,
    validateOnMount: true,
    enableReinitialize: true,
  });





  return (
    <div className={cn("w-full", className)} {...props}>
      <Card className="overflow-hidden shadow-2xl border-0 rounded-3xl bg-gradient-to-br from-blue-50 via-white to-indigo-50 relative">
        {/* Decorative Elements */}
        <div
          className="absolute top-0 right-0 w-32 h-32 rounded-full -mr-16 -mt-16 opacity-10"
          style={{ background: "var(--primary)" }}
        ></div>
        <div
          className="absolute bottom-0 left-0 w-40 h-40 rounded-full -ml-20 -mb-20 opacity-10"
          style={{ background: "var(--primary)" }}
        ></div>

        <div className="relative p-8 md:p-10">
          <CardHeader className="px-0 pt-0">
            <CardTitle className="text-2xl font-bold text-foreground">
              {isEditMode ? "Edit Deal" : "Post Your Deal"}
            </CardTitle>
            <p className="text-muted-foreground text-sm mt-1">
              {isEditMode
                ? "Update your deal details below"
                : "Fill out the form below to post your medicine deal"}
            </p>
          </CardHeader>

          <form
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8"
            onSubmit={formik.handleSubmit}
          >
            {/* Medicine Selection - Read-only in edit mode */}
            <div className="space-y-2 col-span-2 md:col-span-1">
              <Label
                htmlFor="medicineName"
                className="font-semibold"
              >
                Medicine Name <span className="text-red-500">*</span>
              </Label>
              {isEditMode ? (
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10">
                    <Package className="w-5 h-5" />
                  </span>
                  <Input
                    value={formik.values.medicineName}
                    disabled
                    className="pl-10 border-gray-300 rounded-lg h-11 bg-gray-100 text-gray-600"
                  />
                </div>
              ) : (
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10">
                    <Package className="w-5 h-5" />
                  </span>
                  <Select
                    value={formik.values.medicineName}
                    onValueChange={(value) => {
                      formik.setFieldValue("medicineName", value);
                      setIsSelectOpen(false);
                    }}
                    onOpenChange={setIsSelectOpen}
                  >
                    <SelectTrigger className={cn(
                      "pl-10 border-gray-300 rounded-lg h-11 focus:border-primary focus:ring-1 focus:ring-primary bg-white/80 backdrop-blur-sm w-full",
                      formik.touched.medicineName && formik.errors.medicineName && "border-red-500"
                    )}>
                      <SelectValue placeholder="Select medicine" />
                    </SelectTrigger>
                    <SelectContent className="max-h-80 w-[400px]">
                      <div className="p-2">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <Input
                            placeholder="Search for medicine..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 border-gray-300 rounded-lg h-9 focus:border-primary focus:ring-1 focus:ring-primary bg-white"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                      </div>
                      <div className="max-h-60 overflow-y-auto">
                        {isLoadingDrugs ? (
                          <div className="flex items-center justify-center py-4">
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            <span className="text-sm text-gray-500">
                              {searchTerm.trim()
                                ? "Searching..."
                                : "Loading drugs..."}
                            </span>
                          </div>
                        ) : filteredDrugs.length > 0 ? (
                          filteredDrugs.map((drug) => (
                            <SelectItem key={drug.id} value={drug.drugName}>
                              <div>
                                <div className="font-medium">{drug.drugName}</div>
                              </div>
                            </SelectItem>
                          ))
                        ) : searchTerm.trim() ? (
                          <div className="py-4 text-center text-sm text-gray-500">
                            No drugs found for "{searchTerm}"
                          </div>
                        ) : drugs.length === 0 ? (
                          <div className="py-4 text-center text-sm text-gray-500">
                            No drugs available
                          </div>
                        ) : (
                          <div className="py-4 text-center text-sm text-gray-500">
                            Start typing to search for drugs
                          </div>
                        )}
                      </div>
                    </SelectContent>
                  </Select>
                </div>
              )}
              <ErrorMessage
                error={
                  formik.touched.medicineName && formik.errors.medicineName ? formik.errors.medicineName : null
                }
              />
            </div>

            {/* Quantity - Editable in both modes */}
            <div className="space-y-2 col-span-2 md:col-span-1">
              <Label htmlFor="quantity" className="font-semibold">
                Quantity <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10">
                  <Hash className="w-5 h-5" />
                </span>
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  placeholder="Enter quantity"
                  className={cn(
                    "pl-10 border-gray-300 rounded-lg h-9 focus:border-primary focus:ring-1 focus:ring-primary bg-white/80 backdrop-blur-sm",
                    formik.touched.quantity && formik.errors.quantity && "border-red-500"
                  )}
                  value={formik.values.quantity}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              <ErrorMessage
                error={
                  formik.touched.quantity && formik.errors.quantity ? formik.errors.quantity : null
                }
              />
            </div>

            {/* Medicine Type - Read-only in edit mode */}
            <div className="space-y-2 col-span-2 md:col-span-1">
              <Label
                htmlFor="medicineType"
                className="font-semibold"
              >
                Medicine Type <span className="text-red-500">*</span>
              </Label>
              {isEditMode ? (
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10">
                    <Tag className="w-5 h-5" />
                  </span>
                  <Input
                    value={formik.values.medicineType}
                    disabled
                    className="pl-10 border-gray-300 rounded-lg h-11 bg-gray-100 text-gray-600"
                  />
                </div>
              ) : (
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10">
                    <Tag className="w-5 h-5" />
                  </span>
                  <Select
                    value={formik.values.medicineType}
                    onValueChange={(value) =>
                      formik.setFieldValue("medicineType", value)
                    }
                  >
                    <SelectTrigger className={cn(
                      "pl-10 border-gray-300 rounded-lg h-11 focus:border-primary focus:ring-1 focus:ring-primary bg-white/80 backdrop-blur-sm w-full",
                      formik.touched.medicineType && formik.errors.medicineType && "border-red-500"
                    )}>
                      <SelectValue placeholder="Select medicine type" />
                    </SelectTrigger>
                    <SelectContent className="max-h-80 w-[400px]">
                      <SelectItem value="tablet">Tablet</SelectItem>
                      <SelectItem value="capsule">Capsule</SelectItem>
                      <SelectItem value="syrup">Syrup</SelectItem>
                      <SelectItem value="injection">Injection</SelectItem>
                      <SelectItem value="ointment">Ointment</SelectItem>
                      <SelectItem value="cream">Cream</SelectItem>
                      <SelectItem value="gel">Gel</SelectItem>
                      <SelectItem value="spray">Spray</SelectItem>
                      <SelectItem value="drops">Drops</SelectItem>
                      <SelectItem value="suppository">Suppository</SelectItem>
                      <SelectItem value="powder">Powder</SelectItem>
                      <SelectItem value="inhaler">Inhaler</SelectItem>
                      <SelectItem value="patch">Patch</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              <ErrorMessage
                error={
                  formik.touched.medicineType && formik.errors.medicineType ? formik.errors.medicineType : null
                }
              />
            </div>

            {/* Expiry Date - Read-only in edit mode */}
            <div className="space-y-2 col-span-2 md:col-span-1">
              <Label className="font-semibold">
                Expiry Date <span className="text-red-500">*</span>
              </Label>
              {isEditMode ? (
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Calendar className="w-5 h-5" />
                  </span>
                  <Input
                    value={
                      formik.values.expiryDate
                        ? new Date(formik.values.expiryDate).toLocaleDateString()
                        : ""
                    }
                    disabled
                    className="pl-10 border-gray-300 rounded-lg h-11 bg-gray-100 text-gray-600"
                  />
                </div>
              ) : (
                <div className={cn(
                  "bg-white/80 rounded-lg border border-gray-300",
                  formik.touched.expiryDate && formik.errors.expiryDate && "border-red-500"
                )}>
                  <Calendar28
                    value={formik.values.expiryDate}
                    onChange={(date) =>
                      formik.setFieldValue("expiryDate", date)
                    }
                  />
                </div>
              )}
              <ErrorMessage
                error={
                  formik.touched.expiryDate && formik.errors.expiryDate ? formik.errors.expiryDate : null
                }
              />
            </div>

            {/* Market Price - Read-only in both modes */}
            <div className="space-y-2 col-span-2 md:col-span-1">
              <Label
                htmlFor="marketPrice"
                className="font-semibold"
              >
                Market Price (EGP){" "}
                <span className="text-gray-400 text-xs">(Info only)</span>
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10">
                  <PoundSterling className="w-5 h-5" />
                </span>
                <Input
                  id="marketPrice"
                  name="marketPrice"
                  type="text"
                  disabled
                  placeholder="0.00"
                  className="pl-10 border-gray-300 rounded-lg h-9 focus:border-primary focus:ring-1 focus:ring-primary bg-white/80 backdrop-blur-sm"
                  value={formik.values.marketPrice}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
            </div>

            {/* Minimum Price - Editable in both modes */}
            <div className="space-y-2 col-span-2 mt-.5 md:col-span-1">
              <Label htmlFor="minPrice" className="font-semibold">
                Minimum Price (EGP) <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10">
                  <PoundSterling className="w-5 h-5" />
                </span>
                <Input
                  id="minPrice"
                  name="minPrice"
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="Enter minimum price"
                  className={cn(
                    "pl-10 border-gray-300 rounded-lg h-9 focus:border-primary focus:ring-1 focus:ring-primary bg-white/80 backdrop-blur-sm",
                    formik.touched.minPrice && formik.errors.minPrice && "border-red-500"
                  )}
                  value={formik.values.minPrice}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              <ErrorMessage
                error={
                  formik.touched.minPrice && formik.errors.minPrice ? formik.errors.minPrice : null
                }
              />
            </div>

            {/* Description - Editable in both modes */}
            <div className="space-y-2 col-span-2">
              <Label
                htmlFor="description"
                className="font-semibold"
              >
                Description <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <span className="absolute left-3 mt-2 text-gray-400 z-10">
                  <FileText className="w-5 h-5" />
                </span>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Describe your medicine, condition, reason for selling/exchanging..."
                  className={cn(
                    "pl-10 border-gray-300 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary bg-white/80 backdrop-blur-sm",
                    formik.touched.description && formik.errors.description && "border-red-500"
                  )}
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  rows={4}
                />
              </div>
              <p className="text-xs text-gray-500">
                {formik.values.description?.length || 0}/500 characters
              </p>
              <ErrorMessage
                error={
                  formik.touched.description && formik.errors.description ? formik.errors.description : null
                }
              />
            </div>

            {/* Pharmacy Select - Read-only in edit mode */}
            <div className="space-y-2 col-span-2 md:col-span-1">
              <Label htmlFor="pharmacyId" className="font-semibold">
                Pharmacy <span className="text-red-500">*</span>
              </Label>
              {isEditMode ? (
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10">
                    <Building2 className="w-5 h-5" />
                  </span>
                  <Input
                    value={
                      pharmacies.find((p) => p.id === formik.values.pharmacyId)
                        ?.name || ""
                    }
                    disabled
                    className="pl-10 border-gray-300 rounded-lg h-11 bg-gray-100 text-gray-600"
                  />
                </div>
              ) : (
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10">
                    <Building2 className="w-5 h-5" />
                  </span>
                  <Select
                    value={formik.values.pharmacyId}
                    onValueChange={(value) =>
                      formik.setFieldValue("pharmacyId", value)
                    }
                  >
                    <SelectTrigger className={cn(
                      "pl-10 border-gray-300 rounded-lg h-11 focus:border-primary focus:ring-1 focus:ring-primary bg-white/80 backdrop-blur-sm w-full",
                      formik.touched.pharmacyId && formik.errors.pharmacyId && "border-red-500"
                    )}>
                      <SelectValue
                        placeholder={
                          pharmacies && pharmacies.length > 0
                            ? "Select pharmacy"
                            : "No pharmacies found"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent className="max-h-80 w-[400px]">
                      {pharmacies &&
                        pharmacies.length > 0 &&
                        pharmacies.map((pharmacy) => (
                          <SelectItem key={pharmacy.id} value={pharmacy.id}>
                            {pharmacy.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <ErrorMessage
                error={
                  formik.touched.pharmacyId && formik.errors.pharmacyId ? formik.errors.pharmacyId : null
                }
              />
            </div>

            {/* Box Status Select - Read-only in edit mode */}
            <div className="space-y-2 col-span-2 md:col-span-1">
              <Label htmlFor="boxStatus" className="font-semibold">
                Medicine Box Status <span className="text-red-500">*</span>
              </Label>
              {isEditMode ? (
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10">
                    <Box className="w-5 h-5" />
                  </span>
                  <Input
                    value={formik.values.boxStatus}
                    disabled
                    className="pl-10 border-gray-300 rounded-lg h-11 bg-gray-100 text-gray-600"
                  />
                </div>
              ) : (
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10">
                    <Box className="w-5 h-5" />
                  </span>
                  <Select
                    value={formik.values.boxStatus}
                    onValueChange={(value) =>
                      formik.setFieldValue("boxStatus", value)
                    }
                  >
                    <SelectTrigger className={cn(
                      "pl-10 border-gray-300 rounded-lg h-11 focus:border-primary focus:ring-1 focus:ring-primary bg-white/80 backdrop-blur-sm w-full",
                      formik.touched.boxStatus && formik.errors.boxStatus && "border-red-500"
                    )}>
                      <SelectValue placeholder="Select box status" />
                    </SelectTrigger>
                    <SelectContent className="max-h-80 w-[400px]">
                      <SelectItem value="good">Good</SelectItem>
                      <SelectItem value="damaged">Damaged</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              <ErrorMessage
                error={
                  formik.touched.boxStatus && formik.errors.boxStatus ? formik.errors.boxStatus : null
                }
              />
            </div>

            {/* Deal Type - Editable in both modes */}
            <div className="space-y-2 col-span-2">
              <Label className="font-semibold">
                Deal Type <span className="text-red-500">*</span>
              </Label>
              <div className="space-y-2 flex flex-row gap-4 w-full">
                <div className={cn(
                  "flex items-center flex-row space-x-3 h-10 px-3 rounded-lg border-2 border-gray-300 transition-all w-full",
                  formik.values.dealType === "sell" && "border-primary bg-primary/5"
                )}>
                  <input
                    id="deal-sell"
                    name="dealType"
                    type="radio"
                    value="sell"
                    checked={formik.values.dealType === "sell"}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                  />
                  <Label
                    htmlFor="deal-sell"
                    className="text-sm font-medium text-gray-700 cursor-pointer"
                  >
                    Sell
                  </Label>
                </div>
                <div className={cn(
                  "flex items-center flex-row space-x-3 h-10 px-3 rounded-lg border-2 border-gray-300 transition-all w-full",
                  formik.values.dealType === "exchange" && "border-primary bg-primary/5"
                )}>
                  <input
                    id="deal-exchange"
                    name="dealType"
                    type="radio"
                    value="exchange"
                    checked={formik.values.dealType === "exchange"}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                  />
                  <Label
                    htmlFor="deal-exchange"
                    className="text-sm font-medium text-gray-700 cursor-pointer"
                  >
                    Exchange
                  </Label>
                </div>
                <div className={cn(
                  "flex items-center flex-row space-x-3 h-10 px-3 rounded-lg border-2 border-gray-300 transition-all w-full",
                  formik.values.dealType === "both" && "border-primary bg-primary/5"
                )}>
                  <input
                    id="deal-both"
                    name="dealType"
                    type="radio"
                    value="both"
                    checked={formik.values.dealType === "both"}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                  />
                  <Label
                    htmlFor="deal-both"
                    className="text-sm font-medium text-gray-700 cursor-pointer"
                  >
                    Both
                  </Label>
                </div>
              </div>
              <ErrorMessage
                error={
                  formik.touched.dealType && formik.errors.dealType ? formik.errors.dealType : null
                }
              />
            </div>

            {/* Submit Button */}
            <div className="col-span-2 pt-3">
              <Button
                type="submit"
                className={`w-full bg-primary hover:bg-primary-hover cursor-pointer text-white py-5 mb-10 text-base font-medium rounded-lg ${
                  !formik.isValid || isSubmitting
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                disabled={!formik.isValid || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    {isEditMode ? "Updating Deal..." : "Posting Deal..."}
                  </>
                ) : isEditMode ? (
                  "Update Deal"
                ) : (
                  "Post Deal"
                )}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}
