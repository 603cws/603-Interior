const formatBoqTitle = (title, max = 20) =>
  title?.length > max ? `${title.slice(0, max)}...` : title;

function TopBar({
  handleLogo,
  BOQTitle,
  boqTotal,
  accountHolder,
  iconRef,
  toggleProfile,
}) {
  return (
    <div className="flex justify-between bg-gradient-to-r from-[#23445B] to-[#487BA0] items-center px-3 md:px-6 3xl:px-40 h-[50px]">
      <div className="hidden sm:block absolute lg:flex gap-2 right-1/4 lg:right-20 -translate-x-full" />
      <button onClick={handleLogo}>
        <img
          src="/logo/workved-logo.png"
          alt="Workved Interior logo"
          className="h-auto md:h-8 lg:h-10 w-16 lg:w-24"
        />
      </button>
      <div className="flex gap-3 items-center">
        {BOQTitle && (
          <h1 className="hidden sm:block text-white font-semibold text-sm pr-3">
            {formatBoqTitle(BOQTitle)}
          </h1>
        )}
        {boqTotal > 0 && (
          <div className="flex justify-center items-center bg-[#FFF] rounded-sm text-[10px] md:text-xs px-2 md:px-5 h-fit py-2 md:py-3 self-center text-black border-solid border-1 border-black">
            <span className="font-bold">Total</span>: ₹{" "}
            {boqTotal.toLocaleString("en-IN")}
          </div>
        )}
        <div
          className="z-30 rounded-full"
          ref={iconRef}
          style={{
            backgroundImage:
              "linear-gradient(to top left, #5B73AF 0%, rgba(255, 255, 255, 0.5) 48%, #1F335C 100%)",
          }}
        >
          <img
            onClick={toggleProfile}
            src={accountHolder.profileImage}
            alt="usericon"
            className="w-10 md:w-12 h-10 p-1 md:h-12 cursor-pointer rounded-full"
          />
        </div>
      </div>
    </div>
  );
}

export default TopBar;
