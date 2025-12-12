import { CategorySvgMap } from "../common-components/CategorySvgMap";

const DEFAULT_COLOR = "#374A75";
const SELECTED_COLOR = "#fff";

export default function CategoryIcons({
  category,
  selectedCategory = null,
  className = "",
  fillResolver = null, // (category, selectedCategory, extra) => color
  extra = {}, // optional extra page-specific context
}) {
  const factory = CategorySvgMap[category];

  if (!factory) {
    console.warn("No SVG factory for category:", category);
    return null;
  }

  // default resolver supports both `selectedCategory` as string or { category: "X" }
  const defaultResolver = (cat, sel) => {
    const selValue = typeof sel === "string" ? sel : sel?.category;
    return selValue === cat ? SELECTED_COLOR : DEFAULT_COLOR;
  };

  const fill = fillResolver
    ? fillResolver(category, selectedCategory, extra)
    : defaultResolver(category, selectedCategory);

  // factory returns an <svg> (we pass fill and allow overriding classes)
  return factory(fill, className);
}
