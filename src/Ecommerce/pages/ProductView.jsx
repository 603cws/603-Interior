import { useEffect, useState } from "react";
import { MdOutlineKeyboardArrowRight } from "react-icons/md"; //MdOutlineKeyboardArrowLeft
import { useLocation, useParams } from "react-router-dom";
import { supabase } from "../../services/supabase";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../Context/Context";
import BottomTabs from "../components/BottomTabs";
import Header from "../components/Header";
import { useHandleAddToCart } from "../../utils/HelperFunction";
import { ToastContainer } from "react-toastify";
import SpinnerFullPage from "../../common-components/SpinnerFullPage";
import { showLimitReachedToast } from "../../utils/AddToCartToast";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { useEcomApp } from "../../Context/EcomContext";
import PageNotFound from "../../common-components/PageNotFound";
import { baseImageUrl } from "../../utils/HelperConstant";
import SimilarProducts from "../components/SimilarProducts";
import { CardWithCompare } from "../components/Card";
import ProductsMayLike from "../components/ProductsMayLike";
import CustomerReview from "../components/CustomerReview";
import ComparePreview from "../components/ComparePreview";
import { handleError } from "../../common-components/handleError";
import toast from "react-hot-toast";

// const offers = [
//   "Flat ₹50 Off + Free Surprise Gift On All Prepaid Offers 🎁",
//   "Additional 5% Off On New Arrivals Use Code LOOKO5 🎁",
//   "FLAT 10% OFF on PARTY BAGS collection, Use Code: PARTY10 🎁",
// ];

const productDetails = [
  {
    title1: "MATERIAL:",
    desc1: "PU Material",
    title2: "WATER RESISTANT:",
    desc2: "Yes",
  },
  {
    title1: "PATTERN:",
    desc1: "Yes",
    title2: "COMPARTMENT:",
    desc2: "Yes",
  },
  {
    title1: "DIMENSIONS (H x L x W):",
    desc1: "18x22x12 cm",
    title2: "POCKETS:",
    desc2: "Yes",
  },
  {
    title1: "HANDLE:",
    desc1: "Yes",
    title2: "CLOSURE:",
    desc2: "Snap Lock",
  },
  {
    title1: "CARE INSTRUCTION:",
    desc1: "Wipe with clean, soft cloth",
    title2: "WHAT ALL CAN FIT IN:",
    desc2: "Mobile can fit in",
  },
];

