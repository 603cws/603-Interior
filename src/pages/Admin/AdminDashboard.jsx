import { useEffect, useState, useRef, useReducer } from "react";
import { RiDashboardFill, RiFormula, RiSettingsLine } from "react-icons/ri";
import { useLocation, useNavigate } from "react-router-dom";
import { useApp } from "../../Context/Context";
import { supabase, adminsupabase } from "../../services/supabase";
import toast from "react-hot-toast";
import { VscSignOut } from "react-icons/vsc";
import {
  IoCalendarOutline,
  IoCheckmark,
  IoSettingsSharp,
} from "react-icons/io5";
import { LuBlend } from "react-icons/lu";
import { FaRegUserCircle, FaUser, FaUserPlus } from "react-icons/fa";
import { FaBuilding } from "react-icons/fa";
import { PiHandshakeFill } from "react-icons/pi";
import VendorNewProduct from "../vendor/VendorNewProduct";
import VendorNewAddon from "../vendor/VendorNewAddon";
import { VscEye } from "react-icons/vsc";
import { MdOutlineDelete, MdOutlineSpaceDashboard } from "react-icons/md";
import { CiMenuKebab, CiShop } from "react-icons/ci";
import Spinner from "../../common-components/Spinner";
import SidebarItem from "../../common-components/SidebarItem";
import Clients from "./Clients";
import VendorProductlist from "./VendorProductlist";
import DashboardProductCard from "../vendor/DashboardProductCard";
import DashboardCards from "./DashboardCards";
import DashboardInbox from "./DashboardInbox";
import CreateUser from "./CreateUser";
import { HiXMark } from "react-icons/hi2";
import { MdDeleteOutline } from "react-icons/md";
// import { FaUserPlus } from "react-icons/fa6";
import { TbCalculator, TbCalendarStats } from "react-icons/tb";
import Schedule from "./Schedule";
import FormulaEditor from "../../boq/components/FormulaEditor";
import VendorEditAddon from "../vendor/VendorEditAddon";
import VendorProductEdit from "../vendor/VendorProductEdit";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { exportToExcel } from "../../utils/DataExport";
import { useLogout } from "../../utils/HelperFunction";
import MobileTabProductCard from "../user/MobileTabProductCard";
import { IoCloseCircle, IoCloudDownloadOutline } from "react-icons/io5";
import { IoIosSearch } from "react-icons/io";
import UserCard from "../user/UserCard";
import UserProfileEdit from "../user/UserProfileEdit";
import { GoPlus } from "react-icons/go";
import ClientBoq from "./ClientBoq";
import { baseImageUrl } from "../../utils/HelperConstant";
import { BsBoxSeam } from "react-icons/bs";
import { FiLogOut } from "react-icons/fi";

function handlesidebarState(state, action) {
  switch (action.type) {
    case "TOGGLE_SECTION":
      return {
        isSettingOpen: action.payload === "Setting",
        isProductOpen: action.payload === "Product",
        // iseditopen: action.payload === "Edit",
        dashboard: action.payload === "Dashboard",
        isClientOpen: action.payload === "Client",
        isCreateOpen: action.payload === "Create",
        isVendorOpen: action.payload === "Vendors",
        isScheduleOpen: action.payload === "Schedule",
        isFormulaeOpen: action.payload === "Formulae",
        // help: action.payload === "Help",
        // isBookAppointmentOpen: action.payload === "BookAppointment",
        currentSection: action.payload,
      };
    default:
      return state;
  }
}

const SECTIONS = {
  DASHBOARD: "Dashboard",
  PRODUCT: "Product",
  CLIENTS: "Client",
  VENDORS: "Vendors",
  CREATE: "Create",
  SCHEDULE: "Schedule",
  FORMULAE: "Formulae",
  SETTING: "Setting",
  // HELP: "Help",
  // EDIT: "Edit",
  // BOOkAPPOINTMENT: "BookAppointment",
};

