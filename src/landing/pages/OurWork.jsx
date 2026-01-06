import { RiArrowRightUpLine } from "react-icons/ri";
import Footer from "../../common-components/Footer";
import LandingNavbar from "../components/LandingNavbar";
import { useState } from "react";
import ContactUsPopup from "../components/ContactUsPopup";

const projectsData = [
  {
    image: "images/our-work/chair.svg",
    para: "Maximize natural light while maintaining privacy in meeting rooms",
  },
  {
    image: "images/our-work/chair.svg",
    para: "Create distinct zones for focused work and collaboration",
  },
  {
    image: "images/our-work/chair.svg",
    para: "Reflect company brand identity through material choices",
  },
  {
    image: "images/our-work/chair.svg",
    para: "Accommodate 150+ employees with flexible seating arrangements",
  },
  {
    image: "images/our-work/chair.svg",
    para: "Design scalable layout for future team growth",
  },
  {
    image: "images/our-work/chair.svg",
    para: "Work within existing structural constraints and tight timeline",
  },
];

const work_stages = [
  {
    id: 1,
    title: "Spatial Planning",
    desc: "Open floor plan with strategic zoning to balance collaboration and focus.",
    icon: "./images/our-work/planning.svg",
  },
  {
    id: 2,
    title: "Material & Color Pallette",
    desc: "Browse and choose from Furniture, Lighting, HVAC, Smart Solution, etc.",
    icon: "./images/our-work/material.svg",
  },
  {
    id: 3,
    title: "Lighting Strategy",
    desc: "Maximized natural light with floor-to-ceiling windows.",
    icon: "./images/our-work/lighting.svg",
  },
  {
    id: 4,
    title: "Furniture & Ergonomics",
    desc: "Height-adjustable desks, ergonomic seating, and adaptable meeting spaces.",
    icon: "./images/our-work/furniture.svg",
  },
];

