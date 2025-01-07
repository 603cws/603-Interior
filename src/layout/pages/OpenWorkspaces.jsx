import React, { useState } from 'react'
import LayoutCard from '../components/LayoutCard'

const workspaceData = [
    {
        type: "linear",
        image: "/images/linear.png",
        description: "This is a linear workspace, designed for open collaboration.",
        sizes: ["M", "L", "XL"],
        tooltipText: "Size: 20 sq ft",
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


function OpenWorkspaces({ areaQuantities, variant, updateAreas, onVariantChange }) {
    const [selectedSize, setSelectedSize] = useState(variant);


    const handleSizeChange = (e) => {
        const newSize = e.target.value;
        setSelectedSize(newSize);
        onVariantChange(newSize);
    };

    const handleIncrement = (type) => {
        const newValue = (areaQuantities[type] || 0) + 1;
        updateAreas(type, newValue);
    };

    const handleDecrement = (type) => {
        const newValue = (areaQuantities[type] || 0) - 1;
        if (newValue >= 0) {
            updateAreas(type, newValue);
        } else {
            //alert("Negative values are not allowed.");
        }
    };


    return (
        <div className='section px-3'>
            <h3 className='section-heading bg-gray-400 font-bold'>Open Workspaces</h3>
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
                        selectedSize={selectedSize}
                        onSizeChange={handleSizeChange}
                        tooltipText={workspace.tooltipText}
                        title={workspace.title}
                    />
                ))}
            </div>
        </div>
    )
}

export default OpenWorkspaces