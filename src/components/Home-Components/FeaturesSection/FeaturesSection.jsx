import React from "react";

import { FeatureCard } from "@/components/Home-Components/FeatureCard/FeatureCard";
import { features } from "./Features";

export function ServicesSection() {
  return (
    <section className="py-20 px-4 text-[var(--foreground)]">
      <div className="container mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold text-[var(--foreground)] mb-16 leading-tight">
          Powerful Platform Features
        </h2>
        <div className="grid px-14 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {features.map((feature, index) =>
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          )}
        </div>
      </div>
    </section>
  );
}
