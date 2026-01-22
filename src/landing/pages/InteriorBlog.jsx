import Footer from "../../common-components/Footer";
import HeroSection from "../components/HeroSection";
import { useEffect, useRef, useState } from "react";
import { FaArrowRightLong, FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import LandingNavbar from "../components/LandingNavbar";
import { supabase } from "../../services/supabase";
import { blogImageUrl } from "../../utils/HelperConstant";
import SpinnerFullPage from "../../common-components/SpinnerFullPage";

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
                    className={`px-5 py-2 rounded font-Georgia font-semibold ${
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
  const blogdate = new Date(blog?.created_at);
  const month = blogdate.toLocaleString("default", { month: "long" });
  const day = blogdate.getDate();
  return (
    <div className="font-Georgia mx-auto" key={index}>
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
}
