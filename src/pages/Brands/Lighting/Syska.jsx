import { useNavigate } from "react-router-dom";
import Footer from "../../../common-components/Footer";
import LandingNavbar from "../../../landing/components/LandingNavbar";

const ourCollection = [
  "../images/brands/Lighting/syska/section7-1.jpg",
  "../images/brands/Lighting/syska/section7-2.png",
  "../images/brands/Lighting/syska/section7-3.jpg",
  "../images/brands/Lighting/syska/section7-4.png",
  "../images/brands/Lighting/syska/section7-5.jpg",
  "../images/brands/Lighting/syska/section7-6.png",
  "../images/brands/Lighting/syska/section7-7.jpg",
  "../images/brands/Lighting/syska/section7-8.jpg",
];

function Syska() {
  const navigate = useNavigate();
  return (
    <div className="font-inter">
      <LandingNavbar />

      <section className="p-4 lg:container mx-auto">
        <div className="relative overflow-hidden">
          <img
            src="../images/brands/Lighting/syska/banner.png"
            alt="syska banner"
            draggable={false}
            className="w-full h-full object-cover pointer-events-none select-none"
          />
        </div>
      </section>

      <section className="p-4 lg:container mx-auto">
        <div className="relative overflow-hidden">
          <img
            src="../images/brands/Lighting/syska/banner2.png"
            alt="syska banner"
            draggable={false}
            className="w-full h-full object-cover pointer-events-none select-none"
          />
        </div>
      </section>

      <section className="p-4 lg:container mx-auto">
        <div className="flex xl:flex-col gap-5">
          <div className="flex flex-col xl:flex-row gap-3">
            <img
              src="../images/brands/Lighting/syska/section3-1.png"
              alt="syska"
              draggable={false}
              className="relative w-full overflow-hidden
               bg-cover bg-left bg-no-repeat flex-1 pointer-events-none select-none"
            />
            <img
              src="../images/brands/Lighting/syska/section3-2.png"
              alt="syska"
              draggable={false}
              className="relative w-full overflow-hidden
               bg-contain bg-center bg-no-repeat flex-1 pointer-events-none select-none"
            />
          </div>
          <div className="flex flex-col xl:flex-row gap-3">
            <img
              src="../images/brands/Lighting/syska/section3-3.png"
              alt="syska"
              draggable={false}
              className="relative w-full overflow-hidden
               bg-cover bg-left bg-no-repeat flex-1 pointer-events-none select-none"
            />
            <img
              src="../images/brands/Lighting/syska/section3-4.png"
              alt="syska"
              draggable={false}
              className="relative w-full overflow-hidden
               bg-contain bg-center bg-no-repeat flex-1 pointer-events-none select-none"
            />
          </div>
        </div>
      </section>

      <section className="p-4 lg:container mx-auto">
        <div className="relative overflow-hidden">
          <img
            src="../images/brands/Lighting/syska/banner4.png"
            alt="syska banner"
            draggable={false}
            className="w-full h-full object-cover pointer-events-none select-none"
          />
        </div>
      </section>

      <section className="p-4 lg:container mx-auto">
        <div className="flex flex-col xl:flex-row gap-5">
          <img
            src="../images/brands/Lighting/syska/section5-1.png"
            alt="syska"
            draggable={false}
            className="relative w-full h-[700px] overflow-hidden
               bg-cover bg-left bg-no-repeat flex-1 pointer-events-none select-none"
          />
          <img
            src="../images/brands/Lighting/syska/section5-2.png"
            alt="syska"
            draggable={false}
            className="relative w-full h-[700px] overflow-hidden
               bg-cover bg-left bg-no-repeat flex-1 pointer-events-none select-none"
          />
        </div>
      </section>

      <section className="p-4 lg:container mx-auto">
        <div className="flex flex-col xl:flex-row gap-5">
          <img
            src="../images/brands/Lighting/syska/section6-1.png"
            alt="syska"
            draggable={false}
            className="relative w-full h-[700px] overflow-hidden
               bg-cover bg-left bg-no-repeat flex-1 pointer-events-none select-none"
          />
          <img
            src="../images/brands/Lighting/syska/section6-2.png"
            alt="syska"
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
export default Syska;
