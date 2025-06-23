import React from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowUpDown, Search } from "lucide-react";
import DealCard from "./DealCard";
import { Badge } from "@/components/ui/badge";

const deals = [
  {
    name: "Metformin 850mg",
    type: "Sell",
    quantity: 200,
    expires: "2023-08-01",
    minPrice: "EGP200.00",
    offers: 8,
    status: "Expired",
    isNew: false,
  },
  {
    name: "Omeprazole 20mg",
    type: "Exchange",
    quantity: 120,
    expires: "2023-12-31",
    minPrice: "EGP200.00",
    offers: 4,
    status: "Expired",
    isNew: false,
  },
  {
    name: "Albuterol Inhaler",
    type: "Sell",
    quantity: 20,
    expires: "2024-07-25",
    minPrice: "EGP90.00",
    offers: 6,
    status: "Active",
    isNew: true,
  },
  {
    name: "Sertraline 50mg",
    type: "Exchange",
    quantity: 30,
    expires: "2024-09-10",
    minPrice: "EGP200.00",
    offers: 1,
    status: "Closed",
    isNew: false,
  },
  {
    name: "Prednisone 10mg",
    type: "Sell",
    quantity: 40,
    expires: "2024-10-05",
    minPrice: "EGP60.00",
    offers: 1,
    status: "Active",
    isNew: false,
  },
  {
    name: "Lisinopril 10mg",
    type: "Exchange",
    quantity: 50,
    expires: "2024-11-15",
    minPrice: "EGP200.00",
    offers: 2,
    status: "Active",
    isNew: false,
  },
];

export default function Deals() {
  return (
    <div className="min-h-screen">
      <section className="py-10 px-4 text-foreground">
        <div className="max-w-6xl mx-auto flex flex-row justify-between items-center">
          <h1 className="text-4xl font-bold">My Deals</h1>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> Create New Deal
          </Button>
        </div>
      </section>
      <section className="py-10 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
            <Card className="p-4">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Deals
                </CardTitle>
                <CardDescription className="text-3xl font-bold">
                  12
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="p-4">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Active Deals
                </CardTitle>
                <CardDescription className="text-3xl font-bold">
                  8
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="p-4">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Expired Deals
                </CardTitle>
                <CardDescription className="text-3xl font-bold">
                  2
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* Filters */}
          <Card className="p-4 mb-8">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="relative w-full md:w-1/3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input placeholder="Search medicine..." className="pl-10" />
              </div>
              <Select>
                <SelectTrigger className="w-full md:w-auto">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="w-full md:w-auto">
                <ArrowUpDown className="mr-2 h-4 w-4" />
                Expiry Date
              </Button>
              <Button variant="outline" className="w-full md:w-auto">
                Clear Filters
              </Button>
            </div>
          </Card>
          {/* Deals Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {deals.map((deal, index) => (
              <DealCard key={index} deal={deal} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
