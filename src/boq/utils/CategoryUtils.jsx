export const normalize = (str = "") => str.toLowerCase().trim();

export const getCleanedCategoryName = (categoryName = "") =>
  categoryName === "Smart Solutions"
    ? categoryName.replace(/[^a-zA-Z0-9 ]/g, "")
    : categoryName.replace(/[^a-zA-Z0-9]/g, "");

export const getCleanedCategoryNameFull = (name = "") =>
  name
    .replace(/\//g, " ")
    .replace(/[^a-zA-Z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();

export const getCleanedSubCategoryName = (name = "") =>
  name
    .replace(/[^a-zA-Z0-9\s]/g, "")
    .replace(/\s(.)/g, (_, group1) => group1.toUpperCase())
    .replace(/\s+/g, "");

export const specialCategories = [
  "furniture",
  "civil / plumbing",
  "lux",
  "smart solutions",
  "paint",
];

export const getImageSrcSubCat = (category, subCategory) => {
  if (!subCategory) return "";

  const cleanedCategoryName = getCleanedCategoryNameFull(category);
  const cleanedSubCategoryName = getCleanedSubCategoryName(subCategory);

  const categoriesWithFolder = [
    "Lighting",
    "HVAC",
    "Smart Solutions",
    "Flooring",
    "Civil Plumbing",
    "Paint",
    "Partitions Ceilings",
    "Lux",
  ];

  if (categoriesWithFolder.includes(cleanedCategoryName)) {
    return `/images/boq/${cleanedCategoryName}/${cleanedSubCategoryName}.png`;
  }

  return `/images/boq/${cleanedSubCategoryName}.png`;
};
