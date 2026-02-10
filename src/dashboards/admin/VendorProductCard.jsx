import { useState } from "react";
import { useApp } from "../../Context/Context";
import { MdDeleteOutline } from "react-icons/md";
import { AiTwotoneCheckCircle } from "react-icons/ai";
import { PiClockCountdown } from "react-icons/pi";
import { IoCloseCircleOutline } from "react-icons/io5";
import { baseImageUrl } from "../../utils/HelperConstant";

function VendorProductCard({
  onClose,
  product,
  handleDelete,
  updateStatus,
  rejectReason,
  setRejectReason,
  handleConfirmReject,
  setSelectedItem,
  setSelectSubcategories,
}) {
  const [showTextarea, setShowTextarea] = useState(false);
  const [deleteWarning, setDeleteWarning] = useState(false);
  const { accountHolder } = useApp();
  const currentStatus = product.status;

  const additionalImages = product?.additional_images
    ? JSON.parse(product.additional_images)
    : [];

  return (
    <div className="flex justify-center items-center h-screen fixed inset-0 z-30 top-0 w-screen">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="font-Poppins max-w-3xl p-10 rounded-3xl border-2 relative bg-white">
        {!deleteWarning ? (
          <div>
            <div className="flex gap-4">
              <div className="flex-1">
                <div>
                  <img src={`${baseImageUrl}${product.image}`} alt="product" />
                </div>
                <div className="flex gap-2">
                  {additionalImages.map((image, index) => (
                    <div key={index}>
                      <img
                        src={`${baseImageUrl}${image}`}
                        alt="product"
                        className="aspect-auto w-12"
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex-1 flex flex-col gap-2">
                <h2 className="font-semibold text-3xl text-[#111] uppercase">
                  {product.title}
                </h2>
                <p className="capitalize font-thin text-[#334A78] text-xs">
                  {product.details}
                </p>
                <p className="text-[#334A78] text-sm font-medium">Price</p>

                <p className="font-semibold text-[#000] text-xl">
                  ₹{product.price}
                </p>
              </div>
              <div className="flex-1 flex flex-col gap-4">
                <h5 className="uppercase text-[#334A78] font-medium text-xs opacity-80">
                  Category:
                  <span className="font-bold text-[#000]">
                    {product.type === "addon"
                      ? product?.category
                      : product.products?.category}
                  </span>
                </h5>
                <hr />
                <h5 className="uppercase text-[#334A78] font-medium text-xs opacity-80">
                  Specification:
                  <span className="font-bold text-[#000]">
                    {product.type === "addon"
                      ? product?.specifications
                      : product.products?.subcategory1}
                  </span>
                </h5>
                <hr />
                <h5 className="uppercase text-[#334A78] font-medium text-xs opacity-80">
                  dimensions:
                  <span className="font-bold text-[#000]">
                    {product?.dimensions || "NA"}
                  </span>
                </h5>
                <hr />
                <h5 className="uppercase text-[#334A78] font-medium text-xs opacity-80">
                  segment:
                  <span className="font-bold text-[#000]">
                    {product.type === "addon"
                      ? product?.type
                      : product?.segment}
                  </span>
                </h5>
                <hr />
              </div>
            </div>

            {accountHolder.role === "admin" && (
              <div className="flex w-full items-start mt-2.5">
                {!showTextarea ? (
                  <div className="flex justify-center gap-2 flex-1 transition-all duration-500">
                    <button
                      onClick={() => {
                        setSelectedItem(product);
                        setSelectSubcategories(true);
                      }}
                      className={`group px-2 md:px-5 py-1 md:py-2 bg-[#F8FBFF] border-[#A3FEE7] flex flex-col items-center justify-center rounded-sm text-xs md:text-sm transition-all duration-300 ease-out hover:bg-[#E9FFF9] hover:-translate-y-1 active:scale-95 ${currentStatus === "approved" ? "border-2 md:border-4" : "border md:border-2"}`}
                    >
                      <AiTwotoneCheckCircle
                        size={25}
                        className="text-[#2DBE9D] transition-transform duration-300 group-hover:scale-125"
                      />
                      {currentStatus === "approved" ? "Approved" : "Approve"}
                    </button>
                    <button
                      onClick={() => {
                        updateStatus(product, "pending");
                        setRejectReason("");
                      }}
                      className={`group px-2 md:px-5 py-1 md:py-2 bg-[#FFFEF8] border-[#FFB966] flex flex-col items-center justify-center rounded-sm text-xs md:text-sm transition-all duration-300 ease-out hover:bg-[#FFF4E0] hover:-translate-y-1 active:scale-95 ${currentStatus === "pending" ? "border-2 md:border-4" : "border md:border-2"}`}
                    >
                      <PiClockCountdown
                        size={25}
                        className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-110"
                      />
                      Pending
                    </button>
                    <button
                      className={`group px-2 md:px-5 py-1 md:py-2 bg-[#FFF8F8] border-[#FF6666] flex flex-col items-center justify-center rounded-sm text-xs md:text-sm transition-all duration-300 ease-out hover:bg-[#FFECEC] hover:-translate-y-1 active:scale-95 ${currentStatus === "rejected" ? "border-2 md:border-4" : "border md:border-2"}`}
                      onClick={() => setShowTextarea(true)}
                    >
                      <IoCloseCircleOutline
                        size={25}
                        className="transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110"
                      />
                      {currentStatus === "rejected" ? "Rejected" : "Reject"}
                    </button>
                  </div>
                ) : (
                  <div className="flex w-full gap-2 transition-all duration-500">
                    <button
                      onClick={() => setShowTextarea(false)}
                      className="px-7 py-3 border-2 border-red-400 transition-all duration-500 flex flex-col justify-center items-center"
                    >
                      <IoCloseCircleOutline size={25} />
                    </button>
                    <textarea
                      className={`flex-1 p-2 border rounded-md transition-all duration-500 ${
                        showTextarea ? "opacity-100 w-full" : "opacity-0 w-0"
                      }`}
                      rows="2"
                      placeholder="Provide a reason..."
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                    />
                    <button
                      onClick={() =>
                        handleConfirmReject(product, "rejected", rejectReason)
                      }
                      className={`px-5 py-3 border-2 bg-blue-500 text-white rounded-md transition-all duration-500 ${
                        showTextarea ? "opacity-100 w-auto" : "opacity-0 w-0"
                      }`}
                    >
                      Confirm
                    </button>
                  </div>
                )}
              </div>
            )}

            <div className="flex text-[#000] justify-between w-full p-4">
              {accountHolder.role !== "user" && (
                <button
                  onClick={() => setDeleteWarning(true)}
                  className="px-3 py-2 capitalize border-2 border-[#FF6666] text-[#FF4D4D] rounded-sm flex items-center gap-2 transition-all duration-200 hover:bg-[#FF4D4D] hover:text-white"
                >
                  <MdDeleteOutline /> delete
                </button>
              )}

              <div>
                <button
                  onClick={onClose}
                  className="px-3 py-2 capitalize border-2 border-[#BBBBBB] bg-white rounded-sm transition-all duration-200 hover:bg-[#F5F5F5] hover:border-[#999999]"
                >
                  cancel
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full h-full">
            <h4>Do you want to delete this product?</h4>
            <div className="flex justify-between my-3">
              <button
                onClick={() => {
                  handleDelete(product);
                }}
                className="px-5 py-2 bg-red-400 hover:bg-red-500"
              >
                Yes
              </button>
              <button
                onClick={() => {
                  setDeleteWarning(false);
                }}
                className="px-5 py-2 bg-gray-400 hover:bg-gray-500"
              >
                No
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default VendorProductCard;
