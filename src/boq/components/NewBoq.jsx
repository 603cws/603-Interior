import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import { supabase } from "../../services/supabase";
import { useApp } from "../../Context/Context";
import { boqLimit } from "../../constants/constant";

function NewBoq({ onConfirm, onCancel }) {
  // const [boqTitle, setBoqTitle] = useState("");
  const [boqMode, setBoqMode] = useState("new"); // 'new' or 'existing'
  const [boqList, setBoqList] = useState([]);
  const [selectedBoq, setSelectedBoq] = useState(""); // Stores selected existing BOQ id
  const [draftBoq, setDraftBoq] = useState(null); // Stores detected draft row (if any)
  const [disabledNewBoq, setDisabledNewBoq] = useState(false);
  const [newBoqAction, setNewBoqAction] = useState("continue"); // 'continue' or 'discard'
  const [isAtNonDraftLimit, setIsAtNonDraftLimit] = useState(false);

  const hasCreatedFirstDraft = useRef(false);

  const { userId } = useApp();

  useEffect(() => {
    const fetchSavedBOQs = async () => {
      try {
        const { data, error } = await supabase
          .from("boq_data_new")
          .select("id, created_at, boqTitle, isDraft,layoutId(*)")
          .eq("userId", userId)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching BOQs:", error);
          toast.error("Error fetching saved BOQs");
          return;
        }

        setBoqList(data || []);
        const existingDraft = (data || []).find((b) => b.isDraft === true);
        setDraftBoq(existingDraft || null);

        // If completely new user (no BOQs at all), skip UI and create draft immediately
        if (
          !hasCreatedFirstDraft.current &&
          !existingDraft &&
          (data || []).length === 0
        ) {
          hasCreatedFirstDraft.current = true; // prevent double run
          toast.success("Welcome! Starting your first Draft BOQ.");
          onConfirm("Draft BOQ", "new");
          return; // stop here so UI doesn't show
        }

        // Disable "New BOQ" if limit reached and no draft exists
        // const totalBoqs = data?.length || 0;
        // if (totalBoqs >= boqLimit && !existingDraft) {
        //   setDisabledNewBoq(true);
        //   setBoqMode("existing"); // Force switch to existing mode
        // } else {
        //   setDisabledNewBoq(false);
        // }

        // Count only non-draft BOQs for the limit
        const totalNonDraftBoqs = (data || []).filter((b) => !b.isDraft).length;

        // Always allow creating a draft BOQ (New BOQ) — drafts must NOT be counted toward limit.
        // So never disable New BOQ here. We'll still keep a flag so UI can show a message if needed.
        setDisabledNewBoq(false);

        // Optional flag to show informational message in UI when saved-BOQ limit is reached.
        // (You can use this to show a small note: "You can still create a draft, but saving it as a named BOQ may be blocked until you delete/override an existing one.")
        setIsAtNonDraftLimit(totalNonDraftBoqs >= boqLimit);
      } catch (err) {
        console.error("Error fetching BOQs:", err);
        toast.error("Unexpected error while fetching BOQs");
      }
    };

    if (userId) fetchSavedBOQs();
  }, [userId]);

  const handleConfirm = async () => {
    if (boqMode === "new") {
      if (draftBoq) {
        if (newBoqAction === "continue") {
          // Continue existing draft
          onConfirm(draftBoq.id, "existing");
        } else if (newBoqAction === "discard") {
          await handleCreateNewAndDiscard(); // already deletes then calls onConfirm
        }
      } else {
        // No draft exists — simply create new
        onConfirm("Draft BOQ", "new");
      }
    } else if (boqMode === "existing") {
      if (!selectedBoq) return alert("Please select a BOQ.");
      onConfirm(selectedBoq, "existing");
    }
  };

  // Deletes existing draft row then signals parent to create a new draft
  const handleCreateNewAndDiscard = async () => {
    if (!userId) {
      toast.error("User not found. Please login.");
      return;
    }

    // const ok = window.confirm(
    //   "This will DELETE ALL existing Draft BOQs for your account and create a new one. Do you want to continue?"
    // );
    // if (!ok) return;

    try {
      // Delete all drafts for the current user
      const { data: deletedRows, error: deleteError } = await supabase
        .from("boq_data_new")
        .delete()
        .match({ userId, isDraft: true }) // match is clearer for multiple fields
        .select(); // IMPORTANT: return deleted rows so we can inspect

      if (deleteError) {
        console.error("Delete error:", deleteError);
        toast.error(
          "Failed to delete previous drafts: " + (deleteError.message || "")
        );
        return;
      }

      console.log("Deleted rows:", deletedRows);
      if (!deletedRows || deletedRows.length === 0) {
        toast.info("No draft rows found to delete (nothing matched).");
      } else {
        toast.success(`Deleted ${deletedRows.length} draft(s).`);
      }
      onConfirm("Draft BOQ", "new");
    } catch (err) {
      console.error("Unexpected error while discarding drafts:", err);
      toast.error("Unexpected error. Check console.");
    }
  };

  return (
    <Transition appear show={true} as={Fragment}>
      <Dialog as="div" className="relative z-40" onClose={() => {}}>
        {/* <div className="fixed inset-0 bg-black bg-opacity-50" /> */}

        <div className="fixed inset-0 flex items-center justify-center bg-[#000]/30">
          <div className="shadow-lg max-w-sm md:max-w-xl w-full rounded-lg p-4 bg-gradient-to-br from-[#334A78] to-[#68B2DC]">
            <Dialog.Panel className="bg-[#fff] text-[#000] rounded font-Poppins p-3">
              <Dialog.Title className="text-2xl font-semibold text-center">
                New or Load BOQ
              </Dialog.Title>

              <div className="mt-4 space-y-4">
                {/* Mode Selection */}
                <div className="flex justify-center gap-6">
                  <label
                    className={`flex items-center gap-2 cursor-pointer ${
                      disabledNewBoq ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    <input
                      type="radio"
                      value="new"
                      checked={boqMode === "new"}
                      disabled={disabledNewBoq}
                      onChange={() => {
                        if (!disabledNewBoq) setBoqMode("new");
                      }}
                    />
                    <span>New BOQ</span>
                  </label>

                  {boqList?.length > 0 && (
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        value="existing"
                        checked={boqMode === "existing"}
                        onChange={() => setBoqMode("existing")}
                      />
                      <span>Load Existing</span>
                    </label>
                  )}
                </div>

                {/* New BOQ Input / Draft options */}
                {boqMode === "new" && (
                  <div className="text-sm bg-[#f9f9f9] p-3 rounded border border-[#334A78]">
                    {draftBoq ? (
                      <div className="space-y-2">
                        <div>
                          You have an existing <strong>Draft BOQ</strong> saved
                          on {new Date(draftBoq.created_at).toLocaleString()}.
                        </div>

                        <div className="flex flex-col gap-2 text-black">
                          <label className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="newBoqAction"
                              value="continue"
                              checked={newBoqAction === "continue"}
                              onChange={() => setNewBoqAction("continue")}
                            />
                            <span>
                              Continue Draft [{draftBoq?.layoutId?.totalArea}{" "}
                              sqft]
                            </span>
                          </label>

                          <label className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="newBoqAction"
                              value="discard"
                              checked={newBoqAction === "discard"}
                              onChange={() => setNewBoqAction("discard")}
                            />
                            <span>Create New Draft (Discard previous)</span>
                          </label>
                        </div>

                        <div className="text-xs">
                          Tip: you can save/update or delete the draft later.
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div>
                          A new BOQ will be created and saved as{" "}
                          <strong>"Draft BOQ"</strong>. You can update it later.
                        </div>
                        {isAtNonDraftLimit && (
                          <div className="mt-2 text-xs text-[#a1a1a1]">
                            Note: you've reached the maximum of {boqLimit} saved
                            BOQs. You can still create a Draft BOQ, but
                            converting (saving) it as a named/saved BOQ may
                            require deleting or overriding an existing BOQ.
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Existing BOQ Selector */}
                {boqMode === "existing" && boqList?.length > 0 && (
                  <div>
                    <label className="block lg:text-lg font-medium">
                      Select BOQ
                    </label>
                    <select
                      value={selectedBoq}
                      onChange={(e) => setSelectedBoq(e.target.value)}
                      className="w-full mt-2 p-3 border border-gray-300 rounded text-base focus:outline-none focus:ring-2 focus:ring-[#334A78] text-black"
                    >
                      <option disabled value="">
                        -- Select BOQ --
                      </option>
                      {boqList.map((boq) => (
                        <option key={boq.id} value={boq.id}>
                          {boq.boqTitle} [{boq?.layoutId?.totalArea} sqft] -
                          {new Date(boq.created_at).toLocaleDateString()}
                          {boq.isDraft ? " (Draft)" : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-center gap-3">
                <button
                  onClick={handleConfirm}
                  disabled={
                    (boqMode === "existing" && !selectedBoq) ||
                    (boqMode === "new" && draftBoq && !newBoqAction)
                  }
                  className={`px-5 py-2 text-base border-2 border-black border-r-4 border-b-4 ${
                    (boqMode === "existing" && !selectedBoq) ||
                    (boqMode === "new" && draftBoq && !newBoqAction)
                      ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                      : "bg-[#334A78] text-[#fff]"
                  }`}
                >
                  Continue
                </button>

                {/* <button
                onClick={() => {
                  if (onCancel) onCancel();
                }}
                className="px-5 py-2 text-base border-2 border-black border-r-4 border-b-4 bg-transparent text-white"
              >
                Cancel
              </button> */}
              </div>
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

export default NewBoq;
