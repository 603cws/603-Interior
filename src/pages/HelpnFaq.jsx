import { useState } from "react";
import Footer from "../common-components/Footer";

import LandingNavbar from "../common-components/LandingNavbar";

import { FaAngleDown, FaAngleUp } from "react-icons/fa";
function HelpnFaq() {
  const [expandedIndex, setExpandedIndex] = useState();
  const [layoutexpandedIndex, setlayoutExpandedIndex] = useState();
  const [vendorexpandedIndex, setvendorExpandedIndex] = useState();
  const [executionexpandedIndex, setexecutionExpandedIndex] = useState();
  const [paymentexpandedIndex, setpaymentExpandedIndex] = useState();

  const generalquestions = [
    {
      title: "1.What is 603 Interiors?",
      content:
        "603 Interiors is a tech-driven platform that helps corporates design and set up their office spaces with instant layouts, smart BOQs, and vendor partnerships, ensuring a hassle-free experience",
    },
    {
      title: "2.Who can use 603 Interiors?",
      content:
        "Our platform is designed for corporates, startups, office administrators, HR teams, and real estate decision-makers looking for efficient office space planning and execution.",
    },
    {
      title: "3.How does 603 Interiors simplify office setup?",
      content:
        "We eliminate the need for lengthy consultations by offering instant office layouts, predefined and custom BOQs, and direct vendor collaboration, saving you time and costs.",
    },
    {
      title: "4.Is 603 Interiors only for large businesses?",
      content:
        "No, we cater to businesses of all sizes, from small startups to large corporations, providing scalable solutions for workspace design.",
    },
    {
      title: "5.Can I get a customized office layout?",
      content:
        "Yes! You can input your office requirements, and our system generates a tailored layout to match your needs.",
    },
  ];

  const layoutofficeQuestion = [
    {
      title: "1.What is a BOQ (Bill of Quantities)?",
      content:
        "A BOQ is a detailed breakdown of materials, furniture, and services needed to set up your office, along with estimated costs.",
    },
    {
      title: "2.Do you offer predefined BOQs?",
      content:
        "Yes, we provide Basic, Luxury, and Ultra Luxury predefined BOQs that streamline decision-making.",
    },
    {
      title: "3.Can I customize my BOQ?",
      content:
        "Absolutely! You can add, remove, or modify products based on your requirements.",
    },
    {
      title: "4.How accurate are the estimated costs in the BOQ?",
      content:
        "The BOQ provides realistic cost estimates based on vendor pricing and industry standards, ensuring transparency.",
    },
    {
      title: "5.Do you provide recommendations for vendors and products?",
      content:
        "Yes! Based on your needs, we recommend vendors and products, ensuring quality and efficiency.",
    },
  ];
  const vendorQuestion = [
    {
      title: "1.Which brands do you collaborate with?",
      content:
        "We work with trusted brands like Mitsubishi, Daikin, Featherlite, and more, offering premium office solutions.",
    },
    {
      title:
        "2.Can we choose which category our brand appears in for predefined BOQs?",
      content:
        "Yes! Brands can select categories for their products in our predefined BOQs for maximum visibility.",
    },
    {
      title: "3.How can vendors partner with 603 Interiors?",
      content:
        "Vendors can collaborate with us by listing their products on our platform, gaining exposure to corporate clients.",
    },
    {
      title: "4.What are the benefits of listing our brand with 603 Interiors?",
      content:
        "Partner brands get direct visibility, increased sales opportunities, and premium positioning in our curated BOQs.",
    },
    {
      title: "5.Can vendors set their own pricing on the platform?",
      content:
        "Yes, vendors can list their pricing while ensuring competitive market rates.",
    },
  ];
  const executionQuestion = [
    {
      title: "1.Do you provide end-to-end execution for office interiors?",
      content:
        "Yes, we handle everything from design planning to procurement and execution, ensuring a seamless process.",
    },
    {
      title: "2.Can we work with our own architects and vendors?",
      content:
        "Yes, our platform is flexible, allowing you to integrate your own team while benefiting from our tools and recommendations.",
    },
    {
      title: "3.How do you ensure quality in execution?",
      content:
        "We collaborate with trusted brands and professionals, ensuring high standards in materials and workmanship.",
    },
    {
      title:
        "4.Can I get assistance in negotiating with landlords based on my office layout?",
      content:
        "Yes! Our layout tools help you optimize space and negotiate better lease terms before signing contracts.",
    },
    {
      title:
        "5.What if my office requirements change after generating the layout?",
      content:
        "No worries! You can modify your layout and BOQ as needed before finalizing your plan.",
    },
  ];
  const paymentQuestion = [
    {
      title: "1.Is using 603 Interiors free?",
      content:
        "Generating an office layout and exploring BOQs is free, but charges apply for vendor collaborations and execution services.",
    },
    {
      title: "2.How do I make payments for selected products and services?",
      content:
        "Payments can be made directly through the platform or as per vendor agreements.",
    },
    {
      title: "3.Do you offer financing or payment plans?",
      content:
        "We are working on flexible payment solutions with our vendor partners—stay tuned!",
    },
    {
      title: "4.Are there any hidden charges?",
      content:
        "No, we believe in 100% transparency—all costs are clearly outlined in your BOQ.",
    },
    {
      title: "5.How do I get started with 603 Interiors?",
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

      <section className="w-full h-screen p-5">
        <div className="bg-[#A9D3CE] h-full rounded-3xl">
          <div className="relative">
            <LandingNavbar />
          </div>
          <div className="flex-1 flex justify-between items-center h-full">
            <div className="flex-1 flex flex-col gap-8 mx-20 mt-24 font-extrabold text-[#1F5C54] font-lato">
              <h1 className=" text-5xl 3xl:text-6xl 3xl:leading-[4.5rem]">
                Looking for help? Here are our <br /> most frequently asked
                questions.
              </h1>
              <p className="text-base">
                Everything you need to know about 603 Interiors. Can’t find the
                answer to a question <br /> you have? No worries, just click
                ‘I’ve got a question’ or ‘Chat to our team’!
              </p>
            </div>
            <div className="flex-1 h-full flex justify-end items-end relative">
              <img
                src="/images/helpimg.png"
                alt=""
                className="max-h-full h-full"
              />
              <span className="px-5 py-3 rounded-3xl bg-[#54DED3] text-xs font-lora font-bold absolute top-1/2 left-10 animate-message1">
                What is 603 Interiors?
              </span>
              <span className="px-5 py-3 rounded-3xl bg-[#54DED3] text-xs font-lora font-bold absolute top-1/4 left-1/4 animate-message3">
                What is 603 Interiors?
              </span>
              <span className="px-5 py-3 rounded-3xl bg-[#54DED3] text-xs font-lora font-bold absolute bottom-1/2 right-1 animate-message2">
                What is 603 Interiors?
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* section for the image */}
      <section className="hidden sm:block">
        <div className="font-medium capitalize grid grid-cols-5 my-12 gap-3 container mx-auto">
          {/* each card */}
          <div
            className="max-w-sm flex flex-col justify-center items-center gap-3 border border-[#000] p-3 rounded-lg cursor-pointer"
            onClick={() => scrollToSection("sectionFAQ")}
          >
            <div>
              <img src="/images/hlepnfaq1.png" alt="helpfaq" />
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
              <img src="/images/hlepnfaq1.png" alt="helpfaq" />
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
              <img src="/images/hlepnfaq1.png" alt="helpfaq" />
            </div>
            <h3 className="text-lg text-center">Execution & Implementation</h3>
          </div>
          {/* each card */}
          <div
            className="max-w-sm flex flex-col justify-center items-center gap-3 border border-[#000] p-3 rounded-lg cursor-pointer"
            onClick={() => scrollToSection("sectionPayment")}
          >
            <div>
              <img src="/images/hlepnfaq1.png" alt="helpfaq" />
            </div>
            <h3 className="text-lg text-center">Pricing & Payments</h3>
          </div>
        </div>
      </section>

      {/* general faq */}
      <section className="my-10 " id="sectionFAQ">
        <div className="container  mx-auto my-3">
          <div className=" flex flex-col bg-[#f4f4f4] border rounded-xl">
            <div>
              <h3 className="text-[#1F5C54] text-3xl p-3 mx-4">General FAQs</h3>
            </div>
            {generalquestions.map((item, index) => (
              // <div key={index} className="border-b last:border-b-0">
              <div
                key={index}
                className="mb-3 font-Poppins font-medium  text-[#222] border-b border-[#54DED3] mx-4"
              >
                <div
                  className="flex w-full text-left p-4  bg-gray-100 hover:bg-gray-200 focus:outline-none justify-between cursor-pointer "
                  onClick={() => handleToggle(index, setExpandedIndex)}
                >
                  <button>{item.title}</button>
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
        <div className="container  mx-auto my-3">
          <div className=" flex flex-col bg-[#f4f4f4] border rounded-xl">
            <div>
              <h3 className="text-[#1F5C54] text-3xl p-3 mx-4">
                Office Layout & BOQ{" "}
              </h3>
            </div>
            {layoutofficeQuestion.map((item, index) => (
              // <div key={index} className="border-b last:border-b-0">
              <div
                key={index}
                className="mb-3 font-Poppins font-medium  text-[#222] border-b border-[#54DED3] mx-4"
              >
                <div
                  className="flex w-full text-left p-4  bg-gray-100 hover:bg-gray-200 focus:outline-none justify-between cursor-pointer "
                  onClick={() => handleToggle(index, setlayoutExpandedIndex)}
                >
                  <button>{item.title}</button>
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
        <div className="container  mx-auto my-3">
          <div className=" flex flex-col bg-[#f4f4f4] border rounded-xl">
            <div>
              <h3 className="text-[#1F5C54] text-3xl p-3 mx-4">
                Vendor & Brand Collaborations{" "}
              </h3>
            </div>
            {vendorQuestion.map((item, index) => (
              // <div key={index} className="border-b last:border-b-0">
              <div
                key={index}
                className="mb-3 font-Poppins font-medium  text-[#222] border-b border-[#54DED3] mx-4"
              >
                <div
                  className="flex w-full text-left p-4  bg-gray-100 hover:bg-gray-200 focus:outline-none justify-between cursor-pointer "
                  onClick={() => handleToggle(index, setvendorExpandedIndex)}
                >
                  <button>{item.title}</button>
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
        <div className="container  mx-auto my-3">
          <div className=" flex flex-col bg-[#f4f4f4] border rounded-xl">
            <div>
              <h3 className="text-[#1F5C54] text-3xl p-3 mx-4">
                Execution & Implementation{" "}
              </h3>
            </div>
            {executionQuestion.map((item, index) => (
              // <div key={index} className="border-b last:border-b-0">
              <div
                key={index}
                className="mb-3 font-Poppins font-medium  text-[#222] border-b border-[#54DED3] mx-4"
              >
                <div
                  className="flex w-full text-left p-4  bg-gray-100 hover:bg-gray-200 focus:outline-none justify-between cursor-pointer "
                  onClick={() => handleToggle(index, setexecutionExpandedIndex)}
                >
                  <button>{item.title}</button>
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
        <div className="container  mx-auto my-3">
          <div className=" flex flex-col bg-[#f4f4f4] border rounded-xl">
            <div>
              <h3 className="text-[#1F5C54] text-3xl p-3 mx-4">
                Pricing & Payments{" "}
              </h3>
            </div>
            {paymentQuestion.map((item, index) => (
              // <div key={index} className="border-b last:border-b-0">
              <div
                key={index}
                className="mb-3 font-Poppins font-medium  text-[#222] border-b border-[#54DED3] mx-4"
              >
                <div
                  className="flex w-full text-left p-4  bg-gray-100 hover:bg-gray-200 focus:outline-none justify-between cursor-pointer "
                  onClick={() => handleToggle(index, setpaymentExpandedIndex)}
                >
                  <button>{item.title}</button>
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
        <div className="container  mx-auto my-3 ">
          <div className="border-[#B5B5B5] border rounded-2xl flex flex-col justify-center items-center p-2 xl:p-8 gap-4 xl:gap-8 ">
            <div className="font-extrabold  text-[#1F5C54]">
              <h2 className="text-2xl capitalize tracking-wide">
                Need more help?
              </h2>
              <p className="text-lg text-center">Try these next steps</p>
            </div>
            <div className="flex justify-center items-center gap-3 font-semibold text-lg text-[#000] shadow-[0px_0px_5px_rgba(0,0,0,0.05)] px-5 rounded-lg ml-10">
              <div>
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
