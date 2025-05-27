import { useEffect, useState, useRef } from "react";
import { RiDashboardFill } from "react-icons/ri";
import { useLocation, useNavigate } from "react-router-dom";
import { useApp } from "../../Context/Context";
import { supabase, adminsupabase } from "../../services/supabase";
import toast from "react-hot-toast";
import UserProfile from "../user/UserProfile";
import UserSetting from "../user/UserSetting";
import { FaArrowLeft } from "react-icons/fa6";
import { VscSignOut } from "react-icons/vsc";
import { IoCheckmark, IoSettingsSharp } from "react-icons/io5";
import { LuBlend } from "react-icons/lu";
import { FaRegUserCircle } from "react-icons/fa";
import { FaBuilding } from "react-icons/fa";
import { PiHandshakeFill } from "react-icons/pi";
import VendorNewProduct from "../vendor/VendorNewProduct";
import VendorNewAddon from "../vendor/VendorNewAddon";
import { VscEye } from "react-icons/vsc";
import { MdOutlineDelete } from "react-icons/md";
import { CiMenuKebab } from "react-icons/ci";
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
import { FaUserPlus } from "react-icons/fa6";
import { TbCalendarStats } from "react-icons/tb";
import Schedule from "./Schedule";

function AdminDashboard() {
  const navigate = useNavigate();
  const [isSettingOpen, setIsSettingOpen] = useState(false);
  const [isProductOpen, setIsProductOpen] = useState(false);
  const [iseditopen, setIsEditopen] = useState(true);
  const [dashboard, setDashboard] = useState(true);
  const [currentSection, setCurrentSection] = useState("AdminDashboard");
  const [isclientopen, setIsclientopen] = useState(false);
  const [isvendoropen, setIsvendoropen] = useState(false);
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
  const [createProfile, setCreateProfikle] = useState(false);

  //delete warning
  const [deleteWarning, setDeleteWarning] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectReasonPopup, setRejectReasonPopup] = useState(false);

  //state schedule
  const [isScheduleOpen, setisScheduleOpen] = useState(false);

  const tabs = [
    { name: "Products", value: "products" },
    { name: "Add-Ons", value: "addons" },
  ];

  const [selectedCategory, setSelectedCategory] = useState("");

  //baseurlforimg
  const baseImageUrl =
    "https://bwxzfwsoxwtzhjbzbdzs.supabase.co/storage/v1/object/public/addon/";

  const {
    setAccountHolder,
    setIsAuthLoading,
    setIsAuthenticated,
    setTotalArea,
    accountHolder,
  } = useApp();

  const location = useLocation();

  useEffect(() => {
    if (location.state?.openSettings) {
      setIsProductOpen(false);
      setDashboard(false);
      setIsSettingOpen(true);
      // setHelp(false);
      setCurrentSection("Setting");
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
    setIsProductOpen(false);
    setDashboard(false);
    setIsSettingOpen(true);
    setIsclientopen(false);
    setIsvendoropen(false);
    setCreateProfikle(false);
    setisScheduleOpen(false);
    setCurrentSection("Setting");
  };
  const handleproduct = () => {
    setIsSettingOpen(false);
    setDashboard(false);
    setIsclientopen(false);
    setIsProductOpen(true);
    setIsvendoropen(false);
    setCreateProfikle(false);
    setisScheduleOpen(false);
    setCurrentSection("Product");
  };

  const handledashboard = () => {
    setIsSettingOpen(false);
    setIsProductOpen(false);
    setIsclientopen(false);
    setDashboard(true);
    setIsvendoropen(false);
    setCreateProfikle(false);
    setisScheduleOpen(false);
    setCurrentSection("AdminDashboard");
  };

  const handleclient = () => {
    setIsSettingOpen(false);
    setIsProductOpen(false);
    setDashboard(false);
    setIsvendoropen(false);
    setIsclientopen(true);
    setCreateProfikle(false);
    setisScheduleOpen(false);
    setCurrentSection("Client");
  };

  const handleVendor = () => {
    setIsSettingOpen(false);
    setIsProductOpen(false);
    setDashboard(false);
    setIsclientopen(false);
    setIsvendoropen(true);
    setCreateProfikle(false);
    setisScheduleOpen(false);
    setCurrentSection("Vendor");
  };
  const handlecreate = () => {
    setIsSettingOpen(false);
    setIsProductOpen(false);
    setDashboard(false);
    setIsclientopen(false);
    setIsvendoropen(false);
    setCreateProfikle(true);
    setisScheduleOpen(false);
    setCurrentSection("create profile");
  };

  //handle schedule
  const handleschedule = () => {
    setIsSettingOpen(false);
    setIsProductOpen(false);
    setDashboard(false);
    setIsclientopen(false);
    setIsvendoropen(false);
    setCreateProfikle(false);
    setisScheduleOpen(true);
    setCurrentSection("schedule");
  };

  const handleLogout = async () => {
    try {
      setIsAuthLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.log("Error signing out:", error.message);
      } else {
        toast.success("User signed out successfully");
        setAccountHolder({
          companyName: "",
          email: "",
          phone: "",
          role: "",
          userId: "",
        });
        setTotalArea("");
        localStorage.removeItem("currentLayoutID");
        navigate("/");
        setIsAuthenticated(false);
      }
    } finally {
      setIsAuthLoading(false);
    }
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

  const normalize = (str) => str.replace(/\s+/g, " ").trim().toLowerCase();

  const filterItems = (query) => {
    // console.log(query);
    setSearchQuery(query);

    if (toggle) {
      if (!query && !selectedCategory) {
        setFilteredProducts(products); // Reset to original list when input is empty
        if (isSearching) {
          setCurrentPage(lastPageBeforeSearch); // restore last page
          setIsSearching(false); // reset
        }
        return;
      }

      if (!query && selectedCategory) {
        filterbyCategory(selectedCategory);
        if (isSearching) {
          setCurrentPage(lastPageBeforeSearch);
          setIsSearching(false);
        }
        return;
      }
      // If entering a search query
      if (!isSearching) {
        setLastPageBeforeSearch(currentPage); // store page before search
        setIsSearching(true);
      }
      setCurrentPage(1);

      // const filtered = products.filter((item) =>
      //   item.title.toLowerCase().includes(query.toLowerCase())
      // );
      const filtered = products.filter((item) =>
        normalize(item.title).includes(normalize(query))
      );
      // console.log(filtered);

      setFilteredProducts(filtered);
    } else {
      if (!query) {
        setFilteredAddons(addons); // Reset to original list when input is empty
        if (isSearching) {
          setCurrentPage(lastPageBeforeSearch);
          setIsSearching(false);
        }
        return;
      }
      if (!isSearching) {
        setLastPageBeforeSearch(currentPage);
        setIsSearching(true);
      }
      setCurrentPage(1);
      // const filtered = addons.filter((item) =>
      //   item.title.toLowerCase().includes(query.toLowerCase())
      // );
      const filtered = products.filter((item) =>
        normalize(item.title).includes(normalize(query))
      );
      // console.log(filtered);

      setFilteredAddons(filtered);
    }
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

  const filterbyCategory = (category) => {
    // console.log(category);
    setSelectedCategory(category);

    if (toggle) {
      if (!category) {
        setFilteredProducts(products); // Reset to original list when input is empty
        return;
      }
      const filtered = products.filter(
        (item) =>
          item.products.category.toLowerCase() === category.toLowerCase()
      );
      // console.log(filtered);

      setFilteredProducts(filtered);
    } else {
      if (!category) {
        setFilteredAddons(addons); // Reset to original list when input is empty
        return;
      }
      const filtered = addons.filter((item) =>
        item.title.toLowerCase().includes(category.toLowerCase())
      );
      // console.log(filtered);

      setFilteredAddons(filtered);
    }
    setCurrentPage(1);
  };

  // console.log(accountHolder);

  return (
    <div className="bg-[url('images/bg/Admin.png')] bg-cover bg-center bg-no-repeat p-3 xl:p-5">
      <div className="flex gap-3 max-h-fit overflow-hidden bg-white rounded-3xl">
        {/* sidebar */}
        <div
          className={`max-h-screen sticky left-0 top-0 bottom-0 bg-white shadow-lg transition-all duration-300 ${
            isExpanded ? "max-w-sm w-60 absolute" : "w-16"
          }`}
          onMouseEnter={() => setIsExpanded(true)}
          onMouseLeave={() => setIsExpanded(false)}
        >
          {/* Logo */}
          <div className="cursor-pointer flex justify-center items-center py-4">
            <img
              src="/logo/workved-interior.png"
              alt="Logo"
              onClick={() => navigate("/")}
              className={`${isExpanded ? "h-20 w-32" : "h-10 w-14"}`}
            />
          </div>

          {/* Menu Items */}
          <div className="font-semibold text-lg capitalize leading-normal tracking-wide py-3 xl:py-4 text-[#262626] flex flex-col gap-2 xl:gap-4 px-3">
            <h3
              className={`capitalize text-[#A1A1A1] ${
                isExpanded ? "mx-4" : "hidden"
              }`}
            >
              main
            </h3>
            <SidebarItem
              icon={<RiDashboardFill />}
              text="Dashboard"
              onClick={handledashboard}
              isExpanded={isExpanded}
            />
            <SidebarItem
              icon={<LuBlend />}
              text="Product"
              onClick={handleproduct}
              isExpanded={isExpanded}
            />
            <SidebarItem
              icon={<FaRegUserCircle />}
              text="Clients"
              onClick={handleclient}
              isExpanded={isExpanded}
            />
            <SidebarItem
              icon={<PiHandshakeFill />}
              text="Vendor"
              onClick={handleVendor}
              isExpanded={isExpanded}
            />
            <SidebarItem
              icon={<FaUserPlus />}
              text="create"
              onClick={handlecreate}
              isExpanded={isExpanded}
            />
            <SidebarItem
              icon={<TbCalendarStats />}
              text="schedule"
              onClick={handleschedule}
              isExpanded={isExpanded}
            />
          </div>

          {/* Other Items */}
          <div className="font-semibold text-lg capitalize leading-normal tracking-wide py-3 xl:py-4 text-[#262626] flex flex-col gap-2 xl:gap-4 px-3">
            <h3
              className={`capitalize text-[#A1A1A1] ${
                isExpanded ? "mx-4" : "hidden"
              }`}
            >
              other
            </h3>
            <SidebarItem
              icon={<IoSettingsSharp />}
              text="Setting"
              onClick={handlesetting}
              isExpanded={isExpanded}
            />
            <SidebarItem
              icon={<VscSignOut />}
              text="Logout"
              onClick={handleLogout}
              isExpanded={isExpanded}
            />
          </div>
        </div>
        <div className="flex-1 flex flex-col relative h-full px-2">
          {/* header for dashboard */}
          <div className="flex justify-between items-center border-2 rounded-3xl mt-2 sticky top-3 z-10 bg-[#EBF0FF] h-[50px]">
            <div className="mx-3">
              <h3 className="font-bold text-lg capitalize ">
                {currentSection}
              </h3>
            </div>
            <div className="mx-3">
              <img
                src={accountHolder.profileImage}
                alt="usericon"
                className="w-10"
              />
            </div>
          </div>

          {/* div for dashboard */}
          {dashboard && (
            <div className="w-full  border-2 border-[#000] rounded-3xl bg-[#EBF0FF] my-2.5">
              {/* for dashboard */}
              <div className="w-full flex overflow-y-auto scrollbar-hide h-[calc(100vh-120px)] py-2 px-3">
                {/* <p>this part is under working</p> */}
                <div className="xl:flex justify-evenly gap-4 w-full">
                  <div className="p-4">
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
                    {" "}
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
          {isSettingOpen && (
            <div className="flex-1  border-2 border-[#000] rounded-3xl my-2.5">
              <div className="overflow-y-hidden scrollbar-hide h-[calc(100vh-120px)] py-2 relative">
                <div className="flex flex-col justify-between  pt-2 sticky top-0">
                  {/* <h3 className="capitalize font-semibold px-4 text-xl border-b-2 border-b-[#ccc]">
                      setting
                    </h3> */}
                  <div className="border-b-2 border-b-[#ccc] py-2 px-4">
                    {iseditopen ? (
                      <button className="capitalize font-medium text-base px-10 py-2 rounded-2xl border-[#000] border bg-[#B4EAEA]">
                        Profile
                      </button>
                    ) : (
                      <div className="capitalize font-medium text-base px-10  ">
                        <button
                          className="text-sm text-[#A1A1A1] flex justify-center items-center gap-3"
                          onClick={() => setIsEditopen(true)}
                        >
                          <FaArrowLeft /> back to profile
                        </button>
                        <h3>profile edit</h3>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex-1 flex flex-col justify-center items-center h-[90%] font-Poppins ">
                  {iseditopen ? (
                    <div className="flex justify-center items-center w-full  h-full">
                      <UserProfile setIsEditopen={setIsEditopen} />
                    </div>
                  ) : (
                    <UserSetting />
                  )}
                </div>
              </div>
            </div>
          )}

          {/* product */}
          {isProductOpen && (
            <div className="flex-1  border-2 border-[#000] rounded-3xl my-2.5">
              <div className="overflow-y-auto scrollbar-hide h-[calc(100vh-120px)] rounded-3xl relative ">
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
                ) : (
                  // Default product list and add product UI
                  <>
                    <div className=" sticky top-0 z-20 bg-white">
                      <div className="flex justify-between items-center px-4 py-2 border-b-2 border-b-gray-400 ">
                        <h3 className="capitalize font-semibold text-xl ">
                          product list
                        </h3>

                        <div className="w-1/2">
                          <input
                            type="text"
                            value={searchQuery}
                            className="w-full rounded-lg px-2 py-1 outline-none border-2 border-gray-400"
                            placeholder="......search by product name"
                            onChange={(e) => filterItems(e.target.value)}
                          />
                        </div>

                        {toggle && (
                          <div>
                            <select
                              name="category"
                              value={selectedCategory}
                              onChange={(e) => filterbyCategory(e.target.value)}
                              id="category"
                            >
                              <option value="">All categories</option>
                              {category.map((category) => (
                                <option key={category} value={category}>
                                  {category}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}

                        {/* <button
                          onClick={handlenewproduct}
                          className="capitalize shadow-sm py-2 px-4 text-sm flex justify-center items-center border-2"
                        >
                          <IoIosAdd size={20} />
                          add product
                        </button> */}
                      </div>
                      <div className="flex gap-3 px-4 py-2 border-b-2 border-b-gray-400">
                        {tabs.map((tab) => (
                          <button
                            key={tab.value}
                            className={`flex items-center gap-2 px-6 py-2 border rounded-xl ${
                              selectedTab === tab.value
                                ? "bg-[#B4EAEA]"
                                : "bg-white "
                            }`}
                            value={tab.value}
                            onClick={handleTabClick} // Dynamically sets the tab
                          >
                            {tab.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/*  */}

                    {productlist &&
                      (isloading ? (
                        <Spinner />
                      ) : items.length > 0 ? (
                        // <section className="mt-2 flex-1 overflow-hidden px-8">
                        <section className=" h-[90%] font-Poppins overflow-hidden">
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
                                          className="w-10 h-10 object-cover rounded"
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
                                            <VscEye /> Edit
                                          </button>
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
                        {Array.from(
                          { length: totalPages },
                          (_, i) => i + 1
                        ).map((page) =>
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

          {isclientopen && (
            <>
              <Clients
                isExpanded={isExpanded}
                filterByMultipleFields={filterByMultipleFields}
                query={query}
                filteredusers={filteredusers}
                setIsrefresh={setIsrefresh}
              />
            </>
          )}

          {/*vendor page */}
          {isvendoropen && !vendorproductlist && (
            <div className="w-full  bg-[#EBF0FF] rounded-3xl my-2.5">
              {/* for dashboard */}
              <div className="w-full flex flex-col overflow-y-auto scrollbar-hide h-[calc(100vh-120px)] pb-2 px-3">
                <div className=" sticky top-0 z-20 bg-[#EBF0FF] rounded-lg">
                  <div className="flex justify-between items-center px-4 py-2 border-b-2 border-b-gray-400 ">
                    <h3 className="capitalize font-semibold text-xl ">
                      Vendor List
                    </h3>
                    <div className="w-1/2">
                      <input
                        type="text"
                        className="w-full rounded-lg px-2 py-1 outline-none"
                        placeholder="......search by company name"
                        onChange={(e) =>
                          filterVendorByMultipleFields(e.target.value)
                        }
                        value={query}
                      />
                    </div>
                  </div>
                </div>
                {/* client card for display */}

                <div
                  className={`grid grid-cols-2  ${
                    isExpanded
                      ? "lg:grid-cols-2 xl:grid-cols-4 gap-8"
                      : "lg:grid-cols-2 xl:grid-cols-4 gap-8"
                  } p-2`}
                >
                  {filteredvendors.map((user, index) => {
                    return (
                      <div
                        key={index}
                        className={`flex flex-col ${
                          isExpanded
                            ? "lg:w-[200px] xl:w-[270px] h-[170px]"
                            : "w-[300px] h-[150px]"
                        }  font-Poppins rounded-2xl bg-[#fff] relative`}
                      >
                        <div
                          className={`flex items-center my-4 ${
                            isExpanded && "px-4 py-2"
                          }`}
                        >
                          <div className={`mx-3 ${isExpanded && "hidden"}`}>
                            <img
                              src={accountHolder.profileImage}
                              alt="usericon"
                              className="w-10"
                            />
                          </div>
                          <div>
                            <h2 className="text-[#000] text-base font-medium">
                              {user.company_name}
                            </h2>
                            <p className="text-[#ccc] text-sm">{user.email}</p>
                            {/* <p className="text-[#ccc] text-sm">
                              {user.company_name}
                            </p> */}
                          </div>
                          <div className="ml-auto px-3">
                            {" "}
                            <button
                              onClick={() =>
                                handleDeletevendirClick(user, index)
                              }
                            >
                              {" "}
                              <MdDeleteOutline size={25} />{" "}
                            </button>
                          </div>
                        </div>
                        <div className="flex-1 flex items-end pl-6 gap-3 my-5">
                          <div className="">
                            {" "}
                            <FaBuilding size={22} />
                          </div>{" "}
                          <button
                            onClick={() => {
                              setSelectedVendor(user); // Store selected vendor
                              setVendorproductlist(true); // Show product list
                            }}
                            className="font-medium text-[#ccc] text-base"
                          >
                            {user.company_name}
                          </button>
                        </div>
                        {isModalOpen && selectedindex === index && (
                          <div className=" inset-0 flex items-center justify-center bg-opacity-80 absolute w-full h-full">
                            <div className="bg-white rounded-lg px-5 py-2">
                              <h3 className="text-lg font-semibold">
                                Are you sure?
                              </h3>
                              <p>
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
                    );
                  })}
                </div>
              </div>{" "}
            </div>
          )}

          {isvendoropen && vendorproductlist && (
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
          {createProfile && (
            <div className="flex-1 bg-[#EBF0FF] border-2 border-[#000] rounded-3xl my-2.5">
              <div className="overflow-y-auto scrollbar-hide h-[calc(100vh-120px)] rounded-3xl relative ">
                <CreateUser />
              </div>
            </div>
          )}

          {/* schedule  */}
          {isScheduleOpen && <Schedule />}
        </div>
      </div>
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
        <div className="flex justify-center items-center h-screen absolute z-30 top-0 w-screen">
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="bg-white relative py-7 px-20">
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
    </div>
  );
}

export default AdminDashboard;
