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

function Carrier() {
  const navigate = useNavigate();
  return (
    <div className="font-inter">
      <LandingNavbar />

      <section className="p-4 lg:container mx-auto">
        <div className="relative overflow-hidden">
          <img
            src="../images/brands/HVAC/carrier/banner.webp"
            alt="carrier banner"
            draggable={false}
            className="w-full h-full object-cover pointer-events-none select-none"
          />
        </div>
      </section>

      <section className="p-4 lg:container mx-auto">
        <div className="relative overflow-hidden">
          <img
            src="../images/brands/HVAC/carrier/banner2.webp"
            alt="carrier banner"
            draggable={false}
            className="w-full h-full object-cover pointer-events-none select-none"
          />
        </div>
      </section>

      <section className="p-4 lg:container mx-auto">
        <div className="flex flex-col xl:flex-row gap-5">
          <img
            src="../images/brands/HVAC/carrier/section3-1.jpg"
            alt="carrier"
            draggable={false}
            className="relative w-full h-[700px] overflow-hidden bg-cover bg-left bg-no-repeat flex-1 pointer-events-none select-none"
          />
          <img
            src="../images/brands/HVAC/carrier/section3-2.jpg"
            alt="carrier"
            draggable={false}
            className="relative w-full h-[700px] overflow-hidden bg-cover bg-left bg-no-repeat flex-1 pointer-events-none select-none"
          />
        </div>
      </section>

      <section className="p-4 lg:container mx-auto">
        <div className="flex flex-col xl:flex-row gap-5">
          <img
            src="../images/brands/HVAC/carrier/section4-1.jpg"
            alt="carrier"
            draggable={false}
            className="relative w-full h-[700px] overflow-hidden bg-cover bg-left bg-no-repeat flex-1 pointer-events-none select-none"
          />
          <img
            src="../images/brands/HVAC/carrier/section4-2.jpg"
            alt="carrier"
            draggable={false}
            className="relative w-full h-[700px] overflow-hidden bg-cover bg-left bg-no-repeat flex-1 pointer-events-none select-none"
          />
        </div>
      </section>

      <section className="p-4 lg:container mx-auto">
        <div className="flex flex-col xl:flex-row font-TimesNewRoman justify-around items-center py-10 gap-16 xl:gap-0">
          <div className="relative overflow-hidden max-w-md">
            <img
              src="../images/brands/HVAC/carrier/section5.jpg"
              alt="bluestar banner"
              draggable={false}
              className="w-full object-cover pointer-events-none select-none"
            />
          </div>
          <div>
            <h2 className="text-3xl">
              ESTER EDGE FXi (Wi-Fi) 3 Star Split Inverter
            </h2>
            <h2 className="text-3xl my-8">₹53,490</h2>
            <p className="text-sm">
              Experience efficient and smart cooling with the ESTER EDGE FXi.
              This 3 BEE star-rated air
              <br /> conditioner offers a blend of advanced connectivity and a
              powerful air filtration system. Designed for
              <br /> reliable performance in challenging conditions, it provides
              clean, healthy cooling by integrating with
              <br /> your smart home setup. Available in 1.0 TR, 1.5 TR and 2.0
              TR variants.
            </p>
            <p className="text-sm mt-4">
              The ESTER EDGE FXi features built-in Wi-Fi for easy remote control
              and smart home integration. Its PM 2.5 Micron
              <br /> Filter ensures clean, healthy air by capturing fine
              particles, while the refrigerant leakage detector alerts you to
              <br /> potential safety issues. The 6 in 1 FlexiCool technology
              offers multiple cooling modes to help customize performance
              <br /> and energy use to suit your needs.
            </p>
            <p className="mt-6 text-[#334A78] hover:underline hover:cursor-pointer w-fit">
              Show more
            </p>
          </div>
        </div>
      </section>

      <section className="p-4 lg:container mx-auto hidden sm:block">
        <div className="relative overflow-hidden">
          {/* Background Image */}
          <img
            src="../images/brands/HVAC/carrier/section6-1.webp"
            alt="Carrier background"
            draggable={false}
            className="w-full h-full object-cover pointer-events-none select-none"
          />

          {/* Overlay Card */}
          <div className="absolute inset-0 flex items-center justify-end pr-10 lg:pr-24">
            <div className="bg-[#f2f2f2] rounded-xl shadow-lg px-6 py-8 w-[30%] text-center">
              <img
                src="../images/brands/HVAC/carrier/section6-2.png"
                alt="Carrier AC"
                draggable={false}
                className="mx-auto mb-0 w-full max-w-[400px] object-contain pointer-events-none select-none"
              />

              <h3 className="text-xl xl:text-2xl font-medium text-[#2c3e70] leading-snug">
                Carrier Room Air <br /> Conditioners
              </h3>
            </div>
          </div>
        </div>
      </section>

      <section className="p-4 lg:container mx-auto">
        <div className="flex flex-col xl:flex-row font-TimesNewRoman justify-around items-center py-10 gap-16 xl:gap-0">
          <div className="relative overflow-hidden max-w-md">
            <img
              src="../images/brands/HVAC/carrier/section7.jpg"
              alt="bluestar banner"
              draggable={false}
              className="w-full object-cover pointer-events-none select-none"
            />
          </div>
          <div>
            <h2 className="text-3xl">XCEL LUMO Fxi 3 Star Split Inverter AC</h2>
            <h2 className="text-3xl my-8">₹54,180</h2>
            <p className="text-sm">
              The XCEL LUMO Fxi is a 3 BEE star-rated Split AC that provides
              powerful cooling with enhanced
              <br /> humidity control and adjusts airflow for optimal
              performance. Available in 1.0 TR, 1.5 TR, and 2.0 TR
              <br /> variants, it’s the ideal choice for consistent comfort
              throughout the year.
            </p>
            <p className="text-sm mt-4">
              XCEL LUMO Fxi split AC is designed for a seamless cooling
              experience, adapting effortlessly to your comfort needs.
              <br /> Enjoy a fresh and purified environment with advanced
              filtration while intelligent airflow adjustments ensure consistent
              <br /> cooling. Powerful cooling kicks in to lower temperatures in
              no time and even in extreme heat, it stays efficient and
              <br /> reliable.
            </p>
            <p className="mt-6 text-[#334A78] hover:underline hover:cursor-pointer w-fit">
              Show more
            </p>
          </div>
        </div>
      </section>

      <section className="p-4 lg:container mx-auto hidden sm:block">
        <div className="relative overflow-hidden">
          {/* Background Image */}
          <img
            src="../images/brands/HVAC/carrier/section8-1.jpg"
            alt="Carrier background"
            draggable={false}
            className="w-full h-full object-cover pointer-events-none select-none"
          />

          {/* Overlay Card */}
          <div className="absolute inset-0 flex items-center justify-end pr-10 lg:pr-24">
            <div className="bg-[#f2f2f2] rounded-xl shadow-lg px-6 py-8 w-[30%] text-center">
              <img
                src="../images/brands/HVAC/carrier/section8-2.png"
                alt="Carrier AC"
                draggable={false}
                className="mx-auto mb-0 w-full max-w-[400px] object-contain pointer-events-none select-none"
              />

              <h3 className="text-xl xl:text-2xl font-medium text-[#2c3e70] leading-snug">
                Carrier Room Air <br /> Conditioners
              </h3>
            </div>
          </div>
        </div>
      </section>

      <section className="p-4 lg:container mx-auto">
        <div className="flex flex-col xl:flex-row font-TimesNewRoman justify-around items-center py-10 gap-16 xl:gap-0">
          <div className="relative overflow-hidden max-w-md">
            <img
              src="../images/brands/HVAC/carrier/section9.jpg"
              alt="bluestar banner"
              draggable={false}
              className="w-full object-cover pointer-events-none select-none"
            />
          </div>
          <div>
            <h2 className="text-3xl">INDUS Fxi 3 Star Split Inverter AC</h2>
            <h2 className="text-3xl my-8">₹55,590</h2>
            <p className="text-sm">
              Enjoy efficient cooling with the 3 BEE star-rated INDUS FXi
              Inverter AC, which has smart
              <br /> technology that automatically adjusts cooling levels based
              on room conditions. Its advanced filtration
              <br /> system provides clean air in every use. This smart AC is
              available in 1 TR, 1.5 TR, and 2 TR variants.
            </p>
            <p className="text-sm mt-4">
              This AC is designed to keep you cool even in high temperatures
              like 52°C with High Ambient Working
              <br /> technology. With FlexiCool, it adjusts cooling levels to
              suit your needs while saving energy. The smart Auto
              <br /> Cleanser prevents dust and mold buildup, while the Hydro
              Blue Coating enhances durability and protects the
              <br /> coils from corrosion for long-lasting performance.
            </p>
            <p className="mt-6 text-[#334A78] hover:underline hover:cursor-pointer w-fit">
              Show more
            </p>
          </div>
        </div>
      </section>

      <section className="p-4 lg:container mx-auto">
        <div className="flex flex-col xl:flex-row gap-5">
          <img
            src="../images/brands/HVAC/carrier/section10-1.webp"
            alt="carrier"
            draggable={false}
            className="relative w-full h-[700px] overflow-hidden bg-cover bg-left bg-no-repeat flex-1 pointer-events-none select-none"
          />
          <img
            src="../images/brands/HVAC/carrier/section10-2.webp"
            alt="carrier"
            draggable={false}
            className="relative w-full h-[700px] overflow-hidden bg-cover bg-left bg-no-repeat flex-1 pointer-events-none select-none"
          />
        </div>
      </section>

      <section className="p-4 lg:container mx-auto">
        <div
          className="relative w-full h-[380px] overflow-hidden bg-cover bg-top bg-no-repeat"
          style={{
            backgroundImage:
              "url('../images/brands/HVAC/carrier/banner11.webp')",
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
export default Carrier;
