import React from "react";

const Tooltip = ({ text, children }) => {
  return (
    <div className="group">
      {/* Child Element */}
      {children}

      {/* Tooltip Text */}
      <div className="absolute bg-black bg-opacity-75 text-white w-3/5 text-right text-xs md:text-sm px-2 py-1 rounded opacity-0 transition-opacity duration-200 pointer-events-none bottom-6 md:bottom-8 right-1 md:right-5 transform group-hover:opacity-100 z-10 whitespace-pre-wrap">
        {text}
      </div>
    </div>
  );
};

export default Tooltip;
