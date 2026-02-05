import React, { useEffect, useState } from "react";

const Cursor = ({ targetId, isClicking }) => {
  const [position, setPosition] = useState({ x: 400, y: 300 });

  useEffect(() => {
    if (targetId) {
      const element = document.getElementById(targetId);
      if (element) {
        const rect = element.getBoundingClientRect();
        const parent = element.offsetParent?.getBoundingClientRect();
        if (parent) {
          setPosition({
            x: rect.left - parent.left + rect.width / 2,
            y: rect.top - parent.top + rect.height / 2,
          });
        }
      }
    }
  }, [targetId]);

  return (
    <div
      className={`absolute z-50 transition-all duration-700 pointer-events-none ease-in-out ${
        isClicking ? "scale-75" : "scale-100"
      }`}
      style={{
        left: position.x,
        top: position.y,
        transform: `translate(-50%, -50%) ${isClicking ? "scale(0.8)" : "scale(1)"}`,
      }}
    >
      <div
        className={`relative transition-transform duration-150 ${isClicking ? "animate-ping" : ""}`}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-lg"
        >
          <path
            d="M3 3L10.07 19.97L12.58 12.58L19.97 10.07L3 3Z"
            fill="white"
            stroke="black"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
};

export default Cursor;
