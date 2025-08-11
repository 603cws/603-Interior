import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { supabase } from "../../services/supabase";
import { useApp } from "../../Context/Context";
import { boqLimit } from "../../constants/constant";

function BoqPrompt({ onConfirm, onCancel, isProfileCard, setIsProfileCard }) {
  const [boqTitle, setBoqTitle] = useState("");
  const [selectedBoq, setSelectedBoq] = useState(""); // Stores selected existing BOQ
  const [existingBoqs, setExistingBoqs] = useState([]); // Stores fetched BOQs

  const { userId, selectedData, setSelectedPlan, setBoqTotal, setProgress } =
    useApp();

  const handleSave = async () => {
    if (!selectedData || selectedData.length === 0) {
      toast.error("No selected data to save.");
      return;
    }

    // Fetch user's existing BOQs
    const { data: existingBOQs, error: fetchError } = await supabase
      .from("boq_data_new")
      .select("id, boqTitle") // Fetch ID and title
      .eq("userId", userId);

    setExistingBoqs(existingBOQs);

    if (fetchError) {
      console.error("Error fetching user BOQs:", fetchError);
      return;
    }

    if (existingBOQs.length >= boqLimit) {
      toast.error(`You can only save up to ${boqLimit} BOQs.`);
      return;
    }

    if (existingBOQs.length > 0) {
      // setShowBoqPrompt(true); // Show the prompt for choosing or naming the BOQ
      setExistingBoqs(existingBOQs); // Store the fetched BOQs for selection
    } else {
      // setShowBoqPrompt(true); // If no existing BOQs, directly show naming prompt
    }
  };
  useEffect(() => {
    handleSave();
  }, []);

  const handleConfirm = () => {
    if (!boqTitle.trim() && !selectedBoq) {
      toast.error("Please enter a name or select an existing BOQ.");
      return;
    }
    if (isProfileCard) {
      setSelectedPlan(null);
      setProgress(0);
      localStorage.removeItem("selectedData");
      setBoqTotal(0);
    }
    if (selectedBoq) {
      onConfirm(selectedBoq, false); // If existing BOQ selected, pass ID
    } else {
      onConfirm(boqTitle, true); // If new BOQ entered, pass name
    }
    setIsProfileCard(false);
  };

  const handleEnter = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleConfirm();
    }
  };

  return (
    <Transition appear show={true} as={Fragment}>
      <Dialog as="div" className="relative z-40" onClose={onCancel}>
        <div className="fixed inset-0 bg-black bg-opacity-50" />

        <div className="fixed inset-0 flex items-center justify-center">
          <div className="shadow-lg max-w-sm md:max-w-xl w-full rounded-lg p-4 bg-gradient-to-br from-[#334A78] to-[#68B2DC]">
            <Dialog.Panel className="bg-[#fff] text-[#000] rounded font-Poppins p-3">
              <Dialog.Title className="text-2xl font-semibold  text-center">
                {isProfileCard && (
                  <p className="text-sm font-normal">
                    You have not saved your details.
                  </p>
                )}
                Save BOQ
              </Dialog.Title>

              {existingBoqs?.length > 0 && (
                <div className="mt-4">
                  <label className="block lg:text-lg font-medium ">
                    Select Existing BOQ
                  </label>
                  <select
                    className="w-full mt-2 p-3 border border-gray-300 rounded text-base focus:outline-none focus:ring-1 focus:ring-[#334A78] text-black"
                    value={selectedBoq}
                    onChange={(e) => setSelectedBoq(e.target.value)}
                  >
                    <option disabled value="">
                      -- Select BOQ --
                    </option>
                    {existingBoqs.map((boq) => (
                      <option key={boq.id} value={boq.id}>
                        {boq.boqTitle}
                      </option>
                    ))}
                  </select>
                </div>
              )}

            {existingBoqs?.length >= boqLimit ? (
              <label className="block lg:text-lg font-medium mt-4">
                Max {boqLimit} BOQ can be Created
              </label>
            ) : (
              <div className="mt-4">
                {existingBoqs?.length > 0 && (
                  <h2 className="lg:text-lg font-medium text-center">OR</h2>
                )}
                <label className="block lg:text-lg font-medium ">
                  Enter a New BOQ Name
                </label>
                <input
                  type="text"
                  placeholder="Enter BOQ Name"
                  value={boqTitle}
                  onKeyDown={handleEnter}
                  onChange={(e) => setBoqTitle(e.target.value)}
                  className="w-full mt-2 p-3 border border-gray-300 rounded text-base focus:outline-none focus:ring-2 focus:ring-[#FFD500] text-black"
                  disabled={!!selectedBoq}
                />
              </div>
            )}

              <div className="mt-6 flex justify-center gap-5 space-x-4">
                <button
                  // onClick={onCancel}
                  onClick={() => {
                    setIsProfileCard(false);
                    onCancel();
                  }}
                  className="px-5 py-2 bg-[#fff] text-base text-[#334A78]  border-2 border-black border-r-4 border-b-4"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  className="px-5 py-2 bg-[#334A78] text-[#fff]  text-base border-2 border-black border-r-4 border-b-4"
                >
                  Confirm
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

export default BoqPrompt;
