import { useEffect, useState, useMemo, useRef } from "react";
import Navbar from "../../boq/components/Navbar";
import Categories from "./Categories";
import {
  fetchCategories,
  fetchProductsData,
  // fetchWorkspaces,
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
import Joyride, { STATUS } from "react-joyride";
import { supabase } from "../../services/supabase";
import toast from "react-hot-toast";
import ProfileCard from "../components/ProfileCard";
import Plans from "../../common-components/Plans";
function Boq() {
  const [selectedProductView, setSelectedProductView] = useState([]);
  const [productsData, setProductData] = useState([]);
  // const [searchQuery, setSearchQuery] = useState("");
  // const [priceRange, setPriceRange] = useState([1, 15000000]);
  const searchQuery = "";
  const priceRange = [1, 15000000];

  const [isOpen, setIsOpen] = useState(false);

  const profileRef = useRef(null);

  const iconRef = useRef(null);

  // const [workspaces, setWorkspaces] = useState([]);
  const [roomData, setRoomData] = useState({ quantityData: [], areasData: [] });
  const [areasData, setAreasData] = useState([]);
  const [quantityData, setQuantityData] = useState([]);

  const [minimizedView, setMinimizedView] = useState(false);
  // const [minimizedView, setMinimizedView] = useState(true);
  const [showProductView, setShowProductView] = useState(false);
  const [showRecommend, setShowRecommend] = useState(false);
  const [questionPopup, setQuestionPopup] = useState(false);
  const [boqList, setBoqList] = useState([]);
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
    height,
    setHeight,
    userResponses,
    setUserResponses,
    showProfile,
    setShowProfile,
    selectedPlan,
    setDefaultProduct,
    defaultProduct,
  } = useApp();

  // useEffect(() => {
  //   // var temp = JSON.parse(localStorage.getItem("selectedData"));
  //   // setSelectedData(temp);
  // }, []);

  // useEffect(() => {
  //   setTotalArea(roomData.areasData[0]?.totalArea);
  //   // setUserId(roomData.areasData[0]?.userId);
  // }, [roomData]);

  useEffect(() => {
    if (userResponses.height) {
      setHeight(userResponses.height);
    }
  }, [userResponses]);

  useEffect(() => {
    if (selectedCategory) {
      // Find the category object matching the selected category ID
      const category = categories.find((cat) => cat.id === selectedCategory.id);

      // Update the subcategories state
      if (category) {
        setSubCategories(category.subcategories || []);
        console.log("filtered subcategories", category.subcategories);
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
        // workspacesData,
        roomDataResult,
        subCategory1Data,
      ] = await Promise.all([
        fetchCategories(),
        fetchProductsData(),
        // fetchWorkspaces(),
        fetchRoomData(userId),
        fetchCategoriesandSubCat1(),
      ]);

      setCategories(categoriesData); //remove 0 value qunatity from subCat

      setProductData(productsData);
      // setWorkspaces(workspacesData);

      setRoomData(roomDataResult);

      var processedQuantityData, processedAreasData;
      if (roomDataResult.layoutData && roomDataResult.layoutData.length > 0) {
        processedQuantityData = processData(
          roomDataResult.layoutData,
          "quantity"
        );
        if (processedQuantityData) {
          setQuantityData([processedQuantityData]);
        }

        processedAreasData = processData(
          roomDataResult.layoutData,
          "areas",
          roomDataResult.layoutData
        );
        if (processedAreasData) {
          setAreasData([processedAreasData]);
        }
      }

      // if (
      //   roomDataResult.areasData &&
      //   roomDataResult.areasData.length > 0 &&
      //   roomDataResult.quantityData &&
      //   roomDataResult.quantityData.length > 0
      // ) {
      //   processedAreasData = processData(
      //     roomDataResult.areasData,
      //     "areas",
      //     roomDataResult.quantityData
      //   );
      //   if (processedAreasData) {
      //     setAreasData([processedAreasData]);
      //   }
      // }

      if (
        processedQuantityData.length !== 0 ||
        processedAreasData.length !== 0
      ) {
        categoriesData.forEach((category) => {
          category.subcategories = category.subcategories.filter(
            (subcategory) => {
              // Normalize the strings for comparison
              const normalize = (str) =>
                str.toLowerCase().replace(/[^a-z0-9]/g, ""); //output of "Civil / Plumbing" => "civilplumbing"
              const subcategoryKey = normalize(subcategory);

              // Skip filtering if the category is not "Furniture"
              const ignoreCat =
                normalize(category.category) === "lux" ||
                normalize(category.category) === "civilplumbing" ||
                normalize(category.category) === "hvac";
              if (ignoreCat) {
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

    if (userId) {
      loadData();
    }
  }, [userId]);
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

  // useEffect(() => {
  //   setQuestionPopup(true);
  // }, []);

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
    if (!hasSeenTour) {
      setRunTour(true); // Start the tour automatically on first visit
    } else {
      setQuestionPopup(true);
    }
  }, []);

  useEffect(() => {
    if (defaultProduct && selectedPlan && productsData.length > 0) {
      // autoSelectPlanProducts(productsData, subCategories);
      autoSelectPlanProducts(productsData, categories);
      setDefaultProduct(false);
    }
  }, [selectedPlan, productsData, defaultProduct]);
  // useEffect(() => {
  //   try {
  //     if (defaultProduct && selectedPlan && productsData.length > 0) {
  //       autoSelectPlanProducts(productsData, subCategories);
  //     }
  //   } finally {
  //     setDefaultProduct(false);
  //   }
  // }, [selectedPlan, productsData, defaultProduct]);

  // Only run the tour for first-time visitors
  //   useEffect(() => {
  //     const hasSeenTour = localStorage.getItem("hasSeenLayoutTour");
  //     if (hasSeenTour) {
  //       setRunTour(false); // Don't run the tour if already completed
  //     }
  //   }, []);

  // Toggle profile card visibility
  const toggleProfile = () => {
    setIsOpen(!isOpen);
  };

  // Close profile card when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // If clicked inside ProfileCard or on the Profile Icon, do nothing
      if (profileRef.current && profileRef.current.contains(event.target)) {
        return;
      }

      if (iconRef.current && iconRef.current.contains(event.target)) {
        return;
      }

      // Otherwise, close the profile card
      setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

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
      selectedSubCategory,
      selectedSubCategory1,
      height
    );
    //Currently rate of product is hardcoded inside HVACCalculation.jsx file.
    if (selectedCategory?.category === "HVAC") {
      return total;
    }
    if (selectedCategory?.category === "Lighting") {
      return total * 200 + selectedProductView.price;
    }
    if (selectedCategory?.category === "Civil / Plumbing") {
      return total * 100 + selectedProductView.price;
    }
    if (selectedCategory?.category === "Paint") {
      return total * selectedProductView.price * 3 * 15;
    }
    return total * selectedProductView.price;
  };

  const calculateAutoTotalPrice = (variantPrice) => {
    const baseTotal = calculateTotalPriceHelper(
      quantityData[0],
      areasData[0],
      selectedCategory?.category,
      selectedSubCategory,
      selectedSubCategory1,
      height
    );

    if (selectedCategory?.category === "HVAC") return baseTotal;
    if (selectedCategory?.category === "Lighting")
      return baseTotal * 200 + variantPrice;
    if (selectedCategory?.category === "Civil / Plumbing")
      return baseTotal * 100 + variantPrice;
    if (selectedCategory?.category === "Paint")
      return baseTotal * variantPrice * 3 * 15;

    return baseTotal * variantPrice;
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

  // const handelSelectedData = (
  //   product,
  //   category,
  //   subCat,
  //   subcategory1,
  //   isChecked
  // ) => {
  //   if (!product) return;

  //   // Unique group key for each product and subcategory
  //   const groupKey = `${category.category}-${subCat}-${subcategory1}-${product.id}`;

  //   const productData = {
  //     groupKey, // For group-level management
  //     id: product.id,
  //     category: category.category,
  //     subcategory: subCat,
  //     subcategory1, // added subcategory1 as an argument
  //     product_variant: {
  //       variant_title: product.title,
  //       variant_image: product.image,
  //       variant_details: product.details,
  //       variant_price: product.price,
  //       variant_id: product.id,
  //       additional_images: JSON.parse(product.additional_images || "[]"), // Parse the string to an array
  //     },
  //     addons: selectedAddons || [], // Assuming addons might be optional
  //     finalPrice: calculateTotalPrice(),
  //   };

  //   // Update selectedData
  //   setSelectedData((prevData) => {
  //     const validPrevData = Array.isArray(prevData) ? prevData : [];

  //     if (!isChecked) {
  //       // Remove the product when unchecked
  //       const updatedData = validPrevData.filter(
  //         (item) => !(item.groupKey === groupKey)
  //       );
  //       localStorage.setItem("selectedData", JSON.stringify(updatedData)); // Persist updated state
  //       console.log("Updated DataL ", updatedData);
  //       return updatedData;
  //     }

  //     // Add or update the product when checked
  //     const existingProductIndex = validPrevData.findIndex(
  //       (item) => item.groupKey === groupKey
  //     );

  //     if (existingProductIndex !== -1) {
  //       // Replace the existing product
  //       const updatedData = [...validPrevData];
  //       updatedData[existingProductIndex] = productData; // Replace with new data
  //       localStorage.setItem("selectedData", JSON.stringify(updatedData));
  //       return updatedData;
  //     }

  //     // Add a new product if it doesn't already exist
  //     const updatedData = [...validPrevData, productData];
  //     localStorage.setItem("selectedData", JSON.stringify(updatedData));
  //     return updatedData;
  //   });

  //   console.log(
  //     isChecked ? "Added to selected data" : "Removed from selected data",
  //     groupKey
  //   );
  // };

  const handelSelectedData = (
    product,
    category,
    subCat,
    subcategory1,
    isChecked
  ) => {
    if (!product) return;

    const groupKey = `${category.category}-${subCat}-${subcategory1}-${product.id}`;

    setSelectedData((prevData) => {
      const validPrevData = Array.isArray(prevData) ? prevData : [];

      if (!isChecked) {
        // ❌ Remove the product when unchecked
        const updatedData = validPrevData.filter(
          (item) => item.groupKey !== groupKey
        );
        localStorage.setItem("selectedData", JSON.stringify(updatedData));
        return updatedData;
      }

      // 🔍 Check if the product already exists
      const existingProduct = validPrevData.find(
        (item) => item.groupKey === groupKey
      );

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
        },
        // 🔥 Preserve existing addons if the product exists
        addons: existingProduct ? existingProduct.addons : selectedAddons || [],
        finalPrice: calculateTotalPrice(),
      };

      if (existingProduct) {
        // 🛠 Replace the existing product while keeping the previous addons
        const updatedData = validPrevData.map((item) =>
          item.groupKey === groupKey ? productData : item
        );
        localStorage.setItem("selectedData", JSON.stringify(updatedData));
        return updatedData;
      }

      // ➕ Add a new product if it doesn't exist
      const updatedData = [...validPrevData, productData];
      localStorage.setItem("selectedData", JSON.stringify(updatedData));
      return updatedData;
    });

    // console.log(
    //   isChecked ? "Added to selected data" : "Removed from selected data",
    //   groupKey
    // );
  };

  const autoSelectPlanProducts = (products, categories) => {
    console.log("All Products:", products);
    console.log("Selected categories:", categories);

    if (!selectedPlan || !products.length || !categories.length) return;

    const selectedProducts = [];
    const selectedGroups = new Set(); // To track selected subcategory1 for each category-subcategory combination
    const productMap = new Map();

    categories.forEach((cat) => {
      products.forEach((product) => {
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
            addons: product.addons || [],
            finalPrice: calculateAutoTotalPrice(variant.price),
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

  // const autoSelectPlanProducts = (products, categories) => {

  //   console.log("All Products:", products);
  //   console.log("Selected Subcategories:", subCategories);

  //   if (!selectedPlan || !products.length || !subCategories.length) return;

  //   const selectedProducts = [];
  //   const selectedGroups = new Set(); // To track selected subcategory1 for each category-subcategory combination
  //   const productMap = new Map();

  //   categories.forEach((category)=>{

  //   })

  //   products.forEach((product) => {
  //     const { category, subcategory, subcategory1, product_variants } = product;

  //     if (
  //       !category ||
  //       !subcategory ||
  //       !subcategory1 ||
  //       !product_variants?.length
  //     )
  //       return;

  //     // Split subcategories if they contain multiple comma-separated values
  //     const subcategories = subcategory.split(",").map((sub) => sub.trim());

  //     subcategories.forEach((subCat) => {
  //       // Ensure the subcategory is in the selected subcategories list
  //       if (!subCategories.includes(subCat)) return;

  //       // const groupKey = `${category}-${subCat}-${subcategory1}`;
  //       // const groupKey = `${category}-${subCat}-${subcategory1}-${product.id}`;

  //       // Find the variant that matches the selected plan AND has `default` set to true
  //       const matchingVariant = product_variants.find(
  //         (variant) =>
  //           variant.segment?.toLowerCase() === selectedPlan?.toLowerCase() &&
  //           variant.default === variant.segment // Ensure it is marked as default
  //       );

  //       console.log("matching variant", matchingVariant);

  //       if (matchingVariant) {
  //         // const groupKey = `${category}-${subCat}-${subcategory1}-${product.id}`;
  //         const groupKey = `${category}-${subCat}-${subcategory1}-${matchingVariant.id}`;

  //         productMap.set(groupKey, {
  //           product,
  //           variant: matchingVariant,
  //           subcategory: subCat,
  //         });
  //       }
  //     });
  //   });

  //   // Process selected products (one per `subcategory1` for each subcategory)
  //   productMap.forEach(({ product, variant, subcategory }, groupKey) => {
  //     if (!selectedGroups.has(groupKey)) {
  //       const { category, subcategory1 } = product;

  //       const productData = {
  //         groupKey,
  //         id: variant.id,
  //         category,
  //         subcategory, // Individual subcategory
  //         subcategory1,
  //         product_variant: {
  //           variant_title: variant.title || product.title || "No Title",
  //           variant_image: variant.image || null,
  //           variant_details: variant.details || "No Details",
  //           variant_price: variant.price || 0,
  //           variant_id: variant.id,
  //           variant_segment: variant.segment,
  //           default: variant.default,
  //           additional_images: JSON.parse(variant.additional_images || "[]"),
  //         },
  //         addons: product.addons || [],
  //         finalPrice: variant.price || 0,
  //       };

  //       selectedProducts.push(productData);
  //       // setSelectedData((prev) => [...prev, productData]);
  //       selectedGroups.add(groupKey);
  //     }
  //   });

  //   setSelectedData(selectedProducts);

  //   // // Update `selectedData`
  //   // setSelectedData((prevData) => {
  //   //   const validPrevData = Array.isArray(prevData) ? prevData : [];

  //   //   console.log("hello from the selected data ");

  //   //   // Remove old selections of the same `subcategory1`
  //   //   const updatedData = validPrevData.filter(
  //   //     (item) =>
  //   //       !selectedProducts.some(
  //   //         (newItem) => newItem.groupKey === item.groupKey
  //   //       )
  //   //   );

  //   //   // const finalData = [...updatedData, ...selectedProducts];
  //   //   const finalData = [...selectedProducts];

  //   //   localStorage.setItem("selectedData", JSON.stringify(finalData));
  //   //   return finalData;
  //   // });

  //   console.log("Auto-selected products based on plan:", selectedProducts);
  // };

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
    //  setCabinsQuestions(false);
    // setRunTour(true);

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

    console.log("from grandtotal", grandTotal);
    console.log("from grandtotal area", totalArea);

    return grandTotal;
  };

  const insertDataIntoSupabase = async (
    selectedData,
    userId,
    boqTitle,
    totalArea
  ) => {
    try {
      // Check how many BOQs the user has already saved
      const { data: existingBOQs, error: fetchError } = await supabase
        .from("boqdata")
        .select("id", { count: "exact" })
        .eq("userId", userId);

      if (fetchError) {
        console.error("Error fetching user BOQ count:", fetchError);
        return;
      }

      if (existingBOQs.length >= 3) {
        console.warn("User has reached the BOQ limit.");
        toast.error("You can only save up to 3 BOQs.");
        return;
      }

      // Ask for BOQ title only if the user has room for more BOQs
      if (!boqTitle) {
        boqTitle = window.prompt("Enter a name for your BOQ:");
        if (!boqTitle) {
          toast.error("BOQ name cannot be empty.");
          return;
        }
      }

      // Prepare formatted data
      const formattedData = {
        product_id: selectedData.map((item) => item.id).join(","),
        product_variant_id: selectedData
          .map((item) => item.product_variant?.variant_id || "")
          .join(","),
        addon_id: selectedData
          .flatMap((item) =>
            item.addons
              ? Object.values(item.addons).map((addon) => addon.addonId)
              : []
          )
          .join(","),
        addon_variant_id: selectedData
          .flatMap((item) =>
            item.addons
              ? Object.values(item.addons).map((addon) => addon.variantID)
              : []
          )
          .join(","),
        group_key: selectedData
          .map((item) => item.groupKey || "")
          .filter(Boolean) // Removes empty strings
          .join(","), // Store multiple group keys as comma-separated values
        userId: userId,
        title: boqTitle, // Save the entered BOQ name
        total_area: totalArea,
        final_price: selectedData
          .map((item) => item.finalPrice || "")
          .filter(Boolean) // Removes empty strings
          .join(","), // Store multiple group keys as comma-separated values
      };

      // Insert into Supabase
      const { data, error } = await supabase
        .from("boqdata")
        .insert([formattedData]);

      if (error) {
        console.error("Error inserting data into Supabase:", error);
      } else {
        console.log("Data inserted successfully:", data);
        toast.success("BOQ saved successfully!");
      }
    } catch (error) {
      console.error("Error during insertion:", error);
    }
  };

  const handleSave = () => {
    if (selectedData && selectedData.length > 0) {
      insertDataIntoSupabase(
        selectedData,
        userId,
        "", // Initially empty; will be set later
        totalArea
      );
    } else {
      console.warn("No selected data to save.");
      toast.error("No selected data to save.");
    }
  };

  const fetchSavedBOQs = async () => {
    try {
      const { data, error } = await supabase
        .from("boqdata")
        .select("id, created_at, title") // Fetch BOQs for the user
        .eq("userId", userId)
        .order("created_at", { ascending: false }); // Sort by latest first

      if (error) {
        console.error("Error fetching BOQs:", error);
        return;
      }

      setBoqList(data); // Update state with fetched BOQs
    } catch (err) {
      console.error("Error fetching BOQs:", err);
    }
  };

  // Function to load a BOQ (replace with actual logic)
  const handleLoadBOQ = async (boqId) => {
    try {
      // Fetch BOQ data from Supabase
      const { data, error } = await supabase
        .from("boqdata")
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

      // Convert stored comma-separated IDs into arrays
      const productVariantIds = data.product_variant_id
        ? data.product_variant_id.split(",").map((id) => id.trim())
        : [];

      const addonIds = data.addon_id
        ? data.addon_id.split(",").map((id) => id.trim())
        : [];

      const groupKeys = data.group_key
        ? data.group_key.split(",").map((key) => key.trim())
        : [];

      const finalPrices = data.final_price
        ? data.final_price
            .split(",")
            .map((price) => parseFloat(price.trim()) || 0)
        : [];

      // ✅ Reconstruct products based on `groupKey`
      const reconstructedData = groupKeys.map((groupKey, index) => {
        const [category, subcategory, subcategory1, productId] =
          groupKey.split("-");

        return {
          id: productId,
          category,
          subcategory,
          subcategory1,
          product_variant: {
            variant_id: productVariantIds[index] || productId,
          },
          addons: addonIds.length > index ? [{ addonId: addonIds[index] }] : [],
          groupKey,
          finalPrice: finalPrices[index] || 0, // Assign the corresponding final price
        };
      });

      console.log("Reconstructed BOQ Data:", reconstructedData);

      // Fetch and transform BOQ-related products
      const formattedBOQProducts = await fetchFilteredBOQProducts(
        reconstructedData
      );

      // ✅ Update state with the final BOQ structure
      setSelectedData(formattedBOQProducts);
      setUserId(data.userId);
      setTotalArea(data.total_area);

      toast.success(`Loaded BOQ: ${data.title}`);
    } catch (err) {
      console.error("Error loading BOQ:", err);
      toast.error("Error loading BOQ");
    }
  };

  const fetchFilteredBOQProducts = async (reconstructedData) => {
    try {
      if (!Array.isArray(reconstructedData) || reconstructedData.length === 0) {
        console.warn(
          "fetchFilteredBOQProducts received invalid data:",
          reconstructedData
        );
        return [];
      }

      // Fetch all products from the database
      const allProducts = await fetchProductsData();

      if (!Array.isArray(allProducts) || allProducts.length === 0) {
        console.warn("No products found in the database.");
        return [];
      }

      // Extract saved product and addon variant IDs
      const savedProductVariantIds = reconstructedData
        .map((dataItem) => dataItem.product_variant?.variant_id)
        .filter(Boolean);
      const savedAddonVariantIds = reconstructedData
        .flatMap((dataItem) =>
          Object.values(dataItem.addons || {}).map((addon) => addon.addonId)
        )
        .filter(Boolean);

      // Filter products matching BOQ data
      const filteredBOQProducts = reconstructedData
        .map((boqItem) => {
          const matchingProduct = allProducts.find((product) =>
            product.product_variants.some(
              (variant) => variant.id === boqItem.product_variant.variant_id
            )
          );

          if (!matchingProduct) return null;

          const matchingVariant = matchingProduct.product_variants.find(
            (variant) => variant.id === boqItem.product_variant.variant_id
          );

          return {
            id: matchingVariant?.id || matchingProduct.id,
            category: boqItem.category,
            subcategory: boqItem.subcategory,
            subcategory1: boqItem.subcategory1,
            product_variant: {
              variant_id: matchingVariant?.id || matchingProduct.id,
              variant_title: matchingVariant?.title || matchingProduct.title,
              variant_details:
                matchingVariant?.details || matchingProduct.details,
              variant_image: matchingVariant?.image || matchingProduct.image,
              variant_price: matchingVariant?.price || matchingProduct.price,
              additional_images: JSON.parse(matchingVariant?.additional_images),
              // ? tryParseJSON(matchingVariant.additional_images)
              // : [],
            },
            addons: boqItem.addons,
            groupKey: boqItem.groupKey,
            finalPrice: boqItem.finalPrice || matchingVariant?.price || 0, // Ensure finalPrice is carried over
          };
        })
        .filter(Boolean);

      console.log("Formatted BOQ Products:", filteredBOQProducts);
      return filteredBOQProducts;
    } catch (error) {
      console.error("Error fetching and filtering BOQ products:", error);
      return [];
    }
  };

  // const groupedBOQProducts = useMemo(() => {
  //   const grouped = {};
  //   filteredBOQProducts.forEach((product) => {
  //     const subcategories = product.subcategory
  //       .split(",")
  //       .map((sub) => sub.trim());

  //     subcategories.forEach((subcategory) => {
  //       if (!grouped[product.category]) {
  //         grouped[product.category] = {};
  //       }
  //       if (!grouped[product.category][subcategory]) {
  //         grouped[product.category][subcategory] = [];
  //       }
  //       grouped[product.category][subcategory].push(product);
  //     });
  //   });
  //   return grouped;
  // }, [filteredBOQProducts]);

  // const fetchBOQData = async (reconstructedData) => {
  //   try {
  //     // Loop through each entry in reconstructedData
  //     const updatedData = await Promise.all(
  //       reconstructedData.map(async (dataItem) => {
  //         const { product_variant, addons } = dataItem;

  //         // Fetch full product variant data from product_variants table using product_variant.variant_id
  //         const { data: productVariantData, error: productVariantError } =
  //           await supabase
  //             .from("product_variants")
  //             .select("*") // Select all columns to get the full details
  //             .eq("id", product_variant.variant_id);

  //         if (productVariantError) {
  //           console.error(
  //             "Error fetching product variant:",
  //             productVariantError
  //           );
  //           return null;
  //         }

  //         // Check if product variant data is returned, and update with full variant data
  //         const fullProductVariant = productVariantData?.[0] || null;

  //         // Fetch addon data from addon_variants table using addon_id and variant_id
  //         const addonData = await Promise.all(
  //           Object.keys(addons).map(async (addonKey) => {
  //             const addon = addons[addonKey];

  //             if (addon.addonId) {
  //               const { data: addonVariantData, error: addonVariantError } =
  //                 await supabase
  //                   .from("addon_variants")
  //                   .select("*")
  //                   .eq("id", addon.addonId);

  //               if (addonVariantError) {
  //                 console.error(
  //                   `Error fetching addon variant for addonId ${addon.addonId}:`,
  //                   addonVariantError
  //                 );
  //                 return null;
  //               }

  //               return addonVariantData?.[0] || null;
  //             }
  //           })
  //         );

  //         // Return updated data with full product_variant and addon data
  //         return {
  //           ...dataItem,
  //           product_variant: fullProductVariant, // Use the full product variant data
  //           addons: addonData.filter(Boolean), // Remove null values from errors
  //         };
  //       })
  //     );

  //     // Filter out any null results
  //     const filteredData = updatedData.filter(Boolean);

  //     console.log("Fetched BOQ Data:", filteredData);

  //     // Call fetchAndFilterBOQData to filter the product dataset based on saved BOQ
  //     const finalFilteredProducts = await fetchAndFilterBOQData(filteredData);

  //     return finalFilteredProducts;
  //   } catch (error) {
  //     console.error("Error fetching BOQ data:", error);
  //   }
  // };

  // const fetchAndFilterBOQData = async (filteredData) => {
  //   try {
  //     // Fetch all products from the database
  //     const allProducts = await fetchProductsData();

  //     // Extract saved product and addon variant IDs from filteredData
  //     const savedProductVariantIds = filteredData.map(
  //       (dataItem) => dataItem.product_variant?.id
  //     );

  //     const savedAddonVariantIds = filteredData.flatMap((dataItem) =>
  //       dataItem.addons.map((addon) => addon.id)
  //     );

  //     // Filter products to include only those that match the saved BOQ data
  //     const filteredProducts = allProducts.filter((product) =>
  //       product.product_variants.some((variant) =>
  //         savedProductVariantIds.includes(variant.id)
  //       )
  //     );

  //     // Ensure that each filtered product contains only the relevant variants and addons
  //     const finalFilteredProducts = filteredProducts.map((product) => ({
  //       ...product,
  //       product_variants: product.product_variants.filter((variant) =>
  //         savedProductVariantIds.includes(variant.id)
  //       ),
  //       addons: product.addons
  //         ? product.addons.filter((addon) =>
  //             savedAddonVariantIds.includes(addon.id)
  //           )
  //         : [],
  //     }));

  //     console.log("Final Filtered BOQ Products:", finalFilteredProducts);
  //     return finalFilteredProducts;
  //   } catch (error) {
  //     console.error("Error fetching and filtering BOQ data:", error);
  //   }
  // };

  // Function to delete a BOQ

  const handleDeleteBOQ = async (boqId) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this BOQ?"
    );

    if (!isConfirmed) return; // If user cancels, stop execution

    try {
      const { error } = await supabase.from("boqdata").delete().eq("id", boqId);

      if (error) {
        console.error("Error deleting BOQ:", error);
        toast.error("Failed to delete BOQ");
        return;
      }

      toast.success("BOQ deleted successfully!");
      fetchSavedBOQs(); // Refresh the list after deletion
    } catch (err) {
      console.error("Error deleting BOQ:", err);
    }
  };

  console.log("selected products", selectedData);
  console.log("selected plan", selectedPlan);

  return (
    <div>
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
      <Navbar
        clearSelectedData={clearSelectedData}
        calculateGrandTotal={calculateGrandTotal}
        handleSave={handleSave}
        fetchSavedBOQs={fetchSavedBOQs}
        boqList={boqList}
        setBoqList={setBoqList}
        handleLoadBOQ={handleLoadBOQ}
        handleDeleteBOQ={handleDeleteBOQ}
        toggleProfile={toggleProfile}
        iconRef={iconRef}
      />
      {/* {questionPopup && (
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
                productsData={productsData}
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
      )} */}
      <div className="px-5">
        {!selectedPlan ? (
          <Plans />
        ) : (
          <>
            {questionPopup && (
              <QnaPopup
                onClose={() => setQuestionPopup(false)}
                category={selectedCategory}
                onSubmit={handleQuestionSubmit}
              />
            )}

            {!showProductView && (
              <>
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
                      productsData={productsData}
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
              </>
            )}
          </>
        )}
      </div>

      {showProductView && (
        <div>
          <ProductOverview
            selectedProductView={selectedProductView}
            quantityData={quantityData}
            areasData={areasData}
            showProductView={showProductView}
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
      {/* {showProfile && <ProfileCard />} */}
      {isOpen && (
        <div ref={profileRef}>
          <ProfileCard />
        </div>
      )}
    </div>
  );
}

export default Boq;
