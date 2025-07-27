import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";
import React from "react";

export default function Pricing() {
  return (
    <div className="relative py-12 md:py-12">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-bold md:text-4xl lg:text-5xl">
            Start managing your pharmacy smarter today.
          </h2>
        </div>
        <div className="mt-8 md:mt-20">
          <div className="bg-card relative rounded-3xl border shadow-2xl shadow-zinc-950/5">
            <div className="grid items-center gap-12 divide-y p-12 md:grid-cols-2 md:divide-x md:divide-y-0">
              <div className="pb-12 text-center md:pb-0 md:pr-12">
                <h3 className="text-2xl font-semibold">Smart Pharmacy Suite</h3>
                <p className="mt-2 text-lg">For your pharmacy of any size</p>
                <span className="mb-6 mt-12 inline-block text-6xl font-bold">
                  <span className="text-4xl">EGP</span>200
                </span>

                <div className="flex justify-center">
                  <Button asChild size="lg">
                    <Link href="#">Get started</Link>
                  </Button>
                </div>

                <p className="text-muted-foreground mt-12 text-sm">
                  Includes: Secure access, unlimited medicine listings, advanced search, in-platform
                  messaging, and full access to all premium features.
                </p>
              </div>
              <div className="relative">
                <ul role="list" className="space-y-4">
                  {[
                    "Priority Listings",
                    "Weekly Market Insights",
                    "Support Platform Growth",
                    "Full Access to All Features",
                  ].map((item, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Check className="size-3" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-muted-foreground mt-6 text-sm">
                  Team can be any size, and you can add or switch members as needed. Companies using
                  our platform include:
                </p>
                <div className="mt-12 flex flex-wrap items-center justify-between gap-6">
                  <img
                    className="h-5 w-fit dark:invert"
                    src="https://elezabypharmacy.com/themes/Elezaby/images/logo_ar3.png"
                    alt="ELEZABY Logo"
                    height="20"
                    width="auto"
                  />
                  <img
                    className="h-4 w-fit dark:invert"
                    src="https://misr-online.com/media/logo/stores/1/Logo_Image.png"
                    alt="MISR ONLINE Logo"
                    height="20"
                    width="auto"
                  />
                  <img
                    className="h-4 w-fit dark:invert"
                    src="https://mtalaatpharmacy.com/wp-content/uploads/2021/12/NewLogo_MTalaatPharmacy.png"
                    alt="MOHAMED TALAAT PHARMACY Logo"
                    height="20"
                    width="auto"
                  />
                  <img
                    className="h-5 w-fit dark:invert"
                    src="https://care-pharmacies.com/wp-content/uploads/2020/08/Logo-Care.png"
                    alt="Nike Logo"
                    height="20"
                    width="auto"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
