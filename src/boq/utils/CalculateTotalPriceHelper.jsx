import HVACCalculation from "./HVACCalculation";
import ParitionCelingCalculation from "./ParitionCelingCalculation";
import { numOfCoats } from "../../constants/constant";

export const normalizeKey = (key) => {
  return key?.toLowerCase().replace(/[^a-z0-9]/g, "");
};

function multiplyFirstTwoFlexible(dimStr) {
  const [a = NaN, b = NaN] = String(dimStr)
    .split(/[,\sxX*]+/)
    .map((s) => parseFloat(s.trim()));

  return Number.isFinite(a) && Number.isFinite(b) ? a * b : null;
}

function findKeyWithExactAndPartialMatch(subCategory, dataObject) {
  if (!subCategory || !dataObject) return null;

  const normalizedSubCat = subCategory.toLowerCase();

  const exactMatch = Object.keys(dataObject).find(
    (key) => normalizedSubCat === key.toLowerCase()
  );

  if (exactMatch) return exactMatch;

  return (
    Object.keys(dataObject).find((key) =>
      normalizedSubCat.includes(key.toLowerCase())
    ) || null
  );
}

export const calculateAddonTotalPriceHelper = (
  roomNumbersMap,
  subcategory,
  addon
) => {
  const normalizedSubCat = normalizeKey(subcategory);

  let matchedKey, quantity, value;

  matchedKey = findKeyWithExactAndPartialMatch(
    normalizedSubCat,
    roomNumbersMap
  );
  quantity = matchedKey ? roomNumbersMap[matchedKey] : 1;

  value = quantity * addon.price || 0;

  return value;
};

export const calculateTotalPriceHelper = (
  roomNumbersMap,
  areasData,
  category,
  subcategory,
  subcategory1,
  height,
  dimensions,
  seatCountData
) => {
  const normalizedSubCat = normalizeKey(subcategory);

  let matchedKey, quantity, area, value, seat, seatCount;

  if (
    category === "Furniture" ||
    category === "Smart Solutions" ||
    category === "Lux"
  ) {
    matchedKey = findKeyWithExactAndPartialMatch(
      normalizedSubCat,
      roomNumbersMap
    );
    seat = findKeyWithExactAndPartialMatch(normalizedSubCat, seatCountData);
    seatCount = seat ? seatCountData[seat] : 1;
    quantity = matchedKey ? roomNumbersMap[matchedKey] : 1;
    if (
      category === "Furniture" &&
      subcategory1 === "Chair" &&
      subcategory !== "Linear Workstation" &&
      subcategory !== "L-Type Workstation"
    ) {
      value = quantity * seatCount;
    } else {
      value = quantity;
    }
  } else if (category === "Partitions / Ceilings" || category === "HVAC") {
    matchedKey = findKeyWithExactAndPartialMatch(
      normalizedSubCat,
      roomNumbersMap
    );
    quantity = matchedKey ? roomNumbersMap[matchedKey] : 1;

    matchedKey = findKeyWithExactAndPartialMatch(normalizedSubCat, areasData);
    area = matchedKey ? areasData[matchedKey] : 1;

    value = quantity * area;

    if (category === "Partitions / Ceilings") {
      value = ParitionCelingCalculation({
        quantity,
        area,
        subcategory1,
        height,
      });
    }

    const remQuantity = areasData?.openworkspaces;

    if (category === "HVAC") {
      value = HVACCalculation({
        quantity,
        area,
        subcategory,
        remQuantity,
      });
    }
  } else {
    if (category === "Flooring" && subcategory1 !== "Epoxy") {
      matchedKey = findKeyWithExactAndPartialMatch(normalizedSubCat, areasData);
      area = matchedKey ? areasData[matchedKey] : 1;
      const dimArea = multiplyFirstTwoFlexible(dimensions);
      let rawValue = area / dimArea;
      value = rawValue ? Math.ceil(rawValue) : 1;
      return value;
    }
    if (category === "Civil / Plumbing") {
      if (subcategory1 === "Tile") {
        matchedKey = findKeyWithExactAndPartialMatch(
          normalizedSubCat,
          areasData
        );
        area = matchedKey ? areasData[matchedKey] : 1;
        const dimArea = multiplyFirstTwoFlexible(dimensions);
        let rawValue = area / dimArea;
        value = rawValue ? Math.ceil(rawValue) : 1;
        return value;
      } else {
        matchedKey = findKeyWithExactAndPartialMatch(
          normalizedSubCat,
          roomNumbersMap
        );
        quantity = matchedKey ? roomNumbersMap[matchedKey] : 1;
        value = quantity;
        return value;
      }
    }
    if (category === "Paint") {
      matchedKey = findKeyWithExactAndPartialMatch(normalizedSubCat, areasData);
      area = matchedKey ? areasData[matchedKey] : 1;
      if (subcategory1 !== "Ceilings") {
        let temp = Math.ceil(area / 120);
        value = temp * numOfCoats * 3 * height;
        return value;
      } else {
        let temp = Math.ceil(area / 120);
        value = temp * numOfCoats;
        return value;
      }
    } else {
      matchedKey = findKeyWithExactAndPartialMatch(normalizedSubCat, areasData);
      area = matchedKey ? areasData[matchedKey] : 1;
      value = area;
      return value;
    }
  }

  return value;
};

