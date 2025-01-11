import React, { useState } from "react";
import LayoutCard from "../components/LayoutCard"; // Ensure the correct path to LayoutCard

const supportSpacesData = [
    {
        type: "ups",
        image: "/images/workspace-image/ups.png",
        description: "This is the UPS room, ensuring uninterrupted power supply.",
        tooltipText: "size: 90 sqft",
    },
    {
        type: "bms",
        image: "/images/workspace-image/bms.png",
        description: "This is the BMS room, managing building systems.",
        tooltipText: "size: 90 sqft",
    },
    {
        type: "server",
        image: "/images/workspace-image/server.png",
        description: "This is the server room, housing critical IT infrastructure.",
        tooltipText: "size: 40 sqft",
    },
    {
        type: "executiveWashroom",
        image: "/images/workspace-image/executiveWashroom.png",
        description: "This is the Executive Washroom, providing premium facilities.",
        tooltipText: "size: 60 sqft",
    },
    {
        type: "other",
        image: "/images/workspace-image/other.png",
        description: "This is an additional space for miscellaneous purposes.",
    },
];

const SupportSpaces = ({
    areaQuantities,
    updateAreas,
    isOtherSelected,
    setIsOtherSelected,
    areaValues,
}) => {

    const [otherArea, setOtherArea] = useState(areaValues.other || 0);
    const handleIncrement = (type) => {
        const newValue = (areaQuantities[type] || 0) + 1;
        updateAreas(type, newValue);
    };

    const handleDecrement = (type) => {
        const newValue = (areaQuantities[type] || 0) - 1;
        if (newValue >= 0) {
            updateAreas(type, newValue);
        }
    };

    const handleInputChange = (type, value) => {
        const parsedValue = parseInt(value, 10);
        if (parsedValue >= 0) {
            updateAreas(type, parsedValue);
        }
    };

    const handleOtherAreaChange = (event) => {
        const value = Math.max(0, Number(event.target.value)); // Prevent negative values
        setOtherArea(value);
        setIsOtherSelected(true);
        updateAreas("other", value); // Update the area in the parent component
    };

    return (
        <div className="section px-3">
            <h3 className="section-heading bg-white shadow-sm text-md pl-2 py-1.5 sticky top-0 font-semibold z-10">
                Support Spaces
            </h3>
            <div className="support-spaces grid grid-cols-2">
                {supportSpacesData.map((space) => (
                    <LayoutCard
                        key={space.type}
                        image={space.image}
                        description={space.description}
                        counterValue={areaQuantities[space.type] || 0}
                        onIncrement={() => handleIncrement(space.type)}
                        onDecrement={() => handleDecrement(space.type)}
                        onChange={(value) => handleInputChange(space.type, value)}
                        title={`${space.type.charAt(0).toUpperCase() + space.type.slice(1)}`}
                        showInputField={space.type === "other"}
                        tooltipText={space.tooltipText}
                        inputFieldProps={
                            space.type === "other"
                                ? {
                                    label: "Other Area (sq ft)",
                                    value: otherArea,
                                    onChange: handleOtherAreaChange,
                                    min: 0,
                                    placeholder: "Enter area in sq ft",
                                }
                                : null
                        }
                    />
                ))}
            </div>
        </div>
    );
};

export default SupportSpaces;
