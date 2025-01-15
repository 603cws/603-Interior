import { useState } from "react";
import { MdOutlineCancel } from "react-icons/md";

function SelectArea({
  setShowSelectArea,
  image,
  subCategories,
  selectedAreas,
  setSelectedAreas,
  selectedProductView,
  selectedCategory,
  selectedSubCategory1,
  handelSelectedData,
}) {
  const handleCheckboxChange = (value, checked) => {
    setSelectedAreas((prev) =>
      checked ? [...prev, value] : prev.filter((item) => item !== value)
    );
  };

  const handleDoneClick = () => {
    selectedAreas.forEach((subCat) => {
      handelSelectedData(
        selectedProductView,
        selectedCategory,
        subCat,
        selectedSubCategory1 // Pass the selectedSubCategory1 as well
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
            <p className="text-center font-semibold text-xl">
              Select Your Area
            </p>
          </div>

          {/* Content */}
          <div className="flex flex-col lg:flex-row justify-between gap-8">
            {/* Subcategories Checkbox List */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 p-4">
              {subCategories.map((name, id) => (
                <div key={id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={`subCategory-${id}`}
                    value={name}
                    checked={selectedAreas.includes(name)} // Persist checked state
                    onChange={(e) =>
                      handleCheckboxChange(e.target.value, e.target.checked)
                    }
                  />
                  <label htmlFor={`subCategory-${id}`}>{name}</label>
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
