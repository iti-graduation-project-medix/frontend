import React from "react";
import { HeroSection } from "../../components/Home-Components/HeroSection/HeroSection";
import { PreviewSection } from "../../components/Home-Components/PreviewSection/PreviewSection";
import { WhoWeAre } from "../../components/Home-Components/WhoWeAre/WhoWeAre";
import { ServicesSection } from "../../components/Home-Components/FeaturesSection/FeaturesSection";
import { StepsSection } from "../../components/Home-Components/StepsSection/StepsSection";

export default function Home() {
  return (
    <div className="bg-muted min-h-screen font-sans">
      <HeroSection />
      <main>
        <PreviewSection />
        <WhoWeAre />
        <ServicesSection />
        <StepsSection />
      </main>
    </div>
  );
}
