import { useState, useEffect } from "react";
import { useApp } from "../Context/Context";
import { motion } from "framer-motion";
import { HiCheckBadge } from "react-icons/hi2";
import toast from "react-hot-toast";
import NewBoq from "../boq/components/NewBoq";
import {
  createDraftBOQ,
  handleLoadBOQ,
  multiplyFirstTwoFlexible,
  normalizeKey,
} from "../boq/utils/BoqUtils";
import { calculateAutoTotalPriceHelper } from "../boq/utils/CalculateTotalPriceHelper";
import { numOfCoats } from "../constants/constant";

const plansData = [
  {
    id: 0,
    planNumber: "01",
    title: "Minimal",
    bullets: [
      "Budget-friendly with essential features.",
      "Standard quality materials.",
      "No luxury add-ons.",
      "Quick and simple execution.",
    ],
    image: "/images/plan-minimal.webp",
    planKey: "Minimal",
  },
  {
    id: 1,
    planNumber: "02",
    title: "Exclusive",
    bullets: [
      "Premium materials with a refined look.",
      "Stylish finishes and modern features.",
      "Balanced cost and luxury.",
      "Energy-efficient solutions.",
    ],
    image: "/images/plan-exclusive.jpg",
    planKey: "Exclusive",
  },
  {
    id: 2,
    planNumber: "03",
    title: "Luxury",
    bullets: [
      "High-end finishes and designer fittings.",
      "Smart office integration.",
      "Custom detailing for a lavish feel.",
      "Ultimate comfort and sophistication.",
    ],
    image: "/images/plan-luxury.png",
    planKey: "Luxury",
  },
  {
    id: 3,
    planNumber: "04",
    title: "Custom",
    bullets: [
      "The brand proposes their budget",
      "Dedicated brand webinar or",
      "Co-branded marketing campaigns",
      "Offline exposure at Workved Interiors",
    ],
    image: "/images/plan-custom.jpg",
    planKey: "Custom",
  },
];

function getGridTemplateColumns(hoveredId) {
  switch (hoveredId) {
    case 0:
      return "4fr 1fr 1fr 1fr";
    case 1:
      return "1fr 4fr 1fr 1fr";
    case 2:
      return "1fr 1fr 4fr 1fr";
    case 3:
      return "1fr 1fr 1fr 4fr";
    default:
      return "2.5fr 1fr 1fr 1fr";
  }
}

