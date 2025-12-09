import { useState } from "react";
import SidebarItem from "../../common-components/SidebarItem";
import { useNavigate } from "react-router-dom";
import { TiHomeOutline } from "react-icons/ti";
import { VscSignOut } from "react-icons/vsc";
import { IoSettingsSharp } from "react-icons/io5";
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { GrCircleQuestion } from "react-icons/gr";
import { BsBoxSeam } from "react-icons/bs";

function Sidebar({
  handleLogout,
  handleproduct,
  handlesetting,
  isProductOpen,
  isSettingOpen,
  handledashboard,
  handleHelp,
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();
  return (
    <div
      className={`max-h-screen sticky left-0 top-0 bottom-0 bg-white shadow-lg transition-all duration-300 ${
        isExpanded ? "max-w-sm w-60" : "w-16"
      }`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {/* Logo */}
      <div className="cursor-pointer flex justify-center items-center py-4">
        <img
          src="/logo/workved-interior.png"
          alt="Logo"
          className={`${isExpanded ? "h-20 w-32" : "h-12 w-20"}`}
        />
      </div>

      {/* Main */}
      <div className="font-semibold text-lg capitalize leading-normal tracking-wide py-4 text-[#262626] flex flex-col gap-4 px-3">
        <h3
          className={`capitalize text-[#A1A1A1] ${
            isExpanded ? "mx-4" : "hidden"
          }`}
        >
          main
        </h3>
        <SidebarItem
          icon={<TiHomeOutline />}
          text="Home"
          onClick={() => navigate("/")}
          isExpanded={isExpanded}
        />
        <SidebarItem
          icon={<MdOutlineSpaceDashboard />}
          text="Dashboard"
          onClick={handledashboard}
          isExpanded={isExpanded}
        />
        <SidebarItem
          icon={<BsBoxSeam />}
          text="Product"
          onClick={() => {
            handleproduct();
          }}
          isExpanded={isExpanded}
          isActive={isProductOpen}
        />
      </div>

      {/* Others */}
      <div className="font-semibold text-lg capitalize leading-normal tracking-wide py-4 text-[#262626] flex flex-col gap-4 px-3">
        <h3
          className={`capitalize text-[#A1A1A1] ${
            isExpanded ? "mx-4" : "hidden"
          }`}
        >
          others
        </h3>
        <SidebarItem
          icon={<GrCircleQuestion />}
          text="Help"
          isExpanded={isExpanded}
          onClick={handleHelp}
        />
        <SidebarItem
          icon={<IoSettingsSharp />}
          text="Setting"
          onClick={() => {
            handlesetting();
          }}
          isExpanded={isExpanded}
          isActive={isSettingOpen}
        />
        <SidebarItem
          icon={<VscSignOut />}
          text="Logout"
          onClick={handleLogout}
          isExpanded={isExpanded}
        />
      </div>
    </div>
  );
}

export default Sidebar;
