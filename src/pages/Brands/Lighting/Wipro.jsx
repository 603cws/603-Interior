import { useNavigate } from "react-router-dom";
import Footer from "../../../common-components/Footer";
import LandingNavbar from "../../../landing/components/LandingNavbar";

const featureBanners = [
  "/images/brands/Lighting/wipro/s2-1.jpg",
  "/images/brands/Lighting/wipro/s2-2.jpg",
  "/images/brands/Lighting/wipro/s2-3.jpg",
  "/images/brands/Lighting/wipro/s2-4.jpg",
];
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
function Wipro() {
  const navigate = useNavigate();
  return (
    <>
      <LandingNavbar className="relative" />
      <section className="px-4 max-auto lg:container space-y-5">
        <img src="/images/brands/Lighting/wipro/s1-1.jpg" alt="banner-image" />
        <img src="/images/brands/Lighting/wipro/s1-2.jpg" alt="banner-image" />
        <img src="/images/brands/Lighting/wipro/s1-3.png" alt="banner-image" />
        <img src="/images/brands/Lighting/wipro/s1-4.jpg" alt="banner-image" />
      </section>
      <section className="px-4 max-auto lg:container my-10">
        <div className="grid grid-cols-2 gap-5">
          {featureBanners.map((banner, index) => (
            <img src={banner} alt="banner-image" key={index} />
          ))}
        </div>
      </section>

      <section className="px-4 max-auto lg:container space-y-5">
        <img src="/images/brands/Lighting/wipro/s3-1.jpg" alt="banner-image" />
        <img src="/images/brands/Lighting/wipro/s3-2.jpg" alt="banner-image" />
      </section>

      <section className="px-4 max-auto lg:container my-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr] gap-3">
          <div className="font-segoe bg-[#D9ECF8] flex flex-col h-full">
            <img
              src="/images/brands/Lighting/wipro/s4-1.png"
              alt="product-image"
              className="lg:max-w-md place-self-end"
            />
            <div className="text-[#000000] mt-auto p-5">
              <h3 className="font-bold text-3xl capitalize ">
                modern workspaces
              </h3>
              <p className="text-lg">
                Balanced and Uniform lighting distribution.
              </p>
            </div>
          </div>
          <div className="font-segoe bg-[#F8F5D9] flex flex-col h-full">
            <img
              src="/images/brands/Lighting/wipro/s4-2.png"
              alt="product-image"
              className="lg:max-w-sm place-self-end"
            />
            <div className="text-[#000000] mt-auto p-5">
              <h3 className="font-bold text-3xl capitalize ">
                modern workspaces
              </h3>
              <p className="text-lg mt-auto">
                Balanced and Uniform lighting distribution.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 max-auto lg:container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1fr_1.5fr] gap-3">
          <div className="font-segoe flex flex-col h-full bg-[url('/images/brands/Lighting/wipro/s5-1.jpg')]">
            <div className="text-[#000000] mt-auto p-5">
              <h3 className="font-bold text-3xl capitalize ">
                modern workspaces
              </h3>
              <p className="text-lg">
                Balanced and Uniform lighting distribution.
              </p>
            </div>
          </div>
          <div className="font-segoe bg-[#E3D5FF] md:flex h-full overflow-hidden">
            <div className="text-[#000000] mt-auto p-5">
              <h3 className="font-bold text-3xl capitalize w-fit ">
                modern workspaces
              </h3>
              <p className="text-lg w-fit">
                Balanced and Uniform lighting distribution.
              </p>
            </div>
            <img
              src="/images/brands/Lighting/wipro/s5-2.png"
              alt="product-image"
              className="lg:max-w-sm place-self-end"
            />
          </div>
        </div>
      </section>

      <section className="px-4 max-auto lg:container my-10">
        <img src="/images/brands/Lighting/wipro/s6-1.jpg" alt="banner-image" />
      </section>

      <section className="px-4 mx-auto lg:container mb-5">
        <div className="grid grid-cols-2 md:grid-cols-4 justify-items-center gap-3 md:gap-7">
          {ourProducts.map((product, index) => (
            <div
              key={index}
              onClick={() => navigate("/shop?query=lighting")}
              className="p-2 bg-[#fff] flex justify-center hover:cursor-pointer items-center shadow-[0px_0px_20px_rgba(0,0,0,0.1)] w-full"
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

export default Wipro;
