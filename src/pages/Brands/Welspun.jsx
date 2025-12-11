import LandingNavbar from "../../common-components/LandingNavbar";
import Footer from "../../common-components/Footer";
import { useNavigate } from "react-router-dom";

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
function Welspun() {
  const navigate = useNavigate();

  return (
    <>
      <section className="h-screen flex flex-col">
        <LandingNavbar />
        <div className="flex-1 bg-[url('/images/brands/welspun-hero.webp')] m-2 relative">
          <div className="absolute right-5 translate-y-1/3 h-96 w-96 bg-[#304778]/30 flex justify-center items-start py-10 rotate-90 rounded-bl-full">
            <p className="uppercase text-7xl font-inter font-bold text-[#fff]">
              style
            </p>
          </div>
        </div>
      </section>
      <section className="flex items-center justify-around overflow-y-hidden bg-[#3B558C] max-h-20 my-5">
        <img src="/images/brands/saperator.png" alt="" />
        <p className="uppercase font-inter text-[#fff] text-xl font-semibold">
          EXPLORE A WIDE RANGE OF ASSURED QUALITY FLOORING FROM WELSPUN FLOORING
        </p>
        <img src="/images/brands/saperator.png" alt="" />
      </section>
      <section className="container">
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

      <section className="container my-5">
        <div className="flex justify-between gap-3">
          <img src="/images/brands/welspun-4.jpg" alt="" className="flex-1 " />
          <div className="flex-1 flex flex-col gap-5">
            {clickNLock?.map((product, index) => (
              <div key={index} className="flex-1 bg-[#3B558C] flex">
                <div className="bg-[#fff] rounded-[100px] flex-1 flex justify-center items-center gap-10">
                  <img
                    src={product.image}
                    alt=""
                    className="max-w-xs w-full max-h-96"
                  />
                  <div className="">
                    <h2 className="font-inter text-lg font-semibold uppercase text-[#D9A14D] border border-[#A0A0A0] p-2 mb-5">
                      {product.title}
                    </h2>
                    <ul className="list-disc space-y-2 ml-4">
                      {product.features.map((feature, index) => (
                        <li key={index} className="text-[#000]/70">
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

      <section className="container my-5">
        <div className="flex justify-between gap-3">
          <img src="/images/brands/welspun-7.png" alt="" className="flex-1 " />
          <img src="/images/brands/welspun-6.png" alt="" className="flex-1 " />
        </div>
      </section>

      {/* <section>
        <div className="h-80 w-screen bg-[url('/images/brands/welspun-bg.png')] bg-center bg-cover bg-no-repeat flex justify-center items-center">
          <h1 className="font-semibold text-5xl lg:text-6xl text-center text-[#fff]">
            Browse our collection
          </h1>
        </div>
      </section> */}
      <img src="/images/brands/welspun-collection.png" alt="" />

      <section className="container grid grid-cols-2 lg:grid-cols-4 gap-3 py-5">
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

      <section className="container flex justify-between gap-5">
        <img src="/images/brands/welspun-8.jpg" alt="" className="flex-1" />
        <div className="flex-1 grid grid-cols-2 gap-3">
          {featured.map((product, index) => (
            <img src={product} alt="" key={index} />
          ))}
        </div>
      </section>

      <p className="font-inter text-4xl text-center text-[#000] max-w-screen-md mx-auto py-20">
        Welspun Flooring presentsthe world with awe-inspiring,holistic flooring
        solutionsthat are inspired by technologicalinnovations
      </p>
      <Footer />
    </>
  );
}

export default Welspun;
