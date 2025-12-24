import Footer from "../../common-components/Footer";
import LandingNavbar from "../../landing/components/LandingNavbar";

const ourCollection = [
  "../images/brands/lg/lg-1.webp",
  "../images/brands/lg/lg-2.webp",
  "../images/brands/lg/lg-3.webp",
  "../images/brands/lg/lg-4.webp",
  "../images/brands/lg/lg-5.webp",
  "../images/brands/lg/lg-6.webp",
  "../images/brands/lg/lg-7.webp",
  "../images/brands/lg/lg-8.webp",
];
function Lg() {
  return (
    <div className="font-segoe">
      <LandingNavbar />
      <section className="flex flex-col px-4 lg:container mx-auto py-4">
        <img
          src="../images/brands/lg/banner.jpg"
          alt="lg banner"
          className="m-2"
        />
      </section>

      <section className="px-4 lg:container h-screen mx-auto py-10">
        <div
          className="relative w-full h-full overflow-hidden lg:rounded-s-[500px] lg:rounded-e-[60px] bg-cover bg-top sm:bg-right-top lg:bg-center shadow-md"
          style={{
            backgroundImage: "url('../images/brands/lg/hero-section.webp')",
          }}
        >
          {/* CONTENT */}
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 h-full pl-4 items-center">
            {/* LEFT TEXT */}
            <div className="px-8 lg:px-14 py-12 mx-auto">
              <h1 className="text-4xl lg:text-6xl text-black">Diet Mode</h1>

              <p className="mt-4 max-w-md text-sm lg:text-base text-[#323232] leading-relaxed">
                LG Air Conditioner lets it consume energy as
                <br className="lg: block" /> minimum as 19% i.e. consuming as
                less as 280W only.
              </p>
            </div>
          </div>

          {/* FLOATING BADGE */}
          <div className="hidden lg:block absolute top-3 right-2 xl:top-8 xl:right-8 z-20 bg-gradient-to-b from-[#F4F4F5] to-[#B0B0B2] rounded-xl shadow-md px-2 py-3 w-24 xl:w-28 text-center border-2 border-black">
            <p className="text-[10px] font-semibold text-gray-500 uppercase">
              More Convenience More Saving
            </p>
            <div className="border-[1.2px] border-[#767676] my-3" />
            <p className="text-lg text-red-600 mt-1">
              Diet<span className="text-black">Mode</span>
            </p>
            <p className="text-[10px] text-black mt-1 uppercase">
              Energy Efficiency
            </p>
          </div>
        </div>
      </section>

      <section className="px-4 lg:container mx-auto py-6">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-4">
          <FeatureCard
            title="Most popular air conditioner"
            img="../images/brands/lg/card1.png"
            alt="Most popular AC"
          />

          <FeatureCard
            title="Product to ensure energy efficiency"
            img="../images/brands/lg/card2.png"
            alt="Energy efficient AC"
          />

          <FeatureCard
            title="Faster cooling, faster comfort"
            img="../images/brands/lg/card3.png"
            alt="Fast cooling AC"
          />
        </div>
      </section>

      <section className="px-4 lg:container mx-auto py-4 flex flex-col">
        <div className="flex flex-col sm:flex-row items-start justify-center sm:gap-4">
          {/* ITEM 1 */}
          <div className="flex-1 items-center">
            <img
              src="../images/brands/lg/lg1.png"
              alt="Anti Virus Protection"
              className="w-full h-full object-cover"
            />
          </div>

          {/* ITEM 2 */}
          <div className="flex-1 items-center">
            <img
              src="../images/brands/lg/lg2.png"
              alt="Low Gas Detection"
              className="w-full h-full object-cover"
            />
          </div>

          {/* ITEM 3 */}
          <div className="flex-1 items-center">
            <img
              src="../images/brands/lg/lg3.png"
              alt="4 Way Swing"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="px-4 lg:container mx-auto flex flex-col">
        <img src="../images/brands/lg/lg4.webp" alt="HimClean" />
      </section>

      <section className="px-4 lg:container mx-auto py-4 flex flex-col">
        <img
          src="../images/brands/lg/lg5.webp"
          className="hidden lg:block"
          alt="goldfin+"
        />
        <img
          src="../images/brands/lg/lg6.png"
          className="block lg:hidden"
          alt="goldfin+"
        />
      </section>

      <section className="flex items-center justify-around overflow-y-hidden bg-[#DE2D49] max-h-32 my-4">
        <img src="../images/brands/lg/seperator.png" alt="" />
        <p className="text-[#fff] text-3xl text-center lg:text-4xl w-2/3">
          Air Conditioner by room size
        </p>
        <img src="../images/brands/lg/seperator.png" alt="" />
      </section>

      <section>
        <img
          src="../images/brands/lg/banner2.png"
          alt="cabins"
          className="w-[700px]"
        />
      </section>

      <section className="px-4 lg:container mx-auto py-4 flex flex-col">
        <div
          className="relative w-full h-[300px] sm:h-[400px] lg:h-[550px] xl:h-[700px] overflow-hidden
               bg-cover bg-left bg-no-repeat"
          style={{
            backgroundImage: "url('../images/brands/lg/lg7.webp')",
          }}
        />
      </section>

      <section className="px-4 lg:container mx-auto py-6">
        <div
          className="relative w-full h-[380px] overflow-hidden
               bg-cover bg-top bg-no-repeat"
          style={{
            backgroundImage: "url('../images/brands/lg/banner2.png')",
          }}
        >
          {/* Optional overlay tint */}
          <div className="absolute inset-0 bg-[#DE2D4933]/20" />

          {/* TEXT */}
          <div className="relative z-10 flex items-center justify-center h-full px-6 lg:px-12">
            <h2 className="text-white text-5xl lg:text-8xl text-center hover:scale-75 hover:cursor-pointer transition duration-300 ease-in-out">
              Browse our collection
            </h2>
          </div>
        </div>
      </section>

      <section className="px-4 lg:container mx-auto py-4 flex flex-col">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 items-center justify-center gap-4">
          {ourCollection.map((product, index) => (
            <div
              key={index}
              className="border w-full h-80 flex items-center justify-center p-2 border-[#002F36] overflow-hidden"
            >
              <img src={product} alt="product" />
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 lg:container mx-auto py-10">
        <p className="text-3xl lg:text-5xl text-center items-center lg:px-40 xl:px-72">
          LG brings cutting-edge AC technology designed to provide powerful
          cooling, silent performance, and exceptional energy savings.
        </p>
      </section>

      <Footer />
    </div>
  );
}

export default Lg;

function FeatureCard({ title, img, alt }) {
  return (
    <div className="flex-1 bg-[#F1F1F1] rounded-3xl pl-6 pt-6 flex flex-col justify-between">
      <div>
        <h3 className="text-lg lg:text-xl xl:text-3xl text-black">{title}</h3>
      </div>

      <div className="mt-6 flex justify-between">
        <div>
          <button className="py-1.5 px-4 text- xl:text-base border border-black rounded-full whitespace-nowrap hover:bg-gray-200">
            Learn more
          </button>
        </div>

        <img src={img} alt={alt} className="object-contain max-h-[100px]" />
      </div>
    </div>
  );
}
