import React from "react";

function UnusedAreaWarning({ onConfirm, onCancel, unusedArea }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-30">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <h2 className="text-lg font-semibold">Unused Space Warning</h2>
        <p className="mt-2">
          You have {unusedArea.toFixed(2)} sq ft of unused area. Are you sure
          you want to proceed?
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
