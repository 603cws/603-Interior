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

export const handleAddOnChange = (variant, setSelectedAddons) => {
  if (!variant || !variant.title || variant.price == null || !variant.image)
    return;

  setSelectedAddons((prevSelectedAddOns) => {
    const isAlreadySelected = prevSelectedAddOns[variant.title];

    if (isAlreadySelected) {
      const { [variant.title]: _, ...rest } = prevSelectedAddOns;
      return rest;
    } else {
      return {
        ...prevSelectedAddOns,
        [variant.title]: {
          addon_title: variant.title || "No Title",
          addon_price: variant.price || "No Price",
          addon_image: variant.image || "No Image",
          addonId: variant.addonid || "No Id",
          variantID: variant.id || "No Id",
        },
      };
    }
  });
};

export const filterProduct = (
  productData,
  searchQuery,
  priceRange,
  selectedCategory
) => {
  if (!Array.isArray(productData)) return [];

  return productData.filter((product) => {
    if (!product.product_variants || product.product_variants.length === 0) {
      return false;
    }

    const matchesVariant = product.product_variants.some((variant) => {
      const matchesSearch =
        variant.title?.toLowerCase().includes(searchQuery?.toLowerCase()) ||
        variant.details?.toLowerCase().includes(searchQuery?.toLowerCase());
      const matchesPrice =
        variant.price >= priceRange?.[0] && variant.price <= priceRange?.[1];
      return matchesSearch && matchesPrice;
    });

    const matchesCategory =
      selectedCategory?.category === "" ||
      product.category === selectedCategory?.category;
    return matchesVariant && matchesCategory;
  });
};

export const groupProduct = (filteredProducts) => {
  const grouped = {};

  filteredProducts.forEach((product) => {
    const subcategories = product.subcategory
      .split(",")
      .map((sub) => sub.trim());

    subcategories.forEach((subcategory) => {
      if (!grouped[product.category]) {
        grouped[product.category] = {};
      }
      if (!grouped[product.category][subcategory]) {
        grouped[product.category][subcategory] = [];
      }
      grouped[product.category][subcategory].push(product);
    });
  });

  return grouped;
};
