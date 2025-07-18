import { BsArrowRight } from "react-icons/bs";
import { Swiper, SwiperSlide } from "swiper/react";
import { Grid, Navigation, Pagination } from "swiper/modules";
import { TiArrowRight } from "react-icons/ti";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/grid"; // this is important for grid layout!
import "./products.css";
import Header from "./Header";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { useEffect, useRef, useState } from "react";
import { useApp } from "../../Context/Context";
import { supabase } from "../../services/supabase";
import SpinnerFullPage from "../../common-components/SpinnerFullPage";
import { useNavigate } from "react-router-dom";
import { useHandleAddToCart } from "../../utils/HelperFunction";
import { toast, Slide } from "react-toastify";
import { ToastContainer } from "react-toastify";
import CardSection from "./CardSection";
import { AiFillHeart } from "react-icons/ai";
import { GoHeart } from "react-icons/go";
import Loginpoup from "../../common-components/LoginPopup";

// <div className="h-[400px]">
//   <div className="h-full flex flex-col border-[1px] border-[#AAAAAA] relative">
//     <div className="max-w-xs">
//       <img src={image} alt={title} className="bg-[#000000]/10" />
//     </div>
//     {ispopular && (
//       <span
//         className={` font-lora text-[11px] capitalize absolute top-2 left-2 p-[5px] ${
//           populartext === "popular"
//             ? "bg-[#E3F3FF] text-[#000]"
//             : "bg-[#374A75] text-white"
//         }`}
//       >
//         {populartext}
//       </span>
//     )}
//     <div className="px-5 flex flex-col justify-center items-center gap-3 font-lora py-3 mt-auto">
//       <p className=" text-center text-xs lg:text-sm">{title}</p>
//       <h5 className="lg:text-lg">$ {price} </h5>
//       <button className="flex justify-center items-center gap-2 font-Poppins text-[13px] py-1.5">
//         Add to cart <BsArrowRight size={15} />{" "}
//       </button>
//     </div>
//   </div>
// </div>

const latestPosts = [
  {
    image: "/images/blogoffice.png",
    date: "05",
    month: "may",
    subhead: "info styles",
    title: "How to Style Mismatched Earrings",
    description:
      "Mismatched earrings have become a bold and trendy fashion statement, offering endless opportunities for..",
  },
  {
    image: "/images/blogoffice.png",
    date: "07",
    month: "may",
    subhead: "fashion tips",
    title: "The Revival of Retro Office Attire",
    description:
      "Retro fashion is back, and it's taking over modern workspaces with a splash of bold colors and tailored cuts..",
  },
  {
    image: "/images/blogoffice.png",
    date: "09",
    month: "may",
    subhead: "workwear edit",
    title: "Balancing Comfort and Style at Work",
    description:
      "Modern workwear demands both comfort and professionalism. Here’s how to strike the perfect balance..",
  },
  {
    image: "/images/blogoffice.png",
    date: "11",
    month: "may",
    subhead: "style hacks",
    title: "5 Ways to Refresh Your Office Look",
    description:
      "Looking to spice up your office wardrobe? These simple style hacks can help you stand out while staying professional..",
  },
  {
    image: "/images/blogoffice.png",
    date: "13",
    month: "may",
    subhead: "minimal trends",
    title: "Minimalist Fashion for Busy Professionals",
    description:
      "Clean lines and neutral tones are defining the wardrobes of today’s high-performing professionals..",
  },
  {
    image: "/images/blogoffice.png",
    date: "15",
    month: "may",
    subhead: "quick reads",
    title: "Blending Colors and Patterns Like a Pro",
    description:
      "Don't shy away from bold patterns. Learn how to mix prints with elegance and confidence..",
  },
  {
    image: "/images/blogoffice.png",
    date: "17",
    month: "may",
    subhead: "style daily",
    title: "Building a Capsule Wardrobe for Work",
    description:
      "Simplify your mornings with a capsule wardrobe that saves time without sacrificing style..",
  },
  {
    image: "/images/blogoffice.png",
    date: "19",
    month: "may",
    subhead: "trend alert",
    title: "Top Accessories to Elevate Your Look",
    description:
      "From statement bags to chic scarves, these accessories are redefining office fashion..",
  },
  {
    image: "/images/blogoffice.png",
    date: "21",
    month: "may",
    subhead: "bold moves",
    title: "Why Power Dressing is Making a Comeback",
    description:
      "The modern power suit is sleeker, more versatile, and sends the right message in any meeting..",
  },
  {
    image: "/images/blogoffice.png",
    date: "23",
    month: "may",
    subhead: "style diary",
    title: "From Desk to Dinner: Outfit Transitions",
    description:
      "Learn how to seamlessly transition your office outfit to an evening look with just a few tweaks..",
  },
];

