import React from 'react';

const AreaCounter = ({ name, value, onChange, min2, max2, step2, cabinSize, setCabinSize, totalArea, builtArea, type, initialAreaValues }) => {
    const min = min2;
    const max = max2;
    const step = step2;
    const freeSpace = totalArea * 0.05; // 5% of totalArea
    const usableArea = totalArea - freeSpace; // Area available for building

    const handleIncrement = () => {
        if (value < max && totalArea > 0 && builtArea <= usableArea) {
            onChange(value + step);
            if (type === 'financeRoom') {
                setCabinSize(cabinSize + 50)
            } else if (type === 'md' || type === 'manager' || type === "reception" || type === "lounge") {
                setCabinSize(cabinSize + 5)
            } else if (type === "conferenceRoom" || type === "boardRoom") {
                setCabinSize(cabinSize + 25)
            } else {
                setCabinSize(cabinSize + 40)
            }
        }
    };

    const handleDecrement = () => {
        if (value > min && totalArea > 0 && cabinSize > initialAreaValues[type]) {
            onChange(value - step);
            if (type === 'financeRoom' || type === 'boardRoom' || type === 'conferenceRoom') {
                setCabinSize(cabinSize - 50)
            } else if (type === 'md' || type === 'manager' || type === "reception" || type === "lounge") {
                setCabinSize(cabinSize - 5)
            } else {
                setCabinSize(cabinSize - 40)
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
            <label htmlFor="md-cabin-size">{name}: </label>
            <div className="md-cabin-btn">
                <button onClick={handleDecrement} className="slider-button bg-gray-400 px-2 rounded-md">-</button>
                <input
                    type="number"
                    min={min}
                    max={max}
                    step={step}
                    value={value}
                    onChange={handleInputChange}
                    className="border-2 text-center mx-2 rounded-md [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <button onClick={handleIncrement} className="slider-button px-2 bg-gray-400 rounded-md">+</button>
            </div>
            {/* <div className="progress-bar-container">
                <div className="progress-bar" style={{ width: `${((value - min) / (max - min)) * 100}%` }}></div>
            </div> */}
        </div>
    );
};

export default AreaCounter;