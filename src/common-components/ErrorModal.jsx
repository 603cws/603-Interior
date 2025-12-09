import { useState } from "react";
import { useApp } from "../Context/Context";
import Lottie from "lottie-react";
import ChairAnimation from "../assets/ChairAnimation.json";
function ErrorModal({ onclose, message, sizeReached }) {
  const {
    totalArea,
    setTotalArea,
    setTotalAreaSource,
    inputValue,
    setInputValue,
  } = useApp();
  const [error, setError] = useState("");

  const MIN_AREA = 1000;
  const MAX_AREA = 25000;

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    setError("");
  };

  const handleSubmit = () => {
    const area = parseInt(inputValue, 10);

    if (isNaN(area)) {
      setError("Please enter a valid number.");
    } else if (area <= totalArea) {
      setError("New area must be greater than the existing area.");
    } else if (area < MIN_AREA || area > MAX_AREA) {
      setError(`Area must be between ${MIN_AREA} and ${MAX_AREA}.`);
    } else {
      setTotalArea(area);
      setTotalAreaSource("ErrorModal");
      onclose();
    }
  };

  return (
    <div className="fixed inset-0 z-20 top-0 bg-[rgba(25,25,25,0.46)] flex justify-center items-center font-Poppins">
      <div className="mx-2 max-w-xl lg:max-w-4xl md:mx-auto p-3 lg:p-4 bg-[#fff] rounded-3xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr] bg-gradient-to-br from-[#23445B] to-[#487BA0] border-2 rounded-xl  ">
          <div className="text-white p-2 lg:p-5 flex flex-col justify-center gap-4 my-10">
            <p className="text-2xl md:text-4xl text-start font-bold">
              <span className="text-4xl md:text-6xl tracking-tighter">W</span>
              arning
            </p>
            <div className="text-xs sm:text-sm lg:text-base">
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
            {!sizeReached && (
              <input
                type="number"
                value={inputValue}
                onChange={handleInputChange}
                placeholder="Enter updated total area"
                className="py-2 px-3 rounded-lg border-2 border-gray-300 focus:ring-yellow-500 bg-transparent text-white [&::-webkit-inner-spin-button]:appearance-none focus:outline-none focus:ring-0"
              />
            )}
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}{" "}
            <div className="flex gap-4 mt-4">
              <button
                onClick={onclose}
                className="py-1 px-2 md:py-2 md:px-4 bg-[#fff] text-[#000] border border-black border-b-4 border-r-4"
              >
                Cancel
              </button>
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

          <div className="hidden md:flex justify-center md:my-10 relative w-full">
            <div className="">
              <Lottie animationData={ChairAnimation} loop={false} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ErrorModal;
