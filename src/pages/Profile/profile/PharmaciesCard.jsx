import React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Accordion from "@/components/ui/Accordion";
import { FaClinicMedical } from "react-icons/fa";
import { RiCapsuleLine } from "react-icons/ri";

export default function PharmaciesCard() {
  return (
    <Card className="p-8 shadow-2xl rounded-2xl border border-gray-200 max-w-2xl mx-auto bg-white">
      <CardHeader className="pb-2 border-b mb-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <span className="inline-flex items-center gap-3 font-bold text-xl tracking-wide">
            <span className="inline-flex items-center justify-center rounded-full bg-primary/10 shadow-sm" style={{ width: 36, height: 36 }}>
              <FaClinicMedical size={20} className="text-primary" />
            </span>
            My Pharmacies
          </span>
          <Button className="px-5 py-2 rounded-md text-sm h-9 font-semibold">Add Pharmacy</Button>
        </div>
        <span className="text-xs text-muted-foreground mt-2 block">Note: At max 2 pharmacies can be added to each doctor.</span>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-col gap-8">
          <Accordion
            items={[
              {
                title: <span className="flex items-center gap-2"><RiCapsuleLine className="text-primary" size={18} />El Salam Pharmacy</span>,
                content: (
                  <div className="bg-gray-50 rounded-xl shadow-md p-6 border border-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                      <div className="flex flex-col gap-1 pb-2 border-b last:border-b-0">
                        <span className="text-xs text-muted-foreground font-medium uppercase">Pharmacy Name</span>
                        <span className="font-semibold text-base text-gray-900">El Salam Pharmacy</span>
                      </div>
                      <div className="flex flex-col gap-1 pb-2 border-b last:border-b-0">
                        <span className="text-xs text-muted-foreground font-medium uppercase">License Number</span>
                        <span className="font-semibold text-base text-gray-900">123456</span>
                      </div>
                      <div className="flex flex-col gap-1 pb-2 border-b last:border-b-0">
                        <span className="text-xs text-muted-foreground font-medium uppercase">Contact Number</span>
                        <span className="font-semibold text-base text-gray-900">01000000001</span>
                      </div>
                      <div className="flex flex-col gap-1 pb-2 border-b last:border-b-0">
                        <span className="text-xs text-muted-foreground font-medium uppercase">Address Line 1</span>
                        <span className="font-semibold text-base text-gray-900">123 Main St</span>
                      </div>
                      <div className="flex flex-col gap-1 pb-2 border-b last:border-b-0">
                        <span className="text-xs text-muted-foreground font-medium uppercase">Address Line 2</span>
                        <span className="font-semibold text-base text-gray-900">Apt 4B</span>
                      </div>
                      <div className="flex flex-col gap-1 pb-2 border-b last:border-b-0">
                        <span className="text-xs text-muted-foreground font-medium uppercase">City</span>
                        <span className="font-semibold text-base text-gray-900">Cairo</span>
                      </div>
                      <div className="flex flex-col gap-1 pb-2 border-b last:border-b-0">
                        <span className="text-xs text-muted-foreground font-medium uppercase">State</span>
                        <span className="font-semibold text-base text-gray-900">Cairo</span>
                      </div>
                      <div className="flex flex-col gap-1 pb-2 border-b last:border-b-0">
                        <span className="text-xs text-muted-foreground font-medium uppercase">Zip Code</span>
                        <span className="font-semibold text-base text-gray-900">11311</span>
                      </div>
                    </div>
                    <div className="pt-4 flex items-center gap-2">
                      <span className="font-semibold">Operating Hours:</span>
                      <span className="text-base text-gray-900">8:00 am - 10:00 pm</span>
                    </div>
                    <div className="pt-6 flex justify-end">
                      <Button className="px-5 py-2 rounded-md text-sm h-9 font-semibold">Edit Pharmacy</Button>
                    </div>
                  </div>
                ),
              },
              {
                title: <span className="flex items-center gap-2"><RiCapsuleLine className="text-primary" size={18} />Misr Pharmacy</span>,
                content: (
                  <div className="bg-gray-50 rounded-xl shadow-md p-6 border border-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                      <div className="flex flex-col gap-1 pb-2 border-b last:border-b-0">
                        <span className="text-xs text-muted-foreground font-medium uppercase">Pharmacy Name</span>
                        <span className="font-semibold text-base text-gray-900">Misr Pharmacy</span>
                      </div>
                      <div className="flex flex-col gap-1 pb-2 border-b last:border-b-0">
                        <span className="text-xs text-muted-foreground font-medium uppercase">License Number</span>
                        <span className="font-semibold text-base text-gray-900">789123</span>
                      </div>
                      <div className="flex flex-col gap-1 pb-2 border-b last:border-b-0">
                        <span className="text-xs text-muted-foreground font-medium uppercase">Contact Number</span>
                        <span className="font-semibold text-base text-gray-900">01000000003</span>
                      </div>
                      <div className="flex flex-col gap-1 pb-2 border-b last:border-b-0">
                        <span className="text-xs text-muted-foreground font-medium uppercase">Address Line 1</span>
                        <span className="font-semibold text-base text-gray-900">88 Corniche</span>
                      </div>
                      <div className="flex flex-col gap-1 pb-2 border-b last:border-b-0">
                        <span className="text-xs text-muted-foreground font-medium uppercase">Address Line 2</span>
                        <span className="font-semibold text-base text-gray-900">Shop 7</span>
                      </div>
                      <div className="flex flex-col gap-1 pb-2 border-b last:border-b-0">
                        <span className="text-xs text-muted-foreground font-medium uppercase">City</span>
                        <span className="font-semibold text-base text-gray-900">Alexandria</span>
                      </div>
                      <div className="flex flex-col gap-1 pb-2 border-b last:border-b-0">
                        <span className="text-xs text-muted-foreground font-medium uppercase">State</span>
                        <span className="font-semibold text-base text-gray-900">Alexandria</span>
                      </div>
                      <div className="flex flex-col gap-1 pb-2 border-b last:border-b-0">
                        <span className="text-xs text-muted-foreground font-medium uppercase">Zip Code</span>
                        <span className="font-semibold text-base text-gray-900">21511</span>
                      </div>
                    </div>
                    <div className="pt-4 flex items-center gap-2">
                      <span className="font-semibold">Operating Hours:</span>
                      <span className="text-base text-gray-900">7:00 am - 9:00 pm</span>
                    </div>
                    <div className="pt-6 flex justify-end">
                      <Button className="px-5 py-2 rounded-md text-sm h-9 font-semibold">Edit Pharmacy</Button>
                    </div>
                  </div>
                ),
              },
            ]}
          />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-center gap-2 pt-6">
        <span className="text-muted-foreground text-sm flex items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m-9 4v8" /></svg>For any assistance with your pharmacies, please contact support.</span>
      </CardFooter>
    </Card>
  );
} 