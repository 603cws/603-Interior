// useCategoryCompletion.js
import { specialCategories, normalize } from "../utils/CategoryUtils";

export const filterExcludedItems = (category, subCategory, items, config) => {
  const rules =
    config[category]?.[subCategory] || config[category]?.Default || {};
  const excludeList = Array.isArray(rules.exclude) ? rules.exclude : [];
  return items.filter((item) => !excludeList.includes(item));
};

export const useCategoryCompletion = (
  categories,
  selectedData,
  categoryConfig
) => {
  const checkIfSubCategoryCompleted = (category, subCategory) => {
    if (!Array.isArray(selectedData) || selectedData.length === 0) return false;

    const categoryObject = categories.find(
      (cat) => normalize(cat.category) === normalize(category)
    );
    if (!categoryObject) return false;

    const isSpecial = specialCategories.includes(normalize(category));

    const selectedSubCategory1Items = selectedData
      .filter(
        (item) =>
          normalize(item?.category) === normalize(category) &&
          normalize(item?.subcategory) === normalize(subCategory)
      )
      .map((item) => item.subcategory1);

    if (!isSpecial) return selectedSubCategory1Items.length === 1;

    let requiredSubCategory1Items = categoryObject.subcategory1 || [];

    const chairRule = (mainLabel, visitorLabel) => {
      const mainFilled = selectedData.some(
        (item) =>
          item.category === "Furniture" &&
          item.subcategory === mainLabel &&
          item.subcategory1 === "Chair"
      );
      const visitorFilled = selectedData.some(
        (item) =>
          item.category === "Furniture" &&
          item.subcategory === visitorLabel &&
          item.subcategory1 === "Chair"
      );
      if (mainFilled && visitorFilled) {
        requiredSubCategory1Items = requiredSubCategory1Items.filter(
          (item) => item !== "Chair"
        );
      }
    };

    if (category === "Furniture" && subCategory === "Md Cabin") {
      chairRule("Md Cabin Main", "Md Cabin Visitor");
    }
    if (category === "Furniture" && subCategory === "Manager Cabin") {
      chairRule("Manager Cabin Main", "Manager Cabin Visitor");
    }

    if (category === "Civil / Plumbing") {
      requiredSubCategory1Items = filterExcludedItems(
        "Civil / Plumbing",
        subCategory,
        requiredSubCategory1Items,
        categoryConfig
      );
    }

    if (category === "Furniture") {
      requiredSubCategory1Items = filterExcludedItems(
        "Furniture",
        subCategory,
        requiredSubCategory1Items,
        categoryConfig
      );
    }

    return (
      requiredSubCategory1Items.length > 0 &&
      requiredSubCategory1Items.every((subCat1) =>
        selectedSubCategory1Items.includes(subCat1)
      )
    );
  };

  const checkIfCategoryCompleted = (category) => {
    if (!Array.isArray(selectedData) || selectedData.length === 0) return false;

    const categoryObject = categories.find(
      (cat) => normalize(cat.category) === normalize(category)
    );
    if (!categoryObject) return false;

    const requiredSubCategories = categoryObject.subcategories || [];

    if (category === "HVAC") {
      const hasCentralizedProduct = selectedData.some(
        (product) =>
          product.category === "HVAC" && product.subcategory === "Centralized"
      );

      const nonCentralized = requiredSubCategories.filter(
        (sub) => normalize(sub) !== "centralized"
      );

      const othersDone = nonCentralized.every((subCategory) =>
        checkIfSubCategoryCompleted(category, subCategory)
      );

      if (hasCentralizedProduct || othersDone) return true;
    }

    return requiredSubCategories.every((subCategory) =>
      checkIfSubCategoryCompleted(category, subCategory)
    );
  };

  return { checkIfSubCategoryCompleted, checkIfCategoryCompleted };
};
