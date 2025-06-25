import { Button } from "@/components/ui/button";
import { PlusCircle, BarChart3, Activity, AlertTriangle } from "lucide-react";
import {
  Card,
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
import DealCard from "../../components/DealCard";
import { useState } from "react";

const deals =     [
  {
    id: 1,
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
    id: 2,
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
    id: 3,
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
    id: 4,
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
    id: 5,
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
    id: 6,
    name: "Lisinopril 10mg",
    type: "Exchange",
    quantity: 50,
    expires: "2024-11-15",
    minPrice: "EGP200.00",
    offers: 2,
    status: "Active",
    isNew: false,
  },
]

export default function Deals() {
  const [searchDeal,setSearchDeal]=useState("")
  const filteredDeals = deals.filter(deal => 
    deal.name.toLowerCase().includes(searchDeal.toLowerCase())
  )
  
  const handleSearch=(e)=>{
    setSearchDeal(e.target.value)
  }
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
      <section className="py-5 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
            <Card className="py-4 border-l-8 border-blue-500 bg-gradient-to-br from-blue-50 to-white shadow-lg">
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <BarChart3 className="w-8 h-8 text-blue-500" />
                </div>
                <div>
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Deals
                  </CardTitle>
                  <CardDescription className="text-3xl font-bold">
                    12
                  </CardDescription>
                </div>
              </CardHeader>
            </Card>
            <Card className="py-4 border-l-8 border-green-500 bg-gradient-to-br from-green-50 to-white shadow-lg">
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <Activity className="w-8 h-8 text-green-500" />
                </div>
                <div>
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Active Deals
                  </CardTitle>
                  <CardDescription className="text-3xl font-bold">
                    8
                  </CardDescription>
                </div>
              </CardHeader>
            </Card>
            <Card className="py-4 border-l-8 border-red-500 bg-gradient-to-br from-red-50 to-white shadow-lg">
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="bg-red-100 p-3 rounded-full">
                  <AlertTriangle className="w-8 h-8 text-red-500" />
                </div>
                <div>
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Expired Deals
                  </CardTitle>
                  <CardDescription className="text-3xl font-bold">
                    2
                  </CardDescription>
                </div>
              </CardHeader>
            </Card>
          </div>

          {/* Filters */}
          <Card className="p-4 mb-8">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="relative w-full md:w-1/3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input onChange={handleSearch} placeholder="Search medicine..." className="pl-10" />
              </div>
              <Select>
                <SelectTrigger className="w-full md:w-auto">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
             <div className="flex flex-col md:flex-row items-center gap-2">
               <Button variant="outline" className="w-full md:w-auto">
                <ArrowUpDown className="mr-2 h-4 w-4" />
                Expiry Date
              </Button>
              <Button variant="outline" className="w-full md:w-auto">
                Clear Filters
              </Button>
             </div>
            </div>
          </Card>
          {/* Deals Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDeals.map((deal, index) => (
              <DealCard key={index} deal={deal} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
