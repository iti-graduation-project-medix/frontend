import React, { useEffect, useState } from "react";

const features = [
  "Access the home page",
  "View cached content",
  "Use basic navigation",
  "Check your connection status",
];

const OfflinePage = () => {
  const [loading, setLoading] = useState(false);

  // Custom styles for animations
  const customStyles = `
    @keyframes spin-slow {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    .animate-spin-slow {
      animation: spin-slow 8s linear infinite;
    }
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-20px); }
    }
    .animate-float {
      animation: float 6s ease-in-out infinite;
    }
    @keyframes glow {
      0%, 100% { box-shadow: 0 0 20px rgba(99, 102, 241, 0.3); }
      50% { box-shadow: 0 0 40px rgba(99, 102, 241, 0.6); }
    }
    .animate-glow {
      animation: glow 3s ease-in-out infinite;
    }
    @keyframes shimmer {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }
    .animate-shimmer {
      animation: shimmer 2s infinite;
    }
  `;

  useEffect(() => {
    const handleOnline = () => {
      window.location.reload();
    };
    window.addEventListener("online", handleOnline);
    return () => window.removeEventListener("online", handleOnline);
  }, []);

  const handleRetry = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  return (
    <>
      <style>{customStyles}</style>
      <div className="min-h-screen flex items-center justify-center p-12  bg-transparent relative">
        {/* Enhanced Background Layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 opacity-40"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-cyan-50 via-blue-50 to-indigo-50 opacity-30 animate-pulse"></div>

        {/* Floating Background Elements */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-indigo-200/20 to-purple-200/20 rounded-full blur-2xl animate-float"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-r from-pink-200/20 to-cyan-200/20 rounded-full blur-2xl animate-float delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-gradient-to-r from-blue-200/10 to-indigo-200/10 rounded-full blur-3xl animate-pulse"></div>

        <div className="backdrop-blur-2xl bg-white/80 border border-indigo-100/60 rounded-3xl shadow-2xl max-w-5xl w-full flex flex-col md:flex-row overflow-hidden relative animate-glow">
          {/* Shimmer Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer pointer-events-none"></div>
          {/* Left: Icon, status, features */}
          <div className="flex flex-col items-center justify-center md:items-start md:justify-between md:w-1/2 bg-gradient-to-br from-gray-800/90 via-indigo-900/80 to-purple-900/90 relative text-center md:text-left overflow-hidden">
            {/* Additional Floating Elements for Left Section */}
            <div className="absolute top-5 left-5 w-3 h-3 bg-yellow-400 rounded-full animate-bounce opacity-60"></div>
            <div className="absolute top-8 right-8 w-2 h-2 bg-green-400 rounded-full animate-ping opacity-50"></div>
            <div className="absolute bottom-8 left-8 w-4 h-4 bg-orange-400 rounded-full animate-float opacity-40"></div>
            <div className="absolute bottom-5 right-5 w-1.5 h-1.5 bg-teal-400 rounded-full animate-pulse opacity-70"></div>

            {/* Enhanced Geometric Shapes */}
            <div className="absolute top-1/3 left-1/3 w-8 h-8 border border-indigo-300/40 rounded-full animate-spin-slow"></div>
            <div className="absolute bottom-1/3 right-1/3 w-6 h-6 bg-gradient-to-br from-pink-300/30 to-purple-300/30 rounded-lg rotate-12 animate-pulse delay-500"></div>

            <div className="flex flex-col items-center md:items-start w-full text-center md:text-left relative z-10 p-12">
              <div className="w-28 h-28 flex items-center justify-center mb-6 text-6xl  mx-auto md:mx-0 relative">
                {/* Enhanced Icon Background */}
                <div className="absolute inset-0 rounded-full"></div>
                <span role="img" aria-label="offline" className="relative z-10">
                  🚫
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 drop-shadow-lg">Offline Status</h3>
              <ul className="space-y-3">
                {features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-white/90">
                    <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full flex items-center justify-center">
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <span className="text-white/90 font-medium">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {/* Divider for md+ */}
          <div className="hidden md:block w-px bg-gradient-to-b from-indigo-200 to-purple-200 my-8" />
          {/* Right: Content */}
          <div className="flex-1 flex flex-col justify-center items-center md:items-start text-center md:text-left relative overflow-hidden">
            {/* Magnificent Background Elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 opacity-60"></div>
            <div className="absolute inset-0 bg-gradient-to-tr from-pink-100/30 via-transparent to-cyan-100/30 animate-pulse"></div>
            <div className="absolute inset-0 bg-gradient-to-bl from-yellow-50/20 via-transparent to-orange-50/20 animate-pulse delay-1000"></div>

            {/* Enhanced Floating Particles */}
            <div className="absolute top-10 left-10 w-2 h-2 bg-indigo-400 rounded-full animate-bounce opacity-60"></div>
            <div className="absolute top-20 right-16 w-3 h-3 bg-purple-400 rounded-full animate-ping opacity-40"></div>
            <div className="absolute bottom-20 left-16 w-1.5 h-1.5 bg-pink-400 rounded-full animate-bounce opacity-70"></div>
            <div className="absolute bottom-10 right-10 w-2.5 h-2.5 bg-cyan-400 rounded-full animate-pulse opacity-50"></div>
            <div className="absolute top-1/2 left-8 w-1 h-1 bg-yellow-400 rounded-full animate-float opacity-80"></div>
            <div className="absolute bottom-1/2 right-8 w-1.5 h-1.5 bg-green-400 rounded-full animate-ping opacity-60"></div>
            <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-orange-400 rounded-full animate-bounce opacity-50"></div>
            <div className="absolute bottom-1/3 left-1/3 w-1 h-1 bg-teal-400 rounded-full animate-pulse opacity-70"></div>

            {/* Enhanced Geometric Shapes */}
            <div className="absolute top-1/4 right-1/4 w-16 h-16 border-2 border-indigo-200/50 rounded-full animate-spin-slow"></div>
            <div className="absolute bottom-1/4 left-1/4 w-12 h-12 bg-gradient-to-br from-purple-200/40 to-pink-200/40 rounded-lg rotate-45 animate-pulse"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 border border-cyan-300/40 rounded-full animate-spin-slow delay-1000"></div>
            <div className="absolute top-3/4 right-1/4 w-10 h-10 bg-gradient-to-br from-yellow-200/30 to-orange-200/30 rounded-lg rotate-90 animate-pulse delay-500"></div>

            {/* Enhanced Gradient Orbs */}
            <div className="absolute top-1/3 left-1/3 w-20 h-20 bg-gradient-to-r from-indigo-300/30 to-purple-300/30 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute bottom-1/3 right-1/3 w-24 h-24 bg-gradient-to-r from-pink-300/20 to-cyan-300/20 rounded-full blur-xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/4 left-1/4 w-16 h-16 bg-gradient-to-r from-yellow-300/20 to-orange-300/20 rounded-full blur-lg animate-float"></div>
            <div className="absolute bottom-1/4 right-1/4 w-28 h-28 bg-gradient-to-r from-green-300/15 to-teal-300/15 rounded-full blur-2xl animate-pulse delay-1500"></div>

            {/* Content with enhanced styling */}
            <div className="relative z-10 p-12">
              <h1 className="text-5xl font-extrabold text-gray-800 mb-8 text-center md:text-left drop-shadow">
                You're Offline
              </h1>
              <p className="text-gray-600 mb-8 leading-relaxed text-lg font-medium">
                It looks like you've lost your internet connection.
                <br />
                <span className="text-indigo-600 font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text">
                  Don't worry, you can still access the home page and some basic features.
                </span>
              </p>
              <div className="flex flex-col gap-4 w-full md:w-auto items-center md:items-start">
                <button
                  onClick={handleRetry}
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer relative overflow-hidden group animate-glow"
                  disabled={loading}
                  style={{ background: "linear-gradient(135deg, #636ae8 0%, #764ba2 100%)" }}
                >
                  {/* Enhanced Button Effects */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/20 to-purple-400/20 rounded-full blur-sm animate-pulse"></div>

                  <svg
                    className="w-5 h-5 mr-2 animate-spin"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      className="opacity-25"
                    />
                    <path d="M4 12a8 8 0 018-8v8z" fill="currentColor" className="opacity-75" />
                  </svg>
                  {loading ? "Checking..." : "Retry Connection"}
                </button>

                <div className="mt-4 px-10 py-2 rounded-full text-base font-semibold shadow-lg bg-gradient-to-r from-red-100 via-pink-100 to-red-100 text-red-600 w-auto flex items-center justify-center border border-red-200/50 backdrop-blur-sm relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  🚫 Page Unavailable
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OfflinePage;
