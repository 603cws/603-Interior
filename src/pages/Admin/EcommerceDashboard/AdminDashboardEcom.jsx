import { useState, useRef, useReducer } from "react";
import { RiDashboardFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../../Context/Context";
import { VscSignOut } from "react-icons/vsc";
import { LuBlend } from "react-icons/lu";
import { FaRegUserCircle, FaUser } from "react-icons/fa";
import { MdOutlineSpaceDashboard } from "react-icons/md";
import SidebarItem from "../../../common-components/SidebarItem";
import { useLogout } from "../../../utils/HelperFunction";
import { BsBoxSeam } from "react-icons/bs";
import { FiLogOut } from "react-icons/fi";
import Orders from ".././Orders";
import Discount from "./Discount";
import NewBlog from "./NewBlog";

function handlesidebarState(state, action) {
  switch (action.type) {
    case "TOGGLE_SECTION":
      return {
        dashboard: action.payload === "Dashboard",
        isOrdersOpen: action.payload === "Orders",
        isProductOpen: action.payload === "Product",
        isCustomerOpen: action.payload === "Customers",
        isDiscountOpen: action.payload === "Discounts",
        isBlogsOpen: action.payload === "Blogs",
        currentSection: action.payload,
      };
    default:
      return state;
  }
}

const SECTIONS = {
  DASHBOARD: "Dashboard",
  PRODUCT: "Product",
  ORDERS: "Orders",
  CUSTOMERS: "Customers",
  DISCOUNTS: "Discounts",
  BLOGS: "Blogs",
};

function AdminDashboardEcom() {
  const logout = useLogout();
  const navigate = useNavigate();

  const [isExpanded, setIsExpanded] = useState(false);

  const mobileMenuRef = useRef(null);

  const sidebarInitialState = {
    dashboard: true,
    isOrdersOpen: false,
    isProductOpen: false,
    isCustomerOpen: false,
    isDiscountOpen: false,
    isBlogsOpen: false,

    currentSection: "Dashboard",
  };

  const [sidebarstate, sidebarDispatch] = useReducer(
    handlesidebarState,
    sidebarInitialState
  );

  const [isOpen, setIsOpen] = useState(false);

  const { accountHolder } = useApp();

  const handledashboard = () => {
    sidebarDispatch({ type: "TOGGLE_SECTION", payload: SECTIONS.DASHBOARD });
  };
  const handleOrders = () => {
    sidebarDispatch({ type: "TOGGLE_SECTION", payload: SECTIONS.ORDERS });
  };

  const handleproduct = () => {
    sidebarDispatch({ type: "TOGGLE_SECTION", payload: SECTIONS.PRODUCT });
  };

  const handleCustomers = () => {
    sidebarDispatch({ type: "TOGGLE_SECTION", payload: SECTIONS.CUSTOMERS });
  };

  const handleDiscounts = () => {
    sidebarDispatch({ type: "TOGGLE_SECTION", payload: SECTIONS.DISCOUNTS });
  };
  const handleBlogs = () => {
    sidebarDispatch({ type: "TOGGLE_SECTION", payload: SECTIONS.BLOGS });
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
            className={`${isExpanded ? "h-16 w-32" : "h-8 w-8"}`}
            onClick={() => navigate("/")}
          />
        </div>

        {/* Menu Items */}
        <div className="font-semibold text-lg capitalize leading-normal tracking-wide py-3 xl:py-4 text-[#262626] flex flex-col gap-2 px-3">
          <SidebarItem
            icon={<MdOutlineSpaceDashboard />}
            text="Dashboard"
            onClick={handledashboard}
            isExpanded={isExpanded}
            currentSection={sidebarstate?.currentSection}
          />
          <SidebarItem
            icon={<BsBoxSeam />}
            text="orders"
            onClick={handleOrders}
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
            icon={<FaUser />}
            text="Customers"
            onClick={handleCustomers}
            isExpanded={isExpanded}
            currentSection={sidebarstate?.currentSection}
          />
          <SidebarItem
            icon={<FaUser />}
            text="Discounts"
            onClick={handleDiscounts}
            isExpanded={isExpanded}
            currentSection={sidebarstate?.currentSection}
          />
          <SidebarItem
            icon={<FaUser />}
            text="Blogs"
            onClick={handleBlogs}
            isExpanded={isExpanded}
            currentSection={sidebarstate?.currentSection}
          />

          <SidebarItem
            icon={<FiLogOut />}
            text="Logout"
            onClick={logout}
            isExpanded={isExpanded}
          />
        </div>
      </div>
      <div className="flex flex-col h-full min-h-0 lg:gap-2 lg:px-2">
        {/* header for mobile */}
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
              <MobileMenuItem
                icon={<RiDashboardFill />}
                title={"Dashboard"}
                currentSection={sidebarstate?.currentSection}
                onClick={handledashboard}
                setIsOpen={setIsOpen}
              />
              <MobileMenuItem
                icon={<BsBoxSeam />}
                title="Orders"
                currentSection={sidebarstate?.currentSection}
                onClick={handleOrders}
                setIsOpen={setIsOpen}
              />
              <MobileMenuItem
                icon={<LuBlend />}
                title={"Product"}
                currentSection={sidebarstate?.currentSection}
                onClick={handleproduct}
                setIsOpen={setIsOpen}
              />
              <MobileMenuItem
                icon={<FaRegUserCircle />}
                title="Customres"
                currentSection={sidebarstate?.currentSection}
                onClick={handleCustomers}
                setIsOpen={setIsOpen}
              />
              <MobileMenuItem
                icon={<FaRegUserCircle />}
                title="Discounts"
                currentSection={sidebarstate?.currentSection}
                onClick={handleDiscounts}
                setIsOpen={setIsOpen}
              />
              <MobileMenuItem
                icon={<FaRegUserCircle />}
                title="Blogs"
                currentSection={sidebarstate?.currentSection}
                onClick={handleBlogs}
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
        <div className="flex justify-between items-center border-b border-[#CCCCCC] lg:border-2 lg:border-[#334A78] lg:rounded-lg bg-white  lg:h-[50px] shrink-0">
          <div className="mx-3">
            <h3 className="font-semibold text-2xl text-[#374A75] capitalize ">
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

        {/* dashboard */}
        {sidebarstate.dashboard && (
          <div className="flex flex-col h-full min-h-0 loverflow-hidden lg:border-2 border-[#334A78] rounded-lg bg-[#fff]">
            <p>dashboard</p>
          </div>
        )}
        {/* orders */}
        {sidebarstate.isOrdersOpen && <Orders />}

        {/* product */}
        {sidebarstate.isProductOpen && (
          <div className="flex flex-col h-full min-h-0 overflow-hidden lg:border-2 lg:border-[#334A78] lg:rounded-lg bg-white">
            products
          </div>
        )}

        {/* customers */}
        {sidebarstate.isCustomerOpen && (
          <div className="flex flex-col h-full min-h-0 overflow-hidden lg:border-2 lg:border-[#334A78] lg:rounded-lg bg-white">
            customers
          </div>
        )}

        {/* discounts */}
        {sidebarstate.isDiscountOpen && (
          <div className="flex flex-col h-full min-h-0 overflow-hidden lg:border-2 lg:border-[#334A78] lg:rounded-lg bg-white">
            <Discount />
          </div>
        )}
        {/* blogs */}
        {sidebarstate.isBlogsOpen && (
          <div className="flex flex-col h-full min-h-0 overflow-hidden lg:border-2 lg:border-[#334A78] lg:rounded-lg bg-white">
            <NewBlog />
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboardEcom;

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
