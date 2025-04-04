import { useEffect, useState, useRef, useMemo } from "react";
import { ToastContainer } from "react-toastify";
import Navbar from "../../boq/components/Navbar";
import Categories from "./Categories";
import QnaPopup from "../components/QnaPopup";
import { useApp } from "../../Context/Context";
import { calculateAutoTotalPriceHelper } from "../utils/CalculateTotalPriceHelper";
import Joyride, { STATUS } from "react-joyride";
import ProfileCard from "../components/ProfileCard";
import Plans from "../../common-components/Plans";
import SelectArea from "../components/SelectArea";
import MainPage from "./MainPage";
import ProductCard from "../components/ProductCard";
import { motion, AnimatePresence } from "framer-motion";

// Define animation variants
const selectAreaAnimation = {
  initial: { x: "100vw", opacity: 0 }, // Start from the right
  animate: {
    x: "0",
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  }, // Move to center
  exit: {
    x: "-100vw",
    opacity: 0,
    transition: { duration: 0.5, ease: "easeIn" },
  }, // Exit to the left
};

function Boq() {
  // State to control background visibility
  const [showBackground, setShowBackground] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const profileRef = useRef(null);
  const iconRef = useRef(null); //used to close Profile Card when clicked outside of Profile Card area

  const [showSelectArea, setShowSelectArea] = useState(false);
  const [selectedAreas, setSelectedAreas] = useState([]);

  const [questionPopup, setQuestionPopup] = useState(false);
  // const [selectedPlan, setSelectedPlan] = useState(null);

  const {
    selectedCategory,
    setSelectedCategory,
    selectedSubCategory,
    setSelectedSubCategory,
    selectedSubCategory1,
    setSelectedSubCategory1,
    selectedData,
    setSelectedData,
    categories,
    categoriesWithModal,
    userResponses,
    setUserResponses,
    selectedPlan,
    defaultProduct,
    categoriesWithTwoLevelCheck,
    productData,
    areasData,
    quantityData,
    handleCategorySelection,
    selectedProductView,
    setSelectedProductView,
    minimizedView,
    setMinimizedView,
    showProductView,
    setShowProductView,
    searchQuery,
    priceRange,
  } = useApp();

  const [runTour, setRunTour] = useState(false); // Controls whether the tour runs

  //setps for joyride
  const tourSteps = [
    {
      target: ".cat", // CSS class in the Navbar component
      content: "these are the category",

      disableBeacon: true,
      disableOverlayClose: true,
      placement: "top",
    },
    {
      target: ".subcat", // Add className in OpenWorkspaces component
      content: "there are all the subcategory of the selected category.",
      disableBeacon: true,
      placement: "top",
    },
    {
      target: ".viewB", // Add className in Spacebar component
      content: "you can view your boq here",
      disableBeacon: true,
      // placement: "top",
    },
    {
      target: ".downloadB", // Add className in Spacebar component
      content: "click here to download boq in pdf format",
      disableBeacon: true,
      // placement: "top",
    },
  ];

  // Handle the completion or skipping of the tour
  const handleTourCallback = (data) => {
    const { status } = data;
    console.log(data);

    const finishedStatuses = [STATUS.FINISHED, STATUS.SKIPPED];
    if (finishedStatuses.includes(status)) {
      setRunTour(false);
      setQuestionPopup(true);
      localStorage.setItem("hasSeenBOQTour", "true");
    }
  };

  useEffect(() => {
    // Check localStorage to decide if the tour should run
    const hasSeenTour = localStorage.getItem("hasSeenBOQTour");
    const hasSeenPopup = localStorage.getItem("hasSeenQuestionPopup");

    if (!hasSeenTour) {
      setRunTour(true); // Start the tour automatically on first visit
    } else if (!hasSeenPopup) {
      setQuestionPopup(true);
      localStorage.setItem("hasSeenQuestionPopup", "true");
    }
  }, []);

  useEffect(() => {
    if (defaultProduct && selectedPlan && productData.length > 0) {
      // autoSelectPlanProducts(productData, subCategories);
      autoSelectPlanProducts(productData, categories);
      // setDefaultProduct(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPlan, productData, defaultProduct]);

  // Toggle profile card visibility
  const toggleProfile = () => {
    setIsOpen((prev) => !prev);
  };

  // Close profile card when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileRef.current?.contains(event.target) ||
        iconRef.current?.contains(event.target)
      ) {
        return; // If clicked inside, do nothing
      }
      setIsOpen(false); // Otherwise, close it
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleSelectedSubCategory = (subCategory) => {
    setSelectedSubCategory(subCategory);
    setMinimizedView(true);
    console.log("Selected SubCat: ", subCategory);
  };

  const handleSelectedSubCategory1 = (subCategory1) => {
    setSelectedSubCategory1(subCategory1);
    console.log("Selected SubCat1: ", subCategory1);
  };

  const handleSelectedProductView = (variant) => {
    setSelectedProductView(variant);
  };

  const calculateAutoTotalPrice = (
    variantPrice,
    cat,
    subcategory,
    subcategory1
  ) => {
    console.log(variantPrice, cat, subcategory, subcategory1);

    const baseTotal = calculateAutoTotalPriceHelper(
      quantityData[0],
      areasData[0],
      cat,
      subcategory,
      subcategory1,
      userResponses.height
    );

    let total = 0;

    if (cat === "HVAC") total = baseTotal;
    else if (cat === "Lighting") total = baseTotal * 200 + variantPrice;
    // else if (cat === "Civil / Plumbing") total = baseTotal * 100 + variantPrice;
    else if (cat === "Civil / Plumbing") total = baseTotal * variantPrice;
    else if (cat === "Paint") total = baseTotal * variantPrice * 3 * 15;
    else total = baseTotal * variantPrice;

    // Store the total per category
    // categoryTotals[cat] = (categoryTotals[cat] || 0) + total;

    // console.log(`Total for ${cat}: `, categoryTotals[cat]);

    return total;
  };

  const autoSelectPlanProducts = (products, categories) => {
    console.log("All Products:", products);
    console.log("Selected categories:", categories);

    if (!selectedPlan || !products.length || !categories.length) return;

    const selectedProducts = [];
    const selectedGroups = new Set(); // To track selected subcategory1 for each category-subcategory combination
    const productMap = new Map();

    categories.forEach((cat) => {
      console.log(cat);

      const filterProducts = products.filter(
        (product) => product.category === cat.category
      );

      console.log(filterProducts);

      filterProducts.forEach((product) => {
        console.log(product);

        // if(product.category === "HVAC" && product.subc)

        const { category, subcategory, subcategory1, product_variants } =
          product;

        if (
          !category ||
          !subcategory ||
          !subcategory1 ||
          !product_variants?.length
        )
          return;

        // Split subcategories if they contain multiple comma-separated values
        const subcategories = subcategory.split(",").map((sub) => sub.trim());

        subcategories.forEach((subCat) => {
          if (category === "HVAC" && subCat !== "Centralized") return;

          // Ensure the subcategory is in the selected subcategories list
          if (!cat.subcategories.includes(subCat)) return;
          // const groupKey = `${category}-${subCat}-${subcategory1}`;
          // const groupKey = `${category}-${subCat}-${subcategory1}-${product.id}`;

          // Find the variant that matches the selected plan AND has `default` set to true
          const matchingVariant = product_variants.find(
            (variant) =>
              variant.segment?.toLowerCase() === selectedPlan?.toLowerCase() &&
              variant.default === variant.segment // Ensure it is marked as default
          );

          console.log("matching variant", matchingVariant);

          if (matchingVariant) {
            // const groupKey = `${category}-${subCat}-${subcategory1}-${product.id}`;
            const groupKey = `${category}-${subCat}-${subcategory1}-${matchingVariant.id}`;

            productMap.set(groupKey, {
              product,
              variant: matchingVariant,
              subcategory: subCat,
            });
          }
        });
      });

      // Process selected products (one per `subcategory1` for each subcategory)
      productMap.forEach(({ product, variant, subcategory }, groupKey) => {
        if (!selectedGroups.has(groupKey)) {
          const { category, subcategory1 } = product;

          const productData = {
            groupKey,
            id: variant.id,
            category,
            subcategory, // Individual subcategory
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
            // addons: product.addons || [],
            finalPrice: calculateAutoTotalPrice(
              variant.price,
              product.category,
              subcategory,
              product.subcategory1
            ),
          };

          selectedProducts.push(productData);
          // setSelectedData((prev) => [...prev, productData]);
          selectedGroups.add(groupKey);
        }
      });
    });

    setSelectedData(selectedProducts);

    console.log("Auto-selected products based on plan:", selectedProducts);
  };

  const handleCategoryClick = (id, category, subcategories) => {
    setSelectedCategory({ id, category, subcategories });
    if (minimizedView) {
      setSelectedSubCategory(subcategories[0] || null); // Automatically select the first subcategory if available
    }
    // Check if the category requires the modal
    if (categoriesWithModal.includes(category)) {
      setQuestionPopup(true);
      // setSelectedCategory(category);
    }
  };

  const handleQuestionSubmit = (answers) => {
    console.log("Answers from QuestionModal:", answers); // Log submitted answers
    setUserResponses((prevResponses) => ({
      ...prevResponses,
      height: answers.roomHeight,
      flooring: answers.flooringStatus,
      demolishTile: answers.demolishTile,
      // flooringArea: answers.flooringArea,
      // flooringType: answers.flooringType,
      // cabinFlooring: answers.cabinFlooring,
      hvacType: answers.hvacType,
      // hvacCentralized: answers.hvacCentralized,
      // partitionArea: answers.partitionArea,
      // partitionType: answers.partitionType,
      //  [expandedSubcategory]: answers, // Store answers for the subcategory
      // [expandedSubcategory]: answers,
    }));

    // Hide the modal and reset questions state
    setQuestionPopup(false);

    if (
      selectedCategory.category === "HVAC" &&
      answers.hvacType === "Centralized"
    ) {
      setSelectedSubCategory(answers.hvacType || null);
    }

    //  setCabinsQuestions(false);
    // setRunTour(true);

    //  setExpandedSubcategory(expandedSubcategory);

    // Update the total cost or other BOQ data if needed
    //  updateBOQTotal();
  };

  // Filter products based on search query, price range, and category
  const filteredProducts = useMemo(() => {
    // if (!selectedCategory) return false;
    // if (productData.length > 0 || priceRange.length > 0) return []; // Ensure it's an array

    return productData.filter((product) => {
      if (!product.product_variants || product.product_variants.length === 0) {
        return false;
      }

      const matchesVariant = product.product_variants.some((variant) => {
        const matchesSearch =
          variant.title?.toLowerCase().includes(searchQuery?.toLowerCase()) ||
          variant.details?.toLowerCase().includes(searchQuery?.toLowerCase());

        const matchesPrice =
          variant.price >= priceRange[0] && variant.price <= priceRange[1];

        return matchesSearch && matchesPrice;
      });

      const matchesCategory =
        selectedCategory?.category === "" ||
        product.category === selectedCategory?.category;
      return matchesVariant && matchesCategory;
    });
  }, [productData, searchQuery, priceRange, selectedCategory]);

  // Group products by category and subcategory
  const groupedProducts = useMemo(() => {
    const grouped = {};

    filteredProducts.forEach((product) => {
      const subcategories = product.subcategory
        .split(",")
        .map((sub) => sub.trim());

      subcategories.forEach((subcategory) => {
        if (!grouped[product.category]) {
          grouped[product.category] = {};
        }
        if (!grouped[product.category][subcategory]) {
          grouped[product.category][subcategory] = [];
        }
        grouped[product.category][subcategory].push(product);
      });
    });
    return grouped;
  }, [filteredProducts]);

  const allAddons = filteredProducts.flatMap((product) =>
    product.subcategory1 === selectedSubCategory1 &&
    Array.isArray(product.addons)
      ? product.addons
      : []
  );

  // const handleBoqNameConfirm = (nameOrId, isNew = true) => {
  //   setShowBoqPrompt(false);

  //   if (isNew) {
  //     setBoqTitle(nameOrId); // If it's a new BOQ, use the entered name
  //     insertDataIntoSupabase(selectedData, userId, nameOrId, totalArea);
  //   } else {
  //     *(nameOrId); // If updating an existing BOQ, use its ID
  //   }
  // };

  console.log("selected products", selectedData);
  // console.log("selected plan", selectedPlan);

  return (
    <div>
      {/* {showBoqPrompt && (
        <BoqPrompt
          existingBoqs={existingBoqs}
          onConfirm={handleBoqNameConfirm}
          onCancel={() => setShowBoqPrompt(false)}
        />
      )} */}

      <Joyride
        steps={tourSteps}
        run={runTour}
        continuous
        showSkipButton
        callback={handleTourCallback}
        scrollToFirstStep
        styles={{
          options: {
            zIndex: 10000,
            primaryColor: "#6366f1", // Tailwind's Indigo-500
            backgroundColor: "#A9D3CE",
            arrowColor: "#A9D3CE",
            overlayColor: "rgba(0, 0, 0, 0.5)",
          },
          buttonNext: {
            backgroundColor: "#34bfad",
            borderRadius: 4,
            color: "#000",
            padding: 10,
            font: "semibold",
          },
          buttonSkip: {
            color: "#797979",
            font: "semibold",
            fontSize: 16,
          },
        }}
      />
      <Navbar toggleProfile={toggleProfile} iconRef={iconRef} />
      <div className="px-2 lg:px-5">
        {!selectedPlan ? (
          <Plans />
        ) : (
          <>
            {selectedPlan === "Custom" && questionPopup && (
              <QnaPopup
                onClose={() => setQuestionPopup(false)}
                onSubmit={handleQuestionSubmit}
              />
            )}

            {!showProductView && (
              <>
                <Categories
                  setSelectedCategory={handleCategorySelection}
                  setSelectedSubCategory={handleSelectedSubCategory}
                  handleCategoryClick={handleCategoryClick}
                />
                {minimizedView && (
                  <div>
                    <ToastContainer />
                    <AnimatePresence>
                      {showSelectArea && (
                        <motion.div
                          variants={selectAreaAnimation}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                          className={`fixed inset-0 flex justify-center items-center z-[1000] transition-opacity duration-300 ${
                            showBackground
                              ? "bg-black bg-opacity-30"
                              : "bg-transparent"
                          }`}
                          onAnimationComplete={(definition) => {
                            if (definition === "animate") {
                              setShowBackground(true); // Only show background after entering animation
                            }
                          }}
                        >
                          <SelectArea
                            setShowSelectArea={setShowSelectArea}
                            image={selectedProductView.image}
                            selectedAreas={selectedAreas}
                            setSelectedAreas={setSelectedAreas}
                            selectedProductView={selectedProductView}
                            selectedData={selectedData}
                            categoriesWithTwoLevelCheck={
                              categoriesWithTwoLevelCheck
                            }
                            allAddons={allAddons}
                            setShowBackground={setShowBackground}
                            selectedCategory={selectedCategory}
                            selectedSubCategory={selectedSubCategory}
                            selectedSubCategory1={selectedSubCategory1}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <MainPage
                      setSelectedSubCategory1={handleSelectedSubCategory1}
                      userResponses={userResponses}
                      productsData={productData}
                    />
                    <ProductCard
                      products={groupedProducts}
                      selectedProductView={selectedProductView}
                      setShowProductView={setShowProductView}
                      setSelectedProductView={handleSelectedProductView}
                      userResponses={userResponses}
                      showSelectArea={showSelectArea}
                      setShowSelectArea={setShowSelectArea}
                    />
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>

      {/* {showProductView && ( //Old ProductOverview
        <div>
          <ProductOverview
            selectedProductView={selectedProductView}
            quantityData={quantityData}
            areasData={areasData}
            setShowProductView={setShowProductView}
            setShowRecommend={setShowRecommend}
            filteredProducts={filteredProducts}
          />
          {showRecommend && (
            <RecommendComp
              showRecommend={showRecommend}
              setShowRecommend={setShowRecommend}
            />
          )}
        </div>
      )} */}
      {/* {showProfile && <ProfileCard />} */}
      <AnimatePresence>
        {isOpen && (
          <div ref={profileRef}>
            <ProfileCard
              layout={false}
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              iconRef={iconRef}
            />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Boq;
