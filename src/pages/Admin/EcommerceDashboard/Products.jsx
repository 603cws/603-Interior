import { VscEye } from "react-icons/vsc";
import { MdOutlineDelete } from "react-icons/md";
import VendorNewProduct from "../../vendor/VendorNewProduct";
import VendorNewAddon from "../../vendor/VendorNewAddon";
import VendorProductEdit from "../../vendor/VendorProductEdit";
import VendorEditAddon from "../../vendor/VendorEditAddon";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { exportToExcel } from "../../../utils/DataExport";
import {
  IoCheckmark,
  IoCloseCircle,
  IoCloudDownloadOutline,
} from "react-icons/io5";
import { IoIosSearch } from "react-icons/io";
import Spinner from "../../../common-components/Spinner";
import { baseImageUrl } from "../../../utils/HelperConstant";
import { HiXMark } from "react-icons/hi2";
import { CiMenuKebab } from "react-icons/ci";
import MobileTabProductCard from "../../user/MobileTabProductCard";
import { useEffect, useRef, useState } from "react";
import { supabase } from "../../../services/supabase";
import PagInationNav from "../../../common-components/PagInationNav";
import { MdOutlineRateReview } from "react-icons/md";
import ProductReviews from "./ProductReviews";
import { useApp } from "../../../Context/Context";

