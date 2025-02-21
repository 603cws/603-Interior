function DashboardGetPlan() {
  return (
    <div className="">
      <div className="max-w-sm relative">
        <img
          src="/images/dashboardmenu.png"
          alt="doashboard getplan"
          className="w-full"
        />
        <div className="text-[#fff] absolute top-1/2 transform -translate-y-1/2 left-1/2 -translate-x-1/2  flex flex-col justify-center items-center gap-3 p-4">
          <h3 className="capitalize font-medium text-xl">Get the Plan</h3>
          <p className="text-center text-nowrap  text-sm">
            {" "}
            Try plan to get your product <br /> listed with exciting offers.
          </p>
          <button
            className="px-4 py-2 bg-[#194F48] rounded-xl mb-3
          "
          >
            Upgrade Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default DashboardGetPlan;
