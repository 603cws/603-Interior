function ErrorFallback({ error, resetErrorBoundary }) {
  const isDev = import.meta.env.MODE === "development";
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 px-4 ">
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

          {/* Error Message */}
          {isDev && (
            <p className="text-gray-600 text-sm">
              {error?.message || "An unexpected error occurred."}
            </p>
          )}

          {/* Retry Button */}
          <button
            onClick={resetErrorBoundary}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}

export default ErrorFallback;
