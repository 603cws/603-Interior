import { useReducer, useState } from "react";
import { useApp } from "../../Context/Context";
import { FaArrowLeft } from "react-icons/fa6";
import VendorProfile from "./VendorProfile";
import Sidebar from "./Sidebar";
import VendorItem from "./VendorItem";
import VendorDashboardCards from "./VendorDashboardCards";
import Help from "../user/Help";
import UserSetting from "../user/UserSetting";
import { useLogout } from "../../utils/HelperFunction";

function handlesidebarState(state, action) {
  switch (action.type) {
    case "TOGGLE_SECTION":
      return {
        isSettingOpen: action.payload === "Setting",
        isProductOpen: action.payload === "Product",
        iseditopen: action.payload === "Edit",
        dashboard: action.payload === "Dashboard",
        help: action.payload === "Help",
        currentSection: action.payload,
      };
    default:
      return state;
  }
}

const SECTIONS = {
  DASHBOARD: "Dashboard",
  PRODUCT: "Product",
  SETTING: "Setting",
  HELP: "Help",
};

const sidebarInitialState = {
  isSettingOpen: false,
  isProductOpen: false,
  dashboard: true,
  help: false,
  currentSection: "Dashboard",
};
function VendorDashboard() {
  const logout = useLogout();
  const [iseditopen, setIsEditopen] = useState(true);

  const [sidebarstate, sidebarDispatch] = useReducer(
    handlesidebarState,
    sidebarInitialState
  );

  const { accountHolder } = useApp();
  const handlesetting = () => {
    sidebarDispatch({ type: "TOGGLE_SECTION", payload: SECTIONS.SETTING });
  };
  const handleproduct = () => {
    sidebarDispatch({ type: "TOGGLE_SECTION", payload: SECTIONS.PRODUCT });
  };

  const handledashboard = () => {
    sidebarDispatch({ type: "TOGGLE_SECTION", payload: SECTIONS.DASHBOARD });
  };

  const handleHelp = () => {
    sidebarDispatch({ type: "TOGGLE_SECTION", payload: SECTIONS.HELP });
  };

  return (
    <div className="">
      <div className="flex gap-3 overflow-y-hidden max-h-fit bg-white rounded-3xl">
        {/* sidebar */}
        <Sidebar
          handleLogout={logout}
          handleproduct={handleproduct}
          handlesetting={handlesetting}
          isProductOpen={sidebarstate?.isProductOpen}
          isSettingOpen={sidebarstate?.isSettingOpen}
          handledashboard={handledashboard}
          handleHelp={handleHelp}
        />
        <div className="flex-1 flex flex-col relative h-full px-2">
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
            {sidebarstate?.dashboard && (
              <div className="overflow-y-hidden scrollbar-hide h-[calc(100vh-120px)] py-2 relative">
                <div className="p-4">
                  <VendorDashboardCards handleproduct={handleproduct} />
                </div>
              </div>
            )}
            {sidebarstate?.isProductOpen && <VendorItem />}
            {sidebarstate?.isSettingOpen && (
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
                    <UserSetting />
                  )}
                </div>
              </div>
            )}
            {sidebarstate?.help && <Help isvendor={true} />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default VendorDashboard;
