import LayoutCard from "../components/LayoutCard"; // Ensure the correct path to LayoutCard

const cabinData = [
  {
    type: "md",
    image: "/images/workspace-image/md.png",
    // image: "/images/workstation-wp/md-wp.webp",
    description:
      "This is the MD's cabin, designed for maximum comfort and productivity.",
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
    image: "/images/workspace-image/manager.webp",
    // image: "/images/workstation-wp/manager-wp.webp",
    description:
      "This is the Manager's cabin, equipped with all necessary amenities.",
    slider: {
      name: "Manager Cabin Size",
      min: 80,
      max: 180,
      step: 5,
      valueKey: "managerCabinSize",
      setValueKey: "setManagerCabinSize",
    },
  },
  {
    type: "small",
    image: "/images/workspace-image/small.png",
    // image: "/images/workstation-wp/small-wp.webp",
    description: "This is a small cabin, suitable for individual work.",
    tooltipText: "Size :80 sqft",
    slider: {
      name: "Add Extra Seats",
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
  mdCabinSize,
  setMdCabinSize,
  smallCabinConfig,
  totalArea,
  builtArea,
  initialAreaValues,
  managerCabinSize,
  setManagerCabinSize,
  smallCabinSeatCount,
}) => {
  return (
    <div className="section px-3">
      <h3 className="section-heading bg-white shadow-sm text-md pl-2 py-1.5 sticky top-0 font-semibold z-10">
        Cabins
      </h3>
      {/* <div className="cabins grid grid-cols-2 4xl:grid-cols-3 gap-5"> */}
      <div className="cabins grid grid-cols-2 3xl:grid-cols-3 gap-5 justify-items-center lg:justify-items-stretch">
        {cabinData.map((room) => (
          <LayoutCard
            key={room.type}
            image={room.image}
            description={room.description}
            counterValue={areaQuantities[room.type] || 0}
            onIncrement={() =>
              updateAreas(room.type, (areaQuantities[room.type] || 0) + 1)
            }
            onDecrement={() => {
              const newValue = (areaQuantities[room.type] || 0) - 1;
              if (newValue >= 0) {
                updateAreas(room.type, newValue);
              }
            }}
            onChange={(value) => updateAreas(room.type, value)}
            title={`${
              room.type.charAt(0).toUpperCase() + room.type.slice(1)
            } Cabin`}
            showAreaCounter
            tooltipText={
              room.type === "md"
                ? `Size: ${mdCabinSize} sq ft`
                : room.type === "manager"
                ? `Size: ${managerCabinSize} sq ft`
                : room.type === "small"
                ? `Size: ${smallCabinConfig.roomSize || "80"} sq ft \n Seats: ${
                    4 + smallCabinSeatCount
                  } pax`
                : "Size: Not available"
            }
            areaCounterProps={
              room.slider
                ? {
                    name: room.slider.name,
                    value:
                      room.type === "md"
                        ? mdCabinSize
                        : room.type === "manager"
                        ? managerCabinSize
                        : smallCabinConfig.seatCount,
                    onChange:
                      room.type === "md"
                        ? setMdCabinSize
                        : room.type === "manager"
                        ? setManagerCabinSize
                        : smallCabinConfig.setSeatCount,
                    min2: room.slider.min,
                    max2: room.slider.max,
                    step2: room.slider.step,
                    totalArea,
                    builtArea,
                    type: room.type,
                    initialAreaValues,
                    ...(room.type === "small"
                      ? {
                          cabinSize: smallCabinConfig.roomSize,
                          setCabinSize: smallCabinConfig.setRoomSize,
                          seatCount: smallCabinConfig.seatCount,
                          setSeatCount: smallCabinConfig.setSeatCount,
                        }
                      : {
                          cabinSize:
                            room.type === "md" ? mdCabinSize : managerCabinSize,
                          setCabinSize:
                            room.type === "md"
                              ? setMdCabinSize
                              : setManagerCabinSize,
                        }),
                  }
                : null
            }
          />
        ))}
      </div>
    </div>
  );
};

export default Cabins;
