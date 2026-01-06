import { useRef } from "react";
import ReusableSwiper from "./ReusableSwiper";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";

const swiperSettings = {
  slidesPerView: 4,
  grid: { rows: 1, fill: "row" },
  spaceBetween: 30,
  breakpoints: {
    0: { slidesPerView: 2.02, grid: { rows: 1 }, spaceBetween: 10 },
    768: { slidesPerView: 4, grid: { rows: 1 }, spaceBetween: 24 },
    1024: { slidesPerView: 5, grid: { rows: 1 }, spaceBetween: 30 },
  },
};
function SimilarProducts({
  similarProducts,
  Card,
  handleCompareToggle,
  compare,
}) {
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const paginationRef = useRef(null);
  return (
    <div className="my-6 lg:my-10 font-Poppins">
      <div className="flex justify-between items-center">
        <h3 className="text-[#171717] text-sm lg:text-3xl  uppercase mb-3 font-semibold">
          Similar Products
        </h3>
        <div className="flex">
          <button
            ref={prevRef}
            className="text-[#304778] disabled:text-gray-400"
          >
            <MdKeyboardArrowLeft size={30} />
          </button>
          <button
            ref={nextRef}
            className=" text-[#304778] disabled:text-gray-400"
          >
            <MdKeyboardArrowRight size={30} />
          </button>
        </div>
      </div>
      <div className="relative">
        <ReusableSwiper
          products={similarProducts}
          CardComponent={Card}
          // handleAddToCart={handleAddToCart}
          handleCompareToggle={handleCompareToggle}
          compare={compare}
          swiperSettings={swiperSettings}
          prevRef={prevRef}
          nextRef={nextRef}
          paginationRef={paginationRef}
        />
      </div>
    </div>
  );
}

export default SimilarProducts;
