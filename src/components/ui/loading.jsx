import React from 'react';

export const LoadingSpinner = ({ size = "default", className = "" }) => {
  const sizeClasses = {
    small: "h-4 w-4",
    default: "h-8 w-8", 
    large: "h-12 w-12",
    xl: "h-16 w-16"
  };

  return (
    <div className={`animate-spin rounded-full border-b-2 border-primary ${sizeClasses[size]} ${className}`}></div>
  );
};

export const LoadingPage = ({ message = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
      <LoadingSpinner size="xl" />
      <p className="text-muted-foreground">{message}</p>
    </div>
  );
};

export const LoadingCard = ({ message = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <LoadingSpinner size="large" />
      <p className="text-muted-foreground">{message}</p>
    </div>
  );
}; 