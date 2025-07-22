import React, { useState } from "react";
import { Phone, MessageCircle, ArrowRight } from "lucide-react";

export default function CallToAction() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    message: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", formData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-background dark:to-card rounded-2xl border border-blue-100 dark:border-border p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-foreground mb-2">
          Didn't find what you're looking for?
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Our expert brokers can help you find the perfect pharmacy. Get
          personalized recommendations and exclusive listings.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 items-center">
        {/* Form */}
        <div className="bg-white dark:bg-card rounded-xl p-6 shadow-sm border border-gray-100 dark:border-border">
          <h3 className="text-lg font-bold text-gray-900 dark:text-foreground mb-4">
            Request a Call
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-background dark:text-foreground"
                placeholder="Enter your full name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-background dark:text-foreground"
                placeholder="Enter your phone number"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Message (Optional)
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-background dark:text-foreground"
                placeholder="Tell us about your requirements..."
              />
            </div>
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-primary dark:hover:bg-primary-hover text-white rounded-lg font-medium transition-colors"
            >
              <Phone className="w-4 h-4" />
              Request Call Back
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Brokers Info */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-foreground mb-4">
              Our Top Brokers
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-white dark:bg-card rounded-lg border border-gray-100 dark:border-border">
                <div className="w-12 h-12 bg-blue-100 dark:bg-primary/20 text-blue-600 dark:text-primary rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="font-bold text-lg">A</span>
                </div>
                <p className="font-medium text-gray-900 dark:text-foreground">
                  Ahmed Hassan
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Senior Broker
                </p>
                <p className="text-xs text-blue-600 dark:text-primary">
                  15+ years experience
                </p>
              </div>
              <div className="text-center p-4 bg-white dark:bg-card rounded-lg border border-gray-100 dark:border-border">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="font-bold text-lg">S</span>
                </div>
                <p className="font-medium text-gray-900 dark:text-foreground">
                  Sarah Mohamed
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Pharmacy Specialist
                </p>
                <p className="text-xs text-green-600 dark:text-green-400">
                  10+ years experience
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-card rounded-lg p-4 border border-gray-100 dark:border-border">
            <div className="flex items-center gap-3 mb-3">
              <MessageCircle className="w-5 h-5 text-blue-600 dark:text-primary" />
              <span className="font-medium text-gray-900 dark:text-foreground">
                Quick Response
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Get a response within 2 hours during business hours
            </p>
          </div>

          <div className="bg-white dark:bg-card rounded-lg p-4 border border-gray-100 dark:border-border">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
              <span className="font-medium text-gray-900 dark:text-foreground">
                Free Consultation
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              No fees for initial consultation and property search
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
