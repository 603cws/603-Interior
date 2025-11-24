import { useState, useEffect, useRef } from "react";
import { supabase } from "../../services/supabase";
import { baseImageUrl } from "../../utils/HelperConstant";
import { exportToExcel } from "../../utils/DataExport";
import PagInationNav from "../../common-components/PagInationNav";

export default function Orders({ vendorId = null }) {
  const [ordersData, setOrdersData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const totalPages = Math.ceil(ordersData?.length / itemsPerPage);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [filterDropdown, setFilterDropdown] = useState(false);
  const [orderStatusFilter, setOrderStatusFilter] = useState("");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("");
  const [filteredOrders, setFilteredOrders] = useState([]);
  const dropdownRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");

  const paginatedOrders = filteredOrders?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    const fetchOrders = async () => {
      setLoadingOrders(true);
      const { data: orders, error } = await supabase
        .from("orders_table")
        .select(`*,users_profiles(*),order_items(*,product_variants(*))`)
        .order("created_at", { ascending: false });
      if (error) {
        console.error(error);
        return;
      }

      // Filter by vendorId if provided
      const filteredOrders = vendorId
        ? orders.filter(
            (order) =>
              Array.isArray(order.order_items) &&
              order.order_items.some(
                (item) => item.product_variants?.vendor_id === vendorId
              )
          )
        : orders;
      console.log(filteredOrders);

      setOrdersData(filteredOrders);
      setLoadingOrders(false);
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    if (ordersData?.length > 0) {
      setFilteredOrders(ordersData);
    }
  }, [ordersData]);

  useEffect(() => {
    if (!filterDropdown) return;

    const onDocClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setFilterDropdown(false);
      }
    };

    const onKey = (e) => {
      if (e.key === "Escape") setFilterDropdown(false);
    };

    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("touchstart", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("touchstart", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [filterDropdown]);

  useEffect(() => {
    const id = setTimeout(() => {
      const q = (searchQuery || "").trim().toLowerCase();
      if (!q) {
        setFilteredOrders(ordersData);
        setCurrentPage(1);
        return;
      }

      const words = q.split(/\s+/); // split into words

      const result = (ordersData || []).filter((order) => {
        const idStr = (order.id || "").toLowerCase();
        const nameStr = (order.shipping_address?.[0]?.name || "").toLowerCase();

        const hay = `${idStr} ${nameStr}`; // search across both fields

        // true only if ALL words are present somewhere in the haystack
        return words.every((w) => hay.includes(w));
      });

      setFilteredOrders(result);
      setCurrentPage(1);
    }, 200); // 200ms debounce

    return () => clearTimeout(id);
  }, [searchQuery, ordersData]);

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
              <div className="flex items-center gap-3">
                <div className="relative">
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by order id or name..."
                    className="px-3 py-2 pr-6 border border-[#CCCCCC] rounded text-sm w-60 focus:outline-none"
                  />
                  {/* optional clear button */}
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-1 top-1/2 -translate-y-1/2 text-md px-2 py-1 hover:text-red-500"
                      aria-label="clear search"
                      title="Clear Search"
                    >
                      ×
                    </button>
                  )}
                </div>
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setFilterDropdown(!filterDropdown)}
                    className="px-4 py-2 rounded text-[#374A75] text-sm flex items-center gap-3 border border-[#CCCCCC]"
                  >
                    <img
                      src="/images/icons/filter-icon.png"
                      alt="filter icon"
                    />
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
              {paginatedOrders?.length === 0 && (
                <p className="text-center text-xl font-bold text-[#ccc]">
                  No data found!
                </p>
              )}
              {paginatedOrders?.length > 0 && (
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
                        order.payment_details?.state?.toLowerCase() || "unpaid";
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
                            {order.shipping_address?.[0]?.name || "N/A"}
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
                          <td className="px-4 py-2">₹{order.final_amount}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
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
          <PagInationNav
            totalPages={totalPages}
            currentPage={currentPage}
            handlePageChange={setCurrentPage}
          />
        </section>
      )}
    </section>
  );
}

