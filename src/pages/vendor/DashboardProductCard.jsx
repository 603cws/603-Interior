import { useState } from "react";
import { useApp } from "../../Context/Context";
import { MdDeleteOutline } from "react-icons/md";
import { AiTwotoneCheckCircle } from "react-icons/ai";
import { PiClockCountdown } from "react-icons/pi";
import { IoCloseCircleOutline } from "react-icons/io5";
import { baseImageUrl } from "../../utils/HelperConstant";

function DashboardProductCard({
  onClose,
  product,
  handleDelete,
  updateStatus,
  deleteWarning,
  setDeleteWarning,
  rejectReason,
  setRejectReason,
  handleConfirmReject,
}) {
  const [showTextarea, setShowTextarea] = useState(false);
  const { accountHolder } = useApp();

  const currentStatus = product?.status;

  const additionalImages = product?.additional_images
    ? JSON.parse(product.additional_images)
    : [];

  return (
    <div className="flex  justify-center items-center h-screen fixed inset-0 z-30 top-0 w-screen">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className=" font-Poppins max-w-xs sm:max-w-sm md:max-w-2xl  lg:max-w-3xl mx-auto p-4 md:p-10 rounded-lg md:rounded-xl border-2 relative bg-white max-h-[85vh] overflow-y-auto gradient-scrollbar">
        {!deleteWarning ? (
          <div>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="max-w-sm mb-2">
                  <img src={`${baseImageUrl}${product.image}`} alt="product" />
                </div>

                <div className="flex gap-2 ">
                  {additionalImages.length > 0 ? (
                    additionalImages.map((image, index) => (
                      <div key={index}>
                        <img
                          src={`${baseImageUrl}${image}`}
                          alt="product"
                          className="h-12 w-12 "
                        />
                      </div>
                    ))
                  ) : (
                    <h3 className="pt-3 uppercase">No Additional Images</h3>
                  )}
                </div>
              </div>

              <div className="flex-1 flex flex-col gap-2">
                <h2 className="font-semibold text-3xl text-[#111] uppercase">
                  {product.title}
                </h2>
                <p className="capitalize font-thin text-[#334A78] text-xs">
                  {product.details}
                </p>
                <div>
                  {(product.productDisplayType === "boq" ||
                    product.productDisplayType === "both") && (
                    <div>
                      <p className="text-[#334A78] text-sm font-medium">
                        {" "}
                        BOQ Price
                      </p>
                      <p className="font-semibold text-[#000] text-lg">
                        ₹{product.price} 
                      </p>
                    </div>
                  )}
                  {(product.productDisplayType === "ecommerce" ||
                    product.productDisplayType === "both") && (
                    <div>
                      <p className="text-[#334A78] text-sm font-medium">MRP</p>
                      <p className="font-semibold text-[#000] text-lg">
                        ₹{product.price} 
                      </p>
                      <p className="text-[#334A78] text-sm font-medium">
                        Selling Price
                      </p>
                      <p className="font-semibold text-[#000] text-lg">
                        ₹{product.price} 
                      </p>
                      <p className="text-[#334A78] text-sm font-medium mt-4">
                        Available Stock :
                        <span className="font-semibold text-[#000] text-sm">
                          {" "}
                          {product.stockQty || "NA"}
                        </span>
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex-1 flex flex-col gap-4">
                <h5 className="uppercase text-[#334A78] font-medium text-xs opacity-80">
                  Display on:
                  <span className="font-bold text-[#000]">
                    {product.productDisplayType || "NA"}
                  </span>
                </h5>
                <hr />
                <h5 className="uppercase text-[#334A78] font-medium text-xs opacity-80">
                  Category:
                  <span className="font-bold text-[#000]">
                    {product.products?.category || product?.category}
                  </span>
                </h5>
                <hr />
                <h5 className="uppercase text-[#334A78] font-medium text-xs opacity-80">
                  Specification:
                  <span className="font-bold text-[#000]">
                    {product.products?.subcategory1 || product?.specifications}
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
                {product?.segment && (
                  <h5 className="uppercase text-[#334A78] font-medium text-xs opacity-80">
                    segment:
                    <span className="font-bold text-[#000]">
                      {product.segment}
                    </span>
                  </h5>
                )}
                <hr />
                {product?.status && (
                  <h5 className="uppercase text-[#334A78] font-medium text-xs opacity-80">
                    status:
                    <span className="font-bold text-[#000]">
                      {product?.status}
                    </span>
                  </h5>
                )}
                <hr />
              </div>
            </div>

            {accountHolder.role === "admin" && (
              <div className="flex w-full items-start mt-2.5">
                {!showTextarea ? (
                  <div className="flex justify-center gap-2 flex-1 transition-all duration-500">
                    <button
                      onClick={() => {
                        updateStatus(product, "approved");
                        setRejectReason("");
                      }}
                      className={`px-2 md:px-5 py-1 md:py-2 bg-[#F8FBFF]  border-[#A3FEE7] transition-all duration-500 flex flex-col justify-center items-center rounded-sm  text-xs md:text-sm ${
                        currentStatus === "approved"
                          ? "border-2 md:border-4"
                          : "border md:border-2"
                      }`}
                    >
                      <AiTwotoneCheckCircle size={25} />
                      {currentStatus === "approved" ? "Approved" : "Approve"}
                    </button>
                    <button
                      onClick={() => {
                        updateStatus(product, "pending");
                        setRejectReason("");
                      }}
                      className={`px-2 md:px-5 py-1 md:py-2 bg-[#FFFEF8] border-[#FFB966] transition-all duration-500 flex flex-col justify-center items-center rounded-sm text-xs md:text-sm ${
                        currentStatus === "pending"
                          ? "border-2 md:border-4"
                          : "border md:border-2"
                      }`}
                    >
                      <PiClockCountdown size={25} />
                      Pending
                    </button>
                    <button
                      className={`px-2 md:px-5 py-1 md:py-2 bg-[#FFF8F8] border-[#FF6666] transition-all duration-500 flex flex-col justify-center items-center rounded-sm text-xs md:text-sm ${
                        currentStatus === "rejected"
                          ? "border-2 md:border-4"
                          : "border md:border-2"
                      }`}
                      onClick={() => setShowTextarea(true)}
                    >
                      <IoCloseCircleOutline size={25} />
                      {currentStatus === "rejected" ? "Rejected" : "Reject"}
                    </button>
                  </div>
                ) : (
                  <div className="flex justify-center gap-2 flex-1 transition-all duration-500">
                    <button
                      onClick={() => setShowTextarea(false)}
                      className="px-2 md:px-5 py-1 md:py-2 border-4 border-red-400 transition-all duration-500 flex flex-col justify-center items-center text-xs md:text-sm"
                    >
                      <IoCloseCircleOutline size={25} />
                      {/* Reject */}
                    </button>
                    <textarea
                      className={`flex-1 px-2 md:px-5 py-1 md:py-2 border rounded-sm transition-all duration-500 text-xs md:text-sm ${
                        showTextarea ? "opacity-100 w-full" : "opacity-0 w-0"
                      }`}
                      rows="2"
                      placeholder="Provide a reason..."
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                    />
                    <button
                      onClick={handleConfirmReject}
                      className={`px-2 md:px-5 py-1 md:py-2 border-2 bg-[#374A75] text-white rounded-sm transition-all duration-500 text-xs md:text-sm ${
                        showTextarea ? "opacity-100 w-auto" : "opacity-0 w-0"
                      }`}
                    >
                      Confirm
                    </button>
                  </div>
                )}
              </div>
            )}

            <div className="flex text-[#000] justify-between  w-full p-4">
              {accountHolder.role !== "user" && (
                <button
                  // onClick={() => {
                  //   handleDelete(product);
                  // }}
                  onClick={() => {
                    setDeleteWarning(true);
                  }}
                  className="px-3 py-2 capitalize border-[#FF6666] border-2 rounded-sm flex justify-center items-center gap-2"
                >
                  <MdDeleteOutline /> delete
                </button>
              )}

              <div>
                <button
                  onClick={onClose}
                  className=" px-3 py-2 capitalize border-[#BBBBBB] border-2 bg-[#fff] rounded-sm"
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
                className="px-5 py-2 bg-red-400"
              >
                Yes
              </button>
              <button
                onClick={() => {
                  setDeleteWarning(false);
                }}
                className="px-5 py-2 bg-gray-400"
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

export default DashboardProductCard;
