import React from "react";
import Spinner from "../../common-components/Spinner";

function DashboardCards({ totalclients, totalVendors }) {
  if (!totalclients || !totalVendors) {
    return <Spinner />;
  }

  return (
    <div>
      <div className="flex gap-4 font-Poppins">
        <div className="bg-gradient-to-r from-[#6BE4FC] to-[#4AF3DF] text-white p-7 rounded-3xl flex flex-col justify-between lg:h-48 lg:w-40 xl:h-56 xl:w-48 relative hover:scale-110 transition-transform duration-300 ease-in-out">
          <h2 className="self-center text-xl font-bold">Client</h2>
          <h1 className="self-end justify-end font-semibold text-3xl xl:text-5xl">
            {totalclients.length}
          </h1>
          <img
            src="/images/dashboard-client.png"
            alt=""
            className="absolute left-2 bottom-10 h-24 w-24 opacity-50"
          />
        </div>

        <div className="bg-gradient-to-r from-[#6BAAFC] to-[#4A80F3] text-white p-7 rounded-3xl flex flex-col justify-between lg:h-48 lg:w-40 xl:h-56 xl:w-48 relative hover:scale-110 transition-transform duration-300 ease-in-out">
          <h2 className="self-center text-xl font-bold">Vendor</h2>
          <h1 className="self-end justify-end font-semibold text-3xl xl:text-5xl">
            {totalVendors.length}
          </h1>
          <img
            src="/images/dashboard-vendor.png"
            alt=""
            className="absolute left-2 bottom-10 h-24 w-24 opacity-50"
          />
        </div>

        <div className="bg-gradient-to-br from-[#EF5E7A] to-[#D35385] text-white p-7 rounded-3xl flex flex-col justify-between lg:h-48 lg:w-40 xl:h-56 xl:w-48 relative hover:scale-110 transition-transform duration-300 ease-in-out">
          <h2 className="self-center text-xl font-bold">Pending Orders</h2>
          <h1 className="self-end justify-end font-semibold text-3xl xl:text-5xl">
            0
          </h1>
          <img
            src="/images/dashboard-orders.png"
            alt=""
            className="absolute left-2 bottom-10 h-24 w-24 opacity-50"
          />
        </div>

        <div className="bg-gradient-to-br from-[#D623FE] to-[#A530F2] text-white p-7 rounded-3xl flex flex-col justify-between lg:h-48 lg:w-40 xl:h-56 xl:w-48 relative hover:scale-110 transition-transform duration-300 ease-in-out">
          <h2 className="self-center text-xl font-bold">New Orders</h2>
          <h1 className="self-end justify-end font-semibold text-3xl xl:text-5xl">
            0
          </h1>
          <img
            src="/images/dashboard-new-orders.png"
            alt=""
            className="absolute left-2 bottom-10 h-24 w-24 opacity-50"
          />
        </div>
      </div>
    </div>
  );
}

export default DashboardCards;
