import { useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { toast } from "react-toastify";

function BoqPrompt({ onConfirm, onCancel }) {
  const [boqTitle, setBoqTitle] = useState("");

  const handleConfirm = () => {
    if (!boqTitle.trim()) {
      toast.error("BOQ name cannot be empty.");
      return;
    }
    onConfirm(boqTitle);
  };

  return (
    <Transition appear show={true} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onCancel}>
        {/* Background Overlay */}
        <div className="fixed inset-0 bg-black bg-opacity-50" />

        {/* Centered Modal Box */}
        <div className="fixed inset-0 flex items-center justify-center">
          <Dialog.Panel className="bg-white p-8 rounded-lg shadow-lg w-[400px] sm:w-[500px]">
            {/* Title */}
            <Dialog.Title className="text-2xl font-semibold text-gray-800 text-center">
              Enter a name for your BOQ
            </Dialog.Title>

            {/* Input Field */}
            <input
              type="text"
              placeholder="Enter BOQ Name"
              value={boqTitle}
              onChange={(e) => setBoqTitle(e.target.value)}
              className="w-full mt-4 p-3 border border-gray-300 rounded text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Buttons */}
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={onCancel}
                className="px-5 py-2 bg-gray-300 text-gray-700 rounded-lg text-lg hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="px-5 py-2 bg-blue-500 text-white rounded-lg text-lg hover:bg-blue-600"
              >
                Confirm
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </Transition>
  );
}

export default BoqPrompt;
