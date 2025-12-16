import {
  calculateTotalPriceHelper,
  calculateAddonTotalPriceHelper,
} from "../utils/CalculateTotalPriceHelper";
import { calculateCategoryTotal } from "./calculateCategoryTotal";

export const calculateAddonTotalPrice = (
  subCat,
  addon,
  selectedSubCategory,
  quantityData
) => {
  const actualSubCategory = subCat || selectedSubCategory;

  const total = calculateAddonTotalPriceHelper(
    quantityData[0],
    actualSubCategory,
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
  selectedProductView,
  formulaMap,
  seatCountData
) => {
  const actualCategory = category || selectedCategory?.category;
  const actualSubCategory = subCat || selectedSubCategory;
  const actualSubCategory1 = subcategory1 || selectedSubCategory1;

  const total = calculateTotalPriceHelper(
    quantityData[0],
    areasData[0],
    actualCategory,
    actualSubCategory,
    actualSubCategory1,
    userResponses.height,
    selectedProductView.dimensions,
    seatCountData
  );

  const totalPrice = calculateCategoryTotal(
    actualCategory,
    total,
    selectedProductView.price,
    formulaMap
  );

  return totalPrice;
};
