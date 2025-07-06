import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  CreditCard,
  Package,
  Pencil,
  ShoppingCart,
  XCircle,
  MessageSquare,
  Pill,
  Building2,
} from "lucide-react";
import { Link } from "react-router-dom";

const DealCard = ({ deal, onClose }) => {
  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Helper function to determine status
  const getDealStatus = (deal) => {
    if (deal.isClosed) return "Closed";

    const expiryDate = new Date(deal.expiryDate);
    const now = new Date();

    if (expiryDate < now) return "Expired";
    return "Active";
  };

  const getStatusPill = (status) => {
    switch (status) {
      case "Active":
        return (
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="text-sm font-medium text-green-600">Active</span>
          </div>
        );
      case "Expired":
        return (
          <Badge variant="outline" className="border-red-500 text-red-500">
            Expired
          </Badge>
        );
      case "Closed":
        return (
          <Badge variant="outline" className="border-gray-500 text-gray-500">
            Closed
          </Badge>
        );
      default:
        return null;
    }
  };

  const status = getDealStatus(deal);

  return (
    <Card className="flex flex-col justify-between py-4">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="flex flex-col text-lg font-bold">
            {deal.medicineName || "Unnamed Medicine"}
          </CardTitle>
          <Badge
            variant={deal.dealType === "sell" ? "default" : "secondary"}
            className="whitespace-nowrap text-white"
          >
            {deal.dealType === "sell"
              ? "Sell"
              : deal.dealType === "exchange"
              ? "Exchange"
              : "Both"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent style={{ marginTop: "-10px" }}>
        <div className="grid grid-cols-2 gap-4  text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <CreditCard size={16} />
            <span>Price: EGP {parseFloat(deal.price || 0).toFixed(2)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Package size={16} />
            <span>Quantity: {deal.quantity || 0}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={16} />
            <span>Created: {formatDate(deal.createdAt)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={16} />
            <span>Expires: {formatDate(deal.expiryDate)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Pill size={16} />
            <span>Form: {deal.dosageForm || "N/A"}</span>
          </div>
          <div className="flex items-center gap-2">
            <MessageSquare size={16} />
            <span>Offers: {deal.offersCount || 0}</span>
          </div>
          <div className="flex items-center gap-2">
            <Package size={16} />
            <span>Box: {deal.boxStatus || "N/A"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Building2 size={16} />
            <span>Pharmacy: {deal.pharmacy?.name || "N/A"}</span>
          </div>
        </div>
        <div className="flex justify-between items-center mt-4 pt-4 border-t">
          <div>{getStatusPill(status)}</div>
          {status === "Active" && (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Link
                  className="flex items-center"
                  to={`/deals/edit/${deal.id}`}
                >
                  <Pencil className="mr-2 h-4 w-4" /> Edit
                </Link>
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onClose && onClose(deal.id)}
              >
                <XCircle className="mr-2 h-4 w-4" /> Close
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DealCard;
