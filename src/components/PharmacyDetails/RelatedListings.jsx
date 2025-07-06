import React from "react";
import PharmacyCard from "../../pages/PharmaciesForSale/PharmacyCard";

export default function RelatedListings({ pharmacy }) {
  // Mock 3 similar pharmacies using the current pharmacy data
  const related = [1, 2, 3].map((i) => ({
    ...pharmacy,
    id: pharmacy.id + "-rel" + i,
  }));
  return (
    <div>
      <h2 className="text-xl font-bold text-primary mb-4">Related Listings</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {related.map((pharm) => (
          <PharmacyCard key={pharm.id} pharmacy={pharm} />
        ))}
      </div>
    </div>
  );
}
