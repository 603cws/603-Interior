// utils/calculateCategoryTotal.jsx
import { Parser } from "expr-eval";

const parser = new Parser();

export const calculateCategoryTotal = (
  category,
  base,
  multiplier = 1,
  formulaMap = {}
) => {
  const categoryFormula = formulaMap[category]?.formula;
  const defaultFormula = formulaMap["Default"]?.formula;

  const formulaString = categoryFormula || defaultFormula;

  try {
    if (!formulaString || typeof formulaString !== "string") {
      throw new Error("No valid formula found.");
    }

    const expr = parser.parse(formulaString);
    return expr.evaluate({ base, multiplier });
  } catch (err) {
    console.error(`Invalid formula for category "${category}"`, err);
    return base * multiplier; // fallback
  }
};

// export const calculateCategoryTotal = (category, base, multiplier = 1) => {
//   if (category === "HVAC") return base;
//   if (category === "Lighting") return base * 200 + multiplier;
//   if (category === "Civil / Plumbing") return base * multiplier;
//   if (category === "Paint") return base * multiplier * 3 * 15;

//   return base * multiplier;
// };
