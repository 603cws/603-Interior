function Spacebar({ totalArea, builtArea, availableArea }) {
    const availablePer = (builtArea / totalArea) * 100;
    const roundedAvailablePer = Math.round(availablePer);
    const unusedPer = 100 - roundedAvailablePer;

    return (
        <div className="flex w-full border-2 overflow-hidden bg-[#385682] my-3 h-7">
            {/* used space */}
            <div
                style={{ width: `${roundedAvailablePer}%` }}
                className="bg-[#54DED3] text-white border-1 rounded-r-xl"
            >
                <p className="px-4 text-xs">Used: {builtArea} sq ft</p>
            </div>
            {/* unused space */}
            <div
                style={{ width: `${unusedPer}%` }}
                className="bg-[#385682] text-white"
            >
                <p className=" text-xs text-center">{availableArea}sq ft</p>
            </div>
        </div>
    );
}

export default Spacebar;
