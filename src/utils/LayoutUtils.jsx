export function extractAreaAndQuantity(data) {
  const areaValues = {};
  const quantities = {};

  Object.entries(data).forEach(([key, value]) => {
    if (key.endsWith("Area")) {
      const name = key.replace("Area", "");
      areaValues[name] = value;
    } else if (key.endsWith("Qty")) {
      const name = key.replace("Qty", "");
      quantities[name] = value;
    }
  });

  return { areaValues, quantities };
}
