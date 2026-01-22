import { MdOutlineCancel } from "react-icons/md";
import { CiMenuFries } from "react-icons/ci";
import ProgressBarMobile from "./ProgressBarMobile";
import MobileBoqDropdown from "./MobileBoqDropdown";

function MobileActions({
  progress,
  mobileDropDown,
  setMobileDropDown,
  setIslayoutWarning,
  setShowLayoutDetails,
  dropdownProps,
  handleDownload,
}) {
  return (
    <div className="bg-[#212B36] py-1 flex justify-between items-center px-3 md:px-6 relative">
      <ProgressBarMobile progress={progress} />
      <button onClick={() => setMobileDropDown((s) => !s)}>
        {mobileDropDown ? (
          <MdOutlineCancel color="white" size={25} />
        ) : (
          <CiMenuFries color="white" size={26} />
        )}
      </button>
      {mobileDropDown && (
        <div className="absolute z-20 translate-y-[60%] right-0 transform transition-all duration-700 ease-in-out opacity-100 scale-100">
          <ul className="bg-white text-[#374A75] rounded-md m-3 py-6 px-4 text-center border">
            <li
              onClick={() => setIslayoutWarning((prev) => !prev)}
              className="hover:px-2 hover:bg-[#334A78] hover:text-white mb-0 py-2 px-2 cursor-pointer border border-[#CCCCCC]"
            >
              Go To Layout
            </li>
            <li
              onClick={() => {
                setShowLayoutDetails(true);
                setMobileDropDown(false);
              }}
              className="hover:px-2 hover:bg-white hover:text-[#1A3A36] mb-0 py-2 px-2 cursor-pointer border border-[#CCCCCC]"
            >
              Layout Details
            </li>
            <li
              onClick={() => {
                handleDownload();
                setMobileDropDown(false);
              }}
              className="hover:px-2 hover:bg-white font-Poppins hover:text-[#1A3A36] mb-0 py-2 px-2 cursor-pointer border border-[#CCCCCC]"
            >
              Download
            </li>
            <li className="hover:bg-white hover:text-[#1A3A36] mb-0 py-2 px-2 border border-[#CCCCCC] relative">
              <button onClick={dropdownProps.onSaveClick}>Save BOQ</button>
              <MobileBoqDropdown {...dropdownProps} />
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default MobileActions;
