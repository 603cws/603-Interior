import { useState } from "react";
import UserCard from "../user/UserCard";
import UserProfileEdit from "../user/UserProfileEdit";

function AdminSetting() {
  const [iseditopen, setIsEditopen] = useState(true);
  return (
    <>
      {iseditopen ? (
        <div className="flex-1 flex flex-col justify-center items-center h-[90%] font-Poppins ">
          <div className="flex justify-center items-center lg:w-full  h-full">
            <UserCard setIsEditopen={setIsEditopen} />
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

export default AdminSetting;
