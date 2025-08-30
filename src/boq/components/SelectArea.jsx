import { useEffect, useState } from "react";
import { useApp } from "../../Context/Context";
import Addon from "./Addon";
import { toast, Slide } from "react-toastify";
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
  } = useApp();

  const subCategories = selectedCategory.subcategories;

  const [showAddon, setShowAddon] = useState(false);
  const [allSubcategories, setAllSubcategories] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [submitBtn, setSubmitBtn] = useState(false);
  const [selectedAddonsMap, setSelectedAddonsMap] = useState({});

  // Fetch existing addons whenever `selectedData` changes
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

  const botRight = () => {
    toast.dark("Product Added", {
      position: "bottom-right",
      transition: Slide, // Change this to Zoom, Bounce, Flip for different effects
    });
  };

  const handleAddonClick = () => {
    setShowAddon(false);
    setShowSelectArea(false); // Close the modal
    setShowBackground(false); // Hide background before exit animation

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
      // botRight();
      AddToCartToast(selectedProductView, "boq");

      localStorage.setItem("selectedData", JSON.stringify(updatedData)); // ✅ Persist correct state
      return updatedData;
    });

    // ✅ Update selectedAddonsMap correctly
    const currentProductKey = `${selectedCategory.category}-${selectedProductView.subcategory}-${selectedSubCategory1}-${selectedProductView.id}`;
    setSelectedAddonsMap((prev) => ({
      ...prev,
      [currentProductKey]: selectedAddons, // Keep only selected addons for the specific product
    }));
  };

  useEffect(() => {
    if (allSubcategories.length > 0) {
      setSelectedRoom(allSubcategories[0]); // Select the first room by default
    }
  }, [allSubcategories]);

  useEffect(() => {
    if (Array.isArray(selectedData) && selectedData.length > 0) {
      // Expand Md Cabin into Main + Visitor just like in UI
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

  // useEffect(() => {
  //   // Only proceed if selectedData is a non-empty array
  //   if (Array.isArray(selectedData) && selectedData.length > 0) {
  //     const initialSelectedAreas = subCategories.filter((subCat) =>
  //       selectedData.some((item) =>
  //         // Check for the 'Flooring' category separately
  //         categoriesWithTwoLevelCheck.includes(item.category)
  //           ? item.id === selectedProductView?.id
  //             ? `${item.category}-${item.subcategory}-${item.subcategory1}` ===
  //               `${selectedCategory.category}-${subCat}-${selectedSubCategory1}`
  //             : `${item.category}-${item.subcategory}` ===
  //               `${selectedCategory.category}-${subCat}`
  //           : `${item.category}-${item.subcategory}-${item.subcategory1}` ===
  //             `${selectedCategory.category}-${subCat}-${selectedSubCategory1}`
  //       )
  //     );
  //     setSelectedAreas(initialSelectedAreas);
  //   } else {
  //     setSelectedAreas([]);
  //   }

  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [
  //   subCategories,
  //   selectedData,
  //   selectedCategory,
  //   selectedSubCategory1,
  //   setSelectedAreas,
  // ]);

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
    // Build the list of what’s actually shown in UI (same as checkbox flatMap logic)
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

    // Filter only the ones user hasn’t already added
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

    // 🔑 Loop through displayed subs and call only for allowed ones
    displayedSubCategories.forEach((subCat) => {
      const isChecked = selectedAreas.includes(subCat);

      // ⛔ prevent re-adding if already used in another product
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
        botRight();
      } else {
        setShowAddon(true);
      }
    } else {
      setShowSelectArea(false);
      setShowBackground(false);
    }
  };

  // const handleDoneClick = () => {
  //   let selectedSubcategories = subCategories.filter((subCat) =>
  //     selectedAreas.includes(subCat)
  //   );

  //   selectedSubcategories = selectedSubcategories.filter((subCat) => {
  //     return !(
  //       Array.isArray(selectedData) &&
  //       selectedData.length > 0 &&
  //       isItemSelected(
  //         selectedData,
  //         selectedCategory,
  //         subCat,
  //         selectedSubCategory1,
  //         selectedProductView
  //       )
  //     );
  //   });

  //   setAllSubcategories(selectedSubcategories);

  //   subCategories.forEach((subCat) => {
  //     const isDisabled =
  //       Array.isArray(selectedData) &&
  //       selectedData.length > 0 &&
  //       isItemSelected(
  //         selectedData,
  //         selectedCategory,
  //         subCat,
  //         selectedSubCategory1,
  //         selectedProductView
  //       );

  //     if (isDisabled) return;

  //     const isChecked = selectedAreas.includes(subCat);

  //     handelSelectedData(
  //       selectedProductView,
  //       selectedCategory,
  //       subCat,
  //       selectedSubCategory1,
  //       isChecked, // Pass whether the subcategory is selected or not
  //       productQuantity
  //     );
  //   });

  //   if (selectedSubcategories.length > 0) {
  //     if (!allAddons || allAddons.length === 0) {
  //       setShowSelectArea(false);
  //       setShowBackground(false); // Hide background before exit animation
  //       botRight();
  //     } else {
  //       setShowAddon(true);
  //     }
  //   } else {
  //     setShowSelectArea(false);
  //     setShowBackground(false); // Hide background before exit animation
  //   }
  // };

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
        // ✅ ignore the current product itself
        if (
          item.product_variant?.variant_title === selectedProductView?.title
        ) {
          return false;
        }
        // treat Main and Visitor separately
        const compareSubCat = subCat;

        if (categoriesWithTwoLevelCheck.includes(selectedCategory.category)) {
          // For categories where subcategory1 isn’t relevant
          return (
            `${item.category}-${item.subcategory}` ===
            `${selectedCategory.category}-${compareSubCat}`
          );
        } else {
          // For categories where subcategory1 matters
          return (
            `${item.category}-${item.subcategory}-${item.subcategory1}` ===
            `${selectedCategory.category}-${compareSubCat}-${selectedSubCategory1}`
          );
        }
      })
    );
  };

  const handleSelectAll = (checked) => {
    // Expand the list first (so Md Cabin → Main + Visitor)
    let displayedSubCategories = selectedCategory.subcategories.flatMap(
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

    if (checked) {
      const selectable = displayedSubCategories.filter((subCategory) => {
        if (selectedCategory.category === "HVAC") {
          return userResponses?.hvacType === "Centralized"
            ? subCategory === "Centralized"
            : subCategory !== "Centralized";
        }

        const notDisabled = !(
          (subCategory === "Pantry" && selectedSubCategory1 === "Pods") ||
          ((subCategory === "Reception" ||
            subCategory === "Pantry" ||
            subCategory === "Breakout Room") &&
            selectedSubCategory1 === "Storage")
        );

        // ✅ Exclude already used by another product
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
      // Get the expanded list first
      let displayedSubCategories = selectedCategory.subcategories.flatMap(
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

      // 🟡 Only deselect non-disabled items
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

  const displayedSubCategories = selectedCategory.subcategories.flatMap(
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

  const allSubcategoriesDisabled = displayedSubCategories
    .filter((subCategory) => {
      if (selectedCategory.category === "HVAC") {
        return userResponses?.hvacType === "Centralized"
          ? subCategory === "Centralized"
          : subCategory !== "Centralized";
      }

      return !(
        (subCategory === "Pantry" && selectedSubCategory1 === "Pods") ||
        ((subCategory === "Reception" ||
          subCategory === "Pantry" ||
          subCategory === "Breakout Room") &&
          selectedSubCategory1 === "Storage")
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

  // const allSubcategoriesDisabled = selectedCategory.subcategories
  //   ?.filter((subCategory) => {
  //     if (selectedCategory.category === "HVAC") {
  //       return userResponses?.hvacType === "Centralized"
  //         ? subCategory === "Centralized"
  //         : subCategory !== "Centralized";
  //     }

  //     return !(
  //       (subCategory === "Pantry" && selectedSubCategory1 === "Pods") ||
  //       ((subCategory === "Reception" ||
  //         subCategory === "Pantry" ||
  //         subCategory === "Breakout Room") &&
  //         selectedSubCategory1 === "Storage")
  //     );
  //   })
  //   .every((subCategory) =>
  //     isItemSelected(
  //       selectedData,
  //       selectedCategory,
  //       subCategory,
  //       selectedSubCategory1,
  //       selectedProductView
  //     )
  //   );

  const allSelected =
    displayedSubCategories
      .filter((subCategory) => {
        if (selectedCategory.category === "HVAC") {
          return userResponses?.hvacType === "Centralized"
            ? subCategory === "Centralized"
            : subCategory !== "Centralized";
        }
        return !(
          (subCategory === "Pantry" && selectedSubCategory1 === "Pods") ||
          ((subCategory === "Reception" ||
            subCategory === "Pantry" ||
            subCategory === "Breakout Room") &&
            selectedSubCategory1 === "Storage")
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

  // const allSelected =
  //   selectedCategory.subcategories
  //     ?.filter((subCategory) => {
  //       if (selectedCategory.category === "HVAC") {
  //         return userResponses?.hvacType === "Centralized"
  //           ? subCategory === "Centralized" // Only "Centralized" should be checked
  //           : subCategory !== "Centralized"; // Exclude "Centralized" for other types
  //       }
  //       return !(
  //         (subCategory === "Pantry" && selectedSubCategory1 === "Pods") ||
  //         ((subCategory === "Reception" ||
  //           subCategory === "Pantry" ||
  //           subCategory === "Breakout Room") &&
  //           selectedSubCategory1 === "Storage")
  //       ); // Exclude Pantry when Pods is selected
  //     })
  //     .every(
  //       (subCategory) =>
  //         selectedAreas.includes(subCategory) ||
  //         isItemSelected(
  //           selectedData,
  //           selectedCategory,
  //           subCategory,
  //           selectedSubCategory1,
  //           selectedProductView
  //         )
  //     ) ?? false;

  const handleAddonSelect = (addon, isChecked) => {
    const currentGroupKey = `${selectedCategory.category}-${selectedSubCategory}-${selectedSubCategory1}-${selectedProductView.id}`;

    setSelectedAddonsMap((prev) => {
      const existingAddons = prev[currentGroupKey] || [];

      // Only update addons for the current product
      const updatedAddons = isChecked
        ? [...existingAddons, addon] // Add new addon
        : existingAddons.filter((item) => item.id !== addon.id); // Remove if unchecked

      return { ...prev, [currentGroupKey]: updatedAddons };
    });

    // Keep `selectedAddons` specific to the selected product
    setSelectedAddons((prev) =>
      isChecked ? [...prev, addon] : prev.filter((item) => item.id !== addon.id)
    );
  };

  // Increment
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

  // Decrement
  const handleDecrement = (subcategory, productName) => {
    setProductQuantity((prev) => ({
      ...prev,
      [subcategory]: {
        ...prev[subcategory],
        [productName]: Math.max((prev[subcategory]?.[productName] || 1) - 1, 1),
      },
    }));
  };

  // OnChange
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
    <div className="fixed inset-0 flex justify-center items-center z-20">
      <div className="relative bg-gradient-to-br from-[#334A78] to-[#68B2DC] py-12 px-6 lg:p-6 max-w-[90%] h-[85vh] 2xl:h-[600px] w-[1000px] scrollbar-hide">
        <img
          src="../images/icons/close_btn.svg"
          alt="close"
          className="absolute top-2 right-2 lg:top-1  lg:right-1 cursor-pointer w-6 h-6"
          onClick={() => {
            setShowBackground(false); // Hide background before exit animation
            setShowSelectArea(false);
          }}
        />

        <div className="bg-white p-6 rounded-lg border-[3px] border-[#FFD500] relative h-auto lg:h-full">
          {/* Area Selection Modal */}
          {!showAddon && (
            <div className="overflow-auto">
              <p className="text-center font-semibold text-sm lg:text-lg mb-4">
                Select Your Area
              </p>

              <div className="flex flex-col lg:flex-row justify-between gap-8">
                {/* Subcategories Checkbox List */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {selectedCategory.subcategories
                    ?.filter((subCategory) => {
                      // For HVAC, handle centralized logic
                      if (selectedCategory.category === "HVAC") {
                        return userResponses?.hvacType === "Centralized"
                          ? subCategory === "Centralized" // Show only "Centralized"
                          : subCategory !== "Centralized"; // Show all except "Centralized"
                      }

                      // If the main category is "Civil / Plumbing"
                      if (selectedCategory.category === "Civil / Plumbing") {
                        // Always keep "Washrooms"
                        if (subCategory === "Washrooms") return true;

                        // Remove "Pantry" when "Pods" exists
                        if (
                          subCategory === "Pantry" &&
                          selectedSubCategory1 === "Pods"
                        ) {
                          return false;
                        }
                      }
                      if (selectedCategory.category === "Furniture") {
                        if (
                          (subCategory === "Reception" ||
                            subCategory === "Pantry" ||
                            subCategory === "Breakout Room") &&
                          selectedSubCategory1 === "Storage"
                        ) {
                          return false;
                        }
                      }

                      return true;
                    })
                    .flatMap((name) => {
                      // instead of Md Cabin, inject Main + Visitor
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
                          <input
                            type="checkbox"
                            id={`subCategory-${id}`}
                            value={name}
                            checked={selectedAreas.includes(name)}
                            onChange={(e) =>
                              handleCheckboxChange(
                                e.target.value,
                                e.target.checked
                              )
                            }
                            className="appearance-none w-3 h-3 lg:w-4 lg:h-4 cursor-pointer transition duration-300 bg-black checked:border-black
                      relative checked:before:content-['✔'] checked:before:absolute checked:before:text-white 
                      checked:before:top-1/2 checked:before:left-1/2 checked:before:-translate-x-1/2 checked:before:-translate-y-1/2 
                      checked:before:text-[14px] checked:before:font-bold disabled:bg-gray-400 disabled:cursor-not-allowed disabled:opacity-60"
                            disabled={
                              Array.isArray(selectedData) &&
                              isItemSelected(
                                selectedData,
                                selectedCategory,
                                name,
                                selectedSubCategory1,
                                selectedProductView
                              )
                              //  ||
                              // disabledAreas.includes(name)
                            }
                          />
                          <label
                            htmlFor={`subCategory-${id}`}
                            className={`text-xs lg:text-sm cursor-pointer  ${
                              Array.isArray(selectedData) &&
                              isItemSelected(
                                selectedData,
                                selectedCategory,
                                name,
                                selectedSubCategory1,
                                selectedProductView
                              )
                            }`}
                          >
                            {name}
                          </label>
                        </div>
                        {/* table chair */}
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
                                  : "invisible"
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
                        {/* storage */}
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
                                  : "invisible"
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
                        {/* Smart Solution & Lux */}
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
                                : "invisible"
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
                      </div>
                    ))}
                  <div className="flex items-center gap-2 col-span-full mr-10">
                    <input
                      type="checkbox"
                      id="selectAll"
                      checked={allSelected}
                      disabled={allSubcategoriesDisabled}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="appearance-none w-3 h-3 lg:w-4 lg:h-4 cursor-pointer transition duration-300 bg-black checked:border-black
                  relative checked:before:content-['✔'] checked:before:absolute checked:before:text-white 
                  checked:before:top-1/2 checked:before:left-1/2 checked:before:-translate-x-1/2 checked:before:-translate-y-1/2 
                  checked:before:text-[14px] checked:before:font-bold disabled:bg-gray-400 disabled:cursor-not-allowed disabled:opacity-60"
                    />
                    <label
                      htmlFor="selectAll"
                      className="text-xs lg:text-sm cursor-pointer"
                    >
                      Select All
                    </label>
                  </div>
                </div>

                {/* Image Section */}
                <div className="hidden sm:flex justify-center items-center ">
                  <img
                    src={image}
                    alt={selectedProductView.title}
                    className="rounded-md object-cover max-w-[200px] lg:max-w-[300px] max-h-[300px] border border-gray-300 shadow-md"
                  />
                </div>
              </div>

              {/* Done Button */}
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

          {/* Addon Selection Modal */}
          {showAddon && (
            <div className="flex flex-col lg:flex-row justify-between gap-8">
              {/* Left Side: Selected SubCategories */}
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

              {/* Right Side: Addons for Selected Room */}
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
                  botRight={botRight}
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
