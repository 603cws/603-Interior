import { motion } from "framer-motion";
export const animations = {
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

function ProductSkeleton() {
  return Array.from({ length: 4 }).map((_, index) => (
    <motion.div
      key={index}
      className="flex flex-col justify-center items-center bg-white rounded-lg shadow-md my-2 px-3"
      variants={animations.fadeInLeft}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="w-full aspect-[4/3] bg-gray-200 rounded-t-lg"></div>
      <div className="p-4 w-full">
        <div className="h-4 bg-gray-300  w-3/4 mb-2 rounded"></div>
        <div className="h-4 bg-gray-300  w-1/2 rounded"></div>
      </div>
    </motion.div>
  ));
}

export default ProductSkeleton;
