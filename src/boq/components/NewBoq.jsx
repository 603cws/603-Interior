import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";
import { supabase } from "../../services/supabase";
import { boqLimit } from "../../constants/constant";
import { useBoqApp } from "../../Context/BoqContext";
import { handleError } from "../../common-components/handleError";

function NewBoq({ onConfirm }) {
  const [boqMode, setBoqMode] = useState("new");
  const [boqList, setBoqList] = useState([]);
  const [selectedBoq, setSelectedBoq] = useState("");
  const [draftBoq, setDraftBoq] = useState(null);
  const [disabledNewBoq, setDisabledNewBoq] = useState(false);
  const [isAtNonDraftLimit, setIsAtNonDraftLimit] = useState(false);
  const hasCreatedFirstDraft = useRef(false);
  const { userId } = useBoqApp();

  useEffect(() => {
    const fetchSavedBOQs = async () => {
      try {
        const { data, error } = await supabase
          .from("boq_data_new")
          .select("id, created_at, boqTitle, isDraft,layoutId(*)")
          .eq("userId", userId)
          .order("created_at", { ascending: false });
        if (error) {
          handleError(error, {
            prodMessage: "Error fetching BOQs.",
          });
          return;
        }
        setBoqList(data || []);
        const existingDraft = (data || []).find((b) => b.isDraft === true);
        setDraftBoq(existingDraft || null);
        if (
          !hasCreatedFirstDraft.current &&
          !existingDraft &&
          (data || []).length === 0
        ) {
          hasCreatedFirstDraft.current = true;
          toast.success("Welcome! Starting your first Draft BOQ.");
          onConfirm("Draft BOQ", "new");
          return;
        }
        const totalNonDraftBoqs = (data || []).filter((b) => !b.isDraft).length;
        setDisabledNewBoq(false);
        setIsAtNonDraftLimit(totalNonDraftBoqs >= boqLimit);
      } catch (err) {
        handleError(err, {
          prodMessage: "Unexpected error while fetching BOQs.",
        });
      }
    };

    if (userId) fetchSavedBOQs();
  }, [userId, onConfirm]);

  const handleConfirm = async (mode, newBoqAction) => {
    setBoqMode(mode);
    if (boqMode === "new") {
      if (draftBoq) {
        if (newBoqAction === "continue") {
          onConfirm(draftBoq.id, "existing");
        } else if (newBoqAction === "discard") {
          await handleCreateNewAndDiscard();
        }
      } else {
        onConfirm("Draft BOQ", "new");
      }
    } else if (boqMode === "existing") {
      if (!selectedBoq) {
        toast.error("Please select a BOQ");
        return;
      } else {
        onConfirm(selectedBoq, "existing");
      }
    }
  };

  const handleCreateNewAndDiscard = async () => {
    if (!userId) {
      toast.error("User not found. Please login.");
      return;
    }
    try {
      const { data: deletedRows, error: deleteError } = await supabase
        .from("boq_data_new")
        .delete()
        .match({ userId, isDraft: true })
        .select();
      if (deleteError) {
        handleError(deleteError, {
          prodMessage: "Unexpected error while fetching BOQs.",
        });
        return;
      }
      if (!deletedRows || deletedRows.length === 0) {
        toast.info("No draft rows found to delete (nothing matched).");
      }
      // else {
      //   toast.success(`Deleted ${deletedRows.length} draft(s).`);
      // }
      onConfirm("Draft BOQ", "new");
    } catch (err) {
      handleError(err, {
        prodMessage: "Unexpected error while discarding drafts.",
      });
    }
  };

  return (
    <Transition appear show={true} as={Fragment}>
      <Dialog as="div" className="relative z-40" onClose={() => {}}>
        <div className="fixed inset-0 flex items-center justify-center bg-[#000]/30">
          <div className="shadow-lg max-w-sm md:max-w-xl w-full rounded-lg p-4 bg-gradient-to-br from-[#334A78] to-[#68B2DC] ">
            <Dialog.Panel className="bg-[#fff] text-[#000] rounded font-Poppins p-3 min-h-[300px]">
              <Dialog.Title className="text-2xl font-semibold text-center text-[#374A75]">
                New or Load BOQ
              </Dialog.Title>

              <div className="mt-4 space-y-4">
                <div className="flex justify-center gap-6">
                  <button
                    type="button"
                    onClick={() => {
                      if (!disabledNewBoq) setBoqMode("new");
                    }}
                    disabled={disabledNewBoq}
                    className={`px-4 py-2 rounded text-sm transition duration-300 border w-36
                    ${
                      boqMode === "new"
                        ? "bg-[#EBEBEB] text-[#374A75] border-[#374A75]"
                        : "bg-white text-[#000] border-[#000] hover:bg-gray-200"
                    }
                    ${
                      disabledNewBoq
                        ? "opacity-50 cursor-not-allowed"
                        : "cursor-pointer"
                    }
                  `}
                  >
                    New BOQ
                  </button>

                  {boqList?.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setBoqMode("existing")}
                      className={`px-4 py-2 rounded text-sm transition duration-300 border w-36
                      ${
                        boqMode === "existing"
                          ? "bg-[#EBEBEB] text-[#374A75] border-[#374A75]"
                          : "bg-white text-[#000] border-[#000] hover:bg-gray-200"
                      }
                      cursor-pointer
                    `}
                    >
                      Load Existing
                    </button>
                  )}
                </div>

                {boqMode === "new" && (
                  <div className="text-sm bg-[#f9f9f9] p-3 rounded border border-[#334A78]">
                    {draftBoq ? (
                      <div className="space-y-3">
                        <p>
                          You have an existing <strong>Draft BOQ</strong> [
                          {draftBoq?.layoutId?.totalArea} sqft] saved on{" "}
                          {new Date(draftBoq.created_at).toLocaleString()}.
                        </p>
                        <p className="text-xs">
                          Tip: you can save/update or delete the draft later.
                        </p>
                      </div>
                    ) : (
                      <div>
                        <div>
                          A new BOQ will be created and saved as{" "}
                          <strong>&quot;Draft BOQ&quot;</strong>. You can update
                          it later.
                        </div>
                        {isAtNonDraftLimit && (
                          <div className="mt-2 text-xs text-[#a1a1a1]">
                            Note: you&apos;ve reached the maximum of {boqLimit}{" "}
                            saved BOQs. You can still create a Draft BOQ, but
                            converting (saving) it as a named/saved BOQ may
                            require deleting or overriding an existing BOQ.
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

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
                {boqMode === "new" ? (
                  <div className="flex justify-between w-full text-sm">
                    <ContinueBtn
                      title="continue draft"
                      onClick={() => handleConfirm("new", "continue")}
                    />
                    <ContinueBtn
                      title="create new draft"
                      onClick={() => handleConfirm("new", "discard")}
                    />
                  </div>
                ) : (
                  <ContinueBtn
                    title="Continue"
                    onClick={() => {
                      handleConfirm("existing", "continue");
                    }}
                  />
                )}
              </div>
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

export default NewBoq;

function ContinueBtn({ title, onClick }) {
  return (
    <button
      onClick={onClick}
      className="capitalize px-6 py-2 border bg-[#334A78] hover:bg-gradient-to-r hover:from-[#334A78] hover:to-[#68B2DC] text-[#fff] text-sm"
    >
      {title}
    </button>
  );
}
