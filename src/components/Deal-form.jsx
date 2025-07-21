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
import {
  UploadCloud,
  XCircle,
  Search,
  Loader2,
  Package,
  Hash,
  Calendar,
  PoundSterling,
  FileText,
  Building2,
  Box,
  Tag,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import { usePharmacies } from "@/store/usePharmcies";
import { useAuth } from "@/store/useAuth";
import { useDeals } from "@/store/useDeals";
import { fetchDrugs } from "@/api/drugs";
import { getRemainingDeals } from "@/api/deals";
import { useDebounce } from "@/hooks/useDebounce";
import { useParams, useNavigate, Link } from "react-router-dom";
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
  const [remainingDeals, setRemainingDeals] = React.useState(null);
  const [isLoadingRemainingDeals, setIsLoadingRemainingDeals] =
    React.useState(true);
  const { pharmacies, fetchPharmacies } = usePharmacies();
  const { user, token } = useAuth();
  const { createDeal, updateDeal, fetchDeal, isSubmitting, error, clearError } =
    useDeals();
  const { id } = useParams();
  const navigate = useNavigate();

  const isEditMode = !!id;

  // Check remaining deals on component mount (only for new deals)
  React.useEffect(() => {
    const checkRemainingDeals = async () => {
      if (isEditMode) {
        setIsLoadingRemainingDeals(false);
        return;
      }

      try {
        setIsLoadingRemainingDeals(true);
        const response = await getRemainingDeals();
        setRemainingDeals(response.data.remainingDeals);

        if (response.data.remainingDeals === 0) {
          toast.error(
            "You have no remaining deals. Please upgrade your subscription to post more deals."
          );
        }
      } catch (error) {
        console.error("Error fetching remaining deals:", error);
        toast.error("Failed to check remaining deals. Please try again.");
      } finally {
        setIsLoadingRemainingDeals(false);
      }
    };

    checkRemainingDeals();
  }, [isEditMode]);

  // Get subscription info for progress calculation
  const [subscriptionInfo, setSubscriptionInfo] = React.useState(null);

  React.useEffect(() => {
    const getSubscriptionInfo = async () => {
      if (isEditMode) return;

      try {
        const response = await getRemainingDeals();
        setSubscriptionInfo({
          plan: response.data.plan,
          planName: response.data.planName,
          totalDeals: response.data.plan === "monthly" ? 10 : 120,
        });
      } catch (error) {
        console.error("Error fetching subscription info:", error);
      }
    };

    getSubscriptionInfo();
  }, [isEditMode]);

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
      // Check remaining deals before submission (only for new deals)
      if (!isEditMode && remainingDeals !== null && remainingDeals <= 0) {
        toast.error(
          "You have no remaining deals. Please upgrade your subscription to post more deals."
        );
        return;
      }
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

      toast.error(isEditMode ? "Failed to update deal" : "Failed to post deal");

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
      <Card className="overflow-hidden shadow-2xl border-0 rounded-3xl bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-background dark:via-background dark:to-background relative">
        {/* Decorative Elements */}
        <div
          className="absolute top-0 right-0 w-16 h-16 md:w-32 md:h-32 rounded-full -mr-8 -mt-8 md:-mr-16 md:-mt-16 opacity-10 dark:opacity-20"
          style={{ background: "var(--primary)" }}
        ></div>
        <div
          className="absolute bottom-0 left-0 w-20 h-20 md:w-40 md:h-40 rounded-full -ml-10 -mb-10 md:-ml-20 md:-mb-20 opacity-10 dark:opacity-20"
          style={{ background: "var(--primary)" }}
        ></div>

        <div className="relative p-4 sm:p-6 md:p-8 lg:p-10">
          <CardHeader className="px-0 pt-0">
            <CardTitle className="text-xl sm:text-2xl font-bold text-foreground dark:text-foreground">
              {isEditMode ? "Edit Deal" : "Post Your Deal"}
            </CardTitle>
            <p className="text-muted-foreground text-xs sm:text-sm mt-1 dark:text-gray-400">
              {isEditMode
                ? "Update your deal details below"
                : "Fill out the form below to post your medicine deal"}
            </p>

            {/* Remaining Deals Info */}
            {!isEditMode && (
              <div className="mt-4 sm:mt-6">
                {isLoadingRemainingDeals ? (
                  <div className="flex items-center justify-center gap-2 sm:gap-3 p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-xl dark:bg-blue-900/30 dark:border-blue-900">
                    <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin text-blue-600 dark:text-blue-300" />
                    <span className="text-blue-700 font-medium text-xs sm:text-sm dark:text-blue-200">
                      Checking your remaining deals...
                    </span>
                  </div>
                ) : remainingDeals !== null ? (
                  remainingDeals === 0 ? (
                    // No remaining deals - Enhanced design
                    <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl p-4 sm:p-6 shadow-sm dark:from-red-900 dark:to-orange-900 dark:border-red-900">
                      <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
                        <div className="flex-shrink-0 flex justify-center sm:justify-start">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-full flex items-center justify-center dark:bg-red-900/60">
                            <AlertCircle className="h-5 w-5 sm:h-6 sm:w-6 text-red-600 dark:text-red-300" />
                          </div>
                        </div>
                        <div className="flex-1 text-center sm:text-left">
                          <h3 className="text-base sm:text-lg font-semibold text-red-800 mb-2 dark:text-red-200">
                            No Remaining Deals
                          </h3>
                          <p className="text-red-700 mb-3 sm:mb-4 text-xs sm:text-sm leading-relaxed dark:text-red-300">
                            You've used all your available deals for this
                            period. Upgrade your subscription to post more deals
                            and reach more customers.
                          </p>
                          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
                            <Link
                              to="/subscription"
                              className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-3 sm:px-4 py-2 rounded-lg font-medium text-xs sm:text-sm transition-colors shadow-sm w-full sm:w-auto justify-center dark:bg-red-700 dark:hover:bg-red-800"
                            >
                              <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4" />
                              Upgrade Subscription
                            </Link>
                            <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded-md dark:text-red-200 dark:bg-red-900/60">
                              Premium plans available
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Has remaining deals - Enhanced design
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 sm:p-6 shadow-sm dark:from-green-900 dark:to-emerald-900 dark:border-green-900">
                      <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
                        <div className="flex-shrink-0 flex justify-center sm:justify-start">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center dark:bg-green-900/60">
                            <Package className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 dark:text-green-300" />
                          </div>
                        </div>
                        <div className="flex-1 text-center sm:text-left">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                            <h3 className="text-base sm:text-lg font-semibold text-green-800 dark:text-green-200">
                              Deals Available
                            </h3>
                            <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                              <span className="bg-green-100 text-green-800 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium dark:bg-green-900/60 dark:text-green-200">
                                {remainingDeals}{" "}
                                {remainingDeals === 1 ? "deal" : "deals"} left
                              </span>
                              {subscriptionInfo && (
                                <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-md dark:text-green-200 dark:bg-green-900/60">
                                  {subscriptionInfo.planName} (
                                  {subscriptionInfo.plan})
                                </span>
                              )}
                            </div>
                          </div>
                          <p className="text-green-700 text-xs sm:text-sm leading-relaxed mb-3 dark:text-green-300">
                            You can post {remainingDeals} more{" "}
                            {remainingDeals === 1 ? "deal" : "deals"} with your
                            current subscription.
                          </p>
                          {subscriptionInfo && (
                            <div className="flex items-center gap-2 text-xs text-green-600 dark:text-green-200">
                              <div className="w-full bg-green-200 rounded-full h-2 dark:bg-green-900/60">
                                <div
                                  className="bg-green-500 h-2 rounded-full transition-all duration-300 dark:bg-green-400"
                                  style={{
                                    width: `${Math.min(
                                      100,
                                      ((subscriptionInfo.totalDeals -
                                        remainingDeals) /
                                        subscriptionInfo.totalDeals) *
                                        100
                                    )}%`,
                                  }}
                                ></div>
                              </div>
                              <span className="font-medium min-w-[3rem]">
                                {Math.min(
                                  100,
                                  Math.round(
                                    ((subscriptionInfo.totalDeals -
                                      remainingDeals) /
                                      subscriptionInfo.totalDeals) *
                                      100
                                  )
                                )}
                                % used
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                ) : null}
              </div>
            )}
          </CardHeader>

          <form
            className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mt-6 sm:mt-8"
            onSubmit={formik.handleSubmit}
          >
            {/* Medicine Selection - Read-only in edit mode */}
            <div className="space-y-2 col-span-1">
              <Label
                htmlFor="medicineName"
                className="font-semibold text-sm sm:text-base dark:text-gray-200"
              >
                Medicine Name <span className="text-red-500">*</span>
              </Label>
              {isEditMode ? (
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10">
                    <Package className="w-4 h-4 sm:w-5 sm:h-5" />
                  </span>
                  <Input
                    value={formik.values.medicineName}
                    disabled
                    className="pl-10 border-gray-300 rounded-lg h-10 sm:h-11 bg-gray-100 text-gray-600 text-sm sm:text-base dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
                  />
                </div>
              ) : (
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10">
                    <Package className="w-4 h-4 sm:w-5 sm:h-5" />
                  </span>
                  <Select
                    value={formik.values.medicineName}
                    onValueChange={(value) => {
                      formik.setFieldValue("medicineName", value);
                      setIsSelectOpen(false);
                    }}
                    onOpenChange={setIsSelectOpen}
                  >
                    <SelectTrigger
                      className={cn(
                        "pl-10 border-gray-300 rounded-lg h-10 sm:h-11 focus:border-primary focus:ring-1 focus:ring-primary bg-white/80 backdrop-blur-sm w-full text-sm sm:text-base dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700",
                        formik.touched.medicineName &&
                          formik.errors.medicineName &&
                          "border-red-500 dark:border-red-500"
                      )}
                    >
                      <SelectValue placeholder="Select medicine" />
                    </SelectTrigger>
                    <SelectContent className="max-h-80 w-[300px] sm:w-[400px]">
                      <div className="p-2">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <Input
                            placeholder="Search for medicine..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 border-gray-300 rounded-lg h-9 focus:border-primary focus:ring-1 focus:ring-primary bg-white text-sm dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700"
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
                                <div className="font-medium text-sm">
                                  {drug.drugName}
                                </div>
                              </div>
                            </SelectItem>
                          ))
                        ) : searchTerm.trim() ? (
                          <div className="py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                            No drugs found for "{searchTerm}"
                          </div>
                        ) : drugs.length === 0 ? (
                          <div className="py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                            No drugs available
                          </div>
                        ) : (
                          <div className="py-4 text-center text-sm text-gray-500 dark:text-gray-400">
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
                  formik.touched.medicineName && formik.errors.medicineName
                    ? formik.errors.medicineName
                    : null
                }
              />
            </div>

            {/* Quantity - Editable in both modes */}
            <div className="space-y-2 col-span-1">
              <Label
                htmlFor="quantity"
                className="font-semibold text-sm sm:text-base dark:text-gray-200"
              >
                Quantity <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10">
                  <Hash className="w-4 h-4 sm:w-5 sm:h-5" />
                </span>
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  placeholder="Enter quantity"
                  className={cn(
                    "pl-10 border-gray-300 rounded-lg h-10 sm:h-11 focus:border-primary focus:ring-1 focus:ring-primary bg-white/80 backdrop-blur-sm text-sm sm:text-base dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700",
                    formik.touched.quantity &&
                      formik.errors.quantity &&
                      "border-red-500 dark:border-red-500"
                  )}
                  value={formik.values.quantity}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              <ErrorMessage
                error={
                  formik.touched.quantity && formik.errors.quantity
                    ? formik.errors.quantity
                    : null
                }
              />
            </div>

            {/* Medicine Type - Read-only in edit mode */}
            <div className="space-y-2 col-span-1">
              <Label
                htmlFor="medicineType"
                className="font-semibold text-sm sm:text-base dark:text-gray-200"
              >
                Medicine Type <span className="text-red-500">*</span>
              </Label>
              {isEditMode ? (
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10">
                    <Tag className="w-4 h-4 sm:w-5 sm:h-5" />
                  </span>
                  <Input
                    value={formik.values.medicineType}
                    disabled
                    className="pl-10 border-gray-300 rounded-lg h-10 sm:h-11 bg-gray-100 text-gray-600 text-sm sm:text-base dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
                  />
                </div>
              ) : (
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10">
                    <Tag className="w-4 h-4 sm:w-5 sm:h-5" />
                  </span>
                  <Select
                    value={formik.values.medicineType}
                    onValueChange={(value) =>
                      formik.setFieldValue("medicineType", value)
                    }
                  >
                    <SelectTrigger
                      className={cn(
                        "pl-10 border-gray-300 rounded-lg h-10 sm:h-11 focus:border-primary focus:ring-1 focus:ring-primary bg-white/80 backdrop-blur-sm w-full text-sm sm:text-base dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700",
                        formik.touched.medicineType &&
                          formik.errors.medicineType &&
                          "border-red-500 dark:border-red-500"
                      )}
                    >
                      <SelectValue placeholder="Select medicine type" />
                    </SelectTrigger>
                    <SelectContent className="max-h-80 w-[300px] sm:w-[400px]">
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
                  formik.touched.medicineType && formik.errors.medicineType
                    ? formik.errors.medicineType
                    : null
                }
              />
            </div>

            {/* Expiry Date - Read-only in edit mode */}
            <div className="space-y-2 col-span-1">
              <Label className="font-semibold text-sm sm:text-base dark:text-gray-200">
                Expiry Date <span className="text-red-500">*</span>
              </Label>
              {isEditMode ? (
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
                  </span>
                  <Input
                    value={
                      formik.values.expiryDate
                        ? new Date(
                            formik.values.expiryDate
                          ).toLocaleDateString()
                        : ""
                    }
                    disabled
                    className="pl-10 border-gray-300 rounded-lg h-10 sm:h-11 bg-gray-100 text-gray-600 text-sm sm:text-base dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
                  />
                </div>
              ) : (
                <div
                  className={cn(
                    "bg-white/80 rounded-lg border border-gray-300",
                    formik.touched.expiryDate &&
                      formik.errors.expiryDate &&
                      "border-red-500 dark:border-red-500",
                    "dark:bg-gray-900 dark:border-gray-700"
                  )}
                >
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
                  formik.touched.expiryDate && formik.errors.expiryDate
                    ? formik.errors.expiryDate
                    : null
                }
              />
            </div>

            {/* Market Price - Read-only in both modes */}
            <div className="space-y-2 col-span-1">
              <Label
                htmlFor="marketPrice"
                className="font-semibold text-sm sm:text-base dark:text-gray-200"
              >
                Market Price (EGP){" "}
                <span className="text-gray-400 text-xs dark:text-gray-500">
                  (Info only)
                </span>
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10">
                  <PoundSterling className="w-4 h-4 sm:w-5 sm:h-5" />
                </span>
                <Input
                  id="marketPrice"
                  name="marketPrice"
                  type="text"
                  disabled
                  placeholder="0.00"
                  className="pl-10 border-gray-300 rounded-lg h-10 sm:h-11 focus:border-primary focus:ring-1 focus:ring-primary bg-white/80 backdrop-blur-sm text-sm sm:text-base dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700"
                  value={formik.values.marketPrice}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
            </div>

            {/* Minimum Price - Editable in both modes */}
            <div className="space-y-2 col-span-1">
              <Label
                htmlFor="minPrice"
                className="font-semibold text-sm sm:text-base dark:text-gray-200"
              >
                Minimum Price (EGP) <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10">
                  <PoundSterling className="w-4 h-4 sm:w-5 sm:h-5" />
                </span>
                <Input
                  id="minPrice"
                  name="minPrice"
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="Enter minimum price"
                  className={cn(
                    "pl-10 border-gray-300 rounded-lg h-10 sm:h-11 focus:border-primary focus:ring-1 focus:ring-primary bg-white/80 backdrop-blur-sm text-sm sm:text-base dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700",
                    formik.touched.minPrice &&
                      formik.errors.minPrice &&
                      "border-red-500 dark:border-red-500"
                  )}
                  value={formik.values.minPrice}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              <ErrorMessage
                error={
                  formik.touched.minPrice && formik.errors.minPrice
                    ? formik.errors.minPrice
                    : null
                }
              />
            </div>

            {/* Description - Editable in both modes */}
            <div className="space-y-2 col-span-1 lg:col-span-2">
              <Label
                htmlFor="description"
                className="font-semibold text-sm sm:text-base dark:text-gray-200"
              >
                Description <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <span className="absolute left-3 mt-2 text-gray-400 z-10">
                  <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
                </span>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Describe your medicine, condition, reason for selling/exchanging..."
                  className={cn(
                    "pl-10 border-gray-300 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary bg-white/80 backdrop-blur-sm text-sm sm:text-base dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700",
                    formik.touched.description &&
                      formik.errors.description &&
                      "border-red-500 dark:border-red-500"
                  )}
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  rows={4}
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {formik.values.description?.length || 0}/500 characters
              </p>
              <ErrorMessage
                error={
                  formik.touched.description && formik.errors.description
                    ? formik.errors.description
                    : null
                }
              />
            </div>

            {/* Pharmacy Select - Read-only in edit mode */}
            <div className="space-y-2 col-span-1">
              <Label
                htmlFor="pharmacyId"
                className="font-semibold text-sm sm:text-base dark:text-gray-200"
              >
                Pharmacy <span className="text-red-500">*</span>
              </Label>
              {isEditMode ? (
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10">
                    <Building2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  </span>
                  <Input
                    value={
                      pharmacies.find((p) => p.id === formik.values.pharmacyId)
                        ?.name || ""
                    }
                    disabled
                    className="pl-10 border-gray-300 rounded-lg h-10 sm:h-11 bg-gray-100 text-gray-600 text-sm sm:text-base dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
                  />
                </div>
              ) : (
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10">
                    <Building2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  </span>
                  <Select
                    value={formik.values.pharmacyId}
                    onValueChange={(value) =>
                      formik.setFieldValue("pharmacyId", value)
                    }
                  >
                    <SelectTrigger
                      className={cn(
                        "pl-10 border-gray-300 rounded-lg h-10 sm:h-11 focus:border-primary focus:ring-1 focus:ring-primary bg-white/80 backdrop-blur-sm w-full text-sm sm:text-base dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700",
                        formik.touched.pharmacyId &&
                          formik.errors.pharmacyId &&
                          "border-red-500 dark:border-red-500"
                      )}
                    >
                      <SelectValue
                        placeholder={
                          pharmacies && pharmacies.length > 0
                            ? "Select pharmacy"
                            : "No pharmacies found"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent className="max-h-80 w-[300px] sm:w-[400px]">
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
                  formik.touched.pharmacyId && formik.errors.pharmacyId
                    ? formik.errors.pharmacyId
                    : null
                }
              />
            </div>

            {/* Box Status Select - Read-only in edit mode */}
            <div className="space-y-2 col-span-1">
              <Label
                htmlFor="boxStatus"
                className="font-semibold text-sm sm:text-base dark:text-gray-200"
              >
                Medicine Box Status <span className="text-red-500">*</span>
              </Label>
              {isEditMode ? (
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10">
                    <Box className="w-4 h-4 sm:w-5 sm:h-5" />
                  </span>
                  <Input
                    value={formik.values.boxStatus}
                    disabled
                    className="pl-10 border-gray-300 rounded-lg h-10 sm:h-11 bg-gray-100 text-gray-600 text-sm sm:text-base dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
                  />
                </div>
              ) : (
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10">
                    <Box className="w-4 h-4 sm:w-5 sm:h-5" />
                  </span>
                  <Select
                    value={formik.values.boxStatus}
                    onValueChange={(value) =>
                      formik.setFieldValue("boxStatus", value)
                    }
                  >
                    <SelectTrigger
                      className={cn(
                        "pl-10 border-gray-300 rounded-lg h-10 sm:h-11 focus:border-primary focus:ring-1 focus:ring-primary bg-white/80 backdrop-blur-sm w-full text-sm sm:text-base dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700",
                        formik.touched.boxStatus &&
                          formik.errors.boxStatus &&
                          "border-red-500 dark:border-red-500"
                      )}
                    >
                      <SelectValue placeholder="Select box status" />
                    </SelectTrigger>
                    <SelectContent className="max-h-80 w-[300px] sm:w-[400px]">
                      <SelectItem value="good">Good</SelectItem>
                      <SelectItem value="damaged">Damaged</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              <ErrorMessage
                error={
                  formik.touched.boxStatus && formik.errors.boxStatus
                    ? formik.errors.boxStatus
                    : null
                }
              />
            </div>

            {/* Deal Type - Editable in both modes */}
            <div className="space-y-2 col-span-1 lg:col-span-2">
              <Label className="font-semibold text-sm sm:text-base dark:text-gray-200">
                Deal Type <span className="text-red-500">*</span>
              </Label>
              <div className="space-y-2 flex flex-col sm:flex-row gap-3 sm:gap-4 w-full">
                <div
                  className={cn(
                    "flex items-center flex-row space-x-3 h-10 sm:h-11 px-3 rounded-lg border-2 border-gray-300 transition-all w-full dark:border-gray-700",
                    formik.values.dealType === "sell" &&
                      "border-primary bg-primary/5 dark:border-primary dark:bg-primary/10"
                  )}
                >
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
                    className="text-sm font-medium text-gray-700 dark:text-white cursor-pointer"
                  >
                    Sell
                  </Label>
                </div>
                <div
                  className={cn(
                    "flex items-center flex-row space-x-3 h-10 sm:h-11 px-3 rounded-lg border-2 border-gray-300 transition-all w-full dark:border-gray-700",
                    formik.values.dealType === "exchange" &&
                      "border-primary bg-primary/5 dark:border-primary dark:bg-primary/10"
                  )}
                >
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
                    className="text-sm font-medium text-gray-700 dark:text-white cursor-pointer"
                  >
                    Exchange
                  </Label>
                </div>
                <div
                  className={cn(
                    "flex items-center flex-row space-x-3 h-10 sm:h-11 px-3 rounded-lg border-2 border-gray-300 transition-all w-full dark:border-gray-700",
                    formik.values.dealType === "both" &&
                      "border-primary bg-primary/5 dark:border-primary dark:bg-primary/10"
                  )}
                >
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
                    className="text-sm font-medium text-gray-700 dark:text-white cursor-pointer"
                  >
                    Both
                  </Label>
                </div>
              </div>
              <ErrorMessage
                error={
                  formik.touched.dealType && formik.errors.dealType
                    ? formik.errors.dealType
                    : null
                }
              />
            </div>

            {/* Submit Button */}
            <div className="col-span-1 lg:col-span-2 pt-3">
              <Button
                type="submit"
                className={`w-full bg-primary hover:bg-primary-hover cursor-pointer text-white py-4 sm:py-5 mb-6 sm:mb-10 text-sm sm:text-base font-medium rounded-lg ${
                  !formik.isValid ||
                  isSubmitting ||
                  (!isEditMode &&
                    remainingDeals !== null &&
                    remainingDeals <= 0)
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                } dark:bg-primary dark:hover:bg-primary-hover`}
                disabled={
                  !formik.isValid ||
                  isSubmitting ||
                  (!isEditMode &&
                    remainingDeals !== null &&
                    remainingDeals <= 0)
                }
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    {isEditMode ? "Updating Deal..." : "Posting Deal..."}
                  </>
                ) : !isEditMode &&
                  remainingDeals !== null &&
                  remainingDeals <= 0 ? (
                  "No Remaining Deals"
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
