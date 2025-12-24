import { useEffect, useState, useRef, useMemo } from "react";
import { ToastContainer } from "react-toastify";
import Navbar from "../../boq/components/Navbar";
import Categories from "./Categories";
import QnaPopup from "../components/QnaPopup";
import Joyride, { STATUS } from "react-joyride";
import ProfileCard from "../components/ProfileCard";
import Plans from "../../common-components/Plans";
import SelectArea from "../components/SelectArea";
import MainPage from "./MainPage";
import ProductCard from "../components/ProductCard";
import { motion, AnimatePresence } from "framer-motion";
import { selectAreaAnimation } from "../constants/animations";
import { useLocation } from "react-router-dom";
import { categoriesWithModal, priceRange } from "../../constants/constant";
import { useBoqApp } from "../../Context/BoqContext";
import Spinner from "../../common-components/Spinner";

const tourSteps = [
  {
    target: ".cat", // CSS class in the Navbar component
    content: "These are the category",

    disableBeacon: true,
    disableOverlayClose: true,
    placement: "top",
  },
  {
    target: ".subcat", // Add className in OpenWorkspaces component
    content: "There are all the subcategory of the selected category.",
    disableBeacon: true,
    placement: "top",
  },
  {
    target: ".viewB", // Add className in Spacebar component
    content: "You can view your boq here",
    disableBeacon: true,
    // placement: "top",
  },
  {
    target: ".downloadB", // Add className in Spacebar component
    content: "Click here to download boq in pdf format",
    disableBeacon: true,
    // placement: "top",
  },
];

function Boq() {
  const location = useLocation();
  const [showBackground, setShowBackground] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const profileRef = useRef(null);
  const iconRef = useRef(null);

  const [showNewBoqPopup, setShowNewBoqPopup] = useState(true);
  const [showSelectArea, setShowSelectArea] = useState(false);
  const [selectedAreas, setSelectedAreas] = useState([]);

  const [questionPopup, setQuestionPopup] = useState(false);
  const [showBoqPrompt, setShowBoqPrompt] = useState(false);
  const [existingBoqs, setExistingBoqs] = useState([]);
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
    userResponses,
    setUserResponses,
    selectedPlan,
    productData,
    selectedProductView,
    setSelectedProductView,
    searchQuery,
    loading,
  } = useBoqApp();

  const [runTour, setRunTour] = useState(false);

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
    if (!selectedPlan) return;
    const hasSeenTour = localStorage.getItem("hasSeenBOQTour") === "true";
    const hasSeenPopup =
      localStorage.getItem("hasSeenQuestionPopup") === "true";

    if (!hasSeenTour) {
      setRunTour(true);
    } else if (!hasSeenPopup) {
      setQuestionPopup(true);
      localStorage.setItem("hasSeenQuestionPopup", "true");
    }
  }, [selectedPlan]);

  const toggleProfile = () => {
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileRef.current?.contains(event.target) ||
        iconRef.current?.contains(event.target)
      ) {
        return;
      }
      setIsOpen(false);
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

  const handleCategoryClick = (id, category, subcategories) => {
    setSelectedCategory({ id, category, subcategories });
    if (minimizedView) {
      setSelectedSubCategory(subcategories[0] || null);
      if (category === "HVAC" && selectedPlan !== "Custom") {
        setSelectedSubCategory(userResponses.hvacType);
      }
    }
    if (categoriesWithModal.includes(category)) {
      setQuestionPopup(true);
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

    setQuestionPopup(false);

    if (
      selectedCategory.category === "HVAC" &&
      answers.hvacType === "Centralized"
    ) {
      setSelectedSubCategory(answers.hvacType || null);
    }
  };

  const filteredProducts = useMemo(() => {
    return productData?.filter((product) => {
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
  }, [productData, searchQuery, selectedCategory]);

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

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white">
        <Spinner />
      </div>
    );
  }

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
              primaryColor: "#6366f1",
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
      />
      <div className="px-2 md:px-6 3xl:px-40">
        {!selectedPlan ? (
          <Plans
            setShowNewBoqPopup={setShowNewBoqPopup}
            showNewBoqPopup={showNewBoqPopup}
          />
        ) : (
          <>
            {selectedPlan === "Custom" && questionPopup && (
              <QnaPopup
                onClose={() => setQuestionPopup(false)}
                onSubmit={handleQuestionSubmit}
              />
            )}
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
                          setShowBackground(true);
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
                />
                <ProductCard
                  products={groupedProducts}
                  selectedProductView={selectedProductView}
                  setSelectedProductView={handleSelectedProductView}
                  userResponses={userResponses}
                  showSelectArea={showSelectArea}
                  setShowSelectArea={setShowSelectArea}
                />
              </div>
            )}
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
              setShowBoqPrompt={setShowBoqPrompt}
              existingBoqs={existingBoqs}
              setIsProfileCard={setIsProfileCard}
              setShowNewBoqPopup={setShowNewBoqPopup}
            />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Boq;
