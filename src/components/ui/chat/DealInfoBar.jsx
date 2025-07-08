import React, { useState, useEffect } from "react";
import { Badge } from "../badge";
import { Card } from "../card";
import { Package, Banknote, ChevronDown, ChevronUp } from "lucide-react";
import { Link } from "react-router-dom";

export default function DealInfoBar({ deal }) {
  if (!deal) return null;

  // Responsive: collapsed by default on mobile, expanded on desktop
  const [expanded, setExpanded] = useState(true);
  useEffect(() => {
    const handleResize = () => {
      setExpanded(window.innerWidth >= 640); // sm breakpoint
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Helper functions
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  const getStatus = () => {
    if (deal.isClosed) return "Closed";
    if (deal.expiryDate && new Date(deal.expiryDate) < new Date())
      return "Expired";
    return "Active";
  };
  const status = getStatus();

  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-2xl border border-cyan-400/30 backdrop-blur-sm text-sm shrink-0">
      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
        <Package className="w-6 h-6 text-white" />
      </div>
      <span className="font-bold text-blue-900 text-base sm:text-lg truncate flex-1">
        {deal.medicineName || deal.title || "Deal"}
      </span>
      <Badge className="bg-blue-100 text-blue-700 border border-blue-200 text-xs">
        {deal.dealType || "Type"}
      </Badge>
      <Badge
        className={`text-xs ${
          status === "Active"
            ? "bg-green-100 text-green-700 border-green-200"
            : status === "Closed"
            ? "bg-gray-100 text-gray-700 border-gray-200"
            : "bg-red-100 text-red-700 border-red-200"
        }`}
      >
        {status}
      </Badge>
      <Link
        to={`/all-deals/${deal.id}`}
        className="ml-2 px-3 py-2 rounded bg-blue-500 text-white text-xs font-semibold hover:bg-blue-600 transition text-center"
      >
        View Deal Details
      </Link>
      <button
        className="ml-2 p-1 rounded hover:bg-blue-100 transition"
        onClick={() => setExpanded((e) => !e)}
        aria-label={expanded ? "Collapse" : "Expand"}
      >
        {expanded ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
      </button>
      {expanded && (
        <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm text-gray-700 mt-2">
          <span className="flex items-center gap-1">
            <Banknote className="w-4 h-4" /> <b>Price:</b> {deal.price} EGP
          </span>
          <span className="flex items-center gap-1">
            <Package className="w-4 h-4" /> <b>Qty:</b> {deal.quantity}
          </span>
          <span className="flex items-center gap-1">
            <b>Expiry:</b> {formatDate(deal.expiryDate)}
          </span>
          <span className="flex items-center gap-1">
            <b>Form:</b> {deal.dosageForm}
          </span>
          <span className="flex items-center gap-1">
            <b>Box:</b> {deal.boxStatus}
          </span>
          {deal.description && (
            <span className="flex items-center gap-1">
              <b>Description:</b> {deal.description}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
