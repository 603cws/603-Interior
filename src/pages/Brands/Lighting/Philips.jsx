import { useNavigate } from "react-router-dom";
import Footer from "../../../common-components/Footer";
import LandingNavbar from "../../../landing/components/LandingNavbar";

const ourCollection = [
  "../images/brands/SmartSolutions/schneiderElectric/section8-1.png",
  "../images/brands/SmartSolutions/schneiderElectric/section8-2.png",
  "../images/brands/SmartSolutions/schneiderElectric/section8-3.png",
  "../images/brands/SmartSolutions/schneiderElectric/section8-4.png",
  "../images/brands/SmartSolutions/schneiderElectric/section8-5.png",
  "../images/brands/SmartSolutions/schneiderElectric/section8-6.png",
  "../images/brands/SmartSolutions/schneiderElectric/section8-7.png",
  "../images/brands/SmartSolutions/schneiderElectric/section8-8.png",
];

function Philips() {
  const navigate = useNavigate();
  return (
    <div className="font-inter">
      <LandingNavbar />

      <section className="p-4 lg:container mx-auto">
        <div className="relative overflow-hidden">
          <img
            src="../images/brands/Lighting/philips/banner.jpg"
            alt="philips banner"
            draggable={false}
            className="w-full h-full object-cover pointer-events-none select-none"
          />
        </div>
      </section>

      <section className="p-4 lg:container mx-auto">
        <div className="relative overflow-hidden">
          <img
            src="../images/brands/Lighting/philips/banner2.webp"
            alt="philips banner"
            draggable={false}
            className="w-full h-full object-cover pointer-events-none select-none"
          />
          <h2 className="absolute left-2 sm:left-16 2xl:left-36 text-lg md:text-4xl xl:text-6xl inset-0 flex items-center font-segoe text-white font-bold">
            Philips Smart
            <br /> light Hub
          </h2>
        </div>
      </section>

      <section className="p-4 lg:container mx-auto">
        <div className="relative overflow-hidden">
          <img
            src="../images/brands/Lighting/philips/banner3.webp"
            alt="philips banner"
            draggable={false}
            className="w-full h-full object-cover pointer-events-none select-none"
          />
          <h2 className="absolute left-2 sm:left-16 2xl:left-36 text-lg md:text-4xl xl:text-6xl inset-0 flex items-center font-segoe text-white font-bold">
            Philips Smart
            <br /> light Hub
          </h2>
        </div>
      </section>

      <section className="p-4 lg:container mx-auto">
        <div className="relative overflow-hidden">
          <img
            src="../images/brands/Lighting/philips/banner4.webp"
            alt="philips banner"
            draggable={false}
            className="w-full h-full object-cover pointer-events-none select-none"
          />
          <div className="absolute inset-0 bg-[#000000]/20" />
          <h2 className="absolute left-2 sm:left-10 2xl:left-28 text-lg md:text-4xl xl:text-6xl inset-0 flex items-center font-segoe text-white font-bold">
            Looking for lighting
            <br /> inspiration?
          </h2>
        </div>
      </section>

      <section className="p-4 lg:container mx-auto">
        <div className="relative overflow-hidden">
          <img
            src="../images/brands/Lighting/philips/banner5.webp"
            alt="philips banner"
            draggable={false}
            className="w-full h-full object-cover pointer-events-none select-none"
          />
          <div className="absolute inset-0 bg-[#000000]/20" />
          <h2 className="absolute left-2 sm:left-10 2xl:left-28 text-lg md:text-4xl xl:text-6xl inset-0 flex items-center font-segoe text-white font-bold">
            Optimise your office
            <br /> and boost productivity
          </h2>
        </div>
      </section>

      <section className="p-4 lg:container mx-auto">
        <div className="relative overflow-hidden">
          <img
            src="../images/brands/Lighting/philips/banner6.jpg"
            alt="philips banner"
            draggable={false}
            className="w-full h-full object-cover pointer-events-none select-none"
          />
        </div>
      </section>

      <section className="p-4 lg:container mx-auto">
        <div className="relative overflow-hidden">
          <img
            src="../images/brands/Lighting/philips/banner7.png"
            alt="philips banner"
            draggable={false}
            className="w-full h-full object-cover pointer-events-none select-none"
          />
        </div>
      </section>

      <section className="p-4 lg:container mx-auto flex flex-col">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 items-center justify-center gap-4">
          {ourCollection.map((product, index) => (
            <div
              key={index}
              onClick={() => navigate("/shop?query=lighting")}
              className="border w-full h-80 p-12 flex items-center justify-center border-[#002F36] overflow-hidden hover:cursor-pointer"
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
export default Philips;
