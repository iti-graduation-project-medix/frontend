import React from "react";
import { SignUpForm } from "../../components/signUP-form";

export default function SignUp() {
  return (
    <div className="min-h-svh ">
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-7xl">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl text-primary md:text-4xl font-bold  mb-3">
            Join Our Medical Community
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Create your secure account to access comprehensive healthcare
            services and connect with medical professionals
          </p>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row items-start justify-center gap-8 lg:gap-12">
          {/* Left Side - Welcome Section */}
          <div className="w-full lg:w-5/12 hidden lg:block">
            <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 rounded-2xl shadow-lg p-8 h-full relative overflow-hidden">
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full -mr-16 -mt-16 opacity-50"></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-indigo-100 rounded-full -ml-20 -mb-20 opacity-50"></div>

              <div className="relative">
                {/* Logo and Title */}
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
                    <img
                      src="/capsule-svgrepo-com.svg"
                      alt="Capsule Icon"
                      className="w-8 h-8 text-white"
                    />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    Welcome to Dawaback
                  </h2>
                </div>

                {/* Main Benefits */}
                <div className="space-y-6 mb-8">
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl p-5 border border-blue-100">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <svg
                          className="w-5 h-5 text-blue-600"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M20 7h-7m0 0v7m0-7l7 7m-7-7H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-7" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          Expand Your Business
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Connect with thousands of verified pharmacies and
                          wholesalers
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/80 backdrop-blur-sm rounded-xl p-5 border border-indigo-100">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
                        <svg
                          className="w-5 h-5 text-indigo-600"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          Save Time & Money
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Quick and secure transactions with competitive pricing
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/80 backdrop-blur-sm rounded-xl p-5 border border-purple-100">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                        <svg
                          className="w-5 h-5 text-purple-600"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0 1 12 2.944a11.955 11.955 0 0 1-8.618 3.04A12.02 12.02 0 0 0 3 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016Z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          Trusted Platform
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Verified partners and secure payment system
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Market Stats */}
                <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 border border-blue-100 mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Market Overview
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary mb-1">
                        5K+
                      </div>
                      <div className="text-sm text-gray-600">
                        Active Pharmacies
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-indigo-600 mb-1">
                        100K+
                      </div>
                      <div className="text-sm text-gray-600">
                        Monthly Trades
                      </div>
                    </div>
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="flex flex-wrap gap-3">
                  <div className="px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-green-100 flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-green-600"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0 1 12 2.944a11.955 11.955 0 0 1-8.618 3.04A12.02 12.02 0 0 0 3 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016Z" />
                    </svg>
                    <span className="text-sm font-medium text-gray-700">
                      Verified Partners
                    </span>
                  </div>
                  <div className="px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-blue-100 flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-blue-600"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M12 15v2m-6 4h12a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2zm10-10V7a4 4 0 0 0-8 0v4h8z" />
                    </svg>
                    <span className="text-sm font-medium text-gray-700">
                      Secure Trading
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Form Section */}
          <div className="w-full lg:w-7/12">
            <SignUpForm />
          </div>
        </div>
      </div>
    </div>
  );
}
