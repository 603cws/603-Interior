import React, { useEffect, useState } from "react";
import { supabase } from "../../../services/supabase";
import NewBlog from "./NewBlog";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";

function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [newBlog, setNewBlog] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const blogsPerPage = 10;

  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = blogs.slice(indexOfFirstBlog, indexOfLastBlog);

  const totalPages = Math.ceil(blogs.length / blogsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const { data, error } = await supabase.from("blogs").select("*");
      if (error) console.log("Error fetching blogs:", error);
      setBlogs(data);
    } catch (error) {
      console.log("Unexpected Error:", error);
    }
  };

  console.log(blogs);

  return (
    <>
      {newBlog ? (
        <NewBlog onClose={() => setNewBlog(false)} />
      ) : (
        <div className="font-Poppins overflow-y-auto gradient-scrollbar">
          <div className="flex justify-between items-center p-2">
            <h2 className="text-2xl font-semibold text-[#374A75] ">
              Blog post
            </h2>
            <button
              onClick={() => setNewBlog(true)}
              className="px-4 py-2 border border-[#CCCCCC] rounded-md text-[#374A75] text-lg font-medium hover:bg-[#f1f1f1]"
            >
              + Add blog
            </button>
          </div>
          <hr />
          <div className="p-4">
            <table className="w-full text-left">
              <thead className="text-[#232321]/80 font-semibold ">
                <tr className="border-b">
                  <th className="py-2">
                    <input type="checkbox" name="" id="" />
                  </th>
                  <th className="py-2">Title</th>
                  <th className="py-2">Author</th>
                  <th className="py-2">Updated</th>
                </tr>
              </thead>
              <tbody>
                {currentBlogs.map((blog) => (
                  <tr
                    key={blog.id}
                    className="border-b text-sm text-[#000] font-semibold"
                  >
                    <td className="py-3.5">
                      <input type="checkbox" name="" id="" />
                    </td>
                    <td className="py-3.5">{blog.title}</td>
                    <td className="py-3.5">{blog.author}</td>
                    <td className="py-3.5">{blog.created_at.split("T")[0]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-4 gap-2 border px-7 py-1 rounded place-self-center">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 disabled:opacity-50 flex items-center gap-0.5 text-[#334A78]"
                >
                  <MdKeyboardArrowLeft /> Prev
                </button>

                {Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => handlePageChange(index + 1)}
                    className={`px-3 py-1 rounded-sm  ${
                      currentPage === index + 1
                        ? "bg-[#334A78] text-white"
                        : "text-[#334A78]"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 disabled:opacity-50 flex items-center gap-0.5 text-[#334A78]"
                >
                  Next <MdKeyboardArrowRight />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default Blogs;
