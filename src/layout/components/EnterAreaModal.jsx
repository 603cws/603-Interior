import { useState } from "react";
import { useApp } from "../../Context/Context";
import { motion } from "framer-motion";

function EnterAreaModal({ onclose }) {
  const { inputValue, setInputValue, setTotalArea } = useApp();
  const [error, setError] = useState(""); // State to store the error message
  const [imageLoaded, setImageLoaded] = useState(false);

  const MIN_AREA = 1000;
  const MAX_AREA = 25000;

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value); // Update the inputValue in the context
    setError(""); // Clear any previous error message
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    const area = parseInt(inputValue, 10);
    console.log(area);

    if (!isNaN(area) && area >= MIN_AREA && area <= MAX_AREA) {
      setTotalArea(area); // Commit inputValue to totalArea
      onclose(); // Close the modal
    } else if (isNaN(area)) {
      setError(`please enter the area`);
    } else {
      setError(`Area must be between ${MIN_AREA} and ${MAX_AREA}.`); // Show error message
    }
  };

  return (
    // <div className="w-full h-svh z-20 absolute top-0 bg-[rgba(25,25,25,0.46)] flex justify-center items-center">
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-30">
      <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] bg-[#A9D3CE] border-2 rounded-3xl w-5/6 2xl:w-1/2 mx-auto px-4 py-10">
        <div className="flex flex-col justify-center gap-2 pr-4">
          <p className="text-4xl font-['UbuntuSans-Regular',_sans-serif]">
            <span className="text-6xl">O</span>ops!
          </p>
          <p style={{ fontFamily: "'Poppins', sans-serif" }}>
            You Forgot To Enter Your Area.
          </p>
          <p style={{ fontFamily: "'Poppins', sans-serif'" }}>
            Please Enter Your Area.
          </p>
          <input
            type="number"
            value={inputValue} // Bind to inputValue from context
            onChange={handleInputChange} // Update local inputValue
            onKeyPress={handleKeyPress} // Handle Enter key
            placeholder="Enter Your Area"
            className="py-2 bg-transparent border-[1px] border-black px-2 rounded-lg [&::-webkit-inner-spin-button]:appearance-none focus:outline-none focus:ring-0 w-full lg:w-3/4"
            // autoFocus
          />
          {error && ( // Display the error message if there's any
            <p className="text-red-500 text-sm mt-2">{error}</p>
          )}
          <div className="mt-4 flex gap-10">
            <button
              onClick={onclose}
              className="py-1 px-2 md:py-2 md:px-4 bg-gray-500 text-white border-2 border-black border-b-8 border-r-8"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="py-2 px-4 bg-[#FFD500] text-black border-2 border-black border-r-8 border-b-8"
            >
              Submit
            </button>
          </div>
        </div>
        <div className="flex justify-center h-full w-full relative">
          {/* Skeleton placeholder */}
          {!imageLoaded && (
            <div className="w-full h-64 bg-gray-300/10 rounded-3xl animate-pulse" />
          )}

          {/* Lazy-loaded image with fade-in */}
          <motion.img
            src="images/No-data.gif"
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
  );
}

export default EnterAreaModal;
