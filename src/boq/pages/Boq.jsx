import { useEffect, useState, useMemo } from "react";
import Navbar from "../../boq/components/Navbar";
import Categories from "./Categories";
import {
  fetchCategories,
  fetchProductsData,
  fetchWorkspaces,
  fetchRoomData,
  fetchCategoriesandSubCat1,
} from "../utils/dataFetchers";
import MainPage from "./MainPage";
import ProductCard from "../components/ProductCard";
import RecommendComp from "../components/RecommendComp";
import processData from "../utils/dataProcessor";
import ProductOverview from "../components/ProductOverview";
import QnaPopup from "../components/QnaPopup";
import { useApp } from "../../Context/Context";
import { calculateTotalPriceHelper } from "../utils/CalculateTotalPriceHelper";

function Boq() {
  const [selectedProductView, setSelectedProductView] = useState([]);
  const [productsData, setProductData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState([1000, 15000000]);

  const [workspaces, setWorkspaces] = useState([]);
  const [roomData, setRoomData] = useState({ quantityData: [], areasData: [] });
  const [areasData, setAreasData] = useState([]);
  const [quantityData, setQuantityData] = useState([]);

  const [minimizedView, setMinimizedView] = useState(false);
  const [showProductView, setShowProductView] = useState(false);
  const [showRecommend, setShowRecommend] = useState(false);
  const [questionPopup, setQuestionPopup] = useState(false);
  const [userResponses, setUserResponses] = useState({});

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
    setCategories,
    subCategories,
    setSubCategories,
    subCat1,
    setSubCat1,
    totalArea,
    setTotalArea,
    userId,
    setUserId,
    selectedAddons,
    setSelectedAddons,
    categoriesWithModal,
  } = useApp();

  useEffect(() => {
    var temp = JSON.parse(localStorage.getItem("selectedData"));
    setSelectedData(temp);
  }, []);

  useEffect(() => {
    setTotalArea(roomData.areasData[0]?.totalArea);
    setUserId(roomData.areasData[0]?.userId);
  }, [roomData]);

  useEffect(() => {
    if (selectedCategory) {
      // Find the category object matching the selected category ID
      const category = categories.find((cat) => cat.id === selectedCategory.id);

      // Update the subcategories state
      if (category) {
        setSubCategories(category.subcategories || []);
      }
    } else {
      setSubCategories([]); // Reset subcategories if no category is selected
    }
  }, [selectedCategory, categories]);

  useEffect(() => {
    const loadData = async () => {
      const [
        categoriesData,
        productsData,
        workspacesData,
        roomDataResult,
        subCategory1Data,
      ] = await Promise.all([
        fetchCategories(),
        fetchProductsData(),
        fetchWorkspaces(),
        fetchRoomData(),
        fetchCategoriesandSubCat1(),
      ]);

      setCategories(categoriesData); //remove 0 value qunatity from subCat

      setProductData(productsData);
      setWorkspaces(workspacesData);

      setRoomData(roomDataResult);

      var processedQuantityData, processedAreasData;
      if (
        roomDataResult.quantityData &&
        roomDataResult.quantityData.length > 0
      ) {
        processedQuantityData = processData(
          roomDataResult.quantityData,
          "quantity"
        );
        if (processedQuantityData) {
          setQuantityData([processedQuantityData]);
        }
      }

      if (roomDataResult.areasData && roomDataResult.areasData.length > 0) {
        processedAreasData = processData(roomDataResult.areasData, "areas");
        if (processedAreasData) {
          setAreasData([processedAreasData]);
        }
      }

      if (
        processedQuantityData.length !== 0 ||
        processedAreasData.length !== 0
      ) {
        categoriesData.forEach((category) => {
          category.subcategories = category.subcategories.filter(
            (subcategory) => {
              // Normalize the strings for comparison
              const normalize = (str) =>
                str.toLowerCase().replace(/[^a-z0-9]/g, "");
              const subcategoryKey = normalize(subcategory);

              // Skip filtering if the category is not "Furniture"
              const isFurniture = normalize(category.category) === "furniture";
              if (!isFurniture) {
                return true; // Keep the subcategory if it's not "Furniture"
              }

              // Get the room data from quantityData
              const roomCount = processedQuantityData;

              // Check for the "Meeting Room" and "Meeting Room Large" case specifically
              const meetingRoomLargeQuantity =
                roomCount["meetingroomlarge"] || 0;
              const meetingRoomQuantity = roomCount["meetingroom"] || 0;

              // Exclude "Meeting Room Large" if its own quantity is 0
              if (subcategoryKey === "meetingroomlarge") {
                if (meetingRoomLargeQuantity === 0) {
                  return false; // Exclude "Meeting Room Large" if it has quantity 0
                }
                return true; // Keep "Meeting Room Large" if it has a non-zero quantity
              }

              // Exclude "Meeting Room" if it has quantity 0, but only if "Meeting Room Large" is not visible
              if (
                subcategoryKey === "meetingroom" &&
                meetingRoomLargeQuantity === 0
              ) {
                if (meetingRoomQuantity === 0) {
                  return false; // Exclude "Meeting Room" if it has quantity 0
                }
                return true; // Keep "Meeting Room" if it has a non-zero quantity
              }

              // General logic: check the quantity of the subcategory or matching base room key
              const baseRoomKey = Object.keys(roomCount).find((roomKey) => {
                const normalizedRoomKey = normalize(roomKey);
                return (
                  subcategoryKey === normalizedRoomKey || // Exact match
                  subcategoryKey.includes(normalizedRoomKey) // Partial match
                );
              });

              // If no base room key is found, exclude this subcategory
              if (!baseRoomKey || roomCount[baseRoomKey] === 0) {
                return false;
              }

              // Include subcategory if the base room key has a non-zero quantity
              return true;
            }
          );
        });

        console.log("Updated Categories: ", categoriesData);

        setCategories(categoriesData);
        handleCategorySelection(categoriesData[0]);
        setSelectedSubCategory(categoriesData[0].subcategories[0] || null);
      }

      setSubCat1(subCategory1Data);
    };

    loadData();
  }, []);
  //   if (roomData.quantityData && roomData.quantityData.length > 0) {
  //     const processedQuantityData = processData(
  //       roomData.quantityData,
  //       "quantity"
  //     );
  //     if (processedQuantityData) {
  //       setQuantityData([processedQuantityData]);
  //     }
  //   }

  //   if (roomData.areasData && roomData.areasData.length > 0) {
  //     const processedAreasData = processData(roomData.areasData, "areas");
  //     if (processedAreasData) {
  //       setAreasData([processedAreasData]);
  //     }
  //   }
  // }, [roomData]);

  useEffect(() => {
    // Automatically select the first subcategory when the category changes
    if (subCat1 && selectedCategory?.category) {
      const subCategories = subCat1[selectedCategory.category];
      if (subCategories && subCategories.length > 0) {
        setSelectedSubCategory1(subCategories[0]); // Set the first subcategory as the default
      } else {
        setSelectedSubCategory1(null);
      }
    }
  }, [subCat1, selectedCategory]);

  useEffect(() => {
    setQuestionPopup(true);
  }, []);

  // Filter products based on search query, price range, and category
  const filteredProducts = useMemo(() => {
    // if (!selectedCategory) return false;
    return productsData.filter((product) => {
      if (!product.product_variants || product.product_variants.length === 0) {
        return false;
      }

      const matchesVariant = product.product_variants.some((variant) => {
        const matchesSearch =
          variant.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          variant.details?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesPrice =
          variant.price >= priceRange[0] && variant.price <= priceRange[1];

        return matchesSearch && matchesPrice;
      });

      const matchesCategory =
        selectedCategory?.category === "" ||
        product.category === selectedCategory?.category;
      return matchesVariant && matchesCategory;
    });
  }, [productsData, searchQuery, priceRange, selectedCategory]);

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

  const handleCategorySelection = (categoryData) => {
    setSelectedCategory(categoryData);
    console.log("Selected Category: ", categoryData.category);
  };

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

  const calculateTotalPrice = () => {
    const total = calculateTotalPriceHelper(
      quantityData[0],
      areasData[0],
      selectedCategory?.category,
      selectedSubCategory
    );
    return total * selectedProductView.price;
  };

  const handleAddOnChange = (variant) => {
    console.log("addon added");

    // Ensure the variant object has title, price, and image
    if (!variant || !variant.title || variant.price == null || !variant.image)
      return;

    setSelectedAddons((prevSelectedAddOns) => {
      // Check if the add-on is already selected
      const isAlreadySelected = prevSelectedAddOns[variant.title];

      if (isAlreadySelected) {
        // If already selected, remove the add-on
        const { [variant.title]: _, ...rest } = prevSelectedAddOns;
        return rest;
      } else {
        // If not selected, add the add-on
        return {
          ...prevSelectedAddOns,
          [variant.title]: {
            addon_title: variant.title || "No Title",
            addon_price: variant.price || "No Price",
            addon_image: variant.image || "No Image",
            addonId: variant.addonid || "No Id",
            variantID: variant.id || "No Id",
          },
        };
      }
    });
  };

  const handelSelectedData = (
    product,
    category,
    subCat,
    subcategory1,
    isChecked
  ) => {
    if (!product) return;

    // Unique group key for each product and subcategory
    const groupKey = `${category.category}-${subCat}-${subcategory1}-${product.id}`;

    const productData = {
      groupKey, // For group-level management
      id: product.id,
      category: category.category,
      subcategory: subCat,
      subcategory1, // added subcategory1 as an argument
      product_variant: {
        variant_title: product.title,
        variant_image: product.image,
        variant_details: product.details,
        variant_price: product.price,
        variant_id: product.id,
        additional_images: JSON.parse(product.additional_images || "[]"), // Parse the string to an array
      },
      addons: selectedAddons || [], // Assuming addons might be optional
      finalPrice: calculateTotalPrice(),
    };

    // Update selectedData
    setSelectedData((prevData) => {
      const validPrevData = Array.isArray(prevData) ? prevData : [];

      if (!isChecked) {
        // Remove the product when unchecked
        const updatedData = validPrevData.filter(
          (item) => !(item.groupKey === groupKey)
        );
        localStorage.setItem("selectedData", JSON.stringify(updatedData)); // Persist updated state
        return updatedData;
      }

      // Add or update the product when checked
      const existingProductIndex = validPrevData.findIndex(
        (item) => item.groupKey === groupKey
      );

      if (existingProductIndex !== -1) {
        // Replace the existing product
        const updatedData = [...validPrevData];
        updatedData[existingProductIndex] = productData; // Replace with new data
        localStorage.setItem("selectedData", JSON.stringify(updatedData));
        return updatedData;
      }

      // Add a new product if it doesn't already exist
      const updatedData = [...validPrevData, productData];
      localStorage.setItem("selectedData", JSON.stringify(updatedData));
      return updatedData;
    });

    // console.log(
    //   isChecked ? "Added to selected data" : "Removed from selected data",
    //   groupKey
    // );
  };

  const clearSelectedData = () => {
    // Clear from local storage
    localStorage.removeItem("selectedData");

    // Optionally, clear the state if applicable
    setSelectedData([]);

    console.log("Selected data cleared from local storage and state.");
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
    //  setCabinsQuestions(false);

    //  setExpandedSubcategory(expandedSubcategory);

    // Update the total cost or other BOQ data if needed
    //  updateBOQTotal();
  };

  const calculateGrandTotal = () => {
    // Ensure selectedData is an array before calling reduce
    let grandTotal = (Array.isArray(selectedData) ? selectedData : []).reduce(
      (total, product) => {
        return total + (product.finalPrice || 0); // Add the final price, defaulting to 0 if not present
      },
      0
    );

    // Add 150 * totalArea if flooring is bareShell
    if (userResponses.flooring === "bareShell") {
      grandTotal += 150 * totalArea;
    }

    return grandTotal;
  };

  console.log("selected products", selectedData);

  return (
    <div>
      <Navbar
        clearSelectedData={clearSelectedData}
        calculateGrandTotal={calculateGrandTotal}
      />
      {questionPopup && (
        <QnaPopup
          onClose={() => setQuestionPopup(false)}
          category={selectedCategory}
          onSubmit={handleQuestionSubmit}
        />
      )}
      {!showProductView && (
        <div className=" px-5">
          <Categories
            categories={categories}
            setSelectedCategory={handleCategorySelection}
            setSelectedSubCategory={handleSelectedSubCategory}
            minimizedView={minimizedView}
            handleCategoryClick={handleCategoryClick}
            userResponses={userResponses}
            quantityData={quantityData}
          />

          {minimizedView && (
            <div>
              <MainPage
                setSelectedSubCategory1={handleSelectedSubCategory1}
                userResponses={userResponses}
              />
              <ProductCard
                products={groupedProducts}
                selectedProductView={selectedProductView}
                setShowProductView={setShowProductView}
                setSelectedProductView={handleSelectedProductView}
                userResponses={userResponses}
              />
            </div>
          )}
        </div>
      )}
      {showProductView && (
        <div>
          <ProductOverview
            selectedProductView={selectedProductView}
            quantityData={quantityData}
            areasData={areasData}
            setShowProductView={setShowProductView}
            showRecommend={showRecommend}
            setShowRecommend={setShowRecommend}
            categories={categories}
            subCategories={subCategories}
            subCat1={subCat1}
            filteredProducts={filteredProducts}
            handleAddOnChange={handleAddOnChange}
            handelSelectedData={handelSelectedData}
            calculateTotalPrice={calculateTotalPrice}
          />
          {showRecommend && (
            <RecommendComp
              showRecommend={showRecommend}
              setShowRecommend={setShowRecommend}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default Boq;
