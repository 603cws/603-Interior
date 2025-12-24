import toast from "react-hot-toast";
import { RiArrowDropDownLine } from "react-icons/ri";

function MobileBoqDropdown({
  boqList,
  BOQTitle,
  BOQID,
  isOpen,
  setIsOpen,
  dropdownRef,
  fetchSavedBOQs,
  handleLoadBOQ,
  setDeleteAlert,
  setSelectedboqid,
}) {
  return (
    <div
      className="flex items-center text-center justify-center ml-2"
      ref={dropdownRef}
    >
      <button
        onClick={() => {
          fetchSavedBOQs();
          setIsOpen((prev) => !prev);
        }}
      >
        <RiArrowDropDownLine />
      </button>
      {isOpen && (
        <ul className="absolute left-0 top-0 min-w-[100px] mt-2 w-auto text-xs bg-white rounded-lg shadow-md">
          <li className="px-4 py-3 grid grid-cols-[2fr_1fr] font-semibold bg-[#374A75] text-center text-white rounded-t-lg shadow-md">
            <span className="text-left">Title</span>
            <span className="text-center">Actions</span>
          </li>
          {boqList.length ? (
            boqList.map((boq) => (
              <li
                key={boq.id}
                className="px-4 py-2 grid grid-cols-[2fr_1fr] items-center hover:bg-gray-100"
              >
                <span className="text-left break-words text-[#374A75] whitespace-normal">
                  {boq.boqTitle}
                  {boq.boqTitle === BOQTitle && "*"}
                </span>
                <div className="flex justify-center gap-2">
                  <img
                    src="../images/icons/download.png"
                    alt="Downlaod"
                    className="cursor-pointer h-6 w-6"
                    onClick={() => handleLoadBOQ(boq.id)}
                  />
                  <img
                    src="../images/icons/delete.png"
                    alt="Delete"
                    className="cursor-pointer h-6 w-6"
                    onClick={() => {
                      if (boq.id === BOQID)
                        toast.error("Cannot delete current BOQ!");
                      else {
                        setDeleteAlert(true);
                        setSelectedboqid(boq.id);
                      }
                    }}
                  />
                </div>
              </li>
            ))
          ) : (
            <li className="px-4 py-2 text-gray-500 text-center">
              No BOQs saved
            </li>
          )}
        </ul>
      )}
    </div>
  );
}

export default MobileBoqDropdown;
