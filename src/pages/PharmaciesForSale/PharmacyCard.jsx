import { Card } from "../../components/ui/card";
import { Heart, MapPin, Ruler, Phone, User, Map } from "lucide-react";

export default function PharmacyCard({ pharmacy, onViewDetails }) {
  // Image
  const imageUrl =
    pharmacy.imagesUrls && pharmacy.imagesUrls.length > 0
      ? pharmacy.imagesUrls[0]
      : "/public/avatars/client1.webp";

  // Price
  const price = pharmacy.pharmacyPrice
    ? `${Number(pharmacy.pharmacyPrice).toLocaleString()} EGP`
    : "Price on request";
  // Price per meter (if you have area and price)
  let pricePerMeter = null;
  if (pharmacy.pharmacyPrice && pharmacy.area) {
    const perMeter = Number(pharmacy.pharmacyPrice) / Number(pharmacy.area);
    pricePerMeter = `${Math.round(perMeter).toLocaleString()} EGP/m`;
  } else if (pharmacy.monthlySales) {
    pricePerMeter = `${Number(pharmacy.monthlySales).toLocaleString()} EGP/m`;
  }

  // Area (if available)
  const area = pharmacy.area || pharmacy.size || pharmacy.m2 || null;

  // Address
  const address = [pharmacy.governorate, pharmacy.city, pharmacy.addressLine1]
    .filter(Boolean)
    .join(" / ");

  // Verified
  const isVerified = pharmacy.owner?.isIdVerified;

  return (
    <Card
      className="bg-white rounded-xl shadow-md border border-gray-100 w-full min-w-[300px] max-w-[400px] mx-auto overflow-hidden flex flex-col cursor-pointer transition hover:shadow-lg hover:border-primary"
      onClick={() => onViewDetails && onViewDetails(pharmacy)}
    >
      {/* Image section */}
      <div className="relative aspect-video w-full bg-gray-100">
        <img
          src={imageUrl}
          alt={pharmacy.name}
          className="w-full h-54 object-cover"
        />
        {/* Verified badge */}
        {isVerified && (
          <span className="absolute top-2 left-2 bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded shadow">
            Verified
          </span>
        )}
        {/* Heart icon */}
        <button className="absolute top-2 right-2 bg-white/80 rounded-full p-1 shadow">
          <Heart className="w-5 h-5 text-gray-400" />
        </button>
      </div>
      {/* Content section */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="flex flex-col gap-0.5 mb-1">
          <span className="text-xl font-bold text-primary leading-tight">
            {price}
          </span>
          {pricePerMeter && (
            <span className="text-xs text-gray-500">
              Sales per month:{" "}
              <span className="font-semibold text-primary">
                {pricePerMeter.replace("EGP/m", "EGP")}
              </span>
            </span>
          )}
        </div>
        <div className="text-base font-semibold text-gray-800 truncate mb-1">
          {pharmacy.name}
        </div>

        {/* Sale type badge */}
        <div className="flex items-center gap-2 mb-1">
          {pharmacy.saleType === "pharmacy_with_medicines" ? (
            <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded">
              With Medicines
            </span>
          ) : (
            <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded">
              Pharmacy Only
            </span>
          )}
        </div>
        {/* Owner name */}
        {pharmacy.owner?.fullName && (
          <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
            <User className="w-4 h-4" />
            <span className="truncate">{pharmacy.owner.fullName}</span>
          </div>
        )}
        {/* Phone */}
        {pharmacy.pharmacyPhone && (
          <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
            <Phone className="w-4 h-4" />
            <a
              href={`tel:${pharmacy.pharmacyPhone}`}
              className="text-primary underline truncate"
            >
              {pharmacy.pharmacyPhone}
            </a>
          </div>
        )}
        {/* Location row */}
        <div className="flex items-center text-xs text-gray-500 gap-1 mb-1">
          <MapPin className="w-4 h-4" />
          <span className="truncate">{address}</span>
        </div>
        {/* View on Map */}
        {pharmacy.location?.coordinates && (
          <div className="flex items-center gap-1 text-xs text-blue-600 mb-1">
            <Map className="w-4 h-4" />
            <a
              href={`https://www.google.com/maps?q=${pharmacy.location.coordinates[1]},${pharmacy.location.coordinates[0]}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline truncate"
            >
              View on Map
            </a>
          </div>
        )}
        {/* Area row */}
        {area && (
          <div className="flex items-center text-xs text-gray-500 gap-1">
            <Ruler className="w-4 h-4" />
            <span>{area} m²</span>
          </div>
        )}
      </div>
    </Card>
  );
}
