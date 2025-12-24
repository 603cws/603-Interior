export function normalizeKey(subcategory) {
  return subcategory
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/-/g, "")
    .replace("workstation", "")
    .replace("mdcabin", "md")
    .replace("managercabin", "manager")
    .replace("smallcabin", "small");
}
export function normalizeObjectKeys(obj) {
  const normalized = {};
  Object.entries(obj).forEach(([key, value]) => {
    normalized[normalizeKey(key)] = value;
  });
  return normalized;
}
export function filterExcludedItems(category, subCategory, items, config) {
  const excludeList =
    config[category]?.[subCategory]?.exclude ||
    config[category]?.Default?.exclude ||
    [];
  return items.filter((item) => !excludeList.includes(item));
}
export function multiplyFirstTwoFlexible(dimStr) {
  const [a = NaN, b = NaN] = String(dimStr)
    .split(/[,\sxX*]+/)
    .map((s) => parseFloat(s.trim()));

  return Number.isFinite(a) && Number.isFinite(b) ? Number(a * b) : null;
}
