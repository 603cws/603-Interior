import React from "react";
import { BsFillArrowUpRightCircleFill } from "react-icons/bs";
import { SiAntdesign } from "react-icons/si";
import "../styles/Landing.css";
import { useState } from "react";
import LandingNavbar from "../common-components/LandingNavbar";
import Footer from "../common-components/Footer";
import { useNavigate } from "react-router-dom";

function OurServices() {
  const [isHovered, setIsHovered] = useState(false);
  const [isHovered2, setIsHovered2] = useState(false);
  const [isHovered3, setIsHovered3] = useState(false);
  const [isHovered4, setIsHovered4] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState(0);

  const navigate = useNavigate();
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

  const background = "/images/servicepage.png";
  const service = `/images/ourservicebg.png`;

  return (
    <>
      {/* Navbar Section */}
      <header className="bg-white shadow-lg z-50 relative">
        <LandingNavbar />
      </header>

      {/* Hero Section */}
      <section
        className="relative h-screen flex items-center text-center justify-center bg-cover bg-center bg-no-repeat bg-gray-100"
        style={{
          backgroundImage: `url(${background})`,
          backgroundAttachment: "fixed",
        }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 uppercase">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-lato  text-white drop-shadow-lg">
            Our service
          </h1>
          <p className="text-lg text-gray-200 mt-4">THIS IS what we do</p>
        </div>
      </section>

      {/* our mission section */}
      <section className="container mx-auto px-5 py-10">
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
        <div className="flex justify-center w-full gap-5 px-10 h-[467px]">
          {services.map((service, index) => (
            <div
              key={index}
              className={`relative flex flex-col text-center transition-all duration-500 ease-in-out overflow-hidden bg-[#1F5C54] cursor-pointer
              ${
                expandedIndex === index
                  ? "w-[467px] h-full justify-end"
                  : "w-[220px] h-full justify-center"
              }`}
              onMouseEnter={() => setExpandedIndex(index)}
              onMouseLeave={() => setExpandedIndex(0)} // Reset to first card when leaving
            >
              {/* Background Image - Always visible for expanded card */}
              <div
                className={`absolute inset-0 transition-all duration-500 ${
                  expandedIndex === index
                    ? "opacity-100 scale-100"
                    : "opacity-0 scale-110"
                }`}
                style={{
                  backgroundImage: `url(${service.bgImage})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />

              {/* Overlay when expanded */}

              {/* Content */}
              <div className="relative z-10  px-3 py-2 text-start">
                <div
                  className={`absolute inset-0 bottom-0  transition-all duration-500 ${
                    expandedIndex === index ? "bg-black/40" : "bg-black/0"
                  }`}
                ></div>
                <div
                  className={`relative z-10 w-full bottom-0 left-0 flex flex-col ${
                    expandedIndex === index ? "gap-2" : "gap-10"
                  }`}
                >
                  {/* Icon - Hide when expanded */}
                  <SiAntdesign
                    size={40}
                    className={`text-white transition-opacity duration-300 ${
                      expandedIndex === index ? "opacity-0" : "opacity-100"
                    }`}
                  />
                  {/* Title - Change color when expanded */}
                  <h5
                    className={`uppercase font-extrabold text-[18px] transition-colors duration-300 ${
                      expandedIndex === index ? "text-[#34BFAD]" : "text-white"
                    }`}
                  >
                    {service.title}
                  </h5>
                  {/* Description - Show when expanded */}
                  <p
                    className={`uppercase text-white text-[16px] transition-opacity duration-300 font-extrabold`}
                  >
                    {service.description}
                  </p>
                  {/* Arrow Icon - Stick to the bottom */}
                  <BsFillArrowUpRightCircleFill
                    size={20}
                    className="text-[#34BFAD] bg-black rounded-full self-end"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* section design modern */}
      <section
        className="flex h-screen bg-cover container mx-auto"
        style={{ backgroundImage: `url(${service})` }}
      >
        <div className=" mx-auto flex-1 flex flex-col">
          {/* <div className="flex mb-4 justify-between gap-4 "> */}
          <div className="flex-1 flex flex-col gap-4 items-center justify-center h-full">
            <div className="flex justify-center gap-4">
              {/* we have loop 4 div for icon and text */}
              <div
                className="hover:bg-[#1F5C54] text-center flex flex-col justify-center font-Poppins hover:text-[#fff] lg:w-[300px] lg:h-[300px] shadow-2xl bg-[#fff]"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <div className="flex justify-center lg:mt-4">
                  <img
                    src={
                      isHovered
                        ? "/images/modernservice1.png"
                        : "/images/modernservice2.png"
                    }
                    // src="/images/modern-ofc.png"
                    alt="modern service 1"
                    className=""
                  />
                </div>
                <h4 className="uppercase font-bold text-xl my-4 lg:my-6">
                  interior design
                </h4>
                <p className="capitalize font-medium text-base">
                  Fusce at tellus nec erat pretium maximus eu et eros
                </p>
              </div>
              {/* we have loop 4 div for icon and text */}
              <div
                className="hover:bg-[#1F5C54] text-center flex flex-col justify-center font-Poppins hover:text-[#fff] lg:w-[300px] lg:h-[300px] shadow-2xl bg-[#fff]"
                onMouseEnter={() => setIsHovered2(true)}
                onMouseLeave={() => setIsHovered2(false)}
              >
                <div className="flex justify-center lg:mt-4">
                  <img
                    src={
                      isHovered2
                        ? "/images/modernservice4.png"
                        : "/images/modernservice3.png"
                    }
                    // src="/images/modern-ofc.png"
                    alt="modern service 1"
                    className=""
                  />
                </div>
                <h4 className="uppercase font-bold text-xl my-4 lg:my-6">
                  office redesign
                </h4>
                <p className="capitalize font-medium text-base">
                  Fusce at tellus nec erat pretium maximus eu et eros
                </p>
              </div>
            </div>
            <div className="flex justify-center gap-4">
              {/* we have loop 4 div for icon and text */}
              <div
                className="hover:bg-[#1F5C54] text-center flex flex-col justify-center font-Poppins hover:text-[#fff] lg:w-[300px] lg:h-[300px] shadow-2xl bg-[#fff]"
                onMouseEnter={() => setIsHovered3(true)}
                onMouseLeave={() => setIsHovered3(false)}
              >
                <div className="flex justify-center lg:mt-4">
                  <img
                    src={
                      isHovered3
                        ? "/images/modernservice5.png"
                        : "/images/modernservice6.png"
                    }
                    // src="/images/modern-ofc.png"
                    alt="modern service 1"
                    className=""
                  />
                </div>
                <h4 className="uppercase font-bold text-xl my-4 lg:my-6">
                  Interior decoration
                </h4>
                <p className="capitalize font-medium text-base">
                  Fusce at tellus nec erat pretium maximus eu et eros
                </p>
              </div>
              {/* we have loop 4 div for icon and text */}
              <div
                className="hover:bg-[#1F5C54] text-center flex flex-col justify-center font-Poppins hover:text-[#fff] lg:w-[300px] lg:h-[300px] shadow-2xl bg-[#fff]"
                onMouseEnter={() => setIsHovered4(true)}
                onMouseLeave={() => setIsHovered4(false)}
              >
                <div className="flex justify-center lg:mt-4">
                  <img
                    src={
                      isHovered4
                        ? "/images/modernservice7.png"
                        : "/images/modernservice8.png"
                    }
                    // src="/images/modern-ofc.png"
                    alt="modern service 1"
                    className=""
                  />
                </div>
                <h4 className="uppercase font-bold text-xl my-4 lg:my-6">
                  furniture production
                </h4>
                <p className="capitalize font-medium text-base">
                  Fusce at tellus nec erat pretium maximus eu et eros
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 flex justify-start items-center">
          {/* div for text and button */}
          <div className=" flex items-center">
            <div className="font-Poppins">
              {/* serviceicon */}
              <div className="flex ">
                <img src="/images/serviceIcon.png" alt="service icon" />
              </div>
              <h3 className="font-extrabold uppercase lg:my-7">services</h3>
              <p className="font-semibold lg:text-3xl uppercase ">
                We design modern <br /> and elegant
              </p>
              <p className="my-3 lg:my-7">
                Lorem ipsum odor amet, consectetuer adipiscing elit. Parturient{" "}
                <br />
                dictum class velit tristique efficitur; pulvinar laoreet ipsum{" "}
                <br />
                scelerisque. Sapien facilisi blandit sodales eget auctor
                dignissim <br /> habitant. Augue egestas parturient potenti
                auctor cursus ut <br /> fusce. Imperdiet hendrerit praesent
                dictum senectus integer <br /> ridiculus curae leo. Nec finibus
                tempus ultricies sapien; dis proin <br /> efficitur.
              </p>

              {/* button */}
              <div className="flex justify-center">
                <button
                  onClick={() => navigate("/Layout")}
                  className="bg-[#1F5C54] text-[#fff] border-1 border-[#000] font-bold capitalize w-full rounded-lg py-2"
                >
                  Start Creating your office now
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How do we work section */}
      <section className="container mx-auto flex justify-center px-11 font-Poppins my-20">
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
      {/* footer */}
      <Footer />
    </>
  );
}

export default OurServices;
