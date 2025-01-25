import ParitionCelingCalculation from "./ParitionCelingCalculation";

// Helper to normalize keys
export const normalizeKey = (key) => {
  return key?.toLowerCase().replace(/[^a-z0-9]/g, "");
};

// Pure utility function
export const calculateTotalPriceHelper = (
  roomNumbersMap,
  areasData,
  category,
  subcategory
) => {
  const normalizedSubCat = normalizeKey(subcategory);

  let matchedKey, quantity, area, value;

  if (category === "Furniture") {
    //|| category === "HVAC"
    // Calculation of price * quantity
    matchedKey = Object.keys(roomNumbersMap || {}).find((key) =>
      normalizedSubCat.includes(key.toLowerCase())
    );
    quantity = matchedKey ? roomNumbersMap[matchedKey] : 1;

    value = quantity;
  } else if (category === "Partitions / Ceilings") {
    //currently this category is missing
    // Calculation of price * quantity * area
    matchedKey = Object.keys(roomNumbersMap || {}).find((key) =>
      normalizedSubCat?.includes(key.toLowerCase())
    );
    quantity = matchedKey ? roomNumbersMap[matchedKey] : 1;

    matchedKey = Object.keys(areasData || {}).find((key) =>
      normalizedSubCat?.includes(key.toLowerCase())
    );
    area = matchedKey ? areasData[matchedKey] : 1;
    if (category === "Partitions / Ceilings") {
      ParitionCelingCalculation({ quantity, area }); //return value and do the calculation here
    }
    value = quantity * area;
  } else {
    // Calculation of price * area
    matchedKey = Object.keys(areasData || {}).find((key) =>
      normalizedSubCat?.includes(key.toLowerCase())
    );
    area = matchedKey ? areasData[matchedKey] : 1;

    value = area;
  }

  return value; //return qunatity or area or qunatity * area which will be multiplied by price afterwards
};

//calc of HVAC = sq ft * area * quantity  ? * price

//furniture => quantity * price ,   partitions => done above calc part, ligthing ~(similar to) AC ,  Flooring => Area * price

// if (bareshell = 150 * toatalArea) add in grand Total
//user Response. flooring
