import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar28 } from "./DatePicker";
import {
  Info,
  UploadCloud,
  XCircle,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useFormik } from "formik";
import * as Yup from "yup";

let userSchema = Yup.object().shape({
  name: Yup.string()
    .required("Name is required")
    .min(3, "Name must be at least 3 characters")
    .max(40, "Name must be at most 40 characters"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  phone: Yup.string()
    .required("phone number is required  ")
    .matches(
      /^(010|011|012|015)[0-9]{8}$/,
      "the phone number must be egyptian phone number "
    ),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
  dateOfBirth: Yup.date().required("Date of birth is required"),
  gender: Yup.string().required("Gender is required"),
  uploadNationalId: Yup.mixed()
    .required("National ID is required")
    .test("fileExists", "You must upload a file", (value) => {
      return value && value.length > 0;
    })
    .test(
      "fileType",
      "Only image files (jpg, jpeg, png) are allowed",
      (value) => {
        return (
          value &&
          value.length > 0 &&
          ["image/jpeg", "image/png", "image/jpg"].includes(value[0].type)
        );
      }
    ),

  uploadWorkId: Yup.mixed()
    .required("Work ID is required")
    .test("fileExists", "You must upload a file", (value) => {
      return value && value.length > 0;
    })
    .test(
      "fileType",
      "Only image files (jpg, jpeg, png) are allowed",
      (value) => {
        return (
          value &&
          value.length > 0 &&
          ["image/jpeg", "image/png", "image/jpg"].includes(value[0].type)
        );
      }
    ),

  nationalId: Yup.string()
    .required("nationalId is required")
    .matches(/^[0-9]{14}$/, "nationalId must be 14 digits"),
  acceptPolicy: Yup.boolean()
    .oneOf([true], "You must accept the privacy policy")
    .required("You must accept the privacy policy"),
});

export function SignUpForm({ className, ...props }) {
  const [currentStep, setCurrentStep] = React.useState(1);

  // Formik initialization at the top level
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      dateOfBirth: null,
      gender: "",
      uploadNationalId: null,
      uploadWorkId: null,
      nationalId: "",
      acceptPolicy: false,
    },
    validationSchema: userSchema,
    onSubmit: (values) => {
      console.log(values);
    },
    validateOnMount: true,
  });

  // Helper: Check if step 1 is valid
  const isStep1Valid = () => {
    const step1Fields = [
      "name",
      "email",
      "phone",
      "password",
      "confirmPassword",
      "dateOfBirth",
      "gender",
    ];
    // Check for errors in step 1 fields and that all are filled
    for (let field of step1Fields) {
      if (!formik.values[field]) return false; // not filled
      if (formik.errors[field]) return false; // has error
    }
    return true;
  };

  // File input handlers for Formik
  const handleFileChange = (e, field) => {
    if (e.target.files && e.target.files[0]) {
      formik.setFieldValue(field, e.target.files);
    }
  };

  const handleFileClear = (field) => {
    formik.setFieldValue(field, null);
  };

  // Step navigation
  const nextStep = async () => {
    // Mark all step 1 fields as touched
    formik.setTouched({
      name: true,
      email: true,
      phone: true,
      password: true,
      confirmPassword: true,
      dateOfBirth: true,
      gender: true,
    });
    // Validate the form
    await formik.validateForm();
    if (isStep1Valid()) {
      setCurrentStep(2);
    }
  };

  const prevStep = () => {
    setCurrentStep(1);
  };

  return (
    <div className={cn("w-full", className)} {...props}>
      <Card className="overflow-hidden shadow-lg border-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50 relative">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full -mr-16 -mt-16 opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-indigo-100 rounded-full -ml-20 -mb-20 opacity-50"></div>

        <div className="relative p-8">
          <CardHeader className="px-0 pt-0">
            <CardTitle className="text-2xl font-bold text-foreground">
              Create Your Account
            </CardTitle>
            <p className="text-muted-foreground text-sm mt-1">
              Fill out the form below to create your secure account
            </p>
          </CardHeader>

          {/* Step Indicator - Only visible on small screens */}
          <div className="flex items-center justify-center space-x-4 my-6 md:hidden">
            <div
              className={`flex items-center ${
                currentStep === 1 ? "text-primary" : "text-gray-400"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                  currentStep === 1 ? "border-primary" : "border-gray-300"
                }`}
              >
                1
              </div>
              <span className="ml-2 text-sm">Personal Info</span>
            </div>
            <div className="w-12 h-0.5 bg-gray-300"></div>
            <div
              className={`flex items-center ${
                currentStep === 2 ? "text-secondary" : "text-gray-400"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                  currentStep === 2 ? "border-secondary" : "border-gray-300"
                }`}
              >
                2
              </div>
              <span className="ml-2 text-sm">Documents</span>
            </div>
          </div>

          <form
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8"
            onSubmit={formik.handleSubmit}
          >
            {/* Step 1: Personal Information */}
            <div
              className={cn(
                "md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6",
                currentStep === 2 ? "hidden md:grid" : ""
              )}
            >
              <div className="space-y-2 col-span-2 md:col-span-1">
                <Label htmlFor="name" className="text-gray-700 font-medium">
                  Full Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  className="border-gray-300 rounded-lg h-11  focus:border-primary focus:ring-1 focus:ring-primary bg-white/80 backdrop-blur-sm"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.name && formik.errors.name && (
                  <div className="text-red-500 text-xs">
                    {formik.errors.name}
                  </div>
                )}
              </div>

              <div className="space-y-2 col-span-2 md:col-span-1">
                <Label htmlFor="email" className="text-gray-700 font-medium">
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  className="border-gray-300 rounded-lg h-11 focus:border-primary focus:ring-1 focus:ring-primary bg-white/80 backdrop-blur-sm"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.email && formik.errors.email && (
                  <div className="text-red-500 text-xs">
                    {formik.errors.email}
                  </div>
                )}
              </div>

              <div className="space-y-2 col-span-2 md:col-span-1">
                <Label htmlFor="phone" className="text-gray-700 font-medium">
                  Phone <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  placeholder="+201234567890"
                  className="border-gray-300 rounded-lg h-11 focus:border-primary focus:ring-1 focus:ring-primary bg-white/80 backdrop-blur-sm"
                  value={formik.values.phone}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.phone && formik.errors.phone && (
                  <div className="text-red-500 text-xs">
                    {formik.errors.phone}
                  </div>
                )}
              </div>

              <div className="space-y-2 col-span-2 md:col-span-1">
                <Label className="text-gray-700 font-medium">
                  Date of Birth <span className="text-red-500">*</span>
                </Label>
                <div className="bg-white/80  rounded-lg border border-gray-300">
                  <Calendar28
                    value={formik.values.dateOfBirth}
                    onChange={(date) =>
                      formik.setFieldValue("dateOfBirth", date)
                    }
                  />
                </div>
                {formik.touched.dateOfBirth && formik.errors.dateOfBirth && (
                  <div className="text-red-500 text-xs">
                    {formik.errors.dateOfBirth}
                  </div>
                )}
              </div>

              <div className="space-y-2 col-span-2 md:col-span-1">
                <Label htmlFor="gender" className="text-gray-700 font-medium">
                  Gender <span className="text-red-500">*</span>
                </Label>
                <div className="  p-3">
                  <RadioGroup
                    name="gender"
                    value={formik.values.gender}
                    onValueChange={(value) =>
                      formik.setFieldValue("gender", value)
                    }
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="male" id="gender-male" />
                      <Label htmlFor="gender-male">Male</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="female" id="gender-female" />
                      <Label htmlFor="gender-female">Female</Label>
                    </div>
                  </RadioGroup>
                </div>
                {formik.touched.gender && formik.errors.gender && (
                  <div className="text-red-500 text-xs">
                    {formik.errors.gender}
                  </div>
                )}
              </div>

              {/* Password Section */}
              <div className="space-y-2 col-span-2 md:col-span-1">
                <Label htmlFor="password" className="text-gray-700 font-medium">
                  Password <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Create password"
                  className="border-gray-300 rounded-lg h-11 focus:border-primary focus:ring-1 focus:ring-primary bg-white/80 backdrop-blur-sm"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <Info size={12} /> 8+ characters required
                </p>
                {formik.touched.password && formik.errors.password && (
                  <div className="text-red-500 text-xs">
                    {formik.errors.password}
                  </div>
                )}
              </div>

              <div className="space-y-2 col-span-2 md:col-span-1">
                <Label
                  htmlFor="confirmPassword"
                  className="text-gray-700 font-medium"
                >
                  Confirm Password <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm password"
                  className="border-gray-300 rounded-lg h-11 focus:border-primary focus:ring-1 focus:ring-primary bg-white/80 backdrop-blur-sm"
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.confirmPassword &&
                  formik.errors.confirmPassword && (
                    <div className="text-red-500 text-xs">
                      {formik.errors.confirmPassword}
                    </div>
                  )}
              </div>
            </div>

            {/* Step 2: Document Upload */}
            <div
              className={cn(
                "md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6",
                currentStep === 1 ? "hidden md:grid" : ""
              )}
            >
              <div className="space-y-2">
                <Label
                  htmlFor="nationalIdFile"
                  className="text-gray-700 font-medium"
                >
                  Upload National ID Card{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <label
                  htmlFor="nationalIdFile"
                  className="relative flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-white/80 backdrop-blur-sm hover:bg-white/90 transition-colors"
                >
                  {formik.values.uploadNationalId &&
                  formik.values.uploadNationalId.length > 0 ? (
                    <div className="flex items-center justify-center space-x-2 p-4">
                      <span className="text-sm text-gray-700 truncate">
                        {formik.values.uploadNationalId[0].name.slice(0, 30)}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          handleFileClear("uploadNationalId");
                        }}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <XCircle size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <UploadCloud className="w-10 h-10 text-gray-400" />
                      <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-semibold">
                          Click to upload image
                        </span>
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        (Max file size: 5MB)
                      </p>
                    </div>
                  )}
                  <Input
                    id="nationalIdFile"
                    name="uploadNationalId"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileChange(e, "uploadNationalId")}
                  />
                </label>
                {formik.touched.uploadNationalId &&
                  formik.errors.uploadNationalId && (
                    <div className="text-red-500 text-xs">
                      {formik.errors.uploadNationalId}
                    </div>
                  )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="workIdFile"
                  className="text-gray-700 font-medium"
                >
                  Upload Work ID Card
                </Label>
                <label
                  htmlFor="workIdFile"
                  className="relative flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-white/80 backdrop-blur-sm hover:bg-white/90 transition-colors"
                >
                  {formik.values.uploadWorkId &&
                  formik.values.uploadWorkId.length > 0 ? (
                    <div className="flex items-center justify-center space-x-2 p-4">
                      <span className="text-sm text-gray-700 truncate">
                        {formik.values.uploadWorkId[0].name.slice(0, 30)}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          handleFileClear("uploadWorkId");
                        }}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <XCircle size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <UploadCloud className="w-10 h-10 text-gray-400" />
                      <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-semibold">
                          Click to upload image
                        </span>
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        (Max file size: 5MB)
                      </p>
                    </div>
                  )}
                  <Input
                    id="workIdFile"
                    name="uploadWorkId"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileChange(e, "uploadWorkId")}
                  />
                </label>
                {formik.touched.uploadWorkId && formik.errors.uploadWorkId && (
                  <div className="text-red-500 text-xs">
                    {formik.errors.uploadWorkId}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="nationalId"
                  className="text-gray-700 font-medium"
                >
                  National ID <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="nationalId"
                  name="nationalId"
                  type="text"
                  placeholder="ID number"
                  className="border-gray-300 rounded-lg h-11 focus:border-primary focus:ring-1 focus:ring-primary bg-white/80 backdrop-blur-sm"
                  value={formik.values.nationalId}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.nationalId && formik.errors.nationalId && (
                  <div className="text-red-500 text-xs">
                    {formik.errors.nationalId}
                  </div>
                )}
              </div>
            </div>

            {/* Privacy Policy Checkbox - only show on step 2 */}
            {currentStep === 2 && (
              <>
                <div className="md:col-span-2 flex items-center space-x-2 mt-2">
                  <input
                    id="acceptPolicy"
                    name="acceptPolicy"
                    type="checkbox"
                    checked={formik.values.acceptPolicy}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="h-4 w-4"
                  />
                  <label
                    htmlFor="acceptPolicy"
                    className="text-sm text-gray-700"
                  >
                    I accept the{" "}
                    <a
                      href="/privacy"
                      className="text-primary underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Privacy Policy
                    </a>
                    <span className="text-red-500">*</span>
                  </label>
                </div>
                {formik.touched.acceptPolicy && formik.errors.acceptPolicy && (
                  <div className="text-red-500 text-xs md:col-span-2">
                    {formik.errors.acceptPolicy}
                  </div>
                )}
              </>
            )}

            {/* Navigation Buttons - Only visible on small screens */}
            <div className="md:col-span-2 flex justify-between md:hidden">
              {currentStep === 2 ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  className="flex items-center gap-2 border-primary text-primary hover:bg-primary/10"
                >
                  <ArrowLeft size={16} />
                  Previous
                </Button>
              ) : (
                <div></div>
              )}
              {currentStep === 1 ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  className={`flex items-center gap-2 bg-secondary hover:bg-secondary-hover text-zinc-950 hover:text-white ${
                    !isStep1Valid() ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={!isStep1Valid()}
                >
                  <p>Next</p>
                  <ArrowRight size={16} />
                </Button>
              ) : (
                <Button
                  type="submit"
                  className={`bg-primary hover:bg-primary-hover text-white py-5 text-base font-medium rounded-lg ${
                    !formik.isValid ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={!formik.isValid}
                >
                  Create Account
                </Button>
              )}
            </div>

            {/* Submit Button - Only visible on medium and larger screens */}
            <div className="md:col-span-2 pt-3 hidden md:block">
              <Button
                type="submit"
                className={`w-full bg-primary hover:bg-primary-hover text-white py-5 text-base font-medium rounded-lg ${
                  !formik.isValid ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={!formik.isValid}
              >
                Create Account
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <a
              href="#"
              className="text-primary font-medium hover:text-primary-hover hover:underline"
            >
              Sign In
            </a>
          </div>
        </div>
      </Card>
    </div>
  );
}
