import { RiDashboardFill } from "react-icons/ri";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { BiFilterAlt } from "react-icons/bi";
import { AiOutlineCloudDownload } from "react-icons/ai";
import { LuPlus } from "react-icons/lu";
import { IoIosArrowDown } from "react-icons/io";

function AdminDashboard() {
  const navigate = useNavigate();
  //if margin inc/dec then to adjust the screen height => search vh and increase the - part so it will fit the div
  return (
    //images/home/sectionproduct2.png
    <div className="bg-[url('images/admin/Admin.png')] bg-cover bg-center bg-no-repeat  p-5 max-h-full">
      <div className="flex gap-3 overflow-hidden bg-white rounded-xl">
        {/* Sidebar */}
        <div className=" max-w-sm sticky left-0 top-0 bottom-0">
          {/* Logo */}
          <div className="cursor-pointer flex justify-center items-center mt-8">
            <img src="/logo/logo.png" alt="Logo" className="h-20 w-32" />
          </div>

          {/* Main Menu */}
          <div className="font-semibold text-lg capitalize leading-normal tracking-wide py-7 text-[#262626] flex flex-col gap-4 px-7">
            <h3 className="capitalize text-[#A1A1A1] mx-4">main</h3>
            <div className="flex items-center mx-4 gap-3 hover:bg-[#B4EAEA] cursor-pointer">
              <RiDashboardFill />
              <button onClick={() => navigate("/")}>Home</button>
            </div>
            <div className="flex items-center mx-4 gap-3 hover:bg-[#B4EAEA] cursor-pointer">
              <RiDashboardFill />
              <p>dashboard</p>
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

          {/* Others Menu */}
          <div className="font-semibold text-lg capitalize leading-normal tracking-wide py-7 text-[#262626] flex flex-col gap-4 px-7">
            <h3 className="capitalize text-[#A1A1A1] mx-4">others</h3>
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

        {/* Main Content */}
        <div className="flex-1 flex flex-col gap-3 relative px-2 overflow-x-auto">
          {/* Header */}
          <div className="mt-2 sticky top-3 z-10 h-[50px] rounded-3xl p-[2px] bg-gradient-to-r from-[#B4BEEA] to-[#191B4F]">
            <div className="flex justify-between items-center h-full rounded-3xl bg-[#EBF0FF] px-3">
              <div className="">
                <h3 className="font-extrabold text-xl capitalize">client</h3>
              </div>
              <div>
                <img
                  src="/images/usericon.png"
                  alt="usericon"
                  className="w-8 h-8"
                />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 rounded-xl bg-[#EBF0FF] mb-5 cursor-default overflow-hidden">
            <div className="h-[calc(100vh-130px)] flex flex-col">
              {/* Header Section */}
              <div className="flex justify-between items-center mt-4 px-8">
                {/* Left Side: Back Navigation & Title (Stacked Vertically) */}
                <div className="flex flex-col">
                  {/* Back to Client List */}
                  <div className="flex items-center text-[#A1A1A1]">
                    <MdKeyboardArrowLeft size={20} />
                    <span className="ml-1 text-sm">Back to Client List</span>
                  </div>

                  {/* Selected Products */}
                  <h1 className="text-md font-semibold font-Poppins mt-1 ml-1">
                    Selected Products
                  </h1>
                </div>

                {/* Right Side: Buttons (Vertically Centered) */}
                <div className="flex items-center gap-3">
                  <button className="flex items-center gap-2 px-4 py-2 border bg-white rounded-md hover:bg-[#C4BFE4]">
                    <BiFilterAlt />
                    Filter
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 border bg-white rounded-md hover:bg-[#C4BFE4]">
                    <AiOutlineCloudDownload />
                    Export
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 border bg-white rounded-md hover:bg-[#C4BFE4]">
                    <LuPlus />
                    Add Product
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center mt-4 px-8">
                {/* Right Side: Buttons (Vertically Centered) */}
                <div className="flex items-center gap-3">
                  <button className="flex items-center gap-2 px-6 py-2 border bg-white rounded-xl hover:bg-[#C4BFE4]">
                    Products
                  </button>
                  <button className="flex items-center gap-2 px-6 py-2 border bg-white rounded-xl hover:bg-[#C4BFE4]">
                    Add-Ons
                  </button>
                </div>
              </div>

              {/* Table Section */}
              <section className="mt-2 flex-1 overflow-hidden px-8">
                <div className="w-full h-full border-t border-b border-[#CCCCCC] overflow-y-auto custom-scrollbar">
                  <table className="min-w-full border-collapse">
                    <thead className="bg-[#EBF0FF] sticky top-0 z-10 px-8 text-center text-nowrap">
                      <tr>
                        <th className="p-3">Product Name</th>
                        <th className="p-3 flex items-center gap-2">
                          Price
                          <IoIosArrowDown />
                        </th>
                        <th className="p-3">Details</th>
                        <th className="p-3 flex items-center gap-2">
                          Category
                          <IoIosArrowDown />
                        </th>
                        <th className="p-3">Sub Category</th>
                        <th className="p-3">Sub-Sub Category</th>
                        <th className="p-3">Action</th>
                      </tr>
                    </thead>
                    <tbody className="max-h-[400px] text-center text-sm">
                      {[...Array(8)].map((_, index) => (
                        <tr
                          key={index}
                          className="hover:bg-gray-50 cursor-pointer w-full"
                        >
                          <td className="border border-gray-200 p-3">
                            Classic Ceramic Tito
                          </td>
                          <td className="border border-gray-200 p-3">₹1.129</td>
                          <td className="border border-gray-200 p-3">
                            Timeless ceramic tiles that add elegance and style
                            to any room.
                          </td>
                          <td className="border border-gray-200 p-3">
                            Flooring
                          </td>
                          <td className="border border-gray-200 p-3">
                            Open Workspace, Cabine, Meeting Room, Public Spaces,
                            All Areas
                          </td>
                          <td className="border border-gray-200 p-3">Tito</td>
                          <td className="border border-gray-200 p-3 flex flex-col items-center">
                            <button className="bg-white border border-black text-black px-0 py-1.5 hover:bg-[#C4BFE4] w-20 rounded-3xl mb-2">
                              Edit
                            </button>
                            <button className="bg-white border border-black text-black px-0 py-1.5 hover:bg-[#C4BFE4] w-20 rounded-3xl">
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
