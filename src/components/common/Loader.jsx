// Loader.jsx
import React from "react";

const Loader = ({ message = "Loading..." }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
      <div className="flex flex-col items-center">
        {/* Spinner */}
        <div className="w-16 h-16 border-4 border-t-green-500 border-gray-700 rounded-full animate-spin"></div>

        {/* Optional message */}
        {message && (
          <p className="mt-4 text-green-400 text-lg font-medium text-center">
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default Loader;
