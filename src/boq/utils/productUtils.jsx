import { useMemo } from "react";
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

export const handleAddOnChange = (variant, setSelectedAddons) => {
  console.log("addon added");

  // Ensure the variant object has title, price, and image
  if (!variant || !variant.title || variant.price == null || !variant.image)
    return;

  setSelectedAddons((prevSelectedAddOns) => {
    // Check if the add-on is already selected
    const isAlreadySelected = prevSelectedAddOns[variant.title];

    if (isAlreadySelected) {
      // If already selected, remove the add-on
      const { [variant.title]: _, ...rest } = prevSelectedAddOns;
      return rest;
    } else {
      // If not selected, add the add-on
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
