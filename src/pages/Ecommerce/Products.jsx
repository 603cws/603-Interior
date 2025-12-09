import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/grid";
import "./products.css";
import Header from "./Header";
import { useEffect, useState } from "react";
import { useApp } from "../../Context/Context";
import { supabase } from "../../services/supabase";
import { useNavigate } from "react-router-dom";
import { useHandleAddToCart } from "../../utils/HelperFunction";
import { ToastContainer } from "react-toastify";
import { AiFillHeart } from "react-icons/ai";
import { GoHeart } from "react-icons/go";
import Loginpoup from "../../common-components/LoginPopup";
import { HiOutlineArrowSmRight } from "react-icons/hi";
import Footer from "../../common-components/Footer";
import CategorySvg from "../../common-components/CategorySvg";

const TOP_OFFERS = [
  {
    title: "Lighting",
    subtitle: "Up to 20% off",
    img: "/images/ecommerce/lighting.png",
  },
  {
    title: "Furniture",
    subtitle: "Up to 20% off",
    img: "/images/ecommerce/furniture.png",
  },
];

const BOTTOM_OFFERS = [
  {
    title: "Smart Solutions",
    subtitle: "Up to 20% off",
    img: "/images/ecommerce/smart-solution-bg.jpg",
  },
  {
    title: "Lux",
    subtitle: "Up to 20% off",
    img: "/images/ecommerce/lights.png",
  },
  { title: "HVAC", subtitle: "Up to 20% off", img: "/images/ecommerce/ac.png" },
];

const products2 = {
  chair: {
    title: "Orange Chair",
    price: "Rs. 3799.00",
    image: "/images/ecommerce/chair.webp",
    link: "/productview/d6a99c93-e0b9-4958-9dc5-be9a9afc472e",
    id: "d6a99c93-e0b9-4958-9dc5-be9a9afc472e",
  },
  lamp: {
    title: "Pendant Lamp",
    price: "Rs. 2599.00",
    image: "/images/ecommerce/lamp.webp",
    link: "/productview/d4bedb5d-b06a-444c-8dd3-9bef55e631de",
    id: "d4bedb5d-b06a-444c-8dd3-9bef55e631de",
  },
  rug: {
    title: "Rug",
    price: "Rs. 2599.00",
    image: "/images/ecommerce/rug.webp",
    link: "/productview/45776063-a918-44f7-858b-8b95738c8e78",
    id: "45776063-a918-44f7-858b-8b95738c8e78",
  },
  "chair-green": {
    title: "Chair Green",
    price: "Rs. 2599.00",
    image: "/images/ecommerce/chair-green.png",
    link: "/productview/1d352504-f171-41fc-9bc4-333c68ae9200",
    id: "1d352504-f171-41fc-9bc4-333c68ae9200",
  },
};

const featuredProducts = [
  {
    title: "Lighting",
    description:
      "Innovative lighting solutions to brighten and energize your workspace.",

    bg: "/images/ecommerce/lighting-bg.jpg",
  },
  {
    title: "Furniture",
    description:
      "Ergonomic and stylish office furniture designed for efficiency and comfort.",

    bg: "/images/ecommerce/furniture-bg.jpg",
  },
  {
    title: "Smart Solutions",
    description:
      "Flexible and modern space dividers for privacy and better layout planning.",

    bg: "/images/ecommerce/smart-solution-bg.jpg",
  },
  {
    title: "Luxury",
    description:
      "Exclusive décor pieces that add character and a finishing touch of luxury.",

    bg: "/images/ecommerce/lux-bg.jpg",
  },
  {
    title: "HVAC",
    description:
      "Advanced climate control ensuring year-round comfort with silent efficiency.",

    bg: "/images/ecommerce/hvac-bg.jpg",
  },
  {
    title: "Flooring",
    description:
      "Premium flooring options that bring warmth, durability, and luxury underfoot.",

    bg: "/images/ecommerce/flooring-bg.webp",
  },
];

