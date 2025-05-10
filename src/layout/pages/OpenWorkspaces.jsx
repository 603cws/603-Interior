import React, { useState } from "react";
import LayoutCard from "../components/LayoutCard";
import { useApp } from "../../Context/Context";
import ErrorModal from "../../common-components/ErrorModal";

const workspaceData = [
  {
    type: "linear",
    image: "/images/workspace-image/linear.png",
    // image: "/images/workstation-wp/linear-wp.webp",
    description: "This is a linear workspace, designed for open collaboration.",
    sizes: ["M", "L", "XL"], // Corresponds to sizeMapping keys
    tooltipText:
      "M: 3 X 2 ft (20 sq ft) \n L: 3.5 X 2 ft (24 sq ft) \n XL: 4 X 2 ft (29 sq ft)", // Default tooltip text for Linear Workstation
    title: "Linear Workstation",
  },
  {
    type: "lType",
    image: "/images/workspace-image/lType.png",
    // image: "/images/workstation-wp/ltype-wp.webp",
    description:
      "This is an L-type workspace, providing a semi-private environment.",
    // sizes: [], // No size options
    tooltipText: "Size: 34 sq ft",
    title: "L-Type Workstation",
  },
];

const sizeMapping = {
  M: "3 X 2",
  L: "3.5 X 2",
  XL: "4 X 2",
  lType: "5 X 4",
};

// const sizeArea = {
//   M: "20 sq ft",
//   L: "24 sq ft",
//   XL: "29 sq ft",
//   lType: "34 sq ft",
// };

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
  // const [selectedSize, setSelectedSize] = useState(variant);
  const [showError, setShowError] = useState(false);

  const { totalArea } = useApp();

  // const handleSizeChange = (newSize, type) => {
  //   if (type === "linear") {
  //     setSelectedSize(newSize);
  //     onVariantChange(newSize); // Notify parent if needed
  //   }
  // };

  console.log(
    "variant in open workspaces",
    variant,
    "selected size in open workspaces"
    // selectedSize
  );

  const handleSizeChange = (newSize, type, noOfLinearStation) => {
    console.log("newSize", newSize);
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
  console.log("selectedSize", variant);
  return (
    <div className="section px-3">
      <h3 className="section-heading bg-white shadow-sm text-md pl-2 py-1.5 sticky top-0 font-semibold z-10">
        Open Workspaces
      </h3>
      {/* <div className="open-workspaces grid grid-cols-2 4xl:grid-cols-3 gap-5"> */}
      <div className="open-workspaces grid grid-cols-2 3xl:grid-cols-3 gap-5 justify-items-center lg:justify-items-stretch">
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
            // tooltipText={
            //   workspace.type === "linear"
            //     ? sizeArea[selectedSize] || workspace.tooltipText
            //     : workspace.tooltipText
            // }
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
