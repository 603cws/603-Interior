import React from "react";
import AreaCounter from "./AreaCounter";
import { PiInfoLight, PiMinusCircleFill, PiPlusCircleFill } from "react-icons/pi";
import Tooltip from "./ToolTip";

const LayoutCard = ({
    image,
    description,
    counterValue,
    onIncrement,
    onDecrement,
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
        <div className="flex flex-col w-[280px] items-center border border-solid bg-[#fff] p-18 my-3">
            {/* Image */}
            <div className="bg-red-400">
                <img src={image} alt={title} className={`object-fit w-full h-56`} />
            </div>
            {/* Content */}
            <div className="flex flex-col mt-2">
                {/* Counter */}
                {!showInputField && (
                    <div className="flex justify-around mt-2 gap-2">
                        <button onClick={onDecrement} >
                            <PiMinusCircleFill size={30} />
                        </button>
                        <div className="w-24 border-2 rounded-xl text-center flex items-center justify-center">{counterValue}</div>
                        <button onClick={onIncrement}>
                            <PiPlusCircleFill size={30} />
                        </button>
                    </div>
                )}
                {/* Size Options */}
                {sizes && (
                    <div className="flex gap-2 text-sm font-bold mt-4 mb-4 justify-around">
                        {sizes.map((size) => (
                            <button
                                key={size}
                                className={`border-2 rounded-full p-1 ${selectedSize === size ? "bg-gray-300" : ""
                                    }`}
                                onClick={() => onSizeChange(size)}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                )}
                {/* Description */}
                <p className="text-center text-sm invisible">{description}</p>
                <p className="text-center font-bold text-sm">{title}</p>
                {/* Tooltip */}
                {tooltipText && (
                    <div className="tooltip-container">
                        {/* Tooltip rendering (if required) */}
                        <Tooltip text={tooltipText}>
                            <div className="w-4 absolute right-4 bottom-4">
                                <PiInfoLight size={25} />
                            </div>
                        </Tooltip>
                    </div>
                )}
                {/* Area Counter */}
                {showAreaCounter && !showInputField && <AreaCounter {...areaCounterProps} />}
                {/* Input Field for "Other Area" */}
                {showInputField && (
                    <div className="other-area-input mt-4">
                        <label>
                            {inputFieldProps.label || "Enter Value"}:
                            <input
                                type="number"
                                value={inputFieldProps.value || ""}
                                onChange={inputFieldProps.onChange}
                                min={inputFieldProps.min || 0}
                                placeholder={inputFieldProps.placeholder || "Enter value"}
                                className="w-full border rounded p-2 mt-2 [&::-webkit-inner-spin-button]:appearance-none"
                            />
                        </label>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LayoutCard;
