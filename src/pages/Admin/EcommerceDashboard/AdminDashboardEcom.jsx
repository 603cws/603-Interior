import { useState, useRef, useReducer, useEffect } from "react";
import { RiDashboardFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../../Context/Context";
import { VscEye, VscSignOut } from "react-icons/vsc";
import { LuBlend } from "react-icons/lu";
import { FaRegUserCircle, FaUser } from "react-icons/fa";
import { MdOutlineDelete, MdOutlineSpaceDashboard } from "react-icons/md";
import SidebarItem from "../../../common-components/SidebarItem";
import { useLogout } from "../../../utils/HelperFunction";
import { BsBoxSeam } from "react-icons/bs";
import { FiLogOut } from "react-icons/fi";
import Orders from ".././Orders";
import Discount from "./Discount";
import Clients from "../Clients";
import { supabase } from "../../../services/supabase";
import VendorNewProduct from "../../vendor/VendorNewProduct";
import VendorNewAddon from "../../vendor/VendorNewAddon";
import VendorProductEdit from "../../vendor/VendorProductEdit";
import VendorEditAddon from "../../vendor/VendorEditAddon";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { exportToExcel } from "../../../utils/DataExport";
import {
  IoCheckmark,
  IoCloseCircle,
  IoCloudDownloadOutline,
} from "react-icons/io5";
import { IoIosSearch } from "react-icons/io";
import Spinner from "../../../common-components/Spinner";
import { baseImageUrl } from "../../../utils/HelperConstant";
import toast from "react-hot-toast";
import { HiXMark } from "react-icons/hi2";
import { CiMenuKebab } from "react-icons/ci";
import MobileTabProductCard from "../../user/MobileTabProductCard";
import Blogs from "./Blogs";

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
  const [query, setQuery] = useState();
  const [filteredusers, setFilteredUsers] = useState();
  const [isrefresh, setIsrefresh] = useState(false);
  const [clientBoqs, setClientBoqs] = useState(false);
  const [allusers, setAllusers] = useState();

  const [addNewProduct, setAddNewProduct] = useState(false);
  const [addNewAddon, setAddNewAddon] = useState(false);
  const [productlist, setProductlist] = useState(true);
  const [filterDropdown, setFilterDropdown] = useState(false);
  const [selected, setSelected] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPageBeforeSearch, setLastPageBeforeSearch] = useState(1);
  const [searchQuery, setSearchQuery] = useState(""); // to store the latest search input
  const [selectedCategory, setSelectedCategory] = useState("");

  //all the category
  const category = [
    "furniture",
    "HVAC",
    "paint",
    "partitions / ceilings",
    "lux",
    "civil / plumbing",
    "flooring",
    "lighting",
    "smart solutions",
  ];

  const tabs = [
    { name: "Products", value: "products" },
    { name: "Add-Ons", value: "addons" },
  ];

  const normalize = (str) => str.replace(/\s+/g, " ").trim().toLowerCase();
  const applyFilters = ({ query = "", category = "", status = "" }) => {
    const source = toggle ? products : addons;

    // Store last page before searching if this is a new search
    if ((query || category || status) && !isSearching) {
      setLastPageBeforeSearch(currentPage);
      setIsSearching(true);
    }

    // Reset case: No query, category, or status
    if (!query && !category && !status) {
      toggle ? setFilteredProducts(products) : setFilteredAddons(addons);
      if (isSearching) {
        setCurrentPage(lastPageBeforeSearch);
        setIsSearching(false);
      }
      return;
    }

    // Apply filters
    const filtered = source.filter((item) => {
      const titleMatch = query
        ? normalize(item.title).includes(normalize(query))
        : true;

      const categoryMatch = category
        ? toggle
          ? item.products?.category?.toLowerCase() === category.toLowerCase()
          : item.title?.toLowerCase().includes(category.toLowerCase())
        : true;

      const statusMatch = status
        ? item.status?.toLowerCase() === status.toLowerCase()
        : true;

      return titleMatch && categoryMatch && statusMatch;
    });

    // Apply filtered result
    if (toggle) {
      setFilteredProducts(filtered);
    } else {
      setFilteredAddons(filtered);
    }

    setCurrentPage(1); // Always reset to first page on filter
  };

  //venbdor refresh
  const [isvendorRefresh, setIsvendorRefresh] = useState(false);
  //product refresh
  const [isproductRefresh, setIsProductRefresh] = useState(false);

  //addon refresh
  const [isaddonRefresh, setIsAddonRefresh] = useState(false);

  // vendorproductlist
  const [vendorproductlist, setVendorproductlist] = useState(false);

  // new edit option product
  const [editProduct, setEditProduct] = useState(false);
  const [selectedproduct, setSelectedproduct] = useState(null);

  //new edit option addon
  const [editAddon, setEditAddon] = useState(false);
  const [selectedAddon, setSelectedAddon] = useState(null);
  const [toggle, setToggle] = useState(true);

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [addons, setAddons] = useState([]);
  const [filteredAddons, setFilteredAddons] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedTab, setSelectedTab] = useState("products");
  const [isAddProduct, setIsAddProduct] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const handleTabClick = (event) => {
    setProductlist(true);
    setIsAddProduct(false);
    const tab = event.target.value; // Get value from button
    setSelectedTab(tab);
    setToggle(tab === "products"); // Set toggle dynamically
  };

  const [isloading, setIsloading] = useState(false);
  const scrollContainerRef = useRef(null);
  const tableRef = useRef(null);
  const [itemsPerPage, setItemsPerPage] = useState(10); // Default (gets updated dynamically)
  const [rejectReasonPopup, setRejectReasonPopup] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [deleteWarning, setDeleteWarning] = useState(false);
  const [productPreview, setProductPreview] = useState(false);
  const [selectedProductview, setSelectedProductview] = useState();
  const [openMenuId, setOpenMenuId] = useState(null); // Store the ID of the row with an open menu

  const mobileMenuRef = useRef(null);
  const menuRef = useRef({});
  const buttonRef = useRef({});

  const items = toggle ? filteredProducts : filteredAddons;
  const totalPages = Math.ceil(items.length / itemsPerPage);

  // Slice the items for pagination
  const paginatedItems = items.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleMenuToggle = (id) => {
    setOpenMenuId((prev) => (prev === id ? null : id));
  };

  const goToPage = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);

      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  const handleRejectClick = (product) => {
    setSelectedProductview(product);
    setRejectReasonPopup(true);
  };

  const handleProductPreview = (product) => {
    setProductPreview(true);
    setSelectedProductview(product);
  };

  const handleDeleteClick = (item) => {
    setDeleteWarning(true);
    setSelectedProductview(item);
  };

  const handleUpdateStatus = async (product, newStatus, reason = "") => {
    console.log("product", product);

    try {
      if (product && product.type === "product") {
        await supabase
          .from("product_variants") // Table name
          .update({
            status: newStatus,
            // ...(newStatus === "rejected" && { reject_reason: reason }),
            reject_reason: reason,
          })
          .eq("id", product.id); // Matching row
        toast.success(`product ${newStatus}`);
        setRejectReasonPopup(false);
        setRejectReason("");
      }

      if (product.type === "addon") {
        await supabase
          .from("addon_variants") // Ensure this matches your table name
          .update({ status: newStatus }) // New status
          .eq("id", product.id); // Matching row
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
      setFilteredUsers(allusers); // Reset to original list when input is empty
      return;
    }
    const filtereduser = allusers.filter((item) =>
      item.company_name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredUsers(filtereduser);
  };

  const getusers = async () => {
    try {
      // Query the profiles table for phone and companyName
      const { data } = await supabase
        .from("users_profiles")
        .select("*")
        .eq("role", "user");

      // console.log(data);

      setAllusers(data);
      setFilteredUsers(data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsrefresh(false);
    }
  };

  const fetchProducts = async () => {
    setIsloading(true);
    try {
      const { data } = await supabase
        .from("product_variants")
        .select("*,products(*)")
        .order("created_at", { ascending: false })
        .neq("productDisplayType", "boq");

      const sortedData = data.sort((a, b) => {
        // Prioritize "pending" status
        if (a.status === "pending" && b.status !== "pending") return -1;
        if (b.status === "pending" && a.status !== "pending") return 1;

        // If both are "pending" or both are not "pending", sort by date
        return new Date(b.created_at) - new Date(a.created_at);
      });
      setProducts(sortedData);
      setFilteredProducts(sortedData);
    } catch (error) {
      console.log("Error fetching products:", error);
    } finally {
      setIsloading(false);
      setIsProductRefresh(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [isproductRefresh]);

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
        {/* {sidebarstate.isProductOpen && (
          <div className="flex flex-col h-full min-h-0 overflow-hidden lg:border-2 lg:border-[#334A78] lg:rounded-lg bg-white">
            products
          </div>
        )} */}

        {/* product */}
        {sidebarstate.isProductOpen && (
          <div className="flex flex-col h-full min-h-0 overflow-hidden lg:border-2 lg:border-[#334A78] lg:rounded-lg bg-white">
            <div className="overflow-y-auto scrollbar-hide relative ">
              {addNewProduct ? (
                <VendorNewProduct
                  setAddNewProduct={setAddNewProduct}
                  setProductlist={setProductlist}
                />
              ) : addNewAddon ? (
                <VendorNewAddon
                  setAddNewProduct={setAddNewAddon}
                  setProductlist={setProductlist}
                />
              ) : editProduct ? (
                <VendorProductEdit
                  setEditProduct={setEditProduct}
                  setProductlist={setProductlist}
                  setIsProductRefresh={setIsProductRefresh}
                  selectedproduct={selectedproduct}
                />
              ) : editAddon ? (
                <VendorEditAddon
                  seteditAddon={setEditAddon}
                  selectedAddon={selectedAddon}
                  setProductlist={setProductlist}
                  setIsAddonRefresh={setIsAddonRefresh}
                />
              ) : (
                // Default product list and add product UI
                <>
                  <div className=" sticky top-0 z-20 bg-white">
                    <div className="hidden lg:flex justify-between items-center px-4 py-2 border-b-2 border-b-gray-400 ">
                      <h3 className=" capitalize font-semibold text-xl ">
                        product list
                      </h3>

                      <div className="flex gap-2">
                        <div className="relative inline-block">
                          <button
                            onClick={() => setFilterDropdown(!filterDropdown)}
                            className="px-4 py-2 rounded text-[#374A75] text-sm flex items-center gap-3 border"
                          >
                            <img src="/images/icons/filter-icon.png" alt="" />
                            <span className="text-sm">Filter</span>
                            <ChevronDownIcon className="h-4 w-4 text-gray-500" />
                          </button>
                          {filterDropdown && (
                            <div className="absolute mt-2 w-48 -left-1/2 bg-white border rounded-md shadow-lg z-10 p-3">
                              {/* status filter */}
                              <div>
                                <label className="text-sm text-[#374A75]">
                                  Status
                                </label>
                                <select
                                  value={selected}
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    setSelected(value);
                                    setFilterDropdown(false);
                                    applyFilters({
                                      query: searchQuery,
                                      category: selectedCategory,
                                      status: value,
                                    });
                                  }}
                                  className="w-full border-none focus:ring-0 p-2 text-sm"
                                >
                                  <option value="">All</option>
                                  <option value="pending">Pending</option>
                                  <option value="approved">Approved</option>
                                  <option value="rejected">Rejected</option>
                                </select>
                              </div>

                              <div>
                                <label className="text-sm text-[#374A75]">
                                  Categories
                                </label>
                                <select
                                  name="category"
                                  value={selectedCategory}
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    setSelectedCategory(value);
                                    applyFilters({
                                      query: searchQuery,
                                      category: value,
                                      status: selected,
                                    });
                                  }}
                                  id="category"
                                  className="py-2"
                                >
                                  <option value="">All categories</option>
                                  {category.map((category) => (
                                    <option key={category} value={category}>
                                      {category}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="">
                          <button
                            onClick={() => {
                              const exportData = items.map((item) => ({
                                id: item.id,
                                [toggle ? "Product Name" : "Addon Name"]:
                                  item.title,
                                Price: `₹${item.price}`,
                                Status: item?.status,
                                Description: item?.details || "",
                                Dimension: item?.dimensions || "NA",
                                company: item?.manufacturer || "",
                                segment: item?.segment,
                              }));
                              exportToExcel(
                                exportData,
                                toggle ? "products.xlsx" : "addons.xlsx"
                              );
                            }}
                            className=" px-4 py-2 rounded text-[#374A75] text-sm flex items-center gap-3 border "
                          >
                            <IoCloudDownloadOutline /> <span>Export</span>
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between gap-3 px-4 py-2 border-b-2 border-b-gray-400">
                      <div className="flex gap-2">
                        {tabs.map((tab) => (
                          <button
                            key={tab.value}
                            className={`flex items-center gap-2 px-2 text-sm md:text-base md:px-6 py-1 md:py-2 border border-[#374A75] rounded text-[#374A75] ${
                              selectedTab === tab.value
                                ? "bg-[#D3E3F0] "
                                : "bg-white "
                            }`}
                            value={tab.value}
                            onClick={handleTabClick}
                          >
                            {tab.name}
                          </button>
                        ))}
                      </div>

                      <div className=" hidden lg:block w-1/4">
                        <input
                          type="text"
                          value={searchQuery}
                          className="w-full rounded-md p-2 outline-none border-2 border-gray-400"
                          placeholder="......search by product name"
                          onChange={(e) => {
                            const value = e.target.value;
                            setSearchQuery(value);
                            applyFilters({
                              query: value,
                              category: selectedCategory,
                              status: selected,
                            });
                          }}
                        />
                      </div>
                      <div className="lg:hidden flex gap-2">
                        <div className="relative inline-block text-xs">
                          <button
                            onClick={() => setFilterDropdown(!filterDropdown)}
                            className="h-10 w-10 flex justify-center items-center border rounded"
                          >
                            <img src="/images/icons/filter-icon.png" alt="" />
                            {/* <span className="text-sm">Filter</span> */}
                            {/* <ChevronDownIcon className="h-4 w-4 text-gray-500" /> */}
                          </button>
                          {filterDropdown && (
                            <div className="absolute mt-2 w-40 -left-full bg-white border rounded-md shadow-lg z-10 p-3">
                              {/* status filter */}
                              <div>
                                <label className=" text-[#374A75]">
                                  Status
                                </label>
                                <select
                                  value={selected}
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    setSelected(value);
                                    setFilterDropdown(false);
                                    applyFilters({
                                      query: searchQuery,
                                      category: selectedCategory,
                                      status: value,
                                    });
                                  }}
                                  className="w-full border-none focus:ring-0 p-2"
                                >
                                  <option value="">All</option>
                                  <option value="pending">Pending</option>
                                  <option value="approved">Approved</option>
                                  <option value="rejected">Rejected</option>
                                </select>
                              </div>

                              <div>
                                <label className=" text-[#374A75]">
                                  Categories
                                </label>
                                <select
                                  name="category"
                                  value={selectedCategory}
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    setSelectedCategory(value);
                                    applyFilters({
                                      query: searchQuery,
                                      category: value,
                                      status: selected,
                                    });
                                  }}
                                  id="category"
                                  className="py-2"
                                >
                                  <option value="">All categories</option>
                                  {category.map((category) => (
                                    <option key={category} value={category}>
                                      {category}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* export button */}
                        <div className="">
                          <button
                            onClick={() => {
                              const exportData = items.map((item) => ({
                                id: item.id,
                                [toggle ? "Product Name" : "Addon Name"]:
                                  item.title,
                                Price: `₹${item.price}`,
                                Status: item?.status,
                                Description: item?.details || "",
                                Dimension: item?.dimensions || "NA",
                                company: item?.manufacturer || "",
                                segment: item?.segment,
                              }));
                              exportToExcel(
                                exportData,
                                toggle ? "products.xlsx" : "addons.xlsx"
                              );
                            }}
                            className="h-10 w-10 flex justify-center items-center border rounded "
                          >
                            <IoCloudDownloadOutline size={20} color="#374A75" />
                          </button>
                        </div>
                        {/* search button */}
                        <div>
                          <button
                            onClick={() => setMobileSearchOpen(true)}
                            className="h-10 w-10 flex justify-center items-center border rounded"
                          >
                            <IoIosSearch size={20} color="#374A75" />
                          </button>
                          {mobileSearchOpen && (
                            <div
                              className={`absolute top-0 bg-[#fff] w-full h-[95%] z-30 flex justify-between items-center px-3 !transition-all !duration-700 !ease-in-out ${
                                mobileSearchOpen
                                  ? "opacity-100 translate-x-0 left-0"
                                  : "opacity-0 -translate-x-full right-0"
                              }`}
                            >
                              <input
                                type="text"
                                value={searchQuery}
                                placeholder="......search by product name"
                                onChange={(e) => {
                                  const value = e.target.value;
                                  setSearchQuery(value);
                                  applyFilters({
                                    query: value,
                                  });
                                }}
                                className="w-3/4 px-2 py-2.5 border rounded-sm text-[10px]"
                              />
                              <button
                                className="mr-4"
                                onClick={() => setMobileSearchOpen(false)}
                              >
                                <IoCloseCircle size={25} color="#374A75" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/*  */}

                  {productlist &&
                    (isloading ? (
                      <Spinner />
                    ) : items.length > 0 ? (
                      <>
                        {/* // <section className="mt-2 flex-1 overflow-hidden px-8"> */}
                        <section className="hidden lg:block h-[90%] font-Poppins overflow-hidden">
                          <div
                            className="w-full h-full border-t border-b border-[#CCCCCC] overflow-y-auto custom-scrollbar"
                            ref={scrollContainerRef}
                          >
                            <table
                              className="min-w-full border-collapse"
                              ref={tableRef}
                            >
                              <thead className="bg-[#FFFFFF] sticky top-0 z-10 px-8 text-center text-[#000] text-base">
                                <tr>
                                  {toggle ? (
                                    <th className="p-3 font-medium">
                                      Product Name
                                    </th>
                                  ) : (
                                    <th className="p-3 font-medium">
                                      Addon Name
                                    </th>
                                  )}
                                  <th className="p-3  font-medium">Price</th>
                                  <>
                                    <th className="p-3 font-medium">status</th>
                                  </>
                                  <th className="p-3 font-medium">Action</th>
                                </tr>
                              </thead>
                              <tbody className=" text-sm">
                                {paginatedItems.map((item) => (
                                  <tr
                                    key={item.id}
                                    className="hover:bg-gray-50 cursor-pointer"
                                  >
                                    <td className="border border-gray-200 p-3 align-middle">
                                      <div className="flex items-center gap-2">
                                        <img
                                          src={`${baseImageUrl}${item.image}`}
                                          alt={item.title}
                                          className="w-10 h-10 object-contain rounded"
                                        />

                                        <span>{item.title}</span>
                                      </div>
                                    </td>
                                    <td className="border border-gray-200 p-3 align-middle text-center">
                                      ₹{item.price}
                                    </td>

                                    <td className="border border-gray-200 p-3 align-middle text-center group relative">
                                      {item.status === "pending" ? (
                                        <div className="flex items-center justify-center">
                                          <span className="text-[#13B2E4]">
                                            Pending
                                          </span>
                                          <div className="absolute top-0 left-0 w-full h-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                              className="bg-gray-100 text-green-600 p-3 rounded-full mr-2 hover:text-gray-100 hover:bg-green-600"
                                              onClick={() => {
                                                handleUpdateStatus(
                                                  item,
                                                  "approved"
                                                );
                                                setRejectReason("");
                                              }}
                                              // onClick={() => handleAccept(item)}
                                            >
                                              <IoCheckmark size={20} />
                                            </button>
                                            <button
                                              className="bg-gray-100 text-red-600 p-3 rounded-full mr-2 hover:text-gray-100 hover:bg-red-600"
                                              // onClick={() =>
                                              //   handleReject(item.id)
                                              // }
                                              // onClick={() =>
                                              //   handleUpdateStatus(
                                              //     item,
                                              //     "rejected"
                                              //   )
                                              // }
                                              onClick={() =>
                                                handleRejectClick(item)
                                              }
                                            >
                                              <HiXMark size={20} />
                                            </button>
                                          </div>
                                        </div>
                                      ) : item.status === "approved" ? (
                                        <span className="text-green-400">
                                          approved
                                        </span>
                                      ) : (
                                        <span className="text-red-400">
                                          {item.status || "N/A"}
                                        </span>
                                      )}
                                    </td>

                                    <td className="border border-gray-200 p-3 align-middle flex justify-center items-center relative">
                                      <button
                                        ref={(el) =>
                                          (buttonRef.current[item.id] = el)
                                        }
                                        className="bg-white flex justify-center items-center py-1.5 w-20 mb-2"
                                        onClick={() =>
                                          handleMenuToggle(item.id)
                                        }
                                      >
                                        <CiMenuKebab size={25} />
                                      </button>

                                      {openMenuId === item.id && (
                                        <div
                                          ref={(el) =>
                                            (menuRef.current[item.id] = el)
                                          }
                                          className="absolute top-1/2 left-0 transform mt-2 bg-white border border-gray-300 shadow-md rounded-md w-24 z-10"
                                        >
                                          <button
                                            onClick={() => {
                                              handleProductPreview(item);
                                            }}
                                            className=" flex gap-2 items-center w-full text-left px-3 py-2 hover:bg-gray-200"
                                          >
                                            <VscEye /> View
                                          </button>
                                          {toggle ? (
                                            <button
                                              onClick={() => {
                                                setSelectedproduct(item);
                                                setEditProduct(true);
                                              }}
                                              className=" flex gap-2 items-center w-full text-left px-3 py-2 hover:bg-gray-200"
                                            >
                                              <VscEye /> Edit
                                            </button>
                                          ) : (
                                            <button
                                              onClick={() => {
                                                setSelectedAddon(item);
                                                setEditAddon(true);
                                              }}
                                              className=" flex gap-2 items-center w-full text-left px-3 py-2 hover:bg-gray-200"
                                            >
                                              <VscEye /> Edit
                                            </button>
                                          )}
                                          <button
                                            // onClick={() => {
                                            //   handleDelete(item);
                                            // }}
                                            onClick={() => {
                                              handleDeleteClick(item);
                                            }}
                                            className="flex gap-2 items-center w-full text-left px-3 py-2 hover:bg-gray-200"
                                          >
                                            <MdOutlineDelete /> Delete
                                          </button>
                                        </div>
                                      )}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </section>
                        <section className="lg:hidden mb-5">
                          {paginatedItems.map((item) => (
                            <MobileTabProductCard
                              key={item?.id}
                              product={item}
                              handleProductPreview={handleProductPreview}
                            />
                          ))}
                        </section>
                      </>
                    ) : (
                      <>
                        <p className="p-5 text-gray-500 text-center">
                          No {toggle ? "products" : "addons"} found.
                        </p>
                      </>
                    ))}

                  {/* Pagination Controls (Always Visible) */}
                  {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-10 z-30 sticky bottom-0 bg-[#EBF0FF] mb-4 text-[#3d194f]">
                      <button
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-1 border rounded disabled:opacity-50 text-[#3d194f]"
                      >
                        Previous
                      </button>

                      {/* Page Numbers */}
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) =>
                          page === 1 ||
                          page === totalPages ||
                          (page >= currentPage - 1 &&
                            page <= currentPage + 1) ? (
                            <button
                              key={page}
                              onClick={() => goToPage(page)}
                              className={`w-8 h-8 flex items-center justify-center  ${
                                currentPage === page
                                  ? "bg-[#aca9d3] text-white rounded-full "
                                  : "rounded-md text-[#3d194f]"
                              }`}
                            >
                              {page}
                            </button>
                          ) : page === currentPage + 2 ||
                            page === currentPage - 2 ? (
                            <span key={page} className="px-2">
                              ...
                            </span>
                          ) : null
                      )}
                      <button
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 border rounded disabled:opacity-50 text-[#3d194f]"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {/* customers */}
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

        {/* discounts */}
        {sidebarstate.isDiscountOpen && (
          <div className="flex flex-col h-full min-h-0  lg:border-2 lg:border-[#334A78] lg:rounded-lg bg-white">
            <Discount />
          </div>
        )}
        {/* blogs */}
        {sidebarstate.isBlogsOpen && (
          <div className="flex flex-col h-full min-h-0 overflow-hidden lg:border-2 lg:border-[#334A78] lg:rounded-lg bg-white">
            <Blogs />
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
