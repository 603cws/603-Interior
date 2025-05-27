import "../styles/Landing.css";
import LandingNavbar from "../common-components/LandingNavbar";
import Footer from "../common-components/Footer";
import { IoMdArrowDropright, IoMdArrowRoundDown } from "react-icons/io";
import { FaDotCircle } from "react-icons/fa";
import { FaCircleDot } from "react-icons/fa6";
import HeroSection from "./HeroSection";

const services = [
  {
    icon: "../images/services/section1-img1.png",
    category: "Interior Design",
    title: "Stone & Hardscaping",
  },
  {
    icon: "../images/services/section1-img1.png",
    category: "Retail Designs",
    title: "Architecture Design",
  },
  {
    icon: "../images/services/section1-img1.png",
    category: "Architecture Design",
    title: "2D/3D Layouts",
  },
  {
    icon: "../images/services/section1-img1.png",
    category: "Interior Design",
    title: "Home Decoration",
  },
];

const steps = [
  {
    id: "1",
    title: "Innovative Wall Decoration & Designs",
    desc: `We work to ensure people’s comfort at their home, andto provide the best and\nthe fastest help at fair prices.`,
  },
  {
    id: "2",
    title: "Modern living quarter Decoration & Designs",
    desc: `Interior design consultancy firm that brings sensitivity to the design top\nrestaurants, hotels, offices & homes around the world.`,
  },
  {
    id: "3",
    title: "Home Interior Inter Art Design",
    desc: `We develop the full cycle of project documentation & full details. Our client's\nsatisfaction is most.`,
  },
];

const processSteps = [
  {
    title: "Strategic Planning",
    description: "We work to ensure people’s comfort",
    icon: "../images/services/section2-img1.png", // Replace with your image path
    position: "bottom",
    starting: true,
  },
  {
    title: "Concept Development",
    description: "Inoterior design consultancy firm",
    icon: "../images/services/section2-img2.png",
    position: "top",
  },
  {
    title: "Design Development",
    description: "Designers have gathered information, then get into",
    icon: "../images/services/section2-img3.png",
    position: "bottom",
  },
  {
    title: "Construction Work",
    description: "Iterative approaches to the corporate",
    icon: "../images/services/section2-img4.png",
    position: "top",
  },
];

const tabs = [
  {
    icon: "./images/services/section3-img1.png",
    label: "Inter Design",
    active: true,
  },
  {
    icon: "./images/services/section3-img2.png",
    label: "Furniture Product",
  },
  {
    icon: "./images/services/section3-img3.png",
    label: "Design interior",
  },
  {
    icon: "./images/services/section3-img4.png",
    label: "Design interior",
  },
];

