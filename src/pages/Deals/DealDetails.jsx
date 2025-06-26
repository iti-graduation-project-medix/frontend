import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { CalendarClock, CalendarX, Package, Banknote } from "lucide-react"; // استيراد الأيقونات

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

export function DealDetails() {
  const product = {
    name: "Metformin Hydrochloride 500mg Tablets",
    seller: "City Central Pharmacy",
    postedBy: "City Central Pharmacy",
    postedByVerified: true,
    dealDetails: {
      quantity: "5 boxes (1000 tablets total)",
      expiryDate: "2025-10-31",
      minimumPrice: "$25.00 USD",
      description:
        "Surplus stock of Metformin 500mg tablets. High quality, securely stored. Available for immediate sale. Contact for bulk discounts."
    },
    statusInfo: { postedDate: "2024-07-15", expiryDate: "2025-10-31" },
    images: [
      {
        src: "/deal-details/drug2.png",
        alt: "Metformin tablets in packaging"
      }
    ],
    sellerInformation: {
      name: "City Central Pharmacy",
      rating: "4.9/5 (120 reviews)",
      location: "123 Main St, Metropolis"
    }
  };

  return (
    <div className="container  mx-auto px-16 max-w-7xl">
      <div className="min-h-screen bg-gray-100 py-8 lg:py-12">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Links */}

          <nav
            className="mb-6 text-base text-[color:var(--muted-foreground)]"
            aria-label="Breadcrumb"
          >
            <ol className="list-none p-0 inline-flex items-center space-x-1 md:space-x-2">
              <li>
                <Link
                  to="/"
                  className="hover:text-[color:var(--primary-hover)] font-semibold transition-colors duration-200"
                >
                  Home
                </Link>
              </li>
              <li>
                <span className="text-[color:var(--muted-foreground)]">/</span>
              </li>
              <li>
                <Link
                  to="/deals"
                  className="hover:text-[color:var(--primary-hover)] font-semibold transition-colors duration-200"
                >
                  Deals
                </Link>
              </li>
              <li>
                <span className="text-[color:var(--muted-foreground)]">/</span>
              </li>
              <li>
                <span className="text-[color:var(--foreground)] font-bold">
                  {product.name}
                </span>
              </li>
            </ol>
          </nav>

          {/* Product Title Section */}

          <div className="bg-white p-6 shadow-xl border-l-8 border-primary rounded-lg mb-6">
            <div className="text-center md:text-left">
              <h1 className="text-2xl md:text-3xl font-semibold text-primary mb-8">
                {product.name}
              </h1>
              <div className="flex flex-col md:flex-row items-center md:items-start justify-center md:justify-start text-sm text-gray-600 gap-2">
                <Badge className="whitespace-nowrap text-white me-0 md:me-4">
                  Sell
                </Badge>
                <span className="flex items-center">
                  Posted By: {product.postedBy}
                  {product.postedByVerified &&
                    <svg
                      className="w-4 h-4 text-green-500 ml-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2 mt-8">
            {/* Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              {/* Left 2/3 */}
              <div className="lg:col-span-2 space-y-6">
                <section className="max-w-6xl mx-auto mb-8">
                  <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 relative overflow-hidden rounded-3xl shadow-xl border border-gray-100 p-8">
                    {/* دوائر زخرفية */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full -mt-16 -mr-16 opacity-40 -z-10" />
                    <div className="absolute bottom-0 left-0 w-40 h-40 bg-indigo-100 rounded-full -mb-20 -ml-20 opacity-40 -z-10" />

                    {/* العنوان */}
                    <h2 className="text-3xl font-extrabold mb-8 text-primary text-center">
                      Deal Overview
                    </h2>

                    {/* العناصر */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-center">
                      {/* الكمية */}
                      <div className="flex flex-col items-center text-center gap-3">
                        <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center shadow-md">
                          <Package className="w-7 h-7" />
                        </div>
                        <div>
                          <p className="text-sm mb-2 font-semibold text-muted-foreground">
                            Quantity
                          </p>
                          <p className="text-lg font-bold">
                            {product.dealDetails.quantity}
                          </p>
                        </div>
                      </div>

                      {/* تاريخ الانتهاء */}
                      <div className="flex flex-col items-center text-center gap-3">
                        <div className="w-14 h-14 rounded-full bg-destructive/10  text-secondary flex items-center justify-center shadow-md">
                          <CalendarX className="w-7 h-7 text-red-400" />
                        </div>
                        <div>
                          <p className="text-sm mb-2  font-semibold text-muted-foreground">
                            Expiry Date
                          </p>
                          <p className="text-lg font-bold">
                            {product.dealDetails.expiryDate}
                          </p>
                        </div>
                      </div>

                      {/* السعر الأدنى */}
                      <div className="flex flex-col items-center text-center gap-3">
                        <div className="w-14 h-14 rounded-full bg-secondary/10 text-secondary flex items-center justify-center shadow-md">
                          <Banknote className="w-7 h-7  rotate-90" />
                        </div>
                        <div>
                          <p className="text-sm mb-2 font-semibold text-muted-foreground">
                            Minimum Price
                          </p>
                          <p className="text-lg font-bold">
                            {product.dealDetails.minimumPrice}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>

              {/* Right 1/3 */}
              <div className="lg:col-span-1 space-y-6 w-full">
                <Card className="p-6 md:p-6 py-19 bg-gradient-to-br from-blue-50 to-white shadow-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Posted Item */}
                    <div className="flex flex-col items-center">
                      <div className="bg-blue-100 p-4 rounded-full mb-4">
                        <CalendarClock className="w-10 h-10 text-primary" />
                      </div>
                      <div className="text-center">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                          Posted
                        </CardTitle>
                        <CardDescription className="text-lg font-bold">
                          {product.statusInfo.postedDate}
                        </CardDescription>
                      </div>
                    </div>

                    {/* Expires Item */}
                    <div className="flex flex-col items-center">
                      <div className="bg-destructive/10  p-4 rounded-full mb-4">
                        <CalendarX className="w-10 h-10 text-red-400" />
                      </div>

                      <div className="text-center">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                          Expires
                        </CardTitle>
                        <CardDescription className="text-lg font-bold">
                          {product.statusInfo.expiryDate}
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start  mt-8">
              {/* Left 2/3 */}
              <div className="lg:col-span-2 space-y-6">
                <Card className="p-6 bg-gradient-to-br from-blue-50 to-white shadow-lg mb-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                    <h2 className="text-2xl md:text-3xl font-extrabold text-primary col-span-1 text-center md:text-left">
                      Deal Details
                    </h2>

                    <p className="col-span-2 text-muted-foreground text-sm md:text-base leading-relaxed">
                      {product.dealDetails.description}
                    </p>
                  </div>
                </Card>
              </div>

              {/* Right 1/3 */}

              <div className="relative  ">
                {/* دوائر زخرفية */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full -mt-16 -mr-16 opacity-40 -z-10" />
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-indigo-100 rounded-full -mb-20 -ml-20 opacity-40 -z-10" />
                <div className="bg-gradient-to-br from-blue-50  via-white to-indigo-50 pt-20 pb-6 px-6 rounded-2xl shadow-xl text-center border border-gray-100">
                  {/* صورة البائع */}
                  <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 z-20">
                    <img
                      src="/avatars/client1.webp"
                      alt="Seller Avatar"
                      className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
                    />
                  </div>

                  {/* معلومات البائع */}
                  <h2 className="text-2xl font-bold text-gray-900 mb-1  relative z-10">
                    {product.sellerInformation.name}
                  </h2>

                  {/* Rating */}
                  <div className="flex justify-center items-center text-gray-700 my-4 relative z-10">
                    <svg
                      className="w-5 h-5 text-yellow-400 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-sm">
                      {product.sellerInformation.rating}
                    </span>
                  </div>

                  {/* Location */}
                  <div className="flex justify-center items-center text-gray-600 text-sm relative z-10">
                    <svg
                      className="w-4 h-4 text-gray-500 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>
                      {product.sellerInformation.location}
                    </span>
                  </div>
                  <Button className="w-full h-12  mt-8 text-lg font-medium rounded-xl bg-gradient-to-r from-primary to-indigo-600 hover:from-indigo-700 hover:to-blue-700 text-white shadow-md transition duration-300">
                    💬 Chat with Seller
                  </Button>
                </div>
              </div>

              {/* ........ */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
