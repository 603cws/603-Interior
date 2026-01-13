import LandingNavbar from "../../../landing/components/LandingNavbar";
import Footer from "../../../common-components/Footer";
import { useNavigate } from "react-router-dom";
import { RxArrowRight } from "react-icons/rx";

const productCollection = [
  "/images/brands/Flooring/johnson/collection-product-1.jpg",
  "/images/brands/Flooring/johnson/collection-product-2.jpg",
  "/images/brands/Flooring/johnson/collection-product-3.jpg",
  "/images/brands/Flooring/johnson/collection-product-4.jpg",
  "/images/brands/Flooring/johnson/collection-product-5.jpg",
  "/images/brands/Flooring/johnson/collection-product-6.jpg",
  "/images/brands/Flooring/johnson/collection-product-7.jpg",
  "/images/brands/Flooring/johnson/collection-product-8.jpg",
];
const featured = [
  "/images/brands/Flooring/johnson/heritage-collection-1.jpg",
  "/images/brands/Flooring/johnson/heritage-collection-2.jpg",
  "/images/brands/Flooring/johnson/heritage-collection-3.jpg",
  "/images/brands/Flooring/johnson/heritage-collection-4.jpg",
];

const eliteCollection = [
  {
    image: "/images/brands/Flooring/johnson/monolith.jpg",
    title: "timeless tile aesthetic",
    features: [
      "Modern patterned tiles",
      "Light neutral tone",
      "Slip-resistant surface",
      "Easy maintenance",
      "Click-lock system",
    ],
  },
  {
    image: "/images/brands/Flooring/johnson/elemental.jpg",
    title: "effortless interior style",
    features: [
      "Durable material",
      "Contemporary look",
      "Space-enhancing design",
      "Plant-friendly aesthetic",
      "Furniture-compatible style",
    ],
  },
];
const tiles = [
  "/images/brands/Flooring/johnson/tile-1.jpg",
  "/images/brands/Flooring/johnson/tile-2.jpg",
  "/images/brands/Flooring/johnson/tile-3.jpg",
  "/images/brands/Flooring/johnson/tile-4.jpg",
  "/images/brands/Flooring/johnson/tile-5.jpg",
  "/images/brands/Flooring/johnson/tile-6.jpg",
];
function Johnson() {
  const navigate = useNavigate();

  return (
    <>
      <section className="h-screen flex flex-col">
        <LandingNavbar className="relative" />
        <div className="flex-1 bg-[url('/images/brands/Flooring/johnson/johnson-hero.jpg')] m-4 lg:m-2 relative bg-cover bg-center bg-no-repeat"></div>
        <div className="flex items-center justify-around overflow-y-hidden bg-[#DC3545] max-h-22 my-5 lg:hidden">
          <img
            src="/images/brands/Flooring/johnson/seperator.png"
            alt="seperator"
          />
          <p className="uppercase font-Georgia text-[#fff] font-semibold text-center">
            EXPLORE A WIDE RANGE OF ASSURED QUALITY TILES FROM KAJARIA CERAMICS
          </p>
          <img
            src="/images/brands/Flooring/johnson/seperator.png"
            alt="seperator"
          />
        </div>
      </section>
      <section className="hidden lg:flex items-center justify-around overflow-y-hidden bg-[#DC3545] max-h-22 my-5">
        <img
          src="/images/brands/Flooring/johnson/seperator.png"
          alt="seperator"
        />
        <p className="uppercase font-Georgia text-[#fff] lg:text-xl font-semibold">
          EXPLORE A WIDE RANGE OF ASSURED QUALITY TILES FROM KAJARIA CERAMICS
        </p>
        <img
          src="/images/brands/Flooring/johnson/seperator.png"
          alt="seperator"
        />
      </section>

      <section className="px-4 max-auto lg:container">
        <div className="grid grid-cols-1 md:grid-cols-3 justify-between items-stretch gap-3">
          <img
            src="/images/brands/Flooring/johnson/elite-gvt-rt23.jpg"
            alt="product-image"
            // onClick={() => navigate("productview")}
            // className="cursor-pointer"
          />
          <img
            src="/images/brands/Flooring/johnson/elite-dsf-rt22.jpg"
            alt="product-image"
            // onClick={() => navigate("productview")}
            // className="cursor-pointer "
          />
          <img
            src="/images/brands/Flooring/johnson/elite-gvt-v22.jpg"
            alt="product-image"
            // onClick={() => navigate("productview")}
            // className="cursor-pointer"
          />
        </div>
      </section>

      <section className="px-4 max-auto lg:container my-5">
        <div className="flex flex-col lg:flex-row justify-between items-stretch gap-3">
          <div className="border flex-1 flex justify-center items-center">
            <img
              src="/images/brands/Flooring/johnson/elite-collection.jpg"
              alt="product-image"
              className="h-full object-contain"
            />
          </div>
          <div className="flex-1 flex flex-col md:flex-row lg:flex-col gap-5">
            {eliteCollection?.map((product, index) => (
              <div key={index} className="flex-1 bg-[#DC3545] flex">
                <div className="bg-[#fff] rounded-[100px] flex-1 flex flex-col lg:flex-row justify-center items-center gap-5 lg:gap-10 p-10">
                  <img
                    src={product.image}
                    alt="product-image"
                    className="max-w-48 lg:max-w-xs w-full max-h-52 lg:max-h-80 border p-2 "
                  />
                  <div className="">
                    <h2 className="font-Georgia lg:text-lg font-semibold uppercase text-[#D9A14D] border border-[#A0A0A0] p-2 mb-2 lg:mb-5">
                      {product.title}
                    </h2>
                    <ul className="list-disc space-y-1 lg:space-y-2 ml-4">
                      {product.features.map((feature, index) => (
                        <li
                          key={index}
                          className="text-[#000]/70 text-sm lg:text-base"
                        >
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 max-auto lg:container min-h-[750px] lg:min-h-[550px] mt-12">
        <div className="flex flex-col lg:flex-row justify-between gap-4 font-Georgia">
          <div className="flex-1 flex flex-col min-h-full">
            <h2 className="text-4xl lg:text-[42px] text-[#000] italic leading-relaxed">
              Transform Spaces with <br /> Timeless Tiles
            </h2>

            <button
              //   onClick={() => navigate("productview")}
              className="flex items-center gap-2 border border-[#374A75] text-[#374A75] px-4 py-2 rounded-xl font-TimesNewRoman uppercase hover:bg-[#374A75] hover:text-[#fff] transition-colors duration-300 ease-in-out my-2 lg:my-5 w-fit"
            >
              show more <RxArrowRight />
            </button>

            <div className="mt-auto flex flex-col items-center">
              <div className="flex gap-5 my-5 lg:pl-14">
                {tiles.slice(0, 3).map((tile, i) => (
                  <img
                    key={i}
                    src={tile}
                    alt="product-image"
                    className="h-20 w-20"
                  />
                ))}
              </div>

              <div className="flex gap-5 pr-14 lg:pr-0">
                {tiles.slice(3, 6).map((tile, i) => (
                  <img
                    key={i}
                    src={tile}
                    alt="product-image"
                    className="h-20 w-20 object-cover"
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="flex-1">
            <div className="relative">
              <img
                src="/images/brands/Flooring/johnson/tile-room.jpg"
                alt="product-image"
                className="max-w-72 md:max-w-full lg:w-full object-cover max-h-[450px] md:h-3/4 lg:h-full place-self-end"
              />
              <img
                src="/images/brands/Flooring/johnson/tile-main.jpg"
                alt="product-image"
                className="absolute -translate-y-[90%] -translate-x-2 md:-translate-y-full lg:-translate-y-3/4 lg:-translate-x-1/3 max-h-48 lg:max-h-72 max-w-40 md:max-w-60 lg:max-w-52 h-full object-cover hidden xs:block"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="p-4 lg:container mx-auto">
        <div
          className="relative w-full h-48 lg:h-[380px] overflow-hidden
               bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('/images/brands/Flooring/johnson/browse-collection-bg.jpg')",
          }}
        >
          <div className="absolute inset-0 bg-[#DC354533]/20" />

          <div className="relative z-10 flex items-center justify-center h-full px-6 lg:px-12">
            <h2 className="text-white text-3xl sm:text-5xl xl:text-8xl tracking-tight text-center hover:scale-75 hover:cursor-pointer transition duration-300 ease-in-out font-Georgia">
              Browse our collection
            </h2>
          </div>
        </div>
      </section>

      <section className="px-4 max-auto lg:container grid grid-cols-2 md:grid-cols-4 gap-3 py-5 items-stretch">
        {productCollection.map((product, index) => (
          <img
            src={product}
            alt="product-image"
            key={index}
            // onClick={() => navigate("productview")}
            className="cursor-pointer object-cover max-h-80 w-full"
          />
        ))}
      </section>

      <section className="px-4 max-auto lg:container flex justify-between items-stretch gap-5">
        <div className="flex-1 border flex justify-center items-center">
          <img
            src="/images/brands/Flooring/johnson/heritage-banner.jpg"
            alt="product-image"
            className="h-full"
          />
        </div>
        <div className="flex-1 grid grid-cols-2 gap-3 ">
          {featured.map((product, index) => (
            <img
              src={product}
              alt="product-image"
              key={index}
              className="border"
            />
          ))}
        </div>
      </section>

      <p className="font-Georgia text-2xl lg:text-4xl text-center text-[#000] lg:max-w-screen-md mx-auto py-10 lg:py-20">
        H&R Johnson offers premium surface solutions that blend elegant design,
        superior craftsmanship, and long-lasting performance.
      </p>
      <Footer />
    </>
  );
}

export default Johnson;
