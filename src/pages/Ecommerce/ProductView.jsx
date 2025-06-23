import { useEffect, useState, useRef } from "react";
import { MdOutlineKeyboardArrowRight } from "react-icons/md"; //MdOutlineKeyboardArrowLeft
import { AiFillStar } from "react-icons/ai";
import { useParams } from "react-router-dom";
import { supabase } from "../../services/supabase";
import { useNavigate } from "react-router-dom";
import ReusableSwiper from "./ReusableSwiper";
import { useApp } from "../../Context/Context";
import BottomTabs from "./BottomTabs";
import Header from "./Header";
import { AiFillHeart } from "react-icons/ai";
import { GoHeart } from "react-icons/go";
import { useHandleAddToCart } from "../../utils/HelperFunction";
import { ToastContainer } from "react-toastify";
import SpinnerFullPage from "../../common-components/SpinnerFullPage";
import CompareProducts from "./CompareProducts";
import toast from "react-hot-toast";
import ProductReview from "./ProductReview";
import { HandThumbUpIcon, HandThumbDownIcon } from "@heroicons/react/24/solid";
import {
  HandThumbUpIcon as HandThumbUpOutline,
  HandThumbDownIcon as HandThumbDownOutline,
} from "@heroicons/react/24/outline";

const reviews = [
  {
    rating: 4.4,
    title: "Very good product!!",
    content:
      "Poor quality. The seat is not even parallel to the ground, it is tilted to the lift as it is clearly visible observing the plane of the seat or the lines on the backrest compared to the ground. As a result sitting on the chair feels like leaning toward left always. The lower back rest is good........",
    likes: 21,
    comments: 21,
  },
  {
    rating: 4.4,
    title: "Very good product!!",
    content:
      "Poor quality. The seat is not even parallel to the ground, it is tilted to the left...",
    likes: 21,
    comments: 21,
  },
];

