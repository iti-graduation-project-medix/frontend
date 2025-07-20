import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { FiDownload } from "react-icons/fi";

const MotionButton = motion.create(Button);

const InstallApp = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // setShowInstallButton(true); // removed
    };

    const handleAppInstalled = () => {
      // setShowInstallButton(false); // removed
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      console.log("User accepted the install prompt");
    } else {
      console.log("User dismissed the install prompt");
    }
    setDeferredPrompt(null);
    // setShowInstallButton(false); // removed
  };

  // Always render the button, disable if not available
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={handleInstallClick}
        className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 font-semibold animate-pulse cursor-pointer"
        disabled={!deferredPrompt}
        title={!deferredPrompt ? "Install prompt not available" : "Install App"}
      >
        <FiDownload className="w-5 h-5 animate-bounce" />
        Install App
      </button>
    </div>
  );
};

export default InstallApp;
