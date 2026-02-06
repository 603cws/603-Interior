import { Parser } from "expr-eval";
import { handleError } from "../../common-components/handleError";

const parser = new Parser();

export const calculateCategoryTotal = (
  category,
  base,
  multiplier = 1,
  formulaMap = {},
) => {
  const categoryFormula = formulaMap[category]?.formula;
  const defaultFormula = formulaMap["Default"]?.formula;

  const formulaString =
    categoryFormula || defaultFormula || "base * multiplier";

  try {
    if (!formulaString || typeof formulaString !== "string") {
      throw new Error("No valid formula found.");
    }

    const expr = parser.parse(formulaString);
    return expr.evaluate({ base, multiplier });
  } catch (err) {
    handleError(err, {
      prodMessage: `Invalid formula for category "${category}`,
    });
    return base * multiplier;
  }
};
