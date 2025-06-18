import React from "react";
import { steps } from "./steps";

export function StepsSection() {
  return (
    <section className="text-gray-600 body-font">
      <div className="container px-5 py-24 mx-auto flex flex-wrap">
        <div className="flex flex-wrap w-full">
          <div className="lg:w-2/5 md:w-1/2 md:pr-10 md:py-6">
            {steps.map((step, index) =>
              <div
                className={`flex relative ${index !== steps.length - 1
                  ? "pb-12"
                  : ""}`}
                key={index}
              >
                <div className="h-full w-10 absolute inset-0 flex items-center justify-center">
                  {index !== steps.length - 1 &&
                    <div className="h-full w-1 bg-gray-200 pointer-events-none" />}
                </div>
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-500 inline-flex items-center justify-center text-white relative z-10">
                  <svg
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                  >
                    {step.icon}
                  </svg>
                </div>
                <div className="flex-grow pl-4">
                  <h2 className="font-medium title-font text-sm text-gray-900 mb-1 tracking-wider">
                    {step.title}
                  </h2>
                  <p className="leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            )}
          </div>
          <img
            className="lg:w-3/5 md:w-1/2 object-cover object-center rounded-lg md:mt-0 mt-12"
            src="/imgs/drug-store.jpg"
            alt="step"
          />
        </div>
      </div>
    </section>
  );
}
