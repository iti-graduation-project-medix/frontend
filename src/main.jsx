import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ThemeProvider } from "@/components/theme-provider";
import { HelmetProvider } from 'react-helmet-async';

// Register service worker for PWA
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    // VitePWA generates the service worker automatically
    // No need to manually register it
    // PWA Service Worker will be registered automatically by VitePWA
  });
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <HelmetProvider>
      <App />
        </HelmetProvider>
    </ThemeProvider>
  </StrictMode>
);
