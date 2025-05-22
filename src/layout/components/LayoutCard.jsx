import React from "react";
import AreaCounter from "./AreaCounter";
import Tooltip from "./ToolTip";
import { useApp } from "../../Context/Context";

const LayoutCard = ({
  name,
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
  showInputField, // prop to conditionally render the input field
  inputFieldProps, // Props specific to the input field
  showAreaCounter, // Boolean to conditionally render AreaCounter   //undefined rohit
  areaCounterProps, // Props specific to AreaCounter
}) => {
  const { totalArea } = useApp();

  return (
    <div className="workspacedescription flex flex-col w-40 md:w-[280px] items-center border border-solid bg-[#fff] pb-2 my-3 relative">
      {/* Image */}
      <div className="relative group w-full h-32 md:h-48 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="RoomImage object-contain w-full h-full cursor-pointer"
        />
        {/* Tooltip-like description */}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 translate-y-4 group-hover:translate-y-0 bg-white bg-opacity-70 text-black px-4 py-2 text-xs sm:text-sm rounded-md opacity-0 group-hover:opacity-100 transition-all duration-400 shadow-lg pointer-events-none w-full">
          <p className="">{description}</p>
          {tooltipText && (
            <div className="whitespace-pre-line">
              <Tooltip text={tooltipText}></Tooltip>
            </div>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 justify-items-start items-start gap-x-1 w-full px-2">
        <div className="font-bold text-xs md:text-[13px]">{title}</div>
        <div>
          {!showInputField && (
            <>
              <div className=" flex  gap-3">
                <div className="flex items-start justify-start gap-2 border-2 rounded-[4px]">
                  {roomType !== "reception" && roomType !== "lounge" && (
                    <button
                      className="border-r-2 px-2 font-semibold"
                      onClick={onDecrement}
                    >
                      -
                    </button>
                  )}
                  <input
                    type="number"
                    className="w-10 rounded text-center [&::-webkit-inner-spin-button]:appearance-none  focus:outline-none focus:ring-0 text-xs md:text-[13px] leading-6"
                    value={counterValue}
                    onChange={(e) => onChange(Number(e.target.value))} // Update counterValue on input change
                    min={0}
                    disabled={roomType === "reception" || roomType === "lounge"}
                  />
                  {roomType !== "reception" && roomType !== "lounge" && (
                    <button
                      className="border-l-2 px-2 font-semibold"
                      onClick={onIncrement}
                    >
                      +
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
          {showInputField && totalArea && (
            <div className="other-area-input text-xs">
              <label>{inputFieldProps.label || "Enter Value"}:</label>
              <input
                type="number"
                value={inputFieldProps.value || ""}
                onChange={inputFieldProps.onChange}
                min={inputFieldProps.min || 0}
                placeholder={inputFieldProps.placeholder || "Enter value"}
                className="w-full border-2 border-gray-400 rounded p-2 mt-2 [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
          )}
        </div>
        <div className="flex justify-start items-center w-full h-full">
          {!showInputField &&
            counterValue > 0 &&
            (showAreaCounter || sizes) && (
              <div>
                {areaCounterProps?.name === "Add Extra Seats" ? (
                  <p className="text-xs md:text-[13px]">Add Extra Seats</p>
                ) : (
                  <p className="text-xs md:text-[13px]">Select size</p>
                )}
              </div>
            )}
          {name === "linear" && counterValue <= 0 && (
            <p className="text-xs md:text-[13px]">Select size</p>
          )}
        </div>
        <div>
          {!showInputField && (
            <div>
              {sizes && (
                <div className="">
                  <div className="flex items-start justify-start gap-2 border-2 rounded-[4px] ">
                    {sizes.map((size) => (
                      <button
                        key={size}
                        className={`leading-6 w-7 text-xs md:text-[13px] ${
                          selectedSize === size ? "bg-gray-300" : ""
                        }`}
                        onClick={() => onSizeChange(size)}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {counterValue >= 1 && showAreaCounter && !showInputField && (
                <AreaCounter
                  {...areaCounterProps}
                  counterValue={counterValue}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LayoutCard;
