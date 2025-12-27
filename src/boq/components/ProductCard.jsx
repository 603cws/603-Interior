import { useEffect, useState, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaStar } from "react-icons/fa";
import { GoDash, GoPlus } from "react-icons/go";
import { PiStarFourFill } from "react-icons/pi";
import { RiVipCrown2Fill } from "react-icons/ri";
import { HiMiniCheckBadge, HiOutlineBarsArrowDown } from "react-icons/hi2";
import PagInationNav from "../../common-components/PagInationNav";
import ProductSkeleton from "./ProductSkeleton";
import FilterPanel from "./FilterPanel";
import SortPanel, { options } from "./SortPanel";
import { useBoqApp } from "../../Context/BoqContext";
import { useApp } from "../../Context/Context";
import { animations } from "../constants/animations";

function ProductCard({
  products,
  setSelectedProductView,
  userResponses,
  setShowSelectArea,
}) {
  const navigate = useNavigate();
  const {
    selectedCategory,
    selectedSubCategory,
    selectedSubCategory1,
    selectedPlan,
    selectedData,
  } = useBoqApp();

  const { loading, setLoading } = useApp();

  const dropdownRef = useRef(null);
  const productsInCategory = products[selectedCategory?.category] || [];
  const [loadingImages, setLoadingImages] = useState({});
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [openSection, setOpenSection] = useState("plan");
  const [selectedPlanFilter, setSelectedPlanFilter] = useState(selectedPlan);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [sortOption, setSortOption] = useState("newest");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isMobileSortOpen, setIsMobileSortOpen] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const toggleSection = (section) => {
    setOpenSection((prev) => (prev === section ? null : section));
  };
  const productsInSubCategory = productsInCategory[selectedSubCategory] || [];

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
          ...variant,
          category: product.category,
          subcategory: product.subcategory
            ? product.subcategory.split(",").map((s) => s.trim())
            : [],
          subcategory1: product.subcategory1,
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
    if (sortOption === "low") {
      arr.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortOption === "high") {
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
        setItemsPerPage(14);
      } else if (width < 1024) {
        setItemsPerPage(15);
      } else if (width < 1280) {
        setItemsPerPage(20);
      } else if (width < 1800) {
        setItemsPerPage(20);
      } else if (width >= 1800) {
        setItemsPerPage(24);
      } else {
        setItemsPerPage(12);
      }
    };

    updateItemsPerPage();
    window.addEventListener("resize", updateItemsPerPage);
    return () => window.removeEventListener("resize", updateItemsPerPage);
  }, []);

  useEffect(() => {
    if (setLoading) {
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsFilterOpen(false);
        setIsSortOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!productsInCategory) {
    return <p>Category &quot;{selectedCategory?.category}&quot; not found.</p>;
  }

  if (!productsInSubCategory) {
    return (
      <p>
        Subcategory &quot;{selectedSubCategory}&quot; not found in category
        &quot;
        {selectedCategory?.category}&quot;.
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
      <div className="product-card grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 3xl:grid-cols-6 gap-6 pb-8 pt-8 lg:pt-3 relative">
        <div className="lg:hidden absolute flex justify-between items-center w-full">
          <button
            className="border border-black px-3 py-1.5 flex items-center gap-2 text-sm"
            onClick={() => {
              setIsMobileSortOpen((prev) => !prev);
              setIsMobileFilterOpen(false);
            }}
          >
            Sort
            <HiOutlineBarsArrowDown />
          </button>
          <button
            className="border border-black px-3 py-1.5 flex items-center text-sm gap-2"
            onClick={() => {
              setOpenSection("plan");
              setIsMobileFilterOpen((prev) => !prev);
              setIsMobileSortOpen(false);
            }}
          >
            Filter
            <img
              src="/images/boq/filter.png"
              alt="Filter"
              className="w-3 h-3"
            />
          </button>

          {isMobileFilterOpen && (
            <FilterPanel
              toggleSection={toggleSection}
              openSection={openSection}
              selectedPlanFilter={selectedPlanFilter}
              setSelectedPlanFilter={setSelectedPlanFilter}
              brandsList={brandsList}
              selectedBrands={selectedBrands}
              setSelectedBrands={setSelectedBrands}
              isMobileFilterOpen={isMobileFilterOpen}
              setIsMobileFilterOpen={setIsMobileFilterOpen}
              paginatedVariants={paginatedVariants}
            />
          )}

          {isMobileSortOpen && (
            <SortPanel
              sortOption={sortOption}
              setSortOption={setSortOption}
              setIsMobileSortOpen={setIsMobileSortOpen}
            />
          )}
        </div>

        <div
          className="absolute right-0 -top-12 hidden lg:block"
          ref={dropdownRef}
        >
          <div className="flex gap-2 items-center">
            <button
              className="flex items-center gap-2 border border-black px-2 lg:px-4 py-2 text-sm"
              onClick={() => {
                setOpenSection("plan");
                setIsFilterOpen((prev) => !prev);
                setIsSortOpen(false);
              }}
            >
              <span className="hidden lg:block">Filter</span>
              <img
                src="/images/boq/filter.png"
                alt="Filter"
                className="w-4 h-4"
              />
            </button>

            <button
              className="flex items-center gap-2 border border-black px-4 py-2 text-sm"
              onClick={() => {
                setIsSortOpen((prev) => !prev);
                setIsFilterOpen(false);
              }}
            >
              <span className="hidden lg:block">Sort by:</span>
              <span className="font-medium text-xs lg:text-sm">
                {options.find((o) => o.value === sortOption)?.option}
              </span>
            </button>
          </div>

          {isFilterOpen && (
            <FilterPanel
              toggleSection={toggleSection}
              openSection={openSection}
              selectedPlanFilter={selectedPlanFilter}
              setSelectedPlanFilter={setSelectedPlanFilter}
              brandsList={brandsList}
              selectedBrands={selectedBrands}
              setSelectedBrands={setSelectedBrands}
            />
          )}
          {isSortOpen && (
            <SortPanel sortOption={sortOption} setSortOption={setSortOption} />
          )}
        </div>

        {loading ? (
          <ProductSkeleton />
        ) : paginatedVariants.length > 0 ? (
          <AnimatePresence>
            {paginatedVariants.map((variant) => (
              <motion.div
                key={variant.id}
                className="max-w-sm flex flex-col justify-center items-center bg-white shadow-md cursor-pointer my-3 px-3 group
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
                  </div>
                )}

                {filterSelectedProduct[0]?.id === variant.id && (
                  <div
                    title="Selected"
                    className="absolute top-0 right-0 bg-[#347ABF] text-xs font-semibold text-white w-7 h-7 z-10 rounded-bl-xl flex justify-center items-center"
                  >
                    <HiMiniCheckBadge size={20} color="#A7FF8F" />
                  </div>
                )}

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
                      navigate(`${variant.id}`);
                    }}
                  />
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

                <div className="px-1 py-3 text-start w-full">
                  <p
                    className="text-sm font-medium text-gray-800 capitalize"
                    onClick={() => {
                      setSelectedProductView(variant);
                      navigate(`${variant.id}`);
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
          <p className="text-gray-500 text-center font-medium col-span-full">
            No products found for &quot;{selectedSubCategory1}&quot; in &quot;
            {selectedSubCategory}&quot;.
          </p>
        )}
      </div>

      <PagInationNav
        totalPages={totalPages}
        currentPage={currentPage}
        handlePageChange={setCurrentPage}
      />
    </div>
  );
}

export default ProductCard;
