import { useEffect, useState } from "react";
import { logError } from "../lib/logError";

function ErrorFallback({ error, resetErrorBoundary }) {
  const isDev = import.meta.env.MODE === "development";
  const [reported, setReported] = useState(false);

  // 🔴 Auto log once when fallback renders
  useEffect(() => {
    logError(error);
  }, [error]);

  const handleReport = async () => {
    await logError(error);
    setReported(true);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white shadow-lg rounded-2xl p-8 text-center border border-[#ccc]">
        <div className="flex flex-col items-center space-y-4">
          {/* Error Icon */}
          <div className="w-16 h-16 flex items-center justify-center bg-red-100 text-red-600 rounded-full text-3xl">
            ⚠️
          </div>

          {/* Heading */}
          <h2 className="text-2xl font-semibold text-gray-800">
            Something went wrong
          </h2>

          {/* Error Message (dev only) */}
          {isDev && (
            <p className="text-gray-600 text-sm break-all">
              {error?.message || "An unexpected error occurred."}
            </p>
          )}

          {/* Buttons */}
          <div className="flex gap-3 mt-4">
            <button
              onClick={resetErrorBoundary}
              className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
            >
              Try Again
            </button>

            <button
              onClick={handleReport}
              disabled={reported}
              className={`px-6 py-2 rounded-xl transition ${
                reported
                  ? "bg-green-500 text-white cursor-default"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {reported ? "Reported ✓" : "Report Issue"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ErrorFallback;
