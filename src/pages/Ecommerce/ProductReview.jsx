import { useState } from "react";
import { supabase } from "../../services/supabase";
import { useApp } from "../../Context/Context";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
const ratings = ["Bad", "Average", "OK", "Good", "Very Good"];

export default function ProductReview({ product, onClose }) {
  const [rating, setRating] = useState(4);
  const [files, setFiles] = useState([]);
  const [headline, setHeadline] = useState("");
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);
  const [isTnCchecked, setIsTnCchecked] = useState(false);

  const { accountHolder, isAuthenticated } = useApp();

  const navigate = useNavigate();

  const handleFileChange = (e) => {
    // const selected = Array.from(e.target.files);
    const selected = Array.from(e.target.files).filter((file) =>
      file.type.startsWith("image/")
    );
    if (selected.length > 3) {
      toast.error("You can only upload up to 3 files.");
      return;
    }
    // setFiles(selected);
    setFiles((prev) => [...prev, ...selected]);
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const insertReview = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error("Plaese log in to give review");
      return;
    }

    setUploading(true);

    try {
      const uploadedFilePaths = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const ext = file.name.split(".").pop();
        const filePath = `${accountHolder?.userId}_${product.id}_review-${
          i + 1
        }.${ext}`;

        const { error: uploadError } = await supabase.storage
          .from("review-images")
          .upload(filePath, file);
        if (uploadError) throw uploadError;
        uploadedFilePaths.push(filePath);
      }

      const { data, error } = await supabase.from("reviews").insert([
        {
          title: headline,
          description: description,
          stars: rating,
          images: uploadedFilePaths || [],
          userId: accountHolder.userId,
          productId: product.id,
        },
      ]);
      if (error) {
        console.log(error);
      }
      toast.success("Thank you! Your review has been submitted");
      console.log(data);
    } catch (error) {
      console.log(error);
    } finally {
      setUploading(false);
      setRating(2);
      setHeadline("");
      setDescription("");
      setFiles([]);
      setIsTnCchecked(false);
      onClose();
    }
  };

  return (
    <div className="w-full mx-auto lg:p-2 bg-white ">
      {/* Product info */}
      <div className="flex items-start gap-4 border p-3 lg:p-6 rounded-lg mb-6">
        <img
          src={product.image}
          alt="Product"
          className="w-28 md:w-32 lg:w-40 h-28 md:h-32 lg:h-40 object-contain"
        />
        <p className="font-semibold text-sm md:text-base lg:text-lg font-Poppins line-clamp-4">
          {product.title}
          <br />
          {product.details}
        </p>
      </div>
      <form action="" onSubmit={insertReview}>
        <div className="rounded-lg border p-3 lg:p-6">
          {/* Star Rating */}
          <div className="flex justify-between items-center mb-4 px-4 lg:px-16">
            {ratings.map((label, i) => {
              const starValue = i + 1;
              return (
                <div
                  key={i}
                  className="flex flex-col items-center cursor-pointer"
                  onClick={() => setRating(starValue)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`w-8 h-8 ${
                      rating === starValue ? "text-blue-400" : "text-black"
                    }`}
                    fill={rating === starValue ? "currentColor" : "black"}
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.977 2.89a1 1 0 00-.364 1.118l1.519 4.674c.3.921-.755 1.688-1.538 1.118L12 17.77l-3.977 2.89c-.783.57-1.838-.197-1.538-1.118l1.519-4.674a1 1 0 00-.364-1.118l-3.977-2.89c-.783-.57-.38-1.81.588-1.81h4.915a1 1 0 00.95-.69l1.519-4.674z"
                    />
                  </svg>
                  <span className="text-[10px] md:text-xs lg:text-sm mt-1">
                    {label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Headline */}
          <div className="relative mb-4">
            <label className="absolute -top-2 left-4 bg-white px-1 text-[10px] md:text-xs lg:text-sm text-[#AAAAAA]">
              Headline
            </label>
            <input
              type="text"
              name="headline"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="Very good product!!"
              className="w-full border rounded-lg p-4 focus:outline-none focus:ring-0 text-[10px] md:text-xs lg:text-sm"
            />
          </div>

          {/* Review */}
          <div className="relative">
            <label className="absolute -top-2 left-4 bg-white px-1 text-sm text-[#AAAAAA]">
              Review
            </label>
            <textarea
              placeholder="Write your review..."
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              // defaultValue={`Poor quality. The seat is not even parallel to the ground...`}
              className="w-full border rounded-lg p-4 focus:outline-none focus:ring-0 text-[10px] md:text-xs lg:text-sm"
              rows={6}
            />
          </div>
        </div>

        {/* File Upload */}
        <div className="border p-4 rounded-lg mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mt-6">
          <img
            src="/images/ecommerce/icon.svg"
            alt="icon image"
            className="h-16 lg:h-auto w-16 lg:w-auto"
          />
          <div className="flex-1">
            <p className="font-medium text-xs md:text-sm">
              Add a photo or video to review
            </p>
            <p className="text-[10px] md:text-xs lg:text-sm text-gray-500">
              Add up to 3 images in .jpg, .png, .mp4, file size up to 5MB
            </p>
          </div>

          <div>
            <label className="inline-block px-4 py-2 bg-white border text-[10px] md:text-xs lg:text-sm rounded cursor-pointer hover:bg-gray-300">
              Select a file
              <input
                type="file"
                multiple
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
            {/* {files.length > 0 && (
              <ul className="text-xs text-gray-500 mt-1">
                {files.map((file, i) => (
                  <li key={i}>{file.name}</li>
                ))}
              </ul>
            )} */}
            <div className="flex gap-2 mt-4 flex-wrap">
              {files.map((file, i) => (
                <div key={i} className="relative group">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`preview-${i}`}
                    className="w-14 h-14 object-cover rounded border"
                  />
                  <button
                    type="button"
                    onClick={() => removeFile(i)}
                    className="absolute -top-2 -right-2 bg-white border border-gray-300 rounded-full w-5 h-5 text-xs text-red-600 flex items-center justify-center hover:bg-gray-100"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Terms and Submit */}
        <div className="flex items-center gap-2 mb-6">
          <input
            type="checkbox"
            onChange={(e) => setIsTnCchecked(e.target.checked)}
            className="w-3 md:w-4 h-3 md:h-4"
          />
          <p className="text-[10px] md:text-xs lg:text-sm">
            I accept the{" "}
            <span
              onClick={() => navigate("/termsNcondition")}
              className="font-bold hover:underline cursor-pointer"
            >
              terms and conditions
            </span>{" "}
            of submitting the review
          </p>
        </div>

        <div className="flex justify-between w-full">
          <button
            className="w-40 lg:w-52 py-3 border rounded text-black text-base md:text-lg lg:text-xl font-Poppins font-semibold hover:bg-gray-100"
            onClick={onClose}
          >
            CANCEL
          </button>
          <button
            type="submit"
            disabled={!isTnCchecked}
            className={`w-40 lg:w-52 py-3 text-base md:text-lg lg:text-xl font-Poppins font-semibold rounded 
                  ${
                    isTnCchecked
                      ? "bg-[#334A78] text-white hover:bg-[#556485]"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
          >
            Rate Product
          </button>
        </div>
      </form>
    </div>
  );
}
