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
function Godrej() {
  return (
    <div className="font-inter">
      <LandingNavbar />

      <section className="p-4 lg:container mx-auto">
        <div className="relative overflow-hidden">
          <img
            src="../images/brands/Furniture/godrej/banner.png"
            alt="godrej banner"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      <section className="flex items-center justify-around overflow-y-hidden bg-[#FAE0B0] max-h-32 my-4">
        <img src="../images/brands/Furniture/godrej/seperator.png" alt="" />
        <p className="text-black text-lg font-semibold text-center lg:text-xl w-2/3">
          EXPLORE A WIDE RANGE OF ASSURED QUALITY FURNITURE FROM GODREJ
          INTERIORS
        </p>
        <img src="../images/brands/Furniture/godrej/seperator.png" alt="" />
      </section>

      <section className="p-4 lg:container mx-auto">
        <div className="flex flex-col xl:flex-row gap-5">
          <img
            src="../images/brands/Furniture/godrej/section2-1.png"
            alt="godrej"
            className="relative w-full h-[350px] overflow-hidden
               bg-contain bg-left bg-no-repeat"
          />
          <img
            src="../images/brands/Furniture/godrej/section2-2.png"
            alt="godrej"
            className="relative w-full h-[350px] overflow-hidden
               bg-contain bg-left bg-no-repeat"
          />
        </div>
      </section>

      <section className="p-4 lg:container mx-auto">
        <div className="flex flex-col xl:flex-row gap-5">
          <img
            src="../images/brands/Furniture/godrej/section3-1.png"
            alt="godrej"
            className="relative w-full h-[700px] overflow-hidden
               bg-cover bg-left bg-no-repeat border border-[#002F36] flex-1 p-2"
          />
          <div className="flex flex-col gap-5 flex-1">
            <img
              src="../images/brands/Furniture/godrej/chair-1.png"
              alt="godrej"
              className="relative w-full h-[340px] overflow-hidden
               bg-contain bg-center bg-no-repeat"
            />

            <img
              src="../images/brands/Furniture/godrej/chair-2.png"
              alt="godrej"
              className="relative w-full h-[340px] overflow-hidden
               bg-contain bg-center bg-no-repeat"
            />
          </div>
        </div>
      </section>

      <section className="p-4 lg:container mx-auto">
        <div className="flex flex-col xl:flex-row gap-5">
          <img
            src="../images/brands/Furniture/godrej/section4-1.png"
            alt="godrej"
            className="relative w-full h-[700px] overflow-hidden
               bg-cover bg-left bg-no-repeat border border-[#002F36] flex-1 p-2"
          />
          <div className="flex flex-col gap-5 flex-1">
            <img
              src="../images/brands/Furniture/godrej/section4-2.png"
              alt="godrej"
              className="relative w-full h-[340px] overflow-hidden
               bg-contain bg-center bg-no-repeat"
            />

            <img
              className="relative w-full h-[340px] overflow-hidden
               bg-contain bg-center bg-no-repeat"
              src="../images/brands/Furniture/godrej/section4-3.png"
              alt="godrej"
            />
          </div>
        </div>
      </section>

      <section className="p-4 lg:container mx-auto">
        <div
          className="relative w-full h-[380px] overflow-hidden
               bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('../images/brands/Furniture/wipro/collection.png')",
          }}
        >
          <div className="absolute inset-0 bg-[#997C5E80]/50" />

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

      <section className="p-4 lg:container mx-auto">
        <div className="flex flex-col xl:flex-row gap-5">
          <img
            src="../images/brands/Furniture/godrej/section5.png"
            alt="godrej"
            className="relative w-full h-[700px] overflow-hidden
               bg-cover bg-left bg-no-repeat border border-[#002F36] flex-1 p-2"
          />
          <div className="flex flex-col gap-5 flex-1 items-center justify-center">
            <div className="grid grid-cols-1 md:grid-cols-2 items-center justify-center gap-4">
              {ourCollection.slice(0, 4).map((product, index) => (
                <div
                  key={index}
                  className="border w-full h-80 p-2 flex items-center justify-center border-[#002F36] overflow-hidden hover:cursor-pointer"
                >
                  <img src={product} alt="product" className="h-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 lg:container mx-auto py-10">
        <p className="text-3xl lg:text-5xl text-center items-center lg:px-40 xl:px-56">
          Godrej Interio is India’s premium furniture brand in both home and
          institutional segments with a strong commitment to sustainability,
          excellence in design, manufacturing and great retail experience.
        </p>
      </section>

      <Footer />
    </div>
  );
}

export default Godrej;
