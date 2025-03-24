import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import { useState } from "react";

function Help() {
  const [expandedIndex, setExpandedIndex] = useState();
  const handleToggle = (index) => {
    setExpandedIndex((prevIndex) => (prevIndex === index ? null : index));
  };
  const accordionItems = [
    {
      title: "What is 603 Interiors?",
      content:
        "603 Interiors is a tech-driven platform that helps corporates design and set up their office spaces with instant layouts, smart BOQs, and vendor partnerships, ensuring a hassle-free experience",
    },
    {
      title: "Who can use 603 Interiors?",
      content:
        "Our platform is designed for corporates, startups, office administrators, HR teams, and real estate decision-makers looking for efficient office space planning and execution.",
    },
    {
      title: "How does 603 Interiors simplify office setup?",
      content:
        "We eliminate the need for lengthy consultations by offering instant office layouts, predefined and custom BOQs, and direct vendor collaboration, saving you time and costs.",
    },
  ];
  return (
    <div className="flex-1  border-2 border-[#000] rounded-3xl my-2.5 font-Poppins">
      <div className="flex-col overflow-y-auto scrollbar-hide h-[calc(100vh-120px)] py-2 px-3">
        <div className="my-4">
          <h2 className="text-[#000] text-xl capitalize font-semibold text-center">
            How can we help you?
          </h2>
        </div>

        <div className="bg-[#fff] border-2 p-3 border-[#E6E6E6] rounded-xl">
          <h3 className="px-8 text-xl capitalize font-medium">Common Issue</h3>
          <div className="flex flex-col m-auto px-8 py-2 ">
            {accordionItems.map((item, index) => (
              <div
                key={index}
                className="mb-3 text-[#141515] font-Poppins font-medium"
              >
                <div
                  className="flex w-full text-left p-4 bg-gray-100 hover:bg-gray-200 focus:outline-none justify-between cursor-pointer rounded-xl"
                  onClick={() => handleToggle(index)}
                >
                  <button>{item.title}</button>
                  {expandedIndex === index ? <FaAngleUp /> : <FaAngleDown />}
                </div>
                {expandedIndex === index && (
                  <div className="p-4 bg-white border-t rounded-xl">
                    <p>{item.content}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 flex justify-center items-center bg-[#fff] border-2 p-3 border-[#E6E6E6] rounded-xl  my-5">
          <div className="my-4">
            <h4 className="text-[#1A3A36] text-xl text-center mb-3">
              Still Need Help?
            </h4>
            <p className="text-[#4B5563] text-center mb-2">
              Our support team is available 24/7 to assist you{" "}
            </p>
            <div className="flex justify-center items-center gap-4 my-1">
              <button className="px-5 py-3 bg-[#1A3A36] text-[#fff] capitalize rounded-3xl">
                +91-9136036603
              </button>
              <button className="border-2 border-[#D1D5DB] text-[#1A3A36] px-5 py-2 rounded-2xl">
                Email
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Help;
