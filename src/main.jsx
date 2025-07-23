import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ThemeProvider } from "@/components/theme-provider";
import { HelmetProvider } from 'react-helmet-async';

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
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
