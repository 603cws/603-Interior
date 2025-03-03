import React from "react";

function DashboardInbox() {
  return (
    <div className="bg-white rounded-3xl shadow-sm p-10 font-Poppins lg:h-[240px]">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-[#252733]">Inbox</h3>
          <p className="text-[#9FA2B4] text-xs">
            group:<span className="text-[#4B506D]">Support</span>
          </p>
        </div>
        <button className="text-[#3751FF] hover:text-blue-700 font-bold">
          View Details
        </button>
      </div>
      <div className="flex gap-3 justify-between items-center my-5 py-2 border-b-2 hover:bg-gray-100">
        <p className="text-[#252733]">Waiting for approve order#12345</p>
        <span className="text-[#9FA2B4]">4:39</span>
      </div>
      <div className="flex gap-3 justify-between items-center my-5 py-2 border-b-2 hover:bg-gray-100">
        <p className="text-[#252733]">Waiting for approve order#22234</p>
        <span className="text-[#9FA2B4]">11:07</span>
      </div>
    </div>
  );
}

export default DashboardInbox;
