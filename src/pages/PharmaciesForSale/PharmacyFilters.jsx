import { Input } from "../../components/ui/input";
import { Select, SelectItem, SelectTrigger, SelectContent } from "../../components/ui/select";
import { Button } from "../../components/ui/button";
import { useState } from "react";

const cities = ["Cairo", "Alexandria", "Giza", "Mansoura", "Tanta"]; // Example cities
const types = [
  { value: "pharmacy_only", label: "Pharmacy Only" },
  { value: "pharmacy_with_medicines", label: "Pharmacy with Medicines" },
];

export default function PharmacyFilters({ filters, setFilters, onClear }) {
  return (
    <div className="flex flex-wrap gap-4 items-end mb-2">
      <Input
        placeholder="Search by name or location"
        value={filters.search || ""}
        onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
        className="w-56 rounded-lg border-primary/30 focus:border-primary focus:ring-primary/30 shadow-sm"
      />
      <Select
        value={filters.city}
        onValueChange={val => setFilters(f => ({ ...f, city: val }))}
      >
        <SelectTrigger className="w-40 rounded-lg border-primary/30 focus:border-primary focus:ring-primary/30" placeholder="All Cities">
          {filters.city ? filters.city : "All Cities"}
        </SelectTrigger>
        <SelectContent>
          {cities.map(city => (
            <SelectItem key={city} value={city}>{city}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input
        type="number"
        placeholder="Min Price"
        value={filters.minPrice || ""}
        onChange={e => setFilters(f => ({ ...f, minPrice: e.target.value }))}
        className="w-28 rounded-lg border-primary/30 focus:border-primary focus:ring-primary/30"
        min={0}
      />
      <Input
        type="number"
        placeholder="Max Price"
        value={filters.maxPrice || ""}
        onChange={e => setFilters(f => ({ ...f, maxPrice: e.target.value }))}
        className="w-28 rounded-lg border-primary/30 focus:border-primary focus:ring-primary/30"
        min={0}
      />
      <Select
        value={filters.saleType}
        onValueChange={val => setFilters(f => ({ ...f, saleType: val }))}
      >
        <SelectTrigger className="w-48 rounded-lg border-primary/30 focus:border-primary focus:ring-primary/30" placeholder="All Types">
          {types.find(t => t.value === filters.saleType)?.label || "All Types"}
        </SelectTrigger>
        <SelectContent>
          {types.map(type => (
            <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button variant="outline" className="rounded-lg border-primary/30 text-primary" onClick={() => { setFilters({}); onClear && onClear(); }}>Clear Filters</Button>
    </div>
  );
} 