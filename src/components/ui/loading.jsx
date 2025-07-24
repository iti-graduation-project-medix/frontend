import React, { useEffect, useState } from "react";

export const LoadingCard = ({ message = "Loading...", fullPage = false }) => {
  return (
    <div
      className={
        fullPage
          ? "min-h-screen w-full flex items-center justify-center bg-white dark:bg-background"
          : ""
      }
    >
      <div className="flex flex-col items-center justify-center p-8 space-y-6 bg-white dark:bg-card rounded-2xl shadow-xl border border-gray-100 dark:border-border backdrop-blur-sm">
        {/* Modern capsule-themed spinner */}
        <div className="relative">
          <div className="w-20 h-10 rounded-full border-3 border-transparent border-t-gray-400 dark:border-t-gray-700 border-r-gray-500 dark:border-r-gray-600 animate-spin shadow-lg bg-gradient-to-r from-gray-50 to-gray-100 dark:from-muted dark:to-muted-foreground/10"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-muted dark:via-muted-foreground/20 dark:to-muted rounded-full animate-pulse border-2 border-gray-300 dark:border-border shadow-md"></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-gray-400 to-transparent dark:via-muted-foreground/40 rounded-full shadow-sm"></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-gray-500 dark:bg-muted-foreground rounded-full animate-ping shadow-md"></div>
          </div>
          <div className="absolute inset-0 w-20 h-10 rounded-full bg-gradient-to-r from-gray-100/40 via-transparent to-gray-100/40 dark:from-muted/30 dark:to-muted/30 animate-pulse"></div>
        </div>
        <div className="text-center space-y-3">
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 animate-pulse tracking-wide">
            {message}
          </p>
          <div className="flex items-center justify-center space-x-2">
            <div className="w-1.5 h-0.75 bg-gradient-to-r from-gray-300 to-gray-400 dark:from-muted-foreground/30 dark:to-muted-foreground/50 rounded-full animate-bounce shadow-sm"></div>
            <div className="w-1.5 h-0.75 bg-gradient-to-r from-gray-400 to-gray-500 dark:from-muted-foreground/50 dark:to-muted-foreground/70 rounded-full animate-bounce delay-100 shadow-sm"></div>
            <div className="w-1.5 h-0.75 bg-gradient-to-r from-gray-500 to-gray-600 dark:from-muted-foreground/70 dark:to-muted-foreground/90 rounded-full animate-bounce delay-200 shadow-sm"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const LoadingPage = ({
  size = 80,
  className = "",
  message = "Loading...",
  fullPage = true,
}) => {
  const wrapperSize = size * 1;
  return (
    <div
      className={`$${
        fullPage
          ? "min-h-screen w-full flex flex-col items-center justify-center"
          : "flex flex-col items-center justify-center"
      } ${className}`}
    >
      <div
        style={{
          position: "relative",
          width: wrapperSize,
          height: wrapperSize,
        }}
      >
        {/* Spinning wrapper SVG */}
        <img
          src="/wrapper.svg"
          alt="Loader Wrapper"
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: wrapperSize,
            height: wrapperSize,
            animation: "spin 1.2s linear infinite",
            transformOrigin: "50% 50%",
            filter: "var(--tw-drop-shadow)",
            borderRadius: "9999px",
          }}
        />
      </div>
      <div className="mt-2 text-center">
        <p className="text-md font-medium text-gray-600 dark:text-gray-200 animate-pulse">
          {message}
        </p>
      </div>
      <style>{`
        @keyframes spin {
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export const LoadingSkeleton = ({ lines = 3, className = "" }) => {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={`h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-muted dark:via-muted-foreground/20 dark:to-muted rounded-full animate-pulse shadow-inner ${
            index === lines - 1 ? "w-3/4" : "w-full"
          }`}
        ></div>
      ))}
    </div>
  );
};
