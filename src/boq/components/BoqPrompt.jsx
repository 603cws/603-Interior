import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { toast } from "react-toastify";

function BoqPrompt({ existingBoqs, onConfirm, onCancel }) {
  const [boqTitle, setBoqTitle] = useState("");
  const [selectedBoq, setSelectedBoq] = useState(""); // Stores selected existing BOQ

  const handleConfirm = () => {
    if (!boqTitle.trim() && !selectedBoq) {
      toast.error("Please enter a name or select an existing BOQ.");
      return;
    }

    if (selectedBoq) {
      onConfirm(selectedBoq, false); // If existing BOQ selected, pass ID
    } else {
      onConfirm(boqTitle, true); // If new BOQ entered, pass name
    }
  };

  return (
    <Transition appear show={true} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onCancel}>
        <div className="fixed inset-0 bg-black bg-opacity-50" />

        <div className="fixed inset-0 flex items-center justify-center">
          <Dialog.Panel className="bg-white p-8 rounded-lg shadow-lg w-[400px] sm:w-[500px]">
            <Dialog.Title className="text-2xl font-semibold text-gray-800 text-center">
              Save BOQ
            </Dialog.Title>

            {existingBoqs.length > 0 && (
              <div className="mt-4">
                <label className="block text-lg font-medium text-gray-700">
                  Select Existing BOQ
                </label>
                <select
                  className="w-full mt-2 p-3 border border-gray-300 rounded text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={selectedBoq}
                  onChange={(e) => setSelectedBoq(e.target.value)}
                >
                  <option value="">-- Select BOQ --</option>
                  {existingBoqs.map((boq) => (
                    <option key={boq.id} value={boq.id}>
                      {boq.title}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="mt-4">
              <label className="block text-lg font-medium text-gray-700">
                Or Enter a New BOQ Name
              </label>
              <input
                type="text"
                placeholder="Enter BOQ Name"
                value={boqTitle}
                onChange={(e) => setBoqTitle(e.target.value)}
                className="w-full mt-2 p-3 border border-gray-300 rounded text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={!!selectedBoq}
              />
            </div>

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
