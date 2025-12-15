import { RiSettingsLine } from "react-icons/ri";
import { useLocation, useNavigate } from "react-router-dom";
import { useApp } from "../../Context/Context";
import { supabase } from "../../services/supabase";
import { useEffect, useState, useRef, useReducer } from "react";

import { VscSignOut } from "react-icons/vsc";
import { IoSettingsSharp } from "react-icons/io5";
import { LuBlend, LuCalendarPlus2 } from "react-icons/lu";
import { BsBoxSeam, BsQuestionCircle } from "react-icons/bs";
import Help from "./Help";
import { TbFileInvoice } from "react-icons/tb";
import DashboardView from "./DashboardView";
import { useLogout } from "../../utils/HelperFunction";
import { FaThLarge } from "react-icons/fa";
import BookAppointment from "../../boq/components/BookAppointment";
import { CiCalendarDate } from "react-icons/ci";

import { MdOutlineSpaceDashboard } from "react-icons/md";
import { GrCircleQuestion } from "react-icons/gr";
import { FiLogOut } from "react-icons/fi";
import Orders from "./Orders";
import UserBoqItem from "./UserBoqItem";
import UserDashSetting from "./UserDashSetting";
import DashboardHeader from "../../common-components/DashboardHeader";

function handlesidebarState(state, action) {
  switch (action.type) {
    case "TOGGLE_SECTION":
      return {
        isSettingOpen: action.payload === "Setting",
        isProductOpen: action.payload === "Product",
        iseditopen: action.payload === "Edit",
        dashboard: action.payload === "Dashboard",
        help: action.payload === "Help",
        isBookAppointmentOpen: action.payload === "Book Appointment",
        myOrders: action.payload === "My Orders",
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
  EDIT: "Edit",
  BOOkAPPOINTMENT: "Book Appointment",
  ORDERS: "My Orders",
};

function Dashboard() {
  const logout = useLogout();
  const navigate = useNavigate();
  const location = useLocation();

  const [isExpanded, setIsExpanded] = useState(false);

  const sidebarInitialState = {
    isSettingOpen: false,
    isProductOpen: false,
    iseditopen: false,
    dashboard: true,
    help: false,
    isBookAppointmentOpen: false,
    myOrders: false,
    currentSection: "Dashboard",
  };

  const [sidebarstate, sidebarDispatch] = useReducer(
    handlesidebarState,
    sidebarInitialState
  );
  const [boqdata, setboqdata] = useState();
  const { accountHolder } = useApp();
  const [selectedBoq, setSelectedBoq] = useState();

  const menuRef = useRef({});
  const buttonRef = useRef({});

  const [openMenuId, setOpenMenuId] = useState(null);

  const [isboqavailable, setIsboqavailable] = useState(false);
  const [isfetchBoqDataRefresh, setisfetchBoqDataRefresh] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const mobileMenuRef = useRef(null);

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
  const handleOrders = () => {
    sidebarDispatch({ type: "TOGGLE_SECTION", payload: SECTIONS.ORDERS });
  };

  const fetchboq = async () => {
    try {
      const { data } = await supabase
        .from("boq_data_new")
        .select(`*,layout:layoutId (*)`)
        .eq("userId", accountHolder.userId);

      setboqdata(data);
      if (data.length > 0) {
        setSelectedBoq(data[0]);
        setIsboqavailable(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handledeleteBoq = async (boq) => {
    setisfetchBoqDataRefresh(true);
    try {
      const { error } = await supabase
        .from("boq_data_new")
        .delete()
        .eq("id", boq.id);

      if (error) {
        throw new Error(error);
      }
    } catch (error) {
      console.error("something went wrong", error);
    } finally {
      setSelectedBoq(() => null);
      setisfetchBoqDataRefresh(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        openMenuId !== null &&
        (menuRef.current[openMenuId]?.contains(event.target) ||
          buttonRef.current[openMenuId]?.contains(event.target))
      ) {
        return;
      }

      setOpenMenuId(null);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openMenuId]);

  useEffect(() => {
    if (location.state?.openSettings) {
      sidebarDispatch({ type: "TOGGLE_SECTION", payload: SECTIONS.SETTING });
    }
    if (location.state?.openHelp) {
      sidebarDispatch({ type: "TOGGLE_SECTION", payload: SECTIONS.HELP });
    }
  }, [location.state]);

  useEffect(() => {
    fetchboq();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isfetchBoqDataRefresh]);

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
            alt="Workved Logo"
            className={`${isExpanded ? "h-[70px] w-36" : "h-8 w-8"}`}
            onClick={() => navigate("/")}
          />
        </div>

        {/* Menu Items */}
        <div className="font-semibold text-lg capitalize leading-normal tracking-wide py-4 text-[#262626] flex flex-col gap-4 px-3">
          <SidebarItem
            icon={<MdOutlineSpaceDashboard />}
            text="Dashboard"
            onClick={handledashboard}
            isExpanded={isExpanded}
            currentSection={sidebarstate?.currentSection}
          />
          <SidebarItem
            icon={<BsBoxSeam />}
            text="Product"
            onClick={handleproduct}
            isExpanded={isExpanded}
            currentSection={sidebarstate?.currentSection}
          />
          <SidebarItem
            icon={<TbFileInvoice />}
            text="Go to BOQ"
            onClick={() => navigate("/boq")}
            isExpanded={isExpanded}
            currentSection={sidebarstate?.currentSection}
          />
          <SidebarItem
            icon={<LuCalendarPlus2 />}
            text="Book Appointment"
            onClick={() =>
              sidebarDispatch({
                type: "TOGGLE_SECTION",
                payload: SECTIONS.BOOkAPPOINTMENT,
              })
            }
            isExpanded={isExpanded}
            currentSection={sidebarstate?.currentSection}
          />
          <SidebarItem
            icon={<BsBoxSeam />}
            text="My Orders"
            onClick={handleOrders}
            isExpanded={isExpanded}
            currentSection={sidebarstate?.currentSection}
          />
        </div>

        {/* Other Items */}
        <div className="font-semibold text-lg capitalize leading-normal tracking-wide py-4 text-[#262626] flex flex-col gap-4 px-3">
          <SidebarItem
            icon={<GrCircleQuestion />}
            text="Help"
            onClick={handlehelp}
            isExpanded={isExpanded}
            currentSection={sidebarstate?.currentSection}
          />
          <SidebarItem
            icon={<RiSettingsLine />}
            text="Setting"
            onClick={handlesetting}
            isExpanded={isExpanded}
            currentSection={sidebarstate?.currentSection}
          />
          <SidebarItem
            icon={<FiLogOut />}
            text="Logout"
            onClick={logout}
            isExpanded={isExpanded}
            currentSection={sidebarstate?.currentSection}
          />
        </div>
      </div>
      {/* main content */}
      <div className="flex flex-col h-full min-h-0 lg:gap-2 lg:px-2">
        <div className="lg:hidden flex justify-between items-center border-b-2 border-[#334A78]  bg-white h-[50px] shrink-0">
          <div className="mx-3">
            <img
              src="/logo/workved-interior.png"
              alt="Workved Logo"
              className={`${isExpanded ? "h-20 w-32" : "h-9 w-16"}`}
              onClick={() => navigate("/")}
            />
          </div>
          <div
            onClick={() => setIsOpen(!isOpen)}
            className="mx-3 rounded-full cursor-pointer"
            style={{
              backgroundImage:
                "linear-gradient(to top left, #5B73AF 0%, rgba(255, 255, 255, 0.5) 48%, #1F335C 100%)",
            }}
          >
            <img
              src={accountHolder.profileImage}
              alt="usericon"
              className="w-8 h-8 sm:w-10 sm:h-10 p-1"
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
              <MobileMenuItem
                title={"Go to Boq"}
                icon={<TbFileInvoice />}
                onClick={() => navigate("/boq")}
                currentSection={sidebarstate?.currentSection}
                setIsOpen={setIsOpen}
              />
              <MobileMenuItem
                title={"Book Appointment"}
                icon={<CiCalendarDate />}
                onClick={() =>
                  sidebarDispatch({
                    type: "TOGGLE_SECTION",
                    payload: SECTIONS.BOOkAPPOINTMENT,
                  })
                }
                currentSection={sidebarstate?.currentSection}
                setIsOpen={setIsOpen}
              />
              <MobileMenuItem
                icon={<LuBlend />}
                title={"My Orders"}
                onClick={handleOrders}
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
        <DashboardHeader
          sidebarstate={sidebarstate}
          handlesetting={handlesetting}
          accountHolder={accountHolder}
        />

        {sidebarstate?.isSettingOpen && (
          <div className="flex flex-col h-full min-h-0 overflow-hidden lg:border-2 lg:border-[#334A78] lg:rounded-lg bg-white">
            <UserDashSetting />
          </div>
        )}

        {sidebarstate?.dashboard && (
          <div className="flex flex-col h-full min-h-0 overflow-hidden lg:border-2 border-[#334A78] rounded-lg bg-white">
            <DashboardView
              handledeleteBoq={handledeleteBoq}
              selectedBoq={selectedBoq}
              isboqavailable={isboqavailable}
              boqdata={boqdata}
              isExpanded={isExpanded}
            />
          </div>
        )}

        {sidebarstate?.isBookAppointmentOpen && (
          <div className="flex flex-col h-full min-h-0  lg:border-2 overflow-hidden border-[#334A78] rounded-lg bg-white">
            <BookAppointment isdashboardbooking={true} />
          </div>
        )}

        {sidebarstate?.myOrders && (
          <div className="flex flex-col h-full min-h-0  lg:border-2 overflow-auto gradient-scrollbar  border-[#334A78] rounded-lg bg-white">
            <Orders />
          </div>
        )}

        {sidebarstate?.isProductOpen && (
          <div className="flex flex-col h-full min-h-0 overflow-hidden lg:border-2 border-[#334A78] rounded-lg bg-white ">
            <UserBoqItem
              selectedBoq={selectedBoq}
              setSelectedBoq={setSelectedBoq}
            />
          </div>
        )}
        {sidebarstate?.help && (
          <div className="flex flex-col h-full min-h-0 overflow-hidden lg:border-2 lg:border-[#334A78] lg:rounded-lg bg-white">
            <Help isvendor={false} />
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;

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
