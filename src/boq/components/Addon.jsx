import { useEffect } from "react";
import { baseImageUrl } from "../../utils/HelperConstant";
import { useBoqApp } from "../../Context/BoqContext";

function Addon({
  allAddons,
  selectedRoom,
  selectedData,
  selectedProductView,
  selectedAddons,
  setSelectedAddons,
  selectedAddonsMap,
  setSelectedAddonsMap,
}) {
  const { selectedCategory, selectedSubCategory1 } = useBoqApp();

  useEffect(() => {
    if (!selectedProductView) return;

    const currentGroupKey = `${selectedCategory.category}-${selectedRoom}-${selectedSubCategory1}-${selectedProductView.id}`;
    const existingAddons = selectedAddonsMap[currentGroupKey] || [];

    setSelectedAddons(existingAddons);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    selectedData,
    selectedCategory,
    selectedRoom,
    selectedSubCategory1,
    selectedProductView,
    selectedAddonsMap,
  ]);

  if (!allAddons || allAddons.length === 0) {
    return (
      <p className="text-gray-500 text-center">
        No addons available for this category.
      </p>
    );
  }

  const addonImagesArray = allAddons.flatMap((addon) =>
    Array.isArray(addon.addon_variants)
      ? addon.addon_variants.map((variant) => ({
          ...variant,
          imageUrl: variant.image || `${baseImageUrl}${variant.title}.jpg`,
        }))
      : []
  );

  const handleAddonSelection = (addon) => {
    const currentGroupKey = `${selectedCategory.category}-${selectedRoom}-${selectedSubCategory1}-${selectedProductView.id}`;

    setSelectedAddonsMap((prev) => {
      const existingAddons = prev[currentGroupKey] || [];
      let updatedAddons;

      if (existingAddons.some((a) => a.id === addon.id)) {
        updatedAddons = existingAddons.filter((a) => a.id !== addon.id);
      } else {
        updatedAddons = [...existingAddons, addon];
      }

      return { ...prev, [currentGroupKey]: updatedAddons };
    });
  };

  return (
    <div className="addons-grid flex flex-col gap-4  pl-4 w-full lg:w-1/3">
      <div className="flex items-center justify-between whitespace-nowrap">
        <h3 className="text-sm md:text-lg font-semibold text-[#68B2DC]">
          {selectedRoom}
        </h3>
      </div>

      {addonImagesArray.map((variant) => (
        <div
          key={variant.id}
          className="relative p-3 bg-gray-100 rounded-lg shadow-sm flex gap-4 items-center"
        >
          <input
            type="checkbox"
            checked={selectedAddons.some((item) => item.id === variant.id)}
            onChange={(e) => handleAddonSelection(variant, e.target.checked)}
            className="w-5 h-5 cursor-pointer accent-black"
          />

          <img
            className="w-16 h-16 object-cover rounded-md border border-gray-300"
            src={variant.imageUrl}
            alt={variant.title || "Addon Variant"}
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/150";
            }}
          />

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
