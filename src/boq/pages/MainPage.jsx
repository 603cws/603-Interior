import { useEffect } from "react";
import { useApp } from "../../Context/Context";
import { motion, AnimatePresence } from "framer-motion";
import { fadeInVariant } from "../constants/animations";

const MainPage = ({ userResponses, setSelectedSubCategory1, productsData }) => {
  const {
    selectedCategory,
    selectedSubCategory,
    selectedSubCategory1,
    subCat1,
  } = useApp();

  useEffect(() => {
    if (subCat1 && selectedCategory?.category) {
      let subCategories = subCat1[selectedCategory.category] || [];

      // Apply HVAC filtering logic
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

      // Apply Civil / Plumbing -> Pantry filtering
      if (
        selectedCategory.category === "Civil / Plumbing" &&
        selectedSubCategory === "Pantry"
      ) {
        subCategories = subCategories.filter(
          (subCategory) => subCategory !== "Pods"
        );
      }
      if (
        selectedCategory.category === "Furniture" &&
        (selectedSubCategory === "Reception" ||
          selectedSubCategory === "Pantry" ||
          selectedSubCategory === "Breakout Room")
      ) {
        subCategories = subCategories.filter(
          (subCategory) => subCategory !== "Storage"
        );
      }

      if (
        selectedCategory.category === "Furniture" &&
        (selectedSubCategory === "Linear Workstation" ||
          selectedSubCategory === "Pantry" ||
          selectedSubCategory === "Breakout Room")
      ) {
        subCategories = subCategories.filter(
          (subCategory) => subCategory !== "Sofas"
        );
      }

      // Automatically select the first subcategory when switching categories
      if (
        !selectedSubCategory1 ||
        !subCategories.includes(selectedSubCategory1)
      ) {
        setSelectedSubCategory1(subCategories[0] || null);
      }
    } else {
      setSelectedSubCategory1(null);
    }
  }, [
    subCat1,
    selectedCategory,
    selectedSubCategory1,
    selectedSubCategory,
    userResponses.hvacType,
    setSelectedSubCategory1,
  ]);

  // const selectedSubCategories =
  //   subCat1 && subCat1[selectedCategory?.category]
  //     ? selectedCategory.category === "HVAC"
  //       ? userResponses.hvacType === "Centralized"
  //         ? subCat1[selectedCategory.category].filter(
  //             (subCategory) => subCategory === "Centralized AC"
  //           )
  //         : subCat1[selectedCategory.category].filter(
  //             (subCategory) => subCategory !== "Centralized AC"
  //           )
  //       : selectedCategory.category === "Civil / Plumbing" &&
  //         selectedSubCategory === "Pantry"
  //       ? subCat1[selectedCategory.category].filter(
  //           (subCategory) => subCategory !== "Pods"
  //         )
  //       : selectedCategory.category === "Furniture" &&
  //         selectedSubCategory === "Chair"
  //       ? subCat1[selectedCategory.category].filter(
  //           (subCategory) => subCategory !== "Reception"
  //           // || subCategory !== "Pantry"
  //         )
  //       : subCat1[selectedCategory.category]
  //     : [];

  let selectedSubCategories = [];
  console.log(
    subCat1,
    selectedCategory,
    selectedSubCategory1,
    selectedSubCategory
  );

  if (subCat1 && subCat1[selectedCategory?.category]) {
    switch (selectedCategory.category) {
      case "HVAC":
        if (userResponses.hvacType === "Centralized") {
          selectedSubCategories = subCat1["HVAC"].filter(
            (subCategory) => subCategory === "Centralized AC"
          );
        } else {
          selectedSubCategories = subCat1["HVAC"].filter(
            (subCategory) => subCategory !== "Centralized AC"
          );
        }
        break;

      case "Civil / Plumbing":
        if (selectedSubCategory === "Pantry") {
          selectedSubCategories = subCat1["Civil / Plumbing"].filter(
            (subCategory) => subCategory !== "Pods"
          );
        } else {
          selectedSubCategories = subCat1["Civil / Plumbing"];
        }
        break;

      case "Furniture":
        if (selectedSubCategory === "Reception") {
          selectedSubCategories = subCat1["Furniture"].filter(
            (subCategory) => subCategory !== "TV Console"
          );
        } else if (selectedSubCategory === "Pantry") {
          selectedSubCategories = subCat1["Furniture"].filter(
            (subCategory) => subCategory !== "Side Table"
          );
        } else if (selectedSubCategory === "Breakout Room") {
          selectedSubCategories = subCat1["Furniture"].filter(
            (subCategory) =>
              subCategory !== "Side Table" &&
              subCategory !== "Storage" &&
              subCategory !== "TV Console"
          );
        } else if (selectedSubCategory === "Washrooms") {
          selectedSubCategories = subCat1["Furniture"].filter(
            (subCategory) =>
              subCategory !== "Side Table" &&
              subCategory !== "Sofas" &&
              subCategory !== "Table" &&
              subCategory !== "Chair" &&
              subCategory !== "Storage"
          );
        } else {
          selectedSubCategories = subCat1["Furniture"].filter(
            (subCategory) =>
              subCategory !== "Sofas" && subCategory !== "Side Table"
          );
        }
        break;

      default:
        selectedSubCategories = subCat1[selectedCategory.category];
        break;
    }
  }

  if (!selectedCategory) {
    return (
      <p className="text-[#ccc] font-semibold font-Poppins px-6">
        Loading data....
      </p>
    );
  }

  return (
    <motion.div
      key={selectedCategory?.category + selectedSubCategory} // Force full re-render when switching
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={fadeInVariant}
      className="main-page flex flex-row gap-4 items-center justify-start relative overflow-auto font-Poppins w-4/5 md:w-full scrollbar-hide my-3"
    >
      <AnimatePresence>
        {selectedSubCategories && selectedSubCategories?.length > 0 ? (
          selectedSubCategories.map((subCategory1) => (
            <motion.div
              key={subCategory1} // Fix: Using subCategory1 as key
              variants={fadeInVariant}
              initial="hidden"
              animate="visible"
              exit="exit"
              className={` border-[#000000] border flex flex-col gap-2.5 items-start shrink-0 w-auto h-8 md:h-10 justify-center relative rounded-[1px] cursor-pointer transition-all duration-300 ${
                selectedSubCategory1 === subCategory1
                  ? "bg-[#334A78]"
                  : "bg-white hover:bg-[#E0F0FF]"
              }`}
              onClick={() => setSelectedSubCategory1(subCategory1)}
            >
              <motion.button
                className={`text-[#252525] text-center text-xs md:text-base leading-[30px] font-normal relative flex items-center justify-center px-7 ${
                  selectedSubCategory1 === subCategory1 ? "text-[#fff]" : ""
                }`}
              >
                {subCategory1}
              </motion.button>
            </motion.div>
          ))
        ) : (
          <motion.div
            key={selectedCategory?.category} // Ensures smooth transition on category change
            variants={fadeInVariant}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="text-center text-gray-500"
          >
            No subcategories available for {selectedCategory?.category}.
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default MainPage;
