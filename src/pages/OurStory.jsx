import { useState } from "react";
import Footer from "../common-components/Footer";
import GetInTouchSection from "../common-components/GetInTouchSection";
import LandingNavbar from "../common-components/LandingNavbar";
import { FaStarOfLife } from "react-icons/fa";

const steps = [
  {
    imagePath: "/images/service_2.png",
    title: "Ready-to-use layouts",
  },
  {
    imagePath: "/images/serviceboq.png",
    title: "Auto-generated BOQs",
  },
  {
    imagePath: "/images/serviceproduct.png",
    title: "Trusted brand collaborations",
  },
  {
    imagePath: "/images/execution.png",
    title: "Execution",
  },
];

const cards = [
  {
    title: "Smart Simplicity",
    image: "/images/brand1.webp",
    subtitle: "tech-led processes,zero guesswork",
  },
  {
    title: "Human-centered design",
    image: "/images/brand2.webp",
    subtitle: "tailored to every business unique needs",
  },
  {
    title: "Partnership-driven quality",
    subtitle: "only top-tier vendors and products",
    image: "/images/brand3.webp",
  },
  {
    title: "Speed and reliability",
    image: "/images/brand4.webp",
    subtitle: "cutting down timelines without compromising outcomes",
  },
  {
    title: "Trust and transparency",
    image: "/images/brand5.webp",
    subtitle: "no hidden cost, no missalignment",
  },
];
function OurStory() {
  return (
    <>
      <LandingNavbar />
      <div className="lg:container lg:mx-auto lg:px-12 px-6">
        {/* section 1 */}
        <div>
          <div className="font-Georgia flex flex-col justify-center items-center my-10 capitalize">
            <h1 className="italic text-[#111827] text-3xl xl:text-[42px] leading-[52px]">
              Our story of Growth
            </h1>
            <p className="text-[#4B5563] text-lg text-center">
              From Shared spaces - to Design workplaces
            </p>
          </div>

          <div className="relative w-full h-[500px] flex items-center justify-center bg-[url('/images/ourstory.png')] bg-cover bg-center">
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40"></div>

            {/* Content */}
            <div className="relative z-10 text-center text-white px-6">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">
                From Coworking Challenges to <br /> Simplifying Office Interiors
              </h2>
              <p className="text-lg italic">
                “Born from real struggles, built for real businesses.”
              </p>
            </div>
          </div>
        </div>

        {/* section 2 */}
        <StrugglesSection />

        {/* section 3 */}
        <section className="max-w-4xl mx-auto lg:px-6 py-6 lg:py-12 text-center font-Georgia">
          <p className="text-3xl font-bold  italic text-[#334A78] xl:leading-[57px]">
            If we struggled as a workspace brand, how hard must it be for
            companies doing this for the first time?
          </p>
        </section>

        {/* section 4 */}
        <StepsSection />

        {/* section 5 */}
        <section>
          <div>
            <h2 className="pt-10 text-2xl lg:text-[40px] text-[#232323]  lg:leading-[52px] font-bold italic mb-2 lg:mb-4 text-center">
              Our brand values are build on
            </h2>
          </div>
          <AccordionCards />
        </section>
      </div>
      <GetInTouchSection />
      <Footer />
    </>
  );
}

export default OurStory;

function StrugglesSection() {
  return (
    <section className="py-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center font-Georgia">
      {/* Left Content */}
      <div>
        <h2 className="text-2xl md:text-4xl italic text-black  mb-4">
          The Struggles We Encountered
        </h2>
        <p className=" text-2xl">
          Setting up high-quality, functional, and well-designed offices was
          unnecessarily complicated. From inconsistent vendors to vague cost
          estimations and endless delays, even with a clear vision, the process
          felt broken.
        </p>
      </div>

      {/* Right Image */}
      <div className="flex justify-center md:justify-end">
        <img
          src="/images/office.JPG" // replace with your image path
          // src="/images/ourstory.png" // replace with your image path
          alt="Office workspace"
          className="rounded-lg shadow-md max-h-[350px] object-cover"
        />
      </div>
    </section>
  );
}

function StepsSection() {
  return (
    <section className="bg-white lg:py-12 font-Georgia">
      <section className="max-w-3xl mx-auto px-6 pb-10 text-center space-y-5">
        <h2 className="text-2xl lg:text-[40px] text-[#232323] lg:leading-[52px] font-bold italic mb-4">
          Best Solutions For Your <br /> Dream Office
        </h2>
        <p className="text-[#777] text-sm md:text-base tracking-[0.3px]">
          Workved Interiors, you don’t just get an office—you get a smarter,
          faster, and more confident way to bring your vision to life.
        </p>
      </section>
      <div className="lg:container lg:mx-auto lg:px-6 relative">
        <div className="flex flex-col md:flex-row justify-between items-center md:space-x-10 space-y-10 md:space-y-0 relative">
          {/* {steps} */}
          {steps?.map((stepdata, index) => (
            <Step
              title={stepdata?.title}
              description={stepdata?.description}
              imagePath={stepdata?.imagePath}
              key={stepdata?.title}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function Step({ imagePath, title, index }) {
  return (
    <div className="flex-1 text-center relative font-Georgia">
      <div className=" w-32 h-32 rounded-full border border-dashed border-gray-400 bg-white mx-auto flex items-center  justify-center relative z-10">
        <img src={imagePath} alt="Plan" className="w-16 h-16" />
      </div>
      <h3 className="mt-6 text-xl font-bold text-[#232323] italic">{title}</h3>
      {/* Connector Line to Step 2 */}
      {(index === 0 || index === 1 || index === 2) && (
        <div className="hidden md:block absolute top-16 left-1/2 w-full border-t border-dashed border-gray-400 z-0"></div>
      )}
    </div>
  );
}

function AccordionCards() {
  const [active, setActive] = useState(2); // Default expanded (center one)

  return (
    <>
      <div className="hidden lg:flex  w-full h-[400px] gap-4 px-4 my-10">
        {cards.map((card, i) => (
          <div
            key={i}
            className={`relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 ease-in-out ${
              active === i ? "flex-[3]" : "flex-1"
            }`}
            onMouseEnter={() => setActive(i)}
          >
            {/* Background Image */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${card.image})` }}
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40"></div>

            {/* Content */}
            <div
              className={`relative z-10 flex h-full  ${
                active === i
                  ? "justify-start items-end"
                  : "justify-center items-end"
              }  text-white`}
            >
              {active === i ? (
                <div className="p-6 text-left">
                  <h3 className="text-2xl font-bold"> {card.title}</h3>
                  {card.subtitle && (
                    <p className="text-sm mt-2">{card.subtitle}</p>
                  )}
                </div>
              ) : (
                <>
                  <p className="text-lg h-full font-medium rotate-[-90deg] whitespace-nowrap flex  items-center  gap-4">
                    <span>
                      <FaStarOfLife color="#78A3FF" />
                    </span>{" "}
                    {card.title}
                  </p>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="lg:hidden flex flex-col  w-full gap-4  my-10">
        {cards.map((card, i) => (
          <div
            key={i}
            className={`relative h-[250px]  rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 ease-in-out flex flex-col`}
          >
            {/* Background Image */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${card.image})` }}
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40"></div>

            {/* Content */}
            <div
              className={`relative z-10 flex h-full justify-start items-end  text-white`}
            >
              <div className="p-6 text-left">
                <h3 className="text-2xl font-bold"> {card.title}</h3>
                {card.subtitle && (
                  <p className="text-sm mt-2">{card.subtitle}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
