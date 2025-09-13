import Footer from "../common-components/Footer";
import HeroSection from "./HeroSection";
import { useEffect, useRef, useState } from "react";
import { FaArrowRightLong, FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import LandingNavbar from "../common-components/LandingNavbar";

const blogs = [
  {
    image: "/images/blogoffice.png",
    title:
      "The Future of Office Design: Trends That Will Shape Workspaces in 2025",
    date: 5,
    month: "jun",
    shortdescription: "Door Windows, Home Land",
    description:
      "A small newly opened interior design business that aims to  cover different issues, from sustainability to social, from equal opportunities to education, from giving space",
  },
  {
    image: "/images/blogoffice.png",
    title: "How to Design a Productive Office Space: A Step-by-Step Guide",
    shortdescription: "Decoration",
    date: 5,
    month: "jun",
    description:
      "The scent of lilacs flowing through the house and yard makes me so happy every spring. Unique finds from design shows to sustainable design ideas, you have a never ending supply",
  },
  {
    image: "/images/blogoffice.png",
    title: "How AI & Automation Are Changing Interior Design for Offices",
    shortdescription: "Home Land",
    date: 5,
    month: "jun",
    description:
      "The most important decision you will make when it comes to interior decoration is finding skilled and reliable professionals. At beautiful homes service, we ensure your house design",
  },
  {
    image: "/images/blogoffice.png",
    title: "How Office Design Impacts Employee Productivity & Well-Being",
    shortdescription: "Door Windows , Home Land",
    date: 5,
    month: "jun",
    description:
      "Creative energy positively bubbles over from each of these five engaging red, yellow and blue interior designs. Prolific color clashes create a vivacious spirit that bonds with curious art",
  },
  {
    image: "/images/blogoffice.png",
    title: "10 Office Design Mistakes That Are Killing Your Productivity",
    shortdescription: "Door Windows , Home Land",
    date: 5,
    month: "jun",
    description:
      "Creative energy positively bubbles over from each of these five engaging red, yellow and blue interior designs. Prolific color clashes create a vivacious spirit that bonds with curious art",
  },
];

const MainBlog = [
  {
    image: "/images/blogoffice.png",
    title:
      "The Future of Office Design: Trends That Will Shape Workspaces in 2025",
    date: 5,
    month: "jun",
    shortdescription: "Door Windows, Home Land",
    description:
      "A small newly opened interior design business that aims to  cover different issues, from sustainability to social, from equal opportunities to education, from giving space",
  },
];

let items = blogs;
let itemsPerPage = 4;

function InteriorBlog() {
  const [currentPage, setCurrentPage] = useState(1);

  const blogbox = useRef(null);

  // Calculate total pages
  const totalPages = Math.ceil(items.length / itemsPerPage);

  // Get current page items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);

  // Handle page change
  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);

    // requestAnimationFrame is the web api used for the dom to load

    requestAnimationFrame(() => {
      if (blogbox.current) {
        const yOffset = -100;
        const y =
          blogbox.current.getBoundingClientRect().top +
          window.pageYOffset +
          yOffset;

        window.scrollTo({ top: y, behavior: "smooth" });
      }
    });
  };

  return (
    <>
      <LandingNavbar />
      <HeroSection
        title={"Insights & ideas"}
        description={` Explore stories, trends, tricks on <br /> workspaces design and
            innovation`}
      />

      {/* layout */}
      <section className="my-10">
        <div className="lg:container lg:mx-auto xl:max-w-7xl xl:px-0">
          <div className="">
            <div className="mb-10">
              {MainBlog?.map((blog, index) => (
                <Card blog={blog} index={index} key={blog?.title} />
              ))}
            </div>
            <div ref={blogbox} className="grid  lg:grid-cols-2 gap-10">
              {currentItems.map((blog, index) => (
                <Card blog={blog} index={index} key={blog?.title} />
              ))}
            </div>
            <div className="flex justify-center my-10">
              <div className="flex gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => goToPage(currentPage - 1)}
                  className="px-5 py-2  rounded disabled:hidden"
                >
                  <FaArrowLeftLong />
                </button>

                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => goToPage(i + 1)}
                    className={`px-5 py-2 rounded font-lora font-semibold ${
                      currentPage === i + 1
                        ? "bg-[#304778] text-white"
                        : "bg-[#fff] text-[#232323]"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => goToPage(currentPage + 1)}
                  className="px-5 py-2 rounded disabled:hidden"
                >
                  <FaArrowRightLong />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer>
        <Footer />
      </footer>
    </>
  );
}

export default InteriorBlog;

function Card({ blog, index }) {
  const navigate = useNavigate();
  return (
    <div className="font-lora mx-auto" key={index}>
      <div>
        <div className="relative">
          <img
            src={blog.image}
            alt="Office with trees"
            className="w-full h-64 object-cover"
          />
          <div className="absolute top-4 right-4 bg-white text-center px-3 py-1 shadow-md rounded-sm">
            <div className="text-lg font-bold">{blog.date}</div>
            <div className="text-sm text-gray-500 -mt-1">{blog.month}</div>
          </div>
        </div>
        <div className=" bg-white border-[#ccc] border  p-6 ">
          <h2 className="text-2xl  font-bold text-[#232323] mb-2">
            {blog.title}
          </h2>

          <p className="text-sm text-[#777] mb-4">{blog.shortdescription}</p>

          <p className="text-[15px] text-[#777] border-t border-t-[#777] mb-6 pt-2 xl:pt-3">
            {blog.description}
          </p>

          <div className=" bg-[#fff]">
            <button
              onClick={() => {
                navigate(`${blog.title.replace(/\s/g, "_")}`);
              }}
              className="relative mt-4 inline-block border-[#334A78] px-6 py-2 border-2 font-medium text-sm tracking-wide group"
            >
              <span className="relative font-Georgia  z-10 text-[#334A78] font-bold">
                Read More
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
