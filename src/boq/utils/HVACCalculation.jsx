const HVACCalculation = ({
  quantity,
  area,
  subcategory = "Centralized",
  subCat1 = "split",
  location = "India", // Default: "India"
  showAlert = false, // Optional: Control whether to show alert or not
}) => {
  // Rates for different AC types and units
  const rates = {
    split: { hp: 55000, ton: 40000 },
    cassette: { hp: 60000, ton: 48000 },
    duct: { hp: 65000, ton: 53000 },
  };

  // Conversion functions
  const tonToHp = (ton) => ton * 0.8;

  // Calculation logic
  const calculateArea = () => {
    const conversionFactor = location === "India" ? 120 : 100;
    const baseTonValue = (area * quantity) / conversionFactor;
    const acType = subcategory === "Centralized" ? "hp" : "ton";
    const rate = rates[subCat1]?.[acType] || 0;

    const value =
      acType === "hp" ? tonToHp(baseTonValue) * rate : baseTonValue * rate;

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

  return calculateArea(); // Return the calculated value directly
};

export default HVACCalculation;

// import { useEffect, useState } from "react";

// const HVACCalculation = ({
//   quantity,
//   area,
//   subCat = "VRV",
//   subCat1 = "split",
// }) => {
//   let acType = "";

//   if (subCat === "VRV") {
//     acType = "hp";
//   } else {
//     acType = "ton";
//   }

//   const splitHP = 55000,
//     splitTon = 40000;
//   const casetteHP = 60000,
//     casetteTon = 48000;
//   const ductTableHP = 65000,
//     ductTableTon = 53000;

//   const [areaHp, setAreaHp] = useState(0);
//   const [areaTon, setAreaTon] = useState(0);
//   const [location, setLocation] = useState("India"); // "India" or "Outside India"

//   const tonToHp = (ton) => {
//     return 0.8 * ton;
//   };

//   const hpToTon = (hp) => {
//     return 1.25 * hp;
//   };

//   const calculateArea = () => {
//     let calculatedTonValue = 0,
//       calculatedHpValue = 0;

//     // Apply formulas based on the location
//     if (location === "India") {
//       calculatedTonValue = (area * quantity) / 120; // 120 sq ft per 1 ton in India
//     } else {
//       calculatedTonValue = (area * quantity) / 100; // 100 sq ft per 1 ton outside India
//     }

//     if (acType === "ton") {
//       if (subCat1.includes("split")) {
//         setAreaTon(calculatedTonValue * splitTon);
//       } else if (subCat1.includes("cassette")) {
//         setAreaTon(calculatedTonValue * casetteTon);
//       } else if (subCat1.includes("duct")) {
//         setAreaTon(calculatedTonValue * ductTableTon);
//       }
//       // setAreaTon(calculatedTonValue);
//     } else {
//       calculatedHpValue = tonToHp(calculatedTonValue);

//       if (subCat1.includes("split")) {
//         setAreaHp(calculatedHpValue * splitHP);
//       } else if (subCat1.includes("cassette")) {
//         setAreaHp(calculatedHpValue * casetteHP);
//       } else if (subCat1.includes("duct")) {
//         setAreaHp(calculatedHpValue * ductTableHP);
//       }
//       // setAreaHp(calculatedHpValue);
//     }
//   };

//   useEffect(() => {
//     if (areaHp !== 0) {
//       alert("Area in HP: Rs", areaHp);
//     } else if (areaTon !== 0) {
//       alert("Area in Ton: Rs", areaTon);
//     }
//   }, [areaHp, areaTon]);

//   useEffect(() => {
//     if (area) {
//       calculateArea();
//     }
//   }, [area, location]); // Dependencies: re-run when `area` or `location` changes

//   console.log("Area in Ton:", areaTon, " Area in HP:", areaHp);

//   if (subCat === "VRV") {
//     if (subCat1 === "split") return splitHP;
//     if (subCat1 === "casette") return casetteHP;
//     if (subCat1 === "ductTable") return ductTableHP;
//   } else {
//     if (subCat1 === "split") return splitTon;
//     if (subCat1 === "casette") return casetteTon;
//     if (subCat1 === "ductTable") return ductTableTon;
//   }
// };

// export default HVACCalculation;
