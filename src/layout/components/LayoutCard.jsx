import React, { useState } from "react";
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
  showAreaCounter, // Boolean to conditionally render AreaCounter   //undefined rohit
  areaCounterProps, // Props specific to AreaCounter
}) => {
  console.log("Sizes:", sizes);

  // return (
  //   <div className="workspacedescription flex flex-col w-40 md:w-[280px] items-center border border-solid bg-[#fff] pb-2 my-3 relative">
  //     {/* Image */}
  //     <div className="relative group w-full h-32 md:h-48 overflow-hidden">
  //       <img
  //         src={image}
  //         alt={title}
  //         className="RoomImage object-contain w-full h-full cursor-pointer"
  //       />
  //       {/* Tooltip-like description */}
  //       <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 translate-y-4 group-hover:translate-y-0 bg-white bg-opacity-70 text-black px-4 py-2 text-sm rounded-md opacity-0 group-hover:opacity-100 transition-all duration-400 shadow-lg pointer-events-none w-full">
  //         {description}
  //         {tooltipText && (
  //           <div className="whitespace-pre-line">
  //             <Tooltip text={tooltipText}></Tooltip>
  //           </div>
  //         )}
  //       </div>
  //     </div>

  //     {/* Content */}
  //     <div className="flex flex-col gap-1 md:gap-3">
  //       {/* Counter */}
  //       {!showInputField && (
  //         <div className=" flex justify-around mt-2 gap-3">
  //           {roomType !== "reception" && roomType !== "lounge" && (
  //             <button onClick={onDecrement}>
  //               <PiMinusCircleFill className="h-6 w-6 md:h-8 md:w-8" />
  //             </button>
  //           )}
  //           <input
  //             type="number"
  //             className="w-10 md:w-16 border rounded text-center [&::-webkit-inner-spin-button]:appearance-none  focus:outline-none focus:ring-0 text-xs md:text-base"
  //             value={counterValue}
  //             onChange={(e) => onChange(Number(e.target.value))} // Update counterValue on input change
  //             min={0}
  //           />
  //           {roomType !== "reception" && roomType !== "lounge" && (
  //             <button onClick={onIncrement}>
  //               <PiPlusCircleFill className="h-6 w-6 md:h-8 md:w-8" />
  //             </button>
  //           )}
  //         </div>
  //       )}
  //       <p className="text-center font-bold text-xs md:text-sm">{title}</p>

  //       {/* Size Options */}
  //       {sizes && (
  //         <div className="group relative pb-2 inline-block">
  //           <button className="absolute -bottom-2 -left-1/4 border-gray-300 border-[1px] px-2 py-0.5 bg-black text-white animate-bounce text-sm w-fit">
  //             Sizes
  //           </button>
  //           <div className="hidden absolute -bottom-4 group-hover:flex gap-1 text-xs md:text-sm font-bold md:my-3 justify-center  transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-in-out w-full ">
  //             {sizes.map((size) => (
  //               <button
  //                 key={size}
  //                 className={`border-2 h-7 w-7 text-[10px] md:text-xs ${
  //                   selectedSize === size ? "bg-gray-300" : ""
  //                 }`}
  //                 onClick={() => onSizeChange(size)}
  //               >
  //                 {size}
  //               </button>
  //             ))}
  //           </div>
  //         </div>
  //       )}
  //       {/* Tooltip */}
  //       {/* {tooltipText && (
  //         <div className="tooltip-container">
  //           <Tooltip text={tooltipText}>
  //             <div className="w-4 absolute right-1 md:right-5 bottom-1 md:bottom-3">
  //               <RxInfoCircled size={20} />
  //             </div>
  //           </Tooltip>
  //         </div>
  //       )} */}
  //       {/* Area Counter */}

  //       {/* {counterValue >= 1 && showAreaCounter && !showInputField && (
  //         <AreaCounter {...areaCounterProps} counterValue={counterValue} />
  //       )} */}
  //       {showAreaCounter && !showInputField && (
  //         <div className="relative pb-8">
  //           {" "}
  //           <button
  //             onClick={() => {
  //               setShowSizes(!showSizes);
  //               console.log("toggle click");
  //             }}
  //             className="absolute bottom-0 left-0 transform -translate-x-full border border-gray-300 px-2  bg-black text-white text-xs rounded-full z-10"
  //           >
  //             {showSizes ? "▼" : "▲"}
  //           </button>
  //           <div
  //             className={`w-full absolute left-0 transition-all duration-500 ease-in-out transform ${
  //               showSizes
  //                 ? "bottom-10 opacity-100 translate-y-0"
  //                 : "bottom-0 opacity-0 translate-y-4 pointer-events-none"
  //             }`}
  //           >
  //             <div className="bg-[#fbfcfc] px-4 py-2 rounded-t-md shadow-lg">
  //               <AreaCounter
  //                 {...areaCounterProps}
  //                 counterValue={counterValue}
  //               />
  //             </div>
  //           </div>
  //         </div>
  //       )}

  //       {/* Input Field for "Other Area" */}
  //       {showInputField && (
  //         <div className="other-area-input mt-4 text-xs">
  //           <label>{inputFieldProps.label || "Enter Value"}:</label>
  //           <input
  //             type="number"
  //             value={inputFieldProps.value || ""}
  //             onChange={inputFieldProps.onChange}
  //             min={inputFieldProps.min || 0}
  //             placeholder={inputFieldProps.placeholder || "Enter value"}
  //             className="w-full border rounded p-2 mt-2 [&::-webkit-inner-spin-button]:appearance-none"
  //           />
  //         </div>
  //       )}
  //     </div>
  //   </div>
  // );

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
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 translate-y-4 group-hover:translate-y-0 bg-white bg-opacity-70 text-black px-4 py-2 text-sm rounded-md opacity-0 group-hover:opacity-100 transition-all duration-400 shadow-lg pointer-events-none w-full">
          {description}
          {tooltipText && (
            <div className="whitespace-pre-line">
              <Tooltip text={tooltipText}></Tooltip>
            </div>
          )}
        </div>
      </div>
      <div className="grid grid-cols-2 justify-items-start items-start gap-x-1 w-full px-2">
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
                      {/* <PiMinusCircleFill className="" /> */}-
                    </button>
                  )}
                  <input
                    type="number"
                    className="w-10 rounded text-center [&::-webkit-inner-spin-button]:appearance-none  focus:outline-none focus:ring-0 text-xs md:text-[13px] leading-6"
                    value={counterValue}
                    onChange={(e) => onChange(Number(e.target.value))} // Update counterValue on input change
                    min={0}
                  />
                  {roomType !== "reception" && roomType !== "lounge" && (
                    <button
                      className="border-l-2 px-2 font-semibold"
                      onClick={onIncrement}
                    >
                      {/* <PiPlusCircleFill className="" /> */}+
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
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
        <div className="flex justify-start items-center w-full h-full">
          {!showInputField && (showAreaCounter || sizes) && (
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
