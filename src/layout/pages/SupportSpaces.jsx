import LayoutCard from "../components/LayoutCard";
import { initialAreaValues } from "../utils/Constants";
import { supportSpacesData } from "../utils/WorkspaceConstants";
import { useBoqApp } from "../../Context/BoqContext";

const SupportSpaces = ({
  builtArea,
  areaQuantities,
  updateAreas,
  otherArea,
  setOtherArea,
  upsRoomSize,
  setUpsRoomSize,
  bmsRoomSize,
  setBmsRoomSize,
}) => {
  const { totalArea } = useBoqApp();
  const handleOtherAreaChange = (event) => {
    const value = Math.max(0, Number(event.target.value)); // Prevent negative values
    setOtherArea(value);
    updateAreas("other", value); // Update the area in the parent component
  };

  return (
    <div className="section px-3">
      <h3 className="section-heading bg-[#E4E7ED] shadow-sm text-md pl-2 py-1 sticky top-0 font-semibold z-10">
        Support Spaces
      </h3>
      <div className="support-spaces grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 3xl:grid-cols-3 gap-5 justify-items-center lg:justify-items-stretch">
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
              title={space.title || space.type}
              showInputField={space.type === "other"}
              tooltipText={
                space.type === "ups"
                  ? `Size: ${upsRoomSize || 60} sq ft `
                  : space.type === "bms"
                  ? `Size ${bmsRoomSize || 60} sq ft`
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
