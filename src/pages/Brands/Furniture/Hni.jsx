import { useNavigate } from "react-router-dom";
import Footer from "../../../common-components/Footer";
import LandingNavbar from "../../../landing/components/LandingNavbar";

const ourCollection = [
  "../images/brands/Furniture/wipro/section5-1.png",
  "../images/brands/Furniture/wipro/section5-2.png",
  "../images/brands/Furniture/wipro/section5-3.png",
  "../images/brands/Furniture/wipro/section5-4.png",
  "../images/brands/Furniture/wipro/section5-5.png",
  "../images/brands/Furniture/wipro/section5-6.png",
  "../images/brands/Furniture/wipro/section5-7.png",
  "../images/brands/Furniture/wipro/section5-8.png",
];

function Hni() {
  const navigate = useNavigate();
  return (
    <div className="font-inter">
      <LandingNavbar />

      <section className="p-4 lg:container mx-auto">
        <div className="relative rounded-2xl overflow-hidden">
          <img
            src="../images/brands/Furniture/hni/banner.png"
            alt="featherlite banner"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      <section className="p-4 lg:container mx-auto font-Poppins">
        <div className="flex flex-col xl:flex-row gap-5">
          <img src="../images/brands/Furniture/hni/section2-1.png" alt="hni" />
          <img src="../images/brands/Furniture/hni/section2-2.png" alt="hni" />
        </div>
      </section>

      <section className="p-4 lg:container mx-auto">
        <div className="relative rounded-2xl overflow-hidden">
          <img
            src="../images/brands/Furniture/featherlite/banner2.png"
            alt="featherlite banner"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      <section className="p-4 lg:container mx-auto">
        <div className="relative rounded-2xl overflow-hidden">
          <img
            src="../images/brands/Furniture/hni/banner4.png"
            alt="featherlite banner"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      <section className="p-4 lg:container mx-auto">
        <div className="relative rounded-2xl overflow-hidden">
          <img
            src="../images/brands/Furniture/hni/banner5.png"
            alt="featherlite banner"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      <section className="p-4 lg:container mx-auto">
        <div
          className="relative w-full h-[380px] overflow-hidden
               bg-cover bg-center bg-no-repeat rounded-3xl"
          style={{
            backgroundImage:
              "url('../images/brands/Furniture/wipro/collection.png')",
          }}
        >
          <div className="absolute inset-0 bg-[#E65244]/20" />

          <div className="relative z-10 flex items-center justify-center h-full px-6 lg:px-12">
            <h2 className="text-white text-2xl sm:text-5xl xl:text-8xl text-center hover:scale-75 hover:cursor-pointer transition duration-300 ease-in-out font-Poppins font-bold">
              Browse our collection
            </h2>
          </div>
        </div>
      </section>

      <section className="p-4 lg:container mx-auto flex flex-col">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 items-center justify-center gap-4">
          {ourCollection.map((product, index) => (
            <div
              key={index}
              onClick={() => navigate("/shop?query=furniture")}
              className="border w-full h-80 p-2 flex items-center justify-center border-[#002F36] overflow-hidden hover:cursor-pointer"
            >
              <img src={product} alt="product" className="h-full" />
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
export default Hni;
