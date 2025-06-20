import { BsCart2 } from "react-icons/bs";
import { FaRegUser } from "react-icons/fa6";
import { GoHeart } from "react-icons/go";
import { IoIosSearch } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../Context/Context";

function Header() {
  const navigate = useNavigate();

  const { cartItems, isAuthenticated, localcartItems, wishlistItems } =
    useApp();
  return (
    <div className="container">
      <div className=" flex justify-between 3xl:justify-around bg-[#FFFFFF]  shadow-[0_4px_12px_rgba(0,0,0,0.1)] my-3 border px-5 xl:px-16">
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
          {/* <div className="w-2/3 relative text-[#111111]/50">
            <input
              type="text"
              placeholder="Search for products, brands and more"
              className="bg-[#F8F8F8] py-2 px-6 text-[11px] w-full focus:outline-none focus:ring-0"
            />
            <div className="absolute left-1 top-1/2 -translate-y-1/2">
              <IoIosSearch />
            </div>
          </div> */}
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
              {/* {cartItems && (
                <span className="absolute -top-1/4 -right-1/3 font-semibold text-[8px] bg-[#C16452] text-[#ffffff] rounded-full p-1 h-4 w-4 flex justify-center items-center">
                  {cartItems?.length}
                </span>
              )} */}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
