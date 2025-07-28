import React from "react";
import { useApp } from "../../Context/Context";
import { PiFrameCornersFill } from "react-icons/pi";
import { IoIosCloseCircle } from "react-icons/io";

function CurrentLayoutDetails({ onClose }) {
  const { currentLayoutData } = useApp();
  console.log(currentLayoutData);

  return (
    <>
      <div className="fixed inset-0 bg-[#000]/30 flex justify-center items-center">
        <div className="max-w-xl w-full max-h-[80vh] overflow-y-auto  bg-[#fff] flex rounded-lg font-Poppins relative gradient-scrollbar">
          <div className="bg-[#000]/60 flex-1 flex items-start justify-center pt-3 rounded-l-lg sticky left-0 top-0">
            <button onClick={onClose}>
              <IoIosCloseCircle color="#374A75" size={30} />
            </button>
          </div>
          <div className="max-w-lg w-full p-5">
            <div className="text-center mb-4">
              <div className="flex justify-center items-center gap-2">
                <PiFrameCornersFill size={25} color="#374A75" />

                <p className="text-sm">Total Area:</p>
                <span className="text-[#347ABF] text-sm">
                  {currentLayoutData.totalArea} sq.ft
                </span>
              </div>
            </div>
            <div className="flex text-[10px] items-center rounded overflow-hidden border border-gray-200 h-10 mb-5">
              <div
                className="bg-[#374A75] text-white h-full flex items-center px-2"
                style={{
                  width: `${
                    (currentLayoutData.usedSpace /
                      currentLayoutData.totalArea) *
                    100
                  }%`,
                }}
              >
                Used Area: {currentLayoutData.usedSpace} sq.ft
              </div>
              <div className="bg-[#ECF2FF] text-[#374A75] h-full flex-1 flex items-center px-2 ">
                Unused Area:{" "}
                {currentLayoutData.totalArea - currentLayoutData.usedSpace}{" "}
                sq.ft
              </div>
            </div>

            <div className="space-y-5">
              {Object.entries(currentLayoutData)
                .filter(
                  ([key]) =>
                    key.endsWith("Area") &&
                    key !== "totalArea" &&
                    key !== "usedSpace"
                )
                .map(([areaKey, areaValue]) => {
                  const baseName = areaKey.replace("Area", "");
                  const qtyKey = `${baseName}Qty`;
                  const qtyValue = currentLayoutData[qtyKey];

                  if (!qtyValue || qtyValue === 0) return null;

                  const displayName = baseName
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (char) => char.toUpperCase())
                    .replace("L Type", "L-Type");

                  return (
                    <div
                      key={baseName}
                      className="flex justify-between text-sm text-[#000] border-b pb-2"
                    >
                      <span className="w-1/2">{displayName}</span>
                      <span className="w-1/4 text-center">
                        {areaValue} sq.ft
                      </span>
                      <span className="w-1/4 text-center">{qtyValue}</span>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CurrentLayoutDetails;
