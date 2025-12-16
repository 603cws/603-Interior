import { useState, useRef, useReducer, useEffect } from "react";
import { RiDashboardFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../../Context/Context";
import { VscSignOut } from "react-icons/vsc";
import { LuBlend } from "react-icons/lu";
import { FaRegUserCircle } from "react-icons/fa";
import { MdOutlineSpaceDashboard } from "react-icons/md";
import SidebarItem from "../../../common-components/SidebarItem";
import { useLogout } from "../../../utils/HelperFunction";
import { BsBoxSeam } from "react-icons/bs";
import { FiLogOut, FiUser } from "react-icons/fi";
import Discount from "./Discount";
import Clients from "../Clients";
import { supabase } from "../../../services/supabase";
import toast from "react-hot-toast";
import Blogs from "./Blogs";
import Transactions from "./Transactions";
import StatsSection from "./StatsSection";
import BestSellingSection from "./BestSellingSection";
import SalesSection from "./SalesSection";
import DashboardProductCard from "../../../dashboards/vendor/DashboardProductCard";
import Products from "./Products";
import { BsArchive } from "react-icons/bs";
import { CiDiscount1 } from "react-icons/ci";
import { IoMdImages } from "react-icons/io";
import { IoMdSwitch } from "react-icons/io";
import CareerDash from "./CareerDash";
import { TbBriefcase2 } from "react-icons/tb";
import Orders, { OrderDetails } from "../Orders";

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
        isCareerOpen: action?.payload === "Career",
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
  CAREER: "Career",
};

