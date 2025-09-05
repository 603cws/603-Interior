function Spacebar({ totalArea, builtArea, availableArea, MIN_AREA }) {
  const usedPer = (+builtArea / +totalArea) * 100;
  const roundedUsedPer = Math.round(usedPer);
  const unUsedPer = 100 - roundedUsedPer;
  if (!totalArea || totalArea < MIN_AREA || totalArea > 25000) {
    // Reset state when totalArea is 0 or undefined
    return (
      <div className="flex w-full bg-[#385682] my-2 h-[30px] items-center justify-center text-white">
        <p className="text-xs">Enter Area to track usage</p>
      </div>
    );
  }

  console.log(unUsedPer);

  return (
    <div className="flex w-full rounded-sm bg-[#385682] my-2 h-[30px]">
      {/* Used space */}
      <div
        style={{
          width: `${roundedUsedPer}%`,
          transition: "width 0.5s ease-in-out",
        }}
        className="bg-[#85AED2] text-white relative overflow-hidden"
      >
        <div className="absolute w-2 h-[90%] right-0 top-1/2 transform -translate-y-1/2 translate-x-1/4 bg-gradient-to-br from-[#334A78] to-[#1F2937]  rounded-sm glowing-circle"></div>
        <p className="px-4 text-[10px] flex items-center h-full">
          Used: {builtArea} sq ft
        </p>
      </div>

      {/* Unused space */}
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
          <div className="absolute -top-6 right-0 bg-white text-[#1F2937] text-[10px] px-2 py-1 rounded shadow whitespace-nowrap hidden group-hover:block">
            {availableArea} sq ft
          </div>
        )}
      </div>
    </div>
  );
}

export default Spacebar;
