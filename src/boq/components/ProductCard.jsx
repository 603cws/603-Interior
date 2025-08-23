import { useEffect, useState, useRef } from "react";
import { useApp } from "../../Context/Context";
import { CiSliderVertical } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaStar } from "react-icons/fa";
import { GoDash, GoPlus } from "react-icons/go";
import { PiStarFourFill } from "react-icons/pi";
import { IoMdSettings } from "react-icons/io";
import { RiVipCrown2Fill } from "react-icons/ri";
import { HiMiniCheckBadge } from "react-icons/hi2";

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
  const [isOpen, setIsOpen] = useState(false);
  const options = ["Minimal", "Exclusive", "Luxury", "Custom"];

  const productsInCategory = products[selectedCategory?.category] || [];
  // const [loading, setLoading] = useState(true);
  const [loadingImages, setLoadingImages] = useState({}); // Track image loading
  const [filtervalue, setFiltervalue] = useState(selectedPlan);

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
    .flatMap((product) => product.product_variants || []);

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
    if (filtervalue === "Custom") return true;

    return (
      variant.segment &&
      variant.segment.toLowerCase() === filtervalue.toLowerCase()
    );
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const totalPages = Math.ceil(filteredVariants.length / itemsPerPage);

  const paginatedVariants = filteredVariants.slice(
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
        setIsOpen(false);
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
          <div className="relative">
            {/* Filter button */}
            <button
              className="flex items-center gap-2 border border-black px-2 lg:px-4 py-2 text-sm"
              onClick={() => setIsOpen((prev) => !prev)}
            >
              <span className="hidden lg:block">Filter By Plan</span>
              <CiSliderVertical className="text-[#334A78]" size={20} />
            </button>

            {/* Dropdown menu */}
            {isOpen && (
              <div className="absolute right-0 mt-2 w-36 bg-white shadow-lg z-20">
                {options.map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      setFiltervalue(option);
                      setIsOpen(false);
                    }}
                    className={`flex justify-between items-center border border-black w-full px-4 py-3 ${
                      filtervalue === option
                        ? "bg-[#374A75] text-white font-semibold"
                        : ""
                    }`}
                  >
                    {/* Icon */}
                    <span className="flex items-center">
                      {option === "Exclusive" && (
                        <div className="relative">
                          <PiStarFourFill
                            className="absolute -top-1 -right-1"
                            size={8}
                            color={filtervalue === option ? "#fff" : "#334A78"}
                          />
                          <PiStarFourFill
                            size={16}
                            color={filtervalue === option ? "#fff" : "#334A78"}
                          />
                        </div>
                      )}
                      {option === "Luxury" && (
                        <RiVipCrown2Fill
                          size={16}
                          color={filtervalue === option ? "#fff" : "#334A78"}
                        />
                      )}
                      {option === "Minimal" && (
                        <FaStar
                          size={16}
                          color={filtervalue === option ? "#fff" : "#334A78"}
                        />
                      )}
                      {option === "Custom" && (
                        <IoMdSettings
                          size={18}
                          color={filtervalue === option ? "#fff" : "#334A78"}
                        />
                      )}
                    </span>

                    {/* Text */}
                    <span className="text-right">{option}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
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

      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-6 mb-6 px-4 space-x-1">
          <div className="flex border border-[#CCCCCC] rounded-lg px-3 py-2">
            {/* Previous Arrow */}
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-2 px-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <img
                src="../images/icons/less.png"
                alt="Previous"
                className="w-4 h-4"
              />
              <span className="text-[#194F48]">Previous</span>
            </button>

            {/* Page Numbers */}
            {(() => {
              const pages = [];
              let lastShownPage = 0;

              for (let i = 1; i <= totalPages; i++) {
                if (
                  i === 1 ||
                  i === totalPages ||
                  (i >= currentPage - 1 && i <= currentPage + 1)
                ) {
                  pages.push(
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i)}
                      className={`px-3 py-1 text-sm rounded text-[#334A78] ${
                        currentPage === i
                          ? "text-white bg-[#334A78]"
                          : "hover:bg-[#F1F1F1]"
                      }`}
                    >
                      {i}
                    </button>
                  );
                  lastShownPage = i;
                } else if (i > lastShownPage + 1) {
                  pages.push(
                    <span key={`ellipsis-${i}`} className="px-2 py-1 text-sm">
                      ...
                    </span>
                  );
                  lastShownPage = i;
                }
              }

              return pages;
            })()}

            {/* Next Text */}
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="flex items-center gap-2 px-2 text-sm disabled:opacity-50 default:cursor-not-allowed"
            >
              <span className="text-[#194F48]">Next</span>
              <img
                src="../images/icons/more.png"
                alt="Next"
                className="w-4 h-4"
              />
            </button>
          </div>
        </div>
      )}

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
