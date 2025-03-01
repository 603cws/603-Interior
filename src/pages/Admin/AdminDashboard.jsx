import { useEffect, useState, useRef } from "react";
import { RiDashboardFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../Context/Context";
import { supabase } from "../../services/supabase";
import toast from "react-hot-toast";
import UserProfile from "../user/UserProfile";
import UserSetting from "../user/UserSetting";
import { FaArrowLeft } from "react-icons/fa6";
import { VscSignOut } from "react-icons/vsc";
import { IoSettingsSharp } from "react-icons/io5";
import { LuBlend } from "react-icons/lu";
import { FaRegUserCircle } from "react-icons/fa";
import { FaBuilding } from "react-icons/fa";
import { PiHandshakeFill } from "react-icons/pi";
import VendorNewProduct from "../vendor/VendorNewProduct";
import VendorNewAddon from "../vendor/VendorNewAddon";
import { VscEye } from "react-icons/vsc";
import { MdOutlineDelete } from "react-icons/md";
import { MdOutlineCancel } from "react-icons/md";
import { CiMenuKebab } from "react-icons/ci";
import { IoIosAdd } from "react-icons/io";
import Spinner from "../../common-components/Spinner";
import SidebarItem from "../../common-components/SidebarItem";
import Clients from "./Clients";
import VendorProductlist from "./VendorProductlist";
// import { useLogout } from "../../utils/HelperFunction";
import DashboardProductCard from "../vendor/DashboardProductCard";

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
  const [isProductHovered, setIsProductHovered] = useState(false);
  const [isAddonHovered, setIsAddonHovered] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null); // Store the ID of the row with an open menu
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedProductview, setSelectedProductview] = useState({
    product_name: "",
    product_price: "",
    product_image: "",
    product_description: "",
  });
  const [productPreview, setProductPreview] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);

  // vendorproductlist
  const [vendorproductlist, setVendorproductlist] = useState(false);

  const [products, setProducts] = useState([]);
  const [addons, setAddons] = useState([]);

  console.log("selected product", selectedProductview);

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

  const [showMenu, setShowMenu] = useState(false);

  const tabs = [
    { name: "Products", value: "products" },
    { name: "Add-Ons", value: "addons" },
  ];

  //baseurlforimg
  const baseImageUrl =
    "https://bwxzfwsoxwtzhjbzbdzs.supabase.co/storage/v1/object/public/addon/";

  const {
    accountHolder,
    setAccountHolder,
    setIsAuthLoading,
    setIsAuthenticated,
    setTotalArea,
    layoutImage,
  } = useApp();
  console.log("layout image", layoutImage);

  const handleTabClick = (event) => {
    setProductlist(true);
    setIsAddProduct(false);
    const tab = event.target.value; // Get value from button
    setSelectedTab(tab);
    setToggle(tab === "products"); // Set toggle dynamically
  };
  const tableRef = useRef(null);
  const [itemsPerPage, setItemsPerPage] = useState(10); // Default (gets updated dynamically)
  const [currentPage, setCurrentPage] = useState(1);

  const items = toggle ? products : addons;
  const totalPages = Math.ceil(items.length / itemsPerPage);

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
    }
  };

  // Fetch Products from Supabase
  const fetchProducts = async () => {
    setIsloading(true);
    try {
      const { data } = await supabase.from("product_variants").select(
        `
          id, 
          title, 
          price, 
          details, 
          image, 
          product_id, 
          products (category, subcategory, subcategory1)
        `
      );
      setProducts(data);

      console.log(data);
    } catch (error) {
      console.log("Error fetching products:", error);
    } finally {
      setIsloading(false);
    }
  };

  const fetchAddons = async () => {
    const { data, error } = await supabase.from("addon_variants").select("*");
    console.log(data);

    if (error) {
      console.log("Error fetching addons:", error);
    } else {
      setAddons(data);
      console.log("Addons: ", data);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchAddons();
  }, []);

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
    console.log("in function handleProductPreview", product);

    setProductPreview(true);
    setSelectedProductview(product);
  };

  const handleDelete = async (product) => {
    if (!product.id) return;

    try {
      const { error } = await supabase
        .from("product_variants") // Ensure this matches your table name
        .delete()
        .eq("id", product.id);

      if (error) throw error; // Throw error to be caught in catch block

      toast.success("Product deleted successfully!");
      setProductPreview(false); // Close the modal after deletion
    } catch (error) {
      toast.error("Failed to delete product.");
      console.error("Delete error:", error);
    }
    fetchProducts(1); // Fetch products after deletion
  };

  const handlenewproduct = () => {
    setProductlist(false);
    setIsAddProduct(true);
  };

  const handleAddproductclose = () => {
    setProductlist(true);
    setIsAddProduct(false);
  };

  const handlesetting = () => {
    setIsProductOpen(false);
    setDashboard(false);
    setIsSettingOpen(true);
    setIsclientopen(false);
    setIsvendoropen(false);
    setCurrentSection("Setting");
  };
  const handleproduct = () => {
    setIsSettingOpen(false);
    setDashboard(false);
    setIsclientopen(false);
    setIsProductOpen(true);
    setIsvendoropen(false);
    setCurrentSection("Product");
  };

  const handledashboard = () => {
    setIsSettingOpen(false);
    setIsProductOpen(false);
    setIsclientopen(false);
    setDashboard(true);
    setIsvendoropen(false);
    setCurrentSection("AdminDashboard");
  };

  const handleclient = () => {
    setIsSettingOpen(false);
    setIsProductOpen(false);
    setDashboard(false);
    setIsvendoropen(false);
    setIsclientopen(true);
    setCurrentSection("Client");
  };

  const handleVendor = () => {
    setIsSettingOpen(false);
    setIsProductOpen(false);
    setDashboard(false);
    setIsclientopen(false);
    setIsvendoropen(true);
    setCurrentSection("Vendor");
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
        console.log("hello");
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
    const { data, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("role", "vendor");

    console.log("all the vendors", data);
    setAllvendors(data);
    setFilteredvendors(data);
  };

  // const getusers = async () => {
  //   // Query the profiles table for phone and companyName
  //   const { data, error: profileError } = await supabase.from("profiles")
  //     .select(`
  //       *,
  //       auth_users:auth.users(*)
  //     `);

  //   console.log("all the users", data);

  //   console.log(profileError);

  //   setAllusers(data);
  //   setFilteredUsers(data);
  // };

  const getusers = async () => {
    // Query the profiles table for phone and companyName
    const { data, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("role", "user");

    console.log("all the users", data);

    console.log(profileError);

    setAllusers(data);
    setFilteredUsers(data);
  };

  // get all the users and vendors from the database
  useEffect(() => {
    getvendors();
    getusers();
  }, []);

  const filterByMultipleFields = (query) => {
    if (!query) {
      setFilteredUsers(allusers); // Reset to original list when input is empty
      return;
    }
    const filtereduser = allusers.filter((item) =>
      item.company_name.toLowerCase().includes(query.toLowerCase())
    );
    console.log(filtereduser);
    setFilteredUsers(filtereduser);
  };

  const filterVendorByMultipleFields = (query) => {
    console.log(allvendors);

    if (!query) {
      setFilteredvendors(allvendors); // Reset to original list when input is empty
      return;
    }
    const filteredvendor = allvendors.filter((item) =>
      item.company_name.toLowerCase().includes(query.toLowerCase())
    );
    console.log(filteredvendor);
    setFilteredvendors(filteredvendor);
  };

  const handlevendorcard = () => {
    setVendorproductlist(true);
  };

  return (
    <div className="">
      <div className="flex gap-3 max-h-full overflow-hidden bg-white">
        {/* sidebar */}
        <div
          className={`h-screen sticky left-0 top-0 bottom-0 bg-white shadow-lg transition-all duration-300 ${
            isExpanded ? "max-w-sm w-60 absolute" : "w-16"
          }`}
          onMouseEnter={() => setIsExpanded(true)}
          onMouseLeave={() => setIsExpanded(false)}
        >
          {/* Logo */}
          <div className="cursor-pointer flex justify-center items-center py-4">
            <img
              src="/logo/logo.png"
              alt="Logo"
              className={`${isExpanded ? "h-20 w-32" : "size-12"}`}
            />
          </div>

          {/* Menu Items */}
          <div className="font-semibold text-lg capitalize leading-normal tracking-wide py-4 text-[#262626] flex flex-col gap-4 px-3">
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
          </div>

          {/* Other Items */}
          <div className="font-semibold text-lg capitalize leading-normal tracking-wide py-4 text-[#262626] flex flex-col gap-4 px-3">
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
        <div className="flex-1 flex flex-col gap-3 relative h-full px-2">
          {/* header for dashboard */}
          <div className="flex justify-between items-center border-2 rounded-3xl mt-2 sticky top-3 z-10 bg-[#EBF0FF] h-[50px]">
            <div className="mx-3">
              <h3 className="font-bold text-lg capitalize ">
                {currentSection}
              </h3>
            </div>
            <div className="mx-3">
              <img src="/images/usericon.png" alt="usericon" />
            </div>
          </div>

          {/* div for dashboard */}
          {dashboard && (
            <div className="w-full  border-2 border-[#000] rounded-3xl ">
              {/* for dashboard */}
              <div className="w-full flex overflow-y-auto scrollbar-hide h-[calc(100vh-100px)] py-2 px-3">
                <p>this part is under working</p>
              </div>
            </div>
          )}

          {/* setting */}
          {isSettingOpen && (
            <div className="flex-1  border-2 border-[#000] rounded-3xl ">
              <div className="overflow-y-hidden scrollbar-hide h-[calc(100vh-100px)] py-2 relative">
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
            <div className="flex-1  border-2 border-[#000] rounded-3xl ">
              <div className="overflow-y-auto scrollbar-hide h-[calc(100vh-100px)] rounded-3xl relative ">
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
                    <div className=" sticky top-0">
                      <div className="flex justify-between items-center px-4 py-2 border-b-2 border-b-gray-400 ">
                        <h3 className="capitalize font-semibold text-xl ">
                          product list
                        </h3>

                        <button
                          onClick={handlenewproduct}
                          className="capitalize shadow-sm py-2 px-4 text-sm flex justify-center items-center border-2"
                        >
                          <IoIosAdd size={20} />
                          add product
                        </button>
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
                          <div className="w-full h-full border-t border-b border-[#CCCCCC] overflow-y-auto custom-scrollbar">
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
                                      Addon ID
                                    </th>
                                  )}
                                  <th className="p-3  font-medium">Price</th>
                                  {toggle ? (
                                    <>
                                      <th className="p-3 font-medium">
                                        Details
                                      </th>
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
                                          {item.details}
                                        </td>
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
                                          <button
                                            onClick={() => {
                                              handleDelete(item);
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
                    {/* {productlist &&
                      (isloading ? (
                        <Spinner />
                      ) : (toggle ? products : addons).length > 0 ? (
                        // <section className="mt-2 flex-1 overflow-hidden px-8">
                        <section className=" h-[90%] font-Poppins overflow-hidden">
                          <div className="w-full h-full border-t border-b border-[#CCCCCC] overflow-y-auto custom-scrollbar">
                            <table className="min-w-full border-collapse">
                              <thead className="bg-[#FFFFFF] sticky top-0 z-10 px-8 text-center text-[#000] text-base">
                                <tr>
                                  {toggle ? (
                                    <th className="p-3 font-medium">
                                      Product Name
                                    </th>
                                  ) : (
                                    <th className="p-3 font-medium">
                                      Addon ID
                                    </th>
                                  )}
                                  <th className="p-3  font-medium">Price</th>
                                  {toggle ? (
                                    <>
                                      <th className="p-3 font-medium">
                                        Details
                                      </th>
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
                                {(toggle ? products : addons).map((item) => (
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
                                          {item.details}
                                        </td>
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
                                        className="bg-white flex justify-center items-center py-1.5 w-20 mb-2"
                                        onClick={() =>
                                          handleMenuToggle(item.id)
                                        }
                                      >
                                        <CiMenuKebab size={25} />
                                      </button>

                                      {openMenuId === item.id && (
                                        <div
                                          ref={menuRef}
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
                                          <button
                                            onClick={() => {
                                              handleDelete(item);
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
                      ))} */}

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

                    {isAddProduct && (
                      <div className="flex flex-col justify-center items-center h-[90%] font-Poppins overflow-y-hidden">
                        <div className="border-2 border-gray-200 px-28 py-14 flex justify-center items-center gap-10 rounded-2xl shadow-lg capitalize relative">
                          <div
                            onClick={() => {
                              setAddNewProduct(true);
                              setIsAddProduct(false);
                            }}
                            onMouseEnter={() => setIsProductHovered(true)}
                            onMouseLeave={() => setIsProductHovered(false)}
                            className="flex flex-col justify-center items-center gap-5 p-10 shadow-[0_4px_10px_rgba(180,234,234,50)] font-bold rounded-xl cursor-pointer hover:bg-[#194F48] hover:text-white hover:scale-110 transition-transform duration-200 ease-in-out"
                          >
                            <img
                              src={
                                isProductHovered
                                  ? "images/product-icon-2.png"
                                  : "images/product-icon-1.png"
                              }
                              alt=""
                            />
                            <h2 className="text-lg">product</h2>
                          </div>

                          <div
                            onClick={() => {
                              setAddNewAddon(true);
                              setIsAddProduct(false);
                            }}
                            onMouseEnter={() => setIsAddonHovered(true)}
                            onMouseLeave={() => setIsAddonHovered(false)}
                            className="flex flex-col justify-center items-center gap-5 p-10 shadow-[0_4px_10px_rgba(180,234,234,100)] font-bold rounded-xl cursor-pointer hover:bg-[#194F48] hover:text-white hover:scale-110 transition-transform duration-200 ease-in-out"
                          >
                            <img
                              src={
                                isAddonHovered
                                  ? "images/addOn-icon-2.png"
                                  : "images/addOn-icon-1.png"
                              }
                              alt=""
                            />
                            <h2 className="text-lg">add ons</h2>
                          </div>

                          <div className="absolute top-2 right-2">
                            <MdOutlineCancel
                              // onClick={() => setIsAddProduct(false)}
                              onClick={handleAddproductclose}
                              size={25}
                              className="cursor-pointer"
                            />
                          </div>
                        </div>
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
              />
            </>
          )}

          {/*vendor page */}
          {isvendoropen && !vendorproductlist && (
            <div className="w-full  bg-[#EBF0FF] rounded-3xl ">
              {/* for dashboard */}
              <div className="w-full flex flex-col overflow-y-auto scrollbar-hide h-[calc(100vh-100px)] pb-2 px-3">
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
                  className={`grid grid-cols-2 ${
                    isExpanded ? "lg:grid-cols-4 gap-3" : "lg:grid-cols-4 gap-8"
                  } p-2`}
                >
                  {filteredvendors.map((user, index) => {
                    return (
                      <div
                        key={index}
                        className=" flex flex-col w-[300px] h-[150px] font-Poppins rounded-2xl bg-[#fff]"
                      >
                        <div className="flex items-center my-4">
                          <div className="mx-3">
                            <img src="/images/usericon.png" alt="usericon" />
                          </div>
                          <div>
                            <h2 className="text-[#000] text-base font-medium">
                              {user.company_name}
                            </h2>
                            <p className="text-[#ccc] text-sm">
                              {user.company_name}
                            </p>
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
            />
          )}
        </div>
      </div>
      {/* product preview */}
      {productPreview && (
        <DashboardProductCard
          onClose={() => {
            setProductPreview(false);
          }}
          product={selectedProductview}
          // fetchProducts={fetchProducts}
          handleDelete={handleDelete}
        />
      )}
    </div>
  );
}

export default AdminDashboard;
