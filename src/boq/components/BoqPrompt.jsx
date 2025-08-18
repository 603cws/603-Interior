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
  const [isDraftBoq, setIsDraftBoq] = useState(false);

  const {
    userId,
    selectedData,
    setSelectedPlan,
    setBoqTotal,
    setProgress,
    BOQID,
    BOQTitle,
    setBOQTitle,
    setBOQID,
  } = useApp();

  const handleLoad = async () => {
    if (!selectedData || selectedData.length === 0) {
      toast.error("No selected data to save.");
      return;
    }

    // Fetch ALL BOQs (including drafts)
    const { data: allBOQs, error: fetchError } = await supabase
      .from("boq_data_new")
      .select("id, boqTitle, isDraft")
      .eq("userId", userId);

    if (fetchError) {
      console.error("Error fetching user BOQs:", fetchError);
      return;
    }

    // Detect if current BOQ is a draft
    const current = allBOQs.find(
      (b) => b.id === BOQID && b.boqTitle === BOQTitle
    );
    if (current) {
      setIsDraftBoq(current.isDraft);
    }

    // Filter only non-draft BOQs for limit & selection list
    const nonDraftBOQs = allBOQs.filter((b) => !b.isDraft);
    setExistingBoqs(nonDraftBOQs);

    if (nonDraftBOQs.length >= boqLimit) {
      toast.error(
        `You can only save up to ${boqLimit} BOQs (Drafts excluded).`
      );
    }
  };

  useEffect(() => {
    handleLoad();
  }, []);

  const handleConfirm = async () => {
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

    try {
      // Rename draft
      if (isDraftBoq && boqTitle.trim() && !selectedBoq) {
        const newName = boqTitle.trim();

        const { error } = await supabase
          .from("boq_data_new")
          .update({ boqTitle: newName, isDraft: false })
          .eq("id", BOQID);
        if (error) throw error;

        setBOQTitle(newName);
        toast.success(`Draft BOQ saved as "${newName}"`);
        onConfirm(BOQID, false);
      }

      // Override existing
      else if (isDraftBoq && selectedBoq) {
        const { data: draftData, error: draftError } = await supabase
          .from("boq_data_new")
          .select("products, boqTotal, selectedPlan, userResponses")
          .eq("id", BOQID)
          .single();
        if (draftError) throw draftError;

        const existing = existingBoqs.find((b) => b.id === selectedBoq);

        const { error: updateError } = await supabase
          .from("boq_data_new")
          .update({
            products: draftData.products,
            boqTotal: draftData.boqTotal,
            selectedPlan: draftData.selectedPlan,
            userResponses: draftData.userResponses,
          })
          .eq("id", selectedBoq);
        if (updateError) throw updateError;

        toast.success(`Draft BOQ overridden into "${existing?.boqTitle}"`);

        await supabase
          .from("boq_data_new")
          .update({
            products: [],
            boqTotal: 0,
            selectedPlan: null,
            userResponses: [],
          })
          .eq("id", BOQID);

        if (existing) {
          setBOQID(existing.id);
          setBOQTitle(existing.boqTitle);
        }

        onConfirm(selectedBoq, false);
      }

      // Non-draft save
      else {
        if (selectedBoq) {
          const existing = existingBoqs.find((b) => b.id === selectedBoq);
          if (existing) {
            setBOQID(existing.id);
            setBOQTitle(existing.boqTitle);
            toast.success(`BOQ saved as "${existing.boqTitle}"`);
          }
          onConfirm(selectedBoq, false);
        } else {
          const newName = boqTitle.trim();
          setBOQTitle(newName);
          const newId = await onConfirm(newName, true);
          if (newId) {
            setBOQID(newId);
            toast.success(`BOQ saved as "${newName}"`);
          }
        }
      }
    } catch (err) {
      console.error("Error saving BOQ:", err);
      toast.error("Something went wrong while saving the BOQ.");
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
                {isDraftBoq ? "Save/Override Draft BOQ" : "Save/Override BOQ"}
              </Dialog.Title>

              {existingBoqs?.length > 0 && (
                <div className="mt-4">
                  <label className="block lg:text-lg font-medium ">
                    Override Existing BOQ
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
                  Max {boqLimit} BOQ can be created (Drafts excluded)
                </label>
              ) : (
                <div className="mt-4">
                  {existingBoqs?.length > 0 && (
                    <h2 className="lg:text-lg font-medium text-center">OR</h2>
                  )}
                  <label className="block lg:text-lg font-medium ">
                    {isDraftBoq ? "Save Draft BOQ" : "Save a New BOQ"}
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
