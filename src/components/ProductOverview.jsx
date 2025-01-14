import React, { useState } from 'react';
import { TbArrowBackUp } from "react-icons/tb";
import { calculateTotalPriceHelper, normalizeKey } from '../boq/utils/CalculateTotalPriceHelper';

function ProductOverview({ selectedProductView, selectedCategory, selectedSubCategory, quantityData, areasData, setShowProductView }) {
  const [mainImageHovered, setMainImageHovered] = useState(false); // For main image hover effect
  const [hoveredImage, setHoveredImage] = useState(null); // For additional image hover effect
  const baseImageUrl = 'https://bwxzfwsoxwtzhjbzbdzs.supabase.co/storage/v1/object/public/addon/';

  const additionalImagesArray = selectedProductView.additional_images
    ? JSON.parse(selectedProductView.additional_images).map(
      (imageName) => `${baseImageUrl}${imageName}`
    )
    : [];

  const findClosestKey = (targetKey, dataObject) => {
    if (!targetKey || !dataObject) return null;

    const normalizedTargetKey = normalizeKey(targetKey);
    const keys = Object.keys(dataObject);

    return keys.find((key) => normalizedTargetKey.includes(normalizeKey(key))) || null;
  };

  const calculationDetails = () => {
    const normalizedSubCat =
      findClosestKey(selectedSubCategory, quantityData[0]) ||
      findClosestKey(selectedSubCategory, areasData[0]);

    const quantity = quantityData[0]?.[normalizedSubCat] || 0;
    const area = areasData[0]?.[normalizedSubCat] || 0;
    if (selectedCategory?.category === "Furniture" || selectedCategory?.category === "HVAC" || selectedCategory?.category === "Partitions / Ceilings") {
      return { quantity, price: selectedProductView.price };  //addonPrice
    } else {
      return { area, price: selectedProductView.price };  //addonPrice
    }
  };

  const details = calculationDetails();

  const calculateTotalPrice = () => {
    const total = calculateTotalPriceHelper(quantityData[0], areasData[0], selectedCategory?.category, selectedSubCategory);
    return total * selectedProductView.price;
  };

  console.log(additionalImagesArray);

  return (
    // grid
    <>
      <div className="grid grid-cols-2 p-5">
        {/* grid component 1 */}
        <div className=" ">
          <TbArrowBackUp size={30}
            className="cursor-pointer"
            onClick={() => {
              setShowProductView(false); // Open product view
            }} />
          {/* main div for image */}
          <div className="flex items-center justify-center"
            onMouseEnter={() => setMainImageHovered(true)}
            onMouseLeave={() => setMainImageHovered(false)}
            style={{
              // transform: mainImageHovered ? 'scale(1.3)' : 'scale(1)',
              zIndex: mainImageHovered ? 10 : 1,
            }}
          >
            <img
              src={hoveredImage || selectedProductView.image}
              // width={600}
              // height={600}
              className="object-cover"
              alt={selectedProductView.title}
            />
          </div>
          {/* flex box for other images  */}
          {additionalImagesArray.length > 0 && (
            <div className="flex justify-start gap-1 mx-6">
              {additionalImagesArray.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Angle ${idx + 1}`}
                  width={100}
                  height={100}
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
            <h2 className="text-[36px] font-bold mb-3">{selectedProductView.title}</h2>
            <span className="text-2xl font-medium text-[#334A78] mb-3">
              {selectedProductView.details}
            </span>
            <p className="text-3xl font-semibold mb-2">₹ {selectedProductView.price} <span className="text-sm">/ Per Unit</span></p>
            <br></br>
            {/* <span className="text-2xl font-semibold line-through mb-3">
            Mrp 13202
          </span> */}
          </div>
          {/* final price section */}
          <div className="mt-3">
            <p className="text-2xl font-medium text-[#334A78]  mb-3">
              Final Price
            </p>
            <p className="text-3xl font-bold mb-3">₹ {calculateTotalPrice()}</p>
            <p className="text-2xl font-medium text-[#334A78]  mb-3">
              Total Quantity{" "}
              <span className="border-2 py-2 border-[#334A78] text-[#1a1b1c] rounded-xl px-5 ">
                {details.quantity}
              </span>{" "}
            </p>
            <button className=" border-2 border-[#212B36] p-5 text-2xl w-1/2  mb-3 mt-2">
              Add to cart
            </button>
          </div>
          {/* product description */}
          <div className="mt-5">
            <h2 className="text-3xl uppercase font-bold text-[#334A78]  border-b-2 mb-3">
              Product Details
            </h2>
            {/* manufacture */}
            <div className="border-b-2">
              <p className="text-2xl uppercase font-bold text-[#334A78] mb-3">
                Manufacturer
              </p>
              <span className="text-xl text-[#334A78] mb-2">
                Name of the manufacturer
              </span>
            </div>
            {/* dimensions */}
            <div className="border-b-2 mt-3">
              <p className="text-2xl uppercase font-bold text-[#334A78] mb-3">
                dimensions(H x l x W)
              </p>
              <span className="text-xl text-[#334A78] mb-2">
                dimension value
              </span>
            </div>
            {/* instruction  */}
            {/* <div>
            <p> instruction</p>
            <span>instruction text</span>
          </div> */}
            <div className="border-b-2 mt-3">
              <p className="text-2xl uppercase font-bold text-[#334A78] mb-3">
                instruction
              </p>
              <span className="text-xl text-[#334A78] mb-2">
                Lorem ipsum dolor sit amet.
              </span>
            </div>
          </div>
        </div>
      </div >

      <div className="fixed z-10 right-0 rotate-90 book-tour-btn ">
        <button
          //   onClick={() => setRequestTour(true)}
          className="text-base text-md  bg-[#1A3A36] text-white  lg:px-4 py-2  rounded-3xl "
        >
          Recommendation
        </button>
      </div>
      {/* <div className=" w-60 h-64 bg-white flex-col justify-center items-center inline-flex overflow-hidden">
        <div className=" w-60 h-64 relative flex-col justify-start items-start flex overflow-hidden">
          <img className="relative  w-60 h-64" src="images/chair/1.png" />
          <div className="absolute bottom-10 right-10 w-36 px-16 py-4 bg-white rounded-sm border border-gray-800 justify-center items-center gap-2.5 inline-flex">
            <div className=" text-center text-gray-800 text-xs font-normal font-['Poppins'] uppercase leading-none tracking-wider">
              aDD TO Cart
            </div>
          </div>
        </div>
      </div> */}
    </>
  );
}

export default ProductOverview;