function ProductView() {
  const [mainImageHovered, setMainImageHovered] = useState(false); // For main image hover effect
  const [hoveredImage, setHoveredImage] = useState(null); // For additional image hover effect
  const [product, setproduct] = useState();
  const [similarProducts, setSimilarProducts] = useState();
  const [productMayLike, setProductsMayLike] = useState();
  const [productqunatity, setProductquantity] = useState(1);
  const [isloading, setIsloading] = useState(false);

  const [isCarted, setIsCarted] = useState();
  // const [isExpanded, setIsExpanded] = useState(false);
  const [isExpanded2, setIsExpanded2] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { handleAddToCart } = useHandleAddToCart();
  const { compare, setCompare } = useEcomApp();

  //   get the product based on the product id
  const { id: productid } = useParams();
  const fromPage = location.state?.from || "products";

  const { isAuthenticated } = useApp();
  const { cartItems, localcartItems } = useEcomApp();

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
          (item) => item.productId?.id === data?.id,
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
        handleError(signedUrlError, {
          prodMessage: "Error generating signed URL. Please try again.",
        });
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
      handleError(error, {
        prodMessage: "Something went wrong. Please try again.",
      });
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
          item.product_id.category !== "Civil / Plumbing",
      );

      //similar product
      const similarFiltered = filterdata?.filter(
        (item) =>
          item?.id !== product?.id &&
          item?.product_type === product?.product_type,
      );

      //productmaylike filter
      const productmaylikeFiltered = filterdata?.filter(
        (item) =>
          item.id !== product?.id &&
          item.product_id?.category === product?.product_id.category,
      );

      // 1. Extract unique image names
      const uniqueImages = [...new Set(data.map((item) => item.image))];

      // 2. Generate signed URLs from Supabase Storage
      const { data: signedUrls, error: signedUrlError } = await supabase.storage
        .from("addon") // your bucket name
        .createSignedUrls(uniqueImages, 3600); // 1 hour expiry

      if (signedUrlError) {
        handleError(signedUrlError, {
          prodMessage: "Error generating signed URL. Please try again.",
        });
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
      handleError(error, {
        prodMessage: "Something went wrong. Please try again.",
      });
    }
  }

  useEffect(() => {
    fetchproductbyid();
    fetchSimilarproduct();
    setProductquantity(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productid]);

  useEffect(() => {
    if (!product?.id) return;

    if (isAuthenticated) {
      const check = cartItems?.some(
        (item) => item.productId?.id === product.id,
      );
      setIsCarted(check);
    } else {
      const check = localcartItems?.some(
        (item) => item.productId?.id === product.id,
      );
      setIsCarted(check);
    }
  }, [isAuthenticated, cartItems, localcartItems, product?.id]);

  const additionalImagesArray = product?.additional_images
    ? JSON.parse(product?.additional_images).map(
        (imageName) => `${baseImageUrl}${imageName}`,
      )
    : [];

  const handleProductQuantityInc = (product) => {
    if (productqunatity >= 1 && product?.stockQty > productqunatity) {
      setProductquantity((prev) => prev + 1);
    } else {
      toast.error(`only ${product?.stockQty} items left`);
    }
  };
  const handleProductQuantityDec = () => {
    if (productqunatity > 1) {
      setProductquantity((prev) => prev - 1);
    }
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

  if (!productid) return <PageNotFound />;
  if (isloading) return <SpinnerFullPage />;
  return (
    <>
      <Header />
      <ToastContainer />
      <div className="lg:container mx-auto px-3 lg:px-12">
        {/* breadcumbs */}
        <div className="mt-6 lg:mt-10 font-Poppins">
          <div className="md:flex mx-10 items-center text-[#334A78] text-sm mt-4 mb-4 md:mb-0 hidden">
            <button onClick={() => navigate(`/${fromPage}`)}>
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
                    className="md:w-2/3 w-full lg:h-[400px]"
                    alt="product name"
                  />
                </div>
                {additionalImagesArray.length > 0 ? (
                  <div className="flex lg:flex-wrap items-center gap-3 sm:mx-6 lg:ml-16 mt-3">
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

          <div className="flex-1 flex flex-col mt-2 md:mt-0 font-Poppins">
            {/* product info */}
            <div className="flex flex-col justify-center">
              <div className="border-b pb-4 md:border-none md:pb-0">
                <h2 className="font-semibold text-lg leading-[22.4px] lg:text-3xl text-[#111] capitalize">
                  {product?.title || "product title"}
                </h2>
                <p className="text-[#A5A6AD] text-base leading-[38.4px]">
                  {product?.product_type}
                </p>

                {/* <div className="border border-[#ccc] p-1 w-32">
                  <p className="flex gap-1">
                    <span className="text-[#000] font-medium text-[10px]">
                      {averageRating.toFixed(1) || 0}
                    </span>{" "}
                    <AiFillStar color="#F5B92B" size={14} />
                    <span className="border-l border-l-[#CCCCCC] pl-4 text-[#666] text-[10px]">
                      {totalRatings || 0} Ratings
                    </span>
                  </p>
                </div> */}
              </div>

              {/* product price section */}
              <div className="my-2 lg:my-3 font-Poppins">
                <div className="flex items-center gap-2">
                  <p className="text-sm lg:text-xl font-bold text-[#334A78] leading-[38.4px]">
                    ₹ {product?.ecommercePrice?.sellingPrice || product?.price}
                  </p>
                  <p className="text-sm lg:text-xl text-[#898994] leading-[38.4px]">
                    MRP{" "}
                    <span className="line-through">
                      ₹ {product?.ecommercePrice?.mrp || product?.price}
                    </span>
                  </p>
                  <p className="text-sm lg:text-base text-[#F69E60]">
                    (₹
                    {product?.ecommercePrice?.mrp -
                      product?.ecommercePrice?.sellingPrice}
                    OFF)
                  </p>
                </div>
                {/* <p className="text-xs text-[#3AA495]">inclusive of all taxes</p> */}
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
                      onClick={() => handleProductQuantityInc(product)}
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
                  onClick={() =>
                    handleAddToCart(product, isCarted, productqunatity)
                  }
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
                    handleAddToCart(product, isCarted, productqunatity);
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

            {/* <div className="my-4">
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
            </div> */}

            <div className="fixed bottom-0 left-0 w-full bg-white p-5 flex justify-between uppercase items-center border-t lg:hidden z-50">
              <button
                onClick={() =>
                  isCarted
                    ? navigate("/cart")
                    : handleAddToCart(product, isCarted, productqunatity)
                }
                className="flex-1 border border-[#213626] font-Poppins text-[#212B36] uppercase py-4 mr-2 rounded text-xs tracking-widest"
              >
                {isCarted ? "Go to cart" : "Add to cart"}
              </button>
              <button
                onClick={() => {
                  handleAddToCart(product, isCarted, productqunatity);
                  navigate("/cart");
                }}
                className="flex-1 bg-[#304778] border-[#213625] font-Poppins text-white py-4 ml-2 rounded text-xs tracking-widest"
              >
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
                {productDetails?.map((item, index) => (
                  <ProductDetailreusable
                    key={index}
                    title1={item.title1}
                    desc1={item.desc1}
                    title2={item.title2}
                    desc2={item.desc2}
                  />
                ))}
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
                    {productDetails?.map((item, index) => (
                      <ProductDetailreusable
                        key={index}
                        title1={item.title1}
                        desc1={item.desc1}
                        title2={item.title2}
                        desc2={item.desc2}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* cusstomer review */}
        <CustomerReview product={product} productid={productid} />

        {/* similar product */}
        {similarProducts?.length > 0 && (
          <SimilarProducts
            similarProducts={similarProducts}
            Card={CardWithCompare}
            handleCompareToggle={handleCompareToggle}
            compare={compare}
          />
        )}

        {/* product you may like */}
        {productMayLike?.length > 0 && (
          <ProductsMayLike
            productMayLike={productMayLike}
            Card={CardWithCompare}
            handleCompareToggle={handleCompareToggle}
            compare={compare}
          />
        )}
        <ComparePreview />
      </div>

      {/* bottom tabs  */}
      <div className="hidden lg:block pb-24 md:pb-0">
        <BottomTabs />
      </div>
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
