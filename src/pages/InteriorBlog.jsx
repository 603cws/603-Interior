import Footer from "../common-components/Footer";
import HeroSection from "./HeroSection";
import { useEffect, useRef, useState } from "react";
import { FaArrowRightLong, FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import LandingNavbar from "../common-components/LandingNavbar";
import { supabase } from "../services/supabase";
import { blogImageUrl } from "../utils/HelperConstant";
import SpinnerFullPage from "../common-components/SpinnerFullPage";

let itemsPerPage = 4;

function InteriorBlog() {
  const [currentPage, setCurrentPage] = useState(1);
  const [blogs, setBlogs] = useState([]);
  const [mainBlog, setMainBlog] = useState();

  useEffect(() => {
    async function GetBlogsFromDb() {
      try {
        const { data, error } = await supabase.from("blogs").select("*");
        if (error) throw error;
        setBlogs(data);
        let getMainBlog = data?.slice(0, 1);
        setMainBlog(getMainBlog);
      } catch (error) {
        console.error(error);
      }
    }
    GetBlogsFromDb();
  }, []);

  const blogbox = useRef(null);

  const totalPages = Math.ceil(blogs?.length / itemsPerPage);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = blogs?.slice(indexOfFirstItem, indexOfLastItem);
  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);

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

  if (!blogs || !mainBlog) return <SpinnerFullPage />;

  return (
    <>
      <LandingNavbar className="relative" />
      <HeroSection
        title={"Insights & ideas"}
        description={` Explore stories, trends, tricks on <br /> workspaces design and
            innovation`}
      />

      <section className="my-10">
        <div className="lg:container lg:mx-auto xl:max-w-7xl xl:px-0">
          <div className="">
            <div className="mb-10">
              {mainBlog?.map((blog) => (
                <Card blog={blog} index={blog?.id} key={blog?.title} />
              ))}
            </div>
            <div ref={blogbox} className="grid  lg:grid-cols-2 gap-10">
              {currentItems?.map((blog) => (
                <Card blog={blog} index={blog?.id} key={blog?.title} />
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
// {
//     "id": "ab0b4501-0861-48e5-8194-1fd88918858b",
//     "created_at": "2025-10-22T11:28:36.72512+00:00",
//     "headers": {
//         "subtitle": "Door Windows, Home Land",
//         "shortDescription": "A small newly opened interior design business that aims to cover different issues, from sustainability to social, from equal opportunities to education, from giving space"
//     },
//     "content": {
//         "conclusion": "Workspaces are no longer just about desks and chairs. They’re evolving into experience-driven environments that foster productivity, creativity, and well-being. Is your office ready for the future? At Workved Interiors, we help businesses transform their workspaces with modern, efficient, and inspiring designs. Contact us to explore innovative office design solutions!",
//         "description": "1. Hybrid Workspaces: The New Norm\nThe traditional 9-to-5 office setup is becoming obsolete. Companies are investing in flexible workspaces that cater to both in-office and remote employees. Hot desking, breakout zones, and collaborative meeting rooms are now essential to encourage productivity.\n\n2. Biophilic Design: Bringing Nature Indoors\nEmployees thrive in environments that feel natural and comfortable. The biophilic design trend incorporates natural elements such as indoor plants, wooden finishes, and daylight-optimized office layouts. It’s proven to reduce stress and enhance productivity.\n\n3. Smart Office Technology\nFrom AI-powered lighting and climate control to IoT-connected furniture, technology is transforming office spaces. Automated systems improve energy efficiency and create a comfortable work environment.\n\n4. Wellness-Centric Office Spaces\nCompanies are prioritizing mental and physical well-being through ergonomic furniture, standing desks, meditation rooms, and wellness programs. Offices are becoming spaces that support a healthier work-life balance.\n\n5. Sustainable and Green Office Design\nWith eco-conscious materials, energy-efficient appliances, and green certifications, businesses are creating environmentally friendly offices that align with global sustainability goals.",
//         "introduction": "The way we design office spaces is evolving rapidly. With hybrid work models, a focus on employee well-being, and advancements in technology, companies are rethinking how they utilize their office spaces. Let’s explore the top office design trends that will shape workspaces in 2025."
//     },
//     "image": "sakshi-the-future-of-office-design:-trends-that-will-shape-workspaces-in-2025-2025-10-22T11-28-36-193Z",
//     "author": "Sakshi",
//     "tags": "[\"workved\",\"interior\",\"design\",\"office\"]",
//     "title": "The Future of Office Design: Trends That Will Shape Workspaces in 2025",
//     "updated_at": null
// }
function Card({ blog, index }) {
  const navigate = useNavigate();
  const blogdate = new Date(blog?.created_at);
  const month = blogdate.toLocaleString("default", { month: "long" });
  const day = blogdate.getDate();
  return (
    <div className="font-lora mx-auto" key={index}>
      <div>
        <div className="relative">
          <img
            src={`${blogImageUrl}/${blog?.image}`}
            alt="Office with trees"
            className="w-full h-64 object-cover"
          />
          <div className="absolute top-4 right-4 bg-white text-center px-3 py-1 shadow-md rounded-sm">
            <div className="text-lg font-bold">{day}</div>
            <div className="text-sm text-gray-500 -mt-1">{month}</div>
          </div>
        </div>
        <div className=" bg-white border-[#ccc] border  p-6 ">
          <h2 className="text-2xl  font-bold text-[#232323] mb-2">
            {blog?.title}
          </h2>

          <p className="text-sm text-[#777] mb-4">{blog?.headers?.subtitle}</p>

          <p className="text-[15px] text-[#777] border-t border-t-[#777] mb-6 pt-2 xl:pt-3">
            {blog?.headers?.shortDescription}
          </p>

          <div className=" bg-[#fff]">
            <button
              onClick={() => {
                navigate(`${blog?.title.replace(/\s/g, "_")}`, {
                  state: blog,
                });
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
  // return (
  //   <div className="font-lora mx-auto" key={index}>
  //     <div>
  //       <div className="relative">
  //         <img
  //           src={blog.image}
  //           alt="Office with trees"
  //           className="w-full h-64 object-cover"
  //         />
  //         <div className="absolute top-4 right-4 bg-white text-center px-3 py-1 shadow-md rounded-sm">
  //           <div className="text-lg font-bold">{blog.date}</div>
  //           <div className="text-sm text-gray-500 -mt-1">{blog.month}</div>
  //         </div>
  //       </div>
  //       <div className=" bg-white border-[#ccc] border  p-6 ">
  //         <h2 className="text-2xl  font-bold text-[#232323] mb-2">
  //           {blog.title}
  //         </h2>

  //         <p className="text-sm text-[#777] mb-4">{blog.shortdescription}</p>

  //         <p className="text-[15px] text-[#777] border-t border-t-[#777] mb-6 pt-2 xl:pt-3">
  //           {blog.description}
  //         </p>

  //         <div className=" bg-[#fff]">
  //           <button
  //             onClick={() => {
  //               navigate(`${blog.title.replace(/\s/g, "_")}`);
  //             }}
  //             className="relative mt-4 inline-block border-[#334A78] px-6 py-2 border-2 font-medium text-sm tracking-wide group"
  //           >
  //             <span className="relative font-Georgia  z-10 text-[#334A78] font-bold">
  //               Read More
  //             </span>
  //           </button>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // );
}
