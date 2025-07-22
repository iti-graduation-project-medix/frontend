import React, { useState, useCallback, useEffect, useRef } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePharmacies } from "@/store/usePharmcies";
import { useAuth } from "@/store/useAuth";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useParams, useNavigate } from "react-router-dom";
import {
  MapPin,
  UploadCloud,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Building2,
  Hash,
  User,
  Phone,
  Clock,
  FileText,
  MapPinIcon,
} from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { LoadingPage } from "../../components/ui/loading";
import { ErrorMessage } from "../../components/ui/error-display";

const containerStyle = {
  width: "100%",
  height: "250px",
  borderRadius: "12px",
  marginTop: "8px",
};

const defaultCenter = {
  lat: 30.0444, // Cairo
  lng: 31.2357,
};

const EGYPT_GOVERNORATES = [
  "Cairo",
  "Giza",
  "Alexandria",
  "Dakahlia",
  "Red Sea",
  "Beheira",
  "Fayoum",
  "Gharbiya",
  "Ismailia",
  "Menofia",
  "Minya",
  "Qaliubiya",
  "New Valley",
  "Suez",
  "Aswan",
  "Assiut",
  "Beni Suef",
  "Port Said",
  "Damietta",
  "Sharkia",
  "South Sinai",
  "Kafr El Sheikh",
  "Matrouh",
  "Luxor",
  "Qena",
  "North Sinai",
  "Sohag",
];

const PharmacySchema = Yup.object().shape({
  name: Yup.string().required("Pharmacy name is required"),
  licenseNum: Yup.string().required("License number is required"),
  contactPerson: Yup.string().required("Contact person is required"),
  contactNumber: Yup.string()
    .required("phone number is required  ")
    .matches(
      /^(010|011|012|015)[0-9]{8}$/,
      "Phone number must be egyptian number"
    ),
  addressLine1: Yup.string().required("Address Line 1 is required"),
  addressLine2: Yup.string(),
  city: Yup.string().required("City is required"),
  governorate: Yup.string().required("Governorate is required"),
  zipCode: Yup.string().required("Zip code is required"),
  location: Yup.object()
    .shape({ lat: Yup.number(), lng: Yup.number() })
    .nullable()
    .required("Location is required"),
  startHour: Yup.string().required("Start hour is required"),
  endHour: Yup.string().required("End hour is required"),
  // images: Yup.mixed(),
});

const LIBRARIES = ["places"];

