import { Swiper, SwiperSlide } from "swiper/react";
import { Grid, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/grid";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "../../styles/products.css";

const ReusableSwiper = ({
  products = [],
  CardComponent,
  swiperSettings = {},
  prevRef,
  nextRef,
  paginationRef,
  handleAddToCart,
  handleCompareToggle,
  compare,
}) => {
  return (
    <Swiper
      onSwiper={(swiper) => {
        setTimeout(() => {
          if (
            swiper &&
            swiper.params &&
            swiper.params.navigation &&
            prevRef?.current &&
            nextRef?.current
          ) {
            swiper.params.navigation.prevEl = prevRef.current;
            swiper.params.navigation.nextEl = nextRef.current;
            swiper.navigation?.init();
            swiper.navigation?.update();
          }

          if (paginationRef?.current) {
            swiper.params.pagination.el = paginationRef.current;
            swiper.pagination?.init();
            swiper.pagination?.update();
          }
        }, 0);
      }}
      modules={[Grid, Navigation, Pagination]}
      {...swiperSettings}
      className="relative pb-10"
    >
      {products.map((product, index) => (
        <SwiperSlide key={index}>
          {handleAddToCart ? (
            <CardComponent
              product={product}
              handleAddToCart={handleAddToCart}
            />
          ) : (
            <CardComponent
              product={product}
              handleCompareToggle={handleCompareToggle}
              compare={compare}
            />
          )}
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default ReusableSwiper;