function OurWork() {
  const [showContactPopup, setShowContactPopup] = useState(false);

  return (
    <>
      <LandingNavbar className="relative" />

      <section className="py-8 font-Georgia">
        <div className="lg:container mx-auto px-4 xl:max-w-7xl 2xl:px-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center">
            <div>
              <h2 className="text-2xl md:text-4xl italic">
                Modern Corporate Office
              </h2>

              <p className="mt-6 text-xl md:text-2xl font-TimesNewRoman">
                A workspace designed for productivity, collaboration,
                <br /> and brand presence.
              </p>

              <div className="mt-10 grid grid-cols-2 gap-y-6 gap-x-6 text-lg md:text-2xl max-w-lg font-TimesNewRoman">
                <p>Location: Bangalore</p>
                <p className="text-end">Duration: 8 Weeks</p>
                <p>Area: 4,500 sq.ft</p>
                <p className="text-end">Service: Turnkey Interior</p>
              </div>
            </div>

            <div className="relative">
              <div className="overflow-hidden rounded-lg">
                <img
                  src="/images/home/Hero-image-2.webp"
                  alt="Modern Corporate Office"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-8 items-start py-20">
            <div>
              <h3 className="text-xl md:text-2xl font-bold italic text-[#334A78]">
                Project Overview
              </h3>

              <p className="mt-6 text-base md:text-xl leading-8 text-[#334A78] font-TimesNewRoman max-w-2xl">
                TechFlow, a rapidly growing technology company, needed a
                workspace that could match their innovative spirit and
                accommodate their expanding team. The existing office felt
                cramped, outdated, and didn’t reflect the company’s
                forward-thinking culture. Our mission was to transform their
                12,500 sq.ft space into a modern, flexible environment that
                enhances productivity while showcasing their brand identity. Our
                approach centered on creating distinct zones for different work
                styles—from focused individual work to dynamic team
                collaboration.We incorporated sustainable materials, maximized
                natural light, and designed flexible layouts that could adapt to
                future growth. Every design decision was made with the end-user
                in mind, ensuring comfort, functionality, and aesthetic appeal.
              </p>
            </div>

            <div className="border border-[#CCCCCC] bg-[#F9F9F9] rounded-xl p-6 flex-1">
              <h4 className="text-xl md:text-2xl italic font-bold text-[#1f3a6d]">
                Project Highlights
              </h4>

              <div className="mt-8 space-y-4 text-sm md:text-lg font-TimesNewRoman">
                <div className="flex justify-between gap-4 border-b border-[#CCCCCC] pb-2">
                  <span>Client Type</span>
                  <span>Technology Startup</span>
                </div>

                <div className="flex justify-between gap-4 border-b border-[#CCCCCC] pb-2">
                  <span>Team Size</span>
                  <span>8 Designers + 12 Contractors</span>
                </div>

                <div className="flex justify-between gap-4 border-b border-[#CCCCCC] pb-2">
                  <span>Design Scope</span>
                  <span>Full Interior + Furniture</span>
                </div>

                <div className="flex justify-between gap-4 border-b border-[#CCCCCC] pb-2">
                  <span>Capacity</span>
                  <span>150+ Employees</span>
                </div>

                <div className="flex justify-between gap-4">
                  <span>Completed</span>
                  <span>June 2024</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 font-Georgia">
        <div className="lg:container mx-auto px-4 xl:max-w-7xl 2xl:px-0">
          {/* SECTION TITLE */}
          <h2 className="text-center text-xl md:text-3xl italic font-bold text-[#232323] mb-12">
            Project Requirements &amp; Challenges
          </h2>

          {/* CARDS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 font-Poppins text-[8px] md:text-[10px] lg:text-sm">
            {/* CARD */}
            {projectsData.map((project, index) => (
              <div
                className="flex items-start gap-4 p-6 rounded-xl border border-dashed border-[#CCCCCC]"
                key={index}
              >
                <div className="flex-shrink-0">
                  <img
                    src={project.image}
                    alt="Interiors"
                    className="w-10 h-10"
                  />
                </div>
                <p className="leading-5">{project.para}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-16 lg:container px-4 xl:max-w-7xl 2xl:px-0 font-Georgia">
        <h2 className="text-xl md:text-3xl font-bold italic mb-6 text-[#232323] text-center pb-8">
          Design Approach
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {work_stages.map((stage) => (
            <WorkStages stage={stage} key={stage?.title} />
          ))}
        </div>
      </section>

      <section className="relative py-16 lg:container px-4 xl:max-w-7xl 2xl:px-0 font-Georgia">
        <div className="flex items-center justify-center gap-4 mb-2">
          <span className="w-8 h-px bg-[#304778] mb-2"></span>
          <h5 className="text-sm text-[#304778] font-bold  uppercase font-Georgia">
            Gallery
          </h5>
          <span className="w-8 h-px bg-[#304778] mb-2"></span>
        </div>

        <h2 className="text-xl md:text-3xl font-bold italic mb-6  text-[#232323] text-center">
          Visual Story
        </h2>

        <div className="flex justify-center items-center gap-4 py-10">
          <div className="flex-1 relative">
            <img
              src="images/our-work/work-1.png"
              alt="Workstations"
              className="max-w-2xl h-[800px] rounded-3xl object-cover"
            />

            <p className="absolute bottom-4 left-4 text-white text-xl md:text-3xl font-bold">
              Workstations
            </p>
          </div>
          <div className="flex flex-col gap-6 flex-1">
            <img
              src="images/our-work/work-2.png"
              alt="interiors"
              className="rounded-3xl"
            />
            <img
              src="images/our-work/work-3.png"
              alt="interiors"
              className="rounded-3xl"
            />
          </div>
        </div>

        <div className="flex gap-6 w-full pb-14 justify-center items-center">
          <img
            src="images/our-work/work-2.png"
            alt="interiors"
            className="w-1/3 rounded-3xl object-cover"
          />
          <img
            src="images/our-work/work-3.png"
            alt="interiors"
            className="w-1/3 rounded-3xl object-cover"
          />
          <img
            src="images/our-work/work-4.png"
            alt="interiors"
            className="w-1/3 rounded-3xl object-cover"
          />
        </div>

        <div className="bg-[#334A78] text-white h-72 max-w-2xl rounded-2xl items-center flex flex-col justify-center mx-auto py-16">
          <img src="images/our-work/lucide_quote.svg" alt="quote" />
          <p className="text-center py-6 text-sm md:text-base">
            &quot;The transformation exceeded our expectations. Our team
            <br /> productivity has soared, and the space truly reflects who we
            are
            <br /> as a company. The attention to detail and commitment to
            <br />
            sustainability were particularly impressive.&quot;
          </p>
          <div className="flex gap-3 items-center">
            <img
              src="images/businessman.png"
              alt="profile"
              className="w-12 h-12 rounded-full"
            />
            <div className="flex flex-col">
              <h2 className="font-bold text-sm md:text-base">Sarah Chen</h2>
              <p className="text-[8px] md:text-sm">Interior Designer</p>
            </div>
          </div>
        </div>

        <div className="items-center flex flex-col justify-center mx-auto pt-20">
          <h2 className="text-[#334A78] text-xl md:text-3xl xl:text-5xl">
            Ready to Transform Your Space?
          </h2>
          <p className="text-[#334A78] text-base md:text-2xl py-4 text-center">
            Let&apos;s create an inspiring environment that elevates
            <br /> your brand and empowers your team
          </p>
          <div className="flex flex-col lg:flex-row gap-2 mt-5">
            <button
              onClick={() => setShowContactPopup(true)}
              className="bg-[#1C346B] hover:bg-[#4D66A1] border border-[#1C346B] hover:border-[#4D66A1] text-white px-6 py-3 rounded-3xl flex justify-center items-center gap-1 text-sm md:text-base w-fit font-Georgia"
            >
              <span>Get in touch</span>
              <RiArrowRightUpLine />
            </button>
            <a
              href="tel:+919136036603"
              className="bg-[#FFFFFF]/20 hover:bg-[#334A78]/20 px-4 py-2 rounded-3xl border-2 border-[#334A78] hover:border-[#334A78] text-[#334A78] text-sm md:text-base w-fit font-TimesNewRoman items-center flex"
            >
              Call us: +91-9136036603
            </a>
          </div>
        </div>
      </section>

      {showContactPopup && (
        <ContactUsPopup onClose={() => setShowContactPopup(false)} />
      )}

      <Footer />
    </>
  );
}

export default OurWork;

function WorkStages({ stage }) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="relative w-36 h-36 flex items-center justify-center mb-4">
        <img src={stage.icon} alt={stage.title} className="" />
      </div>
      <h3 className="text-xl font-bold italic text-[#232323] font-Georgia mb-2">
        {stage.title}
      </h3>
      <p className="text-sm text-[#777777] font-Georgia">{stage.desc}</p>
    </div>
  );
}
