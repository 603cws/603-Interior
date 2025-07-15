import { BsCart2 } from "react-icons/bs";
import { FaRegUser } from "react-icons/fa6";
import { GoHeart } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../Context/Context";
import { FiMenu, FiX } from "react-icons/fi";
import { useEffect, useRef, useState } from "react";
import { useLogout } from "../../utils/HelperFunction";

function Header() {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showProfile, setshowProfile] = useState(false);
  const logout = useLogout();

  const profileRef = useRef(null);
  const buttonRef = useRef(null);

  const {
    cartItems,
    isAuthenticated,
    localcartItems,
    wishlistItems,
    accountHolder,
  } = useApp();

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setshowProfile(false);
      }
    }

    if (showProfile) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showProfile]);

  function checkLoggedIn() {
    if (isAuthenticated) {
      setshowProfile(!showProfile);
    } else {
      navigate("/login");
    }
  }

  return (
    <div className="md:container relative">
      {showProfile && (
        <div
          ref={profileRef}
          className="absolute right-2 top-14 md:right-24 xl:right-20 3xl:right-64 w-40 xl:w-56 mt-1 font-Poppins bg-white text-black rounded-xl shadow-[3px_0px_8px_#000] z-50"
        >
          <p className="px-4 py-3 font-semibold border-b border-[#CCCCCC]">
            {/* <span className="ml-2"> */}
            Hello {accountHolder?.companyName || "User Profile"}
            {/* </span> */}
          </p>
          <ul className="py-2 text-sm [&_li]:cursor-pointer">
            <li
              onClick={() => navigate("/profilePage")}
              className="flex items-center px-4 py-2 ml-2 hover:bg-[#f9f9f9]"
            >
              <img
                src="../images/ecommerce/icon6.svg"
                color="#ffffff"
                alt="Orders icon"
              />
              <span className="ml-2">View Profile</span>
            </li>
            <li className="flex items-center px-4 py-2 ml-2 hover:bg-[#f9f9f9]">
              <img
                src="../images/ecommerce/icon1.svg"
                color="#ffffff"
                alt="Orders icon"
              />
              <span className="ml-2">Orders</span>
            </li>
            <li
              className="flex items-center px-4 py-2 ml-2 hover:bg-[#f9f9f9]"
              onClick={() => navigate("/wishlist")}
            >
              <img src="../images/ecommerce/icon2.svg" alt="Wishlist icon" />
              <span className="ml-2">Wishlist</span>
            </li>
            <li className="flex items-center px-4 py-2 ml-2 hover:bg-[#f9f9f9]">
              <img src="../images/ecommerce/icon3.svg" alt="Gift Card icon" />
              <span className="ml-2">Gift Cards</span>
            </li>
            <li className="flex items-center px-4 py-2 ml-2 hover:bg-[#f9f9f9]">
              <img src="../images/ecommerce/icon4.svg" alt="Coupon icon" />
              <span className="ml-2">Coupons</span>
            </li>
            <li
              className="flex items-center px-4 py-2 hover:bg-[#f9f9f9] border-t border-[#CCCCCC] mt-2"
              onClick={logout}
            >
              <p className="ml-2">
                <img src="../images/ecommerce/icon5.svg" alt="Logout icon" />
              </p>
              <span className="ml-2">Logout</span>
            </li>
          </ul>
        </div>
      )}
      {/* desktop  */}
      <div className="hidden md:flex justify-between 3xl:justify-around bg-[#FFFFFF]  shadow-[0_4px_12px_rgba(0,0,0,0.1)] my-3 border px-5 xl:px-16">
        <div className="flex gap-20 py-5 ">
          <ul className="flex items-center uppercase gap-10 text-xs font-bold text-[#1A293A] [&_li]:cursor-pointer">
            <li onClick={() => navigate("/products")}>home</li>
            <li onClick={() => navigate("/shop")}>shop</li>
            <li onClick={() => navigate("/shop")}>brand</li>
            {/* <li onClick={() => navigate("/shop")}>contact us</li> */}
          </ul>
        </div>
        <button onClick={() => navigate("/")} className="">
          <img
            src="/logo/workved-interior.png"
            alt=""
            className="h-full w-28"
          />
        </button>
        <div className="flex items-center">
          <div className="flex gap-12 py-5">
            <button onClick={checkLoggedIn} ref={buttonRef}>
              <FaRegUser size={20} />
            </button>
            <button onClick={() => navigate("/wishlist")} className="relative">
              <GoHeart size={22} />
              <span className="absolute -top-1/4 -right-1/3 font-semibold text-[8px] bg-[#C16452] text-[#ffffff] rounded-full p-1 h-4 w-4 flex justify-center items-center">
                {wishlistItems?.length}
              </span>
            </button>
            <button className="relative" onClick={() => navigate("/cart")}>
              <BsCart2 size={23} />
              <span className="absolute -top-1/4 -right-1/3 font-semibold text-[8px] bg-[#C16452] text-[#ffffff] rounded-full p-1 h-4 w-4 flex justify-center items-center">
                {isAuthenticated ? cartItems?.length : localcartItems?.length}
              </span>
            </button>
          </div>
        </div>
      </div>
      {/* mobile view */}
      <div className="mx-3 flex md:hidden justify-between 3xl:justify-around bg-[#FFFFFF]  shadow-[0_4px_12px_rgba(0,0,0,0.1)] my-3 border px-5 xl:px-16">
        <div className="lg:hidden flex items-center">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? (
              <FiX className="size-7 text-[#1A3A36]" />
            ) : (
              <FiMenu className="size-7 text-[#1A3A36]" />
            )}
          </button>
        </div>

        <button onClick={() => navigate("/")} className="">
          <img
            src="/logo/workved-interior.png"
            alt=""
            className="h-full w-28"
          />
        </button>
        <div className="flex items-center">
          <div className="flex gap-4 py-5">
            <button>
              <FaRegUser size={20} onClick={checkLoggedIn} />
            </button>
            <button onClick={() => navigate("/wishlist")} className="relative">
              <GoHeart size={22} />
              <span className="absolute -top-1/4 -right-1/3 font-semibold text-[8px] bg-[#C16452] text-[#ffffff] rounded-full p-1 h-4 w-4 flex justify-center items-center">
                {wishlistItems?.length}
              </span>
            </button>
            <button className="relative" onClick={() => navigate("/cart")}>
              <BsCart2 size={23} />
              <span className="absolute -top-1/4 -right-1/3 font-semibold text-[8px] bg-[#C16452] text-[#ffffff] rounded-full p-1 h-4 w-4 flex justify-center items-center">
                {isAuthenticated ? cartItems?.length : localcartItems?.length}
              </span>
            </button>
          </div>
        </div>
      </div>
      {isMobileMenuOpen && (
        <div
          className={`absolute top-[80px] left-0 w-full z-50 bg-white border rounded-3xl p-5 transition-transform ease-in-out duration-500 transform animate-fade-in ${
            isMobileMenuOpen ? "translate-y-0" : "-translate-y-full"
          }`}
        >
          <div className="flex gap-20 py-5 ">
            <ul className="flex flex-col items-center uppercase gap-10 text-xs font-bold text-[#1A293A] [&_li]:cursor-pointer">
              <li onClick={() => navigate("/products")}>home</li>
              <li onClick={() => navigate("/shop")}>shop</li>
              <li onClick={() => navigate("/shop")}>brand</li>
              {/* <li onClick={() => navigate("/shop")}>contact us</li> */}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default Header;
