import { motion, AnimatePresence } from "framer-motion";
import { PiStarFourFill } from "react-icons/pi";
import { FaStar } from "react-icons/fa";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RiVipCrown2Fill } from "react-icons/ri";

const animations = {
  fadeInLeft: {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.0, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      x: 50,
      transition: { duration: 0.3, ease: "easeInOut" },
    },
  },
};

// Generate Supabase public image URL
const getImageUrl = (path) =>
  path
    ? `https://bwxzfwsoxwtzhjbzbdzs.supabase.co/storage/v1/object/public/addon//${path}`
    : "/fallback.jpg";

export default function YouMayAlsoLike({
  products,
  onSelectProduct,
  onViewProduct,
  setSelectedProductView,
}) {
  const navigate = useNavigate();
  const [loadingImages, setLoadingImages] = useState({});

  const handleImageLoad = (id) => {
    setLoadingImages((prev) => ({ ...prev, [id]: false }));
  };

  // Filter valid variants
  const variants = products
    .flatMap((p) => p.product_variants || [])
    .filter((v) => v.status !== "pending" && v.image && v.title);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 3xl:grid-cols-6 gap-6 pt-3">
      {variants.length > 0 ? (
        <AnimatePresence>
          {variants.map((variant) => (
            <motion.div
              key={variant.id}
              className="max-w-sm flex flex-col justify-center items-center bg-white shadow-md cursor-pointer my-2 px-3 group
                hover:rounded-lg-21 hover:bg-custom-gradient hover:shadow-custom transition-all duration-300 border-2 border-[#F5F5F5] relative"
              variants={animations.fadeInLeft}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {variant.segment && (
                <div
                  title={`${variant.segment} segment`}
                  className="absolute top-0 left-0 font-bold font-Poppins text-sm w-7 h-7 text-white z-10 flex justify-center items-center gap-2  rounded-br-md bg-gradient-to-l from-[#75A2BE] to-[#5584B6]"
                >
                  {variant.segment === "Exclusive" && (
                    <div className="relative pr-2">
                      <PiStarFourFill
                        className="absolute bottom-2 right-1"
                        size={8}
                        color="#FFE473"
                      />
                      <PiStarFourFill color="#FFE473" />
                    </div>
                  )}

                  {variant.segment === "Luxury" && (
                    <RiVipCrown2Fill color="#FFE473" />
                  )}

                  {variant.segment === "Minimal" && <FaStar color="#FFE473" />}
                </div>
              )}

              {/* Image */}
              <div className="w-full aspect-[4/3] rounded-t-lg relative">
                {loadingImages[variant.id] !== false && (
                  <div className="absolute inset-0 bg-gray-200 rounded-t-lg"></div>
                )}
                <img
                  className={`rounded-t-lg w-full h-36 md:h-64 object-contain transition-opacity duration-300 mt-5 md:mt-0 ${
                    loadingImages[variant.id] !== false
                      ? "opacity-0"
                      : "opacity-100"
                  }`}
                  src={getImageUrl(variant.image)}
                  alt={variant.title}
                  onLoad={() => handleImageLoad(variant.id)}
                  onClick={() => {
                    onViewProduct?.(variant);
                    setSelectedProductView({});
                    navigate(`/boq/${variant.id}`);
                  }}
                />
              </div>

              {/* Product Name & Price */}
              <div className="px-1 py-3 text-start w-full">
                <p
                  className="text-sm font-medium text-gray-800 capitalize"
                  onClick={() => {
                    onViewProduct?.(variant);
                    setSelectedProductView({});
                    navigate(`/boq/${variant.id}`);
                  }}
                >
                  <span className="group-hover:text-[#347ABF]">
                    {variant.title.toLowerCase()}
                  </span>
                  <br />
                  <span>₹ {variant.price}</span>
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      ) : (
        <p className="col-span-full text-center text-gray-500">
          No related products found.
        </p>
      )}
    </div>
  );
}
