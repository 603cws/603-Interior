// src/components/CustomCursor.jsx
import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const cursorRef = useRef(null);
  let mouseX = 0;
  let mouseY = 0;
  let currentX = 0;
  let currentY = 0;

  useEffect(() => {
    const move = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    document.addEventListener("mousemove", move);

    const animate = () => {
      currentX += (mouseX - currentX) * 0.1;
      currentY += (mouseY - currentY) * 0.1;
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${currentX}px, ${currentY}px)`;
      }
      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      document.removeEventListener("mousemove", move);
    };
  }, []);

  return <div className="custom-cursor" ref={cursorRef}></div>;
}
