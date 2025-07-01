import { useState } from "react";
import { BsBoxSeam, BsStars } from "react-icons/bs";
import { FaRegCircleUser, FaUser } from "react-icons/fa6";
import { MdKeyboardArrowRight, MdLogout, MdPayments } from "react-icons/md";
import { PiDotsThreeVerticalBold } from "react-icons/pi";
import { useApp } from "../../Context/Context";
import { useLogout } from "../../utils/HelperFunction";
import { IoCloseOutline } from "react-icons/io5";

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("personalInfo");
  const [addGiftCard, setAddGiftCard] = useState(false);

  const { accountHolder } = useApp();
  const logout = useLogout();

  const TAB_COMPONENTS = {
    orders: <div>orders page here</div>,

    personalInfo: (
      <form>
        <div className="flex w-full gap-10 my-10">
          <input
            type="text"
            value={accountHolder.companyName || ""}
            placeholder="Smita"
            className="border border-[#CCCCCC] p-3 flex-1 rounded-md focus:none outline-none"
          />
        </div>

        <div className="mb-10 space-y-5">
          <label className="capitalize text-sm text-[#171717] font-semibold">
            email address
          </label>
          <input
            type="text"
            value={accountHolder.email || ""}
            placeholder="smita@gmail.com"
            className="border border-[#CCCCCC] p-3 w-full rounded-md focus:none outline-none"
          />
        </div>

        <div className="mb-10 space-y-5">
          <label className="capitalize text-sm text-[#171717] font-semibold">
            mobile number
          </label>
          <input
            type="text"
            value={accountHolder.phone || ""}
            placeholder="9988776650"
            className="border border-[#CCCCCC] p-3 w-full rounded-md focus:none outline-none"
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

    address: (
      <div className="border-2 border-[#ccc] rounded-md p-10 flex justify-between my-10">
        <div>
          <h4 className="text-sm font-medium capitalize text-[#000]">name</h4>
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
    ),

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
              <img src="/images/workved-gift-card.png" alt="" />
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
      <div className="flex justify-center items-center h-full">
        <div>
          {/* <img src="/images/no-saved-cards.png" alt="no saved cards" /> */}
          <p className="text-[#304778] text-2xl font-semibold mt-10 text-center">
            No Coupons found
          </p>
        </div>
      </div>
    ),

    myWishlist: (
      <div className="flex justify-center items-center h-full">
        <div>
          {/* <img src="/images/no-saved-cards.png" alt="no saved cards" /> */}
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
        return "my orders";
      case "address":
        return "manage address";
      case "savedCards":
        return "manage saved card";
      case "giftCard":
        return "workved gift card";
      case "myCoupons":
        return "Coupons";
      case "myWishlist":
        return "My Wishlist";
      default:
        return "";
    }
  };

  const tabItemClass = (tabKey) =>
    `cursor-pointer pl-12 py-3 ${
      activeTab === tabKey
        ? "text-[#304778] font-semibold bg-[#F5F8FF] "
        : "text-[#777]"
    }`;

  return (
    <div>
      <div className="max-w-screen-xl w-full mx-auto flex items-stretch gap-7 font-Poppins py-5">
        {/* sidebar */}
        <div className="max-w-xs w-full">
          <div className="flex gap-4 py-5 mb-3 px-5 shadow-[0px_0px_10px_rgba(0,0,0,0.1)]">
            <FaRegCircleUser size={30} color="#304778" />
            <p className="capitalize text-xs font-medium tracking-wider">
              Hello <br /> {accountHolder?.companyName || "User"}
            </p>
          </div>

          <div className="shadow-[0px_0px_10px_rgba(0,0,0,0.1)] py-px">
            <div className="capitalize flex justify-between items-center my-2 px-5">
              <div
                onClick={() => setActiveTab("orders")}
                className="flex items-center gap-4"
              >
                <BsBoxSeam size={30} color="#304778" />
                <p className={tabItemClass("orders")}>my orders</p>
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
        <div className="flex-1 py-5 px-5 shadow-[0px_0px_10px_rgba(0,0,0,0.1)]">
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
