import { useState } from "react";
import { useApp } from "../../Context/Context";
import { MdDeleteOutline } from "react-icons/md";
import { AiTwotoneCheckCircle } from "react-icons/ai";
import { PiClockCountdown } from "react-icons/pi";
import { IoCloseCircleOutline } from "react-icons/io5";

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

  const baseImageUrl =
    "https://bwxzfwsoxwtzhjbzbdzs.supabase.co/storage/v1/object/public/addon/";

  const currentStatus = product.status;
  console.log("current status", currentStatus);

  return (
    <div className="flex justify-center items-center h-screen fixed inset-0 z-30 top-0 w-screen">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="font-Poppins max-w-3xl p-10 rounded-3xl border-2 relative bg-white">
        {!deleteWarning ? (
          <div>
            <div className="flex gap-4">
              <div className="flex-1">
                <img src={`${baseImageUrl}${product.image}`} alt="product" />
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
                    {product.products?.category}
                  </span>
                </h5>
                <hr />
                <h5 className="uppercase text-[#334A78] font-medium text-xs opacity-80">
                  Specification:
                  <span className="font-bold text-[#000]">
                    {product.products?.subcategory1}
                  </span>
                </h5>
                <hr />
                <h5 className="uppercase text-[#334A78] font-medium text-xs opacity-80">
                  dimensions:
                  <span className="font-bold text-[#000]">
                    {product.dimensions}
                  </span>
                </h5>
                <hr />
                <h5 className="uppercase text-[#334A78] font-medium text-xs opacity-80">
                  segment:
                  <span className="font-bold text-[#000]">
                    {product.segment}
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
                        updateStatus(product, "approved");
                        setRejectReason("");
                      }}
                      className={`px-5 py-2 bg-[#F8FBFF]  border-[#A3FEE7] transition-all duration-500 flex flex-col justify-center items-center rounded-lg ${
                        currentStatus === "approved" ? "border-4" : "border-2"
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
                      className={`px-7 py-3 bg-[#FFFEF8] border-[#FFB966] transition-all duration-500 flex flex-col justify-center items-center rounded-lg ${
                        currentStatus === "pending" ? "border-4" : "border-2"
                      }`}
                    >
                      <PiClockCountdown size={25} />
                      Pending
                    </button>
                    <button
                      className={`px-7 py-3 bg-[#FFF8F8] border-[#FF6666] transition-all duration-500 flex flex-col justify-center items-center rounded-lg ${
                        currentStatus === "rejected" ? "border-4" : "border-2"
                      }`}
                      onClick={() => setShowTextarea(true)}
                    >
                      <IoCloseCircleOutline size={25} />
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
                      {/* Reject */}
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
                      onClick={handleConfirmReject}
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

            <div className="flex text-[#000] justify-between  w-full p-4">
              {accountHolder.role !== "user" && (
                <button
                  // onClick={() => {
                  //   handleDelete(product);
                  // }}
                  onClick={() => {
                    setDeleteWarning(true);
                  }}
                  className="px-3 py-2 capitalize border-[#FF6666] border-2 rounded-2xl flex justify-center items-center gap-2"
                >
                  <MdDeleteOutline /> delete
                </button>
              )}

              <div>
                <button
                  onClick={onClose}
                  className=" px-3 py-2 capitalize border-[#BBBBBB] border-2 bg-[#fff] rounded-2xl"
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
