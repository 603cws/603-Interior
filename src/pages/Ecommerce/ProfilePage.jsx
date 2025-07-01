import { useState } from "react";
import { BsBoxSeam, BsStars } from "react-icons/bs";
import { FaRegCircleUser, FaUser } from "react-icons/fa6";
import { MdKeyboardArrowRight, MdLogout, MdPayments } from "react-icons/md";
import {
  PiDotsThreeCircleVerticalBold,
  PiDotsThreeVerticalBold,
} from "react-icons/pi";

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("personalInfo");

  return (
    <div>
      <div className="max-w-screen-xl w-full mx-auto flex items-stretch gap-7 font-Poppins py-5">
        {/* sidebar */}
        <div className="max-w-xs w-full">
          <div className="flex gap-4 py-5 mb-3 px-5 shadow-[0px_0px_10px_rgba(0,0,0,0.1)]">
            <FaRegCircleUser size={30} color="#304778" />
            <p className="capitalize text-xs font-medium tracking-wider">
              {" "}
              Hello <br /> smita n
            </p>
          </div>
          <div className="shadow-[0px_0px_10px_rgba(0,0,0,0.1)] py-5">
            <div className="capitalize flex justify-between items-center my-5 px-5">
              <div
                onClick={() => setActiveTab("orders")}
                className="flex items-center gap-4"
              >
                <BsBoxSeam size={30} color="#304778" />
                <p className="text-base tracking-wider font-medium text-[#777]">
                  my orders
                </p>
              </div>
              <MdKeyboardArrowRight color="#304778" />
            </div>
            <hr />
            <div className="capitalize tracking-wider font-medium my-5 px-5">
              <div className="flex gap-4 items-center ">
                <FaUser size={30} color="#304778" />
                <p className="text-base text-[#777]">account setting </p>
              </div>
              <ul className="text-xs pl-12 space-y-4 my-4">
                <li onClick={() => setActiveTab("personalInfo")}>
                  Profile Information
                </li>
                <li onClick={() => setActiveTab("address")}>Manage Address</li>
              </ul>
            </div>
            <hr />
            <div className="capitalize tracking-wider font-medium my-5 px-5">
              <div className="flex gap-4 items-center ">
                <MdPayments size={30} color="#304778" />
                <p className="text-base text-[#777]">Payment </p>
              </div>
              <ul className="text-xs pl-12 space-y-4 my-4">
                <li onClick={() => setActiveTab("giftCard")}>Gift Card</li>
                <li onClick={() => setActiveTab("savedCards")}>Saved Card</li>
              </ul>
            </div>
            <hr />
            <div className="capitalize tracking-wider font-medium my-5 px-5">
              <div className="flex gap-4 items-center ">
                <BsStars size={30} color="#304778" />
                <p className="text-base text-[#777]">My Items </p>
              </div>
              <ul className="text-xs pl-12 space-y-4 my-4">
                <li>My Coupon</li>
                <li>My Wishlist</li>
              </ul>
            </div>
            <hr />
            <div className="capitalize flex gap-4 items-center my-5 px-5">
              <MdLogout size={30} color="#304778" />
              <p className="text-base tracking-wider font-medium text-[#777]">
                logout
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 py-5 px-5 shadow-[0px_0px_10px_rgba(0,0,0,0.1)]">
          <h3 className="capitalize text-sm text-[#171717] font-semibold">
            {activeTab === "personalInfo" && "personal information"}
            {activeTab === "orders" && "my orders"}
            {activeTab === "address" && "manage address"}
            {activeTab === "savedCards" && "manage saved card"}
            {activeTab === "giftCard" && "workved gift card"}
          </h3>
          {activeTab === "orders" && <div>orders page here</div>}
          {activeTab === "personalInfo" && (
            <form>
              <div className="flex w-full gap-10 my-10">
                <input
                  type="text"
                  placeholder="Smita"
                  className="border border-[#CCCCCC] p-3 flex-1 rounded-md focus:none outline-none"
                />
                <input
                  type="text"
                  placeholder="N"
                  className="border border-[#CCCCCC] p-3 flex-1 rounded-md  focus:none outline-none"
                />
              </div>
              <div className="mb-10 space-y-5">
                <label className="capitalize text-sm text-[#171717] font-semibold">
                  your gender
                </label>
                <div className="text-[#AAA] capitalize flex gap-10">
                  <div className="flex gap-2">
                    <input type="radio" name="male" id="male" />
                    <label htmlFor="radio">male</label>
                  </div>
                  <div className="flex gap-2">
                    <input type="radio" name="female" id="female" />
                    <label htmlFor="radio">female</label>
                  </div>
                </div>
              </div>
              <div className="mb-10 space-y-5">
                <label className="capitalize text-sm text-[#171717] font-semibold">
                  email address
                </label>
                <input
                  type="text"
                  placeholder="smita@gmail.com"
                  className="border border-[#CCCCCC] p-3 w-full rounded-md  focus:none outline-none"
                />
              </div>

              <div className="mb-10 space-y-5">
                <label className="capitalize text-sm text-[#171717] font-semibold">
                  mobile number
                </label>
                <input
                  type="text"
                  placeholder="9988776650"
                  className="border border-[#CCCCCC] p-3 w-full rounded-md  focus:none outline-none"
                />
              </div>

              <div className="px-7">
                <button
                  type="submit"
                  className="uppercase bg-[#334A78] border border-[#212B36] text-[#fff] w-full py-2 active:scale-90 transition-transform duration-300 ease-in-out"
                >
                  edit
                </button>
              </div>
            </form>
          )}
          {activeTab === "address" && (
            <div>
              <div className="border-2 border-[#ccc] rounded-md p-10 flex justify-between my-10">
                <div>
                  <h4 className="text-sm font-medium capitalize text-[#000]">
                    name
                  </h4>
                  <p className="text-xs text-[#000]/60 leading-6">
                    Makhija Arcade, 35th Rd, Khar,
                    <br /> Khar West, Mumbai, Maharashtra 400052
                  </p>
                  <div className="flex text-xs leading-8">
                    <p className="text-[#000]/60">mobile:</p>
                    <p className="text-[#000]">9876543210</p>
                  </div>
                </div>
                <div className="relative group inline-block">
                  <button className="self-start">
                    <PiDotsThreeVerticalBold />
                  </button>
                  <div className="absolute right-0 opacity-0 group-hover:opacity-100">
                    <ul className="capitalize text-xs">
                      <li>edit</li>
                      <li>delete</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "savedCards" && (
            <div className="flex justify-center items-center h-full">
              <div>
                <img src="/images/no-saved-cards.png" alt="no saved cards" />
                <p className="text-[#304778] text-2xl font-semibold mt-10 text-center">
                  No Card details found
                </p>
              </div>
            </div>
          )}

          {activeTab === "giftCard" && (
            <div>
              <div>
                <button className="uppercase text-sm text-[#4F88FF] font-medium border border-[#E0E0E0] w-full py-3 text-start px-10">
                  + add a gift card
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
