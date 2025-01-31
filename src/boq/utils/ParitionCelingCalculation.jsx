const PartitionCeilingCalculation = ({
  quantity,
  area,
  subcategory1,
  height,
  softPrice = 350,
  hardPrice = 120,
}) => {
  const hard = area > 250 ? 14 : area > 150 ? 12 : area > 100 ? 10 : 8;
  const factor = quantity > 3 ? 1.5 : 2;
  const soft = (area / hard).toFixed(2);

  const totalSoft = quantity * soft * factor * height * softPrice;
  const totalHard = quantity * hard * factor * height * hardPrice;

  console.log(
    "hard: ",
    hard,
    "Soft: ",
    soft,
    "Multiply factor: ",
    factor,
    " Hard Calc: Rs.",
    quantity * hard * factor * height * hardPrice,
    " Soft Calc: Rs.",
    quantity * soft * factor * height * softPrice,
    " Total Area: ",
    area,
    "Total Quantity:",
    quantity,
    "Height: ",
    height
  );

  return subcategory1 === "Glass Partition"
    ? totalSoft
    : subcategory1 === "Gypsum Partition"
    ? totalHard
    : 1;
};

export default PartitionCeilingCalculation;

// const ParitionCelingCalculation = ({ quantity, area, height = 10, softPrice = 350, hardPrice = 120 }) => {
//     let hard = 0, soft = 0, factor = 0, totalsoft = 0, totalHard = 0;

//     if (area <= 100) {
//         hard = 8;
//     } else if (100 < area && area <= 150) {
//         hard = 10;
//     } else if (150 < area && area <= 250) {
//         hard = 12;
//     } else if (area > 250) {
//         hard = 14;
//     }

//     if (quantity > 3) {
//         factor = 1.5;
//     } else if (quantity <= 3) {
//         factor = 2;
//     }

//     soft = area / hard;
//     soft = soft.toFixed(2);

//     totalsoft = quantity * soft * factor * height * softPrice;

//     totalHard = quantity * hard * factor * height * hardPrice;

//     console.log("hard: ", hard, "Soft: ", soft, "Multiply factor: ", factor, "Quantity:", quantity,
//         " Hard Calc: Rs.", quantity * hard * factor * height * hardPrice, " Soft Calc: Rs.",
//         quantity * soft * factor * height * softPrice, " Total Area: ", area);

//     alert("Soft Price: " + totalsoft + "\nHard Price: " + totalHard);

// }

// export default ParitionCelingCalculation;
