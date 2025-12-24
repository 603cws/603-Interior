import LandingNavbar from "../../landing/components/LandingNavbar";
import { useNavigate } from "react-router-dom";
import "swiper/css";
import "swiper/css/free-mode";
import Footer from "../../common-components/Footer";

function Brands() {
  const images = [
    "./images/ecommerce/tile1.png",
    "./images/ecommerce/tile2.png",
    "./images/ecommerce/tile3.png",
    "./images/ecommerce/tile4.png",
    "./images/ecommerce/tile5.png",
    "./images/ecommerce/tile6.png",
  ];

  return (
    <div className="">
      <LandingNavbar />

      {/* section 1 */}
      <section className="container px-4 lg:px-12 mx-auto my-10">
        <img
          src="images/ecommerce/header1.png"
          alt="ecommerce header 1"
          className="w-full object-contain"
        />
      </section>

      {/* section 2 */}
      <section className="container px-4 lg:px-12 mx-auto my-10">
        <img
          src="images/ecommerce/header2.png"
          alt="ecommerce header 2"
          className="w-full object-contain"
        />
      </section>

      {/* section 3 */}
      <section className="container px-4 lg:px-12 mx-auto my-5">
        <div className="bg-[#F7FAFF] rounded-md p-4">
          <h2 className="text-3xl font-TimesNewRoman text-center mb-4">
            New & Trending Products
          </h2>
          <div className="gap-4 grid md:grid-cols-2 md:px-14 xl:px-0 xl:grid-cols-4">
            <Card
              image="/images/ecommerce/product1.png"
              title="Click-N-Lock -Wood"
              subtitle="Special Offer"
            />
            <Card
              image="/images/ecommerce/product2.png"
              title="Wall to wall Carpet"
              subtitle="Special Offer"
            />
            <Card
              image="/images/ecommerce/product3.png"
              title="Carpet Tiles"
              subtitle="Special Offer"
            />
            <Card
              image="/images/ecommerce/product4.png"
              title="Multistile- Tiles"
              subtitle="Min. 10% OFF"
            />
          </div>
        </div>
      </section>

      {/* section 5 */}
      <section className="container px-4 lg:px-12 mx-auto py-14">
        <div className="bg-[#F7FAFF] rounded-md p-4">
          <h2 className="text-3xl font-TimesNewRoman text-center mb-4">
            New & Trending Products
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center justify-self-center w-full p-4">
            <img
              src="/images/ecommerce/image-7.png"
              alt="ecommerce 7"
              className="w-full"
            />
            <img
              src="/images/ecommerce/image-8.png"
              alt="ecommerce 8"
              className="w-full"
            />
            <img
              src="/images/ecommerce/image-9.png"
              alt="ecommerce 9"
              className="w-full"
            />
          </div>
        </div>
      </section>

      <section className="my-5">
        <div>
          <div className="h-80 w-screen bg-[url('/images/brands/welspun-bg.png')] bg-center bg-cover bg-no-repeat flex justify-center items-center">
            <h1 className="font-semibold text-5xl lg:text-6xl text-center text-[#fff]">
              Browse our collection
            </h1>
          </div>
        </div>
      </section>

      {/* section 7 */}
      <section className="container px-4 mx-auto py-5 hidden md:block">
        <div className="grid xl:grid-cols-3 grid-cols-2 gap-y-10 items-center mx-auto justify-items-center cursor-pointer">
          {images.map((src, i) => (
            <ProductCard key={i} image={src} />
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
}

const ProductCard = ({ image, width }) => {
  const navigate = useNavigate();
  return (
    <div
      className={`group relative h-[340px] w-full ${
        width ? "max-w-none" : "max-w-[320px]"
      } rounded-xl shadow-md p-4 transition-all duration-300 hover:scale-[1.02] hover:bg-[#E8F1FF]`}
    >
      <div className="absolute top-[60%] left-1/2 -translate-x-1/2 w-[80%] h-24 bg-gradient-to-t from-[#A9BAD3] to-[#E0ECFF] blur-[80px] rounded-full z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      <div onClick={() => navigate("productview")}>
        {" "}
        <img src={image} alt="Product" className="w-full h-72 p-4 z-0" />
      </div>

      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[80px] bg-white/30 group-hover:bg-transparent backdrop-blur-md group-hover:overflow-hidden group-hover:backdrop-blur-none shadow-xl group-hover:shadow-none rounded-xl group-hover:rounded-none z-10">
        <div className="relative z-10 text-center py-4 font-semibold text-[#304778]">
          Product By Welspun
        </div>
      </div>
    </div>
  );
};

function Card({ image, title, subtitle }) {
  return (
    <div className="shadow-sm border w-full border-[#CCCCCC] p-2">
      <img src={image} alt={title} className="w-full object-contain" />
      <h3 className="text-2xl mt-2 font-TimesNewRoman ml-2">{title}</h3>
      <p className="text-[#378DDB] font-TimesNewRoman text-xl ml-2">
        {subtitle}
      </p>
    </div>
  );
}

export default Brands;
