import React, { useEffect } from "react";
import { useApp } from "../../Context/Context";

function Addon({
  allAddons,
  onAddonSelect,
  selectedRoom,
  selectedData,
  selectedProductView,
  selectedAddons,
  setSelectedAddons,
  selectedAddonsMap,
  setSelectedAddonsMap,
}) {
  const { selectedCategory, selectedSubCategory1 } = useApp();

  const baseImageUrl =
    "https://bwxzfwsoxwtzhjbzbdzs.supabase.co/storage/v1/object/public/addon/";

  useEffect(() => {
    if (!selectedProductView) return;

    // **Find existing addons from selectedAddonsMap for the current groupKey**
    const currentGroupKey = `${selectedCategory.category}-${selectedRoom}-${selectedSubCategory1}-${selectedProductView.id}`;
    const existingAddons = selectedAddonsMap[currentGroupKey] || [];

    setSelectedAddons(existingAddons); // ✅ Always update when selectedData changes

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    selectedData,
    selectedCategory,
    selectedRoom,
    selectedSubCategory1,
    selectedProductView,
    selectedAddonsMap, // ✅ Use this to track previously saved selections correctly
  ]);

  if (!allAddons || allAddons.length === 0) {
    return (
      <p className="text-gray-500 text-center">
        No addons available for this category.
      </p>
    );
  }

  // Generate image URLs for addon variants
  const addonImagesArray = allAddons.flatMap((addon) =>
    Array.isArray(addon.addon_variants)
      ? addon.addon_variants.map((variant) => ({
          ...variant,
          imageUrl: variant.image || `${baseImageUrl}${variant.title}.jpg`, // Fallback for missing image
        }))
      : []
  );

  // Handle selection of addons
  const handleAddonSelection = (addon) => {
    const currentGroupKey = `${selectedCategory.category}-${selectedRoom}-${selectedSubCategory1}-${selectedProductView.id}`;

    setSelectedAddonsMap((prev) => {
      const existingAddons = prev[currentGroupKey] || [];
      let updatedAddons;

      if (existingAddons.some((a) => a.id === addon.id)) {
        // Remove if already selected
        updatedAddons = existingAddons.filter((a) => a.id !== addon.id);
      } else {
        // Add if not selected
        updatedAddons = [...existingAddons, addon];
      }

      return { ...prev, [currentGroupKey]: updatedAddons };
    });
  };

  return (
    <div className="addons-grid flex flex-col gap-4  pl-4 w-full lg:w-1/3">
      <div className="flex items-center justify-between whitespace-nowrap">
        <h3 className="text-lg font-semibold">{selectedRoom}</h3>
      </div>

      {addonImagesArray.map((variant) => (
        <div
          key={variant.id}
          className="relative p-3 bg-gray-100 rounded-lg shadow-sm flex gap-4 items-center"
        >
          {/* Checkbox for Selection */}
          <input
            type="checkbox"
            checked={selectedAddons.some((item) => item.id === variant.id)}
            onChange={(e) => handleAddonSelection(variant, e.target.checked)}
            className="w-5 h-5 cursor-pointer accent-black"
          />

          {/* Addon Image */}
          <img
            className="w-16 h-16 object-cover rounded-md border border-gray-300"
            src={variant.imageUrl}
            alt={variant.title || "Addon Variant"}
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/150"; // Fallback image
            }}
          />

          {/* Addon Details */}
          <div className="flex-1">
            <h4 className="text-sm font-semibold">{variant.title}</h4>
            <p className="text-xs">
              Price: ₹{variant.price.toLocaleString("en-IN")}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Addon;
