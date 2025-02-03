import React from "react";
import { BsFillArrowUpRightCircleFill } from "react-icons/bs";
import { SiAntdesign } from "react-icons/si";
import "../styles/Landing.css";

function OurServices() {
  const services = [
    {
      title: "WORKSPACE DESIGN & PLANNING",
      description:
        "Customized office layouts to optimize productivity and collaboration.",
      bgImage: "/images/workspace-design.png",
    },
    {
      title: "interior decoration",
      description: "Tailored decore solutions that reflect your brand identity",
      bgImage: "/images/workspace-design.png",
    },
    {
      title: "turnkey projects",
      description: "complete project management from design to delivery.",
      bgImage: "/images/workspace-design.png",
    },
    {
      title: "renovation & remodeling",
      description:
        "transform your existing office into a dynamic, modern workspace.",
      bgImage: "/images/workspace-design.png",
    },
  ];

  return (
    <div className="max-w-screen-xl mx-auto px-5 py-10">
      {/* Section Header */}
      <div className="text-center mb-10">
        <img
          src="/images/serviceIcon.png"
          alt="service icon"
          className="mx-auto"
        />
        <h3 className="uppercase text-[#1F5C54] font-bold">
          Change Your Office Space
        </h3>
        <h1 className="font-extrabold text-3xl">
          Our mission is to make your <br />
          <span className="text-[#1F5C54]">Office</span> better
        </h1>
      </div>

      {/* Services Grid */}
      <div className=" flex justify-center gap-5 px-10 h-[350px]">
        {services.map((service, index) => (
          <div
            key={index}
            className=" service-card group relative w-52 h-full flex flex-col items-center justify-center text-center p-5 rounded-lg transition-all duration-500 ease-in-out overflow-hidden 
              bg-[#1F5C54] hover:w-96 cursor-pointer"
          >
            {/* Background Image on Hover */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500"
              style={{
                backgroundImage: `url(${service.bgImage})`,
                // backgroundSize: "cover",
                // backgroundPosition: "center",
              }}
            />

            {/* Content */}
            <div className="flex flex-col justify-evenly h-full group-hover:h-auto absolute z-10 group-hover:bg-black group-hover:bg-opacity-40 group-hover:bottom-0 px-3 py-2 text-start">
              <SiAntdesign
                size={40}
                className="text-white transition-opacity duration-300 group-hover:opacity-0"
              />
              <h5 className="uppercase font-semibold text-white group-hover:text-[#34BFAD] transition-colors duration-300">
                {service.title}
              </h5>
              <p className="uppercase text-white text-sm  group-hover:text-gray-200 transition-colors duration-300">
                {service.description}
              </p>
              <BsFillArrowUpRightCircleFill
                size={20}
                className="text-[#34BFAD] bg-black rounded-full group-hover:self-end"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OurServices;
