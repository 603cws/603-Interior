import LayoutCard from "../components/LayoutCard";
import { initialAreaValues } from "../utils/Constants";
import { publicSpacesData } from "../utils/WorkspaceConstants";

const PublicSpaces = ({
  areaQuantities,
  updateAreas,
  totalArea,
  builtArea,
  receptionSize,
  setReceptionSize,
  loungeSize,
  setLoungeSize,
  breakoutRoomSize,
  setBreakoutRoomSize,
  washroomsSize,
  setWashroomsSize,
}) => {
  const valueResolver = {
    receptionSize,
    setReceptionSize,
    loungeSize,
    setLoungeSize,
    breakoutRoomSize,
    setBreakoutRoomSize,
    washroomsSize,
    setWashroomsSize,
  };
  return (
    <div className="section px-3">
      <h3 className="section-heading bg-[#E4E7ED] shadow-sm text-md pl-2 py-1 sticky top-0 font-semibold z-10">
        Public Spaces
      </h3>
      <div className="public-spaces grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 3xl:grid-cols-3 gap-5 justify-items-center lg:justify-items-stretch">
        {publicSpacesData.map((space) => {
          let sliderProps = null;
          if (space.slider) {
            const { valueKey, setValueKey } = space.slider;
            const value = valueResolver[valueKey] ?? 0;
            const onChange = valueResolver[setValueKey] ?? (() => {});
            sliderProps = {
              name: space.slider.name,
              value,
              onChange,
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
                : space.type === "washrooms"
                ? {
                    cabinSize: washroomsSize,
                    setCabinSize: setWashroomsSize,
                  }
                : {}),
            };
          }

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
              title={space.title || space.type}
              showAreaCounter={!!space.slider} // Show counter only if space has a slider
              areaCounterProps={sliderProps}
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
