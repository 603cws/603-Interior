import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function DoorToRoomScroll() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref });

  // Scale the door (zoom effect)
  const doorScale = useTransform(scrollYProgress, [0, 0.4], [1, 3]);
  const doorOpacity = useTransform(scrollYProgress, [0.35, 0.4], [1, 0]);

  // Scale the room (smooth transition from small to full screen)
  const roomScale = useTransform(scrollYProgress, [0.4, 0.55], [0.5, 1]);
  const roomOpacity = useTransform(scrollYProgress, [0.35, 0.55], [0, 1]);

  // Move the room upward and out of view when scrolling down
  const roomTranslateY = useTransform(
    scrollYProgress,
    [0.55, 0.7],
    ["0%", "-100%"]
  );

  // Background color transition from black → white
  const bgColor = useTransform(scrollYProgress, [0.55, 0.6], ["#000", "#fff"]);

  return (
    <motion.div
      ref={ref}
      className="h-[500vh]"
      style={{ backgroundColor: bgColor }}
    >
      {/* Door Zoom-In Effect */}
      <div className="sticky top-0 h-screen flex justify-center items-center overflow-hidden">
        <motion.img
          src="/images/door.png" // Replace with the door image
          alt="Door"
          style={{ scale: doorScale, opacity: doorOpacity }}
          className="w-full h-auto"
        />
      </div>

      {/* Room Appears and Zooms In */}
      <motion.div
        className="sticky top-0 h-screen flex justify-center items-center overflow-hidden"
        style={{ y: roomTranslateY }}
      >
        <motion.img
          src="/images/room.png" // Replace with the room interior image
          alt="Room Interior"
          style={{ scale: roomScale, opacity: roomOpacity }}
          className="w-screen h-screen"
        />
      </motion.div>

      {/* Content Appears and Stays */}
      <div className="h-[200vh] flex flex-col justify-center items-center text-black">
        <h1 className="text-4xl mb-10">Welcome Inside</h1>
        <p className="text-xl">Now the page scrolls normally in Y-axis.</p>
      </div>
    </motion.div>
  );
}