function OurServices() {
  const background = "/images/services/servicepage.png";

  return (
    <div>
      {/* <header className="bg-white shadow-lg z-50 relative">
        <LandingNavbar />
      </header>

      <section
        className="relative h-screen flex items-center text-center justify-center bg-cover bg-center bg-no-repeat bg-gray-100"
        style={{
          backgroundImage: `url(${background})`,
          backgroundAttachment: "fixed",
        }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 font-lato font-extrabold">
          <h1 className="text-5xl lg:text-7xl text-white drop-shadow-lg font-lora">
            Service
          </h1>
        </div>
      </section> */}

      <HeroSection title={"Service"} background={background} />

      {/* Our Services Section */}
      <section className="py-20 relative">
        {/* Background Image */}
        <img
          src="./images/services/service-bg.png"
          alt="Blueprint Background"
          className="absolute right-0 top-0 bottom-0 md:pl-[4vw] lg:pl-[30vw] w-full h-full bg-no-repeat bg-contain bg-right z-0"
          // style={{ objectPosition: "right top" }} // customize position
        />

        <div className="3xl:max-w-[85vw] mx-auto px-2 md:px-12 xl:px-0 3xl:px-4 xl:pr-20 flex flex-col lg:flex-row lg:items-stretch gap-16 z-10 relative">
          {/* Left Image */}
          <div className="w-full lg:w-1/2">
            <img
              src="../images/services/service.png"
              alt="Featured Office"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Right Content */}
          <div className="w-full lg:w-1/2 flex flex-col justify-between">
            <div className="mb-10 lg:mb-6">
              <div className="flex items-center place-content-end md:place-content-center lg:place-content-start mr-36 lg:mr-0 gap-2 mb-2">
                <span className="w-9 h-px bg-[#304778] mb-2"></span>
                <h5 className="text-xs font-semibold uppercase text-[#304778] tracking-widest font-lora">
                  Our Services
                </h5>
              </div>
              <h2 className="text-xl md:text-4xl font-bold text-[#232323] place-content-start md:place-self-center ml-[20vw] md:ml-24 lg:ml-0 lg:place-self-start font-lora">
                Our Featured Services
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-2 md:px-0 flex-grow">
              {services.map((service, index) => (
                <div
                  key={index}
                  className="bg-white shadow p-10 text-center flex flex-col justify-center items-center h-full"
                >
                  <img
                    src={service.icon}
                    alt={service.title}
                    className="w-16 h-16 mx-auto mb-2 object-contain"
                  />
                  <p className="text-sm text-[#777777] font-Poppins">
                    {service.category}
                  </p>
                  <h4 className="font-bold text-[#232323] font-lora mt-1 text-xl">
                    {service.title}
                  </h4>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Inoterior Process Section */}
      <section className="py-20">
        <div className="xl:max-w-7xl 3xl:max-w-[85vw] mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-1">
            {/* Left Line */}
            <div className="w-9 h-px bg-[#304778] mb-2"></div>

            {/* Text */}
            <p className="text-sm uppercase text-[#304778] font-lora font-bold tracking-wide">
              Inoterior Process
            </p>

            {/* Right Line */}
            <div className="w-9 h-px bg-[#304778] mb-2"></div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-[#232323] font-lora leading-snug mt-2">
            Place Where Our Experience <br /> Become Easy Outline
          </h2>

          {/* Process Steps */}
          {/* Desktop Version */}
          <div className="hidden md:flex mt-16 flex-col md:flex-row justify-between items-center md:items-end relative pr-6 lg:pr-0">
            {processSteps.map((step, index) => (
              <div
                key={index}
                className="w-1/4 relative flex flex-col items-center"
              >
                {/* Starting Label */}
                {step.starting && (
                  <div className="absolute -top-20 flex flex-col items-center text-sm text-[#777777] font-Poppins">
                    <span>Starting</span>
                    <span>Here</span>
                    <IoMdArrowRoundDown />
                    <div className="mt-1 h-4 border-l-2 border-dotted border-[#304778]" />
                    <div className="ml-12 w-[50px] h-[1px] border-t-2 border-dotted border-[#304778] relative">
                      <div className="ml-12 h-12 border-l-2 border-dotted border-[#304778]" />
                      <div className="ml-12 w-[50px] h-[1px] border-t-2 border-dotted border-[#304778] relative">
                        <IoMdArrowDropright className="ml-12 bottom-2 relative" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Top text */}
                {step.position === "top" && (
                  <div className="">
                    <h3 className="text-lg font-bold text-[#232323] font-lora mb-1">
                      {step.title}
                    </h3>
                    <p className="text-xs text-[#777777] font-Poppins mb-4 w-48">
                      {step.description}
                    </p>
                    <div className="absolute -bottom-2">
                      <div className="ml-20 w-[62px] h-[1px] border-t-2 border-dotted border-[#304778] relative">
                        <div className="ml-16 bottom-0 absolute h-12 border-l-2 border-dotted border-[#304778]">
                          <div className="bottom-12 w-[60px] h-[1px] border-t-2 border-dotted border-[#304778] absolute" />
                          <IoMdArrowDropright className="ml-14 bottom-2 relative" />
                        </div>
                        {/* <div className="ml-16 bottom-4  w-[60px] h-[1px] border-t-2 border-dotted border-blue-700 absolute" /> */}
                      </div>
                    </div>
                  </div>
                )}

                {/* Icon Box */}
                <div className="border-2 border-gray-200 p-px">
                  <div className="border-2 border-gray-200 p-4">
                    <img
                      src={step.icon}
                      alt={step.title}
                      className="w-12 h-12 mx-auto"
                    />
                  </div>
                </div>

                {/* Bottom text */}
                {step.position === "bottom" && (
                  <div className="absolute top-24">
                    {!step.starting && (
                      <div className="ml-24 w-[50px] h-[1px] border-t-2 border-dotted border-[#304778] absolute bottom-40 mb-1">
                        <div className="ml-12 top-0 absolute h-12 border-l-2 border-dotted border-[#304778]" />
                        <div className="top-12 ml-12 w-[50px] h-[1px] border-t-2 border-dotted border-[#304778] absolute" />
                        <IoMdArrowDropright className="top-10 left-12 ml-10 bottom-2 absolute" />
                      </div>
                    )}
                    <h3 className="text-lg font-bold text-[#232323] font-lora">
                      {step.title}
                    </h3>
                    <p className="text-xs text-[#777777] font-Poppins mt-1 w-48">
                      {step.description}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Mobile Version */}
          <div className="flex flex-col md:hidden mt-16 gap-8">
            {processSteps.map((step, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center px-4"
              >
                <div className="border-2 border-gray-200 p-px mb-4">
                  <div className="border-2 border-gray-200 p-4">
                    <img
                      src={step.icon}
                      alt={step.title}
                      className="w-12 h-12 mx-auto"
                    />
                  </div>
                </div>

                <h3 className="text-lg font-bold text-[#232323] font-lora mb-1">
                  {step.title}
                </h3>
                <p className="text-sm text-[#777777] font-Poppins max-w-xs">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Services Section*/}
      <section className="pt-20">
        <div className="mx-auto flex flex-col lg:flex-row">
          {/* Left - Stage Content */}
          <div className="bg-[#F7F7F7] w-full lg:w-[46%] px-2 md:px-16 lg:px-[4vw] py-14">
            {/* Heading */}
            <div className="mb-10">
              <div className="flex items-center gap-2">
                <div className="w-9 h-px bg-[#304778] mb-2" />
                <p className="uppercase text-sm text-[#304778] font-bold tracking-wider">
                  Our Services
                </p>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#232323] mt-4 font-lora">
                Stages Renovation Process
              </h2>
            </div>

            {/* Steps */}
            <div className="space-y-8">
              {steps.map((step) => (
                <div
                  key={step.id}
                  className="flex items-start gap-4 border-b pb-4"
                >
                  <div
                    className={` text-white ${
                      step.id === "1" ? "bg-[#304778]" : "bg-[#232323]"
                    } font-bold w-12 h-12 flex items-center justify-center text-2xl font-lora mt-2`}
                  >
                    {step.id}
                  </div>
                  <div className="">
                    <h3 className="text-xl font-bold text-[#232323] mb-2 font-lora">
                      {step.title}
                    </h3>
                    <p className="text-sm text-[#777777] whitespace-pre-line font-poppins">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Image & Tabs */}
          <div className="w-full lg:w-[54%] flex flex-col py-4 lg:p-0">
            {/* Tabs */}
            <div className="hidden md:flex justify-between items-center py-4">
              {tabs.map((tab, i, arr) => (
                <div
                  key={i}
                  className="flex-1 flex flex-col items-center relative"
                >
                  {/* Image */}
                  <img className="w-14 h-14" src={tab.icon} alt={tab.label} />

                  <div className="relative mt-2 z-10 w-4 h-4">
                    {/* Outer Circle */}
                    <div
                      className={`absolute inset-0 rounded-full border-4 ${
                        tab.active ? "border-[#304778]" : "border-[#232323]"
                      }`}
                    ></div>

                    {/* Inner Circle */}
                    {tab.active && (
                      <div
                        className={`absolute top-1 left-1 w-2 h-2 rounded-full ${
                          tab.active ? "bg-[#232323]" : "bg-white"
                        } `}
                      ></div>
                    )}
                  </div>

                  {/* Label */}
                  <div
                    className={`text-sm font-lora font-bold mt-2 ${
                      tab.active ? "text-[#304778]" : "text-[#232323]"
                    }`}
                  >
                    {tab.label}
                  </div>

                  {/* Horizontal line to the right, except for last item */}
                  {i < arr.length - 1 && (
                    <div className="absolute top-[71px] w-full">
                      <div className="border-t border-[#DCDCDC] w-full translate-x-1/2"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Mobile Tabs Only */}
            <div className="block md:hidden space-y-6 px-6">
              {tabs.map((tab, i) => (
                <div key={i} className="relative pl-10 pb-6">
                  {/* Horizontal Divider Line */}
                  {i <= tabs.length - 1 && (
                    <div className="absolute top-14 left-14 w-[60vw] border-t border-[#E5E5E5]" />
                  )}

                  {/* Icon */}
                  <img
                    src={tab.icon}
                    alt={tab.label}
                    className="w-10 h-10 mb-2"
                  />

                  {/* Circle Indicator */}
                  <div className="relative w-4 h-4 mb-1">
                    <div
                      className={`w-full h-full rounded-full border-4 ${
                        tab.active ? "border-[#304778]" : "border-[#232323]"
                      }`}
                    />
                    {tab.active && (
                      <div className="absolute top-1 left-1 w-2 h-2 bg-[#232323] rounded-full" />
                    )}
                  </div>

                  {/* Label */}
                  <div
                    className={`text-[15px] font-lora font-bold ${
                      tab.active ? "text-[#304778]" : "text-[#232323]"
                    }`}
                  >
                    {tab.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Image */}
            <div className="flex-grow px-1 lg:p-0">
              <img
                src="./images/services/section3-img.png"
                alt="Interior View"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default OurServices;
