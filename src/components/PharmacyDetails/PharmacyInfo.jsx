import React from "react";
import { Heart, Share2 } from "lucide-react";

export default function PharmacyInfo({ pharmacy }) {
  return (
    <div className="relative rounded-2xl shadow-lg p-8 mb-4 bg-gradient-to-r from-primary/90 to-blue-400/80 flex flex-col gap-2 overflow-hidden">
      {/* Icon */}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 z-10">
        <div className="flex items-center gap-6">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white drop-shadow mb-0">
            {pharmacy.name}
          </h1>
          <span className="text-2xl font-bold text-white bg-primary/40 px-4 py-2 rounded-xl ml-2 shadow-lg">
            {Number(pharmacy.pharmacyPrice).toLocaleString()} EGP
          </span>
        </div>
        <div className="flex items-center gap-3 mt-2 sm:mt-0">
          {pharmacy.saleType === "pharmacy_with_medicines" ? (
            <span className="bg-green-200 text-green-800 text-xs font-semibold px-3 py-1 rounded-full shadow">
              With Medicines
            </span>
          ) : (
            <span className="bg-blue-200 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full shadow">
              Pharmacy Only
            </span>
          )}
          <button className="p-3 rounded-full bg-white/80 hover:bg-white shadow-lg transition ml-2">
            <Heart className="w-6 h-6 text-primary" />
          </button>
          <button className="p-3 rounded-full bg-white/80 hover:bg-white shadow-lg transition">
            <Share2 className="w-6 h-6 text-primary" />
          </button>
        </div>
      </div>
    </div>
  );
}
