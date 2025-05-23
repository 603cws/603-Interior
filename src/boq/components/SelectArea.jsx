import { useEffect, useState } from "react"; //useState
import { MdOutlineCancel } from "react-icons/md";
import { useApp } from "../../Context/Context";
import Addon from "./Addon";
import { toast, Slide } from "react-toastify";
import { calculateAddonTotalPrice } from "../utils/productUtils";

function SelectArea({
  setShowSelectArea,
  image,
  selectedAreas,
  setSelectedAreas,
  selectedProductView,
  categoriesWithTwoLevelCheck,
  allAddons,
  onAddonAdd,
  setShowBackground,
  selectedCategory,
  selectedSubCategory,
  selectedSubCategory1,
}) {
  const {
    selectedData,
    userResponses,
    setSelectedData,
    areasData,
    quantityData,
    handelSelectedData,
    // subCategories,
  } = useApp();

  //Don't call the selectedCategory, selectedSubCategory, selectedSubCategory1, subCategories from Context => Sunny

  const subCategories = selectedCategory.subcategories;

  const [showAddon, setShowAddon] = useState(false);
  const [allSubcategories, setAllSubcategories] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [submitBtn, setSubmitBtn] = useState(false);
  // const [disabledAreas, setDisabledAreas] = useState([]);

  // const baseImageUrl =
  //   "https://bwxzfwsoxwtzhjbzbdzs.supabase.co/storage/v1/object/public/addon/";

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
      botRight();

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

  // useEffect(() => {
  //   if (Array.isArray(selectedData) && selectedData.length > 0) {
  //     const hasCentralized = selectedData.some(
  //       (item) => item.subcategory === "Centralized"
  //     );

  //     const hasOtherSubCats = selectedData.some(
  //       (item) => item.subcategory !== "Centralized"
  //     );

  //     let disabledList = [];

  //     if (hasCentralized) {
  //       disabledList = subCategories.filter(
  //         (subCat) => subCat !== "Centralized"
  //       );
  //     } else if (hasOtherSubCats) {
  //       disabledList = ["Centralized"];
  //     }

  //     // Keep a copy of the original disabled list
  //     const initialDisabledList = new Set(disabledList);

  //     // Get already selected subcategories
  //     const alreadySelected = selectedData.map((item) => item.subcategory);

  //     // Merge only if they were originally disabled
  //     disabledList = [
  //       ...new Set([
  //         ...disabledList,
  //         ...alreadySelected.filter((item) => initialDisabledList.has(item)),
  //       ]),
  //     ];

  //     setDisabledAreas(disabledList);
  //   } else {
  //     setDisabledAreas([]);
  //   }
  // }, [selectedData, subCategories]);

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

    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        setShowBackground(false); // Hide background before exit animation
      }
    };

    // Add event listener when component is mounted
    document.addEventListener("keydown", handleEscKey);

    // Cleanup event listener on component unmount
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
    // const allSubcategories = subCategories; // All available subcategories
    let selectedSubcategories = subCategories.filter((subCat) =>
      selectedAreas.includes(subCat)
    );

    selectedSubcategories = selectedSubcategories.filter((subCat) => {
      return !(
        Array.isArray(selectedData) &&
        selectedData.length > 0 &&
        isItemSelected(
          selectedData,
          selectedCategory,
          subCat,
          selectedSubCategory1,
          selectedProductView
        )
      );
    });

    // Set only selected subcategories
    setAllSubcategories(selectedSubcategories);

    // Process all subcategories to handle addition and removal
    subCategories.forEach((subCat) => {
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

    // if (!allAddons || allAddons.length === 0) {
    //   setShowSelectArea(false);
    //   if (selectedSubcategories.length > 0) botRight();
    // } else {
    //   if (selectedSubcategories.length > 0) setShowAddon(true);
    //   else setShowSelectArea(false);

    // }

    if (selectedSubcategories.length > 0) {
      if (!allAddons || allAddons.length === 0) {
        setShowSelectArea(false);
        setShowBackground(false); // Hide background before exit animation
        botRight();
      } else {
        setShowAddon(true);
      }
    } else {
      setShowSelectArea(false);
      setShowBackground(false); // Hide background before exit animation
    }
  };

  // const handleAddonClick = () => {
  //   setShowAddon(false);
  //   setShowSelectArea(false); // Close the modal

  //   setSelectedData((prevData) => {
  //     const updatedData = prevData.map((item) => {
  //       if (
  //         item.groupKey ===
  //         `${selectedCategory.category}-${selectedRoom}-${selectedSubCategory1}-${selectedProductView.id}`
  //       ) {
  //         return {
  //           ...item,
  //           addons:
  //             selectedAddons.length > 0 ? [...selectedAddons] : item.addons,
  //           // ✅ If no new addons are selected, keep the old ones
  //         };
  //       }
  //       return item;
  //     });

  //     localStorage.setItem("selectedData", JSON.stringify(updatedData)); // ✅ Persist state

  //     return updatedData;
  //   });
  // };

  // const handleAddonClick = () => {
  //   setShowAddon(false);
  //   setShowSelectArea(false); // Close the modal

  //   setSelectedData((prevData) => {
  //     const updatedData = prevData.map((item) => {
  //       if (
  //         item.groupKey ===
  //         `${selectedCategory.category}-${selectedRoom}-${selectedSubCategory1}-${selectedProductView.id}`
  //       ) {
  //         return {
  //           ...item,
  //           addons: [...selectedAddons], // ✅ Always update with selectedAddons (even if empty)
  //         };
  //       }
  //       return item;
  //     });

  //     localStorage.setItem("selectedData", JSON.stringify(updatedData)); // ✅ Persist state

  //     return updatedData;
  //   });
  // };

  const isItemSelected = (
    selectedData,
    selectedCategory,
    subCat,
    selectedSubCategory1,
    selectedProductView
  ) => {
    // if (disabledAreas.includes(subCat)) {
    //   return false;
    // }
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

  // const handleSelectAll = (checked) => {
  //   if (checked) {
  //     const selectableSubCategories = selectedCategory.subcategories.filter(
  //       (subCategory) => {
  //         if (selectedCategory.category === "HVAC") {
  //           return userResponses?.hvacType === "Centralized"
  //             ? subCategory === "Centralized" // Select only "Centralized"
  //             : subCategory !== "Centralized"; // Select all except "Centralized"
  //         }

  //         return (
  //           !(subCategory === "Pantry" && selectedSubCategory1 === "Pods") && // Exclude Pantry when Pods is selected
  //           !isItemSelected(
  //             selectedData,
  //             selectedCategory,
  //             subCategory,
  //             selectedSubCategory1,
  //             selectedProductView
  //           ) // Exclude already-selected items
  //         );
  //       }
  //     );
  //     setSelectedAreas(selectableSubCategories);
  //   } else {
  //     setSelectedAreas([]);
  //   }
  // };

  // Check if all selectable subcategories are already selected

  const handleSelectAll = (checked) => {
    if (checked) {
      const selectableSubCategories = selectedCategory.subcategories.filter(
        (subCategory) => {
          if (selectedCategory.category === "HVAC") {
            return userResponses?.hvacType === "Centralized"
              ? subCategory === "Centralized" // Select only "Centralized"
              : subCategory !== "Centralized"; // Select all except "Centralized"
          }

          return (
            !(subCategory === "Pantry" && selectedSubCategory1 === "Pods") && // Exclude Pantry when Pods is selected
            !isItemSelected(
              selectedData,
              selectedCategory,
              subCategory,
              selectedSubCategory1,
              selectedProductView
            ) // Exclude already-selected items
          );
        }
      );
      setSelectedAreas(selectableSubCategories);
    } else {
      // 🟡 Only deselect non-disabled items
      const nonDisabled = selectedCategory.subcategories.filter(
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

  const allSubcategoriesDisabled = selectedCategory.subcategories
    ?.filter((subCategory) => {
      if (selectedCategory.category === "HVAC") {
        return userResponses?.hvacType === "Centralized"
          ? subCategory === "Centralized"
          : subCategory !== "Centralized";
      }

      return !(subCategory === "Pantry" && selectedSubCategory1 === "Pods");
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
    selectedCategory.subcategories
      ?.filter((subCategory) => {
        if (selectedCategory.category === "HVAC") {
          return userResponses?.hvacType === "Centralized"
            ? subCategory === "Centralized" // Only "Centralized" should be checked
            : subCategory !== "Centralized"; // Exclude "Centralized" for other types
        }
        return !(subCategory === "Pantry" && selectedSubCategory1 === "Pods"); // Exclude Pantry when Pods is selected
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

  return (
    <div className="fixed inset-0 flex justify-center items-center z-20">
      <div className="relative bg-[#1A3A36] p-2 lg:p-8 rounded-xl max-w-[90%] max-h-screen w-[1000px] scrollbar-hide">
        {/* Close Button (Common for Both Modals) */}
        <MdOutlineCancel
          size={30}
          // color="white"
          className="absolute top-1 right-1 cursor-pointer z-5 text-white hover:text-red-500 transition-colors duration-300"
          onClick={() => {
            setShowBackground(false); // Hide background before exit animation
            setShowSelectArea(false);
          }}
        />

        {/* Inner White Content (Common Border) */}
        <div className="bg-white p-6 rounded-lg border-2 border-[#FFD500] relative h-auto lg:h-full">
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

                      return true; // Default case: show all
                    })
                    .map((name, id) => (
                      <div key={id} className="flex items-center gap-2">
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
                            //   ||
                            // disabledAreas.includes(name)
                            //   ? "text-gray-400 cursor-not-allowed"
                            //   : ""
                          }`}
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
                <div className="flex justify-center items-center">
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
                  className="bg-[#1A3A36] rounded-lg text-xs lg:text-sm py-2 px-10 border-2 border-gray-900 text-white"
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
                          ? "bg-[#1A3A36] text-white"
                          : "bg-gray-200"
                      }`}
                    >
                      {room}
                    </button>
                  ))}
                </div>
                <div className="flex justify-evenly items-center mt-auto pb-4">
                  <button
                    className="bg-[#1A3A36] rounded-lg text-xs md:text-sm py-2 px-10 border-2 border-gray-900 text-white"
                    onClick={() => setShowAddon(false)}
                  >
                    Back
                  </button>
                  <button
                    className="bg-[#1A3A36] rounded-lg text-xs md:text-sm py-2 px-10 border-2 border-gray-900 text-white"
                    onClick={() => handleAddonClick()}
                  >
                    Done
                  </button>
                </div>
              </div>

              {/* Right Side: Addons for Selected Room */}
              <div className="flex flex-col gap-4 border-2 border-gray-300 p-4 w-full lg:w-[30%] lg:min-h-full shadow-lg overflow-y-auto max-h-[500px]">
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