function Products({
  isproductRefresh,
  setIsProductRefresh,
  setSelectedProductview,
  setRejectReasonPopup,
  setDeleteWarning,
  setIsAddonRefresh,
  handleUpdateStatus,
  setRejectReason,
  handleProductPreview,
}) {
  const [addNewProduct, setAddNewProduct] = useState(false);
  const [addNewAddon, setAddNewAddon] = useState(false);
  const [productlist, setProductlist] = useState(true);
  const [filterDropdown, setFilterDropdown] = useState(false);
  const [selected, setSelected] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // to store the latest search input
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [toggle, setToggle] = useState(true);
  const [products, setProducts] = useState([]);
  const [addons, setAddons] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filteredAddons, setFilteredAddons] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedTab, setSelectedTab] = useState("products");
  const [isAddProduct, setIsAddProduct] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPageBeforeSearch, setLastPageBeforeSearch] = useState(1);
  const [isloading, setIsloading] = useState(false);
  const scrollContainerRef = useRef(null);
  const tableRef = useRef(null);
  const itemsPerPage = 10;

  const [openMenuId, setOpenMenuId] = useState(null); // Store the ID of the row with an open menu

  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // new edit option product
  const [editProduct, setEditProduct] = useState(false);
  const [selectedproduct, setSelectedproduct] = useState(null);

  //new edit option addon
  const [editAddon, setEditAddon] = useState(false);
  const [selectedAddon, setSelectedAddon] = useState(null);

  const [reviews, setReviews] = useState(false);

  const { categories } = useApp();

  const categoriesData = categories.map((item) => item.category);

  const subcategoriesByCategory = categories.reduce((acc, item) => {
    acc[item.category] = item.subcategories || [];
    return acc;
  }, {});

  const tabs = [
    { name: "Products", value: "products" },
    { name: "Add-Ons", value: "addons" },
  ];

  useEffect(() => {
    if (!openMenuId) return;

    const handleDocClick = (e) => {
      const menuEl = menuRef.current[openMenuId];
      const btnEl = buttonRef.current[openMenuId];

      if (
        (menuEl && menuEl.contains(e.target)) ||
        (btnEl && btnEl.contains(e.target))
      ) {
        return; // click inside menu or on the kebab button — do nothing
      }

      setOpenMenuId(null); // click outside -> close
    };

    document.addEventListener("mousedown", handleDocClick);
    document.addEventListener("touchstart", handleDocClick);

    return () => {
      document.removeEventListener("mousedown", handleDocClick);
      document.removeEventListener("touchstart", handleDocClick);
    };
  }, [openMenuId]);

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

  const normalize = (str) => str.replace(/\s+/g, " ").trim().toLowerCase();

  const applyFilters = ({
    query = "",
    category = "",
    status = "",
    subCategory = "",
    priceMin = "",
    priceMax = "",
    dateFrom = "",
    dateTo = "",
  }) => {
    const source = toggle ? products : addons;

    // detect whether any filter is active (include new filters)
    const anyFilterActive = !!(
      query ||
      category ||
      status ||
      subCategory ||
      priceMin ||
      priceMax ||
      dateFrom ||
      dateTo
    );

    // Store last page before searching if this is a new search
    if (anyFilterActive && !isSearching) {
      setLastPageBeforeSearch(currentPage);
      setIsSearching(true);
    }

    // Reset case: No filters at all
    if (!anyFilterActive) {
      toggle ? setFilteredProducts(products) : setFilteredAddons(addons);
      if (isSearching) {
        setCurrentPage(lastPageBeforeSearch);
        setIsSearching(false);
      }
      return;
    }

    // helpers: extract price and date safely from item
    const getItemPrice = (item) => {
      // try multiple possible locations, convert to Number or NaN
      const candidates = [
        item.price,
        item.products?.price,
        item.price?.amount,
        item.price?.value,
      ];
      for (const c of candidates) {
        if (c !== undefined && c !== null && c !== "") {
          const n = Number(c);
          if (!Number.isNaN(n)) return n;
        }
      }
      return NaN;
    };

    const getItemDate = (item) => {
      // try common date fields
      const candidates = [
        item.date,
        item.createdAt,
        item.created_at,
        item.products?.createdAt,
        item.products?.date,
      ];
      for (const c of candidates) {
        if (!c && c !== 0) continue;
        const t = Date.parse(c);
        if (!Number.isNaN(t)) return new Date(t);
      }
      return null;
    };

    // prepare numeric and date bounds (normalize)
    const minPrice =
      priceMin === "" ? Number.NEGATIVE_INFINITY : Number(priceMin);
    const maxPrice =
      priceMax === "" ? Number.POSITIVE_INFINITY : Number(priceMax);

    // parse date inputs and create inclusive bounds
    const parseDateOrNull = (dStr, isEnd = false) => {
      if (!dStr) return null;
      // treat input as yyyy-mm-dd (from date input). Make inclusive -- start of day / end of day
      const base = new Date(dStr);
      if (Number.isNaN(base.getTime())) return null;
      if (isEnd) {
        base.setHours(23, 59, 59, 999);
      } else {
        base.setHours(0, 0, 0, 0);
      }
      return base;
    };

    const fromDate = parseDateOrNull(dateFrom, false);
    const toDate = parseDateOrNull(dateTo, true);

    const filtered = source.filter((item) => {
      const titleMatch = query
        ? normalize(item.title).includes(normalize(query))
        : true;

      const categoryMatch = category
        ? toggle
          ? item.products?.category?.toLowerCase() === category.toLowerCase()
          : item.title?.toLowerCase().includes(category.toLowerCase())
        : true;

      const subCategoryMatch = subCategory
        ? toggle
          ? item.products?.subcategory
              ?.toLowerCase()
              .includes(subCategory.toLowerCase())
          : item.title?.toLowerCase().includes(subCategory.toLowerCase())
        : true;

      const statusMatch = status
        ? item.status?.toLowerCase() === status.toLowerCase()
        : true;

      // Price matching (if either priceMin or priceMax provided)
      const itemPrice = getItemPrice(item);
      const priceMatch =
        isFinite(minPrice) || isFinite(maxPrice)
          ? !Number.isNaN(itemPrice) &&
            itemPrice >= minPrice &&
            itemPrice <= maxPrice
          : true;

      // Date matching (if either dateFrom or dateTo provided)
      const itemDate = getItemDate(item);
      let dateMatch = true;
      if (fromDate || toDate) {
        if (!itemDate) {
          dateMatch = false;
        } else {
          if (fromDate && itemDate < fromDate) dateMatch = false;
          if (toDate && itemDate > toDate) dateMatch = false;
        }
      }

      return (
        titleMatch &&
        categoryMatch &&
        statusMatch &&
        subCategoryMatch &&
        priceMatch &&
        dateMatch
      );
    });

    // Apply filtered result
    if (toggle) {
      setFilteredProducts(filtered);
    } else {
      setFilteredAddons(filtered);
    }

    setCurrentPage(1); // Always reset to first page on filter
  };

  const handleTabClick = (event) => {
    setProductlist(true);
    setIsAddProduct(false);
    const tab = event.target.value; // Get value from button
    setSelectedTab(tab);
    setToggle(tab === "products"); // Set toggle dynamically
  };

  const items = toggle ? filteredProducts : filteredAddons;

  const menuRef = useRef({});
  const buttonRef = useRef({});
  const dropdownRef = useRef(null);

  const totalPages = Math.ceil(items.length / itemsPerPage);

  // Slice the items for pagination
  const paginatedItems = items.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleMenuToggle = (id) => {
    setOpenMenuId((prev) => (prev === id ? null : id));
  };

  const fetchProducts = async () => {
    setIsloading(true);
    try {
      const { data } = await supabase
        .from("product_variants")
        .select("*,products(*)")
        .order("created_at", { ascending: false })
        .neq("productDisplayType", "boq");

      const sortedData = data.sort((a, b) => {
        // Prioritize "pending" status
        if (a.status === "pending" && b.status !== "pending") return -1;
        if (b.status === "pending" && a.status !== "pending") return 1;

        // If both are "pending" or both are not "pending", sort by date
        return new Date(b.created_at) - new Date(a.created_at);
      });
      setProducts(sortedData);
      setFilteredProducts(sortedData);
    } catch (error) {
      console.log("Error fetching products:", error);
    } finally {
      setIsloading(false);
      setIsProductRefresh(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isproductRefresh]);

  const goToPage = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);

      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  const handleRejectClick = (product) => {
    setSelectedProductview(product);
    setRejectReasonPopup(true);
  };

  const handleDeleteClick = (item) => {
    setDeleteWarning(true);
    setSelectedProductview(item);
  };

  return (
    <div className="flex flex-col h-full min-h-0 overflow-hidden lg:border-2 lg:border-[#334A78] lg:rounded-lg bg-white">
      <div className="overflow-y-auto scrollbar-hide relative h-full">
        {addNewProduct ? (
          <VendorNewProduct
            setAddNewProduct={setAddNewProduct}
            setProductlist={setProductlist}
          />
        ) : addNewAddon ? (
          <VendorNewAddon
            setAddNewProduct={setAddNewAddon}
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
        ) : reviews ? (
          <ProductReviews
            product={selectedproduct}
            onClose={() => setReviews(false)}
          />
        ) : (
          // Default product list and add product UI
          <>
            <div className="sticky top-0 z-20 bg-white">
              <div className="hidden lg:flex justify-between items-center px-4 py-2 border-b-2 border-b-gray-400 ">
                <h3 className=" capitalize font-semibold text-xl ">
                  product list
                </h3>

                <div className="flex gap-2">
                  <div className="relative inline-block" ref={dropdownRef}>
                    <button
                      onClick={() => setFilterDropdown(!filterDropdown)}
                      className="px-4 py-2 rounded text-[#374A75] text-sm flex items-center gap-3 border"
                      aria-haspopup="true"
                      aria-expanded={filterDropdown}
                    >
                      <img
                        src="/images/icons/filter-icon.png"
                        alt="filter icon"
                      />
                      <span className="text-sm">Filter</span>
                      <ChevronDownIcon className="h-4 w-4 text-gray-500" />
                    </button>
                    {filterDropdown && (
                      <div className="absolute mt-2 w-48 -left-1/2 bg-white border rounded-md shadow-lg z-10 p-3">
                        {/* status filter */}
                        <div>
                          <label className="text-sm text-[#374A75]">
                            Status
                          </label>
                          <select
                            value={selected}
                            onChange={(e) => {
                              const value = e.target.value;
                              setSelected(value);
                              setFilterDropdown(false); // keep original behavior (close on status change)
                              applyFilters({
                                query: searchQuery,
                                category: selectedCategory,
                                subCategory: selectedSubCategory,
                                status: value,
                                priceMin,
                                priceMax,
                                dateFrom,
                                dateTo,
                              });
                            }}
                            className="w-full border-none focus:ring-0 p-2 text-sm"
                          >
                            <option value="">All</option>
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                          </select>
                        </div>

                        {/* category */}
                        <div>
                          <label className="text-sm text-[#374A75]">
                            Categories
                          </label>
                          <select
                            name="category"
                            value={selectedCategory}
                            onChange={(e) => {
                              const value = e.target.value;
                              setSelectedCategory(value);
                              setSelectedSubCategory("");
                              applyFilters({
                                query: searchQuery,
                                category: value,
                                subCategory: "",
                                status: selected,
                                priceMin,
                                priceMax,
                                dateFrom,
                                dateTo,
                              });
                            }}
                            id="category"
                            className="w-full py-2 text-sm"
                          >
                            <option value="">All categories</option>
                            {categoriesData.map((category) => (
                              <option key={category} value={category}>
                                {category}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* subcategory (conditional) */}
                        {selectedCategory && (
                          <div>
                            <label className="text-sm text-[#374A75]">
                              Sub Categories
                            </label>
                            <select
                              name="subCategory"
                              value={selectedSubCategory}
                              onChange={(e) => {
                                const value = e.target.value;
                                setSelectedSubCategory(value);
                                applyFilters({
                                  query: searchQuery,
                                  category: selectedCategory,
                                  subCategory: value,
                                  status: selected,
                                  priceMin,
                                  priceMax,
                                  dateFrom,
                                  dateTo,
                                });
                              }}
                              id="subCategory"
                              className="w-full py-2 text-sm"
                            >
                              <option value="">All Sub Categories</option>
                              {(
                                subcategoriesByCategory[selectedCategory] || []
                              ).map((subCat) => (
                                <option key={subCat} value={subCat}>
                                  {subCat}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}

                        {/* price range */}
                        <div>
                          <label className="text-sm text-[#374A75]">
                            Price (₹)
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="number"
                              min="0"
                              placeholder="Min"
                              value={priceMin}
                              onChange={(e) => {
                                const v = e.target.value;
                                setPriceMin(v);
                                applyFilters({
                                  query: searchQuery,
                                  category: selectedCategory,
                                  subCategory: selectedSubCategory,
                                  status: selected,
                                  priceMin: v,
                                  priceMax,
                                  dateFrom,
                                  dateTo,
                                });
                              }}
                              className="w-1/2 border p-2 text-sm rounded"
                            />
                            <input
                              type="number"
                              min="0"
                              placeholder="Max"
                              value={priceMax}
                              onChange={(e) => {
                                const v = e.target.value;
                                setPriceMax(v);
                                applyFilters({
                                  query: searchQuery,
                                  category: selectedCategory,
                                  subCategory: selectedSubCategory,
                                  status: selected,
                                  priceMin,
                                  priceMax: v,
                                  dateFrom,
                                  dateTo,
                                });
                              }}
                              className="w-1/2 border p-2 text-sm rounded"
                            />
                          </div>
                        </div>

                        {/* date range */}
                        <div>
                          <label className="text-sm text-[#374A75]">Date</label>
                          <div className="flex gap-2">
                            <input
                              type="date"
                              value={dateFrom}
                              onChange={(e) => {
                                const v = e.target.value;
                                setDateFrom(v);
                                applyFilters({
                                  query: searchQuery,
                                  category: selectedCategory,
                                  subCategory: selectedSubCategory,
                                  status: selected,
                                  priceMin,
                                  priceMax,
                                  dateFrom: v,
                                  dateTo,
                                });
                              }}
                              className="w-1/2 border p-2 text-sm rounded"
                            />
                            <input
                              type="date"
                              value={dateTo}
                              onChange={(e) => {
                                const v = e.target.value;
                                setDateTo(v);
                                applyFilters({
                                  query: searchQuery,
                                  category: selectedCategory,
                                  subCategory: selectedSubCategory,
                                  status: selected,
                                  priceMin,
                                  priceMax,
                                  dateFrom,
                                  dateTo: v,
                                });
                              }}
                              className="w-1/2 border p-2 text-sm rounded"
                            />
                          </div>
                        </div>

                        {/* actions: Clear filters */}
                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={() => {
                              // reset local filter states
                              setSelected("");
                              setSelectedCategory("");
                              setSelectedSubCategory("");
                              setPriceMin("");
                              setPriceMax("");
                              setDateFrom("");
                              setDateTo("");
                              // keep dropdown open (you can close if you prefer)
                              applyFilters({
                                query: searchQuery,
                                category: "",
                                subCategory: "",
                                status: "",
                                priceMin: "",
                                priceMax: "",
                                dateFrom: "",
                                dateTo: "",
                              });
                            }}
                            className="text-sm px-3 py-1 rounded bg-gray-100 hover:bg-gray-200"
                          >
                            Reset Filter
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="">
                    <button
                      onClick={() => {
                        const exportData = items.map((item) => ({
                          id: item.id,
                          [toggle ? "Product Name" : "Addon Name"]: item.title,
                          Price: `₹${item.price}`,
                          Status: item?.status,
                          Description: item?.details || "",
                          Dimension: item?.dimensions || "NA",
                          company: item?.manufacturer || "",
                          segment: item?.segment,
                        }));
                        exportToExcel(
                          exportData,
                          toggle ? "products.xlsx" : "addons.xlsx"
                        );
                      }}
                      className=" px-4 py-2 rounded text-[#374A75] text-sm flex items-center gap-3 border "
                    >
                      <IoCloudDownloadOutline /> <span>Export</span>
                    </button>
                  </div>
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

                <div className="hidden lg:block w-1/4">
                  <input
                    type="text"
                    value={searchQuery}
                    className="w-full rounded-md p-2 outline-none border-2 border-gray-400"
                    placeholder="......search by product name"
                    onChange={(e) => {
                      const value = e.target.value;
                      setSearchQuery(value);
                      applyFilters({
                        query: value,
                        category: selectedCategory,
                        status: selected,
                      });
                    }}
                  />
                </div>
                <div className="lg:hidden flex gap-2">
                  <div className="relative inline-block text-xs">
                    <button
                      onClick={() => setFilterDropdown(!filterDropdown)}
                      className="h-10 w-10 flex justify-center items-center border rounded"
                    >
                      <img
                        src="/images/icons/filter-icon.png"
                        alt="filter icon"
                      />
                      {/* <span className="text-sm">Filter</span> */}
                      {/* <ChevronDownIcon className="h-4 w-4 text-gray-500" /> */}
                    </button>
                    {filterDropdown && (
                      <div className="absolute mt-2 w-40 -left-full bg-white border rounded-md shadow-lg z-10 p-3">
                        {/* status filter */}
                        <div>
                          <label className="text-sm text-[#374A75]">
                            Status
                          </label>
                          <select
                            value={selected}
                            onChange={(e) => {
                              const value = e.target.value;
                              setSelected(value);
                              setFilterDropdown(false); // keep original behavior (close on status change)
                              applyFilters({
                                query: searchQuery,
                                category: selectedCategory,
                                subCategory: selectedSubCategory,
                                status: value,
                                priceMin,
                                priceMax,
                                dateFrom,
                                dateTo,
                              });
                            }}
                            className="w-full border-none focus:ring-0 p-2 text-sm"
                          >
                            <option value="">All</option>
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                          </select>
                        </div>

                        {/* category */}
                        <div>
                          <label className="text-sm text-[#374A75]">
                            Categories
                          </label>
                          <select
                            name="category"
                            value={selectedCategory}
                            onChange={(e) => {
                              const value = e.target.value;
                              setSelectedCategory(value);
                              setSelectedSubCategory("");
                              applyFilters({
                                query: searchQuery,
                                category: value,
                                subCategory: "",
                                status: selected,
                                priceMin,
                                priceMax,
                                dateFrom,
                                dateTo,
                              });
                            }}
                            id="category"
                            className="w-full py-2 text-sm"
                          >
                            <option value="">All categories</option>
                            {categoriesData.map((category) => (
                              <option key={category} value={category}>
                                {category}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* subcategory (conditional) */}
                        {selectedCategory && (
                          <div>
                            <label className="text-sm text-[#374A75]">
                              Sub Categories
                            </label>
                            <select
                              name="subCategory"
                              value={selectedSubCategory}
                              onChange={(e) => {
                                const value = e.target.value;
                                setSelectedSubCategory(value);
                                applyFilters({
                                  query: searchQuery,
                                  category: selectedCategory,
                                  subCategory: value,
                                  status: selected,
                                  priceMin,
                                  priceMax,
                                  dateFrom,
                                  dateTo,
                                });
                              }}
                              id="subCategory"
                              className="w-full py-2 text-sm"
                            >
                              <option value="">All Sub Categories</option>
                              {(
                                subcategoriesByCategory[selectedCategory] || []
                              ).map((subCat) => (
                                <option key={subCat} value={subCat}>
                                  {subCat}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}

                        {/* price range */}
                        <div>
                          <label className="text-sm text-[#374A75]">
                            Price (₹)
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="number"
                              min="0"
                              placeholder="Min"
                              value={priceMin}
                              onChange={(e) => {
                                const v = e.target.value;
                                setPriceMin(v);
                                applyFilters({
                                  query: searchQuery,
                                  category: selectedCategory,
                                  subCategory: selectedSubCategory,
                                  status: selected,
                                  priceMin: v,
                                  priceMax,
                                  dateFrom,
                                  dateTo,
                                });
                              }}
                              className="w-1/2 border p-2 text-sm rounded"
                            />
                            <input
                              type="number"
                              min="0"
                              placeholder="Max"
                              value={priceMax}
                              onChange={(e) => {
                                const v = e.target.value;
                                setPriceMax(v);
                                applyFilters({
                                  query: searchQuery,
                                  category: selectedCategory,
                                  subCategory: selectedSubCategory,
                                  status: selected,
                                  priceMin,
                                  priceMax: v,
                                  dateFrom,
                                  dateTo,
                                });
                              }}
                              className="w-1/2 border p-2 text-sm rounded"
                            />
                          </div>
                        </div>

                        {/* date range */}
                        <div>
                          <label className="text-sm text-[#374A75]">Date</label>
                          <div className="flex gap-2">
                            <input
                              type="date"
                              value={dateFrom}
                              onChange={(e) => {
                                const v = e.target.value;
                                setDateFrom(v);
                                applyFilters({
                                  query: searchQuery,
                                  category: selectedCategory,
                                  subCategory: selectedSubCategory,
                                  status: selected,
                                  priceMin,
                                  priceMax,
                                  dateFrom: v,
                                  dateTo,
                                });
                              }}
                              className="w-1/2 border p-2 text-sm rounded"
                            />
                            <input
                              type="date"
                              value={dateTo}
                              onChange={(e) => {
                                const v = e.target.value;
                                setDateTo(v);
                                applyFilters({
                                  query: searchQuery,
                                  category: selectedCategory,
                                  subCategory: selectedSubCategory,
                                  status: selected,
                                  priceMin,
                                  priceMax,
                                  dateFrom,
                                  dateTo: v,
                                });
                              }}
                              className="w-1/2 border p-2 text-sm rounded"
                            />
                          </div>
                        </div>

                        {/* actions: Clear filters */}
                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={() => {
                              // reset local filter states
                              setSelected("");
                              setSelectedCategory("");
                              setSelectedSubCategory("");
                              setPriceMin("");
                              setPriceMax("");
                              setDateFrom("");
                              setDateTo("");
                              // keep dropdown open (you can close if you prefer)
                              applyFilters({
                                query: searchQuery,
                                category: "",
                                subCategory: "",
                                status: "",
                                priceMin: "",
                                priceMax: "",
                                dateFrom: "",
                                dateTo: "",
                              });
                            }}
                            className="text-sm px-3 py-1 rounded bg-gray-100 hover:bg-gray-200"
                          >
                            Reset Filter
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* export button */}
                  <div className="">
                    <button
                      onClick={() => {
                        const exportData = items.map((item) => ({
                          id: item.id,
                          [toggle ? "Product Name" : "Addon Name"]: item.title,
                          Price: `₹${item.price}`,
                          Status: item?.status,
                          Description: item?.details || "",
                          Dimension: item?.dimensions || "NA",
                          company: item?.manufacturer || "",
                          segment: item?.segment,
                        }));
                        exportToExcel(
                          exportData,
                          toggle ? "products.xlsx" : "addons.xlsx"
                        );
                      }}
                      className="h-10 w-10 flex justify-center items-center border rounded "
                    >
                      <IoCloudDownloadOutline size={20} color="#374A75" />
                    </button>
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
                          onChange={(e) => {
                            const value = e.target.value;
                            setSearchQuery(value);
                            applyFilters({
                              query: value,
                            });
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
                </div>
              </div>
            </div>

            {/*  */}

            {productlist &&
              (isloading ? (
                <Spinner />
              ) : items.length > 0 ? (
                <>
                  {/* // <section className="mt-2 flex-1 overflow-hidden px-8"> */}
                  <section className="hidden lg:block h-[73%] font-Poppins overflow-hidden">
                    <div
                      className="w-full h-full border-t border-b border-[#CCCCCC] overflow-y-auto custom-scrollbar"
                      ref={scrollContainerRef}
                    >
                      <table
                        className="min-w-full border-collapse"
                        ref={tableRef}
                      >
                        <thead className="bg-[#FFFFFF] sticky top-0 z-10 px-8 text-center text-[#000] text-base">
                          <tr>
                            {toggle ? (
                              <th className="p-3 font-medium">Product Name</th>
                            ) : (
                              <th className="p-3 font-medium">Addon Name</th>
                            )}
                            <th className="p-3  font-medium">MRP</th>
                            <th className="p-3  font-medium">Selling Price</th>
                            <th className="p-3  font-medium">Stock</th>
                            <th className="p-3 font-medium">Status</th>
                            <th className="p-3 font-medium">Action</th>
                          </tr>
                        </thead>
                        <tbody className=" text-sm">
                          {paginatedItems.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50">
                              <td className="border border-gray-200 p-3 align-middle w-1/2">
                                <div className="flex items-center gap-2">
                                  <img
                                    src={`${baseImageUrl}${item.image}`}
                                    alt={item.title}
                                    className="w-10 h-10 object-contain rounded"
                                  />

                                  <span>{item.title}</span>
                                </div>
                              </td>
                              <td className="border border-gray-200 p-3 align-middle text-center">
                                ₹{item?.ecommercePrice?.mrp}
                              </td>
                              <td className="border border-gray-200 p-3 align-middle text-center">
                                ₹{item?.ecommercePrice?.sellingPrice}
                              </td>
                              <td className="border border-gray-200 p-3 align-middle text-center">
                                {item.stockQty}
                              </td>
                              <td className="border border-gray-200 p-3 align-middle text-center group relative">
                                {item.status === "pending" ? (
                                  <div className="flex items-center justify-center">
                                    <span className="text-[#13B2E4]">
                                      Pending
                                    </span>
                                    <div className="absolute top-0 left-0 w-full h-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                      <button
                                        className="bg-gray-100 text-green-600 p-3 rounded-full mr-2 hover:text-gray-100 hover:bg-green-600"
                                        onClick={() => {
                                          handleUpdateStatus(item, "approved");
                                          setRejectReason("");
                                        }}
                                      >
                                        <IoCheckmark size={20} />
                                      </button>
                                      <button
                                        className="bg-gray-100 text-red-600 p-3 rounded-full mr-2 hover:text-gray-100 hover:bg-red-600"
                                        onClick={() => handleRejectClick(item)}
                                      >
                                        <HiXMark size={20} />
                                      </button>
                                    </div>
                                  </div>
                                ) : item.status === "approved" ? (
                                  <span className="text-green-400">
                                    approved
                                  </span>
                                ) : (
                                  <span className="text-red-400">
                                    {item.status || "N/A"}
                                  </span>
                                )}
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
                                    className="absolute top-1/2 left-0 transform mt-2 bg-white border border-gray-300 shadow-md rounded-md w-24 z-40"
                                  >
                                    <button
                                      onClick={() => {
                                        handleProductPreview(item);
                                        setOpenMenuId(null);
                                      }}
                                      className=" flex gap-2 items-center w-full text-left px-3 py-2 hover:bg-gray-200"
                                    >
                                      <VscEye /> View
                                    </button>
                                    <button
                                      onClick={() => {
                                        if (toggle) {
                                          setSelectedproduct(item);
                                          setEditProduct(true);
                                        } else {
                                          setSelectedAddon(item);
                                          setEditAddon(true);
                                        }
                                        setOpenMenuId(null);
                                      }}
                                      className="flex gap-2 items-center w-full text-left px-3 py-2 hover:bg-gray-200"
                                    >
                                      <VscEye /> Edit
                                    </button>
                                    <button
                                      // onClick={() => {
                                      //   handleDelete(item);
                                      // }}
                                      onClick={() => {
                                        handleDeleteClick(item);
                                        setOpenMenuId(null);
                                      }}
                                      className="flex gap-2 items-center w-full text-left px-3 py-2 hover:bg-gray-200"
                                    >
                                      <MdOutlineDelete /> Delete
                                    </button>
                                    <button
                                      onClick={() => {
                                        setSelectedproduct(item);
                                        setReviews(true);
                                        setOpenMenuId(null);
                                      }}
                                      className="flex gap-0.5 items-center w-full text-left px-3 py-2 hover:bg-gray-200"
                                    >
                                      <MdOutlineRateReview /> Reviews
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
            <PagInationNav
              totalPages={totalPages}
              currentPage={currentPage}
              handlePageChange={goToPage}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default Products;
