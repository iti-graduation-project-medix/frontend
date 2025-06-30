import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FaUserMd } from "react-icons/fa";

export default function PersonalInfoCard({pharmacistDetails}) {
  // Add null check and default values
  const details = pharmacistDetails || {};
  
  return (
    <Card className="mb-8 p-6 max-sm:px-0 shadow-lg rounded-2xl border border-gray-200">
      <CardHeader className="pb-2">
        <CardTitle>
          <span className="inline-flex items-center gap-3 font-bold text-lg tracking-wide">
            <span className="inline-flex items-center justify-center rounded-full bg-primary/10 shadow-sm" style={{ width: 36, height: 36 }}>
              <FaUserMd size={20} className="text-primary" />
            </span>
            Doctor Information
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          <div className="flex flex-col gap-1 border-b pb-3 last:border-b-0 last:pb-0">
            <span className="text-muted-foreground text-xs font-medium uppercase">Name</span>
            <div className="font-semibold text-base text-gray-900">{details.fullName || 'Not available'}</div>
          </div>
          <div className="flex flex-col gap-1 border-b pb-3 last:border-b-0 last:pb-0">
            <span className="text-muted-foreground text-xs font-medium uppercase">ID Number</span>
            <div className="font-semibold text-base text-gray-900">{details.idNumber || 'Not available'}</div>
          </div>
          <div className="flex flex-col gap-1 border-b pb-3 last:border-b-0 last:pb-0">
            <span className="text-muted-foreground text-xs font-medium uppercase">Date of Birth</span>
            <div className="font-semibold text-base text-gray-900">{details.birthOfDate || 'Not available'}</div>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-muted-foreground text-xs font-medium uppercase">Gender</span>
            <div className="font-semibold text-base text-gray-900">{details.gender || 'Not available'}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 