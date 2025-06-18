import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "../../ui/badge";

export function WhoWeAre() {
  return (
    <section className="py-16 lg:py-20 bg-[color:var(--card)] px-14 text-[color:var(--card-foreground)] transition-colors duration-300">
      <div className="container mx-auto flex flex-col lg:flex-row items-stretch gap-10">
        <div className="w-full lg:w-1/2 flex flex-col justify-center text-center lg:text-left order-2 lg:order-1">
          <Badge
            variant="outline"
            className="self-center mb-4 lg:self-start bg-[#eff0fc] text-[color:var(--secondary-foreground)] px-3 py-1 text-sm font-medium"
          >
            Who We Are
          </Badge>

          <h3 className="text-3xl lg:text-4xl font-bold text-[color:var(--primary)] mb-8 leading-tight">
            Bridging Sustainability with Pharmacy
          </h3>

          <div className="block lg:hidden mb-8">
            <img
              src="/imgs/who-we-are.png"
              alt="About MediExchange"
              className="object-contain w-full h-auto max-h-[350px] rounded-xl shadow-lg mx-auto"
            />
          </div>

          <p className="text-lg leading-relaxed text-[color:var(--muted-foreground)]">
            Founded on the principles of sustainability and resource
            optimization within the pharmaceutical supply chain, MediExchange
            provides a trusted marketplace designed to extend the lifecycle of
            valuable medications and reduce the environmental and economic
            burden of disposal.
          </p>

          <p className="text-lg leading-relaxed text-[color:var(--muted-foreground)] mt-4">
            Our mission is to create a more resilient and efficient system for
            all stakeholders.
          </p>
        </div>

        {/* العمود الأيمن (الصورة) */}
        <div className="w-full lg:w-1/2 hidden lg:block order-1 lg:order-2">
          <Card className="flex items-center justify-center shadow-lg border-none rounded-xl overflow-hidden h-full">
            <CardContent className="w-full h-full p-0">
              <img
                src="/imgs/who-we-are.png"
                alt="About MediExchange"
                className="object-cover w-full h-full"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
