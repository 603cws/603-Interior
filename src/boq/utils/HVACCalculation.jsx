const HVACCalculation = ({
  quantity,
  area,
  subcategory = "Centralized",
  remQuantity,
  subCat1 = "split",
  location = "India", // Default: "India"
  showAlert = false, // Optional: Control whether to show alert or not
}) => {
  const rates = {
    split: { hp: 55000, ton: 40000 },
    cassette: { hp: 60000, ton: 48000 },
    duct: { hp: 65000, ton: 53000 },
  };

  const tonToHp = (ton) => ton * 0.8;

  const calculateArea = () => {
    const conversionFactor = location === "India" ? 120 : 100;
    // const baseTonValue = (area * quantity) / conversionFactor;
    const baseTonValue = area / conversionFactor;
    const acType = subcategory === "Centralized" ? "hp" : "ton";
    const rate = rates[subCat1]?.[acType] || 0;

    const value = Math.round(
      acType === "hp" ? tonToHp(baseTonValue) * rate : baseTonValue * rate
    );

    if (showAlert) {
      alert(
        `Calculation Details:\n` +
          `Sub Category: ${subcategory}\n` +
          `Type: ${subCat1}\n` +
          `Area: ${area} sq ft\n` +
          `Quantity: ${quantity}\n` +
          `Rate: Rs ${rate}\n` +
          `Total Calculated: ${area * quantity} sq ft\n` +
          `Total Value in ${acType.toUpperCase()}: Rs ${value}`
      );
    }

    return value;
  };

  return calculateArea();
};

export default HVACCalculation;
