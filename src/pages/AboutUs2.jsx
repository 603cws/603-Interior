import LandingNavbar from "../common-components/LandingNavbar";
import Footer from "../common-components/Footer";
import { useState, useEffect } from "react";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "../styles/Landing.css";
import ContactUsPopup from "../common-components/ContactUsPopup";
import { ServiceCard } from "../common-components/ServiceCard";

const services = [
  {
    title: "Residential Interior",
    description:
      "We do all types of the interior designing, decoration & furnishing.",
    image: "../images/about-us/Vector.png",
  },
  {
    title: "Custom Solutions",
    description:
      "Our creative 3D artists are always ready to translate your designs.",
    image: "../images/about-us/Vector-1.png",
  },
  {
    title: "Renovate Rooms",
    description:
      "We are master of renovation & innovation of existing any kind of rooms.",
    image: "../images/about-us/Vector-2.png",
  },
  {
    title: "3D Design Layouts",
    description: "We Do All Types Of 2D And 3D design Computerized Designs.",
    image: "../images/about-us/Vector-3.png",
  },
  {
    title: "Outsourced Service In House",
    description:
      "Enforces & strengthens your brand identity by integrating rich experience.",
    image: "../images/about-us/Vector-4.png",
  },
];

const stats = [
  { value: "3k", label: "Projects Completed" },
  { value: "20", label: "Awards Win" },
  { value: "845", label: "Team Members" },
  { value: "5k+", label: "Active Customers" },
];

const work_stages = [
  {
    id: 1,
    title: "The Feasibility",
    desc: "This initial phase of the project includes preliminary studies",
    icon: "./images/about-us/Icon.png",
  },
  {
    id: 2,
    title: "The Development",
    desc: "We get into the detail of the scheme. We’ll refine the internal",
    icon: "./images/about-us/Icon-1.png",
  },
  {
    id: 3,
    title: "Full Mobilization",
    desc: "Once the contractor is appointed, will workshops to review",
    icon: "./images/about-us/Icon-2.png",
  },
  {
    id: 4,
    title: "Post PC Work",
    desc: "The project concludes, will visit site to inspect all the works",
    icon: "./images/about-us/Icon-3.png",
  },
];

const faqData = [
  {
    question: "How much do you charge?",
    answer:
      "For a detailed list of our rates, please refer to our pricing page. You’ll find that we’re below what other business in the interior design industry charges, especially for smaller projects.",
  },
  {
    question: "What is a typical project like?",
    answer:
      "A typical project begins with a consultation, followed by concept development, design iterations, and final execution. We ensure client involvement at every key stage.",
  },
  {
    question: "Can you help me pick paint colors?",
    answer:
      "Yes, we offer color consultation services as part of our design package. Our experts will help you choose tones that align with your space, lighting, and preferences.",
  },
];

const skills = [
  { label: "Interior Designer", percent: 75 },
  { label: "Architecture", percent: 80 },
  { label: "Best UIX Design", percent: 95 },
];

