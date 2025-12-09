import { useState } from "react";
import { useApp } from "../../Context/Context";
import { motion } from "framer-motion";

function EnterAreaModal({ onclose }) {
  const { inputValue, setInputValue, setTotalArea } = useApp();
  const [error, setError] = useState("");
  const [imageLoaded, setImageLoaded] = useState(false);

  const MIN_AREA = 1000;
  const MAX_AREA = 25000;

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
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-30 font-Poppins">
      <div className="w-5/6 2xl:w-1/2 mx-auto bg-[#fff] p-3 rounded-3xl">
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
                className="py-1 px-2 md:py-2 md:px-4 bg-[#fff] text-[#000] border border-black border-b-4 border-r-4"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="py-2 px-4 bg-[#334A78] text-white border border-black border-r-4 border-b-4"
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
      </div>
    </div>
  );
}

export default EnterAreaModal;
