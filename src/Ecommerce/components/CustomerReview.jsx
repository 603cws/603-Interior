import DetailedReview from "./DetailedReview";
import { HandThumbUpIcon, HandThumbDownIcon } from "@heroicons/react/24/solid";
import {
  HandThumbUpIcon as HandThumbUpOutline,
  HandThumbDownIcon as HandThumbDownOutline,
} from "@heroicons/react/24/outline";
import { useApp } from "../../Context/Context";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import ProductReview from "./ProductReview";
import { supabase } from "../../services/supabase";
import { useNavigate } from "react-router-dom";

function CustomerReview({ product, productid }) {
  const { isAuthenticated, accountHolder } = useApp();
  const [productReviews, setProductReviews] = useState([]);
  const [expandedStates, setExpandedStates] = useState([]);
  const [clampedStates, setClampedStates] = useState([]);
  const contentRefs = useRef([]);
  const [detailedMode, setDetailedMode] = useState("normal"); // "normal" or "grid"
  const [gridViewReview, setGridViewReview] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedReview, setSelectedReview] = useState(null);
  const [isReview, setIsReview] = useState(false);
  const [isloading, setisloading] = useState(false);
  const navigate = useNavigate();

  const hasReviews = productReviews && productReviews.length > 0;
  const allImages = productReviews?.flatMap((review) => {
    const images = JSON.parse(review.images || "[]");
    return images.map((imgPath) => ({
      path: imgPath,
      review,
    }));
  });
  const displayedImages = allImages?.slice(0, 6);
  const remainingCount = allImages?.length - displayedImages?.length;
  useEffect(() => {
    // Timeout ensures DOM is fully rendered
    const timeout = setTimeout(() => {
      const clamped = productReviews?.map((_, idx) => {
        const el = contentRefs.current[idx];
        if (!el) return false;

        const lineHeight = parseFloat(getComputedStyle(el).lineHeight) || 20;
        const maxHeight = lineHeight * 3;

        return el.scrollHeight > maxHeight;
      });

      setClampedStates(clamped);
      setExpandedStates(Array(productReviews?.length).fill(false));
    }, 100); // delay ensures DOM paints first

    return () => clearTimeout(timeout);
  }, [productReviews]);

  useEffect(() => {
    if (isReview || selectedReview) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }
    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, [isReview, selectedReview]);

  useEffect(() => {
    fetchProductReviews(productid);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productid]);

  const toggleExpanded = (index) => {
    setExpandedStates((prev) => {
      const updated = [...prev];
      updated[index] = !updated[index];
      return updated;
    });
  };

  const fetchProductReviews = async (productId) => {
    try {
      setisloading(true);
      const { data, error } = await supabase
        .from("reviews")
        .select(`*,profiles:userId(company_name)`)
        .eq("productId", productId);
      if (error) {
        console.error(error);
      }
      setProductReviews(data);
    } catch (error) {
      console.error(error);
    } finally {
      setisloading(false);
    }
  };

  const handleLikes = async (reviewId, userId) => {
    try {
      const { data, error: fetchError } = await supabase
        .from("reviews")
        .select("likes")
        .eq("id", reviewId)
        .single();

      if (fetchError) {
        console.error("Error fetching review:", fetchError);
        return;
      }

      let existingLikes = data.likes ?? [];
      let existingDislikes = data.dislikes ?? [];

      // If likes is stored as a JSON string, parse it
      if (typeof existingLikes === "string") {
        existingLikes = JSON.parse(existingLikes);
      }
      if (typeof existingDislikes === "string") {
        existingDislikes = JSON.parse(existingDislikes);
      }
      existingLikes = existingLikes ?? [];

      let updatedLikes, updatedDislikes;
      if (existingLikes.includes(userId)) {
        updatedLikes = existingLikes.filter((id) => id !== userId);
        updatedDislikes = existingDislikes;
      } else {
        updatedLikes = [...existingLikes, userId];
        updatedDislikes = existingDislikes.filter((id) => id !== userId);
      }

      const { error: updateError } = await supabase
        .from("reviews")
        .update({ likes: updatedLikes, dislikes: updatedDislikes })
        .eq("id", reviewId);

      if (updateError) {
        console.error("Error updating likes:", updateError);
        return;
      }

      setProductReviews((prevReviews) =>
        prevReviews.map((review) =>
          review.id === reviewId
            ? { ...review, likes: updatedLikes, dislikes: updatedDislikes }
            : review
        )
      );
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };

  const handleDislikes = async (reviewId, userId) => {
    try {
      const { data, error: fetchError } = await supabase
        .from("reviews")
        .select("dislikes")
        .eq("id", reviewId)
        .single();

      if (fetchError) {
        console.error("Error fetching review:", fetchError);
        return;
      }

      let existingdislikes = data.dislikes || [];
      let existingLikes = data.likes ?? [];

      if (typeof existingdislikes === "string") {
        existingdislikes = JSON.parse(existingdislikes);
      }
      if (typeof existingLikes === "string") {
        existingLikes = JSON.parse(existingLikes);
      }

      existingdislikes = existingdislikes ?? [];

      let updatedDislikes, updatedLikes;
      if (existingdislikes.includes(userId)) {
        updatedDislikes = existingdislikes.filter((id) => id !== userId);
        updatedLikes = existingLikes;
      } else {
        updatedDislikes = [...existingdislikes, userId];
        updatedLikes = existingLikes.filter((id) => id !== userId);
      }

      const { error: updateError } = await supabase
        .from("reviews")
        .update({ dislikes: updatedDislikes, likes: updatedLikes })
        .eq("id", reviewId);

      if (updateError) {
        console.error("Error updating likes:", updateError);
        return;
      }

      setProductReviews((prevReviews) =>
        prevReviews.map((review) =>
          review.id === reviewId
            ? { ...review, dislikes: updatedDislikes, likes: updatedLikes }
            : review
        )
      );
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };

  const ratingCounts = [0, 0, 0, 0, 0];

  productReviews?.forEach((review) => {
    const index = 5 - review.stars;
    if (index >= 0 && index < 5) {
      ratingCounts[index]++;
    }
  });

  const totalRatings = ratingCounts.reduce((sum, val) => sum + val, 0);
  const averageRating =
    productReviews?.length > 0
      ? productReviews?.reduce((sum, r) => sum + r.stars, 0) /
        productReviews?.length
      : 0;

  if (isloading) return <p>loading .....</p>;
  return (
    <>
      <div className="border-2 border-[#334A78]/20 p-4 my-6 lg:my-10 font-Poppins">
        <div
          className={`flex justify-between items-center ${
            hasReviews ? "p-6" : "p-0"
          }`}
        >
          <div className="">
            <h3 className="text-[#171717] md:font-semibold font-bold text-sm md:text-2xl ">
              Customer Reviews
            </h3>
            {!hasReviews && (
              <p className="text-[#334A78] text-sm">No reviews yet</p>
            )}
          </div>
          <p
            className="text-[#C16452] text-sm cursor-pointer hover:underline whitespace-nowrap"
            onClick={() => {
              if (isAuthenticated) {
                setIsReview(true);
              } else {
                toast.error("Plaese log in to give review");
                return;
              }
            }}
          >
            Write a review
          </p>
        </div>

        {hasReviews && (
          <div className="space-y-6 md:p-6">
            {/* Rating Summary */}
            <div className="flex flex-col md:flex-row items-center mt-5 md:mt-0 gap-10 md:items-start font-Poppins">
              <div className="text-center">
                <p className="md:text-3xl font-semibold">
                  {averageRating.toFixed(1)}★
                </p>
                <p className="text-[#A3A3A3] md:text-sm text-xs">
                  {totalRatings} Ratings &<br /> {productReviews?.length}{" "}
                  Reviews
                </p>
              </div>
              <div className="space-y-1">
                {[5, 4, 3, 2, 1].map((star, i) => {
                  const count = ratingCounts[i];
                  const rawPercent =
                    totalRatings > 0 ? (count / totalRatings) * 100 : 0;
                  const percent = count > 0 ? Math.max(rawPercent, 5) : 0;
                  const barColor =
                    star >= 3
                      ? "bg-[#304778]"
                      : star === 2
                      ? "bg-[#FACC15]"
                      : "bg-[#FA9515]";
                  return (
                    <div key={star} className="flex items-center gap-2">
                      <span className="md:text-sm text-xs w-4 whitespace-nowrap md:mr-4">
                        {star} ★
                      </span>
                      <div className="w-48 h-2 bg-gray-200 rounded">
                        <div
                          className={`${barColor} h-2 rounded`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <span className="md:text-sm text-xs pl-4">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {displayedImages?.length > 0 && (
              <div className="flex gap-2 pt-8 border-b pb-6">
                <div className="mb-6">
                  {/* Render combined review images */}
                  <div className="flex flex-wrap gap-2 pt-4 border-b pb-4">
                    {displayedImages?.map(({ path, review }, i) => {
                      const url = supabase.storage
                        .from("review-images")
                        .getPublicUrl(path).data.publicUrl;

                      return (
                        <div
                          key={i}
                          className="w-20 h-20 rounded overflow-hidden bg-gray-200"
                        >
                          <img
                            src={url}
                            alt={`review-img-${i}`}
                            className="w-full h-full object-cover cursor-pointer"
                            onClick={() => {
                              setSelectedReview(review);
                              setSelectedImageIndex(i);
                              setDetailedMode("normal");
                            }}
                          />
                        </div>
                      );
                    })}

                    {remainingCount > 0 && (
                      <div
                        className="w-20 h-20 flex items-center justify-center rounded bg-gray-300 text-sm font-medium cursor-pointer"
                        onClick={() => {
                          setDetailedMode("grid");
                          setGridViewReview(allImages);
                        }}
                      >
                        +{remainingCount}
                      </div>
                    )}
                  </div>
                </div>

                <DetailedReview
                  selectedReview={selectedReview}
                  gridViewReview={gridViewReview}
                  onClose={() => {
                    setSelectedReview(null);
                    setGridViewReview(null);
                  }}
                  mode={detailedMode}
                  setMode={setDetailedMode}
                  setSelectedReview={setSelectedReview}
                  selectedImageIndex={selectedImageIndex}
                  setSelectedImageIndex={setSelectedImageIndex}
                />
              </div>
            )}

            {/* Reviews List */}
            {productReviews?.slice(0, 2).map((review, idx) => {
              const expanded = expandedStates[idx];
              const isClamped = clampedStates[idx];
              const likesArray = Array.isArray(review.likes)
                ? review.likes
                : JSON.parse(review.likes || "[]");

              const likeCount = likesArray.length;
              const userHasLiked = likesArray.includes(accountHolder?.userId);
              const dislikesArray = Array.isArray(review.dislikes)
                ? review.dislikes
                : JSON.parse(review.dislikes || "[]");
              const dislikeCount = dislikesArray.length;
              const userHasDisliked = dislikesArray.includes(
                accountHolder?.userId
              );

              return (
                <div key={idx} className="border-b pb-6 font-Poppins">
                  <div className="flex items-center gap-2 mb-2">
                    <p className="text-xs px-2 py-1 rounded flex items-center gap-1 border border-[#38938E]">
                      {review.stars} <span className="text-[#38938E]">★</span>
                    </p>
                    <span className="font-semibold text-sm">
                      {review.title}
                    </span>
                  </div>

                  {/* Description */}
                  <p
                    ref={(el) => (contentRefs.current[idx] = el)}
                    className={`text-xs transition-all max-w-6xl duration-300 ease-in-out ${
                      !expanded ? "line-clamp-3" : ""
                    }`}
                  >
                    {review.description}
                  </p>

                  {/* Read More / Less */}
                  {isClamped && (
                    <p
                      className="text-sm text-[#6082AF] font-medium mt-2 cursor-pointer hover:underline"
                      onClick={() => toggleExpanded(idx)}
                    >
                      {expanded ? "READ LESS" : "READ MORE"}
                    </p>
                  )}

                  <div className="flex gap-6 text-sm mt-3 justify-end">
                    <div className="flex items-center gap-1 cursor-pointer">
                      {review.likes?.includes(accountHolder?.userId) ? (
                        <HandThumbUpIcon
                          onClick={() =>
                            handleLikes(review.id, accountHolder?.userId)
                          }
                          className="w-5 h-5 text-blue-600"
                        />
                      ) : (
                        <HandThumbUpOutline
                          onClick={() =>
                            handleLikes(review.id, accountHolder?.userId)
                          }
                          className="w-5 h-5 text-gray-400"
                        />
                      )}
                      <span
                        className={
                          userHasLiked ? "text-blue-600" : "text-gray-400"
                        }
                      >
                        {likeCount}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 cursor-pointer">
                      {review.dislikes?.includes(accountHolder?.userId) ? (
                        <HandThumbDownIcon
                          onClick={() =>
                            handleDislikes(review.id, accountHolder?.userId)
                          }
                          className="w-5 h-5 text-red-500"
                        />
                      ) : (
                        <HandThumbDownOutline
                          onClick={() =>
                            handleDislikes(review.id, accountHolder?.userId)
                          }
                          className="w-5 h-5 text-gray-400"
                        />
                      )}
                      <span
                        className={
                          userHasDisliked ? "text-red-600" : "text-gray-400"
                        }
                      >
                        {dislikeCount}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
            {productReviews?.length > 2 && (
              <div className="w-full flex justify-end">
                <button
                  onClick={() => navigate(`/reviews/${product?.id}`)}
                  className="text-sm mt-4 text-blue-600 underline"
                >
                  View All Reviews
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      {isReview && (
        <div className="fixed inset-0 z-50 flex lg:items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white w-full max-w-sm sm:max-w-md xl:max-w-3xl p-6 rounded-lg shadow-lg relative overflow-y-auto max-h-[90vh]">
            <ProductReview
              product={product}
              onClose={() => setIsReview(false)}
            />
          </div>
        </div>
      )}
    </>
  );
}

export default CustomerReview;
