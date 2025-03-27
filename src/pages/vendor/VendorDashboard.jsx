import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabase";
import { useApp } from "../../Context/Context";
import toast from "react-hot-toast";
import { FaArrowLeft } from "react-icons/fa6";
import VendorSetting from "./VendorSetting";
import VendorProfile from "./VendorProfile";
import Sidebar from "./Sidebar";
import VendorItem from "./VendorItem";
import VendorDashboardCards from "./VendorDashboardCards";
import Help from "../user/Help";
import UserSetting from "../user/UserSetting";

function VendorDashboard() {
  const [isSettingOpen, setIsSettingOpen] = useState(false);
  const [isProductOpen, setIsProductOpen] = useState(false);
  const [isdashboardopen, setIsdashboardopen] = useState(true);
  const [iseditopen, setIsEditopen] = useState(true);
  const [help, setHelp] = useState(false);

  const navigate = useNavigate();
  const {
    setIsAuthenticated,
    accountHolder,
    setAccountHolder,
    setTotalArea,
    setIsAuthLoading,
  } = useApp();

  const handlesetting = () => {
    setIsProductOpen(false);
    setIsdashboardopen(false);
    setIsSettingOpen(true);
    setHelp(false);
  };
  const handleproduct = () => {
    setIsSettingOpen(false);
    setIsdashboardopen(false);
    setIsProductOpen(true);
    setHelp(false);
  };

  const handledashboard = () => {
    setIsSettingOpen(false);
    setIsProductOpen(false);
    setIsdashboardopen(true);
    setHelp(false);
  };

  const handleHelp = () => {
    setIsSettingOpen(false);
    setIsProductOpen(false);
    setIsdashboardopen(false);
    setHelp(true);
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

  return (
    <div className="bg-[url('images/bg/vendor.png')] bg-cover bg-center bg-no-repeat p-3 xl:p-5">
      <div className="flex gap-3 overflow-y-hidden max-h-fit bg-white rounded-3xl">
        {/* sidebar */}
        <Sidebar
          handleLogout={handleLogout}
          handleproduct={handleproduct}
          handlesetting={handlesetting}
          isProductOpen={isProductOpen}
          isSettingOpen={isSettingOpen}
          handledashboard={handledashboard}
          handleHelp={handleHelp}
        />
        <div className="flex-1 flex flex-col relative h-full px-2">
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
          <div className="flex-1  border-2 border-gray-400 rounded-3xl my-2">
            {/* dashboard */}

            {isdashboardopen && (
              <div className="overflow-y-hidden scrollbar-hide h-[calc(100vh-120px)] py-2 relative">
                <div className="p-4">
                  <VendorDashboardCards handleproduct={handleproduct} />
                </div>
              </div>
            )}
            {/* products */}
            {isProductOpen && <VendorItem />}

            {/* setting */}
            {isSettingOpen && (
              <div className="overflow-y-hidden scrollbar-hide h-[calc(100vh-120px)] py-2 relative">
                <div className="flex flex-col justify-between  pt-2 sticky top-0">
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
                    // <VendorSetting />
                    <UserSetting />
                  )}
                </div>
              </div>
            )}

            {/* help */}
            {help && <Help />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default VendorDashboard;
