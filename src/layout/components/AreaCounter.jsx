import React, { useState } from "react";
import ErrorModal from "../../common-components/ErrorModal";

const AreaCounter = ({
  name,
  value,
  onChange,
  min2,
  max2,
  step2,
  cabinSize,
  setCabinSize,
  totalArea,
  builtArea,
  type,
  initialAreaValues,
  counterValue,
  seatCount,
  setSeatCount,
}) => {
  const min = min2;
  const max = max2;
  const step = step2;
  const freeSpace = totalArea * 0.02; // 2% of totalArea
  const usableArea = totalArea - freeSpace; // Area available for building
  const [error, setError] = useState("");
  const [warning, setWarning] = useState(false);

  const errorMessage =
    `The built area (${builtArea} sqft) exceeds the available space (${usableArea} sqft).\n` +
    "Adjust the number of workspaces OR.\n" +
    "Increase the total area to add more workspaces.";

  const handleIncrement = () => {
    if (counterValue > 0) {
      if (value < max && totalArea > 0 && builtArea <= usableArea) {
        onChange(value + step);
        if (type === "financeRoom") {
          setCabinSize(cabinSize + 50);
        } else if (
          type === "md" ||
          type === "manager" ||
          type === "reception" ||
          type === "lounge" ||
          type === "videoRecordingRoom" ||
          type === "ups" ||
          type === "bms" ||
          // type === "maleWashroom" ||
          // type === "femaleWashroom"
          type === "washrooms"
        ) {
          setCabinSize(cabinSize + 5);
        } else if (type === "conferenceRoom" || type === "boardRoom") {
          setCabinSize(cabinSize + 35);
          setSeatCount(seatCount + 2);
        } else {
          setCabinSize(cabinSize + 40);
        }
      } else {
        setWarning(true);
      }
    } else {
      setError("Add workspace to increase the area");
      setTimeout(() => {
        setError("");
      }, 1500);
    }
  };

  const handleDecrement = () => {
    if (value > min && totalArea > 0 && cabinSize > initialAreaValues[type]) {
      onChange(value - step);
      if (
        type === "financeRoom"
        // type === "boardRoom" ||
        // type === "conferenceRoom"
      ) {
        setCabinSize(cabinSize - 50);
      } else if (type === "conferenceRoom" || type === "boardRoom") {
        setCabinSize(cabinSize - 35);
        setSeatCount(seatCount - 2);
      } else if (
        type === "md" ||
        type === "manager" ||
        type === "reception" ||
        type === "lounge" ||
        type === "videoRecordingRoom" ||
        type === "ups" ||
        type === "bms" ||
        // type === "maleWashroom" ||
        // type === "femaleWashroom"
        type === "washrooms"
      ) {
        setCabinSize(cabinSize - 5);
      } else {
        setCabinSize(cabinSize - 40);
      }
    }
  };

  const handleInputChange = (event) => {
    const newValue = Number(event.target.value);
    if (newValue >= min && newValue <= max) {
      onChange(newValue);
    }
  };

  return (
    <div className="text-center">
      {/* <label htmlFor="md-cabin-size" className="text-xs md:text-base">
        {name}:{" "}
      </label> */}
      <div className="flex items-start justify-start gap-2 border-2 rounded-[4px]">
        <button onClick={handleDecrement} className="border-r-2 px-2">
          -
        </button>
        <input
          type="number"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleInputChange}
          readOnly
          className="w-10 rounded text-center [&::-webkit-inner-spin-button]:appearance-none  focus:outline-none focus:ring-0 text-xs md:text-[13px] leading-6"
        />
        <button onClick={handleIncrement} className="border-l-2 px-2">
          +
        </button>
        {error && (
          <p className="text-red-500 absolute bottom-0 w-full left-0">
            {error}
          </p>
        )}
      </div>

      {warning && (
        <ErrorModal onclose={() => setWarning(false)} message={errorMessage} />
      )}
    </div>
  );
};

export default AreaCounter;
