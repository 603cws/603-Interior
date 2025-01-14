import React from "react";

const baseImageUrl =
  "https://bwxzfwsoxwtzhjbzbdzs.supabase.co/storage/v1/object/public/addon/";

function Addon({ allAddons, onAddonAdd }) {
  // Filter products based on selectedSubCategory1 (like 'Table', 'Chair')

  if (allAddons.length === 0) {
    return <p>No addons available for this category.</p>;
  }

  // Generate image URLs for addon variants
  const addonImagesArray = allAddons.flatMap((addon) =>
    addon.addon_variants.map((variant) => ({
      ...variant,
      imageUrl: variant.image || `${baseImageUrl}${variant.title}.jpg`, // Adjust if addon variant image is missing
    }))
  );

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
            <p className="text-xs">Price: ₹{variant.price}</p>
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
