import React from "react";
import AreaCounter from "./AreaCounter";
import { PiMinusCircleFill, PiPlusCircleFill } from "react-icons/pi";
import Tooltip from "./ToolTip";
import { RxInfoCircled } from "react-icons/rx";

const LayoutCard = ({
  roomType,
  image,
  description,
  counterValue,
  onIncrement,
  onDecrement,
  onChange,
  sizes,
  selectedSize,
  onSizeChange,
  tooltipText,
  title,
  showInputField, // New prop to conditionally render the input field
  inputFieldProps, // Props specific to the input field
  showAreaCounter, // Boolean to conditionally render AreaCounter
  areaCounterProps, // Props specific to AreaCounter
}) => {
  return (
    <div className="workspacedescription flex flex-col w-40 md:w-[280px] items-center border border-solid bg-[#fff] pb-2 my-3 relative">
      {/* Image */}
      <div className="relative bg-red-400 group w-full h-32 md:h-56 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="RoomImage object-fill w-full h-full cursor-pointer"
        />
        {/* Tooltip-like description */}
        <p className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-white bg-opacity-70 text-black px-4 py-2 text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg pointer-events-none w-full">
          {description}
        </p>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-1 md:gap-3">
        {/* Counter */}
        {!showInputField && (
          <div className=" flex justify-around mt-2 gap-3">
            {roomType !== "reception" && roomType !== "lounge" && (
              <button onClick={onDecrement}>
                <PiMinusCircleFill className="h-6 w-6 md:h-8 md:w-8" />
              </button>
            )}
            <input
              type="number"
              className="w-10 md:w-16 border rounded text-center [&::-webkit-inner-spin-button]:appearance-none  focus:outline-none focus:ring-0 text-xs md:text-base"
              value={counterValue}
              onChange={(e) => onChange(Number(e.target.value))} // Update counterValue on input change
              min={0}
            />
            {roomType !== "reception" && roomType !== "lounge" && (
              <button onClick={onIncrement}>
                <PiPlusCircleFill className="h-6 w-6 md:h-8 md:w-8" />
              </button>
            )}
          </div>
        )}
        <p className="text-center font-bold text-xs md:text-sm">{title}</p>

        {/* Size Options */}
        {sizes && (
          <div className="flex gap-1 md:gap-2 text-xs md:text-sm font-bold md:my-2 justify-center md:justify-around">
            {sizes.map((size) => (
              <button
                key={size}
                className={`border-2 rounded-full p-1 h-6 w-6 md:h-9 md:w-9 text-[10px] md:text-xs ${
                  selectedSize === size ? "bg-gray-300" : ""
                }`}
                onClick={() => onSizeChange(size)}
              >
                {size}
              </button>
            ))}
          </div>
        )}
        {/* Tooltip */}
        {tooltipText && (
          <div className="tooltip-container mt-2">
            <Tooltip text={tooltipText}>
              <div className="w-4 absolute right-1 md:right-5 bottom-1 md:bottom-3">
                <RxInfoCircled size={20} />
              </div>
            </Tooltip>
          </div>
        )}
        {/* Area Counter */}
        {counterValue >= 1 && showAreaCounter && !showInputField && (
          <AreaCounter {...areaCounterProps} counterValue={counterValue} />
        )}
        {/* Input Field for "Other Area" */}
        {showInputField && (
          <div className="other-area-input mt-4 text-xs">
            <label>{inputFieldProps.label || "Enter Value"}:</label>
            <input
              type="number"
              value={inputFieldProps.value || ""}
              onChange={inputFieldProps.onChange}
              min={inputFieldProps.min || 0}
              placeholder={inputFieldProps.placeholder || "Enter value"}
              className="w-full border rounded p-2 mt-2 [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default LayoutCard;
