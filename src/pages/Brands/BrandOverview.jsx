import { useMemo, useState } from "react";
import LandingNavbar from "../../landing/components/LandingNavbar";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Footer from "../../common-components/Footer";
import ContactUsPopup from "../../landing/components/ContactUsPopup";
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
    // title: "Flooring that shapes your space",
    bg: "/images/brands/daikinBrand.png",
    link: "/flooring",
  },
  {
    // title: "Flooring that shapes your space",
    bg: "/images/brands/welspunbrand2.png",
    link: "/flooring",
  },
];

const categories = [
  { title: "Chairs", img: "/images/ecommerce/chair2.png" },
  { title: "Air-condition", img: "/images/ecommerce/ac2.jpg" },
  { title: "Coffee Table", img: "/images/ecommerce/coffetable2.jpg" },
  { title: "Lights", img: "/images/ecommerce/lights2.png" },
  { title: "Storage", img: "/images/ecommerce/storage2.jpg" },
];

const reasons = [
  {
    title: "Quality Assurance",
    description:
      "Every brand undergoes rigorous quality checks to ensure premium standards and customer satisfaction.",
    icon: (
      <img
        src="/images/brands/mdi-light_shield.png"
        className="w-16"
        alt="Shield"
      />
    ),
  },
  {
    title: "Industry Excellence",
    description:
      "We partner with award-winning brands recognized for innovation and design leadership.",
    icon: (
      <img src="/images/brands/cil_badge.png" className="w-16" alt="Badge" />
    ),
  },
  {
    title: "Customer Trust",
    description:
      "Building long-term relationships through reliable products and exceptional service standards.",
    icon: (
      <img
        src="/images/brands/radix-icons_people.png"
        className="w-16"
        alt="People"
      />
    ),
  },
  {
    title: "Sustainable Growth",
    description:
      "Committed to eco-friendly practices and sustainable manufacturing for a better tomorrow.",
    icon: (
      <img
        src="/images/brands/uil_arrow-growth.png"
        className="w-16"
        alt="Growth"
      />
    ),
  },
];

const featuredBrands = [
  {
    title: "Industry-leading ergonomic furniture and workspace solutions",
    tags: ["Tables", "Chairs", "Storage"],
    image: "/images/brands/featuredBrands1.jpg",
  },
  {
    title: "Innovative lighting solutions for modern interiors",
    tags: ["HVAC"],
    image: "/images/brands/featuredBrands2.jpg",
  },
  {
    title: "Industry-leading ergonomic furniture and workspace solutions",
    tags: ["Lights"],
    image: "/images/brands/featuredBrands3.webp",
  },
  {
    title: "Industry-leading ergonomic furniture and workspace solutions",
    tags: ["Flooring"],
    image: "/images/brands/featuredBrands4.webp",
  },
  {
    title: "Industry-leading ergonomic furniture and workspace solutions",
    tags: ["Partitions and Ceilings"],
    image: "/images/brands/featuredBrands5.webp",
  },
  {
    title: "Industry-leading ergonomic furniture and workspace solutions",
    tags: ["Civil and Plumbing"],
    image: "/images/brands/featuredBrands6.jpeg",
  },
];

