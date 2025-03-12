import { useEffect, useState, useRef } from "react";
import { ToastContainer } from "react-toastify";
import Navbar from "../../boq/components/Navbar";
import Categories from "./Categories";
import { fetchProductsData } from "../utils/dataFetchers";
import RecommendComp from "../components/RecommendComp";
import ProductOverview from "../components/ProductOverview";
import QnaPopup from "../components/QnaPopup";
import { useApp } from "../../Context/Context";
import { calculateAutoTotalPriceHelper } from "../utils/CalculateTotalPriceHelper";
import Joyride, { STATUS } from "react-joyride";
import { supabase } from "../../services/supabase";
import toast from "react-hot-toast";
import ProfileCard from "../components/ProfileCard";
import Plans from "../../common-components/Plans";
import BoqPrompt from "../components/BoqPrompt"; // Import the BOQ modal
import SelectArea from "../components/SelectArea";
import MainPage from "./MainPage";
import ProductCard from "../components/ProductCard";
import { useNavigate } from "react-router-dom";

function Boq() {
  const navigate = useNavigate();

  const [showBoqPrompt, setShowBoqPrompt] = useState(false);
  const [boqTitle, setBoqTitle] = useState("");
  const [existingBoqs, setExistingBoqs] = useState([]); // Stores fetched BOQs

  const [isOpen, setIsOpen] = useState(false);
  const profileRef = useRef(null);
  const iconRef = useRef(null);

  const [showSelectArea, setShowSelectArea] = useState(false);
  const [selectedAreas, setSelectedAreas] = useState([]);

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
    userResponses,
    setUserResponses,
    showProfile,
    setShowProfile,
    selectedPlan,
    setDefaultProduct,
    defaultProduct,
    categoriesWithTwoLevelCheck,
    productData,
    areasData,
    quantityData,
    handleCategorySelection,
    selectedProductView,
    setSelectedProductView,
    filteredProducts,
    groupedProducts,
    allAddons,
    minimizedView,
    setMinimizedView,
    showProductView,
    setShowProductView,
    showRecommend,
    setShowRecommend,
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
    if (!hasSeenTour) {
      setRunTour(true); // Start the tour automatically on first visit
    } else {
      setQuestionPopup(true);
    }
  }, []);

  useEffect(() => {
    if (defaultProduct && selectedPlan && productData.length > 0) {
      // autoSelectPlanProducts(productData, subCategories);
      autoSelectPlanProducts(productData, categories);
      setDefaultProduct(false);
    }
  }, [selectedPlan, productData, defaultProduct]);

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
    navigate(`/product/${variant.id}`); //new ProductOverview
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
    else if (cat === "Civil / Plumbing") total = baseTotal * 100 + variantPrice;
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

  const calculateGrandTotal = () => {
    // Ensure selectedData is an array before calling reduce
    let grandTotal = (Array.isArray(selectedData) ? selectedData : []).reduce(
      (total, product) => {
        // Sum the product's final price
        let productTotal = product.finalPrice || 0;

        // Sum all the addons' final prices
        let addonsTotal = (product.addons || []).reduce(
          (addonSum, addon) => addonSum + (addon.finalPrice || 0),
          0
        );

        return total + productTotal + addonsTotal;
      },
      0
    );

    // Add 150 * totalArea if flooring is bareShell
    if (userResponses.flooring === "bareShell") {
      grandTotal += 150 * totalArea;
    }

    // console.log("from grandtotal", grandTotal);
    // console.log("from grandtotal area", totalArea);

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
              ? Object.values(item.addons).map((addon) => addon.addonid)
              : []
          )
          .join(","),
        addon_variant_id: selectedData
          .flatMap((item) =>
            item.addons
              ? Object.values(item.addons).map((addon) => addon.id)
              : []
          )
          .join(","),
        addon_final_price: selectedData
          .flatMap((item) =>
            item.addons
              ? Object.values(item.addons).map(
                  (addon) => addon.finalPrice || ""
                )
              : []
          )
          .filter(Boolean) // Removes empty strings
          .join(","), // Store multiple addon final prices as comma-separated values
        group_key: selectedData
          .map((item) => item.groupKey || "")
          .filter(Boolean) // Removes empty strings
          .join(","), // Store multiple group keys as comma-separated values
        userId: userId,
        title: boqTitle, // Save the entered BOQ name
        total_area: totalArea,
        height: userResponses.height,
        flooring: userResponses.flooring,
        demolishTile: userResponses.demolishTile,
        hvacType: userResponses.hvacType,
        planType: selectedPlan,
        final_price: selectedData
          .map((item) => item.finalPrice || "")
          .filter(Boolean) // Removes empty strings
          .join(","), // Store multiple product final prices as comma-separated values
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

  const handleSave = async () => {
    if (!selectedData || selectedData.length === 0) {
      toast.error("No selected data to save.");
      return;
    }

    // Fetch user's existing BOQs
    const { data: existingBOQs, error: fetchError } = await supabase
      .from("boqdata")
      .select("id, title") // Fetch ID and title
      .eq("userId", userId);

    if (fetchError) {
      console.error("Error fetching user BOQs:", fetchError);
      return;
    }

    if (existingBOQs.length >= 3) {
      toast.error("You can only save up to 3 BOQs.");
      return;
    }

    if (existingBOQs.length > 0) {
      setShowBoqPrompt(true); // Show the prompt for choosing or naming the BOQ
      setExistingBoqs(existingBOQs); // Store the fetched BOQs for selection
    } else {
      setShowBoqPrompt(true); // If no existing BOQs, directly show naming prompt
    }
  };

  const handleBoqNameConfirm = (nameOrId, isNew = true) => {
    setShowBoqPrompt(false);

    if (isNew) {
      setBoqTitle(nameOrId); // If it's a new BOQ, use the entered name
      insertDataIntoSupabase(selectedData, userId, nameOrId, totalArea);
    } else {
      updateExistingBoq(nameOrId); // If updating an existing BOQ, use its ID
    }
  };

  const updateExistingBoq = async (boqId) => {
    try {
      const { error } = await supabase
        .from("boqdata")
        .update({
          product_id: selectedData.map((item) => item.id).join(","),
          product_variant_id: selectedData
            .map((item) => item.product_variant?.variant_id || "")
            .join(","),
          addon_id: selectedData
            .flatMap((item) =>
              item.addons
                ? Object.values(item.addons).map((addon) => addon.addonid)
                : []
            )
            .join(","),
          addon_variant_id: selectedData
            .flatMap((item) =>
              item.addons
                ? Object.values(item.addons).map((addon) => addon.id)
                : []
            )
            .join(","),
          addon_final_price: selectedData
            .flatMap((item) =>
              item.addons
                ? Object.values(item.addons).map(
                    (addon) => addon.finalPrice || ""
                  )
                : []
            )
            .filter(Boolean)
            .join(","),
          group_key: selectedData
            .map((item) => item.groupKey || "")
            .filter(Boolean)
            .join(","),
          final_price: selectedData
            .map((item) => item.finalPrice || "")
            .filter(Boolean)
            .join(","),
          total_area: totalArea,
          height: userResponses.height,
          flooring: userResponses.flooring,
          demolishTile: userResponses.demolishTile,
          hvacType: userResponses.hvacType,
          planType: selectedPlan,
        })
        .eq("id", boqId);

      if (error) {
        console.error("Error updating existing BOQ:", error);
        toast.error("Failed to update BOQ.");
      } else {
        toast.success("BOQ updated successfully!");
      }
    } catch (error) {
      console.error("Error during update:", error);
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

      // Convert stored comma-separated values into arrays
      const productVariantIds =
        data.product_variant_id?.split(",").map((id) => id.trim()) || [];
      const addonIds = data.addon_id?.split(",").map((id) => id.trim()) || [];
      const addonVariantIds =
        data.addon_variant_id?.split(",").map((id) => id.trim()) || [];
      const groupKeys =
        data.group_key?.split(",").map((key) => key.trim()) || [];
      const finalPrices =
        data.final_price
          ?.split(",")
          .map((price) => parseFloat(price.trim()) || 0) || [];
      const addonFinalPrices =
        data.addon_final_price
          ?.split(",")
          .map((price) => parseFloat(price.trim()) || 0) || [];

      // ✅ Reconstruct products and addons based on groupKey
      const reconstructedData = groupKeys.map((groupKey, index) => {
        let category = "";
        let subcategory = "";
        let subcategory1 = "";
        let productId = "";

        const parts = groupKey.split("-");

        if (groupKey.includes("L-Type Workstation")) {
          // ✅ Special handling for "L-Type Workstation"
          category = parts[0];
          subcategory = "L-Type Workstation"; // Keep it intact
          subcategory1 = parts.length > 3 ? parts[3] : "";
          productId = parts[parts.length - 1];
        } else {
          // Default split behavior
          [category, subcategory, subcategory1, productId] = parts;
        }

        return {
          id: productId,
          category,
          subcategory,
          subcategory1,
          product_variant: {
            variant_id: productVariantIds[index] || productId,
          },
          addons:
            addonIds.length > index
              ? [
                  {
                    addonid: addonIds[index],
                    id: addonVariantIds[index],
                    finalPrice: addonFinalPrices[index] || 0, // ✅ Assign finalPrice for addons
                  },
                ]
              : [],
          groupKey,
          finalPrice: finalPrices[index] || 0, // Assign final price for product
        };
      });

      console.log("Reconstructed BOQ Data:", reconstructedData);

      // Fetch and transform BOQ-related products and addons
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

      // Fetch all products including addons
      const allProducts = await fetchProductsData();

      if (!Array.isArray(allProducts) || allProducts.length === 0) {
        console.warn("No products found in the database.");
        return [];
      }

      // Filter products that match BOQ data
      const filteredBOQProducts = reconstructedData
        .map((boqItem) => {
          // Find matching product from allProducts
          const matchingProduct = allProducts.find((product) =>
            product.product_variants?.some(
              (variant) => variant.id === boqItem.product_variant?.variant_id
            )
          );

          if (!matchingProduct) return null;

          // Find matching variant inside the product
          const matchingVariant = matchingProduct.product_variants?.find(
            (variant) => variant.id === boqItem.product_variant?.variant_id
          );

          // ✅ Fetch addons that match the BOQ item's addons
          const matchingAddons = boqItem.addons
            ?.map(({ addonid, id, finalPrice }) => {
              // Ensure finalPrice is used
              // Find the corresponding product that contains the addon
              const addonProduct = allProducts.find((product) =>
                product.addons?.some((addon) => addon.id === addonid)
              );

              if (!addonProduct) return null;

              // Get the addon from the matching product
              const addon = addonProduct.addons?.find((a) => a.id === addonid);
              if (!addon) return null;

              // Find the correct addon variant
              const addonVariant = addon.addon_variants?.find(
                (variant) => variant.id === id
              );
              if (!addonVariant) return null;

              return {
                addonid: addon.id,
                // typetitle: addon.title,
                price: addonVariant.price,
                id: addonVariant.id,
                title: addonVariant.title,
                status: addonVariant.status,
                vendorId: addonVariant.vendorId,
                image: addonVariant.image,
                finalPrice: finalPrice || addonVariant.price || 0, // ✅ Use saved finalPrice
              };
            })
            .filter(Boolean); // Remove null values

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
              additional_images: JSON.parse(
                matchingVariant?.additional_images || "[]"
              ),
            },
            addons: matchingAddons, // ✅ Addons now include fetched finalPrice
            groupKey: boqItem.groupKey,
            finalPrice: boqItem.finalPrice || matchingVariant?.price || 0, // Ensure finalPrice is carried over
          };
        })
        .filter(Boolean); // Remove null entries

      console.log("Formatted BOQ Products:", filteredBOQProducts);
      return filteredBOQProducts;
    } catch (error) {
      console.error("Error fetching and filtering BOQ products:", error);
      return [];
    }
  };

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
  // console.log("selected plan", selectedPlan);

  return (
    <div>
      {showBoqPrompt && (
        <BoqPrompt
          existingBoqs={existingBoqs}
          onConfirm={handleBoqNameConfirm}
          onCancel={() => setShowBoqPrompt(false)}
        />
      )}

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
        areasData={areasData}
      />
      <div className="px-5">
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
                    {showSelectArea && (
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
                      />
                    )}
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
      {isOpen && (
        <div ref={profileRef}>
          <ProfileCard layout={false} />
        </div>
      )}
    </div>
  );
}

export default Boq;
