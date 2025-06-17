import { useEffect, useRef, useState } from "react";
import { supabase } from "../../services/supabase";
import SpinnerFullPage from "../../common-components/SpinnerFullPage";
import { FaHeart } from "react-icons/fa";
import { IoFilter } from "react-icons/io5";
import {
  MdKeyboardArrowLeft,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
} from "react-icons/md";
import { FaArrowRightLong, FaArrowLeftLong } from "react-icons/fa6";

import Header from "./Header";

import { useHandleAddToCart } from "../../utils/HelperFunction";

import { useApp } from "../../Context/Context";
import { ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

function ShopProducts() {
  const [products, setProducts] = useState([]);
  const [productsloading, setProductsloading] = useState(true);
  const containerRef = useRef(null);
  const [open, setOpen] = useState(false);

  const [filterCatName, setFilterCatName] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]);
  // const [filters, setFilters] = useState({
  //   category: [],
  //   priceRange: [0, 100000],
  // });

  const { filters, setFilters } = useApp();

  const [currentPage, setCurrentPage] = useState(1);

  const [isShopCatOepn, setIsShopCatOpen] = useState(false);

  const [filtersortby, setfiltersortby] = useState("");

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

  const applyFiltersAndSort = (products, filters, sortBy) => {
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

    // Price Filter
    result = result.filter(
      (product) =>
        product.price >= filters.priceRange[0] &&
        product.price <= filters.priceRange[1]
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

    return result;
  };

  useEffect(() => {
    const updated = applyFiltersAndSort(products, filters, filtersortby);
    setFilteredProducts(updated);
  }, [filters, filtersortby, products]);

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
        .order("created_at", { ascending: false });

      if (error) throw error;

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

      console.log(updatedProducts);
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
    // {
    //   name: `Civil & Plumbing`,
    //   imagename: "/images/icons/CivilPlumbing.png",
    // },
    {
      name: "Flooring",
      imagename: "/images/icons/Flooring.png",
    },
    // {
    //   name: "Partition",
    //   imagename: "/images/icons/PartitionsCeilings.png",
    // },
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
    { option: "Popularity", value: "" },
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
        priceRange: [0, 100000], // adjust to your default
      }));
    }

    if (type === "sortBy") {
      setfiltersortby(""); // reset sort to default
    }
  };

  return (
    <div>
      <ToastContainer />
      <Header />
      <section ref={containerRef}>
        <div className="lg:container lg:mx-auto my-10">
          <SectionHeader title={"Shop "} isborder={false} />
          <div className="flex overflow-x-auto items-center justify-around my-10 gap-6">
            {categoryies.map((cat) => (
              <div
                className="flex flex-col lg:justify-center  lg:items-center gap-3"
                key={cat.name}
              >
                <div className="bg-[#F8F8F8] border border-[#ccc] p-4 w-16 h-16 xl:w-20 xl:h-20">
                  <img src={cat.imagename} alt="category" className="" />
                </div>
                <h3 className="font-lora text-[#111] text-xs lg:text-sm">
                  {cat.name}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* section 2 */}
      <section className="font-Poppins container mx-auto">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left side banners */}
          <div className="flex flex-col items-center gap-6 md:w-[20%] w-full ">
            <div className="w-full space-y-4">
              <div className="flex justify-start gap-2 items-center text-[#334A78] ">
                <div>
                  <IoFilter size={20} />
                </div>
                <h3 className="font-semibold text-sm">Filter(1) </h3>
                <div>
                  <MdKeyboardArrowLeft size={20} />
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-[#334A78] text-[15px] font-semibold leading-[24px]">
                    Out of stock
                  </h3>
                </div>
                <div className="flex gap-2">
                  <button className="text-[#334A78]  ">show</button>
                  <button className="text-[15px] text-[#334A78] border border-[#334A78] p-1">
                    Hide
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-center text-[#334A78]">
                <h4 className="text-[15px] font-semibold leading-[24px]">
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
                  <ul className="font-lora space-y-3">
                    {categoryies.map((cat) => (
                      <li
                        onClick={() => handleCategoryClick(cat.name)}
                        // onClick={() => setFilterCatName(cat.name)}
                        className="text-[#111] text-sm cursor-pointer"
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
                <div className="">
                  <MdKeyboardArrowDown size={25} />
                </div>
              </div>
              <div className="flex justify-between items-center text-[#334A78]">
                <h4 className="text-[15px] font-semibold leading-[24px]">
                  color
                </h4>
                <div className="">
                  <MdKeyboardArrowDown size={25} />
                </div>
              </div>
              <div className="flex justify-between items-center text-[#334A78]">
                <h4 className="text-[15px] font-semibold leading-[24px]">
                  brand
                </h4>
                <div className="">
                  <MdKeyboardArrowDown size={25} />
                </div>
              </div>
            </div>
          </div>
          {!productsloading ? (
            <div className="md:w-[80%] w-full ">
              <div className="border-b border-b-[#CCCCCC] mb-3 pb-2">
                <div className="flex justify-between items-center font-lora ">
                  <p className="text-[#191716]  text-[13px] leading-3 tracking-[1px]">
                    {resultText}
                  </p>
                  <div className="relative w-52 font-Poppins text-[#334A78] text-[15px] leading-[24px]">
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
                  {filters.priceRange[0] > 0 ||
                  filters.priceRange[1] < 100000 ? (
                    <span className="flex items-center px-3 py-1 border border-[#CCCCCC] text-[#666] text-sm bg-white">
                      <p>
                        ₹{filters.priceRange[0]} – ₹{filters.priceRange[1]}
                      </p>
                      <button
                        onClick={() => handleRemove("priceRange")}
                        className="ml-1 text-lg"
                      >
                        ×
                      </button>
                    </span>
                  ) : null}

                  {/* Sort By Tag */}
                  {filtersortby && filtersortby !== "popularity" && (
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

              <div className="grid grid-cols-5 gap-8 ">
                {currentItems.map((product, index) => (
                  <div key={index}>
                    <Card product={product} />
                  </div>
                ))}
              </div>
              <div className="flex justify-center my-10">
                <div className="flex gap-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => goToPage(currentPage - 1)}
                    className="px-5 py-2  rounded disabled:hidden"
                  >
                    <FaArrowLeftLong />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => goToPage(i + 1)}
                      className={`px-5 py-2 rounded font-lora font-semibold ${
                        currentPage === i + 1
                          ? "bg-[#304778] text-white"
                          : "bg-[#fff] text-[#232323]"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => goToPage(currentPage + 1)}
                    className="px-5 py-2 rounded disabled:hidden"
                  >
                    <FaArrowRightLong />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full flex justify-center items-center">
              <SpinnerFullPage />
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default ShopProducts;

function SectionHeader({ title, isborder = true }) {
  return (
    <div className="flex flex-col justify-center items-center mb-10">
      <h3 className="font-lora text-2xl text-[#111] tracking-wider uppercase mb-2">
        {title}
      </h3>
      {isborder && (
        <p className="w-[20%] lg:w-[4%] h-[1.5px] bg-[#374A75] "></p>
      )}
    </div>
  );
}

function Card({ product }) {
  const { handleAddToCart } = useHandleAddToCart();
  const { isAuthenticated, localcartItems, cartItems } = useApp();

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
    <div className="font-Poppins max-w-sm max-h-sm  border border-[#ccc]">
      <div
        onClick={() => naviagte(`/productview/${product.id}`)}
        className="flex justify-center items-center p-2 cursor-pointer"
      >
        <img
          src={product.image}
          alt={product.product_id?.category}
          className="h-52 object-contain"
        />
      </div>
      <div className="bg-[#fff] p-2">
        <div className="flex ">
          <div className="flex-1 text-sm  leading-[22.4px]  text-[#111] ">
            <h4 className="font-medium text-sm leading-[22.4px] ">
              {product?.title}
            </h4>
            <div className="flex items-center gap-2">
              <p className=" ">Rs {product?.price || "Rs 3,0000"}</p>
              <p className="line-through text-[#111] text-opacity-50">
                Rs $5678
              </p>
              <p className="text-[#C20000]">sale</p>
            </div>
          </div>
          <div className=" text-[#ccc] hover:text-red-950 ">
            <FaHeart size={25} />
          </div>
        </div>
        <button
          onClick={() => handleAddToCart(product)}
          disabled={iscarted}
          className="text-[#000] uppercase bg-[#FFFFFF] text-xs border border-[#ccc] px-2  py-2 rounded-sm "
        >
          {iscarted ? "Added to cart" : "Add to cart"}{" "}
        </button>
      </div>
    </div>
  );
}
