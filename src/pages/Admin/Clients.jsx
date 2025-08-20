import { useState } from "react";
import { FaBuilding } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import { adminsupabase } from "../../services/supabase";
import { IoIosSearch } from "react-icons/io";
import { useApp } from "../../Context/Context";

function Clients({
  isExpanded,
  filterByMultipleFields,
  filteredusers,
  query,
  setIsrefresh,
  setClientBoqs,
}) {
  //state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedindex, setSelectedindex] = useState();
  const [showSearch, setShowSearch] = useState(false);

  const { setSelectedClient, selectedClient } = useApp();

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

  const handleClientClick = (user) => {
    setClientBoqs(true);
    setSelectedClient(user);
  };

  // jsx
  return (
    <div className="flex flex-col h-full min-h-0 overflow-hidden lg:border-2 lg:border-[#334A78] lg:rounded-lg bg-white">
      {/* for dashboard */}
      <div className="w-full flex flex-col overflow-y-auto scrollbar-hide h-[calc(100vh-120px)] pb-2 px-3">
        {/* <div className="w-full flex flex-col overflow-y-auto scrollbar-hide h-[calc(100vh-200px)] pb-2 px-3"> */}
        <div className=" sticky top-0 z-20 bg-[#fff]">
          <div className="flex justify-between items-center px-4 py-2 border-b-2 border-b-gray-400">
            <h3 className="capitalize font-semibold text-xl ">Client List</h3>
            <div className="flex-1 md:w-1/2 md:flex-none flex flex-row-reverse gap-2">
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="py-1.5 px-2 flex justify-center items-center border rounded"
              >
                <IoIosSearch size={20} color="#374A75" />
              </button>
              <input
                type="text"
                className={`w-full rounded-md px-2 py-1 outline-none border ${
                  showSearch ? "block" : "hidden"
                }`}
                placeholder="......search by company name"
                onChange={(e) => filterByMultipleFields(e.target.value)}
                value={query}
              />
            </div>
          </div>
        </div>
        {/* client card for display */}

        <div
          className={`grid grid-cols-1 md:grid-cols-2 justify-items-center   ${
            isExpanded
              ? "lg:grid-cols-3 xl:grid-cols-4 gap-8"
              : "lg:grid-cols-3 xl:grid-cols-4 gap-8"
          } p-2 `}
        >
          {filteredusers.map((user, index) => {
            return (
              <div
                key={index}
                className={`w-full max-w-xs rounded-lg border overflow-hidden shadow-md bg-white relative flex flex-col p-2`}
              >
                <div
                  className={` ${
                    isExpanded ? " gap-2 p-3" : "gap-3 p-4"
                  } flex items-start  relative`}
                >
                  {/* <div className={`${isExpanded ? "hidden" : "block"} mx-3`}> */}
                  <img
                    src={`${user.profile_image}`}
                    alt="usericon"
                    className={`${
                      isExpanded ? "w-10 h-10" : "w-12 h-12"
                    }  rounded-full object-cover`}
                  />
                  {/* </div> */}
                  <div className="flex flex-col justify-center">
                    <h2
                      className={`${
                        isExpanded ? "text-sm" : "text-base"
                      }  font-semibold text-black`}
                    >
                      {user.company_name}
                    </h2>
                    <p
                      className={`text-gray-400 ${
                        isExpanded ? "text-xs" : "text-sm"
                      } leading-tight`}
                    >
                      {user.email}
                    </p>
                  </div>
                  {/* <div className="ml-auto px-3"> */}{" "}
                  <button
                    onClick={() => handleDeleteClick(user, index)}
                    className="absolute top-3 right-3 text-black hover:text-red-500"
                  >
                    {" "}
                    <MdDeleteOutline size={25} />{" "}
                  </button>
                  {/* </div> */}
                </div>

                <button
                  // onClick={() => {
                  //   setClientBoqs(true);
                  //   setSelectedClient(user);
                  // }}
                  onClick={() => handleClientClick(user)}
                  className=" cursor-pointer text-[#374A75] p-3 flex items-center gap-2 flex-1 mt-auto border-t"
                >
                  <FaBuilding size={22} color="#374A75" />
                  <h4 className="text-sm">{user.company_name}</h4>
                </button>
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
