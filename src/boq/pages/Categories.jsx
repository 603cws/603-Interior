import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { CategorySvgMap } from "../../common-components/CategorySvgMap";
import {
  getCleanedCategoryName,
  getImageSrcSubCat,
} from "../utils/CategoryUtils";
import { useCategoryCompletion } from "../utils/useCategoryCompletion";
import { useBoqApp } from "../../Context/BoqContext";

const Categories = ({
  setSelectedSubCategory,
  handleCategoryClick,
  minimizedView,
}) => {
  const {
    selectedCategory,
    selectedSubCategory,
    selectedData,
    categories,
    userResponses,
  } = useBoqApp();

  const { categoryConfig } = useBoqApp();

  const { checkIfSubCategoryCompleted, checkIfCategoryCompleted } =
    useCategoryCompletion(categories, selectedData, categoryConfig);

  const containerRef = useRef(null);
  const scrollRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(4);
  const [hasOverflow, setHasOverflow] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const checkOverflow = () => {
      setHasOverflow(el.scrollWidth > el.clientWidth);
    };

    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  });

  useEffect(() => {
    const updateItemsPerPage = () => {
      const width = window.innerWidth;

      if (width < 300) {
        setItemsPerPage(2);
      } else if (width < 420) {
        setItemsPerPage(3);
      } else if (width < 768) {
        setItemsPerPage(4);
      } else if (width < 1024) {
        setItemsPerPage(7);
      } else if (width < 1440) {
        setItemsPerPage(7);
      } else {
        setItemsPerPage(9);
      }
    };

    updateItemsPerPage();
    window.addEventListener("resize", updateItemsPerPage);
    return () => window.removeEventListener("resize", updateItemsPerPage);
  }, []);

  const totalPages = Math.ceil(categories.length / itemsPerPage);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let startX = null;
    let isTouch = false;

    const handleTouchStart = (e) => {
      isTouch = true;
      startX = e.touches[0].clientX;
    };
    const handleTouchEnd = (e) => {
      if (!isTouch || startX == null) return;
      const endX = e.changedTouches[0].clientX;
      handleSwipe(startX, endX);
      startX = null;
      isTouch = false;
    };

    const handleMouseDown = (e) => {
      isTouch = false;
      startX = e.clientX;
      window.addEventListener("mouseup", handleMouseUp);
    };
    const handleMouseUp = (e) => {
      if (startX == null) return;
      const endX = e.clientX;
      handleSwipe(startX, endX);
      startX = null;
      window.removeEventListener("mouseup", handleMouseUp);
    };

    function handleSwipe(start, end) {
      const threshold = 40;
      if (end - start > threshold && currentPage > 0) {
        setCurrentPage((p) => p - 1);
      } else if (start - end > threshold && currentPage < totalPages - 1) {
        setCurrentPage((p) => p + 1);
      }
    }

    container.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    });
    container.addEventListener("touchend", handleTouchEnd, { passive: true });

    container.addEventListener("mousedown", handleMouseDown);

    return () => {
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchend", handleTouchEnd);
      container.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [currentPage, totalPages]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    function handleWheel(e) {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        if (e.deltaX > 10 && currentPage < totalPages - 1) {
          setCurrentPage((p) => p + 1);
          e.preventDefault();
        }
        if (e.deltaX < -10 && currentPage > 0) {
          setCurrentPage((p) => p - 1);
          e.preventDefault();
        }
      }
    }

    container.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      container.removeEventListener("wheel", handleWheel);
    };
  }, [currentPage, totalPages]);

  const paginatedItems = categories.slice(
    currentPage * itemsPerPage,
    currentPage * itemsPerPage + itemsPerPage,
  );

  const getFillForCategory = (catName) => {
    const DEFAULT = "#374A75";
    const SELECTED = "#fff";

    const selValue =
      typeof selectedCategory === "string"
        ? getCleanedCategoryName(selectedCategory)
        : getCleanedCategoryName(selectedCategory?.category);

    const isSelected = selValue === catName;
    const isCompleted =
      typeof checkIfCategoryCompleted === "function" &&
      checkIfCategoryCompleted(catName);

    if (minimizedView) {
      return isCompleted ? SELECTED : DEFAULT;
    }

    return isSelected ? SELECTED : DEFAULT;
  };

  return (
    <>
      <div
        className={`categories flex flex-col pb-1.5 md:pb-3 ${
          minimizedView ? "px-0" : ""
        }`}
      >
        <div
          className={`cat flex overflow-x-auto gap-1 md:gap-3 scrollbar-hide ${
            minimizedView ? "px-1 justify-between" : "pb-2 px-0"
          }`}
        >
          {!minimizedView && (
            <div className="flex flex-col items-center w-full px-0 py-2 ">
              <div
                ref={containerRef}
                className={`flex flex-row gap-[21px] items-center py-2 relative overflow-hidden w-full swipe-cursor justify-between ${
                  currentPage < 1 ? "lg:justify-between" : "md:justify-start"
                }`}
              >
                {paginatedItems?.map(({ id, category, subcategories }) => {
                  const isSelected = selectedCategory?.id === id;
                  const cleanedCategoryName = getCleanedCategoryName(category);
                  const SvgIconFactory = CategorySvgMap[cleanedCategoryName];
                  const fill = getFillForCategory(cleanedCategoryName);

                  return (
                    <div
                      key={id}
                      onClick={() =>
                        handleCategoryClick(id, category, subcategories)
                      }
                      className="shrink-0 w-[72px] lg:w-28 h-[72px] lg:h-28 group transition-transform duration-[300ms] ease-in-out hover:scale-90 rounded-[10px]"
                    >
                      <div className="p-[3px] rounded-[10px] bg-gradient-to-br from-[#334A78] to-[#68B2DC] h-full w-full">
                        <div
                          className={`flex flex-col hover:cursor-pointer items-center justify-around w-full h-full rounded-[10px] border shadow-[0_2px_6px_1px_rgba(0,0,0,0.5),_inset_0_2px_6px_0px_rgba(0,0,0,0.1)] ${
                            isSelected
                              ? "border-transparent text-white"
                              : "bg-white border-transparent text-[#252525]"
                          }`}
                        >
                          <div className="flex flex-row gap-2 items-center justify-center w-[50px]">
                            <div className="w-8 lg:w-[60px] h-8 lg:h-[60px] flex items-center justify-center">
                              {SvgIconFactory ? (
                                SvgIconFactory(
                                  fill,
                                  "h-8 w-8 lg:h-[60px] lg:w-[60px]",
                                )
                              ) : (
                                <div
                                  style={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: 9999,
                                    background: fill,
                                  }}
                                />
                              )}
                            </div>
                          </div>
                          <div className=" text-center font-Poppins text-[10px] lg:text-base lg:leading-5 font-normal">
                            {category}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center mt-3 gap-2">
                  {Array.from({ length: totalPages }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentPage(index)}
                      className={`w-2 md:w-3 h-2 md:h-3 rounded-full ${
                        index === currentPage ? "bg-[#334A78]" : "bg-[#D9D9D9]"
                      } transition-colors duration-300`}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {minimizedView &&
            categories.map(({ id, category, subcategories }) => {
              const cleanedCategoryName = getCleanedCategoryName(category);
              const isCategoryCompleted = checkIfCategoryCompleted(category);
              const isSelected = selectedCategory?.id === id;
              const SvgIconFactory = CategorySvgMap[cleanedCategoryName];

              const DEFAULT = "#374A75";
              const SELECTED = "#fff";

              const fill = minimizedView
                ? isCategoryCompleted
                  ? SELECTED
                  : DEFAULT
                : isSelected
                  ? SELECTED
                  : DEFAULT;

              return (
                <div
                  key={id}
                  onClick={() =>
                    handleCategoryClick(id, category, subcategories)
                  }
                  className={`transition-transform duration-500 ease-in-out cursor-pointer ${
                    isSelected ? "scale-100" : "scale-95"
                  } px-0 py-1`}
                >
                  <div
                    className={`font-Poppins flex flex-col justify-center items-center text-xs gap-1 md:gap-2 md:mt-3 relative group`}
                  >
                    <div
                      className={`bg-[#fff] p-2 ${
                        isCategoryCompleted && isSelected
                          ? "shadow-[inset_6px_6px_12px_rgba(0,0,0,0.3),inset_-6px_-6px_12px_rgba(255,255,255,0.1)] bg-gradient-to-r from-[#334A78] to-[#68B2DC]"
                          : isCategoryCompleted
                            ? "bg-gradient-to-r from-[#334A78] to-[#68B2DC] shadow-[6px_6px_12px_rgba(0,0,0,0.2),-6px_-6px_12px_rgba(255,255,255,0.3)]"
                            : isSelected
                              ? "bg-[#fff] shadow-[inset_6px_6px_12px_rgba(0,0,0,0.1),inset_-6px_-6px_12px_rgba(255,255,255,0.8)] scale-105"
                              : "bg-[#fff] shadow-[6px_6px_12px_rgba(0,0,0,0.2),-6px_-6px_12px_rgba(255,255,255,0.8)] group-hover:scale-105"
                      } w-14 md:w-16 lg:w-20 h-14 md:h-16 lg:h-20 rounded-full flex justify-center items-center group-hover:scale-105 transition-transform duration-[1000ms] ease-in-out`}
                    >
                      {SvgIconFactory ? (
                        typeof SvgIconFactory === "function" ? (
                          SvgIconFactory(
                            fill,
                            "w-8 h-8 lg:w-[60px] lg:h-[60px]",
                          )
                        ) : (
                          SvgIconFactory
                        )
                      ) : (
                        <div
                          style={{
                            width: 40,
                            height: 40,
                            background: fill,
                            borderRadius: "50%",
                          }}
                        />
                      )}
                    </div>
                    <div
                      className={`group-hover:visible ${
                        isSelected ? "visible" : "invisible"
                      } transition-all duration-[500ms] ease-in-out`}
                    >
                      <p>{category}</p>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>

        {selectedCategory && (
          <div className="md:mt-2 font-Poppins">
            {minimizedView && (
              <motion.div
                key={selectedCategory.category}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="w-full relative"
              >
                {hasOverflow && (
                  <div className="absolute right-0 -top-1/2 flex gap-2 z-20">
                    <button
                      onClick={() => {
                        document.querySelector(".subcat-scroll")?.scrollBy({
                          left: -150,
                          behavior: "smooth",
                        });
                      }}
                      className=" p-0.5 text-[#374A75] border border-[#ccc]"
                    >
                      <MdKeyboardArrowLeft size={20} />
                    </button>
                    <button
                      onClick={() => {
                        document.querySelector(".subcat-scroll")?.scrollBy({
                          left: 150,
                          behavior: "smooth",
                        });
                      }}
                      className="p-0.5 text-[#374A75] border border-[#ccc]"
                    >
                      <MdKeyboardArrowRight size={20} />
                    </button>
                  </div>
                )}
                <div
                  ref={scrollRef}
                  className="subcat-scroll flex flex-row items-center justify-start overflow-x-auto scrollbar-hide py-1 scroll-smooth"
                >
                  {selectedCategory?.subcategories
                    ?.filter((subCategory) =>
                      selectedCategory.category === "HVAC"
                        ? userResponses.hvacType === "Centralized"
                          ? subCategory === "Centralized"
                          : subCategory !== "Centralized"
                        : true,
                    )
                    .map((subCategory, index) => {
                      const isCompleted = checkIfSubCategoryCompleted(
                        selectedCategory.category,
                        subCategory,
                      );
                      return (
                        <motion.div
                          key={index}
                          onClick={() => setSelectedSubCategory(subCategory)}
                          transition={{ duration: 0.3 }}
                          className={`group rounded flex flex-row items-start justify-center shrink-0 mr-5 group hover:bg-[#F9F9F9] border hover:border-[#374A75] ${
                            isCompleted ? "bg-[#374A75]" : ""
                          } ${
                            selectedSubCategory === subCategory && !isCompleted
                              ? "bg-[#E0F0FF]"
                              : ""
                          }`}
                        >
                          <p
                            className={`relative text-[#252525] text-center text-xs md:text-sm flex items-center justify-center py-3 cursor-pointer group-hover:text-[#334A78] px-2 md:px-5 ${
                              isCompleted
                                ? "font-semibold text-[#fff]"
                                : "font-normal"
                            }`}
                          >
                            {subCategory}
                            <span
                              className={`absolute left-0 bottom-0 block w-0 h-1 bg-[#334A78] transition-all duration-300 ease-in-out rounded-b-md ${
                                selectedSubCategory === subCategory
                                  ? "w-full"
                                  : "group-hover:w-full"
                              } ${
                                isCompleted
                                  ? "bg-[#E0F0FF] group-hover:bg-[#334A78]"
                                  : ""
                              }`}
                            ></span>
                          </p>
                        </motion.div>
                      );
                    })}
                </div>
              </motion.div>
            )}

            {!minimizedView && (
              <AnimatePresence>
                <motion.div
                  key={selectedCategory.category}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                >
                  <div className="subcat grid grid-cols-2 xs:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 3xl:grid-cols-6 gap-5 2xl:gap-x-24 mt-5 justify-center">
                    {selectedCategory.subcategories
                      .filter((subCategory) =>
                        selectedCategory.category === "HVAC"
                          ? userResponses.hvacType === "Centralized"
                            ? subCategory === "Centralized"
                            : subCategory !== "Centralized"
                          : true,
                      )
                      .map((subCategory, index) => {
                        const imageSrcSubCat = getImageSrcSubCat(
                          selectedCategory.category,
                          subCategory,
                        );

                        return (
                          <motion.div
                            key={index}
                            onClick={() => setSelectedSubCategory(subCategory)}
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.3 }}
                          >
                            <div className="flex flex-col items-center justify-evenly flex-wrap relative">
                              <div className="flex flex-col gap-1 lg:gap-[21px] items-center justify-center w-full relative cursor-pointer hover:scale-105 transition-transform duration-500 ease-in-out">
                                <div className="relative w-28 md:w-40 lg:w-52 h-28 md:h-40 lg:h-52 flex items-center justify-center bg-gradient-to-r from-[#334A78] to-[#347ABF] rounded-xl lg:rounded-[26px]">
                                  <img
                                    className="rounded-xl lg:rounded-3xl w-[102px] md:w-36 lg:w-48 h-[102px] md:h-36 lg:h-48 object-cover"
                                    src={imageSrcSubCat}
                                    alt={`${subCategory} subcategory`}
                                  />
                                </div>
                                <p className="text-[#444444] text-center font-Poppins text-[10px] md:text-[13px] lg:text-lg font-medium relative">
                                  {subCategory}
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                  </div>
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Categories;
