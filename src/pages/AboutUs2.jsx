import React, { useState } from "react";
import { ServiceCard } from "../common-components/ServiceCard";
import { RiArrowRightUpLine } from "react-icons/ri";
import Footer from "../common-components/Footer";
import LandingNavbar from "../common-components/LandingNavbar";
import { useNavigate } from "react-router-dom";
import ContactUsPopup from "./ContactUsPopup";
import { motion } from "framer-motion";
import { AnimatedButton } from "../common-components/animated-button";

const services = [
  {
    title: "Workspace Layout Planning",
    description:
      "Smart, ergonomic designs that enhance productivity and brand presence.",
    image: "/images/about-us/section 2/N1.png",
    hoveredImage: "/images/about-us/section 2/s1.png",
  },
  {
    title: "Premium Office Furniture",
    description:
      "Bespoke desks, seating, and storage crafted for elegance and comfort.",
    image: "/images/about-us/section 2/N2.png",
    hoveredImage: "/images/about-us/section 2/s2.png",
  },
  {
    title: "Signature Décor & Lighting",
    description:
      "Statement pieces and ambiance solutions that elevate the workspace.",
    image: "/images/about-us/section 2/N3.png",
    hoveredImage: "/images/about-us/section 2/s3.png",
  },
  {
    title: "Complete Project Development",
    description:
      "From concept to final installation, we manage it all seamlessly.",
    image: "/images/about-us/section 2/N4.png",
    hoveredImage: "/images/about-us/section 2/s4.png",
  },
  {
    title: "Custom & Turnkey Solutions",
    description: "Ready-to-use spaces tailored to your unique business needs.",
    image: "/images/about-us/section 2/N5.png",
    hoveredImage: "/images/about-us/section 2/s5.png",
  },
];
const work_stages = [
  {
    id: 1,
    title: "Space Planning",
    desc: "Start by creating your office layout — add or remove workspaces to fit your needs.",
    icon: "./images/about-us/space-planning.png",
  },
  {
    id: 2,
    title: "Product Selection",
    desc: "Choose from our range of office essentials, including furniture, lighting, HVAC systems, and more.",
    icon: "./images/about-us/product-selection.png",
  },
  {
    id: 3,
    title: "Design Finalization",
    desc: "Review and refine your layout and product choices to ensure everything you want.",
    icon: "./images/about-us/design-final.png",
  },
  {
    id: 4,
    title: "BOQ & Handover",
    desc: "Download your customized Bill of Quantities based on your selected products and finalized layout.",
    icon: "./images/about-us/boq-handover.png",
  },
];

