import React, { useEffect, useState } from "react";
import { supabase } from "../../../services/supabase";
import { ImBin } from "react-icons/im";
import toast from "react-hot-toast";
import PagInationNav from "../../../common-components/PagInationNav";

function ProductReviews({ product, onClose }) {
  const [productReviews, setProductReviews] = useState([]);
  const [selectedReview, setSelectedReview] = useState();
  const [deleteWarning, setDeleteWarning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerpage = 10;
  const totalPages = Math.ceil(productReviews.length / reviewsPerpage);

  useEffect(() => {
    fetchReviews();
  }, [product]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("reviews")
        .select(`*,userId(company_name)`)
        .eq("productId", product.id);
      if (error) console.log(error);
      setProductReviews(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (review) => {
    try {
      if (review.images && review.images.length > 0) {
        const { error: storageError } = await supabase.storage
          .from("reviews")
          .remove(review.images);

        if (storageError) {
          console.error("Error deleting images:", storageError);
        }
      }

      const { error } = await supabase
        .from("reviews")
        .delete()
        .eq("id", review.id);
      if (error) console.log(error);
      toast.success("Review Deleted Successfully!");
      setDeleteWarning(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    setSelectedReview();
  };

  const averageStars =
    productReviews.reduce((a, r) => a + r.stars, 0) / productReviews.length ||
    0;

  return (
    <div>
      <button
        onClick={onClose}
        className="text-[#555555] text-left py-1 text-xs group px-3"
      >
        &lt; <span className="group-hover:underline">Back to Order List</span>
      </button>
      {loading ? (
        <div className="flex flex-col items-center justify-center h-full">
          <p className="text-xl font-bold text-[#ccc]">Hold On...</p>
          <p className="text-xl font-bold text-[#ccc]">
            Fetching reviews for {product.title} !!
          </p>
        </div>
      ) : productReviews.length === 0 ? (
        <div>
          <div className="flex flex-col items-center justify-center h-full">
            <p className="text-xl font-bold text-[#ccc]">No reviews for</p>
            <p className="text-xl font-bold text-[#ccc]">{product.title}</p>
          </div>
        </div>
      ) : (
        <div className="font-Poppins overflow-y-auto gradient-scrollbar">
          <div className="px-3 flex justify-between">
            <h2 className="text-xl md:text-2xl font-semibold text-[#374A75]">
              Reviews
            </h2>
            <h4 className="font-semibold mr-4">
              Avg Rating: <span className="text-[#374A75]">{averageStars}</span>
            </h4>
          </div>
          <hr />
          <div className="p-2 md:p-4">
            <table className="w-full text-left">
              <thead className="text-[#232321]/80 font-semibold ">
                <tr className="border-b">
                  <th className="py-2 px-1 text-sm md:text-base">Name</th>
                  <th className="py-2 px-1 text-sm md:text-base">Rating</th>
                  <th className="py-2 px-1 text-sm md:text-base text-center">
                    Heading
                  </th>
                  <th className="py-2 px-1 text-sm md:text-base text-center">
                    Review
                  </th>
                  <th className="py-2 px-1 text-sm md:text-base">Reactions</th>
                  <th className="py-2 px-1 text-sm md:text-base text-center">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {productReviews.map((review) => {
                  const likesCount = review.likes
                    ? JSON.parse(review.likes).length
                    : 0;

                  const dislikesCount = review.dislikes
                    ? JSON.parse(review.dislikes).length
                    : 0;

                  return (
                    <tr
                      key={review.id}
                      className="border-b text-xs md:text-sm text-[#000] hover:bg-[#f1f1f1]"
                    >
                      <td className="py-3.5 px-1">
                        {review?.userId?.company_name}
                      </td>
                      <td className="py-3.5 px-1 text-[#304778]">
                        {review.stars} stars
                      </td>
                      <td className="py-3.5 px-1 text-center">
                        {review.title}
                      </td>
                      <td className="py-3.5 px-1 max-w-md">
                        {review.description}
                      </td>
                      <td className="py-3.5 px-1">
                        Likes: {likesCount} <br />
                        Dislikes: {dislikesCount}
                      </td>
                      <td className="py-3.5 px-1 text-center">
                        <button
                          onClick={() => {
                            setSelectedReview(review);
                            setDeleteWarning(true);
                          }}
                          className="text-lg text-[#304778] hover:text-red-400"
                        >
                          <ImBin />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <PagInationNav
              totalPages={totalPages}
              currentPage={currentPage}
              handlePageChange={handlePageChange}
            />
          </div>
        </div>
      )}
      {deleteWarning && (
        <DeleteWarning
          review={selectedReview}
          setDeleteWarning={setDeleteWarning}
          handleDelete={handleDelete}
        />
      )}
    </div>
  );
}

export default ProductReviews;

function DeleteWarning({ review, setDeleteWarning, handleDelete }) {
  return (
    <div className="flex justify-center items-center fixed inset-0 z-30">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="bg-white relative py-7 px-16 md:px-20">
        <div className="flex justify-center items-center">
          <img
            src="images/icons/delete-icon.png"
            alt="delete icon"
            className="h-12 w-12"
          />
        </div>

        <h4 className="font-semibold my-5">
          Do you want to delete this review ?
        </h4>
        <div className="flex justify-between">
          <button
            onClick={() => {
              setDeleteWarning(false);
            }}
            className="px-5 py-2 bg-[#EEEEEE] rounded-md hover:bg-[#a1a1a1]"
          >
            Cancel
          </button>
          <button
            onClick={() => handleDelete(review)}
            className="px-5 py-2 bg-[#374A75] text-[#fff] rounded-md hover:bg-[#4C69A4]"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
