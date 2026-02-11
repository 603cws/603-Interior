import VendorProductlist from "./VendorProductlist";
import { IoCloseCircle } from "react-icons/io5";
import { IoIosSearch } from "react-icons/io";
import { GoPlus } from "react-icons/go";
import { MdDeleteOutline } from "react-icons/md";
import { FaBuilding } from "react-icons/fa";
import { useState } from "react";
import { adminsupabase } from "../../services/supabase";
import { handleError } from "../../common-components/handleError";

function AdminDashVendors({
  isExpanded,
  allvendors,
  handlecreate,
  setIsvendorRefresh,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [query, setQuery] = useState("");
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const [vendorproductlist, setVendorproductlist] = useState(false);
  const [filteredvendors, setFilteredvendors] = useState(allvendors);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedindex, setSelectedindex] = useState();
  const [sortOrder, setSortOrder] = useState("newest");

  const handleDeletevendirClick = (user, index) => {
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
        handleError(error, {
          prodMessage: "Something went wrong. Please try again.",
        });
      } finally {
        setIsvendorRefresh(true);
      }
    }
  };

  const filterVendorByMultipleFields = (query, order = sortOrder) => {
    let result = [...allvendors];
    // if (!query) {
    //   setFilteredvendors(allvendors); // Reset to original list when input is empty
    //   return;
    // }
    if (query) {
      result = allvendors.filter(
        (item) =>
          item?.company_name?.toLowerCase().includes(query?.toLowerCase()) ||
          item?.email?.toLowerCase().includes(query?.toLowerCase()),
      );
    }
    result.sort((a, b) => {
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);

      return order === "newest" ? dateB - dateA : dateA - dateB;
    });
    setFilteredvendors(result);
  };
  return (
    <>
      {!vendorproductlist && (
        <div className="flex flex-col h-full min-h-0 overflow-hidden lg:border-2 lg:border-[#334A78] lg:rounded-lg bg-white">
          <div className="w-full flex flex-col overflow-y-auto scrollbar-hide h-[calc(100vh-120px)] pb-2 px-3">
            <div className=" sticky top-0 z-20 bg-[#FFF]">
              <div className="flex justify-between items-center px-4 py-2 border-b-2 border-b-gray-400 ">
                <h3 className="capitalize font-semibold text-xl ">
                  Vendor List
                </h3>
                <div className="w-1/2 hidden lg:flex items-center gap-2">
                  <input
                    type="text"
                    className="w-full rounded-lg px-2 py-1.5 outline-none border text-sm"
                    placeholder="......search by company name or email"
                    onChange={(e) => {
                      filterVendorByMultipleFields(e.target.value);
                      setQuery(e.target.value);
                    }}
                    value={query}
                  />
                  <select
                    value={sortOrder}
                    onChange={(e) => {
                      const value = e.target.value;
                      setSortOrder(value);
                      filterVendorByMultipleFields(query, value);
                    }}
                    className="rounded-md px-2 py-1.5 border text-sm outline-none bg-white"
                  >
                    <option value="newest">Newest first</option>
                    <option value="oldest">Oldest first</option>
                  </select>
                </div>
                <div className="lg:hidden flex gap-2">
                  {/* add vendor button */}
                  <button
                    onClick={handlecreate}
                    className="h-10 w-10 flex justify-center items-center bg-[#374A75] text-[#fff] rounded"
                  >
                    <GoPlus size={20} />
                  </button>

                  {/* search button */}
                  <div>
                    <button
                      onClick={() => setMobileSearchOpen(true)}
                      className="h-10 w-10 flex justify-center items-center border rounded"
                    >
                      <IoIosSearch size={20} color="#374A75" />
                    </button>
                    {mobileSearchOpen && (
                      <div
                        className={`absolute top-0 bg-[#fff] w-full h-[95%] z-30 flex justify-between items-center px-3 !transition-all !duration-700 !ease-in-out ${
                          mobileSearchOpen
                            ? "opacity-100 translate-x-0 left-0"
                            : "opacity-0 -translate-x-full right-0"
                        }`}
                      >
                        <input
                          type="text"
                          value={searchQuery}
                          placeholder="......search by product name"
                          onChange={(e) => {
                            const value = e.target.value;
                            setSearchQuery(value);
                            // applyFilters({
                            //   query: value,
                            // });
                          }}
                          className="w-3/4 px-2 py-2.5 border rounded-sm text-[10px]"
                        />
                        <button
                          className="mr-4"
                          onClick={() => setMobileSearchOpen(false)}
                        >
                          <IoCloseCircle size={25} color="#374A75" />
                        </button>
                      </div>
                    )}
                  </div>
                  <select
                    value={sortOrder}
                    onChange={(e) => {
                      const value = e.target.value;
                      setSortOrder(value);
                      filterVendorByMultipleFields(query, value);
                    }}
                    className="rounded-md px-2 py-1.5 border text-sm outline-none bg-white"
                  >
                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>
                  </select>
                </div>
              </div>
            </div>

            <div
              className={`grid grid-cols-1 md:grid-cols-2  ${
                isExpanded
                  ? "lg:grid-cols-2 xl:grid-cols-4 gap-8"
                  : "lg:grid-cols-2 xl:grid-cols-4 gap-4"
              } p-2`}
            >
              {filteredvendors.map((user, index) => {
                return (
                  <div
                    key={index}
                    className={`w-full max-w-xs rounded-lg border overflow-hidden shadow-md bg-white relative flex flex-col p-2`}
                  >
                    <div
                      className={` ${
                        isExpanded ? " gap-2 py-3 px-1" : "gap-3 py-4 px-2"
                      } flex items-start  relative`}
                    >
                      <img
                        src={user?.profile_image}
                        alt="profile"
                        className={`${
                          isExpanded ? "w-10 h-10" : "w-12 h-12"
                        }  rounded-full object-cover border border-[#ccc]`}
                      />

                      <div className="flex flex-col justify-center">
                        <h2
                          className={`${
                            isExpanded ? "text-sm" : "text-base"
                          }  font-semibold text-black`}
                        >
                          {user.company_name}
                        </h2>
                        <p
                          className={`text-gray-400 w-full ${
                            isExpanded ? "text-xs" : "text-sm"
                          } leading-tight break-all whitespace-normal`}
                        >
                          {user.email}
                        </p>
                      </div>

                      <button
                        onClick={() => handleDeletevendirClick(user, index)}
                        className="absolute top-2 right-2 text-black hover:text-red-500"
                      >
                        <MdDeleteOutline size={20} />
                      </button>
                    </div>

                    <div
                      onClick={() => {
                        setSelectedVendor(user); // Store selected vendor
                        setVendorproductlist(true); // Show product list
                      }}
                      className=" cursor-pointer text-[#374A75] p-3 flex items-center gap-2 flex-1 mt-auto border-t"
                    >
                      <FaBuilding className="" />
                      <p className="text-sm ">{user?.company_name}</p>
                    </div>

                    {isModalOpen && selectedindex === index && (
                      <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-black/40">
                        <div className="bg-white h-full rounded-lg px-5 py-2">
                          <h3 className="text-sm font-semibold">
                            Are you sure?
                          </h3>
                          <p className="text-sm">
                            Do you really want to delete{" "}
                            {selectedUser?.company_name}?
                          </p>
                          <div className="flex justify-center mt-4 gap-3">
                            <button
                              onClick={() => setIsModalOpen(false)}
                              className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
                            >
                              No
                            </button>
                            <button
                              onClick={handleConfirmDelete}
                              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded"
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
          </div>
        </div>
      )}
      {vendorproductlist && (
        <VendorProductlist
          setVendorproductlist={setVendorproductlist}
          selectedVendor={selectedVendor}
        />
      )}
    </>
  );
}

export default AdminDashVendors;
