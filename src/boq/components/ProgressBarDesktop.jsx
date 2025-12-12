function ProgressBarDesktop({ progress }) {
  return (
    <div className="w-7/12 lg:w-2/5 xl:w-7/12 mx-auto pl-2 py-2.5">
      <div className="relative h-5 bg-[#385682] rounded-sm">
        <div
          className="absolute h-full bg-[#85AED2] rounded-sm"
          style={{ width: `${progress}%` }}
        />
        <div
          className="absolute top-0 transform -translate-x-full bg-gradient-to-br from-[#334A78] to-[#1F2937]  rounded-sm glowing-circle"
          style={{ left: `${progress}%`, width: "10px", height: "18px" }}
        />
        <div
          className="absolute -top-full -translate-y-3/4 bg-[#f4f4f4] text-black text-[10px] px-3 py-1 rounded-md"
          style={{ left: `${progress - 3}%` }}
        >
          <span className="absolute left-1/2 -translate-x-1/2 -bottom-1 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-white" />
          {`${progress}%`}
        </div>
      </div>
    </div>
  );
}

export default ProgressBarDesktop;