export default function AddPharmacy() {
  // Always call hooks first, regardless of conditions
  const {
    pharmacies,
    addPharmacy,
    updatePharmacyById,
    isLoading,
    fetchPharmacies,
  } = usePharmacies();
  const { token, user } = useAuth();
  const [mapCenter] = useState(defaultCenter);
  const [marker, setMarker] = useState(null);
  const [submitError, setSubmitError] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [initialValues, setInitialValues] = useState({
    name: "",
    licenseNum: "",
    contactPerson: "",
    contactNumber: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    governorate: "",
    zipCode: "",
    location: null,
    startHour: "",
    endHour: "",
    images: null,
  });
  const [existingImages, setExistingImages] = useState([]);
  const [deletedImages, setDeletedImages] = useState([]);
  const [searchBox, setSearchBox] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const inputRef = useRef(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
    libraries: LIBRARIES,
  });

  // Fetch pharmacies when component mounts
  useEffect(() => {
    if (token && user) {
      // Extract user ID from user object
      const userId = user?.id || user;
      if (userId) {
        fetchPharmacies(token, userId);
      }
    }
  }, [token, user, fetchPharmacies]);

  const isAddMode = !id;
  const pharmaciesLoaded = Array.isArray(pharmacies);
  const hasMaxPharmacies =
    isAddMode && pharmaciesLoaded && pharmacies.length >= 2;

  // Find the pharmacy if editing
  useEffect(() => {
    if (id && pharmaciesLoaded) {
      const pharm = pharmacies.find((p) => String(p.id) === String(id));
      if (pharm) {
        setInitialValues({
          name: pharm.name || "",
          licenseNum: pharm.licenseNum || "",
          contactPerson: "",
          contactNumber: pharm.pharmacyPhone || "",
          addressLine1: pharm.addressLine1 || "",
          addressLine2: pharm.addressLine2 || "",
          city: pharm.city || "",
          governorate: pharm.governorate || "",
          zipCode: pharm.zipCode || "",
          location:
            pharm.location && pharm.location.coordinates
              ? {
                  lat: pharm.location.coordinates[1],
                  lng: pharm.location.coordinates[0],
                }
              : null,
          startHour: pharm.startHour || "",
          endHour: pharm.endHour || "",
          images: null,
        });
        setMarker(
          pharm.location && pharm.location.coordinates
            ? {
                lat: pharm.location.coordinates[1],
                lng: pharm.location.coordinates[0],
              }
            : null
        );
        setExistingImages(
          Array.isArray(pharm.imagesUrls) ? pharm.imagesUrls : []
        );
      }
    }
  }, [id, pharmacies, pharmaciesLoaded]);

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema: PharmacySchema,
    onSubmit: async (values, { resetForm }) => {
      setSubmitError("");
      setIsSubmitting(true);
      try {
        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("licenseNum", values.licenseNum);
        formData.append("addressLine1", values.addressLine1);
        formData.append("addressLine2", values.addressLine2 || "");
        formData.append("city", values.city);
        formData.append("zipCode", values.zipCode);
        formData.append("latitude", values.location?.lat || "");
        formData.append("longitude", values.location?.lng || "");
        formData.append("startHour", values.startHour);
        formData.append("endHour", values.endHour);
        formData.append("governorate", values.governorate);
        formData.append("pharmacyPhone", values.contactNumber);

        // 1. أضف الصور القديمة (المتبقية) للـ FormData
        for (const url of existingImages) {
          try {
            const response = await fetch(url);
            const blob = await response.blob();
            formData.append("images", blob, "old-image.jpg");
          } catch (e) {}
        }

        if (values.images && values.images.length > 0) {
          Array.from(values.images).forEach((file) => {
            formData.append("images", file);
          });
        }
        if (id) {
          await updatePharmacyById(id, formData, token);
          toast.success("Pharmacy updated successfully!");
        } else {
          await addPharmacy(formData, token);
          toast.success("Pharmacy added successfully!");
          resetForm();
          setMarker(null);
        }
        navigate("/settings");
      } catch (err) {
        setSubmitError(
          err?.message ||
            (id ? "Failed to update pharmacy" : "Failed to add pharmacy")
        );
        setIsSubmitting(false);
      }
    },
  });

  const handleMapClick = useCallback(
    (e) => {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      setMarker({ lat, lng });
      formik.setFieldValue("location", { lat, lng });
    },
    [formik]
  );

  const handleFileChange = (e) => {
    formik.setFieldValue("images", e.currentTarget.files);
  };

  // Set up Google Maps Autocomplete
  useEffect(() => {
    if (!isLoaded || !window.google || !inputRef.current) return;
    if (searchBox) return; // Only set up once
    const autocomplete = new window.google.maps.places.Autocomplete(
      inputRef.current,
      {
        fields: ["geometry", "name", "formatted_address"],
        types: ["establishment", "geocode"],
        componentRestrictions: { country: "eg" },
      }
    );
    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (place.geometry && place.geometry.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        setMarker({ lat, lng });
        formik.setFieldValue("location", { lat, lng });
      }
    });
    setSearchBox(autocomplete);
  }, [isLoaded, searchBox, formik]);

  const nextStep = () => {
    // Validate current step fields
    const step1Fields = [
      "name",
      "licenseNum",
      "contactPerson",
      "contactNumber",
      "startHour",
      "endHour",
    ];
    const step1Errors = {};

    step1Fields.forEach((field) => {
      try {
        PharmacySchema.fields[field].validateSync(formik.values[field]);
      } catch (error) {
        step1Errors[field] = error.message;
      }
    });

    if (Object.keys(step1Errors).length === 0) {
      setCurrentStep(2);
    } else {
      // Set errors for step 1 fields
      Object.keys(step1Errors).forEach((field) => {
        formik.setFieldError(field, step1Errors[field]);
        formik.setFieldTouched(field, true);
      });
    }
  };

  const prevStep = () => {
    setCurrentStep(1);
  };

  // Show loading state while pharmacies are loading or being fetched
  if (!pharmaciesLoaded || isLoading) {
    return <LoadingPage message="Loading pharmacy form..." />;
  }

  // Show limit reached message
  if (hasMaxPharmacies && !isSubmitting && !formik.isSubmitting && !isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full p-8 text-center shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-red-600">
              Limit Reached
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg mb-4">
              You have already registered the maximum number of pharmacies (2).
            </p>
            <p className="text-gray-500">
              If you need to update your existing pharmacies, please use the
              edit option.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-7xl">
        <div className="mb-10 text-center">
          <h1 className="text-3xl text-primary md:text-4xl font-bold mb-3 ">
            {id ? "Edit Pharmacy" : "Add Your Pharmacy"}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {id
              ? "Update your pharmacy details to keep your information accurate and up to date."
              : "add your pharmacy to connect with companies, manage your inventory, and access exclusive deals across Egypt."}
          </p>
        </div>
        <div className="min-h-screen flex items-center justify-center px-4  dark:bg-background text-gray-900 dark:text-foreground">
          <div className="container mx-auto max-w-7xl">
            <div className="flex flex-col lg:flex-row items-start justify-center gap-8 lg:gap-12">
              <div className="w-full lg:w-7/12">
                <Card className="overflow-hidden shadow-2xl border-0 rounded-3xl bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-background dark:via-background dark:to-background relative w-full">
                  {/* Decorative Elements */}
                  <div
                    className="absolute top-0 right-0 w-32 h-32 rounded-full -mr-16 -mt-16 opacity-10 dark:opacity-20"
                    style={{ background: "var(--primary)" }}
                  ></div>
                  <div
                    className="absolute bottom-0 left-0 w-40 h-40 rounded-full -ml-20 -mb-20 opacity-10 dark:opacity-20"
                    style={{ background: "var(--primary)" }}
                  ></div>

                  <div className="relative p-8 md:p-10">
                    <CardHeader className="px-0 pt-0 pb-4">
                      <CardTitle className="text-2xl font-bold text-foreground dark:text-foreground">
                        {id ? "Edit Pharmacy" : "Add Pharmacy"}
                      </CardTitle>
                      <p className="text-muted-foreground text-sm mt-1 dark:text-gray-400">
                        {id
                          ? "Update your pharmacy details below."
                          : "Fill out the form below to add your pharmacy."}
                      </p>

                      {/* Step Indicator */}
                      <div className="flex items-center justify-center mt-6 mb-4">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                                currentStep >= 1
                                  ? "bg-primary text-white dark:bg-primary dark:text-white"
                                  : "bg-gray-200 text-gray-500 dark:bg-zinc-800 dark:text-gray-400"
                              }`}
                            >
                              1
                            </div>
                            <span
                              className={`ml-2 text-sm font-medium ${
                                currentStep >= 1
                                  ? "text-primary"
                                  : "text-gray-500"
                              } dark:${
                                currentStep >= 1
                                  ? "text-primary"
                                  : "text-gray-400"
                              }`}
                            >
                              Basic Information
                            </span>
                          </div>
                          <div
                            className={`w-16 h-0.5 ${
                              currentStep >= 2
                                ? "bg-primary dark:bg-primary"
                                : "bg-gray-200 dark:bg-zinc-800"
                            }`}
                          ></div>
                          <div className="flex items-center">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                                currentStep >= 2
                                  ? "bg-primary text-white dark:bg-primary dark:text-white"
                                  : "border-gray-200 border-2 text-gray-500 dark:border-zinc-800 dark:text-gray-400"
                              }`}
                            >
                              2
                            </div>
                            <span
                              className={`ml-2 text-sm font-medium ${
                                currentStep >= 2
                                  ? "text-primary"
                                  : "text-gray-500"
                              } dark:${
                                currentStep >= 2
                                  ? "text-primary"
                                  : "text-gray-400"
                              }`}
                            >
                              Location & Address
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <form
                        className="space-y-6"
                        onSubmit={formik.handleSubmit}
                      >
                        {currentStep === 1 ? (
                          // Step 1: Basic Information & Hours
                          <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-2">
                                <Label className="font-semibold" htmlFor="name">
                                  Pharmacy Name{" "}
                                  <span className="text-red-500">*</span>
                                </Label>
                                <div className="relative">
                                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10">
                                    <Building2 className="w-5 h-5" />
                                  </span>
                                  <Input
                                    id="name"
                                    name="name"
                                    placeholder="Pharmacy Name"
                                    value={formik.values.name}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    aria-invalid={
                                      !!formik.errors.name &&
                                      formik.touched.name
                                    }
                                    className={cn(
                                      "pl-10 border-gray-300 rounded-lg h-9 focus:border-primary focus:ring-1 focus:ring-primary bg-white/80 backdrop-blur-sm dark:bg-gray-900 dark:border-gray-700 dark:text-white",

                                      formik.touched.name &&
                                        formik.errors.name &&
                                        "border-red-500"
                                    )}
                                  />
                                </div>
                                <ErrorMessage
                                  error={
                                    formik.touched.name && formik.errors.name
                                      ? formik.errors.name
                                      : null
                                  }
                                />
                              </div>
                              <div className="space-y-2">
                                <Label
                                  className="font-semibold"
                                  htmlFor="licenseNum"
                                >
                                  License Number{" "}
                                  <span className="text-red-500">*</span>
                                </Label>
                                <div className="relative">
                                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10">
                                    <Hash className="w-5 h-5" />
                                  </span>
                                  <Input
                                    id="licenseNum"
                                    name="licenseNum"
                                    placeholder="License Number"
                                    value={formik.values.licenseNum}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    aria-invalid={
                                      !!formik.errors.licenseNum &&
                                      formik.touched.licenseNum
                                    }
                                    className={cn(
                                      "pl-10 border-gray-300 rounded-lg h-9 focus:border-primary focus:ring-1 focus:ring-primary bg-white/80 backdrop-blur-sm dark:bg-gray-900 dark:border-gray-700 dark:text-white",

                                      formik.touched.licenseNum &&
                                        formik.errors.licenseNum &&
                                        "border-red-500"
                                    )}
                                  />
                                </div>
                                <ErrorMessage
                                  error={
                                    formik.touched.licenseNum &&
                                    formik.errors.licenseNum
                                      ? formik.errors.licenseNum
                                      : null
                                  }
                                />
                              </div>
                              <div className="space-y-2">
                                <Label
                                  className="font-semibold"
                                  htmlFor="contactPerson"
                                >
                                  Contact Person{" "}
                                  <span className="text-red-500">*</span>
                                </Label>
                                <div className="relative">
                                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10">
                                    <User className="w-5 h-5" />
                                  </span>
                                  <Input
                                    id="contactPerson"
                                    name="contactPerson"
                                    placeholder="Contact Person"
                                    value={formik.values.contactPerson}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    aria-invalid={
                                      !!formik.errors.contactPerson &&
                                      formik.touched.contactPerson
                                    }
                                    className={cn(
                                      "pl-10 border-gray-300 rounded-lg h-9 focus:border-primary focus:ring-1 focus:ring-primary bg-white/80 backdrop-blur-sm dark:bg-gray-900 dark:border-gray-700 dark:text-white",

                                      formik.touched.contactPerson &&
                                        formik.errors.contactPerson &&
                                        "border-red-500"
                                    )}
                                  />
                                </div>
                                <ErrorMessage
                                  error={
                                    formik.touched.contactPerson &&
                                    formik.errors.contactPerson
                                      ? formik.errors.contactPerson
                                      : null
                                  }
                                />
                              </div>
                              <div className="space-y-2">
                                <Label
                                  className="font-semibold"
                                  htmlFor="contactNumber"
                                >
                                  Contact Number{" "}
                                  <span className="text-red-500">*</span>
                                </Label>
                                <div className="relative">
                                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10">
                                    <Phone className="w-5 h-5" />
                                  </span>
                                  <Input
                                    id="contactNumber"
                                    name="contactNumber"
                                    placeholder="Contact Number"
                                    value={formik.values.contactNumber}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    aria-invalid={
                                      !!formik.errors.contactNumber &&
                                      formik.touched.contactNumber
                                    }
                                    className={cn(
                                      "pl-10 border-gray-300 rounded-lg h-9 focus:border-primary focus:ring-1 focus:ring-primary bg-white/80 backdrop-blur-sm dark:bg-gray-900 dark:border-gray-700 dark:text-white",

                                      formik.touched.contactNumber &&
                                        formik.errors.contactNumber &&
                                        "border-red-500"
                                    )}
                                  />
                                </div>
                                <ErrorMessage
                                  error={
                                    formik.touched.contactNumber &&
                                    formik.errors.contactNumber
                                      ? formik.errors.contactNumber
                                      : null
                                  }
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-2">
                                <Label
                                  className="font-semibold"
                                  htmlFor="startHour"
                                >
                                  Start Hour{" "}
                                  <span className="text-red-500">*</span>
                                </Label>
                                <div className="relative">
                                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10">
                                    <Clock className="w-5 h-5" />
                                  </span>
                                  <Input
                                    id="startHour"
                                    name="startHour"
                                    type="time"
                                    value={formik.values.startHour}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    aria-invalid={
                                      !!formik.errors.startHour &&
                                      formik.touched.startHour
                                    }
                                    className={cn(
                                      "pl-10 pr-10 border-gray-300 rounded-lg h-9 focus:border-primary focus:ring-1 focus:ring-primary bg-white/80 backdrop-blur-sm dark:bg-gray-900 dark:border-gray-700 dark:text-white appearance-none",

                                      formik.touched.startHour &&
                                        formik.errors.startHour &&
                                        "border-red-500"
                                    )}
                                    style={{
                                      WebkitAppearance: "none",
                                      MozAppearance: "none",
                                    }}
                                  />
                                  <button
                                    type="button"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors z-10"
                                    onClick={() =>
                                      document
                                        .getElementById("startHour")
                                        .showPicker()
                                    }
                                  >
                                    <svg
                                      className="w-4 h-4"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 9l-7 7-7-7"
                                      />
                                    </svg>
                                  </button>
                                </div>
                                <ErrorMessage
                                  error={
                                    formik.touched.startHour &&
                                    formik.errors.startHour
                                      ? formik.errors.startHour
                                      : null
                                  }
                                />
                              </div>
                              <div className="space-y-2">
                                <Label
                                  className="font-semibold"
                                  htmlFor="endHour"
                                >
                                  End Hour{" "}
                                  <span className="text-red-500">*</span>
                                </Label>
                                <div className="relative">
                                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10">
                                    <Clock className="w-5 h-5" />
                                  </span>
                                  <Input
                                    id="endHour"
                                    name="endHour"
                                    type="time"
                                    value={formik.values.endHour}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    aria-invalid={
                                      !!formik.errors.endHour &&
                                      formik.touched.endHour
                                    }
                                    className={cn(
                                      "pl-10 pr-10 border-gray-300 rounded-lg h-9 focus:border-primary focus:ring-1 focus:ring-primary bg-white/80 backdrop-blur-sm dark:bg-gray-900 dark:border-gray-700 dark:text-white appearance-none",

                                      formik.touched.endHour &&
                                        formik.errors.endHour &&
                                        "border-red-500"
                                    )}
                                    style={{
                                      WebkitAppearance: "none",
                                      MozAppearance: "none",
                                    }}
                                  />
                                  <button
                                    type="button"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors z-10"
                                    onClick={() =>
                                      document
                                        .getElementById("endHour")
                                        .showPicker()
                                    }
                                  >
                                    <svg
                                      className="w-4 h-4"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 9l-7 7-7-7"
                                      />
                                    </svg>
                                  </button>
                                </div>
                                <ErrorMessage
                                  error={
                                    formik.touched.endHour &&
                                    formik.errors.endHour
                                      ? formik.errors.endHour
                                      : null
                                  }
                                />
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label className="font-semibold" htmlFor="images">
                                Pharmacy Images
                              </Label>
                              <label
                                htmlFor="images"
                                className="relative flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-white/80 backdrop-blur-sm hover:bg-white/90 transition-colors mb-2 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                              >
                                <UploadCloud className="w-10 h-10 text-gray-400 mb-2" />
                                <span className="mb-1 text-sm text-gray-700 font-semibold">
                                  Click or drag to upload images
                                </span>
                                <span className="text-xs text-gray-500">
                                  (Max 5 images, 5MB each)
                                </span>
                                <Input
                                  id="images"
                                  name="images"
                                  type="file"
                                  multiple
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => {
                                    const files = Array.from(
                                      e.target.files || []
                                    );
                                    formik.setFieldValue("images", files);
                                  }}
                                />
                              </label>
                              {/* Existing images preview (edit mode) */}
                              {existingImages && existingImages.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-2">
                                  {existingImages.map((url, idx) => (
                                    <div
                                      key={idx}
                                      className="relative w-20 h-20 rounded overflow-hidden border bg-gray-50 flex items-center justify-center"
                                    >
                                      <img
                                        src={url}
                                        alt={`pharmacy-img-${idx}`}
                                        className="object-cover w-full h-full"
                                      />
                                      <button
                                        type="button"
                                        className="absolute top-1 right-1 bg-white/80 rounded-full p-0.5 hover:bg-red-100"
                                        onClick={(e) => {
                                          e.preventDefault();

                                          setDeletedImages([
                                            ...deletedImages,
                                            url,
                                          ]);

                                          setExistingImages(
                                            existingImages.filter(
                                              (_, i) => i !== idx
                                            )
                                          );
                                        }}
                                      >
                                        <XCircle
                                          size={16}
                                          className="text-red-500"
                                        />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              )}
                              {/* New images preview */}
                              {formik.values.images &&
                                formik.values.images.length > 0 && (
                                  <div className="flex flex-wrap gap-2 mb-2">
                                    {Array.from(formik.values.images).map(
                                      (file, idx) => (
                                        <div
                                          key={idx}
                                          className="relative w-20 h-20 rounded overflow-hidden border bg-gray-50 flex items-center justify-center"
                                        >
                                          <img
                                            src={URL.createObjectURL(file)}
                                            alt={file.name}
                                            className="object-cover w-full h-full"
                                          />
                                          <button
                                            type="button"
                                            className="absolute top-1 right-1 bg-white/80 rounded-full p-0.5 hover:bg-red-100"
                                            onClick={(e) => {
                                              e.preventDefault();
                                              const newFiles = Array.from(
                                                formik.values.images
                                              ).filter((_, i) => i !== idx);
                                              formik.setFieldValue(
                                                "images",
                                                newFiles.length > 0
                                                  ? newFiles
                                                  : null
                                              );
                                            }}
                                          >
                                            <XCircle
                                              size={16}
                                              className="text-red-500"
                                            />
                                          </button>
                                        </div>
                                      )
                                    )}
                                  </div>
                                )}
                              {formik.touched.images &&
                                formik.errors.images && (
                                  <div className="text-xs text-red-500 mt-1">
                                    {formik.errors.images}
                                  </div>
                                )}
                            </div>

                            <div className="pt-4 flex justify-end">
                              <Button
                                type="button"
                                onClick={nextStep}
                                className="flex items-center gap-2"
                              >
                                Next Step <ChevronRight className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ) : (
                          // Step 2: Location & Additional Details
                          <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-2">
                                <Label
                                  className="font-semibold"
                                  htmlFor="addressLine1"
                                >
                                  Address Line 1{" "}
                                  <span className="text-red-500">*</span>
                                </Label>
                                <div className="relative">
                                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10">
                                    <FileText className="w-5 h-5" />
                                  </span>
                                  <Input
                                    id="addressLine1"
                                    name="addressLine1"
                                    placeholder="Address Line 1"
                                    value={formik.values.addressLine1}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    aria-invalid={
                                      !!formik.errors.addressLine1 &&
                                      formik.touched.addressLine1
                                    }
                                    className={cn(
                                      "pl-10 border-gray-300 rounded-lg h-9 focus:border-primary focus:ring-1 focus:ring-primary bg-white/80 backdrop-blur-sm dark:bg-gray-900 dark:border-gray-700 dark:text-white",

                                      formik.touched.addressLine1 &&
                                        formik.errors.addressLine1 &&
                                        "border-red-500"
                                    )}
                                  />
                                </div>
                                <ErrorMessage
                                  error={
                                    formik.touched.addressLine1 &&
                                    formik.errors.addressLine1
                                      ? formik.errors.addressLine1
                                      : null
                                  }
                                />
                              </div>
                              <div className="space-y-2">
                                <Label
                                  className="font-semibold"
                                  htmlFor="addressLine2"
                                >
                                  Address Line 2
                                </Label>
                                <div className="relative">
                                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10">
                                    <FileText className="w-5 h-5" />
                                  </span>
                                  <Input
                                    id="addressLine2"
                                    name="addressLine2"
                                    placeholder="Address Line 2 (optional)"
                                    value={formik.values.addressLine2}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className="pl-10 border-gray-300 rounded-lg h-9 focus:border-primary focus:ring-1 focus:ring-primary bg-white/80 backdrop-blur-sm dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                                  />
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Label className="font-semibold" htmlFor="city">
                                  City <span className="text-red-500">*</span>
                                </Label>
                                <div className="relative">
                                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10">
                                    <Building2 className="w-5 h-5" />
                                  </span>
                                  <Input
                                    id="city"
                                    name="city"
                                    placeholder="City"
                                    value={formik.values.city}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    aria-invalid={
                                      !!formik.errors.city &&
                                      formik.touched.city
                                    }
                                    className={cn(
                                      "pl-10 border-gray-300 rounded-lg h-9 focus:border-primary focus:ring-1 focus:ring-primary bg-white/80 backdrop-blur-sm dark:bg-gray-900 dark:border-gray-700 dark:text-white",

                                      formik.touched.city &&
                                        formik.errors.city &&
                                        "border-red-500"
                                    )}
                                  />
                                </div>
                                <ErrorMessage
                                  error={
                                    formik.touched.city && formik.errors.city
                                      ? formik.errors.city
                                      : null
                                  }
                                />
                              </div>
                              <div className="space-y-2">
                                <Label
                                  className="font-semibold"
                                  htmlFor="governorate"
                                >
                                  Governorate{" "}
                                  <span className="text-red-500">*</span>
                                </Label>
                                <div className="relative">
                                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10">
                                    <MapPinIcon className="w-5 h-5" />
                                  </span>
                                  <Select
                                    value={formik.values.governorate}
                                    onValueChange={(value) =>
                                      formik.setFieldValue("governorate", value)
                                    }
                                    onBlur={() =>
                                      formik.setFieldTouched(
                                        "governorate",
                                        true
                                      )
                                    }
                                    name="governorate"
                                  >
                                    <SelectTrigger
                                      className={cn(
                                        "pl-10 border-gray-300 rounded-lg h-9 focus:border-primary focus:ring-1 focus:ring-primary bg-white/80 backdrop-blur-sm dark:bg-gray-900 dark:border-gray-700 dark:text-white w-full",

                                        formik.touched.governorate &&
                                          formik.errors.governorate &&
                                          "border-red-500"
                                      )}
                                    >
                                      <SelectValue placeholder="Select Governorate" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {EGYPT_GOVERNORATES.map((gov) => (
                                        <SelectItem key={gov} value={gov}>
                                          {gov}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <ErrorMessage
                                  error={
                                    formik.touched.governorate &&
                                    formik.errors.governorate
                                      ? formik.errors.governorate
                                      : null
                                  }
                                />
                              </div>
                              <div className="space-y-2">
                                <Label
                                  className="font-semibold"
                                  htmlFor="zipCode"
                                >
                                  Zip Code{" "}
                                  <span className="text-red-500">*</span>
                                </Label>
                                <div className="relative">
                                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10">
                                    <Hash className="w-5 h-5" />
                                  </span>
                                  <Input
                                    id="zipCode"
                                    name="zipCode"
                                    placeholder="Zip Code"
                                    value={formik.values.zipCode}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    aria-invalid={
                                      !!formik.errors.zipCode &&
                                      formik.touched.zipCode
                                    }
                                    className={cn(
                                      "pl-10 border-gray-300 rounded-lg h-9 focus:border-primary focus:ring-1 focus:ring-primary bg-white/80 backdrop-blur-sm dark:bg-gray-900 dark:border-gray-700 dark:text-white",

                                      formik.touched.zipCode &&
                                        formik.errors.zipCode &&
                                        "border-red-500"
                                    )}
                                  />
                                </div>
                                <ErrorMessage
                                  error={
                                    formik.touched.zipCode &&
                                    formik.errors.zipCode
                                      ? formik.errors.zipCode
                                      : null
                                  }
                                />
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label className="font-semibold">
                                Location <span className="text-red-500">*</span>
                              </Label>
                              <div className="space-y-2">
                                <Button
                                  type="button"
                                  className="mb-3 rounded-full border-2 border-primary bg-primary/10 text-primary hover:bg-primary/90 hover:text-white flex items-center gap-2 shadow-sm dark:bg-primary/20 dark:text-primary dark:hover:bg-primary/90"
                                  variant="outline"
                                  onClick={() => {
                                    if (navigator.geolocation) {
                                      navigator.geolocation.getCurrentPosition(
                                        (position) => {
                                          const lat = position.coords.latitude;
                                          const lng = position.coords.longitude;
                                          setMarker({ lat, lng });
                                          formik.setFieldValue("location", {
                                            lat,
                                            lng,
                                          });
                                        },
                                        (error) => {
                                          alert(
                                            "Unable to retrieve your location."
                                          );
                                        }
                                      );
                                    } else {
                                      alert(
                                        "Geolocation is not supported by your browser."
                                      );
                                    }
                                  }}
                                >
                                  <MapPin className="w-4 h-4 mr-1" /> Use my
                                  current location
                                </Button>
                                {/* Autocomplete search input */}
                                <div className="relative">
                                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10">
                                    <MapPinIcon className="w-5 h-5" />
                                  </span>
                                  <Input
                                    ref={inputRef}
                                    placeholder="Search for your pharmacy location..."
                                    className="pl-10 border-gray-300 rounded-lg h-9 focus:border-primary focus:ring-1 focus:ring-primary bg-white/80 backdrop-blur-sm dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                                    autoComplete="off"
                                  />
                                </div>
                                {isLoaded ? (
                                  <GoogleMap
                                    mapContainerStyle={containerStyle}
                                    center={marker || mapCenter}
                                    zoom={12}
                                    onClick={handleMapClick}
                                  >
                                    {marker && <Marker position={marker} />}
                                  </GoogleMap>
                                ) : (
                                  <div className="text-gray-500">
                                    Loading map...
                                  </div>
                                )}
                                {formik.touched.location &&
                                  formik.errors.location && (
                                    <div className="text-xs text-red-500 mt-1">
                                      {formik.errors.location}
                                    </div>
                                  )}
                              </div>
                            </div>

                            {submitError && (
                              <div className="text-red-500 text-sm text-center mt-2">
                                {submitError}
                              </div>
                            )}

                            <div className="pt-4 flex justify-between">
                              <Button
                                type="button"
                                variant="outline"
                                onClick={prevStep}
                                className="flex items-center gap-2"
                              >
                                <ChevronLeft className="w-4 h-4" /> Previous
                                Step
                              </Button>
                              <Button
                                type="submit"
                                disabled={isLoading || formik.isSubmitting}
                              >
                                {isLoading || formik.isSubmitting
                                  ? id
                                    ? "Updating..."
                                    : "Adding..."
                                  : id
                                  ? "Update Pharmacy"
                                  : "Add Pharmacy"}
                              </Button>
                            </div>
                          </div>
                        )}
                      </form>
                    </CardContent>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}