function Products() {
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const paginationRef = useRef(null);
  // const prevRef2 = useRef(null);
  // const nextRef2 = useRef(null);
  // const paginationRef2 = useRef(null);
  const prevRef3 = useRef(null);
  const nextRef3 = useRef(null);
  const paginationRef3 = useRef(null);
  const prevRef4 = useRef(null);
  const nextRef4 = useRef(null);

  const [data, setData] = useState();
  const [products, setProducts] = useState([]);
  const [productsloading, setProductsloading] = useState(true);
  // const [selectedCat, setSelectedCat] = useState("Furniture");

  const swiperRef = useRef(null);
  const { showLoginPopup } = useApp();

  const navigate = useNavigate();

  // const availableTon = [
  //   0.8, 1, 1.25, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6, 7, 8, 10, 12, 13, 18, 20,
  // ];
  // const requiredTon = 11;
  // let bestPair = null;
  // let minDiff = Infinity;
  // let minGap = Infinity;
  // const findClosestPair = () => {
  //   if (availableTon.includes(requiredTon)) {
  //     console.log("Exact match found:", requiredTon);
  //     return;
  //   }
  //   if (requiredTon <= 12) {
  //     const nextGreater = availableTon.find((ton) => ton > requiredTon);
  //     if (nextGreater !== undefined) {
  //       console.log("Next greater ton:", nextGreater);
  //     } else {
  //       console.log("No tonnage greater than requiredTon found.");
  //     }
  //     return;
  //   }
  //   for (let i = 0; i < availableTon.length; i++) {
  //     for (let j = i + 1; j < availableTon.length; j++) {
  //       const sum = availableTon[i] + availableTon[j];
  //       const diff = Math.abs(requiredTon - sum);
  //       const gap = Math.abs(availableTon[i] - availableTon[j]);

  //       if (diff < minDiff || (diff === minDiff && gap < minGap)) {
  //         minDiff = diff;
  //         minGap = gap;
  //         bestPair = [availableTon[i], availableTon[j]];
  //       }
  //     }
  //   }
  //   console.log("Best pair:", bestPair);
  // };
  // useEffect(() => {
  //   findClosestPair();
  // });

  useEffect(() => {
    // fetchdata();
    fetchProductsData();
  }, []);

  const fetchProductsData = async () => {
    try {
      setProductsloading(true);
      const { data, error } = await supabase
        .from("product_variants")
        .select(`* ,product_id(*)`)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Filter products where it is approved
      const filtered = data.filter(
        (item) =>
          item.status === "approved" &&
          item.product_id.category !== "Partitions / Ceilings" &&
          item.product_id.category !== "Civil / Plumbing"
      );

      // 1. Extract unique image names
      const uniqueImages = [...new Set(filtered.map((item) => item.image))];

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
      const updatedProducts = filtered.map((item) => ({
        ...item,
        image: urlMap[item.image] || item.image, // fallback if URL not found
      }));

      // const filteredByCategory = updatedProducts.filter(
      //   (item) => item.product_id.category === selectedCat
      // );
      setData(filtered);
      setProducts(updatedProducts);
    } catch (error) {
      console.error("Error fetching filtered data:", error);
    } finally {
      setProductsloading(false);
    }
  };

  const categoryies = [
    {
      name: "Furniture",
      imagename: "/images/icons/Furniture.png",
    },
    {
      name: "Lighting",
      imagename: "/images/icons/Lighting.png",
    },
    {
      name: "Paint",
      imagename: "/images/icons/Paint.png",
    },
    // {
    //   name: `Civil & Plumbing`,
    //   imagename: "/images/icons/CivilPlumbing.png",
    // },
    {
      name: "Flooring",
      imagename: "/images/icons/Flooring.png",
    },
    // {
    //   name: "Partition",
    //   imagename: "/images/icons/PartitionsCeilings.png",
    // },
    {
      name: "HVAC",
      imagename: "/images/icons/HVAC.png",
    },
    {
      name: "Smart Solution",
      imagename: "/images/icons/SmartSolutions.png",
    },
    {
      name: "Lux",
      imagename: "/images/icons/Lux.png",
    },
  ];

  const brands = [
    { name: "wellspun", image: "/images/ecommerce/wellspun.png" },
    { name: "ikea", image: "/images/ecommerce/ikea.png" },
    { name: "ikea", image: "/images/ecommerce/innova.png" },
    { name: "ikea", image: "/images/ecommerce/fortis.png" },
    { name: "ikea", image: "/images/ecommerce/fortis.png" },
    { name: "ikea", image: "/images/ecommerce/fortis.png" },
    { name: "ikea", image: "/images/ecommerce/fortis.png" },
    { name: "ikea", image: "/images/ecommerce/fortis.png" },
    // { name: "ikea", image: "/images/ecommerce/fortis.png" },
    // { name: "ikea", image: "/images/ecommerce/fortis.png" },
  ];

  const EcommerceFeatures = [
    {
      title: "EASY PAYMENT",
      image: "/images/payment.png",
      width: "w-8",
    },
    {
      title: "FREE SHIPPMENT",
      image: "/images/shippment.png",
      width: "w-12",
    },
    {
      title: "EASY INSTALLATION",
      image: "/images/install.png",
      width: "w-8",
    },
    {
      title: "GIFT CARTS",
      image: "/images/gift.png",
      width: "w-8",
    },
  ];

  return (
    <div>
      <ToastContainer />
      <header>
        <Header />
      </header>
      {/* Hero section */}
      <section className="hidden lg:block lg:container lg:mx-auto">
        <div className=" bg-[url('/images/ecom-hero.png')] bg-contain bg-center bg-no-repeat h-[85vh] relative">
          <button className="absolute bg-[#334A78]/80 text-[#fff] font-semibold font-Poppins uppercase text-sm py-2 px-7 bottom-1/4 left-20 translate-y-7">
            Order now
          </button>
        </div>
      </section>

      {/* section 2 */}
      <section>
        <div className="hidden lg:block lg:container lg:mx-auto my-10">
          <div className="flex flex-col gap-2 md:flex-row justify-between items-stretch ">
            {EcommerceFeatures.map((feature) => (
              <Productitem
                image={feature.image}
                width={feature.width}
                title={feature.title}
                key={feature.title}
              />
            ))}
          </div>
        </div>
      </section>

      {/* section 3 */}
      <section>
        <div className="lg:container lg:mx-auto px-3 lg:px-12 my-10">
          <div className="hidden lg:block">
            {" "}
            <SectionHeader title={"Shop by categories"} isborder={false} />
          </div>
          <div className="flex overflow-x-auto items-center justify-around my-10 gap-6">
            {categoryies.map((cat) => (
              <div
                className="flex flex-col lg:justify-center  lg:items-center gap-3 cursor-pointer"
                key={cat.name}
                // onClick={() => setSelectedCat(cat.name)}
              >
                <div className="bg-[#F8F8F8] border border-[#ccc] p-4 w-16 h-16 xl:w-20 xl:h-20">
                  <img src={cat.imagename} alt="category" className="" />
                </div>
                <h3 className="font-lora text-[#111] text-[10px] lg:text-sm">
                  {cat.name}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-3">
        <div className="flex lg:hidden my-6 items-center gap-6 w-full">
          <BannerProduct />
          <BannerProduct />
          <div className="hidden  lg:hidden md:block">
            <BannerProduct />
          </div>
          {/* <div className="hidden  lg:hidden md:block">
            <BannerProduct />
          </div> */}
        </div>
      </section>

      {/* season splecial only for mobile  */}
      <section>
        <div className="lg:hidden px-3">
          <CardSection className="flex-1" title="Season’s Special" />
        </div>
      </section>

      {/* section 4 */}
      <section>
        <div className="hidden lg:block">
          <SectionHeader title={"Featured products"} />
        </div>
        <div className="lg:container px-4 lg:px-12 mx-auto my-6 lg:my-10">
          <div className="flex justify-between lg:justify-end gap-3">
            <div className="lg:hidden">
              <SectionHeader title={"Featured products"} />
            </div>
            <div className="flex ">
              <button
                ref={prevRef3}
                className="text-[#304778] disabled:text-gray-400"
              >
                <MdKeyboardArrowLeft size={30} />
              </button>
              <button
                ref={nextRef3}
                className=" text-[#304778] disabled:text-gray-400"
              >
                <MdKeyboardArrowRight size={30} />
              </button>
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-6">
            {/* Left side banners */}
            <div className="lg:flex hidden   flex-col items-center gap-6 lg:w-1/4 w-full">
              <BannerProduct />
              <BannerProduct />
            </div>

            {/* Right side Swiper grid */}
            {!productsloading ? (
              <div className="lg:w-3/4 w-full relative">
                {/* <div className="lg:hidden flex justify-between items-center gap-3">
                  <div>
                    <SectionHeader title={"Featured products"} />
                  </div>
                  <div className="flex items-center">
                    <button ref={prevRef4}>
                      <MdKeyboardArrowLeft size={30} color="#304778" />
                    </button>
                    <button ref={nextRef4}>
                      <MdKeyboardArrowRight size={30} color="#304778" />
                    </button>
                  </div>
                </div> */}
                <Swiper
                  ref={swiperRef}
                  onBeforeInit={(swiper) => {
                    swiper.params.navigation.prevEl =
                      prevRef3.current || prevRef4.current;
                    swiper.params.navigation.nextEl =
                      nextRef3.current || nextRef4.current;
                    swiper.params.pagination.el = paginationRef3.current;
                  }}
                  onSwiper={(swiper) => {
                    swiper.navigation.init();
                    swiper.navigation.update();
                    swiper.pagination.init();
                    swiper.pagination.update();
                  }}
                  modules={[Grid, Navigation, Pagination]}
                  slidesPerView={4}
                  grid={{
                    rows: 2,
                    fill: "row",
                  }}
                  spaceBetween={30}
                  className="relative pb-10"
                  breakpoints={{
                    0: {
                      slidesPerView: 2.02,
                      grid: { rows: 1 },
                      spaceBetween: 10,
                    },
                    768: {
                      slidesPerView: 5,
                      grid: { rows: 1 },
                      spaceBetween: 10,
                    },
                    1024: {
                      slidesPerView: 4,
                      grid: { rows: 2 },
                      spaceBetween: 30,
                    },
                  }}
                >
                  {products.map((product, index) => (
                    <SwiperSlide key={index}>
                      <Card product={product} />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            ) : (
              <div className="w-full flex justify-center items-center">
                <SpinnerFullPage />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* section 5 */}
      <section>
        <div className=" lg:container lg:mx-auto my-3 px-3 lg:px-12 lg:my-10">
          <SectionHeader title={"Shop by brands"} />
          <div className="grid grid-cols-4 lg:grid-cols-4 gap-2">
            {brands.map((brand, index) => (
              <div
                className="hover:shadow-lg flex justify-center items-center w-full h-28"
                key={index}
              >
                <img
                  src={brand.image}
                  alt={brand.name}
                  className="object-scale-down h-full cursor-pointer"
                  onClick={() => navigate("/brands")}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* shop furniture for mobile view */}
      <section>
        <div className="px-3 mb-6 lg:hidden">
          <CardSection className="flex-1" title="Top Deals On Furniture" />
        </div>
      </section>

      {/* section 6*/}
      <section>
        <div className="hidden lg:block px-3">
          <SectionHeader title={"Trending products"} />
        </div>
        <div className=" lg:container px-4 lg:px-12 mx-auto lg:my-10">
          <div className="flex justify-between lg:justify-end gap-3">
            <div className="lg:hidden">
              <SectionHeader title={"Trending products"} />
            </div>
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
            <Swiper
              onBeforeInit={(swiper) => {
                swiper.params.navigation.prevEl = prevRef.current;
                swiper.params.navigation.nextEl = nextRef.current;
                swiper.params.pagination.el = paginationRef.current;
              }}
              onSwiper={(swiper) => {
                swiper.navigation.init();
                swiper.navigation.update();
                swiper.pagination.init();
                swiper.pagination.update();
              }}
              modules={[Grid, Navigation, Pagination]}
              slidesPerView={4}
              slidesPerGroup={4}
              grid={{
                rows: 2,
                fill: "row",
              }}
              spaceBetween={30}
              //   pagination={{ clickable: true, el: ".custom-pagination" }}
              className="relative lg:pb-10"
              breakpoints={{
                0: {
                  slidesPerView: 2.02,
                  grid: { rows: 1 },
                  spaceBetween: 10,
                },
                768: {
                  slidesPerView: 5,
                  grid: { rows: 1 },
                  spaceBetween: 14,
                },
                1024: {
                  slidesPerView: 4,
                  grid: { rows: 2 },
                  spaceBetween: 30,
                },
              }}
            >
              {products.map((product, index) => (
                <SwiperSlide key={index}>
                  <ProductCard product={product} trending={true} />
                </SwiperSlide>
              ))}
            </Swiper>
            {/* Custom arrows */}
            {/* <div
              ref={prevRef}
              className="swiper-button-prev custom-nav absolute top-1/2 -left-10 transform -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow z-50"
            />
            <div
              ref={nextRef}
              className="swiper-button-next custom-nav absolute top-1/2 -right-10 transform -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow z-50"
            /> */}
          </div>

          {/* Custom pagination */}
          <div
            ref={paginationRef}
            className="custom-pagination hidden mt-4 lg:flex justify-center gap-2"
          />
        </div>
      </section>

      {/* section 7*/}
      <section>
        <div className="lg:container px-4 lg:px-12 mx-auto my-5">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="hidden lg:block">
              <CardSection className="flex-1" title="Season’s Special" />
            </div>
            <div className="hidden lg:block">
              <CardSection
                className="flex-1"
                title="Top Deals On Furniture"
                navigationPath="topdeal?category=Furniture"
              />
            </div>
          </div>
        </div>
      </section>

      {/* section 8*/}
      <section>
        <div className="lg:container px-4 lg:px-12 mx-auto mb-10">
          <div className="flex flex-col md:flex-row md:items-stretch gap-6">
            {/* Left Column */}
            <div className="flex-1">
              <CardSection
                title="Special sale on HVAC"
                navigationPath="topdeal?category=HVAC"
              />
            </div>

            {/* Right Column: Make this a positioned container */}
            <div className="hidden lg:block flex-1 relative">
              <img
                src="/images/ecommerce/image.png"
                alt="Sale Image"
                className="md:absolute top-0 left-0 w-full h-full p-2 cursor-pointer"
                // onClick={navigate}
              />
            </div>
          </div>
        </div>
      </section>

      {showLoginPopup && <Loginpoup />}
    </div>
  );
}

export default Products;

function Card({ product }) {
  const naviagte = useNavigate();
  const { isAuthenticated, localcartItems, cartItems, wishlistItems } =
    useApp();
  const isWishlisted = wishlistItems?.some(
    (item) => item.productId?.id === product.id
  );

  const { handleAddToCart, handleAddtoWishlist } = useHandleAddToCart();

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
    <div className="h-[300px] lg:h-[370px]">
      <div className="h-full flex flex-col border-[1px] border-[#AAAAAA] relative">
        {product.image && (
          <div
            onClick={() => naviagte(`/productview/${product.id}`)}
            className=" cursor-pointer"
          >
            <img
              src={product.image}
              alt={product.title}
              className="w-52 h-40 lg:h-56 mx-auto mt-4 object-contain"
            />
          </div>
        )}
        {/* {product.ispopular && (
          <span
            className={` font-lora text-[11px] capitalize absolute top-2 left-2 p-[5px] ${
              populartext === "popular"
                ? "bg-[#E3F3FF] text-[#000]"
                : "bg-[#374A75] text-white"
            }`}
          >
            {product.populartext || "eihvihevi"}
          </span>
        )} */}
        <div className="px-2 py-2 flex flex-col justify-center gap-3 font-lora  mt-auto">
          <p className=" text-center text-xs lg:text-sm">{product.title}</p>
          {/* <h5 className="lg:text-lg">Rs {product.price} </h5> */}
          <div className="flex justify-between items-center gap-2">
            <button
              onClick={() => handleAddToCart(product)}
              disabled={iscarted}
              className="flex items-center gap-1 font-Poppins text-[12px] py-1.5 border border-[#ccc] px-2"

              // className="flex justify-center items-center gap-1 font-Poppins text-[12px] py-1.5"
            >
              {iscarted ? "Added to cart" : "Add to cart"}{" "}
              {/* <BsArrowRight size={15} />{" "} */}
            </button>

            <div
              onClick={() => handleAddtoWishlist(product)}
              className=" text-[#ccc] hover:text-red-950 cursor-pointer"
            >
              {isWishlisted ? (
                <AiFillHeart size={20} color="red" />
              ) : (
                <GoHeart size={20} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LatestPost({ post }) {
  return (
    <div className="max-w-sm">
      <div className="relative">
        <img src={post.image} alt="blogoffice" />
        <div className="absolute  left-4 top-4 bg-white text-center px-3 py-1 shadow-md rounded-sm">
          <div className="text-lg font-bold">{post.date}</div>
          <div className="text-sm text-gray-500 -mt-1 uppercase">
            {post.month}
          </div>
        </div>
      </div>
      <div className="font-lora border border-[#000]/10 p-4 space-y-3">
        <p className="text-[#9A9A9A] text-[13px] leading-[13px] tracking-[1px]">
          {post.subhead}
        </p>
        <h2 className="font-semibold text-sm leading-[14px] tracking-[0.5px]">
          {post.title}
        </h2>
        <p className="text-sm tracking-[1px]">{post.description}</p>
        <button className="font-Poppins text-[#374A75] tracking-[1px] text-sm flex gap-3 items-center">
          Read More <TiArrowRight size={25} />
        </button>
      </div>
    </div>
  );
}

function Productitem({ image, title, width }) {
  return (
    <div className="py-3 lg:py-6 px-6 lg:px-10 border border-[#374A75] max-w-xs w-full mx-auto lg:w-auto">
      <div className="flex items-center justify-center font-lora text-base gap-4 ">
        <div className={`${width}`}>
          <img src={image} alt="" className={`${width}`} />
        </div>
        <p className="text-sm lg:text-base text-[#111]">{title}</p>
      </div>
    </div>
  );
}

function BannerProduct() {
  const naviagte = useNavigate();
  return (
    <div className="max-w-60 w-full h-96 relative rounded overflow-hidden shadow-lg">
      <img
        src="/images/banner-chair.jpg"
        alt="Meeting Chairs"
        className="w-full h-full object-cover"
      />

      <div
        className="absolute top-0 left-0 w-full bg-[#e0f4ff] text-black flex flex-col justify-evenly px-6"
        style={{
          clipPath: "ellipse(95% 100% at 25% 0%)",
          height: "45%",
        }}
      >
        <p className="text-xs uppercase tracking-[3px] font-lora">
          New collection
        </p>
        <h2 className="text-lg font-lora tracking-wide">
          MEETING <br /> CHAIRS
        </h2>
        <button
          onClick={() => naviagte("/shop")}
          className="mt-1 text-sm underline underline-offset-4 decoration-[#aaaaaa] flex items-center gap-2 group overflow-hidden relative hover:scale-105 transition-transform duration-700 ease-in-out"
        >
          <span className="relative z-10">Discover more</span>
          <BsArrowRight
            size={15}
            className="absolute opacity-0 group-hover:opacity-100 translate-x-[550%] group-hover:translate-x-[700%] transition-transform duration-700 ease-in-out"
          />
        </button>
      </div>
    </div>
  );
}

function ProductCard({ product, trending = false }) {
  const naviagte = useNavigate();

  return (
    <>
      {!trending && (
        <div className="max-w-xs flex flex-col md:flex-row border border-[#191716]/80 p-3">
          <div
            className="flex-1"
            onClick={() => naviagte(`/productview/${product.id}`)}
          >
            <img
              src={product.image}
              alt="trending product"
              className="w-[220px] h-[200px] object-contain"
            />
          </div>
          <div className="flex-1 flex flex-col justify-center items-center gap-3 font-lora space-y-2">
            <p className="text-center text-sm leading-[14px] tracking-[0.96px] lg:text-sm">
              {product.title}
            </p>
            <h2 className="text-base leading-4 tracking-[1px] text-[#374A75]">
              &#8377; {product.price}
            </h2>
            <button className="font-Poppins text-[#000] flex gap-2 leading-[13px] tracking-[1px] text-[13px]">
              Add to cart <BsArrowRight size={15} />
            </button>
          </div>
        </div>
      )}

      {trending && (
        <div
          onClick={() => naviagte(`/productview/${product.id}`)}
          className="border border-[#ccc] cursor-pointer"
        >
          <img
            src={product.image}
            alt="trending product"
            className="max-w-sm h-[200px] w-full object-contain"
          />
        </div>
      )}
    </>
  );
}

function SectionHeader({ title, isborder = true }) {
  return (
    <div className="flex flex-col justify-center lg:items-center mb-4 lg:mb-10 ">
      <h3 className="text-nowrap font-lora text-sm lg:text-2xl text-[#111] tracking-wider uppercase mb-2">
        {title}
      </h3>
      {isborder && (
        <p className="w-[20%] lg:w-[4%] h-[1.5px] bg-[#374A75] "></p>
      )}
    </div>
  );
}
