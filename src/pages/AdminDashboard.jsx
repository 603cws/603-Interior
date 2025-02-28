import { RiDashboardFill } from "react-icons/ri";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { BiFilterAlt } from "react-icons/bi";
import { AiOutlineCloudDownload } from "react-icons/ai";
import { LuPlus } from "react-icons/lu";
import { IoIosArrowDown } from "react-icons/io";
import { useEffect, useRef, useState } from "react";
import { supabase } from "../services/supabase";

function AdminDashboard() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [addons, setAddons] = useState([]);

  const [toggle, setToggle] = useState(true);
  const [selectedTab, setSelectedTab] = useState("products");

  const tabs = [
    { name: "Products", value: "products" },
    { name: "Add-Ons", value: "addons" },
  ];

  const baseImageUrl =
    "https://bwxzfwsoxwtzhjbzbdzs.supabase.co/storage/v1/object/public/addon/";

  const tableRef = useRef(null);
  const [itemsPerPage, setItemsPerPage] = useState(10); // Default (gets updated dynamically)
  const [currentPage, setCurrentPage] = useState(1);

  const items = toggle ? products : addons;
  const totalPages = Math.ceil(items.length / itemsPerPage);

  useEffect(() => {
    const calculateItemsPerPage = () => {
      if (tableRef.current) {
        const tableHeight = tableRef.current.clientHeight; // Get table's available height
        const rowHeight = 60; // Approximate row height (adjust if needed)
        const headerHeight = 50; // Height of the table header
        const maxRows = Math.floor((tableHeight - headerHeight) / rowHeight);

        // setItemsPerPage(maxRows > 0 ? maxRows : 1); // Ensure at least 1 row is shown
      }
    };

    calculateItemsPerPage();
    window.addEventListener("resize", calculateItemsPerPage);
    return () => window.removeEventListener("resize", calculateItemsPerPage);
  }, []);

  // Slice the items for pagination
  const paginatedItems = items.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToPage = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Fetch Products from Supabase
  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase.from("product_variants").select(`
          id, 
          title, 
          price, 
          details, 
          image, 
          product_id, 
          products (category, subcategory, subcategory1)
        `);

      if (error) {
        console.error("Error fetching products:", error);
      } else {
        setProducts(data);
      }
    };

    const fetchAddons = async () => {
      const { data, error } = await supabase.from("addon_variants").select(
        `
          id, 
          title, 
          price, 
          image, 
          addonid, 
          addons (title)
        `
      );

      if (error) {
        console.error("Error fetching addons:", error);
      } else {
        setAddons(data);
        console.log("Addons: ", data);
      }
    };

    fetchProducts();
    fetchAddons();
  }, []);

  const handleTabClick = (event) => {
    const tab = event.target.value; // Get value from button
    setSelectedTab(tab);
    setToggle(tab === "products"); // Set toggle dynamically
  };

  //if margin inc/dec then to adjust the screen height => search vh and increase the - part so it will fit the div
  return (
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
            <div
              className={`3xl:${
                totalPages > 1
                  ? "h-[calc(100vh-220px)]"
                  : "h-[calc(100vh-150px)]"
              } ${
                totalPages > 1
                  ? "h-[calc(100vh-220px)]"
                  : "h-[calc(100vh-130px)]"
              } flex flex-col`}
            >
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
                  {tabs.map((tab) => (
                    <button
                      key={tab.value}
                      className={`flex items-center gap-2 px-6 py-2 border rounded-xl ${
                        selectedTab === tab.value
                          ? "bg-[#C4BFE4] text-white"
                          : "bg-white "
                      }`}
                      value={tab.value}
                      onClick={handleTabClick} // Dynamically sets the tab
                    >
                      {tab.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Table Section */}
              <section className="mt-2 flex flex-col px-8">
                {/* Scrollable Table Container */}
                <div
                  className="w-full  3xl:h-[620px] h-[400px] border-t border-b border-[#CCCCCC] overflow-y-auto custom-scrollbar"
                  ref={tableRef}
                >
                  {items.length > 0 ? (
                    <table className="min-w-full border-collapse">
                      <thead className="bg-[#EBF0FF] sticky top-0 z-10 px-8 text-center text-nowrap">
                        <tr>
                          <th className="p-3">Product Name</th>
                          <th className="p-3 flex items-center gap-2">
                            Price <IoIosArrowDown />
                          </th>
                          {toggle ? (
                            <>
                              <th className="p-3">Details</th>
                              <th className="p-3 flex items-center gap-2">
                                Category <IoIosArrowDown />
                              </th>
                              <th className="p-3">Sub Category</th>
                              <th className="p-3">Sub-Sub Category</th>
                            </>
                          ) : (
                            <th className="p-3">Addon Title</th>
                          )}
                          <th className="p-3">Action</th>
                        </tr>
                      </thead>
                      <tbody className="text-center text-sm">
                        {paginatedItems.map((item) => (
                          <tr
                            key={item.id}
                            className="hover:bg-gray-50 cursor-pointer"
                          >
                            <td className="border border-gray-200 p-3 align-middle">
                              <div className="flex items-center gap-2">
                                <img
                                  src={`${baseImageUrl}${item.image}`}
                                  alt={item.title}
                                  className="w-10 h-10 object-cover rounded"
                                />
                                <span>{item.title}</span>
                              </div>
                            </td>
                            <td className="border border-gray-200 p-3 align-middle">
                              ₹{item.price}
                            </td>
                            {toggle ? (
                              <>
                                <td className="border border-gray-200 p-3 align-middle">
                                  {item.details}
                                </td>
                                <td className="border border-gray-200 p-3 align-middle">
                                  {item.products?.category || "N/A"}
                                </td>
                                <td className="border border-gray-200 p-3 align-middle">
                                  {item.products?.subcategory || "N/A"}
                                </td>
                                <td className="border border-gray-200 p-3 align-middle">
                                  {item.products?.subcategory1 || "N/A"}
                                </td>
                              </>
                            ) : (
                              <td className="border border-gray-200 p-3 align-middle">
                                {item.addons?.title || "N/A"}
                              </td>
                            )}
                            <td className="border border-gray-200 p-3 align-middle flex flex-col items-center">
                              <button className="bg-white border border-black text-black py-1.5 hover:bg-[#C4BFE4] w-20 rounded-3xl mb-2">
                                Edit
                              </button>
                              <button className="bg-white border border-black text-black py-1.5 hover:bg-[#C4BFE4] w-20 rounded-3xl">
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className="p-5 text-gray-500 text-center">
                      No {toggle ? "products" : "addons"} found.
                    </p>
                  )}
                </div>
              </section>
            </div>
            {/* Pagination Controls (Always Visible) */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-10 z-30 sticky bottom-0 bg-[#EBF0FF] mb-4 text-[#3d194f]">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border rounded disabled:opacity-50 text-[#3d194f]"
                >
                  Previous
                </button>

                {/* Page Numbers */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) =>
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1) ? (
                      <button
                        key={page}
                        onClick={() => goToPage(page)}
                        className={`w-8 h-8 flex items-center justify-center  ${
                          currentPage === page
                            ? "bg-[#aca9d3] text-white rounded-full "
                            : "rounded-md text-[#3d194f]"
                        }`}
                      >
                        {page}
                      </button>
                    ) : page === currentPage + 2 || page === currentPage - 2 ? (
                      <span key={page} className="px-2">
                        ...
                      </span>
                    ) : null
                )}

                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border rounded disabled:opacity-50 text-[#3d194f]"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
