import { calculateAddonTotalPriceHelper } from "../utils/CalculateTotalPriceHelper";

export const calculateAddonTotalPrice = (
  category,
  subCat,
  subcategory1,
  addon,
  selectedCategory,
  selectedSubCategory,
  selectedSubCategory1,
  userResponses,
  areasData,
  quantityData
) => {
  // Determine the actual values by prioritizing function parameters, falling back to selected state
  const actualCategory = category || selectedCategory?.category;
  const actualSubCategory = subCat || selectedSubCategory;
  const actualSubCategory1 = subcategory1 || selectedSubCategory1;

  // Calculate base total
  const total = calculateAddonTotalPriceHelper(
    quantityData[0],
    areasData[0],
    actualCategory,
    actualSubCategory,
    actualSubCategory1,
    userResponses.height,
    addon
  );

  return total;
};
