import LandingNavbar from "../../../landing/components/LandingNavbar";

function BrandDLink() {
  return (
    <>
      <LandingNavbar />
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
        <div className="relative h-full">
          <img src="/images/brands/mobile-charger.png" alt="Mobile charger" />
          <p className="absolute bottom-0 left-0 w-full text-center bg-black/30 backdrop-blur-sm text-[#fff] py-1 md:py-2 lg:py-4 text-lg md:text-2xl lg:text-3xl border-b-4 border-[#FAA615]">
            Mobile charger
          </p>
        </div>
        <div className="relative h-full">
          <img src="/images/brands/ai-router.png" alt="AI router" />
          <p className="absolute bottom-0 left-0 w-full text-center bg-black/30 backdrop-blur-sm text-[#fff] py-1 md:py-2 lg:py-4 text-lg md:text-2xl lg:text-3xl border-b-4 border-[#4F7922]">
            AI Routers
          </p>
        </div>{" "}
        <div className="relative h-full">
          <img src="/images/brands/switches.png" alt="Switches" />
          <p className="absolute bottom-0 left-0 w-full text-center bg-black/30 backdrop-blur-sm text-[#fff] py-1 md:py-2 lg:py-4 text-lg md:text-2xl lg:text-3xl border-b-4 border-[#6B4D19]">
            Switches
          </p>
        </div>{" "}
        <div className="relative h-full">
          <img src="/images/brands/usb-adapter.png" alt="USB adapter" />
          <p className="absolute bottom-0 left-0 w-full text-center bg-black/30 backdrop-blur-sm text-[#fff] py-1 md:py-2 lg:py-4 text-lg md:text-2xl lg:text-3xl border-b-4 border-[#8F8167]">
            USB Adapter
          </p>
        </div>{" "}
        <div className="relative h-full">
          <img src="/images/brands/surveillance.png" alt="Surveillance" />
          <p className="absolute bottom-0 left-0 w-full text-center bg-black/30 backdrop-blur-sm text-[#fff] py-1 md:py-2 lg:py-4 text-lg md:text-2xl lg:text-3xl border-b-4 border-[#678F6B]">
            Surveillance
          </p>
        </div>{" "}
        <div className="relative h-full">
          <img src="/images/brands/extender.png" alt="Extender" />
          <p className="absolute bottom-0 left-0 w-full text-center bg-black/30 backdrop-blur-sm text-[#fff] py-1 md:py-2 lg:py-4 text-lg md:text-2xl lg:text-3xl border-b-4 border-[#678F8B]">
            Extender
          </p>
        </div>{" "}
      </section>

      <section className="px-4 lg:container py-2 lg:py-5">
        <h2 className="text-3xl md:text-4xl lg:text-5xl uppercase text-center my-7 lg:my-20">
          our popular products
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 justify-items-center gap-3 md:gap-7">
          <div className="p-2 bg-[#fff] flex justify-center items-center shadow-[0px_0px_20px_rgba(0,0,0,0.1)]">
            <img
              src="/images/brands/d-link-product-1.png"
              alt="D-Link product 1"
              className="p-10"
            />
          </div>
          <div className="p-2 bg-[#fff] flex justify-center items-center shadow-[0px_0px_20px_rgba(0,0,0,0.1)]">
            <img
              src="/images/brands/d-link-product-2.png"
              alt="D-Link product 2"
              className="p-10"
            />
          </div>{" "}
          <div className="p-2 bg-[#fff] flex justify-center items-center shadow-[0px_0px_20px_rgba(0,0,0,0.1)]">
            <img
              src="/images/brands/d-link-product-3.png"
              alt="D-Link product 3"
              className="p-10"
            />
          </div>{" "}
          <div className="p-2 bg-[#fff] flex justify-center items-center shadow-[0px_0px_20px_rgba(0,0,0,0.1)]">
            <img
              src="/images/brands/d-link-product-4.png"
              alt="D-Link product 4"
              className="p-10"
            />
          </div>{" "}
          <div className="p-2 bg-[#fff] flex justify-center items-center shadow-[0px_0px_20px_rgba(0,0,0,0.1)]">
            <img
              src="/images/brands/d-link-product-5.png"
              alt="D-Link product 5"
              className="p-10"
            />
          </div>{" "}
          <div className="p-2 bg-[#fff] flex justify-center items-center shadow-[0px_0px_20px_rgba(0,0,0,0.1)]">
            <img
              src="/images/brands/d-link-product-6.png"
              alt="D-Link product 6"
              className="p-10"
            />
          </div>{" "}
          <div className="p-2 bg-[#fff] flex justify-center items-center shadow-[0px_0px_20px_rgba(0,0,0,0.1)]">
            <img
              src="/images/brands/d-link-product-7.png"
              alt="D-Link product 7"
              className="p-10"
            />
          </div>{" "}
          <div className="p-2 bg-[#fff] flex justify-center items-center shadow-[0px_0px_20px_rgba(0,0,0,0.1)]">
            <img
              src="/images/brands/d-link-product-8.png"
              alt="D-Link product 8"
              className="p-10"
            />
          </div>
        </div>
      </section>
    </>
  );
}

export default BrandDLink;
