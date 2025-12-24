import { FaCheckCircle } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

const AlertBox = ({ onClose, boqid, onconfirm, removeboqid }) => {
  return (
    <div className="inset-0 max-w-md lg:max-w-lg lg:w-full mx-auto bg-[#f5f7ff] border-l-8 border-[#AC2734] rounded-md shadow-lg p-6 relative">
      <button
        className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        onClick={() => {
          onClose(false);
          removeboqid(null);
        }}
      >
        <IoClose size={18} />
      </button>

      <div className="flex items-start gap-2">
        <FaCheckCircle className="text-[#AC2734] mt-1" size={18} />
        <div>
          <h2 className="text-[#AC2734] font-semibold text-lg">
            Workved Alert
          </h2>
          <p className="text-sm text-[#2B2B2B] mt-1">
            {boqid
              ? "Are you sure you want to delete this BOQ?"
              : "Are you sure you want to Reset?"}
          </p>
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-3">
        {onconfirm && (
          <button
            onClick={() => {
              if (boqid) {
                onconfirm(boqid);
              } else {
                onconfirm();
              }
            }}
            className="px-4 py-1.5 bg-[#AC2734] border border-[#3A1F1A] text-white rounded-full shadow hover:bg-[#922424] text-sm"
          >
            OK
          </button>
        )}

        <button
          onClick={() => {
            if (boqid) {
              onClose(false);
              removeboqid(null);
            } else {
              onClose(false);
            }
          }}
          className="px-4 py-1.5 bg-[#AC2734]/20 border border-[#ac2734]/20 text-[#2B2B2B] rounded-full shadow hover:bg-[#f2caca] text-sm"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default AlertBox;