function Products() {
  const { handleAddToCart } = useHandleAddToCart();

  const [products, setProducts] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState("Furniture");
  const [categoryProducts, setCategoryProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("chair");
  const [bestProducts, setBestProducts] = useState([]);

  const navigate = useNavigate();

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
      }
    };
    fetchProductsData();
  }, []);

  const getCleanedCategoryName = (categoryName) => {
    return categoryName.replace(/[^a-zA-Z0-9]/g, "");
  };

  const filterByCategory = (category) => {
    setSelectedCategory(category);
    const updatedProducts = products.filter(
      (product) =>
        getCleanedCategoryName(product.product_id.category) ===
        getCleanedCategoryName(category)
    );
    setCategoryProducts(updatedProducts);
  };

  const brands = [
    { name: "wellspun", image: "/images/ecommerce/wellspun.png" },
    { name: "ikea", image: "/images/ecommerce/ikea.png" },
    { name: "ikea", image: "/images/ecommerce/innova.png" },
    { name: "ikea", image: "/images/ecommerce/fortis.png" },
    { name: "ikea", image: "/images/ecommerce/fortis.png" },
    { name: "ikea", image: "/images/ecommerce/fortis.png" },
    { name: "ikea", image: "/images/ecommerce/fortis.png" },
    { name: "ikea", image: "/images/ecommerce/fortis.png" },
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
      <section className="h-screen flex flex-col">
        {/* <LandingNavbar className="relative" /> */}
        <div className="flex-1 px-3 w-full lg:container mx-auto font-TimesNewRoman my-5">
          <div className=" bg-[url('/images/ecommerce/e-com-home.png')] bg-no-repeat bg-cover bg-center flex-1 h-full flex items-center ">
            <div className="space-y-10 w-full pl-5 md:pl-10 lg:pl-20">
              <p className="capitalize font-bold text-xl text-[#000]">
                trending design
              </p>
              <h1 className="text-4xl md:text-6xl font-bold text-[#000]">
                Furniture that
                <br /> mirrors your style
              </h1>
              <button
                onClick={() => navigate("/shop")}
                className="capitalize font-bold text-lg md:text-xl text-[#fff] bg-[#334A78] rounded flex items-center gap-2 px-4 py-2 hover:bg-[#fff] hover:text-[#334A78] border border-[#334A78] transition-colors duration-300 ease-in-out"
              >
                <span>shop now</span>
                <HiOutlineArrowSmRight />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* section 2 */}
      <section>
        <div className="hidden lg:block lg:container lg:mx-auto my-10">
          <div className="flex flex-col gap-2  md:flex-row justify-between items-stretch">
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
      <section className="lg:container lg:mx-auto px-3 my-16 font-TimesNewRoman">
        <div className="relative">
          <SectionHeader title={"Shop by categories"} isborder={true} />
          <CategorySvg
            selectedCategory={selectedCategory}
            setSelectedCategory={filterByCategory}
          />
        </div>
        <div>
          <div className="flex justify-end my-2">
            {/* <p>Table</p> */}
            <button
              onClick={() => navigate(`/shop/?category=${selectedCategory}`)}
              className="capitalize text-[#334A78] text-sm font-bold border border-[#334A78] px-3 py-1.5 hover:bg-[#f1f1f1]"
            >
              view all
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-5">
            {categoryProducts.length === 0 && (
              <p className="text-center col-span-full">
                No products found in {selectedCategory} category.
              </p>
            )}
            {categoryProducts.slice(0, 10).map((product) => (
              <Card key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* section 4 */}
      <section className="lg:container lg:mx-auto px-3 font-TimesNewRoman py-10">
        <SectionHeader title="featured products" />
        <div className="space-y-7">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="bg-[#F3F4F6] space-y-5 px-5 py-10 rounded-lg">
              <h3 className="text-lg tracking-wider">
                Most Popular product categories
              </h3>
              <p className="text-sm tracking-wider">
                Explore our wide range of office interior solutions design to
                enhance productivity,comfort, and aesthetic.
              </p>
              <button
                onClick={() => navigate("/shop")}
                className="bg-[#334A78] text-[#fff] text-xs px-4 py-2 capitalize font-bold rounded hover:bg-[#4C69A4]"
              >
                discover more{" "}
              </button>
            </div>
            {featuredProducts.slice(0, 2).map((item, i) => (
              <div
                key={i}
                className={` px-5 py-10 bg-center bg-cover text-[#fff] rounded-lg relative`}
                style={{ backgroundImage: `url(${item.bg})` }}
              >
                <div className="absolute inset-0 bg-[#000]/40 rounded-lg" />
                <div className="relative space-y-5">
                  <h3 className="text-lg tracking-wider">{item.title}</h3>
                  <p className="text-sm">{item.description}</p>
                  <button
                    onClick={() => navigate(`/shop/?category=${item.title}`)}
                    className="bg-[#BACED5] text-[#000] text-xs px-4 py-2 capitalize font-bold rounded hover:bg-[#A8BDC5]"
                  >
                    view product
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {featuredProducts.slice(2).map((item, i) => (
              <div
                key={i}
                className={`px-2 md:px-5 py-10 bg-center bg-cover text-[#fff] rounded-lg relative`}
                style={{ backgroundImage: `url(${item.bg})` }}
              >
                <div className="absolute inset-0 bg-[#000]/40 rounded-lg" />
                <div className="relative space-y-5 ">
                  <h3 className="text-lg tracking-wider">{item.title}</h3>
                  <p className="text-sm">{item.description}</p>
                  <button
                    onClick={() =>
                      navigate(
                        `/shop/?category=${
                          item.title === "Luxury" ? "Lux" : item.title
                        }`
                      )
                    }
                    className="bg-[#BACED5] text-[#000] text-xs px-4 py-2 capitalize font-bold rounded hover:bg-[#A8BDC5]"
                  >
                    view product
                  </button>
                </div>
              </div>
            ))}
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

      {/* section 7*/}
      <section className="lg:container lg:mx-auto my-3 px-3 lg:px-12 lg:my-10">
        <SectionHeader title={"Elegance and Comfort"} />

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-2 w-full items-center place-self-center">
          {/* Left Image with Hotspots */}
          <div className="relative w-full lg:w-2/3 items-center">
            <img
              src="/images/ecommerce/roomImage.jpg"
              alt="Room"
              className="w-full rounded-lg h-full"
            />

            {/* Hotspot for Chair */}
            <button
              onMouseEnter={() => setSelectedProduct("chair")}
              onClick={() => setSelectedProduct("chair")}
              className={`absolute top-[65%] left-[30%] w-6 h-6 rounded-full bg-white border-[7px] border-[#374A75] shadow-lg ${
                selectedProduct === "chair" ? "opacity-100" : "opacity-70"
              }`}
            />

            {/* Hotspot for Lamp */}
            <button
              onMouseEnter={() => setSelectedProduct("lamp")}
              onClick={() => setSelectedProduct("lamp")}
              className={`absolute top-[25%] left-[35%] w-6 h-6 rounded-full bg-white border-[7px] border-[#374A75] shadow-lg ${
                selectedProduct === "lamp" ? "opacity-100" : "opacity-70"
              }`}
            />

            {/* Hotspot for Green Chair */}
            <button
              onMouseEnter={() => setSelectedProduct("chair-green")}
              onClick={() => setSelectedProduct("chair-green")}
              className={`absolute top-[61%] left-[53%] w-6 h-6 rounded-full bg-white border-[7px] border-[#374A75] shadow-lg ${
                selectedProduct === "chair-green" ? "opacity-100" : "opacity-70"
              }`}
            />

            {/* Hotspot for Rug */}
            <button
              onMouseEnter={() => setSelectedProduct("rug")}
              onClick={() => setSelectedProduct("rug")}
              className={`absolute bottom-[20%] left-[40%] w-6 h-6 rounded-full bg-white border-[7px] border-[#374A75] shadow-lg ${
                selectedProduct === "rug" ? "opacity-100" : "opacity-70"
              }`}
            />
          </div>

          {/* Right Product Info */}
          <div className="lg:w-1/3 flex flex-col items-center lg:items-center lg:text-left">
            {/* Product Image */}
            <img
              src={products2[selectedProduct].image}
              alt={products2[selectedProduct].title}
              className="w-96 h-auto rounded-lg shadow-md p-4 cursor-pointer"
              onClick={() => navigate(products2[selectedProduct].link)}
            />

            {/* Black Dots */}
            <div className="flex items-center justify-center gap-2 my-4">
              {Object.keys(products2).map((key, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedProduct(key)}
                  className={`w-3 h-3 rounded-full ${
                    selectedProduct === key ? "bg-black" : "bg-gray-400"
                  }`}
                ></button>
              ))}
            </div>

            {/* Title & Price */}
            <h3
              className="text-lg font-medium cursor-pointer"
              onClick={() => navigate(products2[selectedProduct].link)}
            >
              {products2[selectedProduct].title}
            </h3>
            <p
              className="text-gray-600 cursor-pointer"
              onClick={() => navigate(products2[selectedProduct].link)}
            >
              {products2[selectedProduct].price}
            </p>
            <button
              onClick={() => {
                handleAddToCart(products2[selectedProduct], false);
                navigate("/cart");
              }}
              className="bg-[#334A78] text-[#fff] text-xs px-4 py-2 mt-2 capitalize font-bold rounded hover:bg-[#4C69A4] transition-transform duration-300 hover:scale-110"
            >
              BUY NOW
            </button>
          </div>
        </div>
      </section>

      {/* section 8*/}
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

      {/* section 9*/}
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
                  Festive
                  <br />
                  offers
                </h2>
                <p className="mt-2 text-xl md:text-2xl">Up to 20% off</p>
                <img
                  src="/images/ecommerce/button.png"
                  alt="arrow button"
                  className="mt-2 w-2 md:w-4 hover:cursor-pointer"
                  onClick={() => navigate("/shop?category")}
                />
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
                      <p className="text-base md:text-2xl">{o.subtitle}</p>
                      <img
                        src="/images/ecommerce/button.png"
                        alt="arrow button"
                        className="mt-2 w-2 md:w-4 hover:cursor-pointer"
                        onClick={() =>
                          navigate(`/products/topdeal/?category=${o.title}`)
                        }
                      />
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
                      <p className="text-base md:text-2xl">{o.subtitle}</p>
                      <img
                        src="/images/ecommerce/button.png"
                        alt="arrow button"
                        className="mt-2 w-2 md:w-4 hover:cursor-pointer"
                        onClick={() =>
                          navigate(`/products/topdeal/?category=${o.title}`)
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Products;

function Card({ product }) {
  const naviagte = useNavigate();
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
    <>
      <div className="h-[300px] lg:h-[370px]">
        <div className="h-full flex flex-col border-[1px] border-[#AAAAAA] relative">
          {product.image && (
            <div
              onClick={() =>
                naviagte(`/productview/${product.id}`, {
                  state: { from: "products" },
                })
              }
              className=" cursor-pointer"
            >
              <img
                src={product.image}
                alt={product.title}
                className="w-52 h-40 lg:h-56 mx-auto mt-4 object-contain"
              />
            </div>
          )}
          <div className="px-2 py-2 flex flex-col justify-center gap-3 font-TimesNewRoman  mt-auto">
            <p className=" text-xs lg:text-sm line-clamp-1">{product.title}</p>
            <p className="text-xs lg:text-sm">
              RS.{" "}
              {product?.ecommercePrice?.sellingPrice.toLocaleString("en-IN", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
            <div className="flex justify-between items-center gap-2">
              <div>
                {product.stockQty > 0 ? (
                  <button
                    onClick={() => handleAddToCart(product, iscarted)}
                    className="flex items-center gap-1 font-TimesNewRoman text-sm py-1.5 border border-[#ccc] px-2 hover:bg-[#DDDDDD]"
                  >
                    {iscarted ? "Go to cart" : "Add to cart"}{" "}
                  </button>
                ) : (
                  <span className="text-sm text-red-500 font-semibold">
                    Out of stock
                  </span>
                )}
              </div>

              <div
                onClick={() => {
                  handleAddtoWishlist(product);
                  setPendingProduct(product);
                  sessionStorage.setItem(
                    "addToWishlistProduct",
                    JSON.stringify(product)
                  );
                }}
                className="text-[#ccc] hover:text-red-600 cursor-pointer"
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
      {showLoginPopup && (
        <Loginpoup
          onClose={() => setShowLoginPopup(false)}
          product={pendingProduct}
        />
      )}
    </>
  );
}

function Productitem({ image, title, width }) {
  return (
    <div className="py-3 lg:py-6 px-6 lg:px-10 border border-[#374A75] max-w-xs w-full mx-auto lg:w-full">
      <div className="flex items-center justify-center  font-TimesNewRoman text-base gap-4 ">
        <div className={`${width}`}>
          <img src={image} alt={title} className={`${width}`} />
        </div>
        <p className="text-sm lg:text-base text-[#111]">{title}</p>
      </div>
    </div>
  );
}

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
