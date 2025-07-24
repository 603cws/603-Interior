import { useState } from "react";
import { useApp } from "../../Context/Context";
import { motion, AnimatePresence } from "framer-motion";

const Categories = ({
  setSelectedCategory,
  setSelectedSubCategory,
  handleCategoryClick,
}) => {
  const {
    selectedCategory,
    selectedSubCategory,
    selectedData,
    minimizedView,
    categories,
    userResponses,
  } = useApp();

  const getCleanedCategoryName = (categoryName) => {
    return categoryName.replace(/[^a-zA-Z0-9]/g, ""); // Removes all non-alphanumeric characters
  };

  const getImageSrcSubCat = (category, subCategory) => {
    if (!subCategory) return "";

    const getCleanedCategoryName = (name) => {
      return name
        .replace(/\//g, " ") // Replace `/` with a space
        .replace(/[^a-zA-Z0-9\s]/g, "") // Remove special characters except spaces
        .replace(/\s+/g, " ") // Replace multiple spaces with a single space
        .trim(); // Trim any leading or trailing spaces
    };

    const getCleanedSubCategoryName = (name) => {
      return name
        .replace(/[^a-zA-Z0-9\s]/g, "") // Remove special characters
        .replace(/\s(.)/g, (match, group1) => group1.toUpperCase()) // Convert spaces to camel case
        .replace(/\s+/g, ""); // Remove all spaces
    };

    const cleanedCategoryName = getCleanedCategoryName(category);
    const cleanedSubCategoryName = getCleanedSubCategoryName(subCategory);

    // Handle specific categories except Furniture
    if (
      [
        "Lighting",
        "HVAC",
        "Smart Solutions",
        "Flooring",
        "Civil Plumbing",
        "Paint",
        "Partitions Ceilings",
        "Lux",
      ].includes(cleanedCategoryName)
    ) {
      //Sunny => Maybe reverse logic in future(except Furniture)
      return `/images/boq/${cleanedCategoryName}/${cleanedSubCategoryName}.png`;
    }

    // Default case
    return `/images/boq/${cleanedSubCategoryName}.png`;
  };
  const checkIfSubCategoryCompleted = (category, subCategory) => {
    if (!selectedData || selectedData.length === 0) return false;

    const categoryObject = categories.find(
      (cat) =>
        cat.category.toLowerCase().trim() === category.toLowerCase().trim()
    );
    if (!categoryObject) return false;

    // Categories where we need to check all subcategories
    const specialCategories = [
      "furniture",
      "civil / plumbing",
      "lux",
      "smart solutions",
      "paint",
    ];

    if (specialCategories.includes(category.toLowerCase().trim())) {
      let requiredSubCategory1Items = categoryObject.subcategory1 || [];

      const selectedSubCategory1Items = (
        Array.isArray(selectedData) ? selectedData : []
      )
        .filter(
          (item) =>
            item?.category?.toLowerCase().trim() ===
              category?.toLowerCase().trim() &&
            item?.subcategory?.toLowerCase().trim() ===
              subCategory?.toLowerCase().trim()
        )

        .map((item) => item.subcategory1);

      if (category === "Civil / Plumbing" && subCategory === "Pantry") {
        requiredSubCategory1Items = requiredSubCategory1Items.filter(
          (item) => item !== "Pods"
        );
      }

      const isCompleted =
        requiredSubCategory1Items.length > 0 &&
        requiredSubCategory1Items.every((subCat1) =>
          selectedSubCategory1Items.includes(subCat1)
        );
      return isCompleted;
    } else {
      // For other categories, check if only one subcategory1 is added
      const selectedSubCategory1Items = (
        Array.isArray(selectedData) ? selectedData : []
      )
        .filter(
          (item) =>
            item?.category?.toLowerCase().trim() ===
              category?.toLowerCase().trim() &&
            item?.subcategory?.toLowerCase().trim() ===
              subCategory?.toLowerCase().trim()
        )

        .map((item) => item.subcategory1);

      // If only one subcategory1 is selected, mark as completed
      return selectedSubCategory1Items.length === 1;
    }
  };

  const checkIfCategoryCompleted = (category) => {
    // Check if selectedData is available
    if (!selectedData || selectedData.length === 0) return false;

    const categoryObject = categories.find(
      (cat) =>
        cat.category.toLowerCase().trim() === category.toLowerCase().trim()
    );
    if (!categoryObject) return false;

    const requiredSubCategories = categoryObject.subcategories || [];

    if (category === "HVAC") {
      const hasCentralizedProduct = selectedData.some(
        (product) =>
          product.category === "HVAC" && product.subcategory === "Centralized"
      );

      const nonCentralizedSubcategories = requiredSubCategories.filter(
        (sub) => sub.toLowerCase().trim() !== "centralized"
      );

      const areOtherSubcategoriesCompleted = nonCentralizedSubcategories.every(
        (subCategory) => checkIfSubCategoryCompleted(category, subCategory)
      );

      // Mark as completed if HVAC has a "Centralized" product OR all other subcategories are completed
      if (hasCentralizedProduct || areOtherSubcategoriesCompleted) return true;
    }
    // Loop through all subcategories to check if all are marked as completed
    const isCompleted = requiredSubCategories.every((subCategory) =>
      checkIfSubCategoryCompleted(category, subCategory)
    );

    return isCompleted;
  };

  const ITEMS_PER_PAGE = 10;
  const [currentPage, setCurrentPage] = useState(0);

  // Guard clause: Don't render if selectedCategory or subcategories are missing
  if (!selectedCategory || !selectedCategory.subcategories) return null;

  const filteredSubcategories = selectedCategory.subcategories.filter(
    (subCategory) =>
      selectedCategory.category === "HVAC"
        ? userResponses.hvacType === "Centralized"
          ? subCategory === "Centralized"
          : subCategory !== "Centralized"
        : true
  );

  const totalPages = Math.ceil(filteredSubcategories.length / ITEMS_PER_PAGE);
  const paginatedSubcategories = filteredSubcategories.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE
  );

  return (
    <>
      <div className="categories flex flex-col pb-1.5 md:pb-3">
        {/* Categories List */}
        <div
          className={`cat flex justify-evenly overflow-x-auto gap-1 md:gap-3  lg:px-5 scrollbar-hide ${
            minimizedView ? "px-0" : "pb-2 px-2"
          }`}
        >
          {categories.map(({ id, category, subcategories }) => {
            const cleanedCategoryName = getCleanedCategoryName(category);
            const isCategoryCompleted = checkIfCategoryCompleted(category); // Check if the category is completed
            const isSelected = selectedCategory?.id === id;
            const imageSrc = `/images/icons/${cleanedCategoryName}.png`;
            return (
              <div
                key={id}
                onClick={() => handleCategoryClick(id, category, subcategories)}
                className={`transition-transform duration-500 ease-in-out cursor-pointer ${
                  isSelected ? "scale-100" : "scale-95"
                } ${minimizedView ? "px-2 py-1" : "p-0"}`}
              >
                {!minimizedView && (
                  <div
                    className={` flex flex-row gap-[21px] top-1 items-center justify-start relative overflow-auto group`} // Added 'group' class here for hover effect
                  >
                    <div
                      className={`${
                        selectedCategory?.id === id
                          ? "bg-[#A9D3CE]"
                          : "bg-[#ffffff]"
                      } border-solid border-black border-2 flex flex-col gap-0 items-center justify-around rounded-lg shrink-0 w-28 h-28 relative group-hover:scale-90 transition-transform duration-[300ms] ease-in-out`} // Added hover effect here
                    >
                      <div className="flex flex-row gap-2 items-center justify-center shrink-0 w-[50px] relative">
                        <img
                          className="flex flex-col gap-2.5 items-start justify-start shrink-0 w-5 lg:w-[50px] h-5 lg:h-[50px] relative overflow-hidden"
                          src={imageSrc}
                          alt={`${category} icon`}
                        />
                      </div>
                      <div className="flex flex-col gap-2.5 items-start justify-start shrink-0 relative overflow-hidden">
                        <div className="flex flex-row gap-2.5 items-center justify-center shrink-0 relative overflow-hidden">
                          <div className="text-[#252525] text-center font-['Poppins-Regular',_sans-serif] text-md leading-5 font-normal relative flex items-center justify-center">
                            {category}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {minimizedView && (
                  <div
                    // className={` flex flex-row items-center justify-start relative group py-2`}
                    className={`font-Poppins flex flex-col justify-center items-center text-xs gap-1 md:gap-2 md:mt-3 relative group`}
                  >
                    <div
                      className={`border-2 ${
                        isCategoryCompleted && selectedCategory?.id === id
                          ? "shadow-[0_0_10px_#93FCEE] bg-[#34BFAD] animate-pulse"
                          : isCategoryCompleted
                          ? "border-[#f4f4f4] border-[1px] bg-[#34BFAD]  "
                          : selectedCategory?.id === id
                          ? "border-[#34BFAD] scale-110"
                          : "border-[#000000] "
                      }  w-14 md:w-16 h-14 md:h-16 rounded-full flex justify-center items-center group-hover:scale-105 transition-transform duration-[1000ms] ease-in-out`}
                    >
                      <img
                        // className="rounded-full w-[30px] h-[30px] object-contain"
                        className="w-7 md:w-10 h-7 md:h-10"
                        src={imageSrc}
                        alt={`${category} icon`}
                      />
                    </div>
                    <div
                      className={` group-hover:visible ${
                        selectedCategory.id === id ? "visible" : "invisible"
                      } transition-all duration-[500ms] ease-in-out`}
                    >
                      <p>{category}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Subcategories */}
        {selectedCategory && (
          <div className="md:mt-2 font-Poppins">
            {minimizedView && (
              <motion.div
                key={selectedCategory.category} // Ensures animation applies on category change
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="subcat border-solid border-[#d5d5d5] border flex flex-row items-center justify-start overflow-auto scrollbar-hide py-1 rounded-lg"
              >
                {selectedCategory?.subcategories
                  ?.filter(
                    (subCategory) =>
                      selectedCategory.category === "HVAC" // Apply logic only for HVAC
                        ? userResponses.hvacType === "Centralized"
                          ? subCategory === "Centralized" // Show only "Centralized"
                          : subCategory !== "Centralized" // Exclude "Centralized"
                        : true // Show all subcategories for non-HVAC categories
                  )
                  .map((subCategory, index) => {
                    const isCompleted = checkIfSubCategoryCompleted(
                      selectedCategory.category,
                      subCategory
                    );
                    return (
                      <motion.div
                        key={index}
                        onClick={() => setSelectedSubCategory(subCategory)}
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                        className={`rounded-xl flex flex-row items-start justify-center shrink-0 mx-3 group md:px-5 ${
                          isCompleted
                            ? "border-2 border-[#f4f4f4] bg-[#34BFAD]"
                            : ""
                        }`}
                      >
                        <p
                          className={`relative text-[#252525] text-center text-xs md:text-sm flex items-center justify-center py-3 cursor-pointer ${
                            isCompleted ? "font-semibold" : "font-normal"
                          }`}
                        >
                          {subCategory}
                          <span
                            className={`absolute left-0 bottom-0 block w-0 h-1 bg-[#194f48] transition-all duration-300 ease-in-out ${
                              selectedSubCategory === subCategory
                                ? "w-full"
                                : "group-hover:w-full"
                            }`}
                          ></span>
                        </p>
                      </motion.div>
                    );
                  })}
              </motion.div>
            )}

            {!minimizedView && (
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedCategory.category}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                >
                  {/* <h3 className="text-base lg:text-lg font-semibold text-gray-800 lg:ms-5">
                    Subcategories of {selectedCategory.category}
                  </h3> */}
                  {/* Pagination Dots */}
                  {totalPages > 1 && (
                    <div className="flex justify-center mt-4 gap-2">
                      {Array.from({ length: totalPages }).map(
                        (_, pageIndex) => (
                          <button
                            key={pageIndex}
                            onClick={() => setCurrentPage(pageIndex)}
                            className={`w-3 h-3 rounded-full ${
                              pageIndex === currentPage
                                ? "bg-[#1A3A36]"
                                : "bg-[#D9D9D9] hover:bg-[#34BFAD]"
                            } transition-colors duration-300`}
                          />
                        )
                      )}
                    </div>
                  )}

                  {/* <div className="subcat grid grid-cols-3 md:grid-cols-5 lg:grid-cols-4 xl:grid-cols-6 gap-5 mt-5 justify-center"> */}
                  <div className="subcat grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 mt-5 justify-center">
                    {paginatedSubcategories.map((subCategory, index) => {
                      const imageSrcSubCat = getImageSrcSubCat(
                        selectedCategory.category,
                        subCategory
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
                              {/* <div className="relative w-[90px] md:w-[130px] lg:w-[160px] h-24 md:h-[130px] lg:h-[170px] flex items-center justify-center bg-gradient-to-r from-[#003442] to-[#34BFAD] rounded-3xl lg:rounded-[26px]"> */}
                              <div className="relative w-52 h-52 flex items-center justify-center bg-gradient-to-r from-[#001F42] to-[#347ABF] rounded-3xl lg:rounded-[26px]">
                                <img
                                  // className="rounded-2xl md:rounded-3xl w-[75px] md:w-[110px] lg:w-[150px] h-[80px] md:h-[115px] lg:h-[150px] object-cover"
                                  className="rounded-2xl md:rounded-3xl w-48 h-48 object-cover"
                                  src={imageSrcSubCat}
                                  alt={`${subCategory} subcategory`}
                                />
                              </div>
                              <p className="text-[#444444] text-center font-['Montserrat-Medium',_sans-serif] text-xs md:text-[13px] lg:text-lg font-medium relative">
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