function ProductView() {
  const [mainImageHovered, setMainImageHovered] = useState(false); // For main image hover effect
  const [hoveredImage, setHoveredImage] = useState(null); // For additional image hover effect
  const [product, setproduct] = useState();
  const [similarProducts, setSimilarProducts] = useState();
  const [productsMayLike, setProductsMayLike] = useState();
  const [productqunatity, setProductquantity] = useState(1);
  const [isloading, setIsloading] = useState(false);
  const [compare, setCompare] = useState([]);
  const [showCompare, setShowCompare] = useState(false);
  const [isReview, setIsReview] = useState(false);

  const [isCarted, setIsCarted] = useState();

  const navigate = useNavigate();

  const { handleAddToCart } = useHandleAddToCart();

  //   get the product based on the product id
  const { id: productid } = useParams();

  const { cartItems, isAuthenticated, localcartItems } = useApp();
  const hasReviews = reviews && reviews.length > 0;

  const [interactions, setInteractions] = useState({}); // Track likes/dislikes per review index

  const handleInteraction = (index, type) => {
    setInteractions((prev) => {
      const current = prev[index];
      return {
        ...prev,
        [index]: current === type ? null : type, // toggle
      };
    });
  };

  async function fetchproductbyid() {
    try {
      setIsloading(true);
      const { data, error } = await supabase
        .from("product_variants")
        .select("*,product_id(*)") // or specify fields like "name, price"
        .eq("id", productid)
        .single();

      console.log(data);

      if (error) throw new Error(error);

      if (isAuthenticated) {
        const check = cartItems.some((item) => item.productId?.id === data?.id);

        setIsCarted(check);
      } else {
        console.log(localcartItems);

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
      console.log(error);
    } finally {
      setIsloading(false);
    }
  }
  async function fetchSimilarproduct() {
    try {
      //get the current product
      const { data: product, error: Err } = await supabase
        .from("product_variants")
        .select("*,product_id(*)")
        .eq("id", productid)
        .single();

      //getting all the products
      const { data, error } = await supabase
        .from("product_variants")
        .select("*,product_id(*)");

      if (error) throw new Error(error);

      // Filter products where it is approved
      const filterdata = data.filter(
        (item) =>
          item.status === "approved" &&
          item.product_id.category !== "Partitions / Ceilings" &&
          item.product_id.category !== "Civil / Plumbing"
      );

      //similar product
      const similarFiltered = filterdata.filter(
        (item) =>
          item.id !== product.id && item.product_type === product.product_type
      );

      //productmaylike filter
      const productmaylikeFiltered = filterdata.filter(
        (item) =>
          item.id !== product.id &&
          item.product_id.category === product.product_id.category
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
      console.log(error);
    }
  }

  useEffect(() => {
    fetchproductbyid();
    fetchSimilarproduct();
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
      768: { slidesPerView: 3, grid: { rows: 1 }, spaceBetween: 24 },
      1024: { slidesPerView: 5, grid: { rows: 1 }, spaceBetween: 30 },
    },
  };
  const productmaylikeSwiperSettings = {
    slidesPerView: 4,
    grid: { rows: 2, fill: "row" },
    spaceBetween: 30,
    breakpoints: {
      0: { slidesPerView: 2.02, grid: { rows: 2 }, spaceBetween: 10 },
      768: { slidesPerView: 3, grid: { rows: 2 }, spaceBetween: 24 },
      1024: { slidesPerView: 5, grid: { rows: 2 }, spaceBetween: 30 },
    },
  };

  const handleCompareToggle = (product) => {
    setCompare((prevCompare) => {
      const alreadyAdded = prevCompare.some((item) => item.id === product.id);
      if (alreadyAdded) {
        return prevCompare.filter((item) => item.id !== product.id);
      } else if (prevCompare.length < 3) {
        return [...prevCompare, product];
      } else {
        toast.error("You can compare a maximum of 3 products.");
        return prevCompare;
      }
    });
  };
  const handleRemoveCompare = (id) => {
    setCompare((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <>
      <Header />
      <ToastContainer />
      {isReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white w-full max-w-3xl p-6 rounded-lg shadow-lg relative overflow-y-auto max-h-[90vh]">
            <ProductReview
              image={product.image}
              title={product.title}
              details={product.details}
              onClose={() => setIsReview(false)}
            />
          </div>
        </div>
      )}
      {isloading ? (
        <SpinnerFullPage />
      ) : (
        <div className="container mx-auto">
          {/* breadcumbs */}
          <div className="mt-10">
            <div className="flex mx-10 items-center text-[#334A78] text-sm mt-4 mb-4 md:mb-0">
              <button onClick={() => navigate("/products")}>Home</button>
              <MdOutlineKeyboardArrowRight
                size={15}
                style={{ color: "#334A78" }}
              />
              <button>{product?.title}</button>
            </div>
          </div>
          <div className={`flex p-2 lg:p-5 gap-1`}>
            <div className="flex-1">
              {product && (
                <div>
                  <div
                    className="max-w-xl"
                    onMouseEnter={() => setMainImageHovered(true)}
                    onMouseLeave={() => setMainImageHovered(false)}
                    style={{ zIndex: mainImageHovered ? 10 : 1 }}
                  >
                    <img
                      src={hoveredImage || product.image}
                      className=""
                      alt="product name "
                    />
                  </div>
                  {additionalImagesArray.length > 0 ? (
                    <div className="flex flex-wrap items-center gap-3 mx-6 ml-16 mt-3">
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
                      <p>no additional images </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex-1 flex flex-col mt-2 md:mt-0 font-Poppins ">
              {/* product info */}
              <div className="flex flex-col justify-center">
                <div className="">
                  <h2 className="font-semibold text-3xl text-[#111]">
                    {product?.title || "product title"}
                  </h2>
                  <p className="text-[#A5A6AD] text-base leading-[38.4px]">
                    {product?.product_type}
                  </p>

                  <div className="border border-[#ccc] p-1 w-32">
                    <p className="flex gap-1">
                      <span className="text-[#000] font-medium text-[10px]">
                        2.7
                      </span>{" "}
                      <AiFillStar color="#F5B92B" size={14} />
                      <span className="border-l border-l-[#CCCCCC] pl-4 text-[#666] text-[10px]">
                        78 Ratings
                      </span>
                    </p>
                  </div>
                </div>

                {/* product price section */}
                <div className="my-3">
                  <div className="flex items-center gap-2">
                    <p className="text-xl font-bold text-[#334A78] leading-[38.4px]">
                      Rs {product?.price || "Rs 3,0000"}
                    </p>
                    <p className="text-lg text-[#898994] leading-[38.4px]">
                      MRP <span className="line-through">Rs5678</span>
                    </p>
                    <p className="text-[#F69E60]">(Rs.2678 OFF)</p>
                  </div>
                  <p className="text-xs text-[#3AA495]">
                    inclusive of all taxes
                  </p>
                </div>

                <div className="my-3">
                  <p className="text-[#334A78] text-sm ">Colors</p>
                  <div className="flex gap-3">
                    <div className="px-5 py-2 bg-[#000]/5 inline-block text-sm text-[#334A78] uppercase text-center border border-[#334A78]">
                      black
                    </div>
                    <div className="px-4 py-2 bg-[#fff] inline-block text-sm text-[#334A78] uppercase text-center border border-[#ccc]">
                      GREEN
                    </div>
                  </div>
                </div>

                {/* qunatiy counter */}
                <div>
                  <h2 className="font-semibold text-[#334A78] text-sm capitalize">
                    Quantity
                  </h2>
                  <div className=" flex  gap-3 my-2">
                    <div className="flex items-start justify-start gap-2">
                      <button
                        className="border-2 px-2 w-12 py-2 font-semibold"
                        onClick={handleProductQuantityDec}
                      >
                        -
                      </button>
                      <input
                        type="number"
                        className="border-2 px-2 w-12 py-2 rounded text-center [&::-webkit-inner-spin-button]:appearance-none  focus:outline-none focus:ring-0 text-xs md:text-[13px] leading-6"
                        min={1}
                        value={productqunatity}
                        readOnly
                      />
                      <button
                        className="border-2 px-2 w-12 py-2 font-semibold"
                        onClick={handleProductQuantityInc}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* add to card and buy now */}
                <div className="my-4 flex gap-8 ">
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="text-[#212B36] uppercase bg-[#FFFFFF] border border-[#212B36] w-52 px-10 py-4 rounded-sm "
                  >
                    {isCarted ? "Added to cart" : "ADD to cart"}
                  </button>
                  <button className="text-[#212B36] uppercase bg-[#FFFFFF] border border-[#212B36] w-52 px-10 py-4 rounded-sm ">
                    buy now
                  </button>
                </div>
              </div>
              {/* product description */}
              <div className="mt-2 md:mt-5 text-[#334A78] font-Poppins xl:w-2/3 ">
                <h3 className="text-sm  uppercase font-bold  border-b-2">
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
            </div>
          </div>

          {/* cusstomer review */}
          <div className="border-2 border-[#334A78]/20 mt-10 mb-10 p-4 font-Poppins">
            <div className="flex justify-between items-center mb-6 p-6">
              <div className="">
                <h3 className="text-[#171717] font-semibold text-2xl">
                  Customer Reviews
                </h3>
                {!hasReviews && (
                  <p className="text-[#334A78] text-sm">No reviews yet</p>
                )}
              </div>
              <p
                className="text-[#C16452] text-sm cursor-pointer hover:underline"
                onClick={() => setIsReview(true)}
              >
                Write a review
              </p>
            </div>

            {hasReviews && (
              <div className="space-y-6 p-6">
                {/* Rating Summary */}
                <div className="flex gap-10 items-start font-Poppins">
                  <div className="text-center">
                    <p className="text-3xl font-semibold">4.4 ★</p>
                    <p className="text-[#A3A3A3] text-sm">
                      100 Ratings &<br /> 48 Reviews
                    </p>
                  </div>
                  <div className="space-y-1">
                    {[5, 4, 3, 2, 1].map((star, i) => {
                      const count = [40, 5, 2, 1, 2][i];
                      const barColor = [
                        "bg-[#304778]",
                        "bg-[#304778]",
                        "bg-[#304778]",
                        "bg-[#FACC15]",
                        "bg-[#FA9515]",
                      ][i];
                      return (
                        <div key={star} className="flex items-center gap-2">
                          <span className="text-sm w-4 whitespace-nowrap mr-4">
                            {star} ★
                          </span>
                          <div className="w-48 h-2 bg-gray-200 rounded">
                            <div
                              className={`${barColor} h-2 rounded`}
                              style={{ width: `${count}%` }}
                            ></div>
                          </div>
                          <span className="text-sm pl-4">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Image thumbnails */}
                <div className="flex gap-2 pt-8 border-b pb-6">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="w-24 h-24 bg-gray-200 rounded overflow-hidden"
                    >
                      {/* Replace with real <img src={...} /> */}
                      <div
                        className="w-full h-full bg-cover bg-center"
                        style={{ backgroundImage: `url('/image${i + 1}.jpg')` }}
                      ></div>
                    </div>
                  ))}
                </div>

                {/* Reviews List */}
                {reviews.map((review, idx) => {
                  const interaction = interactions[idx];
                  return (
                    <div key={idx} className="border-b pb-6 font-Poppins">
                      <div className="flex items-center gap-2 mb-2">
                        <p className="text-xs px-2 py-1 rounded flex items-center gap-1 border border-[#38938E]">
                          {review.rating}{" "}
                          <span className="text-[#38938E]">★</span>
                        </p>
                        <span className="font-semibold text-sm">
                          {review.title}
                        </span>
                      </div>
                      <p className="text-xs">{review.content}</p>
                      <p className="text-sm text-[#6082AF] font-medium mt-2 cursor-pointer hover:underline">
                        READ MORE
                      </p>

                      <div className="flex gap-6 text-sm mt-3 justify-end">
                        <div
                          className="flex items-center gap-1 cursor-pointer"
                          onClick={() => handleInteraction(idx, "like")}
                        >
                          {interaction === "like" ? (
                            <HandThumbUpIcon className="w-5 h-5 text-blue-600" />
                          ) : (
                            <HandThumbUpOutline className="w-5 h-5 text-gray-400" />
                          )}
                          <span
                            className={
                              interaction === "like"
                                ? "text-blue-600"
                                : "text-gray-400"
                            }
                          >
                            {review.likes}
                          </span>
                        </div>

                        <div
                          className="flex items-center gap-1 cursor-pointer"
                          onClick={() => handleInteraction(idx, "dislike")}
                        >
                          {interaction === "dislike" ? (
                            <HandThumbDownIcon className="w-5 h-5 text-red-500" />
                          ) : (
                            <HandThumbDownOutline className="w-5 h-5 text-gray-400" />
                          )}
                          <span
                            className={
                              interaction === "dislike"
                                ? "text-red-500"
                                : "text-gray-400"
                            }
                          >
                            {review.dislikes}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="my-10 font-Poppins">
            <h3 className="text-[#171717] text-3xl  uppercase mb-3 font-semibold">
              Similar Products
            </h3>
            {similarProducts && (
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
                {/* Custom arrows */}
                <div
                  ref={prevRef}
                  className="swiper-button-prev custom-nav absolute top-1/2 -left-10 transform -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow z-50"
                />
                <div
                  ref={nextRef}
                  className="swiper-button-next custom-nav absolute top-1/2 -right-10 transform -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow z-50"
                />
              </div>
            )}
          </div>

          {/* product you may like */}
          <div className="my-10 font-Poppins">
            <h3 className="text-[#171717] text-3xl  uppercase mb-3 font-semibold">
              You May also like
            </h3>
            {productsMayLike && (
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
                {/* Custom arrows */}
                <div
                  ref={prevRef2}
                  className="swiper-button-prev custom-nav absolute top-1/2 -left-10 transform -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow z-50"
                />
                <div
                  ref={nextRef2}
                  className="swiper-button-next custom-nav absolute top-1/2 -right-10 transform -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow z-50"
                />
              </div>
            )}
            {compare.length > 0 && (
              <button
                onClick={() => setShowCompare(true)}
                className="fixed bottom-20 right-5 px-5 py-3 bg-slate-600 text-white z-10 animate-blink"
              >
                compare
              </button>
            )}
          </div>
        </div>
      )}

      {/* bottom tabs  */}
      <BottomTabs />

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
    <div className=" border-b-2 pt-2 pb-1 flex gap-2">
      <div className="flex-1">
        <p className="text-xs md:text-sm uppercase font-bold ">{title1}</p>
        <span className="text-xs  ">{desc1}</span>
      </div>
      <div className="flex-1">
        <p className="text-xs md:text-sm uppercase font-bold ">{title2}</p>
        <span className="text-xs  ">{desc2}</span>
      </div>
    </div>
  );
}

function Card({ product, handleCompareToggle, compare }) {
  const { isAuthenticated, localcartItems, cartItems, wishlistItems } =
    useApp();
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
      console.log("check", check);

      setIsCarted(check);
      console.log("iscarted", iscarted);
    }
  }, [isAuthenticated, cartItems, localcartItems, product?.id]);

  return (
    <div className="font-Poppins w-[245px] h-[360px] border border-[#ccc]">
      <div
        onClick={() => naviagte(`/productview/${product.id}`)}
        className="flex justify-center items-center p-2 cursor-pointer"
      >
        <img src={product.image} alt="chair" className="h-52 object-contain" />
      </div>
      <div className="bg-[#fff] p-2">
        <div className="flex ">
          <div className="flex-1 text-sm  leading-[22.4px]  text-[#111] ">
            <h4 className="font-medium text-sm leading-[22.4px] ">
              {product?.title}
            </h4>
            <div className="flex items-center gap-2">
              <p className=" ">Rs {product?.price || "Rs 3,0000"}</p>
              <p className="line-through text-[#111] text-opacity-50">
                Rs 5678
              </p>
              <p className="text-[#C20000]">sale</p>
            </div>
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
          onClick={() => handleAddToCart(product)}
          className="text-[#000] uppercase bg-[#FFFFFF] text-xs border border-[#ccc] px-2  py-2 rounded-sm "
        >
          {iscarted ? "added to cart" : "add to cart"}
        </button>
        <div className="flex gap-3">
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
