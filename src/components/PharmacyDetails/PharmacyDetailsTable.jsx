import React from "react";
import {
  BadgeCheck,
  Ruler,
  Key,
  TrendingUp,
  CreditCard,
  Calendar,
} from "lucide-react";

export default function PharmacyDetailsTable({ pharmacy }) {
  return (
    <div className="bg-gradient-to-br from-primary/5 to-blue-50 rounded-xl shadow p-8 border border-primary/10 mb-4">
      <div className="flex items-center gap-2 mb-6">
        <BadgeCheck className="w-6 h-6 text-primary" />
        <h2 className="text-xl font-bold text-primary">Pharmacy Details</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-6">
        <div className="flex items-center gap-2">
          <BadgeCheck className="w-5 h-5 text-primary" />
          <span className="font-semibold text-gray-700">Status:</span> Semi
          Finished
        </div>
        <div className="flex items-center gap-2">
          <Ruler className="w-5 h-5 text-primary" />
          <span className="font-semibold text-gray-700">Size:</span> 94 m²
        </div>
        <div className="flex items-center gap-2">
          <Key className="w-5 h-5 text-primary" />
          <span className="font-semibold text-gray-700">
            License Number:
          </span>{" "}
          {pharmacy.licenseNum}
        </div>
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          <span className="font-semibold text-gray-700">
            Monthly Sales:
          </span>{" "}
          {pharmacy.monthlySales
            ? Number(pharmacy.monthlySales).toLocaleString() + " EGP"
            : "-"}
        </div>
        <div className="flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-primary" />
          <span className="font-semibold text-gray-700">
            Payment Type:
          </span>{" "}
          Cash / Installments
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          <span className="font-semibold text-gray-700">Date Posted:</span>{" "}
          {pharmacy.createdAt
            ? new Date(pharmacy.createdAt).toLocaleDateString()
            : "-"}
        </div>
      </div>
    </div>
  );
}
