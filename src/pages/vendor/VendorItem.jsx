import { useState, useEffect, useRef } from "react";
import { useApp } from "../../Context/Context";
import VendorNewAddon from "./VendorNewAddon";
import VendorNewProduct from "./VendorNewProduct";
import { supabase } from "../../services/supabase";
import toast from "react-hot-toast";
import Spinner from "../../common-components/Spinner";
import { CiMenuKebab } from "react-icons/ci";
import { VscEye } from "react-icons/vsc";
import { MdOutlineDelete } from "react-icons/md";
import { MdOutlineCancel } from "react-icons/md";
import { IoIosAdd } from "react-icons/io";
import DashboardProductCard from "./DashboardProductCard";
import RejectedProduct from "./RejectedProduct";
import VendorProductEdit from "./VendorProductEdit";
import VendorEditAddon from "./VendorEditAddon";
import ItemList from "./ItemList";
import { IoIosSearch } from "react-icons/io";
import { IoCloseCircle, IoCloudDownloadOutline } from "react-icons/io5";
// import { ChevronDownIcon, FunnelIcon } from "@heroicons/react/24/outline";

function VendorItem() {
  const [toggle, setToggle] = useState(true);
  const [selectedTab, setSelectedTab] = useState("products");
  const [isAddProduct, setIsAddProduct] = useState(false);
  // const [isProductHovered, setIsProductHovered] = useState(false);
  // const [isAddonHovered, setIsAddonHovered] = useState(false);

  // state for the dispay in product page
  const [addNewProduct, setAddNewProduct] = useState(false);
  const [addNewAddon, setAddNewAddon] = useState(false);
  // new edit option product
  const [editProduct, setEditProduct] = useState(false);
  const [selectedproduct, setSelectedproduct] = useState(null);

  //new edit option addon
  const [editAddon, setEditAddon] = useState(false);
  const [selectedAddon, setSelectedAddon] = useState(null);

  const [openMenuId, setOpenMenuId] = useState(null); // Store the ID of the row with an open menu
  const [selectedProductview, setSelectedProductview] = useState({
    product_name: "",
    product_price: "",
    product_image: "",
    product_description: "",
  });
  const [productPreview, setProductPreview] = useState(false);

  //delete warning
  const [deleteWarning, setDeleteWarning] = useState(false);
  //product refresh
  const [isproductRefresh, setIsProductRefresh] = useState(false);
  //addon refresh
  const [isaddonRefresh, setIsAddonRefresh] = useState(false);

  // console.log("selected product", selectedProductview);

  const menuRef = useRef({});
  const buttonRef = useRef({});

  // loading
  const [isloading, setIsloading] = useState(false);

  const [productlist, setProductlist] = useState(true);

  const [products, setProducts] = useState([]);
  const [addons, setAddons] = useState([]);
  const [rejectedProductView, setRejectedProductView] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filteredAddons, setFilteredAddons] = useState([]);

  const items = toggle ? filteredProducts : filteredAddons;

  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [mobileFilterOpen, setMobileFilterOPen] = useState(false);
  // const items = Array.from({ length: 55 }, (_, index) => ({
  //   id: index + 1,
  //   name: `Item ${index + 1}`,
  // }));

  // pagination
  const [itemsPerPage, setItemsPerPage] = useState(20); // Default (gets updated dynamically)
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(items.length / itemsPerPage);
  // const totalPages = Math.ceil(items.length / itemsPerPage);
  const tableRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const [lastPageBeforeSearch, setLastPageBeforeSearch] = useState(1);

  // Slice the items for pagination
  const paginatedItems = items.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToPage = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  //for filters status
  // const [selected, setSelected] = useState("");
  // const [isOpen, setIsOpen] = useState(false);

  const tabs = [
    { name: "Products", value: "products" },
    { name: "Add-Ons", value: "addons" },
  ];

  const showtabs = products.length > 0 || addons.length > 0;

  const { accountHolder } = useApp();

  // const items = toggle ? filteredProducts : filteredAddons;

  const baseImageUrl =
    "https://bwxzfwsoxwtzhjbzbdzs.supabase.co/storage/v1/object/public/addon/";

  const handleTabClick = (event) => {
    setProductlist(true);
    setIsAddProduct(false);
    const tab = event.target.value; // Get value from button
    setSelectedTab(tab);
    setToggle(tab === "products"); // Set toggle dynamically
  };

  // Fetch Products from Supabase
  const fetchProducts = async () => {
    setIsloading(true);

    try {
      const { data } = await supabase
        .from("product_variants")
        .select(
          `
            *,
              products (category, subcategory, subcategory1)
            `
        )
        .eq("vendor_id", accountHolder.userId);

      const sortedData = data.sort((a, b) => {
        // Prioritize "pending" status
        if (a.status === "pending" && b.status !== "pending") return -1;
        if (b.status === "pending" && a.status !== "pending") return 1;

        // If both are "pending" or both are not "pending", sort by date
        return new Date(b.created_at) - new Date(a.created_at);
      });
      setProducts(sortedData);
      setFilteredProducts(sortedData);
      // setProducts(data);

      // console.log(data);
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
      .eq("vendorId", accountHolder.userId);
    // console.log(data);

    if (error) {
      console.log("Error fetching addons:", error);
    } else {
      const sortedData = data.sort((a, b) => {
        // Prioritize "pending" status
        if (a.status === "pending" && b.status !== "pending") return -1;
        if (b.status === "pending" && a.status !== "pending") return 1;

        // If both are "pending" or both are not "pending", sort by date
        return new Date(b.created_at) - new Date(a.created_at);
      });
      setAddons(sortedData);
      setFilteredAddons(sortedData);
      // setAddons(data);
      // console.log("Addons: ", data);
    }
  };

  const filterItems = (query) => {
    // console.log(query);

    if (toggle) {
      if (!query) {
        setFilteredProducts(products); // Reset to original list when input is empty
        return;
      }
      const filtered = products.filter((item) =>
        item.title.toLowerCase().includes(query.toLowerCase())
      );
      // console.log(filtered);
      setFilteredProducts(filtered);
    } else {
      if (!query) {
        setFilteredAddons(addons); // Reset to original list when input is empty
        return;
      }
      const filtered = addons.filter((item) =>
        item.title.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredAddons(filtered);
      // console.log(filtered);
    }
  };

  useEffect(() => {
    console.log("Fetching products...");
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isproductRefresh]);

  useEffect(() => {
    console.log("Fetching addons...");
    fetchAddons();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isaddonRefresh]);

  const handlenewproduct = () => {
    setProductlist(false);
    setIsAddProduct(true);
  };

  const handleAddproductclose = () => {
    setProductlist(true);
    setIsAddProduct(false);
  };

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
    // console.log("in function handleProductPreview", product);

    setProductPreview(true);
    setSelectedProductview(product);
  };

  const handleDeleteClick = (item) => {
    setDeleteWarning(true);
    setSelectedProductview(item);
  };

  const handleDelete = async (selectedProductview) => {
    try {
      if (selectedProductview && selectedProductview.type === "product") {
        await supabase
          .from("product_variants") // Ensure this matches your table name
          .delete()
          .eq("id", selectedProductview.id);

        toast.success("Product deleted successfully!");
        setIsProductRefresh((prev) => !prev);
      }

      if (selectedProductview.type === "addon") {
        await supabase
          .from("addon_variants") // Ensure this matches your table name
          .delete()
          .eq("id", selectedProductview.id);
        toast.success("Addon deleted successfully!");
        setIsAddonRefresh((prev) => !prev);
      }

      let imagePaths = [];

      if (selectedProductview.image) {
        imagePaths.push(selectedProductview.image);
      }
      if (selectedProductview.additional_images) {
        try {
          const parsedAdditionalImages = JSON.parse(
            selectedProductview.additional_images
          );
          if (Array.isArray(parsedAdditionalImages)) {
            imagePaths = imagePaths.concat(parsedAdditionalImages);
          }
        } catch (parseError) {
          console.log("error parsing error", parseError);
        }
      }

      if (imagePaths.length > 0) {
        const { storageError } = await supabase.storage
          .from("addon")
          .remove(imagePaths);

        if (storageError) throw storageError;
      }

      setProductPreview(false); // Close the modal after deletion
    } catch (error) {
      console.log(error);
    } finally {
      selectedProductview.type === "product"
        ? setIsProductRefresh(true)
        : setIsAddonRefresh(true);
    }
    setDeleteWarning(false);
  };

  return (
    <>
      <div className="overflow-y-auto scrollbar-hide h-[calc(100vh-100px)] rounded-3xl relative ">
        {addNewProduct ? (
          <VendorNewProduct
            setAddNewProduct={setAddNewProduct}
            setProductlist={setProductlist}
            setIsProductRefresh={setIsProductRefresh}
          />
        ) : addNewAddon ? (
          <VendorNewAddon
            setAddNewProduct={setAddNewAddon}
            setIsAddonRefresh={setIsAddonRefresh}
            setProductlist={setProductlist}
          />
        ) : editProduct ? (
          <VendorProductEdit
            setEditProduct={setEditProduct}
            setProductlist={setProductlist}
            setIsProductRefresh={setIsProductRefresh}
            selectedproduct={selectedproduct}
          />
        ) : editAddon ? (
          <VendorEditAddon
            seteditAddon={setEditAddon}
            selectedAddon={selectedAddon}
            setProductlist={setProductlist}
            setIsAddonRefresh={setIsAddonRefresh}
          />
        ) : (
          // Default product list and add product UI
          <>
            <div className=" sticky top-0 z-20 bg-white">
              <div className="flex justify-between items-center px-4 py-2 border-b-2 border-b-gray-400 ">
                <h3 className="capitalize font-semibold text-xl ">
                  product list
                </h3>

                {/* <div className="w-1/2">
                  <input
                    type="text"
                    className="w-full rounded-lg px-2 py-1 outline-none border-2 border-gray-400"
                    placeholder="......search by product name"
                    onChange={(e) => filterItems(e.target.value)}
                  />
                </div> */}

                {/* <div className="relative inline-block text-left">
             
                  <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-md hover:bg-gray-200"
                  >
                    <FunnelIcon className="h-5 w-5 text-gray-600" />
                    <span className="text-sm text-gray-700">Filter</span>
                    <ChevronDownIcon className="h-4 w-4 text-gray-500" />
                  </button>

  
                  {isOpen && (
                    <div className="absolute mt-2 w-40 bg-white border rounded-md shadow-lg z-10">
                      <select
                        value={selected}
                        onChange={handleSelect}
                        className="w-full border-none focus:ring-0 p-2 text-sm"
                      >
                        <option value="">All</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>
                  )}
                </div> */}

                <button
                  onClick={handlenewproduct}
                  className="capitalize bg-[#374A75] text-white shadow-sm py-2 px-4 text-sm flex justify-center items-center border-2"
                >
                  <IoIosAdd size={20} />
                  add product
                </button>
              </div>
              <div
                className={`relative flex justify-between items-center gap-3 px-2 md:px-4 py-2 border-b-2 border-b-gray-400 ${
                  !showtabs && "hidden"
                }`}
              >
                <div className="flex gap-3 items-center">
                  {showtabs &&
                    tabs.map((tab) => (
                      <button
                        key={tab.value}
                        className={`flex items-center text-[#374A75] text-xs lg:text-base text-nowrap gap-2 px-6 py-2 border border-[#374A75]  rounded-lg ${
                          selectedTab === tab.value
                            ? "bg-[#D3E3F0] "
                            : "bg-white "
                        }`}
                        value={tab.value}
                        onClick={handleTabClick}
                      >
                        {tab.name}
                      </button>
                    ))}
                </div>

                <div className="lg:hidden">
                  <button
                    onClick={() => setMobileSearchOpen(true)}
                    className="py-1.5 px-2 flex justify-center items-center border rounded"
                  >
                    <IoIosSearch size={20} color="#374A75" />
                  </button>
                  {mobileSearchOpen && (
                    <div
                      className={`absolute top-0 bg-[#fff] w-full h-full z-30 flex justify-between items-center px-3 !transition-all !duration-700 !ease-in-out ${
                        mobileSearchOpen
                          ? "opacity-100 translate-x-0 left-0"
                          : "opacity-0 -translate-x-full right-0"
                      }`}
                    >
                      <input
                        type="text"
                        // value={searchQuery}
                        placeholder="......search by product name"
                        onChange={(e) => filterItems(e.target.value)}
                        className="w-3/4 px-2 py-2.5 border rounded-sm text-[10px]"
                      />
                      <button onClick={() => setMobileSearchOpen(false)}>
                        <IoCloseCircle size={25} color="#374A75" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="hidden lg:block w-3/2 ml-auto">
                  <input
                    type="text"
                    // value={searchQuery}
                    className="w-full rounded-lg px-2 py-1 outline-none border-2 border-gray-400"
                    placeholder="....search"
                    onChange={(e) => filterItems(e.target.value)}
                  />
                </div>

                {/* <div className="w-3/2">
                  <input
                    type="text"
                    className="w-full rounded-lg px-2 py-1 outline-none border-2 text-xs lg:text-base border-gray-400"
                    placeholder="......search"
                    onChange={(e) => filterItems(e.target.value)}
                  />
                </div> */}
              </div>
            </div>

            {/*  */}

            {productlist &&
              (isloading ? (
                <Spinner />
              ) : // ) : (toggle ? products : addons).length > 0 ? (
              items.length > 0 ? (
                <>
                  <section className=" h-[90%] font-Poppins overflow-hidden">
                    <ItemList
                      handleProductPreview={handleProductPreview}
                      items={items}
                    />
                  </section>
                  {/* <section className=" h-[90%] font-Poppins overflow-hidden">
                    <ItemList />
                  </section> */}
                  {/* <section className=" h-[90%] font-Poppins overflow-hidden">
                    <div
                      ref={scrollContainerRef}
                      className="w-full h-full border-t border-b border-[#CCCCCC] overflow-y-auto custom-scrollbar"
                    >
                      <table className="min-w-full border-collapse">
                        <thead className="bg-[#FFFFFF] sticky top-0 z-10 px-8 text-center text-[#000] text-base">
                          <tr>
                            {toggle ? (
                              <th className="p-3 font-medium">Product Name</th>
                            ) : (
                              <th className="p-3 font-medium">Addon Name</th>
                            )}
  
                            <th className="p-3  font-medium">Price</th>
                            {toggle && (
                              <>
                                <th className="p-3 font-medium">Details</th>
                            
                              </>
                            )}
                            <th className="p-3 font-medium">status</th>
                            <th className="p-3 font-medium">Action</th>
                          </tr>
                        </thead>
                        <tbody className=" text-sm">
                        
                          {items.map((item) => (
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
                              {toggle && (
                                <>
                                  <td className="border border-gray-200 p-3 align-middle">
                                    {item.details}
                                  </td>
                                
                                </>
                              )}
                              <td
                                onClick={() => {
                                  if (item.status === "rejected") {
                                    setRejectedProductView(true);
                                    setSelectedProductview(item);
                                  }
                                }}
                                className={`border border-gray-200 p-3 align-middle ${
                                  item.status === "pending" && "text-[#13B2E4]"
                                } ${
                                  item.status === "approved" && "text-green-600"
                                } ${
                                  item.status === "rejected" && "text-red-500"
                                }`}
                              >
                                {item.status}
                              </td>
  
                              <td className="border border-gray-200 p-3 align-middle flex justify-center items-center relative">
                                <button
                                  className="bg-white flex justify-center items-center py-1.5 w-20 mb-2"
                                  ref={(el) => (buttonRef.current[item.id] = el)}
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
                                    {toggle ? (
                                      <button
                                        onClick={() => {
                                          setSelectedproduct(item);
                                          setEditProduct(true);
                                        }}
                                        className=" flex gap-2 items-center w-full text-left px-3 py-2 hover:bg-gray-200"
                                      >
                                        <VscEye /> Edit
                                      </button>
                                    ) : (
                                      <button
                                        onClick={() => {
                                          setSelectedAddon(item);
                                          setEditAddon(true);
                                        }}
                                        
                                        className=" flex gap-2 items-center w-full text-left px-3 py-2 hover:bg-gray-200"
                                      >
                                        <VscEye /> Edit
                                      </button>
                                    )}
                                    <button
                                      onClick={() => {
                                        handleDeleteClick(item);
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
                  </section> */}
                  {/* {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2  z-30 sticky bottom-0  bg-white  text-[#3d194f]">
                      <button
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-1 border rounded disabled:opacity-50 text-[#3d194f]"
                      >
                        Previous
                      </button>

                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) =>
                          page === 1 ||
                          page === totalPages ||
                          (page >= currentPage - 1 &&
                            page <= currentPage + 1) ? (
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
                          ) : page === currentPage + 2 ||
                            page === currentPage - 2 ? (
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
                  )} */}
                </>
              ) : (
                <>
                  <p className="p-5 text-gray-500 text-center">
                    No {toggle ? "products" : "addons"} found.
                  </p>
                </>
              ))}

            {isAddProduct && (
              <div className="flex flex-col md:justify-center md:items-center h-[80%] font-Poppins overflow-auto ">
                <AddItem
                  handleAddproductclose={handleAddproductclose}
                  setAddNewAddon={setAddNewAddon}
                  setAddNewProduct={setAddNewProduct}
                  setIsAddProduct={setIsAddProduct}
                />
              </div>
            )}
          </>
        )}
      </div>
      {productPreview && (
        <div>
          <DashboardProductCard
            onClose={() => {
              setProductPreview(false);
            }}
            product={selectedProductview}
            handleDelete={handleDelete}
            // updateStatus={handleUpdateStatus}
            deleteWarning={deleteWarning}
            setDeleteWarning={setDeleteWarning}
          />
        </div>
      )}

      {deleteWarning && (
        <div className="flex justify-center items-center h-screen fixed inset-0 z-30 top-0 w-screen">
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="bg-white relative py-7 px-20">
            <div className="flex justify-center items-center">
              <img
                src="images/icons/delete-icon.png"
                alt=""
                className="h-12 w-12"
              />
            </div>

            <h4 className="font-semibold my-5">
              Do you want to delete {selectedProductview.title}?
            </h4>
            <div className="flex justify-between">
              <button
                onClick={() => {
                  setDeleteWarning(false);
                }}
                className="px-5 py-2 bg-[#EEEEEE] rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(selectedProductview)}
                className="px-5 py-2 bg-[#B4EAEA] rounded-md"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {rejectedProductView && (
        <RejectedProduct
          onClose={() => setRejectedProductView(false)}
          product={selectedProductview}
        />
      )}
    </>
  );
}

export default VendorItem;

function AddItem({
  setAddNewProduct,
  setIsAddProduct,
  setAddNewAddon,
  handleAddproductclose,
}) {
  return (
    <div className="p-2 border-2 border-gray-200 md:px-28 md:py-14 flex flex-col  md:flex-row justify-center items-center gap-4 md:gap-10 rounded-2xl shadow-lg capitalize relative">
      <Item
        setAddNewitem={setAddNewProduct}
        setIsAddProduct={setIsAddProduct}
        title={"product"}
        img1={"images/pantry-white.png"}
        img2={"images/pantry-blue.png"}
      />
      <Item
        setAddNewitem={setAddNewAddon}
        setIsAddProduct={setIsAddProduct}
        title={"Addon"}
        img1={"images/chair-white.png"}
        img2={"images/chair-blue.png"}
      />

      <div className="absolute top-2 right-2">
        <MdOutlineCancel
          onClick={handleAddproductclose}
          size={25}
          className="cursor-pointer"
        />
      </div>
    </div>
  );
}

function Item({ setIsAddProduct, setAddNewitem, title, img1, img2 }) {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div
      onClick={() => {
        setAddNewitem(true);
        setIsAddProduct(false);
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="flex flex-col border border-[#ccc] justify-center items-center gap-5 p-10 shadow-lg font-bold rounded-xl cursor-pointer hover:bg-[#374A75] hover:text-white hover:scale-110 transition-transform duration-200 ease-in-out"
      // className="flex flex-col justify-center items-center gap-5 p-10 shadow-[0_4px_10px_rgba(180,234,234,50)] font-bold rounded-xl cursor-pointer hover:bg-[#374A75] hover:text-white hover:scale-110 transition-transform duration-200 ease-in-out"
    >
      <img src={isHovered ? img1 : img2} alt="item" className="w-28" />
      <h2 className="text-lg">{title}</h2>
    </div>
  );
}
