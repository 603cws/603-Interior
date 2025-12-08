import React, { useState, useRef, useEffect } from "react";
import LandingNavbar from "../../common-components/LandingNavbar";
import { HiOutlineArrowSmRight } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import Footer from "../../common-components/Footer";
import ContactUsPopup from "../ContactUsPopup";
import { supabase } from "../../services/supabase";
import { useApp } from "../../Context/Context";
import LoginPopup from "../../common-components/LoginPopup";
import CategorySvg from "../../common-components/CategorySvg";

const TOP_OFFERS = [
  {
    title: "Lighting",
    subtitle: "Up to 20% off",
    img: "/images/ecommerce/lighting.png",
  },
  {
    title: "Paint",
    subtitle: "Up to 20% off",
    img: "/images/ecommerce/furniture.png",
  },
];

const BOTTOM_OFFERS = [
  {
    title: "Partition",
    subtitle: "Up to 20% off",
    img: "/images/ecommerce/smart-solution-bg.jpg",
  },
  {
    title: "Lights",
    subtitle: "Up to 20% off",
    img: "/images/ecommerce/lights.png",
  },
  { title: "AC", subtitle: "Up to 20% off", img: "/images/ecommerce/ac.png" },
];

const heroSlides = [
  {
    title: "Furniture that mirrors your style",
    bg: "/images/brands/brands-bg.jpeg",
    link: "/shop",
  },
  {
    title: "Create comfort with HVAC solutions",
    bg: "/images/brands/brands-bg.jpeg",
    link: "/hvac",
  },
  {
    title: "Lighting that brightens your vision",
    bg: "/images/brands/brands-bg.jpeg",
    link: "/lights",
  },
  {
    title: "Flooring that shapes your space",
    bg: "/images/brands/brands-bg.jpeg",
    link: "/flooring",
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

const categories = [
  { title: "Chairs", img: "/images/ecommerce/chair2.png" },
  { title: "Air-condition", img: "/images/ecommerce/ac2.jpg" },
  { title: "Coffee Table", img: "/images/ecommerce/coffetable2.jpg" },
  { title: "Lights", img: "/images/ecommerce/lights2.png" },
  { title: "Storage", img: "/images/ecommerce/storage2.jpg" },
];

function BrandsOverview() {
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState("Furniture");
  const [hasOverflow, setHasOverflow] = useState(false);
  const [bestProducts, setBestProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [categoryProducts, setCategoryProducts] = useState([]);

  const getCleanedCategoryName = (categoryName) => {
    return categoryName.replace(/[^a-zA-Z0-9]/g, "");
  };

  useEffect(() => {
    const fetchProductsData = async () => {
      try {
        // setProductsloading(true);
        const { data, error } = await supabase
          .from("product_variants")
          .select(`* ,product_id(*),reviews(*)`)
          .order("created_at", { ascending: false })
          .neq("productDisplayType", "boq");

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
        const { data: signedUrls, error: signedUrlError } =
          await supabase.storage
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
        // setData(filtered);
        setProducts(updatedProducts);

        const filteredProducts = updatedProducts.filter(
          (product) =>
            getCleanedCategoryName(product.product_id.category) ===
            getCleanedCategoryName("Furniture")
        );
        setCategoryProducts(filteredProducts);

        const sortedByStars = [...updatedProducts]
          .filter((product) => product.reviews && product.reviews.length > 0)
          .sort((a, b) => {
            const avgA =
              a.reviews.reduce((sum, r) => sum + r.stars, 0) / a.reviews.length;

            const avgB =
              b.reviews.reduce((sum, r) => sum + r.stars, 0) / b.reviews.length;

            return avgB - avgA;
          });

        setBestProducts(sortedByStars);
      } catch (error) {
        console.error("Error fetching filtered data:", error);
      } finally {
        // setProductsloading(false);
      }
    };
    fetchProductsData();
  }, []);

  return (
    <div className="font-TimesNewRoman">
      {/* Banner Section */}
      <section className="flex flex-col h-screen">
        <LandingNavbar className="bg-white" />

        <Swiper
          modules={[Autoplay, Navigation, Pagination]}
          autoplay={{ delay: 3500 }}
          loop={true}
          navigation
          pagination={{ clickable: true }}
          className="flex-1 h-full w-full"
        >
          {heroSlides.map((slide, i) => (
            <SwiperSlide key={i} className="h-full">
              <div
                className="h-full w-full bg-cover bg-center bg-no-repeat flex items-center"
                style={{ backgroundImage: `url(${slide.bg})` }}
              >
                <div className="px-3 w-full lg:container mx-auto">
                  <div className="pl-5 md:pl-10 lg:pl-20 text-[#000] space-y-8">
                    <h1 className="text-4xl md:text-6xl font-bold max-w-xl">
                      {slide.title}
                    </h1>

                    {/* <button
                      onClick={() => navigate(slide.link)}
                      className="capitalize font-bold text-lg md:text-xl text-white bg-[#334A78] rounded flex items-center gap-2 px-4 py-2 hover:bg-white hover:text-[#334A78] border border-[#334A78] transition-colors duration-300 ease-in-out"
                    >
                      <span>shop now</span>
                      <HiOutlineArrowSmRight />
                    </button> */}
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* Section 1 */}
      <section className="px-4 lg:container mx-auto py-10">
        <div className="relative">
          <SectionHeader title={"Brands by categories"} isborder={true} />
          <div className="px-20">
            <CategorySvg
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />
          </div>
          <div className="grid grid-cols-4 lg:grid-cols-4 gap-2 pt-16">
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
      <TrendingProducts />

      {/* Section 2 */}
      <section className="px-4 lg:container mx-auto py-10">
        <div className="relative">
          {/* <SectionHeader title={"Trending Products"} isborder={true} /> */}
          <div className="w-full py-8">
            <div className="">
              {/* <div className="max-w-6xl mx-auto"> */}
              <div className="flex items-end justify-between  px-4 md:px-0">
                {categories.map((it, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col items-center w-28 md:w-44"
                  >
                    {/* image container */}
                    <div className="relative w-28 h-28 md:w-44 md:h-44">
                      {/* actual image */}
                      <img
                        src={it.img}
                        alt={it.title}
                        className="absolute inset-0 w-full h-full object-cover rounded-t-[200px] rounded-b-2xl"
                      />
                    </div>

                    {/* label */}
                    <div className="mt-4 text-center">
                      <div className="text-xs md:text-lg font-bold tracking-wider text-[#374A75]">
                        {it.title}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3 */}
      {bestProducts.length > 0 && (
        <section className="px-4 lg:container mx-auto py-10">
          <SectionHeader title="best products" />
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-5">
            {bestProducts.map((product) => (
              <Card key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* Section 4 */}
      <TopBrands />

      {/* Section 5 */}
      <section className="px-4 lg:container mx-auto pt-10 pb-16">
        {/* Parent: left hero + right area */}
        <div className="grid gap-4 md:grid-cols-12 items-center font-TimesNewRoman">
          {/* LEFT: big hero card */}
          <div className="col-span-12 lg:col-span-5">
            <div className="group block rounded-lg overflow-hidden relative h-80 md:h-[545px]">
              <img
                src="/images/ecommerce/festive.png"
                alt="Festive offers"
                className="absolute inset-0 w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105"
              />
              <div className="relative z-10 h-full flex flex-col justify-end pl-4 md:pl-8 pb-8 text-white">
                <h2 className="text-5xl md:text-8xl leading-tight">
                  Furniture
                </h2>
                {/* <p className="mt-2 text-xl md:text-2xl">Up to 20% off</p> */}
                {/* <img
                  src="/images/ecommerce/button.png"
                  alt="arrow button"
                  className="mt-2 w-2 md:w-4 hover:cursor-pointer"
                  onClick={() => navigate("/shop?category")}
                /> */}
              </div>
            </div>
          </div>

          {/* RIGHT: nested grid (top row: 2 cols, bottom row: 3 cols) */}
          <div className="col-span-12 lg:col-span-7">
            <div className="grid gap-4">
              {/* Top row: 2 columns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {TOP_OFFERS.map((o) => (
                  <div
                    key={o.title}
                    className="group rounded-lg overflow-hidden relative h-48 md:h-60"
                  >
                    <img
                      src={o.img}
                      alt={o.title}
                      className="absolute inset-0 w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="relative z-10 h-full flex flex-col justify-end items-start pl-2 lg:pl-8 pb-6 text-white">
                      <h3 className="text-xl md:text-3xl">{o.title}</h3>
                      {/* <p className="text-base md:text-2xl">{o.subtitle}</p> */}
                      {/* <img
                        src="/images/ecommerce/button.png"
                        alt="arrow button"
                        className="mt-2 w-2 md:w-4 hover:cursor-pointer"
                        // onClick={() =>
                        //   navigate(`/products/topdeal/?category=${o.title}`)
                        // }
                      /> */}
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom row: 3 columns */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {BOTTOM_OFFERS.map((o) => (
                  <div
                    key={o.title}
                    className="group rounded-lg overflow-hidden relative h-44 md:h-72"
                  >
                    <img
                      src={o.img}
                      alt={o.title}
                      className="absolute inset-0 w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-[#000]/40 rounded-lg" />
                    <div className="relative z-10 h-full flex flex-col justify-end items-start pl-2 lg:pl-6 pb-8 text-white">
                      <h4 className="text-xl md:text-3xl">{o.title}</h4>
                      {/* <p className="text-base md:text-2xl">{o.subtitle}</p> */}
                      {/* <img
                        src="/images/ecommerce/button.png"
                        alt="arrow button"
                        className="mt-2 w-2 md:w-4 hover:cursor-pointer"
                      /> */}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <PartnerBanner />
      <Footer />
    </div>
  );
}

export default BrandsOverview;

function SectionHeader({ title, isborder = true }) {
  return (
    <div className="flex flex-col justify-center lg:items-center mb-4 lg:mb-10 ">
      <h3 className="text-nowrap font-TimesNewRoman text-sm lg:text-2xl text-[#111] tracking-wider uppercase mb-2">
        {title}
      </h3>
      {isborder && (
        <p className="w-[20%] lg:w-[4%] h-[1.5px] bg-[#374A75] "></p>
      )}
    </div>
  );
}
function TrendingProducts() {
  const products = [
    {
      id: 1,
      img: "/images/welspunchair.png",
      logo: "/images/welspun-logo.png",
      name: "PRODUCT NAME",
    },
    {
      id: 2,
      img: "/images/welspunchair.png",
      logo: "/images/welspun-logo.png",
      name: "PRODUCT NAME",
    },
    {
      id: 3,
      img: "/images/welspunchair.png",
      logo: "/images/welspun-logo.png",
      name: "PRODUCT NAME",
    },
    {
      id: 4,
      img: "/images/welspunchair.png",
      logo: "/images/welspun-logo.png",
      name: "PRODUCT NAME",
    },
    {
      id: 5,
      img: "/images/welspunchair.png",
      logo: "/images/welspun-logo.png",
      name: "PRODUCT NAME",
    },
  ];

  return (
    <div className="py-12">
      {/* Heading */}
      {/* <div className="text-center mb-12">
        <h2 className=" text-lg font-semibold tracking-wide text-gray-800">
          TRENDING PRODUCTS
        </h2>
        <div className="w-12 h-[1px] bg-gray-400 mx-auto mt-2"></div>
      </div> */}
      <SectionHeader title={"TRENDING PRODUCTS"} />

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8 px-6 md:px-16">
        {products.map((p) => (
          <div
            key={p.id}
            className="bg-[#324674] rounded-2xl text-white p-6 flex flex-col items-center justify-between shadow-md"
          >
            {/* Product Image */}
            <img
              src={p.img}
              alt={p.name}
              className="h-40 object-contain mb-4"
            />

            {/* Product Name */}
            <p className="text-lg font-medium tracking-wide mb-2 font-TimesNewRoman">
              {p.name}
            </p>

            {/* Brand Logo */}
            <img
              src={p.logo}
              alt="brand logo"
              className="h-8 object-contain bg-white py-2 px-4 rounded"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function TopBrands() {
  const brands = [
    { id: 1, img: "/images/brand1.jpg", logo: "/images/welspun-logo.png" },
    { id: 2, img: "/images/brand1.jpg", logo: "/images/welspun-logo.png" },
    { id: 3, img: "/images/brand1.jpg", logo: "/images/welspun-logo.png" },
    { id: 4, img: "/images/brand1.jpg", logo: "/images/welspun-logo.png" },
    { id: 5, img: "/images/brand1.jpg", logo: "/images/welspun-logo.png" },
  ];

  return (
    // <div className="w-full py-10 ">
    <div className="w-full py-10 lg:container ">
      {/* Header */}
      <div className="bg-[#374A75] text-white text-center py-6 mb-10">
        <h2 className="text-xl font-semibold tracking-wide font-TimesNewRoman">
          TOP BRANDS
        </h2>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-8 px-6 ">
        {brands.map((brand) => (
          <div
            key={brand.id}
            className="relative border-8 border-[#4A66B3] rounded-2xl overflow-hidden h-72"
          >
            {/* Background Image */}
            <img
              src={brand.img}
              alt="Brand Background"
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* White Strip + Logo */}
            <div className="absolute bottom-10 w-full bg-white py-3 flex justify-center items-center">
              <img
                src={brand.logo}
                alt="Brand Logo"
                className="h-7 object-contain"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PartnerBanner() {
  const [showContactPopup, setShowContactPopup] = useState(false);
  return (
    <>
      <div className="w-full bg-[#374A75] text-white py-10 px-6 md:px-16 font-Georgia">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* Left Section */}
          <div>
            <h2 className="text-4xl md:text-6xl font-medium leading-tight">
              Join Our Partner <br /> Network
            </h2>
          </div>

          {/* Right Section */}
          <div className="flex flex-col gap-6 md:pl-10 md:border-l md:border-white/40">
            <p className="text-sm md:text-base text-white/90 leading-relaxed">
              Collaborate with us to bring exceptional quality <br />
              and solutions to more customers.
            </p>

            <button
              onClick={() => setShowContactPopup((prev) => !prev)}
              className="bg-[#1C346B] hover:bg-[#0a142f] transition text-white px-6 py-2 rounded-full w-fit"
            >
              Partner with us
            </button>
          </div>
        </div>
      </div>
      {showContactPopup && (
        <ContactUsPopup onClose={() => setShowContactPopup(false)} />
      )}
    </>
  );
}

function Card({ product }) {
  const navigate = useNavigate();
  const {
    isAuthenticated,
    localcartItems,
    cartItems,
    wishlistItems,
    showLoginPopup,
    setShowLoginPopup,
    pendingProduct,
    setPendingProduct,
  } = useApp();
  // const isWishlisted = wishlistItems?.some(
  //   (item) => item.productId?.id === product.id
  // );

  // const { handleAddToCart, handleAddtoWishlist } = useHandleAddToCart();

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
    <>
      <div className="h-[300px] lg:h-[340px]">
        <div className="h-full flex flex-col relative">
          {product.image && (
            <div
              onClick={() =>
                navigate(`/productview/${product.id}`, {
                  state: { from: "products" },
                })
              }
              className="cursor-pointer"
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
          <div className="px-2 py-2 flex flex-col justify-around gap-3 font-TimesNewRoman mt-auto">
            <p className=" text-xs lg:text-sm line-clamp-1 uppercase">
              {product.manufacturer}
            </p>
            <p className="text-xs lg:text-sm line-clamp-1 uppercase pt-2">
              {product.title}
            </p>
          </div>
        </div>
      </div>
      {showLoginPopup && (
        <LoginPopup
          onClose={() => setShowLoginPopup(false)}
          product={pendingProduct}
        />
      )}
    </>
  );
}
