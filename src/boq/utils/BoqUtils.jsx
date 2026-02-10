import toast from "react-hot-toast";
import { supabase } from "../../services/supabase";
import { fetchProductsData } from "../utils/dataFetchers";
import { calculateAutoTotalPriceHelper } from "./CalculateTotalPriceHelper";
import { calculateCategoryTotal } from "./calculateCategoryTotal";
import { handleError } from "../../common-components/handleError";

export const normalizeKey = (subcategory) => {
  return subcategory
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/-/g, "")
    .replace("workstation", "")
    .replace("mdcabin", "md")
    .replace("managercabin", "manager")
    .replace("smallcabin", "small");
};

export const multiplyFirstTwoFlexible = (dimStr) => {
  const [a = NaN, b = NaN] = String(dimStr)
    .split(/[,\sxX*]+/) // comma / space / x / * as separators
    .map((s) => parseFloat(s.trim()));

  return Number.isFinite(a) && Number.isFinite(b) ? Number(a * b) : null;
};

export const fetchFilteredBOQProducts = async (products = [], addons = []) => {
  try {
    if (!products?.length) {
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
        const { id: variantId, groupKey, finalPrice = 0, quantity } = product;

        const parts = groupKey.split("-");
        const isLType = groupKey.includes("L-Type Workstation");

        const category = parts[0];
        const subcategory = isLType ? "L-Type Workstation" : parts[1];
        const subcategory1 = isLType ? parts[3] || "" : parts[2];

        let matchedVariant, matchedProduct;
        for (const prod of allProducts) {
          matchedVariant = prod.product_variants?.find(
            (v) => v.id === variantId,
          );
          if (matchedVariant) {
            matchedProduct = prod;
            break;
          }
        }
        if (!matchedProduct) return null;

        const addonData = addons?.[index];
        const matchingAddons = addonData
          ? (() => {
              const addonProduct = allProducts.find((p) =>
                p.addons?.some((a) => a.id === addonData.addonId),
              );
              const addon = addonProduct?.addons?.find(
                (a) => a.id === addonData.addonId,
              );
              const addonVariant = addon?.addon_variants?.find(
                (v) => v.id === addonData.variantId,
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
          quantity,
          product_variant: {
            variant_id: matchedVariant?.id || matchedProduct.id,
            variant_title: matchedVariant?.title || matchedProduct.title,
            variant_details: matchedVariant?.details || matchedProduct.details,
            variant_image: matchedVariant?.image || matchedProduct.image,
            variant_price: matchedVariant?.price || matchedProduct.price,
            additional_images: JSON.parse(
              matchedVariant?.additional_images || [],
            ),
            variant_info: matchedVariant?.information || {},
            variant_additional_info: matchedVariant?.additonalinformation || {},
          },
          addons: matchingAddons,
        };
      })
      .filter(Boolean);
  } catch (error) {
    handleError(error, {
      prodMessage: "Something went wrong. Please try again.",
    });
    return [];
  }
};
export const handleLoadBOQ = async (
  boqId,
  setSelectedData,
  setUserId,
  setTotalArea,
  setSelectedPlan,
  setBOQTitle,
  setBoqTotal,
  setBOQID,
) => {
  try {
    const { data, error } = await supabase
      .from("boq_data_new")
      .select("*")
      .eq("id", boqId)
      .single();

    if (error) {
      handleError(error, {
        prodMessage: "Failed to load BOQ.",
      });
      return;
    }

    if (!data) {
      toast.error("BOQ not found");
      return;
    }

    const formattedBOQProducts = await fetchFilteredBOQProducts(
      data.products,
      data.addons,
    );

    setSelectedData(formattedBOQProducts);
    setUserId(data.userId);
    setTotalArea(data?.total_area);
    setSelectedPlan(data?.planType);
    setBOQTitle(data.boqTitle);
    setBoqTotal(data.boqTotalPrice);
    setBOQID(boqId);
    toast.success(`Loaded BOQ: ${data.boqTitle}`);
    localStorage.removeItem("boqCompleted");
  } catch (err) {
    handleError(err, {
      prodMessage: "Error loading BOQ.",
    });
  }
};

export const createDraftBOQ = async (
  title = "Draft BOQ",
  userId,
  currentLayoutID,
) => {
  try {
    const payload = {
      userId: userId,
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
      handleError(error, {
        prodMessage: "Failed to create draft BOQ. Please try again.",
      });
      return null;
    }

    toast.success("New draft BOQ created successfully!");
    return data;
  } catch (err) {
    handleError(err, {
      prodMessage: "Unexpected error occured. Please try again!",
    });
    return null;
  }
};

export const calculateAutoTotalPrice = (
  variantPrice,
  cat,
  subcategory,
  subcategory1,
  dimensions,
  seatCountData,
  quantityData,
  areasData,
  formulaMap,
  userResponses,
) => {
  const baseTotal = calculateAutoTotalPriceHelper(
    quantityData[0],
    areasData[0],
    cat,
    subcategory,
    subcategory1,
    userResponses.height,
    dimensions,
    seatCountData,
  );

  const total = calculateCategoryTotal(
    cat,
    baseTotal,
    variantPrice,
    formulaMap,
  );

  return total;
};