export function OrderDetails({ order, onBack, vendorId = null }) {
  // Filter products based on vendorId if provided
  const filteredProducts = vendorId
    ? order.order_items?.filter(
        (item) => item.product_variants?.vendor_id === vendorId
      )
    : order.order_items;

  console.log(filteredProducts);

  return (
    <section className="flex flex-col h-full min-h-0 lg:rounded-lg font-Poppins bg-white">
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
        <button
          onClick={() => {
            const exportData = Object.entries(order.product_variants_map).map(
              ([variantId, variants]) => {
                const variant = variants[0];
                const product = order.products.find((p) => p.id === variant.id);

                return {
                  "Order ID": order.id || "",
                  "Order Status": order.status || "",
                  "Variant ID": variantId || "",
                  "Product ID": variant.product_id || "",
                  "Product Name": variant.title || "",
                  Price: `₹${variant.price}` || "",
                  Quantity: product?.quantity || "",
                  Description: variant.details || "",
                  Dimension: variant.dimensions || "NA",
                  Manufacturer: variant.manufacturer || "",
                  Segment: variant.segment || "",
                  Category: variant.product_type || "",
                  "Order Date": new Date(order.created_at).toLocaleDateString(),
                };
              }
            );
            exportToExcel(exportData, `${order.id}-products.xlsx`);
          }}
          className="flex gap-2 items-center rounded-md border p-2 text-[#374A75] text-sm md:text-lg hover:bg-[#F9F9F9]"
        >
          <img src="/images/icons/export.png" alt="export icon" />
          Export
        </button>
      </div>

      {/* Scrollable content wrapper */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-3 pb-2">
        {/* Order ID */}
        <div className="py-4 font-semibold flex flex-col-reverse md:flex-row gap-2 md:mt-4">
          <p className="text-base md:text-xl">Orders ID: #{order.id}</p>
          <p className="capitalize bg-[#FF782F] bg-opacity-80 text-[10px] p-1 md:p-2 rounded-lg md:text-xs text-center">
            {order.status}
          </p>
        </div>

        {/* Section 1 */}
        {/* <div className="py-4 flex gap-4"> */}
        <div className="py-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* <div className="py-4 lg:flex gap-4"> */}
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
                {!vendorId && (
                  <p className="text-sm md:text-base font-semibold capitalize text-[#70706E]">
                    Phone: {order.users_profiles?.phone || "N/A"}
                  </p>
                )}
              </div>
            </div>
            {/* <button className=" bg-[#003F62] hover:bg-[#4C69A4] text-white w-full rounded-lg py-1 mt-auto text-sm md:text-base">
              View Profile
            </button> */}
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
                  payment mode: {order?.payment_details?.paymentMode || "N/A"}
                </p>
                <p className="text-sm md:text-base font-semibold capitalize text-[#70706E]">
                  status: {order.payment_details?.state || "N/A"}
                </p>
                {!vendorId && (
                  <p className="text-sm md:text-base font-semibold capitalize text-[#70706E]">
                    transaction id:{" "}
                    {order.payment_details?.transactionId || "N/A"}
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
            {/* <button className="bg-[#003F62] hover:bg-[#4C69A4] text-white w-full rounded-lg py-1 mt-auto text-sm md:text-base">
              Download info
            </button> */}
          </div>
          {/* Deliver to */}
          <div className="border p-4 rounded-2xl flex flex-col gap-3">
            <div className="flex gap-3 max-w-full text-wrap h-full">
              <img
                src="/images/profile3.png"
                alt="Profile"
                className="w-10 h-10"
              />
              <div className="text-wrap max-w-full">
                <h2 className="text-lg md:text-xl font-semibold text-[#232321]">
                  Deliver to
                </h2>
                <p className="text-sm md:text-base font-semibold capitalize text-[#70706E] mt-2">
                  Address: {order.shipping_address?.[0].name},
                  <br />
                  {order.shipping_address?.[0]?.address},
                  {order.shipping_address?.[0]?.town},
                  {order.shipping_address?.[0]?.city}-
                  {order.shipping_address?.[0]?.pincode}
                </p>
              </div>
            </div>
            {/* <button className="bg-[#003F62] hover:bg-[#4C69A4] text-white w-full rounded-lg py-1 mt-auto text-sm md:text-base">
              View Profile
            </button> */}
          </div>
        </div>

        {/* Section 3 */}
        <div className="py-2 ">
          <h3 className="text-lg font-semibold mb-2">Products</h3>
          <div className="bg-white rounded-lg shadow-xs">
            <table className="w-full min-w-full border-separate border-spacing-0 hidden lg:inline-table">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-[17px] text-gray-500 font-semibold text-left py-3 px-2">
                    Product Name
                  </th>
                  <th className="text-[15px] text-gray-500 font-semibold text-left py-3">
                    Product ID
                  </th>
                  <th className="text-[15px] text-gray-500 font-semibold text-left py-3">
                    MRP
                  </th>
                  <th className="text-[15px] text-gray-500 font-semibold text-left py-3">
                    Price
                  </th>
                  <th className="text-[15px] text-gray-500 font-semibold text-left py-3">
                    Quantity
                  </th>
                  <th className="text-[15px] text-gray-500 font-semibold text-left py-3">
                    Item Total
                  </th>
                  <th className="text-[15px] text-gray-500 font-semibold text-left py-3">
                    Coupon Discount
                  </th>
                  <th className="text-[15px] text-gray-500 font-semibold text-left py-3">
                    Subtotal
                  </th>
                  <th className="text-[15px] text-gray-500 font-semibold text-left py-3">
                    GST
                  </th>
                  <th className="text-[15px] text-gray-500 font-semibold text-right py-3 pr-6">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts?.map((orderItem) => {
                  return (
                    <tr
                      key={orderItem.id}
                      className="border-b border-gray-200 hover:bg-gray-50"
                    >
                      <td className="flex items-center gap-3 py-3 px-3">
                        {orderItem?.product_variants?.image ? (
                          <img
                            src={`${baseImageUrl}${orderItem?.product_variants?.image}`}
                            alt={orderItem?.product_variants?.title}
                            className="w-8 h-8 rounded-md object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 bg-gray-300 rounded-md" />
                        )}
                        <span className="font-semibold text-base text-black ml-2">
                          {orderItem?.product_variants?.title}
                        </span>
                      </td>
                      <td
                        className="py-3 text-[15px] font-semibold text-[#232321]"
                        title={`#${orderItem?.id}`} // Tooltip with full id on hover
                      >
                        #{orderItem?.id?.slice(0, 6)}
                      </td>
                      <td className="py-3 text-[15px] font-semibold text-[#232321]">
                        {orderItem?.product_variants?.ecommercePrice?.mrp}
                      </td>
                      <td className="py-3 text-[15px] font-semibold text-[#232321]">
                        {
                          orderItem?.product_variants?.ecommercePrice
                            ?.sellingPrice
                        }
                      </td>
                      <td className="py-3 text-[15px] font-semibold text-[#232321]">
                        {orderItem?.quantity}
                      </td>
                      <td className="py-3 text-[15px] font-semibold text-[#232321]">
                        {orderItem?.item_total}
                      </td>
                      <td className="py-3 text-[15px] font-semibold text-[#232321]">
                        {orderItem?.coupon_discount}
                      </td>
                      <td className="py-3 text-[15px] font-semibold text-[#232321]">
                        {orderItem?.sub_total}
                      </td>
                      <td className="py-3 text-[15px] font-semibold text-[#232321]">
                        {orderItem?.gst_amount}
                      </td>
                      <td className="py-3 text-[15px] font-semibold text-right pr-6">
                        ₹{orderItem?.final_amount}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div className="lg:hidden">
              {filteredProducts?.map((product) => {
                return <MobileOrderItem key={product.id} product={product} />;
              })}
            </div>
            {/* Summary section */}
            {!vendorId && (
              <div className="flex justify-end mt-3">
                <div className="max-w-sm w-full">
                  <PriceDistribution order={order} />
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
          {order.final_amount.toLocaleString("en-IN", {
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
          {order.payment_details?.state || "N/A"}
        </p>
      </div>
    </div>
  );
}

function MobileOrderItem({ product }) {
  return (
    <div className="font-Poppins border-b my-2 py-2">
      <div className="flex gap-4">
        <img
          src={`${baseImageUrl}${product?.product_variants?.image}`}
          alt="product"
          className="h-16 w-16 border"
        />
        <h3 className="font-semibold text-sm line-clamp-1">
          {product?.product_variants?.title}
        </h3>
      </div>
      <div className="flex justify-between text-sm my-1 text-[#232321]/80 font-medium">
        <p className="flex gap-2">MRP: {product?.mrp}</p>
        <p className="flex gap-2">Price: {product?.selling_price}</p>
      </div>
      <div className="flex justify-between text-sm my-1 text-[#232321]/80 font-medium">
        <p className="flex gap-2">Quantity: {product?.quantity}</p>
        <p className="flex gap-2">Item Total: {product?.item_total}</p>
      </div>
      <div className="flex justify-between text-sm my-1 text-[#232321]/80 font-medium">
        <p className="flex gap-2">
          Coupon Discount: -{product?.coupon_discount}
        </p>
        <p className="flex gap-2">GST: {product?.gst_amount}</p>
      </div>
      <div className="flex justify-between text-sm font-semibold text-[#232321]/80 capitalize">
        <p>subtotal</p>
        <p>
          {product?.sub_total.toLocaleString("en-IN", {
            style: "currency",
            currency: "INR",
          })}
        </p>
      </div>
      <div className="flex justify-between text-sm font-semibold text-[#232321]/80 capitalize">
        <p>total</p>
        <p>
          {product?.final_amount.toLocaleString("en-IN", {
            style: "currency",
            currency: "INR",
          })}
        </p>
      </div>
    </div>
  );
}

function PriceDistribution({ order }) {
  return (
    <div className="font-Poppins bg-[#fff] text-sm md:text-base">
      {/* <h3 className="capitalize text-[#171717] font-semibold">
        payment information
      </h3> */}
      <div className="">
        <div className="flex justify-between border-b py-2">
          <p>Total MRP</p>
          <p>
            ₹
            {order?.total_mrp?.toLocaleString("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </div>
        <div className="flex justify-between border-b py-2">
          <p>Discount on MRP</p>
          <p>
            -₹
            {order?.discount_on_mrp?.toLocaleString("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </div>
        <div className="flex justify-between border-b py-2">
          <p>Coupon Discount</p>
          <p>
            -₹{" "}
            {order?.coupon?.discount?.toLocaleString("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </div>
        <div className="flex justify-between border-b py-2">
          <p>Subtotal</p>
          <p>
            ₹
            {order?.sub_total?.toLocaleString("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </div>
        <div className="flex justify-between border-b py-2">
          <p>Shipping Fee</p>
          <p>
            ₹
            {order?.charges?.delivery?.toLocaleString("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </div>
        <div className="flex justify-between border-b py-2">
          <p>GST</p>
          <p>
            ₹
            {order?.charges?.GST?.toLocaleString("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </div>
        <div className="flex justify-between font-semibold pt-2">
          <p>Total Amount</p>
          <p>
            RS ₹
            {order?.final_amount?.toLocaleString("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </div>
      </div>
    </div>
  );
}
