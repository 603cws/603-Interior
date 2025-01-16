import React from "react";
// import { useApp } from "../../Context/Context";

function Addon({ allAddons, onAddonAdd }) {
  // const { selectedCategory, selectedSubCategory } = useApp();

  const baseImageUrl = "https://bwxzfwsoxwtzhjbzbdzs.supabase.co/storage/v1/object/public/addon/";

  if (allAddons?.length === 0) {
    return <p>No addons available for this category.</p>;
  }

  // Generate image URLs for addon variants
  const addonImagesArray = Array.isArray(allAddons)
    ? allAddons.flatMap((addon) =>
      Array.isArray(addon.addon_variants)
        ? addon.addon_variants.map((variant) => ({
          ...variant,
          imageUrl: variant.image || `${baseImageUrl}${variant.title}.jpg`, // Fallback for missing image
        }))
        : [] // Fallback if addon_variants is not an array
    )
    : []; // Fallback if allAddons is not an array


  return (
    <div className="addons-grid flex flex-wrap">
      {addonImagesArray.map((variant) => (
        <div
          key={variant.id}
          className="relative w-[150px] m-4 border-[1px] border-black"
        >
          <img
            className="w-full"
            src={variant.imageUrl}
            alt={variant.title || "Addon Variant"}
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/150"; // Fallback image
            }}
          />
          <div className="mt-2 ml-2">
            <h4 className="text-xs font-semibold">{variant.title}</h4>
            <p className="text-xs">Price: ₹{variant.price.toLocaleString("en-IN")}</p>
          </div>
          <button
            className="absolute bottom-16 text-black font-bold text-xs left-5 uppercase border px-3 py-2 hover:bg-white hover:text-black hover:border-black"
            onClick={() => onAddonAdd(variant)}
          >
            Add to Cart
          </button>
        </div>
      ))}
    </div>
  );
}

export default Addon;