function AboutUs() {
  const [showContactPopup, setShowContactPopup] = useState(false);
  const [openIndex, setOpenIndex] = useState(0); // First item open by default

  useEffect(() => {
    if (showContactPopup) {
      document.body.style.overflow = "hidden"; // Disable scroll
    } else {
      document.body.style.overflow = "auto"; // Enable scroll
    }
  }, [showContactPopup]);

  const handleToggle = (index) => {
    setOpenIndex(index === openIndex ? null : index);
  };

  return (
    <div>
      {/* Hero image */}
      <section
        className="bg-[url('/images/about-us/about-us-bg.png')] w-full h-screen bg-no-repeat bg-cover relative sm:static "
        style={{ backgroundAttachment: "fixed" }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="z-20 absolute sm:relative w-full">
          <LandingNavbar />
          <div className="flex flex-col justify-center items-center h-screen text-white font-lato gap-3 font-extrabold">
            <h1 className="text-4xl md:text-5xl lg:text-7xl">About Us</h1>
            {/* <p className="text-lg lg:text-3xl md:text-xl">THIS IS WHO WE ARE</p> */}
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="flex flex-col lg:flex-row bg-white text-black px-10 lg:px-28 max-w-7xl place-self-center py-4">
        {/* Image Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-2 gap-4 w-full pl-0 mb-8">
          <img
            src="../images/about-us/single-img1.png"
            alt="Interior 1"
            className="h-full object-cover mt-8"
          />
          <img
            src="../images/about-us/single-img2.png"
            alt="Interior 2"
            className="h-full object-cover"
          />
        </div>

        {/* Text Content */}
        <div className="w-full space-y-6 lg:pl-10 font-Poppins ">
          <div className="flex items-center gap-2 mt-8 -mb-4">
            <span className="w-6 h-px bg-[#304778] mb-2"></span>
            <h5 className="text-[#304778] text-sm font-semibold tracking-widest uppercase font-lora">
              About Us
            </h5>
          </div>
          <h2 className="text-xl md:text-4xl lg:text-4xl font-bold leading-snug text-[#232323] font-lora">
            Partner In Inspiring And
            <br /> Improving Your Life
          </h2>
          <p className="text-[#777777] text-sm leading-relaxed font-Poppins">
            Our core business is all about aligning our clients’ brands and
            <br />
            businesses with environments crafted around real people’s
            <br /> wants and needs, seeking to balance brand expression with
            <br />
            end-user ergonomics. <br />
            Specialize in mixed-use projects.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 text-sm text-[#777777] font-Poppins">
            <div className="flex items-center gap-2">
              <span>★</span>
              <span>No hidden commission</span>
            </div>
            <div className="flex items-center gap-2">
              <span>★</span>
              <span>Fully Vastu Optimized</span>
            </div>
            <div className="flex items-center gap-2">
              <span>★</span>
              <span>3D Design Included</span>
            </div>
            <div className="flex items-center gap-2">
              <span>★</span>
              <span>Personalized Designs</span>
            </div>
          </div>

          {/* Button */}
          <button className="relative mt-4 inline-block border-[#232323] px-6 py-2 border-2 font-medium text-sm tracking-wide group">
            <span className="relative z-10 text-[#232323] font-Poppins">
              Read More
            </span>
            {/* Top-left line     group-hover:w-32      group-hover:h-11   */}
            <span className="absolute top-0 -left-2 w-2 h-px bg-[#232323] group-hover:w-full transition-all duration-300"></span>
            <span className="absolute -top-2 left-0 h-2 w-px bg-[#232323] group-hover:h-full transition-all duration-300"></span>

            {/* Bottom-right line   group-hover:w-32      group-hover:h-11 */}
            <span className="absolute bottom-0 -right-2 w-2 h-px bg-[#232323] group-hover:w-full  transition-all duration-300"></span>
            <span className="absolute -bottom-2 right-0 h-2 w-px bg-[#232323] group-hover:h-full transition-all duration-300"></span>
          </button>
        </div>
      </section>

      {/* Services Section */}
      <section className="relative max-w-full bg-white py-14 lg:py-24">
        {/* Background Image */}
        <img
          src="./images/about-us/bg-section2.png"
          alt="Blueprint Background"
          className="absolute top-4 left-0 w-full h-full object-contain pointer-events-none"
          style={{ objectPosition: "right top" }} // customize position
        />

        <div className="lg:max-w-7xl lg:px-28 px-4 place-self-center">
          <div className="relative">
            {/* Right Section: Grid of 2x3 Cards */}
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-6 h-px bg-black mb-2"></span>
                  <h5 className="text-xs font-semibold uppercase text-black tracking-widest font-lora">
                    Services
                  </h5>
                </div>
                <h2 className="text-xl md:text-4xl font-extrabold text-black mb-4 font-lora">
                  Services We’re Providing
                </h2>
                <p className="text-black text-sm leading-relaxed font-lato">
                  We are working primarily in and around London and the Home
                  Counties, on schemes that range from small intimate spaces to
                  large projects.
                </p>
              </div>

              {services.map((service, idx) => (
                <ServiceCard key={idx} {...service} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Work Stages */}
      <section className="relative z-10 mt-24 text-center max-w-7xl place-self-center px-10 lg:px-28">
        <div className="flex items-center justify-center gap-4 mb-2">
          <span className="w-8 h-px bg-[#304778] mb-2"></span>
          <h5 className="text-sm text-[#304778] font-semibold uppercase font-lato">
            Work Stages
          </h5>
          <span className="w-8 h-px bg-[#304778] mb-2"></span>
        </div>

        <h2 className="text-xl md:text-4xl font-bold mb-6 font-lora text-[#232323]">
          Best Solutions For Your Dream
        </h2>
        <p className="text-[#777777] mb-10 max-w-lg md:max-w-2xl mx-auto font-Poppins">
          Clients often don’t know what to expect during the interior design
          process, so we’ve put together our guide work stages
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-10 md:px-12">
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
                <div className="absolute top-0 right-0 w-12 h-12 pl-2 bg-white border border-dashed border-[#181818] border-opacity-60 rounded-full flex items-center justify-center text-xl font-semibold text-[#181818] text-opacity-60 font-lora">
                  {stage.id}
                </div>
              </div>
              <h3 className="text-lg font-semibold text-[#232323] font-lora mb-2">
                {stage.title}
              </h3>
              <p className="text-sm text-[#777777] font-Poppins">
                {stage.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative bg-[#F7F7F7] mt-20 py-16 z-10">
        <div className="max-w-7xl mx-auto lg:px-28 px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:md:grid-cols-4 gap-x-12 gap-y-10 text-center">
            {stats.map((stat) => (
              <div key={stat.label}>
                <h3 className="text-[#304778] font-lato font-bold text-6xl md:text-7xl">
                  {stat.value}
                </h3>
                <p className="text-lg md:text-xl font-bold text-[#232323]">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="relative max-w-7xl place-self-center px-6 lg:py-20 md:px-10 z-10 grid lg:grid-cols-2 md:grid-cols-1 gap-10 items-center">
        {/* Left Section */}
        <div className="text-center md:text-left">
          <h2 className="text-4xl font-bold text-[#232323] font-lora">
            We Shape Good Lives
          </h2>
          <p className="text-[#777777] mt-4 max-w-md font-Poppins text-sm">
            Believes that such powerful design aesthetic can only stem from the
            right work ethic– one
          </p>

          {/* Circular Progress Indicators */}
          <div className="mt-10 flex justify-center md:justify-start flex-col md:flex-row gap-10">
            {skills.map((skill, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="relative w-24 h-24">
                  <svg className="transform rotate-0" viewBox="0 0 36 36">
                    <path
                      className="text-[#304778]"
                      strokeWidth="3"
                      fill="none"
                      stroke="currentColor"
                      d="M18 2.0845
                   a 15.9155 15.9155 0 0 1 0 31.831
                   a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-[#CDA174]"
                      strokeWidth="3"
                      fill="none"
                      strokeDasharray={`${skill.percent}, 100`}
                      stroke="currentColor"
                      d="M18 2.0845
                   a 15.9155 15.9155 0 0 1 0 31.831
                   a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-2xl font-medium text-[#232323] font-lora">
                    {skill.percent}%
                  </span>
                </div>
                <p className="mt-2 text-[#304778] text-xl font-lora">
                  {skill.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Section (FAQs Accordion Style) */}
        <div className="w-full max-w-xl space-y-2">
          {faqData.map((faq, index) => (
            <div key={index} className="space-y-1">
              {/* Question box */}
              <div
                className="border rounded p-4 shadow-sm flex justify-between items-center font-semibold text-[#181818] font-lora cursor-pointer"
                onClick={() => handleToggle(index)}
              >
                <span>{faq.question}</span>
                <span className="text-xl">
                  {openIndex === index ? "−" : "+"}
                </span>
              </div>

              {/* Answer outside box */}
              {openIndex === index && (
                <p className="ml-4 py-2 text-sm text-[#777777] font-Poppins max-w-[90%]">
                  {faq.answer}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* footer */}
      <Footer />
      {showContactPopup && (
        <ContactUsPopup onClose={() => setShowContactPopup(false)} />
      )}
    </div>
  );
}

export default AboutUs;
