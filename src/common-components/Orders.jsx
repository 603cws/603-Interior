import React from "react";
import { supabase } from "../services/supabase";
export default function Orders() {
  const [ordersData, setOrdersData] = React.useState(null);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [itemsPerPage, setItemsPerPage] = React.useState(15);
  const totalPages = Math.ceil(ordersData?.length / itemsPerPage);

  const paginatedOrders = ordersData?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  React.useEffect(() => {
    const fetchOrders = async () => {
      const { data: orders, error } = await supabase.from("orders").select("*");
      if (error) {
        console.error(error);
        return;
      }

      setOrdersData(orders);
    };

    fetchOrders();
  }, []);

  return (
    <div className="flex flex-col h-full min-h-0 lg:border-2 lg:border-[#334A78] lg:rounded-lg bg-white font-Poppins">
      {/* Header Section */}
      <div className="sticky top-0 bg-white z-20">
        <div className="flex justify-between items-center pr-4 py-2 border-b-2 border-b-[#CCCCCC]">
          <h2 className="text-xl text-[#374A75] font-semibold px-4 py-2">
            Orders List
          </h2>
          <button className="px-4 py-2 rounded text-[#374A75] text-sm flex items-center gap-3 border border-[#CCCCCC]">
            <img src="/images/icons/filter-icon.png" alt="" />
            <span className="md:block hidden">Filter</span>
          </button>
        </div>
        <div className="md:px-2 hidden md:block">
          <div className="py-2 px-2 border-b border-[#232321] border-opacity-20">
            <h2 className="text-xl font-semibold">Recent Purchases</h2>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto flex-1 custom-scrollbar relative px-2">
        <table className="min-w-full text-sm table-auto">
          {/* Table Header: Visible above md */}
          <thead className="hidden md:table-header-group text-left text-[#232321] text-opacity-80 border-b items-center bg-white sticky top-0 z-10">
            <tr>
              <th className="px-4 py-2">Order ID</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Customer Name</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Payment</th>
              <th className="px-4 py-2">Amount</th>
            </tr>
          </thead>

          <tbody>
            {paginatedOrders?.map((order) => {
              // Status color constants
              const statusColors = {
                shipped: "bg-blue-600",
                pending: "bg-red-500",
                canceled: "bg-orange-500",
                delivered: "bg-green-600",
                approved: "bg-gray-500",
              };

              // Payment status and color constants
              const paymentStatus =
                order.paymentDetails?.paymentStatus?.toLowerCase() || "unpaid";
              const paymentColors = {
                completed: "bg-blue-600",
                failed: "bg-gray-500",
                refund: "bg-purple-500",
                paid: "bg-blue-600",
                unpaid: "bg-gray-500",
              };

              return (
                <tr
                  key={order.id}
                  className="border-b hover:bg-gray-100 hover:cursor-pointer"
                >
                  {/* Order ID */}
                  <td className="px-4 py-2">#{order.id.slice(0, 6)}</td>
                  {/* Date */}
                  <td className="px-4 py-2">
                    {new Date(order.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                  {/* Customer Name */}
                  <td className="px-4 py-2 capitalize">
                    {order.shippingAddress?.[0]?.name || "N/A"}
                  </td>
                  {/* Status */}
                  <td className="px-4 py-2">
                    <div className="flex items-center gap-2 capitalize">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          statusColors[order.status?.toLowerCase()] ||
                          "bg-gray-400"
                        }`}
                      ></span>
                      {order.status}
                    </div>
                  </td>
                  {/* Payment */}
                  <td className="px-4 py-2">
                    <div className="flex items-center gap-2 capitalize">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          paymentColors[paymentStatus] || "bg-gray-400"
                        }`}
                      ></span>
                      {paymentStatus === "completed" || paymentStatus === "paid"
                        ? "Paid"
                        : paymentStatus.charAt(0).toUpperCase() +
                          paymentStatus.slice(1)}
                    </div>
                  </td>
                  {/* Amount */}
                  <td className="px-4 py-2">₹{order.finalPrice}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 my-2 sticky bottom-0 z-30 text-[#3d194f] bg-white">
          <div className="flex border border-[#CCCCCC] rounded-lg px-3 py-2">
            {/* Previous */}
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-2 px-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <img
                src="../images/icons/less.png"
                alt="Previous"
                className="w-4 h-4"
              />
              <span className="text-[#194F48]">Previous</span>
            </button>

            {/* Page Numbers */}
            {(() => {
              const pages = [];
              let lastShownPage = 0;
              for (let i = 1; i <= totalPages; i++) {
                if (
                  i === 1 ||
                  i === totalPages ||
                  (i >= currentPage - 1 && i <= currentPage + 1)
                ) {
                  pages.push(
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i)}
                      className={`px-3 py-1 text-sm rounded text-[#334A78] ${
                        currentPage === i
                          ? "text-white bg-[#334A78]"
                          : "hover:bg-[#F1F1F1]"
                      }`}
                    >
                      {i}
                    </button>
                  );
                  lastShownPage = i;
                } else if (i > lastShownPage + 1) {
                  pages.push(
                    <span key={`ellipsis-${i}`} className="px-2 py-1 text-sm">
                      ...
                    </span>
                  );
                  lastShownPage = i;
                }
              }
              return pages;
            })()}

            {/* Next */}
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="flex items-center gap-2 px-2 text-sm disabled:opacity-50 default:cursor-not-allowed"
            >
              <span className="text-[#194F48]">Next</span>
              <img
                src="../images/icons/more.png"
                alt="Next"
                className="w-4 h-4"
              />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
