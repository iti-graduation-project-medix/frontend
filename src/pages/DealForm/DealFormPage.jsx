import React from "react";
import { DealForm } from "../../components/Deal-form";

export default function DealFormPage() {
  return (
    <div className="min-h-svh">
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-7xl">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl text-primary md:text-4xl font-bold mb-3">
            Post Your Medicine Deal
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Share your medicine deals with our community. Connect with buyers
            and sellers in the medical marketplace
          </p>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row items-start justify-center gap-8 lg:gap-12">
          {/* Right Side - Form Section */}
          <div className="w-full lg:w-7/12">
            <DealForm />
          </div>
        </div>
      </div>
    </div>
  );
}
