function Spacebar({ totalArea, builtArea, availableArea }) {
  const usedPer = (builtArea / totalArea) * 100;
  const roundedUsedPer = Math.round(usedPer);
  const unUsedPer = 100 - roundedUsedPer;
  if (!totalArea || totalArea === 0) {
    // Reset state when totalArea is 0 or undefined
    return (
      <div className="flex w-full border-2 bg-[#385682] my-3 h-7 items-center justify-center text-white">
        <p className="text-xs">Enter Area to track usage</p>
      </div>
    );
  }

  return (
    <div className="flex w-full border-2 overflow-hidden bg-[#385682] my-3 h-7">
      {/* Used space */}
      <div
        style={{
          width: `${roundedUsedPer}%`,
          transition: "width 0.5s ease-in-out", // Added transition
        }}
        className="bg-[#54DED3] text-white border-1 rounded-r-xl "
      >
        <p className="px-4 text-xs flex items-center h-full">
          Used: {builtArea} sq ft
        </p>
      </div>
      {/* Unused space */}
      <div
        style={{
          width: `${unUsedPer}%`,
          transition: "width 0.5s ease-in-out", // Added transition
        }}
        className="bg-[#385682] text-white"
      >
        <p className="text-xs text-center flex items-center h-full">
          {availableArea} sq ft
        </p>
      </div>
    </div>
  );
}

export default Spacebar;
