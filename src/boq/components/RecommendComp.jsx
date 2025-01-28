import { MdOutlineCancel } from "react-icons/md";
import Addon from "../../common-components/Addon";

function RecommendComp({ showRecommend, setShowRecommend }) {
  console.log(showRecommend);
  return (
    <div className="grid grid-cols-[1fr,4fr] h-[115%] w-1/2 ml-auto absolute top-[115px] z-10 right-0">
      {/* first div of grid */}
      <div className="bg-[#D9D9D9] opacity-70 border rounded-l-[60px] h-[75%] overflow-hidden">
        <div className="p-10" onClick={() => setShowRecommend(false)}>
          <MdOutlineCancel
            size={40}
            color="gray"
            className="cursor-pointer opacity-100"
          />
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
