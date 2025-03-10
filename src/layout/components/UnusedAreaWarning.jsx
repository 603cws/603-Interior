import React from "react";

function UnusedAreaWarning({ onConfirm, onCancel, unusedArea }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-30">
      <div className="bg-[#1A3A36] text-white py-10 px-20 rounded-lg shadow-sm text-center shadow-white">
        <h2 className="text-lg font-semibold">Unused Space Warning</h2>
        <p className="mt-2">
          There is {unusedArea} sq ft of unused space.
          <br /> Are you sure you want to proceed?
        </p>
        <div className="mt-4 flex justify-center space-x-4">
          <button
            onClick={() => onConfirm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Proceed
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-400 text-white rounded-lg"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default UnusedAreaWarning;
