import { useBoqApp } from "../../Context/BoqContext";
import { AddToCartToast } from "../../utils/AddToCartToast";
import { calculateAddonTotalPrice } from "../utils/productUtils";
import Addon from "./Addon";

function AddonSelector({
  allSubcategories,
  setSelectedRoom,
  selectedRoom,
  setShowAddon,
  allAddons,
  selectedProductView,
  selectedAddons,
  setSelectedAddons,
  selectedAddonsMap,
  setSelectedAddonsMap,
  setShowSelectArea,
  setShowBackground,
  selectedCategory,
  selectedSubCategory,
  selectedSubCategory1,
}) {
  const { selectedData, setSelectedData, quantityData } = useBoqApp();

  const handleAddonClick = () => {
    setShowAddon(false);
    setShowSelectArea(false);
    setShowBackground(false);

    setSelectedData((prevData) => {
      const updatedData = prevData.map((item) => {
        const currentGroupKey = `${selectedCategory.category}-${item.subcategory}-${selectedSubCategory1}-${item.id}`;
        return {
          ...item,
          addons: (selectedAddonsMap[currentGroupKey] || []).map((addon) => ({
            ...addon,
            finalPrice: calculateAddonTotalPrice(
              item.subcategory,
              addon,
              selectedSubCategory,
              quantityData
            ),
          })),
        };
      });
      AddToCartToast(selectedProductView, "boq");

      localStorage.setItem("selectedData", JSON.stringify(updatedData));
      return updatedData;
    });

    const currentProductKey = `${selectedCategory.category}-${selectedProductView.subcategory}-${selectedSubCategory1}-${selectedProductView.id}`;
    setSelectedAddonsMap((prev) => ({
      ...prev,
      [currentProductKey]: selectedAddons,
    }));
  };

  return (
    <div className="flex flex-col lg:flex-row justify-between gap-8">
      <div className="flex flex-col gap-2 w-full lg:w-[70%]">
        <p className="text-center font-semibold text-sm lg:text-lg mb-4">
          Select Your Addon
        </p>
        <div className="grid grid-cols-3 gap-2">
          {allSubcategories.map((room, id) => (
            <button
              key={id}
              onClick={() => setSelectedRoom(room)}
              className={`px-4 py-2 border text-xs lg:text-base rounded-md transition ${
                selectedRoom === room
                  ? "bg-gradient-to-r from-[#334A78] to-[#68B2DC] text-white"
                  : "bg-gray-200"
              }`}
            >
              {room}
            </button>
          ))}
        </div>
        <div className="flex justify-evenly items-center mt-auto pb-4">
          <button
            className="bg-[#374A75] rounded-lg text-xs md:text-sm py-2 px-10 border-2 border-black text-white"
            onClick={() => setShowAddon(false)}
          >
            Back
          </button>
          <button
            className="bg-[#374A75] rounded-lg text-xs md:text-sm py-2 px-10 border-2 border-black text-white"
            onClick={() => handleAddonClick()}
          >
            Done
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-4 border-2 border-gray-300 p-4 w-full lg:w-[30%] lg:min-h-full shadow-lg overflow-y-auto max-h-[500px] gradient-scrollbar">
        <Addon
          allAddons={allAddons}
          selectedRoom={selectedRoom}
          selectedData={selectedData}
          selectedProductView={selectedProductView}
          selectedAddons={selectedAddons}
          setSelectedAddons={setSelectedAddons}
          selectedAddonsMap={selectedAddonsMap}
          setSelectedAddonsMap={setSelectedAddonsMap}
        />
      </div>
    </div>
  );
}

export default AddonSelector;
