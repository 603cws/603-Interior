import { useCallback } from "react";

export const useProgressBar = ({
  setProgress,
  filterExcludedItems,
  categoryConfig,
}) => {
  const handleProgressBar = useCallback(
    (selectedData, categories, subCat1) => {
      if (!Array.isArray(selectedData) || selectedData.length === 0) {
        console.warn("Invalid or empty selectedData.");
        setProgress(0);
        return;
      }

      if (!Array.isArray(categories) || categories.length === 0) {
        console.warn("Invalid or empty categories.");
        setProgress(0);
        return;
      }

      let totalProgress = 0;

      selectedData.forEach((item) => {
        const { category, subcategory, subcategory1 } = item;

        const categoryObj = categories.find((cat) => cat.category === category);
        if (!categoryObj) return;

        const totalCategories = categories.length;
        const categoryPercentage = 100 / totalCategories;

        const subCategoryIndex = categoryObj.subcategories.indexOf(subcategory);
        if (subCategoryIndex === -1) {
          console.warn(`Subcategory "${subcategory}" not found.`);
          return;
        }

        let validSubcategories = categoryObj.subcategories;

        // HVAC special handling
        if (category === "HVAC") {
          validSubcategories =
            subcategory === "Centralized"
              ? ["Centralized"]
              : categoryObj.subcategories.filter(
                  (sub) => sub !== "Centralized",
                );
        }

        const subCategoryPercentage =
          categoryPercentage / validSubcategories.length;

        const needsSubCat1 =
          (subcategory1 &&
            subCat1 &&
            subCat1[category] &&
            Array.isArray(subCat1[category]) &&
            category === "Furniture") ||
          category === "Smart Solutions" ||
          category === "Civil / Plumbing" ||
          category === "Lux" ||
          category === "Paint";

        if (needsSubCat1) {
          let validSubCat1List = subCat1[category];

          // Civil / Plumbing exclusions
          if (category === "Civil / Plumbing") {
            validSubCat1List = filterExcludedItems(
              "Civil / Plumbing",
              subcategory,
              validSubCat1List,
              categoryConfig,
            );
          }

          // MD Cabin Chair logic
          if (category === "Furniture" && subcategory === "Md Cabin") {
            const mainFilled = selectedData.some(
              (i) =>
                i.category === "Furniture" &&
                i.subcategory === "Md Cabin Main" &&
                i.subcategory1 === "Chair",
            );
            const visitorFilled = selectedData.some(
              (i) =>
                i.category === "Furniture" &&
                i.subcategory === "Md Cabin Visitor" &&
                i.subcategory1 === "Chair",
            );

            if (mainFilled && visitorFilled) {
              validSubCat1List = validSubCat1List.filter((i) => i !== "Chair");
            }
          }

          // Manager Cabin Chair logic
          if (category === "Furniture" && subcategory === "Manager Cabin") {
            const mainFilled = selectedData.some(
              (i) =>
                i.category === "Furniture" &&
                i.subcategory === "Manager Cabin Main" &&
                i.subcategory1 === "Chair",
            );
            const visitorFilled = selectedData.some(
              (i) =>
                i.category === "Furniture" &&
                i.subcategory === "Manager Cabin Visitor" &&
                i.subcategory1 === "Chair",
            );

            if (mainFilled && visitorFilled) {
              validSubCat1List = validSubCat1List.filter((i) => i !== "Chair");
            }
          }

          // Furniture exclusions
          if (category === "Furniture") {
            validSubCat1List = filterExcludedItems(
              "Furniture",
              subcategory,
              validSubCat1List,
              categoryConfig,
            );
          }

          const subCategory1Index = validSubCat1List.indexOf(subcategory1);

          if (subCategory1Index !== -1) {
            const subCategory1Percentage =
              subCategoryPercentage / validSubCat1List.length;
            totalProgress += subCategory1Percentage;
          } else {
            console.warn(
              `SubCategory1 "${subcategory1}" not found or excluded.`,
            );
          }
        } else {
          totalProgress += subCategoryPercentage;
        }
      });

      totalProgress = Math.min(totalProgress, 100);

      // setProgress(Math.round(totalProgress * 100) / 100);
      setProgress(Math.ceil(totalProgress));
    },
    [setProgress, filterExcludedItems, categoryConfig],
  );

  return handleProgressBar;
};
