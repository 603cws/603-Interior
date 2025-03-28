import { useState, useRef, useEffect } from "react";
import { VscEye } from "react-icons/vsc";
import { MdOutlineDelete } from "react-icons/md";
import { MdOutlineCancel } from "react-icons/md";
import { CiMenuKebab } from "react-icons/ci";
import Spinner from "../../common-components/Spinner";
import { supabase } from "../../services/supabase";
import toast from "react-hot-toast";
import DashboardProductCard from "../vendor/DashboardProductCard";

function VendorProductlist({ setVendorproductlist, selectedVendor }) {
  const [toggle, setToggle] = useState(true);
  const [isloading, setIsloading] = useState(false);
  const [selectedTab, setSelectedTab] = useState("products");
  const [productlist, setProductlist] = useState(true);
  const [addNewProduct, setAddNewProduct] = useState(false);
  const [addNewAddon, setAddNewAddon] = useState(false);
  const tableRef = useRef(null);
  const [itemsPerPage, setItemsPerPage] = useState(10); // Default (gets updated dynamically)
  const [currentPage, setCurrentPage] = useState(1);
  const [openMenuId, setOpenMenuId] = useState(null); // Store the ID of the row with an open menu
  const [productPreview, setProductPreview] = useState(false);
  const [selectedProductview, setSelectedProductview] = useState({
    product_name: "",
    product_price: "",
    product_image: "",
    product_description: "",
  });
  const [isAddProduct, setIsAddProduct] = useState(false);
  const [isProductHovered, setIsProductHovered] = useState(false);
  const [isAddonHovered, setIsAddonHovered] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [products, setProducts] = useState([]);
  const [addons, setAddons] = useState([]);
  const menuRef = useRef({});
  const buttonRef = useRef({});

  const vendorcategory = JSON.parse(selectedVendor.allowed_category);

  //baseurlforimg
  const baseImageUrl =
    "https://bwxzfwsoxwtzhjbzbdzs.supabase.co/storage/v1/object/public/addon/";

  const handleMenuToggle = (id) => {
    setOpenMenuId((prev) => (prev === id ? null : id));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      // If clicking inside the menu OR the menu button, do nothing
      if (
        openMenuId !== null &&
        (menuRef.current[openMenuId]?.contains(event.target) ||
          buttonRef.current[openMenuId]?.contains(event.target))
      ) {
        return;
      }

      // Otherwise, close the menu
      setOpenMenuId(null);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openMenuId]);

  const handleProductPreview = (product) => {
    setProductPreview(true);
    setSelectedProductview(product);
  };

  const tabs = [
    { name: "Products", value: "products" },
    { name: "Add-Ons", value: "addons" },
  ];

  const handleTabClick = (event) => {
    setProductlist(true);
    setIsAddProduct(false);
    const tab = event.target.value; // Get value from button
    setSelectedTab(tab);
    setToggle(tab === "products"); // Set toggle dynamically
  };

  const filteredProducts =
    selectedCategory === ""
      ? products
      : products.filter(
          (product) => product.products?.category === selectedCategory
        );

  const items = toggle ? filteredProducts : addons;
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

  const handleDelete = async (product) => {
    if (!product.id) return;

    try {
      const { error } = await supabase
        .from("product_variants") // Ensure this matches your table name
        .delete()
        .eq("id", product.id);

      if (error) throw error; // Throw error to be caught in catch block

      toast.success("Product deleted successfully!");
      setProductPreview(false); // Close the modal after deletion
    } catch (error) {
      toast.error("Failed to delete product.");
      console.error("Delete error:", error);
    }
    fetchProducts(1); // Fetch products after deletion
  };

  const handleAddproductclose = () => {
    setProductlist(true);
    setIsAddProduct(false);
  };

  // Fetch Products from Supabase
  const fetchProducts = async () => {
    setIsloading(true);
    try {
      const { data } = await supabase
        .from("product_variants")
        .select(
          `
              id, 
              title, 
              price, 
              details, 
              image, 
              product_id, 
              products (category, subcategory, subcategory1)
            `
        )
        .eq("vendor_id", selectedVendor.id);
      setProducts(data);
    } catch (error) {
      console.log("Error fetching products:", error);
    } finally {
      setIsloading(false);
    }
  };

  const fetchAddons = async () => {
    const { data, error } = await supabase
      .from("addon_variants")
      .select("*")
      .eq("vendorId", selectedVendor.id);

    if (error) {
      console.log("Error fetching addons:", error);
    } else {
      setAddons(data);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchAddons();
  }, []);

  return (
    <div className="flex-1  border-2 border-[#000] rounded-3xl my-2.5">
      <div className="overflow-y-auto scrollbar-hide h-[calc(100vh-120px)] rounded-3xl relative ">
        <div className=" sticky top-0">
          <div className="flex justify-between items-center px-4 py-2 border-b-2 border-b-gray-400 ">
            <button
              //   onClick={setVendorproductlist(false)}
              onClick={() => setVendorproductlist(false)}
              className="capitalize font-semibold text-xl "
            >
              go back
            </button>
            {toggle && (
              <div>
                <select
                  name="category"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  id="category"
                >
                  <option value="">All categories</option>
                  {vendorcategory.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
          <div className="flex gap-3 px-4 py-2 border-b-2 border-b-gray-400">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                className={`flex items-center gap-2 px-6 py-2 border rounded-xl ${
                  selectedTab === tab.value ? "bg-[#B4EAEA]" : "bg-white "
                }`}
                value={tab.value}
                onClick={handleTabClick} // Dynamically sets the tab
              >
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        {/*  */}
        {productlist &&
          (isloading ? (
            <Spinner />
          ) : items.length > 0 ? (
            // <section className="mt-2 flex-1 overflow-hidden px-8">
            <section className=" h-[90%] font-Poppins overflow-hidden">
              <div className="w-full h-full border-t border-b border-[#CCCCCC] overflow-y-auto custom-scrollbar">
                <table className="min-w-full border-collapse" ref={tableRef}>
                  <thead className="bg-[#FFFFFF] sticky top-0 z-10 px-8 text-center text-[#000] text-base">
                    <tr>
                      {toggle ? (
                        <th className="p-3 font-medium">Product Name</th>
                      ) : (
                        <th className="p-3 font-medium">Addon ID</th>
                      )}
                      <th className="p-3  font-medium">Price</th>
                      {toggle ? (
                        <>
                          <th className="p-3 font-medium">Details</th>
                          <th className="p-3 font-medium">Category</th>
                          <th className="p-3 font-medium">specification</th>
                        </>
                      ) : (
                        <th className="p-3 font-medium">Addon Title</th>
                      )}
                      <th className="p-3 font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody className=" text-sm">
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
                            {toggle ? (
                              <span>{item.title}</span>
                            ) : (
                              <span className="text-wrap">{item.id}</span>
                            )}
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
                              {item.products?.subcategory1 || "N/A"}
                            </td>
                          </>
                        ) : (
                          <td className="border border-gray-200 p-3 align-middle">
                            {item.addons?.title || item.title}
                          </td>
                        )}
                        <td className="border border-gray-200 p-3 align-middle flex justify-center items-center relative">
                          <button
                            ref={(el) => (buttonRef.current[item.id] = el)}
                            className="bg-white flex justify-center items-center py-1.5 w-20 mb-2"
                            onClick={() => handleMenuToggle(item.id)}
                          >
                            <CiMenuKebab size={25} />
                          </button>

                          {openMenuId === item.id && (
                            <div
                              ref={(el) => (menuRef.current[item.id] = el)}
                              className="absolute top-1/2 left-0 transform mt-2 bg-white border border-gray-300 shadow-md rounded-md w-24 z-10"
                            >
                              <button
                                onClick={() => {
                                  handleProductPreview(item);
                                }}
                                className=" flex gap-2 items-center w-full text-left px-3 py-2 hover:bg-gray-200"
                              >
                                <VscEye /> view
                              </button>
                              <button
                                onClick={() => {
                                  handleDelete(item);
                                }}
                                className="flex gap-2 items-center w-full text-left px-3 py-2 hover:bg-gray-200"
                              >
                                <MdOutlineDelete /> Delete
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ) : (
            <>
              <p className="p-5 text-gray-500 text-center">
                No {toggle ? "products" : "addons"} found.
              </p>
            </>
          ))}

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
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) =>
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

        {isAddProduct && (
          <div className="flex flex-col justify-center items-center h-[90%] font-Poppins overflow-y-hidden">
            <div className="border-2 border-gray-200 px-28 py-14 flex justify-center items-center gap-10 rounded-2xl shadow-lg capitalize relative">
              <div
                onClick={() => {
                  setAddNewProduct(true);
                  setIsAddProduct(false);
                }}
                onMouseEnter={() => setIsProductHovered(true)}
                onMouseLeave={() => setIsProductHovered(false)}
                className="flex flex-col justify-center items-center gap-5 p-10 shadow-[0_4px_10px_rgba(180,234,234,50)] font-bold rounded-xl cursor-pointer hover:bg-[#194F48] hover:text-white hover:scale-110 transition-transform duration-200 ease-in-out"
              >
                <img
                  src={
                    isProductHovered
                      ? "images/product-icon-2.png"
                      : "images/product-icon-1.png"
                  }
                  alt=""
                />
                <h2 className="text-lg">product</h2>
              </div>

              <div
                onClick={() => {
                  setAddNewAddon(true);
                  setIsAddProduct(false);
                }}
                onMouseEnter={() => setIsAddonHovered(true)}
                onMouseLeave={() => setIsAddonHovered(false)}
                className="flex flex-col justify-center items-center gap-5 p-10 shadow-[0_4px_10px_rgba(180,234,234,100)] font-bold rounded-xl cursor-pointer hover:bg-[#194F48] hover:text-white hover:scale-110 transition-transform duration-200 ease-in-out"
              >
                <img
                  src={
                    isAddonHovered
                      ? "images/addOn-icon-2.png"
                      : "images/addOn-icon-1.png"
                  }
                  alt=""
                />
                <h2 className="text-lg">add ons</h2>
              </div>

              <div className="absolute top-2 right-2">
                <MdOutlineCancel
                  // onClick={() => setIsAddProduct(false)}
                  onClick={handleAddproductclose}
                  size={25}
                  className="cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}
      </div>
      {/* product preview */}
      {productPreview && (
        <DashboardProductCard
          onClose={() => {
            setProductPreview(false);
          }}
          product={selectedProductview}
          // fetchProducts={fetchProducts}
          handleDelete={handleDelete}
        />
      )}
    </div>
  );
}

export default VendorProductlist;