function Plans({ showNewBoqPopup, setShowNewBoqPopup }) {
  const {
    setSelectedPlan,
    productData,
    categories,
    BOQTitle,
    setIsSaveBOQ,
    setBOQTitle,
    setBOQID,
    setSelectedData,
    setProgress,
    userId,
    currentLayoutID,
    setUserId,
    setTotalArea,
    setBoqTotal,
    areasData,
    quantityData,
    allProductQuantities,
    formulaMap,
    seatCountData,
    userResponses,
    setSelectedCategory,
  } = useApp();

  const [hoveredPlan, setHoveredPlan] = useState(1);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    setIsSaveBOQ(true);
  }, []);

  const handlePlanSelect = (planKey) => {
    setSelectedCategory(categories[0]);
    setSelectedPlan(planKey);
    sessionStorage.setItem("selectedPlan", planKey);
    toast.success(`${planKey} plan selected!`);
    autoSelectPlanProducts(productData, categories, planKey);
  };

  const handleConfirm = async (nameOrId, boqMode) => {
    if (boqMode === "new") {
      const draft = await createDraftBOQ(nameOrId, userId, currentLayoutID);
      if (!draft) return;

      setBOQTitle(draft.boqTitle);
      setBOQID(draft.id);
      setSelectedData([]);
      setProgress(0);
      setSelectedPlan(null);
      localStorage.removeItem("selectedData");
      sessionStorage.removeItem("selectedPlan");
    } else if (boqMode === "existing") {
      handleLoadBOQ(
        nameOrId,
        setSelectedData,
        setUserId,
        setTotalArea,
        setSelectedPlan,
        setBOQTitle,
        setBoqTotal,
        setBOQID
      );
    }
    setShowNewBoqPopup(false);
  };

  const autoSelectPlanProducts = (products, categories, selectedPlan) => {
    if (!selectedPlan || !products.length || !categories.length) return;

    const selectedProducts = [];
    const selectedGroups = new Set();
    const productMap = new Map();

    categories.forEach((cat) => {
      const filterProducts = products.filter(
        (product) => product.category === cat.category
      );

      filterProducts.forEach((product) => {
        const { category, subcategory, subcategory1, product_variants } =
          product;

        if (
          !category ||
          !subcategory ||
          !subcategory1 ||
          !product_variants?.length
        )
          return;

        const subcategories = subcategory.split(",").map((sub) => sub.trim());

        subcategories.forEach((subCat) => {
          if (category === "HVAC" && subCat !== "Centralized") return;

          if (!cat.subcategories.includes(subCat)) return;
          const matchingVariant = product_variants.find(
            (variant) =>
              variant.segment?.toLowerCase() === selectedPlan?.toLowerCase() &&
              variant.default === variant.segment // Ensure it is marked as default
          );

          if (matchingVariant) {
            // ✅ Special case: Furniture Chairs in Md/Manager Cabin
            if (
              category === "Furniture" &&
              subcategory1 === "Chair" &&
              (subCat === "Md Cabin" || subCat === "Manager Cabin")
            ) {
              const mainGroupKey = `${category}-${subCat} Main-${subcategory1}-${matchingVariant.id}`;
              productMap.set(mainGroupKey, {
                product,
                variant: matchingVariant,
                subcategory: `${subCat} Main`,
              });

              const visitorGroupKey = `${category}-${subCat} Visitor-${subcategory1}-${matchingVariant.id}`;
              productMap.set(visitorGroupKey, {
                product,
                variant: matchingVariant,
                subcategory: `${subCat} Visitor`,
              });
            } else {
              const groupKey = `${category}-${subCat}-${subcategory1}-${matchingVariant.id}`;
              productMap.set(groupKey, {
                product,
                variant: matchingVariant,
                subcategory: subCat,
              });
            }
          }
        });
      });

      productMap.forEach(({ product, variant, subcategory }, groupKey) => {
        if (!selectedGroups.has(groupKey)) {
          const { category, subcategory1 } = product;

          let calQty = 0;

          if (
            (product.category === "Civil / Plumbing" &&
              subcategory1 === "Tile") ||
            (product.category === "Flooring" && subcategory1 !== "Epoxy")
          ) {
            calQty = Math.ceil(
              +areasData[0][normalizeKey(subcategory)] /
                multiplyFirstTwoFlexible(variant?.dimensions)
            );
          } else {
            calQty = allProductQuantities[subcategory]?.[subcategory1];
          }

          const productData = {
            groupKey,
            id: variant.id,
            category,
            subcategory,
            subcategory1,
            product_variant: {
              variant_title: variant.title || product.title || "No Title",
              variant_image: variant.image || null,
              variant_details: variant.details || "No Details",
              variant_price: variant.price || 0,
              variant_id: variant.id,
              variant_segment: variant.segment,
              default: variant.default,
              additional_images: JSON.parse(variant.additional_images || "[]"),
            },
            finalPrice:
              category === "Flooring" ||
              category === "HVAC" ||
              category === "Lighting" ||
              (category === "Civil / Plumbing" && subcategory1 === "Tile") ||
              category === "Partitions / Ceilings" ||
              category === "Paint"
                ? calculateAutoTotalPriceHelper(
                    variant.price,
                    product.category,
                    subcategory,
                    product.subcategory1,
                    variant.dimensions,
                    seatCountData,
                    quantityData,
                    areasData,
                    formulaMap,
                    userResponses
                  )
                : category === "Furniture" &&
                  subcategory1 === "Chair" &&
                  (subcategory === "Md Cabin Main" ||
                    subcategory === "Md Cabin Visitor")
                ? variant.price *
                  (allProductQuantities[subcategory]?.[subcategory1] ?? 0) *
                  (quantityData[0]["md"] ?? 1)
                : category === "Furniture" &&
                  subcategory1 === "Chair" &&
                  (subcategory === "Manager Cabin Main" ||
                    subcategory === "Manager Cabin Visitor")
                ? variant.price *
                  (allProductQuantities[subcategory]?.[subcategory1] ?? 0) *
                  (quantityData[0]["manager"] ?? 1)
                : variant.price *
                  (allProductQuantities[subcategory]?.[subcategory1] ?? 0),
            quantity:
              category === "Paint"
                ? Math.ceil(+areasData[0][normalizeKey(subcategory)] / 120) *
                  numOfCoats
                : product.category === "Furniture" &&
                  subcategory1 === "Chair" &&
                  (subcategory === "Md Cabin Main" ||
                    subcategory === "Md Cabin Visitor")
                ? calQty * (quantityData[0]["md"] ?? 1)
                : product.category === "Furniture" &&
                  subcategory1 === "Chair" &&
                  (subcategory === "Manager Cabin Main" ||
                    subcategory === "Manager Cabin Visitor")
                ? calQty * (quantityData[0]["manager"] ?? 1)
                : calQty,
          };

          selectedProducts.push(productData);
          selectedGroups.add(groupKey);
        }
      });
    });

    setSelectedData(selectedProducts);
  };

  return (
    <div className="lg:container md:mx-auto lg:my-8 font-Poppins">
      <h2 className="text-center font-semibold text-xl lg:text-3xl capitalize text-[#75A2BE] my-4">
        please select your plan
      </h2>
      <div
        className="hidden lg:grid transition-all duration-500 h-[450px] gap-2"
        style={{ gridTemplateColumns: getGridTemplateColumns(hoveredPlan) }}
        onMouseLeave={() => setHoveredPlan(1)}
      >
        {plansData.map((plan) => {
          const isExpanded = plan.id === hoveredPlan;

          return (
            <div
              key={plan.id}
              onMouseEnter={() => setHoveredPlan(plan.id)}
              className="relative overflow-hidden bg-[#E4F0EC] rounded-xl"
            >
              {isExpanded ? (
                <div className="w-full h-full flex flex-row bg-[#374A75]">
                  <div className="h-full px-7 py-10 flex items-end justify-center relative font-Poppins text-white border-r-2">
                    <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-3xl mt-4 font-bold">
                      {plan.planNumber}
                    </div>

                    <div
                      className="text-2xl font-bold rotate-180 text-end"
                      style={{ writingMode: "vertical-lr" }}
                    >
                      {plan.title}
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col-reverse xl:flex-row ">
                    <div className="flex-1 xl:py-6 px-6 text-white flex flex-col justify-between">
                      <div>
                        <h2 className="text-3xl font-bold mb-4">
                          {plan.title}
                        </h2>

                        <ul className="lg:space-y-1 xl:space-y-2 text-sm">
                          {plan.bullets.map((bullet, i) => (
                            <li key={i} className="flex items-center xl:gap-2 ">
                              <div className="bg-white rounded-full h-3 w-3 flex justify-center items-center relative mr-2">
                                <div className="absolute flex justify-center items-center">
                                  <HiCheckBadge color="#75A2BE" size={25} />
                                </div>
                              </div>
                              <span>{bullet}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="text-left mt-4">
                        <button
                          onClick={() => handlePlanSelect(plan.planKey)}
                          className="bg-[#75A2BE] text-[#fff] px-4 py-2 lg:mb-3 mb-1 rounded-md font-semibold border border-[#000] hover:bg-gray-200 transition hover:text-[#374A75]"
                        >
                          Get {plan.planKey}
                        </button>
                      </div>
                    </div>

                    <div className="flex-1 px-5 lg:py-4 xl:py-7 relative">
                      {!imageLoaded && (
                        <div className="w-full h-52 xl:h-full rounded-3xl bg-gray-300" />
                      )}

                      <motion.img
                        initial={{ opacity: 0 }}
                        animate={{ opacity: imageLoaded ? 1 : 0 }}
                        transition={{ duration: 0.5 }}
                        onLoad={() => setImageLoaded(true)}
                        src={plan.image}
                        alt={plan.title}
                        loading="lazy"
                        className={`w-full lg:h-48 h-52 lg:mt-3 xl:mt-0 xl:h-full object-cover rounded-3xl absolute top-0 left-0 ${
                          imageLoaded ? "relative" : "invisible"
                        }`}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full flex items-end justify-center relative font-Poppins text-[#75A2BE] py-10">
                  <div className="absolute top-6 left-1/2 transform -translate-x-1/2  text-3xl font-bold">
                    {plan.planNumber}
                  </div>

                  <div
                    className="text-2xl font-bold rotate-180 text-end"
                    style={{ writingMode: "vertical-lr" }}
                  >
                    {plan.title}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div
        className="lg:hidden grid grid-cols-1 md:grid-cols-2 md:gap-3"
        onMouseLeave={() => setHoveredPlan(1)}
      >
        {plansData.map((plan) => {
          return (
            <div
              key={plan.id}
              onMouseEnter={() => setHoveredPlan(plan.id)}
              className="relative overflow-hidden bg-[#E4F0EC] mb-3 rounded-2xl"
            >
              <div className="w-full h-full flex flex-col bg-[#374A75]">
                <div className="h-44 w-44 rounded-full border-[14px] border-[#11275a] absolute -top-5 -right-10 opacity-90"></div>
                <div className="h-44 w-44 rounded-full border-8 border-[#2c4174] absolute top-20 -right-20 opacity-50"></div>
                <div className="h-44 w-44 rounded-full border-8 border-[#283759] absolute -bottom-10 -left-10 opacity-50"></div>
                <div
                  className="h-full flex items-center justify-between mx-2 my-2
                  font-Poppins text-white border-b-2 relative"
                >
                  <div className="text-xl font-bold">{plan.planNumber}</div>
                  <div className="text-xl font-bold  text-end">
                    {plan.title}
                  </div>
                </div>
                <div className="flex-1 flex flex-col-reverse">
                  <div className="flex-1 py-3 px-6  text-white flex flex-col justify-between">
                    <div>
                      <h2 className="text-2xl font-bold mb-4">{plan.title}</h2>
                      <ul className="space-y-2 text-xs">
                        {plan.bullets.map((bullet, i) => (
                          <li
                            key={i}
                            className="flex items-center gap-4 relative"
                          >
                            <div className="bg-white rounded-full h-3 w-3 flex justify-center items-center relative">
                              <div className="absolute flex justify-center items-center">
                                <HiCheckBadge color="#75A2BE" size={25} />
                              </div>
                            </div>
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="text-left mt-4 relative">
                      <button
                        onClick={() => handlePlanSelect(plan.planKey)}
                        className="bg-[#75A2BE] text-[#fff] px-4 py-2 rounded-md font-semibold border border-[#000] hover:bg-gray-200 transition"
                      >
                        Get {plan.planKey}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {showNewBoqPopup && !BOQTitle && (
        <NewBoq
          onConfirm={handleConfirm}
          onCancel={() => setShowNewBoqPopup(false)}
        />
      )}
    </div>
  );
}

export default Plans;