//
export const calculateAutoTotalPriceHelper = (
  roomNumbersMap,
  areasData,
  category,
  subcategory,
  subcategory1,
  height,
  dimensions,
  seatCountData
) => {
  const normalizedSubCat = normalizeKey(subcategory);

  let matchedKey, quantity, area, value, seat, seatCount;

  if (
    category === "Furniture" ||
    category === "Smart Solutions" ||
    category === "Lux"
  ) {
    matchedKey = findKeyWithExactAndPartialMatch(
      normalizedSubCat,
      roomNumbersMap
    );
    seat = findKeyWithExactAndPartialMatch(normalizedSubCat, seatCountData);
    seatCount = seat ? seatCountData[seat] : 1;
    quantity = matchedKey ? roomNumbersMap[matchedKey] : 1;

    if (
      category === "Furniture" &&
      subcategory1 === "Chair" &&
      subcategory !== "Linear Workstation" &&
      subcategory !== "L-Type Workstation"
    ) {
      value = quantity * seatCount;
    } else {
      value = quantity;
    }
  } else if (category === "Partitions / Ceilings" || category === "HVAC") {
    matchedKey = findKeyWithExactAndPartialMatch(
      normalizedSubCat,
      roomNumbersMap
    );
    quantity = matchedKey ? roomNumbersMap[matchedKey] : 1;

    matchedKey = findKeyWithExactAndPartialMatch(normalizedSubCat, areasData);
    area = matchedKey ? areasData[matchedKey] : 1;

    value = quantity * area;

    if (category === "Partitions / Ceilings") {
      value = ParitionCelingCalculation({
        quantity,
        area,
        subcategory1,
        height,
      });
    }

    if (category === "HVAC") {
      value = HVACCalculation({ quantity, area, subcategory });
    }
  } else {
    if (category === "Flooring" && subcategory1 !== "Epoxy") {
      matchedKey = findKeyWithExactAndPartialMatch(normalizedSubCat, areasData);
      area = matchedKey ? areasData[matchedKey] : 1;

      const dimArea = multiplyFirstTwoFlexible(dimensions);

      let rawValue = area / dimArea;
      value = rawValue ? Math.ceil(rawValue) : 1;
      return value;
    }
    if (category === "Civil / Plumbing") {
      if (subcategory1 === "Tile") {
        matchedKey = findKeyWithExactAndPartialMatch(
          normalizedSubCat,
          areasData
        );
        area = matchedKey ? areasData[matchedKey] : 1;

        const dimArea = multiplyFirstTwoFlexible(dimensions);
        let rawValue = area / dimArea;
        value = rawValue ? Math.ceil(rawValue) : 1;
        return value;
      } else {
        matchedKey = findKeyWithExactAndPartialMatch(
          normalizedSubCat,
          roomNumbersMap
        );

        quantity = matchedKey ? roomNumbersMap[matchedKey] : 1;

        value = quantity;
        return value;
      }
    }
    if (category === "Paint") {
      matchedKey = findKeyWithExactAndPartialMatch(normalizedSubCat, areasData);
      area = matchedKey ? areasData[matchedKey] : 1;
      if (subcategory1 !== "Ceilings") {
        let temp = Math.ceil(area / 120);

        value = temp * numOfCoats * 3 * height;
        return value;
      } else {
        let temp = Math.ceil(area / 120);
        value = temp * numOfCoats;
        return value;
      }
    } else {
      matchedKey = findKeyWithExactAndPartialMatch(normalizedSubCat, areasData);
      area = matchedKey ? areasData[matchedKey] : 1;

      value = area;
      return value;
    }
  }

  return value;
};
