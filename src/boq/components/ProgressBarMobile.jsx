function ProgressBarMobile({ progress }) {
  return (
    <div className="w-10/12 py-2.5">
      <div className="relative h-5 bg-[#385682] rounded-sm">
        <div
          className="absolute h-full bg-[#85AED2] rounded-sm"
          style={{ width: `${progress}%` }}
        />
        <div
          className="absolute top-0 transform -translate-x-1/2 bg-gradient-to-br from-[#334A78] to-[#1F2937] border-white rounded-sm glowing-circle"
          style={{ left: `${progress}%`, width: "10px", height: "19px" }}
        />
      </div>
      <div className="text-center mt-2 text-[#C7DDFF] text-[10px]">
        {progress}% Completed
      </div>
    </div>
  );
}

export default ProgressBarMobile;
