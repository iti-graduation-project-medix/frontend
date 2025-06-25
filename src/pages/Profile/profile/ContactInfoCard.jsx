import React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FaEnvelope } from "react-icons/fa";

export default function ContactInfoCard({pharmacistDetails}) {
  // Add null check and default values
  const details = pharmacistDetails || {};
  
  return (
    <Card className="mb-8 p-6 shadow-lg rounded-2xl border border-gray-200">
      <CardHeader className="pb-2">
        <CardTitle>
          <span className="inline-flex items-center gap-3 font-bold text-lg tracking-wide">
            <span className="inline-flex items-center justify-center rounded-full bg-primary/10 shadow-sm" style={{ width: 36, height: 36 }}>
              <FaEnvelope size={18} className="text-primary" />
            </span>
            Contact Information
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <form className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          <div className="flex flex-col gap-1">
            <Label htmlFor="email" className="text-xs font-medium uppercase">Email</Label>
            <Input id="email" type="email" defaultValue={details.email || ""} className="mt-1" />
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="phone" className="text-xs font-medium uppercase">Phone Number</Label>
            <Input id="phone" type="tel" defaultValue={details.phone || "01012345678"} className="mt-1" />
          </div>
        </form>
      </CardContent>
      <CardFooter className="justify-end pt-4">
        <Button className="px-6 py-2 rounded-md text-base">Save Changes</Button>
      </CardFooter>
    </Card>
  );
} 