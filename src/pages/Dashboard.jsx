import { RiDashboardFill } from "react-icons/ri";
import { useLocation, useNavigate } from "react-router-dom";
import { useApp } from "../Context/Context";
import { supabase } from "../services/supabase";
import toast from "react-hot-toast";
import { useEffect, useState, useRef } from "react";
import { VscEye } from "react-icons/vsc";
import { CiMenuKebab } from "react-icons/ci";
import { VscSignOut } from "react-icons/vsc";
import { IoSettingsSharp } from "react-icons/io5";
import { LuBlend } from "react-icons/lu";
import { BsQuestionCircle } from "react-icons/bs";
import Spinner from "../common-components/Spinner";
// import DashboardProductCard from "./vendor/DashboardProductCard";
// import SidebarItem from "../common-components/SidebarItem";
import Help from "./user/Help";
import { TbFileInvoice } from "react-icons/tb";
import { category } from "../utils/AllCatArray";
import { baseImageUrl } from "../utils/HelperConstant";
import DashboardView from "./user/DashboardView";
import { useLogout } from "../utils/HelperFunction";
import ProductView from "./user/ProductView";
// import { MdMenuOpen } from "react-icons/md";
import { FaThLarge, FaTimes } from "react-icons/fa";
import UserCard from "./user/UserCard";
import UserProfileEdit from "./user/UserProfileEdit";
import MobileTabProductCard from "./user/MobileTabProductCard";

