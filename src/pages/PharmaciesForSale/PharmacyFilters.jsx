import { Input } from "../../components/ui/input";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectContent,
} from "../../components/ui/select";
import { Button } from "../../components/ui/button";
import { useState, useEffect, useRef } from "react";
import { Search, Loader2, ChevronDown, X } from "lucide-react";

// Use the exact same governorate list as in pharmacy creation
const EGYPT_GOVERNORATES = [
  "Cairo",
  "Giza",
  "Alexandria",
  "Dakahlia",
  "Red Sea",
  "Beheira",
  "Fayoum",
  "Gharbiya",
  "Ismailia",
  "Menofia",
  "Minya",
  "Qaliubiya",
  "New Valley",
  "Suez",
  "Aswan",
  "Assiut",
  "Beni Suef",
  "Port Said",
  "Damietta",
  "Sharkia",
  "South Sinai",
  "Kafr El Sheikh",
  "Matrouh",
  "Luxor",
  "Qena",
  "North Sinai",
  "Sohag",
];

const types = [
  { value: "pharmacy_only", label: "Pharmacy Only" },
  { value: "pharmacy_with_medicines", label: "Pharmacy with Medicines" },
];

export default function PharmacyFilters({
  filters,
  setFilters,
  onClear,
  isSearching = false,
  isPriceFiltering = false,
}) {
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [citySearchTerm, setCitySearchTerm] = useState("");
  const cityDropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        cityDropdownRef.current &&
        !cityDropdownRef.current.contains(event.target)
      ) {
        setIsCityDropdownOpen(false);
        setCitySearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Filter cities based on search term
  const filteredCities = EGYPT_GOVERNORATES.filter((city) =>
    city.toLowerCase().includes(citySearchTerm.toLowerCase())
  );

  // Show first 6 cities initially, or filtered results if searching
  const displayedCities = citySearchTerm
    ? filteredCities
    : EGYPT_GOVERNORATES.slice(0, 6);

  const handleCitySelect = (city) => {
    setFilters((f) => ({ ...f, governorate: city })); // Use 'governorate' instead of 'city'
    setIsCityDropdownOpen(false);
    setCitySearchTerm("");
  };

  const handleCityClear = () => {
    setFilters((f) => ({ ...f, governorate: undefined })); // Use 'governorate' instead of 'city'
    setCitySearchTerm("");
  };

  return (
    <div className="flex flex-wrap gap-4 items-end mb-2">
      <div className="relative w-56">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        {isSearching && (
          <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary w-4 h-4 animate-spin" />
        )}
        <Input
          placeholder="Search by name or location"
          value={filters.search || ""}
          onChange={(e) =>
            setFilters((f) => ({ ...f, search: e.target.value }))
          }
          className={`w-full rounded-lg border-primary/30 focus:border-primary focus:ring-primary/30 shadow-sm ${
            filters.search ? "pl-10" : "pl-10"
          } ${isSearching ? "pr-10" : ""}`}
        />
      </div>

      {/* Custom City Select with Search */}
      <div className="relative w-40" ref={cityDropdownRef}>
        <div
          className={`flex items-center justify-between w-full px-3 py-2 rounded-lg border cursor-pointer transition-colors ${
            isCityDropdownOpen
              ? "border-primary ring-2 ring-primary/30"
              : "border-primary/30 hover:border-primary/50"
          } ${filters.governorate ? "bg-primary/5" : ""}`}
          onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
        >
          <span
            className={`truncate ${
              filters.governorate ? "text-primary font-medium" : "text-gray-500"
            }`}
          >
            {filters.governorate || "All Governorate"}
          </span>
          <div className="flex items-center gap-1">
            {filters.governorate && (
              <X
                className="w-4 h-4 text-gray-400 hover:text-gray-600"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCityClear();
                }}
              />
            )}
            <ChevronDown
              className={`w-4 h-4 transition-transform ${
                isCityDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </div>
        </div>

        {isCityDropdownOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-hidden">
            {/* Search Input */}
            <div className="p-2 border-b border-gray-100">
              <Input
                placeholder="Search ..."
                value={citySearchTerm}
                onChange={(e) => setCitySearchTerm(e.target.value)}
                className="w-full h-8 text-sm border-gray-200 focus:border-primary focus:ring-primary/30"
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            {/* Cities List */}
            <div className="max-h-48 overflow-y-auto">
              {displayedCities.length > 0 ? (
                displayedCities.map((city) => (
                  <div
                    key={city}
                    className={`px-3 py-2 cursor-pointer hover:bg-primary/10 transition-colors ${
                      filters.governorate === city
                        ? "bg-primary/20 text-primary font-medium"
                        : ""
                    }`}
                    onClick={() => handleCitySelect(city)}
                  >
                    {city}
                  </div>
                ))
              ) : (
                <div className="px-3 py-2 text-gray-500 text-sm">
                  No governorate found
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="relative w-28">
        {isPriceFiltering && (
          <Loader2 className="absolute right-2 top-1/2 transform -translate-y-1/2 text-primary w-4 h-4 animate-spin" />
        )}
        <Input
          type="number"
          placeholder="Min Price"
          value={filters.minPrice || ""}
          onChange={(e) =>
            setFilters((f) => ({ ...f, minPrice: e.target.value }))
          }
          className={`w-full rounded-lg border-primary/30 focus:border-primary focus:ring-primary/30 ${
            isPriceFiltering ? "pr-8" : ""
          }`}
          min={0}
        />
      </div>
      <div className="relative w-28">
        {isPriceFiltering && (
          <Loader2 className="absolute right-2 top-1/2 transform -translate-y-1/2 text-primary w-4 h-4 animate-spin" />
        )}
        <Input
          type="number"
          placeholder="Max Price"
          value={filters.maxPrice || ""}
          onChange={(e) =>
            setFilters((f) => ({ ...f, maxPrice: e.target.value }))
          }
          className={`w-full rounded-lg border-primary/30 focus:border-primary focus:ring-primary/30 ${
            isPriceFiltering ? "pr-8" : ""
          }`}
          min={0}
        />
      </div>
      <Select
        value={filters.saleType}
        onValueChange={(val) => setFilters((f) => ({ ...f, saleType: val }))}
      >
        <SelectTrigger
          className="w-48 rounded-lg border-primary/30 focus:border-primary focus:ring-primary/30"
          placeholder="All Types"
        >
          {types.find((t) => t.value === filters.saleType)?.label ||
            "All Types"}
        </SelectTrigger>
        <SelectContent>
          {types.map((type) => (
            <SelectItem key={type.value} value={type.value}>
              {type.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        variant="outline"
        className="rounded-lg border-primary/30 text-primary"
        onClick={() => {
          setFilters({});
          onClear && onClear();
        }}
      >
        Clear Filters
      </Button>
    </div>
  );
}
