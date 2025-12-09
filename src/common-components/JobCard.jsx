import { FaLocationDot } from "react-icons/fa6";
import { GiPadlock } from "react-icons/gi";
import { HiClock } from "react-icons/hi2";
import { IoIosArrowForward } from "react-icons/io";

function JobCard() {
  return (
    <div className="bg-teal-200 rounded-lg p-6 w-64 shadow-md">
      <h2 className="text-lg font-bold text-gray-800">Web Developer</h2>
      <div className="mt-4 space-y-2">
        <div className="flex items-center space-x-2">
          <HiClock />
          <p className="text-sm text-gray-700">Full Time</p>
        </div>
        <div className="flex items-center space-x-2">
          <GiPadlock />
          <p className="text-sm text-gray-700">2-3 Years</p>
        </div>
        <div className="flex items-center space-x-2">
          <FaLocationDot />
          <p className="text-sm text-gray-700">India</p>
        </div>
      </div>
      <button className="mt-4 flex items-center text-teal-700 font-medium text-sm hover:underline">
        View Details{" "}
        <span className="material-icons ml-1">
          <IoIosArrowForward />
        </span>
      </button>
    </div>
  );
}

export default JobCard;
