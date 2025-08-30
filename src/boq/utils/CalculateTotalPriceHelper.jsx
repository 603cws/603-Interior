import HVACCalculation from "./HVACCalculation";
import ParitionCelingCalculation from "./ParitionCelingCalculation";

// Helper to normalize keys
export const normalizeKey = (key) => {
  return key?.toLowerCase().replace(/[^a-z0-9]/g, "");
};

// "7,8,9" => 56  (only 7 * 8)
function multiplyFirstTwoFlexible(dimStr) {
  const [a = NaN, b = NaN] = String(dimStr)
    .split(/[,\sxX*]+/) // comma / space / x / * as separators
    .map((s) => parseFloat(s.trim()));

  return Number.isFinite(a) && Number.isFinite(b) ? a * b : null;
}

function findKeyWithExactAndPartialMatch(subCategory, dataObject) {
  if (!subCategory || !dataObject) return null;

  const normalizedSubCat = subCategory.toLowerCase();

  // First try to find an exact match
  const exactMatch = Object.keys(dataObject).find(
    (key) => normalizedSubCat === key.toLowerCase()
  );

  if (exactMatch) return exactMatch;

  // If no exact match, perform partial match
  return (
    Object.keys(dataObject).find((key) =>
      normalizedSubCat.includes(key.toLowerCase())
    ) || null
  );
}

export const calculateAddonTotalPriceHelper = (
  roomNumbersMap,
  areasData,
  category,
  subcategory,
  subcategory1,
  height,
  addon
) => {
  const normalizedSubCat = normalizeKey(subcategory);

  let matchedKey, quantity, value; //area

  //|| category === "HVAC"
  // Calculation of price * quantity
  matchedKey = findKeyWithExactAndPartialMatch(
    normalizedSubCat,
    roomNumbersMap
  );
  quantity = matchedKey ? roomNumbersMap[matchedKey] : 1;

  value = quantity * addon.price || 0;

  return value; //return qunatity or area or qunatity * area which will be multiplied by price afterwards
};

// Pure utility function
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
    // Calculation of price * quantity    Depending on Quantity only
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
    // Calculation of price * quantity * area   Depending on Quantity and Area both

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
      }); //return value and do the calculation here
    }

    const remQuantity = areasData?.openworkspaces;

    if (category === "HVAC") {
      value = HVACCalculation({
        quantity,
        area,
        subcategory,
        remQuantity,
      }); //return value and do the calculation here
    }
  } else {
    // Calculation of price * area    Depending on Area only
    if (category === "Flooring" && subcategory1 !== "Epoxy") {
      //Opp condition written like except Epoxy for rest A / dim * price
      matchedKey = findKeyWithExactAndPartialMatch(normalizedSubCat, areasData);
      area = matchedKey ? areasData[matchedKey] : 1;

      const dimArea = multiplyFirstTwoFlexible(dimensions);

      let rawValue = area / dimArea;
      value = rawValue ? Math.ceil(rawValue) : 1;
    }
    if (category === "Civil / Plumbing" && subcategory1 === "Tile") {
      //Opp condition written like except Epoxy for rest A / dim * price
      matchedKey = findKeyWithExactAndPartialMatch(normalizedSubCat, areasData);
      area = matchedKey ? areasData[matchedKey] : 1;

      const dimArea = multiplyFirstTwoFlexible(dimensions);

      let rawValue = area / dimArea;
      value = rawValue ? Math.ceil(rawValue) : 1;
    } else {
      matchedKey = findKeyWithExactAndPartialMatch(normalizedSubCat, areasData);
      area = matchedKey ? areasData[matchedKey] : 1;

      value = area;
    }
  }

  return value; //return qunatity or area or qunatity * area which will be multiplied by price afterwards
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
    //|| category === "HVAC"
    // Calculation of price * quantity
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
    //currently this category is missing
    // Calculation of price * quantity * area

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
      }); //return value and do the calculation here
    }

    if (category === "HVAC") {
      value = HVACCalculation({ quantity, area, subcategory }); //return value and do the calculation here
    }
  } else {
    // Calculation of price * area

    if (category === "Flooring" && subcategory1 !== "Epoxy") {
      //Opp condition written like except Epoxy for rest A / dim * price
      matchedKey = findKeyWithExactAndPartialMatch(normalizedSubCat, areasData);
      area = matchedKey ? areasData[matchedKey] : 1;

      const dimArea = multiplyFirstTwoFlexible(dimensions);

      let rawValue = area / dimArea;
      value = rawValue ? Math.ceil(rawValue) : 1;
    }
    if (category === "Civil / Plumbing" && subcategory1 === "Tile") {
      //Opp condition written like except Epoxy for rest A / dim * price
      matchedKey = findKeyWithExactAndPartialMatch(normalizedSubCat, areasData);
      area = matchedKey ? areasData[matchedKey] : 1;

      const dimArea = multiplyFirstTwoFlexible(dimensions);

      let rawValue = area / dimArea;
      value = rawValue ? Math.ceil(rawValue) : 1;
    } else {
      matchedKey = findKeyWithExactAndPartialMatch(normalizedSubCat, areasData);
      area = matchedKey ? areasData[matchedKey] : 1;

      value = area;
    }
  }

  return value; //return qunatity or area or qunatity * area which will be multiplied by price afterwards
};

//calc of HVAC = sq ft * area * quantity  ? * price

//furniture => quantity * price ,   partitions => done above calc part, ligthing ~(similar to) AC ,  Flooring => Area * price

// if (bareshell = 150 * toatalArea) add in grand Total
//user Response. flooring