function AboutUs() {
  const navigate = useNavigate();
  const [showContactPopup, setShowContactPopup] = useState(false);
  return (
    <>
      <LandingNavbar className="relative" />
      <section className="pt-10 xl:pt-0 bg-[#334a78]">
        <div className=" md:container px-4 flex flex-col gap-6 lg:gap-0 lg:flex-row justify-between items-center xl:max-w-7xl xl:px-0">
          <div className=" text-[#304778] flex flex-col justify-center items-center lg:items-start text-center lg:text-start gap-5 flex-1">
            {/* <h4 className="font-TimesNewRoman italic font-bold text-4xl capitalize tracking-wider leading-[50px]">
              Creating Workspaces <br /> that inspires
            </h4> */}
            <h2 className="font-TimesNewRoman italic text-3xl xl:text-[44px] xl:leading-[53px] tracking-[0.3px] font-bold text-white capitalize">
              Creating Workspaces <br /> that inspires
            </h2>
            <p className="text-base md:text-2xl text-white  font-Georgia tracking-wide">
              We help businesses design and build offices that are functional,
              stylish, and perfectly
              <br /> tailored to their needs.
            </p>
            {/* <button
              onClick={() => navigate("/layout")}
              className="w-fit  font-Georgia bg-gradient-to-r from-[#75A2BE] to-[#334A78]  border border-[#fff] tracking-wider px-5 py-2.5 rounded capitalize mt-7  hover:scale-105 text-white transition duration-500 ease-in-out"
            >
              start your layout
            </button> */}
            <AnimatedButton
              onClick={() => navigate("/Layout")}
              className="!bg-[#3A5D7B] text-white capitalize font-Georgia mt-7 text-lg"
              variant="default"
              size="lg"
              // glow={true}
              textEffect="shimmer"
              rounded="custom"
              asChild={false}
              hideAnimations={false}
              shimmerColor="#fff"
              shimmerSize="0.1em"
              shimmerDuration="3s"
              borderRadius="6px"
              background="rgba(48, 71, 120, 1)"
              hovereBackground="linear-gradient(90deg,rgba(85,132,182,1)  0%,  rgba(117,162,190,1) 100%)"
            >
              Start Your Layout
            </AnimatedButton>
          </div>
          <motion.div
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className=" xl:py-10 xl:pl-10 flex-1"
          >
            <img src="/images/aboutusHero.webp" alt="" />
            {/* <img src="/images/about-us/about-us-hero.png" alt="" /> */}
          </motion.div>
        </div>
      </section>

      <section className="relative pt-20 lg:py-20 bg-[url('/images/about-us/about-us-bg.png')] bg-no-repeat bg-right-top bg-contain font-Georgia">
        <div className="lg:container px-4 xl:max-w-7xl xl:px-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 h-3/4">
            <div className="flex flex-col justify-center">
              <h2 className="text-xl md:text-4xl font-bold  text-black mb-4 font-Georgia">
                Services We’re Providing
              </h2>
              <p className="text-black text-sm leading-relaxed font-Georgia mb-8">
                Designing office spaces that range from intimate, bespoke
                interiors to large-scale, transformative workplaces.
              </p>
            </div>

            {services.map((service, idx) => (
              <ServiceCard key={idx} {...service} />
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="font-Georgia flex flex-col justify-center gap-2 items-center my-10 capitalize">
          <h1 className=" font-bold text-[#111827] text-3xl xl:text-[42px] leading-[52px]">
            Our story of Growth
          </h1>
          <p className="text-[#4B5563] text-lg text-center">
            From Shared spaces - to Design workplaces
          </p>
        </div>
        <QuoteSection />
      </section>

      <section className="relative py-16 lg:container px-4 xl:max-w-7xl xl:px-0">
        <div className="flex items-center justify-center gap-4 mb-2">
          <span className="w-8 h-px bg-[#304778] mb-2"></span>
          <h5 className="text-sm text-[#304778] font-bold  uppercase font-Georgia">
            Work Stages
          </h5>
          <span className="w-8 h-px bg-[#304778] mb-2"></span>
        </div>

        <h2 className="text-xl md:text-4xl font-bold  mb-6 font-Georgia text-[#232323] text-center">
          Best Solutions For Your Dream
        </h2>
        <p className="text-[#777777] mb-10 max-w-lg md:max-w-2xl mx-auto font-Georgia text-center">
          Clients often don’t know what to expect during the interior design
          process, so we’ve put together our guide work stages
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {work_stages.map((stage) => (
            <div
              key={stage.id}
              className="flex flex-col items-center text-center"
            >
              <div className="relative w-36 h-36 rounded-full border-2 border-dashed border-[#181818] border-opacity-60 flex items-center justify-center mb-4">
                <img
                  src={stage.icon}
                  alt={stage.title}
                  className="w-14 h-14 mt-6"
                />
                <div className="absolute top-0 right-0 w-12 h-12 pl-0 pb-1 bg-white border border-dashed border-[#181818] border-opacity-60 rounded-full flex items-center justify-center text-xl font-semibold text-[#181818] text-opacity-60 font-Georgia">
                  {stage.id}
                </div>
              </div>
              <h3 className="text-lg font-bold  text-[#232323] font-Georgia mb-2">
                {stage.title}
              </h3>
              <p className="text-sm text-[#777777] font-Georgia">
                {stage.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="font-Georgia bg-[url('../images/about-us/contact-section-bg.webp')] bg-no-repeat bg-cover bg-center py-24">
        <div className="lg:container px-4 flex justify-center items-center text-[#fff]">
          <div className="md:flex gap-7 bg-[#000]/20 backdrop-blur-sm p-5 md:p-10 rounded-sm">
            <h2 className=" text-3xl md:text-5xl">
              Unlock Your Dream <br /> Office Today!
            </h2>
            <div>
              <p className="text-sm md:text-base">
                We encourage clients to actively participate in discussions,{" "}
                <br />
                share their ideas, preferences, and feedback.
              </p>
              <div className="flex flex-col lg:flex-row gap-2 mt-5">
                <button
                  onClick={() => setShowContactPopup(true)}
                  className="bg-[#1C346B] border border-[#1C346B] px-4 py-2 rounded-3xl flex justify-center items-center gap-1 text-sm md:text-base w-fit"
                >
                  <span>Get in touch</span>
                  <RiArrowRightUpLine />
                </button>
                <a
                  href="tel:+919136036603"
                  className="bg-[#FFFFFF]/20 px-4 py-2 rounded-3xl border border-[#fff] text-sm md:text-base w-fit"
                >
                  Call us: +91-9136036603
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      {showContactPopup && (
        <ContactUsPopup onClose={() => setShowContactPopup(false)} />
      )}
    </>
  );
}

export default AboutUs;

function QuoteSection() {
  const navigate = useNavigate();
  return (
    <section className="font-Georgia lg:container mx-auto px-4 xl:max-w-7xl xl:px-0">
      <div className="grid md:grid-cols-2 xl:grid-cols-[1fr,1.4fr] gap-8  bg-[#304778] border border-[#CFF3FF] rounded-2xl p-6 md:p-10 items-stretch h-[800px] md:h-[500px]">
        {/* Left: Quote */}
        <div className="flex flex-col justify-between text-white ">
          <p className="text-lg md:text-2xl xl:leading-[42px] leading-relaxed italic relative">
            <span className=" text-4xl absolute -left-4 -top-2">“</span>
            Workved Interiors was born out of real challenges we faced while
            building our own coworking brand—603 The Coworking Space. As we
            scaled across cities, one thing became crystal clear: setting up
            high-quality, functional, and well-designed office spaces was
            unnecessarily complicated.
            <span className="text-4xl align-bottom">”</span>
          </p>

          {/* Button */}
          <button
            onClick={() => navigate("/ourstory")}
            className="mt-8 inline-flex items-center justify-center w-12 h-12 rounded-full border border-white hover:bg-white hover:text-[#2c4d8b] transition"
          >
            →
          </button>
        </div>

        {/* Right: Image */}
        <div className="relative w-full h-[300px] md:h-auto">
          <img
            src="/images/coworking.webp" // replace with your image path
            // src="/images/ourstory.png" // replace with your image path
            alt="Office Interior"
            className="z-10 absolute inset-0 w-full h-full object-cover rounded-xl"
          />
        </div>
      </div>
    </section>
  );
}
