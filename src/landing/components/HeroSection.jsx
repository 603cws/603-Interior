import { motion } from "framer-motion";
import { AnimatedButton } from "../../common-components/AnimatedButton";
import { useNavigate } from "react-router-dom";
function HeroSection({ title, description, imagePath, showBtn = true }) {
  const navigate = useNavigate();
  return (
    <section className="pt-10 xl:pt-0 bg-[#334a78]">
      <div className="md:container px-4 flex flex-col gap-6 lg:gap-0 lg:flex-row justify-between items-center xl:max-w-7xl xl:px-0">
        <div className="text-[#304778] flex flex-col justify-center items-center lg:items-start text-center lg:text-start gap-5 flex-1">
          {title && (
            <h2 className="font-TimesNewRoman italic text-3xl xl:text-[44px] xl:leading-[53px] tracking-[0.3px] font-bold text-white capitalize whitespace-pre-line">
              {title}
            </h2>
          )}
          {description && (
            <p
              className="text-base md:text-2xl text-white  font-Georgia tracking-wide whitespace-pre-line"
              dangerouslySetInnerHTML={{ __html: description }}
            ></p>
          )}
          {showBtn && (
            <AnimatedButton
              onClick={() => navigate("/Layout")}
              className="!bg-[#3A5D7B] text-white capitalize font-Georgia mt-7 text-lg"
              variant="default"
              size="lg"
              textEffect="shimmer"
              rounded="custom"
              asChild={false}
              hideAnimations={false}
              shimmerColor="#fff"
              shimmerSize="0.1em"
              shimmerDuration="3s"
              borderRadius="6px"
              background="rgba(48, 71, 120, 1)"
              hovereBackground="linear-gradient(90deg,rgba(85,132,182,1)  0%,  rgba(117,162,190,1) 100%)"
            >
              Start Your Layout
            </AnimatedButton>
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
            className="xl:py-10 xl:pl-10 flex-1"
          />
        </motion.div>
      </div>
    </section>
  );
}

export default HeroSection;
