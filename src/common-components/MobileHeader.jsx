import { BsCart2 } from "react-icons/bs";
import { FaRegUser } from "react-icons/fa6";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useApp } from "../Context/Context";

function MobileHeader({ title, iscartshown = false }) {
  const navigate = useNavigate();

  const { isAuthenticated, cartItems, localcartItems } = useApp();
  return (
    <>
      {!iscartshown && (
        <div className="flex justify-start gap-2 items-center lg:hidden border-b border-b-[#ccc] mb-2 py-3">
          <button onClick={() => navigate(-1)}>
            <MdOutlineKeyboardArrowLeft size={30} />
          </button>
          <h2 className="font-Poppins uppercase font-medium text-sm leading-[22.5px] text-[#304778]">
            {title}
          </h2>
        </div>
      )}
      {iscartshown && (
        <div className="flex justify-between pr-3 items-center border-b border-b-[#ccc] mb-1 py-3">
          <div className="flex justify-start items-center lg:hidden ">
            <button onClick={() => navigate(-1)}>
              <MdOutlineKeyboardArrowLeft size={25} />
            </button>
            <h2 className="font-Poppins font-medium text-sm leading-[22.5px] text-[#304778]">
              {title}
            </h2>
          </div>
          <div className="flex items-center">
            <div className="flex gap-4">
              <button>
                <FaRegUser size={20} />
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
      )}
    </>
  );
}

export default MobileHeader;
