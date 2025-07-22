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
  Trash2,
} from "lucide-react";
import { Link } from "react-router-dom";

const DealCard = ({ deal, onClose, onDelete, isDeleted = false }) => {
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
    if (isDeleted) {
      return (
        <Badge
          variant="outline"
          className="border-red-500 text-red-500 bg-red-50 dark:border-red-600 dark:text-red-600 dark:bg-red-900"
        >
          Deleted
        </Badge>
      );
    }

    switch (status) {
      case "Active":
        return (
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="text-sm font-medium text-green-600 dark:text-green-400">
              Active
            </span>
          </div>
        );
      case "Expired":
        return (
          <Badge
            variant="outline"
            className="border-red-500 text-red-500 dark:border-red-600 dark:text-red-600"
          >
            Expired
          </Badge>
        );
      case "Closed":
        return (
          <Badge
            variant="outline"
            className="border-blue-500 text-blue-500 dark:border-blue-600 dark:text-blue-600"
          >
            Closed
          </Badge>
        );
      default:
        return null;
    }
  };

  // Helper function to get close button color based on status
  const getCloseButtonColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-blue-500 hover:bg-blue-600 text-white hover:text-white border-blue-500 dark:bg-blue-600 dark:hover:bg-blue-700 dark:border-blue-700";
      case "Expired":
        return "bg-red-500 hover:bg-red-600 text-white hover:text-white border-red-500 dark:bg-red-600 dark:hover:bg-red-700 dark:border-red-700";
      case "Closed":
        return "bg-gray-500 hover:bg-gray-600 text-white hover:text-white border-gray-500 dark:bg-gray-600 dark:hover:bg-gray-700 dark:border-gray-700";
      default:
        return "bg-blue-500 hover:bg-blue-600 text-white hover:text-white border-blue-500 dark:bg-blue-600 dark:hover:bg-blue-700 dark:border-blue-700";
    }
  };

  const status = getDealStatus(deal);

  return (
    <Card className="flex flex-col justify-between py-4 bg-white dark:bg-card border border-gray-200 dark:border-border">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="flex flex-col text-lg font-bold text-gray-900 dark:text-foreground">
            {deal.medicineName || "Unnamed Medicine"}
          </CardTitle>
          <Badge
            variant={deal.dealType === "sell" ? "default" : "secondary"}
            className="whitespace-nowrap text-white dark:text-white"
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
        <div className="grid grid-cols-2 gap-4  text-sm text-muted-foreground dark:text-gray-400">
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
        <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200 dark:border-border">
          <div>{getStatusPill(status)}</div>
          {status === "Active" && !isDeleted && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="border-gray-200 dark:border-border bg-white dark:bg-background text-primary dark:text-primary"
              >
                <Link
                  className="flex items-center"
                  to={`/deals/edit/${deal.id}`}
                >
                  <Pencil className="mr-2 h-4 w-4" /> Edit
                </Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className={
                  getCloseButtonColor(status) +
                  " border-gray-200 dark:border-border bg-white dark:bg-background text-primary dark:text-primary"
                }
                onClick={() => onClose && onClose(deal.id)}
              >
                <XCircle className="h-4 w-4" /> Close
              </Button>
              <Button
                variant="destructive"
                size="sm"
                className="bg-red-500 hover:bg-red-600 text-white border-red-500 dark:bg-red-700 dark:hover:bg-red-800 dark:border-red-700"
                onClick={() => onDelete && onDelete(deal.id)}
              >
                <Trash2 className="h-4 w-4" /> Delete
              </Button>
            </div>
          )}
          {isDeleted && (
            <div className="text-xs text-muted-foreground dark:text-gray-400">
              Deleted on: {formatDate(deal.deletedAt)}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DealCard;
