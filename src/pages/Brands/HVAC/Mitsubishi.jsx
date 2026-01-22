import { useNavigate } from "react-router-dom";
import Footer from "../../../common-components/Footer";
import LandingNavbar from "../../../landing/components/LandingNavbar";

const ourCollection = [
  "../images/brands/HVAC/bluestar/section5-1.webp",
  "../images/brands/HVAC/bluestar/section5-2.webp",
  "../images/brands/HVAC/bluestar/section5-3.webp",
  "../images/brands/HVAC/bluestar/section5-4.webp",
  "../images/brands/HVAC/bluestar/section5-5.webp",
  "../images/brands/HVAC/bluestar/section5-6.webp",
  "../images/brands/HVAC/bluestar/section5-7.webp",
  "../images/brands/HVAC/bluestar/section5-8.webp",
];

function Mitsubishi() {
  const navigate = useNavigate();
  return (
    <div className="font-inter">
      <LandingNavbar />

      <section className="p-4 lg:container mx-auto">
        <div className="relative overflow-hidden">
          <img
            src="../images/brands/HVAC/mitsubishi/banner.png"
            alt="mitsubishi banner"
            draggable={false}
            className="w-full h-full object-cover pointer-events-none select-none"
          />
        </div>
      </section>

      <section className="p-4 lg:container mx-auto">
        <div className="relative overflow-hidden">
          <img
            src="../images/brands/HVAC/mitsubishi/banner2.png"
            alt="mitsubishi banner"
            draggable={false}
            className="w-full h-full object-cover pointer-events-none select-none"
          />
        </div>
      </section>

      <section className="p-4 lg:container mx-auto">
        <div className="flex flex-col xl:flex-row gap-5">
          <img
            src="../images/brands/HVAC/mitsubishi/section3-1.png"
            alt="mitsubishi"
            draggable={false}
            className="relative w-full h-[700px] overflow-hidden
               bg-cover bg-left bg-no-repeat flex-1 pointer-events-none select-none"
          />
          <img
            src="../images/brands/HVAC/mitsubishi/section3-2.png"
            alt="mitsubishi"
            draggable={false}
            className="relative w-full h-[700px] overflow-hidden
               bg-cover bg-left bg-no-repeat flex-1 pointer-events-none select-none"
          />
        </div>
      </section>

      <section className="p-4 lg:container mx-auto">
        <div className="relative overflow-hidden">
          <img
            src="../images/brands/HVAC/mitsubishi/banner4.png"
            alt="mitsubishi banner"
            draggable={false}
            className="w-full h-full object-cover pointer-events-none select-none"
          />
        </div>
      </section>

      <section className="p-4 lg:container mx-auto">
        <div className="flex flex-col xl:flex-row gap-5">
          <img
            src="../images/brands/HVAC/mitsubishi/section5-1.png"
            alt="mitsubishi"
            draggable={false}
            className="relative w-full h-[700px] overflow-hidden
               bg-cover bg-left bg-no-repeat flex-1 pointer-events-none select-none"
          />
          <img
            src="../images/brands/HVAC/mitsubishi/section5-2.png"
            alt="mitsubishi"
            draggable={false}
            className="relative w-full h-[700px] overflow-hidden
               bg-cover bg-left bg-no-repeat flex-1 pointer-events-none select-none"
          />
        </div>
      </section>

      <section className="p-4 lg:container mx-auto">
        <div
          className="relative w-full h-[380px] overflow-hidden
               bg-cover bg-top bg-no-repeat"
          style={{
            backgroundImage:
              "url('../images/brands/HVAC/mitsubishi/banner6.png')",
          }}
        >
          <div className="absolute inset-0 bg-[#1F4E9A]/20" />

          <div className="relative z-10 flex items-center justify-center h-full px-6 lg:px-12">
            <h2 className="text-white text-2xl sm:text-5xl xl:text-8xl text-center hover:scale-75 hover:cursor-pointer transition duration-300 ease-in-out font-segoe">
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
              onClick={() => navigate("/shop?query=hvac")}
              className="border w-full h-80 p-2 flex items-center justify-center border-[#002F36] overflow-hidden hover:cursor-pointer"
            >
              <img
                src={product}
                alt="voltas products"
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
export default Mitsubishi;
