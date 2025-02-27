import { RiDashboardFill } from "react-icons/ri";
import { MdOutlineModeEdit, MdDeleteOutline } from "react-icons/md";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import { useNavigate } from "react-router-dom";
import { useApp } from "../Context/Context";
import { supabase } from "../services/supabase";
import toast from "react-hot-toast";
import { useState } from "react";
import VendorProfile from "./vendor/VendorProfile";
import VendorSetting from "./vendor/VendorSetting";
import { FaArrowLeft } from "react-icons/fa6";
const percentage = 66;

function Dashboard() {
  const navigate = useNavigate();
  // const [productlist, setProductlist] = useState(true);
  const [isSettingOpen, setIsSettingOpen] = useState(false);
  const [isProductOpen, setIsProductOpen] = useState(true);
  const [iseditopen, setIsEditopen] = useState(true);

  const [dashboard, setDashboard] = useState(true);

  const {
    accountHolder,
    setAccountHolder,
    setIsAuthLoading,
    setIsAuthenticated,
    setTotalArea,
  } = useApp();

  const handlesetting = () => {
    setIsProductOpen(false);
    setDashboard(false);
    setIsSettingOpen(true);
  };
  const handleproduct = () => {
    setIsSettingOpen(false);
    setIsProductOpen(true);
  };

  const handledashboard = () => {
    setIsSettingOpen(false);
    setDashboard(true);
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
              <button className="capitalize" onClick={() => navigate("/")}>
                Home
              </button>
            </div>
            <div className="flex items-center mx-4 gap-3 hover:bg-[#B4EAEA] cursor-pointer">
              <RiDashboardFill />
              <button className="capitalize" onClick={handledashboard}>
                dashboard
              </button>
            </div>
            <div className="flex items-center mx-4 gap-3 hover:bg-[#B4EAEA] cursor-pointer">
              <RiDashboardFill />
              <button className="capitalize"> product</button>
            </div>
          </div>
          {/* others */}
          <div className="font-semibold text-lg capitalize leading-normal tracking-wide py-7 text-[#262626]  flex flex-col gap-4 px-7">
            <h3 className="capitalize text-[#A1A1A1] mx-4">other</h3>
            <div className="flex items-center mx-4 gap-3 hover:bg-[#B4EAEA] cursor-pointer">
              <RiDashboardFill />
              <button className="capitalize">help</button>
            </div>
            <div className="flex items-center mx-4 gap-3 hover:bg-[#B4EAEA] cursor-pointer">
              <RiDashboardFill />
              <button className="capitalize" onClick={handlesetting}>
                setting
              </button>
            </div>
            <div className="flex items-center mx-4 gap-3 hover:bg-[#B4EAEA] cursor-pointer">
              <RiDashboardFill />
              <button className="capitalize" onClick={handleLogout}>
                logout
              </button>
            </div>
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-3 relative h-full px-2">
          {/* header for dashboard */}
          <div className="flex justify-between items-center border-2 rounded-3xl mt-2 sticky top-3 z-10 bg-white h-[50px]">
            <div className="mx-3">
              <h3 className="font-bold text-lg capitalize ">client</h3>
            </div>
            <div className="mx-3">
              <img src="/images/usericon.png" alt="usericon" />
            </div>
          </div>

          {/* div for content */}
          {dashboard && (
            <div className="flex-1  border-2 border-[#000] rounded-3xl ">
              {/* for dashboard */}
              <div className="overflow-y-auto scrollbar-hide h-[calc(100vh-100px)] py-2 px-3">
                {/* dashboard area layout */}
                <div className="p-4">
                  <h2 className="capitalize font-bold mb-2">
                    Layout Information
                  </h2>
                  {/* div containing information */}
                  <div className="flex gap-10">
                    {/* each icon  */}
                    <div className="flex justify-around items-center gap-3  py-3 px-2">
                      <div>
                        <img
                          src="/images/layouticon.png"
                          alt=" dashboard layout "
                          className="w-[60px] h-[60px]"
                        />
                      </div>
                      <div className="capitalize pr-10">
                        <p className="font-bold text-lg">
                          1500 <span>sqft</span>
                        </p>
                        <p className="text-base">total area</p>
                      </div>
                    </div>
                    {/* each icon  */}
                    <div className="flex justify-around items-center gap-3  py-3 px-2">
                      <div>
                        <img
                          src="/images/layouticon.png"
                          alt=" dashboard layout "
                          className="w-[60px] h-[60px]"
                        />
                      </div>
                      <div className="capitalize pr-10">
                        <p className="font-bold text-lg">
                          1500 <span>sqft</span>
                        </p>
                        <p className="text-base">total area</p>
                      </div>
                    </div>
                    {/* each icon  */}
                    <div className="flex justify-around items-center gap-3  py-3 px-2">
                      <div>
                        <img
                          src="/images/layouticon.png"
                          alt=" dashboard layout "
                          className="w-[60px] h-[60px]"
                        />
                      </div>
                      <div className="capitalize pr-10">
                        <p className="font-bold text-lg">
                          1500 <span>sqft</span>
                        </p>
                        <p className="text-base">total area</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* dashboard boq part */}

                <div className="p-3">
                  <h3 className="capitalize font-bold ">BOQ generated</h3>

                  {/* boq card */}
                  <div className="rounded-3xl border-2 border-[#ccc] max-w-sm p-2">
                    <div className="flex justify-end gap-2 p-2">
                      <MdOutlineModeEdit size={30} />
                      <MdDeleteOutline size={30} />
                    </div>
                    <div>
                      <h3 className="font-bold">Lorem, ipsum.</h3>
                    </div>
                  </div>

                  <div className="w-32 h-32">
                    <CircularProgressbar
                      value={percentage}
                      text={`${percentage}%`}
                      // styles={{ width: 50, height: 50 }}
                      styles={buildStyles({
                        // Rotation of path and trail, in number of turns (0-1)
                        rotation: 0.25,

                        // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
                        strokeLinecap: "butt",

                        // Text size
                        textSize: "16px",

                        // How long animation takes to go from one percentage to another, in seconds
                        pathTransitionDuration: 0.5,

                        // Can specify path transition in more detail, or remove it entirely
                        // pathTransition: 'none',

                        // Colors
                        pathColor: `rgba(62, 152, 199, ${percentage / 100})`,
                        textColor: "#f88",
                        trailColor: "#d6d6d6",
                        backgroundColor: "#3e98c7",
                      })}
                    />
                  </div>
                </div>
                <div>
                  <p>
                    Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                    Magni quos fugiat reiciendis temporibus nulla eius maxime
                    quidem? Libero eum laborum ut, dolorum corrupti autem
                    voluptate,
                  </p>
                </div>
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
                      <VendorProfile setIsEditopen={setIsEditopen} />
                    </div>
                  ) : (
                    <VendorSetting />
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
