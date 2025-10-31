import React, { useState, useEffect } from "react";
import { supabase } from "../../services/supabase";
import { baseImageUrl } from "../../utils/HelperConstant";

export default function Orders({ vendorId = null }) {
  const [ordersData, setOrdersData] = React.useState(null);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [itemsPerPage, setItemsPerPage] = React.useState(15);
  const totalPages = Math.ceil(ordersData?.length / itemsPerPage);
  const [selectedOrder, setSelectedOrder] = React.useState(null);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [filterDropdown, setFilterDropdown] = useState(false);
  const [orderStatusFilter, setOrderStatusFilter] = useState("");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("");
  const [filteredOrders, setFilteredOrders] = useState([]);

  const paginatedOrders = filteredOrders?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  React.useEffect(() => {
    const fetchOrders = async () => {
      setLoadingOrders(true);
      const { data: orders, error } = await supabase
        .from("orders")
        .select(`*, users_profiles(*)`)
        .order("created_at", { ascending: false });
      if (error) {
        console.error(error);
        return;
      }

      // ✅ Filter by vendorId if provided
      const filteredOrders = vendorId
        ? orders.filter(
            (order) =>
              Array.isArray(order.products) &&
              order.products.some((product) => product.vendorId === vendorId)
          )
        : orders;

      const ordersWithVariants = await Promise.all(
        filteredOrders.map(async (order) => {
          const productVariantMap = {};

          if (order.products?.length) {
            for (const product of order.products) {
              const productId = product.id;
              if (productId) {
                const { data: variants, error: variantsError } = await supabase
                  .from("product_variants")
                  .select("*")
                  .eq("id", productId);

                if (variantsError) {
                  console.error(variantsError);
                  productVariantMap[productId] = [];
                } else {
                  productVariantMap[productId] = variants;
                }
              }
            }
          }

          return {
            ...order,
            product_variants_map: productVariantMap, // Map from productId to variants array
          };
        })
      );

      setOrdersData(ordersWithVariants);
      setLoadingOrders(false);
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    if (ordersData?.length > 0) {
      setFilteredOrders(ordersData);
    }
  }, [ordersData]);

  // const filterOrders = (type, value = "") => {
  //   console.log(type, value);

  //   if (type === "orderStatus") {
  //     const filteredOrders = ordersData.filter(
  //       (order) => order?.status === value
  //     );
  //     setFilteredOrders(filteredOrders);
  //   } else if (type === "paymentStatus") {
  //     const filteredOrders = ordersData.filter(
  //       (order) => order?.paymentDetails?.state?.toLowerCase() === value
  //     );
  //     setFilteredOrders(filteredOrders);
  //   }
  //   console.log(ordersData);
  // };

  const filterOrders = (type, value) => {
    if (type === "orderStatus") {
      setOrderStatusFilter(value);
    } else if (type === "paymentStatus") {
      setPaymentStatusFilter(value);
    }

    const filtered = ordersData.filter((order) => {
      const matchOrderStatus = (
        type === "orderStatus" ? value : orderStatusFilter
      )
        ? order.status === (type === "orderStatus" ? value : orderStatusFilter)
        : true;

      const paymentState =
        order.paymentDetails?.state?.toLowerCase() || "unpaid";
      const matchPaymentStatus = (
        type === "paymentStatus" ? value : paymentStatusFilter
      )
        ? (type === "paymentStatus" ? value : paymentStatusFilter) ===
          (paymentState === "completed" ? "completed" : "unpaid")
        : true;

      return matchOrderStatus && matchPaymentStatus;
    });

    setFilteredOrders(filtered);
  };
  console.log(filteredOrders);

  return (
    <section className="flex flex-col h-full min-h-0 lg:border-2 lg:border-[#334A78] lg:rounded-lg bg-white">
      {!selectedOrder && loadingOrders ? (
        <div className="flex flex-col items-center justify-center h-full">
          <p className="text-xl font-bold text-[#ccc]">Hold On...</p>
          <p className="text-xl font-bold text-[#ccc]">Fetching orders !!</p>
        </div>
      ) : selectedOrder ? (
        <OrderDetails
          order={selectedOrder}
          onBack={() => setSelectedOrder(null)}
          vendorId={vendorId}
        />
      ) : (
        <section className="lg:rounded-lg font-Poppins overflow-hidden">
          {/* Header Section */}
          <div className="sticky top-0 bg-white z-20">
            <div className="flex justify-between items-center pr-4 py-2 border-b-2 border-b-[#CCCCCC]">
              <h2 className="text-xl text-[#374A75] font-semibold px-4 py-2">
                Orders List
              </h2>
              <div className="relative ">
                <button
                  onClick={() => setFilterDropdown(!filterDropdown)}
                  className="px-4 py-2 rounded text-[#374A75] text-sm flex items-center gap-3 border border-[#CCCCCC]"
                >
                  <img src="/images/icons/filter-icon.png" alt="" />
                  <span className="md:block hidden">Filter</span>
                </button>
                {filterDropdown && (
                  <div className="absolute right-0 bg-[#fff] p-2 text-nowrap border">
                    <p className="capitalize text-sm text-[#374A75]">
                      order status
                    </p>
                    <hr />
                    <select
                      name="orderStatus"
                      id="orderStatus"
                      className="mb-2 text-xs focus:outline-none w-full"
                      value={orderStatusFilter}
                      onChange={(e) => {
                        const value = e.target.value;
                        setOrderStatusFilter(value);
                        filterOrders("orderStatus", value);
                      }}
                    >
                      <option value="">All</option>
                      <option value="approved">Approved</option>
                      <option value="pending">Pending</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="failed">Failed</option>
                    </select>
                    <hr />
                    <p className="capitalize text-sm text-[#374A75]">
                      payment status
                    </p>
                    <select
                      name="paymentStatus"
                      id="paymentStatus"
                      className="text-xs focus:outline-none w-full"
                      value={paymentStatusFilter}
                      onChange={(e) => {
                        const value = e.target.value;
                        setPaymentStatusFilter(value);
                        filterOrders("paymentStatus", value);
                      }}
                    >
                      <option value="">All</option>
                      <option value="completed">Paid</option>
                      <option value="unpaid">Unpaid</option>
                    </select>
                  </div>
                )}
              </div>
            </div>
            <div className="md:px-2 hidden md:block">
              <div className="py-2 px-2 border-b border-[#232321] border-opacity-20">
                <h2 className="text-xl font-semibold">Recent Purchases</h2>
              </div>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className=" w-full flex flex-col overflow-y-auto scrollbar-hide lg:custom-scrollbar h-[70vh] md:h-[60vh] lg:h-[calc(100vh-261px)] pb-2 px-3">
            <div className="hidden lg:block">
              <table className="min-w-full text-sm table-auto">
                {/* Table Header */}
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
                      order.paymentDetails?.state?.toLowerCase() || "unpaid";
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
                        onClick={() => setSelectedOrder(order)}
                      >
                        {/* Order ID */}
                        <td className="px-4 py-2" title={order.id}>
                          #{order.id.slice(0, 6)}
                        </td>
                        {/* Date */}
                        <td className="px-4 py-2">
                          {new Date(order.created_at).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}
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
                            {paymentStatus === "completed" ||
                            paymentStatus === "paid"
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
            <div className="lg:hidden">
              {paginatedOrders?.map((order) => (
                <MobileOrderCard
                  key={order.id}
                  order={order}
                  setSelectedOrder={setSelectedOrder}
                />
              ))}
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 my-2 sticky bottom-0 z-30 text-[#3d194f] bg-white">
              <div className="flex border border-[#CCCCCC] rounded-lg px-3 py-2">
                {/* Previous */}
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
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
                        <span
                          key={`ellipsis-${i}`}
                          className="px-2 py-1 text-sm"
                        >
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
        </section>
      )}
    </section>
  );
}

function OrderDetails({ order, onBack, vendorId = null }) {
  console.log(order);

  const subtotal =
    order.products?.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    ) || 0;

  const tax = subtotal * 0.2; // 20% tax
  const discount = order.coupon?.discount || 0; // Use actual discount if available in order
  const shipping = order.shippingRate || 0; // Use actual shipping rate if available
  const total = subtotal + tax - discount + shipping;

  return (
    <section className="flex flex-col min-h-0 lg:rounded-lg font-Poppins">
      <button
        onClick={onBack}
        className="text-[#555555] text-left py-1 md:py-2 px-2 lg:px-6 text-xs group"
      >
        &lt; <span className="group-hover:underline">Back to Order List</span>
      </button>
      <div className="flex justify-between items-center pr-5 pb-2 border-b">
        <h2 className="text-xl md:text-2xl font-semibold px-2 lg:px-6 text-[#374A75]">
          Order Details
        </h2>
        <div className="flex gap-2 items-center rounded-md border p-2 text-[#374A75] text-sm md:text-xl bg-[#F9F9F9]">
          <img src="/images/icons/export.png" alt="" />
          Export
        </div>
      </div>

      {/* Scrollable content wrapper */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-3 pb-2">
        {/* Order ID */}
        <div className="py-4 font-semibold flex flex-col-reverse md:flex-row gap-2 md:mt-4">
          <p className="text-base md:text-xl">Orders ID: #{order.id}</p>
          <p className="capitalize bg-[#FF782F] bg-opacity-80 text-[10px] p-1 md:p-2 rounded-lg md:text-xs text-center">
            {order.status}
          </p>
          {/* <div className="flex gap-2 items-center rounded-md absolute right-0 border p-2 text-[#374A75] text-xl bg-[#F9F9F9]">
            <img src="/images/icons/export.png" alt="" />
            Export
          </div> */}
        </div>

        {/* Section 1 */}
        {/* <div className="py-4 flex gap-4"> */}
        <div className="py-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Customer */}
          <div className="border p-4 rounded-2xl flex flex-col gap-3">
            <div className="flex gap-3">
              <img
                src="/images/profile3.png"
                alt="Profile"
                className="w-10 h-10"
              />
              <div>
                <h2 className="text-lg md:text-xl font-semibold text-[#232321]">
                  Customer
                </h2>
                <p className="text-sm md:text-base font-semibold capitalize text-[#70706E] mt-2">
                  Company Name: {order.users_profiles?.company_name || "N/A"}
                </p>
                <p className="text-sm md:text-base font-semibold text-[#70706E]">
                  Email: {order.users_profiles?.email || "N/A"}
                </p>
                <p className="text-sm md:text-base font-semibold capitalize text-[#70706E]">
                  Phone: {order.users_profiles?.phone || "N/A"}
                </p>
              </div>
            </div>
            <button className=" bg-[#003F62] hover:bg-[#4C69A4] text-white w-full rounded-lg py-1 mt-auto text-sm md:text-base">
              View Profile
            </button>
          </div>
          {/* Order Info */}
          <div className="border p-4 rounded-2xl flex flex-col gap-3">
            <div className="flex gap-3">
              <img
                src="/images/profile3.png"
                alt="Profile"
                className="w-10 h-10"
              />
              <div>
                <h2 className="text-lg md:text-xl font-semibold text-[#232321]">
                  Order Info
                </h2>
                <p className="text-sm md:text-base font-semibold capitalize text-[#70706E] mt-2">
                  payment mode: {order?.paymentDetails?.paymentMode || "N/A"}
                </p>
                <p className="text-sm md:text-base font-semibold capitalize text-[#70706E]">
                  status: {order.paymentDetails?.state || "N/A"}
                </p>
                {!vendorId && (
                  <p className="text-sm md:text-base font-semibold capitalize text-[#70706E]">
                    transaction id:{" "}
                    {order.paymentDetails?.transactionId || "N/A"}
                  </p>
                )}
                <p className="text-sm md:text-base font-semibold capitalize text-[#70706E]">
                  date:{" "}
                  {order.created_at
                    ? new Date(order.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "N/A"}
                </p>
              </div>
            </div>
            <button className="bg-[#003F62] hover:bg-[#4C69A4] text-white w-full rounded-lg py-1 mt-auto text-sm md:text-base">
              Download info
            </button>
          </div>
          {/* Deliver to */}
          <div className="border p-4 rounded-2xl flex flex-col gap-3">
            <div className="flex gap-3">
              <img
                src="/images/profile3.png"
                alt="Profile"
                className="w-10 h-10"
              />
              <div>
                <h2 className="text-lg md:text-xl font-semibold text-[#232321]">
                  Deliver to
                </h2>
                <p className="text-sm md:text-base font-semibold capitalize text-[#70706E] mt-2">
                  Address: {order.shippingAddress?.[0]?.address}
                </p>
              </div>
            </div>
            <button className="bg-[#003F62] hover:bg-[#4C69A4] text-white w-full rounded-lg py-1 mt-auto text-sm md:text-base">
              View Profile
            </button>
          </div>
        </div>

        {/* Section 3 */}
        <div className="py-2 ">
          <h3 className="text-lg font-semibold mb-2">Products</h3>
          <div className="bg-white rounded-lg shadow-xs">
            <table className="w-full min-w-full border-separate border-spacing-0 hidden md:inline-table">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-[17px] text-gray-500 font-semibold text-left py-3 px-2">
                    Product Name
                  </th>
                  <th className="text-[15px] text-gray-500 font-semibold text-left py-3">
                    Product ID
                  </th>
                  <th className="text-[15px] text-gray-500 font-semibold text-left py-3">
                    Quantity
                  </th>
                  <th className="text-[15px] text-gray-500 font-semibold text-right py-3 pr-6">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {order.products?.map((orderItem, idx) => {
                  // Get variants array for this product, using orderItem.id
                  const variants =
                    order.product_variants_map?.[orderItem.id] || [];
                  // Safely get first variant object, or fallback if variants are empty
                  const variant = variants[0] || {};

                  // Get name and image from the variant data
                  const productName = variant.title || "?";
                  const productImage = variant.image || ""; // Adjust this key to your variant schema

                  const quantity = orderItem.quantity;
                  const price = orderItem.price;
                  const id = orderItem.id;
                  const total = (price * quantity).toFixed(2);

                  return (
                    <tr
                      key={id}
                      className="border-b border-gray-200 hover:bg-gray-50"
                    >
                      <td className="flex items-center gap-3 py-3 px-3">
                        {productImage ? (
                          <img
                            src={`${baseImageUrl}${productImage}`}
                            alt={productName}
                            className="w-8 h-8 rounded-md object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 bg-gray-300 rounded-md" />
                        )}
                        <span className="font-semibold text-base text-black ml-2">
                          {productName}
                        </span>
                      </td>
                      <td
                        className="py-3 text-[15px] font-semibold text-[#232321]"
                        title={`#${id}`} // Tooltip with full id on hover
                      >
                        #{id.slice(0, 6)}
                      </td>
                      <td className="py-3 text-[15px] font-semibold text-[#232321]">
                        {quantity}
                      </td>
                      <td className="py-3 text-[15px] font-semibold text-right pr-6">
                        ₹{total}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div className="md:hidden">
              {/* {order.product_variants_map.map((product) => (
              <MobileOrderItem key={product.id} product={product} />
            ))} */}
              {order?.products?.map((product) => {
                const variantDetails =
                  order?.product_variants_map?.[product.id]?.[0];
                return (
                  <MobileOrderItem
                    key={product.id}
                    product={product}
                    variant={variantDetails}
                  />
                );
              })}
            </div>
            {/* Summary section */}
            {!vendorId && (
              <div className="flex flex-col items-end mt-5 md:mr-4">
                <div className="text-sm md:text-base flex flex-col gap-1 w-52">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Subtotal</span>
                    <span className="text-[#232321] font-semibold">
                      ₹{subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">GST</span>
                    <span className="text-[#232321] font-semibold">
                      ₹{tax.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Discount</span>
                    <span className="text-[#232321] font-semibold">
                      ₹{discount.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Shipping Rate</span>
                    <span className="text-[#232321] font-semibold">
                      ₹{shipping.toFixed(2)}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center mt-2 w-52">
                  <span className="text-base md:text-xl font-bold">Total</span>
                  <span className="text-lg md:text-2xl font-extrabold">
                    ₹{total.toFixed(2)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function MobileOrderCard({ order, setSelectedOrder }) {
  return (
    <div
      onClick={() => setSelectedOrder(order)}
      className="my-4 py-2 border-b-2 font-Poppins font-semibold"
    >
      <div className="flex justify-between text-sm">
        <p className="text-[#000]">order id #{order.id.split("-")[0]}</p>
        <p className="text-[#727271]/80">
          {new Date(order.created_at).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      </div>
      <div className="flex justify-between text-sm text-[#000] my-2">
        <p>{order.users_profiles?.company_name}</p>
        <p>
          {order.finalPrice.toLocaleString("en-IN", {
            style: "currency",
            currency: "INR",
          })}
        </p>
      </div>
      <div className="flex gap-3 text-xs capitalize">
        <p className="text-[#374A75] border border-[#E7EEF4] p-1 bg-[#E7EEF4] rounded-sm">
          {order.status}
        </p>
        <p className="p-1 text-[#374A75] border border-[#374A75]/80">
          {order.paymentDetails?.state || "N/A"}
        </p>
      </div>
    </div>
  );
}

function MobileOrderItem({ product, variant }) {
  console.log(product, variant);

  return (
    <div className="font-Poppins border-b my-2">
      <div className="flex gap-4">
        <img
          src={`${baseImageUrl}${variant.image}`}
          alt=""
          className="h-16 w-16 border"
        />
        <h3 className="font-semibold text-sm line-clamp-1">{variant.title}</h3>
      </div>
      <div className="flex justify-between text-sm font-semibold text-[#232321]/80 capitalize">
        <p>qunatity</p>
        <p className="p-2 border rounded-sm">{product.quantity}</p>
      </div>
      <div className="flex justify-between text-sm font-semibold text-[#232321]/80 capitalize">
        <p>total</p>
        <p>
          {product.price.toLocaleString("en-IN", {
            style: "currency",
            currency: "INR",
          })}
        </p>
      </div>
    </div>
  );
}
