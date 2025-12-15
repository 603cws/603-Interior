import { useState, useEffect } from "react";
import { supabase } from "../../services/supabase";
import { BsBoxSeam, BsStars } from "react-icons/bs";
import { FaRegCircleUser, FaUser } from "react-icons/fa6";
import { MdKeyboardArrowRight, MdLogout, MdPayments } from "react-icons/md";
import { useApp } from "../../Context/Context";
import { useLogout } from "../../utils/HelperFunction";
import { IoCloseOutline } from "react-icons/io5";
import { CiStar } from "react-icons/ci";
import { useNavigate } from "react-router-dom";

import ProfileAddress from "../../Ecommerce-components/ProfileAddress";
import Header from "./Header";

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("personalInfo");
  const [addGiftCard, setAddGiftCard] = useState(false);
  const [allCoupons, setAllCoupons] = useState([]);

  const { accountHolder } = useApp();
  const logout = useLogout();
  const navigate = useNavigate();
  const getallthecouponsFromDB = async () => {
    try {
      const { data: coupon, error: fetchError } = await supabase
        .from("coupons")
        .select("*");

      setAllCoupons(coupon);

      if (fetchError) throw new Error(fetchError);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getallthecouponsFromDB();
  }, []);
  const today = new Date();
  const validCoupons = allCoupons.filter(
    (coupon) => new Date(coupon.expiryDate) >= today
  );
  const expiredCoupons = allCoupons.filter(
    (coupon) => new Date(coupon.expiryDate) < today
  );

  const TAB_COMPONENTS = {
    orders: (
      <div>
        <div className="font-Poppins p-5 shadow-[0px_0px_10px_rgba(0,0,0,0.1)] my-2">
          <div className="flex items-center gap-2">
            <CiStar size={50} color="#304778" />
            <div>
              <h5 className="capitalize text-[#171717] font-semibold">
                delivered
              </h5>
              <p className="text-xs text-[#171717]">On Mon, 30 Jun</p>
            </div>
          </div>
          <div className="flex items-center gap-5 bg-[#F5F8FF] px-3 py-5 my-2">
            <img
              src="/images/home/product-image.png"
              alt="product"
              className="h-28 w-24"
            />
            <div>
              <h4 className="text-sm font-semibold text-[#171717] capitalize">
                product name
              </h4>
              <p className="text-sm text-[#171717]">description</p>
            </div>
            <button className="ml-auto">
              <MdKeyboardArrowRight size={25} color="#304778" />
            </button>
          </div>
          <div className="bg-[#F5F8FF] p-3">
            <div className="flex gap-1">
              <CiStar size={20} color="#304778" />
              <CiStar size={20} color="#304778" />
              <CiStar size={20} color="#304778" />
              <CiStar size={20} color="#304778" />
              <CiStar size={20} color="#304778" />
            </div>
            <p className="capitalize text-xs text-[#304778] tracking-wider mt-3">
              rate & review
            </p>
          </div>
        </div>
      </div>
    ),

    personalInfo: (
      <form>
        <div className="flex w-full gap-10 my-10">
          <input
            type="text"
            value={accountHolder.companyName || ""}
            readOnly
            placeholder="Smita"
            className="border border-[#CCCCCC] p-3 flex-1 rounded-md focus:none outline-none text-[#aaa] cursor-not-allowed"
          />
        </div>

        <div className="mb-10 space-y-5">
          <label className="capitalize text-sm text-[#171717] font-semibold">
            email address
          </label>
          <input
            type="text"
            value={accountHolder.email || ""}
            readOnly
            placeholder="smita@gmail.com"
            className="border border-[#CCCCCC] p-3 w-full rounded-md focus:none outline-none text-[#aaa] cursor-not-allowed"
          />
        </div>

        <div className="mb-10 space-y-5">
          <label className="capitalize text-sm text-[#171717] font-semibold">
            mobile number
          </label>
          <input
            type="text"
            value={accountHolder.phone || ""}
            readOnly
            placeholder="9988776650"
            className="border border-[#CCCCCC] p-3 w-full rounded-md focus:none outline-none text-[#aaa] cursor-not-allowed"
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
    ),

    address: <ProfileAddress />,

    savedCards: (
      <div className="flex justify-center items-center h-full">
        <div>
          <img src="/images/no-saved-cards.png" alt="no saved cards" />
          <p className="text-[#304778] text-2xl font-semibold mt-10 text-center">
            No Card details found
          </p>
        </div>
      </div>
    ),

    giftCard: (
      <div>
        <div className="my-7">
          <button
            onClick={() => setAddGiftCard(true)}
            className="uppercase text-sm text-[#4F88FF] font-medium border border-[#E0E0E0] w-full py-3 text-start px-10"
          >
            + add a gift card
          </button>
        </div>
        <div>
          <h3 className="text-lg font-medium text-[#212121]">
            Buy a Workved Gift Card
          </h3>
          <hr className="my-7" />
          <p className="text-[#212121] text-sm underline underline-offset-4 decoration-[#7AA2FF] decoration-4">
            Buy Workved Gift Cards for Businesses
          </p>
          <div className="flex gap-10 bg-[#F5FAFF] px-4 py-10">
            <form
              action=""
              className="flex-1 flex flex-col gap-5 [&_input]:py-4 [&_input]:px-2 [&_input]:w-full [&_input]:border [&_input]:text-sm [&_input]:focus:none [&_input]:outline-none [&_input]:rounded-sm"
            >
              <input type="text" placeholder="Name*" />
              <input type="text" placeholder="Mobile Number*" />
              <input type="text" placeholder="Email ID*" />
              <input type="text" placeholder="Company Name" />
              <button
                type="submit"
                className="uppercase bg-[#334A78] border border-[#212B36] text-[#fff] w-full py-3 active:scale-90 transition-transform duration-300 ease-in-out text-[10px] tracking-widest rounded-sm"
              >
                submit
              </button>
            </form>
            <div className="flex-1">
              <img
                src="/images/workved-gift-card.png"
                alt="workved gift card"
              />
            </div>
          </div>
        </div>
        {addGiftCard && (
          <div className="fixed inset-0 bg-[#000]/30 flex justify-center items-center">
            <div className="max-w-xl w-full relative">
              <div className="absolute right-8 -top-1">
                <button onClick={() => setAddGiftCard(false)}>
                  <IoCloseOutline size={25} />
                </button>
              </div>
              <div className="max-w-lg w-full bg-white py-16 px-10">
                <h4 className="capitalize text-[#171717] font-semibold text-xl mb-1">
                  add a gift card
                </h4>
                <p className="text-sm text-[#171717] font-medium mb-5">
                  Gift Card number & PIN are sent to your email inbox
                </p>
                <div className="flex flex-col gap-5 [&_input]:py-4 [&_input]:px-2 [&_input]:w-full [&_input]:border [&_input]:text-sm [&_input]:focus:none [&_input]:outline-none [&_input]:rounded-sm">
                  <input type="text" placeholder="Gift Card Number*" />
                  <input type="text" placeholder="PIN*" />
                  <button
                    type="submit"
                    className="uppercase bg-[#334A78] border border-[#212B36] text-[#fff] w-full py-3 active:scale-90 transition-transform duration-300 ease-in-out text-sm tracking-widest rounded-sm"
                  >
                    ADD GIFT CARD TO ACCOUNT
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    ),

    myCoupons: (
      <>
        <div className="border">
          {validCoupons.map((coupon, index) => {
            return (
              <div
                onClick={() => navigate("/shop")}
                key={index}
                className="flex justify-between items-center px-3 py-6 cursor-pointer"
              >
                <div>
                  <h4 className="text-[#45D04C] font-semibold mb-3">
                    {coupon.couponName}
                  </h4>
                  <p className="text-sm text-[#171717]">
                    Extra {coupon.discountPerc}% Off (Valid till:{" "}
                    {coupon.expiryDate})
                  </p>
                </div>
                <div className="text-end">
                  <p className="text-sm font-medium text-[#777] mb-3">
                    Valid till {coupon.expiryDate}
                  </p>
                  <button className="text-[#7AA2FF] text-sm font-medium">
                    View T&C
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        <h3 className="capitalize text-sm text-[#171717] font-semibold my-5">
          Expired Coupons
        </h3>
        <div className="border">
          {expiredCoupons.map((coupon, index) => {
            return (
              <div
                key={index}
                className="flex justify-between items-center px-3 py-6"
              >
                <div>
                  <h4 className="text-[#777] font-semibold mb-3">
                    {coupon.couponName}
                  </h4>
                  <p className="text-sm text-[#171717]">
                    Extra {coupon.discountPerc}% Off (Expired on:{" "}
                    {coupon.expiryDate})
                  </p>
                </div>
                <div className="text-end">
                  <p className="text-sm font-medium text-[#777] mb-3">
                    Expired on {coupon.expiryDate}
                  </p>
                  <button className="text-[#7AA2FF] text-sm font-medium">
                    View T&C
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </>
    ),

    myWishlist: (
      <div className="flex justify-center items-center h-full">
        <div>
          <p className="text-[#304778] text-2xl font-semibold mt-10 text-center">
            No Wishlist found
          </p>
        </div>
      </div>
    ),
  };

  const getTabTitle = () => {
    switch (activeTab) {
      case "personalInfo":
        return "personal information";
      case "orders":
        return "all orders";
      case "address":
        return "manage address";
      case "savedCards":
        return "manage saved card";
      case "giftCard":
        return "workved gift card";
      case "myCoupons":
        return "All Coupons";
      case "myWishlist":
        return "My Wishlist";
      default:
        return "";
    }
  };

  const tabItemClass = (tabKey) =>
    `cursor-pointer pl-12 py-2 ${
      activeTab === tabKey
        ? "text-[#304778] font-semibold bg-[#F5F8FF] "
        : "text-[#777]"
    }`;

  return (
    <div>
      <Header />
      <div className="max-w-screen-xl w-full mx-auto flex items-stretch gap-7 font-Poppins pt-5">
        {/* sidebar */}
        <div className="max-w-xs w-full">
          <div className="flex gap-4 py-5 mb-3 px-5 shadow-[0px_0px_10px_rgba(0,0,0,0.1)]">
            <FaRegCircleUser size={30} color="#304778" />
            <p className="capitalize text-xs font-medium tracking-wider">
              Hello <br /> {accountHolder?.companyName || "User"}
            </p>
          </div>

          <div className="shadow-[0px_0px_10px_rgba(0,0,0,0.1)] py-px">
            <div
              className={`capitalize flex justify-between items-center py-4 px-5 ${
                activeTab === "orders" ? "bg-[#F5F8FF]" : ""
              }`}
            >
              <div
                onClick={() => setActiveTab("orders")}
                className="flex items-center gap-4"
              >
                <BsBoxSeam size={30} color="#304778" />
                <p className="text-base tracking-wider font-medium text-[#777] cursor-pointer">
                  my orders
                </p>
              </div>
              <MdKeyboardArrowRight color="#304778" />
            </div>

            <hr />
            <div className="capitalize tracking-wider font-medium my-4 px-5">
              <div className="flex gap-4 items-center">
                <FaUser size={30} color="#304778" />
                <p className="text-base text-[#777]">account setting</p>
              </div>
              <ul className="text-xs pl-0 space-y-0 my-2">
                <li
                  className={tabItemClass("personalInfo")}
                  onClick={() => setActiveTab("personalInfo")}
                >
                  Profile Information
                </li>
                <li
                  className={tabItemClass("address")}
                  onClick={() => setActiveTab("address")}
                >
                  Manage Address
                </li>
              </ul>
            </div>

            <hr />
            <div className="capitalize tracking-wider font-medium my-4 px-5">
              <div className="flex gap-4 items-center">
                <MdPayments size={30} color="#304778" />
                <p className="text-base text-[#777]">Payment</p>
              </div>
              <ul className="text-xs my-2">
                <li
                  className={tabItemClass("giftCard")}
                  onClick={() => setActiveTab("giftCard")}
                >
                  Gift Card
                </li>
                <li
                  className={tabItemClass("savedCards")}
                  onClick={() => setActiveTab("savedCards")}
                >
                  Saved Card
                </li>
              </ul>
            </div>

            <hr />
            <div className="capitalize tracking-wider font-medium my-4 px-5">
              <div className="flex gap-4 items-center">
                <BsStars size={30} color="#304778" />
                <p className="text-base text-[#777]">My Items</p>
              </div>
              <ul className="text-xs my-2">
                <li
                  className={tabItemClass("myCoupons")}
                  onClick={() => setActiveTab("myCoupons")}
                >
                  My Coupon
                </li>
                <li
                  className={tabItemClass("myWishlist")}
                  onClick={() => setActiveTab("myWishlist")}
                >
                  My Wishlist
                </li>
              </ul>
            </div>
            <hr />
            <div
              className="capitalize flex gap-4 items-center my-5 px-5 cursor-pointer"
              onClick={logout}
            >
              <MdLogout size={30} color="#304778" />
              <p className="text-base tracking-wider font-medium text-[#777]">
                logout
              </p>
            </div>
          </div>
        </div>

        {/* right panel */}
        <div className="flex-1 py-5 px-5 shadow-[0px_0px_10px_rgba(0,0,0,0.1)] max-h-[85vh] overflow-y-auto scrollbar-hide">
          <h3 className="capitalize text-sm text-[#171717] font-semibold mb-5">
            {getTabTitle()}
          </h3>
          {TAB_COMPONENTS[activeTab] || null}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
