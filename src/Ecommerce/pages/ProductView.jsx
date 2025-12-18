import { useEffect, useState, useRef } from "react";
import {
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdOutlineCancel,
  MdOutlineKeyboardArrowRight,
} from "react-icons/md"; //MdOutlineKeyboardArrowLeft
import { AiFillStar } from "react-icons/ai";
import { useLocation, useParams } from "react-router-dom";
import { supabase } from "../../services/supabase";
import { useNavigate } from "react-router-dom";
import ReusableSwiper from "../components/ReusableSwiper";
import { useApp } from "../../Context/Context";
import BottomTabs from "../components/BottomTabs";
import Header from "../components/Header";
import { AiFillHeart } from "react-icons/ai";
import { GoHeart } from "react-icons/go";
import { useHandleAddToCart } from "../../utils/HelperFunction";
import { ToastContainer } from "react-toastify";
import SpinnerFullPage from "../../common-components/SpinnerFullPage";
import CompareProducts from "../components/CompareProducts";
import toast from "react-hot-toast";
import ProductReview from "../components/ProductReview";
import { showLimitReachedToast } from "../../utils/AddToCartToast";
import { HandThumbUpIcon, HandThumbDownIcon } from "@heroicons/react/24/solid";
import {
  HandThumbUpIcon as HandThumbUpOutline,
  HandThumbDownIcon as HandThumbDownOutline,
} from "@heroicons/react/24/outline";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import DetailedReview from "../components/DetailedReview";
import { useEcomApp } from "../../Context/ecomContext";

