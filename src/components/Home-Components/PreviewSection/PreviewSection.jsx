import React from "react";

export function PreviewSection() {
  return (
    <section className="py-16 md:py-20 bg-[color:var(--card)] px-14 text-center text-[color:var(--card-foreground)] transition-colors duration-300">
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-6 px-5 leading-tight text-primary">
          Bridging the Gap for Pharmaceutical Inventory
        </h2>
        <p className="text-lg md:text-xl text-[color:var(--muted-foreground)] max-w-3xl mx-auto  leading-relaxed">
          MediExchange is a secure online platform connecting pharmacies and
          companies for the ethical and efficient handling of near-expiry and
          surplus medications through a transparent exchange and bidding system.
          Reduce waste, recover value, and access needed stock.
        </p>
      </div>
    </section>
  );
}
