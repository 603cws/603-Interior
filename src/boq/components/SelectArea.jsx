import { useEffect } from "react"; //useState
import { MdOutlineCancel } from "react-icons/md";
import { useApp } from "../../Context/Context";

function SelectArea({
  setShowSelectArea,
  image,
  subCategories,
  selectedAreas,
  setSelectedAreas,
  selectedProductView,
  handelSelectedData,
  categoriesWithTwoLevelCheck,
}) {
  const {
    selectedData,
    selectedCategory,
    selectedSubCategory1,
    userResponses,
    setUserResponses,
  } = useApp();

  // Initialize selected areas based on selectedData
  useEffect(() => {
    // Only proceed if selectedData is a non-empty array
    if (Array.isArray(selectedData) && selectedData.length > 0) {
      const initialSelectedAreas = subCategories.filter(
        (subCat) =>
          selectedData.some((item) =>
            // Check for the 'Flooring' category separately
            categoriesWithTwoLevelCheck.includes(item.category)
              ? item.id === selectedProductView?.id
                ? `${item.category}-${item.subcategory}-${item.subcategory1}` ===
                  `${selectedCategory.category}-${subCat}-${selectedSubCategory1}`
                : `${item.category}-${item.subcategory}` ===
                  `${selectedCategory.category}-${subCat}`
              : `${item.category}-${item.subcategory}-${item.subcategory1}` ===
                `${selectedCategory.category}-${subCat}-${selectedSubCategory1}`
          )

        // Array.isArray(selectedData) &&
        // selectedData.length > 0 &&
        // isItemSelected(
        //   selectedData,
        //   selectedCategory,
        //   subCat,
        //   selectedSubCategory1
        // )
      );
      setSelectedAreas(initialSelectedAreas);
    } else {
      // If selectedData is empty, clear the selected areas
      setSelectedAreas([]);
    }
  }, [
    subCategories,
    selectedData,
    selectedCategory,
    selectedSubCategory1,
    setSelectedAreas,
  ]);

  useEffect(() => {
    // Function to handle "Esc" key press
    const handleEscKey = (e) => {
      if (e.key === "Escape") {
        setShowSelectArea(false);
      }
    };

    // Add event listener when component is mounted
    document.addEventListener("keydown", handleEscKey);

    // Cleanup event listener on component unmount
    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, []);

  const handleCheckboxChange = (value, checked) => {
    setSelectedAreas((prev) =>
      checked ? [...prev, value] : prev.filter((item) => item !== value)
    );
  };

  const handleDoneClick = () => {
    const allSubcategories = subCategories; // All available subcategories

    // Process all subcategories to handle addition and removal
    allSubcategories.forEach((subCat) => {
      const isDisabled =
        // Array.isArray(selectedData) &&
        // selectedData.length > 0 &&
        // selectedData.some(
        //   (item) =>
        //     `${item.category}-${item.subcategory}-${item.subcategory1}` ===
        //       `${selectedCategory.category}-${subCat}-${selectedSubCategory1}` &&
        //     item.product_variant.variant_title !== selectedProductView.title
        // );
        Array.isArray(selectedData) &&
        selectedData.length > 0 &&
        isItemSelected(
          selectedData,
          selectedCategory,
          subCat,
          selectedSubCategory1,
          selectedProductView
        );

      // Skip processing if the subcategory is disabled
      if (isDisabled) return;

      const isChecked = selectedAreas.includes(subCat);

      // Add or remove the product for the current subcategory
      handelSelectedData(
        selectedProductView,
        selectedCategory,
        subCat,
        selectedSubCategory1,
        isChecked // Pass whether the subcategory is selected or not
      );
    });

    setShowSelectArea(false); // Close the modal
  };

  const isItemSelected = (
    selectedData,
    selectedCategory,
    subCat,
    selectedSubCategory1,
    selectedProductView
  ) => {
    return (
      Array.isArray(selectedData) &&
      selectedData.some((item) => {
        const baseCondition = categoriesWithTwoLevelCheck.includes(
          selectedCategory.category
        )
          ? `${item.category}-${item.subcategory}` ===
              `${selectedCategory.category}-${subCat}` &&
            item.product_variant.variant_title !== selectedProductView?.title
          : `${item.category}-${item.subcategory}-${item.subcategory1}` ===
              `${selectedCategory.category}-${subCat}-${selectedSubCategory1}` &&
            item.product_variant.variant_title !== selectedProductView?.title;

        // Directly return baseCondition
        return baseCondition;
      })
    );
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      const selectableSubCategories = selectedCategory.subcategories.filter(
        (subCategory) =>
          !isItemSelected(
            selectedData,
            selectedCategory,
            subCategory,
            selectedSubCategory1,
            selectedProductView
          )
      );
      setSelectedAreas(selectableSubCategories);
    } else {
      setSelectedAreas([]);
    }
  };

  // Check if all selectable subcategories are already selected
  const allSelected =
    selectedCategory.subcategories?.every(
      (subCategory) =>
        selectedAreas.includes(subCategory) ||
        isItemSelected(
          selectedData,
          selectedCategory,
          subCategory,
          selectedSubCategory1,
          selectedProductView
        )
    ) ?? false;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-20">
      <div className="bg-white border-[30px] border-[#1A3A36] rounded-xl max-w-[90%] max-h-screen h-[500px] overflow-auto w-[1000px] scrollbar-hide">
        <div className="p-4 border-2 border-[#FFD500] rounded-xl relative h-auto lg:h-full">
          {/* Title */}
          <div className="flex justify-center items-center mb-4">
            <p className="text-center font-semibold text-lg">
              Select Your Area
            </p>
          </div>

          {/* Content */}
          <div className="flex flex-col lg:flex-row justify-between gap-8">
            {/* Subcategories Checkbox List */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {selectedCategory.subcategories
                ?.filter(
                  (subCategory) =>
                    selectedCategory.category === "HVAC"
                      ? userResponses?.hvacType === "Centralized"
                        ? subCategory === "Centralized" // Show only "Centralized"
                        : subCategory !== "Centralized" // Show all except "Centralized"
                      : true // Show all for non-HVAC categories
                )
                .map((name, id) => (
                  <div key={id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`subCategory-${id}`}
                      value={name}
                      checked={selectedAreas.includes(name)}
                      onChange={(e) =>
                        handleCheckboxChange(e.target.value, e.target.checked)
                      }
                      className="appearance-none w-4 h-4  cursor-pointer transition duration-300 
                      bg-black checked:border-black 
                      relative checked:before:content-['✔'] checked:before:absolute checked:before:text-white 
                      checked:before:top-[50%] checked:before:left-[50%] checked:before:translate-x-[-50%] checked:before:translate-y-[-50%] 
                      checked:before:text-[14px] checked:before:font-bold"
                      disabled={
                        // Array.isArray(selectedData) &&
                        // selectedData.length > 0 &&
                        // selectedData.some((item) =>
                        //   // item.groupKey ===
                        //   // `${selectedCategory.category}-${name}-${selectedSubCategory1}-${selectedProductView.id}` &&
                        //   item.category === "Flooring"
                        //     ? `${item.category}-${item.subcategory}` ===
                        //         `${selectedCategory.category}-${name}` &&
                        //       item.product_variant.variant_title !==
                        //         selectedProductView.title
                        //     : `${item.category}-${item.subcategory}-${item.subcategory1}` ===
                        //         `${selectedCategory.category}-${name}-${selectedSubCategory1}` &&
                        //       item.product_variant.variant_title !==
                        //         selectedProductView.title
                        // )
                        Array.isArray(selectedData) &&
                        selectedData.length > 0 &&
                        isItemSelected(
                          selectedData,
                          selectedCategory,
                          name,
                          selectedSubCategory1,
                          selectedProductView
                        )
                      }
                    />
                    <label
                      htmlFor={`subCategory-${id}`}
                      className={`${
                        // Array.isArray(selectedData) &&
                        // selectedData.length > 0 &&
                        // selectedData.some((item) =>
                        //   // item.groupKey ===
                        //   // `${selectedCategory.category}-${name}-${selectedSubCategory1}-${selectedProductView.id}` &&

                        //   item.category === "Furniture"
                        //     ? `${item.category}-${item.subcategory}-${item.subcategory1}` ===
                        //         `${selectedCategory.category}-${name}-${selectedSubCategory1}` &&
                        //       item.product_variant.variant_title !==
                        //         selectedProductView.title
                        //     : `${item.category}-${item.subcategory}` ===
                        //         `${selectedCategory.category}-${name}` &&
                        //       item.product_variant.variant_title !==
                        //         selectedProductView.title
                        // )
                        Array.isArray(selectedData) &&
                        selectedData.length > 0 &&
                        isItemSelected(
                          selectedData,
                          selectedCategory,
                          name,
                          selectedSubCategory1,
                          selectedProductView
                        )
                          ? "text-gray-400 cursor-not-allowed"
                          : ""
                      } text-sm cursor-pointer`}
                    >
                      {name}
                    </label>
                  </div>
                ))}
              <div className="flex items-center gap-2 col-span-full mr-10">
                <input
                  type="checkbox"
                  id="selectAll"
                  checked={allSelected}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="appearance-none w-4 h-4 cursor-pointer transition duration-300 
                  bg-black checked:border-black 
                  relative checked:before:content-['✔'] checked:before:absolute checked:before:text-white 
                  checked:before:top-[50%] checked:before:left-[50%] checked:before:translate-x-[-50%] checked:before:translate-y-[-50%] 
                  checked:before:text-[14px] checked:before:font-bold"
                />
                <label htmlFor="selectAll" className="text-sm  cursor-pointer">
                  Select All
                </label>
              </div>
            </div>

            {/* Image Section */}
            <div className="flex justify-center items-center">
              <img
                src={image}
                alt={selectedProductView.title}
                className="rounded-md object-cover max-w-[200px] lg:max-w-[300px] max-h-[300px] border border-gray-300 shadow-md"
              />
            </div>
          </div>

          {/* Close Button */}
          <MdOutlineCancel
            size={30}
            color="gray"
            className="absolute right-4 top-4 cursor-pointer"
            onClick={() => setShowSelectArea(false)}
          />

          {/* Done Button */}
          <div className="flex justify-center items-center mt-4">
            <button
              className="bg-[#1A3A36] rounded-lg text-sm py-2 px-10 border-2 border-gray-900 text-white"
              onClick={handleDoneClick}
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SelectArea;
