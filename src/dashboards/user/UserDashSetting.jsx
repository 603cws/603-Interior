import { useState } from "react";
import UserCard from "../components/UserCard";
import ManageAddress from "./ManageAddress";
import UserProfileEdit from "../components/UserProfileEdit";

function UserDashSetting() {
  const [profileInfo, setProfileInfo] = useState(true);
  const [manageAddress, setManageAddress] = useState(false);
  const [iseditopen, setIsEditopen] = useState(true);
  return (
    <>
      <div className="w-full flex flex-col md:flex-row md:items-center px-2 gap-3 lg:gap-5 lg:px-4 py-2 border-b-2 border-b-gray-400">
        {iseditopen && (
          <div className="flex gap-5 mt-2 self-start">
            <button
              onClick={() => {
                setManageAddress(false);
                setProfileInfo(true);
              }}
              className={`px-5 py-2 capitalize text-[#374A75] border border-[#374A75] rounded hover:bg-[#D3E3F0] ${
                profileInfo ? "bg-[#D3E3F0]" : ""
              }`}
            >
              profile information
            </button>
            <button
              onClick={() => {
                setProfileInfo(false);
                setManageAddress(true);
              }}
              className={`px-5 py-2 capitalize text-[#374A75] border border-[#374A75] rounded hover:bg-[#D3E3F0] ${
                manageAddress ? "bg-[#D3E3F0]" : ""
              }`}
            >
              manage address
            </button>
          </div>
        )}
      </div>
      {iseditopen ? (
        <div className="flex-1 flex flex-col justify-center items-center h-[90%] font-Poppins">
          <div
            className={`flex items-center lg:w-full  h-full ${
              manageAddress ? "justify-start" : "justify-center"
            }`}
          >
            {profileInfo ? (
              <UserCard setIsEditopen={setIsEditopen} />
            ) : manageAddress ? (
              <ManageAddress />
            ) : (
              <UserProfileEdit setIsEditopen={setIsEditopen} />
            )}
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto min-h-0 p-2 md:p-7">
          <UserProfileEdit setIsEditopen={setIsEditopen} />
        </div>
      )}
    </>
  );
}

export default UserDashSetting;
