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
} from "lucide-react";
import { Link } from "react-router-dom";

const DealCard = ({ deal, onClose }) => {
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
  return (
    <Card className="flex flex-col justify-between py-4">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="flex flex-col text-lg font-bold">
            {deal.name}
            {deal.isNew && (
              <Badge className="bg-green-100 text-green-800 hover:bg-green-100/80">
                 New
              </Badge>
            )}
          </CardTitle>
          <Badge
            variant={deal.type === "Sell" ? "default" : "secondary"}
            className="whitespace-nowrap text-white"
          >
            {deal.type}
          </Badge>
        </div>
      </CardHeader>
      <CardContent style={{ marginTop: "-10px" }}>
        <div className="grid grid-cols-2 gap-4  text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Package size={16} />
            <span>Quantity: {deal.quantity}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={16} />
            <span>Expires: {deal.expires}</span>
          </div>
          <div className="flex items-center gap-1">
            <CreditCard size={16} />
            <span>Min Price: {deal.minPrice}</span>
          </div>
          <div className="flex items-center gap-2">
            <ShoppingCart size={16} />
            <span>Offers: {deal.offers}</span>
          </div>
        </div>
        <div className="flex justify-between items-center mt-4 pt-4 border-t">
          <div>{getStatusPill(deal.status)}</div>
          {deal.status === "Active" && (
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
