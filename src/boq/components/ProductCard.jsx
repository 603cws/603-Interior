import { useEffect, useState } from "react";
import { useApp } from "../../Context/Context";
import { CiCirclePlus, CiFilter } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

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
  setShowProductView,
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

  const productsInCategory = products[selectedCategory?.category] || [];
  // const [loading, setLoading] = useState(true);
  const [loadingImages, setLoadingImages] = useState({}); // Track image loading

  const [filtervalue, setFiltervalue] = useState(selectedPlan);
  const [showMobileFilter, setShowMobileFilter] = useState(false);

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
      data.category === selectedCategory.category &&
      data.subcategory === selectedSubCategory &&
      data.subcategory1 === selectedSubCategory1
    );
  });
  console.log(selectedCategory, selectedSubCategory, selectedSubCategory1);

  console.log("filterSelectedProduct", filterSelectedProduct);

  console.log("selectedData", selectedData);
  console.log("filteredVariants", filteredVariants);

  return (
    <div>
      <div className="product-card grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 3xl:grid-cols-6 gap-6 pb-8 pt-3 md:px-8 relative">
        {/* <div className="absolute right-0 md:right-10 -top-8 border-2 rounded-lg">
        <select
          name="plans"
          id="plans"
          className="hidden md:block md:px-5 md:py-1 rounded-lg text-xs md:text-base"
          value={filtervalue}
          onChange={(e) => setFiltervalue(e.target.value)}
        >
          <option value="Custom">Custom</option>
          <option value="Minimal">Minimal</option>
          <option value="Exclusive">Exclusive</option>
          <option value="Luxury">Luxury</option>
        </select>
      </div> */}

        <div className="absolute right-0 md:right-10 -top-8 border-2 rounded-lg">
          {/* Mobile: Filter Icon */}
          <button
            className="md:hidden p-2"
            onClick={() => setShowMobileFilter(!showMobileFilter)} // 👈 Show mobile dropdown/modal
          >
            <CiFilter className="h-5 w-5 text-gray-700" />
          </button>

          {/* Desktop: Show select */}
          <select
            name="plans"
            id="plans"
            className="hidden md:block md:px-5 md:py-1 rounded-lg text-xs md:text-base"
            value={filtervalue}
            onChange={(e) => setFiltervalue(e.target.value)}
          >
            <option value="Custom">Custom</option>
            <option value="Minimal">Minimal</option>
            <option value="Exclusive">Exclusive</option>
            <option value="Luxury">Luxury</option>
          </select>

          {/* Optional: Mobile dropdown (shown when icon is clicked) */}
          {showMobileFilter && (
            // <div className="absolute top-10 right-0 bg-white border rounded-lg shadow-md p-2 md:hidden z-20">
            <select
              name="plans"
              id="mobile-plans"
              className="text-sm px-3 py-1 absolute top-10 right-0 bg-white border rounded-lg shadow-md p-2 md:hidden z-20"
              value={filtervalue}
              onChange={(e) => {
                setFiltervalue(e.target.value);
                setShowMobileFilter(false); // close after selecting
              }}
            >
              <option value="Custom">Custom</option>
              <option value="Minimal">Minimal</option>
              <option value="Exclusive">Exclusive</option>
              <option value="Luxury">Luxury</option>
            </select>
            // </div>
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
              <div className="w-full aspect-[4/3] bg-gray-200 animate-pulse rounded-t-lg"></div>
              <div className="p-4 w-full">
                <div className="h-4 bg-gray-300 animate-pulse w-3/4 mb-2 rounded"></div>
                <div className="h-4 bg-gray-300 animate-pulse w-1/2 rounded"></div>
              </div>
            </motion.div>
          ))
        ) : paginatedVariants.length > 0 ? (
          <AnimatePresence mode="wait">
            {paginatedVariants.map((variant) => (
              <motion.div
                key={variant.id}
                className="max-w-sm flex flex-col justify-center items-center bg-white rounded-lg shadow-md cursor-pointer my-2 px-3 
                hover:rounded-lg-21 hover:bg-custom-gradient hover:shadow-custom transition-all duration-300 border-2 relative"
                variants={animations.fadeInLeft}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {variant.segment && (
                  <div
                    className={`absolute top-1 left-1 font-bold font-Poppins text-sm px-5 py-1.5 text-white z-10 ${
                      variant.segment === "Minimal"
                        ? "bg-gray-500"
                        : variant.segment === "Luxury"
                        ? "bg-yellow-500"
                        : "bg-purple-600"
                    }`}
                    style={{
                      clipPath: "polygon(0 0, 100% 0, 85% 100%, 0% 100%)",
                    }}
                  >
                    <h4 className="text-xs md:text-base">{variant.segment}</h4>
                  </div>
                )}

                {filterSelectedProduct[0]?.id === variant.id && (
                  <div className="absolute top-1 right-0 bg-[#34BFAD] text-xs font-semibold p-0.5 z-20">
                    Selected
                  </div>
                )}

                {/* Image with Skeleton */}
                <div className="w-full aspect-[4/3] rounded-t-lg relative">
                  {loadingImages[variant.id] !== false && (
                    <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-t-lg"></div>
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
                      setShowProductView(true);
                      navigate(`${variant.id}`); //new ProductOverview
                    }}
                  />
                  {/* CiCirclePlus Icon - Positioned at Bottom Right */}
                  <div className="absolute -bottom-10 md:bottom-2 -right-2 md:right-2 bg-[#82b8b0] rounded-full p-1 shadow-md cursor-pointer">
                    <CiCirclePlus
                      size={30}
                      color="#FFFFFF"
                      onClick={() => {
                        setSelectedProductView(variant);
                        setShowSelectArea(true);
                      }}
                    />
                  </div>
                </div>

                {/* Product Name */}
                <div className="p-4">
                  <p
                    className="text-sm font-medium text-gray-800 capitalize"
                    onClick={() => {
                      setSelectedProductView(variant);
                      setShowProductView(true);
                      navigate(`${variant.id}`); //new ProductOverview
                    }}
                  >
                    {variant.title.toLowerCase()}
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
        <div className="flex justify-center mt-6 space-x-2">
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
      )}
    </div>
  );
}

export default ProductCard;
