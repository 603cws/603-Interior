import { useState } from "react";
import { useApp } from "../Context/Context";
import { motion } from "framer-motion";
function ErrorModal({ onclose, message, sizeReached }) {
  const {
    totalArea,
    setTotalArea,
    setTotalAreaSource,
    inputValue,
    setInputValue,
  } = useApp(); // Access totalArea and setter from context
  const [error, setError] = useState(""); // For validation errors
  const [imageLoaded, setImageLoaded] = useState(false);

  const MIN_AREA = 1000;
  const MAX_AREA = 25000;

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value); // Update local input state
    setError(""); // Clear previous errors
  };

  const handleSubmit = () => {
    const area = parseInt(inputValue, 10);

    // Validation for new totalArea
    if (isNaN(area)) {
      setError("Please enter a valid number.");
    } else if (area <= totalArea) {
      setError("New area must be greater than the existing area."); // Prevent decreasing the area
    } else if (area < MIN_AREA || area > MAX_AREA) {
      setError(`Area must be between ${MIN_AREA} and ${MAX_AREA}.`); // Range validation
    } else {
      setTotalArea(area); // Update global totalArea
      setTotalAreaSource("ErrorModal"); // Set the source
      onclose(); // Close modal
    }
  };

  return (
    <div className="fixed inset-0 z-20 top-0 bg-[rgba(25,25,25,0.46)] flex justify-center items-center font-Poppins">
      <div className="max-w-4xl mx-auto p-4 bg-[#fff] rounded-3xl">
        <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr] bg-gradient-to-br from-[#23445B] to-[#487BA0] border-2 rounded-xl  ">
          <div className="text-white p-5 flex flex-col justify-center gap-4 my-10">
            <p className="text-2xl md:text-4xl text-start font-bold">
              <span className="text-4xl md:text-6xl tracking-tighter">W</span>
              arning
            </p>
            <div className="text-xs md:text-base">
              <ul style={{ paddingLeft: "20px", listStyleType: "disc" }}>
                {message.split(".").map(
                  (sentence, index) =>
                    sentence.trim() && (
                      <li
                        key={index}
                        style={{ marginBottom: "5px" }}
                        className="text-start"
                      >
                        {sentence.trim()}.
                      </li>
                    )
                )}
              </ul>
            </div>
            {/* Input Field */}
            {!sizeReached && (
              <input
                type="number"
                value={inputValue} // Bind to local inputValue state
                onChange={handleInputChange} // Update inputValue
                placeholder="Enter updated total area"
                className="py-2 px-3 rounded-lg border-2 border-gray-300 focus:ring-yellow-500 bg-transparent text-white [&::-webkit-inner-spin-button]:appearance-none focus:outline-none focus:ring-0"
              />
            )}
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}{" "}
            {/* Error Message */}
            <div className="flex gap-4 mt-4">
              {/* Go Back Button */}
              <button
                onClick={onclose}
                className="py-1 px-2 md:py-2 md:px-4 bg-gray-500 text-white border border-black border-b-4 border-r-4"
              >
                Cancel
              </button>
              {/* Submit Button */}
              {!sizeReached && (
                <button
                  onClick={handleSubmit}
                  className="py-1 px-2 md:py-2 md:px-4 bg-[#334A78] text-white border border-black border-b-4 border-r-4"
                >
                  Update
                </button>
              )}
            </div>
          </div>

          {/* Image Section */}
          {/* <div className="hidden md:flex justify-center md:my-10 mx-1 relative">
          <img src="images/Errorimg.gif" alt="Error chair" />
        </div> */}
          <div className="hidden md:flex justify-center md:my-10 relative w-full">
            {/* Skeleton placeholder while image loads */}
            {!imageLoaded && (
              <div className="w-full  bg-gray-300/10 rounded-3xl" />
            )}

            {/* Lazy-loaded Error image with fade-in animation */}
            <motion.img
              initial={{ opacity: 0 }}
              animate={{ opacity: imageLoaded ? 1 : 0 }}
              transition={{ duration: 0.5 }}
              onLoad={() => setImageLoaded(true)}
              src="images/Errorimg.gif"
              alt="Error chair"
              loading="lazy"
              className={` object-contain rounded-3xl absolute top-0 left-1/2 -translate-x-1/2 ${
                imageLoaded ? "relative" : "invisible"
              }`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ErrorModal;
