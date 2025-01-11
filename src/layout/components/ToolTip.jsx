import React from 'react';

const Tooltip = ({ text, children }) => {
    return (
        <div className="group">
            {/* Child Element */}
            {children}

            {/* Tooltip Text */}
            <div className="absolute bg-gray-700 text-white text-sm px-2 py-1 rounded opacity-0 transition-opacity duration-200 pointer-events-none bottom-7 -right-5 transform -translate-x-1/2 group-hover:opacity-100 z-10">
                {text}
            </div>
        </div>
    );
};

export default Tooltip;
