import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import { useState } from "react";

function Help({ isvendor }) {
  const [expandedIndex, setExpandedIndex] = useState();
  const handleToggle = (index) => {
    setExpandedIndex((prevIndex) => (prevIndex === index ? null : index));
  };
  const accordionItems = [
    {
      title: "What is Workved Interiors?",
      content:
        "Workved Interiors is a tech-driven platform that helps corporates design and set up their office spaces with instant layouts, smart BOQs, and vendor partnerships, ensuring a hassle-free experience",
    },
    {
      title: "Who can use Workved Interiors?",
      content:
        "Our platform is designed for corporates, startups, office administrators, HR teams, and real estate decision-makers looking for efficient office space planning and execution.",
    },
    {
      title: "How does Workved Interiors simplify office setup?",
      content:
        "We eliminate the need for lengthy consultations by offering instant office layouts, predefined and custom BOQs, and direct vendor collaboration, saving you time and costs.",
    },
  ];
  return (
    <div
      className={`flex-1  lg:rounded-3xl lg:my-2.5 font-Poppins`}
      // className={`flex-1  ${
      //   !isvendor && "border-2 border-[#000]"
      // } rounded-3xl my-2.5 font-Poppins`}
    >
      {/* <div className="flex-1  border-2 border-[#000] rounded-3xl my-2.5 font-Poppins"> */}
      <div className="flex-col overflow-y-auto custom-scrollbar h-[calc(100vh-120px)] py-2 px-3">
        <div className="my-4">
          <h2 className="text-[#000] text-xl lg:text-3xl capitalize font-semibold text-center">
            How can we help you?
          </h2>
        </div>

        <div className="bg-[#fff] border-2 p-3 border-[#E6E6E6] rounded-lg">
          <h3 className="lg:px-8 text-lg lg:text-2xl capitalize font-medium">
            Common Questions
          </h3>
          <div className="flex flex-col m-auto lg:px-8 py-2 ">
            {accordionItems.map((item, index) => (
              <div
                key={index}
                className="mb-3 text-[#141515] font-Poppins font-medium"
              >
                <div
                  className={`flex w-full text-left p-4 bg-[#F9F9F9] border border-[#E5E7EB] hover:bg-gray-200 focus:outline-none justify-between cursor-pointer ${
                    expandedIndex === index ? "rounded-t-lg" : "rounded-lg"
                  } `}
                  onClick={() => handleToggle(index)}
                >
                  <button className="font-medium text-sm lg:text-lg">
                    {item.title}
                  </button>
                  {expandedIndex === index ? <FaAngleUp /> : <FaAngleDown />}
                </div>
                {expandedIndex === index && (
                  <div className="p-4 bg-white lg:border border-[#E5E7EB] lg:rounded-b-lg">
                    <p className="text-black text-xs lg:text-base">
                      {item.content}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 flex justify-center items-center bg-[#F9F9F9] border-2 p-3 border-[#CCCCCC] rounded-lg mt-5 mb-10 lg:mb-0 ">
          <div className="my-4">
            <h4 className="text-[#374A75] font-medium leading-[150%] tracking-[-1.1%] lg:text-xl text-center mb-3">
              Still Need Help?
            </h4>
            <p className="text-[#4B5563] font-medium leading-[150%] tracking-[-1.1%] lg:text-xl text-center mb-2">
              Our support team is available 24/7 to assist you{" "}
            </p>
            <div className="flex flex-col md:flex-row justify-center items-center gap-4 my-1">
              <a
                href="tel:+919136036603"
                className="px-5 w-44 py-3 bg-[#374A75] text-white capitalize"
              >
                +91-9136036603
              </a>
              <a
                href="mailto:sales@603thecoworkingspace.com"
                className="border-2 w-44 border-[#ccc] text-[#374A75] px-5 py-2 flex justify-center items-center"
              >
                Email
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Help;
