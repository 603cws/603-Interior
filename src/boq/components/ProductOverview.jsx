import React, { useEffect, useState, useRef, useMemo } from "react";
import { ToastContainer } from "react-toastify";
import { TbArrowBackUp } from "react-icons/tb";
import { MdOutlineKeyboardArrowRight } from "react-icons/md"; //MdOutlineKeyboardArrowLeft
import { normalizeKey } from "../utils/CalculateTotalPriceHelper";
import SelectArea from "./SelectArea";
import { useApp } from "../../Context/Context";
import { calculateTotalPrice } from "../utils/productUtils";
import { useParams, useNavigate } from "react-router-dom";
import RecommendComp from "./RecommendComp";
import Navbar from "./Navbar";
import ProfileCard from "./ProfileCard";
import { supabase } from "../../services/supabase";
import ThreeDViewer from "../../common-components/ThreeDViewer";

function ProductOverview() {
  const navigate = useNavigate();
  const baseImageUrl =
    "https://bwxzfwsoxwtzhjbzbdzs.supabase.co/storage/v1/object/public/addon/";
  const { id } = useParams(); // Extract product ID from URL
  console.log("id from useParams:", id);

  const [mainImageHovered, setMainImageHovered] = useState(false); // For main image hover effect
  const [hoveredImage, setHoveredImage] = useState(null); // For additional image hover effect
  const [showSelectArea, setShowSelectArea] = useState(false);
  const [selectedAreas, setSelectedAreas] = useState([]);
  const [showThreeViewer, setShowThreeViewer] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const profileRef = useRef(null);
  const iconRef = useRef(null); //used to close Profile Card when clicked outside of Profile Card area
  const [products, setProducts] = useState([]);

  const {
    selectedCategory,
    selectedSubCategory,
    selectedSubCategory1,
    selectedData,
    categoriesWithTwoLevelCheck,
    categories,
    subCategories,
    subCat1,
    quantityData,
    areasData,
    userResponses,
    selectedProductView,
    setShowProductView,
    setShowRecommend,
    showRecommend,
    productData,
    searchQuery,
    priceRange,
    setMinimizedView,
  } = useApp();

  const instructions = {
    Furniture: [
      "Wipe down all surfaces with a damp cloth and mild detergent.",
      "Vacuum upholstered furniture to remove dust and debris.",
      "Polish wooden furniture with appropriate polish.",
      "Remove all protective coverings and labels.",
    ],
    Flooring: [
      "Sweep or vacuum to remove dust.",
      "Clean with a floor cleaner appropriate for the flooring type.",
      "Avoid excessive moisture, especially on hardwood.",
    ],
    Lighting: [
      "Wipe down light fixtures with a damp cloth.",
      "Remove any dust or debris from light diffusers.",
      "Ensure all bulbs are clean and functioning.",
    ],
    HVAC: [
      "Clean air vents and grilles to remove dust and debris.",
      "Replace or clean air filters.",
      "Wipe down exterior surfaces of HVAC units.",
    ],
    "Smart Solutions": [
      "Wipe down screens and surfaces with a soft, dry cloth. Avoid liquids.",
      "Remove any protective films or labels.",
      "Ensure all connections are clean and secure.",
    ],
  };

  // Toggle profile card visibility
  const toggleProfile = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const fetchProduct = async () => {
      if (selectedProductView.length > 0) {
        setProducts([selectedProductView]); // Use selectedProductView if available
      } else if (id) {
        const { data, error } = await supabase
          .from("product_variants")
          .select("*")
          .eq("id", id)
          .single();

        if (error) {
          console.error("Error fetching product:", error);
        } else {
          if (data.image) {
            data.image = `${baseImageUrl}${data.image}`; // Append base URL to image
          }
          setProducts([data]); // Store fetched data in products
        }
      }
    };

    fetchProduct();
  }, [id, selectedProductView]); // Re-fetch when id or selectedProductView changes

  const product = products[0]; // Access the first product

  useEffect(() => {
    // Function to handle "Esc" key press
    const handleEscKey = (e) => {
      if (e.key === "Escape") {
        setShowProductView(false);
        // setSelectedPlan("Custom");
        setMinimizedView(true);
        navigate("/boq"); //new ProductOverview
      }
    };

    // Add event listener when component is mounted
    document.addEventListener("keydown", handleEscKey);

    // Cleanup event listener on component unmount
    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, []);

  // Close profile card when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // If clicked inside ProfileCard or on the Profile Icon, do nothing
      if (profileRef.current && profileRef.current.contains(event.target)) {
        return;
      }

      if (iconRef.current && iconRef.current.contains(event.target)) {
        return;
      }

      // Otherwise, close the profile card
      setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const getInstructions = (category) => {
    return instructions[category] || ["No specific instructions found."]; // Provide default message
  };

  const categoryInstructions = getInstructions(selectedCategory?.category);

  const additionalImagesArray = product?.additional_images
    ? JSON.parse(product?.additional_images).map(
        (imageName) => `${baseImageUrl}${imageName}`
      )
    : [];

  const isProductInCart = () => {
    // Check if selectedData is not empty or undefined
    if (!selectedData || selectedData.length === 0) {
      return false; // Return false if no data is available
    }

    // Proceed with the .some() method if selectedData is non-empty
    return selectedData.some((item) =>
      categoriesWithTwoLevelCheck.includes(item.category)
        ? item.id === product?.id &&
          item.category === selectedCategory?.category &&
          item.subcategory === selectedSubCategory
        : item.id === product?.id &&
          item.category === selectedCategory?.category &&
          item.subcategory === selectedSubCategory &&
          item.subcategory1 === selectedSubCategory1
    );
  };

  // console.log("Selected Data: ", selectedData);

  const findClosestKey = (targetKey, dataObject) => {
    if (!targetKey || !dataObject) return null;

    const normalizedTargetKey = normalizeKey(targetKey);
    const keys = Object.keys(dataObject);

    // Try to find an exact match first
    const exactMatch = keys.find(
      (key) => normalizedTargetKey === normalizeKey(key)
    );

    // If no exact match, find the closest one by partial matching
    return (
      exactMatch ||
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
      selectedCategory?.category === "Smart Solutions" ||
      selectedCategory?.category === "Lux"
    ) {
      // || selectedCategory?.category === "HVAC"
      return { quantity, price: product?.price || 0 }; //addonPrice
    } else if (
      selectedCategory?.category === "Partitions / Ceilings" ||
      selectedCategory?.category === "HVAC"
    ) {
      //currently this category is missing
      return { quantity, area, price: product?.price || 0 }; //addonPrice
    } else {
      return { area, price: product?.price || 0 }; //addonPrice
    }
  };

  const details = calculationDetails();

  // const allAddons = filteredProducts.flatMap((product) =>
  //   product.subcategory1 === selectedSubCategory1 &&
  //   Array.isArray(product.addons)
  //     ? product.addons
  //     : []
  // );

  function formatDimensions(dimensions) {
    if (!dimensions) {
      return "N/A";
    }
    return dimensions
      .split(",") // Split the dimensions by commas
      .map((dim) => dim.trim() + " cm") // Add "cm" after each number
      .join(" X "); // Join the dimensions with "X"
  }

  const totalPrice = useMemo(() => {
    if (
      !selectedCategory ||
      !selectedSubCategory ||
      !selectedSubCategory1 ||
      !quantityData ||
      !areasData ||
      !userResponses ||
      !product
    ) {
      return 0; // Or return null if needed
    }

    return calculateTotalPrice(
      null, // category parameter is not used.
      null, // subCat parameter is not used.
      null, // subcategory1 parameter is not used.
      selectedCategory,
      selectedSubCategory,
      selectedSubCategory1,
      quantityData,
      areasData,
      userResponses,
      product
    );
  }, [
    selectedCategory,
    selectedSubCategory,
    selectedSubCategory1,
    quantityData,
    areasData,
    userResponses,
    product,
  ]);

  const filteredProducts = useMemo(() => {
    // if (!selectedCategory) return false;
    // if (productData.length > 0 || priceRange.length > 0) return []; // Ensure it's an array

    return productData.filter((product) => {
      if (!product.product_variants || product.product_variants.length === 0) {
        return false;
      }

      const matchesVariant = product.product_variants.some((variant) => {
        const matchesSearch =
          variant.title?.toLowerCase().includes(searchQuery?.toLowerCase()) ||
          variant.details?.toLowerCase().includes(searchQuery?.toLowerCase());

        const matchesPrice =
          variant.price >= priceRange[0] && variant.price <= priceRange[1];

        return matchesSearch && matchesPrice;
      });

      const matchesCategory =
        selectedCategory?.category === "" ||
        product.category === selectedCategory?.category;
      return matchesVariant && matchesCategory;
    });
  }, [productData, searchQuery, priceRange, selectedCategory]);

  // Group products by category and subcategory
  const groupedProducts = useMemo(() => {
    const grouped = {};

    filteredProducts.forEach((product) => {
      const subcategories = product.subcategory
        .split(",")
        .map((sub) => sub.trim());

      subcategories.forEach((subcategory) => {
        if (!grouped[product.category]) {
          grouped[product.category] = {};
        }
        if (!grouped[product.category][subcategory]) {
          grouped[product.category][subcategory] = [];
        }
        grouped[product.category][subcategory].push(product);
      });
    });
    return grouped;
  }, [filteredProducts]);

  const allAddons = filteredProducts.flatMap((product) =>
    product.subcategory1 === selectedSubCategory1 &&
    Array.isArray(product.addons)
      ? product.addons
      : []
  );

  return (
    // grid
    <>
      <Navbar toggleProfile={toggleProfile} iconRef={iconRef} />
      <ToastContainer />
      {/* ThreeJS Viewer with reduced size */}
      {import.meta.env.MODE === "development" && showThreeViewer && (
        <ThreeDViewer onClose={() => setShowThreeViewer(false)} />
      )}

      <div
        className={`product-overview grid grid-cols-2 p-5 gap-1 ${
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
              // setSelectedPlan("Custom");
              setMinimizedView(true);
              navigate("/boq"); //new ProductOverview
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

          {/* Main image container */}
          <div
            className="w-3/5 h-3/4 mx-auto mb-2 flex items-center"
            onMouseEnter={() => setMainImageHovered(true)}
            onMouseLeave={() => setMainImageHovered(false)}
            style={{ zIndex: mainImageHovered ? 10 : 1 }}
          >
            <img
              src={hoveredImage || product?.image}
              className="object-fit h-96"
              alt={product?.title}
            />
          </div>

          {/* Additional images + View in 3D Button */}
          {additionalImagesArray.length > 0 && (
            <div className="flex items-center gap-3 mx-6 ml-16">
              {additionalImagesArray.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Angle ${idx + 1}`}
                  width={50}
                  height={50}
                  onMouseEnter={() => setHoveredImage(img)}
                  onMouseLeave={() => setHoveredImage(null)}
                  className="cursor-pointer rounded-lg border-2 border-transparent"
                />
              ))}
              {/* View in 3D Button */}
              <button
                className="ml-4 px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
                onClick={() => setShowThreeViewer(true)}
              >
                View in 3D
              </button>
            </div>
          )}
        </div>

        {/* grid component 2 */}
        <div className=" flex flex-col">
          {/* product info */}
          <div className="flex flex-col justify-center">
            <h2 className="text-xl font-bold">{product?.title}</h2>
            <span className="text-xs font-medium text-[#334A78] ">
              {product?.details}
            </span>
            <p className="text-md font-semibold">
              ₹ {product?.price?.toLocaleString("en-IN")}{" "}
              <span className="text-sm">/ Per Unit</span>
            </p>
            <br></br>
          </div>
          {/* final price section */}
          <div className="mt-1">
            <p className="text-lg font-medium text-[#334A78] ">Final Price</p>
            <p className="text-lg font-bold mb-3">
              ₹ {totalPrice.toLocaleString("en-IN")}
            </p>
            {details.quantity > 0 && (
              <p className="text-md font-medium text-[#334A78] mb-3">
                Total Quantity:{" "}
                <span className="border-[1px] py-1 border-[#334A78] text-[#1a1b1c] rounded-xl px-2 text-sm">
                  {details.quantity.toLocaleString("en-IN")}
                </span>{" "}
              </p>
            )}
            {details.area > 0 && (
              <p className="text-md font-medium text-[#334A78] mb-3">
                Total Area:{" "}
                <span className="border-[1px] py-1 border-[#334A78] text-[#1a1b1c] rounded-xl px-2 text-sm">
                  {details.area.toLocaleString("en-IN")}
                </span>{" "}
              </p>
            )}
            <button
              className=" border-[1.5px] border-[#212B36] px-2 py-1.5 text-lg w-2/5  mb-3 mt-5"
              onClick={
                () => setShowSelectArea(true)
                // /**/ handelSelectedData(
                //   products,
                //   // variant,
                //   selectedCategory,
                //   selectedSubCategory,
                //   selectedSubCategory1
                // )
              }
            >
              {isProductInCart() ? "Remove from BOQ " : "Add to BOQ"}
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
                {product?.manufacturer || "N/A"}
              </span>
            </div>
            {/* dimensions */}
            <div className="border-b-2 pt-2 pb-1">
              <p className="text-sm uppercase font-bold text-[#334A78] ">
                dimensions(H x l x W)
              </p>
              <span className="text-xs text-[#334A78] ">
                {formatDimensions(product?.dimensions)}
              </span>
            </div>
            <div className="border-b-2 pt-2 pb-1">
              <p className="text-sm uppercase font-bold text-[#334A78]">
                instruction
              </p>
              {categoryInstructions.length > 0 ? (
                <ul className="list-disc pl-5">
                  {categoryInstructions.map((instruction, index) => (
                    <li key={index} className="text-xs text-[#334A78]">
                      {instruction}
                    </li>
                  ))}
                </ul>
              ) : (
                <span className="text-xs text-[#334A78]">
                  No specific instructions available for this category.
                </span>
              )}
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
          image={product?.image}
          categories={categories}
          subCategories={subCategories}
          subCat1={subCat1}
          selectedAreas={selectedAreas}
          setSelectedAreas={setSelectedAreas}
          selectedProductView={product}
          selectedData={selectedData}
          categoriesWithTwoLevelCheck={categoriesWithTwoLevelCheck}
          allAddons={allAddons}
        />
      )}

      {showRecommend && ( //new ProductOverview
        <RecommendComp
          showRecommend={showRecommend}
          setShowRecommend={setShowRecommend}
        />
      )}

      {isOpen && (
        <div ref={profileRef}>
          <ProfileCard layout={false} />
        </div>
      )}

      {/* <div
        className={`addons px-5 my-3 ${
          showSelectArea ? "opacity-50 pointer-events-none" : "opacity-100"
        }`}
      >
        <h4 className="text-md font-semibold mb-2">ADDONS</h4>
        <Addon
          allAddons={allAddons}
          productID={selectedProductView.id}
          onAddonAdd={handleAddOnChange}  //moved to utils
        />
      </div> */}
    </>
  );
}

export default ProductOverview;
