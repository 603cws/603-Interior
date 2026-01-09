import { useEffect, useRef, useState } from "react";

import { useBoqApp } from "../../Context/BoqContext";
import { IoIosSearch } from "react-icons/io";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { exportToExcel } from "../../utils/DataExport";

import { supabase } from "../../services/supabase";
import { IoCloseCircle, IoCloudDownloadOutline } from "react-icons/io5";

import Table from "./Table";

const tabs = [
  { name: "Products", value: "products" },
  { name: "Add-Ons", value: "addons" },
];

function ItemTable({
  mobileMenuRef,
  isaddonRefresh,
  setIsAddonRefresh,
  isproductRefresh,
  setIsProductRefresh,
  productlist,
  setProductlist,
  setSelectedproduct,
  setSelectedAddon,
  setEditProduct,
  setEditAddon,
}) {
  const [selected, setSelected] = useState("");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [productType, setProductType] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPageBeforeSearch, setLastPageBeforeSearch] = useState(1);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedItemForDelete, setSelectedItemForDelete] = useState([]);

  const [multipleDeleteWaring, setMultipleDeleteWaring] = useState(false);
  const [toggle, setToggle] = useState(true);
  const [selectedTab, setSelectedTab] = useState("products");
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [addons, setAddons] = useState([]);
  const [filteredAddons, setFilteredAddons] = useState([]);
  const [isloading, setIsloading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const dropdownRef = useRef(null);
  const [filterDropdown, setFilterDropdown] = useState(false);

  const { categories } = useBoqApp();
  const items = toggle ? filteredProducts : filteredAddons;

  const categoriesData = categories.map((item) => item.category);

  const normalize = (str) => str.replace(/\s+/g, " ").trim().toLowerCase();

  const subcategoriesByCategory = categories.reduce((acc, item) => {
    acc[item.category] = item.subcategories || [];
    return acc;
  }, {});

  const handleTabClick = (event) => {
    setProductlist(true);
    const tab = event.target.value; // Get value from button
    setSelectedTab(tab);
    setToggle(tab === "products");
  };

  const applyFilters = ({
    query = "",
    category = "",
    status = "",
    subCategory = "",
    priceMin = "",
    priceMax = "",
    dateFrom = "",
    dateTo = "",
    product = "",
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
      dateTo ||
      product
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

      // NEW PRODUCT FILTER
      const productMatch = product ? item.default : true;

      return (
        titleMatch &&
        categoryMatch &&
        statusMatch &&
        subCategoryMatch &&
        priceMatch &&
        dateMatch &&
        productMatch
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

  const fetchProducts = async () => {
    setIsloading(true);
    try {
      const { data } = await supabase
        .from("product_variants")
        .select("*,products(*)")
        .order("created_at", { ascending: false })
        .neq("productDisplayType", "ecommerce");

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
      console.error("Error fetching products:", error);
    } finally {
      setIsloading(false);
      setIsProductRefresh(false);
    }
  };

  const fetchAddons = async () => {
    try {
      const { data, error } = await supabase.from("addon_variants").select("*");

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

  return (
    <>
      <div className="relative">
        <div className="sticky top-0 z-20 bg-white">
          <div className="hidden lg:flex justify-between items-center px-4 py-2 border-b-2 border-b-gray-400 ">
            <h3 className=" capitalize font-semibold text-xl ">product list</h3>

            <div className="flex gap-2">
              <div className="relative inline-block" ref={dropdownRef}>
                <button
                  onClick={() => setFilterDropdown(!filterDropdown)}
                  className="px-4 py-2 rounded text-[#374A75] text-sm flex items-center gap-3 border"
                >
                  <img src="/images/icons/filter-icon.png" alt="filter icon" />
                  <span className="text-sm">Filter</span>
                  <ChevronDownIcon className="h-4 w-4 text-gray-500" />
                </button>
                {filterDropdown && (
                  <div className="absolute mt-2 w-64 -left-1/2 bg-white border rounded-md shadow-lg z-10 p-3 space-y-3">
                    {/* status filter */}
                    <div>
                      <label className="text-sm text-[#374A75]">Status</label>
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
                            product: productType,
                          });
                        }}
                        className="w-full border focus:ring-0 p-2 text-sm"
                      >
                        <option value="">All</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>
                    {/* catgeory */}
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
                            product: productType,
                          });
                        }}
                        id="category"
                        className="w-full border py-2 text-sm"
                      >
                        <option value="">All categories</option>
                        {categoriesData.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </div>
                    {/* product */}
                    <div>
                      <label className="text-sm text-[#374A75]">product</label>
                      <select
                        name="product"
                        value={productType}
                        onChange={(e) => {
                          const value = e.target.value;
                          setProductType(value);
                          applyFilters({
                            query: searchQuery,
                            category: selectedCategory,
                            subCategory: selectedSubCategory,
                            status: selected,
                            priceMin,
                            priceMax,
                            dateFrom,
                            dateTo,
                            product: value,
                          });
                        }}
                        id="product"
                        className="w-full border py-2 text-sm"
                      >
                        <option value="">All products</option>
                        <option value="default">Default</option>
                      </select>
                    </div>
                    {/* subcategory */}
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
                              product: productType,
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
                              product: productType,
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
                              product: productType,
                            });
                          }}
                          className="w-1/2 border p-2 text-sm rounded"
                        />
                      </div>
                    </div>
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
                              product: productType,
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
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          setSelected("");
                          setSelectedCategory("");
                          setSelectedSubCategory("");
                          setPriceMin("");
                          setPriceMax("");
                          setDateFrom("");
                          setDateTo("");
                          setProductType("");
                          applyFilters({
                            query: searchQuery,
                            category: "",
                            subCategory: "",
                            status: "",
                            priceMin: "",
                            priceMax: "",
                            dateFrom: "",
                            dateTo: "",
                            product: "",
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
                    selectedTab === tab.value ? "bg-[#D3E3F0] " : "bg-white "
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
                  <img src="/images/icons/filter-icon.png" alt="filter icon" />
                </button>
                {filterDropdown && (
                  <div className="absolute mt-2 w-40 -left-full bg-white border rounded-md shadow-lg z-10 p-3">
                    <div>
                      <label className=" text-[#374A75]">Status</label>
                      <select
                        value={selected}
                        onChange={(e) => {
                          const value = e.target.value;
                          setSelected(value);
                          setFilterDropdown(false);
                          applyFilters({
                            query: searchQuery,
                            category: selectedCategory,
                            status: value,
                          });
                        }}
                        className="w-full border-none focus:ring-0 p-2"
                      >
                        <option value="">All</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>

                    <div>
                      <label className=" text-[#374A75]">Categories</label>
                      <select
                        name="category"
                        value={selectedCategory}
                        onChange={(e) => {
                          const value = e.target.value;
                          setSelectedCategory(value);
                          applyFilters({
                            query: searchQuery,
                            category: value,
                            status: selected,
                          });
                        }}
                        id="category"
                        className="py-2"
                      >
                        <option value="">All categories</option>
                        {categoriesData.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[#374A75]">Sub Categories</label>
                      <select
                        name="subCategory"
                        value={selectedSubCategory}
                        onChange={(e) => {
                          const value = e.target.value;
                          setSelectedSubCategory(value);
                          applyFilters({
                            query: searchQuery,
                            category: selectedCategory, // include category too
                            subCategory: value,
                            status: selected,
                          });
                        }}
                        id="subCategory"
                        className="py-2"
                      >
                        <option value="">All sub categories</option>
                        {(subcategoriesByCategory[selectedCategory] || []).map(
                          (subCat) => (
                            <option key={subCat} value={subCat}>
                              {subCat}
                            </option>
                          )
                        )}
                      </select>
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
                  className="h-10 w-10 flex justify-center items-center border rounded "
                >
                  <IoCloudDownloadOutline size={20} color="#374A75" />
                </button>
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
        {productlist && (
          <Table
            items={items}
            toggle={toggle}
            currentPage={currentPage}
            setSelectedproduct={setSelectedproduct}
            setSelectedAddon={setSelectedAddon}
            setEditProduct={setEditProduct}
            setEditAddon={setEditAddon}
            mobileMenuRef={mobileMenuRef}
            multipleDeleteWaring={multipleDeleteWaring}
            setMultipleDeleteWaring={setMultipleDeleteWaring}
            filteredAddons={filteredAddons}
            filteredProducts={filteredProducts}
            setCurrentPage={setCurrentPage}
            setIsAddonRefresh={setIsAddonRefresh}
            setIsProductRefresh={setIsProductRefresh}
            setSelectedItemForDelete={setSelectedItemForDelete}
            selectedItemForDelete={selectedItemForDelete}
            isloading={isloading}
          />
        )}
      </div>
    </>
  );
}

export default ItemTable;
