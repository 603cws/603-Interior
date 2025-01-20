import React, { useEffect } from "react";

const MainPage = ({
  selectedCategory,
  selectedSubCategory1,
  setSelectedSubCategory1,
  subCat1,
  userResponses,
}) => {
  useEffect(() => {
    // Automatically select the first subcategory when the category changes
    if (subCat1 && selectedCategory?.category) {
      const subCategories = subCat1[selectedCategory.category];

      if (subCategories && subCategories.length > 0) {
        // Only apply filtering logic for HVAC category
        if (selectedCategory.category === "HVAC") {
          const filteredSubCategories =
            userResponses.hvacType === "Centralized"
              ? subCategories.filter(
                  (subCategory) => subCategory === "Centralized AC"
                )
              : subCategories.filter(
                  (subCategory) => subCategory !== "Centralized AC"
                );

          // Set the first subcategory from the filtered list, fallback to null if empty
          if (
            !selectedSubCategory1 ||
            !filteredSubCategories.includes(selectedSubCategory1)
          ) {
            setSelectedSubCategory1(filteredSubCategories[0] || null);
          }
        } else {
          // If not HVAC, just set the first subcategory as default
          if (
            !selectedSubCategory1 ||
            !subCategories.includes(selectedSubCategory1)
          ) {
            setSelectedSubCategory1(subCategories[0] || null);
          }
        }
      } else {
        setSelectedSubCategory1(null); // If no subcategories, set to null
      }
    }
  }, [subCat1, selectedCategory, userResponses.hvacType, selectedSubCategory1]);

  const selectedSubCategories =
    subCat1 && subCat1[selectedCategory.category]
      ? selectedCategory.category === "HVAC" // Apply filter logic only for HVAC
        ? userResponses.hvacType === "Centralized"
          ? subCat1[selectedCategory.category].filter(
              (subCategory) => subCategory === "Centralized AC" // Only "Centralized AC"
            )
          : subCat1[selectedCategory.category].filter(
              (subCategory) => subCategory !== "Centralized AC" // Exclude "Centralized AC"
            )
        : subCat1[selectedCategory.category] // No filter logic for other categories
      : [];

  return (
    <div className="flex flex-row gap-2 items-center justify-start relative overflow-hidden px-8">
      {selectedSubCategories && selectedSubCategories.length > 0 ? (
        selectedSubCategories.map((subCategory1, index) => (
          <div
            key={index}
            className={`bg-[#a9d3ce] border-solid border-[#000000] border pr-[37px] pl-[37px] flex flex-col gap-2.5 items-start justify-start shrink-0 w-[169px] relative ${
              selectedSubCategory1 === subCategory1
                ? "bg-[#82b8b0]"
                : "bg-white" // Highlight the default selected subcategory
            }`}
            onClick={() => setSelectedSubCategory1(subCategory1)} // Allow changing selection on click
          >
            <div className="flex flex-row items-center justify-center self-stretch relative overflow-hidden">
              <button className="text-[#252525] text-center font-['Poppins-Regular',_sans-serif] text-md leading-[30px] font-normal relative flex items-center justify-center px-7">
                {subCategory1}
              </button>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center text-gray-500">
          No subcategories available for {selectedCategory.category}.
        </div>
      )}
      {/* {selectedSubCategory1 && (
                <div className="mt-4 text-gray-700">
                    Selected Subcategory: <strong>{selectedSubCategory1}</strong>
                </div>
            )} */}
    </div>
  );
};

export default MainPage;
