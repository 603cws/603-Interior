import { useState, useRef, useEffect } from "react";
import { BsUpload } from "react-icons/bs";
import { supabase } from "../../../services/supabase";
import Spinner from "../../../common-components/Spinner";
import toast from "react-hot-toast";

function EditBlog({ blog, onClose, onUpdate }) {
  const [heading, setHeading] = useState({
    title: blog?.title || "",
    subtitle: blog?.headers?.subtitle || "",
    shortDescription: blog?.headers?.shortDescription || "",
  });
  const [content, setContent] = useState({
    introduction: blog?.content?.introduction || "",
    description: blog?.content?.description || "",
    conclusion: blog?.content?.conclusion || "",
  });
  const [image, setImage] = useState(blog.image || null);
  const [author, setAuthor] = useState(blog?.author || "");
  const [tags, setTags] = useState(JSON.parse(blog?.tags) || []);
  const [preview, setPreview] = useState(blog.image || null);
  const [inserting, setInserting] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (blog?.image) {
      const { data } = supabase.storage
        .from("blog-images")
        .getPublicUrl(blog.image);
      setPreview(data.publicUrl);
    }
  }, [blog]);

  const handleChange = (e, type) => {
    const { name, value } = e.target;
    if (type === "heading") {
      setHeading((prevHeading) => ({
        ...prevHeading,
        [name]: value,
      }));
    } else {
      setContent((prevContent) => ({
        ...prevContent,
        [name]: value,
      }));
    }
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setImage(selectedFile);
    if (selectedFile) {
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    setImage(droppedFile);
    if (droppedFile) {
      setPreview(URL.createObjectURL(droppedFile));
    }
  };

  const removeFile = () => {
    setPreview(null);
    setImage(null);

    // Reset file input value to allow same file selection again
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  const handleTagsChange = (e) => {
    const inputValue = e.target.value;
    const tagsArray = inputValue
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag !== "");
    setTags(tagsArray);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setInserting(true);
    try {
      let imageName = blog.image;

      if (image && image instanceof File) {
        const formattedAuthor = author.replace(/\s+/g, "-").toLowerCase();
        const formattedTitle = heading.title.replace(/\s+/g, "-").toLowerCase();
        const dateTime = new Date().toISOString().replace(/[:.]/g, "-");
        imageName = `${formattedAuthor}-${formattedTitle}-${dateTime}`;

        const { error: uploadError } = await supabase.storage
          .from("blog-images")
          .upload(imageName, image);
        if (uploadError) {
          console.error("Error uploading image:", uploadError);
          return;
        }
        if (blog.image) {
          await supabase.storage.from("blog-images").remove([blog.image]);
        }
      }
      const { error } = await supabase
        .from("blogs")
        .update({
          title: heading.title,
          headers: {
            subtitle: heading.subtitle,
            shortDescription: heading.shortDescription,
          },
          content: content,
          image: imageName,
          author,
          tags,
          updated_at: new Date().toISOString(),
        })
        .eq("id", blog.id);
      if (error) {
        console.error("Error inserting data:", error);
        toast.error(error.message || "Error inserting data");
        await supabase.storage.from("blog-images").remove([imageName]);
        return;
      }

      handleDiscard();
      toast.success("Blog Submitted successfully!");
      onClose();
      onUpdate();
    } catch (error) {
      console.log("Unexpected error:", error);
    } finally {
      setInserting(false);
    }
  };

  const handleDiscard = () => {
    setHeading({
      title: heading?.title ?? "",
      subtitle: heading?.subtitle ?? "",
      shortDescription: heading?.shortDescription ?? "",
    });
    setContent({
      introduction: content?.introduction ?? "",
      description: content?.description ?? "",
      conclusion: content?.conclusion ?? "",
    });
    setImage(blog.image ?? null);
    setAuthor(blog?.author ?? "");
    setTags(JSON.parse(blog?.tags ?? []));
    setPreview(blog.image ?? null);
  };

  return (
    <>
      {inserting ? (
        <div className="flex flex-col justify-center items-center h-full relative">
          <p className="absolute top-1/3 text-xl font-Poppins text-[#ccc] font-semibold">
            Hold On! Data is being inserted...
          </p>
          <Spinner />
        </div>
      ) : (
        <div className="font-Poppins overflow-y-auto gradient-scrollbar">
          <h2 className="text-xl md:text-2xl font-semibold text-[#374A75] py-2 px-3">
            Edit blog post
          </h2>
          <hr />
          <button
            onClick={onClose}
            className="text-xs text-[#ccc] font-semibold ml-3"
          >
            Back to blog list
          </button>
          <form onSubmit={handleSubmit} className="p-2 md:p-4">
            <div className="border border-[#DDDDDD] rounded-lg mt-2 p-5 space-y-3">
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="title"
                  className="capitalize text-lg text-[#000000] font-medium"
                >
                  title
                </label>
                <input
                  type="text"
                  name="title"
                  placeholder="title of a blog post"
                  value={heading.title}
                  onChange={(e) => handleChange(e, "heading")}
                  required
                  maxLength={150}
                  className="border-2 border-[#CCCCCC] rounded-md bg-[#F9F9F9] p-1.5 focus:outline-none focus:ring-0 text-sm"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="subtitle"
                  className="capitalize text-lg text-[#000000] font-medium"
                >
                  subtitle
                </label>
                <input
                  type="text"
                  name="subtitle"
                  value={heading.subtitle}
                  onChange={(e) => handleChange(e, "heading")}
                  placeholder="subtitle of a blog post"
                  required
                  maxLength={250}
                  className="border-2 border-[#CCCCCC] rounded-md bg-[#F9F9F9] p-1.5 focus:outline-none focus:ring-0 text-sm"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="shortdescription"
                  className="capitalize text-lg text-[#000000] font-medium"
                >
                  short description
                </label>
                <input
                  type="text"
                  name="shortDescription"
                  value={heading.shortDescription}
                  onChange={(e) => handleChange(e, "heading")}
                  required
                  maxLength={300}
                  placeholder="short description of a blog post"
                  className="border-2 border-[#CCCCCC] rounded-md bg-[#F9F9F9] p-1.5 focus:outline-none focus:ring-0 text-sm"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="content"
                  className="capitalize text-lg text-[#000000] font-medium"
                >
                  content
                </label>
                <textarea
                  name="introduction"
                  value={content.introduction}
                  onChange={(e) => handleChange(e, "content")}
                  required
                  maxLength={1000}
                  placeholder="introduction"
                  className="border-2 border-[#CCCCCC] rounded-md bg-[#F9F9F9] p-1.5 focus:outline-none focus:ring-0 text-sm"
                />
                <textarea
                  name="description"
                  value={content.description}
                  onChange={(e) => handleChange(e, "content")}
                  required
                  maxLength={5000}
                  placeholder="description"
                  rows={4}
                  className="border-2 border-[#CCCCCC] rounded-md bg-[#F9F9F9] p-1.5 focus:outline-none focus:ring-0 text-sm"
                />
                <textarea
                  name="conclusion"
                  value={content.conclusion}
                  onChange={(e) => handleChange(e, "content")}
                  required
                  maxLength={1000}
                  placeholder="conclusion"
                  className="border-2 border-[#CCCCCC] rounded-md bg-[#F9F9F9] p-1.5 focus:outline-none focus:ring-0 text-sm"
                />
              </div>
            </div>
            <div className="border border-[#DDDDDD] rounded-lg mt-2 p-5">
              <h4
                htmlFor="image"
                className="capitalize text-lg text-[#000000] font-medium"
              >
                image
              </h4>
              <div className="flex items-start gap-4">
                {!image && (
                  <div
                    className="w-full h-28 p-2 flex flex-col items-center justify-center border border-dashed rounded-lg text-center text-gray-500 cursor-pointer hover:border-gray-400"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                  >
                    <input
                      type="file"
                      id="file-upload"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileChange}
                      required
                    />
                    <label
                      htmlFor="file-upload"
                      className="flex flex-col items-center"
                    >
                      <BsUpload className="w-6 h-6 mb-1 text-gray-500" />
                      <span className="text-xs">
                        <span className="text-blue-500 cursor-pointer underline">
                          Click to upload
                        </span>
                        <br />
                        or drag and drop
                      </span>
                    </label>
                  </div>
                )}
                {preview && (
                  <div className="relative w-full h-28 border rounded-lg overflow-hidden group">
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={removeFile}
                        type="button"
                        className="text-white text-xs bg-red-600 px-2 py-1 rounded"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="border border-[#DDDDDD] rounded-lg mt-2 p-5">
              <h4 className="capitalize text-lg text-[#000000] font-medium">
                organization
              </h4>
              <div className="flex flex-col gap-1.5 mb-2">
                <label
                  htmlFor="author"
                  className="capitalize text-lg text-[#000000]"
                >
                  author
                </label>
                <input
                  type="text"
                  name="author"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  required
                  maxLength={100}
                  placeholder="author"
                  className="border-2 border-[#CCCCCC] rounded-md bg-[#F9F9F9] p-1.5 focus:outline-none focus:ring-0 text-sm"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="tags"
                  className="capitalize text-lg text-[#000000] font-medium"
                >
                  tags
                </label>
                <input
                  type="text"
                  name="tags"
                  value={tags.join(",")}
                  onChange={handleTagsChange}
                  required
                  maxLength={200}
                  placeholder="tags (comma separated)"
                  className="border-2 border-[#CCCCCC] rounded-md bg-[#F9F9F9] p-1.5 focus:outline-none focus:ring-0 text-sm"
                />
              </div>
            </div>
            <div className="flex justify-end gap-4 mt-3 ">
              <button
                type="reset"
                onClick={handleDiscard}
                className="capitalize border border-[#CCCCCC] rounded-md bg-[#F9F9F9] text-[#000] text-sm font-semibold px-4 py-2 hover:bg-[#CCCCCC]"
              >
                discard
              </button>
              <button
                type="submit"
                className="capitalize border border-[#CCCCCC] rounded-md bg-[#374A75] text-[#fff] text-sm font-semibold px-4 py-2 hover:bg-[#4C69A4]"
              >
                update
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

export default EditBlog;
