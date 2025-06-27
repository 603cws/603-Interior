import React, { useState } from "react";
import Header from "./Header";
import { RiDiscountPercentLine } from "react-icons/ri";
import { LuDot } from "react-icons/lu";
import { useApp } from "../../Context/Context";
import { MdKeyboardArrowDown } from "react-icons/md";
import { CiStar } from "react-icons/ci";
import { IoCashOutline } from "react-icons/io5";
import { BsBank } from "react-icons/bs";
import { PiCreditCard } from "react-icons/pi";
import { FiGift } from "react-icons/fi";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import BottomTabs from "./BottomTabs";
import { PlaceOrderBtn } from "../../common-components/ReadMoreBtn";
import CheckoutStepper from "../../common-components/CheckoutStepper";
import MobileHeader from "../../common-components/MobileHeader";

function Payments() {
  const { cartItems } = useApp();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("cod");
  const [activeListItem, setActiveListItem] = useState("recommended");
  const [isChecked, setIsChecked] = useState(false);
  const [upiMethod, setUpiMethod] = useState("");
  const [upiId, setUpiId] = useState("");
  const [cvv, setCvv] = useState("");
  const [showCvv, setShowCvv] = useState(false);
  const [selectedBank, setSelectedBank] = useState("");

  const totalPrice = cartItems?.reduce(
    (acc, curr) => acc + curr.productId?.price * curr.quantity,
    0
  );
  const paymentOptions = [
    {
      id: "recommended",
      label: "Recommended",
      icon: <CiStar color="#334A78" size={22} className="w-6" />,
      target: "cod",
    },
    {
      id: "cod",
      label: "Cash On Delivery (Cash/UPI)",
      icon: <IoCashOutline color="#334A78" size={20} className="w-6" />,
    },
    {
      id: "upi",
      label: "UPI (Pay via any App)",
      icon: <img src="/images/icons/upi-logo.svg" alt="" className="w-6" />,
    },
    {
      id: "card",
      label: "Credit/Debit Card",
      icon: <PiCreditCard color="#334A78" size={22} className="w-6" />,
    },
    {
      id: "netbanking",
      label: "Net Banking",
      icon: <BsBank color="#334A78" size={20} className="w-6" />,
    },
  ];

  const handleSelect = (item) => {
    setActiveListItem(item.id);
    if (item.id === "recommended") {
      setSelectedPaymentMethod("cod");
    } else {
      setSelectedPaymentMethod(item.id);
    }
    setIsChecked(false);
  };
  const selectedOption = paymentOptions.find(
    (opt) => opt.id === selectedPaymentMethod
  );

  const handleCvvChange = (e) => {
    const value = e.target.value;
    if (/^\d{0,3}$/.test(value)) {
      setCvv(value);
    }
  };

  return (
    <>
      <div className="hidden lg:block">
        <Header />
      </div>
      <div className="lg:hidden">
        <MobileHeader title={"payment"} />
      </div>
      <div className="lg:container lg:mx-auto px-3 lg:px-12">
        {/* <div className="!my-10 flex items-center justify-center text-[#334A78] text-lg capitalize font-Poppins leading-[16.8px]">
          <div className="flex items-center gap-2">
            <p className="text-[#334A78]">cart</p>
            <hr className="border-t-2 border-dashed border-[#334A78] h-1 w-24 " />
            <p>Address</p>
            <hr className="border-t-2 border-dashed border-[#334A78] h-1 w-24 " />
            <p className="text-[#549DC7]">Payment</p>
          </div>
        </div> */}

        <div className="hidden lg:block">
          <CheckoutStepper highlighted={"Payment"} />
        </div>

        <section className="flex flex-col lg:flex-row  lg:gap-10 lg:py-10 mb-14 lg:mb-0">
          <div className="flex-1">
            <div className="border border-[#CCCCCC] rounded-lg font-Poppins p-2 lg:p-5 space-y-3">
              <div className="flex items-center gap-5">
                <RiDiscountPercentLine size={20} color="#334A78" />
                <h5 className="text-sm font-medium text-[#000000]">
                  Bank Offer
                </h5>
              </div>
              <div className="flex items-center">
                <LuDot />
                <p className="text-[10px] text-[#000000]/60">
                  10% Instant Discount on Axis Bank Credit Cards, Flipkart Axis
                  Bank Credit Card & Axis Bank Credit Card EMI on a min spend of
                  ₹3,500. TCA
                </p>
              </div>
              <button className="text-[#334A78] font-semibold leading-7 text-xs capitalize flex items-center gap-1">
                show more
                <MdKeyboardArrowDown size={15} />
              </button>
            </div>
            <div className="font-Poppins">
              <h3 className="text-xs lg:text-sm font-medium lg:leading-7 text-[#000000] my-5">
                {" "}
                Choose Payment Mode
              </h3>
              <div className="flex flex-col lg:flex-row gap-4 lg:gap-5 border border-[#CCCCCC] rounded-lg p-1">
                <div>
                  <ul className="[&_li]:cursor-pointer  [&_li]:py-4 [&_li]:px-5 text-sm font-medium text-[#000000]">
                    {/* <ul className="[&_li]:cursor-pointer [&_li]:py-2 [&_li]:px-3 lg:[&_li]:py-4 lg:[&_li]:px-5 text-sm font-medium text-[#000000]"> */}
                    {paymentOptions.map(
                      (option, index) => (
                        console.log(option.id),
                        (
                          <li
                            key={option.id}
                            onClick={() => handleSelect(option)}
                            className={`flex items-center gap-2 border-t-2 text-xs border-l-4 ${
                              index === 0 ? "border-t-0" : ""
                            } ${
                              activeListItem === option.id
                                ? "bg-white  border-l-[#334A78] border-t-0"
                                : "bg-[#cccccc] border-l-[#cccccc]"
                            }`}
                          >
                            {option.icon}
                            <p>{option.label}</p>
                          </li>
                        )
                      )
                    )}
                  </ul>
                </div>

                <div className="flex-1 lg:space-y-3 lg:p-3">
                  <h3 className="text-xs lg:text-sm font-medium lg:leading-7 text-[#000000]">
                    {activeListItem === "recommended"
                      ? "Recommended Payment Option"
                      : `${selectedOption?.label}`}
                  </h3>

                  {selectedOption.id === "cod" && (
                    <>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => setIsChecked(!isChecked)}
                          />
                          <h3 className="text-xs font-bold leading-7 text-[#000000]">
                            {/* <h3 className="text-xs font-bold lg:leading-7 text-[#000000]"> */}
                            {selectedOption.label}
                          </h3>
                        </div>
                        <div className="border border-[#cccccc] rounded-full p-1 w-7 h-7 flex justify-center items-center">
                          {selectedOption.icon}
                        </div>
                      </div>
                      {isChecked && (
                        // <button className="bg-[#334A78] border border-[#212B36] text-sm text-white tracking-wider w-full uppercase py-2 active:scale-90 transition-transform ease-in-out duration-500 ">
                        //   Place Order
                        // </button>
                        <PlaceOrderBtn title="Place Order" />
                      )}
                    </>
                  )}

                  {selectedOption.id === "upi" && (
                    <>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 lg:gap-5 mb-2 lg:mb-0">
                          <input
                            type="radio"
                            name="upiOption"
                            checked={upiMethod === "scan"}
                            onChange={() => setUpiMethod("scan")}
                          />
                          <div className="border border-[#cccccc] rounded-full p-1 w-7 h-7 flex justify-center items-center">
                            {selectedOption.icon}
                          </div>
                          <p className="text-[10px] text-[#334A78] font-Poppins">
                            Scan & Pay
                          </p>
                        </div>
                      </div>

                      {upiMethod === "scan" && (
                        // <button className="bg-[#334A78] border border-[#212B36] text-sm text-white tracking-wider w-full uppercase py-1.5">
                        //   Pay now
                        // </button>
                        <PlaceOrderBtn title="Pay Now" />
                      )}

                      <div className="flex gap-4 lg:gap-5 items-center mt-3 mb-2 lg:mb-0">
                        <input
                          type="radio"
                          name="upiOption"
                          checked={upiMethod === "upiId"}
                          onChange={() => setUpiMethod("upiId")}
                        />
                        <div className="border border-[#cccccc] rounded-full p-1 w-7 h-7 flex justify-center items-center">
                          {selectedOption.icon}
                        </div>
                        <p className="text-[10px] text-[#334A78]">
                          Enter UPI ID
                        </p>
                      </div>

                      {upiMethod === "upiId" && (
                        <>
                          <input
                            type="text"
                            name="upiId"
                            id="upiId"
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            placeholder="Enter UPI ID"
                            className="border text-[10px] w-full p-3 lg:p-2 mt-2 mb-2 lg:mb-0 [&::-webkit-inner-spin-button]:appearance-none  focus:outline-none focus:ring-0"
                          />
                          {/* <button
                            disabled={!upiId.trim()}
                            className="bg-[#334A78] border border-[#212B36] text-sm text-white tracking-wider w-full uppercase py-1.5 mt-1 disabled:opacity-50"
                          >
                            Pay now
                          </button> */}
                          <PlaceOrderBtn
                            title="Pay Now"
                            disabled={!upiId.trim()}
                          />
                        </>
                      )}
                    </>
                  )}

                  {selectedOption.id === "card" && (
                    <>
                      <div>
                        <form
                          action=""
                          className="[&_input]:border [&_input]:py-3 [&_input]:text-xs [&_input]:px-1.5  space-y-4"
                          // className="[&_input]:border [&_input]:py-1 [&_input]:px-1 lg:[&_input]:py-3 [&_input]:text-xs lg:[&_input]:px-1.5  space-y-2 lg:space-y-4"
                        >
                          <input
                            type="text"
                            name="cardNumber"
                            id="cardNumber"
                            placeholder="card number"
                            className="w-full capitalize [&::-webkit-inner-spin-button]:appearance-none  focus:outline-none focus:ring-0"
                          />
                          <input
                            type="text"
                            name="name"
                            id="name"
                            placeholder="name on card"
                            className="w-full capitalize [&::-webkit-inner-spin-button]:appearance-none  focus:outline-none focus:ring-0"
                          />
                          <div className="w-full flex gap-3">
                            <input
                              type="date"
                              name="expiry"
                              id="expiry"
                              placeholder="expiry date"
                              className="flex-1 [&::-webkit-inner-spin-button]:appearance-none  focus:outline-none focus:ring-0"
                            />
                            <div className="relative flex-1">
                              <input
                                type={showCvv ? "text" : "password"}
                                name="cvv"
                                id="cvv"
                                placeholder="CVV"
                                value={cvv}
                                onChange={handleCvvChange}
                                className="w-full uppercase pr-8 pl-2 py-2 border border-gray-300 focus:outline-none focus:ring-0 [&::-webkit-inner-spin-button]:appearance-none"
                              />
                              <button
                                type="button"
                                onClick={() => setShowCvv(!showCvv)}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                              >
                                {showCvv ? (
                                  <IoEyeOffOutline size={18} />
                                ) : (
                                  <IoEyeOutline size={18} />
                                )}
                              </button>
                            </div>
                          </div>
                          {/* <button
                            type="submit"
                            className="bg-[#334A78] border border-[#212B36] text-sm text-white tracking-wider w-full uppercase py-1.5"
                          >
                            Pay now
                          </button> */}
                          <PlaceOrderBtn title="pay now" />
                        </form>
                      </div>
                    </>
                  )}

                  {selectedOption.id === "netbanking" && (
                    <>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-5">
                          <input
                            type="radio"
                            name="bank"
                            value="Axis Bank"
                            checked={selectedBank === "Axis Bank"}
                            onChange={(e) => setSelectedBank(e.target.value)}
                          />
                          <div className="border border-[#cccccc] rounded-full p-1 w-7 h-7 flex justify-center items-center">
                            <img src="/images/icons/axis-logo.svg" alt="" />
                          </div>
                          <h4 className="text-[10px] text-[#334A78] font-Poppins ">
                            Axis Bank
                          </h4>
                        </div>
                      </div>
                      <div className="flex items-center gap-5 mb-2">
                        <input
                          type="radio"
                          name="bank"
                          value="HDFC Bank"
                          checked={selectedBank === "HDFC Bank"}
                          onChange={(e) => setSelectedBank(e.target.value)}
                        />
                        <div className="border border-[#cccccc] rounded-full p-1 w-7 h-7 flex justify-center items-center">
                          <img src="/images/icons/hdfc-logo.svg" alt="" />
                        </div>
                        <h4 className="text-[10px] text-[#334A78] font-Poppins ">
                          HDFC Bank
                        </h4>
                      </div>

                      <div className="mb-3">
                        <select
                          value={selectedBank}
                          onChange={(e) => setSelectedBank(e.target.value)}
                          className="w-full border border-[#cccccc] p-2 text-xs [&::-webkit-inner-spin-button]:appearance-none  focus:outline-none focus:ring-0"
                        >
                          <option value="">Select Other Bank</option>
                          <option value="ICICI Bank">ICICI Bank</option>
                          <option value="SBI Bank">SBI Bank</option>
                          <option value="Yes Bank">Yes Bank</option>
                        </select>
                      </div>

                      {selectedBank && (
                        // <button className="bg-[#334A78] border border-[#212B36] text-sm text-white tracking-wider w-full uppercase py-1.5">
                        //   Pay now
                        // </button>
                        <PlaceOrderBtn title="pay now" />
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center font-Poppins border rounded-lg my-7 py-3 px-3 lg:px-5">
              <div className="flex items-center gap-2">
                <FiGift color="#334A78" className="w-6" />
                <h4 className="text-sm font-medium text-[#000000]  lg:leading-7">
                  Having a Gift Card?
                </h4>
              </div>
              <button className="uppercase text-sm font-semibold lg:leading-7 text-[#334A78]">
                APPLY GIFT CARD
              </button>
            </div>
          </div>

          <div className="flex-1 lg:border-l-[1px] lg:pl-10">
            <h4 className="uppercase mb-3 lg:mb-7">
              price details ({cartItems?.length} Items)
            </h4>
            <div className="space-y-3 lg:space-y-6 pb-3 lg:pb-6">
              <div className="flex justify-between">
                <h5 className="font-medium text-base text-[#111111]/80">
                  Total MRP
                </h5>
                <h5 className="font-medium text-base text-[#111111]/80 ">
                  Rs {totalPrice || 0}
                </h5>
              </div>

              <div className="flex justify-between">
                <h5 className="font-medium text-base text-[#111111]/80">
                  Discount on MRP
                </h5>
                <h5 className="font-medium text-base text-[#34BFAD]/80 ">
                  -Rs 0
                </h5>
              </div>

              <div className="flex justify-between">
                <h5 className="font-medium text-base text-[#111111]/80">
                  Coupon Discount
                </h5>
                <h5 className="font-medium text-base text-[#F87171]">
                  Apply Coupon
                </h5>
              </div>

              <div className="flex justify-between border-b-[1px]">
                <div>
                  <h5 className="font-medium text-base text-[#111111]/80">
                    Shipping Fee
                  </h5>
                  <p className="text-xs text-[#111111]/50 font-medium pb-2">
                    Free Shipping for you
                  </p>
                </div>
                <h5 className="font-medium text-base text-[#34BFAD]/80 uppercase">
                  Free
                </h5>
              </div>

              <div className="flex justify-between">
                <h5 className="font-medium text-lg lg:text-xl text-[#111111] uppercase">
                  Total Amount
                </h5>
                <h5 className="font-medium text-lg lg:text-xl text-[#111111] ">
                  $3,196
                </h5>
              </div>
            </div>

            {/* <button className="uppercase text-xl text-[#ffffff] tracking-wider w-full flex justify-center items-center bg-[#334A78] border border-[#212B36] py-3 rounded-sm font-thin">
              place ORDER
            </button> */}
            <div className="hidden lg:block">
              <PlaceOrderBtn title="place order" />
            </div>
          </div>
        </section>
      </div>
      <div className="hidden lg:block">
        <BottomTabs />
      </div>
      <div className="lg:hidden fixed bottom-0 left-0 w-full flex justify-center items-center mb-2">
        <div className="w-[90%]">
          <button className="uppercase text-xl text-white tracking-wider w-full bg-[#334A78] border border-[#212B36] py-3 rounded-sm font-thin">
            pay now
          </button>
        </div>
      </div>
    </>
  );
}

export default Payments;
