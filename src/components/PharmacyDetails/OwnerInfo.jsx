import React from "react";
import { User, Phone, Mail } from "lucide-react";

export default function OwnerInfo({ owner }) {
  if (!owner) return null;
  // Use initials for avatar
  const initials = owner.fullName
    ? owner.fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "👤";
  return (
    <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-100 w-full sm:w-80 h-fit">
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-100">
        <User className="w-5 h-5 text-primary" />
        <span className="font-bold text-primary">Contact Owner</span>
      </div>
      <div className="flex items-center gap-3 mb-3">
        <span className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold border-2 border-primary/30">
          {initials}
        </span>
        <div>
          <div className="font-semibold text-gray-800">{owner.fullName}</div>
          <div className="text-xs text-gray-500">Pharmacy Owner</div>
        </div>
      </div>
      <div className="space-y-2">
        <a
          href={`tel:${owner.phone}`}
          className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition"
        >
          <Phone className="w-4 h-4" />
          <span className="underline">{owner.phone}</span>
        </a>
        <a
          href={`mailto:${owner.email}`}
          className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition"
        >
          <Mail className="w-4 h-4" />
          <span className="underline truncate">{owner.email}</span>
        </a>
      </div>
    </div>
  );
}
