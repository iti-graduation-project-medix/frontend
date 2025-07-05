import React from "react";
import { MapPin } from "lucide-react";

export default function MapSection({ location, address }) {
  if (!location?.coordinates || location.coordinates.length < 2) {
    return (
      <div className="bg-white rounded-xl shadow p-6 border-l-4 border-primary/60 mb-4 relative">
        <h2 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
          <MapPin className="w-6 h-6 text-primary" /> Location
        </h2>
        <div className="w-full h-64 bg-gray-100 flex items-center justify-center rounded-xl">
          <span className="text-gray-400">No Map Location Available</span>
        </div>
      </div>
    );
  }
  const [lng, lat] = location.coordinates;
  const mapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;
  return (
    <div className="bg-white rounded-xl shadow p-6 border-l-4 border-primary/60 mb-4 relative">
      <h2 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
        <MapPin className="w-6 h-6 text-primary" /> Location
      </h2>
      <div className="w-full h-64 rounded-xl overflow-hidden shadow border border-gray-100 relative">
        <iframe
          title="Pharmacy Location"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          src={`https://www.google.com/maps?q=${lat},${lng}&z=16&output=embed`}
        ></iframe>
        <MapPin className="w-8 h-8 text-primary absolute top-2 right-2 opacity-70" />
      </div>
      <div className="mt-2 flex items-center gap-2">
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline text-sm"
        >
          View on Google Maps
        </a>
        {address && (
          <span className="text-xs text-gray-500 truncate">{address}</span>
        )}
      </div>
    </div>
  );
}
