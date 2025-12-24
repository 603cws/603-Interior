import { MIN_AREA } from "../utils/AreaCalculations";
function Spacebar({ totalArea, builtArea, availableArea }) {
  const usedPer = (+builtArea / +totalArea) * 100;
  const roundedUsedPer = Math.round(usedPer);
  const unUsedPer = 100 - roundedUsedPer;
  if (!totalArea || totalArea < MIN_AREA || totalArea > 25000) {
    return (
      <div className="flex w-full bg-[#385682] my-2 h-[30px] items-center justify-center text-white">
        <p className="text-xs">Enter Area to track usage</p>
      </div>
    );
  }

  return (
    <div className="flex w-full rounded-sm bg-[#385682] my-2 h-[30px]">
      <div
        style={{
          width: `${roundedUsedPer}%`,
          transition: "width 0.5s ease-in-out",
        }}
        className="bg-[#85AED2] text-white relative overflow-hidden"
      >
        <div className="absolute w-2 h-full right-0 top-0 transform translate-x-1/4 bg-gradient-to-br from-[#334A78] to-[#1F2937]  rounded-sm glowing-circle"></div>
        <p className="px-4 text-[10px] flex items-center h-full">
          Used: {builtArea} sq ft
        </p>
      </div>

      <div
        style={{
          width: `${unUsedPer}%`,
          transition: "width 0.5s ease-in-out",
        }}
        className="bg-[#385682] relative group"
      >
        {unUsedPer > 10 && (
          <p className="text-[10px] flex items-center flex-1 justify-center h-full text-[#fff]">
            {availableArea} sq ft
          </p>
        )}

        {unUsedPer <= 10 && (
          <p className="absolute -top-6 right-0 bg-white text-[#1F2937] text-[10px] px-2 py-1 rounded shadow whitespace-nowrap hidden group-hover:block">
            {availableArea} sq ft
          </p>
        )}
      </div>
    </div>
  );
}

export default Spacebar;
