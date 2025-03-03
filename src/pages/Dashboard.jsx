import { RiDashboardFill } from "react-icons/ri";
import { MdOutlineModeEdit, MdDeleteOutline } from "react-icons/md";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import { useNavigate } from "react-router-dom";
import { useApp } from "../Context/Context";
import { supabase } from "../services/supabase";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
// import VendorProfile from "./vendor/VendorProfile";
// import VendorSetting from "./vendor/VendorSetting";
import UserProfile from "./user/UserProfile";
import UserSetting from "./user/UserSetting";
import { FaArrowLeft } from "react-icons/fa6";
import { VscSignOut } from "react-icons/vsc";
import { IoSettingsSharp } from "react-icons/io5";
import { LuBlend } from "react-icons/lu";
import { TiHomeOutline } from "react-icons/ti";

import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import { BsQuestionCircle } from "react-icons/bs";
import Spinner from "../common-components/Spinner";
const percentage = 66;

function Dashboard() {
  const navigate = useNavigate();
  // const [productlist, setProductlist] = useState(true);
  const [isSettingOpen, setIsSettingOpen] = useState(false);
  const [isProductOpen, setIsProductOpen] = useState(false);
  const [iseditopen, setIsEditopen] = useState(true);
  const [dashboard, setDashboard] = useState(true);
  const [currentSection, setCurrentSection] = useState("Dashboard");
  const [help, setHelp] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState();
  const [isExpanded, setIsExpanded] = useState(false);
  const [boqdata, setboqdata] = useState();

  const {
    accountHolder,
    setAccountHolder,
    setIsAuthLoading,
    setIsAuthenticated,
    setTotalArea,
    layoutImage,
  } = useApp();
  console.log("layout image", layoutImage);

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

  const handleToggle = (index) => {
    setExpandedIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const fetchboq = async () => {
    try {
      const { data } = await supabase
        .from("boqdata")
        .select("*")
        .eq("userId", accountHolder.userId);

      console.log(data);
      setboqdata(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchboq();
  }, []);

  // useEffect(() => {
  //   if (!layoutImage) {
  //     return <Spinner />;
  //   }
  // }, [layoutImage]);

  const accordionItems = [
    {
      title: "1.What is 603 Interiors?",
      content:
        "603 Interiors is a tech-driven platform that helps corporates design and set up their office spaces with instant layouts, smart BOQs, and vendor partnerships, ensuring a hassle-free experience",
    },
    {
      title: "2.Who can use 603 Interiors?",
      content:
        "Our platform is designed for corporates, startups, office administrators, HR teams, and real estate decision-makers looking for efficient office space planning and execution.",
    },
    {
      title: "3.How does 603 Interiors simplify office setup?",
      content:
        "We eliminate the need for lengthy consultations by offering instant office layouts, predefined and custom BOQs, and direct vendor collaboration, saving you time and costs.",
    },
  ];

  const SidebarItem = ({ icon, text, onClick, isExpanded }) => (
    <div
      className={`flex items-center mx-4 gap-3 hover:bg-[#B4EAEA] p-2 rounded cursor-pointer ${
        isExpanded ? "" : "justify-center"
      }`}
      onClick={onClick}
    >
      <div className="text-2xl">{icon}</div>
      <span className={`${isExpanded ? "block" : "hidden"}`}>{text}</span>
    </div>
  );

  return (
    // <div className="bg-[url('images/admin/Admin.png')] bg-cover bg-center bg-no-repeat  p-5 max-h-full">
    <div className="">
      <div className="flex gap-3 max-h-screen overflow-hidden bg-white">
        {/* <div className="flex gap-3 max-h-screen overflow-y-hidden bg-white"> */}
        {/* sidebar */}
        {/* <div className="h-screen max-w-sm bg-red-600"> */}
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
              icon={<TiHomeOutline />}
              text="Home"
              onClick={() => navigate("/")}
              isExpanded={isExpanded}
            />
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
              icon={<BsQuestionCircle />}
              text="Help"
              onClick={handlehelp}
              isExpanded={isExpanded}
            />
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
          <div className="flex justify-between items-center border-2 rounded-3xl mt-2 sticky top-3 z-10 bg-white h-[50px]">
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
                {/* dashboard area layout */}
                <div className="w-2/3">
                  <div className="p-4">
                    <h2 className="capitalize font-bold mb-2">
                      Layout Information
                    </h2>
                    {/* div containing information */}
                    <div className="flex gap-10">
                      {/* each icon  */}
                      <div className="xl:flex justify-around items-center gap-3  py-3 px-2">
                        <div>
                          <img
                            src="/images/layouticon.png"
                            alt=" dashboard layout "
                            className="w-[45px] h-[45px] xl:w-[60px] xl:h-[60px]"
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
                      <div className="xl:flex justify-around items-center gap-3  py-3 px-2">
                        <div>
                          <img
                            src="/images/totalproduct.png"
                            alt=" dashboard layout "
                            className="w-[45px] h-[45px] xl:w-[60px] xl:h-[60px]"
                          />
                        </div>
                        <div className="capitalize pr-10">
                          <p className="font-bold text-lg">
                            {/* 1500 <span>sqft</span> */}
                            1500
                          </p>
                          <p className="text-base">Total No Product</p>
                        </div>
                      </div>
                      {/* each icon  */}
                      <div className="xl:flex justify-around items-center gap-3  py-3 px-2">
                        <div>
                          <img
                            src="/images/grandtotal.png"
                            alt=" dashboard layout "
                            className="w-[45px] h-[45px] xl:w-[60px] xl:h-[60px]"
                          />
                        </div>
                        <div className="capitalize pr-10">
                          <p className="font-bold text-lg">
                            {/* 1500 <span>sqft</span> */}
                            1500000cr
                          </p>
                          <p className="text-base">Total Amount</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* dashboard boq part */}
                  <div className="p-3">
                    <h3 className="capitalize font-bold ">BOQ generated</h3>

                    {/* boq card */}
                    {boqdata.map((boq) => {
                      return (
                        <div className="rounded-3xl border-2 border-[#ccc] max-w-sm p-2">
                          <div className="flex justify-end gap-2 p-2">
                            <MdOutlineModeEdit size={30} />
                            <MdDeleteOutline size={30} />
                          </div>
                          <div>
                            <h3 className="font-bold">{}</h3>
                          </div>
                        </div>
                      );
                    })}

                    {/* <div className="w-32 h-32">
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
                    </div> */}
                  </div>
                  {/* <div>
                    <p>
                      Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                      Magni quos fugiat reiciendis temporibus nulla eius maxime
                      quidem? Libero eum laborum ut, dolorum corrupti autem
                      voluptate,
                    </p>
                  </div> */}
                </div>
                <div className="w-1/3  flex justify-center">
                  <div className="border-2 p-4 rounded-xl h-96">
                    {layoutImage ? (
                      <img
                        src={layoutImage}
                        alt="layout image"
                        className="h-80 w-80"
                      />
                    ) : (
                      <Spinner />
                    )}
                  </div>
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
              <h3>product list will be displayed here</h3>
            </div>
          )}

          {/* help */}
          {help && (
            <div className="flex-1  border-2 border-[#000] rounded-3xl font-Poppins">
              <div className="flex-col overflow-y-auto scrollbar-hide h-[calc(100vh-100px)] py-2 px-3">
                <div className="my-4">
                  <h2 className="text-[#000] text-xl capitalize font-semibold text-center">
                    How can we help you?
                  </h2>
                </div>

                <div className="bg-[#fff] border-2 p-3 border-[#E6E6E6] rounded-xl">
                  <h3 className="px-8 text-xl capitalize font-medium">
                    Common Issue
                  </h3>
                  <div className="flex flex-col m-auto px-8 py-2 ">
                    {accordionItems.map((item, index) => (
                      // <div key={index} className="border-b last:border-b-0">
                      <div
                        key={index}
                        className="mb-3 text-[#141515] font-Poppins font-medium"
                      >
                        <div
                          className="flex w-full text-left p-4 bg-gray-100 hover:bg-gray-200 focus:outline-none justify-between cursor-pointer rounded-xl"
                          onClick={() => handleToggle(index)}
                        >
                          <button
                          // className="w-full text-left p-4 bg-gray-100 hover:bg-gray-200 focus:outline-none"
                          // className="w-full text-left p-4 "
                          // onClick={() => handleToggle(index)}
                          >
                            {item.title}
                          </button>
                          {expandedIndex === index ? (
                            <FaAngleUp />
                          ) : (
                            <FaAngleDown />
                          )}
                        </div>
                        {expandedIndex === index && (
                          <div className="p-4 bg-white border-t rounded-xl">
                            <p>{item.content}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex-1 flex justify-center items-center bg-[#fff] border-2 p-3 border-[#E6E6E6] rounded-xl  my-5">
                  <div className="my-4">
                    <h4 className="text-[#1A3A36] text-xl text-center mb-3">
                      Still Need Help?
                    </h4>
                    <p className="text-[#4B5563] text-center mb-2">
                      Our support team is available 24/7 to assist you{" "}
                    </p>
                    <div className="flex justify-center items-center gap-4 my-1">
                      <button className="px-5 py-3 bg-[#1A3A36] text-[#fff] capitalize rounded-3xl">
                        +91-9136036603
                      </button>
                      <button className="border-2 border-[#D1D5DB] text-[#1A3A36] px-5 py-2 rounded-2xl">
                        Email
                      </button>
                    </div>
                  </div>
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
