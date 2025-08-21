import { RiDashboardFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../Context/Context";
import { useEffect, useState, useRef, useReducer } from "react";

import { VscSignOut } from "react-icons/vsc";
import { IoSettingsSharp } from "react-icons/io5";
import { LuBlend } from "react-icons/lu";
import { BsQuestionCircle } from "react-icons/bs";
import Help from "../user/Help";
import { useLogout } from "../../utils/HelperFunction";
import { FaThLarge } from "react-icons/fa";
import UserCard from ".././user/UserCard";
import UserProfileEdit from ".././user/UserProfileEdit";
import VendorDashboardCards from "./VendorDashboardCards";
import VendorItem from "./VendorItem";

function handlesidebarState(state, action) {
  switch (action.type) {
    case "TOGGLE_SECTION":
      return {
        isSettingOpen: action.payload === "Setting",
        isProductOpen: action.payload === "Product",
        iseditopen: action.payload === "Edit",
        dashboard: action.payload === "Dashboard",
        help: action.payload === "Help",
        currentSection: action.payload,
      };
    default:
      return state;
  }
}

const SECTIONS = {
  DASHBOARD: "Dashboard",
  PRODUCT: "Product",
  SETTING: "Setting",
  HELP: "Help",
};

const sidebarInitialState = {
  isSettingOpen: false,
  isProductOpen: false,
  dashboard: true,
  help: false,
  currentSection: "Dashboard",
};
function VendorDashboardLayout() {
  const logout = useLogout();
  const navigate = useNavigate();
  const [iseditopen, setIsEditopen] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  const [sidebarstate, sidebarDispatch] = useReducer(
    handlesidebarState,
    sidebarInitialState
  );
  const { accountHolder } = useApp();

  // mobile navigation
  const [isOpen, setIsOpen] = useState(false);
  const mobileMenuRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handlesetting = () => {
    sidebarDispatch({ type: "TOGGLE_SECTION", payload: SECTIONS.SETTING });
  };
  const handleproduct = () => {
    sidebarDispatch({ type: "TOGGLE_SECTION", payload: SECTIONS.PRODUCT });
  };

  const handledashboard = () => {
    sidebarDispatch({ type: "TOGGLE_SECTION", payload: SECTIONS.DASHBOARD });
  };

  const handlehelp = () => {
    sidebarDispatch({ type: "TOGGLE_SECTION", payload: SECTIONS.HELP });
  };

  return (
    <div className="grid lg:grid-cols-[auto_1fr] lg:bg-gradient-to-r from-[#CFDCE7] to-[#E8EEF3] md:p-4 h-dvh md:h-screen font-Poppins lg:overflow-hidden">
      {/* sidebar */}
      <div
        className={`hidden lg:block sticky top-0 bottom-0 left-0 bg-white border-2 border-[#334A78] rounded-lg shadow-lg transition-all duration-300 ${
          isExpanded ? "max-w-sm w-60 absolute" : "w-16"
        }`}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        {/* Logo */}
        <div className="cursor-pointer flex justify-center items-center py-4">
          <img
            src={`${
              isExpanded
                ? "/logo/workved-interior.png"
                : "/images/bi_layout-sidebar.png"
            }`}
            alt="Logo"
            className={`${isExpanded ? "h-20 w-32" : "h-8 w-8"}`}
            onClick={() => navigate("/")}
          />
        </div>

        {/* Menu Items */}
        <div className="font-semibold text-lg capitalize leading-normal tracking-wide py-4 text-[#262626] flex flex-col gap-4 px-3">
          {/* <SidebarItem
            icon={<TbFileInvoice />}
            text="Home"
            onClick={() => navigate("/")}
            isExpanded={isExpanded}
            currentSection={sidebarstate?.currentSection}
          /> */}
          <SidebarItem
            icon={<RiDashboardFill />}
            text="Dashboard"
            onClick={handledashboard}
            isExpanded={isExpanded}
            currentSection={sidebarstate?.currentSection}
          />
          <SidebarItem
            icon={<LuBlend />}
            text="Product"
            onClick={handleproduct}
            isExpanded={isExpanded}
            currentSection={sidebarstate?.currentSection}
          />
        </div>

        {/* Other Items */}
        <div className="font-semibold text-lg capitalize leading-normal tracking-wide py-4 text-[#262626] flex flex-col gap-4 px-3">
          <SidebarItem
            icon={<BsQuestionCircle />}
            text="Help"
            onClick={handlehelp}
            isExpanded={isExpanded}
            currentSection={sidebarstate?.currentSection}
          />
          <SidebarItem
            icon={<IoSettingsSharp />}
            text="Setting"
            onClick={handlesetting}
            isExpanded={isExpanded}
            currentSection={sidebarstate?.currentSection}
          />
          <SidebarItem
            icon={<VscSignOut />}
            text="Logout"
            onClick={logout}
            isExpanded={isExpanded}
            currentSection={sidebarstate?.currentSection}
          />
        </div>
      </div>
      {/* main content */}
      <div className="flex flex-col h-full min-h-0 lg:gap-2 lg:px-2">
        {/* header for mobile view  */}
        <div className="lg:hidden flex justify-between items-center border-b-2 border-[#334A78]  bg-white h-[50px] shrink-0">
          <div className="mx-3">
            <img
              src="/logo/workved-interior.png"
              alt="Logo"
              className={`${isExpanded ? "h-20 w-32" : "h-9 w-16"}`}
              onClick={() => navigate("/")}
            />
          </div>
          <div
            onClick={() => setIsOpen(!isOpen)}
            className="mx-3 rounded-full"
            style={{
              backgroundImage:
                "linear-gradient(to top left, #5B73AF 0%, rgba(255, 255, 255, 0.5) 48%, #1F335C 100%)",
            }}
          >
            <img
              src={accountHolder.profileImage}
              alt="usericon"
              className="w-8 md:w-10 h-8 p-1 md:h-10"
            />
          </div>

          <div
            ref={mobileMenuRef}
            className={`fixed top-0 right-0 h-full w-64 bg-white border-l z-50 transform ${
              isOpen ? "translate-x-0" : "translate-x-full"
            } transition-transform duration-300 ease-in-out shadow-lg`}
          >
            <div className="flex gap-2 justify-center items-center mt-6">
              <div>
                <img
                  src={accountHolder?.profileImage}
                  alt="usericon"
                  className="w-10 h-10"
                />
              </div>
              <div className="text-gray-800 text-sm">
                <h2>{accountHolder?.companyName}</h2>
                <p>{accountHolder?.email}</p>
              </div>
            </div>

            <ul className="p-4 space-y-4">
              {/* <MobileMenuItem
                title={"Home"}
                icon={<TbFileInvoice />}
                onClick={() => navigate("/")}
                currentSection={sidebarstate?.currentSection}
                setIsOpen={setIsOpen}
              /> */}
              <MobileMenuItem
                icon={<FaThLarge />}
                title={"Dashboard"}
                currentSection={sidebarstate?.currentSection}
                onClick={handledashboard}
                setIsOpen={setIsOpen}
              />
              <MobileMenuItem
                icon={<LuBlend />}
                title={"Product"}
                onClick={handleproduct}
                currentSection={sidebarstate?.currentSection}
                setIsOpen={setIsOpen}
              />

              <hr className="border-gray-200" />
              <MobileMenuItem
                title={"Help"}
                icon={<BsQuestionCircle />}
                onClick={handlehelp}
                currentSection={sidebarstate?.currentSection}
                setIsOpen={setIsOpen}
              />
              <MobileMenuItem
                icon={<IoSettingsSharp />}
                onClick={handlesetting}
                title={"Setting"}
                currentSection={sidebarstate?.currentSection}
                setIsOpen={setIsOpen}
              />
              <MobileMenuItem
                title={"Logout"}
                icon={<VscSignOut />}
                onClick={logout}
                currentSection={sidebarstate?.currentSection}
                setIsOpen={setIsOpen}
              />
            </ul>
          </div>
        </div>
        {/* header for dashboard */}
        <div className="flex justify-between items-center border-b border-[#CCCCCC] lg:border-2 lg:border-[#334A78] lg:rounded-lg bg-white  lg:h-[50px] shrink-0 ">
          <div className="mx-3">
            <h3 className="font-bold text-2xl text-[#374A75] capitalize">
              {sidebarstate?.currentSection}
            </h3>
          </div>
          <div
            className="hidden lg:block mx-3 rounded-full"
            style={{
              backgroundImage:
                "linear-gradient(to top left, #5B73AF 0%, rgba(255, 255, 255, 0.5) 48%, #1F335C 100%)",
            }}
          >
            <img
              src={accountHolder.profileImage}
              alt="usericon"
              className="w-10 h-10 p-1"
            />
          </div>
        </div>

        {/* setting */}
        {sidebarstate?.isSettingOpen && (
          <div className="flex flex-col h-full min-h-0 overflow-hidden lg:border-2 lg:border-[#334A78] lg:rounded-lg bg-white">
            {/* header inside setting */}

            {/* Scrollable content section */}
            {iseditopen ? (
              <div className="flex-1 flex flex-col justify-center items-center h-[90%] font-Poppins ">
                <div className="flex justify-center items-center lg:w-full  h-full">
                  <UserCard setIsEditopen={setIsEditopen} />
                </div>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto min-h-0 p-2 md:p-7">
                <UserProfileEdit setIsEditopen={setIsEditopen} />
              </div>
            )}
          </div>
        )}

        {sidebarstate?.dashboard && (
          <div className="flex flex-col h-full min-h-0 overflow-hidden lg:border-2 border-[#334A78] rounded-lg bg-white">
            <div className="p-3">
              <VendorDashboardCards />
            </div>
          </div>
        )}

        {sidebarstate?.isProductOpen && (
          <div className="flex flex-col h-full min-h-0 overflow-hidden lg:border-2 border-[#334A78] rounded-lg bg-white">
            <div className="">
              <VendorItem />
            </div>
          </div>
        )}

        {/* help */}
        {sidebarstate?.help && (
          <div className="flex flex-col h-full min-h-0 overflow-hidden lg:border-2 lg:border-[#334A78] lg:rounded-lg bg-white">
            <Help isvendor={false} />
          </div>
        )}
      </div>
    </div>
  );
}

export default VendorDashboardLayout;

function MobileMenuItem({ icon, title, currentSection, onClick, setIsOpen }) {
  return (
    <li
      onClick={() => {
        onClick();
        setIsOpen((prev) => !prev);
      }}
      className={`flex items-center space-x-3 px-2 font-semibold ${
        currentSection === title
          ? "bg-gradient-to-r from-[#4C85F5] to-[#6AC7FF]  py-2 rounded-md text-white"
          : "text-[#1A3365]"
      }`}
    >
      {icon}
      <span>{title}</span>
    </li>
  );
}

function SidebarItem({ icon, text, onClick, isExpanded, currentSection }) {
  return (
    <div
      className={`flex items-center  gap-3 hover:bg-[#E9E9E9] p-2 rounded cursor-pointer ${
        isExpanded ? "" : "justify-center"
      } ${
        currentSection?.toLowerCase() === text?.toLowerCase()
          ? "bg-gradient-to-r from-[#334A78] to-[#68B2DC] px-4 py-2 rounded-md text-white"
          : "text-[#1A3365]"
      }`}
      onClick={onClick}
    >
      <div className="text-2xl ">{icon}</div>
      <span className={`${isExpanded ? "block" : "hidden"} text-base`}>
        {text}
      </span>
    </div>
  );
}
