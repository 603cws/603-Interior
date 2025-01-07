import React from "react";
import LayoutCard from "../components/LayoutCard";// Reusable LayoutCard component

const cabinData = [
    {
        type: "md",
        image: "/images/md.png",
        description: "This is the MD's cabin, designed for maximum comfort and productivity.",
        slider: {
            name: "MD Cabin Size",
            min: 120,
            max: 240,
            step: 5,
            valueKey: "mdCabinSize",
            setValueKey: "setMdCabinSize",
        },
    },
    {
        type: "manager",
        image: "/images/manager.png",
        description: "This is the Manager's cabin, equipped with all necessary amenities.",
        slider: {
            name: "Manager Cabin Size",
            min: 50,
            max: 180,
            step: 5,
            valueKey: "managerCabinSize",
            setValueKey: "setManagerCabinSize",
        },
    },
    {
        type: "small",
        image: "/images/small.png",
        description: "This is a small cabin, suitable for individual work.",
        slider: {
            name: "Add. Seat Count",
            min: 0,
            max: 24,
            step: 2,
            valueKey: "smallCabinConfig.seatCount",
            setValueKey: "smallCabinConfig.setSeatCount",
            additionalData: {
                roomSizeKey: "smallCabinConfig.roomSize",
                setRoomSizeKey: "smallCabinConfig.setRoomSize",
            },
        },
    },
];


const Cabins = ({
    areaQuantities,
    updateAreas,
    totalArea,
    builtArea,
    initialAreaValues,
    mdCabinSize,
    setMdCabinSize,
    managerCabinSize,
    setManagerCabinSize,
    smallCabinConfig,
}) => {
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

    const handleSliderChange = (key, value) => {
        if (key === "mdCabinSize") setMdCabinSize(value);
        if (key === "managerCabinSize") setManagerCabinSize(value);
        if (key === "smallCabinConfig.seatCount") smallCabinConfig.setSeatCount(value);
        if (key === "smallCabinConfig.roomSize") smallCabinConfig.setRoomSize(value);
    };

    return (
        <div className="section px-3">
            <h3 className="section-heading bg-gray-400">Cabins</h3>
            <div className="cabins grid grid-cols-2">
                {cabinData.map((cabin) => (
                    <LayoutCard
                        key={cabin.type}
                        image={cabin.image}
                        description={cabin.description}
                        counterValue={areaQuantities[cabin.type] || 0}
                        onIncrement={() => handleIncrement(cabin.type)}
                        onDecrement={() => handleDecrement(cabin.type)}
                        title={`${cabin.type.charAt(0).toUpperCase() + cabin.type.slice(1)} Cabin`}
                        tooltipText={
                            cabin.type === "small"
                                ? `Size: ${smallCabinConfig.roomSize} sq ft \nCabin: ${4 + smallCabinConfig.seatCount} seats`
                                : null
                        }
                    // additionalContent={
                    //     cabin.slider && (
                    //         <InteractiveInputSlider
                    //             name={cabin.slider.name}
                    //             value={eval(cabin.slider.valueKey)}
                    //             min2={cabin.slider.min}
                    //             max2={cabin.slider.max}
                    //             step2={cabin.slider.step}
                    //             onChange={(value) => handleSliderChange(cabin.slider.valueKey, value)}
                    //             cabinSize={
                    //                 cabin.slider.additionalData?.roomSizeKey
                    //                     ? eval(cabin.slider.additionalData.roomSizeKey)
                    //                     : eval(cabin.slider.valueKey)
                    //             }
                    //             setCabinSize={(value) =>
                    //                 handleSliderChange(
                    //                     cabin.slider.additionalData?.setRoomSizeKey || cabin.slider.setValueKey,
                    //                     value
                    //                 )
                    //             }
                    //             totalArea={totalArea}
                    //             builtArea={builtArea}
                    //             type={cabin.type}
                    //             initialAreaValues={initialAreaValues}
                    //         />
                    //     )
                    // }
                    />
                ))}
            </div>
        </div>
    );
};

export default Cabins;