function ProductView() {
  const [mainImageHovered, setMainImageHovered] = useState(false); // For main image hover effect
  const [hoveredImage, setHoveredImage] = useState(null); // For additional image hover effect
  const [product, setproduct] = useState();
  const [similarProducts, setSimilarProducts] = useState();
  const [productsMayLike, setProductsMayLike] = useState();
  const [productqunatity, setProductquantity] = useState(1);
  const [isloading, setIsloading] = useState(false);
  const [showCompare, setShowCompare] = useState(false);
  const [isReview, setIsReview] = useState(false);
  const [productReviews, setProductReviews] = useState([]);
  const [selectedReview, setSelectedReview] = useState(null);
  const [isCarted, setIsCarted] = useState();
  const [expandedStates, setExpandedStates] = useState([]);
  const [clampedStates, setClampedStates] = useState([]);
  const contentRefs = useRef([]);

  const [isExpanded, setIsExpanded] = useState(false);
  const [isExpanded2, setIsExpanded2] = useState(false);

  const [detailedMode, setDetailedMode] = useState("normal"); // "normal" or "grid"
  const [gridViewReview, setGridViewReview] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const offers = [
    "Flat ₹50 Off + Free Surprise Gift On All Prepaid Offers 🎁",
    "Additional 5% Off On New Arrivals Use Code LOOKO5 🎁",
    "FLAT 10% OFF on PARTY BAGS collection, Use Code: PARTY10 🎁",
  ];

  const navigate = useNavigate();
  const location = useLocation();
  const { handleAddToCart } = useHandleAddToCart();
  const { compare, setCompare } = useEcomApp();

  //   get the product based on the product id
  const { id: productid } = useParams();
  const fromPage = location.state?.from || "products";

  const { isAuthenticated, accountHolder } = useApp();
  const { cartItems, localcartItems } = useEcomApp();
  const hasReviews = productReviews && productReviews.length > 0;

  async function fetchproductbyid() {
    try {
      setIsloading(true);
      const { data, error } = await supabase
        .from("product_variants")
        .select("*,product_id(*)") // or specify fields like "name, price"
        .eq("id", productid)
        .single();

      if (error) throw new Error(error);

      if (isAuthenticated) {
        const check = cartItems.some((item) => item.productId?.id === data?.id);

        setIsCarted(check);
      } else {
        const check = localcartItems.some(
          (item) => item.productId?.id === data?.id
        );

        setIsCarted(check);
      }

      const productwithoutimage = data;

      // 1. Extract image name
      const imageName = productwithoutimage.image;

      // 2. Generate signed URL from Supabase Storage
      const { data: signedUrls, error: signedUrlError } = await supabase.storage
        .from("addon") // your bucket name
        .createSignedUrls([imageName], 3600); // pass as array, 1 hour expiry

      if (signedUrlError) {
        console.error("Error generating signed URL:", signedUrlError);
        return;
      }

      // 3. Get the signed URL
      const signedUrl = signedUrls[0]?.signedUrl;

      // 4. Replace image name with the signed URL
      const productwithimage = {
        ...productwithoutimage,
        image: signedUrl || productwithoutimage.image, // fallback in case URL not generated
      };
      setproduct(productwithimage);
    } catch (error) {
      console.error(error);
    } finally {
      setIsloading(false);
    }
  }
  async function fetchSimilarproduct() {
    try {
      //get the current product
      const { data: product } = await supabase
        .from("product_variants")
        .select("*,product_id(*)")
        .eq("id", productid)
        .neq("productDisplayType", "boq")
        .single();

      //getting all the products
      const { data, error } = await supabase
        .from("product_variants")
        .select("*,product_id(*)")
        .neq("productDisplayType", "boq");

      if (error) throw new Error(error);

      // Filter products where it is approved
      const filterdata = data?.filter(
        (item) =>
          item.status === "approved" &&
          item.product_id.category !== "Partitions / Ceilings" &&
          item.product_id.category !== "Civil / Plumbing"
      );

      //similar product
      const similarFiltered = filterdata?.filter(
        (item) =>
          item?.id !== product?.id &&
          item?.product_type === product?.product_type
      );

      //productmaylike filter
      const productmaylikeFiltered = filterdata?.filter(
        (item) =>
          item.id !== product?.id &&
          item.product_id?.category === product?.product_id.category
      );

      // 1. Extract unique image names
      const uniqueImages = [...new Set(data.map((item) => item.image))];

      // 2. Generate signed URLs from Supabase Storage
      const { data: signedUrls, error: signedUrlError } = await supabase.storage
        .from("addon") // your bucket name
        .createSignedUrls(uniqueImages, 3600); // 1 hour expiry

      if (signedUrlError) {
        console.error("Error generating signed URLs:", signedUrlError);
        return;
      }

      // 3. Create a map from image name to signed URL
      const urlMap = {};
      signedUrls.forEach(({ path, signedUrl }) => {
        urlMap[path] = signedUrl;
      });

      // 4. Replace image names with URLs in the array
      const updatedProducts = similarFiltered.map((item) => ({
        ...item,
        image: urlMap[item.image] || item.image, // fallback if URL not found
      }));
      const updatedproductmaylike = productmaylikeFiltered.map((item) => ({
        ...item,
        image: urlMap[item.image] || item.image, // fallback if URL not found
      }));

      setSimilarProducts(updatedProducts);
      setProductsMayLike(updatedproductmaylike);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    // Timeout ensures DOM is fully rendered
    const timeout = setTimeout(() => {
      const clamped = productReviews.map((_, idx) => {
        const el = contentRefs.current[idx];
        if (!el) return false;

        const lineHeight = parseFloat(getComputedStyle(el).lineHeight) || 20;
        const maxHeight = lineHeight * 3;

        return el.scrollHeight > maxHeight;
      });

      setClampedStates(clamped);
      setExpandedStates(Array(productReviews.length).fill(false));
    }, 100); // delay ensures DOM paints first

    return () => clearTimeout(timeout);
  }, [productReviews]);

  useEffect(() => {
    if (isReview || selectedReview) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }
    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, [isReview, selectedReview]);

  const toggleExpanded = (index) => {
    setExpandedStates((prev) => {
      const updated = [...prev];
      updated[index] = !updated[index];
      return updated;
    });
  };

  const fetchProductReviews = async (productId) => {
    try {
      const { data, error } = await supabase
        .from("reviews")
        .select(`*,profiles:userId(company_name)`)
        .eq("productId", productId);
      if (error) {
        console.error(error);
      }
      setProductReviews(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLikes = async (reviewId, userId) => {
    try {
      const { data, error: fetchError } = await supabase
        .from("reviews")
        .select("likes")
        .eq("id", reviewId)
        .single();

      if (fetchError) {
        console.error("Error fetching review:", fetchError);
        return;
      }

      let existingLikes = data.likes ?? [];
      let existingDislikes = data.dislikes ?? [];

      // If likes is stored as a JSON string, parse it
      if (typeof existingLikes === "string") {
        existingLikes = JSON.parse(existingLikes);
      }
      if (typeof existingDislikes === "string") {
        existingDislikes = JSON.parse(existingDislikes);
      }
      existingLikes = existingLikes ?? [];

      let updatedLikes, updatedDislikes;
      if (existingLikes.includes(userId)) {
        updatedLikes = existingLikes.filter((id) => id !== userId);
        updatedDislikes = existingDislikes;
      } else {
        updatedLikes = [...existingLikes, userId];
        updatedDislikes = existingDislikes.filter((id) => id !== userId);
      }

      const { error: updateError } = await supabase
        .from("reviews")
        .update({ likes: updatedLikes, dislikes: updatedDislikes })
        .eq("id", reviewId);

      if (updateError) {
        console.error("Error updating likes:", updateError);
        return;
      }

      setProductReviews((prevReviews) =>
        prevReviews.map((review) =>
          review.id === reviewId
            ? { ...review, likes: updatedLikes, dislikes: updatedDislikes }
            : review
        )
      );
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };

  const handleDislikes = async (reviewId, userId) => {
    try {
      const { data, error: fetchError } = await supabase
        .from("reviews")
        .select("dislikes")
        .eq("id", reviewId)
        .single();

      if (fetchError) {
        console.error("Error fetching review:", fetchError);
        return;
      }

      let existingdislikes = data.dislikes || [];
      let existingLikes = data.likes ?? [];

      if (typeof existingdislikes === "string") {
        existingdislikes = JSON.parse(existingdislikes);
      }
      if (typeof existingLikes === "string") {
        existingLikes = JSON.parse(existingLikes);
      }

      existingdislikes = existingdislikes ?? [];

      let updatedDislikes, updatedLikes;
      if (existingdislikes.includes(userId)) {
        updatedDislikes = existingdislikes.filter((id) => id !== userId);
        updatedLikes = existingLikes;
      } else {
        updatedDislikes = [...existingdislikes, userId];
        updatedLikes = existingLikes.filter((id) => id !== userId);
      }

      const { error: updateError } = await supabase
        .from("reviews")
        .update({ dislikes: updatedDislikes, likes: updatedLikes })
        .eq("id", reviewId);

      if (updateError) {
        console.error("Error updating likes:", updateError);
        return;
      }

      setProductReviews((prevReviews) =>
        prevReviews.map((review) =>
          review.id === reviewId
            ? { ...review, dislikes: updatedDislikes, likes: updatedLikes }
            : review
        )
      );
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };

  const ratingCounts = [0, 0, 0, 0, 0];

  productReviews.forEach((review) => {
    const index = 5 - review.stars;
    if (index >= 0 && index < 5) {
      ratingCounts[index]++;
    }
  });

  const totalRatings = ratingCounts.reduce((sum, val) => sum + val, 0);
  const averageRating =
    productReviews.length > 0
      ? productReviews.reduce((sum, r) => sum + r.stars, 0) /
        productReviews.length
      : 0;

  useEffect(() => {
    fetchproductbyid();
    fetchSimilarproduct();
    fetchProductReviews(productid);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productid]);

  useEffect(() => {
    if (!product?.id) return;

    if (isAuthenticated) {
      const check = cartItems?.some(
        (item) => item.productId?.id === product.id
      );
      setIsCarted(check);
    } else {
      const check = localcartItems?.some(
        (item) => item.productId?.id === product.id
      );
      setIsCarted(check);
    }
  }, [isAuthenticated, cartItems, localcartItems, product?.id]);

  const baseImageUrl =
    "https://bwxzfwsoxwtzhjbzbdzs.supabase.co/storage/v1/object/public/addon/";

  const additionalImagesArray = product?.additional_images
    ? JSON.parse(product?.additional_images).map(
        (imageName) => `${baseImageUrl}${imageName}`
      )
    : [];

  const handleProductQuantityInc = () => {
    if (productqunatity >= 1) {
      setProductquantity((prev) => prev + 1);
    }
  };
  const handleProductQuantityDec = () => {
    if (productqunatity > 1) {
      setProductquantity((prev) => prev - 1);
    }
  };

  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const paginationRef = useRef(null);
  const prevRef2 = useRef(null);
  const nextRef2 = useRef(null);
  const paginationRef2 = useRef(null);

  const swiperSettings = {
    slidesPerView: 4,
    grid: { rows: 1, fill: "row" },
    spaceBetween: 30,
    breakpoints: {
      0: { slidesPerView: 2.02, grid: { rows: 1 }, spaceBetween: 10 },
      768: { slidesPerView: 4, grid: { rows: 1 }, spaceBetween: 24 },
      1024: { slidesPerView: 5, grid: { rows: 1 }, spaceBetween: 30 },
    },
  };
  const productmaylikeSwiperSettings = {
    slidesPerView: 4,
    grid: { rows: 2, fill: "row" },
    spaceBetween: 30,
    breakpoints: {
      0: { slidesPerView: 2.02, grid: { rows: 1 }, spaceBetween: 10 },
      768: { slidesPerView: 4, grid: { rows: 1 }, spaceBetween: 24 },
      1024: { slidesPerView: 5, grid: { rows: 2 }, spaceBetween: 30 },
    },
  };

  const handleCompareToggle = (product) => {
    const alreadyAdded = compare.some((item) => item.id === product.id);

    if (alreadyAdded) {
      setCompare((prev) => prev.filter((item) => item.id !== product.id));
    } else if (compare.length < 3) {
      setCompare((prev) => [...prev, product]);
    } else {
      showLimitReachedToast();
    }
  };
  const handleRemoveCompare = (id) => {
    setCompare((prev) => prev.filter((item) => item.id !== id));
  };

  const handleCompareClear = () => {
    setCompare([]);
    setShowPreview(false);
  };

  const [showPreview, setShowPreview] = useState(false);

  const allImages = productReviews.flatMap((review) => {
    const images = JSON.parse(review.images || "[]");
    return images.map((imgPath) => ({
      path: imgPath,
      review,
    }));
  });

  const displayedImages = allImages.slice(0, 6);
  const remainingCount = allImages.length - displayedImages.length;

  return (
    <>
      <Header />
      <ToastContainer />
      {isReview && (
        <div className="fixed inset-0 z-50 flex lg:items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white w-full max-w-sm sm:max-w-md xl:max-w-3xl p-6 rounded-lg shadow-lg relative overflow-y-auto max-h-[90vh]">
            <ProductReview
              product={product}
              onClose={() => setIsReview(false)}
            />
          </div>
        </div>
      )}
      {isloading ? (
        <SpinnerFullPage />
      ) : (
        <div className="lg:container mx-auto px-3 lg:px-12">
          {/* breadcumbs */}
          <div className="mt-6 lg:mt-10">
            <div className="md:flex mx-10 items-center text-[#334A78] text-sm mt-4 mb-4 md:mb-0 hidden">
              <button onClick={() => navigate(`/${fromPage}`)}>
                {" "}
                {fromPage === "shop" ? "Shop" : "Home"}
              </button>
              <MdOutlineKeyboardArrowRight
                size={15}
                style={{ color: "#334A78" }}
              />
              <button>{product?.title}</button>
            </div>
          </div>
          <div className={`md:flex p-2 lg:p-5 gap-1`}>
            <div className="flex-1">
              {product && (
                <div className="md:sticky md:top-8">
                  <div
                    className="max-w-xl"
                    onMouseEnter={() => setMainImageHovered(true)}
                    onMouseLeave={() => setMainImageHovered(false)}
                    style={{ zIndex: mainImageHovered ? 10 : 1 }}
                  >
                    <img
                      src={hoveredImage || product.image}
                      className="md:w-2/3 w-full"
                      alt="product name"
                    />
                  </div>
                  {additionalImagesArray.length > 0 ? (
                    <div className="flex lg:flex-wrap items-center gap-3 mx-6 lg:ml-16 mt-3">
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
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm capitalize my-2 ">
                        no additional images{" "}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex-1 flex flex-col mt-2 md:mt-0 font-Poppins ">
              {/* product info */}
              <div className="flex flex-col justify-center">
                <div className="border-b pb-4 md:border-none md:pb-0">
                  <h2 className="font-semibold text-lg leading-[22.4px] lg:text-3xl text-[#111]">
                    {product?.title || "product title"}
                  </h2>
                  <p className="text-[#A5A6AD] text-base leading-[38.4px]">
                    {product?.product_type}
                  </p>

                  <div className="border border-[#ccc] p-1 w-32">
                    <p className="flex gap-1">
                      <span className="text-[#000] font-medium text-[10px]">
                        {averageRating.toFixed(1) || 0}
                      </span>{" "}
                      <AiFillStar color="#F5B92B" size={14} />
                      <span className="border-l border-l-[#CCCCCC] pl-4 text-[#666] text-[10px]">
                        {totalRatings || 0} Ratings
                      </span>
                    </p>
                  </div>
                </div>

                {/* product price section */}
                <div className="my-2 lg:my-3 font-Poppins">
                  <div className="flex items-center gap-2">
                    <p className="text-sm lg:text-xl font-bold text-[#334A78] leading-[38.4px]">
                      Rs{" "}
                      {product?.ecommercePrice?.sellingPrice || product?.price}
                    </p>
                    <p className="text-sm lg:text-xl text-[#898994] leading-[38.4px]">
                      MRP{" "}
                      <span className="line-through">
                        Rs {product?.ecommercePrice?.mrp || product?.price}
                      </span>
                    </p>
                    <p className="text-sm lg:text-base text-[#F69E60]">
                      (Rs.
                      {product?.ecommercePrice?.mrp -
                        product?.ecommercePrice?.sellingPrice}{" "}
                      OFF)
                    </p>
                  </div>
                  <p className="text-xs text-[#3AA495]">
                    inclusive of all taxes
                  </p>
                </div>

                {/* qunatiy counter */}
                <div className="border-b pb-2 md:border-none md:pb-0 mt-4 lg:mt-0">
                  <h2 className="font-semibold text-[#334A78] text-sm capitalize">
                    Quantity
                  </h2>
                  <div className=" flex  gap-3 my-2">
                    <div className="flex items-start justify-start gap-2">
                      <button
                        className={`border-2 px-2 w-12 py-2 font-semibold  ${
                          product?.stockQty < 1
                            ? "cursor-not-allowed"
                            : "cursor-pointer"
                        }`}
                        onClick={handleProductQuantityDec}
                        disabled={product?.stockQty < 1}
                      >
                        -
                      </button>
                      <input
                        type="number"
                        className="border-2 px-2 w-12 py-2 rounded text-center [&::-webkit-inner-spin-button]:appearance-none  focus:outline-none focus:ring-0 text-xs md:text-[13px] leading-6"
                        min={1}
                        value={product?.stockQty > 0 ? productqunatity : 0}
                        disabled={product?.stockQty < 1}
                        readOnly
                      />
                      <button
                        className={`border-2 px-2 w-12 py-2 font-semibold  ${
                          product?.stockQty < 1
                            ? "cursor-not-allowed"
                            : "cursor-pointer"
                        }`}
                        onClick={handleProductQuantityInc}
                        disabled={product?.stockQty < 1}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  {product?.stockQty > 0 && product?.stockQty < 10 ? (
                    <span className="text-xs text-[#F87171]">
                      Hurry Up! Only {product.stockQty} left.
                    </span>
                  ) : product?.stockQty === 0 ? (
                    <span className="text-xs text-[#F87171]">
                      Currently out of stock
                    </span>
                  ) : null}
                </div>

                {/* add to card and buy now */}
                <div className="my-4 lg:flex gap-8 hidden">
                  <button
                    onClick={() => handleAddToCart(product, isCarted)}
                    disabled={product?.stockQty < 1}
                    className={`text-[#212B36] uppercase bg-[#FFFFFF] border border-[#212B36] w-52 px-10 py-4 rounded-sm hover:bg-[#334A78] hover:text-[#fff] transition-colors duration-500 ease-in-out ${
                      product?.stockQty < 1
                        ? "cursor-not-allowed"
                        : "cursor-pointer"
                    }`}
                  >
                    {isCarted ? "go to cart" : "ADD to cart"}
                  </button>
                  <button
                    onClick={() => {
                      handleAddToCart(product, isCarted);
                      navigate("/cart");
                    }}
                    disabled={product?.stockQty < 1}
                    className={`text-[#212B36] uppercase bg-[#FFFFFF] border border-[#212B36] w-52 px-10 py-4 rounded-sm hover:bg-[#334A78] hover:text-[#fff] transition-colors duration-500 ease-in-out ${
                      product?.stockQty < 1
                        ? "cursor-not-allowed"
                        : "cursor-pointer"
                    }`}
                  >
                    buy now
                  </button>
                </div>
              </div>

              <div className="my-4">
                {/* Desktop View (Always Expanded) */}
                <div className="hidden lg:block space-y-3 xl:w-2/3">
                  <div className="border-b px-0 py-4 rounded text-sm font-medium bg-white shadow-sm">
                    All Offers & Coupons
                  </div>
                  {offers.map((offer, idx) => (
                    <div
                      key={idx}
                      className="text-center px-3 py-2 border border-[#D3E2E0] font-Poppins bg-[#FFFCE6] rounded text-sm font-semibold flex justify-between items-center"
                    >
                      <span className="text-left">{offer}</span>
                    </div>
                  ))}
                </div>

                {/* Mobile View (Collapsible) */}
                <div className="block lg:hidden">
                  <div
                    className="flex justify-between items-center border-b px-0 py-2 rounded cursor-pointer text-sm font-medium bg-white shadow-sm"
                    onClick={() => setIsExpanded((prev) => !prev)}
                  >
                    <span>All Offers & Coupons</span>
                    {isExpanded ? (
                      <IoIosArrowUp className="w-4 h-4" />
                    ) : (
                      <IoIosArrowDown className="w-4 h-4" />
                    )}
                  </div>

                  {isExpanded && (
                    <div className="space-y-3 mt-4 border-b pb-4">
                      {offers.map((offer, idx) => (
                        <div
                          key={idx}
                          className="text-center px-3 py-2 border border-[#D3E2E0] bg-[#FFFDEB] rounded text-sm font-semibold flex justify-between items-center"
                        >
                          <span className="text-left">{offer}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="fixed bottom-0 left-0 w-full bg-white p-5 flex justify-between uppercase items-center border-t lg:hidden z-50">
                <button
                  onClick={() =>
                    isCarted ? navigate("/cart") : handleAddToCart(product)
                  }
                  className="flex-1 border border-[#213626] font-Poppins text-[#212B36] uppercase py-4 mr-2 rounded text-xs tracking-widest"
                >
                  {isCarted ? "Go to cart" : "Add to cart"}
                </button>
                <button className="flex-1 bg-[#304778] border-[#213625] font-Poppins text-white py-4 ml-2 rounded text-xs tracking-widest">
                  BUY NOW
                </button>
              </div>

              {/* product description */}
              <div className="mt-2 md:mt-5 text-[#334A78] font-Poppins xl:w-2/3 ">
                {/* Desktop View - Always Expanded */}
                <div className="hidden lg:block">
                  <h3 className="text-sm uppercase font-bold border-b-2 py-4">
                    Product Details
                  </h3>
                  {/* material and water*/}
                  <ProductDetailreusable
                    title1={"MATERIAL:"}
                    desc1={"PU Material"}
                    title2={"WATER RESISTANT:"}
                    desc2={"Yes"}
                  />
                  <ProductDetailreusable
                    title1={"PATTERN:"}
                    desc1={"Yes"}
                    title2={"COMPARTMENT:"}
                    desc2={"Yes"}
                  />
                  <ProductDetailreusable
                    title1={"DIMENSIONS (H x L x W):"}
                    desc1={"18x22x12 cm"}
                    title2={"POCKETS:"}
                    desc2={"Yes"}
                  />
                  <ProductDetailreusable
                    title1={"HANDLE:"}
                    desc1={"Yes"}
                    title2={"CLOSURE:"}
                    desc2={"Snap Lock"}
                  />
                  <ProductDetailreusable
                    title1={"CARE INSTRUCTION:"}
                    desc1={"Wipe with clean, soft cloth"}
                    title2={"WHAT ALL CAN FIT IN:"}
                    desc2={"Mobile can fit in"}
                  />
                </div>

                {/* Mobile View - Collapsible */}
                <div className="block lg:hidden">
                  {/* Toggle Header */}
                  <div
                    className="flex justify-between items-center border-b-2 py-2 cursor-pointer"
                    onClick={() => setIsExpanded2((prev) => !prev)}
                  >
                    <h3 className="text-sm uppercase font-bold">
                      Product Details
                    </h3>
                    {isExpanded2 ? (
                      <IoIosArrowUp className="w-4 h-4" />
                    ) : (
                      <IoIosArrowDown className="w-4 h-4" />
                    )}
                  </div>

                  {/* Content */}
                  {isExpanded2 && (
                    <div className="mt-2">
                      <ProductDetailreusable
                        title1="MATERIAL:"
                        desc1="PU Material"
                        title2="WATER RESISTANT:"
                        desc2="Yes"
                      />
                      <ProductDetailreusable
                        title1="PATTERN:"
                        desc1="Yes"
                        title2="COMPARTMENT:"
                        desc2="Yes"
                      />
                      <ProductDetailreusable
                        title1="DIMENSIONS (H x L x W):"
                        desc1="18x22x12 cm"
                        title2="POCKETS:"
                        desc2="Yes"
                      />
                      <ProductDetailreusable
                        title1="HANDLE:"
                        desc1="Yes"
                        title2="CLOSURE:"
                        desc2="Snap Lock"
                      />
                      <ProductDetailreusable
                        title1="CARE INSTRUCTION:"
                        desc1="Wipe with clean, soft cloth"
                        title2="WHAT ALL CAN FIT IN:"
                        desc2="Mobile can fit in"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* cusstomer review */}
          <div className="border-2 border-[#334A78]/20 p-4 my-6 lg:my-10 font-Poppins">
            <div
              className={`flex justify-between items-center ${
                hasReviews ? "p-6" : "p-0"
              }`}
            >
              <div className="">
                <h3 className="text-[#171717] md:font-semibold font-bold text-sm md:text-2xl ">
                  Customer Reviews
                </h3>
                {!hasReviews && (
                  <p className="text-[#334A78] text-sm">No reviews yet</p>
                )}
              </div>
              <p
                className="text-[#C16452] text-sm cursor-pointer hover:underline whitespace-nowrap"
                onClick={() => {
                  if (isAuthenticated) {
                    setIsReview(true);
                  } else {
                    toast.error("Plaese log in to give review");
                    return;
                  }
                }}
              >
                Write a review
              </p>
            </div>

            {hasReviews && (
              <div className="space-y-6 md:p-6">
                {/* Rating Summary */}
                <div className="flex flex-col md:flex-row items-center mt-5 md:mt-0 gap-10 md:items-start font-Poppins">
                  <div className="text-center">
                    <p className="md:text-3xl font-semibold">
                      {averageRating.toFixed(1)}★
                    </p>
                    <p className="text-[#A3A3A3] md:text-sm text-xs">
                      {totalRatings} Ratings &<br /> {productReviews.length}{" "}
                      Reviews
                    </p>
                  </div>
                  <div className="space-y-1">
                    {[5, 4, 3, 2, 1].map((star, i) => {
                      const count = ratingCounts[i];
                      const rawPercent =
                        totalRatings > 0 ? (count / totalRatings) * 100 : 0;
                      const percent = count > 0 ? Math.max(rawPercent, 5) : 0;
                      const barColor =
                        star >= 3
                          ? "bg-[#304778]"
                          : star === 2
                          ? "bg-[#FACC15]"
                          : "bg-[#FA9515]";
                      return (
                        <div key={star} className="flex items-center gap-2">
                          <span className="md:text-sm text-xs w-4 whitespace-nowrap md:mr-4">
                            {star} ★
                          </span>
                          <div className="w-48 h-2 bg-gray-200 rounded">
                            <div
                              className={`${barColor} h-2 rounded`}
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                          <span className="md:text-sm text-xs pl-4">
                            {count}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex gap-2 pt-8 border-b pb-6">
                  <div className="mb-6">
                    {/* Render combined review images */}
                    <div className="flex flex-wrap gap-2 pt-4 border-b pb-4">
                      {displayedImages.map(({ path, review }, i) => {
                        const url = supabase.storage
                          .from("review-images")
                          .getPublicUrl(path).data.publicUrl;

                        return (
                          <div
                            key={i}
                            className="w-20 h-20 rounded overflow-hidden bg-gray-200"
                          >
                            <img
                              src={url}
                              alt={`review-img-${i}`}
                              className="w-full h-full object-cover cursor-pointer"
                              onClick={() => {
                                setSelectedReview(review);
                                setSelectedImageIndex(i);
                                setDetailedMode("normal");
                              }}
                            />
                          </div>
                        );
                      })}

                      {remainingCount > 0 && (
                        <div
                          className="w-20 h-20 flex items-center justify-center rounded bg-gray-300 text-sm font-medium cursor-pointer"
                          onClick={() => {
                            setDetailedMode("grid");
                            setGridViewReview(allImages);
                          }}
                        >
                          +{remainingCount}
                        </div>
                      )}
                    </div>
                  </div>

                  <DetailedReview
                    selectedReview={selectedReview}
                    gridViewReview={gridViewReview}
                    onClose={() => {
                      setSelectedReview(null);
                      setGridViewReview(null);
                    }}
                    mode={detailedMode}
                    setMode={setDetailedMode}
                    setSelectedReview={setSelectedReview}
                    selectedImageIndex={selectedImageIndex}
                    setSelectedImageIndex={setSelectedImageIndex}
                  />
                </div>

                {/* Reviews List */}
                {productReviews.slice(0, 2).map((review, idx) => {
                  const expanded = expandedStates[idx];
                  const isClamped = clampedStates[idx];
                  const likesArray = Array.isArray(review.likes)
                    ? review.likes
                    : JSON.parse(review.likes || "[]");

                  const likeCount = likesArray.length;
                  const userHasLiked = likesArray.includes(
                    accountHolder?.userId
                  );
                  const dislikesArray = Array.isArray(review.dislikes)
                    ? review.dislikes
                    : JSON.parse(review.dislikes || "[]");
                  const dislikeCount = dislikesArray.length;
                  const userHasDisliked = dislikesArray.includes(
                    accountHolder?.userId
                  );

                  return (
                    <div key={idx} className="border-b pb-6 font-Poppins">
                      <div className="flex items-center gap-2 mb-2">
                        <p className="text-xs px-2 py-1 rounded flex items-center gap-1 border border-[#38938E]">
                          {review.stars}{" "}
                          <span className="text-[#38938E]">★</span>
                        </p>
                        <span className="font-semibold text-sm">
                          {review.title}
                        </span>
                      </div>

                      {/* Description */}
                      <p
                        ref={(el) => (contentRefs.current[idx] = el)}
                        className={`text-xs transition-all max-w-6xl duration-300 ease-in-out ${
                          !expanded ? "line-clamp-3" : ""
                        }`}
                      >
                        {review.description}
                      </p>

                      {/* Read More / Less */}
                      {isClamped && (
                        <p
                          className="text-sm text-[#6082AF] font-medium mt-2 cursor-pointer hover:underline"
                          onClick={() => toggleExpanded(idx)}
                        >
                          {expanded ? "READ LESS" : "READ MORE"}
                        </p>
                      )}

                      <div className="flex gap-6 text-sm mt-3 justify-end">
                        <div className="flex items-center gap-1 cursor-pointer">
                          {review.likes?.includes(accountHolder?.userId) ? (
                            <HandThumbUpIcon
                              onClick={() =>
                                handleLikes(review.id, accountHolder?.userId)
                              }
                              className="w-5 h-5 text-blue-600"
                            />
                          ) : (
                            <HandThumbUpOutline
                              onClick={() =>
                                handleLikes(review.id, accountHolder?.userId)
                              }
                              className="w-5 h-5 text-gray-400"
                            />
                          )}
                          <span
                            className={
                              userHasLiked ? "text-blue-600" : "text-gray-400"
                            }
                          >
                            {likeCount}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 cursor-pointer">
                          {review.dislikes?.includes(accountHolder?.userId) ? (
                            <HandThumbDownIcon
                              onClick={() =>
                                handleDislikes(review.id, accountHolder?.userId)
                              }
                              className="w-5 h-5 text-red-500"
                            />
                          ) : (
                            <HandThumbDownOutline
                              onClick={() =>
                                handleDislikes(review.id, accountHolder?.userId)
                              }
                              className="w-5 h-5 text-gray-400"
                            />
                          )}
                          <span
                            className={
                              userHasDisliked ? "text-red-600" : "text-gray-400"
                            }
                          >
                            {dislikeCount}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {productReviews.length > 2 && (
                  <div className="w-full flex justify-end">
                    <button
                      onClick={() => navigate(`/reviews/${product.id}`)}
                      className="text-sm mt-4 text-blue-600 underline"
                    >
                      View All Reviews
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          {similarProducts?.length > 0 && (
            <div className="my-6 lg:my-10 font-Poppins">
              <div className="flex justify-between items-center">
                <h3 className="text-[#171717] text-sm lg:text-3xl  uppercase mb-3 font-semibold">
                  Similar Products
                </h3>
                <div className="flex">
                  <button
                    ref={prevRef}
                    className="text-[#304778] disabled:text-gray-400"
                  >
                    <MdKeyboardArrowLeft size={30} />
                  </button>
                  <button
                    ref={nextRef}
                    className=" text-[#304778] disabled:text-gray-400"
                  >
                    <MdKeyboardArrowRight size={30} />
                  </button>
                </div>
              </div>
              <div className="relative">
                <ReusableSwiper
                  products={similarProducts}
                  CardComponent={Card}
                  // handleAddToCart={handleAddToCart}
                  handleCompareToggle={handleCompareToggle}
                  compare={compare}
                  swiperSettings={swiperSettings}
                  prevRef={prevRef}
                  nextRef={nextRef}
                  paginationRef={paginationRef}
                />
              </div>
            </div>
          )}

          {/* product you may like */}
          {productsMayLike?.length > 0 && (
            <div className=" mb-20 lg:my-10 font-Poppins">
              <div className="flex justify-between items-center">
                <h3 className="text-[#171717] text-sm lg:text-3xl  uppercase mb-3 font-semibold">
                  You May also like
                </h3>
                <div className="flex">
                  <button
                    ref={prevRef2}
                    className="text-[#304778] disabled:text-gray-400"
                  >
                    <MdKeyboardArrowLeft size={30} />
                  </button>
                  <button
                    ref={nextRef2}
                    className=" text-[#304778] disabled:text-gray-400"
                  >
                    <MdKeyboardArrowRight size={30} />
                  </button>
                </div>
              </div>
              <div className="relative">
                <ReusableSwiper
                  products={productsMayLike}
                  CardComponent={Card}
                  // handleAddToCart={handleAddToCart}
                  handleCompareToggle={handleCompareToggle}
                  compare={compare}
                  swiperSettings={productmaylikeSwiperSettings}
                  prevRef={prevRef2}
                  nextRef={nextRef2}
                  paginationRef={paginationRef2}
                />
              </div>
            </div>
          )}
          {compare?.length > 0 && (
            <div className="hidden lg:block fixed bottom-20 right-5 z-50">
              <div
                className="relative"
                onMouseEnter={() => setShowPreview(true)}
                onMouseLeave={() => setShowPreview(false)}
              >
                <button
                  onClick={() => setShowCompare(true)}
                  className="px-3 py-1 bg-[#304778] border border-[#212B36] text-white uppercase animate-blink rounded"
                >
                  compare{" "}
                  <span className="text-white bg-[#627BB1] rounded-full px-2">
                    {compare?.length}
                  </span>
                </button>

                {showPreview && !showCompare && (
                  <div className="absolute transform transition-all ease-in border border-[#ccc] bottom-full mb-2 left-0 -translate-x-[55%] translate-y-[20%] bg-white shadow-lg rounded-lg p-4 w-[350px] h-[300px]">
                    <div className="flex  gap-3">
                      {compare?.map((item) => (
                        <>
                          <div
                            key={item.id}
                            className="flex flex-col border-r border-[#ccc] items-center gap-3"
                          >
                            <div className="relative">
                              <img
                                src={item.image}
                                alt={item.title}
                                className="h-[200px] w-[200px] object-contain"
                              />

                              <button
                                onClick={() => {
                                  handleRemoveCompare(item.id);
                                }}
                                className="absolute top-0 right-0"
                              >
                                <MdOutlineCancel color="#666666" size={20} />
                              </button>
                            </div>
                            <p className="text-sm font-medium text-gray-800 truncate">
                              {item.title}
                            </p>
                          </div>
                        </>
                      ))}
                    </div>
                    <div className="flex justify-center gap-3 my-2">
                      <button
                        onClick={handleCompareClear}
                        className="border border-[#ccc] font-semibold text-sm text-[#212B36] px-3 py-1 uppercase"
                      >
                        remove all
                      </button>
                      <button
                        onClick={() => setShowCompare(true)}
                        className="px-3 py-1 bg-[#304778] border border-[#212B36]  uppercase text-white  rounded"
                      >
                        compare{" "}
                        <span className="text-white bg-[#627BB1] rounded-full px-2">
                          {compare?.length}
                        </span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* bottom tabs  */}
      <div className="hidden lg:block pb-24 md:pb-0">
        <BottomTabs />
      </div>

      {/* compare window */}
      {showCompare && (
        <CompareProducts
          product={compare}
          onClose={() => setShowCompare(false)}
          onRemove={handleRemoveCompare}
        />
      )}
    </>
  );
}

export default ProductView;

function ProductDetailreusable({ title1, title2, desc1, desc2 }) {
  return (
    <div className="border-b-2 pt-2 pb-1 flex gap-2 flex-col md:flex-row">
      <div className="flex-1 border-b-2 pt-2 pb-1 md:border-b-0 md:pb-0 md:pt-0">
        <p className="text-xs md:text-sm uppercase font-bold ">{title1}</p>
        <span className="text-xs">{desc1}</span>
      </div>
      <div className="flex-1">
        <p className="text-xs md:text-sm uppercase font-bold ">{title2}</p>
        <span className="text-xs">{desc2}</span>
      </div>
    </div>
  );
}

function Card({ product, handleCompareToggle, compare }) {
  const { isAuthenticated } = useApp();
  const { cartItems, wishlistItems, localcartItems } = useEcomApp();
  const isWishlisted = wishlistItems?.some(
    (item) => item.productId?.id === product.id
  );

  const naviagte = useNavigate();

  const { handleAddtoWishlist, handleAddToCart } = useHandleAddToCart();

  const [iscarted, setIsCarted] = useState(false);

  useEffect(() => {
    if (!product?.id) return;

    if (isAuthenticated) {
      const check = cartItems?.some(
        (item) => item.productId?.id === product.id
      );
      setIsCarted(check);
    } else {
      const check = localcartItems?.some(
        (item) => item.productId?.id === product.id
      );

      setIsCarted(check);
    }
  }, [isAuthenticated, cartItems, localcartItems, product?.id]);

  return (
    <div className="font-Poppins max-w-xs lg:w-[245px] h-[350px] md:h-[320px]  lg:h-[400px] border border-[#ccc]">
      <div
        onClick={() => naviagte(`/productview/${product.id}`)}
        className="flex justify-center items-center p-2 cursor-pointer"
      >
        <img
          src={product.image}
          alt={product.title}
          className="h-44 lg:h-52 object-contain"
        />
      </div>
      <div className="bg-[#fff] p-1.5 lg:p-2">
        <div className="flex ">
          <div className="flex-1 text-sm leading-[22.4px] text-[#111] ">
            <h4 className="font-medium line-clamp-2 text-xs lg:text-sm leading-[22.4px] ">
              {product?.title}
            </h4>
            <div className="flex text-xs lg:text-sm items-center gap-2">
              <p className=" ">Rs {product?.price || "Rs 3,0000"}</p>
              <p className="line-through text-[#111] text-opacity-50">
                Rs 5678
              </p>
              <p className="text-[#C20000] hidden md:block">sale</p>
            </div>
            <p className="text-[#C20000] md:hidden block uppercase">sale</p>
          </div>
          <div
            onClick={() => handleAddtoWishlist(product)}
            className=" text-[#ccc] hover:text-red-950 cursor-pointer"
          >
            {isWishlisted ? (
              <AiFillHeart size={26} color="red" />
            ) : (
              <GoHeart size={25} />
            )}
          </div>
        </div>
        <button
          onClick={() => handleAddToCart(product, iscarted)}
          className="text-[#000] uppercase bg-[#FFFFFF] text-xs border border-[#ccc] px-2 py-2 my-2 lg:my-4 rounded-sm hover:bg-[#DDDDDD]"
        >
          {iscarted ? "go to cart" : "add to cart"}
        </button>
        <div className="hidden lg:flex gap-3">
          <input
            type="checkbox"
            name="compare"
            id={`compare-${product.id}`}
            checked={compare?.some((item) => item.id === product.id)}
            onChange={() => handleCompareToggle(product)}
          />
          <label htmlFor="" className="text-xs">
            Add to compare
          </label>
        </div>
      </div>
    </div>
  );
}
