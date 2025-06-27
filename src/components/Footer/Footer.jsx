import React from "react";
import { useInView } from "../../hooks/useInView";
import { Footer7 } from "../../components/footer7";
import { motion } from "framer-motion";

export function Footer() {
  const [footerRef, footerInView] = useInView();

  return (
    <motion.div
      ref={footerRef}
      initial={{ opacity: 0, y: 80 }}
      animate={footerInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1.5, ease: "easeOut" }}
    >
      <footer>
        <Footer7 />
      </footer>
    </motion.div>
  );
}
