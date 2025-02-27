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
  useEffect(() => {
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

    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchAddons = async () => {
      const { data, error } = await supabase
        .from("addon_variants")
        .select(
          `
            id, 
            title, 
            price, 
            image, 
            addonid, 
            addons (title)
          `
        )
        .eq("vendor_id", accountHolder.userId);

      if (error) {
        console.log("Error fetching addons:", error);
      } else {
        setAddons(data);
        console.log("Addons: ", data);
      }
    };
    fetchAddons();
  }, []);

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

  // useEffect(() => {
  //   const handleClickOutside = (event) => {
  //     // Check if the clicked element is inside any open menu
  //     if (
  //       openMenuId !== null &&
  //       menuRefs.current[openMenuId] &&
  //       !menuRefs.current[openMenuId].contains(event.target)
  //     ) {
  //       setOpenMenuId(null);
  //     }
  //   };

  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, [openMenuId]);

  return (
    <div className="">
      <div className="flex gap-3 max-h-screen overflow-y-hidden">
        {/* sidebar */}
        {/* <div className="h-screen max-w-sm bg-red-600"> */}
        <div className="h-screen max-w-sm  sticky left-0 top-0 bottom-0">
          {/* logo */}
          <div className="cursor-pointer flex justify-center items-center">
            <img src="/logo/logo.png" alt="Logo" className="h-20 w-32" />
          </div>

          {/* main */}
          <div className="font-semibold text-lg capitalize leading-normal tracking-wide py-7 text-[#262626]  flex flex-col gap-4 px-7">
            <h3 className="capitalize text-[#A1A1A1] mx-4">main</h3>
            <div className="flex items-center mx-4 gap-3 hover:bg-[#B4EAEA] cursor-pointer">
              <RiDashboardFill />
              <button onClick={() => navigate("/")}>Home</button>
            </div>
            <div className="flex items-center mx-4 gap-3 hover:bg-[#B4EAEA] cursor-pointer">
              <RiDashboardFill />
              <p>vendor dashboard</p>
            </div>
            <div
              className={`flex items-center mx-4 gap-3 hover:bg-[#B4EAEA] cursor-pointer ${
                isProductOpen ? "bg-[#b4eaea]" : ""
              }`}
            >
              <RiDashboardFill />
              <button onClick={handleproduct}>product</button>
            </div>
            <div className="flex items-center mx-4 gap-3 hover:bg-[#B4EAEA] cursor-pointer">
              <RiDashboardFill />
              <p>dashboard</p>
            </div>
          </div>
          {/* others */}
          <div className="font-semibold text-lg capitalize leading-normal tracking-wide py-7 text-[#262626]  flex flex-col gap-4 px-7">
            <h3 className="capitalize text-[#A1A1A1] mx-4">others</h3>
            <div className="flex items-center mx-4 gap-3 hover:bg-[#B4EAEA] cursor-pointer">
              <RiDashboardFill />
              <p>Help</p>
            </div>
            <div
              className={`flex items-center mx-4 gap-3 hover:bg-[#B4EAEA] cursor-pointer ${
                isSettingOpen ? "bg-[#b4eaea]" : ""
              }`}
            >
              <RiDashboardFill />
              <button onClick={handlesetting}>setting</button>
            </div>
            <div className="flex items-center mx-4 gap-3 hover:bg-[#B4EAEA] cursor-pointer">
              <RiDashboardFill />
              <button onClick={handleLogout}>Logout</button>
            </div>
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-3 relative h-full px-2">
          {/* header for dashboard */}
          <div className="flex justify-between items-center border-2 rounded-3xl mt-2 sticky top-3 z-10 bg-white h-[50px]">
            <div className="mx-3">
              <h3 className="font-bold text-lg capitalize ">companyName</h3>
            </div>
            <div className="mx-3">
              <img src="/images/usericon.png" alt="usericon" />
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
                                  <th className="p-3 font-medium">
                                    Product Name
                                  </th>
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
                                        <span>{item.title}</span>
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
                                        {item.addons?.title || "N/A"}
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
                                          <button className=" flex gap-2 items-center w-full text-left px-3 py-2 hover:bg-gray-200">
                                            <VscEye /> view
                                          </button>
                                          <button className="flex gap-2 items-center w-full text-left px-3 py-2 hover:bg-gray-200">
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

                    {/* {isAddProduct ? (
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
                              onClick={() => setIsAddProduct(false)}
                              size={25}
                              className="cursor-pointer"
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col justify-center items-center h-[90%] font-Poppins">
                        <div className="border-2 border-gray-200 px-28 py-14 flex flex-col justify-center items-center gap-6 rounded-2xl shadow-lg">
                          <IoIosAdd
                            size={80}
                            color="gray"
                            className="cursor-pointer"
                          />
                          <h4 className="font-bold text-lg">No data found</h4>
                          <h6 className="text-[#B1B1B1]">
                            Add category list to add your product menu.
                          </h6>
                          <button
                            onClick={() => setIsAddProduct(true)}
                            className="flex justify-center items-center px-7 py-2.5 bg-[#194F48] rounded-xl capitalize text-white font-semibold"
                          >
                            <IoIosAdd /> add product
                          </button>
                        </div>
                      </div>
                    )} */}
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
      </div>
    </div>
  );
}

export default VendorDashboard;
