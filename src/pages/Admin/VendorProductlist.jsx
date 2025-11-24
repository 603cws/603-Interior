import { useState, useRef, useEffect } from "react";
import { VscEye } from "react-icons/vsc";
import { MdOutlineCancel } from "react-icons/md";
import { CiMenuKebab } from "react-icons/ci";
import Spinner from "../../common-components/Spinner";
import { supabase } from "../../services/supabase";
import toast from "react-hot-toast";
// import DashboardProductCard from "../vendor/DashboardProductCard";
import VendorProductCard from "../vendor/VendorProductCard";
import { IoIosArrowBack } from "react-icons/io";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import VendorProductEdit from "../vendor/VendorProductEdit";
import VendorEditAddon from "../vendor/VendorEditAddon";
import { IoCloseCircle } from "react-icons/io5";
import { IoIosSearch } from "react-icons/io";
import MobileTabProductCard from "../user/MobileTabProductCard";
import { baseImageUrl } from "../../utils/HelperConstant";
import PagInationNav from "../../common-components/PagInationNav";

function VendorProductlist({
  setVendorproductlist,
  selectedVendor,
  // updateStatus,
  deleteWarning,
  setDeleteWarning,
  rejectReason,
  setRejectReason,
  // handleConfirmReject,
}) {
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
  const [selectedProductview, setSelectedProductview] = useState();
  const [isAddProduct, setIsAddProduct] = useState(false);
  const [isProductHovered, setIsProductHovered] = useState(false);
  const [isAddonHovered, setIsAddonHovered] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [products, setProducts] = useState([]);
  const [addons, setAddons] = useState([]);
  const menuRef = useRef({});
  const buttonRef = useRef({});

  // const tableRef = useRef(null);
  const scrollContainerRef = useRef(null);
  // const [itemsPerPage, setItemsPerPage] = useState(10); // Default (gets updated dynamically)
  // const [currentPage, setCurrentPage] = useState(1);
  const [lastPageBeforeSearch, setLastPageBeforeSearch] = useState(1);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // to store the latest search input

  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filteredAddons, setFilteredAddons] = useState([]);

  //product refresh
  const [isproductRefresh, setIsProductRefresh] = useState(false);

  //addon refresh
  const [isaddonRefresh, setIsAddonRefresh] = useState(false);

  // new edit option product
  const [editProduct, setEditProduct] = useState(false);
  const [selectedproduct, setSelectedproduct] = useState(null);

  //new edit option addon
  const [editAddon, setEditAddon] = useState(false);
  const [selectedAddon, setSelectedAddon] = useState(null);

  const vendorcategory = JSON.parse(selectedVendor.allowed_category);

  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("");
  const [filterDropdown, setFilterDropdown] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const handleSelect = (e) => {
    setSelected(e.target.value);

    if (e.target.value !== "") {
      const filtered = products.filter(
        (item) => item.status.toLowerCase() === e.target.value.toLowerCase()
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }

    setIsOpen(false); // close dropdown after selection (optional)
  };

  //baseurlforimg
  // const baseImageUrl =
  //   "https://bwxzfwsoxwtzhjbzbdzs.supabase.co/storage/v1/object/public/addon/";

  const handleMenuToggle = (id) => {
    setOpenMenuId((prev) => (prev === id ? null : id));
  };

  const handleUpdateStatus = async (product, newStatus, reason = "") => {
    console.log("product", product);

    try {
      if (product && product.type === "product") {
        await supabase
          .from("product_variants") // Table name
          .update({
            status: newStatus,
            // ...(newStatus === "rejected" && { reject_reason: reason }),
            reject_reason: reason,
          })
          .eq("id", product.id); // Matching row
        toast.success(`product ${newStatus}`);
        // setRejectReasonPopup(false);
        // setProductPreview(false);
        setRejectReason("");
      }

      if (product.type === "addon") {
        await supabase
          .from("addon_variants") // Ensure this matches your table name
          .update({ status: newStatus }) // New status
          .eq("id", product.id); // Matching row
        toast.success(`Addon ${newStatus}`);
      }
    } finally {
      product.type === "product"
        ? setIsProductRefresh(true)
        : setIsAddonRefresh(true);

      if (productPreview) {
        setProductPreview(false);
      }
    }
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

  // const filteredProducts =
  //   selectedCategory === ""
  //     ? products
  //     : products.filter(
  //         (product) => product.products?.category === selectedCategory
  //       );

  const items = toggle ? filteredProducts : filteredAddons;
  // const items = toggle ? filteredProducts : addons;
  const totalPages = Math.ceil(items.length / itemsPerPage);

  const normalize = (str) => str.replace(/\s+/g, " ").trim().toLowerCase();

  const resetFilterstatuAfterSearch = () => {
    if (selected !== "") {
      const filtered = products.filter(
        (item) => item.status.toLowerCase() === selected.toLowerCase()
      );
      setFilteredProducts(filtered);
    } else {
      // const filtered = products.filter((item) =>
      //   normalize(item.title).includes(normalize(query))
      // );
      setFilteredProducts(products);
    }
  };

  const filterItems = (query) => {
    // console.log(query);
    setSearchQuery(query);
    console.log(query);
    console.log("products", products);

    if (toggle) {
      if (!query && !selectedCategory) {
        setFilteredProducts(products); // Reset to original list when input is empty
        resetFilterstatuAfterSearch();
        if (isSearching) {
          setCurrentPage(lastPageBeforeSearch); // restore last page
          setIsSearching(false); // reset
        }
        return;
      }

      if (!query && selectedCategory) {
        filterbyCategory(selectedCategory);
        if (isSearching) {
          setCurrentPage(lastPageBeforeSearch);
          setIsSearching(false);
        }
        return;
      }
      // If entering a search query
      if (!isSearching) {
        setLastPageBeforeSearch(currentPage); // store page before search
        setIsSearching(true);
      }
      setCurrentPage(1);

      // const filtered = products.filter((item) =>
      //   item.title.toLowerCase().includes(query.toLowerCase())
      // );
      if (selected !== "") {
        const filtered = filteredProducts.filter(
          (item) =>
            item.status.toLowerCase() === selected.toLowerCase() &&
            normalize(item.title).includes(normalize(query))
        );
        setFilteredProducts(filtered);
      } else {
        const filtered = products.filter((item) =>
          normalize(item.title).includes(normalize(query))
        );
        setFilteredProducts(filtered);
      }

      // const filtered = products.filter((item) =>
      //   normalize(item.title).includes(normalize(query))
      // );
      // setFilteredProducts(filtered);
      // console.log("filtered", filtered);
    } else {
      if (!query) {
        setFilteredAddons(addons); // Reset to original list when input is empty
        if (isSearching) {
          setCurrentPage(lastPageBeforeSearch);
          setIsSearching(false);
        }
        return;
      }
      if (!isSearching) {
        setLastPageBeforeSearch(currentPage);
        setIsSearching(true);
      }
      setCurrentPage(1);

      // const filtered = addons.filter((item) =>
      //   item.title.toLowerCase().includes(query.toLowerCase())
      // );
      if (selected !== "") {
        const filtered = filteredAddons.filter(
          (item) =>
            item.status.toLowerCase() === selected.toLowerCase() &&
            normalize(item.title).includes(normalize(query))
        );
        setFilteredAddons(filtered);
      } else {
        const filtered = addons.filter((item) =>
          normalize(item.title).includes(normalize(query))
        );
        setFilteredAddons(filtered);
      }

      // console.log("filtered", filtered);
      // const filtered = products.filter((item) =>
      //   normalize(item.title).includes(normalize(query))
      // );
      // // console.log(filtered);

      // setFilteredAddons(filtered);
    }
  };

  const filterbyCategory = (category) => {
    // console.log(category);
    setSelectedCategory(category);

    if (toggle) {
      if (!category) {
        setFilteredProducts(products); // Reset to original list when input is empty
        return;
      }
      const filtered = products.filter(
        (item) =>
          item.products.category.toLowerCase() === category.toLowerCase()
      );
      // console.log(filtered);

      setFilteredProducts(filtered);
    } else {
      if (!category) {
        setFilteredAddons(addons); // Reset to original list when input is empty
        return;
      }
      const filtered = addons.filter((item) =>
        item.title.toLowerCase().includes(category.toLowerCase())
      );
      // console.log(filtered);

      setFilteredAddons(filtered);
    }
    setCurrentPage(1);
  };

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

      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  const handleDelete = async (product) => {
    console.log("product of vendor ", product);

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
             *, 
              products (category, subcategory, subcategory1)
            `
        )
        .eq("vendor_id", selectedVendor.id);

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
    } catch (error) {
      console.log("Error fetching products:", error);
    } finally {
      setIsloading(false);
    }
  };

  const fetchAddons = async () => {
    try {
      const { data, error } = await supabase
        .from("addon_variants")
        .select("*")
        .eq("vendorId", selectedVendor.id);

      // if (error) {
      //   console.log("Error fetching addons:", error);
      // } else {
      //   setAddons(data);
      // }
      const sortedData = data.sort((a, b) => {
        // Prioritize "pending" status
        if (a.status === "pending" && b.status !== "pending") return -1;
        if (b.status === "pending" && a.status !== "pending") return 1;

        // If both are "pending" or both are not "pending", sort by date
        return new Date(b.created_at) - new Date(a.created_at);
      });

      if (error) {
        console.log("Error fetching addons:", error);
      } else {
        setAddons(sortedData);
        setFilteredAddons(sortedData);
      }
    } finally {
      setIsAddonRefresh(false);
    }
  };

  // useEffect(() => {
  //   fetchProducts();
  //   fetchAddons();
  // }, []);

  useEffect(() => {
    fetchProducts();
  }, [isproductRefresh]);

  useEffect(() => {
    fetchAddons();
  }, [isaddonRefresh]);
  return (
    <div className="flex flex-col h-full min-h-0 loverflow-hidden lg:border-2 border-[#334A78] rounded-lg bg-[#fff]">
      <div className="overflow-y-auto scrollbar-hide h-[calc(100vh-80px)] relative ">
        {editProduct ? (
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
          <>
            <div className="sticky top-0 z-20 bg-white">
              <div className="hidden lg:flex justify-between items-center px-4 py-2 border-b-2 border-b-gray-400 ">
                <button
                  //   onClick={setVendorproductlist(false)}
                  onClick={() => setVendorproductlist(false)}
                  className="capitalize font-semibold flex items-center text-xs text-[#A1A1A1] "
                >
                  <IoIosArrowBack /> Back to vendor list
                </button>

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
                </div>

                {toggle && (
                  <div>
                    <select
                      name="category"
                      value={selectedCategory}
                      onChange={(e) => filterbyCategory(e.target.value)}
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
                )} */}

                <div className="relative inline-block">
                  {/* Filter Button */}
                  <button
                    onClick={() => setFilterDropdown(!filterDropdown)}
                    className="px-4 py-2 rounded text-[#374A75] text-sm flex items-center gap-3 border"
                  >
                    <img
                      src="/images/icons/filter-icon.png"
                      alt="filter icon"
                    />
                    <span className="text-sm">Filter</span>
                    <ChevronDownIcon className="h-4 w-4 text-gray-500" />
                  </button>

                  {/* Dropdown */}
                  {filterDropdown && (
                    <div className="absolute mt-2 w-48 -left-1/2 bg-white border rounded-md shadow-lg z-10 p-3 space-y-3">
                      {/* Status Filter */}
                      <div>
                        <label className="text-xs font-semibold text-gray-500">
                          Status
                        </label>
                        <select
                          value={selected}
                          onChange={handleSelect}
                          className="w-full border rounded p-1 text-sm mt-1 focus:ring-1 focus:ring-blue-400"
                        >
                          <option value="">All</option>
                          <option value="pending">Pending</option>
                          <option value="approved">Approved</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </div>

                      {/* Category Filter */}
                      <div>
                        <label className="text-xs font-semibold text-gray-500">
                          Category
                        </label>
                        <select
                          name="category"
                          value={selectedCategory}
                          onChange={(e) => filterbyCategory(e.target.value)}
                          className="w-full border rounded p-1 text-sm mt-1 focus:ring-1 focus:ring-blue-400"
                        >
                          <option value="">All categories</option>
                          {vendorcategory.map((category) => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex justify-between gap-3 px-4 py-2 border-b-2 border-b-gray-400">
                <div className="flex gap-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.value}
                      className={`flex items-center gap-2 px-2 text-sm md:text-base md:px-6 py-1 md:py-2 border border-[#374A75] rounded text-[#374A75] ${
                        selectedTab === tab.value
                          ? "bg-[#D3E3F0] "
                          : "bg-white "
                      }`}
                      value={tab.value}
                      onClick={handleTabClick} // Dynamically sets the tab
                    >
                      {tab.name}
                    </button>
                  ))}
                </div>
                <div className="hidden lg:block w-1/4">
                  <input
                    type="text"
                    value={searchQuery}
                    className="w-full rounded-md px-2 py-2 outline-none border-2 border-gray-400"
                    placeholder="......search by product name"
                    onChange={(e) => filterItems(e.target.value)}
                  />
                </div>
                <div className="lg:hidden flex gap-2">
                  <div className="relative inline-block text-left">
                    {/* Filter Button */}
                    <button
                      onClick={() => setFilterDropdown(!filterDropdown)}
                      className="h-10 w-10 flex justify-center items-center border rounded"
                    >
                      <img
                        src="/images/icons/filter-icon.png"
                        alt="filter icon"
                      />
                    </button>

                    {/* Dropdown */}
                    {filterDropdown && (
                      <div className="absolute mt-2 w-32 -left-full bg-white border rounded-md shadow-lg z-10">
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
                  </div>

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
                          onChange={(e) => filterItems(e.target.value)}
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
                </div>
              </div>
            </div>

            {/*  */}
            {productlist &&
              (isloading ? (
                <Spinner />
              ) : items.length > 0 ? (
                <>
                  <section className="hidden lg:block h-[72%] font-Poppins overflow-hidden relative">
                    <div
                      className="w-full h-full border-t border-b border-[#CCCCCC] overflow-y-auto custom-scrollbar"
                      ref={scrollContainerRef}
                    >
                      <table
                        className="min-w-full border-collapse relative"
                        ref={tableRef}
                      >
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
                                <th className="p-3 font-medium">
                                  specification
                                </th>
                              </>
                            ) : (
                              <th className="p-3 font-medium">Addon Title</th>
                            )}
                            <th className="p-3 font-medium">status</th>
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
                              <td
                                className={`border border-gray-200 p-3 align-middle ${
                                  item.status === "pending"
                                    ? "text-yellow-700"
                                    : ""
                                }  ${
                                  item.status === "approved"
                                    ? "text-green-700"
                                    : ""
                                } ${
                                  item.status === "rejected"
                                    ? "text-red-700"
                                    : ""
                                }`}
                              >
                                {item.status}
                              </td>
                              <td className="border border-gray-200 p-3 align-middle flex justify-center items-center relative">
                                <button
                                  ref={(el) =>
                                    (buttonRef.current[item.id] = el)
                                  }
                                  className="bg-white flex justify-center items-center py-1.5 w-20 mb-2"
                                  onClick={() => handleMenuToggle(item.id)}
                                >
                                  <CiMenuKebab size={25} />
                                </button>

                                {openMenuId === item.id && (
                                  <div
                                    ref={(el) =>
                                      (menuRef.current[item.id] = el)
                                    }
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
                                        <VscEye />
                                        Edit
                                      </button>
                                    ) : (
                                      <button
                                        onClick={() => {
                                          setSelectedAddon(item);
                                          setEditAddon(true);
                                        }}
                                        className=" flex gap-2 items-center w-full text-left px-3 py-2 hover:bg-gray-200"
                                      >
                                        <VscEye />
                                        Edit
                                      </button>
                                    )}
                                    {/* <button
                                  onClick={() => {
                                    handleDelete(item);
                                  }}
                                  className="flex gap-2 items-center w-full text-left px-3 py-2 hover:bg-gray-200"
                                >
                                  <MdOutlineDelete /> Delete
                                </button> */}
                                  </div>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </section>
                  <section className="lg:hidden mb-5">
                    {paginatedItems.map((item) => (
                      <MobileTabProductCard
                        key={item?.id}
                        product={item}
                        handleProductPreview={handleProductPreview}
                      />
                    ))}
                  </section>
                </>
              ) : (
                <>
                  <p className="p-5 text-gray-500 text-center">
                    No {toggle ? "products" : "addons"} found.
                  </p>
                </>
              ))}

            {/* Pagination Controls (Always Visible) */}
            <div className="z-30 sticky bottom-[-2px] bg-white py-0 text-[#3d194f]">
              <PagInationNav
                totalPages={totalPages}
                handlePageChange={goToPage}
                currentPage={currentPage}
              />
            </div>

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
                      alt="product icon"
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
                      alt="add ons icon"
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
          </>
        )}
      </div>
      {/* product preview */}
      {productPreview && (
        <VendorProductCard
          onClose={() => {
            setProductPreview(false);
          }}
          product={selectedProductview}
          // fetchProducts={fetchProducts}
          handleDelete={handleDelete}
          updateStatus={handleUpdateStatus}
          rejectReason={rejectReason}
          setRejectReason={setRejectReason}
          handleConfirmReject={handleUpdateStatus}
        />
      )}
      {/* {productPreview && (
        <VendorProductCard
          onClose={() => {
            setProductPreview(false);
          }}
          product={selectedProductview}
          // fetchProducts={fetchProducts}
          handleDelete={handleDelete}
          updateStatus={handleUpdateStatus}
          deleteWarning={deleteWarning}
          setDeleteWarning={setDeleteWarning}
          rejectReason={rejectReason}
          setRejectReason={setRejectReason}
          handleConfirmReject={handleUpdateStatus}
        />
      )} */}
    </div>
  );
}

export default VendorProductlist;
