import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";

export function FeatureCard({ icon: Icon, title, description }) {
  return (
    <Card className="
      bg-[var(--card)] p-4 pb-6 rounded-lg shadow-md flex flex-col items-center text-center 
      hover:shadow-lg transition-all duration-300 ease-in-out 
      border-l-4 border-[var(--secondary)] hover:border-[var(--primary)] cursor-pointer
      h-full w-full justify-between
    ">
      <CardHeader className="flex flex-col items-center p-0 pb-4">
        <div className="text-[var(--primary)] mb-4">
          <Icon className="w-10 h-10 mx-auto stroke-1.5" />
        </div>
        <CardTitle className="text-xl font-semibold text-[var(--card-foreground)] w-100 mb-2 leading-snug">
          {title}
        </CardTitle>
      </CardHeader>
      <CardDescription className="text-[var(--card-foreground)] leading-relaxed text-sm">
        {description}
      </CardDescription>
    </Card>
  );
}
