import LayoutCard from "../components/LayoutCard";
import { initialAreaValues } from "../utils/Constants";
import { cabinData } from "../utils/WorkspaceConstants";

const Cabins = ({
  areaQuantities,
  updateAreas,
  mdCabinSize,
  setMdCabinSize,
  smallCabinConfig,
  totalArea,
  builtArea,
  managerCabinSize,
  setManagerCabinSize,
}) => {
  return (
    <div className="section px-3">
      <h3 className="section-heading bg-[#E4E7ED] shadow-sm text-md pl-2 py-1 sticky top-0 font-semibold z-10">
        Cabins
      </h3>
      <div className="cabins grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 3xl:grid-cols-3 gap-5 justify-items-center lg:justify-items-stretch">
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
            title={room.title || room.type}
            showAreaCounter
            tooltipText={
              room.type === "md"
                ? `Size: ${mdCabinSize} sq ft`
                : room.type === "manager"
                ? `Size: ${managerCabinSize} sq ft`
                : room.type === "small"
                ? `Size: ${smallCabinConfig.roomSize || "80"} sq ft \n Seats: ${
                    smallCabinConfig.seatCount
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