function AdminDashboard() {
  const logout = useLogout();
  const navigate = useNavigate();
  // const [isSettingOpen, setIsSettingOpen] = useState(false);
  // const [isProductOpen, setIsProductOpen] = useState(false);
  const [iseditopen, setIsEditopen] = useState(true);
  // const [dashboard, setDashboard] = useState(true);
  // const [currentSection, setCurrentSection] = useState("AdminDashboard");
  // const [isclientopen, setIsclientopen] = useState(false);
  // const [isvendoropen, setIsvendoropen] = useState(false);
  const [query, setQuery] = useState();
  const [isAddProduct, setIsAddProduct] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null); // Store the ID of the row with an open menu
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedProductview, setSelectedProductview] = useState();
  const [productPreview, setProductPreview] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);

  //user refresh
  const [isrefresh, setIsrefresh] = useState(false);

  //venbdor refresh
  const [isvendorRefresh, setIsvendorRefresh] = useState(false);
  //product refresh
  const [isproductRefresh, setIsProductRefresh] = useState(false);

  //addon refresh
  const [isaddonRefresh, setIsAddonRefresh] = useState(false);

  // vendorproductlist
  const [vendorproductlist, setVendorproductlist] = useState(false);

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [addons, setAddons] = useState([]);
  const [filteredAddons, setFilteredAddons] = useState([]);

  const menuRef = useRef({});
  const buttonRef = useRef({});
  const mobileMenuRef = useRef(null);

  // loading
  const [isloading, setIsloading] = useState(false);

  // const [vendorsearch, setVendorsearch] = useState();

  const [addNewProduct, setAddNewProduct] = useState(false);
  const [addNewAddon, setAddNewAddon] = useState(false);
  const [productlist, setProductlist] = useState(true);

  const [allusers, setAllusers] = useState();
  const [filteredusers, setFilteredUsers] = useState();
  const [filteredvendors, setFilteredvendors] = useState();
  const [allvendors, setAllvendors] = useState();

  const [toggle, setToggle] = useState(true);
  const [selectedTab, setSelectedTab] = useState("products");

  // create profile
  // const [createProfile, setCreateProfikle] = useState(false);

  //delete warning
  const [deleteWarning, setDeleteWarning] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectReasonPopup, setRejectReasonPopup] = useState(false);
  const [clientBoqs, setClientBoqs] = useState(false);

  //state schedule
  // const [isScheduleOpen, setisScheduleOpen] = useState(false);
  // const [isFormulaeOpen, setisFormulaeOpen] = useState(false);
  const sidebarInitialState = {
    dashboard: true,
    isProductOpen: false,
    isClientOpen: false,
    isVendorOpen: false,
    isCreateOpen: false,
    isScheduleOpen: false,
    isFormulaeOpen: false,
    isSettingOpen: false,

    currentSection: "Dashboard",
  };

  const [sidebarstate, sidebarDispatch] = useReducer(
    handlesidebarState,
    sidebarInitialState
  );

  const tabs = [
    { name: "Products", value: "products" },
    { name: "Add-Ons", value: "addons" },
  ];

  const [selectedCategory, setSelectedCategory] = useState("");
  // state for filter
  const [isOpen, setIsOpen] = useState(false);
  const [filterDropdown, setFilterDropdown] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [selected, setSelected] = useState("");

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

  //baseurlforimg
  // const baseImageUrl =
  //   "https://bwxzfwsoxwtzhjbzbdzs.supabase.co/storage/v1/object/public/addon/";

  const { accountHolder } = useApp();

  const location = useLocation();

  useEffect(() => {
    if (location.state?.openSettings) {
      sidebarDispatch({ type: "TOGGLE_SECTION", payload: SECTIONS.SETTING });
    }
  }, [location.state]);

  const handleTabClick = (event) => {
    setProductlist(true);
    setIsAddProduct(false);
    const tab = event.target.value; // Get value from button
    setSelectedTab(tab);
    setToggle(tab === "products"); // Set toggle dynamically
  };
  const tableRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const [itemsPerPage, setItemsPerPage] = useState(10); // Default (gets updated dynamically)
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPageBeforeSearch, setLastPageBeforeSearch] = useState(1);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // to store the latest search input

  const items = toggle ? filteredProducts : filteredAddons;
  // const items = toggle ? products : addons;
  const totalPages = Math.ceil(items.length / itemsPerPage);

  //state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedindex, setSelectedindex] = useState();

  // new edit option product
  const [editProduct, setEditProduct] = useState(false);
  const [selectedproduct, setSelectedproduct] = useState(null);

  //new edit option addon
  const [editAddon, setEditAddon] = useState(false);
  const [selectedAddon, setSelectedAddon] = useState(null);

  //handle functions
  const handleDeletevendirClick = (user, index) => {
    setSelectedUser(user);
    setIsModalOpen(true);
    setSelectedindex(index);
  };

  const handleConfirmDelete = async () => {
    if (selectedUser) {
      try {
        // Call your delete function here
        await adminsupabase.auth.admin.deleteUser(selectedUser.id);
        setIsModalOpen(false);
        setSelectedUser(null);
      } catch (error) {
        console.log(error);
      } finally {
        setIsvendorRefresh(true);
      }
    }
  };

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

  useEffect(() => {
    const calculateItemsPerPage = () => {
      if (tableRef.current) {
        const tableHeight = tableRef.current.clientHeight; // Get table's available height
        const rowHeight = 60; // Approximate row height (adjust if needed)
        const headerHeight = 50; // Height of the table header
        const maxRows = Math.floor((tableHeight - headerHeight) / rowHeight);

        // setItemsPerPage(maxRows > 0 ? maxRows : 1); // Ensure at least 1 row is shown
      }
    };

    calculateItemsPerPage();
    window.addEventListener("resize", calculateItemsPerPage);
    return () => window.removeEventListener("resize", calculateItemsPerPage);
  }, []);

  // Slice the items for pagination
  const paginatedItems = items.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToPage = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);

      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };
  const fetchProducts = async () => {
    setIsloading(true);
    try {
      const { data } = await supabase
        .from("product_variants")
        .select("*,products(*)")
        .order("created_at", { ascending: false });

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

  const fetchAddons = async () => {
    try {
      const { data, error } = await supabase.from("addon_variants").select("*");

      const sortedData = data.sort((a, b) => {
        // Prioritize "pending" status
        if (a.status === "pending" && b.status !== "pending") return -1;
        if (b.status === "pending" && a.status !== "pending") return 1;

        // If both are "pending" or both are not "pending", sort by date
        return new Date(b.created_at) - new Date(a.created_at);
      });

      if (error) {
        console.log("Error fetching addons:", error);
      } else {
        setAddons(sortedData);
        setFilteredAddons(sortedData);
      }
    } finally {
      setIsAddonRefresh(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [isproductRefresh]);

  useEffect(() => {
    fetchAddons();
  }, [isaddonRefresh]);

  const handleMenuToggle = (id) => {
    setOpenMenuId((prev) => (prev === id ? null : id));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      // If clicking inside the menu OR the menu button, do nothing
      if (
        openMenuId !== null &&
        (menuRef.current[openMenuId]?.contains(event.target) ||
          buttonRef.current[openMenuId]?.contains(event.target))
      ) {
        return;
      }

      // Otherwise, close the menu
      setOpenMenuId(null);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openMenuId]);

  const handleProductPreview = (product) => {
    setProductPreview(true);
    setSelectedProductview(product);
  };

  const handleDeleteClick = (item) => {
    setDeleteWarning(true);
    setSelectedProductview(item);
  };

  const handleDelete = async (selectedProductview) => {
    try {
      if (selectedProductview && selectedProductview.type === "product") {
        await supabase
          .from("product_variants") // Ensure this matches your table name
          .delete()
          .eq("id", selectedProductview.id);

        toast.success("Product deleted successfully!");
        setIsProductRefresh(true);
      }

      if (selectedProductview.type === "addon") {
        await supabase
          .from("addon_variants") // Ensure this matches your table name
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
          console.log("error parsing error", parseError);
        }
      }

      if (imagePaths.length > 0) {
        const { storageError } = await supabase.storage
          .from("addon")
          .remove(imagePaths);

        if (storageError) throw storageError;
      }

      setProductPreview(false); // Close the modal after deletion
    } catch (error) {
      console.log(error);
    } finally {
      selectedProductview.type === "product"
        ? setIsProductRefresh(true)
        : setIsAddonRefresh(true);
    }
    setDeleteWarning(false);
  };

  const handleRejectClick = (product) => {
    setSelectedProductview(product);
    setRejectReasonPopup(true);
  };

  const handleConfirmReject = () => {
    if (!rejectReason) {
      toast.error("Please enter a reason for rejecting the product");
      return;
    }
    handleUpdateStatus(selectedProductview, "rejected", rejectReason);
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

  const handlesetting = () => {
    sidebarDispatch({ type: "TOGGLE_SECTION", payload: SECTIONS.SETTING });
  };
  const handleproduct = () => {
    sidebarDispatch({ type: "TOGGLE_SECTION", payload: SECTIONS.PRODUCT });
  };

  const handledashboard = () => {
    sidebarDispatch({ type: "TOGGLE_SECTION", payload: SECTIONS.DASHBOARD });
  };

  const handleclient = () => {
    sidebarDispatch({ type: "TOGGLE_SECTION", payload: SECTIONS.CLIENTS });
  };

  const handleVendor = () => {
    sidebarDispatch({ type: "TOGGLE_SECTION", payload: SECTIONS.VENDORS });
  };
  const handlecreate = () => {
    sidebarDispatch({ type: "TOGGLE_SECTION", payload: SECTIONS.CREATE });
  };

  const handleschedule = () => {
    sidebarDispatch({ type: "TOGGLE_SECTION", payload: SECTIONS.SCHEDULE });
  };

  const handleformulae = () => {
    sidebarDispatch({ type: "TOGGLE_SECTION", payload: SECTIONS.FORMULAE });
  };

  const getvendors = async () => {
    // Query the profiles table for phone and companyName
    try {
      const { data } = await supabase
        .from("users_profiles")
        .select("*")
        .eq("role", "vendor");

      setAllvendors(data);
      setFilteredvendors(data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsvendorRefresh(false);
    }
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

  // get all the users and vendors from the database
  useEffect(() => {
    getvendors();
  }, [isvendorRefresh]);

  useEffect(() => {
    getusers();
  }, [isrefresh]);

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

  const filterVendorByMultipleFields = (query) => {
    if (!query) {
      setFilteredvendors(allvendors); // Reset to original list when input is empty
      return;
    }
    const filteredvendor = allvendors.filter((item) =>
      item.company_name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredvendors(filteredvendor);
  };

  // const filterbyCategory = (category) => {
  //   // console.log(category);
  //   setSelectedCategory(category);

  //   if (toggle) {
  //     if (!category) {
  //       setFilteredProducts(products); // Reset to original list when input is empty
  //       return;
  //     }
  //     const filtered = products.filter(
  //       (item) =>
  //         item.products.category.toLowerCase() === category.toLowerCase()
  //     );
  //     // console.log(filtered);

  //     setFilteredProducts(filtered);
  //   } else {
  //     if (!category) {
  //       setFilteredAddons(addons); // Reset to original list when input is empty
  //       return;
  //     }
  //     const filtered = addons.filter((item) =>
  //       item.title.toLowerCase().includes(category.toLowerCase())
  //     );
  //     // console.log(filtered);

  //     setFilteredAddons(filtered);
  //   }
  //   setCurrentPage(1);
  // };

  // console.log(accountHolder);

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
          {/* <h3
            className={`capitalize text-[#A1A1A1] ${
              isExpanded ? "mx-4" : "hidden"
            }`}
          >
            main
          </h3> */}
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
            icon={<FaUser />}
            text="Client"
            onClick={handleclient}
            isExpanded={isExpanded}
            currentSection={sidebarstate?.currentSection}
          />
          <SidebarItem
            icon={<CiShop />}
            text="Vendors"
            onClick={handleVendor}
            isExpanded={isExpanded}
            currentSection={sidebarstate?.currentSection}
          />
          <SidebarItem
            icon={<FaUserPlus />}
            text="create"
            onClick={handlecreate}
            isExpanded={isExpanded}
            currentSection={sidebarstate?.currentSection}
          />
          <SidebarItem
            icon={<IoCalendarOutline />}
            text="schedule"
            onClick={handleschedule}
            isExpanded={isExpanded}
            currentSection={sidebarstate?.currentSection}
          />
          <SidebarItem
            icon={<TbCalculator />}
            text="formulae"
            onClick={handleformulae}
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
          />
        </div>

        {/* Other Items */}
        {/* <div className="font-semibold text-lg capitalize leading-normal tracking-wide  text-[#262626] flex flex-col gap-2 px-3">
          <h3
            className={`capitalize text-[#A1A1A1] ${
              isExpanded ? "mx-4" : "hidden"
            }`}
          >
            other
          </h3>
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
          />
        </div> */}
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

          {/* <div className=" mx-3">
                    <MdMenuOpen size={30} />
                  </div> */}

          <div
            ref={mobileMenuRef}
            className={`fixed top-0 right-0 h-full w-64 bg-white border-l z-50 transform ${
              isOpen ? "translate-x-0" : "translate-x-full"
            } transition-transform duration-300 ease-in-out shadow-lg`}
          >
            {/* <div className="p-4 flex justify-between items-center border-b">
                      <h2 className="text-lg font-semibold text-[#1A3365]">Menu</h2>
                      <button onClick={() => setIsOpen(false)} className="text-xl">
                        <FaTimes />
                      </button>
                    </div> */}

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
                icon={<LuBlend />}
                title={"Product"}
                currentSection={sidebarstate?.currentSection}
                onClick={handleproduct}
                setIsOpen={setIsOpen}
              />
              <MobileMenuItem
                icon={<FaRegUserCircle />}
                title="Client"
                currentSection={sidebarstate?.currentSection}
                onClick={handleclient}
                setIsOpen={setIsOpen}
              />
              <MobileMenuItem
                icon={<PiHandshakeFill />}
                title="Vendors"
                currentSection={sidebarstate?.currentSection}
                onClick={handleVendor}
                setIsOpen={setIsOpen}
              />
              <MobileMenuItem
                icon={<FaUserPlus />}
                title="Create"
                currentSection={sidebarstate?.currentSection}
                onClick={handlecreate}
                setIsOpen={setIsOpen}
              />
              <MobileMenuItem
                icon={<TbCalendarStats />}
                title="Schedule"
                currentSection={sidebarstate?.currentSection}
                onClick={handleschedule}
                setIsOpen={setIsOpen}
              />
              <MobileMenuItem
                icon={<RiFormula />}
                title="Formulae"
                currentSection={sidebarstate?.currentSection}
                onClick={handleformulae}
                setIsOpen={setIsOpen}
              />

              <hr className="border-gray-200" />
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

        {/* div for dashboard */}
        {sidebarstate.dashboard && (
          <div className="flex flex-col h-full min-h-0 loverflow-hidden lg:border-2 border-[#334A78] rounded-lg bg-[#fff]">
            {/* for dashboard */}
            <div className="w-full flex-1 flex overflow-y-auto scrollbar-hide  py-2 px-3">
              {/* <p>this part is under working</p> */}
              <div className="xl:flex justify-evenly gap-4 w-full flex-1">
                <div className="p-4 flex-1">
                  <DashboardCards
                    totalclients={allusers}
                    totalVendors={allvendors}
                    vendors={handleVendor}
                    clients={handleclient}
                    products={products}
                    handleproduct={handleproduct}
                    addons={addons}
                  />
                </div>
                <div className="flex-1 p-4">
                  <DashboardInbox
                    viewDetails={handleproduct}
                    products={products}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* setting */}
        {sidebarstate?.isSettingOpen && (
          <div className="flex flex-col h-full min-h-0 overflow-hidden lg:border-2 lg:border-[#334A78] lg:rounded-lg bg-white">
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

        {sidebarstate.isClientOpen && !clientBoqs && (
          <>
            <Clients
              isExpanded={isExpanded}
              filterByMultipleFields={filterByMultipleFields}
              query={query}
              filteredusers={filteredusers}
              setIsrefresh={setIsrefresh}
              setClientBoqs={setClientBoqs}
            />
          </>
        )}

        {sidebarstate.isClientOpen && clientBoqs && (
          <ClientBoq setClientBoqs={setClientBoqs} />
        )}

        {/*vendor page */}
        {sidebarstate.isVendorOpen && !vendorproductlist && (
          <div className="flex flex-col h-full min-h-0 overflow-hidden lg:border-2 lg:border-[#334A78] lg:rounded-lg bg-white">
            {/* for dashboard */}
            <div className="w-full flex flex-col overflow-y-auto scrollbar-hide h-[calc(100vh-120px)] pb-2 px-3">
              <div className=" sticky top-0 z-20 bg-[#FFF]">
                <div className="flex justify-between items-center px-4 py-2 border-b-2 border-b-gray-400 ">
                  <h3 className="capitalize font-semibold text-xl ">
                    Vendor List
                  </h3>
                  <div className="w-1/2 hidden lg:block">
                    <input
                      type="text"
                      className="w-full rounded-lg px-2 py-1 outline-none border border-[#ccc]"
                      placeholder="......search by company name"
                      onChange={(e) =>
                        filterVendorByMultipleFields(e.target.value)
                      }
                      value={query}
                    />
                  </div>
                  <div className="lg:hidden flex gap-2">
                    {/* add vendor button */}
                    <button
                      onClick={handlecreate}
                      className="h-10 w-10 flex justify-center items-center bg-[#374A75] text-[#fff] rounded"
                    >
                      <GoPlus size={20} />
                    </button>

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
              {/* client card for display */}

              <div
                className={`grid grid-cols-1 md:grid-cols-2  ${
                  isExpanded
                    ? "lg:grid-cols-2 xl:grid-cols-4 gap-8"
                    : "lg:grid-cols-2 xl:grid-cols-4 gap-4"
                } p-2`}
              >
                {filteredvendors.map((user, index) => {
                  return (
                    <div
                      key={index}
                      className={`w-full max-w-xs rounded-lg border overflow-hidden shadow-md bg-white relative flex flex-col p-2`}
                    >
                      {/* Top Section */}
                      <div
                        className={` ${
                          isExpanded ? " gap-2 py-3 px-1" : "gap-3 py-4 px-2"
                        } flex items-start  relative`}
                      >
                        {/* Profile Image */}
                        <img
                          src={user?.profile_image}
                          alt="profile"
                          className={`${
                            isExpanded ? "w-10 h-10" : "w-12 h-12"
                          }  rounded-full object-cover border border-[#ccc]`}
                        />

                        {/* Name and Email */}
                        <div className="flex flex-col justify-center">
                          <h2
                            className={`${
                              isExpanded ? "text-sm" : "text-base"
                            }  font-semibold text-black`}
                          >
                            {user.company_name}
                          </h2>
                          <p
                            className={`text-gray-400 w-full ${
                              isExpanded ? "text-xs" : "text-sm"
                            } leading-tight break-all whitespace-normal`}
                          >
                            {user.email}
                          </p>
                        </div>

                        {/* Delete Icon */}
                        <button
                          onClick={() => handleDeletevendirClick(user, index)}
                          className="absolute top-2 right-2 text-black hover:text-red-500"
                        >
                          <MdDeleteOutline size={20} />
                        </button>
                      </div>
                      {/* Bottom Section */}
                      <div
                        onClick={() => {
                          setSelectedVendor(user); // Store selected vendor
                          setVendorproductlist(true); // Show product list
                        }}
                        className=" cursor-pointer text-[#374A75] p-3 flex items-center gap-2 flex-1 mt-auto border-t"
                      >
                        <FaBuilding className="" />
                        <p className="text-sm ">{user?.company_name}</p>
                      </div>

                      {isModalOpen && selectedindex === index && (
                        <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-black/40">
                          <div className="bg-white rounded-lg px-5 py-2">
                            <h3 className="text-sm font-semibold">
                              Are you sure?
                            </h3>
                            <p className="text-sm">
                              Do you really want to delete{" "}
                              {selectedUser?.company_name}?
                            </p>
                            <div className="flex justify-center mt-4 gap-3">
                              <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 bg-gray-300 rounded"
                              >
                                No
                              </button>
                              <button
                                onClick={handleConfirmDelete}
                                className="px-4 py-2 bg-red-500 text-white rounded"
                              >
                                Yes
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    // <div
                    //   key={index}
                    //   className={`flex flex-col ${
                    //     isExpanded
                    //       ? "lg:w-[200px] xl:w-[270px] h-[170px]"
                    //       : "w-[300px] lg:w-[320px] h-[150px]"
                    //   }  font-Poppins rounded-2xl bg-[#fff] relative`}
                    // >
                    //   <div
                    //     className={`flex items-center my-4 ${
                    //       isExpanded && "px-4 py-2"
                    //     }`}
                    //   >
                    //     <div className={`mx-3 ${isExpanded && "hidden"}`}>
                    //       <img
                    //         src={accountHolder.profileImage}
                    //         alt="usericon"
                    //         className="w-10"
                    //       />
                    //     </div>
                    //     <div>
                    //       <h2 className="text-[#000] text-base font-medium">
                    //         {user.company_name}
                    //       </h2>
                    //       <p className="text-[#ccc] text-wrap text-[13px]">
                    //         {user.email}
                    //       </p>
                    //     </div>
                    //     <div className={`ml-auto px-2`}>
                    //       {" "}
                    //       <button
                    // onClick={() =>
                    //   handleDeletevendirClick(user, index)
                    // }
                    //       >
                    //         {" "}
                    //         <MdDeleteOutline size={25} />{" "}
                    //       </button>
                    //     </div>
                    //   </div>
                    //   <div className="flex-1 flex items-end pl-6 gap-3 my-5">
                    //     <div className="">
                    //       {" "}
                    //       <FaBuilding size={22} />
                    //     </div>{" "}
                    //     <button
                    //       onClick={() => {
                    //         setSelectedVendor(user); // Store selected vendor
                    //         setVendorproductlist(true); // Show product list
                    //       }}
                    //       className="font-medium text-[#ccc] text-base"
                    //     >
                    //       {user.company_name}
                    //     </button>
                    //   </div>
                    //   {isModalOpen && selectedindex === index && (
                    //     <div className=" inset-0 flex items-center justify-center bg-opacity-80 absolute w-full h-full">
                    //       <div className="bg-white rounded-lg px-5 py-2">
                    //         <h3 className="text-lg font-semibold">
                    //           Are you sure?
                    //         </h3>
                    //         <p>
                    //           Do you really want to delete{" "}
                    //           {selectedUser?.company_name}?
                    //         </p>
                    //         <div className="flex justify-center mt-4 gap-3">
                    //           <button
                    //             onClick={() => setIsModalOpen(false)}
                    //             className="px-4 py-2 bg-gray-300 rounded"
                    //           >
                    //             No
                    //           </button>
                    //           <button
                    //             onClick={handleConfirmDelete}
                    //             className="px-4 py-2 bg-red-500 text-white rounded"
                    //           >
                    //             Yes
                    //           </button>
                    //         </div>
                    //       </div>
                    //     </div>
                    //   )}
                    // </div>
                  );
                })}
              </div>
            </div>{" "}
          </div>
        )}

        {sidebarstate.isVendorOpen && vendorproductlist && (
          <VendorProductlist
            setVendorproductlist={setVendorproductlist}
            selectedVendor={selectedVendor}
            updateStatus={handleUpdateStatus}
            deleteWarning={deleteWarning}
            setDeleteWarning={setDeleteWarning}
            rejectReason={rejectReason}
            setRejectReason={setRejectReason}
            handleConfirmReject={handleUpdateStatus}
          />
        )}

        {/* create profile */}
        {sidebarstate.isCreateOpen && (
          <div className="flex flex-col h-full min-h-0 overflow-hidden lg:border-2 lg:border-[#334A78] lg:rounded-lg bg-white">
            <div className="overflow-y-auto scrollbar-hide h-[calc(100vh-120px)] rounded-3xl relative ">
              <CreateUser />
            </div>
          </div>
        )}

        {/* schedule  */}
        {sidebarstate.isScheduleOpen && <Schedule />}

        {sidebarstate.isFormulaeOpen && <FormulaEditor />}
      </div>
      {/* </div> */}
      {/* product preview */}
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
        />
      )}

      {deleteWarning && (
        <div className="flex justify-center items-center fixed inset-0 z-30">
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="bg-white relative py-7 px-16 md:px-20">
            <div className="flex justify-center items-center">
              <img
                src="images/icons/delete-icon.png"
                alt=""
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
      {/* </div> */}
    </div>
  );
}

export default AdminDashboard;

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
