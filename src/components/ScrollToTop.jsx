import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import React from "react";

export default function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    if (window.scrollY > 0) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [pathname]);
  return null;
}
