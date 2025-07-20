import React from "react";
import { useInView } from "../../hooks/useInView";
import { Footer7 } from "../../components/footer7";

export function Footer() {
  const [footerRef, footerInView] = useInView();

  return (
      <footer>
        <Footer7 />
      </footer>
  );
}
