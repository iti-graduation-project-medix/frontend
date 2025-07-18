import React, { useState } from "react";
// Removed useNavigate import

const features = [
  "Access the home page",
  "View cached content",
  "Use basic navigation",
  "Check your connection status",
];

const OfflinePage = () => {
  const [statusMsg, setStatusMsg] = useState("Offline");
  const [loading, setLoading] = useState(false);
  // Removed navigate

  const handleRetry = () => {
    setLoading(true);
    setTimeout(() => {
      setStatusMsg("Still offline. Please check your connection.");
      setLoading(false);
    }, 2000);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center md:m-0 p-8 md:p-4"
      style={{ background: "linear-gradient(135deg, #636ae8 0%, #764ba2 100%)" }}
    >
      <div className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full flex flex-col md:flex-row overflow-hidden">
        {/* Left: Icon, status, features */}
        <div className="flex flex-col items-center justify-center md:items-start md:justify-between md:w-1/2 p-6 md:p-8 bg-gradient-to-br from-indigo-50 to-purple-50 relative">
          <div className="flex flex-col items-center md:items-start w-full">
            <div className="w-28 h-28 bg-yellow-100 rounded-full flex items-center justify-center mb-6 text-5xl shadow-xl border-4 border-white mx-auto md:mx-0">
              <span role="img" aria-label="offline">
                📶
              </span>
            </div>
            <div className="mt-2 mb-6 px-5 py-2 rounded-full text-base font-semibold shadow bg-red-100 text-red-600">
              Offline
            </div>
            <div className="w-full">
              <h3 className="text-indigo-700 font-bold text-lg mb-4 text-center md:text-left">
                What you can do offline:
              </h3>
              <ul className="space-y-3">
                {features.map((feature, idx) => (
                  <li
                    key={idx}
                    className="flex items-center gap-3 bg-white/80 rounded-xl px-4 py-2 shadow-sm border border-indigo-100"
                  >
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-green-100 text-green-600 text-lg shadow">
                      <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                        <path
                          fillRule="evenodd"
                          d="M16.707 6.293a1 1 0 00-1.414 0L9 12.586l-2.293-2.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l7-7a1 1 0 000-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                    <span className="text-gray-700 font-medium">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        {/* Divider for md+ */}
        <div className="hidden md:block w-px bg-gradient-to-b from-indigo-200 to-purple-200 my-8"></div>
        {/* Right: Title, desc, buttons */}
        <div className="flex-1 flex flex-col justify-center items-center md:items-start p-6 md:p-8">
          <h1 className="text-3xl font-extrabold text-gray-800 mb-4 text-center md:text-left drop-shadow">
            You're Offline
          </h1>
          <p className="text-gray-600 mb-8 leading-relaxed text-center md:text-left text-lg">
            It looks like you've lost your internet connection. Don't worry, you can still access
            the home page and some basic features.
          </p>
          <button
            onClick={handleRetry}
            className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-8 py-3 rounded-full font-bold mb-4 w-full md:w-auto flex items-center justify-center gap-2 shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-70"
            disabled={loading}
            style={{ background: "linear-gradient(135deg, #636ae8 0%, #764ba2 100%)" }}
          >
            Retry Connection
            {loading && (
              <span className="ml-2 inline-block animate-spin border-2 border-t-indigo-500 border-indigo-200 rounded-full w-5 h-5"></span>
            )}
          </button>
          {/* Go to Home Page button as anchor */}
          <button
            onClick={() => {
              window.location.href = "/";
            }}
            className="border-2 border-indigo-500 text-indigo-500 px-8 py-3 rounded-full font-bold w-full md:w-auto hover:bg-indigo-500 hover:text-white transition-all duration-300 flex items-center justify-center gap-2 shadow"
          >
            Go to Home Page
          </button>
          <div className="mt-6 text-red-600 font-semibold text-center w-full">{statusMsg}</div>
        </div>
      </div>
    </div>
  );
};

export default OfflinePage;
