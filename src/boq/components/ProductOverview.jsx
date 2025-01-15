import React, { useState } from "react";
import { TbArrowBackUp } from "react-icons/tb";
import { MdOutlineKeyboardArrowRight } from "react-icons/md"; //MdOutlineKeyboardArrowLeft
import {
  calculateTotalPriceHelper,
  normalizeKey,
} from "../utils/CalculateTotalPriceHelper";
import SelectArea from "./SelectArea";
import Addon from "./Addon";

function ProductOverview({
  selectedProductView,
  selectedCategory,
  selectedSubCategory,
  selectedSubCategory1,
  quantityData,
  areasData,
  setShowProductView,
  showRecommend,
  setShowRecommend,
  filteredProducts,
  handleAddOnChange,
  subCategories,
  handelSelectedData,
}) {
  const [mainImageHovered, setMainImageHovered] = useState(false); // For main image hover effect
  const [hoveredImage, setHoveredImage] = useState(null); // For additional image hover effect
  const [showSelectArea, setShowSelectArea] = useState(false);
  const [selectedAreas, setSelectedAreas] = useState([]);

  const baseImageUrl =
    "https://bwxzfwsoxwtzhjbzbdzs.supabase.co/storage/v1/object/public/addon/";

  const additionalImagesArray = selectedProductView.additional_images
    ? JSON.parse(selectedProductView.additional_images).map(
        (imageName) => `${baseImageUrl}${imageName}`
      )
    : [];

  const findClosestKey = (targetKey, dataObject) => {
    if (!targetKey || !dataObject) return null;

    const normalizedTargetKey = normalizeKey(targetKey);
    const keys = Object.keys(dataObject);

    return (
      keys.find((key) => normalizedTargetKey.includes(normalizeKey(key))) ||
      null
    );
  };

  const calculationDetails = () => {
    const normalizedSubCat =
      findClosestKey(selectedSubCategory, quantityData[0]) ||
      findClosestKey(selectedSubCategory, areasData[0]);

    const quantity = quantityData[0]?.[normalizedSubCat] || 0;
    const area = areasData[0]?.[normalizedSubCat] || 0;
    if (
      selectedCategory?.category === "Furniture" ||
      selectedCategory?.category === "HVAC" ||
      selectedCategory?.category === "Partitions / Ceilings"
    ) {
      return { quantity, price: selectedProductView.price }; //addonPrice
    } else {
      return { area, price: selectedProductView.price }; //addonPrice
    }
  };

  const details = calculationDetails();

  const calculateTotalPrice = () => {
    const total = calculateTotalPriceHelper(
      quantityData[0],
      areasData[0],
      selectedCategory?.category,
      selectedSubCategory
    );
    return total * selectedProductView.price;
  };

  const allAddons = filteredProducts.flatMap((product) =>
    product.subcategory1 === selectedSubCategory1 &&
    Array.isArray(product.addons)
      ? product.addons
      : []
  );
  return (
    // grid
    <>
      <div
        className={`grid grid-cols-2 p-5 gap-1 ${
          showSelectArea ? "opacity-50 pointer-events-none" : "opacity-100"
        }`}
      >
        {/* grid component 1 */}
        <div className="flex flex-col">
          <TbArrowBackUp
            size={30}
            className="cursor-pointer"
            onClick={() => {
              setShowProductView(false); // Open product view
            }}
          />
          <div className="flex mx-10 items-center text-[#334A78] text-sm">
            <span>{selectedCategory?.category}</span>
            <MdOutlineKeyboardArrowRight
              size={15}
              style={{ color: "#334A78" }}
            />
            <span>{selectedSubCategory}</span>
            <MdOutlineKeyboardArrowRight
              size={15}
              style={{ color: "#334A78" }}
            />
            <span>{selectedSubCategory1}</span>
          </div>
          {/* main div for image */}
          <div
            className="w-3/5 h-3/4 mx-auto mb-2 flex items-center"
            onMouseEnter={() => setMainImageHovered(true)}
            onMouseLeave={() => setMainImageHovered(false)}
            style={{
              zIndex: mainImageHovered ? 10 : 1,
            }}
          >
            <img
              src={hoveredImage || selectedProductView.image}
              // width={600}
              // height={600}
              className="object-fit h-5/6"
              alt={selectedProductView.title}
            />
          </div>
          {/* flex box for other images  */}
          {additionalImagesArray.length > 0 && (
            <div className="flex justify-start gap-2 mx-6 ml-16">
              {additionalImagesArray.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Angle ${idx + 1}`}
                  width={50}
                  height={50}
                  onMouseEnter={() => setHoveredImage(img)} // Updates hoveredImage on hover
                  onMouseLeave={() => setHoveredImage(null)} // Reverts to main image on leave
                  // className="w-10 h-10 object-cover cursor-pointer rounded-lg border-2 border-transparent"
                />
              ))}
            </div>
          )}
        </div>
        {/* grid component 2 */}
        <div className=" flex flex-col">
          {/* product info */}
          <div className="flex flex-col justify-center">
            <h2 className="text-xl font-bold">{selectedProductView.title}</h2>
            <span className="text-xs font-medium text-[#334A78] ">
              {selectedProductView.details}
            </span>
            <p className="text-md font-semibold">
              ₹ {selectedProductView.price}{" "}
              <span className="text-sm">/ Per Unit</span>
            </p>
            <br></br>
          </div>
          {/* final price section */}
          <div className="mt-1">
            <p className="text-lg font-medium text-[#334A78] ">Final Price</p>
            <p className="text-lg font-bold mb-3">₹ {calculateTotalPrice()}</p>
            <p className="text-md font-medium text-[#334A78] mb-3">
              Total Quantity:{" "}
              <span className="border-[1px] py-1 border-[#334A78] text-[#1a1b1c] rounded-xl px-2 text-sm">
                {details.quantity}
              </span>{" "}
            </p>
            <button
              className=" border-[1.5px] border-[#212B36] px-2 py-1.5 text-lg w-2/5  mb-3 mt-5"
              onClick={
                () => setShowSelectArea(true)
                // /**/ handelSelectedData(
                //   selectedProductView,
                //   // variant,
                //   selectedCategory,
                //   selectedSubCategory,
                //   selectedSubCategory1
                // )
              }
            >
              Add to cart
            </button>
          </div>
          {/* product description */}
          <div className="mt-5">
            <h3 className="text-lg uppercase font-bold text-[#334A78] border-b-2">
              Product Details
            </h3>
            {/* manufacture */}
            <div className="border-b-2 pt-2 pb-1">
              <p className="text-sm uppercase font-bold text-[#334A78]">
                Manufacturer
              </p>
              <span className="text-xs text-[#334A78] ">
                Name of the manufacturer
              </span>
            </div>
            {/* dimensions */}
            <div className="border-b-2 pt-2 pb-1">
              <p className="text-sm uppercase font-bold text-[#334A78] ">
                dimensions(H x l x W)
              </p>
              <span className="text-xs text-[#334A78] ">dimension value</span>
            </div>
            <div className="border-b-2 pt-2 pb-1">
              <p className="text-sm uppercase font-bold text-[#334A78]">
                instruction
              </p>
              <span className="text-xs text-[#334A78] ">
                Lorem ipsum dolor sit amet.
              </span>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`fixed z-10 right-0 rotate-90 book-tour-btn ${
          showSelectArea ? "opacity-50 pointer-events-none" : "opacity-100"
        }`}
      >
        <button
          //   onClick={() => setRequestTour(true)}
          onClick={() => setShowRecommend(true)}
          className="text-base text-md  bg-[#1A3A36] text-white  lg:px-4 py-2  rounded-3xl "
        >
          Recommendation
        </button>
      </div>

      {showSelectArea && (
        <SelectArea
          setShowSelectArea={setShowSelectArea}
          image={selectedProductView.image}
          subCategories={subCategories}
          selectedAreas={selectedAreas}
          setSelectedAreas={setSelectedAreas}
          selectedProductView={selectedProductView}
          selectedCategory={selectedCategory}
          selectedSubCategory1={selectedSubCategory1}
          handelSelectedData={handelSelectedData}
        />
      )}

      <div
        className={`addons px-5 my-3 ${
          showSelectArea ? "opacity-50 pointer-events-none" : "opacity-100"
        }`}
      >
        <h4 className="text-md font-semibold mb-2">ADDONS</h4>
        <Addon
          allAddons={allAddons}
          selectedCategory={selectedCategory}
          selectedSubCategory={selectedSubCategory}
          productID={selectedProductView.id}
          onAddonAdd={handleAddOnChange}
        />
      </div>
    </>
  );
}

export default ProductOverview;
