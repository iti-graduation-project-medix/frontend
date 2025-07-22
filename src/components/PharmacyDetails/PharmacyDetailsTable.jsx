import React from "react";
import {
  Building2,
  Ruler,
  Key,
  TrendingUp,
  CreditCard,
  Calendar,
  MapPin,
  DollarSign,
} from "lucide-react";

export default function PharmacyDetailsTable({ pharmacy }) {
  const pricePerSqm =
    pharmacy.pharmacyPrice && pharmacy.area
      ? Math.round(pharmacy.pharmacyPrice / pharmacy.area)
      : null;

  const details = [
    {
      icon: Ruler,
      label: "Size",
      value: "94 m²",
      color: "text-green-600",
    },
    {
      icon: Key,
      label: "License Number",
      value: pharmacy.licenseNum || "N/A",
      color: "text-purple-600",
    },
    {
      icon: TrendingUp,
      label: "Monthly Sales",
      value: pharmacy.monthlySales
        ? Number(pharmacy.monthlySales).toLocaleString() + " EGP"
        : "Not specified",
      color: "text-orange-600",
    },
    {
      icon: CreditCard,
      label: "Payment Type",
      value: "Cash / Installments",
      color: "text-indigo-600",
    },
    {
      icon: Calendar,
      label: "Date Posted",
      value: pharmacy.createdAt
        ? new Date(pharmacy.createdAt).toLocaleDateString()
        : "Recently",
      color: "text-gray-600",
    },
    {
      icon: MapPin,
      label: "Location",
      value: pharmacy.addressLine1 || "Not specified",
      color: "text-red-600",
    },
  ];

  return (
    <div className="bg-white dark:bg-card rounded-2xl shadow-sm border border-gray-100 dark:border-border p-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-gray-100 dark:bg-card rounded-lg flex items-center justify-center">
          <Building2 className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-foreground">
            Pharmacy Details
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Complete information about this pharmacy
          </p>
        </div>
      </div>
      {/* Price Section */}
      <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-background dark:to-card rounded-xl border border-blue-100 dark:border-border">
        <div className="flex items-baseline gap-3 mb-2">
          <span className="text-4xl font-bold text-gray-900 dark:text-foreground">
            {Number(pharmacy.pharmacyPrice).toLocaleString()}
          </span>
          <span className="text-xl text-gray-600 dark:text-gray-400">EGP</span>
        </div>
        {pricePerSqm && (
          <p className="text-gray-500 dark:text-gray-400">
            {pricePerSqm.toLocaleString()} EGP per m²
          </p>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {details.map((detail, index) => {
          const IconComponent = detail.icon;
          return (
            <div
              key={index}
              className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 dark:bg-background border border-gray-100 dark:border-border hover:bg-gray-100 dark:hover:bg-muted/10 transition-colors"
            >
              <div
                className={`w-8 h-8 rounded-lg bg-white dark:bg-card flex items-center justify-center border border-gray-200 dark:border-border`}
              >
                <IconComponent className={`w-4 h-4 ${detail.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  {detail.label}
                </p>
                <p className="text-base font-semibold text-gray-900 dark:text-foreground truncate">
                  {detail.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