function Dashboard() {
  const logout = useLogout();
  const navigate = useNavigate();
  const location = useLocation();
  // const [productlist, setProductlist] = useState(true);
  const [isSettingOpen, setIsSettingOpen] = useState(false);
  const [isProductOpen, setIsProductOpen] = useState(false);
  const [iseditopen, setIsEditopen] = useState(true);
  const [dashboard, setDashboard] = useState(true);
  const [currentSection, setCurrentSection] = useState("Dashboard");
  const [help, setHelp] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [boqdata, setboqdata] = useState();
  const {
    accountHolder,
    // layoutImage,
    currentLayoutData,
    totalArea,
    currentLayoutID,
  } = useApp();

  //selectedboq
  const [selectedBoq, setSelectedBoq] = useState();

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [addons, setAddons] = useState([]);
  const [filteredAddons, setFilteredAddons] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState("");

  const menuRef = useRef({});
  const buttonRef = useRef({});

  // loading
  const [isloading, setIsloading] = useState(false);
  const [productlist, setProductlist] = useState(true);
  // const [imageIsLoaded, setImageIsLoaded] = useState(false);

  const [openMenuId, setOpenMenuId] = useState(null); // Store the ID of the row with an open menu
  const [searchQuery, setSearchQuery] = useState(""); // to store the latest search input
  // const [isExpanded, setIsExpanded] = useState(false);
  const [selectedProductview, setSelectedProductview] = useState({
    product_name: "",
    product_price: "",
    product_image: "",
    product_description: "",
  });
  const [productPreview, setProductPreview] = useState(false);

  const [toggle, setToggle] = useState(true);
  const [selectedTab, setSelectedTab] = useState("products");

  const tabs = [
    { name: "Products", value: "products" },
    { name: "Add-Ons", value: "addons" },
  ];

  const [itemsPerPage, setItemsPerPage] = useState(10); // Default (gets updated dynamically)
  const [currentPage, setCurrentPage] = useState(1);
  const items = toggle ? filteredProducts : filteredAddons;
  // const items = toggle ? products : addons;
  const totalPages = Math.ceil(items.length / itemsPerPage);
  const tableRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const [lastPageBeforeSearch, setLastPageBeforeSearch] = useState(1);
  const [isSearching, setIsSearching] = useState(false);
  //boqdata available or not
  const [isboqavailable, setIsboqavailable] = useState(false);
  const [isfetchBoqDataRefresh, setisfetchBoqDataRefresh] = useState(false);

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

  // Slice the items for pagination
  const paginatedItems = items.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToPage = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const fetchAddonsByIds = async () => {
    try {
      setIsloading(true);
      if (!selectedBoq) {
        return;
      }

      if (selectedBoq && selectedBoq.addon_varaint_id) {
        const productIdsArray = selectedBoq.addon_varaint_id
          .split(",")
          .map((id) => id.trim());

        const { data } = await supabase
          .from("addon_variants")
          .select("*")
          .in("id", productIdsArray); // Use Supabase `in()` filter

        console.log(data);

        setAddons(data);
        setFilteredAddons(data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsloading(false);
    }
  };

  //fetch the product based on the selected boq
  const fetchProductsByIds = async () => {
    console.log("hello from the product ");

    try {
      if (selectedBoq) {
        setIsloading(true);

        console.log("selectedboq", selectedBoq);

        const productIdsArray = selectedBoq.product_variant_id
          .split(",")
          .map((id) => id.trim()); // Convert to array of ids

        const { data, error } = await supabase
          .from("product_variants")
          .select("*,products(*)")
          .in("id", productIdsArray); // Use Supabase `in()` filter

        if (data) {
          setProducts(data);
          setFilteredProducts(data);
        }

        if (error) {
          throw new Error(error);
        }

        console.log(data);
      } else {
        setProducts([]);
        setFilteredProducts([]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsloading(false);
    }
  };

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

  const handleMenuToggle = (id) => {
    setOpenMenuId((prev) => (prev === id ? null : id));
  };

  const handleProductPreview = (product) => {
    console.log("in function handleProductPreview", product);

    setProductPreview(true);
    setSelectedProductview(product);
  };

  const handleDelete = async (product) => {
    // if (!product.id) return;

    // try {
    //   const { error } = await supabase
    //     .from("product_variants") // Ensure this matches your table name
    //     .delete()
    //     .eq("id", product.id);

    //   if (error) throw error; // Throw error to be caught in catch block

    //   toast.success("Product deleted successfully!");
    //   setProductPreview(false); // Close the modal after deletion
    // } catch (error) {
    //   toast.error("Failed to delete product.");
    //   console.error("Delete error:", error);
    // }
    // fetchProducts(1); // Fetch products after deletion

    toast.error("feature is pending");
  };

  const handleTabClick = (event) => {
    setProductlist(true);
    // setIsAddProduct(false);
    const tab = event.target.value; // Get value from button
    setSelectedTab(tab);
    setToggle(tab === "products"); // Set toggle dynamically
    setSearchQuery("");
    setSelectedCategory("");
  };

  const handlesetting = () => {
    setIsProductOpen(false);
    setDashboard(false);
    setIsSettingOpen(true);
    setHelp(false);
    setCurrentSection("Setting");
  };
  const handleproduct = () => {
    setIsSettingOpen(false);
    setDashboard(false);
    setIsProductOpen(true);
    setHelp(false);
    setCurrentSection("Product");
  };

  const handlecheckboqdetails = (boq) => {
    setIsSettingOpen(false);
    setDashboard(false);
    setIsProductOpen(true);
    setHelp(false);
    setSelectedBoq(boq);
    setCurrentSection("Product");
  };

  const handledashboard = () => {
    setIsSettingOpen(false);
    setIsProductOpen(false);
    setDashboard(true);
    setHelp(false);
    setCurrentSection("Dashboard");
  };

  const handlehelp = () => {
    setIsSettingOpen(false);
    setIsProductOpen(false);
    setDashboard(false);
    setHelp(true);
    setCurrentSection("Help");
  };

  const fetchboq = async () => {
    try {
      const { data } = await supabase
        .from("boqdata")
        .select("*")
        .eq("userId", accountHolder.userId);

      console.log("fetch boq data", data);

      setboqdata(data);
      // selectedBoq(data.boq);
      if (data.length > 0) {
        setSelectedBoq(data[0]);
        setIsboqavailable(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handledeleteBoq = async (boq) => {
    setisfetchBoqDataRefresh(true);
    try {
      const { error } = await supabase
        .from("boqdata") // Replace with your table name
        .delete()
        .eq("id", boq.id); // Filtering by id

      if (error) {
        throw new Error(error);
      }
    } catch (error) {
      console.log("something went wrong", error);
    } finally {
      setSelectedBoq(() => null);
      setisfetchBoqDataRefresh(false);
    }
  };

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

  useEffect(() => {
    fetchProductsByIds();
    fetchAddonsByIds();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBoq, isfetchBoqDataRefresh]);

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

  // console.log("layout image", layoutImage);

  useEffect(() => {
    if (location.state?.openSettings) {
      setIsProductOpen(false);
      setDashboard(false);
      setIsSettingOpen(true);
      setHelp(false);
      setCurrentSection("Setting");
    }
    if (location.state?.openHelp) {
      setIsSettingOpen(false);
      setIsProductOpen(false);
      setDashboard(false);
      setHelp(true);
      setCurrentSection("Help");
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
        // className={`border-2 border-[#334A78] rounded-lg max-h-screen sticky left-0 top-0 bottom-0 bg-white  shadow-lg transition-all duration-300 ${
        //   isExpanded ? "max-w-sm w-60 absolute" : "w-16"
        // }`}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        {/* Logo */}
        <div className="cursor-pointer flex justify-center items-center py-4">
          <img
            src="/logo/workved-interior.png"
            alt="Logo"
            className={`${isExpanded ? "h-20 w-32" : "h-9 w-16"}`}
            onClick={() => navigate("/")}
          />
        </div>

        {/* Menu Items */}
        <div className="font-semibold text-lg capitalize leading-normal tracking-wide py-4 text-[#262626] flex flex-col gap-4 px-3">
          {/* <h3
            className={`capitalize text-[#A1A1A1] ${
              isExpanded ? "mx-4" : "hidden"
            }`}
          >
            main
          </h3> */}

          <SidebarItem
            icon={<RiDashboardFill />}
            text="Dashboard"
            onClick={handledashboard}
            isExpanded={isExpanded}
            currentSection={currentSection}
          />
          <SidebarItem
            icon={<LuBlend />}
            text="Product"
            onClick={handleproduct}
            isExpanded={isExpanded}
            currentSection={currentSection}
          />
          <SidebarItem
            icon={<TbFileInvoice />}
            text="Go to BOQ"
            onClick={() => navigate("/boq")}
            isExpanded={isExpanded}
            currentSection={currentSection}
          />
        </div>

        {/* Other Items */}
        <div className="font-semibold text-lg capitalize leading-normal tracking-wide py-4 text-[#262626] flex flex-col gap-4 px-3">
          {/* <h3
            className={`capitalize text-[#A1A1A1] ${
              isExpanded ? "mx-4" : "hidden"
            }`}
          >
            other
          </h3> */}
          <SidebarItem
            icon={<BsQuestionCircle />}
            text="Help"
            onClick={handlehelp}
            isExpanded={isExpanded}
            currentSection={currentSection}
          />
          <SidebarItem
            icon={<IoSettingsSharp />}
            text="Setting"
            onClick={handlesetting}
            isExpanded={isExpanded}
            currentSection={currentSection}
          />
          <SidebarItem
            icon={<VscSignOut />}
            text="Logout"
            onClick={logout}
            isExpanded={isExpanded}
            currentSection={currentSection}
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
          <div onClick={() => setIsOpen(!isOpen)} className="mx-3">
            <img
              src={accountHolder.profileImage}
              alt="usericon"
              className="w-10 h-10"
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
            <div className="p-4 flex justify-between items-center border-b">
              {/* <h2 className="text-lg font-semibold text-[#1A3365]">Menu</h2> */}
              <button onClick={() => setIsOpen(false)} className="text-xl">
                <FaTimes />
              </button>
            </div>

            <div className="flex gap-2 justify-center items-center">
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
                currentSection={currentSection}
                onClick={handledashboard}
                setIsOpen={setIsOpen}
              />
              <MobileMenuItem
                icon={<LuBlend />}
                title={"Product"}
                onClick={handleproduct}
                currentSection={currentSection}
                setIsOpen={setIsOpen}
              />
              <MobileMenuItem
                title={"Go to Boq"}
                icon={<TbFileInvoice />}
                onClick={() => navigate("/boq")}
                currentSection={currentSection}
                setIsOpen={setIsOpen}
              />

              <hr className="border-gray-200" />
              <MobileMenuItem
                title={"Help"}
                icon={<BsQuestionCircle />}
                onClick={handlehelp}
                currentSection={currentSection}
                setIsOpen={setIsOpen}
              />
              <MobileMenuItem
                icon={<IoSettingsSharp />}
                onClick={handlesetting}
                title={"Setting"}
                currentSection={currentSection}
                setIsOpen={setIsOpen}
              />
              <MobileMenuItem
                title={"Logout"}
                icon={<VscSignOut />}
                onClick={logout}
                currentSection={currentSection}
                setIsOpen={setIsOpen}
              />
            </ul>
          </div>
        </div>
        {/* header for dashboard */}
        <div className="flex justify-between items-center border-b border-[#CCCCCC] lg:border-2 lg:border-[#334A78] lg:rounded-lg bg-white  lg:h-[50px] shrink-0">
          <div className="mx-3">
            <h3 className="font-bold text-2xl text-[#374A75] capitalize">
              {currentSection}
            </h3>
          </div>
          <div className="hidden lg:block mx-3">
            <img
              src={accountHolder.profileImage}
              alt="usericon"
              className="w-10 h-10"
            />
          </div>
        </div>

        {/* setting */}
        {isSettingOpen && (
          <div className="flex flex-col h-full min-h-0 overflow-hidden lg:border-2 lg:border-[#334A78] lg:rounded-lg bg-white">
            {/* header inside setting */}
            {/* <div className="lg:border-b-2 border-b-[#ccc] py-2 px-4 shrink-0">
              {iseditopen ? (
                <button className="hidden lg:block capitalize font-medium text-base px-10 py-2 text-white rounded-lg border-[#374A75] border bg-[#374A75]">
                  Profile
                </button>
              ) : (
                <div className="capitalize font-medium text-base ">
                  <button
                    className="text-sm text-[#A1A1A1] flex justify-center items-center gap-3"
                    onClick={() => setIsEditopen(true)}
                  >
                    <FaArrowLeft /> back to profile
                  </button>
                  <h3>profile edit</h3>
                </div>
              )}
            </div> */}

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
            {/* <div className="flex-1 overflow-y-auto min-h-0 px-4 py-2">
              {iseditopen ? (
                <div className="flex justify-center items-center w-full">
                  <UserProfile setIsEditopen={setIsEditopen} />
                </div>
              ) : (
                <div className="">
                  <UserSetting />
                </div>
              )}
            </div> */}
            {/* <div className="flex-1 overflow-y-auto min-h-0 px-4 py-2">
              {iseditopen ? (
                <div className="flex justify-center items-center w-full">
                  <UserProfile setIsEditopen={setIsEditopen} />
                </div>
              ) : (
                <div className="">
                  <UserSetting />
                </div>
              )}

              <div>
                <p className="text-sm leading-relaxed"></p>
              </div>
            </div> */}
          </div>
        )}

        {dashboard && (
          <div className="flex flex-col h-full min-h-0 loverflow-hidden lg:border-2 border-[#334A78] rounded-lg bg-white">
            <DashboardView
              totalArea={totalArea}
              handlecheckboqdetails={handlecheckboqdetails}
              handledeleteBoq={handledeleteBoq}
              selectedBoq={selectedBoq}
              products={products}
              boqdata={boqdata}
              currentLayoutData={currentLayoutData}
              currentLayoutID={currentLayoutID}
              isboqavailable={isboqavailable}
              isExpanded={isExpanded}
            />
          </div>
        )}

        {/* product */}
        {isProductOpen && (
          <div className="flex flex-col h-full min-h-0 overflow-hidden lg:border-2 border-[#334A78] rounded-lg bg-white">
            <div className="flex-1 ">
              <div className="overflow-y-auto scrollbar-hide h-[calc(100vh-95px)] rounded-3xl relative ">
                {/* // Default product list and add product UI */}
                <div className=" sticky top-0 z-20 bg-white">
                  <div className="flex flex-col md:flex-row md:items-center px-2 gap-3 lg:gap-5 lg:px-4 py-2 border-b-2 border-b-gray-400 ">
                    <h3 className="text-sm md:text-base font-semibold lg:text-2xl text-[#374A75] ">
                      Created BOQs
                    </h3>
                    <div className="flex ">
                      {isboqavailable &&
                        boqdata.map((boq, index) => {
                          return (
                            <div
                              key={boq.title}
                              className={` rounded-lg border-2  px-5 py-2 ${
                                selectedBoq.title === boq.title
                                  ? "bg-[#374A75] text-white border-[#374a75]"
                                  : "bg-white text-[#374a75] border-[#ccc]"
                              }`}
                            >
                              <button
                                onClick={() => {
                                  setSelectedBoq(boq);
                                  setSearchQuery("");
                                  setSelectedCategory("");
                                }}
                                className="text-sm lg:text-lg"
                              >
                                {boq.title}
                              </button>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                  <div className="flex  items-center gap-3 px-2 lg:px-4 py-2 border-b-2 border-b-gray-400 bg-white z-20">
                    {tabs.map((tab) => (
                      <button
                        key={tab.value}
                        className={`flex items-center gap-2 px-3 lg:px-6 py-2 border rounded-lg  text-[#374A75] text-sm lg:text-lg ${
                          selectedTab === tab.value
                            ? "bg-[#D3E3F0]  border-[#374A75]"
                            : "bg-white border-[#374A75]"
                        }`}
                        value={tab.value}
                        onClick={handleTabClick} // Dynamically sets the tab
                      >
                        {tab.name}
                      </button>
                    ))}

                    <div className="hidden lg:block w-1/2 ml-auto">
                      <input
                        type="text"
                        value={searchQuery}
                        className="w-full rounded-lg px-2 py-1 outline-none border-2 border-gray-400"
                        placeholder="......search by product name"
                        onChange={(e) => {
                          const value = e.target.value;
                          setSearchQuery(value);
                          applyFilters({
                            query: value,
                          });
                        }}
                      />
                    </div>
                    {toggle && (
                      <div className="hidden lg:block">
                        <select
                          name="category"
                          value={selectedCategory}
                          onChange={(e) => {
                            const value = e.target.value;
                            setSelectedCategory(value);
                            applyFilters({
                              query: searchQuery,
                              category: value,
                            });
                          }}
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
                  </div>
                </div>
                {/*  */}
                {productlist &&
                  (isloading ? (
                    <Spinner />
                  ) : selectedBoq && items.length > 0 ? (
                    // <section className="mt-2 flex-1 overflow-hidden px-8">
                    <>
                      <section className="hidden lg:block h-[90%] font-Poppins overflow-hidden">
                        {/* <section className=" h-[90%] font-Poppins overflow-hidden"> */}
                        <div
                          ref={scrollContainerRef}
                          className=" w-full h-full border-t border-b border-[#CCCCCC] overflow-y-auto custom-scrollbar"
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
                                  <th className="p-3 font-medium">Addon ID</th>
                                )}
                                <th className="p-3  font-medium">Price</th>
                                {toggle ? (
                                  <>
                                    {/* <th className="p-3 font-medium">
                                          Details
                                        </th> */}
                                    <th className="p-3 font-medium">
                                      Category
                                    </th>
                                    <th className="p-3 font-medium">
                                      specification
                                    </th>
                                  </>
                                ) : (
                                  <th className="p-3 font-medium">
                                    Addon Title
                                  </th>
                                )}
                                <th className="p-3 font-medium">Action</th>
                              </tr>
                            </thead>
                            <tbody className=" text-sm">
                              {selectedBoq &&
                                paginatedItems.map((item) => (
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
                                        {toggle ? (
                                          <span>{item.title}</span>
                                        ) : (
                                          <span className="text-wrap">
                                            {item.id}
                                          </span>
                                        )}
                                      </div>
                                    </td>
                                    <td className="border border-gray-200 p-3 align-middle">
                                      ₹{item.price}
                                    </td>
                                    {toggle ? (
                                      <>
                                        <td className="border border-gray-200 p-3 align-middle">
                                          {item.products?.category || "N/A"}
                                        </td>
                                        <td className="border border-gray-200 p-3 align-middle">
                                          {item.products?.subcategory1 || "N/A"}
                                        </td>
                                      </>
                                    ) : (
                                      <td className="border border-gray-200 p-3 align-middle">
                                        {item.addons?.title || item.title}
                                      </td>
                                    )}
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
                                            <VscEye /> view
                                          </button>
                                          {/* <button
                                          onClick={() => {
                                            handleDelete(item);
                                          }}
                                          className="flex gap-2 items-center w-full text-left px-3 py-2 hover:bg-gray-200"
                                        >
                                          <MdOutlineDelete /> Delete
                                        </button> */}
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
                        {selectedBoq &&
                          paginatedItems.map((item) => (
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
                      {selectedBoq ? (
                        <p className="p-5 text-gray-500 text-center">
                          No {toggle ? "products" : "addons"} found.
                        </p>
                      ) : (
                        <p className="p-5 text-gray-500 text-center">
                          please select a boq
                        </p>
                      )}
                    </>
                  ))}
                {/* Pagination Controls (Always Visible) */}
                {selectedBoq && totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2  z-30 sticky bottom-0  bg-white  text-[#3d194f]">
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
                        (page >= currentPage - 1 && page <= currentPage + 1) ? (
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
              </div>
            </div>
          </div>
        )}

        {/* help */}
        {help && (
          <div className="flex flex-col h-full min-h-0 overflow-hidden lg:border-2 lg:border-[#334A78] lg:rounded-lg bg-white">
            <Help isvendor={false} />
          </div>
        )}
      </div>

      {/* product preview */}
      {productPreview && (
        <ProductView
          onClose={() => {
            setProductPreview(false);
          }}
          product={selectedProductview}
          handleDelete={handleDelete}
        />
      )}
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
      <span className={`${isExpanded ? "block" : "hidden"} text-lg `}>
        {text}
      </span>
    </div>
  );
}
