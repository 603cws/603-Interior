import { useState } from "react";

const ratings = ["Bad", "Average", "OK", "Good", "Very Good"];

export default function ProductReview({ image, title, details, onClose }) {
  const [rating, setRating] = useState(2);
  const [fileName, setFileName] = useState("");

  return (
    <div className="w-full mx-auto p-2 bg-white ">
      {/* Product info */}
      <div className="flex items-start gap-4 border p-6 rounded-lg mb-6">
        <img src={image} alt="Product" className="w-40 h-40 object-cover" />
        <p className="font-semibold text-lg font-Poppins">
          {title}
          <br />
          {details}
        </p>
      </div>

      <div className="rounded-lg border p-6">
        {/* Star Rating */}
        <div className="flex justify-between items-center mb-4 px-16">
          {ratings.map((label, i) => (
            <div
              key={i}
              className="flex flex-col items-center cursor-pointer"
              onClick={() => setRating(i)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`w-8 h-8 ${
                  rating === i ? "text-blue-400" : "text-black"
                }`}
                fill={rating === i ? "currentColor" : "black"}
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
              <span className="text-sm mt-1">{label}</span>
            </div>
          ))}
        </div>

        {/* Headline */}
        <div className="relative mb-4">
          <label className="absolute -top-2 left-4 bg-white px-1 text-sm text-[#AAAAAA]">
            Headline
          </label>
          <input
            type="text"
            placeholder="Very good product!!"
            className="w-full border rounded-lg p-4"
          />
        </div>

        {/* Review */}
        <div className="relative">
          <label className="absolute -top-2 left-4 bg-white px-1 text-sm text-[#AAAAAA]">
            Review
          </label>
          <textarea
            placeholder="Write your review..."
            // defaultValue={`Poor quality. The seat is not even parallel to the ground...`}
            className="w-full border rounded-lg p-4 "
            rows={6}
          />
        </div>
      </div>

      {/* File Upload */}
      <div className="border p-4 rounded-lg mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-6">
        <img src="/images/ecommerce/icon.svg" alt="icon image" />
        <div className="flex-1">
          <p className="font-medium">Add a photo or video to review</p>
          <p className="text-sm text-gray-500">
            Add up to 3 images in .jpg, .png, .mp4, file size up to 5MB
          </p>
        </div>

        <div>
          <label className="inline-block px-4 py-2 bg-white border text-sm rounded cursor-pointer hover:bg-gray-300">
            Select a file
            <input
              type="file"
              className="hidden"
              onChange={(e) => setFileName(e.target.files[0]?.name || "")}
            />
          </label>
          {fileName && <p className="text-xs text-gray-500 mt-1">{fileName}</p>}
        </div>
      </div>

      {/* Name and Email */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6 border p-6 rounded-lg">
        <div className="relative flex-1">
          <label className="absolute -top-2 left-4 bg-white px-1 text-sm text-[#AAAAAA]">
            Full Name
          </label>
          <input
            type="text"
            placeholder="Full Name"
            className="w-full border rounded p-4"
          />
        </div>

        <div className="relative flex-1">
          <label className="absolute -top-2 left-4 bg-white px-1 text-sm text-[#AAAAAA]">
            Email
          </label>
          <input
            type="email"
            placeholder="Email"
            className="w-full border rounded p-4"
          />
        </div>
      </div>

      {/* Terms and Submit */}
      <div className="flex items-center gap-2 mb-6">
        <input type="checkbox" className="w-4 h-4" />
        <span className="text-sm">
          I accept the{" "}
          <a href="#" className="font-bold hover:underline">
            terms and conditions
          </a>{" "}
          of submitting the review
        </span>
      </div>

      <div className="flex justify-between w-full">
        <button
          className="w-52 py-3 border rounded text-black text-xl font-Poppins font-semibold hover:bg-gray-100"
          onClick={onClose}
        >
          CANCEL
        </button>
        <button className="w-52 py-3 bg-[#334A78] text-xl font-Poppins font-semibold text-white rounded hover:bg-[#556485]">
          Rate Product
        </button>
      </div>
    </div>
  );
}
