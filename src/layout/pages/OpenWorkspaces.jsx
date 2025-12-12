import { useState } from "react";
import LayoutCard from "../components/LayoutCard";
import { useApp } from "../../Context/Context";
import ErrorModal from "../../common-components/ErrorModal";
import { workspaceData } from "../utils/WorkspaceConstants";

const sizeMapping = {
  M: "3 X 2",
  L: "3.5 X 2",
  XL: "4 X 2",
  lType: "5 X 4",
};

const sizeAreaMapping = {
  M: 20,
  L: 24,
  XL: 29,
};

function OpenWorkspaces({
  areaQuantities,
  variant,
  setVariant,
  updateAreas,
  onVariantChange,
  builtArea,
}) {
  const [showError, setShowError] = useState(false);

  const { totalArea } = useApp();

  const handleSizeChange = (newSize, type, noOfLinearStation) => {
    const newSizeArea = sizeAreaMapping[newSize];
    const prevSizeArea = sizeAreaMapping[variant];
    const newBuiltArea =
      builtArea -
      prevSizeArea * noOfLinearStation +
      newSizeArea * noOfLinearStation;

    if (type === "linear") {
      if (newBuiltArea > totalArea) {
        setShowError(true);
        return;
      }
      setVariant(newSize);
      onVariantChange(newSize);
    }
  };
  return (
    <div className="section px-3">
      <h3 className="section-heading bg-[#E4E7ED] shadow-sm text-md pl-2 py-1 sticky top-0 font-semibold z-10">
        Open Workspaces
      </h3>
      <div className="open-workspaces grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 3xl:grid-cols-3 gap-5 justify-items-center lg:justify-items-stretch">
        {workspaceData.map((workspace) => (
          <LayoutCard
            key={workspace.type}
            name={workspace.type}
            image={workspace.image}
            description={workspace.description}
            counterValue={areaQuantities[workspace.type] || 0}
            onIncrement={() =>
              updateAreas(
                workspace.type,
                (areaQuantities[workspace.type] || 0) + 1
              )
            }
            onDecrement={() => {
              const newValue = (areaQuantities[workspace.type] || 0) - 1;
              if (newValue >= 0) {
                updateAreas(workspace.type, newValue);
              }
            }}
            onChange={(newValue) => updateAreas(workspace.type, newValue)}
            sizes={workspace.sizes}
            selectedSize={workspace.type === "linear" ? variant : null} // Only for Linear Workstation
            onSizeChange={(size) =>
              handleSizeChange(
                size,
                workspace.type,
                areaQuantities[workspace.type]
              )
            }
            tooltipText={workspace.tooltipText}
            title={`${workspace.title} ${
              workspace.type === "linear"
                ? sizeMapping[variant] || ""
                : workspace.type === "lType"
                ? sizeMapping.lType
                : ""
            }`}
          />
        ))}
      </div>
      {showError && (
        <ErrorModal
          message="Selected size exceeds total area!"
          onclose={() => setShowError(false)}
        />
      )}
    </div>
  );
}

export default OpenWorkspaces;
