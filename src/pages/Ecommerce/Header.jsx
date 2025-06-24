import { BsCart2 } from "react-icons/bs";
import { FaRegUser } from "react-icons/fa6";
import { GoHeart } from "react-icons/go";
import { IoIosSearch } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../Context/Context";
import { FiMenu, FiX } from "react-icons/fi";
import { useState } from "react";

function Header() {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { cartItems, isAuthenticated, localcartItems, wishlistItems } =
    useApp();
  return (
    <div className="md:container">
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
            <button>
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