const brandImages = {
  Furniture: [
    { name: "featherlite", image: "/images/brands/Furniture/Featherlite.png" },
    { name: "godrej", image: "/images/brands/Furniture/godrej.webp" },
    { name: "hni", image: "/images/brands/Furniture/hni.jpg" },
    {
      name: "spacewood",
      image: "/images/brands/Furniture/Spacewood.png",
    },
    { name: "wipro", image: "/images/brands/Furniture/Wipro.svg" },
  ],
  Lighting: [
    { name: "lighting", image: "/images/brands/Lighting/Havells.svg" },
    { name: "lighting", image: "/images/brands/Lighting/Jaquar.svg" },
    { name: "lighting", image: "/images/brands/Lighting/Panasonic.svg" },
    { name: "lighting", image: "/images/brands/Lighting/Philips.svg" },
    { name: "lighting", image: "/images/brands/Lighting/Wipro.svg" },
    { name: "lighting", image: "/images/brands/Lighting/Syska.png" },
  ],
  Paint: [
    { name: "#", image: "/images/brands/Paint/asian-paints.png" },
    { name: "#", image: "/images/brands/Paint/berger-paints.svg" },
    { name: "#", image: "/images/brands/Paint/birla-opus.svg" },
    { name: "#", image: "/images/brands/Paint/DULUX.webp" },
    { name: "#", image: "/images/brands/Paint/JSW.svg" },
    { name: "#", image: "/images/brands/Paint/nerolac.webp" },
    { name: "#", image: "/images/brands/Paint/nippon.svg" },
  ],
  HVAC: [
    { name: "#", image: "/images/brands/HVAC/Blue_Star.png" },
    { name: "daikin", image: "/images/brands/HVAC/DAIKIN.svg" },
    { name: "lg", image: "/images/brands/HVAC/LG.svg" },
    { name: "#", image: "/images/brands/HVAC/Carrier.svg" },
    { name: "#", image: "/images/brands/HVAC/Mitsubishi.svg" },
    { name: "#", image: "/images/brands/HVAC/Voltas.png" },
  ],
  SmartSolutions: [
    { name: "#", image: "/images/brands/SmartSolutions/Cisco.svg" },
    { name: "dlink", image: "/images/brands/SmartSolutions/D-Link.svg" },
    { name: "#", image: "/images/brands/SmartSolutions/honeywell.svg" },
    { name: "#", image: "/images/brands/SmartSolutions/Netgear.svg" },
    { name: "#", image: "/images/brands/SmartSolutions/Schneider.svg" },
  ],
  Flooring: [
    { name: "#", image: "/images/brands/Flooring/Kajaria.png" },
    { name: "#", image: "/images/brands/Flooring/johnson.png" },
    {
      name: "#",
      image: "/images/brands/Flooring/Shaw_Industries.svg",
    },
    { name: "#", image: "/images/brands/Flooring/Somany.png" },
    { name: "welspun", image: "/images/brands/Flooring/welspun.png" },
  ],
  Lux: [
    { name: "#", image: "/images/brands/Lux/Havells.svg" },
    { name: "#", image: "/images/brands/Lux/Jaquar.svg" },
    { name: "#", image: "/images/brands/Lux/Panasonic.svg" },
    { name: "#", image: "/images/brands/Lux/Philips.svg" },
    { name: "#", image: "/images/brands/Lux/Wipro.svg" },
    { name: "#", image: "/images/brands/Lux/Syska.png" },
  ],
};

