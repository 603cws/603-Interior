import { handleError } from "../../common-components/handleError";
import { supabase } from "../../services/supabase";

export const fetchCategories = async () => {
  try {
    const { data, error } = await supabase
      .from("categories")
      .select("id, name, subcategories,subCat1");

    if (error) throw error;

    const formattedData = data
      .map((item) => ({
        id: item.id,
        category: item.name,
        subcategories: JSON.parse(item.subcategories || "[]"),
        subcategory1: JSON.parse(item.subCat1 || "[]"),
      }))
      .sort((a, b) => a.id - b.id);

    return formattedData;
  } catch (err) {
    handleError(err, {
      prodMessage: "Unexpected error occured. Please try again!",
    });
    return [];
  }
};

export const fetchProductsData = async () => {
  try {
    const { data, error } = await supabase
      .from("products")
      .select(
        `
                *,
                addons(*, addon_variants(*)),
                product_variants(*, profiles(company_name))
            `,
      )
      .order("created_at", { ascending: true });
    if (error) throw error;

    const approvedProducts = data
      .map((product) => {
        const approvedVariants = product.product_variants.filter(
          (variant) => variant.status === "approved",
        );

        // ✅ Filter addons & their variants
        const approvedAddons = product.addons
          .map((addon) => {
            const approvedAddonVariants = addon.addon_variants.filter(
              (variant) => variant.status === "approved",
            );

            if (approvedAddonVariants.length === 0) return null;

            return {
              ...addon,
              addon_variants: approvedAddonVariants,
            };
          })
          .filter(Boolean);

        if (approvedVariants.length === 0 && approvedAddons.length === 0) {
          return null;
        }
        return {
          ...product,
          product_variants: approvedVariants,
          addons: approvedAddons,
        };
      })
      .filter(Boolean);

    const allImages = approvedProducts
      .flatMap((product) => [
        ...product.product_variants.map((variant) => variant.image),
        ...product.addons.flatMap((addon) => [
          addon.image,
          ...addon.addon_variants.map((variant) => variant.image),
        ]),
      ])
      .filter(Boolean);

    const uniqueImages = [...new Set(allImages)];

    const { data: signedUrls, error: signedUrlError } = await supabase.storage
      .from("addon")
      .createSignedUrls(uniqueImages, 3600);

    if (signedUrlError) throw signedUrlError;

    const urlMap = Object.fromEntries(
      signedUrls.map((item) => [item.path, item.signedUrl]),
    );

    const processedData = approvedProducts.map((product) => ({
      ...product,
      product_variants: product.product_variants
        .filter((variant) => variant.productDisplayType !== "ecommerce")
        .map((variant) => ({
          ...variant,
          image: urlMap[variant.image] || "",
        })),
      addons: product.addons.map((addon) => ({
        ...addon,
        image: urlMap[addon.image] || "",
        addon_variants: addon.addon_variants
          .filter((variant) => variant.productDisplayType !== "ecommerce")
          .map((variant) => ({
            ...variant,
            image: urlMap[variant.image] || "",
          })),
      })),
    }));

    return processedData;
  } catch (error) {
    handleError(error, {
      prodMessage: "Error fetching products data",
    });
    return [];
  }
};

export const fetchRoomData = async (userId, currentLayoutID) => {
  try {
    const { data: layoutData, error } = await supabase
      .from("layout")
      .select()
      .eq(
        currentLayoutID ? "id" : "userId",
        currentLayoutID ? currentLayoutID : userId,
      )
      .order("created_at", { ascending: false })
      .limit(1);

    if (error) throw error;

    return {
      layoutData: layoutData || [],
    };
  } catch (error) {
    handleError(error, {
      prodMessage: "Error fetching room data",
    });
    return { layoutData: [] };
  }
};

export const fetchCategoriesandSubCat1 = async () => {
  try {
    const { data, error } = await supabase
      .from("categories")
      .select("name,subCat1");

    if (error) throw error;

    const transformedData = data.reduce((acc, item) => {
      acc[item.name] = item.subCat1 ? JSON.parse(item.subCat1) : [];
      return acc;
    }, {});
    return transformedData;
  } catch (err) {
    handleError(err, {
      prodMessage: "Unexpected error occured.",
    });
    return [];
  }
};
