import { useState } from "react";
import { motion } from "framer-motion";
import { MAX_AREA, MIN_AREA } from "../utils/AreaCalculations";
import { useBoqApp } from "../../Context/BoqContext";

function EnterAreaModal({ onclose }) {
  const { inputValue, setInputValue, setTotalArea } = useBoqApp();
  const [error, setError] = useState("");
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    setError("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    const area = parseInt(inputValue, 10);
    if (!isNaN(area) && area >= MIN_AREA && area <= MAX_AREA) {
      setTotalArea(area);
      onclose();
    } else if (isNaN(area)) {
      setError(`please enter the area`);
    } else {
      setError(`Area must be between ${MIN_AREA} and ${MAX_AREA}.`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-30 font-Poppins"
    >
      <motion.div
        initial={{ scale: 0.85, y: 40, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.9, y: 30, opacity: 0 }}
        transition={{
          type: "spring",
          stiffness: 140,
          damping: 18,
          mass: 0.8,
        }}
        className="w-5/6 2xl:w-1/2 mx-auto bg-[#fff] p-3 rounded-3xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] bg-gradient-to-br from-[#23445B] to-[#487BA0] border-2 rounded-xl  px-4 py-10 text-[#fff]">
          <div className="flex flex-col justify-center gap-4 pr-4">
            <p className="text-4xl font-bold">
              <span className="text-6xl">O</span>ops!
            </p>
            <p>You Forgot To Enter Your Area.</p>
            <p>Please Enter Your Area.</p>
            <input
              type="number"
              value={inputValue}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Enter Your Area"
              className="py-2 bg-[#fff] text-[#000] border-[1px] border-black px-2 rounded-lg [&::-webkit-inner-spin-button]:appearance-none focus:outline-none focus:ring-0 w-full lg:w-3/4"
            />
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            <div className="mt-4 flex gap-10">
              <button
                onClick={onclose}
                className="py-1 px-2 md:py-2 md:px-4 bg-white text-black border border-black border-b-4 border-r-4 transition-all duration-200 hover:scale-[1.03] hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)]"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="py-2 px-4 bg-[#334A78] text-white border border-black border-b-4 border-r-4 transition-all duration-200 hover:scale-[1.03] hover:shadow-[0_6px_16px_rgba(51,74,120,0.45)]"
              >
                Submit
              </button>
            </div>
          </div>
          <div className="hidden md:flex justify-center h-full w-full relative">
            {!imageLoaded && (
              <div className="w-full h-64 bg-gray-300/10 rounded-3xl" />
            )}
            <motion.img
              src="images/enter_area.png"
              alt="Error chair"
              loading="lazy"
              initial={{ opacity: 0 }}
              animate={{ opacity: imageLoaded ? 1 : 0 }}
              transition={{ duration: 0.5 }}
              onLoad={() => setImageLoaded(true)}
              className={`h-64 object-contain absolute top-0 left-1/2 -translate-x-1/2 ${
                imageLoaded ? "relative" : "invisible"
              }`}
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default EnterAreaModal;
