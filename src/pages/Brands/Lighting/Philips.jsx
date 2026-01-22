import { useNavigate } from "react-router-dom";
import Footer from "../../../common-components/Footer";
import LandingNavbar from "../../../landing/components/LandingNavbar";

const ourCollection = [
  "../images/brands/Lighting/philips/section7-1.webp",
  "../images/brands/Lighting/philips/section7-2.webp",
  "../images/brands/Lighting/philips/section7-3.jpg",
  "../images/brands/Lighting/philips/section7-4.webp",
  "../images/brands/Lighting/philips/section7-5.webp",
  "../images/brands/Lighting/philips/section7-6.jfif",
  "../images/brands/Lighting/philips/section7-7.webp",
  "../images/brands/Lighting/philips/section7-8.webp",
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
            src="../images/brands/Lighting/philips/banner6.webp"
            alt="philips banner"
            draggable={false}
            className="w-full h-full object-cover pointer-events-none select-none"
          />
          <div className="absolute left-[10%] sm:left-[15%] lg:left-[22%] top-1/2 -translate-y-1/2 font-segoe text-white font-bold w-fit">
            <p className="text-lg md:text-4xl xl:text-6xl pb-1 sm:pb-2">
              Where Light
              <br /> Becomes Art.
            </p>
            <hr />
            <p className="text-xs md:text-xl xl:text-2xl pt-1 sm:pt-2">
              Philips Chandelier Collection.
            </p>
          </div>
          <hr />
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
export default Philips;
