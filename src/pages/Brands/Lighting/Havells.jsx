import { useNavigate } from "react-router-dom";
import Footer from "../../../common-components/Footer";
import LandingNavbar from "../../../landing/components/LandingNavbar";

const ourCollection = [
  "../images/brands/Lighting/syska/section7-1.webp",
  "../images/brands/Lighting/syska/section7-2.webp",
  "../images/brands/Lighting/syska/section7-3.webp",
  "../images/brands/Lighting/syska/section7-4.webp",
  "../images/brands/Lighting/syska/section7-5.webp",
  "../images/brands/Lighting/syska/section7-6.webp",
  "../images/brands/Lighting/syska/section7-7.webp",
  "../images/brands/Lighting/syska/section7-8.webp",
];

function Havells() {
  const navigate = useNavigate();
  return (
    <div className="font-inter">
      <LandingNavbar />

      <section className="p-4 lg:container mx-auto">
        <div className="relative overflow-hidden">
          <img
            src="../images/brands/Lighting/havells/banner.png"
            alt="havells banner"
            draggable={false}
            className="w-full h-full object-cover pointer-events-none select-none"
          />
        </div>
      </section>

      <section className="p-4 lg:container mx-auto">
        <div className="relative overflow-hidden">
          <img
            src="../images/brands/Lighting/havells/banner2.png"
            alt="havells banner"
            draggable={false}
            className="w-full h-full object-cover pointer-events-none select-none"
          />
        </div>
      </section>

      <section className="p-4 lg:container mx-auto">
        <div className="flex flex-col xl:flex-row gap-5">
          <img
            src="../images/brands/Lighting/havells/section3-1.png"
            alt="havells"
            draggable={false}
            className="relative w-full h-[700px] overflow-hidden
               bg-cover bg-left bg-no-repeat flex-1 pointer-events-none select-none"
          />
          <img
            src="../images/brands/Lighting/havells/section3-2.png"
            alt="havells"
            draggable={false}
            className="relative w-full h-[700px] overflow-hidden
               bg-cover bg-left bg-no-repeat flex-1 pointer-events-none select-none"
          />
        </div>
      </section>

      <section className="p-4 lg:container mx-auto">
        <div className="relative overflow-hidden">
          <img
            src="../images/brands/Lighting/havells/banner4.png"
            alt="havells banner"
            draggable={false}
            className="w-full h-full object-cover pointer-events-none select-none"
          />
        </div>
      </section>

      <section className="p-4 lg:container mx-auto">
        <div className="flex flex-col xl:flex-row gap-5">
          <img
            src="../images/brands/Lighting/havells/section5-1.png"
            alt="havells"
            draggable={false}
            className="relative w-full h-[700px] overflow-hidden
               bg-cover bg-left bg-no-repeat flex-1 pointer-events-none select-none"
          />
          <img
            src="../images/brands/Lighting/havells/section5-2.png"
            alt="havells"
            draggable={false}
            className="relative w-full h-[700px] overflow-hidden
               bg-cover bg-left bg-no-repeat flex-1 pointer-events-none select-none"
          />
        </div>
      </section>

      <section className="p-4 lg:container mx-auto flex flex-col">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 items-center justify-center gap-4">
          {ourCollection.map((product, index) => (
            <div
              key={index}
              onClick={() => navigate("/shop?query=lighting")}
              className="border w-full h-80 p-4 flex items-center justify-center border-[#002F36] overflow-hidden hover:cursor-pointer"
            >
              <img
                src={product}
                alt="product"
                draggable={false}
                className="h-full pointer-events-none select-none"
              />
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
export default Havells;
