import { PiFrameCornersFill } from "react-icons/pi";
import { IoIosCloseCircle } from "react-icons/io";
import { useBoqApp } from "../../Context/BoqContext";
import { motion } from "framer-motion";

function CurrentLayoutDetails({ onClose }) {
  const { currentLayoutData } = useBoqApp();

  return (
    <motion.div
      className="fixed inset-0 bg-[#000]/30 flex justify-center items-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* POPUP CARD */}
      <motion.div
        initial={{ y: "-100%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "100%", opacity: 0 }}
        transition={{
          duration: 0.4,
          ease: "easeInOut",
        }}
        className="max-w-xl w-full max-h-[80vh] overflow-y-auto flex rounded-lg font-Poppins relative gradient-scrollbar bg-white"
      >
        <button onClick={onClose} className="absolute right-2 top-2 z-10">
          <IoIosCloseCircle color="#374A75" size={30} />
        </button>

        <div className="w-full p-5 h-full">
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
                  (currentLayoutData.usedSpace / currentLayoutData.totalArea) *
                  100
                }%`,
              }}
            >
              Used Area: {currentLayoutData.usedSpace} sq.ft
            </div>
            <div className="bg-[#ECF2FF] text-[#374A75] h-full flex-1 flex items-center px-2">
              Unused Area:{" "}
              {currentLayoutData.totalArea - currentLayoutData.usedSpace} sq.ft
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-3 py-2">Name</th>
                  <th className="px-3 py-2 text-center">Area (sq.ft)</th>
                  <th className="px-3 py-2 text-center">Quantity</th>
                  <th className="px-3 py-2 text-center">Total Area (sq.ft)</th>
                  <th className="px-3 py-2 text-center">Seats</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(currentLayoutData)
                  .filter(
                    ([key]) =>
                      key.endsWith("Area") &&
                      key !== "totalArea" &&
                      key !== "usedSpace",
                  )
                  .map(([areaKey, areaValue]) => {
                    const baseName = areaKey.replace("Area", "");
                    const qtyKey = `${baseName}Qty`;
                    const qtyValue = currentLayoutData[qtyKey];
                    const seatsValue =
                      currentLayoutData.seatCount?.[baseName] ?? "-";

                    if (!qtyValue || qtyValue === 0) return null;

                    const displayName = baseName
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (char) => char.toUpperCase())
                      .replace("L Type", "L-Type");

                    return (
                      <tr key={baseName} className="hover:bg-gray-50">
                        <td className="px-3 py-2">{displayName}</td>
                        <td className="px-3 py-2 text-center">{areaValue}</td>
                        <td className="px-3 py-2 text-center">{qtyValue}</td>
                        <td className="px-3 py-2 text-center">
                          {areaValue * qtyValue}
                        </td>
                        <td className="px-3 py-2 text-center">{seatsValue}</td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default CurrentLayoutDetails;
