import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import ReusableSwiper from "./ReusableSwiper";
import { useRef } from "react";
const productmaylikeSwiperSettings = {
  slidesPerView: 4,
  grid: { rows: 2, fill: "row" },
  spaceBetween: 30,
  breakpoints: {
    0: { slidesPerView: 2.02, grid: { rows: 1 }, spaceBetween: 10 },
    768: { slidesPerView: 4, grid: { rows: 1 }, spaceBetween: 24 },
    1024: { slidesPerView: 5, grid: { rows: 2 }, spaceBetween: 30 },
  },
};
function ProductsMayLike({
  productMayLike,
  handleCompareToggle,
  Card,
  compare,
}) {
  const prevRef2 = useRef(null);
  const nextRef2 = useRef(null);
  const paginationRef2 = useRef(null);
  return (
    <div className=" mb-20 lg:my-10 font-Poppins">
      <div className="flex justify-between items-center">
        <h3 className="text-[#171717] text-sm lg:text-3xl  uppercase mb-3 font-semibold">
          You May also like
        </h3>
        <div className="flex">
          <button
            ref={prevRef2}
            className="text-[#304778] disabled:text-gray-400"
          >
            <MdKeyboardArrowLeft size={30} />
          </button>
          <button
            ref={nextRef2}
            className=" text-[#304778] disabled:text-gray-400"
          >
            <MdKeyboardArrowRight size={30} />
          </button>
        </div>
      </div>
      <div className="relative">
        <ReusableSwiper
          products={productMayLike}
          CardComponent={Card}
          // handleAddToCart={handleAddToCart}
          handleCompareToggle={handleCompareToggle}
          compare={compare}
          swiperSettings={productmaylikeSwiperSettings}
          prevRef={prevRef2}
          nextRef={nextRef2}
          paginationRef={paginationRef2}
        />
      </div>
    </div>
  );
}

export default ProductsMayLike;
