import { useEffect, useState } from "react";
import { BsPatchCheckFill } from "react-icons/bs";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../services/supabase";

function OrderConfirm() {
  const { id: orderId } = useParams();

  const navigate = useNavigate();
  // const orderId = searchParams.get("id");

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    async function getOrderDetails(id) {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("id", id)
        .single(); // directly return one row

      console.log("order ", data);

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

  //   {
  //     "id": "7740d6fd-3380-4561-ad99-eb778585dfa1",
  //     "created_at": "2025-09-29T12:35:13.070564+00:00",
  //     "status": "approved",
  //     "products": [],
  //     "userId": "21e0b7e5-6276-4608-9f0f-0d0b0f802f46",
  //     "paymentDetails": {
  //         "state": "COMPLETED",
  //         "amount": 590000,
  //         "timestamp": 1759149356314,
  //         "paymentMode": "CARD",
  //         "transactionId": "OM2509291805139599387201",
  //         "splitInstruments": [
  //             {
  //                 "rail": {
  //                     "type": "PG",
  //                     "transactionId": "371129624",
  //                     "authorizationCode": "<authorizationCode>",
  //                     "serviceTransactionId": "PG2407031513566974223897"
  //                 },
  //                 "amount": 590000,
  //                 "instrument": {
  //                     "arn": "<arn>",
  //                     "brn": "<brn>",
  //                     "type": "CREDIT_CARD",
  //                     "bankId": "SBIN",
  //                     "geoScope": "DOMESTIC",
  //                     "cardNetwork": "VISA",
  //                     "maskedCardNumber": "XXXXXXXXXXXX6314",
  //                     "bankTransactionId": "<bankTransactionId>"
  //                 }
  //             }
  //         ]
  //     },
  //     "paymentMethod": "phonepe",
  //     "coupon": {
  //         "name": "",
  //         "discount": 0
  //     },
  //     "totalMRP": 5000,
  //     "finalPrice": 5900,
  //     "charges": {
  //         "GST": 900,
  //         "delivery": 0
  //     },
  //     "shippingAddress": [
  //         {
  //             "id": "c0845bc0-84c8-45c3-8ed9-17eac9500ad1",
  //             "city": "mumbai",
  //             "name": "yuvraj machadi",
  //             "town": "mumbai",
  //             "state": "MH",
  //             "mobile": "9594767165",
  //             "address": "makhija archade bandra west",
  //             "pincode": "400053",
  //             "ismarkedDefault": true
  //         }
  //     ],
  //     "deliveryDate": "2025-10-13"
  // }

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
                {order?.shippingAddress[0]?.name}{" "}
                {order?.shippingAddress[0]?.mobile}
              </p>
              <p className="text-[#000]">
                {" "}
                {order?.shippingAddress[0]?.address}
              </p>

              {/* <button className="uppercase text-[#374A75] tracking-wider px-4 py-2 border border-[#374A75] rounded-md hover:bg-[#f1f1f1]">
                order details
              </button>
              <hr />
              <div className="flex gap-2 items-center">
                <BsPatchCheckFill color="#374A75" />
                <p className="text-[#999]">
                  You can Track/View/Modify order from orders page.
                </p>
              </div> */}
            </div>
          )}
          <div className="flex gap-10 px-5 md:px-10 text-sm md:text-base">
            <button
              onClick={() => navigate("/shop")}
              className="flex-1 py-2 uppercase text-[#374A75] tracking-wider border border-[#374A75] rounded-md flex justify-center items-center hover:bg-[#f1f1f1]"
            >
              continue shopping
            </button>
            <button className="flex-1 py-2 uppercase text-[#fff] bg-[#374A75] tracking-wider border border-[#374A75] rounded-md flex justify-center items-center hover:bg-[#4C69A4]">
              view order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderConfirm;
