import React from "react";
import LayoutCard from "../components/LayoutCard"; // Ensure the correct path to LayoutCard.js

const publicSpacesData = [
  {
    type: "reception",
    image: "/images/workspace-image/reception.png",
    description:
      "This is the reception area, the first point of contact for visitors.",
    slider: {
      name: "Reception Size",
      valueKey: "receptionSize",
      setValueKey: "setReceptionSize",
      min: 80,
      max: 700,
      step: 5,
    },
  },
  {
    type: "lounge",
    image: "/images/workspace-image/lounge.png",
    description:
      "This is the lounge, a comfortable area for informal meetings.",
    slider: {
      name: "Lounge Size",
      valueKey: "loungeSize",
      setValueKey: "setLoungeSize",
      min: 80,
      max: 1000,
      step: 5,
    },
  },
  {
    type: "phoneBooth",
    image: "/images/workspace-image/phoneBooth.png",
    description: "This is the phone booth, providing a quiet space for calls.",
    tooltipText: "size: 25 sqft",
  },
  {
    type: "breakoutRoom",
    image: "/images/workspace-image/breakout.png",
    description:
      "This is the breakout room, a flexible space for small group discussions.",
    slider: {
      name: "Breakout Room Size",
      valueKey: "breakoutRoomSize",
      setValueKey: "setBreakoutRoomSize",
      min: 80,
      max: 160,
      step: 5,
    },
  },
];

const PublicSpaces = ({
  areaQuantities,
  updateAreas,
  totalArea,
  builtArea,
  initialAreaValues,
  receptionSize,
  setReceptionSize,
  loungeSize,
  setLoungeSize,
  breakoutRoomSize,
  setBreakoutRoomSize,
}) => {
  return (
    <div className="section px-3">
      <h3 className="section-heading bg-white shadow-sm text-md pl-2 py-1.5 sticky top-0 font-semibold z-10">
        Public Spaces
      </h3>
            <div className="public-spaces grid grid-cols-2 2xl:grid-cols-3 gap-5">
        {publicSpacesData.map((space) => {
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
                ...(space.type === "reception"
                  ? {
                      cabinSize: receptionSize,
                      setCabinSize: setReceptionSize,
                    }
                  : space.type === "lounge"
                  ? {
                      cabinSize: loungeSize,
                      setCabinSize: setLoungeSize,
                    }
                  : space.type === "breakoutRoom"
                  ? {
                      cabinSize: breakoutRoomSize,
                      setCabinSize: setBreakoutRoomSize,
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
              showAreaCounter={!!space.slider} // Show counter only if space has a slider
              areaCounterProps={sliderProps}
              tooltipText={space.tooltipText}
            />
          );
        })}
      </div>
    </div>
  );
};

export default PublicSpaces;
