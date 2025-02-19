import { RiDashboardFill } from "react-icons/ri";
import { MdOutlineModeEdit, MdDeleteOutline } from "react-icons/md";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import { useNavigate } from "react-router-dom";
import { IoIosAdd } from "react-icons/io";
const percentage = 66;
function VendorDashboard() {
  const navigate = useNavigate();
  return (
    <div className="">
      <div className="flex gap-3 max-h-screen overflow-y-hidden">
        {/* sidebar */}
        {/* <div className="h-screen max-w-sm bg-red-600"> */}
        <div className="h-screen max-w-sm  sticky left-0 top-0 bottom-0">
          {/* logo */}
          <div className="cursor-pointer flex justify-center items-center">
            <img src="/logo/logo.png" alt="Logo" className="h-20 w-32" />
          </div>

          {/* main */}
          <div className="font-semibold text-lg capitalize leading-normal tracking-wide py-7 text-[#262626]  flex flex-col gap-4 px-7">
            <h3 className="capitalize text-[#A1A1A1] mx-4">main</h3>
            <div className="flex items-center mx-4 gap-3 hover:bg-[#B4EAEA] cursor-pointer">
              <RiDashboardFill />
              <button onClick={() => navigate("/")}>Home</button>
            </div>
            <div className="flex items-center mx-4 gap-3 hover:bg-[#B4EAEA] cursor-pointer">
              <RiDashboardFill />
              <p>vendor dashboard</p>
            </div>
            <div className="flex items-center mx-4 gap-3 hover:bg-[#B4EAEA] cursor-pointer">
              <RiDashboardFill />
              <p>dashboard</p>
            </div>
            <div className="flex items-center mx-4 gap-3 hover:bg-[#B4EAEA] cursor-pointer">
              <RiDashboardFill />
              <p>dashboard</p>
            </div>
          </div>
          {/* others */}
          <div className="font-semibold text-lg capitalize leading-normal tracking-wide py-7 text-[#262626]  flex flex-col gap-4 px-7">
            <h3 className="capitalize text-[#A1A1A1] mx-4">main</h3>
            <div className="flex items-center mx-4 gap-3 hover:bg-[#B4EAEA] cursor-pointer">
              <RiDashboardFill />
              <p>setting</p>
            </div>
            <div className="flex items-center mx-4 gap-3 hover:bg-[#B4EAEA] cursor-pointer">
              <RiDashboardFill />
              <p>setting</p>
            </div>
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-3 relative h-full px-2">
          {/* header for dashboard */}
          <div className="flex justify-between items-center border-2 rounded-3xl mt-2 sticky top-3 z-10 bg-white h-[50px]">
            <div className="mx-3">
              <h3 className="font-bold text-lg capitalize ">products</h3>
            </div>
            <div className="mx-3">
              <img src="/images/usericon.png" alt="usericon" />
            </div>
          </div>

          {/* div for content */}
          <div className="flex-1  border-2 border-gray-400 rounded-3xl ">
            {/* for dashboard */}
            <div className="overflow-y-auto scrollbar-hide h-[calc(100vh-100px)] py-2 relative">
              <div className="flex justify-between items-center px-4 py-2 border-b-2 border-b-gray-400 sticky top-0">
                <h3 className="capitalize font-semibold text-xl ">
                  product list
                </h3>
                <button className="capitalize shadow-sm py-2 px-4 text-sm flex justify-center items-center border-2">
                  <IoIosAdd size={20} />
                  add product
                </button>
              </div>
              <div className="flex flex-col justify-center items-center h-[90%]">
                <div className="border-2 border-gray-200 px-28 py-12 flex flex-col justify-center items-center gap-6 rounded-2xl shadow-lg">
                  <IoIosAdd size={80} color="gray" className="cursor-pointer" />
                  <h4 className="font-bold text-lg">No data found</h4>
                  <h6 className="text-[#B1B1B1]">
                    Add category list to add your product menu.
                  </h6>
                  <button className="flex justify-center items-center px-7 py-2.5 bg-[#194F48] rounded-xl capitalize text-white font-semibold">
                    <IoIosAdd /> add product
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VendorDashboard;
