import React from 'react';
import InstallApp from './InstallApp';
import DownloadApp from './DownloadApp';

const OfflinePage = () => {
  const handleRetry = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 text-center shadow-2xl max-w-md w-full">
        <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
          📶
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          أنت غير متصل بالإنترنت
        </h1>

        <p className="text-gray-600 mb-6 leading-relaxed">
          يبدو أنك فقدت الاتصال بالإنترنت. لا تقلق، يمكنك الوصول للصفحة الرئيسية وبعض الميزات الأساسية.
        </p>

        <button
          onClick={handleRetry}
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-full font-semibold mb-3 w-full hover:shadow-lg transition-all duration-300"
        >
          إعادة المحاولة
        </button>

        <button
          onClick={handleGoHome}
          className="border-2 border-blue-500 text-blue-500 px-6 py-3 rounded-full font-semibold w-full hover:bg-blue-500 hover:text-white transition-all duration-300"
        >
          الذهاب للصفحة الرئيسية (متاحة في الوضع offline)
        </button>

        <div className="mt-6 p-3 bg-red-50 text-red-600 rounded-full text-sm">
          غير متصل
        </div>

        <div className="mt-4 p-3 bg-green-50 text-green-600 rounded-full text-sm">
          الصفحة الرئيسية متاحة في الوضع offline
        </div>
      </div>

      {/* Install App Button */}
      <InstallApp />

      {/* Download App Button */}
      <DownloadApp />
    </div>
  );
};

export default OfflinePage;
