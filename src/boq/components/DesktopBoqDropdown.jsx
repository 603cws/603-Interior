import toast from "react-hot-toast";
import { RiArrowDropDownLine } from "react-icons/ri";
import { motion, AnimatePresence } from "framer-motion";

const dropdownVariants = {
  hidden: {
    opacity: 0,
    y: -8,
    scale: 0.98,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 22,
      staggerChildren: 0.05, // ⭐ line-by-line
      delayChildren: 0.05,
    },
  },
  exit: {
    opacity: 0,
    y: -6,
    scale: 0.98,
    transition: {
      duration: 0.18,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: -6,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20,
    },
  },
};

function DesktopBoqDropdown({
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
      className="inline-flex items-center border border-black rounded-[4px] bg-white"
      ref={dropdownRef}
    >
      <button
        onClick={() => {
          fetchSavedBOQs();
          setIsOpen((prev) => !prev);
        }}
        className="bg-white px-3 py-2 border-l border-black flex items-center rounded-r-[4px] h-full"
      >
        <RiArrowDropDownLine />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.ul
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute left-0 top-7 min-w-[200px] mt-3 w-auto bg-white rounded-lg shadow-md"
          >
            <motion.li
              variants={itemVariants}
              className="px-4 py-3 grid grid-cols-[2fr_1fr] font-semibold bg-[#374A75] text-center text-white rounded-t-lg shadow-md"
            >
              <span className="text-left">Title</span>
              <span className="text-center">Actions</span>
            </motion.li>
            {boqList.length ? (
              boqList.map((boq) => (
                <motion.li
                  key={boq.id}
                  variants={itemVariants}
                  className="px-4 py-2 grid grid-cols-[2fr_1fr] items-center hover:bg-gray-100"
                >
                  <div
                    className="flex items-center cursor-default max-w-[100px]"
                    title={boq.boqTitle}
                    aria-label={boq.boqTitle}
                  >
                    {boq.boqTitle === BOQTitle && (
                      <span className="w-2 h-2 rounded-full bg-green-500 mr-2 shrink-0" />
                    )}
                    <span className="overflow-hidden whitespace-nowrap text-ellipsis">
                      {boq.boqTitle}
                    </span>
                  </div>
                  <div className="flex justify-left gap-3">
                    <img
                      src="../images/icons/download.png"
                      alt="Download"
                      className="cursor-pointer h-6 w-6"
                      onClick={() => handleLoadBOQ(boq.id)}
                      title="Load BOQ"
                      aria-label="Load BOQ"
                    />
                    <img
                      src="../images/icons/delete.png"
                      alt="Delete"
                      className="cursor-pointer h-6 w-6"
                      title="Delete BOQ"
                      aria-label="Delete BOQ"
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
                </motion.li>
              ))
            ) : (
              <motion.li
                variants={itemVariants}
                className="px-4 py-2 text-gray-500 text-center"
              >
                No BOQs saved
              </motion.li>
            )}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

export default DesktopBoqDropdown;
