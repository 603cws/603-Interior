import React from "react";
import { BsPatchCheckFill } from "react-icons/bs";

function OrderConfirm() {
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
          <div className="border rounded-lg px-5 py-2 md:px-10 md:py-5 space-y-3 text-sm md:text-base">
            <p className="text-[#999999]">Delivering to:</p>
            <p className="text-[#000] font-bold font-TimesNewRoman">
              Name 9879845646
            </p>
            <p className="text-[#000]">Address</p>

            <button className="uppercase text-[#374A75] tracking-wider px-4 py-2 border border-[#374A75] rounded-md hover:bg-[#f1f1f1]">
              order details
            </button>
            <hr />
            <div className="flex gap-2 items-center">
              <BsPatchCheckFill color="#374A75" />
              <p className="text-[#999]">
                You can Track/View/Modify order from orders page.
              </p>
            </div>
          </div>
          <div className="flex gap-10 px-5 md:px-10 text-sm md:text-base">
            <button className="flex-1 py-2 uppercase text-[#374A75] tracking-wider border border-[#374A75] rounded-md flex justify-center items-center hover:bg-[#f1f1f1]">
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
