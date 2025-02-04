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
    <>
      <section className="max-w-screen-xl mx-auto px-5 py-10">
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
        <div className=" flex justify-center gap-5 px-10 h-[467px]">
          {services.map((service, index) => (
            <div
              key={index}
              className=" service-card group relative w-[220px] h-full flex flex-col items-center justify-center text-center p-5  transition-all duration-500 ease-in-out overflow-hidden 
              bg-[#1F5C54] hover:w-[467px] cursor-pointer"
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
      </section>
      {/* How do we work section */}
      <section className="container mx-auto w-full flex px-11 font-Poppins my-20">
        <div className="w-2/5">
          <img src="/images/serviceIcon.png" alt="service icon" />
          <h4 className="uppercase font-extrabold text-2xl my-7">
            how do we work ?
          </h4>
          <h1 className="uppercase font-semibold text-5xl">
            we design for your <br />
            satisfaction
          </h1>
          <p className="text-base my-7">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nobis ab
            temporibus fugiat quos cum! Necessitatibus fugiat vero minus
            perferendis ipsum!
          </p>
          <div className=" w-full">
            <div className="w-full flex gap-5 items-center mb-2">
              <h1 className="font-bold text-[100px] text-[#34BFAD] w-1/5">
                01
              </h1>
              <div className="font-Poppins flex flex-col gap-5">
                <h2 className="uppercase font-bold text-[32px]">layout</h2>
                <p className="uppercase font-bold text-base">
                  Mauris dapibus consectetur enim a dictum. <br />
                  Ut in rhoncus sem
                </p>
              </div>
            </div>
            <div className="w-full flex gap-5 items-center mb-2">
              <h1 className="font-bold text-[100px] text-[#34BFAD] w-1/5">
                02
              </h1>
              <div className="font-Poppins flex flex-col gap-5">
                <h2 className="uppercase font-bold text-[32px]">design</h2>
                <p className="uppercase font-bold text-base">
                  Mauris dapibus consectetur enim a dictum.
                  <br /> Ut in rhoncus sem
                </p>
              </div>
            </div>
            <div className="w-full flex gap-5 items-center">
              <h1 className="font-bold text-[100px] text-[#34BFAD] w-1/5">
                03
              </h1>
              <div className="font-Poppins flex flex-col gap-5">
                <h2 className="uppercase font-bold text-[32px]">development</h2>
                <p className="uppercase font-bold text-base">
                  Mauris dapibus consectetur enim a dictum.
                  <br /> Ut in rhoncus sem
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="w-3/5 flex justify-end gap-5">
          <div className="flex flex-col gap-5">
            <img
              src="/images/we-do-1.png"
              alt=""
              className="w-[380px] h-[400px]"
            />
            <img
              src="/images/we-do-2.png"
              alt=""
              className="w-[380px] h-[400px]"
            />
          </div>
          <div className="flex flex-col gap-5 mt-14">
            <img
              src="/images/we-do-3.png"
              alt=""
              className="w-[380px] h-[400px]"
            />
            <img
              src="/images/we-do-4.png"
              alt=""
              className="w-[380px] h-[400px]"
            />
          </div>
        </div>
      </section>
    </>
  );
}

export default OurServices;
