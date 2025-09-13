import { motion } from "framer-motion";
function HeroSection({ title, description, imagePath }) {
  return (
    <section className="bg-[#334a78] ">
      <div className=" flex flex-col gap-6 lg:gap-0 lg:flex-row justify-between items-center mb-10 md:container xl:max-w-7xl xl:px-0 lg:mx-auto text-center lg:text-start pt-10 lg:pt-0">
        <div className="flex flex-1 flex-col gap-8">
          {title && (
            <h2 className="font-TimesNewRoman  italic text-3xl md:text-5xl xl:text-[59px] xl:leading-[53px] tracking-[0.3px] font-bold text-white capitalize">
              {title}
            </h2>
          )}
          {description && (
            <p
              className="font-Georgia text-white mt-4 text-base md:text-2xl lg:text-3xl tracking-[0.3px]"
              dangerouslySetInnerHTML={{ __html: description }}
            >
              {/* {description} */}
            </p>
          )}
        </div>

        <motion.div
          className="flex justify-center xl:py-8 xl:pl-8 flex-1"
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <img
            src={imagePath ? imagePath : "/images/serviceHero.webp"}
            alt="Office Layout"
            className="w-full lg:max-w-xl xl:max-w-2xl"
          />
        </motion.div>
      </div>
    </section>
  );
}

export default HeroSection;