function AdminDashboardEcom() {
  const logout = useLogout();
  const navigate = useNavigate();

  const [isExpanded, setIsExpanded] = useState(false);
  const [query, setQuery] = useState();
  const [filteredusers, setFilteredUsers] = useState();
  const [isrefresh, setIsrefresh] = useState(false);
  const [clientBoqs, setClientBoqs] = useState(false);
  const [allusers, setAllusers] = useState();
  const [isproductRefresh, setIsProductRefresh] = useState(false);
  const [isaddonRefresh, setIsAddonRefresh] = useState(false);
  const [rejectReasonPopup, setRejectReasonPopup] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [deleteWarning, setDeleteWarning] = useState(false);
  const [productPreview, setProductPreview] = useState(false);
  const [selectedProductview, setSelectedProductview] = useState();

  const [selectedOrder, setSelectedOrder] = useState(null);

  const mobileMenuRef = useRef(null);

  const handleProductPreview = (product) => {
    setProductPreview(true);
    setSelectedProductview(product);
  };

  const handleDelete = async (selectedProductview) => {
    try {
      if (selectedProductview && selectedProductview.type === "product") {
        await supabase
          .from("product_variants")
          .delete()
          .eq("id", selectedProductview.id);

        toast.success("Product deleted successfully!");
        setIsProductRefresh(true);
      }

      if (selectedProductview.type === "addon") {
        await supabase
          .from("addon_variants")
          .delete()
          .eq("id", selectedProductview.id);
        toast.success("Product deleted successfully!");
        setIsAddonRefresh(true);
      }

      let imagePaths = [];

      if (selectedProductview.image) {
        imagePaths.push(selectedProductview.image);
      }
      if (selectedProductview.additional_images) {
        try {
          const parsedAdditionalImages = JSON.parse(
            selectedProductview.additional_images
          );
          if (Array.isArray(parsedAdditionalImages)) {
            imagePaths = imagePaths.concat(parsedAdditionalImages);
          }
        } catch (parseError) {
          console.error("error parsing error", parseError);
        }
      }

      if (imagePaths.length > 0) {
        const { storageError } = await supabase.storage
          .from("addon")
          .remove(imagePaths);

        if (storageError) throw storageError;
      }

      setProductPreview(false);
    } catch (error) {
      console.error(error);
    } finally {
      selectedProductview.type === "product"
        ? setIsProductRefresh(true)
        : setIsAddonRefresh(true);
    }
    setDeleteWarning(false);
  };

  const handleConfirmReject = () => {
    if (!rejectReason) {
      toast.error("Please enter a reason for rejecting the product");
      return;
    }
    handleUpdateStatus(selectedProductview, "rejected", rejectReason);
  };

  const handleUpdateStatus = async (product, newStatus, reason = "") => {
    try {
      if (product && product.type === "product") {
        await supabase
          .from("product_variants")
          .update({
            status: newStatus,
            reject_reason: reason,
          })
          .eq("id", product.id);
        toast.success(`product ${newStatus}`);
        setRejectReasonPopup(false);
        setRejectReason("");
      }

      if (product.type === "addon") {
        await supabase
          .from("addon_variants")
          .update({ status: newStatus })
          .eq("id", product.id);
        toast.success(`Addon ${newStatus}`);
      }
    } finally {
      product.type === "product"
        ? setIsProductRefresh(true)
        : setIsAddonRefresh(true);

      if (productPreview) {
        setProductPreview(false);
      }
    }
  };

  const filterByMultipleFields = (query) => {
    if (!query) {
      setFilteredUsers(allusers);
    }
    const filtereduser = allusers.filter((item) =>
      item.company_name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredUsers(filtereduser);
  };

  const getusers = async () => {
    try {
      const { data } = await supabase
        .from("users_profiles")
        .select("*")
        .eq("role", "user");

      setAllusers(data);
      setFilteredUsers(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsrefresh(false);
    }
  };

  useEffect(() => {
    getusers();
  }, [isrefresh]);

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

  const handleCarrer = () => {
    sidebarDispatch({ type: "TOGGLE_SECTION", payload: SECTIONS.CAREER });
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
            icon={<BsArchive />}
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
            icon={<FiUser />}
            text="Customers"
            onClick={handleCustomers}
            isExpanded={isExpanded}
            currentSection={sidebarstate?.currentSection}
          />
          <SidebarItem
            icon={<CiDiscount1 />}
            text="Discounts"
            onClick={handleDiscounts}
            isExpanded={isExpanded}
            currentSection={sidebarstate?.currentSection}
          />
          <SidebarItem
            icon={<IoMdImages />}
            text="Blogs"
            onClick={handleBlogs}
            isExpanded={isExpanded}
            currentSection={sidebarstate?.currentSection}
          />
          <SidebarItem
            icon={<TbBriefcase2 />}
            text="Career"
            onClick={handleCarrer}
            isExpanded={isExpanded}
            currentSection={sidebarstate?.currentSection}
          />
          <SidebarItem
            icon={<IoMdSwitch />}
            text="change Dashboard"
            onClick={() => navigate("/dashboard")}
            isExpanded={isExpanded}
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
                icon={<BsArchive />}
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
                icon={<CiDiscount1 />}
                title="Discounts"
                currentSection={sidebarstate?.currentSection}
                onClick={handleDiscounts}
                setIsOpen={setIsOpen}
              />
              <MobileMenuItem
                icon={<IoMdImages />}
                title="Blogs"
                currentSection={sidebarstate?.currentSection}
                onClick={handleBlogs}
                setIsOpen={setIsOpen}
              />
              <MobileMenuItem
                icon={<TbBriefcase2 />}
                title="Career"
                currentSection={sidebarstate?.currentSection}
                onClick={handleCarrer}
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
          <div className="flex flex-col h-full min-h-0 overflow-y-auto overflow-x-hidden lg:border-2 border-[#334A78] rounded-lg bg-white font-lato p-4 custom-scrollbar">
            <StatsSection allusers={allusers} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
              <Transactions
                sidebarDispatch={sidebarDispatch}
                onOrderSelect={(order) => {
                  setSelectedOrder(order);
                  sidebarDispatch({
                    type: "TOGGLE_SECTION",
                    payload: "Orders",
                  });
                }}
              />
              <SalesSection />
            </div>
            <BestSellingSection
              sidebarDispatch={sidebarDispatch}
              handleProductPreview={handleProductPreview}
            />
          </div>
        )}
        {sidebarstate.isOrdersOpen &&
          (selectedOrder ? (
            <OrderDetails
              order={selectedOrder}
              onBack={() => setSelectedOrder(null)}
            />
          ) : (
            <Orders />
          ))}
        {sidebarstate.isProductOpen && (
          <Products
            isproductRefresh={isproductRefresh}
            setIsProductRefresh={setIsProductRefresh}
            setSelectedProductview={setSelectedProductview}
            setRejectReasonPopup={setRejectReasonPopup}
            setDeleteWarning={setDeleteWarning}
            setIsAddonRefresh={setIsAddonRefresh}
            handleUpdateStatus={handleUpdateStatus}
            setRejectReason={setRejectReason}
            handleProductPreview={handleProductPreview}
          />
        )}
        {sidebarstate.isCustomerOpen && !clientBoqs && (
          <div className="flex flex-col h-full min-h-0 overflow-hidden lg:border-2 lg:border-[#334A78] lg:rounded-lg bg-white">
            <Clients
              isExpanded={isExpanded}
              filterByMultipleFields={filterByMultipleFields}
              query={query}
              filteredusers={filteredusers}
              setIsrefresh={setIsrefresh}
              setClientBoqs={setClientBoqs}
              eComm={true}
            />
          </div>
        )}
        {sidebarstate.isDiscountOpen && (
          <div className="flex flex-col h-full min-h-0  lg:border-2 lg:border-[#334A78] lg:rounded-lg bg-white">
            <Discount />
          </div>
        )}

        {sidebarstate.isBlogsOpen && (
          <div className="flex flex-col h-full min-h-0 overflow-hidden lg:border-2 lg:border-[#334A78] lg:rounded-lg bg-white">
            <Blogs />
          </div>
        )}
        {sidebarstate.isCareerOpen && (
          <div className="flex flex-col h-full min-h-0 overflow-hidden lg:border-2 lg:border-[#334A78] lg:rounded-lg bg-white">
            <CareerDash />
          </div>
        )}
      </div>

      {productPreview && (
        <DashboardProductCard
          onClose={() => {
            setProductPreview(false);
          }}
          product={selectedProductview}
          handleDelete={handleDelete}
          updateStatus={handleUpdateStatus}
          deleteWarning={deleteWarning}
          setDeleteWarning={setDeleteWarning}
          rejectReason={rejectReason}
          setRejectReason={setRejectReason}
          handleConfirmReject={handleConfirmReject}
          AllowProductEditStatus={false}
        />
      )}

      {deleteWarning && (
        <div className="flex justify-center items-center fixed inset-0 z-30">
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="bg-white relative py-7 px-16 md:px-20">
            <div className="flex justify-center items-center">
              <img
                src="images/icons/delete-icon.png"
                alt="delete icon"
                className="h-12 w-12"
              />
            </div>

            <h4 className="font-semibold my-5">
              Do you want to delete {selectedProductview.title}?
            </h4>
            <div className="flex justify-between">
              <button
                onClick={() => {
                  setDeleteWarning(false);
                }}
                className="px-5 py-2 bg-[#EEEEEE] rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(selectedProductview)}
                className="px-5 py-2 bg-[#B4EAEA] rounded-md"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {rejectReasonPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-30 font-Poppins">
          <div className="bg-white py-6 px-10 rounded-2xl shadow-lg ">
            <h2 className="text-lg font-semibold mb-3">Rejection Reason</h2>
            <textarea
              className="w-full p-2 border rounded-md"
              rows="3"
              placeholder="Provide a reason..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
            <div className="mt-7 flex  gap-20 justify-between">
              <button
                className="border-[1px] border-[#BBBBBB] px-4 py-2 rounded-md mr-2"
                onClick={() => setRejectReasonPopup(false)}
              >
                Cancel
              </button>
              <button
                className="border-[1px] border-red-600 px-4 py-2 rounded-md"
                onClick={handleConfirmReject}
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}
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
