import Footer from "../../../common-components/Footer";
import LandingNavbar from "../../../landing/components/LandingNavbar";

const ourCollection = [
  "../images/brands/Furniture/spacewood/section6-1.png",
  "../images/brands/Furniture/spacewood/section6-2.png",
  "../images/brands/Furniture/spacewood/section6-3.png",
  "../images/brands/Furniture/spacewood/section6-4.png",
  "../images/brands/Furniture/spacewood/section6-5.png",
  "../images/brands/Furniture/spacewood/section6-6.png",
  "../images/brands/Furniture/spacewood/section6-7.png",
  "../images/brands/Furniture/spacewood/section6-8.png",
];

function Spacewood() {
  return (
    <div className="font-inter">
      <LandingNavbar />

      <div className="p-4 w-1/2 relative rounded-3xl mx-auto overflow-hidden">
        <img
          src="../images/brands/Furniture/1.png"
          alt="spacewood"
          className="z-0"
        />
        <img
          src="../images/brands/Furniture/2.png"
          className="absolute top-4 left-32 -z-10"
          alt="spacewood"
        />
        <img
          src="../images/brands/Furniture/top.png"
          className="absolute top-4 left-[45%] -z-30"
          alt="spacewood"
        />
        <img
          src="../images/brands/Furniture/bottom.png"
          className="absolute bottom-4 right-0 -z-30"
          alt="spacewood"
        />
        <img
          src="../images/brands/Furniture/name.png"
          className="absolute top-12 right-[38%] z-0"
          alt="spacewood"
        />
      </div>

      <section className="p-4 lg:container mx-auto">
        <div className="relative rounded-2xl overflow-hidden">
          <img
            src="../images/brands/Furniture/spacewood/banner.png"
            alt="featherlite banner"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      <section className="p-4 lg:container mx-auto">
        <div className="flex flex-col xl:flex-row gap-5 w-full">
          <img
            src="../images/brands/Furniture/spacewood/section2-1.png"
            alt="spacewood"
            className="relative w-full h-[700px] overflow-hidden
               bg-cover bg-left bg-no-repeat flex-1 p-2"
          />
          <div className="flex flex-col gap-5 w-2/5">
            <img
              src="../images/brands/Furniture/spacewood/section2-2.png"
              alt="spacewood"
              className="relative w-full h-[340px] overflow-hidden
               bg-contain bg-center bg-no-repeat"
            />

            <img
              src="../images/brands/Furniture/spacewood/section2-3.png"
              alt="spacewood"
              className="relative w-full h-[340px] overflow-hidden
               bg-contain bg-center bg-no-repeat"
            />
          </div>
        </div>
      </section>

      <section className="p-4 lg:container mx-auto">
        <div className="relative rounded-2xl overflow-hidden">
          <img
            src="../images/brands/Furniture/spacewood/banner3.png"
            alt="featherlite banner"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      <section className="p-4 lg:container mx-auto">
        <div className="relative rounded-2xl overflow-hidden">
          <img
            src="../images/brands/Furniture/spacewood/banner4.png"
            alt="featherlite banner"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      <section className="p-4 lg:container mx-auto">
        <div className="relative rounded-2xl overflow-hidden">
          <img
            src="../images/brands/Furniture/spacewood/banner5.png"
            alt="featherlite banner"
            className="w-full h-full object-cover"
          />
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
          <div className="absolute inset-0 bg-[#746F5A]/20" />

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
export default Spacewood;
