import React, { useEffect } from "react";
import { useApp } from "../../Context/Context";

const MainPage = ({ userResponses, setSelectedSubCategory1, productsData }) => {
  const {
    selectedCategory,
    selectedSubCategory,
    setSelectedSubCategory,
    selectedSubCategory1,
    // setSelectedSubCategory1,
    subCat1,
    setSubCat1,
  } = useApp();

  useEffect(() => {
    if (subCat1 && selectedCategory?.category) {
      let subCategories = subCat1[selectedCategory.category] || [];

      // Apply filter for HVAC category
      if (selectedCategory.category === "HVAC") {
        subCategories =
          userResponses.hvacType === "Centralized"
            ? subCategories.filter(
                (subCategory) => subCategory === "Centralized AC"
              )
            : subCategories.filter(
                (subCategory) => subCategory !== "Centralized AC"
              );
      }

      // Apply filter for Civil / Plumbing -> Pantry
      if (
        selectedCategory.category === "Civil / Plumbing" &&
        selectedSubCategory === "Pantry"
      ) {
        subCategories = subCategories.filter(
          (subCategory) => subCategory !== "Pods"
        );
      }

      // Automatically select the first available subcategory when switching
      if (
        !selectedSubCategory1 ||
        !subCategories.includes(selectedSubCategory1)
      ) {
        setSelectedSubCategory1(subCategories[0] || null);
      }
    } else {
      setSelectedSubCategory1(null); // Reset if no subcategories exist
    }
  }, [
    subCat1,
    selectedCategory,
    selectedSubCategory,
    userResponses.hvacType,
    setSelectedSubCategory1,
  ]);

  const selectedSubCategories =
    subCat1 && subCat1[selectedCategory.category]
      ? selectedCategory.category === "HVAC"
        ? userResponses.hvacType === "Centralized"
          ? subCat1[selectedCategory.category].filter(
              (subCategory) => subCategory === "Centralized AC" // Only "Centralized AC"
            )
          : subCat1[selectedCategory.category].filter(
              (subCategory) => subCategory !== "Centralized AC" // Exclude "Centralized AC"
            )
        : selectedCategory.category === "Civil / Plumbing" &&
          selectedSubCategory === "Pantry"
        ? subCat1[selectedCategory.category].filter(
            (subCategory) => subCategory !== "Pods" // Exclude "Pods"
          )
        : subCat1[selectedCategory.category] // No filter logic for other categories
      : [];

  console.log("all products", productsData);

  return (
    // subcategory1 (table,chair)
    <div className="main-page flex flex-row gap-4 items-center justify-start relative overflow-hidden px-8 font-Poppins">
      {selectedSubCategories && selectedSubCategories.length > 0 ? (
        selectedSubCategories.map((subCategory1, index) => (
          <div
            key={index}
            className={`bg-[#a9d3ce] border-solid border-[#000000] border flex flex-col gap-2.5 items-start shrink-0 w-auto h-10 justify-center relative rounded-xl ${
              selectedSubCategory1 === subCategory1
                ? "bg-[#82b8b0]"
                : "bg-white" // Highlight the default selected subcategory
            }`}
            onClick={() => setSelectedSubCategory1(subCategory1)} // Allow changing selection on click
          >
            <div className="flex flex-row items-center justify-center self-stretch relative overflow-hidden">
              <button className="text-[#252525] text-center text-md leading-[30px] font-normal relative flex items-center justify-center px-7">
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
