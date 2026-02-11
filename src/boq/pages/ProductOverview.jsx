import { useEffect, useState, useRef, useMemo } from "react";
import { ToastContainer } from "react-toastify";
import { MdKeyboardArrowDown } from "react-icons/md";
import { normalizeKey } from "../utils/CalculateTotalPriceHelper";
import SelectArea from "../components/SelectArea";
import { calculateTotalPrice } from "../utils/productUtils";
import { useParams, useNavigate } from "react-router-dom";
import RecommendComp from "../components/RecommendComp";
import Navbar from "../components/Navbar";
import ProfileCard from "../components/ProfileCard";
import { supabase } from "../../services/supabase";
import ThreeDViewer from "../../common-components/ThreeDViewer";
import { motion, AnimatePresence } from "framer-motion";
import { selectAreaAnimation } from "../constants/animations";
import YouMayAlsoLike from "../components/YouMayAlsoLike";
import {
  categoriesWithTwoLevelCheck,
  priceRange,
} from "../../constants/constant";
import { baseImageUrl } from "../../utils/HelperConstant";
import { useBoqApp } from "../../Context/BoqContext";
import Spinner from "../../common-components/Spinner";
import { handleError } from "../../common-components/handleError";
import BackButton from "../../common-components/BackButton";

function ProductOverview() {
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [showBackground, setShowBackground] = useState(false);
  const [mainImageHovered, setMainImageHovered] = useState(false);
  const [hoveredImage, setHoveredImage] = useState(null);
  const [showSelectArea, setShowSelectArea] = useState(false);
  const [selectedAreas, setSelectedAreas] = useState([]);
  const [showThreeViewer, setShowThreeViewer] = useState(false);
  const [cat, setCat] = useState("");
  const [subCat, setSubCat] = useState("");
  const [subCat1, setSubCat1] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [isProfileCard, setIsProfileCard] = useState(false);
  const [showBoqPrompt, setShowBoqPrompt] = useState(false);
  const [showRecommend, setShowRecommend] = useState(false);

  const profileRef = useRef(null);
  const iconRef = useRef(null);
  const recommendationref = useRef(null);
  const targetRef = useRef(null);

  const navigate = useNavigate();
  const { id } = useParams();

  const {
    selectedCategory,
    selectedSubCategory,
    selectedSubCategory1,
    setSelectedCategory,
    setSelectedSubCategory,
    setSelectedSubCategory1,
    selectedData,
    quantityData,
    areasData,
    userResponses,
    selectedProductView,
    productData,
    searchQuery,
    selectedPlan,
    formulaMap,
    setSelectedProductView,
    seatCountData,
    loading,
  } = useBoqApp();

  const toggleProfile = () => setIsOpen((p) => !p);

  const scrollToSection = () => {
    const topOffset = 100;
    const elementPosition = targetRef.current.getBoundingClientRect().top;
    window.scrollTo({
      top: window.pageYOffset + elementPosition - topOffset,
      behavior: "smooth",
    });
  };

  // click-outside for profile
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e) => {
      if (
        profileRef.current?.contains(e.target) ||
        iconRef.current?.contains(e.target)
      )
        return;
      setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // click-outside for recommendation
  useEffect(() => {
    if (!showRecommend) return;
    const handleClickOutside = (e) => {
      if (recommendationref.current?.contains(e.target)) return;
      setShowRecommend(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showRecommend, setShowRecommend]);

  // fetch primary product
  useEffect(() => {
    const fetchProduct = async () => {
      if (Object.keys(selectedProductView).length) {
        setProducts([selectedProductView]);
        setCat(selectedCategory);
        setSubCat(selectedSubCategory);
        setSubCat1(selectedSubCategory1);
        sessionStorage.setItem(
          "productData",
          JSON.stringify({
            category: selectedCategory,
            subCategory: selectedSubCategory,
            subCategory1: selectedSubCategory1,
          }),
        );
      } else if (id) {
        const { data, error } = await supabase
          .from("product_variants")
          .select("*, products(*)")
          .eq("id", id)
          .single()
          .neq("productDisplayType", "ecommerce");

        if (error) {
          handleError(error, {
            prodMessage: "Something went wrong. Please try again.",
          });
          return;
        }

        if (data.image) data.image = `${baseImageUrl}${data.image}`;

        const subCategoriesArray = data?.products?.subcategory
          ? data.products.subcategory.split(",").map((item) => item.trim())
          : [];

        setProducts([
          {
            ...data,
            subcategory: subCategoriesArray,
          },
        ]);

        const stored = JSON.parse(sessionStorage.getItem("productData"));
        if (stored) {
          setCat(stored.category);
          setSubCat(stored.subCategory);
          setSubCat1(stored.subCategory1);
        }
      }
    };
    fetchProduct();
  }, [
    id,
    selectedCategory,
    selectedSubCategory,
    selectedSubCategory1,
    selectedProductView,
  ]);

  const product = products[0];

  const additionalImagesArray = product?.additional_images
    ? JSON.parse(product.additional_images).map(
        (img) => `${baseImageUrl}${img}`,
      )
    : [];

  const isProductInCart = () =>
    !!selectedData?.length &&
    selectedData.some((item) =>
      categoriesWithTwoLevelCheck.includes(item.category)
        ? item.id === product?.id &&
          item.category === cat?.category &&
          item.subcategory === subCat
        : item.id === product?.id &&
          item.category === cat?.category &&
          item.subcategory === subCat &&
          item.subcategory1 === subCat1,
    );

  const findClosestKey = (targetKey, dataObject) => {
    if (!targetKey || !dataObject) return null;
    const normalizedTargetKey = normalizeKey(targetKey);
    const keys = Object.keys(dataObject);
    const exact = keys.find((k) => normalizedTargetKey === normalizeKey(k));
    return (
      exact ||
      keys.find((k) => normalizedTargetKey.includes(normalizeKey(k))) ||
      null
    );
  };

  const calculationDetails = () => {
    const normalizedSubCat =
      findClosestKey(subCat, quantityData[0]) ||
      findClosestKey(subCat, areasData[0]);
    const quantity = quantityData[0]?.[normalizedSubCat] || 0;
    const area = areasData[0]?.[normalizedSubCat] || 0;
    const seatCount = seatCountData?.[normalizedSubCat] || 0;
    const price = product?.price || 0;
    const category = cat?.category;

    if (["Furniture", "Smart Solutions", "Lux"].includes(category))
      return { quantity, price, seatCount };

    if (["Partitions / Ceilings", "HVAC"].includes(category))
      return { quantity, area, price, seatCount };

    if (category === "Civil / Plumbing" && subCat1 !== "Tile")
      return { quantity, price, seatCount };

    return { area, price, seatCount };
  };

  const details = calculationDetails();

  const formatDimensions = (dimensions) =>
    dimensions
      ? dimensions
          .split(",")
          .map((d) => `${d.trim()} cm`)
          .join(" X ")
      : "N/A";

  const totalPrice = useMemo(() => {
    if (
      !cat ||
      !subCat ||
      !subCat1 ||
      !quantityData ||
      !areasData ||
      !userResponses ||
      !product
    )
      return 0;

    return calculateTotalPrice(
      null,
      null,
      null,
      cat,
      subCat,
      subCat1,
      quantityData,
      areasData,
      userResponses,
      product,
      formulaMap,
      seatCountData,
    );
  }, [
    cat,
    subCat,
    subCat1,
    quantityData,
    areasData,
    userResponses,
    product,
    formulaMap,
    seatCountData,
  ]);

  const filteredProducts = useMemo(
    () =>
      productData.filter((p) => {
        const variants = p.product_variants || [];
        if (!variants.length) return false;

        const matchesVariant = variants.some((v) => {
          const q = searchQuery?.toLowerCase() || "";
          const matchesSearch =
            v.title?.toLowerCase().includes(q) ||
            v.details?.toLowerCase().includes(q);
          const matchesPrice =
            v.price >= priceRange[0] && v.price <= priceRange[1];
          return matchesSearch && matchesPrice;
        });

        const matchesCategory = !cat?.category || p.category === cat.category;
        return matchesVariant && matchesCategory;
      }),
    [productData, searchQuery, cat],
  );

  const allAddons = filteredProducts.flatMap((p) =>
    p.subcategory1 === subCat1 && Array.isArray(p.addons) ? p.addons : [],
  );

  // related products
  useEffect(() => {
    if (!cat?.category || !subCat || !product?.id) return;

    const fetchRelated = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*, product_variants(*)")
        .eq("category", cat.category)
        .like("subcategory", `%${subCat}%`)
        .eq("subcategory1", subCat1);

      if (error) {
        handleError(error, {
          prodMessage: "Something went wrong. Please try again.",
        });
        return;
      }

      const filtered = data
        .map((p) => ({
          ...p,
          product_variants: (p.product_variants || []).filter(
            (v) =>
              v.id !== product?.id &&
              v.status === "approved" &&
              v.image &&
              v.productDisplayType !== "ecommerce" &&
              v.title,
          ),
        }))
        .filter((p) => p.product_variants.length);
      setRelatedProducts(filtered);
    };

    fetchRelated();
  }, [cat?.category, subCat, subCat1, product?.id]);

  const formatKey = (key) => key.replace(/([A-Z])/g, " $1").trim();

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <Navbar
        toggleProfile={toggleProfile}
        iconRef={iconRef}
        isProfileCard={isProfileCard}
        setIsProfileCard={setIsProfileCard}
        showBoqPrompt={showBoqPrompt}
        setShowBoqPrompt={setShowBoqPrompt}
      />
      <div className="px-2 md:px-6 md:pr-10 lg:pr-20 3xl:px-40 font-Poppins">
        <ToastContainer />
        {import.meta.env.MODE === "development" && showThreeViewer && (
          <ThreeDViewer onClose={() => setShowThreeViewer(false)} />
        )}

        <div
          className={`product-overview grid grid-cols-1 md:grid-cols-2 p-2 lg:p-5 gap-1 ${
            showSelectArea ? "opacity-50 pointer-events-none" : "opacity-100"
          }`}
        >
          {/* LEFT */}
          <div className="flex flex-col md:gap-0">
            <div className="flex lg:mx-10 items-center text-[#334A78] mt-1">
              <button
                onClick={() => setShowRecommend(true)}
                className="md:hidden ml-auto "
              >
                <img src="/images/recommend.png" alt="recommend mobile" />
              </button>
            </div>

            <div className="flex items-center">
              <BackButton
                label="Back"
                onClick={() => {
                  setSelectedCategory(cat);
                  setSelectedSubCategory(subCat);
                  setSelectedSubCategory1(subCat1);
                  navigate("/boq", { state: { minimizedView: true } });
                }}
                className="mt-3 text-black"
              />
            </div>

            <div
              className="w-3/5 h-3/4 mx-auto mb-2 flex items-center justify-center"
              onMouseEnter={() => setMainImageHovered(true)}
              onMouseLeave={() => setMainImageHovered(false)}
              style={{ zIndex: mainImageHovered ? 10 : 1 }}
            >
              <img
                src={hoveredImage || product?.image}
                className="object-fit h-80 lg:h-96 max-h-full"
                alt={product?.title}
              />
            </div>

            {additionalImagesArray.length > 0 && (
              <div className="flex flex-wrap items-center gap-1 mt-3">
                {additionalImagesArray.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`Angle ${idx + 1}`}
                    onMouseEnter={() => setHoveredImage(img)}
                    onMouseLeave={() => setHoveredImage(null)}
                    className="cursor-pointer border-2 border-[#385682] h-full max-w-[40px] sm:max-w-[60px] md:max-w-[80px] lg:max-w-[100px] xl:max-w-[120px]"
                  />
                ))}
                {import.meta.env.MODE === "development" && (
                  <button
                    className="ml-4 px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
                    onClick={() => setShowThreeViewer(true)}
                  >
                    View in 3D
                  </button>
                )}
              </div>
            )}
          </div>

          {/* RIGHT */}
          <div className="flex flex-col mt-2 md:mt-10">
            <div className="flex flex-col justify-center border-b border-[#CCCCCC]">
              <h2 className="text-sm lg:text-xl font-bold capitalize">
                {product?.title}
              </h2>
              {product?.information?.ShortDescription && (
                <p className="font-medium lg:w-3/4 text-[#334A78] lg:mb-2 md:max-w-xs lg:max-w-full">
                  {product.information.ShortDescription}
                </p>
              )}
              <p className="text-sm md:text-base font-semibold lg:mb-2">
                ₹ {product?.price?.toLocaleString("en-IN")}{" "}
                <span className="text-sm">/ Per Unit</span>
              </p>
            </div>

            <div className="mt-1">
              <p className="text-sm lg:text-lg font-medium text-[#334A78] ">
                Final Price
              </p>
              <p className="text-sm lg:text-lg font-bold mb-3">
                ₹ {totalPrice.toLocaleString("en-IN")}
              </p>

              {details.quantity > 0 && (
                <p className="text-md font-medium text-[#334A78] mb-1 lg:mb-3">
                  Total Quantity:{" "}
                  <span className="border-[1px] py-1 border-[#CCD2DD] text-[#1a1b1c] rounded-md px-2 text-sm">
                    {details.quantity.toLocaleString("en-IN")}
                  </span>{" "}
                </p>
              )}

              {details.area > 0 && (
                <p className="text-xs lg:text-base font-medium text-[#334A78] mb-1 lg:mb-3">
                  Total Area:{" "}
                  <span className="border-[1px] py-1 border-[#334A78] text-[#1a1b1c] rounded-xl px-2 text-xs lg:text-sm">
                    {details.area.toLocaleString("en-IN")}
                  </span>{" "}
                </p>
              )}

              {details.seatCount > 0 &&
                subCat1 === "Chair" &&
                subCat !== "Linear Workstation" &&
                subCat !== "L-Type Workstation" && (
                  <p className="text-xs lg:text-base font-medium text-[#334A78] mb-1 lg:mb-3">
                    Seat Count:
                    <span className="border-[1px] py-1 border-[#334A78] text-[#1a1b1c] rounded-xl px-2 text-xs lg:text-sm">
                      {details.seatCount.toLocaleString("en-IN")}
                    </span>
                  </p>
                )}

              <button
                className="border-2 lg:border-[1.5px] border-[#212B36] px-2 py-1.5 text-sm lg:text-lg w-full md:w-2/5 mb-1 md:mb-3 mt-2 md:mt-5 rounded-sm hover:scale-105 transition duration-300"
                onClick={() => setShowSelectArea(true)}
              >
                {isProductInCart() ? "Remove from BOQ " : "Add to BOQ"}
              </button>
            </div>

            <div className="mt-2 md:mt-5">
              <h3 className="text-sm md:text-lg uppercase font-bold text-[#334A78]">
                Product Details:
              </h3>

              {cat?.category === "Furniture" && (
                <div className="border-t border-[#E2E2E2] pt-2 pb-1">
                  <p className="text-xs md:text-sm capitalize font-bold text-[#334A78]">
                    Manufacturer
                  </p>
                  <span className="text-xs text-[#334A78] ">
                    {product?.manufacturer || "N/A"}
                  </span>
                </div>
              )}

              <div className="border-t border-[#E2E2E2] pt-2 pb-1">
                <p className="text-xs md:text-sm capitalize font-bold text-[#334A78] ">
                  dimensions (H x L x W)
                </p>
                <span className="text-xs text-[#334A78]">
                  {formatDimensions(product?.dimensions)}
                </span>
              </div>

              <div className="border-t border-[#E2E2E2] pt-2 pb-1">
                <p className="text-xs md:text-sm capitalize font-bold text-[#334A78]">
                  Color
                </p>
                <span className="text-xs text-[#334A78]">
                  {product?.information?.ProductColor || "N/A"}
                </span>
              </div>

              <div className="border-y border-[#E2E2E2] pt-2 pb-1">
                <p className="text-xs md:text-sm capitalize font-bold text-[#334A78]">
                  Product Weight
                </p>
                <span className="text-xs text-[#334A78]">
                  {product?.information?.ProductWeight || "N/A"}
                </span>
              </div>

              <div className="text-[#334A78] pt-4 flex items-center gap-1">
                <span
                  className="flex items-center gap-1 cursor-pointer hover:underline"
                  onClick={scrollToSection}
                >
                  <MdKeyboardArrowDown />
                  <span>See more</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {!showRecommend && (
          <div
            className={`fixed font-Poppins z-10 right-0 rotate-90 book-tour-btn ${
              showSelectArea ? "opacity-50 pointer-events-none" : "opacity-100"
            }`}
          >
            <button
              onClick={() => setShowRecommend(true)}
              className="hidden md:block text-sm bg-[#334A78] text-white px-4 lg:px-4 py-2 rounded-lg"
            >
              Recommendation
            </button>
          </div>
        )}

        <AnimatePresence>
          {showSelectArea && (
            <motion.div
              variants={selectAreaAnimation}
              initial="initial"
              animate="animate"
              exit="exit"
              className={`fixed inset-0 flex justify-center items-center z-[1000] transition-opacity duration-300 ${
                showBackground ? "bg-black bg-opacity-30" : "bg-transparent"
              }`}
              onAnimationComplete={(def) =>
                def === "animate" && setShowBackground(true)
              }
            >
              <SelectArea
                setShowSelectArea={setShowSelectArea}
                image={product?.image}
                selectedAreas={selectedAreas}
                setSelectedAreas={setSelectedAreas}
                selectedProductView={product}
                selectedData={selectedData}
                allAddons={allAddons}
                setShowBackground={setShowBackground}
                selectedCategory={cat}
                selectedSubCategory={subCat}
                selectedSubCategory1={subCat1}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {showRecommend && (
          <div ref={recommendationref}>
            <RecommendComp
              setShowRecommend={setShowRecommend}
              currentProduct={product}
              manufacturer={product?.manufacturer}
            />
          </div>
        )}

        <AnimatePresence>
          {isOpen && (
            <div ref={profileRef}>
              <ProfileCard
                layout={false}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                iconRef={iconRef}
                selectedPlan={selectedPlan}
              />
            </div>
          )}
        </AnimatePresence>

        <div className="mt-10 py-4 md:px-6">
          <h2 className="text-xl font-semibold mb-2">You may also like</h2>
          {relatedProducts.length > 0 ? (
            <YouMayAlsoLike
              products={relatedProducts}
              setSelectedProductView={setSelectedProductView}
            />
          ) : (
            <p className="text-center text-gray-500">No products found</p>
          )}
        </div>

        <div
          ref={targetRef}
          className="py-2 px-2 md:px-6 text-[#334A78] font-Poppins pb-16"
        >
          <div className="py-2 uppercase font-bold border-b border-[#E2E2E2]">
            Product Information
          </div>

          {product?.information &&
            Object.entries(product.information)
              .filter(([, v]) => v && v.trim() !== "")
              .map(([k, v]) => (
                <ProductInfo key={k} title={formatKey(k)} value={v} />
              ))}

          {product?.additonalinformation &&
            Object.entries(product.additonalinformation)
              .filter(([, v]) => v && v.trim() !== "")
              .map(([k, v]) => (
                <ProductInfo key={k} title={formatKey(k)} value={v} />
              ))}

          {cat?.category === "Furniture" && (
            <ProductInfo
              title="Manufacturer"
              value={product?.manufacturer || "N/A"}
            />
          )}

          <div className="border-[#E2E2E2] py-2 pt-6 gap-4 flex flex-col">
            <p className="text-xs md:text-sm capitalize font-bold text-[#334A78]">
              Product Description
            </p>
            <span className="text-sm text-[#334A78]">
              {product?.details || "N/A"}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductOverview;

function ProductInfo({ title, value, bothBorder = false }) {
  return (
    <div
      className={`border-[#E2E2E2] py-2 flex justify-between ${
        bothBorder ? "border-y" : "border-b"
      }`}
    >
      <p className="text-xs md:text-sm capitalize font-bold text-[#334A78] flex-1">
        {title}
      </p>
      <span className="text-sm text-[#334A78] flex-1 text-right">{value}</span>
    </div>
  );
}
