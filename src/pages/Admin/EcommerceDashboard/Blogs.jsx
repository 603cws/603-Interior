import React, { useEffect, useState } from "react";
import { supabase } from "../../../services/supabase";
import NewBlog from "./NewBlog";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import EditBlog from "./EditBlog";

function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [newBlog, setNewBlog] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBlogs, setSelectedBlogs] = useState([]);
  const [editBlog, setEditBlog] = useState(null);
  const blogsPerPage = 10;

  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = blogs.slice(indexOfFirstBlog, indexOfLastBlog);

  const totalPages = Math.ceil(blogs.length / blogsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    setSelectedBlogs([]);
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) console.log("Error fetching blogs:", error);
      setBlogs(data);
    } catch (error) {
      console.log("Unexpected Error:", error);
    }
  };

  const handleCheckboxChange = (blogId) => {
    setSelectedBlogs((prev) =>
      prev.includes(blogId)
        ? prev.filter((id) => id !== blogId)
        : [...prev, blogId]
    );
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedBlogs(currentBlogs.map((b) => b.id));
    } else {
      setSelectedBlogs([]);
    }
  };

  const handleDelete = async () => {
    console.log("selectedBlogs", selectedBlogs);

    if (selectedBlogs.length === 0) return;
    if (!window.confirm("Are you sure you want to delete selected blog(s)?"))
      return;

    try {
      const imagePaths = blogs
        .filter((blog) => selectedBlogs.includes(blog.id))
        .map((blog) => blog.image);
      console.log("imagePaths", imagePaths);

      if (imagePaths.length > 0) {
        console.log("inside delete");
        //NOT WORKING
        const { data, error: storageError } = await supabase.storage
          .from("blog-images")
          .remove(imagePaths);

        console.log("Images to delete", data);
        if (storageError)
          console.log("storageError while deleting image", storageError);

        if (storageError) throw storageError;
      }
      const { error } = await supabase
        .from("blogs")
        .delete()
        .in("id", selectedBlogs);
      if (error) throw error;

      setSelectedBlogs([]);
      fetchBlogs();
    } catch (error) {
      console.error("Error deleting blogs:", error);
    }
  };

  const allSelected =
    currentBlogs.length > 0 && selectedBlogs.length === currentBlogs.length;

  return (
    <>
      {newBlog ? (
        <NewBlog onClose={() => setNewBlog(false)} />
      ) : editBlog ? (
        <EditBlog
          blog={editBlog}
          onClose={() => setEditBlog(false)}
          onUpdate={fetchBlogs}
        />
      ) : (
        <div className="font-Poppins overflow-y-auto gradient-scrollbar">
          <div className="flex justify-between items-center p-2">
            <h2 className="text-2xl font-semibold text-[#374A75] ">
              Blog post
            </h2>
            <div className="flex gap-2">
              {selectedBlogs.length > 0 && (
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 border border-[#CCCCCC] rounded-md text-[#374A75] text-lg font-medium hover:bg-[#f1f1f1]"
                >
                  Delete ({selectedBlogs.length})
                </button>
              )}
              <button
                onClick={() => setNewBlog(true)}
                className="px-4 py-2 border border-[#CCCCCC] rounded-md text-[#374A75] text-lg font-medium hover:bg-[#f1f1f1]"
              >
                + Add blog
              </button>
            </div>
          </div>
          <hr />
          <div className="p-4">
            <table className="w-full text-left">
              <thead className="text-[#232321]/80 font-semibold ">
                <tr className="border-b">
                  <th className="py-2">
                    <input
                      type="checkbox"
                      name=""
                      id=""
                      checked={allSelected}
                      onChange={handleSelectAll}
                    />
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
                    onClick={() => setEditBlog(blog)}
                    className="border-b text-sm text-[#000] font-semibold hover:bg-[#f1f1f1] cursor-pointer"
                  >
                    <td className="py-3.5">
                      <input
                        type="checkbox"
                        name=""
                        id=""
                        onClick={(e) => e.stopPropagation()}
                        checked={selectedBlogs.includes(blog.id)}
                        onChange={() => handleCheckboxChange(blog.id)}
                      />
                    </td>
                    <td className="py-3.5">{blog.title}</td>
                    <td className="py-3.5">{blog.author}</td>
                    <td className="py-3.5">
                      {blog.updated_at?.split("T")[0] ||
                        blog.created_at.split("T")[0]}
                    </td>
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
