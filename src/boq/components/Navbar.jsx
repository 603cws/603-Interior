import { useNavigate } from "react-router-dom";
import { useApp } from "../../Context/Context";
import PDFGenerator from "./PDFGenerator";
import { useState, useEffect, useRef } from "react";
import { RiArrowDropDownLine } from "react-icons/ri";
import { supabase } from "../../services/supabase";
import toast from "react-hot-toast";
import { fetchProductsData } from "../utils/dataFetchers";
import { createPortal } from "react-dom";
import BoqPrompt from "./BoqPrompt";
import Boqcompleted from "../../common-components/Boqcompleted";
import { CiMenuFries } from "react-icons/ci";
import { MdOutlineCancel } from "react-icons/md";
import AlertBox from "./AlertBox";
import { PiStarFourFill } from "react-icons/pi";
import CurrentLayoutDetails from "./CurrentLayoutDetails";

function Navbar({
  toggleProfile,
  iconRef,
  showBoqPrompt,
  setShowBoqPrompt,
  isProfileCard,
  setIsProfileCard,
}) {
  // const progress = 0;
  const [isOpen, setIsOpen] = useState(false);
  const [boqList, setBoqList] = useState([]);
  const [completed100, setCompleted100] = useState(() => {
    return localStorage.getItem("boqCompleted") === "done" ? false : false;
  });

  //below two state are for deletion of a boq
  const [deleteAlert, setDeleteAlert] = useState(false);
  const [selectedboqid, setSelectedboqid] = useState(null);

  const dropdownRef = useRef(null);

  //dropdown mobile
  const [mobileDropDown, setMobileDropDown] = useState(false);

  const [isDownloading, setIsDownloading] = useState(false);
  const [showLayoutDetails, setShowLayoutDetails] = useState(false);

  // const { signOutUser } = useAuthRefresh(); // Get signOutUser from hook

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const {
    progress,
    selectedData,
    setSelectedData,
    accountHolder,
    categories,
    setUserId,
    totalArea,
    userId,
    userResponses,
    selectedPlan,
    areasData,
    boqTotal,
    setBoqTotal,
    isMobile,
    setSelectedPlan,
    BOQTitle,
    setBOQTitle,
    currentLayoutData,
    setCurrentLayoutData,
    BOQID,
  } = useApp();

  // const totalArea = currentLayoutData.totalArea;

  useEffect(() => {
    const boqCompleted = localStorage.getItem("boqCompleted");

    if (progress === 100 && boqCompleted !== "done" && !completed100) {
      setCompleted100(true);
      localStorage.setItem("boqCompleted", "done"); // ✅ Store "done" properly
    }
  }, [progress, completed100]); // ✅ Added `completed100` to prevent unnecessary re-triggers

  useEffect(() => {
    if (showLayoutDetails) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }
    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, [showLayoutDetails]);

  const naviagte = useNavigate();

  const handleGoTOlayout = () => {
    naviagte("/Layout");
  };

  const handlelogo = () => {
    naviagte("/");
  };

  // const fetchFilteredBOQProducts = async (reconstructedData) => {
  //   try {
  //     if (!Array.isArray(reconstructedData) || reconstructedData.length === 0) {
  //       console.warn(
  //         "fetchFilteredBOQProducts received invalid data:",
  //         reconstructedData
  //       );
  //       return [];
  //     }

  //     // Fetch all products including addons
  //     const allProducts = await fetchProductsData();

  //     if (!Array.isArray(allProducts) || allProducts.length === 0) {
  //       console.warn("No products found in the database.");
  //       return [];
  //     }

  //     // Filter products that match BOQ data
  //     const filteredBOQProducts = reconstructedData
  //       .map((boqItem) => {
  //         // Find matching product from allProducts
  //         const matchingProduct = allProducts.find((product) =>
  //           product.product_variants?.some(
  //             (variant) => variant.id === boqItem.product_variant?.variant_id
  //           )
  //         );

  //         if (!matchingProduct) return null;

  //         // Find matching variant inside the product
  //         const matchingVariant = matchingProduct.product_variants?.find(
  //           (variant) => variant.id === boqItem.product_variant?.variant_id
  //         );

  //         // ✅ Fetch addons that match the BOQ item's addons
  //         const matchingAddons = boqItem.addons
  //           ?.map(({ addonid, id, finalPrice }) => {
  //             // Ensure finalPrice is used
  //             // Find the corresponding product that contains the addon
  //             const addonProduct = allProducts.find((product) =>
  //               product.addons?.some((addon) => addon.id === addonid)
  //             );

  //             if (!addonProduct) return null;

  //             // Get the addon from the matching product
  //             const addon = addonProduct.addons?.find((a) => a.id === addonid);
  //             if (!addon) return null;

  //             // Find the correct addon variant
  //             const addonVariant = addon.addon_variants?.find(
  //               (variant) => variant.id === id
  //             );
  //             if (!addonVariant) return null;

  //             return {
  //               addonid: addon.id,
  //               // typetitle: addon.title,
  //               price: addonVariant.price,
  //               id: addonVariant.id,
  //               title: addonVariant.title,
  //               status: addonVariant.status,
  //               vendorId: addonVariant.vendorId,
  //               image: addonVariant.image,
  //               finalPrice: finalPrice || addonVariant.price || 0, // ✅ Use saved finalPrice
  //             };
  //           })
  //           .filter(Boolean); // Remove null values

  //         return {
  //           id: matchingVariant?.id || matchingProduct.id,
  //           category: boqItem.category,
  //           subcategory: boqItem.subcategory,
  //           subcategory1: boqItem.subcategory1,
  //           product_variant: {
  //             variant_id: matchingVariant?.id || matchingProduct.id,
  //             variant_title: matchingVariant?.title || matchingProduct.title,
  //             variant_details:
  //               matchingVariant?.details || matchingProduct.details,
  //             variant_image: matchingVariant?.image || matchingProduct.image,
  //             variant_price: matchingVariant?.price || matchingProduct.price,
  //             additional_images: JSON.parse(
  //               matchingVariant?.additional_images || "[]"
  //             ),
  //           },
  //           addons: matchingAddons, // ✅ Addons now include fetched finalPrice
  //           groupKey: boqItem.groupKey,
  //           finalPrice: boqItem.finalPrice || matchingVariant?.price || 0, // Ensure finalPrice is carried over
  //         };
  //       })
  //       .filter(Boolean); // Remove null entries

  //     return filteredBOQProducts;
  //   } catch (error) {
  //     console.error("Error fetching and filtering BOQ products:", error);
  //     return [];
  //   }
  // };

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

  const handleDeleteBOQ = async (boqId) => {
    try {
      const { error } = await supabase
        .from("boq_data_new")
        .delete()
        .eq("id", boqId);

      if (error) {
        console.error("Error deleting BOQ:", error);
        toast.error("Failed to delete BOQ");
        return;
      }

      toast.success("BOQ deleted successfully!");
      fetchSavedBOQs(); // Refresh the list after deletion
      setDeleteAlert(false);
    } catch (err) {
      console.error("Error deleting BOQ:", err);
    }
  };
  // const handleDeleteBOQ = async (boqId) => {
  //   const isConfirmed = window.confirm(
  //     "Are you sure you want to delete this BOQ?"
  //   );

  //   if (!isConfirmed) return; // If user cancels, stop execution

  //   try {
  //     const { error } = await supabase.from("boqdata").delete().eq("id", boqId);

  //     if (error) {
  //       console.error("Error deleting BOQ:", error);
  //       toast.error("Failed to delete BOQ");
  //       return;
  //     }

  //     toast.success("BOQ deleted successfully!");
  //     fetchSavedBOQs(); // Refresh the list after deletion
  //   } catch (err) {
  //     console.error("Error deleting BOQ:", err);
  //   }
  // };

  // Function to load a BOQ
  // const handleLoadBOQ = async (boqId) => {
  //   try {
  //     // Fetch BOQ data from Supabase
  //     const { data, error } = await supabase
  //       .from("boqdata")
  //       .select("*")
  //       .eq("id", boqId)
  //       .single();

  //     if (error) {
  //       console.error("Error fetching BOQ:", error);
  //       toast.error("Failed to load BOQ");
  //       return;
  //     }

  //     if (!data) {
  //       toast.error("BOQ not found");
  //       return;
  //     }

  //     // Convert stored comma-separated values into arrays
  //     const productVariantIds =
  //       data.product_variant_id?.split(",").map((id) => id.trim()) || [];
  //     const addonIds = data.addon_id?.split(",").map((id) => id.trim()) || [];
  //     const addonVariantIds =
  //       data.addon_variant_id?.split(",").map((id) => id.trim()) || [];
  //     const groupKeys =
  //       data.group_key?.split(",").map((key) => key.trim()) || [];
  //     const finalPrices =
  //       data.final_price
  //         ?.split(",")
  //         .map((price) => parseFloat(price.trim()) || 0) || [];
  //     const addonFinalPrices =
  //       data.addon_final_price
  //         ?.split(",")
  //         .map((price) => parseFloat(price.trim()) || 0) || [];

  //     // ✅ Reconstruct products and addons based on groupKey
  //     const reconstructedData = groupKeys.map((groupKey, index) => {
  //       let category = "";
  //       let subcategory = "";
  //       let subcategory1 = "";
  //       let productId = "";

  //       const parts = groupKey.split("-");

  //       if (groupKey.includes("L-Type Workstation")) {
  //         // ✅ Special handling for "L-Type Workstation"
  //         category = parts[0];
  //         subcategory = "L-Type Workstation"; // Keep it intact
  //         subcategory1 = parts.length > 3 ? parts[3] : "";
  //         productId = parts[parts.length - 1];
  //       } else {
  //         // Default split behavior
  //         [category, subcategory, subcategory1, productId] = parts;
  //       }

  //       return {
  //         id: productId,
  //         category,
  //         subcategory,
  //         subcategory1,
  //         product_variant: {
  //           variant_id: productVariantIds[index] || productId,
  //         },
  //         addons:
  //           addonIds.length > index
  //             ? [
  //                 {
  //                   addonid: addonIds[index],
  //                   id: addonVariantIds[index],
  //                   finalPrice: addonFinalPrices[index] || 0, // ✅ Assign finalPrice for addons
  //                 },
  //               ]
  //             : [],
  //         groupKey,
  //         finalPrice: finalPrices[index] || 0, // Assign final price for product
  //       };
  //     });

  //     // Fetch and transform BOQ-related products and addons
  //     const formattedBOQProducts = await fetchFilteredBOQProducts(
  //       reconstructedData
  //     );

  //     // ✅ Update state with the final BOQ structure
  //     setSelectedData(formattedBOQProducts);
  //     setUserId(data.userId);
  //     setTotalArea(data?.total_area);
  //     setSelectedPlan(data?.planType);
  //     setBOQTitle(data.title);
  //     toast.success(`Loaded BOQ: ${data.title}`);
  //     localStorage.removeItem("boqCompleted");
  //   } catch (err) {
  //     console.error("Error loading BOQ:", err);
  //     toast.error("Error loading BOQ");
  //   }
  // };
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

      const { data: layoutData, error: layoutError } = await supabase
        .from("layout")
        .select("*")
        .eq("id", data.layoutId)
        .single();
      if (layoutError) {
        console.error("Error fetching layout:", layoutError);
        return;
      }
      setCurrentLayoutData(layoutData);
      // setTotalArea(layoutData.totalArea);
      console.log("loaded layout data:", layoutData, "totalArea", totalArea);

      // Convert stored comma-separated values into arrays
      // const productVariantIds =
      //   data.products?.map((product) => product.id) || [];
      // console.log(productVariantIds);

      // const addonIds = data.addons?.map((addon) => addon.addonId);
      // console.log(addonIds);
      // const addonVariantIds = data.addons?.map((addon) => addon.variantId);
      // console.log(addonVariantIds);

      // const groupKeys = data.products?.map((product) => product.groupKey);
      // console.log(groupKeys);
      // const finalPrices = data.products?.map((product) => product.finalPrice);
      // console.log(finalPrices);

      // const addonFinalPrices = data.addons?.map((addon) => addon.finalPrice);
      // console.log(addonFinalPrices);

      // // ✅ Reconstruct products and addons based on groupKey
      // const reconstructedData = groupKeys.map((groupKey, index) => {
      //   let category = "";
      //   let subcategory = "";
      //   let subcategory1 = "";
      //   let productId = "";

      //   const parts = groupKey.split("-");

      //   if (groupKey.includes("L-Type Workstation")) {
      //     // ✅ Special handling for "L-Type Workstation"
      //     category = parts[0];
      //     subcategory = "L-Type Workstation"; // Keep it intact
      //     subcategory1 = parts.length > 3 ? parts[3] : "";
      //     productId = parts[parts.length - 1];
      //   } else {
      //     // Default split behavior
      //     [category, subcategory, subcategory1, productId] = parts;
      //   }

      //   return {
      //     id: productVariantIds[index],
      //     category,
      //     subcategory,
      //     subcategory1,
      //     product_variant: {
      //       variant_id: productVariantIds[index] || productId,
      //     },
      //     addons:
      //       addonIds.length > index
      //         ? [
      //             {
      //               addonid: addonIds[index],
      //               id: addonVariantIds[index],
      //               finalPrice: addonFinalPrices[index] || 0,
      //             },
      //           ]
      //         : [],
      //     groupKey,
      //     finalPrice: finalPrices[index] || 0,
      //   };
      // });

      // console.log("reconstructedData", reconstructedData);

      // Fetch and transform BOQ-related products and addons
      const formattedBOQProducts = await fetchFilteredBOQProducts(
        data.products,
        data.addons
      );

      // ✅ Update state with the final BOQ structure
      setSelectedData(formattedBOQProducts);
      setUserId(data.userId);
      // setTotalArea(data?.total_area);
      setSelectedPlan(data?.planType);
      setBOQTitle(data.boqTitle);
      setBoqTotal(data.boqTotalPrice);
      toast.success(`Loaded BOQ: ${data.boqTitle}`);
      localStorage.removeItem("boqCompleted");
      console.log("boqTotal loaded", boqTotal);
    } catch (err) {
      console.error("Error loading BOQ:", err);
      toast.error("Error loading BOQ");
    }
  };

  const fetchSavedBOQs = async () => {
    try {
      const { data, error } = await supabase
        .from("boq_data_new")
        .select("id, created_at, boqTitle")
        .eq("userId", userId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching BOQs:", error);
        return;
      }

      setBoqList(data); // Update state with fetched BOQs
    } catch (err) {
      console.error("Error fetching BOQs:", err);
    }
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
    setBoqTotal(grandTotal);
  };

  useEffect(() => {
    calculateGrandTotal();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedData]);

  // const insertDataIntoSupabase = async (
  //   selectedData,
  //   userId,
  //   boqTitle,
  //   totalArea
  // ) => {
  //   try {
  //     // Check how many BOQs the user has already saved
  //     const { data: existingBOQs, error: fetchError } = await supabase
  //       .from("boqdata")
  //       .select("id", { count: "exact" })
  //       .eq("userId", userId);

  //     if (fetchError) {
  //       console.error("Error fetching user BOQ count:", fetchError);
  //       return;
  //     }

  //     if (existingBOQs.length >= 3) {
  //       console.warn("User has reached the BOQ limit.");
  //       toast.error("You can only save up to 3 BOQs.");
  //       return;
  //     }

  //     // Ask for BOQ title only if the user has room for more BOQs
  //     if (!boqTitle) {
  //       boqTitle = window.prompt("Enter a name for your BOQ:");
  //       if (!boqTitle) {
  //         toast.error("BOQ name cannot be empty.");
  //         return;
  //       }
  //     }

  //     // Prepare formatted data
  //     const formattedData = {
  //       product_id: selectedData.map((item) => item.id).join(","),
  //       product_variant_id: selectedData
  //         .map((item) => item.product_variant?.variant_id || "")
  //         .join(","),
  //       addon_id: selectedData
  //         .flatMap((item) =>
  //           item.addons
  //             ? Object.values(item.addons).map((addon) => addon.addonid)
  //             : []
  //         )
  //         .join(","),
  //       addon_variant_id: selectedData
  //         .flatMap((item) =>
  //           item.addons
  //             ? Object.values(item.addons).map((addon) => addon.id)
  //             : []
  //         )
  //         .join(","),
  //       addon_final_price: selectedData
  //         .flatMap((item) =>
  //           item.addons
  //             ? Object.values(item.addons).map(
  //                 (addon) => addon.finalPrice || ""
  //               )
  //             : []
  //         )
  //         .filter(Boolean) // Removes empty strings
  //         .join(","), // Store multiple addon final prices as comma-separated values
  //       group_key: selectedData
  //         .map((item) => item.groupKey || "")
  //         .filter(Boolean) // Removes empty strings
  //         .join(","), // Store multiple group keys as comma-separated values
  //       userId: userId,
  //       title: boqTitle, // Save the entered BOQ name
  //       total_area: totalArea,
  //       height: userResponses.height,
  //       flooring: userResponses.flooring,
  //       demolishTile: userResponses.demolishTile,
  //       hvacType: userResponses.hvacType,
  //       planType: selectedPlan,
  //       final_price: selectedData
  //         .map((item) => item.finalPrice || "")
  //         .filter(Boolean) // Removes empty strings
  //         .join(","), // Store multiple product final prices as comma-separated values
  //       totalprice: boqTotal,
  //     };

  //     // Insert into Supabase
  //     const { error } = await supabase.from("boqdata").insert([formattedData]);

  //     if (error) {
  //       console.error("Error inserting data into Supabase:", error);
  //     } else {
  //       setBOQTitle(boqTitle);
  //       toast.success("BOQ saved successfully!");
  //     }
  //   } catch (error) {
  //     console.error("Error during insertion:", error);
  //   }
  // };

  const handleSaveBOQ = async (boqTitle) => {
    try {
      const products = selectedData.map((product) => ({
        id: product.product_variant?.variant_id,
        title: product.product_variant?.variant_title,
        finalPrice: product.finalPrice || "",
        groupKey: product.groupKey,
      }));
      const addons = selectedData.flatMap((product) =>
        (product.addons || []).map((addon) => ({
          variantId: addon.id,
          addonId: addon.addonid,
          title: addon.title,
          finalPrice: addon.price || "",
          productId: product.product_variant?.variant_id,
        }))
      );
      const answers = [
        {
          height: userResponses.height || "",
          flooring: userResponses.flooring || "",
          demolishTile: userResponses.demolishTile || "",
          hvacType: userResponses.hvacType || "",
        },
      ];

      const { data, error } = await supabase.from("boq_data_new").insert([
        {
          userId: accountHolder.userId,
          products: products,
          addons: addons,
          boqTitle: boqTitle,
          layoutId: currentLayoutData.id,
          answers: answers,
          planType: selectedPlan,
          boqTotalPrice: boqTotal,
        },
      ]);
      if (error) {
        console.error("Error during insertion:", error);
      } else {
        console.log("Data inserted successfully:", data);
        toast.success("BOQ saved successfully!");
        setBOQTitle(boqTitle);
      }
    } catch (error) {
      console.error("Error during insertion:", error);
    }
  };

  // const updateExistingBoq = async (boqId) => {
  //   try {
  //     const { error } = await supabase
  //       .from("boqdata")
  //       .update({
  //         product_id: selectedData.map((item) => item.id).join(","),
  //         product_variant_id: selectedData
  //           .map((item) => item.product_variant?.variant_id || "")
  //           .join(","),
  //         addon_id: selectedData
  //           .flatMap((item) =>
  //             item.addons
  //               ? Object.values(item.addons).map((addon) => addon.addonid)
  //               : []
  //           )
  //           .join(","),
  //         addon_variant_id: selectedData
  //           .flatMap((item) =>
  //             item.addons
  //               ? Object.values(item.addons).map((addon) => addon.id)
  //               : []
  //           )
  //           .join(","),
  //         addon_final_price: selectedData
  //           .flatMap((item) =>
  //             item.addons
  //               ? Object.values(item.addons).map(
  //                   (addon) => addon.finalPrice || ""
  //                 )
  //               : []
  //           )
  //           .filter(Boolean)
  //           .join(","),
  //         group_key: selectedData
  //           .map((item) => item.groupKey || "")
  //           .filter(Boolean)
  //           .join(","),
  //         final_price: selectedData
  //           .map((item) => item.finalPrice || "")
  //           .filter(Boolean)
  //           .join(","),
  //         total_area: totalArea,
  //         height: userResponses.height,
  //         flooring: userResponses.flooring,
  //         demolishTile: userResponses.demolishTile,
  //         hvacType: userResponses.hvacType,
  //         planType: selectedPlan,
  //       })
  //       .eq("id", boqId);

  //     if (error) {
  //       console.error("Error updating existing BOQ:", error);
  //       toast.error("Failed to update BOQ.");
  //     } else {
  //       toast.success("BOQ updated successfully!");
  //     }
  //   } catch (error) {
  //     console.error("Error during update:", error);
  //   }
  // };

  const handleUpdateBOQ = async (boqId) => {
    try {
      const products = selectedData.map((product) => ({
        id: product.product_variant?.variant_id,
        title: product.product_variant?.variant_title,
        finalPrice: product.finalPrice || "",
        groupKey: product.groupKey,
      }));
      const addons = selectedData.flatMap((product) =>
        (product.addons || []).map((addon) => ({
          variantId: addon.id,
          addonId: addon.addonid,
          title: addon.title,
          finalPrice: addon.price || "",
          productId: product.product_variant?.variant_id,
        }))
      );
      const answers = [
        {
          height: userResponses.height || "",
          flooring: userResponses.flooring || "",
          demolishTile: userResponses.demolishTile || "",
          hvacType: userResponses.hvacType || "",
        },
      ];
      const { error } = await supabase
        .from("boq_data_new")
        .update({
          products: products,
          addons: addons,
          answers: answers,
          planType: selectedPlan,
          boqTotalPrice: boqTotal,
        })
        .eq("id", boqId);
      if (error) {
        console.error("Error updating existing BOQ:", error);
        toast.error("Failed to update BOQ.");
      } else {
        toast.success("BOQ updated successfully!");
      }
    } catch (error) {
      console.log("Error during update", error);
    }
  };

  const handleBoqNameConfirm = (nameOrId, isNew = true) => {
    setShowBoqPrompt(false);

    if (isNew) {
      // insertDataIntoSupabase(selectedData, userId, nameOrId, totalArea);
      handleSaveBOQ(nameOrId);
    } else {
      // updateExistingBoq(nameOrId); // If updating an existing BOQ, use its ID
      handleUpdateBOQ(nameOrId);
    }
  };

  const handleMobileDropDown = () => {
    if (mobileDropDown) {
      setMobileDropDown(false);
    } else {
      setMobileDropDown(true);
    }
  };

  const handleDownload = async () => {
    if (selectedData.length === 0) {
      toast.error("Please add a product to download BOQ.");
      return;
    }

    try {
      // Fetch the BOQ details from Supabase
      const { data, error } = await supabase
        .from("boq_data_new")
        .select("isDraft, boqTitle")
        .eq("id", BOQID)
        .single();

      if (error) {
        console.error("Error fetching BOQ details:", error);
        toast.error("Unable to check BOQ status. Please try again.");
        return;
      }

      // Check if it's a draft BOQ and matches the context title
      if (data?.isDraft && data?.boqTitle === BOQTitle) {
        toast.error("Please save the BOQ before downloading.");
        setShowBoqPrompt(true);
        return;
      }

      setIsDownloading(true); // Show loading animation

      await PDFGenerator.generatePDF(
        selectedData,
        calculateGrandTotal,
        accountHolder.companyName,
        accountHolder.location,
        areasData,
        categories,
        BOQTitle,
        userResponses
      );

      setIsDownloading(false);
    } catch (error) {
      console.error("Error generating PDF:", error);
      setIsDownloading(false);
    }
  };

  return (
    <div className="navbar sticky top-0 z-30 font-Poppins">
      <div className="flex justify-between bg-gradient-to-r from-[#23445B] to-[#487BA0] items-center px-3 md:px-10 h-[50px]">
        <div className="hidden sm:block absolute lg:flex gap-2 right-1/4 lg:right-20 -translate-x-full">
          {import.meta.env.MODE === "development" && BOQTitle && (
            <h1 className="text-green-500">Current BOQ: {BOQTitle}</h1>
          )}
          {/* <div className="flex items-center justify-center gap-1">
            <div className="h-3 w-3 rounded-full border-[1px] bg-[#34BFAD]"></div>
            <p className="text-xs text-white">Completed</p>
          </div>
          <div className="flex items-center justify-center gap-1">
            <div className="h-3 w-3 rounded-full border-[1px] bg-white"></div>
            <p className="text-xs text-white">Incomplete</p>
          </div> */}
        </div>
        {/* logo */}
        <button className="" onClick={handlelogo}>
          <img
            src="/logo/workved-logo.png"
            alt="Workved Interior logo"
            className="h-auto md:h-8 lg:h-10 w-16 lg:w-24 "
          />
        </button>
        {/* button for generate boq */}
        <div className="pr-2 flex gap-3 items-center">
          {boqTotal > 0 && (
            <div
              // onClick={signOutUser}
              className="flex justify-center items-center bg-[#FFF] rounded-sm text-xs px-5 h-fit py-3 self-center text-black border-solid border-1 border-black"
            >
              <span className="font-bold">Total</span>: ₹{" "}
              {boqTotal.toLocaleString("en-IN")}
            </div>
          )}

          {/* <div
          // onClick={signOutUser}
          className="flex justify-center items-center bg-[#FFF] rounded-xl text-xs py-2 px-5 text-black  border-solid border-1 border-black"
        >
          <span className="font-bold">Total</span>: ₹ {calculateGrandTotal()}
        </div> */}

          {/* profile icon */}
          <div
            className="z-30 rounded-full"
            ref={iconRef}
            style={{
              backgroundImage:
                "linear-gradient(to top left, #5B73AF 0%, rgba(255, 255, 255, 0.5) 48%, #1F335C 100%)",
            }}
          >
            <img
              onClick={toggleProfile}
              src={accountHolder.profileImage}
              alt="usericon"
              className="w-8 md:w-12 h-8 p-1 md:h-12 cursor-pointer rounded-full"
            />
          </div>
        </div>
      </div>
      {isMobile ? (
        <div className="bg-[#212B36] py-1 flex justify-around items-center px-5 relative">
          {/* <div className=" flex items-center">
          <button
            className="bg-[#FFF] text-xs py-2 px-5 text-black rounded-full border-solid border-[1px] border-black"
            onClick={handleGoTOlayout}
          >
            Layout
          </button>
        </div> */}
          <div className="w-10/12 mx-auto  py-2.5">
            <div className="relative h-5 bg-[#385682] rounded-sm">
              <div
                className="absolute h-full bg-[#85AED2] rounded-sm"
                style={{ width: `${progress}%` }}
              ></div>
              <div
                className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 bg-gradient-to-br from-[#334A78] to-[#1F2937] border-white rounded-sm glowing-circle"
                style={{ left: `${progress}%`, width: "10px", height: "19px" }}
              ></div>
            </div>
            {/* Progress Label */}
            <div className="text-center mt-2 text-[#C7DDFF] text-[10px]">
              {progress}% Completed
            </div>
          </div>
          {mobileDropDown ? (
            <button onClick={handleMobileDropDown}>
              <MdOutlineCancel color="white" size={25} />
            </button>
          ) : (
            <button onClick={handleMobileDropDown}>
              <CiMenuFries color="white" size={26} />
            </button>
          )}

          {mobileDropDown && (
            <div className="absolute z-20 translate-y-[60%] right-0 transform transition-all duration-700 ease-in-out opacity-100 scale-100">
              {/* <div className="absolute z-20 translate-y-[60%] translate-x-[60%] transform transition-transform ease-in-out duration-700 "> */}
              <ul className="text-[#212B36] bg-[#385682] bg-opacity-90 m-3 p-2 text-start">
                {/* <li className="hover:px-2 hover:bg-white hover:text-[#1A3A36] mb-2 px-2">
                view boq{" "}
              </li> */}
                <li
                  onClick={handleGoTOlayout}
                  className="hover:px-2 hover:bg-white hover:text-[#1A3A36] mb-2 py-1 px-2 rounded-lg cursor-pointer"
                >
                  Layout
                </li>
                <li
                  onClick={() => setShowLayoutDetails(true)}
                  className="hover:px-2 hover:bg-white hover:text-[#1A3A36] mb-2 py-1 px-2 rounded-lg cursor-pointer"
                >
                  Layout Details
                </li>
                <li
                  onClick={handleDownload}
                  className="hover:px-2 hover:bg-white hover:text-[#1A3A36] mb-2 py-1 px-2 rounded-lg cursor-pointer"
                >
                  Download
                </li>
                <li className=" hover:bg-white hover:text-[#1A3A36] mb-2 py-1 px-2 rounded-lg">
                  <div className=" flex items-center" ref={dropdownRef}>
                    <button
                      // onClick={handleSave}
                      onClick={() => {
                        setShowBoqPrompt(true);
                        setIsProfileCard(false);
                      }}
                      // className="bg-white text-xs py-2 px-3 text-black rounded-l-full"
                    >
                      Save BOQ
                    </button>
                    <button
                      onClick={() => {
                        fetchSavedBOQs();
                        setIsOpen(!isOpen);
                      }}
                      // className="bg-white px-3 py-2 border-l border-black flex items-center rounded-r-full"
                    >
                      <RiArrowDropDownLine />
                    </button>

                    {isOpen && (
                      <ul className="absolute left-0 -bottom-1/3 min-w-[100px] mt-2 w-auto text-xs bg-white rounded-lg shadow-md">
                        <li className="px-4 py-3 grid grid-cols-[2fr_1fr] font-semibold bg-[#374A75] text-center text-white rounded-t-lg shadow-md">
                          <span className="text-left">Title</span>
                          <span className="text-center">Actions</span>
                        </li>
                        {boqList.length > 0 ? (
                          boqList.map((boq) => (
                            <li
                              key={boq.id}
                              className="px-4 py-2 grid grid-cols-[2fr_1fr] items-center hover:bg-gray-100"
                              // className="px-4 py-2 grid grid-cols-[2fr_1fr] items-center hover:bg-gray-100 cursor-pointer"
                            >
                              <span className="text-left break-words text-[#374A75] whitespace-normal">
                                {boq.boqTitle}
                                {boq.boqTitle === BOQTitle && "*"}
                              </span>

                              <div className="flex justify-center gap-2">
                                <img
                                  src="../images/icons/download.png"
                                  alt="Downlaod"
                                  className="cursor-pointer h-6 w-6"
                                  onClick={() => handleLoadBOQ(boq.id)}
                                />
                                <img
                                  src="../images/icons/delete.png"
                                  alt="Delete"
                                  className="cursor-pointer h-6 w-6"
                                  onClick={() => {
                                    setDeleteAlert(true);
                                    setSelectedboqid(boq.id);
                                  }}
                                />
                              </div>
                            </li>
                          ))
                        ) : (
                          <li className="px-4 py-2 text-gray-500 text-center">
                            No BOQs saved
                          </li>
                        )}
                      </ul>
                    )}
                  </div>
                </li>
              </ul>
            </div>
          )}
        </div>
      ) : selectedPlan ? (
        <div className="bg-[#212B36] py-2.5 flex px-3 md:px-10">
          <div className=" flex items-center gap-1">
            <button
              className="bg-[#FFF] text-xs py-2 px-5 text-[#000] font-semibold rounded-[4px] border-solid border-[1px] border-black"
              onClick={handleGoTOlayout}
            >
              Go to Layout
            </button>
            <button
              onClick={() => setShowLayoutDetails(true)}
              className="bg-[#FFF] text-xs py-2 px-5 text-[#000] font-semibold rounded-[4px] border-solid border-[1px] border-black capitalize"
            >
              layout details
            </button>
          </div>
          <div className="w-7/12 mx-auto pl-10 py-2.5">
            {/* Progress Bar Container */}
            <div className="relative h-5 bg-[#385682] rounded-sm">
              {/* Filled Progress */}
              <div
                className="absolute h-full bg-[#85AED2] rounded-sm"
                style={{ width: `${progress}%` }}
              ></div>
              {/* Progress Circle */}
              <div
                className="absolute top-1/2 transform -translate-y-1/2 -translate-x-full bg-gradient-to-br from-[#334A78] to-[#1F2937]  rounded-sm glowing-circle"
                style={{ left: `${progress}%`, width: "10px", height: "18px" }}
              ></div>
              <div
                className={`absolute -top-full -translate-y-3/4 bg-[#f4f4f4] text-black text-[10px] px-3 py-1 rounded-md ${
                  progress >= 90 ? "animate-bounce" : "animate-none"
                }`}
                style={{ left: `${progress - 3}%` }}
              >
                {" "}
                <span className="absolute left-1/2 -translate-x-1/2 -bottom-1 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-white"></span>
                {`${progress} %`}
              </div>
            </div>
            {/* Progress Label */}
            {/* <div className="text-center mt-2 text-[#C7DDFF] text-[10px]">
              {progress}% Completed
            </div> */}
          </div>
          <div className="flex items-center gap-2">
            {/* <div className=""> */}
            {/* <button
          className="bg-[#FFF] text-xs py-2 px-5 text-black rounded-full border-solid border-[1px]border-black"
          onClick={clearSelectedData}
        >
          Save BOQ
        </button> */}
            {/* </div> */}
            {/* <div className="justify-items-end"> */}
            <div
              className="relative inline-flex items-center border border-black rounded-[4px] bg-white"
              ref={dropdownRef}
            >
              <button
                // onClick={handleSave}
                onClick={() => {
                  setShowBoqPrompt(true);
                  setIsProfileCard(false);
                }}
                className="bg-white text-xs py-2 px-3 text-black rounded-l-[4px] font-semibold"
              >
                Save BOQ
              </button>
              <button
                onClick={() => {
                  fetchSavedBOQs();
                  setIsOpen(!isOpen);
                }}
                className="bg-white px-3 py-2 border-l border-black flex items-center rounded-r-[4px] h-full"
              >
                <RiArrowDropDownLine />
              </button>

              {isOpen && (
                <ul className="absolute left-0 top-7 min-w-[200px] mt-2 w-auto bg-white rounded-lg shadow-md">
                  {/* Header Row */}
                  <li className="px-4 py-3 grid grid-cols-[2fr_1fr] font-semibold bg-[#374A75] text-center text-white rounded-t-lg shadow-md">
                    <span className="text-left">Title</span>
                    <span className="text-center">Actions</span>
                  </li>

                  {/* BOQ List */}
                  {boqList.length > 0 ? (
                    boqList.map((boq) => (
                      <li
                        key={boq.id}
                        className="px-4 py-2 grid grid-cols-[2fr_1fr] items-center hover:bg-gray-100"
                      >
                        {/* Title with word wrap */}
                        <div
                          className="flex items-center cursor-default max-w-[100px]"
                          title={boq.boqTitle}
                          aria-label={boq.boqTitle}
                        >
                          {boq.boqTitle === BOQTitle && (
                            <span className="w-2 h-2 rounded-full bg-green-500 mr-2 shrink-0"></span>
                          )}

                          <span className="overflow-hidden whitespace-nowrap text-ellipsis">
                            {boq.boqTitle}
                          </span>
                        </div>

                        {/* Action Icons */}
                        <div className="flex justify-left gap-3">
                          <img
                            src="../images/icons/download.png"
                            alt="Download"
                            className="cursor-pointer h-6 w-6"
                            onClick={() => handleLoadBOQ(boq.id)}
                            title="Load BOQ"
                            aria-label="Load BOQ"
                          />
                          <img
                            src="../images/icons/delete.png"
                            alt="Delete"
                            className="cursor-pointer h-6 w-6"
                            title="Delete BOQ"
                            aria-label="Delete BOQ"
                            onClick={() => {
                              setDeleteAlert(true);
                              setSelectedboqid(boq.id);
                            }}
                          />
                        </div>
                      </li>
                    ))
                  ) : (
                    <li className="px-4 py-2 text-gray-500 text-center">
                      No BOQs saved
                    </li>
                  )}
                </ul>
              )}
            </div>
            {/* </div> */}
            <div className="flex items-center downloadB">
              {/* <button
                onClick={() =>
                  PDFGenerator.generatePDF(
                    selectedData,
                    calculateGrandTotal,
                    accountHolder.companyName,
                    accountHolder.location,
                    areasData,
                    categories
                  )
                }
                className="bg-[#1A3A36] text-xs py-2 px-5 text-white rounded-full border-solid border-[1px] border-[#34BFAD] hover:bg-[#34BFAD]"
              >
                Download
              </button> */}
              {/* <button
                onClick={handleDownload}
                className={`relative flex items-center justify-center gap-2 bg-[#1A3A36] text-xs py-2 px-6 text-white rounded-sm border border-[#34BFAD] transition-all duration-300 ease-in-out 
                ${
                  isDownloading
                    ? "bg-[#267D6E] border-[#34BFAD] scale-95 cursor-not-allowed"
                    : isCompleted
                    ? "bg-green-500 border-green-500 scale-105 animate-bounce"
                    : "hover:bg-[#34BFAD]"
                }
              `}
                disabled={isDownloading}
              >
                {isDownloading ? (
                  <>
                    <span className="absolute w-4 h-4 bg-white opacity-30 rounded-full animate-ping"></span>
                    <span className="relative w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span className="relative">Downloading...</span>
                  </>
                ) : isCompleted ? (
                  <>
                    <BiCheckCircle size={16} className="text-white" />
                    <span>Success!</span>
                  </>
                ) : (
                  <>
                    <BiDownload size={16} className="text-white" />
                    <span>Download</span>
                  </>
                )}
              </button> */}

              <button
                onClick={handleDownload}
                className="generateBoq glow-on-hover-boq relative flex items-center w-32 h-10 px-4 py-2 bg-[#fff]/10 text-white overflow-hidden group rounded-[4px] font-Poppins text-xs hover:scale-105 transition-transform duration-300 ease-in-out active:bf-[#85AED2]"
              >
                <span className="absolute top-0 left-0 w-full h-full pointer-events-none z-0 block">
                  <span className="group-hover:glow-line glow-top"></span>
                  <span className="group-hover:glow-line glow-right"></span>
                  <span className="group-hover:glow-line glow-bottom"></span>
                  <span className="group-hover:glow-line glow-left"></span>
                </span>
                {isDownloading ? (
                  <>
                    <span className="absolute w-4 h-4 bg-white opacity-30 rounded-full animate-ping"></span>
                    <span className="relative w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span className="relative">Downloading...</span>
                  </>
                ) : (
                  <div className="flex gap-3 w-full h-full">
                    <div className="relative pointer-events-none z-0 w-1/2 h-full">
                      <div className="absolute top-0 left-0 text-[8px] group-hover:blink-on-hover">
                        <PiStarFourFill />
                      </div>
                      <div className="absolute bottom-0 left-[2px] text-[10px] group-hover:blink-on-hover group-hover:del-200">
                        <PiStarFourFill />
                      </div>
                      <div className="absolute right-0 top-1/4 text-sm group-hover:blink-on-hover group-hover:del-300">
                        <PiStarFourFill />
                      </div>
                    </div>
                    <span className="flex justify-center items-center">
                      Download
                    </span>
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>
      ) : null}
      {showBoqPrompt &&
        createPortal(
          <BoqPrompt
            // existingBoqs={existingBoqs}
            onConfirm={handleBoqNameConfirm}
            onCancel={() => setShowBoqPrompt(false)}
            isProfileCard={isProfileCard}
            setIsProfileCard={setIsProfileCard}
          />,
          document.body // Mounts it at the root level
        )}
      {completed100 &&
        createPortal(
          <Boqcompleted setCompleted100={setCompleted100} />,
          document.body // Mounts it at the root level
        )}
      {showLayoutDetails && (
        <CurrentLayoutDetails onClose={() => setShowLayoutDetails(false)} />
      )}

      {deleteAlert && (
        <div className="fixed inset-0 bg-black/20 pt-4">
          <AlertBox
            onClose={setDeleteAlert}
            onconfirm={handleDeleteBOQ}
            boqid={selectedboqid}
            removeboqid={setSelectedboqid}
          />
        </div>
      )}
    </div>
  );
}

export default Navbar;
