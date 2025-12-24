function UnusedAreaWarning({ onConfirm, onCancel, unusedArea, isSubmitting }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-30">
      <div className="max-w-sm mx-2 md:max-w-lg w-full bg-gradient-to-br from-[#334A78] to-[#68B2DC] p-4 rounded-2xl">
        <div className="bg-white rounded-lg text-center py-10">
          <h2 className="text-lg font-semibold">Alert: Unused Space Found</h2>
          <p className="mt-5 text-sm md:text-base">
            There is {unusedArea} sq ft of unused space.
            <br className="hidden md:block" /> Are you sure you want to proceed?
          </p>
          <div className="mt-7 flex justify-around space-x-4">
            <button
              onClick={onCancel}
              className="w-28 px-2 py-2 text-[#000] hover:text-[#fff] border-2 border-[#000] hover:border-[#fff] hover:bg-gradient-to-r from-[#334A78] to-[#68B2DC] transition-all duration-500 ease-in-out"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="w-28 px-2 py-2 text-[#fff] hover:text-[#fff] border-2 border-[#000] hover:border-[#fff] bg-[#334A78] hover:bg-gradient-to-r from-[#334A78] to-[#68B2DC] transition-all duration-500 ease-in-out"
            >
              {isSubmitting ? (
                <div className="relative inline-block w-5 h-5">
                  <div className="absolute inset-0 rounded-full border-2 border-black animate-ping"></div>
                  <div className="absolute inset-0 rounded-full border-2 border-black animate-ping delay-1000"></div>
                </div>
              ) : (
                "Proceed"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UnusedAreaWarning;
