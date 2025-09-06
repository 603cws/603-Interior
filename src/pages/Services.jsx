import { useNavigate } from "react-router-dom";
import LandingNavbar from "../common-components/LandingNavbar";
import { useRef, useState } from "react";
import Footer from "../common-components/Footer";
import GetInTouchSection from "../common-components/GetInTouchSection";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { AnimatedButton } from "../common-components/animated-button";
import { motion } from "framer-motion";
const steps = [
  {
    imagePath: "/images/plan.png",
    title: "Plan",
    description: "Understand your space and needs",
  },
  {
    imagePath: "/images/featureicon2.png",
    title: "Select",
    description: "Choose your Layout, Products and needs",
  },
  {
    imagePath: "/images/build.png",
    title: "Build",
    description: "Bring your vision to live",
  },
];

const FeatureCardDetails = [
  {
    imgpath: "/images/featureIcon1.png",
    hoveredImgPath: "/images/featureicon1hover.png",
    title: "Office Layout Planning",
  },
  {
    imgpath: "/images/featureicon2.png",
    hoveredImgPath: "/images/featuricon2hover.png",
    title: "Furniture & Fixtures",
  },
  {
    imgpath: "/images/featureicon3.png",
    hoveredImgPath: "/images/featureicon3hover.png",
    title: "Lighting & Electricals",
  },
  {
    imgpath: "/images/featureicon4.png",
    hoveredImgPath: "/images/featureicon4hover.png",
    title: "HVAC Solutions",
  },
  {
    imgpath: "/images/featureicon5.png",
    hoveredImgPath: "/images/featureicon5hover.png",
    title: "Smart Office Technology",
  },
  {
    imgpath: "/images/featureicon6.png",
    hoveredImgPath: "/images/featureicon6hover.png",
    title: "Decor & Finishing",
  },
];

const InfoCardDetails = [
  {
    title: "Create Your Layout",
    imgpath: "/images/service_2.png",
    description: `Add and remove your Workstations, Meeting rooms, Cabins, and more.`,
  },
  {
    title: "Select Your Product",
    imgpath: "/images/serviceproduct.png",
    description: `Browse and choose from Furniture, Lighting, HVAC, Smart Solution, etc.`,
  },
  {
    title: "Get Your BOQ",
    imgpath: "/images/serviceboq.png",
    description: `Instantly generate and download your bill of quantities.`,
  },
];
function Services() {
  return (
    <div className="">
      <LandingNavbar />
      <OfficeLayoutSection />
      <div className="flex flex-col gap-6 md:gap-0 md:flex-row items-center justify-between  lg:p-16 lg:container xl:max-w-7xl xl:px-0 lg:mx-auto lg:px-12 px-4">
        {InfoCardDetails.map((info) => (
          <InfoCard
            title={info?.title}
            description={info.description}
            imgpath={info.imgpath}
            key={info?.title}
          />
        ))}
      </div>
      <div className="lg:container xl:max-w-7xl xl:px-0 lg:mx-auto lg:px-12 px-4">
        <FeaturesSection />
        <FeatureDesignSection />
        <DeliverServices />
      </div>
      {/* <div className="lg:container lg:mx-auto lg:px-12 px-4">
        <FeaturesSection />
      </div>
      <div className="lg:container lg:mx-auto lg:px-12 px-4">
        <DeliverServices />
      </div>
      <div className="lg:container lg:mx-auto lg:px-12 px-4">
        <FeatureDesignSection />
      </div> */}
      <GetInTouchSection />
      <Footer />
    </div>
  );
}

export default Services;

function OfficeLayoutSection() {
  const navigate = useNavigate();
  return (
    <section className="bg-[#334a78]">
      <div className="flex flex-col gap-6 lg:gap-0 lg:flex-row justify-between items-center mb-10 md:container xl:max-w-7xl xl:px-0 lg:mx-auto text-center lg:text-start">
        {/* Left Section */}
        <div className="flex flex-1 flex-col">
          <h2 className="font-TimesNewRoman italic text-3xl xl:text-[44px] xl:leading-[53px] tracking-[0.3px] font-bold text-white capitalize">
            Design your dream <br /> office-from layout <br /> to final Product
          </h2>
          <p className="font-Georgia text-white mt-4 text-base md:text-2xl tracking-[0.3px]">
            Plan your workspace, add furniture & <br /> essentials, and get your
            BOQ Instantly.
          </p>
          <div className="inline-block">
            <AnimatedButton
              onClick={() => navigate("/Layout")}
              className="!bg-[#3A5D7B] text-white capitalize font-Georgia mt-7 text-lg"
              variant="default"
              size="lg"
              // glow={true}
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
          </div>
          {/* <button
          onClick={() => navigate("/Layout")}
          className=" font-Georgia mt-6 bg-gradient-to-r from-[#75A2BE] to-[#334A78] text-white px-6 py-3 rounded-md hover:scale-105  transition duration-500 ease-in-out"
        >
          Start Your Layout
        </button> */}
        </div>

        {/* Right Section - Image */}
        {/* <div className="flex justify-center">
        <img
          src="/images/serviceHero.webp"
          alt="Office Layout"
          className="w-full  lg:max-w-xl xl:max-w-2xl"
        />
      </div> */}
        <motion.div
          className="flex justify-center xl:py-8 xl:pl-8 flex-1"
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <img
            src="/images/serviceHero.webp"
            alt="Office Layout"
            className="w-full lg:max-w-xl xl:max-w-2xl"
          />
        </motion.div>
      </div>
    </section>
  );
}

