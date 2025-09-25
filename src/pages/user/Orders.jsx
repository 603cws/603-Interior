import React, { useEffect } from "react";
import { supabase } from "../../services/supabase";
import { useState } from "react";
import { useApp } from "../../Context/Context";
import { MdKeyboardArrowRight } from "react-icons/md";
import { baseImageUrl } from "../../utils/HelperConstant";
import { BsTelephone } from "react-icons/bs";
import { IoCashOutline } from "react-icons/io5";

function Orders() {
  const [orders, setOrders] = useState([]);
  //   const [orderProducts, setOrderProducts] = useState([]);
  const [detailedView, setDetailedView] = useState(false);
  const [productView, setProductView] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const { accountHolder } = useApp();

  //   useEffect(() => {
  //     fetchOrders();
  //   }, []);
  //   useEffect(() => {
  //     fetchOrderProducts();
  //   }, [orders]);

  //   const fetchOrders = async () => {
  //     try {
  //       const { data, error } = await supabase
  //         .from("orders")
  //         .select("*")
  //         .eq("userId", accountHolder.userId);
  //       if (error) console.log(error);
  //       setOrders(data);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };

  //   const fetchOrderProducts = async () => {
  //     try {
  //       const productIds = orders.flatMap((order) =>
  //         order.products.map((product) => product.id)
  //       );

  //       const { data, error } = await supabase
  //         .from("product_variants")
  //         .select("*")
  //         .in("id", productIds);
  //       if (error) console.log(error);
  //       setOrderProducts(data);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };

  useEffect(() => {
    fetchOrdersWithProducts();
  }, []);

  const fetchOrdersWithProducts = async () => {
    try {
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
    }
  };
  console.log(orders);

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
                    <div>
                      <h5 className="capitalize text-[#171717] font-semibold">
                        {order.status}
                      </h5>
                      <p className="text-xs text-[#171717]">
                        On {order.deliveryDate}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-5 bg-[#F5F8FF] px-3 py-5 my-2">
                    <img
                      src={`${baseImageUrl}/${order.products[0]?.details.image}`}
                      alt=""
                      className="h-28 w-28 object-contain"
                    />
                    <div>
                      <h4 className="text-sm font-semibold text-[#171717] capitalize">
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
  );
}

export default Orders;

function OrderProducts({ order, handleProductView }) {
  const products = order.products;
  const shippingAddress = order.shippingAddress[0];
  console.log(order);

  return (
    <>
      <div className="px-4">
        <div className="bg-[#374A75] text-[#fff] px-4 py-1 rounded-md my-5">
          <p className="capitalize font-bold">{order.status}</p>
          <p className="text-xs ">On {order.deliveryDate}</p>
        </div>
        <div className="flex gap-10">
          <button className="flex-1 border border-[#213626] uppercase text-xs tracking-wider rounded-sm py-2 hover:bg-[#f9f9f9]">
            Cancle
          </button>
          <button className="flex-1 border border-[#213626] uppercase text-xs tracking-wider rounded-sm py-2 hover:bg-[#f9f9f9]">
            track
          </button>
        </div>

        <div className="space-y-4 my-4">
          {products.map((product) => (
            <div className="border border-[#374A75] px-3 py-4 rounded-md grid grid-cols-2 items-center">
              <div className="grid grid-cols-3 gap-7">
                <img
                  src={`${baseImageUrl}/${product.details.image}`}
                  alt={product.details.title}
                  className="h-24 w-24 object-contain"
                />
                <div className="space-y-2">
                  <h4 className="text-lg font-bold text-[#171717]">
                    {product.details.title}
                  </h4>
                  <p className="text-[#171717] text-sm">
                    {product.details.details}
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-[#171717] capitalize">
                    price
                  </h4>
                  <p className="text-[#171717] text-sm">{product.price}</p>
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
        <div className="p-5">
          <h5 className="capitalize text-[#171717] font-bold text-lg mb-3">
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
        <div className="space-y-3 p-5">
          <div className="flex justify-between items-center">
            <p className="capitalize text-[#171717] font-bold text-lg">
              total order price
            </p>
            <p className="font-bold">
              RS{" "}
              {order.finalPrice.toLocaleString("en-IN", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>
          <p className="text-[#374A75] capitalize font-bold flex items-center gap-5 bg-[#F9F9F9] p-2">
            <IoCashOutline /> Cash on delivery
          </p>
          <button className="text-[#374A75] font-bold text-sm capitalize border border-[#CCCCCC] w-full py-2.5 rounded-md hover:bg-[#f9f9f9]">
            get invoice{" "}
          </button>
        </div>

        <div className="p-5 text-sm font-bold">
          <p>Updates sent to</p>
          <p className="text-[#374A75] flex items-center gap-2 mt-2">
            <BsTelephone /> {shippingAddress.mobile}
          </p>
        </div>
        <div className="px-5 text-sm font-bold text-[#999]">
          <p>Order ID #{order.id}</p>
        </div>
      </div>
    </>
  );
}

function OrderProductView({ order, product }) {
  const shippingAddress = order?.shippingAddress[0];
  console.log(product);

  return (
    <div className="p-4 font-Poppins">
      <div className="flex gap-4">
        <div className="border border-[#374A75] rounded-md px-2 py-4 space-y-3">
          <img
            src={`${baseImageUrl}/${product.details.image}`}
            alt={product.details.title}
            className="h-52 w-52 object-contain place-self-center"
          />
          <h4 className="text-xl font-bold text-[#171717] text-center">
            {product.details.title}
          </h4>
          <p className="text-[#171717] text-sm line-clamp-1">
            {product.details.details}
          </p>
        </div>
        <div className="flex-1 flex flex-col justify-between">
          <div className="bg-[#374A75] text-[#fff] px-4 py-1 rounded-md ">
            <p className="capitalize font-bold">{order.status}</p>
            <p className="text-xs ">On {order.deliveryDate}</p>
          </div>
          <div>
            <h5 className="capitalize text-[#171717] font-bold text-lg mb-3">
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
              <p className="capitalize text-[#171717] font-bold text-lg">
                product price
              </p>
              <p className="font-bold">
                RS{" "}
                {order.finalPrice.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
          </div>
          <p className="text-[#374A75] capitalize font-bold flex items-center gap-5 bg-[#F9F9F9] p-2.5">
            <IoCashOutline /> Cash on delivery
          </p>
        </div>
      </div>
      <div className="p-5 ">
        <p className="text-sm font-bold text-[#999]">
          Item sold by : {product.details?.manufacturer}
        </p>
        <button className="text-[#374A75] font-bold text-sm capitalize border border-[#CCCCCC] w-full py-2.5 rounded-md hover:bg-[#f9f9f9]">
          get invoice{" "}
        </button>
      </div>
      <div className="p-5 text-sm font-bold">
        <p>Updates sent to</p>
        <p className="text-[#374A75] flex items-center gap-2 mt-2">
          <BsTelephone /> {shippingAddress.mobile}
        </p>
      </div>
      <div className="px-5 text-sm font-bold text-[#999]">
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
    <div className="flex items-center gap-2 text-xs text-[#374A75] mb-4">
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
