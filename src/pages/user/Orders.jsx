import { useEffect } from "react";
import { supabase } from "../../services/supabase";
import { useState } from "react";
import { useApp } from "../../Context/Context";
import { MdKeyboardArrowRight } from "react-icons/md";
import { baseImageUrl } from "../../utils/HelperConstant";
import { BsTelephone } from "react-icons/bs";
import { IoCashOutline } from "react-icons/io5";
import { LiaShippingFastSolid } from "react-icons/lia";
import { BsBoxSeam } from "react-icons/bs";
import { MdOutlinePendingActions } from "react-icons/md";
import { LuPackageCheck } from "react-icons/lu";
import { IoCloseCircleOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { LuChevronDown } from "react-icons/lu";
// import { generateInvoicePDF } from "./InvoicePdf";
import { v4 as uuidv4 } from "uuid";
import toast from "react-hot-toast";

const statusIcon = {
  pending: <MdOutlinePendingActions />,
  approved: <LuPackageCheck />,
  shipped: <LiaShippingFastSolid />,
  delivered: <BsBoxSeam />,
  cancelled: <IoCloseCircleOutline />,
  PartiallyCancelled: <IoCloseCircleOutline />,
};

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [detailedView, setDetailedView] = useState(false);
  const [productView, setProductView] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [entireOrderCancellation, setEntireOrderCancellation] = useState(false);
  const [refreshOrder, setRefreshOrder] = useState(false);

  const { accountHolder } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrdersData();
  }, [refreshOrder]);

  const fetchOrdersData = async () => {
    try {
      setLoading(true);
      const { data: ordersData, error: ordersError } = await supabase
        .from("orders_table")
        .select("* ,order_items(*,product_variants(*))")
        .eq("user_id", accountHolder.userId)
        .order("created_at", { ascending: false });

      console.log("orders", ordersData);

      setOrders(ordersData);
    } catch (error) {
      console.error("Error fetching orders with products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOrdersView = (order) => {
    setDetailedView(true);
    setSelectedOrder(order);
  };

  // cancel order function

  async function handleOrderCancel(order) {
    setEntireOrderCancellation((prev) => !prev);
    console.log("order for cancel", order);

    // check the status from the db
    const { data, error } = await supabase
      .from("orders_table")
      .select("status")
      .eq("id", order?.id)
      .single();

    if (data?.status === "cancelled") {
      toast.error("order is already cancelled");
      return;
    }

    const uniqueId = uuidv4();
    console.log(uniqueId);

    const refundAmountInPaisa = order?.final_amount * 100;

    // note this function for entire order cancellation
    const reqbody = {
      amount: refundAmountInPaisa,
      orderId: order?.id,
      refundId: uniqueId,
    };
    try {
      const res = await fetch(
        `https://bwxzfwsoxwtzhjbzbdzs.supabase.co/functions/v1/orderRefund`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(reqbody),
        }
      );

      console.log("res", res);
      const data = await res.json();
      console.log("data", data);

      if (data?.success) {
        // code to update in the dB
        // step 1 ->update the status to cancelled
        await supabase
          .from("orders_table")
          .update({
            status: "cancelled",
            refund: data?.data,
            merchent_refund_id: uniqueId,
          })
          .eq("id", order?.id);

        await supabase
          .from("order_items")
          .update({ item_status: "cancelled" })
          .eq("order_id", order?.id);

        toast?.success("refund initated");
      }
    } catch (error) {
      console.log("error", error);
    } finally {
      setEntireOrderCancellation((prev) => !prev);
      setRefreshOrder((prev) => !prev);
    }
  }

  return (
    <>
      {loading ? (
        <div className="flex flex-col items-center justify-center h-full">
          <p className="text-xl font-bold text-[#ccc]">Hold On...</p>
          <p className="text-xl font-bold text-[#ccc]">
            Fetching orders for {accountHolder.companyName} !!
          </p>
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col gap-3 justify-center items-center h-full">
          <p className="text-xl font-bold text-[#ccc]">No orders yet ?</p>
          <button
            onClick={() => navigate("/products")}
            className="text-sm font-bold px-5 py-2 text-[#fff] bg-[#374A75] hover:bg-[#4C69A4] rounded"
          >
            Start shopping
          </button>
        </div>
      ) : (
        <>
          <div className="px-3 pt-3">
            {detailedView && (
              <Breadcrumbs
                order={selectedOrder}
                product={selectedProduct}
                setDetailedView={setDetailedView}
                setProductView={setProductView}
                setSelectedOrder={setSelectedOrder}
                setSelectedProduct={setSelectedProduct}
              />
            )}
          </div>
          {!detailedView && !productView ? (
            <div>
              <h2 className="text-[#171717] font-bold px-3 py-3 sticky top-0 bg-[#fff] border-b">
                All Orders
              </h2>
              {orders.map((order) => (
                <div key={order.id}>
                  <div className="px-3">
                    <div className="font-Poppins p-3 shadow-[0px_0px_2px_rgba(0,0,0,0.1)] my-2 border">
                      <div className="flex items-center gap-2">
                        <h2 className="h-9 w-9 bg-[#374A75] rounded-full text-[#fff] text-2xl flex justify-center items-center">
                          {statusIcon[order?.status]}
                        </h2>
                        <div>
                          <h5 className="capitalize text-[#171717] font-semibold">
                            {order?.status}
                          </h5>
                          {(order.status === "pending" ||
                            order.status === "approved") && (
                            <p className="text-xs text-[#171717]">
                              On {order?.delivery_date}
                            </p>
                          )}
                          {order.status === "cancelled" && (
                            <p className="text-xs text-[#171717]">
                              On{" "}
                              {new Date(order?.refund?.timestamp)
                                .toLocaleString("en-IN", {
                                  timeZone: "Asia/Kolkata",
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "2-digit",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: false,
                                })
                                .replace(",", "")
                                .replaceAll("/", "-")}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center md:gap-5 bg-[#F5F8FF] px-3 py-5 my-2">
                        <img
                          src={`${baseImageUrl}/${order?.order_items?.[0]?.product_variants.image}`}
                          alt=""
                          className="h-20 md:h-28 w-20 md:w-28 object-contain"
                        />
                        <div>
                          <h4 className="text-xs sm:text-sm font-semibold text-[#171717] capitalize">
                            OrderID: {order?.id}
                          </h4>
                          <p className="text-sm text-[#171717]">
                            {order?.order_items?.length} items in delivery
                          </p>
                        </div>
                        <button
                          onClick={() => handleOrdersView(order)}
                          className="ml-auto"
                        >
                          <MdKeyboardArrowRight size={25} color="#304778" />
                        </button>
                      </div>

                      <div className="flex justify-between">
                        {order.status === "pending" ||
                        order.status === "approved" ? (
                          <button
                            disabled={entireOrderCancellation}
                            onClick={() => handleOrderCancel(order)}
                            className=" px-10 border border-[#213626] uppercase text-xs tracking-wider rounded-sm py-2 hover:bg-red-600"
                          >
                            cancel
                          </button>
                        ) : (
                          <button
                            disabled={true}
                            onClick={() => handleOrderCancel(order)}
                            className=" px-10 border border-[#213626] uppercase text-xs tracking-wider rounded-sm py-2"
                          >
                            cancelled
                          </button>
                        )}
                        {(order.status === "pending" ||
                          order.status === "approved" ||
                          order.status === "shipped") && (
                          <button className="px-10 border border-[#213626] uppercase text-xs tracking-wider rounded-sm py-2 hover:bg-[#f9f9f9]">
                            track
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : detailedView && !productView ? (
            <OrderProducts
              orderID={selectedOrder?.id}
              // handleProductView={handleProductView}
            />
          ) : (
            <OrderProductView order={selectedOrder} product={selectedProduct} />
          )}
        </>
      )}
    </>
  );
}

export default Orders;

function OrderProducts({ orderID }) {
  const [showPriceDetails, setShowPriceDetails] = useState(false);
  const [loading, setLoading] = useState();

  const [order, setOrder] = useState();
  const [orderRefresh, setorderRefresh] = useState(false);

  useEffect(() => {
    fetchOrdersData();
  }, [orderRefresh]);

  const fetchOrdersData = async () => {
    try {
      setLoading(true);
      const { data: ordersData, error: ordersError } = await supabase
        .from("orders_table")
        .select("* ,order_items(*,product_variants(*))")
        .eq("id", orderID)
        .single();

      console.log("orders", ordersData);

      setOrder(ordersData);
    } catch (error) {
      console.error("Error fetching orders with products:", error);
    } finally {
      setLoading(false);
    }
  };
  const products = order?.order_items;
  const shippingAddress = order?.shipping_address?.[0];
  async function handleOrderitemCancel(order, product) {
    // indivual product cancel
    console.log("product for cancel", product);

    // check the order length to make it partial cancel or entire order cancel
    const cancelType =
      order?.order_items?.length > 1 ? "PartiallyCancelled" : "cancelled";

    //check the status of the product from the db incase the product is already refunded and still function is called
    const { data, error } = await supabase
      .from("order_items")
      .select("item_status")
      .eq("id", product?.id)
      .single();

    console.log("priduct from db ", data);

    if (data?.item_status === "cancelled") {
      toast.error("the refund is already initated ");
      return;
    }

    const uniqueId = uuidv4();
    console.log(uniqueId);

    const refundAmountInPaisa = product?.refundable_amount * 100;

    // note this function for indiviual order cancellation
    const reqbody = {
      amount: refundAmountInPaisa,
      orderId: product?.order_id,
      refundId: uniqueId,
    };
    try {
      const res = await fetch(
        `https://bwxzfwsoxwtzhjbzbdzs.supabase.co/functions/v1/orderRefund`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(reqbody),
        }
      );

      console.log("res", res);
      const data = await res.json();
      console.log("data", data);

      if (!data?.success) {
        toast?.error("something went wrong");
        return;
      }

      if (data?.success) {
        // code to update in the dB
        // step 1 ->update the status to partiallycanccelled
        const { data: orderdata, error: orddererror } = await supabase
          .from("orders_table")
          .update({
            status: cancelType,
            refund: data?.data,
            merchent_refund_id: uniqueId,
          })
          .eq("id", order?.id);

        if (orddererror) throw orddererror;

        if (orderdata) console.log("orderdata", orderdata);

        const { data: itemdata, error: itemerror } = await supabase
          .from("order_items")
          .update({
            item_status: "cancelled",
            merchant_refund_id: uniqueId,
            refund: data?.data,
          })
          .eq("id", product?.id)
          .eq("order_id", product?.order_id)
          .select();

        console.log("error", itemerror);

        console.log("data that is updated", itemdata);

        toast?.success("refund initated ,item cancelled");
        setorderRefresh((prev) => !prev);
      }
    } catch (error) {
      console.log("error", error);
    } finally {
    }
  }

  if (loading) return <p>loading .....</p>;

  return (
    <>
      <div className="px-4">
        <div className="bg-[#374A75] text-[#fff] px-4 py-1 rounded-md my-5 flex items-center gap-3">
          <h2 className="h-9 w-9 bg-[#fff] rounded-full text-[#374A75] text-2xl flex justify-center items-center">
            {statusIcon[order?.status]}
          </h2>
          <div>
            <p className="capitalize font-bold text-sm md:text-base">
              {order?.status}
            </p>
            {(order?.status === "pending" || order?.status === "approved") && (
              <p className="text-xs ">On {order?.delivery_date}</p>
            )}

            {order?.status === "cancelled" && (
              <p className="text-xs ">
                On{" "}
                {new Date(order?.refund?.timestamp)
                  .toLocaleString("en-IN", {
                    timeZone: "Asia/Kolkata",
                    day: "2-digit",
                    month: "2-digit",
                    year: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  })
                  .replace(",", "")
                  .replaceAll("/", "-")}
              </p>
            )}
          </div>
        </div>
        <div className="flex gap-10">
          {(order?.status === "pending" || order?.status === "approved") && (
            <button className="flex-1 border border-[#213626] uppercase text-xs tracking-wider rounded-sm py-2 hover:bg-[#f9f9f9]">
              cancel
            </button>
          )}
          {(order?.status === "pending" ||
            order?.status === "approved" ||
            order?.status === "shipped") && (
            <button className="flex-1 border border-[#213626] uppercase text-xs tracking-wider rounded-sm py-2 hover:bg-[#f9f9f9]">
              track
            </button>
          )}
        </div>

        <div className="space-y-4 my-4">
          {products?.map((product) => (
            <div
              key={product.id}
              className="border border-[#374A75] px-2 md:px-3 py-2 md:py-4 rounded-md flex md:grid grid-cols-[3fr,1fr] items-start"
              // className="border border-[#374A75] px-2 md:px-3 py-2 md:py-4 rounded-md flex lg:grid grid-cols-2 items-center"
            >
              <div className="flex justify-between items-center gap-2 lg:gap-7 flex-1">
                {/* <div className="grid  grid-cols-[1fr,2fr,1fr] gap-2 lg:gap-7 flex-1"> */}
                <img
                  src={`${baseImageUrl}/${product?.product_variants?.image}`}
                  alt={product?.product_variants?.title}
                  className="h-24 w-24 object-contain"
                />
                <div className="space-y-2">
                  <h4 className="text-sm md:text-lg font-bold text-[#171717] line-clamp-2 md:line-clamp-none">
                    {product?.product_variants?.title}
                  </h4>
                  <p className="text-[#171717] text-xs md:text-sm line-clamp-3 md:line-clamp-none">
                    {product?.product_variants?.details}
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm md:text-base font-semibold text-[#171717] capitalize">
                    MRP
                  </h4>
                  <p className="text-[#171717] text-xs md:text-sm">
                    {product?.mrp}
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm md:text-base font-semibold text-[#171717] capitalize">
                    Price
                  </h4>
                  <p className="text-[#171717] text-xs md:text-sm">
                    {product?.selling_price}
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm md:text-base font-semibold text-[#171717] capitalize">
                    quantity
                  </h4>
                  <p className="text-[#171717] text-xs md:text-sm">
                    {product?.quantity}
                  </p>
                </div>
                {/* <div className="space-y-2">
                  <h4 className="text-sm md:text-base font-semibold text-[#171717] capitalize">
                    Item Total
                  </h4>
                  <p className="text-[#171717] text-xs md:text-sm">
                    {product?.item_total}
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm md:text-base font-semibold text-[#171717] capitalize">
                    coupon Discount
                  </h4>
                  <p className="text-[#171717] text-xs text-center md:text-sm">
                    {product?.coupon_discount}
                  </p>
                </div> */}
                <div className="space-y-2">
                  <h4 className="text-sm md:text-base font-semibold text-[#171717] capitalize">
                    Subtotal
                  </h4>
                  <p className="text-[#171717] text-xs md:text-sm">
                    {product?.sub_total}
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm md:text-base font-semibold text-[#171717] capitalize">
                    GST
                  </h4>
                  <p className="text-[#171717] text-xs md:text-sm">
                    {product?.gst_amount}
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm md:text-base font-semibold text-[#171717] capitalize text-nowrap">
                    Total price
                  </h4>
                  <p className="text-[#171717] text-xs md:text-sm">
                    {product?.final_amount}
                  </p>
                </div>
              </div>
              {/* <div className="justify-self-end">
                <button onClick={() => handleProductView(product)}>
                  <MdKeyboardArrowRight size={25} color="#304778" />
                </button>
              </div> */}
              <div className="justify-self-end">
                {/* <button
                  onClick={() => handleOrderitemCancel(order, product)}
                  className=" px-10 border border-[#213626] uppercase text-xs tracking-wider rounded-sm py-2 hover:bg-red-600"
                >
                  cancel
                </button> */}
                {product.item_status !== "cancelled" ? (
                  <button
                    onClick={() => handleOrderitemCancel(product)}
                    className=" px-10 border border-[#213626] uppercase text-xs tracking-wider rounded-sm py-2 hover:bg-red-600"
                  >
                    cancel
                  </button>
                ) : (
                  <button
                    disabled={true}
                    className=" px-10 border border-[#213626] uppercase text-xs tracking-wider rounded-sm py-2"
                  >
                    cancelled
                  </button>
                )}
              </div>
              {/* <button
                onClick={() => handleOrderitemCancel(product)}
                className=" px-10 border border-[#213626] uppercase text-xs tracking-wider rounded-sm py-2 hover:bg-red-600"
              >
                cancel
              </button> */}
            </div>
          ))}
        </div>
        <div className="md:p-5 py-3">
          <h5 className="capitalize text-[#171717] font-bold text-base md:text-lg mb-3">
            delivery address
          </h5>
          <p className="capitalize text-sm font-semibold">
            {shippingAddress?.name} <span className="text-[#CCCCCC]">|</span>{" "}
            {shippingAddress?.mobile}
          </p>
          <p className="text-xs md:text-sm">
            {shippingAddress?.address},{shippingAddress?.town},
            {shippingAddress?.city},{shippingAddress?.state}-
            {shippingAddress?.pincode}
          </p>
        </div>
        <div className="space-y-3 md:p-5 py-3">
          <div className="flex justify-between items-center">
            <p className="capitalize text-[#171717] font-bold text-base md:text-lg">
              total order price
            </p>
            <div className="flex gap-2 items-center">
              <p className="font-bold text-sm md:text-base">
                RS{" "}
                {order?.final_amount?.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
              <button
                onClick={() => setShowPriceDetails(!showPriceDetails)}
                className={`transition-transform duration-300 ${
                  showPriceDetails ? "rotate-180" : ""
                }`}
              >
                <LuChevronDown />
              </button>
            </div>
          </div>

          <div
            className={`max-w-sm w-full overflow-hidden transition-all duration-500 ease-in-out place-self-end ${
              showPriceDetails ? "max-h-[500px] mt-3" : "max-h-0"
            }`}
          >
            <PriceDistribution order={order} />
          </div>
          <p className="text-[#374A75] capitalize font-bold flex items-center gap-5 bg-[#F9F9F9] p-2 text-sm md:text-base">
            <IoCashOutline />
            <span> {order?.payment_details?.paymentMode} payment</span>
          </p>
          <button
            className="text-[#374A75] font-bold text-sm capitalize border border-[#CCCCCC] w-full py-2.5 rounded-md hover:bg-[#f9f9f9]"
            onClick={() => {
              // generateInvoicePDF();
              console.log(order);
            }}
          >
            get invoice
          </button>
        </div>

        <div className="md:p-5 py-3 text-sm font-bold">
          <p>Updates sent to</p>
          <p className="text-[#374A75] flex items-center gap-2 mt-2">
            <BsTelephone /> {shippingAddress?.mobile}
          </p>
        </div>
        <div className="md:px-5 text-xs md:text-sm font-bold text-[#999]">
          <p>Order ID #{order?.id}</p>
        </div>
      </div>
    </>
  );
}

function OrderProductView({ order, product }) {
  const shippingAddress = order?.shipping_address[0];

  return (
    <div className="p-4 font-Poppins">
      <div className="md:flex gap-4">
        <div className="border border-[#374A75] rounded-md px-2 py-4 space-y-3 mb-3 md:mb-0">
          <img
            src={`${baseImageUrl}/${product?.product_variants?.image}`}
            alt={product?.details?.title}
            className="h-52 w-52 object-contain place-self-center"
          />
          <h4 className="text-base md:text-xl font-bold text-[#171717] text-center">
            {product?.product_variants?.title}
          </h4>
          <p className="text-[#171717] text-sm line-clamp-1">
            {product?.product_variants?.details}
          </p>
        </div>
        <div className="flex-1 flex flex-col justify-between">
          <div className="bg-[#374A75] text-[#fff] px-4 py-1 rounded-md flex items-center gap-3">
            <h2 className="h-9 w-9 bg-[#fff] rounded-full text-[#374A75] text-2xl flex justify-center items-center">
              {statusIcon[order?.status]}
            </h2>
            <div>
              <p className="capitalize font-bold text-sm md:text-base">
                {order?.status}
              </p>
              <p className="text-xs ">On {order?.delivery_date}</p>
            </div>
          </div>
          <div className="my-3 md:my-0">
            <h5 className="capitalize text-[#171717] font-bold text-base md:text-lg mb-3">
              delivery address
            </h5>
            <p className="capitalize text-sm font-semibold">
              {shippingAddress?.name} <span className="text-[#CCCCCC]">|</span>{" "}
              {shippingAddress?.mobile}
            </p>
            <p className="text-sm">
              {shippingAddress?.address},{shippingAddress?.town},
              {shippingAddress?.city},{shippingAddress?.state}-
              {shippingAddress?.pincode}
            </p>
          </div>
          <div>
            {/* <p>Qunatity : {product.quantity}</p> */}
            <div className="flex justify-between items-center">
              <p className="capitalize text-[#171717] font-bold text-base md:text-lg">
                product price
              </p>
              <p className="font-bold text-sm md:text-base">
                RS{" "}
                {order?.final_amount?.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
          </div>
          <p className="text-[#374A75] capitalize font-bold flex items-center gap-5 bg-[#F9F9F9] p-2.5">
            <IoCashOutline />{" "}
            <span> {order?.payment_details.paymentMode} payment</span>
          </p>
        </div>
      </div>
      <div className="md:p-5 py-3">
        <p className="text-sm font-bold text-[#999]">
          Item sold by : {product?.product_variants?.manufacturer}
        </p>
        <button className="text-[#374A75] font-bold text-sm capitalize border border-[#CCCCCC] w-full py-2.5 rounded-md hover:bg-[#f9f9f9]">
          get invoice
        </button>
      </div>
      <div className="md:p-5 py-3 text-sm font-bold">
        <p>Updates sent to</p>
        <p className="text-[#374A75] flex items-center gap-2 mt-2">
          <BsTelephone /> {shippingAddress?.mobile}
        </p>
      </div>
      <div className="md:px-5 text-sm font-bold text-[#999]">
        <p>Order ID #{order?.id}</p>
      </div>
    </div>
  );
}

function Breadcrumbs({
  order,
  product,
  setDetailedView,
  setProductView,
  setSelectedOrder,
  setSelectedProduct,
}) {
  return (
    <div className="flex items-center gap-0.5 md:gap-2 text-[10px] md:text-xs text-[#374A75] md:mb-4">
      <button
        onClick={() => {
          setDetailedView(false);
          setProductView(false);
          setSelectedOrder(null);
          setSelectedProduct(null);
        }}
        className="hover:underline font-medium"
      >
        All Orders
      </button>
      {order && (
        <>
          <span>/</span>
          <button
            onClick={() => {
              setDetailedView(true);
              setProductView(false);
              setSelectedProduct(null);
            }}
            className="hover:underline font-medium"
          >
            {order.id}
          </button>
        </>
      )}
      {product && (
        <>
          <span>/</span>
          <span className="text-gray-500">
            {product?.product_variants?.title}
          </span>
        </>
      )}
    </div>
  );
}

function PriceDistribution({ order }) {
  return (
    <div className="font-Poppins bg-[#fff]">
      {/* <h3 className="capitalize text-[#171717] font-semibold">
        payment information
      </h3> */}
      <div className="">
        <div className="flex justify-between border-b py-2">
          <p>Total MRP</p>
          <p>
            {order?.total_mrp?.toLocaleString("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </div>
        <div className="flex justify-between border-b py-2">
          <p>Discount on MRP</p>
          <p>
            {order?.discount_on_mrp?.toLocaleString("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </div>
        <div className="flex justify-between border-b py-2">
          <p>Coupon Discount</p>
          <p>
            {order?.coupon?.discount?.toLocaleString("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </div>
        <div className="flex justify-between border-b py-2">
          <p>Subtotal</p>
          <p>
            {order?.sub_total?.toLocaleString("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </div>

        <div className="flex justify-between border-b py-2">
          <p>Shipping Fee</p>
          <p>
            {order?.charges?.delivery?.toLocaleString("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </div>
        <div className="flex justify-between border-b py-2">
          <p>GST</p>
          <p>
            {order?.charges?.GST?.toLocaleString("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </div>
        <div className="flex justify-between font-semibold pt-2">
          <p>Total Amount</p>
          <p>
            RS{" "}
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