function InfoCard({ imgpath, title, description }) {
  return (
    <div className="font-Georgia max-w-sm px-8 space-y-3 flex flex-col justify-center items-center xl:px-0">
      <div className="">
        <img src={imgpath} alt="service" className="w-24 h-24" />
      </div>
      <h2 className="text-[#232323] font-bold  text-lg lg:text-2xl tracking-[0.3px]">
        {title}
      </h2>
      <p className="text-center text-[#777] text-xs lg:text-sm xl:text-base  tracking-[0.3px]">
        {description}
      </p>
    </div>
  );
}

function FeaturesSection() {
  return (
    <div className="lg:py-16 lg:px-5 py-10 xl:px-0">
      <HeadingSection>
        We Provide Everything for <br /> your Office Interior
      </HeadingSection>
      <div className="grid grid-cols-2 lg:grid-cols-3 place-items-center mt-11 gap-3 lg:gap-6">
        {FeatureCardDetails.map((data) => (
          <FeatureCard
            key={data?.title}
            imgpath={data?.imgpath}
            hoveredImgPath={data?.hoveredImgPath}
            title={data?.title}
          />
        ))}
      </div>
    </div>
  );
}

function FeatureCard({ title, imgpath, hoveredImgPath }) {
  const [hovered, sethovered] = useState(false);
  return (
    <div
      onMouseEnter={() => sethovered(true)}
      onMouseLeave={() => sethovered(false)}
      className="group w-full border border-[#ccc] font-Georgia px-4 py-7 xl:py-12 hover:bg-gradient-to-br from-[#334A78] to-[#68B2DC]  hover:text-white"
    >
      <div className="flex flex-col justify-center items-center gap-5">
        <div>
          <img
            src={`${hovered ? hoveredImgPath : imgpath}`}
            alt="feature icon"
            className="w-20 h-20"
          />
        </div>
        <h3 className="text-center font-bold  text-lg lg:text-xl text-[#232323] group-hover:text-white">
          {title}
        </h3>
      </div>
    </div>
  );
}

function DeliverServices() {
  return (
    <div className="lg:px-4 lg:py-16 space-y-4 xl:px-0">
      <HeadingSection>How We Deliver Our Services</HeadingSection>
      <StepsSection />
    </div>
  );
}

function HeadingSection({ children }) {
  return (
    <h2 className="text-center font-Georgia  font-bold text-[#232323] text-xl lg:text-3xl xl:text-[42px] xl:leading-[53px] tracking-[0.3px]">
      {children}
    </h2>
  );
}
//  We Provide Everything for <br /> your Office Interior
function StepsSection() {
  return (
    <section className="bg-white lg:py-12">
      <div className=" relative">
        <div className="flex flex-col md:flex-row justify-between items-center md:space-x-10 space-y-10 md:space-y-0 relative">
          {/* {steps} */}
          {steps?.map((stepdata, index) => (
            <Step
              title={stepdata?.title}
              description={stepdata?.description}
              imagePath={stepdata?.imagePath}
              key={stepdata?.title}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function Step({ imagePath, title, description, index }) {
  return (
    <div className="flex-1 text-center relative font-Georgia">
      <div className="w-32 h-32 rounded-full border border-dashed border-gray-400 bg-white mx-auto flex items-center justify-center relative z-10">
        <img src={imagePath} alt="Plan" className="w-12 h-12" />
      </div>
      <h3 className="mt-6 text-lg font-bold text-gray-800 ">{title}</h3>
      <p className="text-gray-500 mt-2 text-sm lg:text-base">{description}</p>
      {/* Connector Line to Step 2 */}
      {(index === 0 || index === 1) && (
        <div className="hidden md:block absolute top-16 left-1/2 w-full border-t border-dashed border-gray-400 z-0"></div>
      )}
    </div>
  );
}
const featuredDesignImages = [
  {
    img: "/images/FeaturedDesign1.png",
  },
  {
    img: "/images/Featureddesign2.png",
  },
  {
    img: "/images/Featureddesgin3.png",
  },
  {
    img: "/images/featuredDesign4.png",
  },
  {
    img: "/images/featuredDesign5.png",
  },
  {
    img: "/images/featuredDesign6.png",
  },
];
function FeatureDesignSection() {
  const swiperRef = useRef(null);
  return (
    <div className="lg:px-4 lg:py-16 py-6 space-y-10 xl:px-0">
      <HeadingSection>Featured Designs</HeadingSection>
      {/* <div className="flex flex-col md:flex-row items-center gap-6 justify-between ">
        <div>
          <img src="/images/FeaturedDesign1.png" alt="featured design" />
        </div>
      </div> */}
      <div className=" w-full custom-swiper">
        <Swiper
          ref={swiperRef}
          modules={[Autoplay]}
          autoplay={{
            delay: 2000,
          }}
          loop={true}
          slidesPerView={3}
          className="relative pb-10 "
          breakpoints={{
            0: {
              slidesPerView: 1.02,
            },
            768: {
              slidesPerView: 2,
              spaceBetween: 30,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 60,
            },
          }}
        >
          {featuredDesignImages.map((product, index) => (
            <SwiperSlide key={index}>
              <img src={product?.img} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
