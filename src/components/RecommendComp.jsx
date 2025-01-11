import { MdOutlineCancel } from "react-icons/md";
import Addon from "./Addon";

function RecommendComp() {
  return (
    <div className="grid grid-cols-[1fr,4fr] h-[75%]  w-1/2 ml-auto ">
      {/* first div of grid */}
      <div className="bg-[#D9D9D9] border rounded-l-[60px] h-[75%] overflow-hidden">
        <div className="p-10">
          <MdOutlineCancel size={40} color="gray" />
        </div>
      </div>
      {/* second div for recommend section */}
      <div className="bg-[#fbf6eb] h-[75%] overflow-auto overflow-y-scroll scrollbar-hide">
        {/* button */}
        <div className="flex justify-center items-center p-10 ">
          <div className="bg-[#1A3A36] text-white border-2 border-[#1A3A36] rounded-2xl px-10 py-3">
            Recommendation
          </div>
        </div>
        {/* recomended images */}
        <div className="grid grid-cols-2 gap-4 px-10 mt-2 bg-[#fbf6eb] overflow-auto">
          <Addon />
          <Addon />
          <Addon />
          <Addon />
          <Addon />
          <Addon />
        </div>
      </div>
    </div>
  );
}

export default RecommendComp;
