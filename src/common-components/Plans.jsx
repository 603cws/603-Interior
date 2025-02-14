import { motion } from "motion/react";
function Plans() {
  return (
    <div className="container mx-auto my-5 ">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 capitalize">
        {/* each plan card */}
        <div className="max-w-sm relative font-Poppins  bg-black bg-opacity-85 overflow-hidden group">
          <img src="/images/plan1.png" alt="plan" />
          <h2 className="absolute  z-10 bottom-1/4  font-medium text-xl text-[#fff] -rotate-90 group-hover:hidden">
            custom
          </h2>
          {/* Animated Text Overlay */}
          {/* <motion.div
            initial={{ y: "0%" }}
            whileHover={{ y: "100%" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="absolute top-0 left-0 w-full bg-black bg-opacity-70 text-white p-4 text-center h-full"
          >
            <p className="text-sm">This is an animated overlay on hover.</p>
          </motion.div> */}
          {/* Animated Text Overlay */}
          <div className="absolute top-full left-0 w-full h-full bg-black bg-opacity-70 text-white p-4 text-center transition-all duration-500 ease-out group-hover:top-0 flex flex-col justify-center items-center">
            <h3 className=" mb-3 font-bold text-3xl">Custom</h3>
            <ul className="font-medium  text-sm list-disc list-inside space-y-2 ">
              <li className="flex justify-center items-center gap-3">
                <img src="/images/Check_ring.png" alt="" />
                The brand proposes their budget
              </li>
              <li className="flex justify-center items-center gap-3">
                <img src="/images/Check_ring.png" alt="" />
                The brand proposes their budget
              </li>
              <li className="flex justify-center items-center gap-3">
                <img src="/images/Check_ring.png" alt="" />
                The brand proposes their budget
              </li>
              <li className="flex justify-center items-center gap-3">
                <img src="/images/Check_ring.png" alt="" />
                The brand proposes their budget
              </li>
            </ul>

            <div className=" w-full flex justify-end items-end  px-3 mt-10">
              <button className="">
                <img src="/images/blogicon.svg" alt="" />
              </button>
            </div>
          </div>
        </div>
        {/* each plan card */}
        <div className="max-w-sm relative font-Poppins  bg-black bg-opacity-90 group overflow-hidden">
          <img src="/images/plan1.png" alt="plan" className="" />
          <h2 className="absolute z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-medium text-xl text-[#fff] group-hover:hidden">
            Minimal
          </h2>
          <div className="absolute top-full left-0 w-full h-full bg-black bg-opacity-70 text-white p-4 text-center transition-all duration-500 ease-out group-hover:top-0 flex flex-col justify-center items-center">
            <h3 className=" mb-3 font-bold text-3xl">Minimal</h3>
            <ul className="font-medium  text-sm list-disc list-inside space-y-2 ">
              <li className="flex justify-center items-center gap-3">
                <img src="/images/Check_ring.png" alt="" />
                The brand proposes their budget
              </li>
              <li className="flex justify-center items-center gap-3">
                <img src="/images/Check_ring.png" alt="" />
                The brand proposes their budget
              </li>
              <li className="flex justify-center items-center gap-3">
                <img src="/images/Check_ring.png" alt="" />
                The brand proposes their budget
              </li>
              <li className="flex justify-center items-center gap-3">
                <img src="/images/Check_ring.png" alt="" />
                The brand proposes their budget
              </li>
            </ul>

            <div className=" w-full flex justify-end items-end  px-3 mt-10">
              <button className="">
                <img src="/images/blogicon.svg" alt="" />
              </button>
            </div>
          </div>
        </div>
        {/* each plan card */}
        <div className="max-w-sm relative font-Poppins group overflow-hidden">
          <img src="/images/plan1.png" alt="plan" />
          <h2 className="absolute z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-medium text-xl text-[#fff] group-hover:hidden">
            Executive
          </h2>
          <div className="absolute top-full left-0 w-full h-full bg-black bg-opacity-70 text-white p-4 text-center transition-all duration-500 ease-out group-hover:top-0 flex flex-col justify-center items-center">
            <h3 className=" mb-3 font-bold text-3xl">Executive</h3>
            <ul className="font-medium  text-sm list-disc list-inside space-y-2 ">
              <li className="flex justify-center items-center gap-3">
                <img src="/images/Check_ring.png" alt="" />
                The brand proposes their budget
              </li>
              <li className="flex justify-center items-center gap-3">
                <img src="/images/Check_ring.png" alt="" />
                The brand proposes their budget
              </li>
              <li className="flex justify-center items-center gap-3">
                <img src="/images/Check_ring.png" alt="" />
                The brand proposes their budget
              </li>
              <li className="flex justify-center items-center gap-3">
                <img src="/images/Check_ring.png" alt="" />
                The brand proposes their budget
              </li>
            </ul>

            <div className=" w-full flex justify-end items-end  px-3 mt-10">
              <button className="">
                <img src="/images/blogicon.svg" alt="" />
              </button>
            </div>
          </div>
        </div>
        {/* each plan card */}
        <div className="max-w-sm relative font-Poppins group overflow-hidden">
          <img src="/images/plan1.png" alt="plan" />
          <h2 className="absolute z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-medium text-xl text-[#fff] group-hover:hidden">
            Luxury
          </h2>
          <div className="absolute top-full left-0 w-full h-full bg-black bg-opacity-70 text-white p-4 text-center transition-all duration-500 ease-out group-hover:top-0 flex flex-col justify-center items-center">
            <h3 className=" mb-3 font-bold text-3xl">Luxury</h3>
            <ul className="font-medium  text-sm list-disc list-inside space-y-2 ">
              <li className="flex justify-center items-center gap-3">
                <img src="/images/Check_ring.png" alt="" />
                The brand proposes their budget
              </li>
              <li className="flex justify-center items-center gap-3">
                <img src="/images/Check_ring.png" alt="" />
                The brand proposes their budget
              </li>
              <li className="flex justify-center items-center gap-3">
                <img src="/images/Check_ring.png" alt="" />
                The brand proposes their budget
              </li>
              <li className="flex justify-center items-center gap-3">
                <img src="/images/Check_ring.png" alt="" />
                The brand proposes their budget
              </li>
            </ul>

            <div className=" w-full flex justify-end items-end  px-3 mt-10">
              <button className="">
                <img src="/images/blogicon.svg" alt="" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Plans;
