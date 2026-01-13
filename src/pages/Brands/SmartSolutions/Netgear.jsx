import LandingNavbar from "../../../landing/components/LandingNavbar";
import Footer from "../../../common-components/Footer";
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
function Netgear() {
  return (
    <>
      <LandingNavbar className="relative" />
      <section className="px-4 max-auto lg:container space-y-10">
        <img
          src="/images/brands/SmartSolutions/netgear/hero-section-1.jpg"
          alt="ad-image"
        />
        <img
          src="/images/brands/SmartSolutions/netgear/hero-section-2.jpg"
          alt="ad-image"
        />
      </section>
      <section className="px-4 max-auto lg:container flex items-stretch gap-5 my-10">
        <div className="flex-1">
          <img
            src="/images/brands/SmartSolutions/netgear/s2-1.jpg"
            alt="ad-image"
            className="h-full"
          />
        </div>
        <div className="flex flex-col gap-3 flex-1">
          <img
            src="/images/brands/SmartSolutions/netgear/s2-2.jpg"
            alt="ad-image"
            className="flex-1"
          />
          <img
            src="/images/brands/SmartSolutions/netgear/s2-3.jpg"
            alt="ad-image"
            className="flex-1"
          />
        </div>
      </section>
      <section className="px-4 max-auto lg:container flex items-stretch gap-5">
        <div className="flex-1">
          <img
            src="/images/brands/SmartSolutions/netgear/s3-1.jpg"
            alt="ad-image"
          />
        </div>
        <div className="flex-1">
          <img
            src="/images/brands/SmartSolutions/netgear/s3-2.jpg"
            alt="ad-image"
            className="flex-1"
          />
        </div>
      </section>

      <section className="px-4 max-auto lg:container flex items-stretch gap-5 my-10">
        <div className="flex-1">
          <img
            src="/images/brands/SmartSolutions/netgear/s4-1.jpg"
            alt="ad-image"
            className="h-full"
          />
        </div>
        <div className="flex flex-col gap-3 flex-1">
          <img
            src="/images/brands/SmartSolutions/netgear/s4-2.jpg"
            alt="ad-image"
            className="flex-1"
          />
          <img
            src="/images/brands/SmartSolutions/netgear/s4-3.jpg"
            alt="ad-image"
            className="flex-1"
          />
        </div>
      </section>

      <section className="px-4 max-auto lg:container flex items-stretch gap-5">
        <div className="flex-1">
          <img
            src="/images/brands/SmartSolutions/netgear/s5-1.jpg"
            alt="ad-image"
          />
        </div>
        <div className="flex-1">
          <img
            src="/images/brands/SmartSolutions/netgear/s5-2.jpg"
            alt="ad-image"
            className="flex-1"
          />
        </div>
      </section>

      <section className="px-4 max-auto lg:container my-10">
        <img
          src="/images/brands/SmartSolutions/netgear/netgear.png"
          alt="ad-image"
          className="max-h-96 w-full object-cover"
        />
      </section>

      <section className="px-4 mx-auto lg:container mb-10">
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

export default Netgear;