function BrandsOverview() {
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState("Furniture");

  const images = useMemo(
    () => brandImages[selectedCategory] || [],
    [selectedCategory]
  );

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
          <CategorySvg
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
          <div className="grid grid-cols-2 lg:grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))] gap-2 gap-y-8 pt-16">
            {images.map((brand, idx) => (
              <div
                key={idx}
                className="hover:shadow-lg flex justify-center items-center w-full h-28 cursor-pointer"
                onClick={() => {
                  navigate(`/brandOverview/${brand.name}`);
                }}
              >
                <img
                  src={brand.image}
                  alt={brand.name}
                  className="object-scale-down w-32 h-full"
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
          <div className="flex items-center justify-between w-full py-0 md:py-4 flex-col md:flex-row overflow-y-hidden gap-4 md:gap-4 px-8">
            {categories.map((it, idx) => (
              <div key={idx} className="flex flex-col items-center">
                {/* image container */}
                <div className="relative w-32 h-36 md:w-40 md:h-44 xl:w-48 xl:h-52">
                  {/* actual image */}
                  <img
                    src={it.img}
                    alt={it.title}
                    className="absolute inset-0 w-full h-full object-cover rounded-t-[200px] rounded-b-2xl"
                  />
                </div>

                {/* label */}
                <div className="mt-2 text-center">
                  <div className="text-xs md:text-lg font-bold tracking-wider text-[#374A75]">
                    {it.title}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 lg:container mx-auto py-10">
        <div className="mx-auto font-TimesNewRoman">
          {/* Heading */}
          <div className="text-center mb-10 md:mb-14 items-center flex flex-col">
            <h2 className="text-xl md:text-2xl xl:text-3xl uppercase font-bold text-[#111111]">
              Featured Brands
            </h2>
            <p className="mt-3 text-sm md:text-lg text-[#5C5C5C] mb-4">
              Premium partners delivering exceptional quality and design
            </p>
            <p className="w-[20%] lg:w-[4%] h-[1.5px] bg-[#374A75]"></p>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7 lg:gap-8">
            {featuredBrands.map((brand, idx) => (
              <article
                key={idx}
                className="bg-white rounded-xl border border-[#E4E5EA] shadow-[0_12px_30px_rgba(35,48,80,0.06)] overflow-hidden flex flex-col"
              >
                {/* Image */}
                <div className="w-full h-44 md:h-72 overflow-hidden">
                  <img
                    src={brand.image}
                    alt={brand.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Content */}
                <div className="flex flex-col justify-between flex-1 p-5 md:p-6 gap-6">
                  <div>
                    <p className="text-sm md:text-lg text-black max-w-xs">
                      {brand.title}
                    </p>

                    {/* Tags */}
                    {brand.tags?.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {brand.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center rounded-full px-3 py-1 text-xs md:text-sm text-black"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Button */}
                  <button
                    onClick={() =>
                      brand.tags.includes("Flooring") && navigate("welspun")
                    }
                    type="button"
                    className={`mt-auto w-full inline-flex items-center font-bold justify-center rounded-xl border text-sm md:text-base py-2.5 md:py-3 transition-colors border-[#374A75] text-[#374A75] hover:bg-[#374A75] hover:text-white
                    `}
                  >
                    <span>View Products</span>
                    <span className="ml-2 text-[13px] md:text-sm" aria-hidden>
                      →
                    </span>
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 lg:container mx-auto py-10">
        <div className="max-w-7xl mx-auto px-4">
          {/* Heading */}
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-xl md:text-3xl xl:text-4xl font-TimesNewRoman font-bold text-[#232323]">
              Why We Partner With These Brands
            </h2>
            <p className="mt-4 text-sm md:text-base text-[#7A7F87] font-Georgia leading-relaxed">
              Our partnerships are built on shared values of quality,
              innovation, and customer excellence.
            </p>
          </div>

          {/* Items */}
          <div className="mt-10 md:mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-8">
            {reasons.map((item) => (
              <div
                key={item.title}
                className="flex flex-col items-center text-center"
              >
                {/* Dotted circle with icon */}
                <div className="flex items-center justify-center w-28 h-28 md:w-36 md:h-36 rounded-full border border-dotted border-[#181818]">
                  {item.icon}
                </div>

                {/* Title */}
                <h3 className="mt-6 text-sm md:text-xl font-Georgia italic font-bold text-[#232323]">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="mt-3 text-xs md:text-base font-Georgia leading-relaxed text-[#777777] max-w-xs">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

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
      <h3 className="text-nowrap font-TimesNewRoman font-bold text-sm lg:text-2xl text-[#111] tracking-wider uppercase mb-2">
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
      img: "/images/brands/welspunProduct1.webp",
      logo: "/images/welspun-logo.png",
      name: "Modern Teal",
    },
    {
      id: 2,
      img: "/images/brands/welspunProduct2.png",
      logo: "/images/welspun-logo.png",
      name: "Tundra",
    },
    {
      id: 3,
      img: "/images/brands/welspunProduct3.jpg",
      logo: "/images/welspun-logo.png",
      name: "Longitutde Blue",
    },
    {
      id: 4,
      img: "/images/brands/welspunProduct4.jpg",
      logo: "/images/welspun-logo.png",
      name: "Calix (Course)",
    },
    {
      id: 5,
      img: "/images/brands/welspunProduct5.jpg",
      logo: "/images/welspun-logo.png",
      name: "EON",
    },
  ];

  return (
    <div className="px-4 lg:container mx-auto py-12">
      {/* Heading */}
      <SectionHeader title={"TRENDING PRODUCTS"} />

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8 ">
        {products.map((p) => (
          <div
            key={p.id}
            className=" rounded-2xl text-white p-6 flex flex-col items-center justify-between border border-[#ccc]"
          >
            {/* Product Image */}
            <img
              src={p.img}
              alt={p.name}
              className="h-40 object-contain mb-4"
            />

            {/* Product Name */}
            <p className="text-lg text-black font-medium tracking-wide mb-2 font-TimesNewRoman">
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
    { id: 1, img: "/images/brand1.webp", logo: "/images/welspun-logo.png" },
    { id: 2, img: "/images/brand1.webp", logo: "/images/welspun-logo.png" },
    { id: 3, img: "/images/brand1.webp", logo: "/images/welspun-logo.png" },
    { id: 4, img: "/images/brand1.webp", logo: "/images/welspun-logo.png" },
    { id: 5, img: "/images/brand1.webp", logo: "/images/welspun-logo.png" },
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
