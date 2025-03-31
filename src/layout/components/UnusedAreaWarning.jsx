import React, { useState } from "react";

function UnusedAreaWarning({ onConfirm, onCancel, unusedArea, isSubmitting }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-30">
      <div className="bg-white bg-opacity-20 backdrop-blur-lg text-white py-10 px-20 rounded-[40px] shadow-lg text-center border border-white/20">
        <h2 className="text-lg font-semibold">Alert: Unused Space Found</h2>
        <p className="mt-5">
          There is {unusedArea} sq ft of unused space.
          <br /> Are you sure you want to proceed?
        </p>
        <div className="mt-7 flex justify-between space-x-4">
          <button
            onClick={onCancel}
            className=" w-28 px-2 py-2 bg-[#FFD500] text-black border-r-4 border-b-4 border-black rounded-md shadow-md hover:bg-yellow-400"
          >
            Cancel
          </button>
          <button
            // onClick={handleProceed}
            onClick={onConfirm}
            className="w-28 px-2 py-2 bg-[#FFD500] text-black border-r-4 border-b-4 border-black rounded-md shadow-md hover:bg-yellow-400"
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
  );
}

export default UnusedAreaWarning;
