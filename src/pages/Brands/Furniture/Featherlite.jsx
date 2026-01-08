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

function Featherlite() {
  return (
    <div className="font-inter">
      <LandingNavbar />

      <section className="p-4 lg:container mx-auto">
        <div className="relative rounded-2xl overflow-hidden">
          <img
            src="../images/brands/Furniture/featherlite/banner.png"
            alt="featherlite banner"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      <section className="p-4 lg:container mx-auto font-Poppins">
        <div className="flex flex-col xl:flex-row gap-5">
          <div
            className="relative w-full h-[380px] overflow-hidden
               bg-cover bg-left bg-no-repeat rounded-3xl border border-[#002F36]"
            style={{
              backgroundImage:
                "url('../images/brands/Furniture/wipro/section2-1.png')",
            }}
          >
            <div className="relative z-10 flex flex-col items-end text-end justify-center h-full px-6 lg:px-12">
              <h2 className="text-sm sm:text-xl xl:text-2xl font-semibold text-[#865D36]">
                Elevate Your Comfort,
                <br /> Boost Your Productivity
              </h2>
              <button className="mt-4 bg-white/40 hover:bg-white rounded-3xl px-6 py-2">
                BUY NOW
              </button>
            </div>
          </div>
          <div
            className="relative w-full h-[380px] overflow-hidden
               bg-cover bg-left bg-no-repeat rounded-3xl border border-[#002F36]"
            style={{
              backgroundImage:
                "url('../images/brands/Furniture/wipro/section2-2.png')",
            }}
          >
            <div className="relative z-10 flex flex-col items-end text-end justify-center h-full px-6 lg:px-12">
              <h2 className="text-sm sm:text-xl xl:text-2xl font-semibold text-[#865D36]">
                Elevate Your Comfort,
                <br /> Boost Your Productivity
              </h2>
              <button className="mt-4 bg-white/40 hover:bg-white rounded-3xl px-6 py-2">
                BUY NOW
              </button>
            </div>
          </div>
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
            src="../images/brands/Furniture/featherlite/banner3.png"
            alt="featherlite banner"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      <section className="p-4 lg:container mx-auto">
        <div className="relative rounded-2xl overflow-hidden">
          <img
            src="../images/brands/Furniture/featherlite/banner4.png"
            alt="featherlite banner"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      <section className="p-4 lg:container mx-auto">
        <div className="flex flex-col xl:flex-row gap-5">
          <img
            src="../images/brands/Furniture/featherlite/section5-1.png"
            alt="featherlite"
            className="relative w-full h-[700px] overflow-hidden
               bg-cover bg-left bg-no-repeat border border-[#002F36] flex-1 p-2"
          />
          <div className="flex flex-col gap-5 flex-1">
            <img
              src="../images/brands/Furniture/featherlite/section5-2.jpg"
              alt="featherlite"
              className="relative w-full h-[340px] overflow-hidden
               bg-contain bg-center bg-no-repeat"
            />

            <img
              src="../images/brands/Furniture/featherlite/section5-3.jpg"
              alt="featherlite"
              className="relative w-full h-[340px] overflow-hidden
               bg-contain bg-center bg-no-repeat"
            />
          </div>
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
          <div className="absolute inset-0 bg-[#454545]/50" />

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
export default Featherlite;
