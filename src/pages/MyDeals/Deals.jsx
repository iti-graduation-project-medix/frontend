import { Button } from "@/components/ui/button";
import { PlusCircle, CheckCircle, TrendingUp, Clock } from "lucide-react";
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
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDeals } from "../../store/useDeals";

export default function Deals() {
  const [searchDeal, setSearchDeal] = useState("");
  const [status, setStatus] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  // Use store
  const { deals, isLoading, error, fetchUserDeals,updateDealStatus } = useDeals();

  useEffect(() => {
    fetchUserDeals();
  }, [fetchUserDeals]);

  let filteredDeals = (deals || []).filter((deal) => {
    const dealStatus = deal.isClosed ? "Closed" : 
      new Date(deal.expiryDate) < new Date() ? "Expired" : "Active";
    
    return (
      (deal.medicineName?.toLowerCase() || "").includes(searchDeal.toLowerCase()) &&
      dealStatus.toLowerCase().includes(status.toLowerCase())
    );
  });

  if (sortOrder === "asc") {
    filteredDeals = [...filteredDeals].sort(
      (a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime()
    );
  } else if (sortOrder === "desc") {
    filteredDeals = [...filteredDeals].sort(
      (a, b) => new Date(b.expiryDate).getTime() - new Date(a.expiryDate).getTime()
    );
  }

  const handleSearch = (e) => {
    setSearchDeal(e.target.value);
  };
  const handleStatuses = (val) => {
    val === "all" ? setStatus("") : setStatus(val);
  };
  const handleExpiry = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const handleClearFilters = () => {
    setSearchDeal("");
    setStatus("");
    setSortOrder("asc");
  };

  const handleCloseDeal = (dealId) => {
  updateDealStatus(dealId,true);
  };

  // Calculate stats dynamically
  const activeDealsCount = (deals || []).filter(
    (deal) => !deal.isClosed && new Date(deal.expiryDate) >= new Date()
  ).length;
  const closedDealsCount = (deals || []).filter(
    (deal) => deal.isClosed
  ).length;
  const expiredDealsCount = (deals || []).filter(
    (deal) => !deal.isClosed && new Date(deal.expiryDate) < new Date()
  ).length;

  return (
    <div className="min-h-screen">
      <section className="py-10 px-4 text-foreground">
        <div className="max-w-6xl mx-auto flex flex-row justify-between items-center">
          <h1 className="text-4xl font-bold">My Deals</h1>
          <Link to={"/deals/new"}>
            <Button>
              <PlusCircle className="h-4 w-4" />
              Create New Deal
            </Button>
          </Link>
        </div>
      </section>
      <section className="py-5 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
            <Card className="py-4 border-l-8 border-green-500 bg-gradient-to-br from-green-50 to-white shadow-lg">
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <TrendingUp className="w-8 h-8 text-green-500" />
                </div>
                <div>
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Active Deals
                  </CardTitle>
                  <CardDescription className="text-3xl font-bold">
                    {activeDealsCount}
                  </CardDescription>
                </div>
              </CardHeader>
            </Card>
            <Card className="py-4 border-l-8 border-blue-500 bg-gradient-to-br from-blue-50 to-white shadow-lg">
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <CheckCircle className="w-8 h-8 text-blue-500" />
                </div>
                <div>
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Closed Deals
                  </CardTitle>
                  <CardDescription className="text-3xl font-bold">
                    {closedDealsCount}
                  </CardDescription>
                </div>
              </CardHeader>
            </Card>
            <Card className="py-4 border-l-8 border-red-500 bg-gradient-to-br from-red-50 to-white shadow-lg">
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="bg-red-100 p-3 rounded-full">
                  <Clock className="w-8 h-8 text-red-500" />
                </div>
                <div>
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Expired Deals
                  </CardTitle>
                  <CardDescription className="text-3xl font-bold">
                    {expiredDealsCount}
                  </CardDescription>
                </div>
              </CardHeader>
            </Card>
          </div>

          {/* Filters */}
          <Card className="p-4 mb-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="w-full flex items-center gap-2">
                <div className="relative w-full md:w-1/2">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    onChange={handleSearch}
                    value={searchDeal}
                    placeholder="Search deal..."
                    className="pl-10"
                  />
                </div>
                <Select onValueChange={handleStatuses}>
                  <SelectTrigger className="w-full md:w-auto">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col md:flex-row items-center gap-2">
                <Button
                  onClick={handleExpiry}
                  variant="outline"
                  className="w-full md:w-auto"
                >
                  <ArrowUpDown className="mr-1 h-4 w-4" />
                  Expiry Date {sortOrder === "asc" && "(↑)"}
                  {sortOrder === "desc" && "(↓)"}
                </Button>
                <Button
                  variant="outline"
                  className="w-full md:w-auto"
                  onClick={handleClearFilters}
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </Card>
          {/* Loading and Error States */}
          {isLoading && (
            <div className="text-center py-8 text-lg text-muted-foreground">Loading deals...</div>
          )}
          {error && (
            <div className="text-center py-8 text-lg text-red-500">{error}</div>
          )}
          {/* Deals Grid */}
          {!isLoading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDeals.map((deal, index) => (
                <DealCard key={deal.id || index} deal={deal} onClose={handleCloseDeal} />
              ))}
              {filteredDeals.length === 0 && (
                <div className="col-span-full text-center text-muted-foreground py-8">No deals found.</div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
