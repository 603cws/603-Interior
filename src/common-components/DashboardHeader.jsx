function DashboardHeader({ sidebarstate, handlesetting, accountHolder }) {
  return (
    <div className="flex justify-between items-center border-b border-[#CCCCCC] lg:border-2 lg:border-[#334A78] lg:rounded-lg bg-white  lg:h-[50px] shrink-0">
      <div className="mx-3">
        <h3 className="font-semibold text-2xl text-[#374A75] capitalize">
          {sidebarstate?.currentSection}
        </h3>
      </div>
      <div
        className="hidden lg:block mx-3 rounded-full cursor-pointer"
        style={{
          backgroundImage:
            "linear-gradient(to top left, #5B73AF 0%, rgba(255, 255, 255, 0.5) 48%, #1F335C 100%)",
        }}
        onClick={handlesetting}
      >
        <img
          src={accountHolder?.profileImage}
          alt="usericon"
          className="w-10 h-10 p-1"
        />
      </div>
    </div>
  );
}

export default DashboardHeader;
