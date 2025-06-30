import { useState, useRef, useEffect } from "react";
import LandingNavbar from "../common-components/LandingNavbar";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";
import {
  EffectCoverflow,
  Pagination,
  Navigation,
  Autoplay,
} from "swiper/modules";
import "../styles/Landing.css";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { useNavigate } from "react-router-dom";
import Footer from "../common-components/Footer";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import beforeImage from "/images/home/before-img-one.jpg";
import afterImage from "/images/home/after-img-one.jpg";
import { FaRegUser } from "react-icons/fa";
import { FiMessageSquare } from "react-icons/fi";
import { ReadMoreBtn } from "../common-components/ReadMoreBtn";
import { useApp } from "../Context/Context";
import gsap from "gsap";
import { motion, useAnimation, useInView } from "framer-motion";

function Landing() {
  const imageContainerRef = useRef(null);
  const [sliderPos, setSliderPos] = useState(50);
  const [activeTab, setActiveTab] = useState("designing");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const {
    isAuthenticated,
    setTotalArea,
    setCurrentLayoutID,
    setCurrentLayoutData,
  } = useApp();
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, threshold: 0.2 });
  const controls = useAnimation();
  const featuredRef = useRef(null);
  const featuredInView = useInView(featuredRef, {
    once: false,
    threshold: 0.2,
  });
  const controlsFeatured = useAnimation();
  const strategyRef = useRef(null);
  const strategyInView = useInView(strategyRef, { once: true, threshold: 0.2 });
  const controlsStrategy = useAnimation();

  useEffect(() => {
    if (inView) {
      controls.start("show");
    }
  }, [inView, controls]);
  useEffect(() => {
    if (featuredInView) {
      controlsFeatured.start("show");
    }
  }, [featuredInView, controlsFeatured]);
  useEffect(() => {
    if (strategyInView) {
      controlsStrategy.start("show");
    }
  }, [strategyInView, controlsStrategy]);

  const tabData = [
    {
      key: "designing",
      title: "Designing",
      img: "/images/home/section_1_design.png",
      text: "We are committed to the impeccable craftsmanship and luxury is reflected in all we do. We offer span furniture and many accessories.",
      points: [
        "Quality and designs checks deeply",
        "Periodic site review and timelines",
        "Design development and strategy",
      ],
    },
    {
      key: "approved",
      title: "Approved",
      img: "/images/home/section_1_main.png",
      text: "Approved tab content description.",
      points: [
        "Approved: Quality and inspection passed",
        "Reviewed and signed off by architect",
        "Timeline baseline locked in",
      ],
    },
    {
      key: "guaranteed",
      title: "Guaranteed",
      img: "/images/home/section_1_design.png",
      text: "Guaranteed tab content description.",
      points: [
        "Backed by service guarantee",
        "Compliance ensured with standards",
        "Final walkthrough and approvals",
      ],
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
  const containerVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.5,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const featuredProjects = [
    "/images/home/featured-project-1.png",
    "/images/home/featured-project-2.png",
    "/images/home/featured-project-3.png",
    "/images/home/featured-project-4.png",
  ];
  const imageVariants = {
    hidden: { opacity: 0, x: 100 },
    show: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };
  const strategyAnimation = {
    hidden: { opacity: 0, x: -100 },
    show: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.7, ease: "easeOut" },
    },
  };
  const latestArticles = [
    {
      image: "/images/recent-article1.png",
      title:
        "The Future of Office Design: Trends That Will Shape Workspaces in 2025",
      date: 5,
      month: "jun",
      name: "jon deo",
      comments: 0,
      shortdescription: "Door Windows, Home Land",
      description:
        "A small newly opened interior design business that aims to  cover different issues, from sustainability to social, from equal opportunities to education, from giving space",
    },
    {
      image: "/images/recent-article2.png",
      title:
        "The Future of Office Design: Trends That Will Shape Workspaces in 2025",
      date: 15,
      month: "may",
      name: "jon deo",
      comments: 0,
      shortdescription: "Door Windows, Home Land",
      description:
        "A small newly opened interior design business that aims to  cover different issues, from sustainability to social, from equal opportunities to education, from giving space",
    },
    {
      image: "/images/recent-article3.png",
      title:
        "The Future of Office Design: Trends That Will Shape Workspaces in 2025",
      date: 23,
      month: "may",
      name: "jon deo",
      comments: 0,
      shortdescription: "Door Windows, Home Land",
      description:
        "A small newly opened interior design business that aims to  cover different issues, from sustainability to social, from equal opportunities to education, from giving space",
    },
  ];

  const featureCards = [
    {
      icon: "images/icons/architecture-icon.svg",
      hovericon: "images/icons/architecture-icon-white.svg",
      title: "architecture",
      description:
        "We develop the full cycle of project documentation & full details. Our clients satisfaction",
    },
    {
      icon: "images/icons/interior-blue.svg",
      hovericon: "images/icons/interior.svg",
      title: "Interior Work",
      description:
        "We will take care of the interior designs, build & management of all kind of living projects",
    },
    {
      icon: "images/icons/retail.svg",
      hovericon: "images/icons/retail-white.svg",
      title: "Retail Designs",
      description:
        "We can help you with the retail interior design and third party management to create best",
    },
    {
      icon: "images/icons/2d-3d_layout.svg",
      hovericon: "images/icons/2d-3d_layout-white.svg",
      title: "2D/3D Layouts",
      description:
        "We offer professional online 2D and 3D interior designing which will help you visualize",
    },
  ];

  const handleImageDrag = (e) => {
    const bounds = imageContainerRef.current.getBoundingClientRect();
    const x = e.clientX || e.touches?.[0]?.clientX;
    if (!x) return;

    const offsetX = x - bounds.left;
    const percent = Math.max(0, Math.min((offsetX / bounds.width) * 100, 100));
    setSliderPos(percent);
  };
  const handleClick = () => {
    if (!isAuthenticated) {
      localStorage.removeItem("currentLayoutID");
      setTotalArea("");
      setCurrentLayoutID(0);
      setCurrentLayoutData({});
    }
    setLoading(true);
    navigate("/Layout");
  };
  const handleProductClick = () => {
    setLoading(true);
    navigate("/products");
  };
  useEffect(() => {
    gsap.fromTo(
      "[id^=bg-piece-]",
      { x: "100vw", opacity: 0 },
      {
        x: "0%",
        opacity: 1,
        duration: 1.2,
        stagger: 0.12,
        ease: "power4.out",
      }
    );
  }, []);

  function TitleHeader({ title, doubleside = false }) {
    return (
      <>
        <div className="flex  items-start gap-2">
          <span className="w-8 h-px bg-[#374A75] mt-1"></span>
          <h4 className="uppercase text-[#374A75] font-bold text-sm font-lato">
            {title}
          </h4>
          {doubleside && <span className="w-8 h-px bg-[#374A75] mt-1"></span>}
        </div>
      </>
    );
  }

  return (
    <>
      {/* header section */}
      <section className="relative flex flex-col h-screen overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute top-0 h-full"
            style={{
              width: "20%",
              left: `${i * 20}%`,
              backgroundImage: "url('/images/hero-interior.png')",
              backgroundSize: "500% 100%",
              backgroundPosition: `-${i * 100}% 0`,
              zIndex: 5,
            }}
            id={`bg-piece-${i}`}
          ></div>
        ))}

        <section
          className="relative flex flex-col z-10"
          // className="relative flex flex-col h-screen bg-cover bg-center bg-[url('/images/home/Home_Header.png')]"
          style={{ backgroundAttachment: "fixed" }}
        >
          <div className="absolute inset-0"></div>
          {/* <div className="absolute inset-0 bg-black/50"></div> */}
          <div className="relative z-10 ">
            <LandingNavbar />
            <div className="flex justify-center items-center h-svh tranform translate-y-[8%]">
              <div className="flex-1 flex flex-col gap-10 lg:gap-0 justify-center items-center text-white max-h-fit max-w-fit mx-auto lg:p-5 rounded-xl">
                <div className="lg:flex max-w-6xl px-5  items-stretch bg-[#000]/25 backdrop-blur-sm border border-white/20 shadow-lg rounded-xl">
                  <div className="lg:w-1/2 flex flex-col justify-center items-center gap-6 py-5">
                    <h3 className="uppercase lg:self-end font-lora font-bold text-lg">
                      A Trendy Luxury
                    </h3>
                    <p className="font-Poppins text-right hidden lg:block text-white leading-7">
                      Interior design consultancy firm that brings sensitivity
                      to the design top offices around the world. We stand for
                      quality, safety and credibility.
                    </p>
                  </div>

                  <div className="w-[1px] mx-10 bg-white"></div>

                  <div className="lg:w-1/2 flex flex-col space-y-10 py-5">
                    <h2 className="text-4xl lg:text-5xl font-bold font-lora text-white">
                      Make Your Space For Better Experience
                    </h2>

                    <div className="flex flex-col gap-8 lg:gap-0 lg:flex-row justify-between">
                      <button
                        onClick={handleClick}
                        disabled={loading}
                        className={`capitalize bg-[#FFD074] hover:bg-[#fbc964] text-base font-Poppins font-semibold text-black h-10 w-52 rounded-3xl self-center lg:self-start flex items-center justify-center gap-2 ${
                          loading ? "opacity-70 cursor-not-allowed" : ""
                        }`}
                      >
                        {loading ? (
                          <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        ) : (
                          "make your space"
                        )}
                      </button>
                      {import.meta.env.MODE === "development" && (
                        <button
                          onClick={handleProductClick}
                          disabled={loading}
                          className={`capitalize bg-[#FFD074] hover:bg-[#fbc964] text-base font-Poppins font-semibold text-black h-10 w-52 rounded-3xl self-center lg:self-start flex items-center justify-center gap-2 ${
                            loading ? "opacity-70 cursor-not-allowed" : ""
                          }`}
                        >
                          {loading ? (
                            <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                          ) : (
                            "shop by products"
                          )}
                        </button>
                      )}
                    </div>
                    {/* <button
                    onClick={handleClick}
                    disabled={loading}
                    className={`capitalize bg-[#FFD074] hover:bg-[#fbc964] text-base font-Poppins font-semibold text-black h-10 w-52 rounded-3xl self-center lg:self-start flex items-center justify-center gap-2 ${
                      loading ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                  >
                    {loading ? (
                      <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                      "discover what we do"
                    )}
                  </button> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </section>

      {/* section 2 */}
      <section className="about-us px-3 md:container lg:max-w-7xl mx-auto pt-10 ">
        <div className="lg:flex gap-12">
          <div className="pb-6 lg:pb-0">
            <img
              src="/images/home/section_1_main.png"
              alt=""
              className="image-reveal w-full object-cover"
            />
          </div>
          <div className="space-y-2 flex-1">
            <TitleHeader title={"about interior"} />
            <div className="space-y-8">
              <h3 className="text-[#232323] font-lora font-bold text-xl md:text-4xl tracking-wider">
                We Create The Art Of Stylish <br /> Office Stylishly
              </h3>
              <p className="leading-7 font-lato tracking-wider">
                Interior design consultancy firm that brings sensitivity to the
                design top restaurants, hotels, offices & homes around the
                world. We stand for quality, safety and credibility, so you
                could be sure about our work. Initially we started as a company
                specializing
              </p>
            </div>
            <div>
              {/* Desktop Tabs */}
              <div className="hidden md:flex w-full justify-between space-x-2">
                {tabData.map((tab) => (
                  <div
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`relative inline-block px-6 py-2 font-semibold cursor-pointer transition-all duration-300
                        ${
                          activeTab === tab.key
                            ? "text-[#2D437A]"
                            : "text-black"
                        }
                      `}
                  >
                    <span
                      className={`relative z-10 ${
                        activeTab === tab.key ? "text-[#2D437A]" : "text-black"
                      }`}
                    >
                      {tab.title}
                    </span>
                    <span
                      className={`absolute left-0 bottom-0 h-0.5 bg-[#2D437A] transition-all duration-500 ease-in-out
                          ${activeTab === tab.key ? "w-full" : "w-0"}
                        `}
                    ></span>
                    {activeTab === tab.key && (
                      <div className="absolute left-1/2 -bottom-[5px] transform -translate-x-1/2 rotate-45 w-3 h-3 bg-white border-l-2 border-t-2 border-[#2D437A]" />
                    )}
                  </div>
                ))}
              </div>

              {/* Desktop Content */}
              <div className="hidden md:block ">
                {tabData
                  .filter((tab) => tab.key === activeTab)
                  .map((tab) => (
                    <div
                      key={tab.key}
                      className="flex space-x-5 mt-4 animate-fade-in"
                    >
                      <img
                        key="img"
                        src={tab.img}
                        alt=""
                        className="h-64 w-56"
                      />
                      <div className="space-y-1 tracking-wider" key="text">
                        <p>{tab.text}</p>
                        <div className="!mt-5">
                          {tab.points.map((point, i) => (
                            <div className="flex items-start space-x-2" key={i}>
                              <IoMdCheckmarkCircleOutline size={20} />
                              <p>{point}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>

              {/* Mobile Swiper */}
              <div className="md:hidden mt-4">
                <Swiper
                  grabCursor={true}
                  centeredSlides={true}
                  loop={true}
                  slidesPerView={"auto"}
                  spaceBetween={10}
                  initialSlide={3}
                  autoplay={{
                    delay: 1500, // 1.5 seconds per slide
                    disableOnInteraction: false, // Keeps autoplay even after user interaction
                  }}
                  pagination={{ clickable: true }}
                  modules={[EffectCoverflow, Pagination, Navigation, Autoplay]}
                >
                  {tabData.map((tab) => (
                    <SwiperSlide key={tab.key}>
                      <div className="space-y-2">
                        {/* Tab Title */}
                        <div className="text-center text-[#2D437A] font-semibold text-lg">
                          {tab.title}
                        </div>

                        {/* Content */}
                        <div className="space-y-4 text-sm ">
                          <img
                            src={tab.img}
                            alt=""
                            className="max-w-xs w-full mx-auto"
                          />
                          <p>{tab.text}</p>
                          <div className="space-y-3">
                            {tab.points.map((point, i) => (
                              <div
                                className="flex items-start space-x-2"
                                key={i}
                              >
                                <IoMdCheckmarkCircleOutline size={20} />
                                <p>{point}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* section 3 */}
      <section className="services relative lg:bg-[url('images/home/services_bg.png')] bg-right bg-no-repeat my-10">
        <div className="px-3 md:container lg:max-w-7xl mx-auto space-y-3 py-16">
          <TitleHeader title={"services we do"} />
          <h3 className="font-bold text-xl md:text-4xl font-lora !leading-[45px] tracking-wider">
            Our Featured Services <br /> Interior Design Transformations
          </h3>

          {/* Swiper for mobile & tablet */}
          <div className="lg:hidden">
            <Swiper
              spaceBetween={20}
              slidesPerView={1}
              pagination={{ clickable: true }}
              breakpoints={{
                640: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
              }}
              autoplay={{
                delay: 1500, // 1.5 seconds per slide
                disableOnInteraction: false, // Keeps autoplay even after user interaction
              }}
              modules={[Pagination, Autoplay]}
            >
              {/* Slide 1 */}
              <SwiperSlide>
                <div className="flex justify-center items-center">
                  <div className="font-lato space-y-6 px-3 py-5 max-w-xs w-full bg-white shadow-lg">
                    <img src="images/icons/architecture-icon.svg" alt="" />
                    <h4 className="font-bold text-xl capitalize">
                      architecture
                    </h4>
                    <p>
                      We develop the full cycle of project documentation & full
                      details. Our clients satisfaction
                    </p>

                    <ReadMoreBtn />
                  </div>
                </div>
              </SwiperSlide>

              {/* Slide 2 */}
              <SwiperSlide>
                <div className="flex justify-center items-center">
                  <div className="font-lato px-3 py-5 max-w-xs w-full bg-[url('/images/home/interior-work-bg.svg')] text-white relative shadow-lg">
                    <div className="absolute inset-0 bg-black/50"></div>
                    <div className="relative space-y-7">
                      <img src="images/icons/interior.svg" alt="" />
                      <h4 className="font-bold text-xl capitalize">
                        Interior Work
                      </h4>
                      <p>
                        We will take care of the interior designs, build &
                        management of all kind of living projects
                      </p>

                      <ReadMoreBtn borderColor="#ffffff" />
                    </div>
                  </div>
                </div>
              </SwiperSlide>

              {/* Slide 3 */}
              <SwiperSlide>
                <div className="flex justify-center items-center">
                  <div className="font-lato space-y-7 px-3 py-5 max-w-xs w-full bg-white shadow-lg">
                    <img src="images/icons/retail.svg" alt="" />
                    <h4 className="font-bold text-xl capitalize">
                      Retail Designs
                    </h4>
                    <p>
                      We can help you with the retail interior design and third
                      party management to create best
                    </p>

                    <ReadMoreBtn />
                  </div>
                </div>
              </SwiperSlide>

              {/* Slide 4 */}
              <SwiperSlide>
                <div className="flex justify-center items-center">
                  {" "}
                  <div className="font-lato space-y-7 px-3 py-5 max-w-xs w-full bg-white shadow-lg">
                    <img src="images/icons/2d-3d_layout.svg" alt="" />
                    <h4 className="font-bold text-xl capitalize">
                      2D/3D Layouts
                    </h4>
                    <p>
                      We offer professional online 2D and 3D interior designing
                      which will help you visualize
                    </p>

                    <ReadMoreBtn />
                  </div>
                </div>
              </SwiperSlide>
            </Swiper>
          </div>

          {/* Original static grid for large screens */}
          <div className="hidden lg:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 bg-white shadow-lg">
            {featureCards.map((card, index) => (
              <div
                key={index}
                className="group relative overflow-hidden bg-white font-lato px-4 py-10 max-w-xs w-full h-full transition-all duration-500"
                style={{
                  "--borderColor": "#000000",
                }}
                onMouseEnter={(e) =>
                  e.currentTarget.style.setProperty("--borderColor", "#ffffff")
                }
                onMouseLeave={(e) =>
                  e.currentTarget.style.setProperty("--borderColor", "#000000")
                }
              >
                <div className="absolute inset-0 z-0 before:absolute before:inset-0 before:bg-[url('/images/home/interior-work-bg.svg')] before:bg-cover before:bg-center before:translate-y-full group-hover:before:translate-y-0 before:transition-transform before:duration-700 before:ease-in-out">
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
                <div className="relative z-10 space-y-5 group-hover:text-white transition-colors duration-300 flex flex-col h justify-between h-full">
                  <div className="h-16 w-16">
                    <img
                      src={card.hovericon}
                      alt={card.title}
                      className="h-full w-full group-hover:block hidden"
                    />
                    <img
                      src={card.icon}
                      alt={card.title}
                      className="h-full w-full group-hover:hidden block"
                    />
                  </div>
                  <h4 className="font-bold text-xl capitalize">{card.title}</h4>
                  <p>{card.description}</p>
                  <div className="">
                    <ReadMoreBtn borderColor="var(--borderColor)" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* section 4 */}
      <section className="testimonials px-3 md:container lg:max-w-7xl mx-auto pt-10 pb-5 lg:pb-20 space-y-10">
        <div className="flex flex-col items-center space-y-4">
          <TitleHeader title={"What People Say"} doubleside={true} />
          <h3 className="font-bold font-lato text-4xl tracking-wider">
            Words Of Our Clients
          </h3>
        </div>

        {/* Mobile & Tablet View */}
        <div className="block lg:hidden">
          <Swiper
            spaceBetween={20}
            slidesPerView={1}
            loop={true}
            autoplay={{
              delay: 1500, // 1.5 seconds per slide
              disableOnInteraction: false, // Keeps autoplay even after user interaction
            }}
            modules={[Autoplay]}
          >
            {testimonials.map((testimonial) => (
              <SwiperSlide key={testimonial.id}>
                <div className="border-r-[16px] border-b-[16px] border-[#F7F7F7] max-w-sm space-y-5 mx-auto p-4 bg-white">
                  <div>
                    <img src="/images/home/stars.svg" alt="rating stars" />
                  </div>
                  <p className="font-lato italic text-[#777777]">
                    {testimonial.text}
                  </p>
                  <div className="flex gap-4 items-center">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <h5 className="text-[#232323] font-bold font-lato">
                        {testimonial.name}
                      </h5>
                      <h6 className="text-[#777777]">{testimonial.role}</h6>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Desktop View */}
        <motion.div
          ref={ref}
          className="hidden lg:flex gap-8 justify-between"
          variants={containerVariants}
          initial="hidden"
          animate={controls}
        >
          {testimonials.map((testimonial) => (
            <motion.div
              key={testimonial.id}
              variants={cardVariants}
              className="border-r-[16px] border-b-[16px] border-[#F7F7F7] max-w-sm space-y-5 p-4"
            >
              <div>
                <img src="/images/home/stars.svg" alt="rating stars" />
              </div>
              <p className="font-lato italic text-[#777777]">
                {testimonial.text}
              </p>
              <div className="flex gap-4 items-center">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h5 className="text-[#232323] font-bold font-lato">
                    {testimonial.name}
                  </h5>
                  <h6 className="text-[#777777]">{testimonial.role}</h6>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* section 5 */}
      <section className="before-after py-10 space-y-5">
        <div className="md:container lg:max-w-7xl mx-auto hidden md:block">
          <TitleHeader title={"after before"} />
          <h3 className="font-bold font-lora text-4xl tracking-wider">
            Let's Have A Look At What <br />
            Creativity Is!
          </h3>
        </div>
        <div
          ref={imageContainerRef}
          className="relative w-full  lg:max-w-7xl 3xl:mx-auto  h-[500px] overflow-hidden "
        >
          {/* Before image */}
          <img
            src={afterImage}
            className="absolute top-0 left-0 h-full w-full object-cover"
            alt="Before"
          />
          <div className="absolute bottom-4 right-4 bg-[#1B2E50]/90 text-white text-base px-4 py-2">
            After
          </div>

          {/* After image with dynamic width */}
          <div
            className="absolute top-0 left-0 h-full overflow-hidden"
            style={{ width: `${sliderPos}%` }}
          >
            <div className="relative h-full w-full">
              <img
                src={beforeImage}
                className="h-full w-full object-cover"
                alt="After"
              />
              {/* After Tag (moves and hides with image) */}
              <div className="absolute bottom-4 right-4 bg-[#1B2E50]/90 text-white text-base px-4 py-2">
                Before
              </div>
            </div>
          </div>

          {/* Slider handle */}
          <div
            className="absolute top-0 bottom-0"
            style={{ left: `${sliderPos}%`, transform: "translateX(-50%)" }}
          >
            <div
              onMouseDown={(e) => {
                e.preventDefault();
                window.addEventListener("mousemove", handleImageDrag);
                window.addEventListener(
                  "mouseup",
                  () => {
                    window.removeEventListener("mousemove", handleImageDrag);
                  },
                  { once: true }
                );
              }}
              onTouchStart={(e) => {
                window.addEventListener("touchmove", handleImageDrag);
                window.addEventListener(
                  "touchend",
                  () => {
                    window.removeEventListener("touchmove", handleImageDrag);
                  },
                  { once: true }
                );
              }}
              className="w-6 h-6 rounded-full bg-[#007FB5]  border-2 border-[#007FB5] animate-pulse mx-auto absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-full cursor-ew-resize"
            />
            <div className="h-1/2 w-[5px] -translate-x-1/2 bg-[#007FB5] absolute bottom-0"></div>
          </div>
        </div>
      </section>

      {/* section 6 */}
      <section className="py-10 relative">
        <div className="absolute bg-[#F7F7F7] bottom-0 py-14 w-full z-0 hidden lg:block" />
        <div className="flex flex-col items-center space-y-4 py-3 z-10">
          <TitleHeader title={"our best projects"} doubleside={true} />
          <h3 className="font-bold font-lato text-4xl capitalize tracking-wider">
            our featured projects
          </h3>
        </div>
        {/* Desktop layout */}
        <motion.div
          ref={featuredRef}
          className="relative z-10 w-full justify-end hidden lg:flex"
          initial="hidden"
          animate={controlsFeatured}
          variants={containerVariants}
        >
          <div className="max-w-7xl 3xl:mx-auto flex justify-end gap-5">
            {featuredProjects.map((src, index) => (
              <motion.img
                key={index}
                src={src}
                alt=""
                variants={imageVariants}
                className="max-w-xs"
              />
            ))}
          </div>
        </motion.div>

        {/* Swiper for mobile & tablet */}
        <div className="z-10 lg:hidden px-5">
          <Swiper
            spaceBetween={20}
            breakpoints={{
              0: {
                slidesPerView: 1,
              },
              768: {
                slidesPerView: 2,
              },
            }}
            autoplay={{
              delay: 1500, // 1.5 seconds per slide
              disableOnInteraction: false, // Keeps autoplay even after user interaction
            }}
            modules={[Autoplay]}
          >
            {["1", "2", "3", "4"].map((num) => (
              <SwiperSlide key={num}>
                <img
                  src={`/images/home/featured-project-${num}.png`}
                  alt={`Featured Project ${num}`}
                  className="w-full max-w-xs mx-auto"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* section 7 */}
      <section className="bg-[#F7F7F7] py-10 md:py-5">
        <div className="px-3 md:container lg:max-w-7xl mx-auto ">
          <div className="w-full grid grid-cols-2 lg:grid-cols-4 gap-y-5 gap-x-5">
            <div className="flex lg:justify-center items-center gap-2.5">
              <img
                src="/images/icons/creative-premium.svg"
                alt=""
                className="h-7 md:h-14"
              />
              <h5 className="font-Poppins text-[#374A75] capitalize text-sm lg:text-xl">
                <span className="text-[#CDA174]">creative</span> <br /> premium
              </h5>
            </div>
            <div className="flex lg:justify-center items-center gap-2.5">
              <img
                src="/images/icons/office-interior.svg"
                alt=""
                className="h-7 md:h-14"
              />
              <h5 className="font-Poppins text-[#374A75] capitalize text-sm lg:text-xl">
                <span className="text-[#CDA174]">office</span> <br /> interior
              </h5>
            </div>
            <div className="flex lg:justify-center items-center gap-2.5">
              <img
                src="/images/icons/comfort-furniture.svg"
                alt=""
                className="h-7 md:h-14"
              />
              <h5 className="font-Poppins text-[#374A75] capitalize text-sm lg:text-xl">
                <span className="text-[#CDA174]">comfort</span> <br /> furniture
              </h5>
            </div>
            <div className="flex lg:justify-center items-center gap-2.5">
              <img
                src="/images/icons/remodeling-interior.svg"
                alt=""
                className="h-7 md:h-14"
              />
              <h5 className="font-Poppins text-[#374A75] capitalize text-sm lg:text-xl">
                <span className="text-[#CDA174]">remodeling</span> <br />{" "}
                interior
              </h5>
            </div>
          </div>
        </div>
      </section>

      {/* section 8 */}
      <section className="py-10 relative ">
        <div className="absolute bg-[#F7F7F7] top-0 py-14 w-full z-0 hidden lg:block"></div>
        <div className="relative z-10 max-w-7xl 3xl:mx-auto lg:flex gap-10">
          <motion.div
            ref={strategyRef}
            initial="hidden"
            animate={controlsStrategy}
            variants={strategyAnimation}
            className="flex-1"
          >
            <img src="images/home/about-interior.png" alt="" />
          </motion.div>
          <div className="flex-1 flex justify-end items-center flex-col space-y-2 px-3 lg:px-0">
            <div className="space-y-3 mb-6">
              <TitleHeader title={"About Interior"} />
              <h3 className="font-bold font-lora text-4xl tracking-wider">
                Strategy - Led Interior Design
              </h3>
              <p className="font-lato text-base text-[#000000]/65 tracking-wider">
                We work to ensure people’s comfort at their home, and to provide
                the best and the fastest help at fair prices. We stand for
                quality, safety and cred
              </p>
            </div>
            <div className="md:flex">
              <div className=" font-lato space-y-5">
                <img src="images/icons/modern-living.svg" alt="" />
                <h4 className="font-bold text-xl  ">Modern living quarter</h4>
                <p className="text-[#000000]/65">
                  Iterative approaches to the corporate strategy foster
                  collaborative
                </p>
              </div>
              <div className="w-px bg-[#000000]/20 mx-10"></div>
              <div className=" font-lato space-y-5">
                <img src="images/icons/inter-art.svg" alt="" />
                <h4 className="font-bold text-xl  ">
                  Interior Inter Art Design
                </h4>
                <p className="text-[#000000]/65">
                  We develop the full cycle of project documentation and full
                  details.
                </p>
              </div>
            </div>
            <div className="md:flex gap-5 !mt-5">
              <img
                src="/images/icons/star-full.svg"
                alt=""
                className="self-start"
              />
              <p className="font-lato text-[#777777]">
                <span className="font-bold text-[#000000] underline underline-offset-4 decoration-[#EBEFF9]">
                  99.9% Customer Satisfaction 
                </span>{" "}
                based on 750+ reviews and 20,000 Objective Resource
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* section 9 */}
      <section className="md:container 3xl:max-w-7xl 3xl:px-0  md:mx-auto my-10">
        <div>
          <div className="flex flex-col items-center space-y-4 py-3  font-bold mb-5">
            <TitleHeader title={"Recent Articles"} doubleside={true} />
            <h3 className=" font-lora text-[#232323] text-xl lg:text-[42px] capitalize">
              Read Our Latest Articles
            </h3>
          </div>
        </div>
        <div className="hidden md:flex flex-col md:flex-row  justify-between items-center gap-10  lg:gap-4">
          {latestArticles.map((article, index) => (
            <div key={index} className="max-w-sm">
              <div className="relative">
                <img src={article.image} alt="blogoffice" />
                <div className="absolute  left-4 bottom-0 bg-white text-center px-3 py-1 shadow-md rounded-sm">
                  <div className="text-lg font-bold">{article.date}</div>
                  <div className="text-sm text-gray-500 -mt-1 uppercase">
                    {article.month}
                  </div>
                </div>
              </div>
              <div className="font-lato border border-[#000]/10 p-4 space-y-3">
                <div className="flex items-center gap-4  text-[#777]">
                  <div className="flex items-center gap-2">
                    <FaRegUser size={20} color="#374A75" /> {article.name}
                  </div>
                  <div className="flex items-center gap-2">
                    <FiMessageSquare size={20} color="#374A75" />{" "}
                    {article.comments} Comments
                  </div>
                </div>
                <p className="font-bold text-[#232323] text-xl">
                  {article.title}
                </p>
                <div className=" left-0  bottom-0  transform translate-x-[5%]  translate-y-[70%] bg-[#fff] inline-block">
                  <ReadMoreBtn
                    onClick={() => {
                      navigate(`/blog/${article.title.replace(/\s/g, "_")}`);
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className=" md:hidden">
          <Swiper
            grabCursor={true}
            centeredSlides={true}
            loop={true}
            slidesPerView={"auto"}
            spaceBetween={20}
            initialSlide={1}
            // autoplay={{
            //   delay: 1500, // 1.5 seconds per slide
            //   disableOnInteraction: true, // Keeps autoplay even after user interaction
            // }}
            modules={[Autoplay]}
          >
            {latestArticles.map((article, index) => (
              <SwiperSlide key={index}>
                <div className="max-w-xs mx-auto">
                  <div className="relative">
                    <img src={article.image} alt="blogoffice" />
                    <div className="absolute  left-4 bottom-0 bg-white text-center px-3 py-1 shadow-md rounded-sm">
                      <div className="text-lg font-bold">{article.date}</div>
                      <div className="text-sm text-gray-500 -mt-1 uppercase">
                        {article.month}
                      </div>
                    </div>
                  </div>
                  <div className="font-lato border border-[#000]/10 p-4 space-y-3">
                    <div className="flex items-center gap-4  text-[#777]">
                      <div className="flex items-center gap-2">
                        <FaRegUser size={20} color="#374A75" /> {article.name}
                      </div>
                      <div className="flex items-center gap-2">
                        <FiMessageSquare size={20} color="#374A75" />{" "}
                        {article.comments} Comments
                      </div>
                    </div>
                    <p className="font-bold text-[#232323] text-xl">
                      {article.title}
                    </p>
                    <div className=" left-0  bottom-0  transform md:translate-x-[5%]  md:translate-y-[70%] bg-[#fff] inline-block">
                      <ReadMoreBtn
                        onClick={() => {
                          navigate(
                            `/blog/${article.title.replace(/\s/g, "_")}`
                          );
                        }}
                      />
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>
      <footer>
        <Footer />
      </footer>
    </>
  );
}

export default Landing;
