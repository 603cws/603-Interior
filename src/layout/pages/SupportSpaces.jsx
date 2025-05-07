import React from "react";
import LayoutCard from "../components/LayoutCard"; // Ensure the correct path to LayoutCard
import { useApp } from "../../Context/Context";

const supportSpacesData = [
  {
    type: "ups",
    image: "/images/workspace-image/ups.png",
    // image: "/images/workstation-wp/ups-wp.webp",
    description: "This is the UPS room, ensuring uninterrupted power supply.",
    slider: {
      name: "UPS Room Size",
      valueKey: "upsRoomSize",
      setValueKey: "setUpsRoomSize",
      min: 60,
      max: 100,
      step: 5,
    },
    tooltipText: "size: 60 sqft",
  },
  {
    type: "bms",
    image: "/images/workspace-image/bms.png",
    // image: "/images/workstation-wp/BMS-WP.webp",
    description: "This is the BMS room, managing building systems.",
    slider: {
      name: "BMS Room Size",
      valueKey: "bmsRoomSize",
      setValueKey: "setBmsRoomSize",
      min: 60,
      max: 100,
      step: 5,
    },
    tooltipText: "size: 60 sqft",
  },
  {
    type: "server",
    image: "/images/workspace-image/server.png",
    // image: "/images/workstation-wp/serverRoom-wp.webp",
    description: "This is the server room, housing critical IT infrastructure.",
    tooltipText: "size: 40 sqft",
  },
  {
    type: "executiveWashroom",
    image: "/images/workspace-image/executiveWashroom.png",
    // image: "/images/workstation-wp/executivewash-wp.webp",
    description:
      "This is the Executive Washroom, providing premium facilities.",
    tooltipText: "size: 60 sqft",
  },
  {
    type: "other",
    image: "/images/workspace-image/other.png",
    // image: "/images/workstation-wp/other-wp.webp",
    description: "This is an additional space for miscellaneous purposes.",
  },
];

const SupportSpaces = ({
  builtArea,
  initialAreaValues,
  areaQuantities,
  updateAreas,
  // areaValues,
  // warning,
  otherArea,
  setOtherArea,
  upsRoomSize,
  setUpsRoomSize,
  bmsRoomSize,
  setBmsRoomSize,
}) => {
  const { totalArea } = useApp();
  const handleOtherAreaChange = (event) => {
    const value = Math.max(0, Number(event.target.value)); // Prevent negative values
    setOtherArea(value);
    updateAreas("other", value); // Update the area in the parent component
  };

  return (
    <div className="section px-3">
      <h3 className="section-heading bg-white shadow-sm text-md pl-2 py-1.5 sticky top-0 font-semibold z-10">
        Support Spaces
      </h3>
      {/* <div className="support-spaces grid grid-cols-2 4xl:grid-cols-3 gap-5"> */}
      <div className="support-spaces grid grid-cols-2 3xl:grid-cols-3 gap-5 justify-items-center lg:justify-items-stretch">
        {supportSpacesData.map((space) => {
          const sliderProps = space.slider
            ? {
                name: space.slider.name,
                value: eval(space.slider.valueKey) || 0,
                onChange: eval(space.slider.setValueKey),
                min2: space.slider.min,
                max2: space.slider.max,
                step2: space.slider.step,
                totalArea,
                builtArea,
                initialAreaValues,
                type: space.type,
                ...(space.type === "ups"
                  ? {
                      cabinSize: upsRoomSize,
                      setCabinSize: setUpsRoomSize,
                    }
                  : space.type === "bms"
                  ? {
                      cabinSize: bmsRoomSize,
                      setCabinSize: setBmsRoomSize,
                    }
                  : {}),
              }
            : null;
          return (
            <LayoutCard
              key={space.type}
              image={space.image}
              description={space.description}
              counterValue={areaQuantities[space.type] || 0}
              onIncrement={() =>
                updateAreas(space.type, (areaQuantities[space.type] || 0) + 1)
              }
              onDecrement={() => {
                const newValue = (areaQuantities[space.type] || 0) - 1;
                if (newValue >= 0) {
                  updateAreas(space.type, newValue);
                }
              }}
              onChange={(value) => updateAreas(space.type, value)}
              title={`${
                space.type.charAt(0).toUpperCase() + space.type.slice(1)
              }`}
              showInputField={space.type === "other"}
              tooltipText={
                space.type === "ups"
                  ? `Size: ${upsRoomSize || 60} sqft `
                  : space.type === "bms"
                  ? `Size ${bmsRoomSize || 60} sqft`
                  : space.tooltipText
              }
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
              showAreaCounter={!!space.slider}
              areaCounterProps={sliderProps}
            />
          );
        })}
      </div>
    </div>
  );
};

export default SupportSpaces;
