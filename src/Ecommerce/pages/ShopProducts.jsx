import { useEffect, useRef, useState } from "react";
import { supabase } from "../../services/supabase";
import SpinnerFullPage from "../../common-components/SpinnerFullPage";
import { IoFilter } from "react-icons/io5";
import {
  MdKeyboardArrowLeft,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
} from "react-icons/md";
import Header from "../components/Header";
import { useHandleAddToCart } from "../../utils/HelperFunction";
import { useApp } from "../../Context/Context";
import { ToastContainer } from "react-toastify";
import { useNavigate, useSearchParams } from "react-router-dom";
import Footer from "../../common-components/Footer";
import { AiFillHeart } from "react-icons/ai";
import { GoHeart } from "react-icons/go";
import PagInationNav from "../../common-components/PagInationNav";

function ShopProducts() {
  //state
  const [products, setProducts] = useState([]);
  const [productsloading, setProductsloading] = useState(true);
  const containerRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isShopCatOepn, setIsShopCatOpen] = useState(true);
  const [isPriceOpen, setIsPriceOpen] = useState(false);
  const [filtersortby, setfiltersortby] = useState("Popularity");
  const [isfilterOpen, setIsfilteropen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isBrandOpen, setIsBrandopen] = useState(false);
  const [allBrands, setAllBrands] = useState([]);
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);

  //context
  const { filters, setFilters } = useApp();

  const [minPrice, setMinPrice] = useState(filters.priceRange[0]);

  const [maxPrice, setMaxPrice] = useState(filters.priceRange[1]);

  //
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get("category");
  const query = searchParams.get("query");

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      priceRange: [minPrice, maxPrice],
    }));
  }, [minPrice, maxPrice]);

  useEffect(() => {
    if (category) {
      setFilters((prev) => ({
        ...prev,
        category: [category],
      }));
    }
  }, []);

  //ref
  const dropdownRef = useRef(null);

  let items = filteredProducts;
  let itemsPerPage = 20;

  // Calculate total pages
  const totalPages = Math.ceil(items.length / itemsPerPage);

  // Get current page items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);

  const end = Math.min(indexOfLastItem, items.length);

  const resultText = `Showing ${indexOfFirstItem + 1}–${end} of ${
    items.length
  } results`;
  // Handle page change
  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
    containerRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // fetchdata();
    fetchProductsData();
  }, []);

  const applyFiltersAndSort = (products, filters, filtersortby) => {
    let result = [...products];

    // Category Filter
    const normalizedFilterCats = filters.category.map((cat) =>
      cat.toLowerCase()
    );

    if (normalizedFilterCats.length > 0) {
      result = result.filter((product) =>
        normalizedFilterCats.includes(
          product.product_id?.category?.toLowerCase()
        )
      );
    }

    const actualMaxPrice = maxPrice === 10000 ? Infinity : maxPrice;

    result = result.filter(
      (product) =>
        product?.ecommercePrice?.sellingPrice >= minPrice &&
        product?.ecommercePrice?.sellingPrice <= actualMaxPrice
    );

    // Sorting
    switch (true) {
      case filtersortby === "low":
        result.sort((a, b) => a.price - b.price);
        break;
      case filtersortby === "high":
        result.sort((a, b) => b.price - a.price);
        break;
      default:
        // No sorting applied for 'popularity' or default
        break;
    }
    // Brand Filter
    if (filters.brands.length > 0) {
      result = result.filter((product) => {
        const productBrand = product?.manufacturer?.trim().toLowerCase();
        return filters.brands.some(
          (selected) => selected.trim().toLowerCase() === productBrand
        );
      });
    }

    // Show available only
    if (showAvailableOnly) {
      result = result.filter((product) => product.stockQty > 0);
    }

    // search results
    if (query) {
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.product_type.toLowerCase().includes(query.toLowerCase()) ||
          item.product_id?.category?.toLowerCase().includes(query.toLowerCase())
      );
    }

    return result;
  };

  useEffect(() => {
    const updated = applyFiltersAndSort(products, filters, filtersortby);
    setFilteredProducts(updated);
  }, [filters, filtersortby, products, showAvailableOnly, query]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters, filtersortby]);

  const handleSortby = (e) => {
    const sortby = e.value;
    setfiltersortby(sortby);
  };

  const fetchProductsData = async () => {
    try {
      setProductsloading(true);
      const { data, error } = await supabase
        .from("product_variants")
        .select(`* ,product_id(*)`)
        .order("created_at", { ascending: false })
        .neq("productDisplayType", "boq");

      if (error) throw error;

      const manufacturers = data
        .map((item) => item.manufacturer)
        .filter(Boolean);
      setAllBrands([...new Set(manufacturers)]);

      // Filter products where it is approved
      const filtered = data.filter(
        (item) =>
          item.status === "approved" &&
          item.product_id.category !== "Partitions / Ceilings" &&
          item.product_id.category !== "Civil / Plumbing"
      );

      // 1. Extract unique image names
      const uniqueImages = [...new Set(filtered.map((item) => item.image))];

      // 2. Generate signed URLs from Supabase Storage
      const { data: signedUrls, error: signedUrlError } = await supabase.storage
        .from("addon") // your bucket name
        .createSignedUrls(uniqueImages, 3600); // 1 hour expiry

      if (signedUrlError) {
        console.error("Error generating signed URLs:", signedUrlError);
        return;
      }

      // 3. Create a map from image name to signed URL
      const urlMap = {};
      signedUrls.forEach(({ path, signedUrl }) => {
        urlMap[path] = signedUrl;
      });

      // 4. Replace image names with URLs in the array
      const updatedProducts = filtered.map((item) => ({
        ...item,
        image: urlMap[item.image] || item.image, // fallback if URL not found
      }));

      setFilteredProducts(updatedProducts);
      setProducts(updatedProducts);
    } catch (error) {
      console.error("Error fetching filtered data:", error);
    } finally {
      setProductsloading(false);
    }
  };
  const categoryies = [
    {
      name: "Furniture",
      imagename: "/images/icons/Furniture.png",
    },
    {
      name: "Lighting",
      imagename: "/images/icons/Lighting.png",
    },
    {
      name: "Paint",
      imagename: "/images/icons/Paint.png",
    },
    {
      name: "Flooring",
      imagename: "/images/icons/Flooring.png",
    },
    {
      name: "HVAC",
      imagename: "/images/icons/HVAC.png",
    },
    {
      name: "Smart Solutions",
      imagename: "/images/icons/SmartSolutions.png",
    },
    {
      name: "Lux",
      imagename: "/images/icons/Lux.png",
    },
  ];

  const options = [
    { option: "Popularity", value: "Popularity" },
    { option: "Price: Low to High", value: "low" },
    { option: "Price: High to Low", value: "high" },
  ];

  const handleCategoryClick = (catName) => {
    setFilters((prev) => ({
      ...prev,
      category: prev.category.includes(catName)
        ? prev.category.filter((c) => c !== catName) // remove if exists
        : [...prev.category, catName], // add if not
    }));
  };

  const handleBrandClick = (brand) => {
    setFilters((prev) => ({
      ...prev,
      brands: prev.brands.includes(brand)
        ? prev.brands.filter((c) => c !== brand) // remove if exists
        : [...prev.brands, brand], // add if not
    }));
  };
  const handleRemove = (type, value) => {
    if (type === "category") {
      setFilters((prev) => ({
        ...prev,
        category: prev.category.filter((c) => c !== value),
      }));
    }

    if (type === "priceRange") {
      setFilters((prev) => ({
        ...prev,
        priceRange: [0, 10000], // adjust to your default
      }));

      setMaxPrice(10000);
      setMinPrice(0);
    }

    if (type === "sortBy") {
      setfiltersortby(""); // reset sort to default
    }
  };
  const resetFilter = () => {
    if (category) {
      setFilters((prev) => ({
        ...prev,
        category: [category],
      }));
    } else {
      setFilters((prev) => ({
        ...prev,
        category: [],
      }));
    }

    setFilters((prev) => ({
      ...prev,
      priceRange: [0, 10000], // adjust to your default
    }));

    setMaxPrice(10000);
    setMinPrice(0);

    setfiltersortby("Popularity"); // reset sort to default
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const priceOptions = [
    0, 1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000, 5500, 6000, 6500,
    7000, 7500, 8000, 8500, 9000, 9500, 10000,
  ];

  const handleopencloseoffilter = (filter) => {
    switch (filter) {
      case "shop":
        setIsShopCatOpen(true);
        setIsPriceOpen(false);
        break;

      case "price":
        setIsShopCatOpen(false);
        setIsPriceOpen(true);
        break;

      default:
        break;
    }
  };

  const handleResetOfFilter = () => {
    setIsfilteropen(false);
  };

  return (
    <div>
      <ToastContainer />
      <div className="">
        <Header />
      </div>
      <section ref={containerRef}>
        <div className=" hidden lg:block lg:container lg:mx-auto my-6 lg:my-10">
          <SectionHeader title={"Shop "} isborder={false} />
        </div>
      </section>

      <section>
        <div className=" flex lg:hidden justify-between items-center font-TimesNewRoman text-base text-[#ccc] px-6 border-t border-b border-[#ccc] mb-4">
          <button onClick={() => setIsSortOpen(!isSortOpen)}>Sort</button>
          <button onClick={() => setIsfilteropen(true)}>Filter</button>
        </div>
      </section>

      {isfilterOpen && (
        <div
          className={`absolute top-[80px] left-0 w-full h-[87vh] z-50 bg-white border rounded-3xl p-5 transition-transform ease-in-out duration-500 transform animate-fade-in flex flex-col justify-center ${
            isfilterOpen ? "translate-y-0" : "-translate-y-full"
          }`}
        >
          <div className="flex justify-between items-center border-b border-b-[#ccc] pb-2">
            <div className="flex gap-2 items-center">
              <button onClick={() => handleResetOfFilter()}>
                <MdKeyboardArrowLeft size={30} color="#304778" />{" "}
              </button>
              <h2 className="uppercase text-[#304778] text-sm leading-[22.4px] ">
                filter
              </h2>
            </div>
            <div>
              <button
                onClick={resetFilter}
                className="px-4 py-1 hover:bg-[#334A78] border border-[#ccc] text-[#334a78] hover:text-white"
              >
                Reset
              </button>
            </div>
          </div>
          <div className="font-TimesNewRoman flex flex-1 overflow-y-auto pr-2 ">
            <div className="flex-1 flex mt-2">
              <ul
                className={`flex flex-col items-start uppercase [&:li]:bg-[#eee] [&_li]:w-full [&_li]:px-2 [&_li]:py-2 [&_li]:pb-3 p-1 text-xs font-bold text-[#1A293A] [&_li]:cursor-pointer `}
              >
                <li
                  className={`${isShopCatOepn ? "bg-[#fff]" : "bg-[#eee]"}`}
                  onClick={() => handleopencloseoffilter("shop")}
                >
                  shop by categories
                </li>
                <li
                  className={`${isPriceOpen ? "bg-[#fff]" : "bg-[#eee] "} `}
                  onClick={() => handleopencloseoffilter("price")}
                >
                  price
                </li>
              </ul>
            </div>
            <div className="flex-1">
              {isShopCatOepn && (
                <div>
                  <div className="space-y-4 p-2">
                    {categoryies.map((cat, i) => (
                      <label
                        key={i}
                        className="flex items-center space-x-3 cursor-pointer"
                      >
                        <div
                          className={`w-5 h-5 border-2 rounded-sm flex items-center justify-center ${
                            filters.category.includes(cat.name)
                              ? "bg-[#2A3E65] border-[#2A3E65]"
                              : "border-[#2A3E65]"
                          }`}
                          onClick={() => handleCategoryClick(cat.name)}
                        >
                          {/* You can add a checkmark or leave it blank */}
                        </div>
                        <span className="text-sm text-[#000000] font-medium">
                          {cat.name}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {isPriceOpen && (
                <div className=" bg-white">
                  {/* Min and Max Dropdowns */}
                  <div className="flex flex-wrap justify-around gap-1 mb-4 pt-2">
                    <select
                      className="border px-2 py-1 text-[#334A78] text-sm border-[#CCD2DD]"
                      value={minPrice}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        if (value <= maxPrice) setMinPrice(value);
                      }}
                    >
                      {priceOptions.map((price) => (
                        <option key={price} value={price}>
                          ₹{price === 0 ? "Min" : price}
                        </option>
                      ))}
                    </select>

                    <select
                      className="border px-2 py-1 text-[#334A78] text-sm"
                      value={maxPrice}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        if (value >= minPrice) setMaxPrice(value);
                      }}
                    >
                      {priceOptions.map((price) => (
                        <option key={price} value={price}>
                          ₹{price === 10000 ? "10000+" : price}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Price Range Slider */}
                  <div className="mt-2">
                    <input
                      type="range"
                      min={minPrice}
                      max={10000}
                      step={500}
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                      className="w-full accent-[#334A78]"
                    />
                    <div className="flex justify-between text-xs text-gray-600 mt-1">
                      <span>₹{minPrice}</span>
                      <span>₹{maxPrice}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* display of no of products  */}
          <div className="flex justify-between items-center mt-5 font-TimesNewRoman">
            <div>
              <h2 className="text-[#000] font-semibold text-xl tracking-[1.2px]">
                {items?.length}
              </h2>
              <p className="text-[#ccc] text-sm leading-4 -tracking-[1px]  font-semibold">
                product found
              </p>
            </div>
            <div>
              <button
                onClick={() => setIsfilteropen(false)}
                className="px-5 py-[10px] bg-[#334A78] text-white border border-[#212B36] font-TimesNewRoman font-semibold text-sm leading-[15px] tracking-[1.2px]"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {isSortOpen && (
        <div
          className={`fixed bottom-0 left-0 w-full  z-50 bg-white border rounded-3xl  transition-transform ease-in-out duration-500 transform animate-fade-in flex flex-col justify-center ${
            isSortOpen ? "translate-y-0 " : "-translate-y-full"
          }`}
        >
          <div className="flex items-center border-b border-b-[#ccc]">
            <button onClick={() => setIsSortOpen(false)}>
              <MdKeyboardArrowLeft size={30} color="#304778" />{" "}
            </button>
            <h2 className="uppercase text-[#304778] text-sm leading-[22.4px] ">
              Sort By
            </h2>
          </div>
          <div className="space-y-4 p-2">
            {options.map((opt, i) => (
              <label
                key={i}
                className="flex items-center justify-between space-x-3 cursor-pointer"
              >
                <span className="text-sm text-[#000000] font-medium">
                  {opt.option}
                </span>
                <div
                  className={`w-5 h-5 border-2 rounded-full flex items-center justify-center ${
                    filtersortby === opt.value
                      ? "bg-[#2A3E65] border-[#2A3E65]"
                      : "border-[#2A3E65]"
                  }`}
                  onClick={() => handleSortby(opt)}
                ></div>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* section 2 */}
      <section className="font-TimesNewRoman lg:container lg:mx-auto px-4 lg:px-12">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left side filters */}
          <div className="hidden lg:flex flex-col items-center gap-6 lg:w-[20%] w-full border-r pr-4 border-r-[#CCCCCC]">
            <div className="w-full space-y-4 [&_h4]:capitalize">
              <div className="flex justify-between gap-2 items-center text-[#334A78] ">
                <div className="flex gap-2">
                  <IoFilter size={20} />
                  <h3 className="font-bold text-sm">Filter</h3>
                </div>
                <div>
                  <button
                    onClick={resetFilter}
                    className="px-4 py-1 hover:bg-[#334A78] border border-[#ccc] text-[#334a78] hover:text-white"
                  >
                    Reset Filter
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-[#334A78] text-[15px] font-bold leading-[24px]">
                    Out of stock
                  </h3>
                </div>

                <div className="relative flex border border-[#334A78] rounded w-fit overflow-hidden">
                  <span
                    className={`absolute top-0 left-0 h-full w-1/2 bg-[#334A78] transition-transform duration-300 ease-in-out rounded ${
                      showAvailableOnly ? "translate-x-full" : "translate-x-0"
                    }`}
                  ></span>

                  <button
                    onClick={() => setShowAvailableOnly(false)}
                    className={`relative z-10 px-4 py-1 text-[15px] font-medium transition-colors duration-300 ${
                      !showAvailableOnly ? "text-white" : "text-[#334A78]"
                    }`}
                  >
                    Show
                  </button>

                  <button
                    onClick={() => setShowAvailableOnly(true)}
                    className={`relative z-10 px-4 py-1 text-[15px] font-medium transition-colors duration-300 ${
                      showAvailableOnly ? "text-white" : "text-[#334A78]"
                    }`}
                  >
                    Hide
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center text-[#334A78]">
                <h4 className="text-[15px] font-bold leading-[24px]">
                  Shop by Categories
                </h4>
                <button
                  className=""
                  onClick={() =>
                    isShopCatOepn
                      ? setIsShopCatOpen(false)
                      : setIsShopCatOpen(true)
                  }
                >
                  {isShopCatOepn ? (
                    <MdKeyboardArrowUp size={25} />
                  ) : (
                    <MdKeyboardArrowDown size={25} />
                  )}
                </button>
              </div>
              {isShopCatOepn && (
                <div>
                  <ul className="font-TimesNewRoman space-y-3">
                    {categoryies.map((cat) => (
                      <li
                        onClick={() => handleCategoryClick(cat.name)}
                        // onClick={() => setFilterCatName(cat.name)}
                        className={`text-[#111] px-4 py-1 text-sm cursor-pointer ${
                          filters.category.includes(cat.name)
                            ? "border-2 border-[#334A78] bg-[#334A78] text-white"
                            : "hover:bg-[#F4F4F4]"
                        } `}
                        key={cat.name}
                      >
                        {cat.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="flex justify-between items-center text-[#334A78]">
                <h4 className="text-[15px] font-semibold leading-[24px]">
                  price
                </h4>
                <button
                  className=""
                  onClick={() =>
                    isPriceOpen ? setIsPriceOpen(false) : setIsPriceOpen(true)
                  }
                >
                  {isPriceOpen ? (
                    <MdKeyboardArrowUp size={25} />
                  ) : (
                    <MdKeyboardArrowDown size={25} />
                  )}
                </button>
              </div>

              {isPriceOpen && (
                <div className=" bg-white">
                  {/* Min and Max Dropdowns */}
                  <div className="flex flex-wrap justify-around gap-2 mb-4">
                    <select
                      className="border px-5 py-2 text-[#334A78] text-sm border-[#CCD2DD]"
                      value={minPrice}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        if (value <= maxPrice) setMinPrice(value);
                      }}
                    >
                      {priceOptions.map((price) => (
                        <option key={price} value={price}>
                          ₹{price === 0 ? "Min" : price}
                        </option>
                      ))}
                    </select>

                    <select
                      className="border px-5 py-2 text-[#334A78] text-sm"
                      value={maxPrice}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        if (value >= minPrice) setMaxPrice(value);
                      }}
                    >
                      {priceOptions.map((price) => (
                        <option key={price} value={price}>
                          ₹{price === 10000 ? "10000+" : price}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Price Range Slider */}
                  <div className="mt-2">
                    <input
                      type="range"
                      min={minPrice}
                      max={10000}
                      step={500}
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                      className="w-full accent-[#334A78]"
                    />
                    <div className="flex justify-between text-xs text-gray-600 mt-1">
                      <span>₹{minPrice}</span>
                      <span>₹{maxPrice}</span>
                    </div>
                  </div>
                </div>
              )}
              <div className="flex justify-between items-center text-[#334A78]">
                <h4 className="text-[15px] font-semibold leading-[24px]">
                  Brand
                </h4>
                <button
                  className=""
                  onClick={() =>
                    isBrandOpen ? setIsBrandopen(false) : setIsBrandopen(true)
                  }
                >
                  {isBrandOpen ? (
                    <MdKeyboardArrowUp size={25} />
                  ) : (
                    <MdKeyboardArrowDown size={25} />
                  )}
                </button>
              </div>

              {isBrandOpen && (
                <div className="space-y-2">
                  {allBrands.map((brand) => (
                    <label
                      key={brand}
                      checked={
                        filters.brands.length === 1 &&
                        filters.brands.includes(brand)
                      }
                      onClick={() => handleBrandClick(brand)}
                      className="flex items-center gap-2 cursor-pointer text-[#111] text-sm"
                    >
                      <input
                        type="checkbox"
                        className="w-4 h-4 cursor-pointer text-[#111] capitalize"
                      />
                      {brand}
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>
          {!productsloading ? (
            <div className="lg:w-[80%] w-full ">
              <div className="hidden lg:block border-b border-b-[#CCCCCC] mb-3 pb-2">
                <div className="flex justify-between  font-TimesNewRoman mb-2 ">
                  <p className="text-[#191716] text-xs lg:text-[13px] leading-3 tracking-[1px]">
                    {resultText}
                  </p>
                  <div
                    ref={dropdownRef}
                    className="relative text-nowrap w-52 font-TimesNewRoman text-[#334A78] text-xs lg:text-[15px] leading-[24px]"
                  >
                    <div
                      className="flex items-center border border-[#CCCCCC] p-2 cursor-pointer"
                      onClick={() => setOpen(!open)}
                    >
                      <p className="mr-2">Sort by:</p>
                      <p className="font-semibold capitalize">{filtersortby}</p>
                      <span className="ml-auto text-xl">
                        {" "}
                        {open ? (
                          <MdKeyboardArrowUp size={25} />
                        ) : (
                          <MdKeyboardArrowDown size={25} />
                        )}
                      </span>
                    </div>

                    {open && (
                      <ul className="absolute left-0 mt-1 w-full bg-white border border-[#CCCCCC] z-50 shadow-md rounded-sm">
                        {options.map((opt, idx) => (
                          <li
                            key={idx}
                            className={`px-4 py-2 capitalize cursor-pointer ${
                              filtersortby === opt.value
                                ? "border-2 border-[#334A78]"
                                : ""
                            } hover:bg-[#F4F4F4]`}
                            onClick={() => handleSortby(opt)}
                          >
                            {opt.option}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {/* Category Filters */}
                  {filters.category.map((cat, i) => (
                    <span
                      key={`cat-${i}`}
                      className="hover:border-[#666] flex items-center px-3 py-1 border border-[#CCCCCC] text-[#666] text-sm bg-white"
                    >
                      <p>{cat}</p>
                      <button
                        onClick={() => handleRemove("category", cat)}
                        className="ml-1 text-lg"
                      >
                        ×
                      </button>
                    </span>
                  ))}

                  {/* Price Range Filter */}

                  {filters.priceRange && (
                    <span className="flex gap-3 items-center px-3 py-1 border border-[#CCCCCC] text-[#666] text-sm bg-white">
                      <p>
                        ₹{filters.priceRange[0]} - ₹
                        {filters.priceRange[1] === 10000
                          ? filters.priceRange[1] + "+"
                          : filters.priceRange[1]}
                      </p>
                      <button onClick={() => handleRemove("priceRange")}>
                        ×
                      </button>
                    </span>
                  )}

                  {/* Sort By Tag */}
                  {filtersortby && filtersortby !== "Popularity" && (
                    <span className="flex items-center px-3 py-1 border border-[#CCCCCC] text-[#666] text-sm bg-white">
                      <p>
                        Sort:{" "}
                        {filtersortby === "low"
                          ? "Price: Low to High"
                          : filtersortby === "high"
                          ? "Price: High to Low"
                          : filtersortby}
                      </p>
                      <button
                        onClick={() => setfiltersortby("")}
                        className="ml-1 text-lg"
                      >
                        ×
                      </button>
                    </span>
                  )}
                </div>
              </div>
              {/* display of products */}
              {currentItems.length === 0 && (
                <p className="text-center">No products found</p>
              )}
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {currentItems.map((product, index) => (
                  <div key={index}>
                    <Card product={product} />
                  </div>
                ))}
              </div>
              <div className="my-6">
                <PagInationNav
                  totalPages={totalPages}
                  handlePageChange={goToPage}
                  currentPage={currentPage}
                />
              </div>
            </div>
          ) : (
            <div className="w-full flex justify-center items-center">
              <SpinnerFullPage />
            </div>
          )}
        </div>
      </section>

      <footer>
        <Footer />
      </footer>
    </div>
  );
}

export default ShopProducts;

function SectionHeader({ title, isborder = true }) {
  return (
    <div className="flex flex-col justify-center items-center mb-10">
      <h3 className="font-TimesNewRoman text-2xl text-[#111] tracking-wider uppercase mb-2">
        {title}
      </h3>
      {isborder && (
        <p className="w-[20%] lg:w-[4%] h-[1.5px] bg-[#374A75] "></p>
      )}
    </div>
  );
}

function Card({ product }) {
  const { handleAddToCart, handleAddtoWishlist } = useHandleAddToCart();
  const { isAuthenticated, localcartItems, cartItems, wishlistItems } =
    useApp();

  const isWishlisted = wishlistItems?.some(
    (item) => item.productId?.id === product.id
  );

  const [iscarted, setIsCarted] = useState(false);

  const naviagte = useNavigate();

  useEffect(() => {
    if (!product?.id) return;

    if (isAuthenticated) {
      const check = cartItems?.some(
        (item) => item.productId?.id === product.id
      );
      setIsCarted(check);
    } else {
      const check = localcartItems?.some(
        (item) => item.productId?.id === product.id
      );
      setIsCarted(check);
    }
  }, [isAuthenticated, cartItems, localcartItems, product?.id]);

  return (
    <div className="font-TimesNewRoman max-w-sm max-h-sm border border-[#ccc]">
      <div
        onClick={() =>
          naviagte(`/productview/${product.id}`, { state: { from: "shop" } })
        }
        className="flex justify-center items-center p-2 cursor-pointer"
      >
        <img
          src={product.image}
          alt={product.product_id?.category}
          className="h-52 object-contain"
        />
      </div>
      <div className="bg-[#fff] p-1.5 lg:p-2">
        <div className="flex flex-col md:flex-row ">
          <div className="flex-1 text-sm leading-[22.4px] text-[#111]">
            <h4
              title={product?.title}
              className="font-medium text-sm leading-[22.4px] line-clamp-1 capitalize"
            >
              {product?.title}
            </h4>
            <div className="flex items-center gap-2 flex-wrap xl:flex-nowrap">
              <p className="text-nowrap">
                RS {product?.ecommercePrice?.sellingPrice || "Rs 3,0000"}
              </p>
              <p className="line-through text-[#111] text-opacity-50 text-nowrap">
                RS {product?.ecommercePrice?.mrp || "Rs 3,0000"}
              </p>
              <p className="text-[#C20000] uppercase">sale</p>
            </div>
          </div>
          <div
            onClick={() => handleAddtoWishlist(product)}
            className="text-[#ccc] hover:text-red-600 cursor-pointer"
          >
            {isWishlisted ? (
              <AiFillHeart size={20} color="red" />
            ) : (
              <GoHeart size={20} />
            )}
          </div>
        </div>
        {product.stockQty > 0 ? (
          <button
            onClick={() => handleAddToCart(product, iscarted)}
            className="text-[#000] uppercase bg-[#FFFFFF] text-xs border border-[#ccc] px-2 py-2 rounded-sm "
          >
            {iscarted ? "Go to cart" : "Add to cart"}{" "}
          </button>
        ) : (
          <span className="text-xs text-red-500 font-semibold">
            Out of stock
          </span>
        )}
      </div>
    </div>
  );
}
