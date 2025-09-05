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
    console.error("Error fetching categories:", err);
    return [];
  }
};

// export const fetchProductsData = async () => {
//   try {
//     const { data, error } = await supabase.from("products").select(`
//                 *,
//                 addons(*, addon_variants(*)),
//                 product_variants (*)
//             `);

//     if (error) throw error;

//     // Filter products where at least one variant is approved
//     const approvedProducts = data
//       .map((product) => {
//         const approvedVariants = product.product_variants.filter(
//           (variant) => variant.status === "approved"
//         );

//         if (approvedVariants.length === 0) return null; // Exclude products without approved variants

//         return {
//           ...product,
//           product_variants: approvedVariants,
//         };
//       })
//       .filter(Boolean); // Remove null values

//     const allImages = approvedProducts
//       .flatMap((product) => [
//         ...product.product_variants.map((variant) => variant.image),
//         ...product.addons.flatMap((addon) => [
//           addon.image,
//           ...addon.addon_variants.map((variant) => variant.image),
//         ]),
//       ])
//       .filter(Boolean);

//     const uniqueImages = [...new Set(allImages)];

//     const { data: signedUrls, error: signedUrlError } = await supabase.storage
//       .from("addon")
//       .createSignedUrls(uniqueImages, 3600);

//     if (signedUrlError) throw signedUrlError;

//     const urlMap = Object.fromEntries(
//       signedUrls.map((item) => [item.path, item.signedUrl])
//     );

//     const processedData = approvedProducts.map((product) => ({
//       ...product,
//       product_variants: product.product_variants.map((variant) => ({
//         ...variant,
//         image: urlMap[variant.image] || "",
//       })),
//       addons: product.addons.map((addon) => ({
//         ...addon,
//         image: urlMap[addon.image] || "",
//         addon_variants: addon.addon_variants.map((variant) => ({
//           ...variant,
//           image: urlMap[variant.image] || "",
//         })),
//       })),
//     }));

//     return processedData;
//   } catch (error) {
//     console.error("Error fetching products data:", error);
//     return [];
//   }
// };

export const fetchProductsData = async () => {
  try {
    const { data, error } = await supabase.from("products").select(`
                *,
                addons(*, addon_variants(*)),
                product_variants (*)
            `);

    if (error) throw error;

    // Filter products where at least one variant is approved
    const approvedProducts = data
      .map((product) => {
        const approvedVariants = product.product_variants.filter(
          (variant) => variant.status === "approved"
        );

        // ✅ Filter addons & their variants
        const approvedAddons = product.addons
          .map((addon) => {
            const approvedAddonVariants = addon.addon_variants.filter(
              (variant) => variant.status === "approved"
            );

            if (approvedAddonVariants.length === 0) return null; // drop addon if no approved variants

            return {
              ...addon,
              addon_variants: approvedAddonVariants,
            };
          })
          .filter(Boolean); // remove null addons

        if (approvedVariants.length === 0 && approvedAddons.length === 0) {
          return null; // drop product entirely if no approved variants or addons
        }
        return {
          ...product,
          product_variants: approvedVariants,
          addons: approvedAddons,
        };
      })
      .filter(Boolean); // Remove null values

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
      signedUrls.map((item) => [item.path, item.signedUrl])
    );

    const processedData = approvedProducts.map((product) => ({
      ...product,
      product_variants: product.product_variants.map((variant) => ({
        ...variant,
        image: urlMap[variant.image] || "",
      })),
      addons: product.addons.map((addon) => ({
        ...addon,
        image: urlMap[addon.image] || "",
        addon_variants: addon.addon_variants.map((variant) => ({
          ...variant,
          image: urlMap[variant.image] || "",
        })),
      })),
    }));

    return processedData;
  } catch (error) {
    console.error("Error fetching products data:", error);
    return [];
  }
};

// export const fetchWorkspaces = async () => {
//   try {
//     const { data, error } = await supabase.from("workspaces").select();

//     if (error) throw error;

//     return data;
//   } catch (error) {
//     console.error("Error fetching workspaces:", error);
//     return [];
//   }
// };

export const fetchRoomData = async (userId, currentLayoutID) => {
  try {
    const { data: layoutData, error } = await supabase
      .from("layout")
      .select()
      .eq(
        currentLayoutID ? "id" : "userId", // conditionally choose column
        currentLayoutID ? currentLayoutID : userId // conditionally choose value
      )
      .order("created_at", { ascending: false })
      .limit(1);

    if (error) throw error;

    // const { data: areasData, error: areasError } = await supabase
    //   .from("areas")
    //   .select()
    //   .eq("userId", userId) // Filter by userId
    //   .order("created_at", { ascending: false })
    //   .limit(1);

    // if (areasError) throw areasError;

    return {
      layoutData: layoutData || [],
      // areasData: areasData || [],
    };
  } catch (error) {
    console.error("Error fetching room data:", error);
    return { layoutData: [] };
  }
};

export const fetchCategoriesandSubCat1 = async () => {
  try {
    const { data, error } = await supabase
      .from("categories")
      .select("name,subCat1");

    if (error) throw error;

    // Transform data into key-value pairs
    const transformedData = data.reduce((acc, item) => {
      acc[item.name] = item.subCat1 ? JSON.parse(item.subCat1) : [];
      return acc;
    }, {});
    return transformedData;
  } catch (err) {
    console.error("Unexpected error:", err);
    return [];
  }
};
