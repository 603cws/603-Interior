import { MdCancel } from "react-icons/md";
import { useState } from "react";
import { useApp } from "../Context/Context";
function ErrorModal({ onclose, message }) {
  const {
    totalArea,
    setTotalArea,
    setTotalAreaSource,
    inputValue,
    setInputValue,
  } = useApp(); // Access totalArea and setter from context
  const [error, setError] = useState(""); // For validation errors

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
    <div className="w-full h-svh z-20 top-0 absolute bg-[rgba(25,25,25,0.46)] flex justify-center items-center">
      <div className="grid grid-cols-[2fr_1fr] bg-[#1A3A36] border-2 rounded-3xl w-5/6 2xl:w-1/2 mx-auto ">
        <div className="text-white p-5 flex flex-col justify-center gap-4 m-10">
          <p className="text-4xl font-['UbuntuSans-Regular',_sans-serif]">
            <span className="text-6xl tracking-tighter">W</span>arning
          </p>
          <p style={{ fontFamily: "'Poppins', sans-serif" }}>
            <ul style={{ paddingLeft: "20px", listStyleType: "disc" }}>
              {message.split(".").map(
                (sentence, index) =>
                  sentence.trim() && (
                    <li key={index} style={{ marginBottom: "5px" }}>
                      {sentence.trim()}.
                    </li>
                  )
              )}
            </ul>
          </p>
          {/* Input Field */}
          <input
            type="number"
            value={inputValue} // Bind to local inputValue state
            onChange={handleInputChange} // Update inputValue
            placeholder="Enter updated total area"
            className="py-2 px-3 rounded-lg border-2 border-gray-300 focus:ring-yellow-500 bg-transparent text-white [&::-webkit-inner-spin-button]:appearance-none focus:outline-none focus:ring-0"
          />
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}{" "}
          {/* Error Message */}
          <div className="flex gap-4 mt-4">
            {/* Go Back Button */}
            <button
              onClick={onclose}
              className="py-2 px-4 bg-gray-500 text-white border-2 border-black border-b-8 border-r-8"
            >
              Cancel
            </button>
            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              className="py-2 px-4 bg-[#FFD500] text-black border-2 border-black border-b-8 border-r-8"
            >
              Update
            </button>
          </div>
        </div>

        {/* Image Section */}
        <div className="flex justify-center my-10 mx-5 relative">
          <img src="images/Errorimg.png" alt="Error chair" />
          <button className="absolute -top-5 right-0" onClick={onclose}>
            <MdCancel size={30} color="white" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ErrorModal;
