import { RiDashboardFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { IoIosAdd } from "react-icons/io";
import { supabase } from "../../services/supabase";
import { useApp } from "../../Context/Context";
import toast from "react-hot-toast";
import { useState } from "react";
import { MdOutlineCancel } from "react-icons/md";
import { FaArrowLeft } from "react-icons/fa6";
import VendorSetting from "./VendorSetting";
import VendorProfile from "./VendorProfile";

import VendorNewProduct from "./VendorNewProduct";
function VendorDashboard() {
  const [isSettingOpen, setIsSettingOpen] = useState(false);
  const [isProductOpen, setIsProductOpen] = useState(true);
  const [iseditopen, setIsEditopen] = useState(true);
  const [isAddProduct, setIsAddProduct] = useState(false);
  const [isProductHovered, setIsProductHovered] = useState(false);
  const [isAddonHovered, setIsAddonHovered] = useState(false);
  const [addNewProduct, setAddNewProduct] = useState(false);
  const [addNewAddon, setAddNewAddon] = useState(false);

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
              <div className="overflow-y-auto scrollbar-hide h-[calc(100vh-100px)] rounded-3xl relative">
                {addNewProduct ? (
                  <VendorNewProduct setAddNewProduct={setAddNewProduct} />
                ) : addNewAddon ? (
                  // Show only Add New Addon section
                  <div className="flex flex-col justify-center items-center h-[90%] font-Poppins">
                    <h2>New Addon Section</h2>
                  </div>
                ) : (
                  // Default product list and add product UI
                  <>
                    <div className="flex justify-between items-center px-4 py-2 border-b-2 border-b-gray-400 sticky top-0">
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
                    </div>

                    {isAddProduct ? (
                      <div className="flex flex-col justify-center items-center h-[90%] font-Poppins">
                        <div className="border-2 border-gray-200 px-28 py-14 flex justify-center items-center gap-10 rounded-2xl shadow-lg capitalize relative">
                          {/* Product Card */}
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

                          {/* Addon Card */}
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
                      // No Data Found UI
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
      </div>
    </div>
  );
}

export default VendorDashboard;
