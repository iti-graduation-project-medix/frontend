import React from 'react';

export const LoadingSpinner = ({ size = "default", className = "" }) => {
  const sizeClasses = {
    small: "h-4 w-4",
    default: "h-8 w-8", 
    large: "h-12 w-12",
    xl: "h-16 w-16"
  };

  return (
    <div className={`animate-spin rounded-full border-2 border-gray-200 border-t-primary ${sizeClasses[size]} ${className}`}></div>
  );
};

export const LoadingPage = ({ message = "Loading..." }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center space-y-6 p-4">
      {/* Animated background dots */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary/20 rounded-full animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-primary/30 rounded-full animate-pulse delay-300"></div>
        <div className="absolute bottom-1/3 left-1/3 w-2 h-2 bg-primary/20 rounded-full animate-pulse delay-500"></div>
        <div className="absolute bottom-1/4 right-1/3 w-3 h-3 bg-primary/30 rounded-full animate-pulse delay-700"></div>
      </div>
      
      {/* Main loading content */}
      <div className="relative z-10 flex flex-col items-center space-y-6">
        {/* Enhanced spinner with glow effect */}
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-primary to-primary/80 animate-spin border-4 border-transparent border-t-white shadow-lg"></div>
          <div className="absolute inset-0 w-20 h-20 rounded-full bg-gradient-to-r from-primary/20 to-primary/40 animate-pulse"></div>
        </div>
        
        {/* Loading text with typing animation */}
        <div className="text-center space-y-2">
          <h2 className="text-xl font-semibold text-gray-900 animate-pulse">
            {message}
          </h2>
          <div className="flex items-center justify-center space-x-1">
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-100"></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-200"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const LoadingCard = ({ message = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4 bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Enhanced spinner */}
      <div className="relative">
        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-primary/80 animate-spin border-3 border-transparent border-t-white"></div>
        <div className="absolute inset-0 w-12 h-12 rounded-full bg-gradient-to-r from-primary/20 to-primary/40 animate-pulse"></div>
      </div>
      
      {/* Loading text */}
      <div className="text-center space-y-2">
        <p className="text-sm font-medium text-gray-700 animate-pulse">
          {message}
        </p>
        <div className="flex items-center justify-center space-x-1">
          <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"></div>
          <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce delay-100"></div>
          <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce delay-200"></div>
        </div>
      </div>
    </div>
  );
};

// New component for inline loading
export const LoadingInline = ({ size = "default", className = "" }) => {
  const sizeClasses = {
    small: "h-3 w-3",
    default: "h-4 w-4", 
    large: "h-6 w-6"
  };

  return (
    <div className={`inline-flex items-center space-x-2 ${className}`}>
      <div className={`animate-spin rounded-full border-2 border-gray-200 border-t-primary ${sizeClasses[size]}`}></div>
      <span className="text-xs text-gray-500 animate-pulse">Loading...</span>
    </div>
  );
};

// New component for skeleton loading
export const LoadingSkeleton = ({ lines = 3, className = "" }) => {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={`h-4 bg-gray-200 rounded animate-pulse ${
            index === lines - 1 ? 'w-3/4' : 'w-full'
          }`}
        ></div>
      ))}
    </div>
  );
}; 