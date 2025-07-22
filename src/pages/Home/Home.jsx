import React from "react";
import { Link } from "react-router-dom";
import Accordion from "@/components/ui/Accordion";
import {
  HelpCircle,
  UserCheck,
  Gift,
  ShieldCheck,
  CreditCard,
} from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen dark:from-background dark:via-background dark:to-background flex flex-col items-center justify-start font-sans text-foreground dark:text-foreground">
      {/* Hero Section */}
      <section className="w-full flex flex-col items-center justify-center pt-24 pb-8 px-4 text-center">
        <span className="uppercase tracking-widest text-xs font-semibold text-primary dark:text-primary mb-2">
          For Pharmacists Only
        </span>
        <div className="flex items-center justify-center gap-3 mb-4">

          <span className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-primary dark:text-primary tracking-tight">
            Dawaback
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-foreground mb-4 max-w-2xl mx-auto">

          <span className="text-primary dark:text-primary">#1</span> Platform

          for Pharmacists to Exchange Medicines & Sell Pharmacies
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-8 max-w-xl mx-auto font-light">
          Dawaback connects pharmacists to exchange surplus or near-expiry
          medicines, chat directly about each deal, and even list pharmacies for
          sale. Secure, trusted, and built for the pharmacy community.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 w-full max-w-md mx-auto mb-6">
          <Link
            to="/auth/signup"

            className="inline-flex items-center justify-center bg-primary dark:bg-primary hover:bg-primary-hover dark:hover:bg-primary-hover text-white font-semibold rounded-lg px-8 py-3 text-lg shadow-md transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-primary/40"

          >
            <svg
              className="w-6 h-6 mr-2"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                d="M21 7L9 19l-5.5-5.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Get Started
          </Link>
          <Link
            to="/explore"

            className="inline-flex items-center justify-center bg-white dark:bg-background border border-primary dark:border-primary text-primary dark:text-primary font-semibold rounded-lg px-8 py-3 text-lg shadow-sm hover:bg-primary/10 dark:hover:bg-primary/10 transition-all duration-200"

          >
            <svg
              className="w-6 h-6 mr-2"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4l3 3" />
            </svg>
            Explore Platform
          </Link>
        </div>
        {/* Features Bar */}
        <div className="flex flex-wrap justify-center gap-4 mt-4">

          <span className="flex items-center gap-2 bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary px-4 py-2 rounded-full text-sm font-medium">

            💬 Chat for Every Deal
          </span>
          <span className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-medium">
            🔄 Medicine Exchange
          </span>
          <span className="flex items-center gap-2 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 px-4 py-2 rounded-full text-sm font-medium">
            🏪 Sell Your Pharmacy
          </span>
          <span className="flex items-center gap-2 bg-gray-100 dark:bg-gray-900/20 text-gray-800 dark:text-gray-300 px-4 py-2 rounded-full text-sm font-medium">
            🔒 Verified Pharmacists
          </span>
        </div>
      </section>
      {/* How It Works Section */}
      <section className="w-full max-w-6xl mx-auto py-16 px-4 md:px-0">

        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary dark:text-primary text-center mb-12">

          How Dawaback Works
        </h2>
        <div className="flex flex-col gap-1 w-full">
          {/* Row 1: Step 1 + Step 2 */}
          <div className="flex flex-col md:flex-row md:gap-6 w-full items-center">
            {/* Step 1 + Brief */}
            <div className="w-full md:w-1/2">

              <div className="flex flex-col md:flex-row bg-white dark:bg-card rounded-2xl shadow-md border border-primary dark:border-primary p-4 md:p-6 items-stretch gap-0 min-h-[320px] mb-1">

                {/* Step */}
                <div className="flex flex-col items-center justify-center flex-1 px-2 py-4">
                  <span className="mb-2">
                    <svg
                      className="w-8 h-8 text-primary"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M12 4v16m8-8H4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <span className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-bold text-lg border-2 border-primary shadow mb-2">
                    1
                  </span>

                  <h3 className="font-bold text-lg text-primary dark:text-primary mb-1">
                    Sign Up & Verify
                  </h3>
                  <div className="w-8 border-b border-primary dark:border-primary mx-auto mb-2"></div>

                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed text-center">
                    Create your account and verify your pharmacy license with
                    your ID and Syndicate Card (front & back).
                  </p>
                </div>
                {/* Divider */}
                <div className="hidden md:flex flex-col items-center justify-center px-2">
                  <span className="w-2 h-2 rounded-full bg-primary dark:bg-primary mb-1"></span>
                  <div className="w-0.5 h-12 bg-primary/10 rounded-full"></div>
                </div>
                {/* Brief */}
                <div className="flex flex-col justify-center flex-1 px-2 py-4">
                  <div className="flex items-center gap-2 mb-2">
                    <svg
                      className="w-5 h-5 text-primary"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 8v4l3 3" />
                    </svg>

                    <h4 className="text-base font-semibold text-primary dark:text-primary">

                      Why Verification?
                    </h4>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                    Ensures only licensed pharmacists join Dawaback, building a
                    trusted and professional community for safe medicine
                    exchange.
                  </p>
                </div>
              </div>
            </div>
            {/* Arrow hand-drawn horizontal between step 1 and 2 */}
            <div className="hidden md:flex items-center justify-center h-full mx-2">
              <svg
                width="80"
                height="40"
                viewBox="0 0 80 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10 20 C30 10, 50 30, 70 20"
                  stroke="#636ae8"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="4 3"
                  fill="none"
                />
                <path
                  d="M65 15 L70 20 L65 25"
                  stroke="#636ae8"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </svg>
            </div>
            {/* Step 2 + Brief */}
            <div className="w-full md:w-1/2 mt-4 md:mt-0">
              <div className="flex flex-col md:flex-row bg-white dark:bg-card rounded-2xl shadow-md border border-yellow-100 dark:border-yellow-900 p-4 md:p-6 items-stretch gap-0 min-h-[320px] mb-1">
                {/* Step */}
                <div className="flex flex-col items-center justify-center flex-1 px-2 py-4">
                  <span className="mb-2">
                    <svg
                      className="w-8 h-8 text-yellow-600"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M12 17.75l6.16 3.73-1.64-7.03L21.5 9.24l-7.19-.61L12 2 9.69 8.63 2.5 9.24l5.98 5.21-1.64 7.03L12 17.75z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <span className="flex items-center justify-center w-10 h-10 rounded-full bg-yellow-100 text-yellow-700 font-bold text-lg border-2 border-yellow-200 shadow mb-2">
                    2
                  </span>
                  <h3 className="font-bold text-lg text-yellow-700 dark:text-yellow-400 mb-1">
                    Subscription
                  </h3>
                  <div className="w-8 border-b border-yellow-100 mx-auto mb-2"></div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed text-center">
                    Choose a subscription plan to unlock full access to deals,
                    chat, and pharmacy listing features.
                  </p>
                </div>
                {/* Divider */}
                <div className="hidden md:flex flex-col items-center justify-center px-2">
                  <span className="w-2 h-2 rounded-full bg-yellow-400 mb-1"></span>
                  <div className="w-0.5 h-12 bg-yellow-100 rounded-full"></div>
                </div>
                {/* Brief */}
                <div className="flex flex-col justify-center flex-1 px-2 py-4">
                  <div className="flex items-center gap-2 mb-2">
                    <svg
                      className="w-5 h-5 text-yellow-700"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M12 17.75l6.16 3.73-1.64-7.03L21.5 9.24l-7.19-.61L12 2 9.69 8.63 2.5 9.24l5.98 5.21-1.64 7.03L12 17.75z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <h4 className="text-base font-semibold text-yellow-700 dark:text-yellow-400">
                      Why Subscription?
                    </h4>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                    Subscription unlocks full access to all Dawaback features,
                    supporting platform quality and continuous improvement for
                    pharmacists.
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* Arrow hand-drawn from bottom of Subscription to top of Browse or Post Deals */}
          <div
            className="hidden md:flex items-center justify-center my-1"
            style={{ minHeight: "60px" }}
          >
            <svg
              width="400"
              height="180"
              viewBox="0 0 400 180"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M 340 0 C 340 80, 60 60, 60 160"
                stroke="#636ae8"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="6 5"
                fill="none"
              />
              <path
                d="M50 150 L60 160 L70 150"
                stroke="#636ae8"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
          </div>
          {/* Row 2: Step 3 + Step 4 */}
          <div className="flex flex-col md:flex-row md:gap-6 w-full items-center">
            {/* Step 3 + Brief */}
            <div className="w-full md:w-1/2">
              <div className="flex flex-col md:flex-row bg-white dark:bg-card rounded-2xl shadow-md border border-purple-100 dark:border-purple-900 p-4 md:p-6 items-stretch gap-0 min-h-[320px] mb-1">
                {/* Step */}
                <div className="flex flex-col items-center justify-center flex-1 px-2 py-4">
                  <span className="mb-2">
                    <svg
                      className="w-8 h-8 text-purple-600"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M3 12h18M12 3v18"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <span className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-100 text-purple-700 font-bold text-lg border-2 border-purple-200 shadow mb-2">
                    3
                  </span>
                  <h3 className="font-bold text-lg text-purple-700 dark:text-purple-400 mb-1">
                    Browse or Post Deals
                  </h3>
                  <div className="w-8 border-b border-purple-100 mx-auto mb-2"></div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed text-center">
                    Find available medicine deals or post your own offers for
                    other pharmacists to see.
                  </p>
                </div>
                {/* Divider */}
                <div className="hidden md:flex flex-col items-center justify-center px-2">
                  <span className="w-2 h-2 rounded-full bg-purple-400 mb-1"></span>
                  <div className="w-0.5 h-12 bg-purple-100 rounded-full"></div>
                </div>
                {/* Brief */}
                <div className="flex flex-col justify-center flex-1 px-2 py-4">
                  <div className="flex items-center gap-2 mb-2">
                    <svg
                      className="w-5 h-5 text-purple-700"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <rect x="3" y="3" width="18" height="14" rx="2" />
                      <path d="M8 17l4 4 4-4m-4-5v9" />
                    </svg>
                    <h4 className="text-base font-semibold text-purple-700 dark:text-purple-400">
                      Why Post or Browse Deals?
                    </h4>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                    Easily find or offer medicines, reduce waste, and help
                    fellow pharmacists get the stock they need, all in one
                    place.
                  </p>
                </div>
              </div>
            </div>
            {/* Arrow hand-drawn horizontal between step 3 and 4 */}
            <div className="hidden md:flex items-center justify-center h-full mx-2">
              <svg
                width="80"
                height="40"
                viewBox="0 0 80 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10 20 C30 10, 50 30, 70 20"
                  stroke="#636ae8"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="4 3"
                  fill="none"
                />
                <path
                  d="M65 15 L70 20 L65 25"
                  stroke="#636ae8"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </svg>
            </div>
            {/* Step 4 + Brief */}
            <div className="w-full md:w-1/2 mt-4 md:mt-0">
              <div className="flex flex-col md:flex-row bg-white dark:bg-card rounded-2xl shadow-md border border-green-100 dark:border-green-900 p-4 md:p-6 items-stretch gap-0 min-h-[320px] mb-1">
                {/* Step */}
                <div className="flex flex-col items-center justify-center flex-1 px-2 py-4">
                  <span className="mb-2">
                    <svg
                      className="w-8 h-8 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M8 10h.01M12 14h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8s-9-3.582-9-8a9 9 0 1 1 18 0Z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <span className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100 text-green-700 font-bold text-lg border-2 border-green-200 shadow mb-2">
                    4
                  </span>
                  <h3 className="font-bold text-lg text-green-700 dark:text-green-400 mb-1">
                    Chat for Every Deal
                  </h3>
                  <div className="w-8 border-b border-green-100 mx-auto mb-2"></div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed text-center">
                    Discuss details and negotiate directly with other
                    pharmacists through secure chat for each deal.
                  </p>
                </div>
                {/* Divider */}
                <div className="hidden md:flex flex-col items-center justify-center px-2">
                  <span className="w-2 h-2 rounded-full bg-green-400 mb-1"></span>
                  <div className="w-0.5 h-12 bg-green-100 rounded-full"></div>
                </div>
                {/* Brief */}
                <div className="flex flex-col justify-center flex-1 px-2 py-4">
                  <div className="flex items-center gap-2 mb-2">
                    <svg
                      className="w-5 h-5 text-green-700"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path d="M8 10h.01M12 14h.01M16 10h.01" />
                    </svg>
                    <h4 className="text-base font-semibold text-green-700 dark:text-green-400">
                      Why Chat?
                    </h4>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                    Direct chat for every deal makes negotiation easy,
                    transparent, and secure—no need to share personal contact
                    info.
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* Arrow hand-drawn vertical big between row 2 and 3 */}
          <div className="hidden md:flex items-center justify-center my-1">
            <svg
              width="40"
              height="120"
              viewBox="0 0 40 120"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20 5 C22 20, 18 40, 20 55"
                stroke="#636ae8"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="6 5"
                fill="none"
              />
              <path
                d="M15 50 L20 55 L25 50"
                stroke="#636ae8"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
          </div>
          {/* Row 3: Step 5 only (centered) */}
          <div className="flex flex-col md:flex-row w-full justify-center">
            <div className="w-full md:w-1/2 mx-auto">
              <div className="flex flex-col md:flex-row bg-white dark:bg-card rounded-2xl shadow-md border border-gray-200 dark:border-gray-900 p-4 md:p-6 items-stretch gap-0 min-h-[320px] mb-1">
                {/* Step */}
                <div className="flex flex-col items-center justify-center flex-1 px-2 py-4">
                  <span className="mb-2">
                    <svg
                      className="w-8 h-8 text-gray-700"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM12 14v7m-7-7a7 7 0 0 1 14 0v7H5v-7Z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <span className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 text-gray-700 font-bold text-lg border-2 border-gray-200 shadow mb-2">
                    5
                  </span>
                  <h3 className="font-bold text-lg text-gray-700 dark:text-gray-400 mb-1">
                    Sell Your Pharmacy
                  </h3>
                  <div className="w-8 border-b border-gray-200 mx-auto mb-2"></div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed text-center">
                    List your pharmacy for sale and connect with interested
                    buyers in the pharmacy community.
                  </p>
                </div>
                {/* Divider */}
                <div className="hidden md:flex flex-col items-center justify-center px-2">
                  <span className="w-2 h-2 rounded-full bg-gray-400 mb-1"></span>
                  <div className="w-0.5 h-12 bg-gray-100 rounded-full"></div>
                </div>
                {/* Brief */}
                <div className="flex flex-col justify-center flex-1 px-2 py-4">
                  <div className="flex items-center gap-2 mb-2">
                    <svg
                      className="w-5 h-5 text-gray-700"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <rect x="3" y="3" width="18" height="14" rx="2" />
                      <path d="M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM12 14v7m-7-7a7 7 0 0 1 14 0v7H5v-7Z" />
                    </svg>
                    <h4 className="text-base font-semibold text-gray-700 dark:text-gray-400">
                      Why Sell Your Pharmacy?
                    </h4>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                    Reach a network of trusted pharmacists if you ever need to
                    sell your pharmacy, with privacy and professionalism.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Why Dawaback Section */}
      <section className="w-full max-w-6xl mx-auto py-20 px-4 md:px-0">
        <div className="text-center mb-8">

          <span className="uppercase text-xs tracking-widest text-primary dark:text-primary font-semibold">
            Our Promise
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-primary dark:text-primary mb-2">

            Why Pharmacists Trust Dawaback
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto mb-6">
            Dawaback is more than a platform—it's a secure, professional
            community built for pharmacists by pharmacists. Here’s what makes us
            different:
          </p>

          <div className="w-16 h-1 mx-auto bg-primary dark:bg-primary rounded-full mb-6"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* Feature 1 */}
          <div className="bg-white dark:bg-card rounded-2xl shadow border border-primary dark:border-primary p-8 flex flex-col items-center text-center hover:border-primary dark:hover:border-primary transition">
            <div className="bg-primary/10 dark:bg-primary/20 text-primary rounded-full p-5 mb-4 shadow">

              <svg
                className="w-10 h-10"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path
                  d="M12 11v2m0 4h.01M21 12c0 4.418-4.03 8-9 8s-9-3.582-9-8a9 9 0 1 1 18 0Z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <h3 className="font-extrabold text-lg mb-2 text-primary dark:text-primary">

              Verified Community
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-base font-light mb-2">
              Only licensed pharmacists. No spam, no random users—just trusted
              professionals.
            </p>
          </div>
          {/* Feature 2 */}
          <div className="bg-white dark:bg-card rounded-2xl shadow border border-green-100 dark:border-green-900 p-8 flex flex-col items-center text-center hover:border-green-400 dark:hover:border-green-400 transition">
            <div className="bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-full p-5 mb-4 shadow">
              <svg
                className="w-10 h-10"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path
                  d="M17 20h5v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2h5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <h3 className="font-extrabold text-lg mb-2 text-green-700 dark:text-green-400">
              Secure Deals
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-base font-light mb-2">
              Your data and deals are protected. Only verified users can access
              deal details and chat.
            </p>
          </div>
          {/* Feature 3 */}
          <div className="bg-white dark:bg-card rounded-2xl shadow border border-purple-100 dark:border-purple-900 p-8 flex flex-col items-center text-center hover:border-purple-400 dark:hover:border-purple-400 transition">
            <div className="bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-full p-5 mb-4 shadow">
              <svg
                className="w-10 h-10"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <rect x="3" y="3" width="18" height="14" rx="2" />
                <path
                  d="M8 17l4 4 4-4m-4-5v9"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h3 className="font-extrabold text-lg mb-2 text-purple-700 dark:text-purple-400">
              Real-Time Chat
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-base font-light mb-2">
              Negotiate and discuss every deal instantly. No need to share your
              phone number or email.
            </p>
          </div>
          {/* Feature 4 */}
          <div className="bg-white dark:bg-card rounded-2xl shadow border border-yellow-100 dark:border-yellow-900 p-8 flex flex-col items-center text-center hover:border-yellow-400 dark:hover:border-yellow-400 transition">
            <div className="bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 rounded-full p-5 mb-4 shadow">
              <svg
                className="w-10 h-10"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <rect x="3" y="3" width="18" height="14" rx="2" />
                <path
                  d="M8 17l4 4 4-4m-4-5v9"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h3 className="font-extrabold text-lg mb-2 text-yellow-700 dark:text-yellow-400">
              Easy Pharmacy Listing
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-base font-light mb-2">
              List your pharmacy for sale in minutes and connect with serious,
              verified buyers—no hassle, no middlemen.
            </p>
          </div>
        </div>
        <div className="text-center mt-10">
          <a
            href="#how-it-works"

            className="inline-flex items-center gap-2 bg-primary dark:bg-primary hover:bg-primary-hover dark:hover:bg-primary-hover text-white font-semibold rounded-lg px-6 py-3 text-lg shadow-md transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-primary/40"

          >
            See How It Works
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                d="M5 12h14M12 5l7 7-7 7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>
      </section>
      {/* Verification Steps Section */}

      <section className="w-full max-w-4xl mx-auto py-16 px-4 md:px-0">
        <div className="text-center mb-8">

          <h2 className="text-3xl md:text-4xl font-extrabold text-primary dark:text-primary mb-2">

            How Verification Works
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto mb-6">
            To ensure a trusted community, Dawaback verifies every pharmacist by
            matching their National ID and Syndicate Card. The process is simple
            and secure:
          </p>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10">
          {/* Step 1 */}
          <div className="flex flex-col items-center text-center flex-1">

            <div className="w-32 h-20 min-h-[80px] rounded-lg overflow-hidden mb-3 border-2 border-primary dark:border-primary bg-primary/10 dark:bg-primary/90 flex items-center justify-center">
              <img
                src="https://lh6.googleusercontent.com/proxy/AOOaYP1jukyrY_y0cnhYKLMaKWO9R8HIAEyc1BZMVOE_PUjJWhdWyPvBAgGrR2H_UzLkLw2rsO_L_8mq2ofGBfzXhCGk"
                alt="ID Front"
                className="w-full h-full object-cover blur-xs"
              />
            </div>
            <div className="min-h-[72px] flex flex-col justify-start">

              <h3 className="font-bold text-primary dark:text-primary mb-1 text-lg">
                Upload National ID (Front)
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Take a clear photo of the front side of your National ID.
              </p>
            </div>
          </div>
          {/* Arrow */}
          <div className="hidden md:flex items-center justify-center">
            <svg
              width="60"
              height="40"
              viewBox="0 0 60 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10 20 C25 10, 35 30, 50 20"
                stroke="#636ae8"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="4 3"
                fill="none"
              />
              <path
                d="M45 15 L50 20 L45 25"
                stroke="#636ae8"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
          </div>
          {/* Step 2 */}
          <div className="flex flex-col items-center text-center flex-1">

            <div className="w-32 h-20 min-h-[80px] rounded-lg overflow-hidden mb-3 border-2 border-primary dark:border-primary bg-primary/10 dark:bg-primary/90 flex items-center justify-center">

              <img
                src="https://gate.ahram.org.eg/Media/News/2013/3/13/2013-634988045225330147-533_main.jpg"
                alt="ID Back"
                className="w-full h-full object-cover blur-xs"
              />
            </div>
            <div className="min-h-[72px] flex flex-col justify-start">

              <h3 className="font-bold text-primary dark:text-primary mb-1 text-lg">

                Upload National ID (Back)
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Take a clear photo of the back side of your National ID.
              </p>
            </div>
          </div>
          {/* Arrow */}
          <div className="hidden md:flex items-center justify-center">
            <svg
              width="60"
              height="40"
              viewBox="0 0 60 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10 20 C25 10, 35 30, 50 20"
                stroke="#636ae8"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="4 3"
                fill="none"
              />
              <path
                d="M45 15 L50 20 L45 25"
                stroke="#636ae8"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
          </div>
          {/* Step 3 */}
          <div className="flex flex-col items-center text-center flex-1">

            <div className="w-32 h-20 min-h-[80px] rounded-lg overflow-hidden mb-3 border-2 border-primary dark:border-primary bg-primary/10 dark:bg-primary/90 flex items-center justify-center">

              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNnyy_1HBP_TzMGUr2CNbE5ZrqmdnbmjoACw&s"
                alt="Syndicate Card"
                className="w-full h-full object-cover blur-xs"
              />
            </div>
            <div className="min-h-[72px] flex flex-col justify-start">

              <h3 className="font-bold text-primary dark:text-primary mb-1 text-lg">

                Upload Syndicate Card (Front)
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Take a clear photo of your Pharmacists Syndicate Card (front
                side).
              </p>
            </div>
          </div>
        </div>
        <div className="text-center mt-8">

          <p className="text-primary dark:text-primary text-base font-semibold">

            We automatically match your documents for maximum security and
            trust.
          </p>
        </div>
      </section>
      {/* FAQ Section */}
      <section className="w-full flex justify-center items-center py-20 px-2 animate-fade-in">
        <div className="w-full max-w-3xl">
          <div className="text-center mb-10">
            <h2 className="text-4xl md:text-5xl font-extrabold text-primary dark:text-primary mb-3">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto mb-6">
              Find answers to the most common questions about Dawaback platform.
            </p>
          </div>
          <Accordion
            items={[
              {
                title: (
                  <div className="flex items-center gap-4">
                    <HelpCircle className="w-8 h-8 text-primary" />
                    <span className="flex items-center gap-2 text-primary text-lg md:text-xl font-semibold">
                      What is Dawaback?
                    </span>
                  </div>
                ),
                content:
                  "Dawaback is a secure, professional online platform designed exclusively for licensed pharmacists. It enables members to exchange surplus or near-expiry medicines, communicate directly through a dedicated chat for each deal, and list pharmacies for sale. Our mission is to reduce medicine waste, support the pharmacy community, and provide a trusted space for professional collaboration.",
                icon: null,
              },
              {
                title: (
                  <div className="flex items-center gap-4">
                    <UserCheck className="w-8 h-8 text-green-500" />
                    <span className="flex items-center gap-2 text-primary text-lg md:text-xl font-semibold">
                      Who can register on Dawaback?
                    </span>
                  </div>
                ),
                content:
                  "Registration is strictly limited to licensed pharmacists. During sign-up, we require you to upload your National ID and Pharmacy Syndicate Card for verification. This process ensures that only qualified professionals join Dawaback, maintaining a safe and trusted environment for all users.",
                icon: null,
              },
              {
                title: (
                  <div className="flex items-center gap-4">
                    <Gift className="w-8 h-8 text-purple-500" />
                    <span className="flex items-center gap-2 text-primary text-lg md:text-xl font-semibold">
                      How can I benefit from Dawaback?
                    </span>
                  </div>
                ),
                content:
                  "As a Dawaback member, you can browse and search for available medicine deals, post your own surplus medicines, and connect with other pharmacists through secure, real-time chat. You can also list your pharmacy for sale and reach a network of verified buyers. The platform is designed to make medicine exchange, deal negotiation, and pharmacy sales easy, efficient, and secure.",
                icon: null,
              },
              {
                title: (
                  <div className="flex items-center gap-4">
                    <ShieldCheck className="w-8 h-8 text-cyan-600" />
                    <span className="flex items-center gap-2 text-primary text-lg md:text-xl font-semibold">
                      Is my data and my deals secure?
                    </span>
                  </div>
                ),
                content:
                  "Absolutely. Dawaback uses advanced security measures to protect your personal information and deal data. Only verified pharmacists have access to sensitive features, and your private details are never shared with third parties. All communications and transactions are encrypted to ensure your privacy and peace of mind.",
                icon: null,
              },
              {
                title: (
                  <div className="flex items-center gap-4">
                    <CreditCard className="w-8 h-8 text-yellow-500" />
                    <span className="flex items-center gap-2 text-primary text-lg md:text-xl font-semibold">
                      Are there any subscription fees?
                    </span>
                  </div>
                ),
                content:
                  "Yes, Dawaback offers flexible subscription plans to give you full access to all platform features, including unlimited deals, secure chat, and pharmacy listing. Subscription fees help us maintain high service quality, enhance security, and continuously improve the platform for the pharmacy community. You can choose the plan that best fits your needs, and all payments are processed securely.",
                icon: null,
              },
            ]}
          />
        </div>
      </section>
    </main>
  );
}
