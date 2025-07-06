import React from "react";
import {
  Star,
  ShoppingBag,
  GraduationCap,
  HeartPulse,
  MapPin,
  ThumbsUp,
  BedDouble,
} from "lucide-react";

const ratings = [
  {
    label: "Health Services",
    value: 9,
    icon: <HeartPulse className="w-5 h-5 text-blue-500" />,
  },
  {
    label: "Shopping & Dining",
    value: 10,
    icon: <ShoppingBag className="w-5 h-5 text-blue-500" />,
  },
  {
    label: "Education",
    value: 9,
    icon: <GraduationCap className="w-5 h-5 text-blue-500" />,
  },
  {
    label: "Location",
    value: 6,
    icon: <MapPin className="w-5 h-5 text-blue-500" />,
  },
  {
    label: "Peacefulness",
    value: 9,
    icon: <BedDouble className="w-5 h-5 text-blue-500" />,
  },
  {
    label: "Social Status",
    value: 10,
    icon: <ThumbsUp className="w-5 h-5 text-blue-500" />,
  },
];

export default function AreaRatings() {
  return (
    <div className="bg-gradient-to-r from-primary/5 to-blue-50 rounded-xl shadow p-6 border border-primary/10 mb-4">
      <h2 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
        <Star className="w-6 h-6 text-primary" /> 🏙 Area Ratings
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {ratings.map((r) => (
          <div
            key={r.label}
            className="flex items-center gap-2 bg-blue-50 rounded-lg px-4 py-3 min-w-[160px] shadow"
          >
            {r.icon}
            <span className="font-semibold text-blue-800">{r.label}:</span>
            <span className="text-blue-700 font-bold">{r.value}/10</span>
          </div>
        ))}
      </div>
    </div>
  );
}
