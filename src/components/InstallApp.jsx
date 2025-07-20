import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { FiDownload, FiShare2, FiX } from "react-icons/fi";

const MotionButton = motion.create(Button);

const InstallApp = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if app is already installed (standalone mode)
    setIsStandalone(window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true);
    
    // Detect iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    setIsIOS(iOS);

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
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
    if (isIOS) {
      setShowIOSInstructions(true);
      return;
    }

    if (deferredPrompt) {
      // Use the native install prompt
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        console.log("User accepted the install prompt");
      } else {
        console.log("User dismissed the install prompt");
      }
      setDeferredPrompt(null);
    } else {
      // Fallback for Android when no install prompt is available
      // Show instructions for manual installation
      setShowIOSInstructions(true);
    }
  };

  const handleShareClick = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Dawaback App',
          text: 'Install Dawaback - Trusted Pharmacy Platform',
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy URL to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard! Share this link to install the app.');
    }
  };

  // Don't show if already in standalone mode (app is installed)
  if (isStandalone) {
    return null;
  }

  // Show on iOS or if install prompt is available
  // For Android, we'll show the button even without deferredPrompt
  if (!isIOS && !deferredPrompt) {
    // For Android, we can still show the button and handle manual installation
    // The button will be disabled but visible
  }

  return (
    <>
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={handleInstallClick}
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 font-semibold animate-pulse cursor-pointer"
          title={isIOS ? "Install on iOS" : "Install App"}
        >
          <FiDownload className="w-5 h-5 animate-bounce" />
          {isIOS ? "Install App" : "Install App"}
        </button>
      </div>

      {/* iOS Installation Instructions Modal */}
      {showIOSInstructions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Install Dawaback App {isIOS ? '(iOS)' : '(Android)'}
              </h3>
              <button
                onClick={() => setShowIOSInstructions(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="bg-primary rounded-full px-2 py-.5">
                  <span className="text-white font-bold text-sm">1</span>
                </div>
                <p className="text-gray-700">Tap the <strong>Share</strong> button in your browser</p>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="bg-primary rounded-full px-2 py-.5">
                  <span className="text-white font-bold text-sm">2</span>
                </div>
                <p className="text-gray-700">
                  {isIOS ? (
                    <>Scroll down and tap <strong>"Add to Home Screen"</strong></>
                  ) : (
                    <>Tap <strong>"Install App"</strong> or <strong>"Add to Home Screen"</strong></>
                  )}
                </p>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="bg-primary rounded-full px-2 py-.5">
                  <span className="text-white font-bold text-sm">3</span>
                </div>
                <p className="text-gray-700">Tap <strong>"Add"</strong> or <strong>"Install"</strong> to install the app</p>
              </div>
            </div>

            <div className="mt-6 flex space-x-3">
              <button
                onClick={handleShareClick}
                className="flex-1 bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary-hover transition-colors flex items-center justify-center gap-2"
              >
                <FiShare2 className="w-4 h-4" />
                Share Link
              </button>
              <button
                onClick={() => setShowIOSInstructions(false)}
                className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InstallApp;
