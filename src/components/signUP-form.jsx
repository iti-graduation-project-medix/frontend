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

export function SignUpForm({ className, ...props }) {
  const [nationalIdFile, setNationalIdFile] = React.useState(null);
  const [workIdFile, setWorkIdFile] = React.useState(null);
  const [currentStep, setCurrentStep] = React.useState(1);

  const handleFileChange = (e, setFile) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleFileClear = (setFile) => {
    setFile(null);
  };

  const nextStep = () => {
    setCurrentStep(2);
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

          <form className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
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
                  type="text"
                  placeholder="John Doe"
                  className="border-gray-300 rounded-lg h-11 focus:border-primary focus:ring-1 focus:ring-primary bg-white/80 backdrop-blur-sm"
                  required
                />
              </div>

              <div className="space-y-2 col-span-2 md:col-span-1">
                <Label htmlFor="email" className="text-gray-700 font-medium">
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  className="border-gray-300 rounded-lg h-11 focus:border-primary focus:ring-1 focus:ring-primary bg-white/80 backdrop-blur-sm"
                  required
                />
              </div>

              <div className="space-y-2 col-span-2 md:col-span-1">
                <Label htmlFor="phone" className="text-gray-700 font-medium">
                  Phone <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1234567890"
                  className="border-gray-300 rounded-lg h-11 focus:border-primary focus:ring-1 focus:ring-primary bg-white/80 backdrop-blur-sm"
                  required
                />
              </div>

              <div className="space-y-2 col-span-2 md:col-span-1">
                <Label className="text-gray-700 font-medium">
                  Date of Birth <span className="text-red-500">*</span>
                </Label>
                <div className="bg-white/80  rounded-lg border border-gray-300">
                  <Calendar28 />
                </div>
              </div>

              <div className="space-y-2 col-span-2 md:col-span-1">
                <Label htmlFor="gender" className="text-gray-700 font-medium">
                  Gender <span className="text-red-500">*</span>
                </Label>
                <div className="  p-3">
                  <RadioGroup defaultValue="male" className="flex space-x-4">
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
              </div>

              {/* Password Section */}
              <div className="space-y-2 col-span-2 md:col-span-1">
                <Label htmlFor="password" className="text-gray-700 font-medium">
                  Password <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create password"
                  className="border-gray-300 rounded-lg h-11 focus:border-primary focus:ring-1 focus:ring-primary bg-white/80 backdrop-blur-sm"
                  required
                />
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <Info size={12} /> 8+ characters required
                </p>
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
                  type="password"
                  placeholder="Confirm password"
                  className="border-gray-300 rounded-lg h-11 focus:border-primary focus:ring-1 focus:ring-primary bg-white/80 backdrop-blur-sm"
                  required
                />
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
                  {nationalIdFile ? (
                    <div className="flex items-center justify-center space-x-2 p-4">
                      <span className="text-sm text-gray-700 truncate">
                        {nationalIdFile.name.slice(0, 30)}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          handleFileClear(setNationalIdFile);
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
                          Click to upload or drag and drop
                        </span>
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        (Max file size: 5MB)
                      </p>
                    </div>
                  )}
                  <Input
                    id="nationalIdFile"
                    type="file"
                    accept="image/*,.pdf"
                    className="hidden"
                    required
                    onChange={(e) => handleFileChange(e, setNationalIdFile)}
                  />
                </label>
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
                  {workIdFile ? (
                    <div className="flex items-center justify-center space-x-2 p-4">
                      <span className="text-sm text-gray-700 truncate">
                        {workIdFile.name.slice(0, 30)}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          handleFileClear(setWorkIdFile);
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
                          Click to upload or drag and drop
                        </span>
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        (Max file size: 5MB)
                      </p>
                    </div>
                  )}
                  <Input
                    id="workIdFile"
                    type="file"
                    accept="image/*,.pdf"
                    className="hidden"
                    onChange={(e) => handleFileChange(e, setWorkIdFile)}
                  />
                </label>
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
                  type="text"
                  placeholder="ID number"
                  className="border-gray-300 rounded-lg h-11 focus:border-primary focus:ring-1 focus:ring-primary bg-white/80 backdrop-blur-sm"
                  required
                />
              </div>
            </div>

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
                  className="flex items-center gap-2 bg-secondary hover:bg-secondary-hover text-zinc-950 hover:text-white"
                >
                  <p>Next</p>
                  <ArrowRight size={16} />
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="bg-primary hover:bg-primary-hover text-white py-5 text-base font-medium rounded-lg"
                >
                  Create Account
                </Button>
              )}
            </div>

            {/* Submit Button - Only visible on medium and larger screens */}
            <div className="md:col-span-2 pt-3 hidden md:block">
              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary-hover text-white py-5 text-base font-medium rounded-lg"
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
