import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../services/supabase";

function OrderConfirm() {
  const { id: orderId } = useParams();

  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    async function getOrderDetails(id) {
      const { data, error } = await supabase
        .from("orders_table")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        setErrorMsg("Order not found");
        setLoading(false);
        return;
      }

      setOrder(data);
      setLoading(false);
    }

    if (orderId) {
      getOrderDetails(orderId);
    }
  }, [orderId]);

  if (loading)
    return <div className="flex justify-center items-center">Loading...</div>;
  if (errorMsg) return <p>{errorMsg}</p>;

  return (
    <div>
      <div className="flex justify-center items-center h-screen font-Poppins p-3">
        <div className="flex flex-col gap-3 md:gap-10 lg:max-w-screen-md">
          <div className="border rounded-lg px-5 py-2 md:px-10 md:py-5 flex flex-col items-center gap-3">
            <img
              src="/images/ecommerce/order-confirm.png"
              alt="order confirm"
            />
            <h1 className="text-3xl capitalize text-[#374A75] font-bold">
              order confirm
            </h1>
            <p className="text-[#374A75] text-center md:leading-8 text-sm md:text-base">
              Your order is confirmed. You will receive an order confirmation
              email/sms shortly with the expected delivery date for your items.
            </p>
          </div>
          {order && (
            <div className="border rounded-lg px-5 py-2 md:px-10 md:py-5 space-y-3 text-sm md:text-base">
              <p className="text-[#999999]">Delivering to:</p>
              <p className="text-[#000] font-bold font-TimesNewRoman">
                {order?.shipping_address[0]?.name}{" "}
                {order?.shipping_address[0]?.mobile}
              </p>
              <p className="text-[#000]">
                {" "}
                {order?.shipping_address[0]?.address}
              </p>
            </div>
          )}
          <div className="flex gap-10 px-5 md:px-10 text-sm md:text-base">
            <button
              onClick={() => navigate("/shop", { replace: true })}
              className="flex-1 py-2 uppercase text-[#374A75] tracking-wider border border-[#374A75] rounded-md flex justify-center items-center hover:bg-[#f1f1f1]"
            >
              continue shopping
            </button>
            <button
              onClick={() =>
                navigate("/dashboard", {
                  replace: true,
                  state: { openOrders: true },
                })
              }
              className="flex-1 py-2 uppercase text-[#fff] bg-[#374A75] tracking-wider border border-[#374A75] rounded-md flex justify-center items-center hover:bg-[#4C69A4]"
            >
              view order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderConfirm;
