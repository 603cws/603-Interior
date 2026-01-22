import LandingNavbar from "../../../landing/components/LandingNavbar";

function Daikin() {
  return (
    <>
      <div className="font-Poppins">
        <LandingNavbar />
        <section className="lg:container px-4 my-10">
          <div className="space-y-5">
            <img src="/images/brands/hvac-hero-1.png" alt="hvac hero 1" />
            <img src="/images/brands/hvac-hero-2.png" alt="hvac hero 2" />
          </div>
        </section>
        <section className="lg:container px-4 my-10">
          <img src="/images/brands/hvac-section-2.png" alt="hvac section 2" />
        </section>
        <section className="lg:container px-4 my-10 grid grid-cols-2 justify-items-center gap-3 md:gap-7">
          <img
            src="/images/brands/hvac-sec3-1.png"
            alt="hvac sec3 1"
            className="max-w-sm lg:max-w-[500px] w-full"
          />
          <img
            src="/images/brands/hvac-sec3-2.png"
            alt="hvac sec3 2"
            className="max-w-sm lg:max-w-[500px] w-full"
          />{" "}
          <img
            src="/images/brands/hvac-sec3-3.png"
            alt="hvac sec3 3"
            className="max-w-sm lg:max-w-[500px] w-full"
          />{" "}
          <img
            src="/images/brands/hvac-sec3-4.png"
            alt="hvac sec3 4"
            className="max-w-sm lg:max-w-[500px] w-full"
          />
        </section>

        <section className="p-4 lg:container mx-auto">
          <div
            className="relative w-full h-[380px] overflow-hidden
               bg-cover bg-top bg-no-repeat"
            style={{
              backgroundImage: "url('../images/brands/HVAC/banner.jpg')",
            }}
          >
            <div className="absolute inset-0 bg-[#DE2D49]/20" />

            <div className="relative z-10 flex items-center justify-center h-full px-6 lg:px-12">
              <h2 className="text-white text-2xl sm:text-5xl xl:text-8xl text-center hover:scale-75 hover:cursor-pointer transition duration-300 ease-in-out font-segoe">
                Browse our collection
              </h2>
            </div>
          </div>
        </section>

        <section className="lg:container px-4 my-5">
          <h2 className="text-3xl md:text-4xl lg:text-5xl uppercase text-center my-10">
            our popular products
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-7">
            <img
              src="/images/brands/brand-hvac-1.png"
              alt="Brand HVAC 1"
              className="w-full h-full p-2 bg-[#fff] shadow-[0px_0px_20px_rgba(0,0,0,0.1)]"
            />
            <img
              src="/images/brands/brand-hvac-2.png"
              alt="Brand HVAC 2"
              className="w-full h-full p-2 bg-[#fff] shadow-[0px_0px_20px_rgba(0,0,0,0.1)]"
            />
            <img
              src="/images/brands/brand-hvac-3.png"
              alt="Brand HVAC 3"
              className="w-full h-full p-2 bg-[#fff] shadow-[0px_0px_20px_rgba(0,0,0,0.1)]"
            />
            <img
              src="/images/brands/brand-hvac-4.png"
              alt="Brand HVAC 4"
              className="w-full h-full p-2 bg-[#fff] shadow-[0px_0px_20px_rgba(0,0,0,0.1)]"
            />
            <img
              src="/images/brands/brand-hvac-5.png"
              alt="Brand HVAC 5"
              className="w-full h-full p-2 bg-[#fff] shadow-[0px_0px_20px_rgba(0,0,0,0.1)]"
            />
            <img
              src="/images/brands/brand-hvac-1.png"
              alt="Brand HVAC 1"
              className="w-full h-full p-2 bg-[#fff] shadow-[0px_0px_20px_rgba(0,0,0,0.1)]"
            />
            <img
              src="/images/brands/brand-hvac-2.png"
              alt="Brand HVAC 2"
              className="w-full h-full p-2 bg-[#fff] shadow-[0px_0px_20px_rgba(0,0,0,0.1)]"
            />
            <img
              src="/images/brands/brand-hvac-3.png"
              alt="Brand HVAC 3"
              className="w-full h-full p-2 bg-[#fff] shadow-[0px_0px_20px_rgba(0,0,0,0.1)]"
            />
          </div>
        </section>
      </div>
    </>
  );
}

export default Daikin;
