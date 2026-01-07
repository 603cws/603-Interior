import Footer from "../../../common-components/Footer";
import LandingNavbar from "../../../landing/components/LandingNavbar";

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
      <section className="flex flex-col lg:container mx-auto py-4">
        <img
          src="../images/brands/lg/banner.jpg"
          alt="lg banner"
          className="m-2"
        />
      </section>

      <section className="px-4 lg:container h-screen mx-auto py-8">
        <div
          className="relative w-full h-full overflow-hidden lg:rounded-s-[500px] lg:rounded-e-[60px] bg-cover bg-top sm:bg-right-top lg:bg-center shadow-md"
          style={{
            backgroundImage: "url('../images/brands/lg/hero-section.webp')",
          }}
        >
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 h-full pl-4 items-center">
            <div className="px-8 lg:px-14 py-12 mx-auto">
              <h1 className="text-4xl lg:text-6xl text-black">Diet Mode</h1>

              <p className="mt-4 max-w-md text-sm lg:text-base text-[#323232] leading-relaxed">
                LG Air Conditioner lets it consume energy as
                <br className="lg: block" /> minimum as 19% i.e. consuming as
                less as 280W only.
              </p>
            </div>
          </div>

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
          <div className="flex-1 items-center">
            <img
              src="../images/brands/lg/lg1.png"
              alt="Anti Virus Protection"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1 items-center">
            <img
              src="../images/brands/lg/lg2.png"
              alt="Low Gas Detection"
              className="w-full h-full object-cover"
            />
          </div>

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

      <section className="px-4 lg:container mx-auto py-2">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 font-segoe">
          <div className="relative bg-[#e9e5e4] overflow-hidden">
            <div className="p-6 text-center">
              <h2 className="text-3xl sm:text-6xl font-semibold">
                Large Cabins
              </h2>
              <p className="text-2xl sm:text-4xl mt-1">150–250 sq.ft</p>
            </div>

            <div className="h-[565px] xl:rounded-tr-[155px] overflow-hidden">
              <img
                src="../images/brands/lg/bg.jpeg"
                alt="Large cabin office"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="absolute -bottom-32 -left-16 sm:-bottom-20 sm:-left-8 bg-[#E1384F] text-white rounded-full p-10 w-[300px] h-[300px] text-center">
              <p className="text-lg sm:text-2xl">
                Suitable <br /> for big office rooms
              </p>
              <p className="text-3xl sm:text-5xl font-bold">
                2.0 Ton <br /> <span className="font-semibold">ACs</span>
              </p>
            </div>

            <button
              className="group absolute bottom-0 right-0 rounded-tl-lg py-2 px-3 
  text-white bg-[#E1384F] text-xl overflow-hidden hidden sm:block"
            >
              <span className="relative z-10 underline">Explore now</span> &gt;
              <span
                className="absolute w-24 h-full bg-white/25 
    rotate-45 -left-32 top-0
    transition-all duration-500
    group-hover:left-full"
              />
            </button>
          </div>

          <div className="grid grid-rows-2 gap-4">
            <div className="relative bg-[#e9e5e4] overflow-hidden flex">
              <div className="flex flex-col justify-center items-center w-2/5">
                <div className="rotate-[-90deg]">
                  <p className="text-3xl sm:text-5xl font-semibold whitespace-nowrap">
                    Mid Size <br /> Cabins
                  </p>
                  <p className="text-xl sm:text-3xl whitespace-nowrap">
                    110–150 sq.ft
                  </p>
                </div>
              </div>

              <div className="h-[350px] overflow-hidden relative w-full">
                <img
                  src="../images/brands/lg/bg.jpeg"
                  alt="Mid size cabin"
                  className="flex-1 object-cover h-full w-full"
                />

                <div className="absolute -bottom-20 -left-10 lg:-bottom-16 lg:-left-5 bg-[#E1384F] text-white rounded-full p-10 w-[250px] h-[250px] text-center">
                  <p className="text-lg lg:text-xl">
                    Suitable for <br /> conference rooms
                  </p>
                  <p className="text-2xl lg:text-4xl font-bold">
                    1.5 Ton
                    <br /> ACs
                  </p>
                </div>
              </div>

              <CTABtn />
            </div>

            <div className="relative bg-[#e9e5e4] overflow-hidden flex">
              <div className="flex flex-col justify-center items-center w-2/5">
                <div className="rotate-[-90deg]">
                  <p className="text-3xl sm:text-5xl font-semibold whitespace-nowrap">
                    Small <br /> Cabins
                  </p>
                  <p className="text-xl sm:text-3xl whitespace-nowrap">
                    up to 110 sq.ft
                  </p>
                </div>
              </div>

              <div className="h-[350px] overflow-hidden relative w-full">
                <img
                  src="../images/brands/lg/bg.jpeg"
                  alt="Mid size cabin"
                  className="flex-1 object-cover h-full w-full"
                />

                <div className="absolute -bottom-20 -left-10 lg:-bottom-16 lg:-left-5 bg-[#E1384F] text-white rounded-full p-10 w-[250px] h-[250px] text-center">
                  <p className="text-lg lg:text-xl">
                    Suitable for <br />{" "}
                    <span className="whitespace-nowrap">
                      small meeting room
                    </span>
                  </p>
                  <p className="text-2xl lg:text-4xl font-bold">
                    1.0 Ton <br /> ACs
                  </p>
                </div>
              </div>

              <CTABtn />
            </div>
          </div>
        </div>
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
          <div className="absolute inset-0 bg-[#DE2D4933]/20" />

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
              className="border w-full h-80 flex items-center justify-center p-2 border-[#002F36] overflow-hidden hover:cursor-pointer"
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
    <div className="flex-1 bg-[#F1F1F1] rounded-3xl p-6 flex flex-col">
      {/* Title */}
      <h3 className="text-lg lg:text-xl xl:text-3xl text-black">{title}</h3>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Bottom content */}
      <div className="flex items-start justify-between gap-4 mt-2 lg:mt-4">
        <button className="py-1.5 px-4 text-sm xl:text-base border border-black rounded-full whitespace-nowrap hover:bg-gray-200">
          Learn more
        </button>

        {/* Image wrapper controls size */}
        <div className="flex items-end max-w-[80%]">
          <img
            src={img}
            alt={alt}
            className="w-full max-h-[160px] object-contain"
          />
        </div>
      </div>
    </div>
  );
}

function CTABtn() {
  return (
    <button className="group absolute bottom-0 right-0 rounded-tl-lg py-2 px-3 text-white bg-[#E1384F] text-base overflow-hidden hidden sm:block">
      <span className="underline">Explore now</span> &gt;
      <span
        className="absolute w-24 h-full bg-white/25 
    rotate-45 -left-32 top-0
    transition-all duration-500
    group-hover:left-full"
      />
    </button>
  );
}
