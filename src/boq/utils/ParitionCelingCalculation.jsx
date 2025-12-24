const PartitionCeilingCalculation = ({
  quantity,
  area,
  subcategory1,
  height,
}) => {
  const hard = area > 250 ? 14 : area > 150 ? 12 : area > 100 ? 10 : 8;
  const factor = quantity > 3 ? 1.5 : 2;
  const soft = (area / hard).toFixed(2);

  const totalSoft = soft * factor * height;
  const totalHard = hard * factor * height;

  return subcategory1 === "Glass Partition"
    ? totalSoft
    : subcategory1 === "Gypsum Partition"
    ? totalHard
    : 1;
};

export default PartitionCeilingCalculation;
