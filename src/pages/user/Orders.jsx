import React, { useEffect } from "react";
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
import { generateInvoicePDF } from "./InvoicePdf";

const statusIcon = {
  pending: <MdOutlinePendingActions />,
  approved: <LuPackageCheck />,
  shipped: <LiaShippingFastSolid />,
  delivered: <BsBoxSeam />,
  cancelled: <IoCloseCircleOutline />,
};

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [detailedView, setDetailedView] = useState(false);
  const [productView, setProductView] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const { accountHolder } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrdersData();
  }, []);

  const fetchOrdersData = async () => {
    try {
      setLoading(true);
      const { data: ordersData, error: ordersError } = await supabase
        .from("orders")
        .select("*")
        .eq("userId", accountHolder.userId);

      if (ordersError) throw ordersError;
      if (!ordersData || ordersData.length === 0) {
        setOrders([]);
        return;
      }

      const productIds = ordersData.flatMap((order) =>
        order.products.map((p) => p.id)
      );

      if (productIds.length === 0) {
        setOrders(ordersData);
        return;
      }

      const { data: productsData, error: productsError } = await supabase
        .from("product_variants")
        .select("*")
        .in("id", productIds);

      if (productsError) throw productsError;

      const ordersWithProducts = ordersData.map((order) => ({
        ...order,
        products: order.products.map((p) => ({
          ...p,
          details: productsData.find((prod) => prod.id === p.id) || null,
        })),
      }));

      setOrders(ordersWithProducts);
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
  const handleProductView = (product) => {
    setSelectedProduct(product);
    setProductView(true);
    setDetailedView(false);
  };

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
            <Breadcrumbs
              order={selectedOrder}
              product={selectedProduct}
              setDetailedView={setDetailedView}
              setProductView={setProductView}
              setSelectedOrder={setSelectedOrder}
              setSelectedProduct={setSelectedProduct}
            />
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
                          {statusIcon[order.status]}
                        </h2>
                        <div>
                          <h5 className="capitalize text-[#171717] font-semibold">
                            {order.status}
                          </h5>
                          <p className="text-xs text-[#171717]">
                            On {order.deliveryDate}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center md:gap-5 bg-[#F5F8FF] px-3 py-5 my-2">
                        <img
                          src={`${baseImageUrl}/${order.products[0]?.details.image}`}
                          alt=""
                          className="h-20 md:h-28 w-20 md:w-28 object-contain"
                        />
                        <div>
                          <h4 className="text-xs sm:text-sm font-semibold text-[#171717] capitalize">
                            {order.id}
                          </h4>
                          <p className="text-sm text-[#171717]">
                            {order.products.length} items in delivery
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
                        {(order.status === "pending" ||
                          order.status === "approved") && (
                          <button className="px-10 border border-[#213626] uppercase text-xs tracking-wider rounded-sm py-2 hover:bg-[#f9f9f9]">
                            cancel
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
              order={selectedOrder}
              handleProductView={handleProductView}
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

function OrderProducts({ order, handleProductView }) {
  const [showPriceDetails, setShowPriceDetails] = useState(false);
  const products = order.products;
  const shippingAddress = order.shippingAddress[0];

  return (
    <>
      <div className="px-4">
        <div className="bg-[#374A75] text-[#fff] px-4 py-1 rounded-md my-5 flex items-center gap-3">
          <h2 className="h-9 w-9 bg-[#fff] rounded-full text-[#374A75] text-2xl flex justify-center items-center">
            {statusIcon[order.status]}
          </h2>
          <div>
            <p className="capitalize font-bold text-sm md:text-base">
              {order.status}
            </p>
            <p className="text-xs">On {order.deliveryDate}</p>
          </div>
        </div>
        <div className="flex gap-10">
          {(order.status === "pending" || order.status === "approved") && (
            <button className="flex-1 border border-[#213626] uppercase text-xs tracking-wider rounded-sm py-2 hover:bg-[#f9f9f9]">
              cancel
            </button>
          )}
          {(order.status === "pending" ||
            order.status === "approved" ||
            order.status === "shipped") && (
            <button className="flex-1 border border-[#213626] uppercase text-xs tracking-wider rounded-sm py-2 hover:bg-[#f9f9f9]">
              track
            </button>
          )}
        </div>

        <div className="space-y-4 my-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="border border-[#374A75] px-2 md:px-3 py-2 md:py-4 rounded-md flex lg:grid grid-cols-2 items-center"
            >
              <div className="grid  grid-cols-[1fr,2fr,1fr] gap-2 lg:gap-7 flex-1">
                <img
                  src={`${baseImageUrl}/${product.details.image}`}
                  alt={product.details.title}
                  className="h-24 w-24 object-contain"
                />
                <div className="space-y-2">
                  <h4 className="text-sm md:text-lg font-bold text-[#171717] line-clamp-2 md:line-clamp-none">
                    {product.details.title}
                  </h4>
                  <p className="text-[#171717] text-xs md:text-sm line-clamp-3 md:line-clamp-none">
                    {product.details.details}
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm md:text-base font-semibold text-[#171717] capitalize">
                    price
                  </h4>
                  <p className="text-[#171717] text-xs md:text-sm">
                    {product.price}
                  </p>
                </div>
              </div>
              <div className="justify-self-end">
                <button onClick={() => handleProductView(product)}>
                  <MdKeyboardArrowRight size={25} color="#304778" />
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="md:p-5 py-3">
          <h5 className="capitalize text-[#171717] font-bold text-base md:text-lg mb-3">
            delivery address
          </h5>
          <p className="capitalize text-sm font-semibold">
            {shippingAddress.name} <span className="text-[#CCCCCC]">|</span>{" "}
            {shippingAddress.mobile}
          </p>
          <p className="text-xs md:text-sm">
            {shippingAddress.address},{shippingAddress.town},
            {shippingAddress.city},{shippingAddress.state}-
            {shippingAddress.pincode}
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
                {order.finalPrice.toLocaleString("en-IN", {
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
            <span> {order.paymentMethod} payment</span>
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
            <BsTelephone /> {shippingAddress.mobile}
          </p>
        </div>
        <div className="md:px-5 text-xs md:text-sm font-bold text-[#999]">
          <p>Order ID #{order.id}</p>
        </div>
      </div>
    </>
  );
}

function OrderProductView({ order, product }) {
  const shippingAddress = order?.shippingAddress[0];

  return (
    <div className="p-4 font-Poppins">
      <div className="md:flex gap-4">
        <div className="border border-[#374A75] rounded-md px-2 py-4 space-y-3 mb-3 md:mb-0">
          <img
            src={`${baseImageUrl}/${product.details.image}`}
            alt={product.details.title}
            className="h-52 w-52 object-contain place-self-center"
          />
          <h4 className="text-base md:text-xl font-bold text-[#171717] text-center">
            {product.details.title}
          </h4>
          <p className="text-[#171717] text-sm line-clamp-1">
            {product.details.details}
          </p>
        </div>
        <div className="flex-1 flex flex-col justify-between">
          <div className="bg-[#374A75] text-[#fff] px-4 py-1 rounded-md flex items-center gap-3">
            <h2 className="h-9 w-9 bg-[#fff] rounded-full text-[#374A75] text-2xl flex justify-center items-center">
              {statusIcon[order.status]}
            </h2>
            <div>
              <p className="capitalize font-bold text-sm md:text-base">
                {order.status}
              </p>
              <p className="text-xs ">On {order.deliveryDate}</p>
            </div>
          </div>
          <div className="my-3 md:my-0">
            <h5 className="capitalize text-[#171717] font-bold text-base md:text-lg mb-3">
              delivery address
            </h5>
            <p className="capitalize text-sm font-semibold">
              {shippingAddress.name} <span className="text-[#CCCCCC]">|</span>{" "}
              {shippingAddress.mobile}
            </p>
            <p className="text-sm">
              {shippingAddress.address},{shippingAddress.town},
              {shippingAddress.city},{shippingAddress.state}-
              {shippingAddress.pincode}
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
                {order.finalPrice.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
          </div>
          <p className="text-[#374A75] capitalize font-bold flex items-center gap-5 bg-[#F9F9F9] p-2.5">
            <IoCashOutline /> <span> {order.paymentMethod} payment</span>
          </p>
        </div>
      </div>
      <div className="md:p-5 py-3">
        <p className="text-sm font-bold text-[#999]">
          Item sold by : {product.details?.manufacturer}
        </p>
        <button className="text-[#374A75] font-bold text-sm capitalize border border-[#CCCCCC] w-full py-2.5 rounded-md hover:bg-[#f9f9f9]">
          get invoice
        </button>
      </div>
      <div className="md:p-5 py-3 text-sm font-bold">
        <p>Updates sent to</p>
        <p className="text-[#374A75] flex items-center gap-2 mt-2">
          <BsTelephone /> {shippingAddress.mobile}
        </p>
      </div>
      <div className="md:px-5 text-sm font-bold text-[#999]">
        <p>Order ID #{order.id}</p>
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
          <span className="text-gray-500">{product.details.title}</span>
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
            {order.totalMRP.toLocaleString("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </div>
        <div className="flex justify-between border-b py-2">
          <p>Coupon Discount</p>
          <p>
            {order.coupon?.discount.toLocaleString("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </div>
        <div className="flex justify-between border-b py-2">
          <p>Shipping Fee</p>
          <p>
            {order.charges?.delivery.toLocaleString("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </div>
        <div className="flex justify-between border-b py-2">
          <p>GST</p>
          <p>
            {order.charges?.GST.toLocaleString("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </div>
        <div className="flex justify-between font-semibold pt-2">
          <p>Total Amount</p>
          <p>
            RS{" "}
            {order.finalPrice.toLocaleString("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </div>
      </div>
    </div>
  );
}
