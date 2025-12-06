import LandingNavbar from "../../common-components/LandingNavbar";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import { FreeMode } from "swiper/modules";
import Footer from "../../common-components/Footer";

function Brands() {
  const brands = [
    { name: "kurt & co", image: "/images/ecommerce/image-1.png" },
    { name: "patcraft", image: "/images/ecommerce/image-2.png" },
    { name: "forbo", image: "/images/ecommerce/image-3.png" },
    { name: "bruce", image: "/images/ecommerce/image-4.png" },
    { name: "wellspun", image: "/images/ecommerce/image-5.png" },
    { name: "old town flooring", image: "/images/ecommerce/image-6.png" },
  ];

  const categories = [
    "Furniture",
    "Lighting",
    "Paint",
    "Civil Plumning",
    "Flooring",
    "Partition/Ceiling",
    "HVAC",
    "Smart Solution",
    "LUX",
  ];

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
      <section className="container px-4 lg:px-12 mx-auto my-10 mt-24">
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
          <h2 className="text-3xl font-lora text-center mb-4">
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

      {/* section 4 */}
      <section className="container px-4 lg:px-12 mx-auto py-14">
        <h3 className="font-lora text-3xl text-[#111] items-center justify-center flex">
          Shop from your favorite brands
        </h3>
        <div className="pt-8">
          <Swiper
            slidesPerView={"auto"}
            // spaceBetween={0}
            freeMode={true}
            modules={[FreeMode]}
            className="w-full"
          >
            {brands.map((brand, index) => (
              <SwiperSlide
                className="!w-[240px] flex justify-center"
                key={index}
              >
                <img
                  src={brand.image}
                  alt={brand.name}
                  className="xl:h-52 h-40 w-40 xl:w-52"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* section 5 */}
      <section className="container px-4 lg:px-12 mx-auto py-14">
        <div className="bg-[#F7FAFF] rounded-md p-4">
          <h2 className="text-3xl font-lora text-center mb-4">
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

      {/* section 6 */}
      <section className="container px-4 lg:px-12 mx-auto py-5 hidden md:block">
        <h2 className="text-4xl font-lora text-center mb-8">
          Featured Products
        </h2>
        <h5 className="text-xl font-Poppins text-[#A0A0A0] text-center mb-6">
          Discover amazing products from our partners
        </h5>
        <div className="2xl:px-40 px-20 xl:px-8">
          <div className="flex flex-row flex-wrap gap-4 items-center justify-center xl:flex-nowrap max-w-full border border-[#999999]">
            {categories.map((name, index) => (
              <div
                className="flex justify-center px-2 whitespace-nowrap xl:w-full h-10 items-center hover:bg-[#304778] m-1 rounded-lg hover:text-white cursor-pointer"
                key={index}
              >
                <p className="text-lg font-inter">{name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* section 7 */}
      <section className="container px-4 lg:px-12 mx-auto py-5 hidden md:block">
        <div className="grid xl:grid-cols-3 grid-cols-2 gap-y-10 items-center mx-auto justify-items-center cursor-pointer">
          {images.map((src, i) => (
            <ProductCard
              key={i}
              image={src}
              width={i === 0 || i === 4 ? "none" : ""}
            />
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
        <img src={image} alt="Product" className="w-full p-4 z-0" />
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
      <h3 className="text-2xl mt-2 font-Poppins ml-2">{title}</h3>
      <p className="text-[#378DDB] font-Poppins text-xl ml-2">{subtitle}</p>
    </div>
  );
}

export default Brands;
