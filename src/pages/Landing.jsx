import React, { useState, useEffect, useRef } from "react";
import LandingNavbar from "../common-components/LandingNavbar";
import { motion, AnimatePresence } from "framer-motion";
import { AnimatedButton } from "../common-components/animated-button";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import Footer from "../common-components/Footer";
import GetInTouchSection from "../common-components/GetInTouchSection";

gsap.registerPlugin(ScrollTrigger);
function Landing() {
  const navigate = useNavigate();
  const heroImages = [
    "/images/home/Hero-image-1.jpg",
    "/images/home/Hero-image-2.jpg",
    "/images/home/Hero-image-3.jpg",
    "/images/home/Hero-image-4.jpg",
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const containerRef = useRef();

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=3000",
          scrub: 1.5,
          pin: true,
          // pin: containerRef.current,
          // pinSpacing: false,
        },
      });

      // 1️⃣ Specialized text goes upward and disappears
      tl.to(".specialized-text", {
        y: -200,
        opacity: 0,
        duration: 2,
        ease: "power2.out",
      });
      // 4️⃣ Interior Design corporate text goes upward & disappears
      tl.to(".interior-text", {
        y: -200,
        opacity: 0,
        duration: 2,
        ease: "power2.out",
      });

      // 5️⃣ And commercial text goes upward & disappears
      tl.to(
        ".commercial-text",
        {
          y: -200,
          opacity: 0,
          duration: 2,
          ease: "power2.out",
        },
        "<"
      );

      // 2️⃣ Right top table comes left rotating
      tl.fromTo(
        ".round-table",
        { right: "0%", rotate: 0, opacity: 1 },
        { left: "0%", rotate: -360, opacity: 1, duration: 5 }
        // start at same time
      );

      // 3️⃣ Middle table goes bottom left corner
      tl.fromTo(
        ".rotating-table",
        { left: "0%", top: "40%", rotate: 0, opacity: 1 },
        { left: "0%", top: "70%", rotate: -90, opacity: 1, duration: 2 },
        "<"
      );

      // 6️⃣ Bottom right table moves to middle bottom
      tl.fromTo(
        ".down-table",
        { right: "0%", opacity: 1 },
        { right: "25%", opacity: 1, duration: 2 }
      );

      // 7️⃣ Show top middle table (upper-table.png)
      tl.fromTo(
        ".upper-table",
        { y: -200, opacity: 0 },
        { y: 0, opacity: 1, duration: 1 }
      );

      // 8️⃣ Show side circles
      tl.fromTo(
        ".circle",
        { scale: 0 },
        { scale: 1, stagger: 0.2, duration: 1, ease: "back.out(1.7)" }
      );

      // 9️⃣ Show right middle table
      tl.fromTo(
        ".side-table",
        { right: "-100%", opacity: 0 },
        { right: "0%", opacity: 1, duration: 2 }
      );

      // 🔟 Finally show center text
      tl.fromTo(
        ".center-text",
        { opacity: 0, y: 100 },
        { opacity: 1, y: 0, duration: 1 }
      );
    }, containerRef);

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      ctx.revert();
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [heroImages.length]);

  const featuredProjects = [
    {
      img: "project-1.webp",
      title: "marathon futurex",
      location: "lower parel",
    },
    {
      img: "project-2.png",
      title: "trade link",
      location: "lower parel",
    },
    {
      img: "project-3.png",
      title: "lawyer's chember",
      location: "fort",
    },
    {
      img: "project-4.png",
      title: "trade world",
      location: "lower parel",
    },
  ];

  const testimonials = [
    {
      id: 1,
      text: " Workved Interiors transformed our office into a space that perfectly blends functionality with modern aesthetics. Their team understood our requirements and executed the project seamlessly, ensuring a workspace that enhances productivity and employee well-being. The attention to detail and quality craftsmanship truly set them apart!",
      name: "Hussain Patel",
      role: "Director, Tripjack",
      image: "images/tripjack-logo.png",
    },
    {
      id: 2,
      text: "Workved Interiors has played a key role in shaping our coworking spaces into inspiring and productive environments. Their ability to design offices that are both stylish and highly functional  has been a game-changer for our members. Their expertise, professionalism, and commitment to delivering excellence make them a trusted partner in workspace design.",
      name: "Kunal Kataria",
      role: "Founder, 603 CWS",
      image: "logo/logo.png",
    },
    {
      id: 3,
      text: `The team at Workved Interiors understood our brand vision and
                delivered an office space that enhances collaboration,
                creativity, and efficiency. They were meticulous in their
                planning and execution, ensuring that every element from layout
                to furnishings was aligned with our needs. Working with them was
                a smooth and rewarding experience!`,
      name: "Aditya Gupta",
      role: "CEO, Credilio",
      image: "images/credilio-svg-logo.svg",
    },
  ];

  function TitleHeader({ title }) {
    return (
      <>
        <div className="flex justify-center items-center gap-2">
          <span className="w-8 h-px bg-[#374A75] "></span>
          <h4 className="uppercase text-[#374A75] font-bold text-[13px] tracking-wide font-Georgia">
            {title}
          </h4>
          <span className="w-8 h-px bg-[#374A75] "></span>
        </div>
      </>
    );
  }

  return (
    <>
      {/* hero section */}
      <section className="h-screen flex flex-col">
        <LandingNavbar />
        <div className="flex-1 flex items-center relative ">
          <div className="absolute inset-0">
            {heroImages.map((src, index) => (
              <motion.div
                key={index}
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${src})` }}
                initial={{ opacity: 0 }}
                animate={{ opacity: currentImageIndex === index ? 1 : 0 }}
                transition={{ duration: 2 }}
              />
            ))}
            <div className="absolute inset-0 bg-gradient-to-r from-[#304778]/70 to-[#FFFFFF]/0" />
          </div>
          <div className="px-4 mx-auto lg:container">
            <motion.div
              initial={{ x: "-50%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 2, ease: "easeOut" }}
              className="relative"
            >
              <h1 className="text-[#fff] text-5xl md:text-7xl xl:text-8xl font-bold italic capitalize font-TimesNewRoman">
                Transform your <br /> office space with
                <br />
                <span className="text-[#FFC900]"> smart planning</span>
              </h1>
              <button onClick={() => navigate("/layout")}>
                <AnimatedButton
                  className="!bg-[#3A5D7B] text-white capitalize font-Georgia mt-7 text-lg"
                  variant="default"
                  size="lg"
                  // glow={true}
                  textEffect="shimmer"
                  rounded="custom"
                  asChild={false}
                  hideAnimations={false}
                  shimmerColor="#fff"
                  shimmerSize="0.15em"
                  shimmerDuration="3s"
                  borderRadius="10px"
                  background="rgba(48, 71, 120, 1)"
                >
                  make your space
                </AnimatedButton>
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* section 2 */}
      <section className="hidden lg:block overflow-hidden py-14">
        <div
          ref={containerRef}
          className="relative max-w-4xl xl:max-w-screen-lg 2xl:max-w-screen-xl mx-auto h-screen font-TimesNewRoman italic overflow-hidden"
        >
          {/* Specialized text */}
          <h1 className="absolute top-[15%] text-5xl 2xl:text-7xl specialized-text">
            Specialized
          </h1>

          {/* Round table */}
          <img
            src="/images/home/round-table.png"
            className="absolute top-10 right-0 w-44 2xl:h-52 h-44 2xl:w-52 round-table"
          />

          {/* Rotating table */}
          <img
            src="/images/home/rotating-table.png"
            className="absolute top-[50%] w-44 2xl:h-52 h-44 2xl:w-52 rotating-table"
          />

          {/* Top middle table */}
          <img
            src="/images/home/upper-table.png"
            className="absolute top-0 left-1/2 -translate-x-1/2 upper-table max-w-60 2xl:max-w-xs"
          />

          {/* Circles */}
          <img
            src="/images/home/circle.png"
            className="absolute right-10 top-10 circle h-14 2xl:h-20 w-14 2xl:w-20"
          />
          <img
            src="/images/home/circle.png"
            className="absolute right-10 bottom-10 circle  h-14 2xl:h-20 w-14 2xl:w-20"
          />

          {/* Interior text */}
          <h1 className="absolute top-[40%] right-0 text-5xl 2xl:text-7xl interior-text">
            in Interior Design
            <br /> corporate
          </h1>

          {/* Commercial text */}
          <h1 className="absolute bottom-[10%]  text-5xl 2xl:text-7xl  commercial-text">
            and commercial
          </h1>

          {/* Down table */}
          <img
            src="/images/home/down-table.png"
            className="absolute bottom-0 max-w-sm 2xl:max-w-lg down-table "
          />

          {/* Side middle table */}
          <img
            src="/images/home/table.png"
            className="absolute top-1/4 max-w-sm object-contain h-96 side-table"
          />

          {/* Center final text */}
          <p className="absolute inset-0 flex items-center justify-center text-3xl text-center center-text">
            We create spaces tailored to you. <br /> We make every space a
            transformative experience.
          </p>
        </div>
      </section>

      {/* section 3 */}
      <section>
        <div className="px-4 lg:container mx-auto py-10">
          <div className="flex flex-col items-center space-y-4">
            <TitleHeader title={"service"} />
            <h3 className="capitalize font-Georgia font-bold italic text-[42px] text-center tracking-wide">
              transform your office
              <br /> interior design
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 justify-between justify-items-stretch my-10">
            <div className="relative group  w-full h-[450px] bg-[url('images/home/corporateoffice.webp')] bg-cover bg-center bg-no-repeat overflow-hidden rounded-lg">
              <div className="absolute inset-0 bg-black/50 flex items-end p-5 translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-in-out">
                <h3 className="text-[#fff] font-Georgia text-5xl italic text-center tracking-wide capitalize">
                  Corporate office
                </h3>
              </div>
            </div>

            <div className="relative group  w-full h-[450px] bg-[url('images/home/tech.jpg')] bg-cover bg-center bg-no-repeat overflow-hidden rounded-lg">
              <div className="absolute inset-0 bg-black/50 flex items-end p-5 translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-in-out">
                <h3 className="text-[#fff] font-Georgia text-5xl italic text-center tracking-wide capitalize">
                  tech startup office
                </h3>
              </div>
            </div>

            <div className="relative group w-full h-[450px] bg-[url('images/home/modern.jpg')] bg-cover bg-center bg-no-repeat overflow-hidden rounded-lg">
              <div className="absolute inset-0 bg-black/50 flex items-end p-5 translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-in-out">
                <h3 className="text-[#fff] font-Georgia text-5xl italic text-center tracking-wide capitalize">
                  modern co-working space
                </h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* section 4 */}
      <section>
        <div className="px-4 lg:container py-10">
          <h3 className="font-Georgia font-bold italic text-[42px] text-center tracking-wide">
            Trusted by Industry Leaders
          </h3>
          <div className="">
            <Swiper
              spaceBetween={20}
              loop={true}
              autoplay={{
                delay: 3500,
                disableOnInteraction: false,
              }}
              breakpoints={{
                0: {
                  slidesPerView: 1,
                  enabled: true,
                },
                768: {
                  slidesPerView: 2,
                  enabled: true,
                },
                1024: {
                  slidesPerView: 2.5,
                  enabled: true,
                },
                1280: {
                  slidesPerView: 3,
                  enabled: false,
                },
              }}
              modules={[Autoplay]}
              className="my-10"
            >
              {testimonials.map((t, idx) => (
                <SwiperSlide key={idx} className="h-auto flex">
                  <div className="bg-[#F9FAFB] rounded-2xl p-6 flex flex-col items-stretch font-Georgia">
                    <div className="flex items-stretch gap-4 mb-4">
                      <img
                        src={t.image}
                        alt={t.name}
                        className="w-12 h-12 rounded-full object-contain"
                      />
                      <div>
                        <h3 className="font-bold text-[#111827]">{t.name}</h3>
                        <p className="text-sm text-[#4B5563]">{t.role}</p>
                      </div>
                    </div>
                    <p className="text-[#374151] leading-relaxed mt-4">
                      "{t.text}"
                    </p>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </section>

      {/* section 5 */}
      <section>
        <div className="px-4 sm:px-0 w-full 3xl:container py-10">
          <div className="flex flex-col items-center space-y-4">
            <TitleHeader title={"our best projects"} />
            <h3 className="capitalize font-Georgia font-bold italic text-[42px] text-center tracking-wide">
              our featured projects
            </h3>
          </div>

          <Swiper
            spaceBetween={20}
            loop={true}
            autoplay={{
              disableOnInteraction: false,
            }}
            breakpoints={{
              768: { slidesPerView: 2.2 },
              1024: { slidesPerView: 3 },
              1440: { slidesPerView: 3.5 },
            }}
            modules={[Autoplay, Pagination, Navigation]}
            className="my-10"
          >
            {featuredProjects.map((project, idx) => (
              <SwiperSlide key={idx} className="h-[450px]">
                <div
                  className="relative group w-full h-full bg-cover bg-center bg-no-repeat overflow-hidden rounded-lg"
                  style={{ backgroundImage: `url(images/home/${project.img})` }}
                >
                  <div className="absolute inset-0 bg-black/50 flex items-end p-5 translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-in-out" />
                  <h3 className="absolute right-0 translate-x-full group-hover:translate-x-0 bottom-5 text-white font-Georgia text-2xl text-right capitalize px-2 transition-transform duration-700 ease-in-out">
                    {project.title}
                    <br />
                    {project.location}
                  </h3>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* get in touch */}
      <section>
        <GetInTouchSection />
      </section>

      <footer>
        <Footer />
      </footer>
    </>
  );
}

export default Landing;
