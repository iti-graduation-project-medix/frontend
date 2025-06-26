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
import { UploadCloud, XCircle, Search } from "lucide-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import { usePharmacies } from "@/store/usePharmcies";
import { useAuth } from "@/store/useAuth";

// Sample medicine data - in real app this would come from API
const medicines = [
  { id: 1, name: "Paracetamol 500mg", category: "Pain Relief" },
  { id: 2, name: "Ibuprofen 400mg", category: "Pain Relief" },
  { id: 3, name: "Amoxicillin 250mg", category: "Antibiotics" },
  { id: 4, name: "Omeprazole 20mg", category: "Gastric" },
  { id: 5, name: "Metformin 500mg", category: "Diabetes" },
  { id: 6, name: "Amlodipine 5mg", category: "Cardiovascular" },
  { id: 7, name: "Cetirizine 10mg", category: "Allergy" },
  { id: 8, name: "Vitamin D3 1000IU", category: "Vitamins" },
];

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
});

export function DealForm({ className, ...props }) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [filteredMedicines, setFilteredMedicines] = React.useState(medicines);
  const [isSelectOpen, setIsSelectOpen] = React.useState(false);
  const { pharmacies, fetchPharmacies } = usePharmacies();
  const { user, token } = useAuth();

  React.useEffect(() => {
    if (token && user) {
      fetchPharmacies(token, user);
    }
  }, [token, user, fetchPharmacies]);

  // Filter medicines based on search term
  React.useEffect(() => {
    const filtered = medicines.filter((medicine) =>
      medicine.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredMedicines(filtered);
  }, [searchTerm]);

  const formik = useFormik({
    initialValues: {
      medicineName: "",
      quantity: "",
      expiryDate: null,
      marketPrice: "",
      description: "",
      pharmacyId: "",
      boxStatus: "",
      dealType: "",
    },
    validationSchema: dealSchema,
    onSubmit: (values) => {
      console.log(values);
      toast.success("Deal posted successfully!", {
        description:
          "Your medicine deal has been posted and is now visible to other users.",
        duration: 5000,
        position: "top-center",
        style: {
          background: "#10b981",
          color: "white",
          border: "1px solid #059669",
        },
        className: "text-white",
        descriptionClassName: "text-white/90 font-medium",
      });
    },
    validateOnMount: true,
  });

  return (
    <div className={cn("w-full", className)} {...props}>
      <Card className="overflow-hidden shadow-lg border-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50 relative">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full -mr-16 -mt-16 opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-indigo-100 rounded-full -ml-20 -mb-20 opacity-50"></div>

        <div className="relative p-8">
          <CardHeader className="px-0 pt-0">
            <CardTitle className="text-2xl font-bold text-foreground">
              Post Your Deal
            </CardTitle>
            <p className="text-muted-foreground text-sm mt-1">
              Fill out the form below to post your medicine deal
            </p>
          </CardHeader>

          <form
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8"
            onSubmit={formik.handleSubmit}
          >
            {/* Medicine Selection */}
            <div className="space-y-2 col-span-2 md:col-span-1">
              <Label
                htmlFor="medicineName"
                className="text-gray-700 font-medium"
              >
                Medicine Name <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formik.values.medicineName}
                onValueChange={(value) => {
                  formik.setFieldValue("medicineName", value);
                  setIsSelectOpen(false);
                }}
                onOpenChange={setIsSelectOpen}
              >
                <SelectTrigger className="border-gray-300 rounded-lg h-11 focus:border-primary focus:ring-1 focus:ring-primary bg-white/80 backdrop-blur-sm w-full ">
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
                    {filteredMedicines.map((medicine) => (
                      <SelectItem key={medicine.id} value={medicine.name}>
                        <div>
                          <div className="font-medium">{medicine.name}</div>
                          <div className="text-xs text-gray-500">
                            {medicine.category}
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </div>
                </SelectContent>
              </Select>
              {formik.touched.medicineName && formik.errors.medicineName && (
                <div className="text-red-500 text-xs">
                  {formik.errors.medicineName}
                </div>
              )}
            </div>

            {/* Quantity */}
            <div className="space-y-2 col-span-2 md:col-span-1">
              <Label htmlFor="quantity" className="text-gray-700 font-medium">
                Quantity <span className="text-red-500">*</span>
              </Label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                placeholder="Enter quantity"
                className="border-gray-300 rounded-lg h-11 focus:border-primary focus:ring-1 focus:ring-primary bg-white/80 backdrop-blur-sm"
                value={formik.values.quantity}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.quantity && formik.errors.quantity && (
                <div className="text-red-500 text-xs">
                  {formik.errors.quantity}
                </div>
              )}
            </div>

            {/* Expiry Date */}
            <div className="space-y-2 col-span-2 md:col-span-1">
              <Label className="text-gray-700 font-medium">
                Expiry Date <span className="text-red-500">*</span>
              </Label>
              <div className="bg-white/80 rounded-lg border border-gray-300">
                <Calendar28
                  value={formik.values.expiryDate}
                  onChange={(date) => formik.setFieldValue("expiryDate", date)}
                />
              </div>
              {formik.touched.expiryDate && formik.errors.expiryDate && (
                <div className="text-red-500 text-xs">
                  {formik.errors.expiryDate}
                </div>
              )}
            </div>

            {/* Market Price */}
            <div className="space-y-2 col-span-2 md:col-span-1">
              <Label
                htmlFor="marketPrice"
                className="text-gray-700 font-medium"
              >
                Market Price (EGP) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="marketPrice"
                name="marketPrice"
                type="text"
                disabled
                placeholder="0.00"
                className="border-gray-300 rounded-lg h-11 focus:border-primary focus:ring-1 focus:ring-primary bg-white/80 backdrop-blur-sm"
                value={formik.values.marketPrice}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>

            {/* Description */}
            <div className="space-y-2 col-span-2">
              <Label
                htmlFor="description"
                className="text-gray-700 font-medium"
              >
                Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe your medicine, condition, reason for selling/exchanging..."
                className="border-gray-300 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary bg-white/80 backdrop-blur-sm"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                rows={4}
              />
              <p className="text-xs text-gray-500">
                {formik.values.description?.length || 0}/500 characters
              </p>
              {formik.touched.description && formik.errors.description && (
                <div className="text-red-500 text-xs">
                  {formik.errors.description}
                </div>
              )}
            </div>

            {/* Pharmacy Select */}
            <div className="space-y-2 col-span-2 md:col-span-1">
              <Label htmlFor="pharmacyId" className="text-gray-700 font-medium">
                Pharmacy <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formik.values.pharmacyId}
                onValueChange={(value) =>
                  formik.setFieldValue("pharmacyId", value)
                }
              >
                <SelectTrigger className="border-gray-300 rounded-lg h-11 focus:border-primary focus:ring-1 focus:ring-primary bg-white/80 backdrop-blur-sm w-full ">
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
              {formik.touched.pharmacyId && formik.errors.pharmacyId && (
                <div className="text-red-500 text-xs">
                  {formik.errors.pharmacyId}
                </div>
              )}
            </div>

            {/* Box Status Select */}
            <div className="space-y-2 col-span-2 md:col-span-1">
              <Label htmlFor="boxStatus" className="text-gray-700 font-medium">
                Medicine Box Status <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formik.values.boxStatus}
                onValueChange={(value) =>
                  formik.setFieldValue("boxStatus", value)
                }
              >
                <SelectTrigger className="border-gray-300 rounded-lg h-11 focus:border-primary focus:ring-1 focus:ring-primary bg-white/80 backdrop-blur-sm w-full ">
                  <SelectValue placeholder="Select box status" />
                </SelectTrigger>
                <SelectContent className="max-h-80 w-[400px]">
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="damaged">Damaged</SelectItem>
                </SelectContent>
              </Select>
              {formik.touched.boxStatus && formik.errors.boxStatus && (
                <div className="text-red-500 text-xs">
                  {formik.errors.boxStatus}
                </div>
              )}
            </div>

            {/* Deal Type */}
            <div className="space-y-2 col-span-2">
              <Label className="text-gray-700 font-medium">
                Deal Type <span className="text-red-500">*</span>
              </Label>
              <div className="p-3">
                <RadioGroup
                  name="dealType"
                  value={formik.values.dealType}
                  onValueChange={(value) =>
                    formik.setFieldValue("dealType", value)
                  }
                  className="flex flex-col sm:flex-row gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="sell" id="deal-sell" />
                    <Label htmlFor="deal-sell">Sell</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="exchange" id="deal-exchange" />
                    <Label htmlFor="deal-exchange">Exchange</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="both" id="deal-both" />
                    <Label htmlFor="deal-both">Both</Label>
                  </div>
                </RadioGroup>
              </div>
              {formik.touched.dealType && formik.errors.dealType && (
                <div className="text-red-500 text-xs">
                  {formik.errors.dealType}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="col-span-2 pt-3">
              <Button
                type="submit"
                className={`w-full bg-primary hover:bg-primary-hover cursor-pointer text-white py-5 mb-10 text-base font-medium rounded-lg ${
                  !formik.isValid ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={!formik.isValid}
              >
                Post Deal
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}
