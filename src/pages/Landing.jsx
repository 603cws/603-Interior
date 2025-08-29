import React, { useState, useEffect } from "react";
import LandingNavbar from "../common-components/LandingNavbar";
import { motion } from "framer-motion";
import { AnimatedButton } from "../common-components/animated-button";
import { useNavigate } from "react-router-dom";
function Landing() {
  const navigate = useNavigate();
  const heroImages = [
    "/images/home/Hero-image-1.jpg",
    "/images/home/Hero-image-2.jpg",
    "/images/home/Hero-image-3.jpg",
    "/images/home/Hero-image-4.jpg",
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [heroImages.length]);
  return (
    <>
      <section className="h-screen flex flex-col">
        <LandingNavbar />
        <div className="flex-1 flex items-center relative ">
          <div className="absolute inset-0">
            {heroImages.map((src, index) => (
              <motion.div
                key={index}
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${src})` }}
                initial={{ opacity: 0 }}
                animate={{ opacity: currentImageIndex === index ? 1 : 0 }}
                transition={{ duration: 2 }}
              />
            ))}
            <div className="absolute inset-0 bg-gradient-to-r from-[#304778]/70 to-[#FFFFFF]/0" />
          </div>
          <div className="px-4 mx-auto lg:container">
            <motion.div
              initial={{ x: "-50%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 2, ease: "easeOut" }}
              className="relative"
            >
              <h1 className="text-[#fff] text-5xl md:text-7xl xl:text-8xl font-bold italic capitalize font-TimesNewRoman">
                Transform your <br /> office space with
                <br />
                <span className="text-[#FFC900]"> smart planning</span>
              </h1>
              <button onClick={() => navigate("/layout")}>
                <AnimatedButton
                  className="!bg-[#3A5D7B] text-white capitalize font-Georgia mt-7 text-lg"
                  variant="default"
                  size="lg"
                  // glow={true}
                  textEffect="shimmer"
                  rounded="custom"
                  asChild={false}
                  hideAnimations={false}
                  shimmerColor="#fff"
                  shimmerSize="0.15em"
                  shimmerDuration="3s"
                  borderRadius="10px"
                  background="rgba(48, 71, 120, 1)"
                >
                  make your space
                </AnimatedButton>
              </button>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Landing;
