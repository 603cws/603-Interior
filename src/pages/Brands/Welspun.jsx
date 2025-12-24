import LandingNavbar from "../../landing/components/LandingNavbar";
import Footer from "../../common-components/Footer";
import { useNavigate } from "react-router-dom";
import { RxArrowRight } from "react-icons/rx";

const productCollection = [
  "/images/brands/welspun-p1.png",
  "/images/brands/welspun-p2.png",
  "/images/brands/welspun-p3.png",
  "/images/brands/welspun-p4.png",
  "/images/brands/welspun-p5.png",
  "/images/brands/welspun-p6.png",
  "/images/brands/welspun-p7.png",
  "/images/brands/welspun-p8.png",
];
const featured = [
  "/images/brands/featured-1.jpg",
  "/images/brands/featured-2.jpg",
  "/images/brands/featured-3.webp",
  "/images/brands/featured-4.jpg",
];

const clickNLock = [
  {
    image: "/images/brands/welspun-8.jpg",
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
    image: "/images/brands/welspun-8.jpg",
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
const colors = [
  "#B7BAC2",
  "#C9B994",
  "#CBB791",
  "#C4A46C",
  "#8C7557",
  "#8E8065",
];
function Welspun() {
  const navigate = useNavigate();

  return (
    <>
      <section className="h-screen flex flex-col">
        <LandingNavbar />
        <div className="flex-1 bg-[url('/images/brands/welspun-hero.webp')] m-4 lg:m-2 relative">
          <div className="absolute right-5 translate-y-1/3 h-72 lg:h-96 w-72 lg:w-96 bg-[#304778]/30 flex justify-center items-start py-10 rotate-90 rounded-bl-full">
            <p className="uppercase text-5xl lg:text-7xl font-Georgia font-bold text-[#fff]">
              style
            </p>
          </div>
        </div>
        <div className="flex items-center justify-around overflow-y-hidden bg-[#3B558C] max-h-22 my-5 lg:hidden">
          <img src="/images/brands/saperator.png" alt="" />
          <p className="uppercase font-Georgia text-[#fff] font-semibold text-center">
            EXPLORE A WIDE RANGE OF ASSURED QUALITY FLOORING FROM WELSPUN
            FLOORING
          </p>
          <img src="/images/brands/saperator.png" alt="" />
        </div>
      </section>
      <section className="hidden lg:flex items-center justify-around overflow-y-hidden bg-[#3B558C] max-h-20 my-5">
        <img src="/images/brands/saperator.png" alt="" />
        <p className="uppercase font-Georgia text-[#fff] lg:text-xl font-semibold">
          EXPLORE A WIDE RANGE OF ASSURED QUALITY FLOORING FROM WELSPUN FLOORING
        </p>
        <img src="/images/brands/saperator.png" alt="" />
      </section>

      <section className="px-4 max-auto lg:container">
        <div className="grid grid-cols-1 lg:grid-cols-3 justify-between gap-3">
          <img
            src="/images/brands/welspun-1.jpg"
            alt=""
            onClick={() => navigate("productview")}
            className="cursor-pointer"
          />
          <img
            src="/images/brands/welspun-2.webp"
            alt=""
            onClick={() => navigate("productview")}
            className="cursor-pointer"
          />
          <img
            src="/images/brands/welspun-3.jpg"
            alt=""
            onClick={() => navigate("productview")}
            className="cursor-pointer"
          />
        </div>
      </section>

      <section className="px-4 max-auto lg:container my-5">
        <div className="flex flex-col lg:flex-row justify-between gap-3">
          <img src="/images/brands/welspun-4.jpg" alt="" className="flex-1 " />
          <div className="flex-1 flex flex-col gap-5">
            {clickNLock?.map((product, index) => (
              <div key={index} className="flex-1 bg-[#3B558C] flex">
                <div className="bg-[#fff] rounded-[100px] flex-1 flex flex-col lg:flex-row justify-center items-center gap-5 lg:gap-10 p-5">
                  <img
                    src={product.image}
                    alt=""
                    className="max-w-48 lg:max-w-xs w-full max-h-52 lg:max-h-96"
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
            <h2 className="text-4xl lg:text-[42px] text-[#000] italic">
              Transform your space <br className="hidden lg:block" />{" "}
              effortlessly - Click, Lock
              <br /> and Live
            </h2>

            <button
              onClick={() => navigate("productview")}
              className="flex items-center gap-2 border border-[#374A75] text-[#374A75] px-4 py-2 rounded-xl font-TimesNewRoman uppercase hover:bg-[#374A75] hover:text-[#fff] transition-colors duration-300 ease-in-out my-2 lg:my-5 w-fit"
            >
              show more <RxArrowRight />
            </button>

            <div className="mt-auto flex flex-col items-center">
              <div className="flex gap-5 my-5 lg:pl-14">
                {colors.slice(0, 3).map((color, i) => (
                  <div
                    key={i}
                    className="h-20 w-20"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>

              <div className="flex gap-5 pr-14 lg:pr-0">
                {colors.slice(3, 6).map((color, i) => (
                  <div
                    key={i}
                    className="h-20 w-20"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="flex-1">
            <div className="relative">
              <img
                src="/images/brands/clicknlock-bgimage.png"
                alt=""
                className="max-w-72 lg:max-w-full lg:w-full object-cover max-h-[450px] place-self-end"
              />
              <img
                src="/images/brands/clicknlock-product.png"
                alt=""
                className="absolute -translate-y-3/4 -translate-x-2 lg:-translate-x-1/3 max-h-48 lg:max-h-72 "
              />
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="h-56 lg:h-96 w-screen bg-[url('/images/brands/welspun-banner.webp')] bg-center bg-cover bg-no-repeat flex justify-center items-center">
          <h1 className="font-Georgia text-5xl lg:text-8xl text-center text-[#fff] tracking-tight">
            Browse our collection
          </h1>
        </div>
      </section>

      <section className="px-4 max-auto lg:container grid grid-cols-2 lg:grid-cols-4 gap-3 py-5">
        {productCollection.map((product, index) => (
          <img
            src={product}
            alt=""
            key={index}
            onClick={() => navigate("productview")}
            className="cursor-pointer"
          />
        ))}
      </section>

      <section className="px-4 max-auto lg:container flex justify-between gap-5">
        <img src="/images/brands/welspun-8.jpg" alt="" className="flex-1" />
        <div className="flex-1 grid grid-cols-2 gap-3">
          {featured.map((product, index) => (
            <img src={product} alt="" key={index} />
          ))}
        </div>
      </section>

      <p className="font-Georgia text-2xl lg:text-4xl text-center text-[#000] lg:max-w-screen-md mx-auto py-10 lg:py-20">
        Welspun Flooring presentsthe world with awe-inspiring,holistic flooring
        solutionsthat are inspired by technologicalinnovations
      </p>
      <Footer />
    </>
  );
}

export default Welspun;
