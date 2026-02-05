import { useState, useRef, useEffect } from "react";
import { VscEye } from "react-icons/vsc";
import { MdOutlineCancel } from "react-icons/md";
import { CiMenuKebab } from "react-icons/ci";
import Spinner from "../../common-components/Spinner";
import { supabase } from "../../services/supabase";
import toast from "react-hot-toast";
import VendorProductCard from "./VendorProductCard";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import VendorProductEdit from "../vendor/VendorProductEdit";
import VendorEditAddon from "../vendor/VendorEditAddon";
import { IoCloseCircle } from "react-icons/io5";
import { IoIosSearch } from "react-icons/io";
import MobileTabProductCard from "../user/MobileTabProductCard";
import { baseImageUrl } from "../../utils/HelperConstant";
import PagInationNav from "../../common-components/PagInationNav";
import SelectSubcategories from "./SelectSubcategories";
import MultipleDeleteWarningCard from "../components/MultipleDeleteWarningCard";
import BackButton from "../../common-components/BackButton";

function VendorProductlist({ setVendorproductlist, selectedVendor }) {
  const [toggle, setToggle] = useState(true);
  const [isloading, setIsloading] = useState(false);
  const [selectedTab, setSelectedTab] = useState("products");
  const [productlist, setProductlist] = useState(true);
  const [rejectReason, setRejectReason] = useState();
  const tableRef = useRef(null);
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
  const scrollContainerRef = useRef(null);
  const [lastPageBeforeSearch, setLastPageBeforeSearch] = useState(1);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filteredAddons, setFilteredAddons] = useState([]);
  const [isproductRefresh, setIsProductRefresh] = useState(false);
  const [isaddonRefresh, setIsAddonRefresh] = useState(false);
  const [editProduct, setEditProduct] = useState(false);
  const [selectedproduct, setSelectedproduct] = useState(null);
  const [editAddon, setEditAddon] = useState(false);
  const [selectedAddon, setSelectedAddon] = useState(null);
  const vendorcategory = JSON.parse(selectedVendor.allowed_category);
  const [selected, setSelected] = useState("");
  const [filterDropdown, setFilterDropdown] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [selectedItemForDelete, setSelectedItemForDelete] = useState([]);
  const [multipleDeleteWaring, setMultipleDeleteWaring] = useState(false);
  const [selectSubcategories, setSelectSubcategories] = useState(false);
  const [selectedItem, setSelectedItem] = useState([]);

  const handleSelect = (e) => {
    setSelected(e.target.value);

    if (e.target.value !== "") {
      const filtered = products.filter(
        (item) => item.status.toLowerCase() === e.target.value.toLowerCase(),
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  };

  const itemsPerPage = 10;

  const handleMenuToggle = (id) => {
    setOpenMenuId((prev) => (prev === id ? null : id));
  };

  const handleUpdateStatus = async (product, newStatus, reason = "") => {
    try {
      if (product && product.type === "product") {
        if (newStatus !== "approved") {
          await supabase
            .from("product_variants")
            .update({
              status: newStatus,
              reject_reason: reason,
              defaultSubCat: null,
              default: null,
            })
            .eq("id", product.id);
        } else {
          await supabase
            .from("product_variants")
            .update({
              status: newStatus,
              reject_reason: reason,
            })
            .eq("id", product.id);
        }
        toast.success(`product ${newStatus}`);
        setRejectReason("");
      }

      if (product.type === "addon") {
        await supabase
          .from("addon_variants")
          .update({ status: newStatus })
          .eq("id", product.id);
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

  const dropdownRef = useRef(null);

  useEffect(() => {
    if (!filterDropdown) return;

    const onDocClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setFilterDropdown(false);
      }
    };

    const onKey = (e) => {
      if (e.key === "Escape") setFilterDropdown(false);
    };

    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("touchstart", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("touchstart", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [filterDropdown]);

  useEffect(() => {
    const handleClickOutside = (event) => {
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
    const tab = event.target.value;
    setSelectedTab(tab);
    setToggle(tab === "products");
  };

  const items = toggle ? filteredProducts : filteredAddons;
  const totalPages = Math.ceil(items.length / itemsPerPage);

  const normalize = (str) => str.replace(/\s+/g, " ").trim().toLowerCase();

  const resetFilterstatuAfterSearch = () => {
    if (selected !== "") {
      const filtered = products.filter(
        (item) => item.status.toLowerCase() === selected.toLowerCase(),
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  };

  const filterItems = (query) => {
    setSearchQuery(query);

    if (toggle) {
      if (!query && !selectedCategory) {
        setFilteredProducts(products);
        resetFilterstatuAfterSearch();
        if (isSearching) {
          setCurrentPage(lastPageBeforeSearch);
          setIsSearching(false);
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
      if (!isSearching) {
        setLastPageBeforeSearch(currentPage);
        setIsSearching(true);
      }
      setCurrentPage(1);
      if (selected !== "") {
        const filtered = filteredProducts.filter(
          (item) =>
            item.status.toLowerCase() === selected.toLowerCase() &&
            normalize(item.title).includes(normalize(query)),
        );
        setFilteredProducts(filtered);
      } else {
        const filtered = products.filter((item) =>
          normalize(item.title).includes(normalize(query)),
        );
        setFilteredProducts(filtered);
      }
    } else {
      if (!query) {
        setFilteredAddons(addons);
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

      if (selected !== "") {
        const filtered = filteredAddons.filter(
          (item) =>
            item.status.toLowerCase() === selected.toLowerCase() &&
            normalize(item.title).includes(normalize(query)),
        );
        setFilteredAddons(filtered);
      } else {
        const filtered = addons.filter((item) =>
          normalize(item.title).includes(normalize(query)),
        );
        setFilteredAddons(filtered);
      }
    }
  };

  const filterbyCategory = (category) => {
    setSelectedCategory(category);

    if (toggle) {
      if (!category) {
        setFilteredProducts(products);
        return;
      }
      const filtered = products.filter(
        (item) =>
          item.products.category.toLowerCase() === category.toLowerCase(),
      );

      setFilteredProducts(filtered);
    } else {
      if (!category) {
        setFilteredAddons(addons);
        return;
      }
      const filtered = addons.filter((item) =>
        item.title.toLowerCase().includes(category.toLowerCase()),
      );

      setFilteredAddons(filtered);
    }
    setCurrentPage(1);
  };
  const paginatedItems = items.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
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
    if (!product.id) return;

    try {
      const { error } = await supabase
        .from("product_variants")
        .delete()
        .eq("id", product.id);

      if (error) throw error;

      toast.success("Product deleted successfully!");
      setProductPreview(false);
    } catch (error) {
      toast.error("Failed to delete product.");
      console.error("Delete error:", error);
    }
    fetchProducts();
  };

  const handleAddproductclose = () => {
    setProductlist(true);
    setIsAddProduct(false);
  };

  const fetchProducts = async () => {
    setIsloading(true);
    try {
      const { data } = await supabase
        .from("product_variants")
        .select(
          `
             *, 
              products (category, subcategory, subcategory1)
            `,
        )
        .eq("vendor_id", selectedVendor?.id);

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
      console.error("Error fetching products:", error);
    } finally {
      setIsloading(false);
    }
  };

  const fetchAddons = async () => {
    try {
      const { data, error } = await supabase
        .from("addon_variants")
        .select("*")
        .eq("vendorId", selectedVendor?.id);
      const sortedData = data.sort((a, b) => {
        // Prioritize "pending" status
        if (a.status === "pending" && b.status !== "pending") return -1;
        if (b.status === "pending" && a.status !== "pending") return 1;

        // If both are "pending" or both are not "pending", sort by date
        return new Date(b.created_at) - new Date(a.created_at);
      });

      if (error) {
        console.error("Error fetching addons:", error);
      } else {
        setAddons(sortedData);
        setFilteredAddons(sortedData);
      }
    } finally {
      setIsAddonRefresh(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isproductRefresh]);

  useEffect(() => {
    fetchAddons();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isaddonRefresh]);

  const handleCheckboxChange = (blogId) => {
    setSelectedItemForDelete((prev) =>
      prev.includes(blogId)
        ? prev.filter((id) => id !== blogId)
        : [...prev, blogId],
    );
  };

  async function handleMultipleDelete(selectedProducts) {
    if (selectedProducts?.length === 0) return;
    const filteredItems = items.filter((item) =>
      selectedProducts?.includes(item.id),
    );

    try {
      for (const product of filteredItems) {
        if (product?.type === "product") {
          await supabase
            .from("product_variants")
            .delete()
            .eq("id", product?.id);
        }

        if (product?.type === "addon") {
          await supabase.from("addon_variants").delete().eq("id", product?.id);
        }
        let imagePaths = [];

        if (product.image) {
          imagePaths.push(product.image);
        }

        if (product.additional_images) {
          try {
            const parsed = JSON.parse(product.additional_images);

            if (Array.isArray(parsed)) {
              imagePaths = imagePaths.concat(parsed);
            }
          } catch (err) {
            console.error("Error parsing additional images", err);
          }
        }

        if (imagePaths.length > 0) {
          const { storageError } = await supabase.storage
            .from("addon")
            .remove(imagePaths);

          if (storageError) throw storageError;
        }
      }

      toast.success("Selected items deleted successfully!");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Something went wrong while deleting");
    } finally {
      setMultipleDeleteWaring(false);
      setSelectedItemForDelete([]);
      setIsProductRefresh(true);
      setIsAddonRefresh(true);
    }
  }

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
                <BackButton
                  label="Back to vendor list"
                  onClick={() => setVendorproductlist(false)}
                  className=""
                />

                <div className="relative inline-block" ref={dropdownRef}>
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
                  {filterDropdown && (
                    <div className="absolute mt-2 w-48 -left-1/2 bg-white border rounded-md shadow-lg z-10 p-3 space-y-3">
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
                      onClick={handleTabClick}
                    >
                      {tab.name}
                    </button>
                  ))}
                </div>
                <div className=" hidden lg:flex gap-2 w-1/3">
                  <div>
                    {selectedItemForDelete?.length > 0 && (
                      <button
                        onClick={() => setMultipleDeleteWaring((prev) => !prev)}
                        className="px-2 py-1 md:px-4 md:py-2 text-nowrap border border-[#CCCCCC] rounded-md text-[#374A75] text-lg font-medium hover:bg-[#f1f1f1]"
                      >
                        Delete ({selectedItemForDelete?.length})
                      </button>
                    )}
                  </div>
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
                            <th className="p-3 font-medium">SR</th>
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
                                  Specification
                                </th>
                              </>
                            ) : (
                              <th className="p-3 font-medium">Addon Title</th>
                            )}
                            <th className="p-3 font-medium">Status</th>
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
                                  <input
                                    type="checkbox"
                                    name=""
                                    id=""
                                    onClick={(e) => e.stopPropagation()}
                                    checked={selectedItemForDelete?.includes(
                                      item.id,
                                    )}
                                    onChange={() =>
                                      handleCheckboxChange(item.id)
                                    }
                                  />
                                </div>
                              </td>
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
                                      <VscEye /> View
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
      {productPreview && (
        <VendorProductCard
          onClose={() => {
            setProductPreview(false);
          }}
          product={selectedProductview}
          handleDelete={handleDelete}
          updateStatus={handleUpdateStatus}
          rejectReason={rejectReason}
          setRejectReason={setRejectReason}
          handleConfirmReject={handleUpdateStatus}
          setSelectedItem={setSelectedItem}
          setSelectSubcategories={setSelectSubcategories}
        />
      )}

      {selectSubcategories && (
        <SelectSubcategories
          onClose={() => setSelectSubcategories(false)}
          product={selectedItem}
          handleUpdateStatus={handleUpdateStatus}
          setRejectReason={setRejectReason}
        />
      )}
      {multipleDeleteWaring && (
        <MultipleDeleteWarningCard
          setDeleteWarning={setMultipleDeleteWaring}
          selectedItemForDelete={selectedItemForDelete}
          handleMultipleDelete={handleMultipleDelete}
        />
      )}
    </div>
  );
}

export default VendorProductlist;
