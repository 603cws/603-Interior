import React from "react";

function UnusedAreaWarning({ onConfirm, onCancel, unusedArea }) {
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
            className="px-4 py-2 bg-[#FFD500] text-black border-r-4 border-b-4 border-black rounded-md shadow-md hover:bg-yellow-400"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(true)}
            className="px-4 py-2 bg-[#FFD500] text-black border-r-4 border-b-4 border-black rounded-md shadow-md hover:bg-yellow-400"
          >
            Proceed
          </button>
        </div>
      </div>
    </div>
  );
}

export default UnusedAreaWarning;
