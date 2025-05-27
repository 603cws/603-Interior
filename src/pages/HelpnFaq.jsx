import { useState } from "react";
import Footer from "../common-components/Footer";
import LandingNavbar from "../common-components/LandingNavbar";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
function HelpnFaq() {
  const [newexpandedIndex, setnewExpandedIndex] = useState({
    execution: 0,
    payment: 0,
    general: 0,
    layoutoffice: 0,
    vendor: 0,
  });

  // Toggle handler per category
  const newhandleToggle = (index, category) => {
    setnewExpandedIndex((prev) => ({
      ...prev,
      [category]: prev[category] === index ? null : index,
    }));
  };
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

  const categorizedQuestions = {
    general: generalquestions,
    layoutoffice: layoutofficeQuestion,
    vendor: vendorQuestion,
    execution: executionQuestion,
    payment: paymentQuestion,
  };

  // const handleToggle = (index, setExpandedIndex) => {
  //   setExpandedIndex((prevIndex) => (prevIndex === index ? null : index));
  // };
  const background = "/images/career-page-bg.png";

  return (
    <div className="font-Poppins">
      {/* Navbar Section */}
      <header className="bg-white shadow-lg z-50 relative">
        <LandingNavbar />
      </header>

      {/* Hero Section */}
      <section
        className="relative h-[60vh] flex items-center text-center justify-center bg-cover bg-center bg-no-repeat bg-gray-100"
        style={{
          backgroundImage: `url(${background})`,
          backgroundAttachment: "fixed",
        }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 uppercase">
          <h1 className="text-3xl md:text-5xl lg:text-7xl font-extrabold font-lato  text-white drop-shadow-lg tracking-wider">
            FAQ
          </h1>
        </div>
      </section>

      <section className="container mx-auto text-center  pt-24 pb-6 ">
        <div className="flex flex-col gap-3">
          <h3 className="font-lato font-bold text-sm text-[#304778]">
            Have any Questions
          </h3>
          <h4 className="font-lato font-bold text-[#232323] text-xl lg:text-4xl">
            Recently Asked Questions
          </h4>
          <p className="font-lora text-[#777777] text-[15px]">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi{" "}
            <br />
            incidunt repellendus aut neque rerum quam ab animi reprehenderit?
          </p>
        </div>
      </section>

      {Object.entries(categorizedQuestions).map(
        ([category, questions], sectionIndex) => (
          <section className="my-10" key={sectionIndex}>
            <div
              className={`lg:container mx-2 lg:mx-auto my-3 flex justify-center items-center gap-8 lg:gap-0 flex-col  ${
                sectionIndex === 1 || sectionIndex === 3
                  ? "lg:flex-row-reverse"
                  : "lg:flex-row"
              }`}
            >
              <div className="flex-1 ">
                <img
                  src="/images/help1.png"
                  alt="help section 1"
                  className=" lg:max-w-xl"
                />
              </div>

              <div className=" flex-1 flex flex-col border rounded-xl">
                {questions.map((item, index) => (
                  <div
                    key={index}
                    className="mb-3 font-Poppins font-medium text-xs lg:text-base text-[#232323] border-b last:border-b-0 mx-4"
                  >
                    <div
                      className="flex w-full text-left p-4  focus:outline-none justify-between cursor-pointer "
                      onClick={() => newhandleToggle(index, category)}
                    >
                      <button className="text-start font-lora font-bold text-lg">
                        {item.title}
                      </button>
                      {newexpandedIndex[category] === index ? (
                        <FaAngleUp />
                      ) : (
                        <FaAngleDown />
                      )}
                    </div>
                    {newexpandedIndex[category] === index && (
                      <div className="p-4 text-[#777] border-t font-lora">
                        <p>{item.content}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )
      )}

      <footer>
        <Footer />
      </footer>
    </div>
  );
}

export default HelpnFaq;
