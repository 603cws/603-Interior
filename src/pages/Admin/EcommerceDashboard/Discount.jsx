import { useForm } from "react-hook-form";
import { supabase } from "../../../services/supabase";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import { IoMdArrowBack } from "react-icons/io";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import EditDiscount from "./EditDiscount";

function Discount() {
  const [disocunts, setDisounts] = useState([]);
  const [createDiscount, setCreateDiscount] = useState(false);
  const [selectedDiscounts, setSelectedDiscounts] = useState([]);
  const [editDiscount, setEditDiscount] = useState(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const { data, error } = await supabase.from("coupons").select("*");
      if (error) console.log("Error fetching disocunts:", error);
      setDisounts(data);
    } catch (error) {
      console.log("Unexpected Error:", error);
    }
  };

  const handleDelete = async () => {
    if (selectedDiscounts.length === 0) return;

    if (
      !window.confirm("Are you sure you want to delete selected discount(s)?")
    )
      return;

    try {
      const { error } = await supabase
        .from("coupons")
        .delete()
        .in("id", selectedDiscounts);

      if (error) throw error;

      setSelectedDiscounts([]);
      fetchBlogs();
    } catch (error) {
      console.error("Error deleting discounts:", error);
    }
  };

  return (
    <div>
      {createDiscount ? (
        <DiscountForm setCreateDiscount={setCreateDiscount} />
      ) : editDiscount ? (
        <EditDiscount
          coupon={editDiscount}
          onClose={() => setEditDiscount(false)}
          onUpdate={fetchBlogs}
        />
      ) : (
        <div>
          <div className="border-b border-b-[#ccc]">
            <div className="flex justify-between items-center">
              <h2 className="p-2 font-semibold text-[#374A75] lg:text-2xl md:text-xl text-lg ">
                Discount
              </h2>
              <div className="px-2 py-2 flex gap-2">
                {selectedDiscounts.length > 0 && (
                  <button
                    onClick={handleDelete}
                    className="px-2 py-1 md:px-4 md:py-2 border border-[#CCCCCC] rounded-md text-[#374A75] text-lg font-medium hover:bg-[#f1f1f1]"
                  >
                    Delete ({selectedDiscounts.length})
                  </button>
                )}
                <button
                  onClick={() => setCreateDiscount((prev) => !prev)}
                  className="px-4 py-3 rounded-md bg-blue-600 text-white text-lg"
                >
                  Create Discount
                </button>
              </div>
            </div>
          </div>
          <div>
            {/* display data of the discount */}
            <CouponTable
              selectedDiscounts={selectedDiscounts}
              setSelectedDiscounts={setSelectedDiscounts}
              disocunts={disocunts}
              setEditDiscount={setEditDiscount}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Discount;

const CouponTable = ({
  selectedDiscounts,
  setSelectedDiscounts,
  disocunts,
  setEditDiscount,
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  const discountCouponPerPage = 10;

  const indexoflastDisocunt = currentPage * discountCouponPerPage;
  const indexofFirstDiscount = indexoflastDisocunt - discountCouponPerPage;
  const currentBlogs = disocunts.slice(
    indexofFirstDiscount,
    indexoflastDisocunt
  );

  const totalPages = Math.ceil(disocunts.length / discountCouponPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  //   {
  //     "id": "1adc1692-3f80-44d4-bd66-f91539dd5532",
  //     "created_at": "2025-06-23T12:23:42.825308+00:00",
  //     "couponName": "flat30",
  //     "expiryDate": "2025-11-30",
  //     "maxLimit": 50,
  //     "discountPerc": 30,
  //     "minAmount": 10000
  // }

  // const getStatusStyle = (status) => {
  //   switch (status) {
  //     case "Active":
  //       return "bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium";
  //     case "Schedule":
  //       return "bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-medium";
  //     case "Expired":
  //       return "bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-xs font-medium";
  //     default:
  //       return "";
  //   }
  // };

  const allSelected =
    currentBlogs.length > 0 && selectedDiscounts.length === currentBlogs.length;

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedDiscounts(currentBlogs.map((b) => b.id));
    } else {
      setSelectedDiscounts([]);
    }
  };

  const handleCheckboxChange = (blogId) => {
    setSelectedDiscounts((prev) =>
      prev.includes(blogId)
        ? prev.filter((id) => id !== blogId)
        : [...prev, blogId]
    );
  };

  return (
    <div className="p-4">
      <table className="w-full text-left">
        <thead className="text-[#232321]/80 font-semibold ">
          <tr className="border-b">
            <th className="py-2">
              <input
                type="checkbox"
                name=""
                id=""
                checked={allSelected}
                onChange={handleSelectAll}
              />
            </th>
            <th className="py-2">Title</th>
            <th className="py-2">Expiry</th>
            <th className="py-2">Discount Perc(%)</th>
            <th className="py-2">Min Amount</th>
          </tr>
        </thead>
        <tbody>
          {currentBlogs.map((disocunts) => (
            <tr
              key={disocunts.id}
              onClick={() => setEditDiscount(disocunts)}
              className="border-b text-xs md:text-sm text-[#000] font-semibold hover:bg-[#f1f1f1] cursor-pointer"
            >
              <td className="py-3.5">
                <input
                  type="checkbox"
                  name=""
                  id=""
                  onClick={(e) => e.stopPropagation()}
                  checked={selectedDiscounts.includes(disocunts.id)}
                  onChange={() => handleCheckboxChange(disocunts.id)}
                />
              </td>
              <td className="py-3.5">{disocunts?.couponName}</td>
              <td className="py-3.5">{disocunts?.expiryDate}</td>
              <td className="py-3.5">{disocunts?.discountPerc}</td>
              <td className="py-3.5">{disocunts?.minAmount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-4 gap-2 border px-7 py-1 rounded place-self-center">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 disabled:opacity-50 flex items-center gap-0.5 text-[#334A78]"
          >
            <MdKeyboardArrowLeft /> Prev
          </button>

          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={`px-3 py-1 rounded-sm  ${
                currentPage === index + 1
                  ? "bg-[#334A78] text-white"
                  : "text-[#334A78]"
              }`}
            >
              {index + 1}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 disabled:opacity-50 flex items-center gap-0.5 text-[#334A78]"
          >
            Next <MdKeyboardArrowRight />
          </button>
        </div>
      )}
    </div>
  );

  //   return (
  //     <>
  //       <div className=" w-full flex flex-col overflow-y-auto scrollbar-hide lg:custom-scrollbar h-[70vh] md:h-[60vh] lg:h-[calc(100vh-261px)] pb-2 px-3">
  //         <div className="hidden lg:block">
  //           <table className="min-w-full text-sm table-auto">
  //             {/* Table Header */}
  //             <thead className="hidden md:table-header-group text-left text-[#232321] text-opacity-80 border-b items-center bg-white sticky top-0 z-10">
  //               <tr>
  //                 <th className="px-4 py-2">Order ID</th>
  //                 <th className="px-4 py-2">Date</th>
  //                 <th className="px-4 py-2">Customer Name</th>
  //                 <th className="px-4 py-2">Status</th>
  //                 <th className="px-4 py-2">Payment</th>
  //                 <th className="px-4 py-2">Amount</th>
  //               </tr>
  //             </thead>

  //             <tbody>
  //               {paginatedOrders?.map((order) => {
  //                 // Status color constants
  //                 const statusColors = {
  //                   shipped: "bg-blue-600",
  //                   pending: "bg-red-500",
  //                   canceled: "bg-orange-500",
  //                   delivered: "bg-green-600",
  //                   approved: "bg-gray-500",
  //                 };

  //                 // Payment status and color constants
  //                 const paymentStatus =
  //                   order.paymentDetails?.state?.toLowerCase() || "unpaid";
  //                 const paymentColors = {
  //                   completed: "bg-blue-600",
  //                   failed: "bg-gray-500",
  //                   refund: "bg-purple-500",
  //                   paid: "bg-blue-600",
  //                   unpaid: "bg-gray-500",
  //                 };

  //                 return (
  //                   <tr
  //                     key={order.id}
  //                     className="border-b hover:bg-gray-100 hover:cursor-pointer"
  //                     onClick={() => setSelectedOrder(order)}
  //                   >
  //                     {/* Order ID */}
  //                     <td className="px-4 py-2" title={order.id}>
  //                       #{order.id.slice(0, 6)}
  //                     </td>
  //                     {/* Date */}
  //                     <td className="px-4 py-2">
  //                       {new Date(order.created_at).toLocaleDateString("en-US", {
  //                         month: "short",
  //                         day: "numeric",
  //                         year: "numeric",
  //                       })}
  //                     </td>
  //                     {/* Customer Name */}
  //                     <td className="px-4 py-2 capitalize">
  //                       {order.shippingAddress?.[0]?.name || "N/A"}
  //                     </td>
  //                     {/* Status */}
  //                     <td className="px-4 py-2">
  //                       <div className="flex items-center gap-2 capitalize">
  //                         <span
  //                           className={`w-2 h-2 rounded-full ${
  //                             statusColors[order.status?.toLowerCase()] ||
  //                             "bg-gray-400"
  //                           }`}
  //                         ></span>
  //                         {order.status}
  //                       </div>
  //                     </td>
  //                     {/* Payment */}
  //                     <td className="px-4 py-2">
  //                       <div className="flex items-center gap-2 capitalize">
  //                         <span
  //                           className={`w-2 h-2 rounded-full ${
  //                             paymentColors[paymentStatus] || "bg-gray-400"
  //                           }`}
  //                         ></span>
  //                         {paymentStatus === "completed" ||
  //                         paymentStatus === "paid"
  //                           ? "Paid"
  //                           : paymentStatus.charAt(0).toUpperCase() +
  //                             paymentStatus.slice(1)}
  //                       </div>
  //                     </td>
  //                     {/* Amount */}
  //                     <td className="px-4 py-2">₹{order.finalPrice}</td>
  //                   </tr>
  //                 );
  //               })}
  //             </tbody>
  //           </table>
  //         </div>
  //         <div className="lg:hidden">
  //           {paginatedOrders?.map((order) => (
  //             <MobileOrderCard
  //               key={order.id}
  //               order={order}
  //               setSelectedOrder={setSelectedOrder}
  //             />
  //           ))}
  //         </div>
  //       </div>

  //       <div>
  //         {totalPages > 1 && (
  //           <div className="flex justify-center items-center gap-2 my-2 sticky bottom-0 z-30 text-[#3d194f] bg-white">
  //             <div className="flex border border-[#CCCCCC] rounded-lg px-3 py-2">
  //               {/* Previous */}
  //               <button
  //                 onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
  //                 disabled={currentPage === 1}
  //                 className="flex items-center gap-2 px-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
  //               >
  //                 <img
  //                   src="../images/icons/less.png"
  //                   alt="Previous"
  //                   className="w-4 h-4"
  //                 />
  //                 <span className="text-[#194F48]">Previous</span>
  //               </button>

  //               {/* Page Numbers */}
  //               {(() => {
  //                 const pages = [];
  //                 let lastShownPage = 0;
  //                 for (let i = 1; i <= totalPages; i++) {
  //                   if (
  //                     i === 1 ||
  //                     i === totalPages ||
  //                     (i >= currentPage - 1 && i <= currentPage + 1)
  //                   ) {
  //                     pages.push(
  //                       <button
  //                         key={i}
  //                         onClick={() => setCurrentPage(i)}
  //                         className={`px-3 py-1 text-sm rounded text-[#334A78] ${
  //                           currentPage === i
  //                             ? "text-white bg-[#334A78]"
  //                             : "hover:bg-[#F1F1F1]"
  //                         }`}
  //                       >
  //                         {i}
  //                       </button>
  //                     );
  //                     lastShownPage = i;
  //                   } else if (i > lastShownPage + 1) {
  //                     pages.push(
  //                       <span key={`ellipsis-${i}`} className="px-2 py-1 text-sm">
  //                         ...
  //                       </span>
  //                     );
  //                     lastShownPage = i;
  //                   }
  //                 }
  //                 return pages;
  //               })()}

  //               {/* Next */}
  //               <button
  //                 onClick={() =>
  //                   setCurrentPage((prev) => Math.min(prev + 1, totalPages))
  //                 }
  //                 disabled={currentPage === totalPages}
  //                 className="flex items-center gap-2 px-2 text-sm disabled:opacity-50 default:cursor-not-allowed"
  //               >
  //                 <span className="text-[#194F48]">Next</span>
  //                 <img
  //                   src="../images/icons/more.png"
  //                   alt="Next"
  //                   className="w-4 h-4"
  //                 />
  //               </button>
  //             </div>
  //           </div>
  //         )}
  //       </div>
  //     </>
  //   );

  //   return (
  //     <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-100">
  //       <table className="table-auto w-full text-left">
  //         <thead className="text-gray-600 text-sm border-b">
  //           <tr className="bg-gray-50">
  //             <th className="py-3 px-4 font-medium">
  //               <input type="checkbox" className="accent-blue-500" />
  //             </th>
  //             <th className="py-3 px-4 font-semibold">Code</th>
  //             <th className="py-3 px-4 font-semibold">Discount value</th>
  //             <th className="py-3 px-4 font-semibold">Purchase amount</th>
  //             <th className="py-3 px-4 font-semibold">Status</th>
  //             <th className="py-3 px-4 font-semibold">Used</th>
  //           </tr>
  //         </thead>

  //         <tbody className="text-gray-700 text-sm">
  //           {coupons.map((coupon, i) => (
  //             <tr
  //               key={i}
  //               className="border-b hover:bg-gray-50 transition-colors duration-200"
  //             >
  //               <td className="py-3 px-4">
  //                 <input type="checkbox" className="accent-blue-500" />
  //               </td>
  //               <td className="py-3 px-4 font-medium">{coupon.code}</td>
  //               <td className="py-3 px-4">{coupon.discount}</td>
  //               <td className="py-3 px-4">{coupon.amount}</td>
  //               <td className="py-3 px-4">
  //                 <span className={getStatusStyle(coupon.status)}>
  //                   {coupon.status}
  //                 </span>
  //               </td>
  //               <td className="py-3 px-4">{coupon.used}</td>
  //             </tr>
  //           ))}
  //         </tbody>
  //       </table>

  //       {/* Pagination */}
  //       <div className="flex justify-between items-center p-4 border-t text-sm text-gray-600">
  //         <div>
  //           <button className="px-3 py-1 border rounded-l-md hover:bg-gray-100">
  //             ‹ Previous
  //           </button>
  //           <button className="px-3 py-1 border-t border-b hover:bg-gray-100">
  //             1
  //           </button>
  //           <button className="px-3 py-1 border-t border-b hover:bg-gray-100">
  //             2
  //           </button>
  //           <button className="px-3 py-1 border-t border-b bg-blue-600 text-white">
  //             3
  //           </button>
  //           <button className="px-3 py-1 border-t border-b hover:bg-gray-100">
  //             4
  //           </button>
  //           <button className="px-3 py-1 border rounded-r-md hover:bg-gray-100">
  //             Next ›
  //           </button>
  //         </div>
  //       </div>
  //     </div>
  //   );
};

function DiscountForm({ setCreateDiscount }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  async function handleDiscountSubmit(formData) {
    try {
      // insert the data into the db

      const { data, error } = await supabase
        .from("coupons")
        .insert([
          {
            couponName: formData?.couponName,
            expiryDate: formData?.expiryDate,
            minAmount: formData?.minAmount,
            maxLimit: formData?.maxLimit,
            discountPerc: formData?.discountPerc,
          },
        ])
        .select();

      if (error) {
        throw error;
      }

      // if inserted successfuly clear the form
      if (data) {
        reset();
        toast.success("coupon created successfully");
        console.log("data", data);
      }
    } catch (error) {
      console.log("error", error);

      if (error.code === "23505") {
        toast.error(`coupon with name  ${formData?.couponName}  already exist`);
      }
    }
  }
  return (
    <div className="font-Poppins overflow-auto">
      <form
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
          }
        }}
        onSubmit={handleSubmit(handleDiscountSubmit)}
      >
        <div className="border-b border-b-[#ccc]">
          <h2 className="p-2 font-semibold text-[#374A75] lg:text-2xl md:text-xl text-lg flex items-center gap-3">
            <button onClick={() => setCreateDiscount((prev) => !prev)}>
              <IoMdArrowBack size={25} />
            </button>{" "}
            Create discount
          </h2>
        </div>
        <div className="border border-[#ccc] rounded-md m-3 space-y-9">
          <div className="flex flex-col p-3 space-y-3">
            <label className="font-medium text-lg lg:text-xl text-[#000]">
              Discount code
            </label>
            <input
              {...register("couponName", {
                required: true,
                maxLength: { value: 10, message: "max 10 character " },
              })}
              placeholder="test10"
              type="text"
              required
              className="p-1 border-2 border-[#ccc]"
            />
            {errors?.couponName && (
              <p className="text-red-800 text-sm capitalize">
                {errors?.couponName?.message}
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-col md:flex-row border border-[#ccc] rounded-md m-3 ">
          <div className="flex-1 flex flex-col p-3 space-y-3">
            <label className="font-medium text-xl text-[#000]">
              Discount value(In percentage)
            </label>
            <input
              type="number"
              placeholder="discount percentage"
              {...register("discountPerc", {
                required: true,
                maxLength: {
                  value: 2,
                  message: "percentage should be less than 100",
                },
                min: { value: 1, message: "value should be greater than 0" },
              })}
              required
              className="p-1 border-2 border-[#ccc] "
            />
            {errors?.discountPerc && (
              <p className="text-red-800 text-sm capitalize">
                {errors?.discountPerc?.message}
              </p>
            )}
          </div>
          <div className="flex-1 flex flex-col p-3 space-y-3">
            <label className="font-medium text-xl text-[#000]">
              Minimum Purchase Amount
            </label>
            <input
              type="number"
              placeholder="Rs 999"
              required
              {...register("minAmount", {
                required: true,
                min: { value: 100, message: "min amount should be 100" },
              })}
              className="p-1 border-2 border-[#ccc] rounded-md"
            />
            {errors?.minAmount && (
              <p className="text-red-800 text-sm capitalize">
                {errors?.minAmount?.message}
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-col md:flex-row border border-[#ccc] rounded-md m-3 ">
          <div className="flex-1 flex flex-col p-3 space-y-3">
            <label className="font-medium text-xl text-[#000]">
              Expiry Date
            </label>
            <input
              type="date"
              min={new Date().toISOString().split("T")[0]}
              {...register("expiryDate", {
                required: true,
              })}
              className="p-1 border-2 border-[#ccc] "
              required
            />
            {errors?.expiryDate && (
              <p className="text-red-800 text-sm capitalize">
                {errors?.expiryDate?.message}
              </p>
            )}
          </div>
          <div className="flex-1 flex flex-col p-3 space-y-3">
            <label className="font-medium text-xl text-[#000]">Max Limit</label>
            <input
              type="number"
              {...register("maxLimit", {
                required: true,
                min: { value: 1, message: "value should be greater than 0" },
              })}
              className="p-1 border-2 border-[#ccc] rounded-md"
              required
              placeholder="20"
            />
            {errors?.maxLimit && (
              <p className="text-red-800 text-sm capitalize">
                {errors?.maxLimit?.message}
              </p>
            )}
          </div>
        </div>
        <div className="flex justify-end space-x-6 m-3">
          <button
            className="border border-[#ccc] px-5 py-3 text-[#111] rounded-lg "
            type="reset"
            onClick={reset}
          >
            Discard
          </button>
          <button
            className="border border-[#ccc] px-5 py-3 text-[#fff] bg-[#374A75] rounded-lg "
            type="submit"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
