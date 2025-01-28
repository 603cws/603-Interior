import { MdCancel } from "react-icons/md";
import { useState } from "react";
import { useApp } from "../../Context/Context";

function EnterAreaModal({ onclose }) {
  const { inputValue, setInputValue, setTotalArea, setTotalAreaSource } =
    useApp();
  const [error, setError] = useState(""); // State to store the error message

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
    if (!isNaN(area) && area >= MIN_AREA && area <= MAX_AREA) {
      setTotalArea(area); // Commit inputValue to totalArea
      onclose(); // Close the modal
    } else {
      setError(`Area must be between ${MIN_AREA} and ${MAX_AREA}.`); // Show error message
    }
  };

  return (
    <div className="w-full h-svh z-20 absolute top-0 bg-[rgba(25,25,25,0.46)] flex justify-center items-center">
      <div className="grid grid-cols-[2fr_1fr] bg-[#A9D3CE] border-2 rounded-3xl w-3/4 2xl:w-1/2 mx-auto px-4">
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
            className="py-2 bg-transparent border-[1px] border-black px-2 rounded-lg [&::-webkit-inner-spin-button]:appearance-none focus:outline-none focus:ring-0 w-3/4"
            autoFocus
          />
          {error && ( // Display the error message if there's any
            <p className="text-red-500 text-sm mt-2">{error}</p>
          )}
          <div className="mt-4">
            <button
              onClick={handleSubmit}
              className="py-2 px-4 bg-[#FFD500] text-black border-2 border-black border-r-8 border-b-8"
            >
              Submit
            </button>
          </div>
        </div>
        <div className="flex justify-center my-10 relative">
          <img src="images/No-data.gif" alt="Error chair" />
        </div>
      </div>
    </div>
  );
}

export default EnterAreaModal;
