import { useApp } from "../../Context/Context";

function AreaSelector({
  setSelectedAreas,
  selectedCategory,
  selectedSubCategory1,
  selectedAreas,
  selectedProductView,
  commonSubcategories,
  image,
  submitBtn,
  isIncluded,
  isExcluded,
  displayedSubCategories,
  isItemSelected,
  handleDoneClick,
}) {
  const {
    selectedData,
    userResponses,
    productQuantity,
    setProductQuantity,
    categoryConfig,
  } = useApp();

  const handleCheckboxChange = (value, checked) => {
    setSelectedAreas((prev) =>
      checked ? [...prev, value] : prev.filter((item) => item !== value)
    );
  };

  const handleSelectAll = (checked) => {
    let displayedSubCategories = commonSubcategories.flatMap((subCategory) => {
      if (
        selectedCategory.category === "Furniture" &&
        selectedSubCategory1 === "Chair" &&
        subCategory === "Md Cabin"
      ) {
        return ["Md Cabin Main", "Md Cabin Visitor"];
      }
      if (
        selectedCategory.category === "Furniture" &&
        selectedSubCategory1 === "Chair" &&
        subCategory === "Manager Cabin"
      ) {
        return ["Manager Cabin Main", "Manager Cabin Visitor"];
      }
      return [subCategory];
    });

    if (checked) {
      const selectable = displayedSubCategories.filter((subCategory) => {
        if (selectedCategory.category === "HVAC") {
          return userResponses?.hvacType === "Centralized"
            ? subCategory === "Centralized"
            : subCategory !== "Centralized";
        }

        const notDisabled = !isExcluded(
          selectedCategory.category,
          subCategory,
          selectedSubCategory1,
          categoryConfig
        );

        return (
          notDisabled &&
          !isItemSelected(
            selectedData,
            selectedCategory,
            subCategory,
            selectedSubCategory1,
            selectedProductView
          )
        );
      });

      setSelectedAreas(selectable);
    } else {
      let displayedSubCategories = commonSubcategories.flatMap(
        (subCategory) => {
          if (
            selectedCategory.category === "Furniture" &&
            selectedSubCategory1 === "Chair" &&
            subCategory === "Md Cabin"
          ) {
            return ["Md Cabin Main", "Md Cabin Visitor"];
          }
          if (
            selectedCategory.category === "Furniture" &&
            selectedSubCategory1 === "Chair" &&
            subCategory === "Manager Cabin"
          ) {
            return ["Manager Cabin Main", "Manager Cabin Visitor"];
          }
          return [subCategory];
        }
      );

      const nonDisabled = displayedSubCategories.filter(
        (subCategory) =>
          !isItemSelected(
            selectedData,
            selectedCategory,
            subCategory,
            selectedSubCategory1,
            selectedProductView
          )
      );

      setSelectedAreas((prev) =>
        prev.filter((subCat) => !nonDisabled.includes(subCat))
      );
    }
  };

  const allSubcategoriesDisabled = displayedSubCategories
    .filter((subCategory) => {
      if (selectedCategory.category === "HVAC") {
        return userResponses?.hvacType === "Centralized"
          ? subCategory === "Centralized"
          : subCategory !== "Centralized";
      }

      return !isExcluded(
        selectedCategory.category,
        subCategory,
        selectedSubCategory1,
        categoryConfig
      );
    })
    .every((subCategory) =>
      isItemSelected(
        selectedData,
        selectedCategory,
        subCategory,
        selectedSubCategory1,
        selectedProductView
      )
    );

  const allSelected =
    displayedSubCategories
      .filter((subCategory) => {
        if (selectedCategory.category === "HVAC") {
          return userResponses?.hvacType === "Centralized"
            ? subCategory === "Centralized"
            : subCategory !== "Centralized";
        }
        return !isExcluded(
          selectedCategory.category,
          subCategory,
          selectedSubCategory1,
          categoryConfig
        );
      })
      .every(
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

  const handleIncrement = (subcategory, productName) => {
    setProductQuantity((prev) => ({
      ...prev,
      [subcategory]: {
        ...prev[subcategory],
        [productName]: Math.min(
          (prev[subcategory]?.[productName] || 1) + 1,
          1000
        ),
      },
    }));
  };

  const handleDecrement = (subcategory, productName) => {
    setProductQuantity((prev) => ({
      ...prev,
      [subcategory]: {
        ...prev[subcategory],
        [productName]: Math.max((prev[subcategory]?.[productName] || 1) - 1, 1),
      },
    }));
  };

  const handleChange = (subcategory, productName, value) => {
    let newValue = parseInt(value, 10);
    if (isNaN(newValue)) newValue = 1;
    if (newValue < 1) newValue = 1;
    if (newValue > 1000) newValue = 1000;

    setProductQuantity((prev) => ({
      ...prev,
      [subcategory]: {
        ...prev[subcategory],
        [productName]: newValue,
      },
    }));
  };

  return (
    <div className="overflow-auto">
      <p className="text-center font-semibold text-sm lg:text-lg mb-4">
        Select Your Area
      </p>

      <div className="flex flex-col lg:flex-row justify-between gap-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {commonSubcategories
            ?.filter((subCategory) => {
              if (selectedCategory.category === "HVAC") {
                return userResponses?.hvacType === "Centralized"
                  ? subCategory === "Centralized"
                  : subCategory !== "Centralized";
              }

              if (
                selectedCategory.category === "Civil / Plumbing" ||
                selectedCategory.category === "Furniture"
              ) {
                return isIncluded(
                  selectedCategory.category,
                  subCategory,
                  selectedSubCategory1,
                  categoryConfig
                );
              }

              return true;
            })
            .flatMap((name) => {
              if (
                selectedCategory.category === "Furniture" &&
                selectedSubCategory1 === "Chair" &&
                name === "Md Cabin"
              ) {
                return ["Md Cabin Main", "Md Cabin Visitor"];
              }
              if (
                selectedCategory.category === "Furniture" &&
                selectedSubCategory1 === "Chair" &&
                name === "Manager Cabin"
              ) {
                return ["Manager Cabin Main", "Manager Cabin Visitor"];
              }
              return [name];
            })
            .map((name, id) => (
              <div key={id} className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      handleCheckboxChange(name, !selectedAreas.includes(name))
                    }
                    className={`px-4 py-2 border text-xs lg:text-base rounded-md transition w-full
                                ${
                                  selectedAreas.includes(name)
                                    ? "bg-gradient-to-r from-[#334A78] to-[#68B2DC] text-white"
                                    : "bg-gray-200 text-[#000] hover:bg-gray-100"
                                }
                                ${
                                  Array.isArray(selectedData) &&
                                  isItemSelected(
                                    selectedData,
                                    selectedCategory,
                                    name,
                                    selectedSubCategory1,
                                    selectedProductView
                                  )
                                    ? "opacity-60 cursor-not-allowed"
                                    : "cursor-pointer"
                                }`}
                    disabled={
                      Array.isArray(selectedData) &&
                      isItemSelected(
                        selectedData,
                        selectedCategory,
                        name,
                        selectedSubCategory1,
                        selectedProductView
                      )
                    }
                  >
                    {name}
                  </button>
                </div>
                {selectedCategory.category === "Furniture" &&
                  ((name === "Reception" && selectedSubCategory1 === "Chair") ||
                    name === "Pantry" ||
                    name === "Breakout Room" ||
                    name === "Md Cabin Main" ||
                    name === "Md Cabin Visitor" ||
                    name === "Manager Cabin Main" ||
                    name === "Manager Cabin Visitor") &&
                  (selectedSubCategory1 === "Table" ||
                    selectedSubCategory1 === "Chair") && (
                    <div
                      className={`${
                        selectedAreas.includes(name) &&
                        !isItemSelected(
                          selectedData,
                          selectedCategory,
                          name,
                          selectedSubCategory1,
                          selectedProductView
                        )
                          ? "flex"
                          : "hidden"
                      } gap-2 h-6`}
                    >
                      <button
                        onClick={() =>
                          handleDecrement(name, selectedSubCategory1)
                        }
                        className="h-5 w-5 border border-[#ccc] flex justify-center items-center"
                      >
                        -
                      </button>
                      <input
                        type="text"
                        value={
                          productQuantity[name]?.[selectedSubCategory1] || 1
                        }
                        onChange={(e) =>
                          handleChange(
                            name,
                            selectedSubCategory1,
                            e.target.value
                          )
                        }
                        className="h-5 w-10 border border-[#ccc] flex justify-center items-center text-center text-xs"
                      />
                      <button
                        onClick={() =>
                          handleIncrement(name, selectedSubCategory1)
                        }
                        className="h-5 w-5 border border-[#ccc] flex justify-center items-center"
                      >
                        +
                      </button>
                    </div>
                  )}
                {selectedCategory.category === "Furniture" &&
                  selectedSubCategory1 === "Storage" && (
                    <div
                      className={`${
                        selectedAreas.includes(name) &&
                        !isItemSelected(
                          selectedData,
                          selectedCategory,
                          name,
                          selectedSubCategory1,
                          selectedProductView
                        )
                          ? "flex"
                          : "hidden"
                      } gap-2 h-6`}
                    >
                      <button
                        onClick={() =>
                          handleDecrement(name, selectedSubCategory1)
                        }
                        className="h-5 w-5 border border-[#ccc] flex justify-center items-center"
                      >
                        -
                      </button>
                      <input
                        type="text"
                        value={
                          productQuantity[name]?.[selectedSubCategory1] || 1
                        }
                        onChange={(e) =>
                          handleChange(
                            name,
                            selectedSubCategory1,
                            e.target.value
                          )
                        }
                        className="h-5 w-10 border border-[#ccc] flex justify-center items-center text-center text-xs"
                      />
                      <button
                        onClick={() =>
                          handleIncrement(name, selectedSubCategory1)
                        }
                        className="h-5 w-5 border border-[#ccc] flex justify-center items-center"
                      >
                        +
                      </button>
                    </div>
                  )}
                {(selectedCategory.category === "Smart Solutions" ||
                  selectedCategory.category === "Lux") && (
                  <div
                    className={`${
                      selectedAreas.includes(name) &&
                      !isItemSelected(
                        selectedData,
                        selectedCategory,
                        name,
                        selectedSubCategory1,
                        selectedProductView
                      )
                        ? "flex"
                        : "hidden"
                    } gap-2 h-6`}
                  >
                    <button
                      onClick={() =>
                        handleDecrement(name, selectedSubCategory1)
                      }
                      className="h-5 w-5 border border-[#ccc] flex justify-center items-center"
                    >
                      -
                    </button>
                    <input
                      type="text"
                      value={productQuantity[name]?.[selectedSubCategory1] || 1}
                      onChange={(e) =>
                        handleChange(name, selectedSubCategory1, e.target.value)
                      }
                      className="h-5 w-10 border border-[#ccc] flex justify-center items-center text-center text-xs"
                    />
                    <button
                      onClick={() =>
                        handleIncrement(name, selectedSubCategory1)
                      }
                      className="h-5 w-5 border border-[#ccc] flex justify-center items-center"
                    >
                      +
                    </button>
                  </div>
                )}
                {selectedCategory.category === "Civil / Plumbing" &&
                  selectedSubCategory1 !== "Tile" && (
                    <div
                      className={`${
                        selectedAreas.includes(name) &&
                        !isItemSelected(
                          selectedData,
                          selectedCategory,
                          name,
                          selectedSubCategory1,
                          selectedProductView
                        )
                          ? "flex"
                          : "hidden"
                      } gap-2 h-6`}
                    >
                      <button
                        onClick={() =>
                          handleDecrement(name, selectedSubCategory1)
                        }
                        className="h-5 w-5 border border-[#ccc] flex justify-center items-center"
                      >
                        -
                      </button>
                      <input
                        type="text"
                        value={
                          productQuantity[name]?.[selectedSubCategory1] || 1
                        }
                        onChange={(e) =>
                          handleChange(
                            name,
                            selectedSubCategory1,
                            e.target.value
                          )
                        }
                        className="h-5 w-10 border border-[#ccc] flex justify-center items-center text-center text-xs"
                      />
                      <button
                        onClick={() =>
                          handleIncrement(name, selectedSubCategory1)
                        }
                        className="h-5 w-5 border border-[#ccc] flex justify-center items-center"
                      >
                        +
                      </button>
                    </div>
                  )}
              </div>
            ))}
          <div className="flex items-center gap-2 col-span-full mr-10">
            <input
              type="checkbox"
              id="selectAll"
              checked={allSelected}
              disabled={allSubcategoriesDisabled}
              onChange={(e) => handleSelectAll(e.target.checked)}
              className="appearance-none w-3 h-3 lg:w-4 lg:h-4 cursor-pointer transition duration-300 bg-gray-200 checked:border-black
                  relative checked:before:content-['✔'] checked:before:absolute checked:before:text-white 
                  checked:before:top-1/2 checked:before:left-1/2 checked:before:-translate-x-1/2 checked:before:-translate-y-1/2 
                  checked:before:text-[14px] checked:before:font-bold disabled:bg-gray-400 disabled:cursor-not-allowed disabled:opacity-60 checked:bg-gradient-to-r checked:from-[#334A78] checked:to-[#68B2DC] checked:text-white"
            />
            <label
              htmlFor="selectAll"
              className="text-xs lg:text-sm cursor-pointer"
            >
              Select All
            </label>
          </div>
        </div>

        <div className="hidden sm:flex justify-center items-center border border-gray-300 shadow-md rounded-md p-2">
          <img
            src={image}
            alt={selectedProductView.title}
            className=" object-cover max-w-[200px] max-h-[250px] lg:max-w-[300px] lg:max-h-[300px]"
          />
        </div>
      </div>

      <div className="flex justify-center items-center mt-4">
        <button
          className="bg-[#374A75] rounded-lg text-xs lg:text-sm py-2 px-10 border-2 border-black text-white"
          onClick={() => handleDoneClick()}
        >
          {submitBtn ? "Submit" : "Next"}
        </button>
      </div>
    </div>
  );
}

export default AreaSelector;
