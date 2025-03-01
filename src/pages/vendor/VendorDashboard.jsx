import { useState, useEffect, useRef } from "react";
import { RiDashboardFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { IoIosAdd } from "react-icons/io";
import { supabase } from "../../services/supabase";
import { useApp } from "../../Context/Context";
import toast from "react-hot-toast";
import { MdOutlineCancel } from "react-icons/md";
import { FaArrowLeft } from "react-icons/fa6";
import VendorSetting from "./VendorSetting";
// import { IoIosArrowDown } from "react-icons/io";
import VendorProfile from "./VendorProfile";
import { CiMenuKebab } from "react-icons/ci";
import { VscEye } from "react-icons/vsc";
import { MdOutlineDelete } from "react-icons/md";
import VendorNewProduct from "./VendorNewProduct";
import Spinner from "../../common-components/Spinner";
import VendorNewAddon from "./VendorNewAddon";
import { TiHomeOutline } from "react-icons/ti";
import { VscSignOut } from "react-icons/vsc";
import { IoSettingsSharp } from "react-icons/io5";
import { LuBlend } from "react-icons/lu";
import { BsQuestionCircle } from "react-icons/bs";
import DashboardProductCard from "./DashboardProductCard";

function VendorDashboard() {
  const [isSettingOpen, setIsSettingOpen] = useState(false);
  const [isProductOpen, setIsProductOpen] = useState(true);
  const [iseditopen, setIsEditopen] = useState(true);
  const [isAddProduct, setIsAddProduct] = useState(false);
  const [isProductHovered, setIsProductHovered] = useState(false);
  const [isAddonHovered, setIsAddonHovered] = useState(false);
  const [addNewProduct, setAddNewProduct] = useState(false);
  const [addNewAddon, setAddNewAddon] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null); // Store the ID of the row with an open menu
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedProductview, setSelectedProductview] = useState({
    product_name: "",
    product_price: "",
    product_image: "",
    product_description: "",
  });
  const [productPreview, setProductPreview] = useState(false);

  console.log("selected product", selectedProductview);

  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  // loading
  const [isloading, setIsloading] = useState(false);

  const [productlist, setProductlist] = useState(true);

  // const [displayproduct, setDisplayproduct] = useState(true);

  const [products, setProducts] = useState([]);
  const [addons, setAddons] = useState([]);

  const [toggle, setToggle] = useState(true);
  const [selectedTab, setSelectedTab] = useState("products");

  const [showMenu, setShowMenu] = useState(false);

  const tabs = [
    { name: "Products", value: "products" },
    { name: "Add-Ons", value: "addons" },
  ];

  const baseImageUrl =
    "https://bwxzfwsoxwtzhjbzbdzs.supabase.co/storage/v1/object/public/addon/";

  const navigate = useNavigate();
  const {
    setIsAuthenticated,
    accountHolder,
    setAccountHolder,
    setTotalArea,
    isAuthLoading,
    setIsAuthLoading,
  } = useApp();

  const handlesetting = () => {
    setIsProductOpen(false);
    setIsSettingOpen(true);
  };
  const handleproduct = () => {
    setIsSettingOpen(false);
    setIsProductOpen(true);
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

  const handleTabClick = (event) => {
    setProductlist(true);
    setIsAddProduct(false);
    const tab = event.target.value; // Get value from button
    setSelectedTab(tab);
    setToggle(tab === "products"); // Set toggle dynamically
  };

  // Fetch Products from Supabase
  const fetchProducts = async () => {
    setIsloading(true);

    try {
      const { data } = await supabase
        .from("product_variants")
        .select(
          `
          id, 
          title, 
          price, 
          details, 
          image, 
          product_id, 
          products (category, subcategory, subcategory1)
        `
        )
        .eq("vendor_id", accountHolder.userId);

      setProducts(data);

      console.log(data);
    } catch (error) {
      console.log("Error fetching products:", error);
    } finally {
      setIsloading(false);
    }
  };

  const fetchAddons = async () => {
    const { data, error } = await supabase
      .from("addon_variants")
      .select("*")
      .eq("vendorId", accountHolder.userId);
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

  // useEffect(() => {

  //   fetchAddons();
  // }, []);

  const handlenewproduct = () => {
    setProductlist(false);
    setIsAddProduct(true);
  };

  const handleAddproductclose = () => {
    setProductlist(true);
    setIsAddProduct(false);
  };

  // const handleMenuToggle = (id, event) => {
  //   event.stopPropagation(); // Prevents triggering the outside click handler
  //   setOpenMenuId(openMenuId === id ? null : id); // Toggle menu visibility for the specific row
  // };

  const handleMenuToggle = (id) => {
    setOpenMenuId((prev) => (prev === id ? null : id));
  };

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

  const SidebarItem = ({ icon, text, onClick, isExpanded, isActive }) => (
    <div
      className={`flex items-center mx-4 gap-3 hover:bg-[#B4EAEA] p-2 rounded cursor-pointer ${
        isExpanded && isActive ? "bg-[#B4EAEA]" : ""
      } ${isExpanded ? "" : "justify-center"}`}
      onClick={onClick}
    >
      <div className="text-2xl">{icon}</div>
      <span className={`${isExpanded ? "block" : "hidden"}`}>{text}</span>
    </div>
  );

  return (
    <div className="">
      <div className="flex gap-3 max-h-screen overflow-y-hidden">
        {/* sidebar */}
        {/* <div className="h-screen max-w-sm bg-red-600"> */}
        <div
          className={`h-screen sticky left-0 top-0 bottom-0 bg-white shadow-lg transition-all duration-300 ${
            isExpanded ? "max-w-sm w-60" : "w-16"
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
            {/* <SidebarItem
              icon={<RiDashboardFill />}
              text="Vendor Dashboard"
              isExpanded={isExpanded}
            /> */}
            <SidebarItem
              icon={<LuBlend />}
              text="Product"
              onClick={() => {
                handleproduct();
              }}
              isExpanded={isExpanded}
              isActive={isProductOpen}
            />
            <SidebarItem
              icon={<RiDashboardFill />}
              text="Dashboard"
              isExpanded={isExpanded}
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
              icon={<BsQuestionCircle />}
              text="Help"
              isExpanded={isExpanded}
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
        <div className="flex-1 flex flex-col gap-3 relative h-full px-2">
          {/* header for dashboard */}
          <div className="flex justify-between items-center border-2 rounded-3xl mt-2 sticky top-3 z-10 bg-white h-[50px]">
            <div className="mx-3">
              <h3 className="font-bold text-lg capitalize ">
                {accountHolder.companyName}
              </h3>
            </div>
            <div className="mx-3">
              <img
                src={accountHolder.profileImage}
                alt="usericon"
                className="h-10 w-10 rounded-full"
              />
            </div>
          </div>

          {/* div for content */}
          <div className="flex-1  border-2 border-gray-400 rounded-3xl">
            {/* for dashboard */}
            {isProductOpen && (
              <div className="overflow-y-auto scrollbar-hide h-[calc(100vh-100px)] rounded-3xl relative ">
                {addNewProduct ? (
                  <VendorNewProduct
                    setAddNewProduct={setAddNewProduct}
                    setProductlist={setProductlist}
                  />
                ) : addNewAddon ? (
                  // Show only Add New Addon section
                  // <div className="flex flex-col justify-center items-center h-[90%] font-Poppins">
                  //   <h2>New Addon Section</h2>
                  // </div>
                  <VendorNewAddon
                    setAddNewProduct={setAddNewAddon}
                    setProductlist={setProductlist}
                  />
                ) : (
                  // Default product list and add product UI
                  <>
                    {/* <div className="flex justify-between items-center px-4 py-2 border-b-2 border-b-gray-400 sticky top-0">
                      <h3 className="capitalize font-semibold text-xl ">
                        product list
                      </h3>

                      <button
                        onClick={() => setIsAddProduct(true)}
                        className="capitalize shadow-sm py-2 px-4 text-sm flex justify-center items-center border-2"
                      >
                        <IoIosAdd size={20} />
                        add product
                      </button>
                    </div> */}
                    <div className=" sticky top-0">
                      <div className="flex justify-between items-center px-4 py-2 border-b-2 border-b-gray-400 ">
                        <h3 className="capitalize font-semibold text-xl ">
                          product list
                        </h3>

                        <button
                          // onClick={() => setIsAddProduct(true)}
                          onClick={handlenewproduct}
                          className="capitalize shadow-sm py-2 px-4 text-sm flex justify-center items-center border-2"
                        >
                          <IoIosAdd size={20} />
                          add product
                        </button>
                      </div>
                      <div className="flex gap-3 px-4 py-2 border-b-2 border-b-gray-400">
                        {/* <button className="capitalize font-medium text-base px-10 py-2 rounded-2xl border-[#000] border bg-[#B4EAEA]">
                          product
                        </button>
                        <button className="capitalize font-medium text-base px-10 py-2 rounded-2xl border-[#000] border bg-[#B4EAEA]">
                          Add Ons
                        </button> */}
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

                                  {/* <th className="p-3 flex items-center gap-2 font-medium">
                                  Price <IoIosArrowDown />
                                </th> */}
                                  <th className="p-3  font-medium">Price</th>
                                  {toggle ? (
                                    <>
                                      <th className="p-3 font-medium">
                                        Details
                                      </th>
                                      <th className="p-3 font-medium">
                                        Category
                                      </th>
                                      {/* <th className="p-3 flex items-center gap-2 font-medium">
                                      Category <IoIosArrowDown />
                                    </th> */}
                                      {/* <th className="hidden xl:table-cell p-3 font-medium">
                                      Sub Category
                                    </th> */}
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
                              {/* <tbody className="text-center text-sm"> */}
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
                                        {/* <td className="hidden xl:block border border-gray-200 p-3 align-middle">
                                        {item.products?.subcategory || "N/A"}
                                      </td> */}
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
                                      {/* <button className="bg-white border border-black text-black py-1.5 hover:bg-[#C4BFE4] w-20 rounded-3xl mb-2">
                                        Edit
                                      </button>
                                      <button className="bg-white border border-black text-black py-1.5 hover:bg-[#C4BFE4] w-20 rounded-3xl">
                                        Delete
                                      </button> */}

                                      <button
                                        className="bg-white flex justify-center items-center py-1.5 w-20 mb-2"
                                        onClick={() =>
                                          handleMenuToggle(item.id)
                                        }
                                      >
                                        <CiMenuKebab size={25} />
                                      </button>

                                      {openMenuId === item.id && (
                                        // <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white border border-gray-300 shadow-md rounded-md w-24 z-10">
                                        <div
                                          ref={menuRef}
                                          className="absolute top-1/2 left-0 transform mt-2 bg-white border border-gray-300 shadow-md rounded-md w-24 z-10"
                                        >
                                          <button
                                            // onClick={() => {
                                            //   setProductPreview(true);
                                            // }}
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
            )}

            {/* setting */}
            {isSettingOpen && (
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
                      <VendorProfile setIsEditopen={setIsEditopen} />
                    </div>
                  ) : (
                    <VendorSetting />
                  )}
                </div>
              </div>
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
    </div>
  );
}

export default VendorDashboard;
