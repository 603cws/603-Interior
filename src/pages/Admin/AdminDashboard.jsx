import { useEffect, useState, useRef, useReducer } from "react";
import { RiDashboardFill, RiFormula, RiSettingsLine } from "react-icons/ri";
import { useLocation, useNavigate } from "react-router-dom";
import { useApp } from "../../Context/Context";
import { supabase, adminsupabase } from "../../services/supabase";
import { VscSignOut } from "react-icons/vsc";
import { IoCalendarOutline, IoSettingsSharp } from "react-icons/io5";
import { LuBlend } from "react-icons/lu";
import { FaBuilding } from "react-icons/fa";
import { PiCodeBlock, PiHandshakeFill } from "react-icons/pi";
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { CiShop } from "react-icons/ci";
import SidebarItem from "../../common-components/SidebarItem";
import Clients from "./Clients";
import VendorProductlist from "./VendorProductlist";
import CreateUser from "./CreateUser";

import { MdDeleteOutline } from "react-icons/md";
import { TbCalculator, TbCalendarStats } from "react-icons/tb";
import Schedule from "./Schedule";
import FormulaEditor from "../../pages/Admin/FormulaEditor";

import { useLogout } from "../../utils/HelperFunction";
import { IoCloseCircle } from "react-icons/io5";
import { IoIosSearch } from "react-icons/io";
import { GoPlus } from "react-icons/go";
import ClientBoq from "./ClientBoq";
import { BsBoxSeam } from "react-icons/bs";
import { FiLogOut, FiUser, FiUserPlus } from "react-icons/fi";
import { IoMdSwitch } from "react-icons/io";
import CategoryEditor from "../../pages/Admin/CategoryEditor";
import AdminDashHome from "./AdminDashHome";
import AdminSetting from "./AdminSetting";
import AdminDashItems from "./AdminDashItems";
function handlesidebarState(state, action) {
  switch (action.type) {
    case "TOGGLE_SECTION":
      return {
        isSettingOpen: action.payload === "Setting",
        isProductOpen: action.payload === "Product",
        dashboard: action.payload === "Dashboard",
        isClientOpen: action.payload === "Client",
        isCreateOpen: action.payload === "Create",
        isVendorOpen: action.payload === "Vendors",
        isScheduleOpen: action.payload === "Schedule",
        isFormulaeOpen: action.payload === "Formulae",
        isCategoryEditorOpen: action.payload === "CategoryEditor",
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
  CategoryEditor: "CategoryEditor",
  SETTING: "Setting",
};

function AdminDashboard() {
  const logout = useLogout();
  const navigate = useNavigate();

  const [query, setQuery] = useState();

  const [isExpanded, setIsExpanded] = useState(false);

  const [selectedVendor, setSelectedVendor] = useState(null);
  const [isrefresh, setIsrefresh] = useState(false);
  const [isvendorRefresh, setIsvendorRefresh] = useState(false);

  const [vendorproductlist, setVendorproductlist] = useState(false);

  // loading

  const [allusers, setAllusers] = useState();
  const [filteredusers, setFilteredUsers] = useState();
  const [filteredvendors, setFilteredvendors] = useState();
  const [allvendors, setAllvendors] = useState();

  //delete warning

  const [clientBoqs, setClientBoqs] = useState(false);

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

  const [isOpen, setIsOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const { accountHolder } = useApp();

  const location = useLocation();

  useEffect(() => {
    if (location.state?.openSettings) {
      sidebarDispatch({ type: "TOGGLE_SECTION", payload: SECTIONS.SETTING });
    }
  }, [location.state]);

  const [searchQuery, setSearchQuery] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedindex, setSelectedindex] = useState();

  const mobileMenuRef = useRef(null);

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

  const handlesetting = () => {
    sidebarDispatch({ type: "TOGGLE_SECTION", payload: SECTIONS.SETTING });
  };

  const handleswitch = () => {
    navigate("/dashboard");
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

  const handleCategoryEditor = () => {
    sidebarDispatch({
      type: "TOGGLE_SECTION",
      payload: SECTIONS.CategoryEditor,
    });
  };

  const getvendors = async () => {
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
      const { data } = await supabase
        .from("users_profiles")
        .select("*")
        .eq("role", "user");

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
            icon={<FiUser />}
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
            icon={<FiUserPlus />}
            text="Create"
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
            icon={<PiCodeBlock />}
            text="Category Editor"
            onClick={handleCategoryEditor}
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
            icon={<IoMdSwitch />}
            text="change dashboard"
            onClick={handleswitch}
            isExpanded={isExpanded}
          />
          <SidebarItem
            icon={<FiLogOut />}
            text="Logout"
            onClick={logout}
            isExpanded={isExpanded}
          />
        </div>
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

          <div
            ref={mobileMenuRef}
            className={`fixed top-0 right-0 h-full w-64 bg-white border-l z-50 transform ${
              isOpen ? "translate-x-0" : "translate-x-full"
            } transition-transform duration-300 ease-in-out shadow-lg`}
          >
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
                icon={<FiUser />}
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
                icon={<FiUserPlus />}
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

              <MobileMenuItem
                icon={<PiCodeBlock />}
                text="Category Editor"
                currentSection={sidebarstate?.currentSection}
                onClick={handleCategoryEditor}
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
        {sidebarstate.dashboard && (
          <div className="flex flex-col h-full min-h-0 loverflow-hidden lg:border-2 border-[#334A78] rounded-lg bg-[#fff]">
            <AdminDashHome
              allusers={allusers?.length}
              allvendors={allvendors?.length}
              handleVendor={handleVendor}
              handleclient={handleclient}
              handleproduct={handleproduct}
            />
          </div>
        )}

        {sidebarstate?.isSettingOpen && (
          <div className="flex flex-col h-full min-h-0 overflow-hidden lg:border-2 lg:border-[#334A78] lg:rounded-lg bg-white">
            <AdminSetting />
          </div>
        )}
        {sidebarstate.isProductOpen && (
          <div className="flex flex-col h-full min-h-0 overflow-hidden lg:border-2 lg:border-[#334A78] lg:rounded-lg bg-white">
            <AdminDashItems />
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

        {sidebarstate.isVendorOpen && !vendorproductlist && (
          <div className="flex flex-col h-full min-h-0 overflow-hidden lg:border-2 lg:border-[#334A78] lg:rounded-lg bg-white">
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
                              // applyFilters({
                              //   query: value,
                              // });
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
                      <div
                        className={` ${
                          isExpanded ? " gap-2 py-3 px-1" : "gap-3 py-4 px-2"
                        } flex items-start  relative`}
                      >
                        <img
                          src={user?.profile_image}
                          alt="profile"
                          className={`${
                            isExpanded ? "w-10 h-10" : "w-12 h-12"
                          }  rounded-full object-cover border border-[#ccc]`}
                        />

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

                        <button
                          onClick={() => handleDeletevendirClick(user, index)}
                          className="absolute top-2 right-2 text-black hover:text-red-500"
                        >
                          <MdDeleteOutline size={20} />
                        </button>
                      </div>

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
          />
        )}

        {sidebarstate.isCreateOpen && (
          <div className="flex flex-col h-full min-h-0 overflow-hidden lg:border-2 lg:border-[#334A78] lg:rounded-lg bg-white">
            <div className="overflow-y-auto scrollbar-hide h-[calc(100vh-120px)] rounded-3xl relative ">
              <CreateUser />
            </div>
          </div>
        )}
        {sidebarstate.isScheduleOpen && <Schedule />}
        {sidebarstate.isFormulaeOpen && <FormulaEditor />}
        {sidebarstate.isCategoryEditorOpen && <CategoryEditor />}
      </div>
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
