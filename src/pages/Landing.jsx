import React, { useState, useEffect } from "react";
import LandingNavbar from "../common-components/LandingNavbar";

import { FaAngleDown, FaAngleUp } from "react-icons/fa";

import Slider from "react-slick";
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
import {
  BiSolidLeftArrowSquare,
  BiSolidRightArrowSquare,
} from "react-icons/bi";
import { IoIosCall } from "react-icons/io";
import { useApp } from "../Context/Context";
import MobileTestimonal from "../common-components/MobileTestimonal";

function Landing() {
  const [expandedIndex, setExpandedIndex] = useState();
  // const [isMobile, setIsMobile] = useState(false);
  const heroImages = [
    "/images/home/Hero.png",
    "/images/home/Hero-image-1.png",
    "/images/home/Hero-image-2.png",
    "/images/home/Hero-image-3.png",
    "/images/home/Hero-image-4.png",
    "/images/home/Hero-image-5.png",
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const {
    isMobile,
    setTotalArea,
    setCurrentLayoutID,
    setCurrentLayoutData,
    isAuthenticated,
  } = useApp();

  // Change background image every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // 5000ms = 5 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [heroImages.length]);

  // Detect screen size
  // useEffect(() => {
  //   const handleResize = () => {
  //     setIsMobile(window.innerWidth <= 768); // Mobile & Tablet: < 768px
  //   };
  //   handleResize(); // Check on mount
  //   window.addEventListener("resize", handleResize);
  //   return () => window.removeEventListener("resize", handleResize);
  // }, []);

  const navigate = useNavigate();
  const handleToggle = (index) => {
    setExpandedIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  // const scrollToTop = () => {
  //   window.scrollTo({
  //     top: 0,
  //     behavior: "smooth", // Enables smooth scrolling
  //   });
  // };

  const settings = {
    dots: false,
    infinite: true,
    speed: 1000,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    pauseOnHover: true,
    arrows: false,
    responsive: [
      {
        breakpoint: 1800, // Tailwind's custom 3xl breakpoint
        settings: {
          slidesToShow: 5, // Show 5 slides only on 3xl screens
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2, // Show 3 slides only on md screens
        },
      },
    ],
  };

  // const settingsWork = {
  //   dots: true,
  //   infinite: true,
  //   speed: 500,
  //   slidesToShow: 3,
  //   slidesToScroll: 1,
  //   autoplay: true,
  //   autoplaySpeed: 2000,
  //   // pauseOnHover: true,
  //   arrows: false,
  // };

  // const settingsProduct = {
  //   // vertical: true,
  //   // verticalSwiping: true,
  //   dots: true,
  //   infinite: true,
  //   speed: 500,
  //   slidesToShow: 4,
  //   slidesToScroll: 1,
  //   autoplay: true,
  //   autoplaySpeed: 2000,
  //   pauseOnHover: true,
  //   arrows: false, //true
  // };

  const accordionItems = [
    {
      title: "What is  Workved Interiors?",
      content:
        " Workved Interiors is a tech-driven platform that helps corporates design and set up their office spaces with instant layouts, smart BOQs, and vendor partnerships, ensuring a hassle-free experience",
    },
    {
      title: "Who can use  Workved Interiors?",
      content:
        "Our platform is designed for corporates, startups, office administrators, HR teams, and real estate decision-makers looking for efficient office space planning and execution.",
    },
    {
      title: "How does  Workved Interiors simplify office setup?",
      content:
        "We eliminate the need for lengthy consultations by offering instant office layouts, predefined and custom BOQs, and direct vendor collaboration, saving you time and costs.",
    },
    {
      title: "Is  Workved Interiors only for large businesses?",
      content:
        "No, we cater to businesses of all sizes, from small startups to large corporations, providing scalable solutions for workspace design.",
    },
    {
      title: "Can I get a customized office layout?",
      content:
        "Yes! You can input your office requirements, and our system generates a tailored layout to match your needs.",
    },
  ];

  return (
    <div>
      {/* section 1 */}
      <section
        className={`relative flex flex-col h-screen bg-cover bg-center transition-all duration-1000`}
        style={{
          backgroundImage: `url(${heroImages[currentImageIndex]})`,
          backgroundAttachment: "fixed",
        }}
      >
        {/* Add a dark overlay */}
        <div className="absolute inset-0 bg-black/50"></div>
        {/* Content */}
        <div className="relative z-10 ">
          <LandingNavbar />

          {/* Text div */}
          <div className="flex justify-center items-center h-svh">
            <div className="flex-1 flex flex-col gap-10 lg:gap-0 justify-center items-center text-white max-h-fit max-w-fit mx-auto p-5 rounded-xl mt-14 ">
              <h1 className="font-lato text-[55px] lg:text-[64px] text-center leading-tight">
                Create your Space
              </h1>
              <p className="font-Poppins text-xl lg:text-3xl text-center">
                We create unique style and design for your office
              </p>
              <button
                className="border border-transparent px-5 bg-[#1F5C54] py-3 mt-16 font-Poppins font-bold transform transition-transform duration-300 ease-in-out hover:scale-110"
                onClick={() => {
                  if (!isAuthenticated) {
                    localStorage.removeItem("currentLayoutID");
                    setTotalArea();
                    setCurrentLayoutID(0);
                    setCurrentLayoutData({});
                  }
                  navigate("/Layout");
                }}
              >
                Make Your Space
              </button>
            </div>
          </div>
        </div>
      </section>
      {/* section 2 */}
      <section className="bg-[#1F5C54] md:h-[500px] lg:h-[600px] xl:h-[700px]">
        <div className="container mx-auto  flex flex-col text-white ">
          {/* div for the text */}
          <div className="flex flex-col justify-center items-center mt-7 font-sans mb-5">
            <p
              className="text-[#34BFAD] uppercase text-xs lg:text-sm font-[10]"
              style={{ wordSpacing: "0.3em", letterSpacing: "0.2rem" }}
            >
              Luxurious Office Interiors
            </p>
            <img src="/images/serviceIcon.png" alt="service icon" />
            <p className="font-lato text-2xl lg:text-5xl font-semibold mb-2">
              We Offer Top Notch
            </p>
            <p className="text-center text-[12px] font-Poppins">
              We offer top-notch products designed to meet all your{" "}
              {!isMobile && <br />}
              office space needs..
            </p>
          </div>
          {/* div for the carousel */}
          <div className="flex-1 my-7">
            {/* Container for Images */}
            <div className="flex flex-col sm:flex-row justify-center gap-6 sm:gap-14 relative px-5 lg:px-20 pb-10">
              {/* Image Card 1 */}
              <div className="group relative text-center w-full md:w-1/3 h-auto overflow-hidden rounded-3xl transition-all duration-700 ease-in-out">
                <div className="flex flex-col items-center justify-center p-4 bg-transparent transition-all duration-700 ease-in-out group-hover:bg-white group-hover:scale-105 group-hover:py-8">
                  <img
                    src="/images/home/section2-img1.png"
                    alt="pantary"
                    className="mx-auto w-full sm:w-auto transition-transform duration-700 ease-in-out group-hover:scale-95 rounded-3xl"
                  />
                  <p className="hidden group-hover:block font-lora font-bold text-[#333333] mt-2 text-base md:text-lg lg:text-xl">
                    Smart Office Layouts
                  </p>
                </div>
              </div>

              {/* Image Card 2 */}
              <div className="group relative text-center w-full md:w-1/3 h-auto overflow-hidden rounded-3xl transition-all duration-700 ease-in-out">
                <div className="flex flex-col items-center justify-center p-4 bg-transparent transition-all duration-700 ease-in-out group-hover:bg-white group-hover:scale-105 group-hover:py-8">
                  <img
                    src="/images/home/section2-img2.png"
                    alt="pantary"
                    className="mx-auto w-full sm:w-auto transition-transform duration-700 ease-in-out group-hover:scale-95 rounded-3xl"
                  />
                  <p className="hidden group-hover:block font-lora font-bold text-[#333333] mt-2 text-base md:text-lg lg:text-xl">
                    Custom BOQ
                  </p>
                </div>
              </div>

              {/* Image Card 3 */}
              <div className="group relative text-center w-full md:w-1/3 h-auto overflow-hidden rounded-3xl transition-all duration-700 ease-in-out">
                <div className="flex flex-col items-center justify-center p-4 bg-transparent transition-all duration-700 ease-in-out group-hover:bg-white group-hover:scale-105 group-hover:py-8">
                  <img
                    src="/images/home/section2-img3.png"
                    alt="pantary"
                    className="mx-auto w-full sm:w-auto transition-transform duration-700 ease-in-out group-hover:scale-95 rounded-3xl"
                  />
                  <p className="hidden group-hover:block font-lora font-bold text-[#333333] mt-2 text-base md:text-lg lg:text-xl">
                    End-to-End Execution
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* section 3 */}
      <section className="bg-[#F4F4F4] pb-10 lg:pb-20">
        <div className="container mx-auto flex py-10 justify-around gap-5">
          <div className="flex-1">
            <div>
              <div className="flex flex-col justify-center items-center gap-1">
                <p
                  className="text-[#1F5C54] font-sans font-bold uppercase text-sm "
                  style={{ wordSpacing: "0.3em", letterSpacing: "0.2rem" }}
                >
                  our story
                </p>
                <img src="/images/serviceIcon.png" alt="service icon" />
              </div>
              <div className="flex flex-col gap-5 xl:gap-14">
                <h2 className="text-center text-[#212121] font-bold text-3xl xl:text-5xl font-lato ">
                  Welcome to Workved {!isMobile && <br />} Interiors
                </h2>

                <p className="text-[#212121] text-sm xl:text-base font-sans text-justify 2xl:leading-7 xl:mb-5">
                  At Workved Interiors, we believe that the right workspace can
                  transform the way you work. Our expertise in designing
                  functional, aesthetically pleasing, and customized office
                  spaces sets us apart. With a dedicated in-house design team
                  that has successfully crafted inspiring environments for 603
                  The Coworking Space, we bring the same innovation and
                  precision to your corporate office. Whether you're looking to
                  redesign your existing office or create a new space from
                  scratch, Workved Interiors offers end-to-end solutions
                  tailored to your business needs. Experience the perfect blend
                  of creativity, efficiency, and functionality with Workved
                  Interiors – where every space is designed with purpose.
                </p>
                {/* buton and call div */}
                <div className="flex flex-col lg:flex-row justify-center lg:justify-between items-center gap-5">
                  <button
                    onClick={() => navigate("/AboutUs")}
                    className="px-10 py-3.5 border border-[#34BFAD] font-sans text-[#34BFAD] hover:bg-[#34BFAD] hover:text-[#212121] uppercase font-thin text-xs lg:text-sm tracking-wider"
                  >
                    Read More
                  </button>
                  {/* image  */}
                  <div className="w-full lg:w-1/2 flex justify-center items-center gap-2">
                    <div
                      className="bg-[#34BFAD] lg:w-[50px] w-10 h-10 lg:h-[50px] rounded-full flex justify-center items-center cursor-pointer"
                      onClick={() => navigate("/ContactUs")}
                    >
                      <IoIosCall className="text-white w-6 h-6 sm:w-9 sm:h-9" />
                    </div>
                    <div className="flex flex-col justify-center items-center">
                      <p className="font-sans font-bold text-[#212121] text-sm text-center">
                        Book Through Call
                      </p>
                      <p className="font-sans text-[#34BFAD] text-sm lg:text-lg ml-3">
                        +91 9136036603
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1 hidden lg:flex justify-end items-center h-full">
            <img
              src="/images/home/welcome to interior.png"
              alt="welcome interior"
            />
          </div>
        </div>
      </section>

      {/* section buy our product */}
      {/* <section className="bg-[url('/images/home/produt.png')] bg-cover bg-center py-4 h-1/2 pb-20">
        <div className="container mx-auto relative py-10 ">
          <div className="flex flex-col gap-12 justify-center items-center h-3/4 absolute w-1/2 top-[40px] left-[-200px]">
            <div className="flex flex-col justify-center items-center">
              <p className="font-sans mb-1 text-[#1F5C54] font-bold uppercase text-sm">
                {" "}
                our products
              </p>
              <img src="/images/serviceIcon.png" alt="service icon" />
              <h3 className="font-Poppins text-3xl font-semibold text-[#1F5C54] ">
                Buy Our Product
              </h3>
            </div>
            <div className="">
              <button className=" bg-[#34BFAD] px-5 py-2 border-[1px] border-r-4 border-b-4 drop-shadow-xl border-black text-center text-black text-xs font-normal font-['Poppins'] leading-normal hover:scale-110 transition-transform">
                View More
              </button>
            </div>
          </div>

          <div className="slider-container w-3/4 ml-auto">
            <Slider {...settingsProduct}>
              <div className="overflow-hidden ">
                <div className="bg-white lg:w-[220px] lg:h-[320px] ">
                  <img
                    className=""
                    src="images/home/sectionproduct1.png "
                    alt="sectionproduct"
                  />
                  <div className="text-center text-[#111111] text-sm font-bold font-Poppins capitalize py-2">
                    <span>Table Lamp</span>
                  </div>{" "}
                </div>
              </div>
              <div className="overflow-hidden">
                <div className="bg-white w-1/2 lg:w-[220px] lg:h-[320px] ">
                  <img
                    className=""
                    src="images/home/sectionproduct2.png "
                    alt="sectionproduct"
                  />
                  <div className="text-center text-[#111111] text-sm font-bold font-Poppins capitalize py-2">
                    <span>Chair</span>
                  </div>{" "}
                </div>
              </div>
              <div className="overflow-hidden">
                <div className="bg-white w-1/2 lg:w-[220px] lg:h-[320px] ">
                  <img
                    className=""
                    src="images/home/sectionproduct3.png "
                    alt="sectionproduct"
                  />
                  <div className="text-center text-[#111111] text-sm font-bold font-Poppins capitalize py-2">
                    <span>Lights</span>
                  </div>{" "}
                </div>
              </div>
              <div className="overflow-hidden">
                <div className="bg-white w-1/2 lg:w-[220px] lg:h-[320px] ">
                  <img
                    className=""
                    src="images/home/sectionproduct4.png "
                    alt="sectionproduct"
                  />
                  <div className="text-center text-[#111111] text-sm font-bold font-Poppins capitalize py-2">
                    <span>Chair</span>
                  </div>{" "}
                </div>
              </div>
              <div className="overflow-hidden">
                <div className="bg-white w-1/2 lg:w-[220px] lg:h-[320px] ">
                  <img
                    className=""
                    src="images/home/sectionproduct5.png "
                    alt="sectionproduct"
                  />
                  <div className="text-center text-[#111111] text-sm font-bold font-Poppins capitalize py-2">
                    <span>Table Lamp</span>
                  </div>{" "}
                </div>
              </div>
            </Slider>
          </div>
        </div>
      </section> */}

      {/* section for buy  */}

      {/* section our Work */}
      <section className="py-6 bg-[#F4F4F4] ">
        {/* container */}
        <div className="container max-w-full overflow-x-hidden py-2">
          {/* textual part */}
          <div className="flex flex-col justify-center items-center">
            <p
              className="font-sans mb-1 text-[#1F5C54] font-bold text-sm uppercase text tracking-wider"
              style={{ wordSpacing: "0.3em", letterSpacing: "0.2rem" }}
            >
              our work
            </p>
            <img src="/images/serviceIcon.png" alt="service icon" />
            {/* <h3 className="text-5xl font-lato font-semibold uppercase">
              Our WORK
            </h3> */}
          </div>

          {/* slider for images */}
          <Swiper
            effect={"coverflow"}
            grabCursor={true}
            centeredSlides={true}
            loop={true}
            slidesPerView={"auto"} // Ensures 5 slides are visible
            spaceBetween={30} // Adds spacing between slides
            initialSlide={3}
            coverflowEffect={{
              rotate: 35,
              stretch: 0,
              depth: 100,
              modifier: 0.8,
            }}
            autoplay={{
              delay: 1500, // 1.5 seconds per slide
              disableOnInteraction: false, // Keeps autoplay even after user interaction
            }}
            // pagination={{ el: ".swiper-pagination", clickable: true }}
            navigation={{
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
              clickable: true,
            }}
            modules={[EffectCoverflow, Pagination, Navigation, Autoplay]}
            className="swiper_container max-w-screen overflow-x-hidden"
          >
            <SwiperSlide>
              <img src="/images/ourwork1.jpg" alt="work section" />
            </SwiperSlide>
            <SwiperSlide>
              <img src="/images/ourwork2.jpg" alt="work section" />
            </SwiperSlide>
            <SwiperSlide>
              <img src="/images/ourwork3.jpeg" alt="work section" />
            </SwiperSlide>
            <SwiperSlide>
              <img src="/images/ourwork4.JPG" alt="work section" />
            </SwiperSlide>
            <SwiperSlide>
              <img src="/images/ourwork5.jpg" alt="work section" />
            </SwiperSlide>
            <SwiperSlide>
              <img src="/images/ourwork6.jpg" alt="work section" />
            </SwiperSlide>
            <SwiperSlide>
              <img src="/images/ourwork7.jpg" alt="work section" />
            </SwiperSlide>
            <SwiperSlide>
              <img src="/images/ourwork8.jpg" alt="work section" />
            </SwiperSlide>
            <SwiperSlide>
              <img src="/images/ourwork9.JPG" alt="work section" />
            </SwiperSlide>
            {/* <SwiperSlide>
              <img src="/images/our-work/our-work-5.png" alt="work section" />
            </SwiperSlide> */}
            <div className="slider-controler">
              <div className="swiper-button-prev slider-arrow !static ml-[12%]">
                <BiSolidLeftArrowSquare
                  name="arrow-back-outline"
                  color={"#1A3A36"}
                />
              </div>
              <div className="swiper-button-next slider-arrow !static ml-6">
                <BiSolidRightArrowSquare
                  name="arrow-back-outline"
                  color={"#1A3A36"}
                />
              </div>
              <div className="hidden lg:block swiper-pagination"></div>
            </div>
          </Swiper>
        </div>
      </section>

      {/* section 5 */}
      <section className="pt-6 relative bg-[#F4F4F4] shadow-[0px_0px_20px_rgba(0,0,0,0.1)]">
        {/* container */}
        <div className="container mx-auto flex flex-col py-10">
          {/* text */}
          <div className="flex flex-col justify-center items-center mb-3">
            <p
              className="font-sans mb-1 text-[#1F5C54] font-bold uppercase text-sm tracking-wider"
              style={{ wordSpacing: "0.1em", letterSpacing: "0.1rem" }}
            >
              Our Clients
            </p>
            <img src="/images/serviceIcon.png" alt="service icon" />
          </div>
          {/* logo slider */}
          <div className="flex justify-center items-center mx-4 w-full max-w-screen">
            <Slider {...settings} className="w-full">
              <div className="slider-image w-32 lg:w-56 h-10 lg:h-16 flex justify-center items-center">
                <img
                  src="/images/iide-logo.svg"
                  alt="iide"
                  className="w-full max-h-full"
                />
              </div>
              <div className="slider-image w-24 h-10">
                <img
                  src="/images/credilio-svg-logo.svg"
                  alt="credilio"
                  className="w-full max-h-full"
                />
              </div>
              <div className="slider-image w-32 lg:w-56 h-10 lg:h-16  flex justify-center items-center">
                <img
                  src="/images/tripjack-logo.png"
                  alt="tripjack"
                  className="w-full max-h-full"
                />
              </div>
              <div className="slider-image w-24 lg:w-32 h-12 lg:h-[70px] flex justify-center items-center px-5">
                <img
                  src="/images/bajaj-electricals-logo.jpg"
                  alt="bajaj"
                  className="w-full max-h-full"
                />
              </div>
              <div className="slider-image w-24 lg:w-28 h-12 lg:h-16 flex justify-center items-center px-5">
                <img
                  src="/logo/logo.png"
                  alt="Workved Interiors"
                  className="w-full max-h-full"
                />
              </div>
            </Slider>
          </div>
        </div>
      </section>

      {/* section6 */}
      {/* <section className="bg-gradient-to-t from-[#f4f4f4] via-[#f4f4f4] to-[#D0D0D0] "> */}
      <section className=" bg-[#F4F4F4] hidden lg:block">
        <div className="container mx-auto flex justify-around items-center py-10 ">
          <div>
            {/* <div className="w-[350px] h-[520.78px] px-[30px] py-[37px] bg-[#1f5c54] rounded-tr-[200px] rounded-bl-[200px] rounded-br-[200px] flex-col justify-start items-center gap-[18px] inline-flex "> */}
            <div className="relative top-20 left-[290px]">
              <img
                src="/images/home/testimonalicon1.png"
                alt="testimonalicon"
              />
            </div>
            <div className="w-[350px] h-[500px] px-[30px] top-[-40px] py-[37px] bg-[#1f5c54] rounded-tr-[200px] rounded-bl-[200px] rounded-br-[200px] flex-col justify-start items-center gap-[18px] inline-flex relative z-10">
              <div className="h-[255px] flex items-center justify-center px-2">
                {/* <div className="w-[300px] h-[255px] left-[-5px] top-0 absolute text-center text-white text-[15px] font-normal font-['Lora'] leading-normal" */}
                <p className="mt-10 text-justify text-white text-sm font-['Lora'] leading-normal">
                  Workved Interiors transformed our office into a space that
                  perfectly blends functionality with modern aesthetics. Their
                  team understood our requirements and executed the project
                  seamlessly, ensuring a workspace that enhances productivity
                  and employee well-being. The attention to detail and quality
                  craftsmanship truly set them apart!
                </p>
              </div>
              <img
                className="w-[100px] h-[100px] relative rounded-[100px] border border-[#1a3a36]"
                src="/images/testimonalreview1.png"
                alt="testimonal person "
              />
              <div className="self-stretch h-[18.89px] text-center text-white text-sm font-bold font-['DM Sans'] uppercase leading-[29.60px] tracking-[3.52px]">
                Hussain
              </div>
              <div className="self-stretch h-[18.89px] text-center text-[#33bead] text-sm font-bold font-['DM Sans'] uppercase leading-[29.60px] tracking-[3.52px]">
                Director, Tripjack
              </div>
            </div>
          </div>
          {/* second div */}
          {/* <div className="w-[350px] h-[525px] p-[30px] bg-white rounded-tl-[200px] rounded-tr-[200px] rounded-bl-[200px] border border-[#33bead] flex-col justify-start items-center gap-[18px] inline-flex"> */}
          <div className="w-[350px] h-[500px] p-[30px] bg-white rounded-tl-[200px] rounded-tr-[200px] rounded-bl-[200px] border border-[#33bead] flex-col justify-start items-center gap-[18px] inline-flex">
            <div className="h-[255px] flex items-center justify-center">
              {/* <div className="w-[300px] h-[255px] left-[-5px] top-0 absolute text-center text-[#141515] text-[15px] font-normal font-['Lora'] leading-normal"> */}
              <div className="text-justify mt-10 text-[#141515] text-sm font-normal font-['Lora'] leading-normal">
                Workved Interiors has played a key role in shaping our coworking
                spaces into inspiring and productive environments. Their ability
                to design offices that are both stylish and highly functional
                has been a game-changer for our members. Their expertise,
                professionalism, and commitment to delivering excellence make
                them a trusted partner in workspace design.
              </div>
            </div>
            <img
              className="w-[100px] h-[100px] relative rounded-[100px] border border-[#1a3a36]"
              src="/images/testimonalreview2.png"
              alt="testimonal person "
            />
            <div className="self-stretch h-[18.89px] text-center text-[#1a3a36] text-sm font-bold font-['DM Sans'] uppercase leading-[29.60px] tracking-[3.52px]">
              Kunal Kataria
            </div>
            <div className="self-stretch h-[18.89px] text-center text-[#33bead] text-sm font-bold font-['DM Sans'] uppercase leading-[29.60px] tracking-[3.52px]">
              Founder, 603 CWS
            </div>
          </div>

          {/* div 3 */}
          {/* <div className="w-[350px] h-[520.78px] px-[30px] py-[37px] bg-[#1f5c54] rounded-tl-[200px] rounded-bl-[200px] rounded-br-[200px] flex-col justify-start items-center gap-[18px] inline-flex"> */}
          <div className="w-[350px] h-[500px] px-[30px]  py-[37px] bg-[#1f5c54] rounded-tl-[200px] rounded-bl-[200px] rounded-br-[200px] flex-col justify-start items-center gap-[18px] inline-flex relative">
            <div className="h-[255px] flex items-center justify-center">
              {/* <div className="w-[300px] h-[255px] left-[-5px] top-0 absolute text-center text-white text-[15px] font-normal font-['Lora'] leading-normal"> */}
              <div className="text-justify mt-10 text-white text-sm font-normal font-['Lora'] leading-normal">
                The team at Workved Interiors understood our brand vision and
                delivered an office space that enhances collaboration,
                creativity, and efficiency. They were meticulous in their
                planning and execution, ensuring that every element from layout
                to furnishings was aligned with our needs. Working with them was
                a smooth and rewarding experience!
              </div>
            </div>
            <img
              className="w-[100px] h-[100px] relative rounded-[100px] border border-[#1a3a36]"
              src="/images/testimonalreview3.png"
              alt="testimonal person "
            />
            <div className="self-stretch h-[18.89px] text-center text-white text-sm font-bold font-['DM Sans'] uppercase leading-[29.60px] tracking-[3.52px]">
              Aditya
            </div>
            <div className="self-stretch h-[18.89px] text-center text-[#33bead] text-sm font-bold font-['DM Sans'] uppercase leading-[29.60px] tracking-[3.52px]">
              CEO, Credilio
            </div>
            <div className="absolute right-[-20px] bottom-0">
              <img
                src="/images/home/testimonalicon2.png"
                alt="testimonalicon"
              />
            </div>
          </div>
        </div>
      </section>

      {/* testimonal for mobile */}
      <section className=" bg-[#F4F4F4]  md:hidden">
        {/* <div>
          <div className="max-w-sm mx-10  rounded-3xl bg-[#1f5c54]  flex-col justify-start items-center gap-[18px] inline-flex relative z-10">
            <div className=" flex items-center justify-center px-2">
              <p className="mt-10 text-justify text-white text-sm ">
                Workved Interiors transformed our office into a space that
                perfectly blends functionality with modern aesthetics. Their
                team understood our requirements and executed the project
                seamlessly, ensuring a workspace that enhances productivity and
                employee well-being. The attention to detail and quality
                craftsmanship truly set them apart!
              </p>
            </div>
            <img
              className="w-[100px] h-[100px] relative rounded-[100px] border border-[#1a3a36]"
              src="/images/testimonalreview1.png"
              alt="testimonal person "
            />
            <div className="  text-center text-white text-sm font-bold  uppercase leading-[29.60px] tracking-[3.52px]">
              Hussain
            </div>
            <div className="mb-3 text-center text-[#33bead] text-sm font-bold  uppercase leading-[29.60px] tracking-[3.52px]">
              Director, Tripjack
            </div>
          </div>
        </div> */}
        <h2 className="text-center font-bold text-3xl my-3 uppercase text-[#1F5C54]">
          Hear from our Clients{" "}
        </h2>

        {/* slider for images */}
        <Swiper
          effect={"coverflow"}
          grabCursor={true}
          centeredSlides={true}
          loop={true}
          slidesPerView={"auto"} // Ensures 5 slides are visible
          spaceBetween={30} // Adds spacing between slides
          initialSlide={3}
          coverflowEffect={{
            rotate: 35,
            stretch: 0,
            depth: 100,
            modifier: 0.8,
          }}
          autoplay={{
            delay: 1500, // 1.5 seconds per slide
            disableOnInteraction: false, // Keeps autoplay even after user interaction
          }}
          // pagination={{ el: ".swiper-pagination", clickable: true }}
          navigation={{
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
            clickable: true,
          }}
          modules={[EffectCoverflow, Pagination, Navigation, Autoplay]}
          className="h-[70vh] max-w-screen overflow-x-hidden"
        >
          <SwiperSlide>
            <MobileTestimonal
              message={` Workved Interiors transformed our office into a space that
                  perfectly blends functionality with modern aesthetics. Their
                  team understood our requirements and executed the project
                  seamlessly, ensuring a workspace that enhances productivity
                  and employee well-being. The attention to detail and quality
                  craftsmanship truly set them apart!`}
              name={` Hussain`}
              userprofile={`testimonalreview1`}
              companyname={`Director, Tripjack`}
            />
          </SwiperSlide>
          <SwiperSlide>
            <MobileTestimonal
              message={`Workved Interiors has played a key role in shaping our coworking
                spaces into inspiring and productive environments. Their ability
                to design offices that are both stylish and highly functional
                has been a game-changer for our members. Their expertise,
                professionalism, and commitment to delivering excellence make
                them a trusted partner in workspace design.`}
              name={`Kunal Kataria`}
              userprofile={`testimonalreview2`}
              companyname={`Founder, 603 CWS`}
            />
          </SwiperSlide>
          <SwiperSlide>
            <MobileTestimonal
              message={`The team at Workved Interiors understood our brand vision and
                delivered an office space that enhances collaboration,
                creativity, and efficiency. They were meticulous in their
                planning and execution, ensuring that every element from layout
                to furnishings was aligned with our needs. Working with them was
                a smooth and rewarding experience!`}
              name={`Aditya`}
              userprofile={`testimonalreview3`}
              companyname={`CEO, Credilio`}
            />
          </SwiperSlide>
          {/* <SwiperSlide>
            <div className="max-w-sm  rounded-3xl bg-[#1f5c54]  flex-col justify-start items-center gap-[18px] inline-flex relative z-10">
              <div className=" flex items-center justify-center px-2">
                <p className="mt-10 text-justify text-white text-sm ">
                  Workved Interiors transformed our office into a space that
                  perfectly blends functionality with modern aesthetics. Their
                  team understood our requirements and executed the project
                  seamlessly, ensuring a workspace that enhances productivity
                  and employee well-being. The attention to detail and quality
                  craftsmanship truly set them apart!
                </p>
              </div>
              <div>
                <img
                  className="w-[100px] h-[100px] relative rounded-[100px] border border-[#1a3a36]"
                  src="/images/testimonalreview1.png"
                  alt="testimonal person "
                />
              </div>
              <div className="  text-center text-white text-sm font-bold  uppercase leading-[29.60px] tracking-[3.52px]">
                Hussain
              </div>
              <div className="mb-3 text-center text-[#33bead] text-sm font-bold  uppercase leading-[29.60px] tracking-[3.52px]">
                Director, Tripjack
              </div>
            </div>
          </SwiperSlide> */}
        </Swiper>
      </section>

      {/* section FAQ */}
      {/* <section className="bg-gradient-to-t from-[#f4f4f4] via-[#f4f4f4] to-[#D0D0D0]"> */}
      <section className="py-10 bg-[#F4F4F4] ">
        {/* container */}
        <div className="lg:container mx-auto flex px-1">
          {/* a div for image */}
          <div className="flex-1 hidden lg:block">
            <img
              src="/images/home/sectionFAQ.png"
              alt="FAQ Section"
              className=""
            />
          </div>
          {/* div for Faq */}
          <div className="flex-1 lg:border-2 border-[#CCCCCC] rounded-3xl lg:p-10">
            <h2 className="font-bold font-Poppins text-xl lg:text-3xl text-center my-10">
              Frequently Asked Questions
            </h2>
            <div className="flex flex-col m-auto">
              {accordionItems.map((item, index) => (
                // <div key={index} className="border-b last:border-b-0">
                <div
                  key={index}
                  className="mb-3 text-[#141515] font-Poppins font-medium"
                >
                  <div
                    className="flex w-full text-left p-4 border-2 hover:bg-gray-200 focus:outline-none justify-between cursor-pointer rounded-xl text-xs "
                    onClick={() => handleToggle(index)}
                  >
                    <button
                    // className="w-full text-left p-4 bg-gray-100 hover:bg-gray-200 focus:outline-none"
                    // className="w-full text-left p-4 "
                    // onClick={() => handleToggle(index)}
                    >
                      {item.title}
                    </button>
                    {expandedIndex === index ? <FaAngleUp /> : <FaAngleDown />}
                  </div>
                  {expandedIndex === index && (
                    <div className="p-4 bg-white border-t rounded-xl text-xs">
                      <p>{item.content}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default Landing;
