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

  const selectedSubCategories =
    subCat1 && subCat1[selectedCategory?.category]
      ? selectedCategory.category === "HVAC"
        ? userResponses.hvacType === "Centralized"
          ? subCat1[selectedCategory.category].filter(
              (subCategory) => subCategory === "Centralized AC"
            )
          : subCat1[selectedCategory.category].filter(
              (subCategory) => subCategory !== "Centralized AC"
            )
        : selectedCategory.category === "Civil / Plumbing" &&
          selectedSubCategory === "Pantry"
        ? subCat1[selectedCategory.category].filter(
            (subCategory) => subCategory !== "Pods"
          )
        : subCat1[selectedCategory.category]
      : [];

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
