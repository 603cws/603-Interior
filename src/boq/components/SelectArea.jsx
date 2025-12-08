import { useEffect, useState } from "react";
import { useApp } from "../../Context/Context";
import Addon from "./Addon";
import { calculateAddonTotalPrice } from "../utils/productUtils";
import { AddToCartToast } from "../../utils/AddToCartToast";
import { categoriesWithTwoLevelCheck } from "../../constants/constant";

function SelectArea({
  setShowSelectArea,
  image,
  selectedAreas,
  setSelectedAreas,
  selectedProductView,
  allAddons,
  setShowBackground,
  selectedCategory,
  selectedSubCategory,
  selectedSubCategory1,
}) {
  //Don't call the selectedCategory, selectedSubCategory, selectedSubCategory1, subCategories from Context => Sunny
  const {
    selectedData,
    userResponses,
    setSelectedData,
    areasData,
    quantityData,
    handelSelectedData,
    productQuantity,
    setProductQuantity,
    categoryConfig,
  } = useApp();

  const [showAddon, setShowAddon] = useState(false);
  const [allSubcategories, setAllSubcategories] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [submitBtn, setSubmitBtn] = useState(false);
  const [selectedAddonsMap, setSelectedAddonsMap] = useState({});
  const [commonSubcategories, setCommonSubcategories] = useState([]);

  useEffect(() => {
    const addonsMap = {};
    selectedData.forEach((item) => {
      addonsMap[item.groupKey] = item.addons || [];
    });
    setSelectedAddonsMap(addonsMap);
  }, [selectedData]);

  useEffect(() => {
    if (!allAddons || allAddons.length === 0) setSubmitBtn(true);
  }, [allAddons]);

  useEffect(() => {
    const common = selectedProductView.subcategory.filter((item) =>
      selectedCategory.subcategories.includes(item)
    );
    setCommonSubcategories(common);
  }, [selectedCategory, selectedProductView]);
  const subCategories = commonSubcategories;

  const handleAddonClick = () => {
    setShowAddon(false);
    setShowSelectArea(false);
    setShowBackground(false);

    setSelectedData((prevData) => {
      const updatedData = prevData.map((item) => {
        const currentGroupKey = `${selectedCategory.category}-${item.subcategory}-${selectedSubCategory1}-${item.id}`;
        return {
          ...item,
          addons: (selectedAddonsMap[currentGroupKey] || []).map((addon) => ({
            ...addon,
            finalPrice: calculateAddonTotalPrice(
              selectedCategory.category,
              item.subcategory,
              selectedSubCategory1,
              addon,
              selectedCategory,
              selectedSubCategory,
              selectedSubCategory1,
              userResponses,
              areasData,
              quantityData
            ),
          })),
        };
      });
      AddToCartToast(selectedProductView, "boq");

      localStorage.setItem("selectedData", JSON.stringify(updatedData));
      return updatedData;
    });

    const currentProductKey = `${selectedCategory.category}-${selectedProductView.subcategory}-${selectedSubCategory1}-${selectedProductView.id}`;
    setSelectedAddonsMap((prev) => ({
      ...prev,
      [currentProductKey]: selectedAddons,
    }));
  };

  useEffect(() => {
    if (allSubcategories.length > 0) {
      setSelectedRoom(allSubcategories[0]);
    }
  }, [allSubcategories]);

  useEffect(() => {
    if (Array.isArray(selectedData) && selectedData.length > 0) {
      const displayedSubCategories = subCategories.flatMap((subCat) => {
        if (
          selectedCategory.category === "Furniture" &&
          selectedSubCategory1 === "Chair" &&
          subCat === "Md Cabin"
        ) {
          return ["Md Cabin Main", "Md Cabin Visitor"];
        }
        if (
          selectedCategory.category === "Furniture" &&
          selectedSubCategory1 === "Chair" &&
          subCat === "Manager Cabin"
        ) {
          return ["Manager Cabin Main", "Manager Cabin Visitor"];
        }
        return [subCat];
      });

      const initialSelectedAreas = displayedSubCategories.filter((subCat) =>
        selectedData.some((item) =>
          categoriesWithTwoLevelCheck.includes(item.category)
            ? `${item.category}-${item.subcategory}` ===
              `${selectedCategory.category}-${subCat}`
            : `${item.category}-${item.subcategory}-${item.subcategory1}` ===
              `${selectedCategory.category}-${subCat}-${selectedSubCategory1}`
        )
      );

      setSelectedAreas(initialSelectedAreas);
    } else {
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
    const handleEscKey = (e) => {
      if (e.key === "Escape") {
        setShowSelectArea(false);
        setShowBackground(false);
      }
    };

    document.addEventListener("keydown", handleEscKey);

    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCheckboxChange = (value, checked) => {
    setSelectedAreas((prev) =>
      checked ? [...prev, value] : prev.filter((item) => item !== value)
    );
  };

  const handleDoneClick = () => {
    let displayedSubCategories = subCategories.flatMap((subCat) => {
      if (
        selectedCategory.category === "Furniture" &&
        selectedSubCategory1 === "Chair" &&
        subCat === "Md Cabin"
      ) {
        return ["Md Cabin Main", "Md Cabin Visitor"];
      }
      if (
        selectedCategory.category === "Furniture" &&
        selectedSubCategory1 === "Chair" &&
        subCat === "Manager Cabin"
      ) {
        return ["Manager Cabin Main", "Manager Cabin Visitor"];
      }
      return [subCat];
    });

    let selectedSubcategories = displayedSubCategories
      .filter((subCat) => selectedAreas.includes(subCat))
      .filter(
        (subCat) =>
          !isItemSelected(
            selectedData,
            selectedCategory,
            subCat,
            selectedSubCategory1,
            selectedProductView
          )
      );

    setAllSubcategories(selectedSubcategories);

    displayedSubCategories.forEach((subCat) => {
      const isChecked = selectedAreas.includes(subCat);
      if (
        isItemSelected(
          selectedData,
          selectedCategory,
          subCat,
          selectedSubCategory1,
          selectedProductView
        )
      ) {
        return;
      }

      handelSelectedData(
        selectedProductView,
        selectedCategory,
        subCat,
        selectedSubCategory1,
        isChecked,
        productQuantity
      );
    });

    if (selectedSubcategories.length > 0) {
      if (!allAddons || allAddons.length === 0) {
        setShowSelectArea(false);
        setShowBackground(false);
        AddToCartToast(selectedProductView, "boq");
      } else {
        setShowAddon(true);
      }
    } else {
      setShowSelectArea(false);
      setShowBackground(false);
    }
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
        if (
          item.product_variant?.variant_title === selectedProductView?.title
        ) {
          return false;
        }
        const compareSubCat = subCat;

        if (categoriesWithTwoLevelCheck.includes(selectedCategory.category)) {
          return (
            `${item.category}-${item.subcategory}` ===
            `${selectedCategory.category}-${compareSubCat}`
          );
        } else {
          return (
            `${item.category}-${item.subcategory}-${item.subcategory1}` ===
            `${selectedCategory.category}-${compareSubCat}-${selectedSubCategory1}`
          );
        }
      })
    );
  };

  function isExcluded(category, subCategory, selectedSubCategory1, config) {
    const categoryRules = config[category] || {};
    const rules = categoryRules[subCategory] || categoryRules.Default || {};

    if (rules.exclude && Array.isArray(rules.exclude)) {
      return rules.exclude.includes(selectedSubCategory1);
    }

    return false;
  }

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

  const displayedSubCategories = commonSubcategories.flatMap((subCategory) => {
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

  const handleAddonSelect = (addon, isChecked) => {
    const currentGroupKey = `${selectedCategory.category}-${selectedSubCategory}-${selectedSubCategory1}-${selectedProductView.id}`;

    setSelectedAddonsMap((prev) => {
      const existingAddons = prev[currentGroupKey] || [];

      const updatedAddons = isChecked
        ? [...existingAddons, addon]
        : existingAddons.filter((item) => item.id !== addon.id);

      return { ...prev, [currentGroupKey]: updatedAddons };
    });

    setSelectedAddons((prev) =>
      isChecked ? [...prev, addon] : prev.filter((item) => item.id !== addon.id)
    );
  };

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

  function isIncluded(category, subCategory, selectedSubCategory1, config) {
    const categoryRules = config[category] || {};
    const excludes = categoryRules[subCategory]?.exclude || [];
    return !excludes.includes(selectedSubCategory1);
  }

  return (
    <div className="fixed inset-0 flex justify-center items-center z-20">
      <div className="relative bg-gradient-to-br from-[#334A78] to-[#68B2DC] p-5 md:p-6 scrollbar-hide">
        <img
          src="../images/icons/close_btn.svg"
          alt="close"
          className="absolute top-1 right-1 lg:top-1 lg:right-1 cursor-pointer w-5 h-5 sm:w-6 sm:h-6"
          onClick={() => {
            setShowBackground(false);
            setShowSelectArea(false);
          }}
        />

        <div className="bg-white p-6 rounded-lg border-[3px] border-[#FFD500]">
          {!showAddon && (
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
                              handleCheckboxChange(
                                name,
                                !selectedAreas.includes(name)
                              )
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
                          ((name === "Reception" &&
                            selectedSubCategory1 === "Chair") ||
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
                                  productQuantity[name]?.[
                                    selectedSubCategory1
                                  ] || 1
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
                                  productQuantity[name]?.[
                                    selectedSubCategory1
                                  ] || 1
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
                              value={
                                productQuantity[name]?.[selectedSubCategory1] ||
                                1
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
                                  productQuantity[name]?.[
                                    selectedSubCategory1
                                  ] || 1
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
          )}

          {showAddon && (
            <div className="flex flex-col lg:flex-row justify-between gap-8">
              <div className="flex flex-col gap-2 w-full lg:w-[70%]">
                <p className="text-center font-semibold text-sm lg:text-lg mb-4">
                  Select Your Addon
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {allSubcategories.map((room, id) => (
                    <button
                      key={id}
                      onClick={() => setSelectedRoom(room)}
                      className={`px-4 py-2 border text-xs lg:text-base rounded-md transition ${
                        selectedRoom === room
                          ? "bg-gradient-to-r from-[#334A78] to-[#68B2DC] text-white"
                          : "bg-gray-200"
                      }`}
                    >
                      {room}
                    </button>
                  ))}
                </div>
                <div className="flex justify-evenly items-center mt-auto pb-4">
                  <button
                    className="bg-[#374A75] rounded-lg text-xs md:text-sm py-2 px-10 border-2 border-black text-white"
                    onClick={() => setShowAddon(false)}
                  >
                    Back
                  </button>
                  <button
                    className="bg-[#374A75] rounded-lg text-xs md:text-sm py-2 px-10 border-2 border-black text-white"
                    onClick={() => handleAddonClick()}
                  >
                    Done
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-4 border-2 border-gray-300 p-4 w-full lg:w-[30%] lg:min-h-full shadow-lg overflow-y-auto max-h-[500px] gradient-scrollbar">
                <Addon
                  allAddons={allAddons}
                  onAddonSelect={handleAddonSelect}
                  selectedRoom={selectedRoom}
                  selectedData={selectedData}
                  selectedProductView={selectedProductView}
                  selectedAddons={selectedAddons}
                  setSelectedAddons={setSelectedAddons}
                  selectedAddonsMap={selectedAddonsMap}
                  setSelectedAddonsMap={setSelectedAddonsMap}
                  setShowSelectArea={setShowSelectArea}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SelectArea;
