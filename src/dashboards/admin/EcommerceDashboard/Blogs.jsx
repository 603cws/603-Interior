import { useEffect, useState } from "react";
import { supabase } from "../../../services/supabase";
import NewBlog from "./NewBlog";
import EditBlog from "./EditBlog";
import PagInationNav from "../../../common-components/PagInationNav";

function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [newBlog, setNewBlog] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBlogs, setSelectedBlogs] = useState([]);
  const [editBlog, setEditBlog] = useState(null);
  const [refreshBlogs, setRefreshBlogs] = useState(false);
  const [blogsToDelete, setBlogsToDelete] = useState(null);

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
  }, [refreshBlogs]);

  const fetchBlogs = async () => {
    try {
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) console.error("Error fetching blogs:", error);
      setBlogs(data);
    } catch (error) {
      console.error("Unexpected Error:", error);
    }
  };

  const handleCheckboxChange = (blogId) => {
    setSelectedBlogs((prev) =>
      prev.includes(blogId)
        ? prev.filter((id) => id !== blogId)
        : [...prev, blogId],
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
    if (selectedBlogs.length === 0) return;

    try {
      const imagePaths = blogs
        .filter((blog) => selectedBlogs.includes(blog.id))
        .map((blog) => blog.image);

      if (imagePaths.length > 0) {
        const { error: storageError } = await supabase.storage
          .from("blog-images")
          .remove(imagePaths);

        if (storageError)
          console.error("storageError while deleting image", storageError);

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
        <NewBlog
          onClose={() => {
            setNewBlog(false);
            setRefreshBlogs((prev) => !prev);
          }}
        />
      ) : editBlog ? (
        <EditBlog
          blog={editBlog}
          onClose={() => setEditBlog(false)}
          onUpdate={fetchBlogs}
        />
      ) : (
        <div className="font-Poppins overflow-y-auto gradient-scrollbar">
          <div className="flex justify-between items-center py-2 px-3">
            <h2 className="text-xl md:text-2xl font-semibold text-[#374A75] ">
              Blog Post
            </h2>
            <div className="flex gap-2">
              {selectedBlogs.length > 0 && (
                <button
                  onClick={() => setBlogsToDelete(selectedBlogs)}
                  className="px-2 py-1 md:px-4 md:py-2 border border-[#CCCCCC] rounded-md text-[#374A75] text-sm md:text-lg font-medium hover:bg-[#f1f1f1]"
                >
                  Delete ({selectedBlogs.length})
                </button>
              )}
              <button
                onClick={() => setNewBlog(true)}
                className="px-2 py-1 md:px-4 md:py-2 border border-[#CCCCCC] rounded-md text-[#374A75] text-lg font-medium hover:bg-[#f1f1f1] flex items-center gap-1"
              >
                + <span className="hidden lg:block">Add blog</span>
              </button>
            </div>
          </div>
          <hr />
          <div className="p-2 md:p-4">
            <table className="w-full text-left">
              <thead className="text-[#232321]/80 font-semibold ">
                <tr className="border-b">
                  <th className="py-2 px-1">
                    <input
                      type="checkbox"
                      name=""
                      id=""
                      checked={allSelected}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th className="py-2 px-1 text-sm md:text-base">Title</th>
                  <th className="py-2 px-1 text-sm md:text-base">Author</th>
                  <th className="py-2 px-1 text-sm md:text-base">Updated</th>
                </tr>
              </thead>
              <tbody>
                {currentBlogs.map((blog) => (
                  <tr
                    key={blog.id}
                    onClick={() => setEditBlog(blog)}
                    className="border-b text-xs md:text-sm text-[#000] font-semibold hover:bg-[#f1f1f1] cursor-pointer"
                  >
                    <td className="py-3.5 px-1">
                      <input
                        type="checkbox"
                        name=""
                        id=""
                        onClick={(e) => e.stopPropagation()}
                        checked={selectedBlogs.includes(blog.id)}
                        onChange={() => handleCheckboxChange(blog.id)}
                      />
                    </td>
                    <td className="py-3.5 px-1">{blog.title}</td>
                    <td className="py-3.5 px-1">{blog.author}</td>
                    <td className="py-3.5 px-1">
                      {blog.updated_at?.split("T")[0] ||
                        blog.created_at.split("T")[0]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <PagInationNav
              totalPages={totalPages}
              currentPage={currentPage}
              handlePageChange={handlePageChange}
            />
          </div>
          {blogsToDelete && (
            <DeleteBlogsWarning
              blogIds={blogsToDelete}
              onCancel={() => setBlogsToDelete(null)}
              onConfirm={async () => {
                await handleDelete(blogsToDelete);
                setBlogsToDelete(null);
              }}
            />
          )}
        </div>
      )}
    </>
  );
}

export default Blogs;

function DeleteBlogsWarning({ blogIds, onCancel, onConfirm }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-5 rounded-lg shadow-lg max-w-xs md:max-w-sm w-full">
        <h3 className="text-lg font-semibold text-red-600 mb-2">
          Confirm Deletion
        </h3>

        <p className="text-sm text-gray-700 mb-4">
          Are you sure you want to delete <b>{blogIds.length}</b>{" "}
          {blogIds.length === 1 ? "blog" : "blogs"}?
          <br />
          <span className="text-red-500 font-medium">
            This action cannot be undone.
          </span>
        </p>

        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-1 rounded bg-gray-200 hover:bg-gray-300"
            onClick={onCancel}
          >
            Cancel
          </button>

          <button
            className="px-4 py-1 rounded bg-red-600 hover:bg-red-700 text-white"
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
