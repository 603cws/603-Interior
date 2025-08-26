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
import { calculateCategoryTotal } from "../utils/calculateCategoryTotal";
import { selectAreaAnimation } from "../constants/animations";
import NewBoq from "../components/NewBoq";
import toast from "react-hot-toast";
import { supabase } from "../../services/supabase";
import { fetchProductsData } from "../utils/dataFetchers";
import { useLocation } from "react-router-dom";
import { categoriesWithModal, priceRange } from "../../constants/constant";

function Boq() {
  const location = useLocation();
  const [showBackground, setShowBackground] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const profileRef = useRef(null);
  const iconRef = useRef(null);
  const [isDBPlan, setIsDBPlan] = useState(false);

  const [showNewBoqPopup, setShowNewBoqPopup] = useState(true);
  const [showSelectArea, setShowSelectArea] = useState(false);
  const [selectedAreas, setSelectedAreas] = useState([]);

  const [questionPopup, setQuestionPopup] = useState(false);
  const [showBoqPrompt, setShowBoqPrompt] = useState(false);
  const [existingBoqs, setExistingBoqs] = useState([]); // Stores fetched BOQs
  const [isProfileCard, setIsProfileCard] = useState(false);
  const [minimizedView, setMinimizedView] = useState(
    location?.state?.minimizedView || false
  );

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
    // categoriesWithModal,
    userResponses,
    setUserResponses,
    selectedPlan,
    // defaultProduct,
    // categoriesWithTwoLevelCheck,
    productData,
    areasData,
    quantityData,
    selectedProductView,
    setSelectedProductView,
    searchQuery,
    // priceRange,
    formulaMap,
    BOQTitle,
    setBOQTitle,
    setUserId,
    setTotalArea,
    setSelectedPlan,
    setProgress,
    setBOQID,
    setBoqTotal,
    boqTotal,
    userId,
    currentLayoutID,
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

    const finishedStatuses = [STATUS.FINISHED, STATUS.SKIPPED];
    if (finishedStatuses.includes(status)) {
      setRunTour(false);
      setQuestionPopup(true);
      localStorage.setItem("hasSeenBOQTour", "true");
    }
  };

  useEffect(() => {
    // Check localStorage to decide if the tour should run
    if (!selectedPlan) return; // Ensure selectedPlan is set before running the tour
    const hasSeenTour = localStorage.getItem("hasSeenBOQTour") === "true";
    const hasSeenPopup =
      localStorage.getItem("hasSeenQuestionPopup") === "true";

    if (!hasSeenTour) {
      setRunTour(true); // Start the tour automatically on first visit
    } else if (!hasSeenPopup) {
      setQuestionPopup(true);
      localStorage.setItem("hasSeenQuestionPopup", "true");
    }
  }, [selectedPlan]);

  // useEffect(() => {
  //   if (
  //     // defaultProduct &&
  //     selectedPlan !== "Custom" &&
  //     productData.length > 0 &&
  //     !isDBPlan
  //   ) {
  //     // autoSelectPlanProducts(productData, subCategories);
  //     autoSelectPlanProducts(productData, categories);
  //     // setDefaultProduct(false);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

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

    if (isOpen || questionPopup) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.classList.remove("no-scroll");
    };
  }, [isOpen, questionPopup]);

  const handleSelectedSubCategory = (subCategory) => {
    setSelectedSubCategory(subCategory);
    setMinimizedView(true);
  };

  const handleSelectedSubCategory1 = (subCategory1) => {
    setSelectedSubCategory1(subCategory1);
  };

  const handleSelectedProductView = (variant) => {
    setSelectedProductView(variant);
  };

  const calculateAutoTotalPrice = (
    variantPrice,
    cat,
    subcategory,
    subcategory1,
    dimensions
  ) => {
    const baseTotal = calculateAutoTotalPriceHelper(
      quantityData[0],
      areasData[0],
      cat,
      subcategory,
      subcategory1,
      userResponses.height,
      dimensions
    );

    const total = calculateCategoryTotal(
      cat,
      baseTotal,
      variantPrice,
      formulaMap
    );

    return total;
  };

  const autoSelectPlanProducts = (products, categories, selectedPlan) => {
    if (!selectedPlan || !products.length || !categories.length) return;

    const selectedProducts = [];
    const selectedGroups = new Set(); // To track selected subcategory1 for each category-subcategory combination
    const productMap = new Map();

    categories.forEach((cat) => {
      const filterProducts = products.filter(
        (product) => product.category === cat.category
      );

      filterProducts.forEach((product) => {
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
              product.subcategory1,
              variant.dimensions
            ),
          };

          selectedProducts.push(productData);
          // setSelectedData((prev) => [...prev, productData]);
          selectedGroups.add(groupKey);
        }
      });
    });

    setSelectedData(selectedProducts);
  };

  const handleCategoryClick = (id, category, subcategories) => {
    setSelectedCategory({ id, category, subcategories });
    if (minimizedView) {
      setSelectedSubCategory(subcategories[0] || null); // Automatically select the first subcategory if available
      if (category === "HVAC" && selectedPlan !== "Custom") {
        setSelectedSubCategory(userResponses.hvacType); // On Plan change subCat not updating proeprly for HVAC
      }
    }
    // Check if the category requires the modal
    if (categoriesWithModal.includes(category)) {
      setQuestionPopup(true);
      // setSelectedCategory(category);
    }
  };

  const handleQuestionSubmit = (answers) => {
    setUserResponses((prevResponses) => ({
      ...prevResponses,
      height: answers.roomHeight,
      flooring: answers.flooringStatus,
      demolishTile: answers.demolishTile,
      hvacType: answers.hvacType,
    }));

    // Hide the modal and reset questions state
    setQuestionPopup(false);

    if (
      selectedCategory.category === "HVAC" &&
      answers.hvacType === "Centralized"
    ) {
      setSelectedSubCategory(answers.hvacType || null);
    }
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

  const fetchFilteredBOQProducts = async (products = [], addons = []) => {
    try {
      if (!products.length) {
        console.warn("No products passed to fetchFilteredBOQProducts.");
        return [];
      }

      const allProducts = await fetchProductsData();
      if (!allProducts.length) {
        console.warn("No products found in database.");
        return [];
      }

      return products
        .map((product, index) => {
          const { id: variantId, groupKey, finalPrice = 0 } = product;

          // Parse category/subcategory/subcategory1 from groupKey
          const parts = groupKey.split("-");
          const isLType = groupKey.includes("L-Type Workstation");

          const category = parts[0];
          const subcategory = isLType ? "L-Type Workstation" : parts[1];
          const subcategory1 = isLType ? parts[3] || "" : parts[2];
          const productId = parts[parts.length - 1];

          // Find matching product and variant
          let matchedVariant, matchedProduct;
          for (const prod of allProducts) {
            matchedVariant = prod.product_variants?.find(
              (v) => v.id === variantId
            );
            if (matchedVariant) {
              matchedProduct = prod;
              break;
            }
          }
          if (!matchedProduct) return null;

          // Get addon for this product (if exists at same index)
          const addonData = addons?.[index];
          const matchingAddons = addonData
            ? (() => {
                const addonProduct = allProducts.find((p) =>
                  p.addons?.some((a) => a.id === addonData.addonId)
                );
                const addon = addonProduct?.addons?.find(
                  (a) => a.id === addonData.addonId
                );
                const addonVariant = addon?.addon_variants?.find(
                  (v) => v.id === addonData.variantId
                );
                return addon && addonVariant
                  ? [
                      {
                        addonid: addon.id,
                        id: addonVariant.id,
                        title: addonVariant.title,
                        price: addonVariant.price,
                        image: addonVariant.image,
                        status: addonVariant.status,
                        vendorId: addonVariant.vendorId,
                        finalPrice:
                          addonData.finalPrice || addonVariant.price || 0,
                      },
                    ]
                  : [];
              })()
            : [];

          return {
            id: matchedVariant?.id || matchedProduct.id,
            category,
            subcategory,
            subcategory1,
            groupKey,
            finalPrice: finalPrice || matchedVariant?.price || 0,
            product_variant: {
              variant_id: matchedVariant?.id || matchedProduct.id,
              variant_title: matchedVariant?.title || matchedProduct.title,
              variant_details:
                matchedVariant?.details || matchedProduct.details,
              variant_image: matchedVariant?.image || matchedProduct.image,
              variant_price: matchedVariant?.price || matchedProduct.price,
              additional_images: JSON.parse(
                matchedVariant?.additional_images || "[]"
              ),
            },
            addons: matchingAddons,
          };
        })
        .filter(Boolean);
    } catch (error) {
      console.error("Error in fetchFilteredBOQProducts:", error);
      return [];
    }
  };

  const handleLoadBOQ = async (boqId) => {
    try {
      // Fetch BOQ data from Supabase
      const { data, error } = await supabase
        .from("boq_data_new")
        .select("*")
        .eq("id", boqId)
        .single();

      if (error) {
        console.error("Error fetching BOQ:", error);
        toast.error("Failed to load BOQ");
        return;
      }

      if (!data) {
        toast.error("BOQ not found");
        return;
      }
      console.log("loaded data", data);

      const formattedBOQProducts = await fetchFilteredBOQProducts(
        data.products,
        data.addons
      );

      // ✅ Update state with the final BOQ structure
      setSelectedData(formattedBOQProducts);
      setUserId(data.userId);
      setTotalArea(data?.total_area); //not there
      setSelectedPlan(data?.planType);
      setBOQTitle(data.boqTitle);
      setBoqTotal(data.boqTotalPrice);
      setBOQID(boqId);
      setIsDBPlan(true); // Set flag to indicate this is a DB plan
      toast.success(`Loaded BOQ: ${data.boqTitle}`);
      localStorage.removeItem("boqCompleted");
      console.log("boqTotal loaded", boqTotal);
    } catch (err) {
      console.error("Error loading BOQ:", err);
      toast.error("Error loading BOQ");
    }
  };

  const createDraftBOQ = async (title = "Draft BOQ") => {
    try {
      const payload = {
        userId: userId, // make sure userId is in scope
        boqTitle: title,
        isDraft: true,
        layoutId: currentLayoutID,
      };

      const { data, error } = await supabase
        .from("boq_data_new")
        .insert(payload)
        .select()
        .single();

      if (error) {
        console.error("Error inserting draft BOQ:", error);
        toast.error("Failed to create draft BOQ. Try again.");
        return null;
      }

      toast.success("New draft BOQ created successfully!");
      return data; // return the inserted row (with id, created_at, etc.)
    } catch (err) {
      console.error("Unexpected error creating draft BOQ:", err);
      toast.error("Unexpected error. Check console.");
      return null;
    }
  };

  const handleConfirm = async (nameOrId, boqMode) => {
    if (boqMode === "new") {
      const draft = await createDraftBOQ(nameOrId);
      if (!draft) return; // stop if creation failed

      setBOQTitle(draft.boqTitle);
      setBOQID(draft.id);
      setSelectedData([]);
      setProgress(0);
      setSelectedPlan(null);
      localStorage.removeItem("selectedData");
      sessionStorage.removeItem("selectedPlan");
    } else if (boqMode === "existing") {
      handleLoadBOQ(nameOrId); // If existing BOQ selected, pass ID
    }
    setShowNewBoqPopup(false);
  };

  return (
    <div>
      {selectedPlan && (
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
              backgroundColor: "#A9C2D3",
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
      )}
      <Navbar
        toggleProfile={toggleProfile}
        iconRef={iconRef}
        showBoqPrompt={showBoqPrompt}
        setShowBoqPrompt={setShowBoqPrompt}
        existingBoqs={existingBoqs}
        setExistingBoqs={setExistingBoqs}
        isProfileCard={isProfileCard}
        setIsProfileCard={setIsProfileCard}
        setIsDBPlan={setIsDBPlan}
      />
      {/* {showNewBoqPopup && !BOQTitle && (
        <NewBoq
          onConfirm={handleConfirm}
          onCancel={() => setShowNewBoqPopup(false)}
        />
      )} */}
      <div className="px-2 md:px-6 3xl:container">
        {!selectedPlan ? (
          <Plans
            onConfirm={handleConfirm}
            setShowNewBoqPopup={setShowNewBoqPopup}
            showNewBoqPopup={showNewBoqPopup}
            autoSelectPlanProducts={autoSelectPlanProducts}
          />
        ) : (
          <>
            {selectedPlan === "Custom" && questionPopup && (
              <QnaPopup
                onClose={() => setQuestionPopup(false)}
                onSubmit={handleQuestionSubmit}
              />
            )}
            {/* {!showProductView && ( */}
            <>
              <Categories
                setSelectedSubCategory={handleSelectedSubCategory}
                handleCategoryClick={handleCategoryClick}
                minimizedView={minimizedView}
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
                          // categoriesWithTwoLevelCheck={
                          //   categoriesWithTwoLevelCheck
                          // }
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
                    // setShowProductView={setShowProductView}
                    setSelectedProductView={handleSelectedProductView}
                    userResponses={userResponses}
                    showSelectArea={showSelectArea}
                    setShowSelectArea={setShowSelectArea}
                  />
                </div>
              )}
            </>
            {/* )} */}
          </>
        )}
      </div>
      <AnimatePresence>
        {isOpen && (
          <div ref={profileRef}>
            <ProfileCard
              layout={false}
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              iconRef={iconRef}
              selectedPlan={selectedPlan}
              // showBoqPrompt={showBoqPrompt}
              setShowBoqPrompt={setShowBoqPrompt}
              existingBoqs={existingBoqs}
              setIsProfileCard={setIsProfileCard}
              setIsDBPlan={setIsDBPlan}
              setShowNewBoqPopup={setShowNewBoqPopup}
            />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Boq;
