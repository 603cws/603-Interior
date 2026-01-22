import Footer from "../../../common-components/Footer";
import LandingNavbar from "../../../landing/components/LandingNavbar";

const ourProducts = [
  "/images/brands/d-link-product-1.png",
  "/images/brands/d-link-product-2.png",
  "/images/brands/d-link-product-3.png",
  "/images/brands/d-link-product-4.png",
  "/images/brands/d-link-product-5.png",
  "/images/brands/d-link-product-6.png",
  "/images/brands/d-link-product-7.png",
  "/images/brands/d-link-product-8.png",
];
const branches = [
  { name: "Mobile charger", image: "/images/brands/mobile-charger.png" },
  { name: "AI Routers", image: "/images/brands/ai-router.png" },
  { name: "Switches", image: "/images/brands/switches.png" },
  { name: "USB Adapter", image: "/images/brands/usb-adapter.png" },
  { name: "Surveillance", image: "/images/brands/surveillance.png" },
  { name: "Extender", image: "/images/brands/extender.png" },
];
function BrandDLink() {
  return (
    <>
      <LandingNavbar className="relative" />
      <section className=" bg-gradient-to-r from-[#08022E] to-[#19214F] font-Poppins text-[#fff] my-5 ">
        <div className="px-4 lg:container lg:flex bg-[url('/images/brands/eclips-bg.png')] bg-right bg-no-repeat bg-contain py-10 lg:py-20">
          <div className="flex-1 flex justify-end">
            <div className="space-y-7 lg:space-y-12">
              <h5 className="font-semibold text-sm md:text-xl">
                Wireless Network
              </h5>
              <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-light">
                Wi-Fi Access Points <br /> that deliver faster <br /> speeds.
              </h2>
              <p className="text-sm md:text-xl font-extralight">
                D-Link’s superior Access Points are used in all types of <br />{" "}
                businesses, organizations. and corporations around the world.
              </p>
            </div>
          </div>
          <div className="flex-1 flex justify-center">
            <img src="/images/brands/d-link-router.png" alt="D-Link router" />
          </div>
        </div>
      </section>

      <section className="bg-[url('/images/brands/d-link-features-bg.png')] bg-cover bg-center bg-no-repeat h-80 lg:h-96 my-10 relative overflow-hidden">
        <div className="hidden md:block absolute -left-20 lg:-left-10 xl:left-0 -top-12 w-[400px] lg:w-[520px] h-[450px] lg:h-[520px] rounded-[0px_1000px_1000px_0px] bg-[#CED9D7]"></div>
        <div className="hidden md:block absolute -left-20 lg:-left-10 xl:left-0 -top-12 w-[350px] lg:w-[500px] h-[400px] lg:h-[500px] rounded-[0px_1000px_1000px_0px] bg-white"></div>
        <div className="px-4 lg:container md:flex  md:h-full relative">
          <div className="flex justify-center items-center lg:h-full">
            <img
              src="/images/brands/dlink-logo-teal.png"
              alt="D-Link logo"
              className="h-20 lg:h-auto"
            />
          </div>
          <div className="relative flex-1">
            <p className="text-sm md:text-base xl:text-xl font-semibold text-[#fff] mt-10 text-center text-wrap">
              Home Networking. Whole Home Wi-Fi Systems. Wi-Fi Routers. Mobile
              Wi-Fi Hotspots. Cameras & Smart Home. Cameras. Smart Plugs.
              Sensors.
            </p>
            <img
              src="/images/brands/dlink-devices.png"
              alt="D-Link devices"
              className="h-28 md:h-40 md:absolute bottom-1/4 left-1/4 md:translate-y-1/4 md:-translate-x-2"
            />
          </div>
        </div>
      </section>

      <section className="px-4 lg:container mx-auto grid grid-cols-2 md:grid-cols-3 justify-items-center gap-3 md:gap-7 my-10">
        {branches.map((branch, index) => (
          <div key={index} className="relative h-full w-full">
            <img src={branch.image} alt="Mobile charger" className="w-full" />
            <p className="absolute bottom-0 left-0 w-full text-center bg-black/30 backdrop-blur-sm text-[#fff] py-1 md:py-2 lg:py-4 text-lg md:text-2xl lg:text-3xl border-b-4 border-[#FAA615]">
              {branch.name}
            </p>
          </div>
        ))}
      </section>

      <section className="px-4 lg:container py-2 lg:py-5">
        <img
          src="/images/brands/SmartSolutions/dlink/s-4.png"
          alt="section-image"
          className="w-full object-cover max-h-96"
        />
      </section>
      <section className="px-4 lg:container py-2 lg:py-5">
        <img
          src="/images/brands/SmartSolutions/dlink/s-5.png"
          alt="section-image"
          className="w-full object-cover max-h-96"
        />
      </section>
      <section className="px-4 lg:container py-2 lg:py-5">
        <img
          src="/images/brands/SmartSolutions/dlink/s-6.png"
          alt="section-image"
          className="w-full object-cover max-h-96"
        />
      </section>
      <section className="px-4 lg:container py-2 lg:py-5">
        <div className="grid grid-cols-2 md:grid-cols-4 justify-items-center gap-3 md:gap-7">
          {ourProducts.map((product, index) => (
            <div
              key={index}
              className="p-2 bg-[#fff] flex justify-center items-center shadow-[0px_0px_20px_rgba(0,0,0,0.1)] w-full"
            >
              <img src={product} alt="D-Link product 1" className="p-10" />
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </>
  );
}

export default BrandDLink;
