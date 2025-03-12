import {
  calculateTotalPriceHelper,
  calculateAddonTotalPriceHelper,
} from "../utils/CalculateTotalPriceHelper";

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

export const calculateTotalPrice = (
  category,
  subCat,
  subcategory1,
  selectedCategory,
  selectedSubCategory,
  selectedSubCategory1,
  quantityData,
  areasData,
  userResponses,
  selectedProductView
) => {
  // Determine the actual values by prioritizing function parameters, falling back to selected state
  const actualCategory = category || selectedCategory?.category;
  const actualSubCategory = subCat || selectedSubCategory;
  const actualSubCategory1 = subcategory1 || selectedSubCategory1;

  // Calculate base total
  const total = calculateTotalPriceHelper(
    quantityData[0],
    areasData[0],
    actualCategory,
    actualSubCategory,
    actualSubCategory1,
    userResponses.height
  );

  // Define price calculation based on category and subcategories
  if (actualCategory === "HVAC") {
    return total;
  }
  if (actualCategory === "Lighting") {
    return total * 200 + selectedProductView.price;
  }
  if (actualCategory === "Civil / Plumbing") {
    return total * 100 + selectedProductView.price;
  }
  if (actualCategory === "Paint") {
    return total * selectedProductView.price * 3 * 15;
  }

  return total * selectedProductView.price;
};
