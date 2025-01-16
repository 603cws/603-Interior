import React from "react"; //{ useState, useEffect }
import { useApp } from "../../Context/Context";

const Categories = ({ categories, setSelectedCategory, setSelectedSubCategory, minimizedView,handleCategoryClick,userResponses }) => {

  const { selectedCategory, selectedSubCategory } = useApp();

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

    // Handle specific categories if needed
    if (
      [
        "Lighting",
        "HVAC",
        "Smart Solutions",
        "Flooring",
        "Civil Plumbing",
        "Paint",
        "Partitions Ceilings",
      ].includes(cleanedCategoryName)
    ) {
      //Sunny => Maybe reverse logic in future(except Furniture)
      return `/images/subheader/${cleanedCategoryName}/${cleanedSubCategoryName}.png`;
    }

    // Default case
    return `/images/subheader/${cleanedSubCategoryName}.png`;
  };

  return (
    <div className="flex flex-col">
      {/* Categories List */}
      <div className="flex justify-evenly overflow-x-auto gap-3 px-5 py-3 scrollbar-hide">
        {categories.map(({ id, category, subcategories }) => {
          const cleanedCategoryName = getCleanedCategoryName(category);
          const isSelected = selectedCategory?.id === id;
          const imageSrc = `/images/icons/${cleanedCategoryName}.png`;
          return (
            <div
              key={id}
              // onClick={() => {
              //   setSelectedCategory({ id, category, subcategories });
              //   if (minimizedView) {
              //     setSelectedSubCategory(subcategories[0] || null); // Automatically select the first subcategory if available
              //   }
              // }}
              onClick={() => handleCategoryClick(id, category, subcategories)}
              className={`transition-transform duration-500 ease-in-out cursor-pointer ${
                isSelected ? "scale-110" : "scale-100"
              }`}
            >
              {!minimizedView && (
                <div
                  className={`flex flex-row gap-[21px] items-center justify-start relative overflow-auto`}
                >
                  <div
                    className={`${selectedCategory?.id === id
                      ? "bg-[#A9D3CE]"
                      : "bg-[#ffffff]"
                      } rounded-3xl border-solid border-[#000000] border-2 flex flex-col gap-0 items-center justify-around shrink-0 w-[90px] h-[80px] relative`}
                  >
                    <div className="flex flex-row gap-2 items-center justify-center shrink-0 w-[50px] relative">
                      <img
                        className="flex flex-col gap-2.5 items-start justify-start shrink-0 w-[30px] h-[30px] relative overflow-hidden"
                        src={imageSrc}
                        alt={`${category} icon`}
                      />
                    </div>
                    <div className="flex flex-col gap-2.5 items-start justify-start shrink-0 relative overflow-hidden">
                      <div className="flex flex-row gap-2.5 items-center justify-center shrink-0  relative overflow-hidden">
                        <div className="text-[#252525] text-center font-['Poppins-Regular',_sans-serif] text-sm leading-5 font-normal relative flex items-center justify-center">
                          {category}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {minimizedView && (
                <div
                  className={`flex flex-row items-center justify-start relative group py-2`}
                >
                  <div
                    className={`rounded-full border-2 ${selectedCategory?.id === id
                      ? "border-[#34BFAD] scale-75"
                      : "border-[#000000]"
                      } w-[70px] h-[70px] flex items-center justify-center group-hover:scale-75 transition-transform duration-[1000ms] ease-in-out`}
                  >
                    <img
                      className="rounded-full w-[50px] h-[50px] object-contain"
                      src={imageSrc}
                      alt={`${category} icon`}
                    />
                  </div>
                  <p
                    className={`absolute w-full text-center ${selectedCategory?.id === id
                      ? "-bottom-1 opacity-100"
                      : "-bottom-1 opacity-0 group-hover:opacity-100"
                      } transition-all duration-[1000ms] ease-in-out text-[#252525] font-['Poppins-Regular',_sans-serif] leading-5 font-normal text-sm text-nowrap`}
                  >
                    {category}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Subcategories */}
      {selectedCategory && (
        <div className="mt-5">
          {minimizedView && (
            <div className="border-solid border-[#d5d5d5] border flex flex-row items-center justify-start overflow-auto scrollbar-hide pb-4">
              {selectedCategory.subcategories
                .filter(
                  (subCategory) =>
                    selectedCategory.category === "HVAC" // Apply logic only for HVAC
                      ? userResponses.hvacType === "Centralized"
                        ? subCategory === "Centralized" // Show only "Centralized"
                        : subCategory !== "Centralized" // Exclude "Centralized"
                      : true // Show all subcategories for non-HVAC categories
                )
                .map((subCategory, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedSubCategory(subCategory)}
                    className="rounded-lg flex flex-row gap-[9px] items-start justify-center shrink-0 mx-3 group"
                  >
                    <p
                      className={`relative text-[#252525] text-center font-['Poppins-Regular',_sans-serif] text-sm font-normal flex items-center justify-center py-3 cursor-pointer`}
                    >
                      {subCategory}
                      {/* Animated underline (span) */}
                      <span
                        className={`absolute left-0 bottom-0 block w-0 h-1 bg-[#34BFAD] transition-all duration-300 ease-in-out ${
                          selectedSubCategory === subCategory
                            ? "w-full"
                            : "group-hover:w-full"
                        }`}
                    ></span>
                  </p>
                </div>
              ))}
            </div>
          )}
          {!minimizedView && (
            <div className="animate-fade-in">
              <h3 className="text-lg font-semibold text-gray-800 ms-5">
                Subcategories of {selectedCategory.category}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-5 mt-5 justify-center">
                {selectedCategory.subcategories
                  .filter(
                    (subCategory) =>
                      selectedCategory.category === "HVAC" // Apply logic only for HVAC
                        ? userResponses.hvacType === "Centralized"
                          ? subCategory === "Centralized" // Show only "Centralized"
                          : subCategory !== "Centralized" // Exclude "Centralized"
                        : true // Show all subcategories for non-HVAC categories
                  )
                  .map((subCategory, index) => {
                    const imageSrcSubCat = getImageSrcSubCat(
                      selectedCategory.category,
                      subCategory
                    );

                  return (
                    <div
                      key={index}
                      // className="p-4 border rounded-lg cursor-pointer hover:bg-gray-100"
                      onClick={() => setSelectedSubCategory(subCategory)}
                    >
                      <div className="flex flex-col items-center justify-evenly flex-wrap relative ">
                        <div className="flex flex-col gap-[19px] items-center justify-center w-full relative cursor-pointer hover:scale-105 transition-transform duration-500 ease-in-out">
                          <div className="relative w-[160px] h-[170px] flex items-center justify-center bg-gradient-to-r from-[#003442] to-[#34BFAD] rounded-[26px] ">
                            <img
                              className="rounded-3xl w-[150px] h-[150px] object-cover"
                              src={imageSrcSubCat}
                              alt={`${subCategory} subcategory`}
                            />
                          </div>
                          <p className="text-[#444444] text-center font-['Montserrat-Medium',_sans-serif] text-sm font-medium relative">
                            {subCategory}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Categories;
