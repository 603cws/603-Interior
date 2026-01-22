import { useState } from "react";
import Footer from "../../common-components/Footer";
import GetInTouchSection from "../components/GetInTouchSection";
import LandingNavbar from "../components/LandingNavbar";
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
      <LandingNavbar className="relative" />
      <div className="lg:container lg:mx-auto lg:px-12 px-6 xl:max-w-7xl 2xl:px-0">
        <div className="font-Georgia">
          <div className=" flex flex-col justify-center items-center my-10 capitalize">
            <h1 className="italic text-[#111827] text-3xl xl:text-[42px] leading-[52px]">
              Our story of Growth
            </h1>
            <p className="text-[#4B5563] text-lg text-center">
              From Shared spaces - to Design workplaces
            </p>
          </div>

          <div className="relative w-full h-[500px] flex items-center justify-center bg-[url('/images/ourstory.png')] bg-cover bg-center">
            <div className="absolute inset-0 bg-black/10"></div>

            <div className="relative z-10 text-center text-white px-6">
              <h2 className="text-3xl md:text-5xl font-bold italic mb-4 xl:mb-6 xl:leading-[58px]">
                From Coworking Challenges to <br /> Simplifying Office Interiors
              </h2>
              <p className="text-lg italic">
                “Born from real struggles, built for real businesses.”
              </p>
            </div>
          </div>
        </div>

        <StrugglesSection />

        <section className="max-w-4xl mx-auto lg:px-6 py-6 lg:py-12 text-center font-Georgia">
          <p className="text-[28px] font-bold  italic text-[#334A78] xl:leading-[57px]">
            If we struggled as a workspace brand, how hard must it be for
            companies doing this for the first time?
          </p>
        </section>

        <StepsSection />

        <section>
          <div>
            <h2 className="font-Georgia pt-10 text-4xl lg:text-[40px] text-[#232323]  lg:leading-[52px] font-bold  mb-2 lg:mb-4 text-center">
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
    <section className="py-12 grid grid-cols-1 md:grid-cols-[1fr,1.4fr]  gap-8   font-Georgia items-stretch">
      <div className="flex flex-col justify-center gap-6 ">
        <h2 className="text-4xl  text-black  mb-4 xl:text-[40px] xl:leading-[55px]">
          The Struggles We <br />
          Encountered
        </h2>
        <p className=" text-2xl text-black xl:leading-[40px]">
          Setting up high-quality, functional, and well-designed offices was
          unnecessarily complicated. From inconsistent vendors to vague cost
          estimations and endless delays, even with a clear vision, the process
          felt broken.
        </p>
      </div>

      <div className="">
        <img
          src="/images/office.JPG"
          alt="Office workspace"
          className="rounded-lg shadow-md h-full w-full object-cover"
        />
      </div>
    </section>
  );
}

function StepsSection() {
  return (
    <section className="bg-white py-12 font-Georgia">
      <section className="max-w-3xl mx-auto lg:px-6 pb-10 text-center space-y-5">
        <h2 className="text-4xl lg:text-[40px] text-[#232323] lg:leading-[52px] font-bold  mb-4">
          Best Solutions For Your <br /> Dream Office
        </h2>
        <p className="text-[#777] text-sm md:text-base tracking-[0.3px]">
          Workved Interiors, you don’t just get an office—you get a smarter,
          faster, and more confident way to bring your vision to life.
        </p>
      </section>
      <div className="lg:container lg:mx-auto lg:px-6 relative xl:max-w-7xl 2xl:px-0">
        <div className="flex flex-col md:flex-row justify-between items-center md:space-x-10 space-y-10 md:space-y-0 relative">
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
        <img src={imagePath} alt={title} className="w-16 h-16" />
      </div>
      <h3 className="mt-6 text-xl font-bold text-[#232323] ">{title}</h3>
      {(index === 0 || index === 1 || index === 2) && (
        <div className="hidden md:block absolute top-16 left-1/2 w-full border-t border-dashed border-gray-400 z-0"></div>
      )}
    </div>
  );
}

function AccordionCards() {
  const [active, setActive] = useState(2);

  return (
    <>
      <div className="hidden lg:flex w-full font-Georgia  gap-4 px-4 my-10">
        {cards.map((card, i) => (
          <div
            key={i}
            className={`relative h-[400px] rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 ease-in-out ${
              active === i ? "flex-[3]" : "flex-1"
            }`}
            onMouseEnter={() => setActive(i)}
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${card.image})` }}
            />

            <div className="absolute inset-0 bg-black/40"></div>

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
                  <p className="text-lg h-full font-medium rotate-[-90deg] whitespace-nowrap flex  items-center justify-end  gap-4">
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
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${card.image})` }}
            />

            <div className="absolute inset-0 bg-black/40"></div>

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
