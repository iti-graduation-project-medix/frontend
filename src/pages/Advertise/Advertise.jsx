import React, { useEffect } from "react";
import { initFlowbite } from "flowbite";

export default function Advertise() {
  useEffect(() => {
    initFlowbite();
  }, []);

  return (
    <div className="bg-muted min-h-screen font-sans">
      {/* Hero Section */}
      <section className="py-16 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-center mb-4">
            <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
              {/* Medical Icon SVG */}
              <svg
                className="w-10 h-10 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 2v20m10-10H2"
                />
              </svg>
            </span>
          </div>
          <h1 className="text-5xl font-extrabold mb-4 text-primary">
            Advertise with Medix
          </h1>
          <p className="text-lg text-muted-foreground mb-6">
            Reach health-conscious customers and grow your pharmaceutical or
            healthcare brand with Medix, your trusted online medical pharmacy.
          </p>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="max-w-5xl mx-auto mb-16 px-4">
        <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 relative  overflow-hidden rounded-2xl shadow-lg p-8 flex flex-col justify-center border border-gray-100 max-w-xl mx-auto">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full -mr-16 -mt-16 opacity-50"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-indigo-100 rounded-full -ml-20 -mb-20 opacity-50"></div>
          <h2 className="text-2xl font-bold mb-2 text-center">Get In Touch</h2>
          <p className="text-sm text-muted-foreground mb-6 text-center">
            Fill out the form below to learn more about our advertising
            opportunities.
          </p>
          <form className="space-y-5">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full">
                <label
                  htmlFor="name"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5"
                  placeholder="Full Name"
                  required
                />
              </div>
              <div className="w-full">
                <label
                  htmlFor="phoneNumber"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Contact Number
                </label>
                <input
                  type="text"
                  id="phoneNumber"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5"
                  placeholder="Your best contact number"
                  required
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5"
                placeholder="Your professional email address"
                required
              />
            </div>
            <div>
              <label
                htmlFor="message"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Message or Product/Service Details
              </label>
              <textarea
                id="message"
                rows="8"
                className="bg-gray-50 border resize-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5"
                placeholder="Tell us about your advertising needs..."
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className="bg-primary hover:bg-primary-hover text-white font-bold py-3 px-6 rounded-lg w-full transition-all shadow-md mb-11"
            >
              Submit Inquiry
            </button>
          </form>
        </div>
      </section>

      {/* Why Advertise with Medix */}
      <section className="bg-muted py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">
            Why Advertise with Medix?
          </h2>
          <p className="text-center text-muted-foreground mb-10 max-w-2xl mx-auto">
            Unlock unique benefits for your pharmacy or healthcare brand.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8 flex flex-col items-center text-center transition-transform hover:-translate-y-2 hover:shadow-lg">
              <div className="mb-4 flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                <svg
                  width="40"
                  height="40"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="text-primary"
                >
                  <circle cx="12" cy="12" r="10" strokeWidth="2" />
                  <circle cx="12" cy="12" r="6" strokeWidth="2" />
                  <circle cx="12" cy="12" r="2" strokeWidth="2" />
                </svg>
              </div>
              <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900">
                Reach Health-Focused Audiences
              </h5>
              <p className="text-gray-700">
                Connect with patients, caregivers, and health-conscious
                individuals actively seeking pharmacy products and medical
                solutions online.
              </p>
            </div>
            {/* Card 2 */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8 flex flex-col items-center text-center transition-transform hover:-translate-y-2 hover:shadow-lg">
              <div className="mb-4 flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                <svg
                  width="40"
                  height="40"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="text-primary"
                >
                  <path strokeWidth="2" d="M3 17l6-6 4 4 8-8" />
                  <path strokeWidth="2" d="M14 7h7v7" />
                </svg>
              </div>
              <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900">
                Boost Brand Trust & Visibility
              </h5>
              <p className="text-gray-700">
                Showcase your pharmacy or healthcare brand on Medix, building
                trust with a community that values safety, reliability, and
                professional care.
              </p>
            </div>
            {/* Card 3 */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8 flex flex-col items-center text-center transition-transform hover:-translate-y-2 hover:shadow-lg">
              <div className="mb-4 flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                <svg
                  width="40"
                  height="40"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="text-primary"
                >
                  <rect x="3" y="12" width="4" height="8" strokeWidth="2" />
                  <rect x="10" y="8" width="4" height="12" strokeWidth="2" />
                  <rect x="17" y="4" width="4" height="16" strokeWidth="2" />
                </svg>
              </div>
              <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900">
                Comprehensive Analytics & Compliance
              </h5>
              <p className="text-gray-700">
                Access real-time analytics and ensure your campaigns meet
                healthcare advertising standards and regulations for peace of
                mind.
              </p>
            </div>
            {/* Card 4 */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8 flex flex-col items-center text-center transition-transform hover:-translate-y-2 hover:shadow-lg">
              <div className="mb-4 flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                <svg
                  width="40"
                  height="40"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="text-primary"
                >
                  <circle cx="12" cy="8" r="4" strokeWidth="2" />
                  <path
                    strokeWidth="2"
                    d="M2 20c0-3.3137 3.134-6 7-6h6c3.866 0 7 2.6863 7 6"
                  />
                </svg>
              </div>
              <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900">
                Engage the Medix Community
              </h5>
              <p className="text-gray-700">
                Interact with a vibrant community of users who rely on Medix for
                their pharmacy needs, health advice, and wellness products.
              </p>
            </div>
            {/* Card 5 */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8 flex flex-col items-center text-center transition-transform hover:-translate-y-2 hover:shadow-lg">
              <div className="mb-4 flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                <svg
                  width="40"
                  height="40"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="text-primary"
                >
                  <circle cx="12" cy="12" r="10" strokeWidth="2" />
                  <circle cx="7" cy="10" r="1" strokeWidth="2" />
                  <circle cx="17" cy="10" r="1" strokeWidth="2" />
                  <circle cx="9" cy="16" r="1" strokeWidth="2" />
                  <circle cx="15" cy="16" r="1" strokeWidth="2" />
                </svg>
              </div>
              <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900">
                Custom Campaign Solutions
              </h5>
              <p className="text-gray-700">
                Design campaigns tailored to your pharmaceutical products,
                health services, or wellness solutions, with flexible options to
                fit your goals.
              </p>
            </div>
            {/* Card 6 */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8 flex flex-col items-center text-center transition-transform hover:-translate-y-2 hover:shadow-lg">
              <div className="mb-4 flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                <svg
                  width="40"
                  height="40"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="text-primary"
                >
                  <path strokeWidth="2" d="M8 12l4 4 4-4" />
                  <path strokeWidth="2" d="M12 16V4" />
                  <path strokeWidth="2" d="M2 20h20" />
                </svg>
              </div>
              <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900">
                Expert Support & Partnership
              </h5>
              <p className="text-gray-700">
                Receive guidance from Medix's pharmacy and marketing experts at
                every step, from campaign setup to optimization and compliance.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* FAQ Accordion Section (Flowbite style) */}
      <div className="max-w-2xl mx-auto mt-12 bg-white rounded-2xl shadow-lg p-8">
        <h3 className="text-3xl font-bold mb-6 text-center">
          Frequently Asked Questions
        </h3>
        <div id="accordion-open" data-accordion="open">
          {/* Q1 */}
          <h2 id="accordion-open-heading-1">
            <button
              type="button"
              className="flex items-center justify-between w-full p-5 font-medium text-gray-500 border border-b-0 border-gray-200 rounded-t-xl focus:ring-4 focus:ring-gray-200 gap-3"
              data-accordion-target="#accordion-open-body-1"
              aria-expanded="false"
              aria-controls="accordion-open-body-1"
            >
              What types of advertising opportunities are available?
              <svg
                data-accordion-icon
                className="w-3 h-3 rotate-180 shrink-0"
                aria-hidden="true"
                fill="none"
                viewBox="0 0 10 6"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5 5 1 1 5"
                />
              </svg>
            </button>
          </h2>
          <div
            id="accordion-open-body-1"
            className="hidden"
            aria-labelledby="accordion-open-heading-1"
          >
            <div className="p-5 border border-b-0 border-gray-200">
              Medix offers banner ads, sponsored content, product highlights,
              and custom campaigns tailored to pharmacy and healthcare brands.
            </div>
          </div>
          {/* Q2 */}
          <h2 id="accordion-open-heading-2">
            <button
              type="button"
              className="flex items-center justify-between w-full p-5 font-medium text-gray-500 border border-b-0 border-gray-200 focus:ring-4 focus:ring-gray-200 gap-3"
              data-accordion-target="#accordion-open-body-2"
              aria-expanded="false"
              aria-controls="accordion-open-body-2"
            >
              How is ad performance tracked and reported?
              <svg
                data-accordion-icon
                className="w-3 h-3 rotate-180 shrink-0"
                aria-hidden="true"
                fill="none"
                viewBox="0 0 10 6"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5 5 1 1 5"
                />
              </svg>
            </button>
          </h2>
          <div
            id="accordion-open-body-2"
            className="hidden"
            aria-labelledby="accordion-open-heading-2"
          >
            <div className="p-5 border border-b-0 border-gray-200">
              We provide detailed analytics dashboards with impressions, clicks,
              conversions, and compliance tracking for all campaigns.
            </div>
          </div>
          {/* Q3 */}
          <h2 id="accordion-open-heading-3">
            <button
              type="button"
              className="flex items-center justify-between w-full p-5 font-medium text-gray-500 border border-gray-200 focus:ring-4 focus:ring-gray-200 gap-3"
              data-accordion-target="#accordion-open-body-3"
              aria-expanded="false"
              aria-controls="accordion-open-body-3"
            >
              What is the typical duration for an advertising campaign?
              <svg
                data-accordion-icon
                className="w-3 h-3 rotate-180 shrink-0"
                aria-hidden="true"
                fill="none"
                viewBox="0 0 10 6"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5 5 1 1 5"
                />
              </svg>
            </button>
          </h2>
          <div
            id="accordion-open-body-3"
            className="hidden"
            aria-labelledby="accordion-open-heading-3"
          >
            <div className="p-5 border border-t-0 border-gray-200">
              Campaigns can run from one week to several months, depending on
              your goals and budget.
            </div>
          </div>
          {/* Q4 */}
          <h2 id="accordion-open-heading-4">
            <button
              type="button"
              className="flex items-center justify-between w-full p-5 font-medium text-gray-500 border border-gray-200 focus:ring-4 focus:ring-gray-200 gap-3"
              data-accordion-target="#accordion-open-body-4"
              aria-expanded="false"
              aria-controls="accordion-open-body-4"
            >
              Can I target specific demographics or user segments?
              <svg
                data-accordion-icon
                className="w-3 h-3 rotate-180 shrink-0"
                aria-hidden="true"
                fill="none"
                viewBox="0 0 10 6"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5 5 1 1 5"
                />
              </svg>
            </button>
          </h2>
          <div
            id="accordion-open-body-4"
            className="hidden"
            aria-labelledby="accordion-open-heading-4"
          >
            <div className="p-5 border border-t-0 border-gray-200">
              Yes, Medix allows targeting by age, location, health interests,
              and more to ensure your ads reach the right audience.
            </div>
          </div>
          {/* Q5 */}
          <h2 id="accordion-open-heading-5">
            <button
              type="button"
              className="flex items-center justify-between w-full p-5 font-medium text-gray-500 border border-gray-200 focus:ring-4 focus:ring-gray-200 gap-3"
              data-accordion-target="#accordion-open-body-5"
              aria-expanded="false"
              aria-controls="accordion-open-body-5"
            >
              What are the payment terms for advertising services?
              <svg
                data-accordion-icon
                className="w-3 h-3 rotate-180 shrink-0"
                aria-hidden="true"
                fill="none"
                viewBox="0 0 10 6"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5 5 1 1 5"
                />
              </svg>
            </button>
          </h2>
          <div
            id="accordion-open-body-5"
            className="hidden"
            aria-labelledby="accordion-open-heading-5"
          >
            <div className="p-5 border border-t-0 border-gray-200">
              We offer flexible payment options including monthly billing and
              upfront packages. Contact us for details.
            </div>
          </div>
          {/* Q6 */}
          <h2 id="accordion-open-heading-6">
            <button
              type="button"
              className="flex items-center justify-between w-full p-5 font-medium text-gray-500 border border-gray-200 focus:ring-4 focus:ring-gray-200 gap-3"
              data-accordion-target="#accordion-open-body-6"
              aria-expanded="false"
              aria-controls="accordion-open-body-6"
            >
              Is there support available for ad creative development?
              <svg
                data-accordion-icon
                className="w-3 h-3 rotate-180 shrink-0"
                aria-hidden="true"
                fill="none"
                viewBox="0 0 10 6"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5 5 1 1 5"
                />
              </svg>
            </button>
          </h2>
          <div
            id="accordion-open-body-6"
            className="hidden"
            aria-labelledby="accordion-open-heading-6"
          >
            <div className="p-5 border border-t-0 border-gray-200">
              Our team can assist with ad design, copywriting, and compliance
              review to ensure your campaign is effective and approved.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
