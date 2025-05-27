import React from "react";

export default function ReadMoreBtn({ borderColor = "[#000000]", onClick }) {
  return (
    <div>
      <button
        onClick={onClick}
        className={`capitalize border-2 border-${borderColor} px-4 py-1.5 relative group`}
      >
        <span
          className={`w-2 h-2 absolute top-0 left-0 -translate-x-full -translate-y-full border-b-2 border-r-2 border-${borderColor}`}
        ></span>
        <span
          className={`w-2 h-2 absolute bottom-0 right-0 translate-x-full translate-y-full border-l-2 border-t-2 border-${borderColor}`}
        ></span>
        read more
      </button>
    </div>
  );
}
