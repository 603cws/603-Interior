import DashboardGetPlan from "../common-components/DashboardGetPlan";
import Footer from "../common-components/Footer";
import HeroSection from "./HeroSection";
import { FaHeadphones } from "react-icons/fa6";
import { useState } from "react";
import { FaArrowRightLong, FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

const background = "/images/career-page-bg.png";
const RecentPosts = [
  {
    Image: "/recentpostimg.png",
    des: "The way we design office spaces is evolving rapidly. With hybrid work models, a focus on employee well-being, and advancements in technology, companies are rethinking how they utilize their office spaces. ",
    date: "June 5, 2021",
    description: "Things to Know When Choosing the Perfect Sofa",
  },
  {
    Image: "/recentpostimg.png",
    date: "June 5, 2021",
    description: "Colour Schemes to Introduce Spring in Your Home",
  },
  {
    Image: "/recentpostimg.png",
    date: "June 5, 2021",
    description: "4 Ways to Create Extra Space in Small Homes",
  },
];

const FollowUsOn = [
  {
    title: "facebook",
    image: "/images/fbnew.png",
  },
  {
    title: "x",
    image: "/images/xnew.png",
  },
  {
    title: "linkedin",
    image: "/images/linkdeinnew.png",
  },
  {
    title: "instagram",
    image: "/images/instanew.png",
  },
];

const mainBlogs = [
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

let items = mainBlogs;
let itemsPerPage = 4;

function InteriorBlog() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate total pages
  const totalPages = Math.ceil(items.length / itemsPerPage);

  // Get current page items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);

  // Handle page change
  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  return (
    <>
      <HeroSection background={background} title={"Blog"} />

      {/* layout */}
      <section className="my-10">
        <div className="lg:container lg:mx-auto ">
          <div className="flex flex-col xl:grid  xl:grid-cols-[3fr,1fr] ">
            <div className="space-y-12 md:space-y-6">
              {currentItems.map((blog, index) => (
                <div
                  className="max-w-5xl mx-auto h-[550px] relative"
                  key={index}
                >
                  {/* Image with date */}
                  <div className="relative">
                    <img
                      src={blog.image}
                      alt="Office with trees"
                      className="w-full h-80 object-cover rounded-md"
                    />
                    <div className="absolute top-4 right-4 bg-white text-center px-3 py-1 shadow-md rounded-sm">
                      <div className="text-lg font-bold">{blog.date}</div>
                      <div className="text-sm text-gray-500 -mt-1">
                        {blog.month}
                      </div>
                    </div>
                  </div>

                  {/* Overlapping content box */}
                  <div className="absolute left-0 transform -translate-y-[25%] w-[95%] bg-white shadow-lg  p-6 font-lora">
                    <h2 className="text-2xl  font-bold text-[#232323] mb-2">
                      {blog.title}
                    </h2>

                    <p className="text-sm text-[#777] mb-4">
                      {blog.shortdescription}
                    </p>

                    <p className="text-[15px] text-[#777] border-t border-t-[#777] mb-6 pt-2 xl:pt-3">
                      {blog.description}
                    </p>

                    <div className="absolute left-0  bottom-0  transform translate-x-[20%]  translate-y-[40%] bg-[#fff]">
                      <button
                        onClick={() => {
                          navigate(`${blog.title.replace(/\s/g, "_")}`);
                        }}
                        className="relative mt-4 inline-block border-[#232323] px-6 py-2 border-2 font-medium text-sm tracking-wide group"
                      >
                        <span className="relative z-10 text-[#232323] font-bold">
                          Read More
                        </span>
                        {/* Top-left line     group-hover:w-32      group-hover:h-11   */}
                        <span className="absolute top-0 -left-2 w-2 h-px bg-[#232323] "></span>
                        <span className="absolute -top-2 left-0 h-2 w-px bg-[#232323] "></span>

                        {/* Bottom-right line   group-hover:w-32      group-hover:h-11 */}
                        <span className="absolute bottom-0 -right-2 w-2 h-px bg-[#232323] "></span>
                        <span className="absolute -bottom-2 right-0 h-2 w-px bg-[#232323] "></span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}

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
            <aside className="space-y-4 px-3 lg:px-0">
              <div className="  font-lora ">
                <div className="lg:p-4 ">
                  <h3 className="text-[20px] font-bold">Categories</h3>
                  <div className="h-[3px] w-full bg-gradient-to-r from-[#304778] to-[#304778]/0" />
                  <ul className=" text-[15px] text-[#232323]  [&_li]:my-3 [&_li]:px-6 [&_li]:py-1 [&_li]:bg-[#fff] ">
                    <li>Decoration</li>
                    <li>Door Windows</li>
                    <li>Home Land</li>
                    <li>Roof Installation</li>
                  </ul>
                </div>
              </div>
              <div className=" font-lora  ">
                <div className="lg:p-4 ">
                  <h3 className="border-b border-b-[#232323]/10 text-lg font-bold">
                    Recent Post
                  </h3>
                  <ul className="[&_li]:my-3 [&_li]:px-6 [&_li]:py-3 [&_li]:bg-[#fff] ">
                    {RecentPosts.map((post, index) => (
                      <li key={index}>
                        {" "}
                        <div className="flex  gap-3">
                          <div>
                            <img src={`/images/${post.Image}`} alt="recent" />
                          </div>
                          <div className="flex flex-col justify-center font-lora">
                            <h3 className=" text-[13px]  text-[#777]">
                              {post.date}
                            </h3>
                            <p className=" text-[15px] text-[#232323]">
                              {post.description}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className=" font-lato  ">
                <div className="lg:p-4 space-y-3 ">
                  <h3 className="border-b border-b-[#232323]/10 text-lg font-bold">
                    Follow us on
                  </h3>
                  <div className="flex gap-3">
                    {FollowUsOn.map((follow) => (
                      <div key={follow.title}>
                        <img src={follow.image} alt={follow.title} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className=" max-w-sm ">
                <div className="lg:p-4 ">
                  <div className="max-w-sm relative">
                    <img
                      src="/images/asidecontact.png"
                      alt="need help"
                      className="w-full"
                    />
                    <div className="text-[#fff] font-lora  absolute top-0 transform p-6  left-0  flex flex-col gap-6">
                      {/* <div className="text-[#fff] font-lora  absolute top-1/2 transform -translate-y-1/2 left-1/2 -translate-x-1/2  flex flex-col gap-3"> */}
                      <h3 className="capitalize  text-xl font-bold border-b border-[#fff] pb-3">
                        Need Help
                      </h3>
                      <p className=" text-sm">
                        Lorem ipsum, dolor sit amet consectetur adipisicing
                        elit. Quisquam consectetur error excepturi, incidunt
                        accusantium delectus.
                      </p>
                      <div className="flex gap-4 items-center">
                        <div className="bg-[#304778] p-3">
                          <FaHeadphones size={26} />
                        </div>
                        <div className=" font-bold">
                          <h3 className="text-sm">Call Us On:</h3>
                          <p className="text-[20px]">+123 456 7890</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="  font-lato  ">
                <div className="lg:p-4 space-y-3 ">
                  <h3 className="border-b border-b-[#232323]/10 text-lg font-bold">
                    Gallery
                  </h3>
                  <div>
                    <img src="/images/ourworkgallery.png" alt="gallery" />
                  </div>
                </div>
              </div>
            </aside>
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
