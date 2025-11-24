import React from "react";
import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { supabase } from "../../services/supabase";
import { HandThumbUpIcon, HandThumbDownIcon } from "@heroicons/react/24/solid";
import {
  HandThumbUpIcon as HandThumbUpOutline,
  HandThumbDownIcon as HandThumbDownOutline,
} from "@heroicons/react/24/outline";
import { useApp } from "../../Context/Context";
import Header from "./Header";
import { useNavigate } from "react-router-dom";
import { BsArrowLeftShort } from "react-icons/bs";
import { AiFillStar } from "react-icons/ai";

function AllReviews() {
  const [productReviews, setProductReviews] = useState([]);
  const [expandedStates, setExpandedStates] = useState([]);
  const [clampedStates, setClampedStates] = useState([]);
  const [productDetails, setProductDetails] = useState({
    image: null,
    title: "",
    price: "",
    type: "",
  });
  const { id: productId } = useParams();
  const { accountHolder } = useApp();
  const navigate = useNavigate();
  const contentRefs = useRef([]);
  const ratingCounts = [0, 0, 0, 0, 0];
  productReviews.forEach((review) => {
    const index = 5 - review.stars;
    if (index >= 0 && index < 5) {
      ratingCounts[index]++;
    }
  });
  const totalRatings = ratingCounts.reduce((sum, val) => sum + val, 0);
  const averageRating =
    productReviews.length > 0
      ? productReviews.reduce((sum, r) => sum + r.stars, 0) /
        productReviews.length
      : 0;

  const baseImageUrl =
    "https://bwxzfwsoxwtzhjbzbdzs.supabase.co/storage/v1/object/public/addon/";

  const fetchProductReviews = async () => {
    try {
      const { data, error } = await supabase
        .from("reviews")
        .select(
          `*,profiles:userId(company_name),product_variants:productId (
      image,title,price,product_type
    )`
        )
        .eq("productId", productId);
      if (error) {
        console.error(error);
      }
      setProductReviews(data);
      const variant = data[0]?.product_variants;
      setProductDetails({
        image: variant?.image,
        title: variant?.title,
        price: variant?.price,
        type: variant?.product_type,
      });
      console.log(productReviews);

      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProductReviews();
  }, [productId]);

  useEffect(() => {
    // Timeout ensures DOM is fully rendered
    const timeout = setTimeout(() => {
      const clamped = productReviews.map((_, idx) => {
        const el = contentRefs.current[idx];
        if (!el) return false;

        const lineHeight = parseFloat(getComputedStyle(el).lineHeight) || 20;
        const maxHeight = lineHeight * 3;

        return el.scrollHeight > maxHeight;
      });

      setClampedStates(clamped);
      setExpandedStates(Array(productReviews.length).fill(false));
    }, 100); // delay ensures DOM paints first

    return () => clearTimeout(timeout);
  }, [productReviews]);

  const toggleExpanded = (index) => {
    setExpandedStates((prev) => {
      const updated = [...prev];
      updated[index] = !updated[index];
      return updated;
    });
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

  return (
    <>
      <Header />
      <div className="lg:container mx-auto px-3 lg:px-12 mt-5 font-Poppins">
        <button onClick={() => navigate(-1)} className=" mt-4 my-5">
          <BsArrowLeftShort size={25} />
        </button>
        <div className="flex gap-4">
          <div className="w-1/3">
            <img
              src={`${baseImageUrl}${productDetails.image}`}
              alt={productDetails.title}
            />
            <h3 className="uppercase text-[#111] font-semibold tracking-wider text-xl mt-2">
              {productDetails.title}
            </h3>
            <p className="text-[#A5A6AD] text-sm my-2">{productDetails.type}</p>
            <div className="border border-[#ccc] p-1 w-32">
              <p className="flex gap-1">
                <span className="text-[#000] font-medium text-[10px]">
                  {averageRating.toFixed(1) || 0}
                </span>{" "}
                <AiFillStar color="#F5B92B" size={14} />
                <span className="border-l border-l-[#CCCCCC] pl-4 text-[#666] text-[10px]">
                  {totalRatings || 0} Ratings
                </span>
              </p>
            </div>
            <hr className="my-2" />
            <div className="flex items-center gap-2">
              <p className="text-sm font-bold text-[#334A78] leading-[38.4px]">
                Rs {productDetails.price || "Rs 3,0000"}
              </p>
              <p className="text-sm  text-[#898994] leading-[38.4px]">
                MRP <span className="line-through">Rs5678</span>
              </p>
              <p className="text-sm text-[#F69E60]">(Rs.2678 OFF)</p>
            </div>
          </div>
          <div className="w-2/3">
            <div className="flex flex-col md:flex-row items-center mt-5 md:mt-0 gap-10 md:items-start font-Poppins">
              <div className="text-center">
                <p className="md:text-3xl font-semibold">
                  {averageRating.toFixed(1)}★
                </p>
                <p className="text-[#A3A3A3] md:text-sm text-xs">
                  {totalRatings} Ratings &<br /> {productReviews.length} Reviews
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

            <div className="flex gap-2 pt-8 border-b pb-6">
              <div className="mb-6">
                {/* Render combined review images */}
                {/* <div className="flex flex-wrap gap-2 pt-4 border-b pb-4">
              {displayedImages.map(({ path, review }, i) => {
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
                      // onClick={() => {
                      //   setSelectedReview(review);
                      //   setSelectedImageIndex(i);
                      //   setDetailedMode("normal");
                      // }}
                    />
                  </div>
                );
              })}

              {remainingCount > 0 && (
                <div
                  className="w-20 h-20 flex items-center justify-center rounded bg-gray-300 text-sm font-medium cursor-pointer"
                  // onClick={() => {
                  //   setDetailedMode("grid");
                  //   setGridViewReview(allImages);
                  // }}
                >
                  +{remainingCount}
                </div>
              )}
            </div> */}
              </div>

              {/* <DetailedReview
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
                  /> */}
            </div>
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-4">All Reviews</h2>
              {productReviews.map((review, idx) => {
                // const interaction = interactions[idx];
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
                    <div className="flex gap-2 mt-2">
                      {JSON.parse(review.images).map((image, index) => {
                        const url = supabase.storage
                          .from("review-images")
                          .getPublicUrl(image).data.publicUrl;
                        return (
                          <div>
                            <img
                              key={index}
                              src={url}
                              alt={`Review ${index + 1}`}
                              className="h-16 w-16 object-cover"
                            />
                          </div>
                        );
                      })}
                    </div>

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
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AllReviews;
