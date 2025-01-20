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
}) {
  const { selectedData, selectedCategory, selectedSubCategory1 } = useApp();

  // Initialize selected areas based on selectedData
  useEffect(() => {
    // Only proceed if selectedData is a non-empty array
    if (Array.isArray(selectedData) && selectedData.length > 0) {
      const initialSelectedAreas = subCategories.filter((subCat) =>
        selectedData.some(
          (item) =>
            // item.groupKey ===
            // `${selectedCategory.category}-${subCat}-${selectedSubCategory1}-${selectedProductView.id}`
            `${item.category}-${item.subcategory}-${item.subcategory1}` ===
            `${selectedCategory.category}-${subCat}-${selectedSubCategory1}`
        )
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
        Array.isArray(selectedData) &&
        selectedData.length > 0 &&
        selectedData.some(
          (item) =>
            `${item.category}-${item.subcategory}-${item.subcategory1}` ===
              `${selectedCategory.category}-${subCat}-${selectedSubCategory1}` &&
            item.product_variant.variant_title !== selectedProductView.title
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-10">
      <div className="bg-white border-8 border-[#1A3A36] rounded-xl max-w-[90%] max-h-screen overflow-auto w-[1000px]">
        <div className="p-4 border-2 border-[#FFD500] rounded-xl relative">
          {/* Title */}
          <div className="flex justify-center items-center mb-4">
            <p className="text-center font-semibold text-lg">
              Select Your Area
            </p>
          </div>

          {/* Content */}
          <div className="flex flex-col lg:flex-row justify-between gap-8">
            {/* Subcategories Checkbox List */}
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 p-4 cursor-pointer">
              {subCategories.map((name, id) => (
                <div
                  key={id}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    id={`subCategory-${id}`}
                    value={name}
                    checked={selectedAreas.includes(name)}
                    onChange={(e) =>
                      handleCheckboxChange(e.target.value, e.target.checked)
                    }
                    disabled={
                      Array.isArray(selectedData) &&
                      selectedData.length > 0 &&
                      selectedData.some(
                        (item) =>
                          // item.groupKey ===
                          // `${selectedCategory.category}-${name}-${selectedSubCategory1}-${selectedProductView.id}` &&
                          `${item.category}-${item.subcategory}-${item.subcategory1}` ===
                            `${selectedCategory.category}-${name}-${selectedSubCategory1}` &&
                          item.product_variant.variant_title !==
                            selectedProductView.title
                      )
                    }
                  />
                  <label
                    htmlFor={`subCategory-${id}`}
                    className={`${
                      Array.isArray(selectedData) &&
                      selectedData.length > 0 &&
                      selectedData.some(
                        (item) =>
                          // item.groupKey ===
                          // `${selectedCategory.category}-${name}-${selectedSubCategory1}-${selectedProductView.id}` &&
                          `${item.category}-${item.subcategory}-${item.subcategory1}` ===
                            `${selectedCategory.category}-${name}-${selectedSubCategory1}` &&
                          item.product_variant.variant_title !==
                            selectedProductView.title
                      )
                        ? "text-gray-400 cursor-not-allowed"
                        : ""
                    }text-sm`}
                  >
                    {name}
                  </label>

                  {Array.isArray(selectedData) &&
                    selectedData.length > 0 &&
                    selectedData.some(
                      (item) =>
                        // item.groupKey ===
                        // `${selectedCategory.category}-${name}-${selectedSubCategory1}-${selectedProductView.id}` &&
                        `${item.category}-${item.subcategory}-${item.subcategory1}` ===
                          `${selectedCategory.category}-${name}-${selectedSubCategory1}` &&
                        item.product_variant.variant_title !==
                          selectedProductView.title
                    ) && (
                      <div className="tooltip bg-gray-700 text-white text-xs rounded px-2 py-1 absolute -top-8 left-0">
                        Already selected for another product
                      </div>
                    )}
                </div>
              ))}
            </div>

            {/* Image Section */}
            <div className="flex justify-center items-center">
              <img
                src={image}
                alt="select area"
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
              className="bg-[#1A3A36] rounded-xl text-sm py-2 px-5 text-white"
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
