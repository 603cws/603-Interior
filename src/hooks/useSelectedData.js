import { useCallback } from "react";

export const useSelectedData = ({
  setSelectedData,
  areasData,
  quantityData,
  userResponses,
  selectedProductView,
  formulaMap,
  seatCountData,
  selectedSubCategory1,
  selectedAddons,
  numOfCoats,
  normalizeKey,
  multiplyFirstTwoFlexible,
  calculateTotalPrice,
}) => {
  const handleSelectedData = useCallback(
    (product, category, subCat, subcategory1, isChecked, productQuantity) => {
      if (!product) return;

      const groupKey = `${category.category}-${subCat}-${subcategory1}-${product.id}`;

      setSelectedData((prevData) => {
        const validPrevData = Array.isArray(prevData) ? prevData : [];

        // 🔴 Uncheck → remove item
        if (!isChecked) {
          const updatedData = validPrevData.filter(
            (item) => item.groupKey !== groupKey
          );
          localStorage.setItem("selectedData", JSON.stringify(updatedData));
          return updatedData;
        }

        const existingProduct = validPrevData.find(
          (item) => item.groupKey === groupKey
        );

        // Quantity calculations
        let calQty = 0;

        if (
          (category.category === "Civil / Plumbing" &&
            subcategory1 === "Tile") ||
          (category.category === "Flooring" && subcategory1 !== "Epoxy")
        ) {
          calQty = Math.ceil(
            +areasData[0][normalizeKey(subCat)] /
              multiplyFirstTwoFlexible(product?.dimensions)
          );
        } else {
          calQty = productQuantity[subCat]?.[selectedSubCategory1];
        }

        // Structure product payload
        const productData = {
          groupKey,
          id: product.id,
          category: category.category,
          subcategory: subCat,
          subcategory1,
          product_variant: {
            variant_title: product.title,
            variant_image: product.image,
            variant_details: product.details,
            variant_price: product.price,
            variant_id: product.id,
            additional_images: JSON.parse(product.additional_images || "[]"),
            variant_info: product.information,
            variant_additional_info: product.additonalinformation,
          },
          addons: existingProduct
            ? existingProduct.addons
            : selectedAddons || [],
          finalPrice:
            category.category === "Flooring" ||
            category.category === "HVAC" ||
            category.category === "Lighting" ||
            (category.category === "Civil / Plumbing" &&
              subcategory1 === "Tile") ||
            category.category === "Partitions / Ceilings" ||
            category.category === "Paint"
              ? calculateTotalPrice(
                  category.category,
                  subCat,
                  subcategory1,
                  null,
                  null,
                  null,
                  quantityData,
                  areasData,
                  userResponses,
                  selectedProductView,
                  formulaMap,
                  seatCountData
                )
              : category.category === "Furniture" &&
                subcategory1 === "Chair" &&
                (subCat === "Md Cabin Main" || subCat === "Md Cabin Visitor")
              ? product.price *
                (productQuantity[subCat]?.[selectedSubCategory1] ?? 0) *
                (quantityData[0]["md"] ?? 1)
              : category.category === "Furniture" &&
                subcategory1 === "Chair" &&
                (subCat === "Manager Cabin Main" ||
                  subCat === "Manager Cabin Visitor")
              ? product.price *
                (productQuantity[subCat]?.[selectedSubCategory1] ?? 0) *
                (quantityData[0]["manager"] ?? 1)
              : product.price *
                (productQuantity[subCat]?.[selectedSubCategory1] ?? 0),
          quantity:
            category.category === "Paint"
              ? Math.ceil(+areasData[0][normalizeKey(subCat)] / 120) *
                numOfCoats
              : category.category === "Furniture" &&
                subcategory1 === "Chair" &&
                (subCat === "Md Cabin Main" || subCat === "Md Cabin Visitor")
              ? calQty * (quantityData[0]["md"] ?? 1)
              : category.category === "Furniture" &&
                subcategory1 === "Chair" &&
                (subCat === "Manager Cabin Main" ||
                  subCat === "Manager Cabin Visitor")
              ? calQty * (quantityData[0]["manager"] ?? 1)
              : calQty,
        };

        // Update or add
        const updatedData = existingProduct
          ? validPrevData.map((item) =>
              item.groupKey === groupKey ? productData : item
            )
          : [...validPrevData, productData];

        localStorage.setItem("selectedData", JSON.stringify(updatedData));
        return updatedData;
      });
    },
    [
      setSelectedData,
      areasData,
      quantityData,
      userResponses,
      selectedProductView,
      formulaMap,
      seatCountData,
      selectedSubCategory1,
      selectedAddons,
      numOfCoats,
      normalizeKey,
      multiplyFirstTwoFlexible,
      calculateTotalPrice,
    ]
  );

  return handleSelectedData;
};
