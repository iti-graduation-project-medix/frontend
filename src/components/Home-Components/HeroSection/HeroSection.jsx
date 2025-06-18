import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export function HeroSection() {
  const MotionLink = motion(Link);
  const buttonVariants = { tap: { scale: 0.95 }, hover: { scale: 1.05 } };
  return (
    <section
      className="relative h-screen min-h-[500px] flex items-center justify-center text-white text-center px-4 overflow-hidden"
      style={{
        backgroundImage: `url(/imgs/drug-store.jpg)`,
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    >
      <div className="absolute inset-0 bg-black opacity-60 z-10" />

      <div className="relative z-20 max-w-5xl mx-auto p-4 md:p-8">
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6 tracking-tight drop-shadow-lg">
          Optimize Your Pharmacy Inventory
        </h1>
        <p className="text-lg md:text-xl lg:text-2xl mb-10 max-w-3xl mx-auto opacity-90 font-light drop-shadow-md">
          Connect with companies to exchange or bid on near-expiry medications
          efficiently and compliantly.
        </p>

        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <MotionLink
            whileTap="tap"
            whileHover="hover"
            variants={buttonVariants}
            className="text-white bg-primary  hover:bg-[var(--primary-hover)] focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-primary focus:outline-none dark:focus:ring-blue-800"
          >
            Join as Pharmacy
          </MotionLink>
          <MotionLink
            whileTap="tap"
            whileHover="hover"
            variants={buttonVariants}
            className="text-gray-900 bg-[#d0d2f8] focus:outline-none hover:bg-gray-100 hover:text-primary  focus:ring-4 focus:ring-gray-200 font-medium rounded-md text-sm px-4 py-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-none dark:focus:ring-gray-700"
          >
            Join as Company
          </MotionLink>
        </div>
      </div>
    </section>
  );
}
