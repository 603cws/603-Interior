import { useState, useEffect } from "react";
import Footer from "../common-components/Footer";

import LandingNavbar from "../common-components/LandingNavbar";

import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import { useApp } from "../Context/Context";
function HelpnFaq() {
  const [expandedIndex, setExpandedIndex] = useState();
  const [layoutexpandedIndex, setlayoutExpandedIndex] = useState();
  const [vendorexpandedIndex, setvendorExpandedIndex] = useState();
  const [executionexpandedIndex, setexecutionExpandedIndex] = useState();
  const [paymentexpandedIndex, setpaymentExpandedIndex] = useState();

  // const [isMobile, setIsMobile] = useState(false);

  const { isMobile } = useApp();

  // Detect screen size
  // useEffect(() => {
  //   const handleResize = () => {
  //     setIsMobile(window.innerWidth <= 768); // Mobile & Tablet: < 768px
  //   };
  //   handleResize(); // Check on mount
  //   window.addEventListener("resize", handleResize);
  //   return () => window.removeEventListener("resize", handleResize);
  // }, []);

  const generalquestions = [
    {
      title: "What is  Workved Interiors?",
      content:
        " Workved Interiors is a tech-driven platform that helps corporates design and set up their office spaces with instant layouts, smart BOQs, and vendor partnerships, ensuring a hassle-free experience",
    },
    {
      title: "Who can use  Workved Interiors?",
      content:
        "Our platform is designed for corporates, startups, office administrators, HR teams, and real estate decision-makers looking for efficient office space planning and execution.",
    },
    {
      title: "How does  Workved Interiors simplify office setup?",
      content:
        "We eliminate the need for lengthy consultations by offering instant office layouts, predefined and custom BOQs, and direct vendor collaboration, saving you time and costs.",
    },
    {
      title: "Is  Workved Interiors only for large businesses?",
      content:
        "No, we cater to businesses of all sizes, from small startups to large corporations, providing scalable solutions for workspace design.",
    },
    {
      title: "Can I get a customized office layout?",
      content:
        "Yes! You can input your office requirements, and our system generates a tailored layout to match your needs.",
    },
  ];

  const layoutofficeQuestion = [
    {
      title: "What is a BOQ (Bill of Quantities)?",
      content:
        "A BOQ is a detailed breakdown of materials, furniture, and services needed to set up your office, along with estimated costs.",
    },
    {
      title: "Do you offer predefined BOQs?",
      content:
        "Yes, we provide Basic, Luxury, and Ultra Luxury predefined BOQs that streamline decision-making.",
    },
    {
      title: "Can I customize my BOQ?",
      content:
        "Absolutely! You can add, remove, or modify products based on your requirements.",
    },
    {
      title: "How accurate are the estimated costs in the BOQ?",
      content:
        "The BOQ provides realistic cost estimates based on vendor pricing and industry standards, ensuring transparency.",
    },
    {
      title: "Do you provide recommendations for vendors and products?",
      content:
        "Yes! Based on your needs, we recommend vendors and products, ensuring quality and efficiency.",
    },
  ];
  const vendorQuestion = [
    {
      title: "Which brands do you collaborate with?",
      content:
        "We work with trusted brands like Mitsubishi, Daikin, Featherlite, and more, offering premium office solutions.",
    },
    {
      title:
        "Can we choose which category our brand appears in for predefined BOQs?",
      content:
        "Yes! Brands can select categories for their products in our predefined BOQs for maximum visibility.",
    },
    {
      title: "How can vendors partner with  Workved Interiors?",
      content:
        "Vendors can collaborate with us by listing their products on our platform, gaining exposure to corporate clients.",
    },
    {
      title:
        "What are the benefits of listing our brand with  Workved Interiors?",
      content:
        "Partner brands get direct visibility, increased sales opportunities, and premium positioning in our curated BOQs.",
    },
    {
      title: "Can vendors set their own pricing on the platform?",
      content:
        "Yes, vendors can list their pricing while ensuring competitive market rates.",
    },
  ];
  const executionQuestion = [
    {
      title: "Do you provide end-to-end execution for office interiors?",
      content:
        "Yes, we handle everything from design planning to procurement and execution, ensuring a seamless process.",
    },
    {
      title: "Can we work with our own architects and vendors?",
      content:
        "Yes, our platform is flexible, allowing you to integrate your own team while benefiting from our tools and recommendations.",
    },
    {
      title: "How do you ensure quality in execution?",
      content:
        "We collaborate with trusted brands and professionals, ensuring high standards in materials and workmanship.",
    },
    {
      title:
        "Can I get assistance in negotiating with landlords based on my office layout?",
      content:
        "Yes! Our layout tools help you optimize space and negotiate better lease terms before signing contracts.",
    },
    {
      title:
        "What if my office requirements change after generating the layout?",
      content:
        "No worries! You can modify your layout and BOQ as needed before finalizing your plan.",
    },
  ];
  const paymentQuestion = [
    {
      title: "Is using  Workved Interiors free?",
      content:
        "Generating an office layout and exploring BOQs is free, but charges apply for vendor collaborations and execution services.",
    },
    {
      title: "How do I make payments for selected products and services?",
      content:
        "Payments can be made directly through the platform or as per vendor agreements.",
    },
    {
      title: "Do you offer financing or payment plans?",
      content:
        "We are working on flexible payment solutions with our vendor partners—stay tuned!",
    },
    {
      title: "Are there any hidden charges?",
      content:
        "No, we believe in 100% transparency—all costs are clearly outlined in your BOQ.",
    },
    {
      title: "How do I get started with  Workved Interiors?",
      content:
        "Simply sign up, enter your office details, explore layouts, and generate your BOQ—all in a few clicks!",
    },
  ];

  const handleToggle = (index, setExpandedIndex) => {
    setExpandedIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const scrollToSection = (sectionname) => {
    const section = document.getElementById(`${sectionname}`);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="font-Poppins">
      {/* hero section */}

      <section className="w-full  lg:h-screen p-5">
        <div className="bg-[#A9D3CE] h-full rounded-3xl">
          <div className="relative">
            <LandingNavbar />
          </div>
          <div className="flex-1 flex flex-col md:flex-row justify-between items-center h-full">
            <div className="flex-1 flex flex-col lg:gap-8 mx-4 gap-2 lg:mx-20 mt-24 font-extrabold text-[#1F5C54] font-lato">
              <h1 className="text-sm lg:text-5xl 3xl:text-6xl 3xl:leading-[4.5rem]">
                Looking for help? Here are our {!isMobile && <br />} most
                frequently asked questions.
              </h1>
              <p className="text-xs lg:text-base">
                Everything you need to know about Workved Interiors. Can’t find
                the answer to a question {!isMobile && <br />}you have? No
                worries, just click ‘I’ve got a question’ or ‘Chat to our team’!
              </p>
            </div>
            <div className="flex-1 h-full flex justify-end items-end relative">
              <img
                src="/images/helpimg.png"
                alt=""
                className="max-h-full h-full"
              />
              <span className="px-5 py-3 rounded-3xl bg-[#54DED3] text-xs font-lora font-bold absolute top-1/2 left-10 animate-message1">
                What is Workved Interiors?
              </span>
              <span className="px-5 py-3 rounded-3xl bg-[#54DED3] text-xs font-lora font-bold absolute top-1/4 left-1/4 animate-message3">
                What is a BOQ?
              </span>
              <span className="px-5 py-3 rounded-3xl bg-[#54DED3] text-xs font-lora font-bold absolute bottom-1/2 right-1 animate-message2">
                Can I customize my BOQ?
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* section for the image */}
      <section className="hidden lg:block">
        <div className="font-medium capitalize grid grid-cols-5 my-12 gap-3 container mx-auto">
          {/* each card */}
          <div
            className="max-w-sm flex flex-col justify-center items-center gap-3 border border-[#000] p-3 rounded-lg cursor-pointer"
            onClick={() => scrollToSection("sectionFAQ")}
          >
            <div>
              <img src="/images/generalfaq.png" alt="helpfaq" />
            </div>
            <h3 className="text-lg text-center">General Information</h3>
          </div>
          {/* each card */}
          <div
            className="max-w-sm flex flex-col justify-center items-center gap-3 border border-[#000] p-3 rounded-lg cursor-pointer"
            onClick={() => scrollToSection("sectionOfficelayout")}
          >
            <div>
              <img src="/images/hlepnfaq1.png" alt="helpfaq" />
            </div>
            <h3 className="text-lg text-center">Office Layout & BOQ</h3>
          </div>
          {/* each card */}
          <div
            className="max-w-sm flex flex-col justify-center items-center gap-3 border border-[#000] p-3 rounded-lg cursor-pointer"
            onClick={() => scrollToSection("sectionvendor")}
          >
            <div>
              <img src="/images/V&B.png" alt="helpfaq" />
            </div>
            <h3 className="text-lg text-center">
              Vendor & Brand Collaborations
            </h3>
          </div>
          {/* each card */}
          <div
            className="max-w-sm flex flex-col justify-center items-center gap-3 border border-[#000] p-3 rounded-lg cursor-pointer"
            onClick={() => scrollToSection("sectionExecution")}
          >
            <div>
              <img src="/images/e&I.png" alt="helpfaq" />
            </div>
            <h3 className="text-lg text-center">Execution & Implementation</h3>
          </div>
          {/* each card */}
          <div
            className="max-w-sm flex flex-col justify-center items-center gap-3 border border-[#000] p-3 rounded-lg cursor-pointer"
            onClick={() => scrollToSection("sectionPayment")}
          >
            <div>
              <img src="/images/paymentHelp.png" alt="helpfaq" />
            </div>
            <h3 className="text-lg text-center">Pricing & Payments</h3>
          </div>
        </div>
      </section>

      {/* general faq */}
      <section className="my-6 lg:my-10" id="sectionFAQ">
        <div className="lg:container mx-2 lg:mx-auto my-3">
          <div className=" flex flex-col bg-[#f4f4f4] border rounded-xl">
            <div>
              <h3 className="text-[#1F5C54] text-xl lg:text-3xl p-3 mx-4">
                General FAQs
              </h3>
            </div>
            {generalquestions.map((item, index) => (
              // <div key={index} className="border-b last:border-b-0">
              <div
                key={index}
                className="mb-3 font-Poppins font-medium text-xs lg:text-base text-[#222] border-b border-[#54DED3] mx-4"
              >
                <div
                  className="flex w-full text-left p-4  bg-gray-100 hover:bg-gray-200 focus:outline-none justify-between cursor-pointer "
                  onClick={() => handleToggle(index, setExpandedIndex)}
                >
                  <button className="text-start">{item.title}</button>
                  {expandedIndex === index ? <FaAngleUp /> : <FaAngleDown />}
                </div>
                {expandedIndex === index && (
                  <div className="p-4  border-t">
                    <p>{item.content}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Office Layout & BOQ */}
      <section className="my-10 " id="sectionOfficelayout">
        <div className="lg:container  lg:mx-auto mx-2 my-3">
          <div className=" flex flex-col bg-[#f4f4f4] border rounded-xl">
            <div>
              <h3 className="text-[#1F5C54] text-xl lg:text-3xl p-3 mx-4">
                Office Layout & BOQ{" "}
              </h3>
            </div>
            {layoutofficeQuestion.map((item, index) => (
              // <div key={index} className="border-b last:border-b-0">
              <div
                key={index}
                className="mb-3 font-Poppins font-medium text-xs lg:text-base text-[#222] border-b border-[#54DED3] mx-4"
              >
                <div
                  className="flex w-full text-left p-4  bg-gray-100 hover:bg-gray-200 focus:outline-none justify-between cursor-pointer "
                  onClick={() => handleToggle(index, setlayoutExpandedIndex)}
                >
                  <button className="text-start">{item.title}</button>
                  {layoutexpandedIndex === index ? (
                    <FaAngleUp />
                  ) : (
                    <FaAngleDown />
                  )}
                </div>
                {layoutexpandedIndex === index && (
                  <div className="p-4  border-t">
                    <p>{item.content}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vendor & Brand Collaborations */}
      <section className="my-10 " id="sectionvendor">
        <div className="lg:container  lg:mx-auto mx-2 my-3">
          <div className=" flex flex-col bg-[#f4f4f4] border rounded-xl">
            <div>
              <h3 className="text-[#1F5C54] text-xl lg:text-3xl p-3 mx-4">
                Vendor & Brand Collaborations{" "}
              </h3>
            </div>
            {vendorQuestion.map((item, index) => (
              // <div key={index} className="border-b last:border-b-0">
              <div
                key={index}
                className="mb-3 font-Poppins font-medium text-xs lg:text-base text-[#222] border-b border-[#54DED3] mx-4"
              >
                <div
                  className="flex w-full text-left p-4  bg-gray-100 hover:bg-gray-200 focus:outline-none justify-between cursor-pointer "
                  onClick={() => handleToggle(index, setvendorExpandedIndex)}
                >
                  <button className="text-start">{item.title}</button>
                  {vendorexpandedIndex === index ? (
                    <FaAngleUp />
                  ) : (
                    <FaAngleDown />
                  )}
                </div>
                {vendorexpandedIndex === index && (
                  <div className="p-4  border-t">
                    <p>{item.content}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/*Execution & Implementation  */}
      <section className="my-10 " id="sectionExecution">
        <div className="lg:container  lg:mx-auto mx-2 my-3">
          <div className=" flex flex-col bg-[#f4f4f4] border rounded-xl">
            <div>
              <h3 className="text-[#1F5C54] text-xl lg:text-3xl p-3 mx-4">
                Execution & Implementation{" "}
              </h3>
            </div>
            {executionQuestion.map((item, index) => (
              // <div key={index} className="border-b last:border-b-0">
              <div
                key={index}
                className="mb-3 font-Poppins font-medium text-xs lg:text-base text-[#222] border-b border-[#54DED3] mx-4"
              >
                <div
                  className="flex w-full text-left p-4  bg-gray-100 hover:bg-gray-200 focus:outline-none justify-between cursor-pointer "
                  onClick={() => handleToggle(index, setexecutionExpandedIndex)}
                >
                  <button className="text-start">{item.title}</button>
                  {executionexpandedIndex === index ? (
                    <FaAngleUp />
                  ) : (
                    <FaAngleDown />
                  )}
                </div>
                {executionexpandedIndex === index && (
                  <div className="p-4  border-t">
                    <p>{item.content}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing & Payments */}
      <section className="my-10 " id="sectionPayment">
        <div className="lg:container  lg:mx-auto mx-2 my-3">
          <div className=" flex flex-col bg-[#f4f4f4] border rounded-xl">
            <div>
              <h3 className="text-[#1F5C54] text-xl lg:text-3xl p-3 mx-4">
                Pricing & Payments{" "}
              </h3>
            </div>
            {paymentQuestion.map((item, index) => (
              // <div key={index} className="border-b last:border-b-0">
              <div
                key={index}
                className="mb-3 font-Poppins font-medium text-xs lg:text-base  text-[#222] border-b border-[#54DED3] mx-4"
              >
                <div
                  className="flex w-full text-left p-4  bg-gray-100 hover:bg-gray-200 focus:outline-none justify-between cursor-pointer "
                  onClick={() => handleToggle(index, setpaymentExpandedIndex)}
                >
                  <button className="text-start">{item.title}</button>
                  {paymentexpandedIndex === index ? (
                    <FaAngleUp />
                  ) : (
                    <FaAngleDown />
                  )}
                </div>
                {paymentexpandedIndex === index && (
                  <div className="p-4  border-t">
                    <p>{item.content}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* contact section */}
      <section className="my-10">
        <div className="lg:container mx-4 lg:mx-auto my-3 ">
          <div className="border-[#B5B5B5] border rounded-2xl flex flex-col justify-center items-center lg:p-2 xl:p-8 gap-4 xl:gap-8 ">
            <div className="font-extrabold  text-[#1F5C54]">
              <h2 className="text-xl lg:text-2xl capitalize tracking-wide">
                Need more help?
              </h2>
              <p className="text-sm lg:text-lg text-center">
                Try these next steps
              </p>
            </div>
            <div className="flex lg:flex-row flex-col justify-center items-center gap-3 font-semibold text-sm lg:text-lg text-[#000] lg:shadow-[0px_0px_5px_rgba(0,0,0,0.05)] px-5 rounded-lg ml-10">
              <div className="">
                <img src="/images/helplogo.png" alt="help logo" />
              </div>
              <div className="flex flex-col py-3">
                <h3>Contact us</h3>
                <p>Tell us more and we’ll help you get there</p>
                <p>+91-9136036603</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer>
        <Footer />
      </footer>
    </div>
  );
}

export default HelpnFaq;
