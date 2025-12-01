import { useEffect, useState, useRef, useMemo } from "react";
import { useApp } from "../../Context/Context";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaStar } from "react-icons/fa";
import { GoDash, GoPlus } from "react-icons/go";
import { PiStarFourFill } from "react-icons/pi";
import { IoMdSettings } from "react-icons/io";
import { RiVipCrown2Fill } from "react-icons/ri";
import { HiMiniCheckBadge } from "react-icons/hi2";
import PagInationNav from "../../common-components/PagInationNav";

// Animation settings for easy customization
const animations = {
  fadeInLeft: {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.0, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      x: 50,
      transition: { duration: 0.3, ease: "easeInOut" },
    },
  },
};

function ProductCard({
  products,
  selectedProductView,
  setSelectedProductView,
  // setShowProductView,
  userResponses,
  setShowSelectArea,
}) {
  const navigate = useNavigate();

  const {
    selectedCategory,
    selectedSubCategory,
    selectedSubCategory1,
    selectedPlan,
    loading,
    setLoading,
    selectedData,
  } = useApp();

  const dropdownRef = useRef(null);
  const planOptions = ["Minimal", "Exclusive", "Luxury", "Custom"];

  const productsInCategory = products[selectedCategory?.category] || [];
  // const [loading, setLoading] = useState(true);
  const [loadingImages, setLoadingImages] = useState({}); // Track image loading

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [openSection, setOpenSection] = useState("plan");
  const [selectedPlanFilter, setSelectedPlanFilter] = useState(selectedPlan);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [sortOption, setSortOption] = useState("newest");
  const [isSortOpen, setIsSortOpen] = useState(false);

  const toggleSection = (section) => {
    setOpenSection((prev) => (prev === section ? null : section));
  };

  const productsInSubCategory = productsInCategory[selectedSubCategory] || [];

  // Move `filteredProducts` ABOVE useEffect
  const filteredProducts = productsInSubCategory
    .filter((product) => {
      if (selectedCategory.category === "HVAC") {
        if (userResponses.hvacType === "Centralized") {
          return product.subcategory1 === "Centralized AC";
        } else {
          return product.subcategory1 === selectedSubCategory1;
        }
      } else {
        return product.subcategory1 === selectedSubCategory1;
      }
    })
    .flatMap((product) =>
      (product.product_variants || [])
        .filter((variant) => {
          if (!selectedBrands || selectedBrands.length === 0) return true;

          const brandName =
            (variant.profiles && variant.profiles.company_name) ||
            variant.manufacturer ||
            "";

          return selectedBrands.includes(brandName);
        })
        .map((variant) => ({
          // keep all existing variant fields
          ...variant,
          // add the parent product's fields you want
          category: product.category,
          subcategory: product.subcategory
            ? product.subcategory.split(",").map((s) => s.trim())
            : [],
          subcategory1: product.subcategory1,
          // optional: keep original product id too if you need it
          product_id: product.id || variant.product_id || product.product_id,
        }))
    );

  const brandsList = Array.from(
    new Set(
      productsInSubCategory
        .flatMap((product) =>
          product.subcategory1 === selectedSubCategory1
            ? product.product_variants || []
            : []
        )
        .map((variant) =>
          variant.profiles && variant.profiles.company_name
            ? variant.profiles.company_name
            : null
        )
        .filter(Boolean)
    )
  );

  // Now filter variants based on the selected plan.
  // If the plan is "Custom", show all variants. Otherwise, only show variants whose segment matches the selected plan.
  // const filteredVariants = filteredProducts.filter((variant) => {
  //   if (selectedPlan === "Custom") return true;

  //   return (
  //     variant.segment &&
  //     variant.segment.toLowerCase() === selectedPlan.toLowerCase()
  //   );
  // });

  const filteredVariants = filteredProducts.filter((variant) => {
    if (selectedPlanFilter === "Custom") return true;

    return (
      variant.segment &&
      variant.segment.toLowerCase() === selectedPlanFilter.toLowerCase()
    );
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const totalPages = Math.ceil(filteredVariants.length / itemsPerPage);

  const sortedVariants = useMemo(() => {
    const arr = [...filteredVariants];
    if (sortOption === "priceLowHigh") {
      arr.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortOption === "priceHighLow") {
      arr.sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (sortOption === "newest") {
      arr.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }
    return arr;
  }, [filteredVariants, sortOption]);

  const paginatedVariants = sortedVariants.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    const updateItemsPerPage = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setItemsPerPage(14); // Mobile
      } else if (width < 1024) {
        setItemsPerPage(15); // Tablet
      } else if (width < 1280) {
        setItemsPerPage(20); // Laptop
      } else if (width < 1800) {
        setItemsPerPage(20); // Laptop L
      } else if (width >= 1800) {
        setItemsPerPage(24); // 4k
      } else {
        setItemsPerPage(12);
      }
    };

    updateItemsPerPage(); // Initial run
    window.addEventListener("resize", updateItemsPerPage);
    return () => window.removeEventListener("resize", updateItemsPerPage);
  }, []);

  useEffect(() => {
    // setLoading(filteredVariants.length === 0);
    if (setLoading) {
      // console.log(setLoading);

      setTimeout(() => {
        setLoading(false);
      }, 2000);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // const timeoutRef = useRef(null);

  // useEffect(() => {
  //   if (filteredVariants.length === 0) {
  //     setLoading(true);

  //     timeoutRef.current = setTimeout(() => {
  //       if (filteredVariants.length === 0) {
  //         setLoading(false);
  //         console.log("Array is still empty after 4 seconds");
  //       }
  //     }, 2000);
  //   } else {
  //     setLoading(false);
  //     clearTimeout(timeoutRef.current);
  //   }

  //   return () => clearTimeout(timeoutRef.current);
  // }, [filteredVariants]);

  if (!productsInCategory) {
    return <p>Category "{selectedCategory?.category}" not found.</p>;
  }

  if (!productsInSubCategory) {
    return (
      <p>
        Subcategory "{selectedSubCategory}" not found in category "
        {selectedCategory?.category}".
      </p>
    );
  }

  const handleImageLoad = (id) => {
    setLoadingImages((prev) => ({ ...prev, [id]: false }));
  };

  const filterSelectedProduct = selectedData.filter((data) => {
    return (
      data.category === selectedCategory?.category &&
      data.subcategory === selectedSubCategory &&
      data.subcategory1 === selectedSubCategory1
    );
  });

  return (
    <div>
      <div className="product-card grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 3xl:grid-cols-6 gap-6 pb-8 pt-3 relative">
        <div className="absolute right-0 md:right-6 -top-12" ref={dropdownRef}>
          {/* FILTER BUTTON */}
          <div className="flex gap-2 items-center">
            <button
              className="flex items-center gap-2 border border-black px-2 lg:px-4 py-2 text-sm"
              onClick={() => setIsFilterOpen((prev) => !prev)}
            >
              <span className="hidden lg:block">Filter</span>
              <img
                src="/images/boq/filter.png"
                alt="Filter"
                className="w-4 h-4"
              />
            </button>
            <button
              className="flex items-center gap-2 border border-black px-2 lg:px-4 py-2 text-sm"
              onClick={() => setIsSortOpen((prev) => !prev)}
            >
              <span className="hidden lg:block">Sort by:</span>
              <span className="font-medium text-xs lg:text-sm">
                {sortOption === "priceLowHigh" && "Price: Low to High"}
                {sortOption === "priceHighLow" && "Price: High to Low"}
                {sortOption === "newest" && "Newest Arrival"}
              </span>
            </button>
          </div>

          {/* FILTER PANEL (Plan + Brand) */}
          {isFilterOpen && (
            <div className="absolute mt-2 w-36 bg-white shadow-lg z-20">
              {/* PLAN SECTION */}
              <div className="border-x border-t">
                <button
                  className="flex w-full items-center justify-between px-4 py-3 text-sm"
                  onClick={() => toggleSection("plan")}
                >
                  <span className="font-semibold text-[#334A78]">Plan</span>
                  <span className="text-sm">▾</span>
                </button>

                {openSection === "plan" && (
                  <div className="border-t border-black">
                    {planOptions.map((option) => (
                      <button
                        key={option}
                        onClick={() => setSelectedPlanFilter(option)}
                        className={
                          "flex items-center justify-between w-full px-4 py-3 border-b border-black text-sm " +
                          (selectedPlanFilter === option
                            ? "bg-[#374A75] text-white font-semibold"
                            : "bg-white text-black")
                        }
                      >
                        <span className="flex items-center">
                          {option === "Exclusive" && (
                            <div className="relative">
                              <PiStarFourFill
                                className="absolute -top-1 -right-1"
                                size={8}
                                color={
                                  selectedPlanFilter === option
                                    ? "#fff"
                                    : "#334A78"
                                }
                              />
                              <PiStarFourFill
                                size={16}
                                color={
                                  selectedPlanFilter === option
                                    ? "#fff"
                                    : "#334A78"
                                }
                              />
                            </div>
                          )}
                          {option === "Luxury" && (
                            <RiVipCrown2Fill
                              size={16}
                              color={
                                selectedPlanFilter === option
                                  ? "#fff"
                                  : "#334A78"
                              }
                            />
                          )}
                          {option === "Minimal" && (
                            <FaStar
                              size={16}
                              color={
                                selectedPlanFilter === option
                                  ? "#fff"
                                  : "#334A78"
                              }
                            />
                          )}
                          {option === "Custom" && (
                            <IoMdSettings
                              size={18}
                              color={
                                selectedPlanFilter === option
                                  ? "#fff"
                                  : "#334A78"
                              }
                            />
                          )}
                        </span>
                        <span>{option}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* BRAND SECTION */}
              <div className="border">
                <button
                  className="flex w-full items-center justify-between px-4 py-3 text-sm"
                  onClick={() => toggleSection("brand")}
                >
                  <span className="font-semibold text-[#334A78]">Brand</span>
                  <span className="text-xs">▾</span>
                </button>

                {openSection === "brand" && (
                  <div className=" px-4 py-3 space-y-2 text-sm">
                    {brandsList.map((brand) => {
                      const checked = selectedBrands.includes(brand);
                      return (
                        <label
                          key={brand}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            className="h-4 w-4 border border-black"
                            checked={checked}
                            onChange={() => {
                              setSelectedBrands((prev) =>
                                checked
                                  ? prev.filter((b) => b !== brand)
                                  : [...prev, brand]
                              );
                            }}
                          />
                          <span className="flex-1">{brand}</span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
          {isSortOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg border border-black z-20 text-sm">
              {["priceLowHigh", "priceHighLow", "newest"].map((opt) => {
                const label =
                  opt === "priceLowHigh"
                    ? "Price: Low to High"
                    : opt === "priceHighLow"
                    ? "Price: High to Low"
                    : "Newest Arrival";
                const active = sortOption === opt;
                return (
                  <button
                    key={opt}
                    onClick={() => {
                      setSortOption(opt);
                      setIsSortOpen(false);
                    }}
                    className={
                      "w-full text-left px-3 py-2 border-b last:border-b-0 " +
                      (active ? "bg-[#374A75] text-white font-semibold" : "")
                    }
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {loading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <motion.div
              key={index}
              className="flex flex-col justify-center items-center bg-white rounded-lg shadow-md my-2 px-3"
              variants={animations.fadeInLeft}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {/* Image Skeleton */}
              <div className="w-full aspect-[4/3] bg-gray-200 rounded-t-lg"></div>
              <div className="p-4 w-full">
                <div className="h-4 bg-gray-300  w-3/4 mb-2 rounded"></div>
                <div className="h-4 bg-gray-300  w-1/2 rounded"></div>
              </div>
            </motion.div>
          ))
        ) : paginatedVariants.length > 0 ? (
          <AnimatePresence>
            {paginatedVariants.map((variant) => (
              <motion.div
                key={variant.id}
                className="max-w-sm flex flex-col justify-center items-center bg-white shadow-md cursor-pointer my-2 px-3 group
                hover:rounded-lg-21 hover:bg-custom-gradient hover:shadow-custom transition-all duration-300 border-2 border-[#F5F5F5] relative"
                variants={animations.fadeInLeft}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {variant.segment && (
                  <div
                    title={`${variant.segment} segment`}
                    className="absolute top-0 left-0 font-bold font-Poppins text-sm w-7 h-7 text-white z-10 flex justify-center items-center gap-2  rounded-br-md bg-gradient-to-l from-[#75A2BE] to-[#5584B6]"
                    //   variant.segment === "Minimal"
                    //     ? "bg-gradient-to-l from-[#75A2BE] to-[#5584B6]" //"bg-gray-500"    //keep this sunny
                    //     : variant.segment === "Luxury"
                    //     ? "bg-gradient-to-l from-[#C79733] to-[#8E691D]" //"bg-yellow-500"
                    //     : "bg-gradient-to-l from-[#4A4A4A] to-[#1F1F1F]" //"bg-purple-600"
                    // style={{
                    //   clipPath: "polygon(0 0, 100% 0, 85% 100%, 0% 100%)",
                    // }}
                  >
                    {variant.segment === "Exclusive" && (
                      <div className="relative pr-2">
                        <PiStarFourFill
                          className="absolute bottom-2 right-1"
                          size={8}
                          color="#FFE473"
                        />
                        <PiStarFourFill color="#FFE473" />
                      </div>
                    )}

                    {variant.segment === "Luxury" && (
                      <RiVipCrown2Fill color="#FFE473" />
                    )}

                    {variant.segment === "Minimal" && (
                      <FaStar color="#FFE473" />
                    )}

                    {/* <h4 className="text-xs uppercase md:text-sm">
                      {variant.segment}
                    </h4> */}
                  </div>
                )}

                {filterSelectedProduct[0]?.id === variant.id && (
                  <div
                    title="Selected"
                    className="absolute top-0 right-0 bg-[#347ABF] text-xs font-semibold text-white w-7 h-7 z-10 rounded-bl-xl flex justify-center items-center"
                  >
                    {/* SELECTED */}
                    <HiMiniCheckBadge size={20} color="#A7FF8F" />
                  </div>
                )}

                {/* Image with Skeleton */}
                <div className="w-full aspect-[4/3] rounded-t-lg relative">
                  {loadingImages[variant.id] !== false && (
                    <div className="absolute inset-0 bg-gray-200 rounded-t-lg"></div>
                  )}
                  <img
                    className={`rounded-t-lg w-full h-36 md:h-64 object-contain transition-opacity duration-300 mt-5 md:mt-0 ${
                      loadingImages[variant.id] !== false
                        ? "opacity-0"
                        : "opacity-100"
                    }`}
                    src={variant.image}
                    alt={variant.title}
                    onLoad={() => handleImageLoad(variant.id)}
                    onClick={() => {
                      setSelectedProductView(variant);
                      // setShowProductView(true);
                      navigate(`${variant.id}`); //new ProductOverview
                    }}
                  />
                  {/* CiCirclePlus Icon - Positioned at Bottom Right */}
                  {filterSelectedProduct[0]?.id === variant.id ? (
                    <div className="absolute -bottom-10 md:bottom-2 -right-2 md:right-0 bg-white group-hover:bg-[#EFF8FF] rounded-full p-1 shadow-[0px_2px_6px_0px_rgba(0,0,0,0.1),_inset_0px_4px_6px_0px_rgba(0,0,0,0.1)] cursor-pointer">
                      <GoDash
                        size={28}
                        color="#334A78"
                        onClick={() => {
                          setSelectedProductView(variant);
                          setShowSelectArea(true);
                        }}
                      />
                    </div>
                  ) : (
                    <div className="absolute -bottom-10 md:bottom-2 -right-2 md:right-0 bg-white group-hover:bg-[#EFF8FF] rounded-full p-1 shadow-[0px_2px_6px_0px_rgba(0,0,0,0.1),_inset_0px_4px_6px_0px_rgba(0,0,0,0.1)] cursor-pointer">
                      <GoPlus
                        size={28}
                        color="#334A78"
                        onClick={() => {
                          setSelectedProductView(variant);
                          setShowSelectArea(true);
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Product Name */}
                <div className="px-1 py-3 text-start w-full">
                  <p
                    className="text-sm font-medium text-gray-800 capitalize"
                    onClick={() => {
                      setSelectedProductView(variant);
                      // setShowProductView(true);
                      navigate(`${variant.id}`); //new ProductOverview
                    }}
                  >
                    <span className="group-hover:text-[#347ABF]">
                      {variant.title.toLowerCase()}
                    </span>
                    <br />
                    <span>₹ {variant.price}</span>
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        ) : (
          <motion.p
            key="no-products"
            className="col-span-full text-center text-gray-500"
            variants={animations.fadeInLeft}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            No products found for "{selectedSubCategory1}" in "
            {selectedSubCategory}".
          </motion.p>
        )}
      </div>

      <PagInationNav
        totalPages={totalPages}
        currentPage={currentPage}
        handlePageChange={setCurrentPage}
      />

      {/* {totalPages > 1 && (
        <div className="flex justify-center mt-6 space-x-2 py-4">
          <button
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={`px-3 py-1 rounded ${
                currentPage === i + 1
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}

          <button
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )} */}
    </div>
  );
}

export default ProductCard;
