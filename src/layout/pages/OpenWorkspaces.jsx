import React, { useState } from 'react';
import LayoutCard from '../components/LayoutCard';

const workspaceData = [
    {
        type: "linear",
        image: "/images/linear.png",
        description: "This is a linear workspace, designed for open collaboration.",
        sizes: ["M", "L", "XL"], // Corresponds to sizeMapping keys
        tooltipText: "Size: 20 sq ft", // Default tooltip text for Linear Workstation
        title: "Linear Workstation",
    },
    {
        type: "lType",
        image: "/images/lType.png",
        description: "This is an L-type workspace, providing a semi-private environment.",
        sizes: null, // No size options
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

const sizeArea = {
    M: "20 sq ft",
    L: "24 sq ft",
    XL: "29 sq ft",
    lType: "34 sq ft",
};

function OpenWorkspaces({ areaQuantities, variant, updateAreas, onVariantChange }) {
    const [selectedSize, setSelectedSize] = useState(variant);

    const handleSizeChange = (newSize, type) => {
        if (type === "linear") {
            setSelectedSize(newSize);
            onVariantChange(newSize); // Notify parent if needed
        }
    };

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

    return (
        <div className='section px-3'>
            <h3 className='section-heading bg-white shadow-sm text-md pl-2 py-1.5 sticky top-0 font-semibold'>Open Workspaces</h3>
            <div className="open-workspaces grid grid-cols-2">
                {workspaceData.map((workspace) => (
                    <LayoutCard
                        key={workspace.type}
                        image={workspace.image}
                        description={workspace.description}
                        counterValue={areaQuantities[workspace.type] || 0}
                        onIncrement={() => handleIncrement(workspace.type)}
                        onDecrement={() => handleDecrement(workspace.type)}
                        sizes={workspace.sizes}
                        selectedSize={workspace.type === "linear" ? selectedSize : null} // Only for Linear Workstation
                        onSizeChange={(size) => handleSizeChange(size, workspace.type)}
                        tooltipText={
                            workspace.type === "linear"
                                ? sizeArea[selectedSize] || workspace.tooltipText
                                : workspace.tooltipText
                        }
                        title={`${workspace.title} ${workspace.type === "linear" ? sizeMapping[selectedSize] || '' : ''}`}
                    />
                ))}
            </div>
        </div>
    );
}

export default OpenWorkspaces;
