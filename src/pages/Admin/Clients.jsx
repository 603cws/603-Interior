import { useState } from "react";
import { FaBuilding } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import { adminsupabase } from "../../services/supabase";

function Clients({
  isExpanded,
  filterByMultipleFields,
  filteredusers,
  query,
  setIsrefresh,
}) {
  //state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedindex, setSelectedindex] = useState();

  //handle functions
  const handleDeleteClick = (user, index) => {
    setSelectedUser(user);
    setIsModalOpen(true);
    setSelectedindex(index);
  };

  const handleConfirmDelete = async () => {
    if (selectedUser) {
      try {
        // Call your delete function here
        await adminsupabase.auth.admin.deleteUser(selectedUser.id);
        setIsModalOpen(false);
        setSelectedUser(null);
      } catch (error) {
        console.log(error);
      } finally {
        setIsrefresh(true);
      }
    }
  };

  // jsx
  return (
    <div className="w-full  bg-[#EBF0FF] rounded-3xl my-2.5">
      {/* for dashboard */}
      <div className="w-full flex flex-col overflow-y-auto scrollbar-hide h-[calc(100vh-120px)] pb-2 px-3">
        {/* <div className="w-full flex flex-col overflow-y-auto scrollbar-hide h-[calc(100vh-200px)] pb-2 px-3"> */}
        <div className=" sticky top-0 z-20 bg-[#EBF0FF] rounded-lg">
          <div className="flex justify-between items-center px-4 py-2 border-b-2 border-b-gray-400 ">
            <h3 className="capitalize font-semibold text-xl ">Client List</h3>
            <div className="w-1/2">
              <input
                type="text"
                className="w-full rounded-lg px-2 py-1 outline-none"
                placeholder="......search by company name"
                onChange={(e) => filterByMultipleFields(e.target.value)}
                value={query}
              />
            </div>
          </div>
        </div>
        {/* client card for display */}

        <div
          className={`grid grid-cols-2   ${
            isExpanded
              ? "lg:grid-cols-3 xl:grid-cols-4 gap-8"
              : "lg:grid-cols-3 xl:grid-cols-4 gap-8"
          } p-2 `}
        >
          {filteredusers.map((user, index) => {
            return (
              <div
                key={index}
                className={`flex flex-col relative ${
                  isExpanded ? "lg:w-[200px] xl:w-[270px]" : "w-[320px]"
                } h-[150px] font-Poppins rounded-2xl bg-[#fff]`}
              >
                <div
                  className={`flex items-center my-4 ${
                    isExpanded && "px-4 py-2"
                  }`}
                >
                  <div className={`${isExpanded ? "hidden" : "block"} mx-3`}>
                    <img
                      src={`${user.profile_image}`}
                      alt="usericon"
                      className="w-12 h-12"
                    />
                  </div>
                  <div>
                    <h2 className="text-[#000] text-base font-medium">
                      {user.company_name}
                    </h2>
                    <p className="text-[#ccc] text-sm font-semibold">
                      {user.email}
                    </p>
                  </div>
                  <div className="ml-auto px-3">
                    {" "}
                    <button onClick={() => handleDeleteClick(user, index)}>
                      {" "}
                      <MdDeleteOutline size={25} />{" "}
                    </button>
                  </div>
                </div>

                <div className="flex-1 flex items-end pl-6 gap-3 my-5">
                  <div className="">
                    {" "}
                    <FaBuilding size={22} />
                  </div>{" "}
                  <h4 className="font-medium text-[#ccc] text-base">
                    {user.company_name}
                  </h4>
                </div>
                {isModalOpen && selectedindex === index && (
                  <div className=" inset-0 flex items-center justify-center bg-opacity-80 absolute w-full h-full">
                    <div className="bg-white rounded-lg px-5 py-2">
                      <h3 className="text-lg font-semibold">Are you sure?</h3>
                      <p>
                        Do you really want to delete{" "}
                        {selectedUser?.company_name}?
                      </p>
                      <div className="flex justify-center mt-4 gap-3">
                        <button
                          onClick={() => setIsModalOpen(false)}
                          className="px-4 py-2 bg-gray-300 rounded"
                        >
                          No
                        </button>
                        <button
                          onClick={handleConfirmDelete}
                          className="px-4 py-2 bg-red-500 text-white rounded"
                        >
                          Yes
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>{" "}
    </div>
  );
}

export default Clients;
