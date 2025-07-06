import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { FiDownload, FiSmartphone, FiMonitor } from 'react-icons/fi';

const DownloadApp = () => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async (platform) => {
    setIsDownloading(true);

    try {
      if (platform === 'android') {
        // For Android - trigger PWA install
        if ('serviceWorker' in navigator && 'BeforeInstallPromptEvent' in window) {
          // This will trigger the native install prompt
          window.dispatchEvent(new Event('beforeinstallprompt'));
        } else {
          // Fallback - show instructions
          alert('لتثبيت التطبيق على Android:\n1. افتح Chrome\n2. اضغط على القائمة (ثلاث نقاط)\n3. اختر "إضافة إلى الشاشة الرئيسية"');
        }
      } else if (platform === 'ios') {
        // For iOS - show instructions
        alert('لتثبيت التطبيق على iOS:\n1. افتح Safari\n2. اضغط على زر المشاركة\n3. اختر "إضافة إلى الشاشة الرئيسية"');
      } else if (platform === 'desktop') {
        // For Desktop - trigger PWA install
        if ('serviceWorker' in navigator && 'BeforeInstallPromptEvent' in window) {
          window.dispatchEvent(new Event('beforeinstallprompt'));
        } else {
          alert('لتثبيت التطبيق على الكمبيوتر:\n1. اضغط على زر التثبيت في شريط العنوان\n2. أو اضغط Ctrl+Shift+I ثم Application > Manifest > Install');
        }
      }
    } catch (error) {
      console.error('Download error:', error);
      alert('حدث خطأ أثناء التحميل. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white rounded-2xl shadow-2xl p-4 border border-gray-200"
      >
        <h3 className="text-lg font-bold text-gray-800 mb-3 text-center">
          تحميل التطبيق
        </h3>

        <div className="space-y-3">
          <Button
            onClick={() => handleDownload('android')}
            disabled={isDownloading}
            className="w-full bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FiSmartphone className="w-4 h-4" />
            <span>Android</span>
          </Button>

          <Button
            onClick={() => handleDownload('ios')}
            disabled={isDownloading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FiSmartphone className="w-4 h-4" />
            <span>iOS</span>
          </Button>

          <Button
            onClick={() => handleDownload('desktop')}
            disabled={isDownloading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FiMonitor className="w-4 h-4" />
            <span>Desktop</span>
          </Button>
        </div>

        {isDownloading && (
          <div className="mt-3 text-center text-sm text-gray-600">
            جاري التحميل...
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default DownloadApp;
