import { useState } from "react";
import {
  IoCloseOutline,
  IoChevronBack,
  IoChevronForward,
} from "react-icons/io5";
import { supabase } from "../../services/supabase";
import {
  HandThumbUpIcon as HandThumbUpOutline,
  HandThumbDownIcon as HandThumbDownOutline,
} from "@heroicons/react/24/outline";

function DetailedReview({
  selectedReview,
  onClose,
  mode,
  setMode,
  setSelectedReview,
}) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);

  const images = selectedReview ? JSON.parse(selectedReview.images) : [];
  const currentImageUrl = images.length
    ? supabase.storage
        .from("review-images")
        .getPublicUrl(images[selectedImageIndex]).data.publicUrl
    : "";

  console.log(selectedReview);

  const likesArray = Array.isArray(selectedReview?.likes)
    ? selectedReview?.likes
    : JSON.parse(selectedReview?.likes || "[]");

  const dislikesArray = Array.isArray(selectedReview?.dislikes)
    ? selectedReview?.dislikes
    : JSON.parse(selectedReview?.dislikes || "[]");

  const handlePrev = () => {
    setSelectedImageIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setSelectedImageIndex((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <>
      {selectedReview && (
        <div className="fixed inset-0 z-30 bg-black/20 flex justify-center items-center">
          <div className="max-w-screen-md w-full relative">
            <div className="absolute top-0 right-20">
              <button onClick={onClose}>
                <IoCloseOutline size={35} />
              </button>
            </div>

            <div className="h-[90vh] max-w-screen-sm w-full bg-white p-4 overflow-y-auto">
              {/* Grid View Mode */}
              {mode === "grid" ? (
                <>
                  <h2 className="text-lg font-semibold mb-4">
                    All User Images
                  </h2>
                  <div className="grid grid-cols-3 gap-3">
                    {JSON.parse(selectedReview.images).map((img, index) => {
                      const url = supabase.storage
                        .from("review-images")
                        .getPublicUrl(img).data.publicUrl;
                      return (
                        <img
                          key={index}
                          src={url}
                          alt={`review-img-${index}`}
                          className="h-40 w-full object-cover rounded cursor-pointer"
                          onClick={() => {
                            setSelectedReview(selectedReview);
                            setMode("normal");
                          }}
                        />
                      );
                    })}
                  </div>
                </>
              ) : (
                <>
                  {/* Back Button */}
                  <div className="mb-2">
                    <button
                      className="text-sm text-[#38938E] flex items-center gap-1"
                      onClick={() => setMode("grid")}
                    >
                      <IoChevronBack size={16} />
                      Back
                    </button>
                  </div>

                  {/* Main Image Section */}
                  <div className="relative flex justify-center items-center h-96">
                    {images.length > 1 && (
                      <button
                        onClick={handlePrev}
                        className="absolute left-2 bg-white rounded-full shadow p-1"
                      >
                        <IoChevronBack size={24} />
                      </button>
                    )}

                    <img
                      src={currentImageUrl}
                      alt="full view"
                      className="object-contain max-h-full w-full"
                    />

                    {images.length > 1 && (
                      <button
                        onClick={handleNext}
                        className="absolute right-2 bg-white rounded-full shadow p-1"
                      >
                        <IoChevronForward size={24} />
                      </button>
                    )}
                  </div>

                  {/* Review Info */}
                  <div className="mt-6">
                    <div className="flex gap-5">
                      <p className="text-xs px-2 py-1 rounded flex items-center gap-1 border border-[#38938E] w-10">
                        {selectedReview.stars}{" "}
                        <span className="text-[#38938E]">★</span>
                      </p>
                      <p className="font-semibold text-sm">
                        {selectedReview.title}
                      </p>
                    </div>
                    <p
                      className={`text-sm text-[#777] my-3 transition-all duration-300 ease-in-out ${
                        expanded ? "max-h-full" : "line-clamp-4"
                      }`}
                    >
                      {selectedReview.description}
                    </p>
                    {selectedReview.description.length > 300 && (
                      <p
                        onClick={() => setExpanded(!expanded)}
                        className="text-sm text-[#38938E] cursor-pointer font-medium"
                      >
                        {expanded ? "Read less" : "Read more"}
                      </p>
                    )}

                    <p className="text-sm text-[#777]">
                      {selectedReview.created_at.split("T")[0]}{" "}
                      {selectedReview.profiles?.company_name}
                    </p>

                    <div className="flex gap-5 mt-2 text-[#777]">
                      <p className="flex text-sm">
                        <HandThumbUpOutline className="h-4 w-4" /> :{" "}
                        {likesArray.length}
                      </p>
                      <p className="flex text-sm">
                        <HandThumbDownOutline className="h-4 w-4" /> :{" "}
                        {dislikesArray.length}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default DetailedReview;
