import LayoutCard from "../components/LayoutCard"; // Ensure the correct path to LayoutCard.js

const publicSpacesData = [
  {
    type: "reception",
    image: "/images/workspace-image/reception.png",
    // image: "/images/workstation-wp/reception-wp.webp",
    description:
      "This is the reception area, the first point of contact for visitors.",
    slider: {
      name: "Reception Size",
      valueKey: "receptionSize",
      setValueKey: "setReceptionSize",
      min: 50,
      max: 700,
      step: 5,
    },
  },
  {
    type: "lounge",
    image: "/images/workspace-image/lounge.webp",
    // image: "/images/workstation-wp/lounge-wp.webp",
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
    // image: "/images/workstation-wp/phoneBooth-wp.webp",
    description: "This is the phone booth, providing a quiet space for calls.",
    tooltipText: "Size: 25 sq ft",
  },
  {
    type: "breakoutRoom",
    image: "/images/workspace-image/breakout.webp",
    // image: "/images/workstation-wp/breakout-wp.webp",
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
    tooltipText: "size: 80 sqft",
  },
  //   type: "maleWashroom",
  // {
  //   image: "/images/workstation-wp/executivewash-wp.webp",
  //   description: "Common Male washroom",
  //   tooltipText: "size: 100 sqft",
  //   slider: {
  //     name: "Male Washroom Size",
  //     valueKey: "maleWashroomSize",
  //     setValueKey: "setMaleWashroomSize",
  //     min: 60,
  //     max: 600,
  //     step: 5,
  //   },
  // },
  // {
  //   type: "femaleWashroom",
  //   image: "/images/workstation-wp/executivewash-wp.webp",
  //   description: "Common Female  washroom",
  //   tooltipText: "size: 100 sqft",
  //   slider: {
  //     name: "Female Washroom Size",
  //     valueKey: "femaleWashroomSize",
  //     setValueKey: "setFemaleWashroomSize",
  //     min: 60,
  //     max: 600,
  //     step: 5,
  //   },
  // },
  {
    type: "washrooms",
    image: "/images/workspace-image/washroom.png",
    description:
      "Common Washroom Area – This includes designated spaces for both male and female washrooms.",
    tooltipText: "size: 100 sqft",
    slider: {
      name: "Washroom Size",
      valueKey: "washroomsSize",
      setValueKey: "setWashroomsSize",
      min: 100,
      max: 1200,
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
  // maleWashroomSize,
  // setMaleWashroomSize,
  // femaleWashroomSize,
  // setFemaleWashroomSize,
  washroomsSize,
  setWashroomsSize,
}) => {
  return (
    <div className="section px-3">
      <h3 className="section-heading bg-white shadow-sm text-md pl-2 py-1.5 sticky top-0 font-semibold z-10">
        Public Spaces
      </h3>
      {/* <div className="public-spaces grid grid-cols-2 4xl:grid-cols-3 gap-5"> */}
      <div className="public-spaces grid grid-cols-2 3xl:grid-cols-3 gap-5 justify-items-center lg:justify-items-stretch">
        {publicSpacesData.map((space) => {
          const sliderProps = space.slider
            ? {
                name: space.slider.name,
                value: space.slider.valueKey
                  ? eval(space.slider.valueKey) // Dynamically evaluate the value (e.g., videoRecordingRoomSize)
                  : 0, // Default to 0 if no dynamic value is found
                onChange: space.slider.setValueKey
                  ? eval(space.slider.setValueKey) // Dynamically evaluate the setter function (e.g., setVideoRecordingRoomSize)
                  : () => {}, // Default empty function if no setter is provided
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
                  : // : space.type === "maleWashroom"
                  // ? {
                  //     cabinSize: maleWashroomSize,
                  //     setCabinSize: setMaleWashroomSize,
                  //   }
                  // : space.type === "femaleWashroom"
                  // ? {
                  //     cabinSize: femaleWashroomSize,
                  //     setCabinSize: setFemaleWashroomSize,
                  //   }
                  space.type === "washrooms"
                  ? {
                      cabinSize: washroomsSize,
                      setCabinSize: setWashroomsSize,
                    }
                  : {}),
              }
            : null;

          return (
            <LayoutCard
              key={space.type}
              roomType={space.type}
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
              // tooltipText={space.tooltipText}
              tooltipText={
                space.type === "washrooms"
                  ? `Size: ${washroomsSize || 100} sq ft `
                  : space.type === "breakoutRoom"
                  ? `Size: ${breakoutRoomSize || 80} sq ft`
                  : space.type === "reception"
                  ? `Size: ${receptionSize || 80} sq ft`
                  : space.type === "lounge"
                  ? `Size: ${loungeSize || 80} sq ft`
                  : space.tooltipText
              }
            />
          );
        })}
      </div>
    </div>
  );
};

export default PublicSpaces;
