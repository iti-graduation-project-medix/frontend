import React from "react";

export default function FormBgWrapper({ children, className = "" }) {
  return (
    <div className={`relative min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 ${className}`}>
      {/* Top right circle */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full -mr-16 -mt-16 opacity-50 pointer-events-none"></div>
      {/* Bottom left circle */}
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-indigo-100 rounded-full -ml-20 -mb-20 opacity-50 pointer-events-none"></div>
      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
} 