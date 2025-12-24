import { AnimatedButton } from "../../common-components/AnimatedButton";
import DesktopBoqDropdown from "./DesktopBoqDropdown";
import ProgressBarDesktop from "./ProgressBarDesktop";

function DesktopActions({
  progress,
  setIslayoutWarning,
  setShowLayoutDetails,
  dropdownProps,
  handleDownload,
  isDownloading,
}) {
  return (
    <div className="bg-[#212B36] py-2.5 flex px-3 md:px-6 3xl:px-40">
      <div className="flex items-center gap-1">
        <button
          className="bg-[#FFF] text-xs py-2 px-5 text-[#000] font-semibold rounded-[4px] border-solid border-[1px] border-black"
          onClick={() => setIslayoutWarning((prev) => !prev)}
        >
          Go to Layout
        </button>
        <button
          onClick={() => setShowLayoutDetails(true)}
          className="bg-[#FFF] text-xs py-2 px-5 text-[#000] font-semibold rounded-[4px] border-solid border-[1px] border-black capitalize"
        >
          layout details
        </button>
      </div>
      <ProgressBarDesktop progress={progress} />
      <div className="flex items-center relative">
        <button
          onClick={dropdownProps.onSaveClick}
          className="bg-white text-xs py-2 px-3 text-black rounded-l-[4px] font-semibold border border-black border-r-0"
        >
          Save BOQ
        </button>
        <DesktopBoqDropdown {...dropdownProps} />
      </div>
      <div className="flex items-center downloadB pl-2">
        <AnimatedButton
          onClick={handleDownload}
          className="!bg-[#3A5D7B] text-white capitalize font-Georgia font-semibold tracking-wider !px-6 !py-4 transition-shadow"
          variant="default"
          size="sm"
          textEffect="shimmer"
          rounded="custom"
          asChild={false}
          hideAnimations={false}
          shimmerColor="#fff"
          shimmerSize="0.15em"
          shimmerDuration="3s"
          borderRadius="10px"
          background="rgba(48, 71, 120, 1)"
          hovereBackground="linear-gradient(90deg,rgba(85,132,182,1) 0%,  rgba(117,162,190,1) 100%)"
        >
          {isDownloading ? "Downloading..." : "Download"}
        </AnimatedButton>
      </div>
    </div>
  );
}

export default DesktopActions;
